// Calculators preserved verbatim from the existing prototype. No new medical rules.
export type LegacyCalculator = {
  title: string;
  steps: {
    question: string;
    options: {
      label: string;
      points: number;
      value: string;
    }[];
  }[];
  calculateResult: (selectedAnswers: Record<number, number>) => {
    score: string | number;
    category: string;
    comment: string;
    variant?: "success" | "warning" | "destructive" | "default";
  };
};

export const legacyCalculators: Record<string, LegacyCalculator> = {
  "salter-harris": {
    title: "Diagnostic Guidé Salter-Harris",
    steps: [
      {
        question:
          "Où se situe le trait principal de fracture par rapport au cartilage de croissance ?",
        options: [
          {
            label:
              "Uniquement le long du cartilage de croissance (décollement pur)",
            points: 1,
            value: "I",
          },
          {
            label:
              "Le long du cartilage, remontant verticalement dans la métaphyse",
            points: 2,
            value: "II",
          },
          {
            label:
              "Traversant le cartilage et descendant verticalement dans l'épiphyse",
            points: 3,
            value: "III",
          },
          {
            label:
              "Traversant de part en part la métaphyse, le cartilage et l'épiphyse",
            points: 4,
            value: "IV",
          },
          {
            label:
              "Pas de trait évident, compression axiale ou écrasement suspecté",
            points: 5,
            value: "V",
          },
        ],
      },
    ],
    calculateResult: (answers) => {
      const ans = answers[0] || 0;
      if (ans === 1)
        return {
          score: "Type I",
          category: "Excellent pronostic",
          comment:
            "Réduction fermée simple, faible risque de déviation de croissance.",
        };
      if (ans === 2)
        return {
          score: "Type II",
          category: "Bon pronostic",
          comment:
            "Traitement orthopédique conservateur en général. Risque d'interruption de croissance reste faible.",
          variant: "success",
        };
      if (ans === 3)
        return {
          score: "Type III",
          category: "Pronostic réservé (Articulaire)",
          comment:
            "Nécessite souvent une réduction anatomique parfaite (chirurgie) pour préserver la surface articulaire.",
          variant: "warning",
        };
      if (ans === 4)
        return {
          score: "Type IV",
          category: "Pronostic sévère",
          comment:
            "Risque majeur de pont d'épiphysiode. L'intervention chirurgicale est le plus souvent urgente.",
          variant: "destructive",
        };
      return {
        score: "Type V",
        category: "Pronostic sombre",
        comment:
          "Diagnostic souvent rétrospectif. Risque extrêmement élevé de pont osseux précoce et d'arrêt de croissance.",
        variant: "destructive",
      };
    },
  },
  fazekas: {
    title: "Calculateur du Score de Fazekas global",
    steps: [
      {
        question: "État des lésions péri-ventriculaires (PV) :",
        options: [
          { label: "Absence d'anomalie de signal", points: 0, value: "PV0" },
          {
            label: 'Lignes fines ou "coiffe" périventriculaire bilatérale',
            points: 1,
            value: "PV1",
          },
          {
            label: "Halo lisse et régulier d'épaisseur moyenne",
            points: 2,
            value: "PV2",
          },
          {
            label: "Grandes plages d'anomalies irrégulières confluentes",
            points: 3,
            value: "PV3",
          },
        ],
      },
      {
        question: "État des lésions profondes / sous-corticales (DWM) :",
        options: [
          { label: "Absence de lésion ponctuée", points: 0, value: "D0" },
          { label: "Foyers ponctués isolés", points: 1, value: "D1" },
          {
            label: "Foyers larges débutant de confluence modérée",
            points: 2,
            value: "D2",
          },
          {
            label: "Grandes plages confluentes ou coalescence diffuse",
            points: 3,
            value: "D3",
          },
        ],
      },
    ],
    calculateResult: (answers) => {
      const pv = answers[0] || 0;
      const dwm = answers[1] || 0;
      const totalMax = Math.max(pv, dwm);

      if (totalMax === 0)
        return {
          score: "Fazekas 0",
          category: "Normal",
          comment: "Pas de micro-angiopathie visible.",
        };
      if (totalMax === 1)
        return {
          score: "Fazekas 1",
          category: "Légère",
          comment:
            "Leucoaraïose bénigne, souvent associée au vieillissement physiologique.",
        };
      if (totalMax === 2)
        return {
          score: "Fazekas 2",
          category: "Modérée",
          comment:
            "Micro-angiopathie débutante substantielle. Contrôler les facteurs de risques cardiovasculaires.",
          variant: "warning",
        };
      return {
        score: "Fazekas 3",
        category: "Sévère",
        comment:
          "Atteinte diffuse sévère des fibres d'association. Risque élevé de syndrome parkinsonien vasculaire ou de déclin cognitif.",
        variant: "destructive",
      };
    },
  },
  stanford: {
    title: "Triage Rapide Syndrome Aortique Aigu",
    steps: [
      {
        question:
          "Le trait de dissection ou le flap d'intima implique-t-il l'Aorte Ascendante (en amont de l'artère sous-clavière gauche) ?",
        options: [
          {
            label: "Oui, l'aorte ascendante est directement intéressée",
            points: 1,
            value: "A",
          },
          {
            label:
              "Non, le flap débute exclusivement en aval du tronc brachio-céphalique ou de la sous-clavière",
            points: 2,
            value: "B",
          },
        ],
      },
    ],
    calculateResult: (answers) => {
      const choice = answers[0] || 0;
      if (choice === 1) {
        return {
          score: "Stanford Type A",
          category: "URGENCE CHIRURGICALE ABSOLUE",
          comment:
            "Nécessite un transfert immédiat en bloc de chirurgie cardiaque pour remplacement de l'aorte ascendante (risque immédiat de tamponnade, d'infarctus ou de rupture). Éviter absolument la surcharge barométrique.",
          variant: "destructive",
        };
      } else {
        return {
          score: "Stanford Type B",
          category: "URGENCE MÉDICALE INITIALE",
          comment:
            "Traitement médical conservateur de première intention consistant au contrôle drastique de la pression artérielle de l'insuffisance coronaire (bêtabloquants). Chirurgie (ou stent endovasculaire TEVAR) réservée aux complications ischémiques ou d'expansion anévrismale rapide.",
          variant: "warning",
        };
      }
    },
  },
  balthazar: {
    title: "Calculateur d'Index de Gravité (CTSI)",
    steps: [
      {
        question:
          "Quel est le grade de l'atteinte pancréatique (classification Balthazar historique) ?",
        options: [
          { label: "Grade A : Pancréas normal", points: 0, value: "A" },
          {
            label: "Grade B : Hypertrophie focale ou globale",
            points: 1,
            value: "B",
          },
          {
            label:
              "Grade C : Anomalies intrinsèques + inflammation péri-pancréatique",
            points: 2,
            value: "C",
          },
          {
            label: "Grade D : Collection liquidienne unique péri-pancréatique",
            points: 3,
            value: "D",
          },
          {
            label:
              "Grade E : Deux collections ou plus / présence de gaz intra ou extra-pancréatique",
            points: 4,
            value: "E",
          },
        ],
      },
      {
        question:
          "Quel est le taux estimé de nécrose parenchymateuse (rehaussement iodé injecté absent) ?",
        options: [
          {
            label: "Absence de nécrose (0% de perte de rehaussement)",
            points: 0,
            value: "N0",
          },
          {
            label:
              "Nécrose modérée (< 30% du volume de la glande pancréatique)",
            points: 2,
            value: "N30",
          },
          {
            label: "Nécrose intermédiaire (30% à 50% du rehaussement)",
            points: 4,
            value: "N50",
          },
          {
            label: "Nécrose majeure (> 50% du tissu pancréatique d'origine)",
            points: 6,
            value: "N100",
          },
        ],
      },
    ],
    calculateResult: (answers) => {
      const scoreB = answers[0] || 0;
      const scoreN = answers[1] || 0;
      const totalScore = scoreB + scoreN;

      let morbidity = "Faible (~4%)";
      let mortality = "Très basse (~1%)";
      let risk = "Faible Gravité (CTSI discret)";
      let variant: "success" | "warning" | "destructive" = "success";

      if (totalScore >= 7) {
        morbidity = "Élevée (~92%)";
        mortality = "Tranchée (~17%)";
        risk = "SÉVÈRE (Pronostic aigu réservé)";
        variant = "destructive";
      } else if (totalScore >= 4) {
        morbidity = "Intermédiaire (~35%)";
        mortality = "Modérée (~4%)";
        risk = "MODÉRÉE (Hospitalisation et surveillance renforcée)";
        variant = "warning";
      }

      return {
        score: `${totalScore} / 10`,
        category: risk,
        comment: `Index de sévérité TDM (CTSI) : [Grade Balthazar : ${scoreB} pts + Nécrose : ${scoreN} pts]. Morbidité associée : ${morbidity}. Mortalité à court terme : ${mortality}.`,
        variant,
      };
    },
  },
  bosniak: {
    title: "Formulaire de calcul Bosniak v2019",
    steps: [
      {
        question:
          "Quelles sont les caractéristiques morphologiques de la cloison ou de la paroi kystique ?",
        options: [
          {
            label:
              "Paroi imperceptible (< 1 mm), homogène sans calcification ni cloison",
            points: 1,
            value: "I",
          },
          {
            label:
              "Cloison très fine unique, ou fines calcifications régulières",
            points: 2,
            value: "II",
          },
          {
            label:
              "Multiples fines cloisons ou rehaussement non franc mais net à l'imagerie",
            points: 3,
            value: "IIF",
          },
          {
            label:
              "Paroi franchement épaissie (> 2 mm) avec rehaussement iodé évident",
            points: 4,
            value: "III",
          },
          {
            label:
              "Végétations tissulaires ou nodule de rehaussement intrakystique solide",
            points: 5,
            value: "IV",
          },
        ],
      },
    ],
    calculateResult: (answers) => {
      const selection = answers[0] || 0;
      if (selection === 1)
        return {
          score: "Bosniak I",
          category: "Bénin pur (Zéro risque)",
          comment: "Absence totale de contrôle nécessaire ou de suivi.",
        };
      if (selection === 2)
        return {
          score: "Bosniak II",
          category: "Bénin présumé (<1% risque)",
          comment: "Pas d'indication chirurgicale ni de suivi requis.",
        };
      if (selection === 3)
        return {
          score: "Bosniak IIF",
          category: "Incertain (Suivi requis - ~5% risque)",
          comment:
            "Suivi échographique ou scanographique planifié à 6, 12 et 24 mois requis pour vérifier la stabilité.",
          variant: "warning",
        };
      if (selection === 4)
        return {
          score: "Bosniak III",
          category: "Risque suspect (~50% néoplasique)",
          comment:
            "Indication d'exérèse chirurgicale conservatrice (néphrectomie partielle) ou d'ablation par radiofréquence en discussion interdisciplinaire.",
          variant: "destructive",
        };
      return {
        score: "Bosniak IV",
        category: "Malignité quasi-certaine (>90% néphroblastome / carcinome)",
        comment:
          "Néphrectomie programmée de première intention sauf contre-indications cliniques majeures.",
        variant: "destructive",
      };
    },
  },
  "pi-rads": {
    title: "Aide à la Synthèse PI-RADS locale",
    steps: [
      {
        question: "Où se situe précisément la lésion suspecte dominante ?",
        options: [
          {
            label: "Zone Périphérique (PZ) - (Majorité des cancers)",
            points: 1,
            value: "PZ",
          },
          {
            label: "Zone Transitionnelle (TZ) - (Siège de l'HBP)",
            points: 2,
            value: "TZ",
          },
        ],
      },
      {
        question: "Quel est l'aspect sémiologique de la Lésion ?",
        options: [
          {
            label:
              "Franche plage noire restrictif sur carte ADC (Coéff de diffusion ultra-bas)",
            points: 4,
            value: "DWI_Severe",
          },
          {
            label:
              "Infiltration modérée intermédiaire ou aspect nodulaire flou",
            points: 3,
            value: "DWI_Moderate",
          },
          {
            label: "Absence d'anomalie focale en diffusion",
            points: 1,
            value: "DWI_None",
          },
        ],
      },
    ],
    calculateResult: (answers) => {
      const zone = answers[0] || 0;
      const status = answers[1] || 0;

      if (status === 1)
        return {
          score: "PI-RADS 1 ou 2",
          category: "Suspicion très basse",
          comment:
            "Pas d'indication systématique de biopsie sur ces nodules ciblés.",
        };
      if (status === 3)
        return {
          score: "PI-RADS 3",
          category: "Lésion Indéterminée",
          comment:
            "Bilan biologique à recouper. Biopsie ciblée recommandée seulement en présence de facteurs de risques majeurs.",
          variant: "warning",
        };

      if (zone === 1) {
        return {
          score: "PI-RADS 4 / 5 (Zone Périphérique)",
          category: "HAUTEMENT RETROUVÉ/SUSPECT",
          comment:
            "Fort taux de restriction du coefficient d'extinction. Biopsie prostatique avec fusion d'image échographie-IRM fortement de première intention.",
          variant: "destructive",
        };
      } else {
        return {
          score: "PI-RADS 4 (Zone Transitionnelle)",
          category: "FORTE PROBABILITÉ",
          comment:
            "Trait d'invasion du stroma antérieur suspect de carcinome de zone de transition. Consultation uro-oncologique indispensable.",
          variant: "destructive",
        };
      }
    },
  },
  "birads-mammographie": {
    title: "Arbre Décisionnel ACR BI-RADS",
    steps: [
      {
        question:
          "Quel est l'aspect morphologique principal de la structure visible ?",
        options: [
          {
            label:
              "Opacité stellaire, spiculée, ou microcalcifications polymorphes linéaires",
            points: 5,
            value: "stellaire",
          },
          {
            label:
              "Densité asymétrique nouvelle, contours flous, calcifications groupées suspectes",
            points: 4,
            value: "flou",
          },
          {
            label:
              "Opacité ronde / ovale régulière, contours lisses limités et stables",
            points: 3,
            value: "lisse",
          },
          {
            label:
              "Kyste hydrique simple ou calcifications macroscopiques rassurantes",
            points: 2,
            value: "kyste",
          },
          {
            label: "Examen de dépistage normal complet",
            points: 1,
            value: "normal",
          },
        ],
      },
    ],
    calculateResult: (answers) => {
      const opt = answers[0] || 0;
      if (opt === 5)
        return {
          score: "ACR 5",
          category: "Haute suspicion de cancer (>95%)",
          comment:
            "Prélèvement histologique direct (microbiopsie / macrobiopsie) requise de première intention couplé à un bilan de bilan pré-thérapeutique.",
          variant: "destructive",
        };
      if (opt === 4)
        return {
          score: "ACR 4",
          category: "Anomalie suspecte (2% - 95%)",
          comment:
            "Bilan par biopsie micro/macro obligatoire. L'évaluation histopathologique dictera l'urgence chirurgicale.",
          variant: "destructive",
        };
      if (opt === 3)
        return {
          score: "ACR 3",
          category: "Probablement bénin (<2%)",
          comment:
            "Surveillance à intervalle rapproché (contrôle mammographique unilatéral à 6 mois). Si pérennisation, classification rétrogradée.",
          variant: "warning",
        };
      if (opt === 2)
        return {
          score: "ACR 2",
          category: "Bénignant (Zéro risque clinique)",
          comment:
            "Continuer le dépistage triennal ou biennal de routine sans action spécifique.",
          variant: "success",
        };
      return {
        score: "ACR 1",
        category: "Normal",
        comment:
          "Absence complète de lésions suspectées. Rangement standard dans le protocole national.",
        variant: "success",
      };
    },
  },
};
