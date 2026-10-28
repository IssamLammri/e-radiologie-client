import express from "express";
import path from "path";
import { createServer } from "node:http";
import dotenv from "dotenv";
import { GoogleGenAI, Type } from "@google/genai";
import { createServer as createViteServer } from "vite";

// Load environment variables
dotenv.config({ path: [".env.local", ".env"] });

const app = express();
const PORT = 3000;

app.use(express.json());

// Initialize Gemini Client safely (lazy initialization)
let aiClient: GoogleGenAI | null = null;
function getGeminiClient(): GoogleGenAI {
  if (!aiClient) {
    const key = process.env.GEMINI_API_KEY;
    if (!key) {
      throw new Error("GEMINI_API_KEY holds no value or is missing.");
    }
    aiClient = new GoogleGenAI({
      apiKey: key,
      httpOptions: {
        headers: {
          "User-Agent": "aistudio-build",
        },
      },
    });
  }
  return aiClient;
}

// Normalized French string matching for high-fidelity fallback grading
function normalizeText(text: string): string {
  return text
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "") // strip accents
    .replace(/[^cdlmnrstvxz\s\w]/g, " ") // remove punctuation except relevant letters
    .replace(/\b(le|la|les|l|un|une|du|de|des|d|au|aux|en)\b/g, "") // strip common articles
    .replace(/\s+/g, " ")
    .trim();
}

// Levenshtein distance for fallback typo detection
function getLevenshteinDistance(a: string, b: string): number {
  const tmp: number[][] = [];
  for (let i = 0; i <= a.length; i++) {
    tmp[i] = [i];
  }
  for (let j = 0; j <= b.length; j++) {
    tmp[0][j] = j;
  }
  for (let i = 1; i <= a.length; i++) {
    for (let j = 1; j <= b.length; j++) {
      tmp[i][j] = Math.min(
        tmp[i - 1][j] + 1,
        tmp[i][j - 1] + 1,
        tmp[i - 1][j - 1] + (a[i - 1] === b[j - 1] ? 0 : 1)
      );
    }
  }
  return tmp[a.length][b.length];
}

// Static synonyms dictionary for top-tier offline grading
const SYNONYMS_MAP: Record<string, string[]> = {
  "trachea": ["trachee", "conduit aerien"],
  "aortic-knob": ["crosse aortique", "bouton aortique", "crosse de l aorte", "aorte", "arcus aortae"],
  "heart-silhouette": ["silhouette cardiaque", "coeur", "cardiac", "heart", "shadow cardiaque", "opacite cardiaque"],
  "costophrenic-angle-l": ["cul de sac costo diaphragmatique gauche", "sinus costo diaphragmatique gauche", "angle costophrenique gauche", "recessus costodiaphragmaticus sinister"],
  "costophrenic-angle-r": ["cul de sac costo diaphragmatique droit", "sinus costo diaphragmatique droit", "angle costophrenique droit", "recessus costodiaphragmaticus dexter"],
  "diaphragm-r": ["coupole diaphragmatique droite", "diaphragme droit", "coupole droite", "diaphragme", "hemidiaphragme droit"],
  "pulmonary-apex-l": ["apex pulmonaire gauche", "sommet pulmonaire gauche", "apex gauche", "sommet gauche", "apex pulmonis sinister"],
  "lateral-ventricle-l": ["corne anterieure du ventricule lateral gauche", "ventricule lateral gauche", "corne frontale ventricule gauche", "ventricule gauche", "corne anterieure gauche", "ventriculus lateralis sinister"],
  "lateral-ventricle-r": ["corne anterieure du ventricule lateral droit", "ventricule lateral droit", "corne frontale ventricule droit", "ventricule droit", "corne anterieure droite", "ventriculus lateralis dexter"],
  "caudate-nucleus-r": ["tete du noyau caude droit", "noyau caude droit", "caude droit", "caude", "noyau caude", "caput nuclei caudati"],
  "internal-capsule-l": ["bras posterieur de la capsule interne gauche", "capsule interne gauche", "bras posterieur capsule interne", "capsule interne", "capsula interna"],
  "thalamus-l": ["thalamus gauche", "thalamus", "thalamus sinister"],
  "brain-midline": ["ligne mediane", "troisieme ventricule", "3eme ventricule", "3e ventricule", "ventricule trois", "ventriculus tertius"],
  "patella": ["rotule", "patella", "la rotule"],
  "acl": ["ligament croise anterieur", "lca", "acl", "croise anterieur", "ligamentum cruciatum anterius"],
  "pcl": ["ligament croise posterieur", "lcp", "pcl", "croise posterieur", "ligamentum cruciatum posterius"],
  "patellar-tendon": ["tendon rotulien", "ligament rotulien", "tendon patellaire", "ligamentum patellae"],
  "femur": ["femur", "condyle femoral", "condyle du femur", "le femur"],
  "tibia": ["tibia", "epiphyse tibiale", "plateau tibial", "le tibia"]
};

// Local heuristic grading fallback
function gradeWithLocalFallback(userAnswer: string, hotspotId: string, frenchName: string): { score: number; explanation: string } {
  const normUser = normalizeText(userAnswer);
  if (!normUser) {
    return {
      score: 0,
      explanation: `Pas de réponse fournie. La structure correcte est : "${frenchName}".`
    };
  }

  const normFrench = normalizeText(frenchName);
  
  // Exact match after normalization
  if (normUser === normFrench) {
    return {
      score: 5,
      explanation: `Excellent ! Réponse exacte : "${frenchName}". Vous marquez 5/5 points.`
    };
  }

  // Synonym direct check
  const synonyms = SYNONYMS_MAP[hotspotId] || [];
  for (const syn of synonyms) {
    if (normalizeText(syn) === normUser) {
      return {
        score: 5,
        explanation: `Excellent ! "${userAnswer}" est un synonyme parfaitement accepté pour "${frenchName}". Vous marquez 5/5 points.`
      };
    }
  }

  // Substring or overlap checks
  const containsUser = normFrench.includes(normUser) || synonyms.some(syn => normalizeText(syn).includes(normUser));
  const containsTarget = normUser.includes(normFrench) || synonyms.some(syn => normUser.includes(normalizeText(syn)));

  if (containsUser || containsTarget) {
    // If user's answer is quite substantial and matches a core piece
    if (normUser.length >= 4) {
      return {
        score: 4,
        explanation: `Très bien ! Votre réponse "${userAnswer}" est extrêmement proche de "${frenchName}". Vous obtenez 4/5 points.`
      };
    }
  }

  // Typo checking using Levenshtein distance
  const distance = getLevenshteinDistance(normUser, normFrench);
  if (distance <= 2) {
    return {
      score: 4,
      explanation: `Bien ! "${userAnswer}" présente une légère variation par rapport à "${frenchName}". Accordé à 4/5 points.`
    };
  }

  // Look for partial matches (word-by-word)
  const userWords = normUser.split(" ").filter(w => w.length > 2);
  const targetWords = normFrench.split(" ").filter(w => w.length > 2);
  let matchedWords = 0;
  for (const uw of userWords) {
    if (targetWords.includes(uw) || synonyms.some(syn => normalizeText(syn).includes(uw))) {
      matchedWords++;
    }
  }

  if (matchedWords > 0) {
    const score = Math.max(1, Math.min(3, Math.round((matchedWords / Math.max(userWords.length, targetWords.length)) * 5)));
    return {
      score,
      explanation: `Partiellement correct. Vous avez identifié certains composants de "${frenchName}". Vous marquez ${score}/5 points.`
    };
  }

  return {
    score: 0,
    explanation: `Pas tout à fait. Votre réponse "${userAnswer}" ne correspond pas à la structure attendue : "${frenchName}".`
  };
}

// AI-Assisted Medical Case Description Draft feedback (en phrases courtes)
app.post("/api/evaluate-case-draft", async (req, res) => {
  const { userDraft, caseTitle, expertDescription } = req.body;

  if (!userDraft || !expertDescription) {
    return res.status(400).json({ error: "Missing required fields: userDraft, expertDescription" });
  }

  try {
    const ai = getGeminiClient();
    const prompt = `Vous êtes un expert radiologue enseignant.
Un étudiant tente de décrire l'imagerie d'un cas clinique de "${caseTitle || 'radiologie'}".
Voici la description de référence (rédigée par l'expert / enseignant) :
"${expertDescription}"

Voici ce que l'étudiant a rédigé :
"${userDraft}"

Tâche :
1. Évaluez la clarté et la pertinence sémiologique du brouillon de l'étudiant par rapport au cas clinique de référence.
2. Formulez des remarques constructives en français, sous forme de courtes phrases encourageantes et ciblées pour l'aider à s'améliorer.
3. Donnez une version améliorée en phrases courtes, claires et structurées basée sur sa tentative tout en assurant l'exactitude scientifique.

Générez impérativement votre réponse sous la forme d'un objet JSON strict valide sans texte superflu autour. Le schéma attendu de l'objet est :
{
  "feedback": "Remarques constructives globales et points d'attention (par exemple s'ils ont manqué des signes clés ou commis des contre-sens).",
  "suggestions": [
     "Suggestion d'amélioration 1 ou point d'analyse sémiologique à privilégier...",
     "Suggestion d'amélioration 2..."
  ],
  "improvedDraft": "Une version reformulée idéale inspirée des phrases courtes pour rédactions claires."
}`;

    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          required: ["feedback", "suggestions", "improvedDraft"],
          properties: {
            feedback: { type: Type.STRING },
            suggestions: {
              type: Type.ARRAY,
              items: { type: Type.STRING }
            },
            improvedDraft: { type: Type.STRING }
          }
        }
      }
    });

    const responseText = response.text || "{}";
    const result = JSON.parse(responseText.trim());
    return res.json(result);

  } catch (error: any) {
    console.warn("Gemini API error for case draft. Falling back to rule-based assistance.", error.message);
    
    // Heuristic fallback helper for clean local simulation
    const feedback = "Bien reçu ! Votre description contient des éléments intéressants. Pour optimiser votre compte-rendu, veillez à utiliser un vocabulaire sémiologique rigoureux (densités, hypersignaux/hyposignaux, contours, rapports de voisinage).";
    
    const suggestions = [
      "Assurez-vous de bien spécifier la modalité (ex: opacités alvéolaires au scanner, hyperéchogène à l'échographie).",
      "Structurez votre compte-rendu : d'abord localiser la lésion, puis décrire ses contours et sa texture, et enfin ses rapports vasculaires ou tissulaires."
    ];
    
    const words = userDraft.split(/\s+/).length;
    let improvedDraft = userDraft;
    if (words < 10) {
      improvedDraft = `Présence d'anomalies de signal ou de densité concordantes avec la clinique. Les contours restent à préciser par injection de produit de contraste ainsi que son extension locale.`;
    } else {
      improvedDraft = `${userDraft} En phrases courtes : Lésion bien circonscrite. Rehaussement d'allure hétérogène après opacification. Absence d'envahissement des structures nobles adjacentes.`;
    }

    return res.json({
      feedback,
      suggestions,
      improvedDraft,
      isFallback: true
    });
  }
});

// Grading API using Gemini Flash (with dynamic local fallback)
app.post("/api/grade-anatomy", async (req, res) => {
  const { userAnswer, hotspotId, frenchName, latinName, description, tips } = req.body;

  if (!userAnswer || !hotspotId || !frenchName) {
    return res.status(400).json({ error: "Missing required fields" });
  }

  try {
    // Attempt Gemini evaluation
    const ai = getGeminiClient();
    
    const prompt = `Vous êtes un professeur de neuroradiologie et imagerie médicale de garde.
Évaluez la réponse ouverte courte d'un étudiant en médecine dans un quiz de radio-anatomie.

Structure correcte attendue :
- Nom en français : "${frenchName}"
- Nom latin / scientifique : "${latinName || "N/A"}"
- Description anatomique : "${description || ""}"
- Astuces cliniques : "${tips || ""}"

Réponse saisie par l'étudiant : "${userAnswer}"

Attribuez un barème de points sur 5 points (un entier de 0 à 5) selon les critères stricts suivants :
- 5/5 : Réponse parfaitement exacte, ou synonyme valide (ex: acceptation de "crosse de l'aorte" pour "Bouton aortique", "LCA" pour "Ligament Croisé Antérieur"). Soyez indulgent sur l'absence de majuscules ou de déterminants.
- 4/5 : Réponse très proche contenant une faute de frappe mineure d'orthographe (ex: "traché" au lieu de "trachée") ou réponse correcte omettant un détail mineur clinique.
- 2/5 ou 3/5 : Réponse partiellement exacte (ex: l'étudiant mentionne "ventricule" ou "ventricule latéral" mais oublie "gauche" ou "corne antérieure", ou "croisé" sans spécifier si antérieur ou postérieur).
- 1/5 : Réponse contenant un petit élément d'imagerie clinique correct mais très imprécis.
- 0/5 : Réponse fausse, hors contexte, vide ou farfelue.

Générez impérativement votre réponse sous la forme d'un objet JSON strict valide sans texte superflu autour. Le schéma attendu de l'objet est :
{
  "score": number (de 0 à 5),
  "explanation": "Votre retour fluide motivant et clinique, entièrement en français. Expliquez brièvement le barème, justifiez la note attribuée selon les synonymes possibles, et donnez la réponse idéale si l'étudiant a échoué."
}`;

    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          required: ["score", "explanation"],
          properties: {
            score: {
              type: Type.INTEGER,
              description: "The grade score from 0 to 5 for the student response",
            },
            explanation: {
              type: Type.STRING,
              description: "Constructive assessment feedback in French language",
            },
          },
        },
      },
    });

    const responseText = response.text || "{}";
    const gradingResult = JSON.parse(responseText.trim());
    return res.json(gradingResult);

  } catch (error: any) {
    console.warn("Gemini API error or missing token. Falling back to local heuristic grader.", error.message);
    const fallbackResult = gradeWithLocalFallback(userAnswer, hotspotId, frenchName);
    return res.json({
      ...fallbackResult,
      isFallback: true
    });
  }
});

// Setup Vite & Server runtime
async function startServer() {
  const server = createServer(app);
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: {
        middlewareMode: true,
        hmr: process.env.DISABLE_HMR === "true" ? false : { server },
      },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  server.listen(PORT, "0.0.0.0", () => {
    console.log(`[PACS Station Server] running securely on http://localhost:${PORT}`);
  });
}

startServer();
