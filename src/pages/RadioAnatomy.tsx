import { useState, useEffect } from 'react';
import { 
  Brain, FileText, Compass, Award, Star, CheckCircle, 
  XSquare, RefreshCw, Trophy, Info, Eye, Sparkles, AlertCircle 
} from 'lucide-react';
import { Badge } from '../components/ui/Badge';
import { Button } from '../components/ui/Button';
import { Card, CardContent } from '../components/ui/Card';

interface AnatomicHotspot {
  id: string;
  name: string;
  frenchName: string;
  latinName?: string;
  description: string;
  tips: string; // Clinical variant or tip for residents
  svgElement: 'rect' | 'circle' | 'polygon' | 'path';
  coordinates: any; // specific coords for SVG overlay
}

interface AnatomyModality {
  id: string;
  title: string;
  imageUrl?: string;
  modalityType: 'Radiographie' | 'TDM' | 'IRM';
  subtitle: string;
  summary: string;
  hotspots: AnatomicHotspot[];
}

const anatomyData: AnatomyModality[] = [
  {
    id: 'chest-xray',
    title: 'Radiographie du Thorax (Face)',
    modalityType: 'Radiographie',
    subtitle: 'La base absolue de l\'interprétation en imagerie médicale de projection.',
    summary: 'La radiographie pulmonaire de face s\'analyse selon une approche rigoureuse : de dehors en dedans (contenant osseux, plèvre, parenchyme) et des lignes médiastinales.',
    hotspots: [
      {
        id: 'trachea',
        name: 'Trachea',
        frenchName: 'Trachée',
        latinName: 'Trachea',
        description: 'Structure tubulaire médiane claire (contenant de l\'air), s\'étendant de la région cervicale jusqu\'à la bifurcation trachéale (carène) en regard de la 4ème ou 5ème vertèbre thoracique.',
        tips: 'Une déviation de la trachée par rapport à la ligne médiane peut indiquer un processus expansif unilatéral (pleurésie massive, pneumothorax hypertensif) ou un effet d\'attraction (atélectasie lobaire).',
        svgElement: 'rect',
        coordinates: { x: 185, y: 30, width: 30, height: 90, rx: 6 }
      },
      {
        id: 'aortic-knob',
        name: 'Aortic Knob',
        frenchName: 'Bouton aortique / Crosse de l\'aorte',
        latinName: 'Arcus aortae',
        description: 'Saillie convexe régulière du bord supérieur gauche du médiastin, correspondant à la partie postérieure de la crosse aortique.',
        tips: 'Un élargissement ou un aspect calcifié de la crosse est fréquent chez le patient hypertendu ou âgé. Une disparition du bouton aortique peut être le signe d\'une dissection aortique ou d\'un syndrome tumoral médiastinal.',
        svgElement: 'circle',
        coordinates: { cx: 228, cy: 153, r: 18 }
      },
      {
        id: 'heart-silhouette',
        name: 'Cardiac Silhouette',
        frenchName: 'Silhouette Cardiaque',
        latinName: 'Cor',
        description: 'Opacité centrale piriforme débordant aux deux tiers sur l\'hémichamp pulmonaire gauche. Le rapport du plus grand diamètre cardiaque sur le plus grand diamètre thoracique interne (index cardio-thoracique) doit être inférieur à 0,5.',
        tips: 'Un index cardio-thoracique (ICT) > 0.5 signe une cardiomégalie (insuffisance cardiaque, cardiopathie). Chez le sujet âgé en expiration, l\'ICT peut paraître faussement augmenté.',
        svgElement: 'path',
        coordinates: { d: 'M160,170 C145,190 145,220 160,240 C175,250 210,255 240,248 C275,240 270,180 232,166 C215,160 180,165 160,170 Z' }
      },
      {
        id: 'costophrenic-angle-l',
        name: 'Left Costophrenic Angle',
        frenchName: 'Cul-de-sac costo-diaphragmatique gauche',
        latinName: 'Recessus costodiaphragmaticus sinister',
        description: 'Point le plus bas de la cavité pleurale gauche où la plèvre costale réfléchit sur la plèvre diaphragmatique. Normalement aigu, libre et bien visible.',
        tips: 'Un émoussement ou comblement de ce cul-de-sac est le premier signe radiologique d\'un épanchement pleural liquide (pleurésie), visible dès 75-100 mL de liquide en décubitus debout.',
        svgElement: 'polygon',
        coordinates: { points: '272,250 295,270 290,290 262,260' }
      },
      {
        id: 'costophrenic-angle-r',
        name: 'Right Costophrenic Angle',
        frenchName: 'Cul-de-sac costo-diaphragmatique droit',
        latinName: 'Recessus costodiaphragmaticus dexter',
        description: 'Angle pleural latéral droit, aigu et translucide.',
        tips: 'Comparez toujours les deux côtés. Un comblement isolé peut être secondaire à une séquelle de pleurésie ancienne s\'il est associé à une ligne d\'adhérence.',
        svgElement: 'polygon',
        coordinates: { points: '128,250 105,270 110,290 138,260' }
      },
      {
        id: 'diaphragm-r',
        name: 'Right Diaphragmatic Dome',
        frenchName: 'Coupole diaphragmatique droite',
        latinName: 'Hemidiaphragma dextrum',
        description: 'Muscle séparant le thorax de l\'abdomen. La coupole droite est physiologiquement légèrement plus haute que la gauche à cause du volume hépatique sous-jacent (environ un espace intercostal d\'écart).',
        tips: 'La présence d\'un liseré gazeux noir sous-diaphragmatique (croissant gazeux) traduit un pneumopéritoine (perforation viscérale creuse), nécessitant une prise en charge chirurgicale urgente.',
        svgElement: 'path',
        coordinates: { d: 'M100,265 Q135,225 170,250' }
      },
      {
        id: 'pulmonary-apex-l',
        name: 'Left Lung Apex',
        frenchName: 'Apex pulmonaire gauche / Sommet pulmonaire',
        latinName: 'Apex pulmonis sinister',
        description: 'Partie la plus supérieure du parenchyme pulmonaire s\'élevant au-dessus de la première côte antérieure.',
        tips: 'Zone de suspicion majeure de la tuberculose pulmonaire ou de lésions secondaires (nodules). Attention aux superpositions de la première côte qui masquent fréquemment des petits cancers débutants (syndrome de Pancoast-Tobias).',
        svgElement: 'circle',
        coordinates: { cx: 250, cy: 90, r: 25 }
      }
    ]
  },
  {
    id: 'brain-ct',
    title: 'TDM Cérébral (Coupe Axiale)',
    modalityType: 'TDM',
    subtitle: 'Analyse anatomique rapide et précise en urgence.',
    summary: 'Le scanner cérébral sans injection constitue l\'examen clé face à un déficit neurologique aigu, une céphalée brutale ou un traumatisme crânien.',
    hotspots: [
      {
        id: 'lateral-ventricle-l',
        name: 'Left Lateral Ventricle',
        frenchName: 'Corne antérieure du ventricule latéral gauche',
        latinName: 'Ventriculus lateralis sinister',
        description: 'Cavité contenant le liquide cérébro-spinal (LCS), apparaissant physiologiquement hypodense (noir uniforme) par rapport au parenchyme de part et d\'autre de la ligne médiane.',
        tips: 'Une compression ou asymétrie des cornes ventriculaires indique un processus expansif homolatéral (effet de masse). Une dilatation globale évoque une hydrocéphalie.',
        svgElement: 'path',
        coordinates: { d: 'M205,160 Q215,145 220,185 Q212,192 205,160' }
      },
      {
        id: 'lateral-ventricle-r',
        name: 'Right Lateral Ventricle',
        frenchName: 'Corne antérieure du ventricule latéral droit',
        latinName: 'Ventriculus lateralis dexter',
        description: 'Corne ventriculaire droite symétrique de la gauche, noire et bordée par la tête du noyau caudé.',
        tips: 'Recherchez une asymétrie fine. Un saignement ventriculaire (inondation ventriculaire) se traduira par un niveau fluide-fluide ou un sédiment hyperdense en zone déclive (postérieure).',
        svgElement: 'path',
        coordinates: { d: 'M195,160 Q185,145 180,185 Q188,192 195,160' }
      },
      {
        id: 'caudate-nucleus-r',
        name: 'Right Caudate Nucleus (Head)',
        frenchName: 'Tête du noyau caudé droit',
        latinName: 'Caput nuclei caudati',
        description: 'Structure bilatérale de substance grise profonde (noyau gris central) bombant dans le bord externe de la corne antérieure du ventricule latéral.',
        tips: 'Le noyau caudé est vascularisé par les artères lenticulostriées. Une perte de différenciation de son contour ou une hypodensité franche évoque une ischémie aiguë (infarctus sylvien profond).',
        svgElement: 'circle',
        coordinates: { cx: 172, cy: 168, r: 12 }
      },
      {
        id: 'internal-capsule-l',
        name: 'Left Internal Capsule',
        frenchName: 'Bras postérieur de la capsule interne gauche',
        latinName: 'Capsula interna',
        description: 'Importante voie de passage de substance blanche (faisceau pyramidal moteur principal) située à l\'état normal entre le thalamus en dedans et le noyau lenticulaire en dehors.',
        tips: 'Une lésion ischémique ou lacunaire même millimétrique à ce niveau entraîne une hémiplégie controlatérale motrice pure extrêmement sévère.',
        svgElement: 'path',
        coordinates: { d: 'M212,190 L225,215' }
      },
      {
        id: 'thalamus-l',
        name: 'Left Thalamus',
        frenchName: 'Thalamus gauche',
        latinName: 'Thalamus sinister',
        description: 'Grand noyau de substance grise ovarienne flanquant le troisième ventricule. C\'est le centre d\'intégration sensoriel principal.',
        tips: 'Les infarctus thalamiques sont tributaires des artères perforantes issues de la communicante postérieure ou de P1. Un syndrome de Dejerine-Roussy peut survenir secondairement.',
        svgElement: 'circle',
        coordinates: { cx: 215, cy: 220, r: 15 }
      },
      {
        id: 'brain-midline',
        name: 'Midline / Third Ventricle',
        frenchName: 'Ligne médiane / IIIème Ventricule',
        latinName: 'Ventriculus tertius',
        description: 'Cavité ventriculaire fendant la ligne médiane sagitalement entre les deux thalamus. Surmontée en antérieur par le septum pellucidum.',
        tips: 'En cas d\'hématome extra-dural ou sous-dural compressif, le troisième ventricule est comprimé et la ligne médiane est déviée (hernie sous-falcorielle). Une déviation > 5 mm est un critère chirurgical critique.',
        svgElement: 'rect',
        coordinates: { x: 197, y: 195, width: 6, height: 35, rx: 2 }
      }
    ]
  },
  {
    id: 'knee-mri',
    title: 'IRM du Genou (Coupe Sagittale)',
    modalityType: 'IRM',
    subtitle: 'Analyse d\'excellence des éléments cartilagineux, méniscaux et ligamentaires.',
    summary: 'L\'IRM est l\'examen le plus performant pour le genou traumatique ou dégénératif grâce à son excellent contraste tissulaire fluide/solide.',
    hotspots: [
      {
        id: 'patella',
        name: 'Patella / Kneecap',
        frenchName: 'Rotule / Patella',
        latinName: 'Patella',
        description: 'Os sésamoïde triangulaire situé en regard de l\'extrémité distale fémorale, articulé avec la trochlée.',
        tips: 'Analyser l\'épaisseur du cartilage articulaire rétro-patellaire (hypersignal intermédiaire sur les séquences DP Fat-Sat). Une fissure ou un amincissement indique une chondropathie ou arthrose rétro-patellaire.',
        svgElement: 'circle',
        coordinates: { cx: 275, cy: 110, r: 24 }
      },
      {
        id: 'acl',
        name: 'Anterior Cruciate Ligament',
        frenchName: 'Ligament Croisé Antérieur (LCA)',
        latinName: 'Ligamentum cruciatum anterius',
        description: 'Bande fibreuse tendue obliquement de la face postérieure du condyle fémoral externe au plateau tibial antérieur. Il s\'oppose au tiroir antérieur du tibia.',
        tips: 'Sur une coupe sagittale, le LCA sain est noir de façon homogène, rectiligne et parallèle à la ligne de Blumensaat. S\'il est flou, horizontalisé, ou en hypersignal, suspectez une rupture ligamentaire.',
        svgElement: 'path',
        coordinates: { d: 'M188,145 L222,192' }
      },
      {
        id: 'pcl',
        name: 'Posterior Cruciate Ligament',
        frenchName: 'Ligament Croisé Postérieur (LCP)',
        latinName: 'Ligamentum cruciatum posterius',
        description: 'Ligament robuste tendu de la face latérale du condyle fémoral médial à l\'aire intercondylienne postérieure du tibia. Plus épais et courbé que le LCA.',
        tips: 'Le LCP est rarement rompu sauf choc très violent en "tableau de bord". Sa déformation anormale (aspect "col de cygne") est souvent le témoin indirect d\'un LCA rompu créant une laxité tibiale.',
        svgElement: 'path',
        coordinates: { d: 'M190,140 Q215,148 200,195' }
      },
      {
        id: 'patellar-tendon',
        name: 'Patellar Tendon / Ligament',
        frenchName: 'Tendon Rotulien',
        latinName: 'Ligamentum patellae',
        description: 'Structure fibreuse prolongeant le tendon du quadriceps, s\'insérant de la pointe de la rotule à la tubérosité tibiale antérieure.',
        tips: 'Idéal pour diagnostiquer la tendinite d\'insertion de la pointe de la patella ("Jumper\'s knee"), visible sous forme d\'un épaississement et d\'un discret hypersignal proximal.',
        svgElement: 'path',
        coordinates: { d: 'M270,132 L250,225' }
      },
      {
        id: 'femur',
        name: 'Femur',
        frenchName: 'Fémur (Condyle)',
        latinName: 'Femur',
        description: 'Epiphyse distale fémorale visible avec son tissu spongieux (clair/jaunâtre en T1 d\'origine lipidique).',
        tips: 'Recherchez un œdème osseux réactionnel sous la forme d\'un hyposignal T1 / hypersignal T2 après traumatisme, signant des microlésions des travées osseuses.',
        svgElement: 'circle',
        coordinates: { cx: 175, cy: 90, r: 35 }
      },
      {
        id: 'tibia',
        name: 'Tibia',
        frenchName: 'Tibia (Epiphyse)',
        latinName: 'Tibia',
        description: 'Partie proximale du tibia soutenant les ménisques et recevant l\'insertion des formations croisées.',
        tips: 'En cas de traumatisme en pivot avec suspicion clinique de rupture du LCA, recherchez une contusion osseuse typique située à la partie postéro-externe du plateau tibial (lésion de percussion réciproque).',
        svgElement: 'path',
        coordinates: { d: 'M140,220 L270,220 L250,290 L160,290 Z' }
      }
    ]
  }
];

export function RadioAnatomy() {
  const [selectedModality, setSelectedModality] = useState<AnatomyModality>(anatomyData[0]);
  const [activeTab, setActiveTab] = useState<'exploration' | 'quiz'>('exploration');
  const [hoveredHotspot, setHoveredHotspot] = useState<AnatomicHotspot | null>(null);
  const [selectedHotspot, setSelectedHotspot] = useState<AnatomicHotspot | null>(null);

  // New text-based Quiz States
  const [quizQuestions, setQuizQuestions] = useState<AnatomicHotspot[]>([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState<number>(0);
  const [quizCompleted, setQuizCompleted] = useState<boolean>(false);
  
  const [userTypedAnswer, setUserTypedAnswer] = useState<string>("");
  const [isGrading, setIsGrading] = useState<boolean>(false);
  const [questionScores, setQuestionScores] = useState<number[]>([0, 0, 0, 0, 0]);
  const [userAnswers, setUserAnswers] = useState<string[]>(["", "", "", "", ""]);
  const [questionFeedback, setQuestionFeedback] = useState<string[]>(["", "", "", "", ""]);
  const [submittedAnswers, setSubmittedAnswers] = useState<boolean[]>([false, false, false, false, false]);

  const LOCAL_WORDS_MAP: Record<string, string[]> = {
    "trachea": ["trachee", "conduit aerien", "trachée", "trachea"],
    "aortic-knob": ["crosse aortique", "bouton aortique", "crosse de l'aorte", "aorte", "arcus aortae", "bouton aortique / crosse de l'aorte", "crosse", "aortic knob"],
    "heart-silhouette": ["silhouette cardiaque", "coeur", "cardiac", "heart", "shadow cardiaque", "opacite cardiaque", "coeur silhouette"],
    "costophrenic-angle-l": ["cul-de-sac costo-diaphragmatique gauche", "sinus costo-diaphragmatique gauche", "cul de sac costo diaphragmatique gauche", "angle costophrénique gauche", "recessus costodiaphragmaticus sinister"],
    "costophrenic-angle-r": ["cul-de-sac costo-diaphragmatique droit", "sinus costo-diaphragmatique droit", "cul de sac costo diaphragmatique droit", "angle costophrénique droit", "recessus costodiaphragmaticus dexter"],
    "diaphragm-r": ["coupole diaphragmatique droite", "diaphragme droit", "coupole droite", "diaphragme", "hemidiaphragme droit", "coupole", "cupule droite"],
    "pulmonary-apex-l": ["apex pulmonaire gauche", "sommet pulmonaire gauche", "apex gauche", "sommet gauche", "apex pulmonis sinister"],
    "lateral-ventricle-l": ["corne antérieure du ventricule latéral gauche", "ventricule latéral gauche", "corne frontale ventricule gauche", "ventricule gauche", "corne antérieure gauche", "ventriculus lateralis sinister", "corne anterieure gauche"],
    "lateral-ventricle-r": ["corne antérieure du ventricule latéral droit", "ventricule latéral droit", "corne frontale ventricule droit", "ventricule droit", "corne antérieure droite", "ventriculus lateralis dexter", "corne anterieure droite"],
    "caudate-nucleus-r": ["tête du noyau caudé droit", "noyau caudé droit", "caudé droit", "caudé", "noyau caudé", "caput nuclei caudati", "tete noyau caude"],
    "internal-capsule-l": ["bras postérieur de la capsule interne gauche", "capsule interne gauche", "bras posterieur capsule interne", "capsule interne", "capsula interna"],
    "thalamus-l": ["thalamus gauche", "thalamus", "thalamus sinister"],
    "brain-midline": ["ligne médiane", "troisième ventricule", "3ème ventricule", "3e ventricule", "ventricule trois", "ventriculus tertius", "ligne mediane / iiieme ventricule"],
    "patella": ["rotule", "patella", "la rotule"],
    "acl": ["ligament croisé antérieur", "lca", "acl", "croisé antérieur", "ligamentum cruciatum anterius"],
    "pcl": ["ligament croisé postérieur", "lcp", "pcl", "croisé postérieur", "ligamentum cruciatum posterius"],
    "patellar-tendon": ["tendon rotulien", "ligament rotulien", "tendon patellaire", "ligamentum patellae"],
    "femur": ["fémur", "condyle fémoral", "condyle du fémur", "le fémur", "femur"],
    "tibia": ["tibia", "épiphyse tibiale", "plateau tibial", "le tibia"]
  };

  const clientNormal = (t: string): string => {
    return t.toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/[^a-z0-9\s]/g, " ")
      .replace(/\s+/g, " ")
      .replace(/\b(le|la|les|l|un|une|du|de|des|d|au|aux|en)\b/g, "")
      .trim();
  };

  const localGrade = (typed: string, target: AnatomicHotspot): { score: number; explanation: string } => {
    const normUser = clientNormal(typed);
    if (!normUser) {
      return { score: 0, explanation: `Aucune réponse fournie. La structure correcte était : "${target.frenchName}".` };
    }
    const normTarget = clientNormal(target.frenchName);
    if (normUser === normTarget) {
      return { score: 5, explanation: `Excellent ! Vous avez trouvé exactement : ${target.frenchName}.` };
    }
    const syns = LOCAL_WORDS_MAP[target.id] || [];
    for (const s of syns) {
      if (clientNormal(s) === normUser) {
        return { score: 5, explanation: `Parfait ! "${typed}" est une réponse acceptée pour "${target.frenchName}".` };
      }
    }

    if (normTarget.includes(normUser) || normUser.includes(normTarget)) {
      return { score: 4, explanation: `Très bien ! Votre réponse "${typed}" est très proche de "${target.frenchName}".` };
    }

    const userW = normUser.split(" ").filter(w => w.length > 2);
    const targetW = normTarget.split(" ").filter(w => w.length > 2);
    const intersect = userW.filter(w => targetW.includes(w));
    if (intersect.length > 0) {
      return { score: 3, explanation: `Partiellement correct. Certains termes s'apparentent bien à "${target.frenchName}".` };
    }

    return { score: 0, explanation: `Pas tout à fait. La structure à identifier était : "${target.frenchName}".` };
  };

  // Synchronize dynamic updates on modality change
  useEffect(() => {
    setHoveredHotspot(null);
    setSelectedHotspot(null);
    if (activeTab === 'quiz') {
      initializeQuiz(selectedModality);
    }
  }, [selectedModality, activeTab]);

  const initializeQuiz = (modality: AnatomyModality) => {
    const shuffled = [...modality.hotspots].sort(() => 0.5 - Math.random());
    setQuizQuestions(shuffled.slice(0, 5));
    setCurrentQuestionIndex(0);
    setQuizCompleted(false);
    setUserTypedAnswer("");
    setIsGrading(false);
    setQuestionScores([0, 0, 0, 0, 0]);
    setUserAnswers(["", "", "", "", ""]);
    setQuestionFeedback(["", "", "", "", ""]);
    setSubmittedAnswers([false, false, false, false, false]);
  };

  const handleGradeAnswer = async () => {
    if (quizCompleted || isGrading) return;
    const currentTarget = quizQuestions[currentQuestionIndex];
    if (!currentTarget) return;

    const typedText = userTypedAnswer.trim();
    if (!typedText) {
      return;
    }

    setIsGrading(true);

    try {
      const response = await fetch("/api/grade-anatomy", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userAnswer: typedText,
          hotspotId: currentTarget.id,
          frenchName: currentTarget.frenchName,
          latinName: currentTarget.latinName,
          description: currentTarget.description,
          tips: currentTarget.tips
        }),
      });

      if (!response.ok) {
        throw new Error("API grading connection failed");
      }

      const result = await response.json();
      
      const newScores = [...questionScores];
      newScores[currentQuestionIndex] = typeof result.score === 'number' ? result.score : 0;
      setQuestionScores(newScores);

      const newAnswers = [...userAnswers];
      newAnswers[currentQuestionIndex] = typedText;
      setUserAnswers(newAnswers);

      const newFeedback = [...questionFeedback];
      newFeedback[currentQuestionIndex] = result.explanation || "";
      setQuestionFeedback(newFeedback);

      const newSubmitted = [...submittedAnswers];
      newSubmitted[currentQuestionIndex] = true;
      setSubmittedAnswers(newSubmitted);

    } catch (err) {
      console.warn("Using client-side fallback grading due to error/offline", err);
      const result = localGrade(typedText, currentTarget);
      
      const newScores = [...questionScores];
      newScores[currentQuestionIndex] = result.score;
      setQuestionScores(newScores);

      const newAnswers = [...userAnswers];
      newAnswers[currentQuestionIndex] = typedText;
      setUserAnswers(newAnswers);

      const newFeedback = [...questionFeedback];
      newFeedback[currentQuestionIndex] = result.explanation;
      setQuestionFeedback(newFeedback);

      const newSubmitted = [...submittedAnswers];
      newSubmitted[currentQuestionIndex] = true;
      setSubmittedAnswers(newSubmitted);
    } finally {
      setIsGrading(false);
    }
  };

  const handleSkipQuestion = () => {
    const currentTarget = quizQuestions[currentQuestionIndex];
    if (!currentTarget) return;

    const newScores = [...questionScores];
    newScores[currentQuestionIndex] = 0;
    setQuestionScores(newScores);

    const newAnswers = [...userAnswers];
    newAnswers[currentQuestionIndex] = "Passée";
    setUserAnswers(newAnswers);

    const newFeedback = [...questionFeedback];
    newFeedback[currentQuestionIndex] = `Pratique passée. La structure anatomique était : "${currentTarget.frenchName}".`;
    setQuestionFeedback(newFeedback);

    const newSubmitted = [...submittedAnswers];
    newSubmitted[currentQuestionIndex] = true;
    setSubmittedAnswers(newSubmitted);
  };

  const handleNextQuestion = () => {
    setUserTypedAnswer("");
    if (currentQuestionIndex + 1 < quizQuestions.length) {
      setCurrentQuestionIndex(prev => prev + 1);
    } else {
      setQuizCompleted(true);
    }
  };

  return (
    <div id="anatomy-root" className="bg-slate-50 min-h-screen py-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Aesthetic title matching other workspaces */}
        <div id="anatomy-header" className="mb-10 text-center max-w-4xl mx-auto">
          <Badge variant="outline" className="mb-3 px-3 py-1 text-sky-600 border-sky-200 bg-sky-50 rounded-full font-bold uppercase text-[10px] tracking-widest">
            ESPACE RADIO-ANATOMIE INTERACTIVE
          </Badge>
          <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight sm:text-4xl">
            Atlas Anatomique Radiologique
          </h1>
          <p className="mt-3 text-slate-600 text-base">
            Perfectionnez votre lecture des repères fondamentaux du squelette et des organes internes. Basculez en un clic vers la mise en situation ou testez-vous avec nos quiz de diagnostic de repérage.
          </p>
        </div>

        {/* Tab Header Selector */}
        <div className="mb-8 grid grid-cols-1 md:grid-cols-12 gap-4 items-center">
          
          {/* Medical Slices Tab List */}
          <div className="md:col-span-8 flex flex-wrap gap-2.5">
            {anatomyData.map((mod) => {
              const isSelected = selectedModality.id === mod.id;
              return (
                <button
                  key={mod.id}
                  onClick={() => setSelectedModality(mod)}
                  className={`px-5 py-3 rounded-2xl text-xs font-bold uppercase tracking-wider transition-all duration-300 flex items-center gap-2 ${
                    isSelected 
                      ? 'bg-sky-600 text-white shadow-md shadow-sky-100 transform -translate-y-0.5' 
                      : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50 hover:border-slate-300'
                  }`}
                >
                  <Brain className={`h-4.5 w-4.5 ${isSelected ? 'text-white' : 'text-slate-400'}`} />
                  <div className="text-left">
                    <p className="text-[10px] opacity-75 font-medium leading-none mb-0.5">{mod.modalityType}</p>
                    <p className="text-xs font-bold tracking-tight">{mod.title}</p>
                  </div>
                </button>
              );
            })}
          </div>

          {/* Switch Mode: Exploration vs Trainer Quiz */}
          <div className="md:col-span-4 bg-white border border-slate-200 rounded-2xl p-1 shadow-sm flex">
            <button
              onClick={() => setActiveTab('exploration')}
              className={`flex-1 flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl text-xs font-bold uppercase tracking-wider transition-all ${
                activeTab === 'exploration'
                  ? 'bg-slate-900 text-white shadow-sm'
                  : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              <Eye className="h-4 w-4" />
              <span>Exploration</span>
            </button>
            <button
              onClick={() => {
                setActiveTab('quiz');
                initializeQuiz(selectedModality);
              }}
              className={`flex-1 flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl text-xs font-bold uppercase tracking-wider transition-all ${
                activeTab === 'quiz'
                  ? 'bg-indigo-600 text-white shadow-sm'
                  : 'text-slate-500 hover:text-indigo-600'
              }`}
            >
              <Award className="h-4 w-4" />
              <span>Mode Quiz</span>
            </button>
          </div>
        </div>

        {/* Workspace Bento Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* LEFT COLUMN: THE INTERACTIVE CONSOLE (MEDICAL SCREEN & SVG INDICATORS) */}
          <div className="lg:col-span-7 bg-slate-950 border border-slate-900 rounded-3xl p-6 shadow-2xl flex flex-col items-center select-none relative overflow-hidden">
            
            {/* Ambient medical screen glowing effect */}
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-sky-400 via-indigo-500 to-amber-500 opacity-80" />
            
            {/* Screen Header Info */}
            <div className="w-full flex justify-between items-center mb-4 text-slate-400 font-mono text-[10px] tracking-widest uppercase border-b border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                <span>PACS STATION #1</span>
              </div>
              <div className="flex items-center gap-4">
                <span>ZOOM: 100%</span>
                <span>FIT: AUTO</span>
                <span className="text-sky-400 font-bold">{selectedModality.modalityType}</span>
              </div>
            </div>

            {/* THE DYNAMIC SVG RENDER STATION */}
            <div className="relative w-full aspect-square max-w-[420px] bg-black/90 rounded-2xl border border-slate-800 overflow-hidden shadow-inner flex items-center justify-center">
              
              {/* Render background visual contours to represent the clinical slice cleanly */}
              <svg 
                viewBox="0 0 400 400" 
                className="w-full h-full text-slate-800"
                id="clinical-preview-canvas"
              >
                {/* 1. CHEST DECAL SCAN SCENARIO */}
                {selectedModality.id === 'chest-xray' && (
                  <g opacity="0.8">
                    {/* Dark thoracic cage outline */}
                    <rect x="80" y="20" width="240" height="300" rx="30" fill="#080c10" stroke="#1e293b" strokeWidth="2" />
                    {/* Spine background */}
                    <line x1="200" y1="20" x2="200" y2="320" stroke="#334155" strokeWidth="24" strokeLinecap="round" />
                    
                    {/* Lungs - dark because filled with air */}
                    <path d="M110,60 C110,30 180,40 180,105 C180,210 100,260 110,270" fill="#030712" stroke="#1e293b" strokeWidth="1.5" />
                    <path d="M290,60 C290,30 220,40 220,105 C220,210 300,260 290,270" fill="#030712" stroke="#1e293b" strokeWidth="1.5" />
                    
                    {/* Heart shadow on left side */}
                    <path d="M165,165 C150,185 150,225 165,245 C185,255 210,255 235,245 C255,230 250,180 230,172 C210,165 185,160 165,165 Z" fill="#1e293b" opacity="0.6" stroke="#475569" strokeWidth="1" />
                    
                    {/* Trachea central tube */}
                    <rect x="188" y="25" width="24" height="85" rx="4" fill="#0f172a" stroke="#475569" strokeWidth="1.5" />
                    
                    {/* Heuristic rib lines */}
                    <line x1="120" y1="90" x2="160" y2="105" stroke="#334155" strokeWidth="2" strokeLinecap="round" opacity="0.4" />
                    <line x1="115" y1="130" x2="170" y2="140" stroke="#334155" strokeWidth="2" strokeLinecap="round" opacity="0.4" />
                    <line x1="110" y1="170" x2="168" y2="176" stroke="#334155" strokeWidth="2" strokeLinecap="round" opacity="0.4" />
                    <line x1="110" y1="210" x2="165" y2="212" stroke="#334155" strokeWidth="2" strokeLinecap="round" opacity="0.4" />

                    <line x1="280" y1="90" x2="240" y2="105" stroke="#334155" strokeWidth="2" strokeLinecap="round" opacity="0.4" />
                    <line x1="285" y1="130" x2="230" y2="140" stroke="#334155" strokeWidth="2" strokeLinecap="round" opacity="0.4" />
                    <line x1="290" y1="170" x2="232" y2="176" stroke="#334155" strokeWidth="2" strokeLinecap="round" opacity="0.4" />
                    <line x1="290" y1="210" x2="235" y2="212" stroke="#334155" strokeWidth="2" strokeLinecap="round" opacity="0.4" />

                    {/* Domes of diaphragms */}
                    <path d="M100,265 C130,225 180,240 185,255" fill="none" stroke="#64748b" strokeWidth="3" />
                    <path d="M300,265 C270,228 220,240 215,255" fill="none" stroke="#64748b" strokeWidth="3" />
                  </g>
                )}

                {/* 2. CEREBRAL CT BRAIN DECAL */}
                {selectedModality.id === 'brain-ct' && (
                  <g opacity="0.9">
                    {/* Bone skull contour (bright bone density because high density) */}
                    <circle cx="200" cy="200" r="160" fill="#000000" stroke="#cbd5e1" strokeWidth="7" />
                    <circle cx="200" cy="200" r="156" fill="none" stroke="#64748b" strokeWidth="3" />
                    
                    {/* Hemispheres anatomy background */}
                    <path d="M200,45 C150,50 60,110 60,200 C60,285 140,350 200,355 Z" fill="#0c111d" />
                    <path d="M200,45 C250,50 340,110 340,200 C340,285 260,350 200,355 Z" fill="#0d121f" />
                    
                    {/* Falx cerebri division */}
                    <line x1="200" y1="45" x2="200" y2="355" stroke="#1e293b" strokeWidth="2" />
                    
                    {/* Dark butterfly lateral ventricles */}
                    <path d="M196,155 C190,140 178,145 178,185 C186,192 195,183 196,155 Z" fill="#020617" stroke="#334155" strokeWidth="1.5" />
                    <path d="M204,155 C210,140 222,145 222,185 C214,192 205,183 204,155 Z" fill="#020617" stroke="#334155" strokeWidth="1.5" />
                    
                    {/* Posterior horns of lateral ventricles */}
                    <path d="M198,240 C194,260 185,270 185,275 C193,275 198,260 198,240 Z" fill="#020617" stroke="#334155" strokeWidth="1.2" />
                    <path d="M202,240 C206,260 215,270 215,275 C207,275 202,260 202,240 Z" fill="#020617" stroke="#334155" strokeWidth="1.2" />
                    
                    {/* Gray matter nuclei (Caudate core, Thalamic bulbs) */}
                    <circle cx="170" cy="168" r="11" fill="#1e293b" stroke="#475569" strokeWidth="1" opacity="0.7" />
                    <circle cx="230" cy="168" r="11" fill="#1e293b" stroke="#475569" strokeWidth="1" opacity="0.7" />
                    
                    <ellipse cx="175" cy="220" rx="14" ry="18" fill="#1e293b" stroke="#334155" strokeWidth="1" opacity="0.8" />
                    <ellipse cx="225" cy="220" rx="14" ry="18" fill="#1e293b" stroke="#334155" strokeWidth="1" opacity="0.8" />
                    
                    {/* Sylvian fissure shadows */}
                    <path d="M100,180 Q130,195 160,195" fill="none" stroke="#1e293b" strokeWidth="3.5" opacity="0.7" />
                    <path d="M300,180 Q270,195 240,195" fill="none" stroke="#1e293b" strokeWidth="3.5" opacity="0.7" />
                  </g>
                )}

                {/* 3. KNEE SAGITTAL TOPO */}
                {selectedModality.id === 'knee-mri' && (
                  <g opacity="0.95">
                    {/* Femur bone shape */}
                    <path d="M130,50 L220,50 C230,110 230,150 200,160 C170,165 140,150 130,120 Z" fill="#111827" stroke="#334155" strokeWidth="2" />
                    {/* Tibia bone shape */}
                    <path d="M140,210 L250,210 L240,350 L140,350 Z" fill="#111827" stroke="#334155" strokeWidth="2" />
                    
                    {/* Patella / Rotule */}
                    <path d="M260,95 C285,95 295,115 285,135 C270,145 255,125 260,95 Z" fill="#1e293b" stroke="#475569" strokeWidth="1.5" />
                    
                    {/* Patellar tendon connection */}
                    <path d="M272,132 L246,212" fill="none" stroke="#64748b" strokeWidth="4" />
                    
                    {/* Quadriceps tendon above patella */}
                    <path d="M210,50 L262,95" fill="none" stroke="#475569" strokeWidth="3" />
                    
                    {/* Anterior Cruciate Ligament (LCA) diagonal band */}
                    <path d="M185,150 L225,200" fill="none" stroke="#000000" strokeWidth="3.5" strokeLinecap="round" />
                    
                    {/* Posterior Cruciate Ligament (LCP) heavy curve band */}
                    <path d="M192,143 Q220,152 205,206" fill="none" stroke="#000000" strokeWidth="4.5" strokeLinecap="round" />
                    
                    {/* Joint fluid cavity shadows */}
                    <path d="M246,145 Q212,175 190,175" fill="none" stroke="#020617" strokeWidth="3" />
                  </g>
                )}

                {/* THE HIGHLIGHTED OVERLAYS (SENSITIVE CLICKABLE HOTSPOTS) */}
                {selectedModality.hotspots.map((hotspot) => {
                  const isHovered = hoveredHotspot?.id === hotspot.id;
                  const isSelected = selectedHotspot?.id === hotspot.id;
                  
                  // Color calculation
                  let strokeColor = 'rgba(14, 165, 233, 0.5)'; // transparent sky blue
                  let fillColor = 'rgba(14, 165, 233, 0.1)';
                  
                  if (activeTab === 'exploration') {
                    if (isSelected) {
                      strokeColor = '#0ea5e9'; // solid sky blue
                      fillColor = 'rgba(14, 165, 233, 0.35)';
                    } else if (isHovered) {
                      strokeColor = '#38bdf8'; // light sky-400
                      fillColor = 'rgba(56, 189, 248, 0.25)';
                    }
                  } else {
                    // Mode Quiz highlight
                    const currentTarget = quizQuestions[currentQuestionIndex];
                    const isTargetQuestion = currentTarget?.id === hotspot.id;
                    
                    if (isTargetQuestion) {
                      strokeColor = '#a855f7'; // purple
                      fillColor = 'rgba(168, 85, 247, 0.25)';
                    } else {
                      strokeColor = 'rgba(148, 163, 184, 0.08)';
                      fillColor = 'transparent';
                    }
                  }

                  const commonProps = {
                    id: `hotspot-${hotspot.id}`,
                    style: { cursor: activeTab === 'exploration' ? 'pointer' : 'default', transition: 'all 0.2s ease' },
                    stroke: strokeColor,
                    strokeWidth: activeTab === 'exploration' ? (isHovered || isSelected ? 2.5 : 1.5) : (quizQuestions[currentQuestionIndex]?.id === hotspot.id ? 3.5 : 0.8),
                    fill: fillColor,
                    onMouseEnter: () => activeTab === 'exploration' && setHoveredHotspot(hotspot),
                    onMouseLeave: () => activeTab === 'exploration' && setHoveredHotspot(null),
                    onClick: () => {
                      if (activeTab === 'exploration') {
                        setSelectedHotspot(hotspot);
                      }
                    }
                  };

                  if (hotspot.svgElement === 'rect') {
                    return (
                      <rect 
                        key={hotspot.id} 
                        {...commonProps} 
                        x={hotspot.coordinates.x} 
                        y={hotspot.coordinates.y} 
                        width={hotspot.coordinates.width} 
                        height={hotspot.coordinates.height} 
                        rx={hotspot.coordinates.rx || 0} 
                      />
                    );
                  } else if (hotspot.svgElement === 'circle') {
                    return (
                      <circle 
                        key={hotspot.id} 
                        {...commonProps} 
                        cx={hotspot.coordinates.cx} 
                        cy={hotspot.coordinates.cy} 
                        r={hotspot.coordinates.r} 
                      />
                    );
                  } else if (hotspot.svgElement === 'polygon') {
                    return (
                      <polygon 
                        key={hotspot.id} 
                        {...commonProps} 
                        points={hotspot.coordinates.points} 
                      />
                    );
                  } else if (hotspot.svgElement === 'path') {
                    return (
                      <path 
                        key={hotspot.id} 
                        {...commonProps} 
                        d={hotspot.coordinates.d} 
                      />
                    );
                  }
                  return null;
                })}
              </svg>
              
              {/* Floating label indicators on top-center of monitor */}
              <div className="absolute top-3 left-1/2 -translate-x-1/2 bg-slate-900/90 py-1.5 px-3 rounded-full border border-slate-800 text-[10px] text-slate-400 font-mono tracking-wider flex items-center gap-1.5 whitespace-nowrap">
                <Compass className="h-3.5 w-3.5 text-purple-400" />
                <span>{activeTab === 'exploration' ? "TOUCHEZ UNE STRUCTURE SUR L'IMAGE" : "IDENTIFIEZ LA STRUCTURE EN SURBRILLANCE VIOLETTE"}</span>
              </div>

            </div>

            {/* Bottom mini legend in exploration tab */}
            {activeTab === 'exploration' ? (
              <div className="w-full mt-4 flex justify-between items-center text-[10px] font-mono text-slate-500">
                <span>Cliquez sur une zone pour épingler la fiche</span>
                <span>Structures configurées : {selectedModality.hotspots.length}</span>
              </div>
            ) : (
              <div className="w-full mt-4 flex justify-between items-center text-[10px] font-mono">
                {quizCompleted ? (
                  <span className="text-purple-400 font-bold">Quiz Terminé !</span>
                ) : (
                  <span className="text-purple-400 font-bold">Structure {currentQuestionIndex + 1} de 5</span>
                )}
                <span className="text-slate-500 font-medium">Assistant de Correction IA actif v2.1</span>
              </div>
            )}

          </div>

          {/* RIGHT COLUMN: INFORMATION CARD PANEL OR QUIZ CONTROL CARD */}
          <div className="lg:col-span-5 space-y-6">
            
            {/* 1. EXPLORATION TAB VIEW */}
            {activeTab === 'exploration' && (
              <Card className="bg-white border-slate-200 shadow-sm overflow-hidden rounded-2xl">
                
                {/* Header overview */}
                <div className="bg-slate-50 p-5 border-b border-slate-100">
                  <span className="text-[10px] font-bold text-sky-600 uppercase tracking-widest block mb-1">MÉTHODOLOGIE D'ANALYSE</span>
                  <h3 className="text-base font-bold text-slate-900">{selectedModality.title}</h3>
                  <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                    {selectedModality.subtitle}
                  </p>
                </div>

                <CardContent className="p-6 space-y-6">
                  
                  {/* General Summary of the modality */}
                  <div className="bg-sky-50/50 p-4 border border-sky-100 rounded-xl space-y-1.5">
                    <div className="flex items-center gap-1.5">
                      <Info className="h-4 w-4 text-sky-600" />
                      <span className="text-xs font-bold text-sky-900 uppercase tracking-wide">Conseils de lecture</span>
                    </div>
                    <p className="text-xs text-slate-600 leading-relaxed">
                      {selectedModality.summary}
                    </p>
                  </div>

                  {/* Anatomical Card Details block */}
                  {(selectedHotspot || hoveredHotspot) ? (
                    <div className="border border-slate-150 p-5 rounded-xl bg-slate-50/20 space-y-4">
                      
                      {/* Title & Latin terms */}
                      <div className="flex justify-between items-start">
                        <div>
                          <Badge variant="outline" className="bg-sky-50 text-sky-700 font-bold text-[9px] uppercase tracking-wider mb-1.5">
                            Région identifiée
                          </Badge>
                          <h4 className="text-base font-extrabold text-slate-800">
                            {(hoveredHotspot || selectedHotspot)?.frenchName}
                          </h4>
                          {(hoveredHotspot || selectedHotspot)?.latinName && (
                            <p className="text-[11px] text-slate-400 italic mt-0.5">
                              Terminaison : {(hoveredHotspot || selectedHotspot)?.latinName}
                            </p>
                          )}
                        </div>
                      </div>

                      {/* Description detail */}
                      <div className="space-y-1.5 border-t border-slate-100 pt-3">
                        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Description anatomisante</span>
                        <p className="text-xs text-slate-600 leading-relaxed">
                          {(hoveredHotspot || selectedHotspot)?.description}
                        </p>
                      </div>

                      {/* Clinical tip / trap warning */}
                      <div className="bg-amber-50/50 border border-amber-100 p-3.5 rounded-lg space-y-1">
                        <div className="flex items-center gap-1.5 text-amber-800 font-bold text-xs uppercase tracking-wider">
                          <Eye className="h-3.5 w-3.5 text-amber-600" />
                          <span>Astuce clinique de garde</span>
                        </div>
                        <p className="text-xs font-normal text-amber-700 leading-relaxed">
                          {(hoveredHotspot || selectedHotspot)?.tips}
                        </p>
                      </div>

                    </div>
                  ) : (
                    <div className="border-2 border-dashed border-slate-200 rounded-2xl p-8 text-center text-slate-400 flex flex-col items-center justify-center space-y-3">
                      <Compass className="h-10 w-10 text-slate-300 animate-pulse" />
                      <div>
                        <p className="text-sm font-bold text-slate-700">Aucun repère anatomique sélectionné</p>
                        <p className="text-xs text-slate-400 max-w-[280px] mx-auto mt-1 leading-relaxed">
                          Survolez ou cliquez sur les cercles, rectangles ou tracés bleus fluorescents de la console pour visualiser les fiches d\'organes correspondantes.
                        </p>
                      </div>
                    </div>
                  )}

                </CardContent>
              </Card>
            )}

            {/* 2. TRAINER / QUIZ TAB VIEW */}
            {activeTab === 'quiz' && (
              <Card className="bg-white border-slate-200 shadow-sm overflow-hidden rounded-2xl">
                
                {/* Header score card */}
                {(() => {
                  const totalPoints = questionScores.reduce((sum, s) => sum + s, 0);
                  const gradeOnTwenty = Number((totalPoints * 20 / 25).toFixed(1));
                  return (
                    <div className="bg-slate-900 p-5 text-white flex items-center justify-between border-b border-slate-800">
                      <div className="space-y-0.5">
                        <span className="text-[10px] font-bold text-purple-450 uppercase tracking-widest block">ÉVALUATION CLINIQUE PAR IA</span>
                        <h3 className="text-sm font-bold">Barème de Points Dynamique</h3>
                      </div>
                      <div className="bg-purple-600/20 border border-purple-500/20 px-3 py-1.5 rounded-xl text-center font-mono">
                        <span className="text-slate-405 text-[10px] uppercase font-bold mr-1.5">Note:</span>
                        <span className="text-sm font-extrabold text-purple-300">{gradeOnTwenty} / 20</span>
                      </div>
                    </div>
                  );
                })()}

                <CardContent className="p-6">
                  
                  {/* SHOW RESULT IF COMPLETED */}
                  {quizCompleted ? (
                    (() => {
                      const totalPoints = questionScores.reduce((sum, s) => sum + s, 0);
                      const gradeOnTwenty = Number((totalPoints * 20 / 25).toFixed(1));
                      return (
                        <div className="py-2 space-y-6">
                          
                          <div className="text-center space-y-4">
                            <div className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-purple-50 text-purple-600 border border-purple-200 mb-1">
                              <Trophy className="h-7 w-7" />
                            </div>

                            <div className="space-y-1.5">
                              <h4 className="text-lg font-extrabold text-slate-800">Session d'Évaluation Terminée !</h4>
                              <p className="text-xs text-slate-500">
                                Score anatomique : <strong className="text-slate-800 font-bold">{totalPoints} / 25 points</strong>
                              </p>
                              <div className="inline-block bg-purple-55 text-purple-800 font-mono font-extrabold text-xl py-1 px-4 rounded-full mt-1">
                                {gradeOnTwenty} / 20
                              </div>
                            </div>

                            {/* Success / encouraging messages */}
                            <div className="max-w-md mx-auto text-xs text-slate-500 px-4 leading-relaxed font-normal">
                              {gradeOnTwenty >= 16 ? (
                                <span className="text-emerald-700 font-bold block bg-emerald-50 p-2.5 rounded-xl">Excellent travail ! Vous possédez une rigueur de lecture digne d'un clinicien sénior.</span>
                              ) : gradeOnTwenty >= 10 ? (
                                <span className="text-indigo-700 block bg-indigo-50 p-2.5 rounded-xl">Résultat correct. Vous maîtrisez l'essentiel mais continuez de réviser pour affiner les fiches de garde.</span>
                              ) : (
                                <span className="text-red-700 block bg-red-50 p-2.5 rounded-xl">Entraînement insuffisant pour les gardes de radiologie. Refaites le module d'anatomie pour sécuriser vos diagnostics.</span>
                              )}
                            </div>
                          </div>

                          {/* LIST OF QUESTION REVIEWS */}
                          <div className="space-y-4 border-t border-slate-100 pt-6">
                            <h5 className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">Synthèse détaillée du jury IA :</h5>
                            
                            {quizQuestions.map((q, idx) => {
                              const score = questionScores[idx];
                              let scoreBadgeColor = "bg-red-50 text-red-750";
                              if (score === 5) scoreBadgeColor = "bg-emerald-100 text-emerald-800 font-bold";
                              else if (score >= 3) scoreBadgeColor = "bg-amber-100 text-amber-800";
                              
                              return (
                                <div key={q.id} className="border border-slate-100 p-3.5 rounded-xl bg-slate-50/40 text-xs space-y-1.5">
                                  <div className="flex justify-between items-start gap-2">
                                    <div className="font-semibold text-slate-700">
                                      {idx + 1}. {q.frenchName} {q.latinName && <span className="text-slate-400 italic">({q.latinName})</span>}
                                    </div>
                                    <span className={`px-2 py-0.5 text-[10px] rounded-full font-mono ${scoreBadgeColor}`}>
                                      {score} / 5 pts
                                    </span>
                                  </div>
                                  <div className="text-[11px] text-slate-500 leading-normal">
                                    <span className="font-medium text-slate-600 block">Votre saisie : <span className="font-mono italic text-slate-800">"{userAnswers[idx] || "Aucune réponse"}"</span></span>
                                    <span className="mt-1 block text-slate-500 bg-white/70 p-2 rounded border border-slate-100">{questionFeedback[idx]}</span>
                                  </div>
                                </div>
                              );
                            })}
                          </div>

                          <Button 
                            onClick={() => initializeQuiz(selectedModality)} 
                            className="bg-indigo-650 hover:bg-indigo-700 text-white font-bold w-full rounded-xl py-3 text-xs uppercase tracking-wide gap-2 text-center"
                          >
                            <RefreshCw className="h-4 w-4" />
                            <span>Recommencer une Évaluation</span>
                          </Button>

                        </div>
                      );
                    })()
                  ) : (
                    
                    /* ACTIVE QUESTION SCREEN */
                    (() => {
                      const currentQuestion = quizQuestions[currentQuestionIndex];
                      const isQuestionGraded = submittedAnswers[currentQuestionIndex];
                      const currentScore = questionScores[currentQuestionIndex];
                      const currentExplan = questionFeedback[currentQuestionIndex];

                      return (
                        <div className="space-y-6">
                          
                          {/* Current Task container */}
                          <div className="bg-purple-50/70 border border-purple-100 p-5 rounded-2xl text-center space-y-3">
                            <span className="text-[10px] font-bold text-purple-655 uppercase tracking-widest block">STRUCTURE POINTÉE EN VIOLET</span>
                            
                            {currentQuestion && (
                              <div className="space-y-1">
                                <h4 className="text-base font-extrabold text-slate-800">
                                  Identifiez l'organe ou la ligne anatomique surlignée de gauche.
                                </h4>
                                {currentQuestion.latinName && (
                                  <p className="text-[11px] text-purple-700 italic font-mono mt-0.5">
                                    Indice : synonyme de la nomenclature clinique standard
                                  </p>
                                )}
                              </div>
                            )}

                            <p className="text-xs text-slate-455 font-normal px-4 leading-normal">
                              Analysez attentivement le schéma dans la console noire de gauche et écrivez ci-dessous le nom en français ou latin.
                            </p>
                          </div>

                          {/* USER INPUT RESPONSE BLOCK */}
                          <div className="space-y-3">
                            <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">Votre proposition clinique :</label>
                            
                            <div className="flex gap-2">
                              <input 
                                type="text"
                                value={userTypedAnswer}
                                onChange={(e) => !isQuestionGraded && setUserTypedAnswer(e.target.value)}
                                disabled={isQuestionGraded || isGrading}
                                onKeyDown={(e) => {
                                  if (e.key === 'Enter' && !isQuestionGraded && userTypedAnswer.trim()) {
                                    handleGradeAnswer();
                                  }
                                }}
                                placeholder="Saisissez la structure..."
                                className="flex-1 bg-slate-50 border border-slate-200 outline-none text-xs rounded-xl px-3.5 py-2.5 text-slate-850 placeholder-slate-400 focus:bg-white focus:ring-2 focus:ring-purple-500/20 focus:border-purple-550 transition-all font-mono"
                              />

                              {!isQuestionGraded && (
                                <Button
                                  onClick={handleGradeAnswer}
                                  disabled={isGrading || !userTypedAnswer.trim()}
                                  className="bg-purple-650 hover:bg-purple-700 text-white font-bold rounded-xl px-4 py-2.5 text-xs uppercase tracking-wide gap-1.5 flex items-center justify-center min-w-[120px]"
                                >
                                  {isGrading ? (
                                    <>
                                      <RefreshCw className="h-3.5 w-3.5 animate-spin" />
                                      <span>IA...</span>
                                    </>
                                  ) : (
                                    <>
                                      <Sparkles className="h-3.5 w-3.5" />
                                      <span>Évaluer</span>
                                    </>
                                  )}
                                </Button>
                              )}
                            </div>
                          </div>

                          {/* AI GRADING RESPONSE SUMMARY */}
                          {isQuestionGraded && (
                            <div className="space-y-4 border-t border-slate-100 pt-4 animate-fade-in">
                              <div className="flex items-center justify-between">
                                <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">ÉVALUATION DU JURY :</span>
                                <Badge className={`font-mono text-xs px-2.5 py-1 ${
                                  currentScore === 5 ? "bg-emerald-100 text-emerald-800" : 
                                  currentScore >= 3 ? "bg-amber-100 text-amber-800" : "bg-red-100 text-red-800"
                                }`}>
                                  Score : {currentScore} / 5 points
                                </Badge>
                              </div>

                              <div className="p-4 bg-slate-50 border border-slate-150 rounded-xl space-y-2">
                                <p className="text-xs font-semibold text-slate-800">
                                  La structure correcte était : <strong className="text-purple-700 underline">{currentQuestion?.frenchName}</strong> {currentQuestion?.latinName && `(${currentQuestion.latinName})`}
                                </p>
                                <p className="text-xs text-slate-600 leading-relaxed italic font-normal">
                                  "{currentExplan}"
                                </p>
                              </div>

                              <Button 
                                onClick={handleNextQuestion}
                                className="bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold w-full rounded-xl py-3 uppercase tracking-wider flex items-center justify-center gap-1.5"
                              >
                                <span>{currentQuestionIndex === 4 ? "Terminer et voir la note finale" : "Question Suivante"}</span>
                                <Compass className="h-3.5 w-3.5 rotate-90" />
                              </Button>
                            </div>
                          )}

                          {/* Skip buttons when waiting submission */}
                          {!isQuestionGraded && (
                            <div className="flex gap-2">
                              <Button 
                                onClick={handleSkipQuestion} 
                                variant="outline" 
                                className="flex-1 border-slate-200 hover:bg-slate-50 text-slate-500 text-xs py-2.5 font-bold uppercase tracking-wider rounded-xl"
                              >
                                Passer la question (0/5)
                              </Button>
                              <Button
                                onClick={() => initializeQuiz(selectedModality)}
                                variant="ghost"
                                className="py-2.5 text-xs font-semibold text-slate-400 hover:text-slate-600 uppercase tracking-wider"
                              >
                                Réinitialiser
                              </Button>
                            </div>
                          )}

                        </div>
                      );
                    })()
                  )}

                </CardContent>
              </Card>
            )}

            {/* Interactive Instructions Helper Card */}
            <div className="bg-slate-100 p-4 border border-slate-200 rounded-2xl flex items-start gap-3">
              <Sparkles className="h-5 w-5 text-indigo-500 shrink-0 mt-0.5" />
              <div>
                <h4 className="text-xs font-bold text-slate-800">Qu'est-ce que l'évaluation radio-anatomique par IA ?</h4>
                <p className="text-[11px] text-slate-500 leading-relaxed font-normal mt-1">
                  Notre jury IA évalue vos réponses à texte ouvert en tenant compte des abréviations, erreurs d'orthographe légères (calcul de distance de Levenshtein) et synonymes français/latin. Le barème de 5 points attribue un score proportionnel à la proximité clinique de votre diagnostic.
                </p>
              </div>
            </div>

          </div>

        </div>

      </div>
    </div>
  );
}
