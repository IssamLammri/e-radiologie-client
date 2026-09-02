import { useState } from 'react';
import { 
  Search, BookOpen, ChevronRight, Bookmark, Calculator, 
  RotateCcw, Info, Check, ShieldAlert, Sparkles, AlertCircle, Eye
} from 'lucide-react';
import { Badge } from '../components/ui/Badge';
import { Card, CardContent } from '../components/ui/Card';
import { Input } from '../components/ui/Input';
import { Button } from '../components/ui/Button';
import { motion, AnimatePresence } from 'motion/react';

// Specialty Definition Matching requests
type ClassificationSpecialty = 
  | 'Imagerie pédiatrique'
  | 'Neuroradiologie'
  | 'Imagerie ORL et cervico-faciale'
  | 'Imagerie thoracique'
  | 'Imagerie cardiaque et vasculaire'
  | 'Imagerie interventionnelle et vasculaire'
  | 'Imagerie ostéo-articulaire (musculo-squelettique)'
  | 'Imagerie abdominale et digestive'
  | 'Imagerie gynécologique'
  | 'Imagerie urologique'
  | 'Imagerie sénologique'
  | 'Imagerie oncologique';

interface ClassificationItem {
  id: string;
  name: string;
  acronym?: string;
  description: string;
  indications: string;
  criteria: {
    grade: string;
    label: string;
    description: string;
    recommendation?: string;
  }[];
  calculator?: {
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
      variant?: 'success' | 'warning' | 'destructive' | 'default';
    };
  };
}

const classificationData: Record<ClassificationSpecialty, ClassificationItem[]> = {
  'Imagerie pédiatrique': [
    {
      id: 'salter-harris',
      name: 'Classification de Salter et Harris',
      acronym: 'Salter-Harris',
      description: 'Classification de référence pour les traumatismes du cartilage de croissance (physe) chez l\'enfant.',
      indications: 'Fractures pédiatriques intéressant le cartilage de croissance ou l\'épiphyse.',
      criteria: [
        { grade: 'Type I', label: 'Glissement pur transfysaire', description: 'Séparation au niveau de la zone de hypertrophie de la physe. Pas de fracture osseuse métaphysaire ou épiphysaire visible.' },
        { grade: 'Type II', label: 'Fractures transfysaire + métaphysaire', description: 'Le trait traverse le cartilage et remonte dans la métaphyse (Le plus fréquent, environ 75% des cas). Signe du coin de Thurston-Holland.' },
        { grade: 'Type III', label: 'Fracture transfysaire + épiphysaire', description: 'Le trait traverse le cartilage et s\'étend verticalement dans l\'épiphyse jusqu\'à l\'articulation.' },
        { grade: 'Type IV', label: 'Fracture trans-épiphyso-métaphysaire', description: 'Le trait vertical ou oblique traverse la métaphyse, la physe et l\'épiphyse simultanément.' },
        { grade: 'Type V', label: 'Écrasement du cartilage de croissance', description: 'Compression axiale sévère détruisant la zone germinale de la physe (risque d\'épiphysiode précoce très élevé).' }
      ],
      calculator: {
        title: 'Diagnostic Guidé Salter-Harris',
        steps: [
          {
            question: 'Où se situe le trait principal de fracture par rapport au cartilage de croissance ?',
            options: [
              { label: 'Uniquement le long du cartilage de croissance (décollement pur)', points: 1, value: 'I' },
              { label: 'Le long du cartilage, remontant verticalement dans la métaphyse', points: 2, value: 'II' },
              { label: 'Traversant le cartilage et descendant verticalement dans l\'épiphyse', points: 3, value: 'III' },
              { label: 'Traversant de part en part la métaphyse, le cartilage et l\'épiphyse', points: 4, value: 'IV' },
              { label: 'Pas de trait évident, compression axiale ou écrasement suspecté', points: 5, value: 'V' }
            ]
          }
        ],
        calculateResult: (answers) => {
          const ans = answers[0] || 0;
          if (ans === 1) return { score: "Type I", category: "Excellent pronostic", comment: "Réduction fermée simple, faible risque de déviation de croissance." };
          if (ans === 2) return { score: "Type II", category: "Bon pronostic", comment: "Traitement orthopédique conservateur en général. Risque d'interruption de croissance reste faible.", variant: 'success' };
          if (ans === 3) return { score: "Type III", category: "Pronostic réservé (Articulaire)", comment: "Nécessite souvent une réduction anatomique parfaite (chirurgie) pour préserver la surface articulaire.", variant: 'warning' };
          if (ans === 4) return { score: "Type IV", category: "Pronostic sévère", comment: "Risque majeur de pont d'épiphysiode. L'intervention chirurgicale est le plus souvent urgente.", variant: 'destructive' };
          return { score: "Type V", category: "Pronostic sombre", comment: "Diagnostic souvent rétrospectif. Risque extrêmement élevé de pont osseux précoce et d'arrêt de croissance.", variant: 'destructive' };
        }
      }
    }
  ],
  'Neuroradiologie': [
    {
      id: 'fazekas',
      name: 'Classification de Fazekas',
      acronym: 'Fazekas',
      description: 'Évaluation semi-quantitative de l\'étendue des lésions de la substance blanche cérébrale (leucoaraïose) à l\'IRM (principalement sur les séquences FLAIR ou T2).',
      indications: 'Bilan de démence, accident vasculaire cérébral lacunaire ou déclin cognitif.',
      criteria: [
        { grade: 'Fazekas 0', label: 'Absence de lésion', description: 'Substance blanche péri-ventriculaire et sous-corticale saine.' },
        { grade: 'Fazekas 1', label: 'Lésions minimes', description: 'Lésions péri-ventriculaires en "coiffe" ou capuchon fin, ou foyers profonds ponctués isolés.' },
        { grade: 'Fazekas 2', label: 'Lésions modérées', description: 'Lésions péri-ventriculaires en "halo" lisse ou lésions sous-corticales débutant en larges plaques confluentes.' },
        { grade: 'Fazekas 3', label: 'Lésions sévères', description: 'Lésions péri-ventriculaires irrégulières confluentes touchant une grande partie de la substance blanche ou plage continue.' }
      ],
      calculator: {
        title: 'Calculateur du Score de Fazekas global',
        steps: [
          {
            question: 'État des lésions péri-ventriculaires (PV) :',
            options: [
              { label: 'Absence d\'anomalie de signal', points: 0, value: 'PV0' },
              { label: 'Lignes fines ou "coiffe" périventriculaire bilatérale', points: 1, value: 'PV1' },
              { label: 'Halo lisse et régulier d\'épaisseur moyenne', points: 2, value: 'PV2' },
              { label: 'Grandes plages d\'anomalies irrégulières confluentes', points: 3, value: 'PV3' }
            ]
          },
          {
            question: 'État des lésions profondes / sous-corticales (DWM) :',
            options: [
              { label: 'Absence de lésion ponctuée', points: 0, value: 'D0' },
              { label: 'Foyers ponctués isolés', points: 1, value: 'D1' },
              { label: 'Foyers larges débutant de confluence modérée', points: 2, value: 'D2' },
              { label: 'Grandes plages confluentes ou coalescence diffuse', points: 3, value: 'D3' }
            ]
          }
        ],
        calculateResult: (answers) => {
          const pv = answers[0] || 0;
          const dwm = answers[1] || 0;
          const totalMax = Math.max(pv, dwm);
          
          if (totalMax === 0) return { score: "Fazekas 0", category: "Normal", comment: "Pas de micro-angiopathie visible." };
          if (totalMax === 1) return { score: "Fazekas 1", category: "Légère", comment: "Leucoaraïose bénigne, souvent associée au vieillissement physiologique." };
          if (totalMax === 2) return { score: "Fazekas 2", category: "Modérée", comment: "Micro-angiopathie débutante substantielle. Contrôler les facteurs de risques cardiovasculaires.", variant: 'warning' };
          return { score: "Fazekas 3", category: "Sévère", comment: "Atteinte diffuse sévère des fibres d'association. Risque élevé de syndrome parkinsonien vasculaire ou de déclin cognitif.", variant: 'destructive' };
        }
      }
    },
    {
      id: 'fisher',
      name: 'Classification de Fisher (Kassell modifiée)',
      acronym: 'Fisher',
      description: 'Évalue le risque de vasospasme cérébral secondaire après une hémorragie méningée par rupture anévrismale en fonction de l\'analyse TDM brute.',
      indications: 'Prise en charge initiale des hémorragies sous-arachnoïdiennes.',
      criteria: [
        { grade: 'Grade 1', label: 'Pas d\'hémorragie détectée', description: 'Suspicion clinique forte mais imagerie TDM non visualisable d\'emblée.' },
        { grade: 'Grade 2', label: 'Dépôt sanguin fin', description: 'Infiltration sous-arachnoïdienne diffuse de moins d\'1 mm d\'épaisseur. Pas de caillots focaux.' },
        { grade: 'Grade 3', label: 'Caillots sanguins épais', description: 'Accumulations de sang de plus d\'1 mm d\'épaisseur dans le plan vertical.' },
        { grade: 'Grade 4', label: 'Hémorragie intraventriculaire / intracérébrale', description: 'Infiltration parenchymateuse ou inondation des cavités ventriculaires.' }
      ]
    }
  ],
  'Imagerie ORL et cervico-faciale': [
    {
      id: 'fisch-paragangliome',
      name: 'Classification de Fisch (modif. Glasscock-Jackson)',
      acronym: 'Fisch',
      description: 'Stadification anatomique des paragangliomes tympalo-jugulaires en fonction de l\'extension locale à la base du crâne.',
      indications: 'Masses d\'allure vasculaire de l\'oreille moyenne et du foramen jugulaire.',
      criteria: [
        { grade: 'Classe A', label: 'Tympano-cleft', description: 'Tumeur strictement limitée au promontoire et à l\'oreille moyenne.' },
        { grade: 'Classe B', label: 'Hypotympanique', description: 'Extension de l\'oreille moyenne sans lyse de l\'os de la fosse jugulaire.' },
        { grade: 'Classe C', label: 'Destruction carotidienne', description: 'Lésion détruisant la fosse jugulaire et envahissant le canal carotidien.' },
        { grade: 'Classe D', label: 'Extension endocranienne', description: 'Extension intra-durale d\'importance diverse dans la fosse postérieure.' }
      ]
    }
  ],
  'Imagerie thoracique': [
    {
      id: 'fleischner',
      name: 'Critères Fleischner Society (Nodules)',
      acronym: 'Fleischner',
      description: 'Recommandations pour le suivi et la prise en charge des nodules pulmonaires solides identifiés de façon fortuite sur les examens TDM.',
      indications: 'Nodules fortuits solides chez les patients de plus de 35 ans sans antécédents de carcinome connu.',
      criteria: [
        { grade: 'Nodule < 6 mm', label: 'Faible risque : aucun suivi', description: 'Suivi CT optionnel à 12 mois si haut risque (tabagisme).' },
        { grade: 'Nodule 6 - 8 mm', label: 'Suivi TDM requis', description: 'CT à 6-12 mois, puis optionnellement à 18-24 mois pour s\'assurer de la stabilité.' },
        { grade: 'Nodule > 8 mm', label: 'Bilan approfondi', description: 'Considérer un TEP-Scan, une biopsie percutanée ou un contrôle rapproché à 3 mois.' }
      ]
    }
  ],
  'Imagerie cardiaque et vasculaire': [
    {
      id: 'stanford',
      name: 'Classification de Stanford (Aorte)',
      acronym: 'Stanford',
      description: 'Classification pronostique clinique et thérapeutique des dissections de l\'aorte thoracique en distinguant l\'atteinte ou non de l\'aorte ascendante.',
      indications: 'Syndrome aortique aigu (Dissection aortique objectivée en angioscanner).',
      criteria: [
        { grade: 'Type A', label: 'Atteinte de l\'aorte ascendante', description: 'La dissection implique l\'aorte ascendante (indépendamment du point d\'entrée d\'origine ou de l\'extension en aval).' },
        { grade: 'Type B', label: 'Atteinte exclusive de l\'aorte descendante', description: 'La dissection épargne totalement l\'aorte ascendante et l\'arc aortique.' }
      ],
      calculator: {
        title: 'Triage Rapide Syndrome Aortique Aigu',
        steps: [
          {
            question: 'Le trait de dissection ou le flap d\'intima implique-t-il l\'Aorte Ascendante (en amont de l\'artère sous-clavière gauche) ?',
            options: [
              { label: 'Oui, l\'aorte ascendante est directement intéressée', points: 1, value: 'A' },
              { label: 'Non, le flap débute exclusivement en aval du tronc brachio-céphalique ou de la sous-clavière', points: 2, value: 'B' }
            ]
          }
        ],
        calculateResult: (answers) => {
          const choice = answers[0] || 0;
          if (choice === 1) {
            return {
              score: "Stanford Type A",
              category: "URGENCE CHIRURGICALE ABSOLUE",
              comment: "Nécessite un transfert immédiat en bloc de chirurgie cardiaque pour remplacement de l'aorte ascendante (risque immédiat de tamponnade, d'infarctus ou de rupture). Éviter absolument la surcharge barométrique.",
              variant: 'destructive'
            };
          } else {
            return {
              score: "Stanford Type B",
              category: "URGENCE MÉDICALE INITIALE",
              comment: "Traitement médical conservateur de première intention consistant au contrôle drastique de la pression artérielle de l'insuffisance coronaire (bêtabloquants). Chirurgie (ou stent endovasculaire TEVAR) réservée aux complications ischémiques ou d'expansion anévrismale rapide.",
              variant: 'warning'
            };
          }
        }
      }
    }
  ],
  'Imagerie interventionnelle et vasculaire': [
    {
      id: 'bismuth-corlette',
      name: 'Classification de Bismuth-Corlette',
      acronym: 'Bismuth',
      description: 'Stadification chirurgicale et d\'imagerie des sténoses biliaires hilaires (Cholangiocarcinome ou tumeur de Klatskin) guidant la faisabilité d\'accès de drainage.',
      indications: 'Bilan pré-opératoire et pré-interventionnel des ictères obstructifs.',
      criteria: [
        { grade: 'Type I', label: 'Sous le confluent hilaire', description: 'Sténose de la voie biliaire principale hépaticholédocienne laissant un moignon de plus de 2 cm sain.' },
        { grade: 'Type II', label: 'Atteignant strictement la confluence', description: 'Sténose touchant le confluent hilaire biliaire principal sans obstruer les canaux droits et gauches.' },
        { grade: 'Type IIIa', label: 'Envahissement de la branche droite', description: 'Obstruction de la confluence hilaire s\'étendant au canal hépatique droit.' },
        { grade: 'Type IIIb', label: 'Envahissement de la branche gauche', description: 'Obstruction de la confluence hilaire s\'étendant au canal hépatique gauche.' },
        { grade: 'Type IV', label: 'Envahissement bilatéral', description: 'Obstruction bilatérale touchant la confluence et s\'étendant simultanément aux branches de division droites et gauches de second ordre.' }
      ]
    }
  ],
  'Imagerie ostéo-articulaire (musculo-squelettique)': [
    {
      id: 'schatzker',
      name: 'Classification de Schatzker (Tibias)',
      acronym: 'Schatzker',
      description: 'Division morphologique macroscopique des fractures du plateau tibial sur les radiographies de genou.',
      indications: 'Traumatisme à haute énergie du genou avec suspicion de tassement cortical tibial.',
      criteria: [
        { grade: 'Schatzker 1', label: 'Séparation pure du plateau externe', description: 'Fracture cunéiforme latérale sans enfoncement articulaire.' },
        { grade: 'Schatzker 2', label: 'Séparation + tassement externe', description: 'Enfoncement de la surface articulaire latérale associé au trait cortical externe.' },
        { grade: 'Schatzker 3', label: 'Tassement isolé du plateau externe', description: 'Enfoncement central pur des surfaces cartilagineuses externes sans fracture de la corticale.' },
        { grade: 'Schatzker 4', label: 'Fracture du plateau médial/interne', description: 'Atteinte isolée du compartiment interne (sémiologie plus grave, risque ligamentaire et poplité accrue).' },
        { grade: 'Schatzker 5', label: 'Fracture bicondylienne', description: 'Atteinte conjointe des plateaux médial et latéral avec conservation éventuelle du métaphysaire.' },
        { grade: 'Schatzker 6', label: 'Dissociation métaphyso-diaphysaire', description: 'Trait horizontal désolidarisant totalement l\'articulation fémorotibiale du fût diaphysaire tibial.' }
      ]
    }
  ],
  'Imagerie abdominale et digestive': [
    {
      id: 'balthazar',
      name: 'Score de Balthazar / Index CTS (Pancréate)',
      acronym: 'Balthazar',
      description: 'Score pronostique scanographique d\'évaluation de la gravité et des nécroses pancréatiques dans l\'évolution des pancréatites aiguës.',
      indications: 'évaluation par scanner de la pancréatite aiguë (généralement réalisé à 72 heures du début clinique).',
      criteria: [
        { grade: 'Grade A (0 pt)', label: 'Pancréas normal', description: 'Morphologie et rehaussement de la glande entièrement conservés.' },
        { grade: 'Grade B (1 pt)', label: 'Élargissement focal ou diffus', description: 'Glande hypertrophiée, contours flous. Pas de collection péri-pancréatique.' },
        { grade: 'Grade C (2 pts)', label: 'Infiltration de la graisse péri-pancréatique', description: 'Sémiologie d\'œdème dense ou de densification de la cloison graisseuse de voisinage.' },
        { grade: 'Grade D (3 pts)', label: 'Collection liquidienne unique', description: 'Présence d\'une seule collection de nécrose ou coulée de suc pancréatique suspectée.' },
        { grade: 'Grade E (4 pts)', label: 'Multiples collections ou présence de gaz', description: 'Présence d\'au moins deux collections extra-pancréatiques ou de bulles d\'air (surinfection d\'emblée).' }
      ],
      calculator: {
        title: 'Calculateur d\'Index de Gravité (CTSI)',
        steps: [
          {
            question: 'Quel est le grade de l\'atteinte pancréatique (classification Balthazar historique) ?',
            options: [
              { label: 'Grade A : Pancréas normal', points: 0, value: 'A' },
              { label: 'Grade B : Hypertrophie focale ou globale', points: 1, value: 'B' },
              { label: 'Grade C : Anomalies intrinsèques + inflammation péri-pancréatique', points: 2, value: 'C' },
              { label: 'Grade D : Collection liquidienne unique péri-pancréatique', points: 3, value: 'D' },
              { label: 'Grade E : Deux collections ou plus / présence de gaz intra ou extra-pancréatique', points: 4, value: 'E' }
            ]
          },
          {
            question: 'Quel est le taux estimé de nécrose parenchymateuse (rehaussement iodé injecté absent) ?',
            options: [
              { label: 'Absence de nécrose (0% de perte de rehaussement)', points: 0, value: 'N0' },
              { label: 'Nécrose modérée (< 30% du volume de la glande pancréatique)', points: 2, value: 'N30' },
              { label: 'Nécrose intermédiaire (30% à 50% du rehaussement)', points: 4, value: 'N50' },
              { label: 'Nécrose majeure (> 50% du tissu pancréatique d\'origine)', points: 6, value: 'N100' }
            ]
          }
        ],
        calculateResult: (answers) => {
          const scoreB = answers[0] || 0;
          const scoreN = answers[1] || 0;
          const totalScore = scoreB + scoreN;
          
          let morbidity = "Faible (~4%)";
          let mortality = "Très basse (~1%)";
          let risk = "Faible Gravité (CTSI discret)";
          let variant: 'success' | 'warning' | 'destructive' = 'success';

          if (totalScore >= 7) {
            morbidity = "Élevée (~92%)";
            mortality = "Tranchée (~17%)";
            risk = "SÉVÈRE (Pronostic aigu réservé)";
            variant = 'destructive';
          } else if (totalScore >= 4) {
            morbidity = "Intermédiaire (~35%)";
            mortality = "Modérée (~4%)";
            risk = "MODÉRÉE (Hospitalisation et surveillance renforcée)";
            variant = 'warning';
          }

          return {
            score: `${totalScore} / 10`,
            category: risk,
            comment: `Index de sévérité TDM (CTSI) : [Grade Balthazar : ${scoreB} pts + Nécrose : ${scoreN} pts]. Morbidité associée : ${morbidity}. Mortalité à court terme : ${mortality}.`,
            variant
          };
        }
      }
    }
  ],
  'Imagerie gynécologique': [
    {
      id: 'orads-eco',
      name: 'Classification O-RADS Échographie',
      acronym: 'O-RADS ECO',
      description: 'L\'échelle O-RADS (Ovarian-Adnexal Reporting and Data System) assiste à catégoriser le risque d\'oncogénèse ovarienne.',
      indications: 'Masses d\'allure annexielle ou ovarienne découvertes en échographie pelvienne.',
      criteria: [
        { grade: 'O-RADS 1', label: 'Catégorie physiologique', description: 'Follicule ovarien de base ou corps jaune normal chez la femme pré-ménopausée.' },
        { grade: 'O-RADS 2', label: 'Catégorie bénigne (< 1% néoplasie)', description: 'Kystes simples de moins de 10 cm uniloculaires lisses, kystes dermoïdes typiques.' },
        { grade: 'O-RADS 3', label: 'Faible risque (1% à 10%)', description: 'Kystes de plus de 10 cm, uniloculaires à parois épaissies ou multiloculaires sans végétations solides.' },
        { grade: 'O-RADS 4', label: 'Risque intermédiaire (10% à 50%)', description: 'Lésions multiloculaires à cloisons épaisses, ou composante solide sans hypervascularisation critique.' },
        { grade: 'O-RADS 5', label: 'Risque élevé (> 50%)', description: 'Présence de score doppler 4 (très vascularisé), végétation intra-kystique franche ou ascite associée.' }
      ]
    }
  ],
  'Imagerie urologique': [
    {
      id: 'bosniak',
      name: 'Classification de Bosniak (v2019)',
      acronym: 'Bosniak',
      description: 'Mécanisme clinique de gestion et de caractérisation des kystes rénaux au scanner injecté ou à l\'IRM.',
      indications: 'Kystes rénaux solitaires ou multiples de découverte fortuite.',
      criteria: [
        { grade: 'Catégorie I', label: 'Kyste bénin simple', description: 'Paroi d\'une finesse extrême, contenu homogène de densité hydrique (-10 à 20 Hounsfield). Pas de cloisons ni calcifications ni rehaussement.' },
        { grade: 'Catégorie II', label: 'Kyste bénin complexe minime', description: 'Quelques cloisons très fines (< 1mm), fines calcifications pariétales autorisées, kystes hyperdenses spontanés stables de moins de 3 cm.' },
        { grade: 'Catégorie II-F', label: 'Kyste à suivre (F = Follow-up)', description: 'Multiples cloisons fines, épaississement ou nodularité minime sans rehaussement décelable. Kyste hyperdense spontané de plus de 3 cm. Nécessite imagerie périodique.' },
        { grade: 'Catégorie III', label: 'Lésion indéterminée', description: 'Parois ou cloisons irrégulières et épaissies avec rehaussement iodé mesurable au scanner. (Environ 50% de malignité confirmée).' },
        { grade: 'Catégorie IV', label: 'Lésion maligne évidente', description: 'Composante solide volumineuse rehaussée à proximité du kyste ou s\'étendant aux structures pyramidales d\'excrétion (> 90% néoplasie).' }
      ],
      calculator: {
        title: 'Formulaire de calcul Bosniak v2019',
        steps: [
          {
            question: 'Quelles sont les caractéristiques morphologiques de la cloison ou de la paroi kystique ?',
            options: [
              { label: 'Paroi imperceptible (< 1 mm), homogène sans calcification ni cloison', points: 1, value: 'I' },
              { label: 'Cloison très fine unique, ou fines calcifications régulières', points: 2, value: 'II' },
              { label: 'Multiples fines cloisons ou rehaussement non franc mais net à l\'imagerie', points: 3, value: 'IIF' },
              { label: 'Paroi franchement épaissie (> 2 mm) avec rehaussement iodé évident', points: 4, value: 'III' },
              { label: 'Végétations tissulaires ou nodule de rehaussement intrakystique solide', points: 5, value: 'IV' }
            ]
          }
        ],
        calculateResult: (answers) => {
          const selection = answers[0] || 0;
          if (selection === 1) return { score: "Bosniak I", category: "Bénin pur (Zéro risque)", comment: "Absence totale de contrôle nécessaire ou de suivi." };
          if (selection === 2) return { score: "Bosniak II", category: "Bénin présumé (<1% risque)", comment: "Pas d'indication chirurgicale ni de suivi requis." };
          if (selection === 3) return { score: "Bosniak IIF", category: "Incertain (Suivi requis - ~5% risque)", comment: "Suivi échographique ou scanographique planifié à 6, 12 et 24 mois requis pour vérifier la stabilité.", variant: 'warning' };
          if (selection === 4) return { score: "Bosniak III", category: "Risque suspect (~50% néoplasique)", comment: "Indication d'exérèse chirurgicale conservatrice (néphrectomie partielle) ou d'ablation par radiofréquence en discussion interdisciplinaire.", variant: 'destructive' };
          return { score: "Bosniak IV", category: "Malignité quasi-certaine (>90% néphroblastome / carcinome)", comment: "Néphrectomie programmée de première intention sauf contre-indications cliniques majeures.", variant: 'destructive' };
        }
      }
    },
    {
      id: 'pi-rads',
      name: 'Diagnostic de la Prostate : PI-RADS v2.1',
      acronym: 'PI-RADS v2.1',
      description: 'Standardisation mondiale de l\'imagerie par résonance magnétique (IRM) multiparamétrique de détection du cancer cliniquement significatif de la prostate.',
      indications: 'IRM prostatique pour suspicion clinique ou biologique (élévation du PSA).',
      criteria: [
        { grade: 'PI-RADS 1', label: 'Cliniquement très peu probable', description: 'Absence d\'anomalie visible sur les séquences de diffusion (DWI), de perfusion (DCE) ou T2.' },
        { grade: 'PI-RADS 2', label: 'Peu de chance d\'agressivité', description: 'Anomalie systématisée d\'allure dysplasique ou d\'hyperplasie nodulaire pure.' },
        { grade: 'PI-RADS 3', label: 'Douteux / Indéterminé', description: 'Signal modéré ou intermédiaire ne qualifiant pas entièrement l\'aspect typique de malignité.' },
        { grade: 'PI-RADS 4', label: 'Probable néoplasie importante', description: 'Lésion focale de plus de 15 mm dans la zone périphérique ou transitionnelle à diffusion restrictive sévère.' },
        { grade: 'PI-RADS 5', label: 'Malignité très fort taux de suspicion', description: 'Lésion spiculée avec invasion extra-capsulaire franche ou invasion des vésicules séminales.' }
      ],
      calculator: {
        title: 'Aide à la Synthèse PI-RADS locale',
        steps: [
          {
            question: 'Où se situe précisément la lésion suspecte dominante ?',
            options: [
              { label: 'Zone Périphérique (PZ) - (Majorité des cancers)', points: 1, value: 'PZ' },
              { label: 'Zone Transitionnelle (TZ) - (Siège de l\'HBP)', points: 2, value: 'TZ' }
            ]
          },
          {
            question: 'Quel est l\'aspect sémiologique de la Lésion ?',
            options: [
              { label: 'Franche plage noire restrictif sur carte ADC (Coéff de diffusion ultra-bas)', points: 4, value: 'DWI_Severe' },
              { label: 'Infiltration modérée intermédiaire ou aspect nodulaire flou', points: 3, value: 'DWI_Moderate' },
              { label: 'Absence d\'anomalie focale en diffusion', points: 1, value: 'DWI_None' }
            ]
          }
        ],
        calculateResult: (answers) => {
          const zone = answers[0] || 0;
          const status = answers[1] || 0;

          if (status === 1) return { score: "PI-RADS 1 ou 2", category: "Suspicion très basse", comment: "Pas d'indication systématique de biopsie sur ces nodules ciblés." };
          if (status === 3) return { score: "PI-RADS 3", category: "Lésion Indéterminée", comment: "Bilan biologique à recouper. Biopsie ciblée recommandée seulement en présence de facteurs de risques majeurs.", variant: 'warning' };
          
          if (zone === 1) {
            return {
              score: "PI-RADS 4 / 5 (Zone Périphérique)",
              category: "HAUTEMENT RETROUVÉ/SUSPECT",
              comment: "Fort taux de restriction du coefficient d'extinction. Biopsie prostatique avec fusion d'image échographie-IRM fortement de première intention.",
              variant: 'destructive'
            };
          } else {
            return {
              score: "PI-RADS 4 (Zone Transitionnelle)",
              category: "FORTE PROBABILITÉ",
              comment: "Trait d'invasion du stroma antérieur suspect de carcinome de zone de transition. Consultation uro-oncologique indispensable.",
              variant: 'destructive'
            };
          }
        }
      }
    }
  ],
  'Imagerie sénologique': [
    {
      id: 'birads-mammographie',
      name: 'Classification BI-RADS de l\'ACR',
      acronym: 'ACR BI-RADS',
      description: 'Standardisation de la caractérisation des images mammographiques, échographiques et IRM de dépistage ou de prise en charge mammaire.',
      indications: 'Bilans systématiques de dépistage ou sénologie interventionnelle.',
      criteria: [
        { grade: 'ACR 0', label: 'Investigation incomplète', description: 'Clichés comparatifs ou échographie de complément indispensables pour pouvoir conclure.' },
        { grade: 'ACR 1', label: 'Mammographie normale', description: 'Seins symétriques, absence d\'opacité suspecte, de calcifications ou de distorsions architecturales.' },
        { grade: 'ACR 2', label: 'Anomalies bénignes évidentes', description: 'Fibroadénome calcifié typique, kyste simple à l\'échographie, calcifications vasculaires ou lipome pelvien.' },
        { grade: 'ACR 3', label: 'Anomalie très probablement bénigne', description: 'Opacité ronde isolée, microcalcifications rondes régulières peu nombreuses. [Surveillance rapprochée requise].' },
        { grade: 'ACR 4', label: 'Anomalie suspecte (3 sous-catégories)', description: 'Nécessite absolument une preuve d\'histopathologie (biopsie d\'aiguille percutanée sous guidage).' },
        { grade: 'ACR 5', label: 'Évocateur de malignité', description: 'Opacité spiculée stellaire, microcalcifications fines de forme irrégulière ou de morphologie linéaire.' }
      ],
      calculator: {
        title: 'Arbre Décisionnel ACR BI-RADS',
        steps: [
          {
            question: 'Quel est l\'aspect morphologique principal de la structure visible ?',
            options: [
              { label: 'Opacité stellaire, spiculée, ou microcalcifications polymorphes linéaires', points: 5, value: 'stellaire' },
              { label: 'Densité asymétrique nouvelle, contours flous, calcifications groupées suspectes', points: 4, value: 'flou' },
              { label: 'Opacité ronde / ovale régulière, contours lisses limités et stables', points: 3, value: 'lisse' },
              { label: 'Kyste hydrique simple ou calcifications macroscopiques rassurantes', points: 2, value: 'kyste' },
              { label: 'Examen de dépistage normal complet', points: 1, value: 'normal' }
            ]
          }
        ],
        calculateResult: (answers) => {
          const opt = answers[0] || 0;
          if (opt === 5) return { score: "ACR 5", category: "Haute suspicion de cancer (>95%)", comment: "Prélèvement histologique direct (microbiopsie / macrobiopsie) requise de première intention couplé à un bilan de bilan pré-thérapeutique.", variant: 'destructive' };
          if (opt === 4) return { score: "ACR 4", category: "Anomalie suspecte (2% - 95%)", comment: "Bilan par biopsie micro/macro obligatoire. L'évaluation histopathologique dictera l'urgence chirurgicale.", variant: 'destructive' };
          if (opt === 3) return { score: "ACR 3", category: "Probablement bénin (<2%)", comment: "Surveillance à intervalle rapproché (contrôle mammographique unilatéral à 6 mois). Si pérennisation, classification rétrogradée.", variant: 'warning' };
          if (opt === 2) return { score: "ACR 2", category: "Bénignant (Zéro risque clinique)", comment: "Continuer le dépistage triennal ou biennal de routine sans action spécifique.", variant: 'success' };
          return { score: "ACR 1", category: "Normal", comment: "Absence complète de lésions suspectées. Rangement standard dans le protocole national.", variant: 'success' };
        }
      }
    }
  ],
  'Imagerie oncologique': [
    {
      id: 'recist-criteria',
      name: 'Critères RECIST 1.1',
      acronym: 'RECIST 1.1',
      description: 'Lignes directrices d\'évaluation de l\'efficacité thérapeutique des antinéoplasiques sur la réponse des tumeurs solides en anatomopathologie scanographique.',
      indications: 'Essais cliniques et radiologie de référence oncologique.',
      criteria: [
        { grade: 'Response complète (CR)', label: 'Disparition de toutes les lésions cibles', description: 'Effondrement complet de toutes les masses suspectées de malignité.' },
        { grade: 'Réponse partielle (PR)', label: 'Diminution significative', description: 'Réduction d\'au moins 30 % de la somme des diamètres tumoraux de référence.' },
        { grade: 'Progression tumorale (PD)', label: 'Augmentation de la masse', description: 'Augmentation d\'au moins 20 % de la somme des diamètres de référence ou apparition de nouvelles lésions.' },
        { grade: 'Stagnation tumorale (SD)', label: 'Maladie stable', description: 'Infiltration sans changement significatif d\'exubérance de masse tumorale solide.' }
      ]
    }
  ]
};

export function Classifications() {
  const [activeSpecialty, setActiveSpecialty] = useState<ClassificationSpecialty>('Neuroradiologie');
  const [searchQuery, setSearchQuery] = useState('');
  const [expandedId, setExpandedId] = useState<string | null>(null);
  
  // Calculator state
  const [calculatorAnswers, setCalculatorAnswers] = useState<Record<string, Record<number, number>>>({});

  const listSpecialties: ClassificationSpecialty[] = [
    'Imagerie pédiatrique',
    'Neuroradiologie',
    'Imagerie ORL et cervico-faciale',
    'Imagerie thoracique',
    'Imagerie cardiaque et vasculaire',
    'Imagerie interventionnelle et vasculaire',
    'Imagerie ostéo-articulaire (musculo-squelettique)',
    'Imagerie abdominale et digestive',
    'Imagerie gynécologique',
    'Imagerie urologique',
    'Imagerie sénologique',
    'Imagerie oncologique'
  ];

  // Global search filtering
  const allClassificationsWithSpecialty = listSpecialties.flatMap(spec => 
    (classificationData[spec] || []).map(item => ({ ...item, specialty: spec }))
  );

  const filteredClassifications = searchQuery.trim() !== '' 
    ? allClassificationsWithSpecialty.filter(item => 
        item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.acronym?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.specialty.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : classificationData[activeSpecialty] || [];

  const handleSelectAnswer = (classId: string, stepIndex: number, optionPoints: number) => {
    setCalculatorAnswers(prev => {
      const clsAnswer = prev[classId] ? { ...prev[classId] } : {};
      clsAnswer[stepIndex] = optionPoints;
      return {
        ...prev,
        [classId]: clsAnswer
      };
    });
  };

  const handleResetCalculator = (classId: string) => {
    setCalculatorAnswers(prev => {
      const updated = { ...prev };
      delete updated[classId];
      return updated;
    });
  };

  return (
    <div id="classifications-root" className="bg-slate-50 min-h-screen py-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Top Header Card */}
        <div className="mb-10 text-center max-w-4xl mx-auto">
          <Badge variant="outline" className="mb-3 px-3 py-1 text-sky-600 border-sky-200 bg-sky-50 rounded-full font-semibold">
            RÉFÉRENCES SCIENTIFIQUES & GRILLES DE SCORE
          </Badge>
          <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight sm:text-4xl">
            Classifications Utiles en Imagerie Médicale
          </h1>
          <p className="mt-3 text-slate-600 text-base">
            Accédez rapidement aux index d'évaluation diagnostique reconnus par les sociétés savantes de radiologie.
          </p>

          {/* Search bar */}
          <div className="mt-8 flex max-w-xl mx-auto relative group">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-slate-400 group-focus-within:text-sky-500 transition-colors" />
            </div>
            <Input 
              id="classification-search"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Rechercher une classification (ex: Bosniak, Fazekas, BIRADS...)"
              className="py-6 pl-12 bg-white rounded-2xl shadow-sm border-slate-200 focus:border-sky-500 transition-all text-sm w-full"
            />
            {searchQuery && (
              <button onClick={() => setSearchQuery('')} className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600">
                Effacer
              </button>
            )}
          </div>
        </div>

        {searchQuery.trim() !== '' && (
          <div className="mb-6 flex items-center justify-between bg-sky-50 border border-sky-100 p-4 rounded-xl text-sky-900 text-sm max-w-7xl">
            <span>Résultats de recherche pour : <strong>"{searchQuery}"</strong> ({filteredClassifications.length} classifications trouvées)</span>
            <Button size="sm" variant="outline" onClick={() => setSearchQuery('')} className="bg-white border-sky-200 text-sky-700 hover:bg-sky-50 rounded-lg">
              Voir par spécialités
            </Button>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* LEFT SIDEBAR - List of Specialties (Desktop) or Horizontal Swipe (Mobile) */}
          {searchQuery.trim() === '' && (
            <div className="lg:col-span-4 bg-white border border-slate-200 rounded-2xl p-4 shadow-sm space-y-1">
              <h2 className="font-bold text-slate-400 text-xs uppercase tracking-widest pl-3 mb-3">Spécialités</h2>
              
              <div className="flex flex-col space-y-1">
                {listSpecialties.map((spec) => {
                  const isActive = activeSpecialty === spec;
                  const count = classificationData[spec]?.length || 0;
                  
                  return (
                    <button
                      key={spec}
                      onClick={() => {
                        setActiveSpecialty(spec);
                        setExpandedId(null);
                      }}
                      className={`w-full text-left px-3.5 py-3 rounded-xl text-xs font-bold uppercase tracking-wider transition-all flex items-center justify-between ${
                        isActive 
                          ? 'bg-sky-600 text-white shadow-md' 
                          : 'text-slate-600 hover:bg-slate-55 hover:bg-sky-50/50 hover:text-sky-600'
                      }`}
                    >
                      <span className="truncate pr-2">{spec}</span>
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${isActive ? 'bg-sky-500 text-white' : 'bg-slate-100 text-slate-500'}`}>
                        {count}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* RIGHT VIEWPORT - List of Classifications */}
          <div className={`${searchQuery.trim() === '' ? 'lg:col-span-8' : 'lg:col-span-12'} space-y-6`}>
            
            <AnimatePresence mode="wait">
              {filteredClassifications.length > 0 ? (
                <div className="space-y-6">
                  {filteredClassifications.map((item, idx) => {
                    const isExpanded = expandedId === item.id;
                    const classificationSpecialty = (item as any).specialty || activeSpecialty;
                    const answers = calculatorAnswers[item.id] || {};
                    const hasSelectedAllKeys = item.calculator ? Object.keys(answers).length === item.calculator.steps.length : false;

                    return (
                      <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: idx * 0.05 }}
                        key={item.id}
                        className="bg-white border border-slate-200 rounded-2xl shadow-sm hover:shadow-md transition-all overflow-hidden"
                      >
                        {/* Summary Header */}
                        <div 
                          className="p-6 cursor-pointer flex justify-between items-start gap-4 hover:bg-slate-50/40"
                          onClick={() => setExpandedId(isExpanded ? null : item.id)}
                        >
                          <div className="space-y-2">
                            <div className="flex items-center gap-2 flex-wrap">
                              <Badge variant="secondary" className="bg-sky-50 text-sky-700 hover:bg-sky-50 text-[10px] uppercase font-bold tracking-wider rounded-md">
                                {classificationSpecialty}
                              </Badge>
                              {item.acronym && (
                                <Badge className="bg-indigo-600 text-white text-[10px] uppercase tracking-wider">
                                  {item.acronym}
                                </Badge>
                              )}
                            </div>
                            <h3 className="text-xl font-bold text-slate-900">{item.name}</h3>
                            <p className="text-sm text-slate-500 leading-relaxed font-medium">
                              {item.description}
                            </p>
                          </div>
                          
                          <Button variant="ghost" size="sm" className="text-slate-400 hover:text-sky-600 self-center">
                            <ChevronRight className={`h-5 w-5 transform transition-transform duration-300 ${isExpanded ? 'rotate-90 text-sky-600' : ''}`} />
                          </Button>
                        </div>

                        {/* Extended details box */}
                        {isExpanded && (
                          <div className="border-t border-slate-100 bg-slate-50/50 p-6 space-y-6">
                            
                            {/* Indications */}
                            <div className="bg-white border rounded-xl p-4 text-xs font-semibold text-slate-600 shadow-sm flex items-start gap-2.5">
                              <Info className="h-4.5 w-4.5 text-sky-500 flex-shrink-0 mt-0.5" />
                              <div>
                                <span className="text-slate-800 font-bold block mb-0.5 uppercase tracking-wide">Indications Générales :</span>
                                <p className="font-normal text-slate-600">{item.indications}</p>
                              </div>
                            </div>

                            {/* Main Criteria Grids */}
                            <div className="space-y-3">
                              <h4 className="font-bold text-slate-800 text-sm tracking-wide uppercase flex items-center gap-1.5 pl-1">
                                <BookOpen className="h-4.5 w-4.5 text-indigo-500" />
                                <span>Règles d'évaluation sémiologiques</span>
                              </h4>
                              <div className="bg-white border rounded-xl overflow-hidden shadow-sm">
                                <table className="min-w-full divide-y divide-slate-150 text-left text-sm">
                                  <thead className="bg-slate-50 text-slate-500 uppercase tracking-widest text-[10px] font-extrabold">
                                    <tr>
                                      <th className="px-4 py-3 border-b border-slate-100">Grade / Score</th>
                                      <th className="px-4 py-3 border-b border-slate-100">Sémiologie</th>
                                      <th className="px-4 py-3 border-b border-slate-100">Description clinique</th>
                                    </tr>
                                  </thead>
                                  <tbody className="divide-y divide-slate-100 bg-white">
                                    {item.criteria.map((crt, i) => (
                                      <tr key={i} className="hover:bg-slate-50/50">
                                        <td className="px-4 py-3.5 whitespace-nowrap">
                                          <span className="font-bold text-slate-900 bg-slate-100 px-2.5 py-1 rounded-md text-xs font-mono">
                                            {crt.grade}
                                          </span>
                                        </td>
                                        <td className="px-4 py-3.5 font-bold text-slate-800 text-xs">
                                          {crt.label}
                                        </td>
                                        <td className="px-4 py-3.5 text-xs text-slate-600 leading-relaxed font-normal">
                                          {crt.description}
                                        </td>
                                      </tr>
                                    ))}
                                  </tbody>
                                </table>
                              </div>
                            </div>

                            {/* Optional Calculator widget */}
                            {item.calculator && (
                              <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm space-y-4">
                                <div className="flex items-center justify-between border-b pb-3">
                                  <div className="flex items-center gap-1.5">
                                    <Calculator className="h-5 w-5 text-sky-500" />
                                    <h4 className="font-bold text-slate-800 text-sm uppercase tracking-wide">
                                      {item.calculator.title}
                                    </h4>
                                  </div>
                                  <button onClick={() => handleResetCalculator(item.id)} className="text-slate-400 hover:text-slate-600 text-xs flex items-center gap-1 font-semibold">
                                    <RotateCcw className="h-3.5 w-3.5" />
                                    <span>Réinitialiser</span>
                                  </button>
                                </div>

                                <div className="space-y-4">
                                  {item.calculator.steps.map((stp, stepIdx) => (
                                    <div key={stepIdx} className="space-y-2">
                                      <p className="text-xs font-bold text-slate-700">{stp.question}</p>
                                      <div className="grid grid-cols-1 gap-1.5">
                                        {stp.options.map((opt, optIdx) => {
                                          const isSelected = answers[stepIdx] === opt.points;
                                          return (
                                            <button
                                              key={optIdx}
                                              onClick={() => handleSelectAnswer(item.id, stepIdx, opt.points)}
                                              className={`w-full text-left px-3 py-2.5 rounded-lg text-xs font-medium border transition-all flex items-center justify-between ${
                                                isSelected 
                                                  ? 'bg-sky-50 border-sky-400 text-sky-800 font-semibold' 
                                                  : 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100'
                                              }`}
                                            >
                                              <span>{opt.label}</span>
                                              <div className="flex items-center gap-2">
                                                {isSelected ? <Check className="h-4 w-4 text-sky-600 stroke-[3px]" /> : <div className="w-4 h-4 border rounded-full bg-white" />}
                                              </div>
                                            </button>
                                          );
                                        })}
                                      </div>
                                    </div>
                                  ))}
                                </div>

                                {/* Results display */}
                                {hasSelectedAllKeys && (() => {
                                  const result = item.calculator!.calculateResult(answers);
                                  return (
                                    <div className={`p-4 rounded-xl border mt-4 text-xs ${
                                      result.variant === 'destructive' 
                                        ? 'bg-rose-50 border-rose-200 text-rose-900' 
                                        : result.variant === 'warning'
                                          ? 'bg-amber-50 border-amber-200 text-amber-900'
                                          : 'bg-emerald-50 border-emerald-200 text-emerald-900'
                                    }`}>
                                      <div className="flex items-center gap-2 mb-1.5">
                                        <Sparkles className="h-4.5 w-4.5 text-indigo-500 animate-pulse" />
                                        <span className="font-extrabold uppercase">Synthèse et Recommandation :</span>
                                      </div>
                                      <p className="font-black text-sm mb-1">{result.score} — {result.category}</p>
                                      <p className="leading-relaxed font-normal">{result.comment}</p>
                                    </div>
                                  );
                                })()}
                              </div>
                            )}

                          </div>
                        )}
                      </motion.div>
                    );
                  })}
                </div>
              ) : (
                <div className="text-center py-16 bg-white rounded-2xl border border-dashed border-slate-200 p-8 shadow-sm">
                  <AlertCircle className="h-10 w-10 text-slate-300 mx-auto mb-3" />
                  <p className="text-slate-800 font-bold text-base mb-1">Aucune classification correspondante</p>
                  <p className="text-slate-500 text-xs max-w-sm mx-auto">Vérifiez l'orthographe du nom ou essayez d'autres mots-clefs thérapeutiques dans la barre de recherche au-dessus.</p>
                </div>
              )}
            </AnimatePresence>

          </div>

        </div>

      </div>
    </div>
  );
}
