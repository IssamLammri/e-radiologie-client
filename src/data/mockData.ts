import { Case, Course, UserStats } from '../types';

export const mockCases: Case[] = [
  {
    id: '1',
    title: 'Pneumonie lobaire franche aiguë',
    specialty: 'Imagerie thoracique',
    modality: 'Radiographie',
    difficulty: 'Débutant',
    previewImage: 'https://images.unsplash.com/photo-1579684385127-1ef15d508118?auto=format&fit=crop&q=80&w=800',
    images: ['https://images.unsplash.com/photo-1579684385127-1ef15d508118?auto=format&fit=crop&q=80&w=1200'],
    tags: ['Poumons', 'Infection', 'Urgence'],
    author: 'Dr BOUMERTA',
    date: '2023-10-15',
    status: 'Vérifié',
    patientInfo: { age: '45 ans', gender: 'M', clinicalContext: 'Fièvre à 39°C, toux grasse, douleur basithoracique droite depuis 3 jours.' },
    description: 'Radiographie thoracique de face réalisée au lit du patient.',
    questions: [
      { question: "Quelle est l'anomalie principale ?", explanation: "Opacité alvéolaire systématisée du lobe inférieur droit avec bronchogramme aérique." }
    ],
    diagnosis: 'Pneumonie lobaire inférieure droite.',
    discussion: "Le foyer alvéolaire avec bronchogramme aérique est typique d'une pneumonie bactérienne, souvent à Pneumocoque.",

    keyPoints: ['Opacité alvéolaire', 'Bronchogramme aérique', 'Systématisation lobaire'],
    references: ['Collège des Enseignants de Radiologie de France (CERF)']
  },
  {
    id: '2',
    title: 'AVC ischémique sylvien',
    specialty: 'Neuroradiologie',
    modality: 'IRM',
    difficulty: 'Intermédiaire',
    previewImage: 'https://images.unsplash.com/photo-1559757175-9c5950b71d9d?auto=format&fit=crop&q=80&w=800',
    images: ['https://images.unsplash.com/photo-1559757175-9c5950b71d9d?auto=format&fit=crop&q=80&w=1200'],
    tags: ['Cerveau', 'Vasculaire', 'Urgence'],
    author: 'Dr. Martin',
    date: '2023-11-02',
    status: 'Vérifié',
    patientInfo: { age: '68 ans', gender: 'F', clinicalContext: 'Hémiplégie droite brutale et aphasie survenues il y a 2 heures.' },
    description: 'IRM cérébrale protocole AVC (Diffusion, FLAIR, T2*, TOF).',
    questions: [
      { question: 'Que montre la séquence de diffusion ?', explanation: 'Hyper-signal franc du territoire sylvien gauche, traduisant un œdème cytotoxique précoce.' }
    ],
    diagnosis: "Infarctus cérébral ischémique aigu dans le territoire de l'artère cérébrale moyenne gauche.",
    discussion: "L'IRM est l'examen de référence à la phase aiguë. Le mismatch Diffusion/FLAIR signe une lésion de moins de 4,5h.",
    keyPoints: ["Hypersignal Diffusion", "Chute de l'ADC", 'Mismatch FLAIR'],
    references: ["Recommandations HAS - Prise en charge initiale de l'AVC"]
  },
  {
    id: '3',
    title: 'Appendicite aiguë',
    specialty: 'Imagerie abdominale et digestive',
    modality: 'TDM',
    difficulty: 'Débutant',
    previewImage: 'https://images.unsplash.com/photo-1516549655169-df83a0774514?auto=format&fit=crop&q=80&w=800',
    images: ['https://images.unsplash.com/photo-1516549655169-df83a0774514?auto=format&fit=crop&q=80&w=1200'],
    tags: ['Digestif', 'Urgence', 'Inflammation'],
    author: 'Dr. Lemaire',
    date: '2024-01-20',
    status: 'Vérifié',
    patientInfo: { age: '22 ans', gender: 'M', clinicalContext: 'Douleur en fosse iliaque droite, défense, hyperleucocytose.' },
    description: 'Scanner abdomino-pelvien injecté au temps portal.',
    questions: [
      { question: "Quels sont les signes tomodensitométriques d'appendicite ?", explanation: "Appendice > 6mm, paroi épaissie et rehaussée, infiltration de la graisse péri-appendiculaire, présence possible d'un stercolithe." }
    ],
    diagnosis: 'Appendicite aiguë non compliquée.',
    discussion: "Le scanner est très performant, particulièrement chez l'adulte, pour confirmer le diagnostic et éliminer des complications (abcès, perforation).",
    keyPoints: ['Diamètre > 6mm', 'Infiltration de la graisse', 'Stercolithe'],
    references: ["Société d'Imagerie Abdominale et Digestive (SIAD)"]
  },
  {
    id: '4',
    title: 'Rupture LCA',
    specialty: 'Imagerie ostéo-articulaire (musculo-squelettique)',
    modality: 'IRM',
    difficulty: 'Intermédiaire',
    previewImage: 'https://images.unsplash.com/photo-1583454110551-21f2fa2afe61?auto=format&fit=crop&q=80&w=800',
    images: ['https://images.unsplash.com/photo-1583454110551-21f2fa2afe61?auto=format&fit=crop&q=80&w=1200'],
    tags: ['Genou', 'Ligament', 'Trauma'],
    author: 'Dr. Chen',
    date: '2024-02-10',
    status: 'Vérifié',
    patientInfo: { age: '28 ans', gender: 'F', clinicalContext: 'Traumatisme du genou au ski. Craquement ressenti, hémarthrose.' },
    description: 'IRM du genou droit.',
    questions: [
      { question: "Où se situe l'anomalie sur les coupes sagittales ?", explanation: "Interruption des fibres du Ligament Croisé Antérieur (LCA) avec un aspect horizontalisé du moignon distal." }
    ],
    diagnosis: 'Rupture complète du ligament croisé antérieur.',
    discussion: "Rechercher des lésions associées fréquentes : contusion osseuse (kissing lesion du condyle externe et plateau tibial postérieur), lésion méniscale.",
    keyPoints: ['Interruption des fibres', 'Contusion osseuse', 'Tiroir antérieur IRM'],
    references: ["Société Française d'Imagerie Musculo-Squelettique (SIMS)"]
  },
  {
    id: '5',
    title: 'Lithiase vésiculaire multi-symptomatique',
    specialty: 'Imagerie abdominale et digestive',
    modality: 'Échographie',
    difficulty: 'Débutant',
    previewImage: 'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&q=80&w=800',
    images: ['https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&q=80&w=1200'],
    tags: ['Echographie', 'Vésicule', 'Gastroentérologie'],
    author: 'Dr. Fontaine',
    date: '2024-03-05',
    status: 'Vérifié',
    patientInfo: { age: '55 ans', gender: 'F', clinicalContext: 'Colique hépatique post-prandiale' },
    description: 'Échographie abdominale sous-costale.',
    questions: [
        { question: "Quel signe ultrasonore est caractéristique de la lithiase ?", explanation: "Image hyperéchogène avec un cône d'ombre postérieur franc."}
    ],
    diagnosis: 'Multiples calculs vésiculaires sans signe de cholécystite aiguë.',
    discussion: "L'échographie est l'examen de première intention. Il faut s'assurer de l'absence d'épaississement de la paroi vésiculaire (>3mm) et de l'absence de douleur au passage de la sonde (signe de Murphy échographique).",
    keyPoints: ['Hyperéchogène', "Cône d'ombre postérieur", 'Mobile'],
    references: ['CERF']
  },
  {
    id: '6',
    title: 'Embolie pulmonaire massive',
    specialty: 'Imagerie thoracique',
    modality: 'TDM',
    difficulty: 'Expert',
    previewImage: 'https://images.unsplash.com/photo-1530497610245-94d3c16cda28?auto=format&fit=crop&q=80&w=800',
    images: ['https://images.unsplash.com/photo-1530497610245-94d3c16cda28?auto=format&fit=crop&q=80&w=1200'],
    tags: ['Angioscanner', 'Urgence vitale', 'Cardiovasculaire'],
    author: 'Dr. Rousseau',
    date: '2024-03-12',
    status: 'Vérifié',
    patientInfo: { age: '72 ans', gender: 'M', clinicalContext: "Dyspnée d'apparition brutale, douleur thoracique, désaturation post-opératoire." },
    description: 'Angioscanner thoracique artériel pulmonaire.',
    questions: [
        { question: "Quel est l'impact clinique d'un aspect « en selle » ?", explanation: "Un thrombus à la bifurcation du tronc de l'artère pulmonaire (en selle) indique souvent une embolie pulmonaire grave avec risque de défaillance ventriculaire droite." }
    ],
    diagnosis: 'Embolie pulmonaire bilatérale proximale avec thrombus "en selle". Signes de cœur pulmonaire aigu.',
    discussion: "Evaluer la sévérité sur l'angioscanner : ratio VD/VG > 1, bombement du septum interventriculaire, reflux du contraste dans la VCI.",
    keyPoints: ['Défect de rehaussement artériel', 'Thrombus en selle', 'Cœur pulmonaire aigu'],
    references: ['Guidelines ESC Embolie Pulmonaire']
  }
];

export const mockCourses: Course[] = [
  {
    id: '100',
    title: "Ischémie Cérébrale : Imagerie dans l'AVC Aigu",
    subtitle: "Protocole d'imagerie multimodal TDM & IRM dans l'évaluation de l'ischémie cérébrale hyper-précoce",
    category: 'Neuroradiologie',
    duration: '2h 15m',
    level: 'Intermédiaire',
    chaptersCount: 6,
    progress: 0,
    image: 'https://images.unsplash.com/photo-1559757175-9c5950b71d9d?auto=format&fit=crop&w=800&q=80',
    type: 'theorique',
    authors: 'Dr Robin Smithuis, Dr Julie Sommer',
    affiliation: "Département de Radiologie - CHU & Radiology Assistant Educational Foundation",
    publishedAt: '12 Janvier 2024',
    updatedAt: '18 Mai 2024',
    introduction: "L'imagerie dans l'accident vasculaire cérébral ischémique aigu (AVC) a connu une révolution majeure avec l'avènement de la thrombectomie mécanique et des fenêtres thérapeutiques étendues. L'objectif fondamental de l'imagerie en urgence est quadruple : exclure une hémorragie intracrânienne, confirmer l'occlusion d'un gros vaisseau artériel (LVO), quantifier l'étendue du cœur nécrotique (ASPECTS / Volume de core) et identifier le tissu cérébral sauvable en pénombre ischémique.",
    keyTakeaways: [
      "Règle d'or « Time is Brain » : 1.9 million de neurones sont détruits chaque minute d'ischémie non reperfusée.",
      "TDM sans injection (NCCT) : recherche précoce du signe de l'artère hyperdense, effacement du ruban insulaire et calcul de l'ASPECTS (≥ 6 requis).",
      "Angio-TDM (CTA) : indispensable pour cartographier le site d'occlusion de M1/M2/T-carotidien et évaluer la circulation collatérale piale.",
      "Scanner de Perfusion (CTP) : différencie le cœur ischémique infarci irréversible (CBF < 30%) de la zone de pénombre réversible (Tmax > 6s).",
      "IRM cérébrale de référence : le mismatch Diffusion (DWI) / FLAIR permet de dater l'ischémie (< 4.5h) en cas d'AVC au réveil (Wake-Up Stroke)."
    ],
    chapters: [
      {
        title: "1. Introduction & Objectifs de l'Imagerie en Urgence",
        subtitle: "Rôle pivot du radiologue dans la chaîne d'alerte neuro-vasculaire",
        content: "La prise en charge de l'AVC ischémique aigu repose sur une course contre la montre. La revascularisation rapide par thrombolyse intraveineuse (altéplase ou ténectéplase < 4.5h) et/ou par thrombectomie mécanique endovasculaire (< 6h et jusqu'à 24h selon critères de mismatch) permet de réduire drastiquement la mortalité et le handicap résiduel.\n\nLe rôle de l'imagerie multimodale (TDM avec CTA/CTP ou IRM AVC) est de répondre sans délai aux questions décisionnelles :",
        pearls: [
          "Exclure formellement l'hémorragie cérébrale méningée ou intraparenchymateuse.",
          "Confirmer la présence d'une occlusion artérielle proximale accessible au geste endovasculaire.",
          "Estimer le volume de tissu cérébral déjà infarci (cœur nécrotique) pour limiter le risque de transformation hémorragique secondaire.",
          "Démontrer la persistance d'une pénombre ischémique hypoperfusée mais viable."
        ],
        tables: [
          {
            title: "Fenêtres Thérapeutiques & Critères d'Imagerie d'Éligibilité",
            headers: ["Modalité / Thérapeutique", "Fenêtre Temporelle", "Critères d'Imagerie Requis", "Contre-indications Clés"],
            rows: [
              ["Thrombolyse IV (r-tPA)", "< 4.5 heures", "Absence d'hémorragie au scanner/IRM, infarctus < 1/3 territoire ACM", "Hémorragie active, infarctus étendu établi"],
              ["Thrombectomie Mécanique", "< 6 heures", "Occlusion LVO (T-carotidien, M1, Tronc basilaire), ASPECTS ≥ 6", "Hémorragie, core ischémique massif (ASPECTS < 3)"],
              ["Thrombectomie Élargie (DAWN / DEFUSE 3)", "6 à 24 heures", "Mismatch Perfusion/Core (CTP) ou Mismatch DWI/Clinique", "Absence de pénombre salvageable, core volume > 70 ml"],
              ["AVC au réveil (Wake-Up)", "Heure inconnue", "Mismatch Diffusion (Positif) / FLAIR (Négatif)", "Prise de contraste ou hypersignal FLAIR franc"]
            ]
          }
        ]
      },
      {
        title: "2. Scanner Cérébral Sans Injection (NCCT) & Signes Précoces",
        subtitle: "Détection des stigmates précoces d'ischémie parenchymateuse et score ASPECTS",
        content: "Le scanner crânien sans préparation (NCCT) est l'examen de première intention le plus accessible en urgence. Il élimine d'emblée l'hématome intracrânien spontané (qui apparaît sous forme d'une hyperdensité spontanée spontanément visible entre 60 et 80 UH).\n\nDans les 3 à 6 premières heures de l'ischémie, le scanner peut paraître subnormal ou ne montrer que des signes subtils d'œdème cytotoxique (baisse précoce de 2 à 4 UH liée à l'accumulation d'eau intracellulaire) :\n\n- **Signe de la corde / artère hyperdense (Dense MCA Sign)** : hyperdensité spontanée du tronc de l'artère cérébrale moyenne (ACM / M1) ou de l'artère basilaire, traduisant le caillot fibrino-cruorique intraluminal.\n- **Effacement du ruban insulaire (Insular Ribbon Sign)** : disparition de la différenciation entre le cortex de l'insula et la capsule extrême en raison de la vulnérabilité microvasculaire du cortex insulaire.\n- **Atténuation du noyau lenticulaire** : effacement des contours du putamen et du globus pallidus.\n- **Dédifférenciation substance blanche / substance grise corticale** et effacement unilatéral des sillons corticaux sylviens.",
        pearls: [
          "Le signe de l'artère cérébrale moyenne hyperdense a une spécificité > 90% pour l'occlusion aiguë de M1.",
          "Attention aux faux positifs de l'artère hyperdense : calcifications pariétales athéromateuses (bilatérales), hématocrite élevée (> 50%).",
          "Toujours ajuster le fenêtrage scannographique (fenêtre étroite : C=30-35 UH, W=30-40 UH) pour démasquer l'œdème précoce."
        ],
        figures: [
          {
            url: "https://images.unsplash.com/photo-1559757175-9c5950b71d9d?auto=format&fit=crop&w=900&q=80",
            label: "Figure 1 : Signe précoce TDM",
            legend: "TDM sans injection montrant une atténuation du ruban insulaire gauche et une hyperdensité spontanée du segment M1 de l'artère cérébrale moyenne (flèche). ASPECTS évalué à 8/10."
          }
        ],
        tables: [
          {
            title: "Calcul du Score ASPECTS (Alberta Stroke Program Early CT Score)",
            headers: ["Région Anatomique Évaluée", "Plan de Coupe", "Déduction de Points si Hypodensité", "Impact Clinique"],
            rows: [
              ["Caudé (C), Lenticulaire (L), Capsule interne (IC)", "Niveau des Noyaux Gris", "1 point par structure atteinte", "Atteinte profonde motrice"],
              ["Cortex Insulaire (I)", "Niveau des Noyaux Gris", "1 point", "Signe le plus précoce d'ischémie sylvienne"],
              ["Cortex M1 (Antérieur), M2 (Latéral), M3 (Postérieur)", "Niveau Ganglions de la base", "1 point par territoire", "Territoire superficiel inférieur"],
              ["Cortex M4, M5, M6", "Niveau Supraganglionnaire", "1 point par territoire", "Territoire sylvien supérieur"],
              ["Total du Score", "10 régions au total", "Score = 10 - nombre de zones atteintes", "Score ≥ 6 : bon pronostic / éligible thrombectomie"]
            ]
          }
        ]
      },
      {
        title: "3. Angioscanner (CTA) & Occlusion de Gros Vaisseau (LVO)",
        subtitle: "Cartographie artérielle des troncs supra-aortiques et évaluation des collatérales",
        content: "L'angioscanner spiralé (du crosse aortique jusqu'au vertex) est indispensable dès la phase initiale. Il permet d'identifier avec précision :\n\n1. **Le siège exact de l'occlusion artérielle (LVO)** : terminaison de la carotide interne (T carotidien), premier (M1) ou deuxième (M2) segment de l'artère cérébrale moyenne, artère basilaire ou carotide cervicale.\n2. **La longueur du thrombus (Clot Burden Score)** : un thrombus long (> 8-10 mm) ne répond que très rarement à la seule thrombolyse intraveineuse et requiert un geste d'extraction mécanique immédiat.\n3. **La qualité du réseau collatéral leptoméningé (Pial Collaterals)** : une excellente circulation collatérale maintient la pénombre ischémique viable pendant plusieurs heures et préserve le score ASPECTS.\n4. **La pathologie de paroi sous-jacente** : sténose athéromateuse carotidienne ulcérée, dissection de l'artère carotide interne (signe de la double lumière ou hématome de paroi intramural) ou boucle artérielle complexe.",
        pearls: [
          "L'angioscanner multiphasique permet d'évaluer le retard de remplissage collatéral au temps veineux sans surdose d'injection.",
          "Une occlusion en tandem (sténose/dissection carotidienne cervicale + occlusion M1 intracrânienne) nécessite une stratégie combinée stenting + thrombectomie."
        ],
        figures: [
          {
            url: "https://images.unsplash.com/photo-1530497610245-94d3c16cda28?auto=format&fit=crop&w=900&q=80",
            label: "Figure 2 : Angio-TDM 3D MIP",
            legend: "Angioscanner artériel montrant un arrêt brutal de produit de contraste au niveau du segment M1 proximal gauche (flèche rouge) avec retard de rehaussement des collatérales distales M2/M3."
          }
        ]
      },
      {
        title: "4. Scanner de Perfusion (CTP) & Concept de Pénombre",
        subtitle: "Différenciation formelle entre cœur d'infarctus irréversible et zone de pénombre sauvable",
        content: "Le scanner de perfusion cérébrale (CTP) analyse le premier passage dynamique d'un bolus de produit de contraste iodé à travers le réseau capillaire cérébral. Il génère quatre cartographies hémodynamiques fondamentales :\n\n- **CBV (Cerebral Blood Volume)** : volume sanguin cérébral en ml/100g de tissu.\n- **CBF (Cerebral Blood Flow)** : débit sanguin cérébral en ml/100g/min.\n- **MTT (Mean Transit Time)** : temps de transit moyen du bolus à travers les capillaires.\n- **Tmax (Time to Maximum)** : retard d'arrivée du pic de contraste (seuil pathologique critique : Tmax > 6 secondes).\n\n**Le diagnostic de Mismatch Ischémique :**\n- **Cœur d'infarctus (Ischemic Core)** : zone de nécrose tissulaire irréversible, définie par une chute sévère du CBF (< 30% par rapport à l'hémisphère sain contralatéral) et un CBV effondré.\n- **Pénombre Ischémique (Salvageable Penumbra)** : tissu cérébral hypoperfusé mais encore vivant grâce à la suppléance collatérale (Tmax > 6s ou MTT prolongé, mais avec CBV normal ou paradoxalement élevé par vasodilatation compensatrice).\n- **Mismatch Ratio** = Volume hypoperfusé (Tmax > 6s) / Volume du cœur nécrotique (CBF < 30%). Un ratio ≥ 1.8 avec un volume de pénombre ≥ 15 ml justifie pleinement la revascularisation au-delà de 6 heures (critères DEFUSE 3).",
        pearls: [
          "Core Ischémique = CBF < 30% (tissu perdu, ne peut plus être récupéré).",
          "Pénombre Ischémique = Mismatch entre Tmax > 6s et Core (tissu à sauver en urgence).",
          "Un volume de core > 70-100 ml est associé à un risque majeur de transformation hémorragique et d'œdème malin."
        ],
        tables: [
          {
            title: "Interprétation des Cartographies de Perfusion CTP",
            headers: ["Paramètre Hémodynamique", "Tissu Cérébral Sain", "Pénombre Ischémique (Viable)", "Cœur d'Infarctus (Nécrose)"],
            rows: [
              ["CBF (Débit)", "50-60 ml/100g/min", "Diminué modérément (30-50%)", "Effondré (< 30%)"],
              ["CBV (Volume)", "4-5 ml/100g", "Normal ou Augmenté (Vasodilatation)", "Effondré (< 2 ml/100g)"],
              ["MTT / Tmax", "MTT normal (~4s), Tmax < 2s", "Très prolongé (Tmax > 6s)", "Prolongé ou indéterminé"],
              ["Potentiel Thérapeutique", "Normal", "Sauvable si reperfusion immédiate", "Tissu nécrosé irréversible"]
            ]
          }
        ]
      },
      {
        title: "5. IRM Cérébrale dans l'AVC Aigu (Protocole AVC)",
        subtitle: "L'examen de référence pour la sensibilité diagnostique et la datation d'ischémie",
        content: "L'IRM est la modalité la plus sensible pour le diagnostic positif d'AVC ischémique dès les 15 premières minutes. Le protocole d'urgence standardisé (« Protocole Stroke ») comprend 4 séquences rapides réalisables en moins de 8 minutes :\n\n1. **Séquence de Diffusion (DWI) & Coefficient de Diffusion Apparent (ADC)** :\n   - L'œdème cytotoxique bloque le mouvement microscopique de l'eau, entraînant un **hypersignal précoce et franc en Diffusion (b1000)** associé à un **hyposignal noir sur la cartographie ADC**.\n   - Confirme l'ischémie aiguë dès la 15ème minute avec une sensibilité de 99%.\n\n2. **Séquence FLAIR & Concept de Mismatch Diffusion / FLAIR** :\n   - L'œdème vasogénique visible en hypersignal FLAIR ne se développe qu'après 3 à 4 heures d'ischémie.\n   - **Mismatch Diffusion-FLAIR** (Hypersignal franc en Diffusion SANS anomalie visible sur le FLAIR) : signe formel que l'infarctus date de moins de 4.5 heures ! C'est la clé de décision pour thrombolyser les AVC au réveil (Wake-Up Stroke / heure de début inconnue).\n\n3. **Séquence T2* (Écho de Gradient) ou SWI (Susceptibility Weighted Imaging)** :\n   - Élimine tout micro-saignement intracrânien (hyposignal de susceptibilité magnétique de l'hémosidérine).\n   - Révèle le signe direct du thrombus artériel (« Susceptibility Vessel Sign »).\n\n4. **Angio-IRM 3D-TOF (Time of Flight) sans injection** :\n   - Visualise immédiatement l'amputation du flux artériel dans l'artère cérébrale moyenne ou le tronc basilaire.",
        pearls: [
          "Hypersignal Diffusion + Hypo ADC = Ischémie aiguë vraie (œdème cytotoxique).",
          "Hypersignal Diffusion + ADC normal = Phénomène de T2 shine-through (pas d'ischémie aiguë récente).",
          "Mismatch Diffusion(+) / FLAIR(-) = AVC survenu il y a < 4h30 (indication à la thrombolyse validée par l'essai WAKE-UP)."
        ],
        figures: [
          {
            url: "https://images.unsplash.com/photo-1559757175-9c5950b71d9d?auto=format&fit=crop&w=900&q=80",
            label: "Figure 3 : Mismatch Diffusion / FLAIR",
            legend: "IRM cérébrale chez un patient de 68 ans présentant un déficit neurologique au réveil. A : Séquence de diffusion (DWI) montrant un hypersignal franc pariétal gauche. B : Séquence FLAIR normale sans signal pathologique (Mismatch positif = AVC < 4.5h éligible au traitement)."
          }
        ]
      },
      {
        title: "6. Algorithme Décisionnel & Synthèse Pratique",
        subtitle: "Checklist de validation du compte rendu radiologique d'urgence neuro-vasculaire",
        content: "En situation d'urgence vitale, le radiologue doit structurer son compte rendu d'imagerie neuro-vasculaire de façon standardisée pour que l'équipe de neurologie et de neuroradiologie interventionnelle puisse agir en quelques secondes :\n\n- **1. Hémorragie** : Présence ou absence formelle de saignement intracrânien ou méningé.\n- **2. Diagnostic positif & Territoire** : Siège de l'ischémie (ACM gauche/droite, ACA, ACP, Tronc basilaire, Cervelet).\n- **3. Occlusion vasculaire (LVO)** : Artère occluse (Carotide interne, M1, M2, P1, P2, Basilaire) et état des collatérales.\n- **4. Quantification du Core** : Score ASPECTS sur le TDM (ou volume DWI sur l'IRM).\n- **5. Mismatch & Éligibilité** : Mismatch CTP (Pénombre / Core) ou Mismatch IRM (DWI / FLAIR).",
        pearls: [
          "Toujours communiquer immédiatement le résultat par téléphone au neurologue de garde.",
          "Noter scrupuleusement l'heure exacte de réalisation des coupes d'imagerie dans le compte rendu d'urgence."
        ]
      }
    ]
  },
  {
    id: '101',
    title: 'Introduction à la radiographie thoracique',
    subtitle: "Maîtriser les critères de qualité, l'analyse méthodique et la sémiologie des grands syndromes pulmonaires",
    category: 'Imagerie thoracique',
    duration: '1h',
    level: 'Débutant',
    chaptersCount: 3,
    progress: 100,
    image: 'https://images.unsplash.com/photo-1516549655169-df83a0774514?auto=format&fit=crop&w=400&q=80',
    type: 'theorique',
    authors: 'Collège des Enseignants de Radiologie de France (CERF)',
    affiliation: 'Société Française de Radiologie & Imagerie Médicale',
    publishedAt: '15 Février 2024',
    introduction: "La radiographie pulmonaire de face demeure l'examen d'imagerie médicale de première intention le plus prescrit au monde. Ce cours fondamental pose les bases méthodologiques indispensables pour déjouer les pièges techniques et interpréter avec rigueur chaque compartiment anatomique du thorax.",
    keyTakeaways: [
      "Vérifier systématiquement les 5 critères de qualité avant toute interprétation diagnostique.",
      "Suivre un ordre de lecture strict : paroi et os, plèvre et diaphragme, médiastin et silhouette cardiaque, hiles et parenchyme.",
      "Distinguer clairement le syndrome alvéolaire (bronchogramme aérique) du syndrome interstitiel (opacités réticulo-nodulaires)."
    ],
    chapters: [
      {
        title: "1. Critères de qualité d'un cliché de face",
        subtitle: "Les 5 règles d'or pour juger de l'interprétabilité d'un cliché thoracique",
        content: "Un bon cliché thoracique de face doit respecter les critères de qualité indispensables pour une interprétation rigoureuse :\n\n- **Inspiration profonde** : visualisation de 6 arcs costaux antérieurs au-dessus de la coupole diaphragmatique droite.\n- **Centrage / Symétrie** : les extrémités internes des clavicules doivent être à égale distance des apophyses épineuses cervicales/thoraciques.\n- **Pénétration du faisceau (noirceur)** : on doit pouvoir distinguer les vertèbres thoraciques supérieures en arrière du cœur, mais pas l'ensemble des disques thoraciques bas.\n- **Position debout** : confirmée par la poche à air gastrique bien visible sous la coupole gauche.\n- **Scapulas dégagées** : les omoplates doivent être bien sorties des champs pulmonaires.",
        pearls: [
          "Un cliché en expiration simule faussement une cardiomégalie et surcharge les bases pulmonaires.",
          "Une asymétrie de positionnement peut créer une fausse asymétrie de densité parenchymateuse."
        ]
      },
      {
        title: "2. Analyse systématique pas à pas",
        subtitle: "Cheminement méthodique pour ne manquer aucune lésion cachée",
        content: "L'erreur de base est de se précipiter sur l'anomalie flagrante. Suivez une grille de lecture stricte :\n\n- **Contenant (Paroi & Os)** : côtes, clavicules, rachis, tissus mous (recherche d'emphysème sous-cutané).\n- **Plèvres & Diaphragme** : culs-de-sac séreux (rechercher un émoussement ou un liseré pleural), régularité des coupoles.\n- **Médiastin & Silhouette cardiaque** : taille du cœur (Index Cardio-Thoracique < 0.50 chez l'adulte), alignement des lignes médiastinales.\n- **Hiles pulmonaires & Trachée** : hile gauche plus haut que le hile droit (90% des cas), examen de la trachée bien centrée.\n- **Champs pulmonaires (Parenchyme)** : comparaison symétrique des zones apicales, hilaires, et basales.",
        pearls: [
          "Toujours inspecter les « zones pièges » : les apex pulmonaires, la région rétro-cardiaque et les culs-de-sac sous-diaphragmatiques."
        ]
      },
      {
        title: "3. Les grands syndromes radiologiques thoraciques",
        subtitle: "Sémiologie comparative des atteintes alvéolaires, interstitielles et pleurales",
        content: "- **Syndrome alvéolaire** : opacités à limites floues, confluentes, présentant souvent un bronchogramme aérien (caractéristique d'une pneumopathie franche lobaire aiguë ou d'un OAP).\n- **Syndrome interstitiel** : opacités nettes sans bronchogramme, de type réticulaire, micronodulaire, ou en « verre dépoli » (fibrose pulmonaire, miliaire, pneumopathies virales).\n- **Syndrome pleural** : épanchement liquidien (opacité basale homogène à limite supérieure concave en haut et en dedans, ligne de Damoiseau) ou épanchement gazeux / pneumothorax (hyperclarté avasculaire avec visualisation du liseré pleural décollé).\n- **Syndrome atélectasique** : perte de volume d'un lobe ou du poumon entier, causant une opacité systématisée à parois concaves avec rétraction du médiastin, du diaphragme et du hile vers la lésion.",
        pearls: [
          "Le bronchogramme aérien signe formellement la nature alvéolaire de l'opacité.",
          "Le signe de la silhouette de Felson permet de situer avec précision si une opacité est antérieure ou postérieure."
        ]
      }
    ]
  },
  {
    id: '102',
    title: "Bases de l'IRM cérébrale",
    subtitle: "Principes physiques vulgarisés, séquences T1, T2, FLAIR, Diffusion et injection de Gadolinium",
    category: 'Neuroradiologie',
    duration: '1h 30m',
    level: 'Intermédiaire',
    chaptersCount: 3,
    progress: 45,
    image: 'https://images.unsplash.com/photo-1559757175-9c5950b71d9d?auto=format&fit=crop&w=400&q=80',
    type: 'theorique',
    authors: 'Collège des Enseignants en Neuroradiologie',
    publishedAt: '28 Mars 2024',
    introduction: "L'IRM est l'examen de référence en pathologie cérébrale. Comprendre le comportement du signal tissulaire sur les différentes pondérations est le prérequis absolu pour toute interprétation diagnostique.",
    keyTakeaways: [
      "Le T1 est la séquence anatomique par excellence (LCR noir, substance blanche blanche).",
      "Le T2 et le FLAIR détectent l'eau pathologique et l'inflammation.",
      "La diffusion (DWI) est indispensable en urgence pour dépister l'ischémie hyper-précoce et les abcès cérébraux."
    ],
    chapters: [
      {
        title: "1. Comprendre les séquences fondamentales",
        subtitle: "Comportement du LCR, de la substance blanche et de la substance grise",
        content: "En IRM cérébrale courante, quatre séquences de base sont indispensables :\n\n- **Séquence T1** : excellente résolution anatomique. Le liquide céphalo-rachidien (LCR) apparaît en noir (hyposignal), la substance blanche est plus blanche (hypersignal) que la substance grise (signal intermédiaire).\n- **Séquence T2** : pondération hydrique. Le LCR est en blanc (hypersignal franc). Utile pour détecter l'œdème ou l'inflammation qui apparaissent blancs.\n- **Séquence FLAIR (Fluid Attenuated Inversion Recovery)** : c'est un T2 où le signal du LCR libre a été supprimé (noirci). Ainsi, seule l'eau liée ou pathologique (œdème, gliose, démyélinisation) reste blanche, facilitant la détection des lésions périventriculaires.\n- **Séquence de Diffusion (DWI)** : détecte le mouvement brownien des molécules d'eau. Indispensable en pathologie ischémique aiguë (AVC), où elle s'élève dès les premières minutes."
      },
      {
        title: "2. Injection de produit de contraste (Gadolinium)",
        subtitle: "Rupture de la barrière hémato-encéphalique et types de rehaussements",
        content: "L'injection de Gadolinium est essentielle dans de multiples contextes :\n\n- Elle évalue l'intégrité de la barrière hémato-encéphalique (BHE). Un rehaussement lèseur traduit une rupture de la BHE.\n- **Types de prises de contraste** : \n  - *Rehaussement méningé* (pachy- ou leptoméningé) : signe d'infection méningée, d'infiltration tumorale ou d'hypotension intracrânienne.\n  - *Rehaussement nodulaire ou annulaire* : classique dans les métastases, les abcès cérébraux (rehaussement régulier en anneau fin), ou le glioblastome (anneau épais, irrégulier et bourgeonnant)."
      },
      {
        title: "3. Cartographie clinique & Systématisation",
        subtitle: "Analyse systématique par étages sous- et sus-tentoriels",
        content: "Analyse logique de l'IRM par territoires cérébraux :\n\n- **Fosse cérébrale postérieure** : repérer le tronc cérébral, le cervelet, le quatrième ventricule, et inspecter de façon bilatérale les angles ponto-cérébelleux (recherche de schwannome vestibulaire).\n- **Étage supratentoriel** : symétrie des ventricules latéraux, position de la ligne médiane, inspection des structures profondes (thalamus, noyaux gris centraux) et recherche d'anomalies gyrales ou de démyélinisation de la substance blanche profonde."
      }
    ]
  },
  {
    id: '103',
    title: 'Lecture systématique du scanner abdominal',
    subtitle: "Protocole d'injection multiphase et analyse sectorielle organe par organe",
    category: 'Imagerie abdominale et digestive',
    duration: '1h 15m',
    level: 'Intermédiaire',
    chaptersCount: 2,
    progress: 10,
    image: 'https://images.unsplash.com/photo-1516549655169-df83a0774514?auto=format&fit=crop&w=400&q=80',
    type: 'theorique',
    authors: 'Société d\'Imagerie Abdominale et Digestive (SIAD)',
    publishedAt: '05 Avril 2024',
    chapters: [
      {
        title: "1. Les différents temps d'acquisition",
        subtitle: "Sans injection, temps artériel tardif, temps portal et temps tardif",
        content: "Un scanner abdominal n'est pas qu'une simple série d'images ; il se décompose en plusieurs phases chronologiques après injection de produit de contraste iodé :\n\n- **Phase sans préparation (Sans Injection)** : indispensable pour détecter les calcifications, les lithiases urinaires ou biliaires (hyperdenses d'emblée), et pour mesurer la densité spontanée de référence (UH, Unités Hounsfield).\n- **Temps artériel (Arto-portant, ~35s)** : idéal pour l'étude des artères (aorte, artères digestives) et le rehaussement des tumeurs hypervasculaires (ex: hépatocarcinome, de type endocrine).\n- **Temps portal (Veineux, ~70s)** : c'est le temps d'or pour l'évaluation parenchymateuse (foie, rate, pancréas) et l'analyse de la veine porte. La majorité des métastases hépatiques y sont plus visibles."
      },
      {
        title: "2. Interprétation sectorielle des organes solides",
        subtitle: "Checklist foie, voies biliaires, rate, pancréas, reins et tube digestif",
        content: "Pour ne rien rater, suivez ce cheminement anatomique :\n\n1. **Foie** : homogénéité, taille, recherche de nodules hypo- ou hyperdenses.\n2. **Voies biliaires** : calibre de la voie biliaire principale (< 6mm chez le sujet non colécystectomisé), dilatation des voies biliaires intrahépatiques.\n3. **Pancréas** : régularité de son contour, calibre du canal de Wirsung (< 3mm), infiltration de la graisse péripancréatique.\n4. **Rate** : homogénéité et taille (< 12cm de grand axe)."
      }
    ]
  },
  {
    id: '104',
    title: 'Sémiologie radiologique de base',
    subtitle: "Guide exhaustif du vocabulaire d'imagerie médicale : densités, signaux, échogénicités",
    category: 'Imagerie abdominale et digestive',
    duration: '4h',
    level: 'Débutant',
    chaptersCount: 2,
    progress: 100,
    image: 'https://images.unsplash.com/photo-1576086213369-97a306d36557?auto=format&fit=crop&w=400&q=80',
    type: 'theorique',
    authors: 'Collège des Enseignants de Radiologie de France',
    publishedAt: '10 Janvier 2024',
    chapters: [
      {
        title: "1. Densités fondamentales en Radiographie",
        subtitle: "Les 4 densités fondamentales des rayons X",
        content: "La radiologie conventionnelle repose sur l'absorption différentielle des rayons X, qui se traduit par quatre opacités de base visibles sur un cliché :\n\n1. **Opacité Air (Noire, hyperclarté)** : les poumons, le tube digestif aeré absorbent très peu d'énergie, laissant le film très noir.\n2. **Opacité Graisse (Grise claire)** : les espaces inter-musculaires, la graisse sous-cutanée offrent une absorption faible mais supérieure à l'air.\n3. **Opacité Eau/Tissus mous (Gris moyen, opacité)** : le cœur, les muscles, le liquide pleural, le foie absorbent moyennement les rayons X. Ils apparaissent gris homogène.\n4. **Opacité Calcium/Os (Blanche, tonalité calcique)** : l'os cortical et spongieux absorbe presque tous les rayons X, projetant une ombre très blanche."
      },
      {
        title: "2. Terminologie sémiologique moderne",
        subtitle: "Employer les termes exacts selon la modalité physique",
        content: "Selon la modalité d'imagerie utilisée, le vocabulaire adéquat diffère :\n\n- **Radiographie & Mammographie** : on parle d'**hyperclarté** (noir) ou d'**opacité** (blanc).\n- **Scanner (TDM)** : on utilise le terme de **densité** : hypodense (noir/foncé), isodense (identique au tissu), hyperdense (blanc/clair).\n- **Échographie** : on parle d'**échogénicité** : anéchogène (noir, ex: liquide pur sans échos internes), iso- ou hyperéchogène (blanc/brillant, ex: calcul, graisse).\n- **IRM** : on s'exprime en **signal** : hyposignal (noir) et hypersignal (blanc)."
      }
    ]
  },
  {
    id: '201',
    title: 'Masse Médiastinale Antérieure',
    category: 'Imagerie thoracique',
    duration: '30 min',
    level: 'Expert',
    chaptersCount: 5,
    progress: 0,
    image: 'https://images.unsplash.com/photo-1516549655169-df83a0774514?auto=format&fit=crop&w=400&q=80',
    type: 'planchage',
    planchageData: {
      clinicalContext: "Homme de 34 ans, consulte pour dyspnée progressive d'effort, toux sèche traînante depuis 2 mois et sensation de plénitude cervicale. L'examen somatique met en évidence une turgescence des veines jugulaires et une circulation veineuse collatérale thoracique supérieure discrète.",
      images: [
        "https://images.unsplash.com/photo-1516549655169-df83a0774514?auto=format&fit=crop&w=600&h=400&q=80"
      ],
      checklist: [
        "Volumineuse masse solide lobulée située dans le médiastin antérieur.",
        "Limites nettes avec effacement de l'espace graisseux pré-vasculaire.",
        "Rehaussement hétérogène après injection de produit de contraste avec zones de nécrose centrale.",
        "Compression et encerclement de la veine cave supérieure (diamètre réduit à 25%).",
        "Abondance de réseaux de suppléance veineux superficiels thoraciques bien visibles.",
        "Absence de calcification grossière ou de composante graisseuse évidente."
      ],
      differentials: [
        "Thymome (lésion épithéliale thymique de loin la plus fréquente)",
        "Lymphome (de Hodgkin ou lymphome B à grandes cellules)",
        "Tumeur germinale séminomateuse ou non-séminomateuse",
        "Goître plongeant d'origine thyroïdienne"
      ],
      finalDiagnosis: "Thymome invasif (stade III de Masaoka-Koga) complété d'un syndrome de compression de la veine cave supérieure (SVCS).",
      management: [
        "Réalisation d'une biopsie guidée par scanner (aiguille tru-cut) pour analyse histologique indispensable avant toute thérapeutique.",
        "Contrôle de l'anticoagulation curative ou préventive si un thrombus intracave est formellement documenté.",
        "Oncologie de spécialité et discussion du dossier en RCP (Réunion de Concertation Pluridisciplinaire).",
        "Chirurgie d'exérèse complète (Thymectomie + curage complexe) précédée au besoin d'une chimiothérapie néo-adjuvante."
      ],
      gradingScale: [
        { criteria: "Analyse sémiologique de la masse", points: 6, details: "Savoir situer le médiastin antérieur (croisement de l'image de hiles, signe de la silhouette positif avec le cœur) et décrire ses dimensions et rapports vasculaires." },
        { criteria: "Identification du syndrome cave supérieur", points: 4, details: "Mettre en évidence la compression veineuse et de nombreuses collatérales systémiques de drainage." },
        { criteria: "Diagnostics Différentiels (Règle des 4T)", points: 4, details: "Énoncer la règle mnémonique classique pour orienter les masses antérieures : Thymome, Thyrôide (goître plongeant), Tératome/germinales, Terrible lymphome." },
        { criteria: "Conduite à tenir médico-chirurgicale", points: 4, details: "Éviter la chirurgie hâtive d'emblée, réclamer la biopsie percutanée pour documenter un potentiel lymphome et discuter en RCP." },
        { criteria: "Aisance de présentation et rigueur (Timing)", points: 2, details: "Exposé oral clair, respect de l'organisation type d'un planchage en 15 minutes." }
      ]
    }
  },
  {
    id: '202',
    title: 'Syndrome de Compression Veineuse Cave Supérieure',
    category: 'Imagerie cardiaque et vasculaire',
    duration: '35 min',
    level: 'Expert',
    chaptersCount: 5,
    progress: 0,
    image: 'https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?auto=format&fit=crop&w=400&q=80',
    type: 'planchage',
    planchageData: {
      clinicalContext: "Patiente de 54 ans, tabagique à 40 PA, amenée pour œdème du visage « en pèlerine » comblant les creux sus-claviculaires, céphalées diurnes augmentées par le décubitus et cyanose labiale. Une radiographie montre un élargissement médiastinal supérieur droit.",
      images: [
        "https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?auto=format&fit=crop&w=600&h=400&q=80"
      ],
      checklist: [
        "Masse tissulaire lobulée du hile supérieur droit infiltrant le médiastin moyen.",
        "Occlusion complète de la jonction veine brachiocéphalique droite / VCS par engainement néoplasique.",
        "Visualisation d'un thrombus étendu au sein de l'origine de la veine cave supérieure sur 3 cm.",
        "Importante charge adénomégalique sous-carinaire (station 7) et médiastinale supérieure droite (station 4R).",
        "Collatérales veineuses dilatées : réseau azygos et hémi-azygos, veines thoraciques internes.",
        "Suspicion de atélectasie du lobe supérieur droit par compression bronchique lobaire extrinsèque."
      ],
      differentials: [
        "Adénocarcinome ou carcinome épidermoïde bronchique",
        "Carcinome à petites cellules (fortement prédictif devant cette présentation hyper-infiltrante)",
        "Lymphome ou métastase compressive d'un autre cancer solide",
        "Médiastinite fibreuse bénigne (infectieuse post-tuberculose)"
      ],
      finalDiagnosis: "Syndrome cave supérieur secondaire à une compression et thrombose de la VCS par un processus néoplasique d'allure bronchique (carcinome bronchique infiltrant) avec stations ganglionnaires suspectes secondaires.",
      management: [
        "Hospitalisation en position demi-assise, oxygénothérapie nasale symptomatique de confort.",
        "Mise sous anticoagulation efficace immédiate par HBPM de bas poids moléculaire pour traiter le thrombus.",
        "Corticothérapie à forte dose par voie intraveineuse (anti-œdémateux puissant guidé à la dose d'attaque de 1mg/kg).",
        "Fibroscopie bronchique en urgence pour biopsies diagnostiques ou biopsie percutanée de la masse sous guidage scannographique."
      ],
      gradingScale: [
        { criteria: "Structure sémiologique de l'analyse", points: 6, details: "Qualifier la sténose, le thrombus tumoral intra-luminal, localiser l'axe d'occlusion principal et de drainage collatéral." },
        { criteria: "Calcul d'index et recherche de complications", points: 4, details: "Rechercher une atélectasie associée, analyser l'infiltration de l'arbre trachéobronchique et du péricarde adjacent." },
        { criteria: "Diagnostics étiologiques prépondérants", points: 4, details: "Savoir évoquer en priorité le cancer bronchique primitif (90% des causes tumorales chez le fumeur) et en particulier le carcinome à petites cellules." },
        { criteria: "Traitement symptomatique et d'urgence", points: 4, details: "Détailler les gestes d'urgence : héparine, corticoïdes, position semi-assise, éviter au maximum les voies d'abord veineuses aux membres supérieurs." },
        { criteria: "Qualité de synthèse orale", points: 2, details: "Présentation rigoureuse calquée sur le niveau d'exigence d'une soutenance de fin de cursus." }
      ]
    }
  },
  {
    id: '203',
    title: 'AVC Ischémique Hyperprécoce Sylvien Gauche',
    category: 'Neuroradiologie',
    duration: '25 min',
    level: 'Expert',
    chaptersCount: 5,
    progress: 0,
    image: 'https://images.unsplash.com/photo-1559757175-9c5950b71d9d?auto=format&fit=crop&w=400&q=80',
    type: 'planchage',
    planchageData: {
      clinicalContext: "Patient de 62 ans amené aux urgences par le SAMU pour hémiplégie droite d'installation brutale associée à une aphasie globale s'étant installée 1h30 auparavant. Score NIHSS de 18.",
      images: [
        "https://images.unsplash.com/photo-1559757175-9c5950b71d9d?auto=format&fit=crop&w=600&h=400&q=80"
      ],
      checklist: [
        "Hypersignal franc en séquence de diffusion (DWI) du territoire de l'artère sylvienne gauche.",
        "Chute de l'ADC correspondant confirmant l'œdème cytotoxique aigu.",
        "Absence d'anomalie visible sur la séquence pondérée FLAIR (mismatch Diffusion-FLAIR favorable).",
        "Hyposignal T2* (ou SWI) de l'artère cérébrale moyenne gauche (signe du thrombus intra-artériel ou 'susceptibility sign').",
        "Absence de foyers d'hémorragie méningée ou de saignement intraparenchymateux."
      ],
      differentials: [
        "Aura migraineuse prolongée sans céphalées",
        "Hémorragie cérébro-méningée brutale",
        "Paralysie post-critique de Todd après crise d'épilepsie focale",
        "Trouble de conversion hystérique ou crise d'anxiété aiguë"
      ],
      finalDiagnosis: "Infarctus cérébral ischémique aigu constitué du territoire sylvien cortical gauche de moins de 4,5 heures avec mismatch Diffusion/FLAIR positif (zone pénombre récupérable).",
      management: [
        "Réalisation en extrême urgence d'une thrombolyse intraveineuse par rtPA si pas de contre-indications absolues.",
        "Thrombectomie mécanique par voie endovasculaire complémentaire (mismatch d'imagerie et NIHSS élevé) à la phase aiguë avant 6 heures.",
        "Surveillance intensive continue des paramètres cardiovasculaires, de la pression artérielle, de la glycémie et du statut neurologique.",
        "Contrôle à 24 heures par une IRM cérébrale avant d'introduire tout traitement d'anti-agrégation plaquettaire."
      ],
      gradingScale: [
        { criteria: "Analyse de la séquence de diffusion", points: 6, details: "Identifier l'infarctus sylvien cortical gauche précoce et l me cytotoxique." },
        { criteria: "Interprétation du mismatch Diffusion-FLAIR", points: 4, details: "Expliquer l'impact thérapeutique capital du mismatch pour prouver le caractère hyperprécoce < 4.5h." },
        { criteria: "Signe T2* intra-artériel (Thrombus)", points: 4, details: "Mettre en évidence le thrombus de l'artère sylvienne gauche en susceptibilité magnétique." },
        { criteria: "Choix de la stratégie de revascularisation d'urgence", points: 4, details: "Discuter l'indication conjointe de thrombolyse chimique et thrombectomie endovasculaire immédiate." },
        { criteria: "Clarté de la soutenance et timing", points: 2, details: "Exposé direct, esprit de synthèse systématique selon les normes d'examen du DEMS." }
      ]
    }
  },
  {
    id: '204',
    title: 'Embolie Pulmonaire Massive Bilatérale en Selle',
    category: 'Imagerie thoracique',
    duration: '20 min',
    level: 'Expert',
    chaptersCount: 5,
    progress: 0,
    image: 'https://images.unsplash.com/photo-1579684385127-1ef15d508118?auto=format&fit=crop&w=400&q=80',
    type: 'planchage',
    planchageData: {
      clinicalContext: "Patiente de 41 ans, sous contraception œstroprogestative, ayant effectué un voyage en avion de longue durée 5 jours plus tôt, admise pour dyspnée aiguë associée à une douleur thoracique basilatérale droite brutale et une désaturation à 88% en air ambiant.",
      images: [
        "https://images.unsplash.com/photo-1579684385127-1ef15d508118?auto=format&fit=crop&w=600&h=400&q=80"
      ],
      checklist: [
        "Défaut d'opacification (lacune) au niveau de la bifurcation du tronc de l'artère pulmonaire (thrombus en selle).",
        "Extension bilatérale du thrombus s'étendant vers les artères pulmonaires principales droite et gauche.",
        "Dilatation prononcée des cavités droites (ventricule droit) avec un rapport VD/VG supérieur à 1 (souffrance cardiaque virtuelle).",
        "Méplat ou bombement paradoxal du septum interventriculaire vers le ventricule gauche.",
        "Reflux suspect de produit de contraste au sein de la veine cave inférieure et des veines hépatiques."
      ],
      differentials: [
        "Infarctus du myocarde aigu face antérieure",
        "Dissection aortique de type A de Stanford",
        "Pneumothorax spontané compressif droit",
        "Tamponnade péricardique aiguë"
      ],
      finalDiagnosis: "Embolie pulmonaire bilatérale massive avec thrombus en selle, entraînant une insuffisance ventriculaire droite aiguë (cœur pulmonaire aigu d'imagerie associé à un index d'obstruction majeur).",
      management: [
        "Oxygénothérapie nasale continue ou ventilation non invasive pour maintenir la saturation cible.",
        "Anticoagulation d'urgence curative immédiate par Héparine Non Fractionnée (HNF) en bolus puis au pousse-seringue électrique.",
        "Discussion d'une thrombolyse systémique si instabilité hémodynamique sévère (état de choc, choc cardiogénique, collapsus).",
        "Transfert d'urgence en soins intensifs de cardiologie ou réanimation pour monitorage strict."
      ],
      gradingScale: [
        { criteria: "Identification du thrombus artériel pulmonaire", points: 6, details: "Décrire la lacune de l'artère pulmonaire en selle et ses rapports distaux bilatéraux." },
        { criteria: "Évaluation des critères de gravité scanographiques", points: 4, details: "Analyser la dilatation du ventricule droit (VD/VG > 1) et le mouvement paradoxal septal." },
        { criteria: "Diagnostic d'exclusion différentiel", points: 4, details: "Écarter la dissection aortique, l'IDM et le pneumothorax sur l'angioscanner thoracique complet." },
        { criteria: "Conduite à tenir immédiate pour le traitement", points: 4, details: "Instaurer l'héparine, hospitaliser en USIC et monitorer étroitement la tension artérielle." },
        { criteria: "Rigueur logistique clinique", points: 2, details: "Précision dans les doses de traitements symptomatiques et de gestion et respect du timing d'examen." }
      ]
    }
  },
  {
    id: '205',
    title: 'Dissection Aortique Stanford Type A',
    category: 'Imagerie cardiaque et vasculaire',
    duration: '30 min',
    level: 'Expert',
    chaptersCount: 5,
    progress: 0,
    image: 'https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?auto=format&fit=crop&w=400&q=80',
    type: 'planchage',
    planchageData: {
      clinicalContext: "Homme de 58 ans avec antécédents d'HTA sévère non contrôlée, admis pour douleur thoracique brutale, migratrice, décrite comme une sensation de déchirure rétro-sternale d'intensité maximale d'emblée irradiant vers le dos.",
      images: [
        "https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?auto=format&fit=crop&w=600&h=400&q=80"
      ],
      checklist: [
        "Visualisation d'un voile d'intima (flap intimal) séparant le vrai du faux chenal au niveau de l'aorte ascendante.",
        "Extension du flap de dissection vers la crosse aortique et l'origine des troncs supra-aortiques.",
        "Présence du faux chenal caractérisé par une taille plus volumineuse et une prise de contraste retardée hétérogène (signe du bec ou de la toile).",
        "Épanchement péricardique liquidien associé (hémopéricarde débutant par rupture rétrograde).",
        "Intégrité ou atteinte des ostiums coronaires (recherche de dissection coronaire associée)."
      ],
      differentials: [
        "Syndrome coronaire aigu sans surélévation de ST (SCA)",
        "Péricardite aiguë constrictive ou tamponnade",
        "Embolie pulmonaire aiguë proximale",
        "Hématome pariétal de l'aorte thoracique (variante de syndrome aortique aigu)"
      ],
      finalDiagnosis: "Dissection de l'aorte ascendante (type A de Stanford / type I de DeBakey) compliquée d'un hémopéricarde débutant et d'une extension de souffre-douleur aux troncs supra-aortiques.",
      management: [
        "Contrôle immédiat et agressif de la douleur par morphiniques IV et diminution de la TA (Pression artérielle systolique ciblée entre 100 et 120 mmHg) via des bêta-bloquants d'action rapide (Esmolol).",
        "Transfert en extrême urgence en chirurgie cardiaque pour remplacement de l'aorte ascendante sous CEC (Chirurgie de Bentall ou simple tube supra-coronaire).",
        "Contre-indication formelle et absolue de tout traitement anticoagulant ou antiagrégant plaquettaire.",
        "Arrêt de toute thérapeutique invasive périphérique n'ayant pas de visée de sauvetage direct."
      ],
      gradingScale: [
        { criteria: "Analyse du flap et identification du type anatomique", points: 6, details: "Poser le diagnostic de dissection de type A en identifiant le voile intimal dans l'aorte ascendante." },
        { criteria: "Recherche des complications vitales", points: 4, details: "Inspecter les artères coronaires, évaluer la présence d'un épanchement péricardique et l'occlusion des troncs de la crosse." },
        { criteria: "Discussions étiologiques et physiopathologie", points: 4, details: "Expliquer l'impact de l'hypertension artérielle chronique ou des maladies génétiques du tissu élastique (Marfan)." },
        { criteria: "Traitement d'échéance chirurgicale immédiat", points: 4, details: "Indiquer l'importance vitale du transfert immédiat sous CEC en bloc de chirurgie cardiaque." },
        { criteria: "Structure d'exposé et du brouillon d'examen", points: 2, details: "Présentation didactique, systématique et sans hésitation verbale de la sémiologie." }
      ]
    }
  },
  {
    id: '206',
    title: 'Pancréatite Aiguë Graves Stade E',
    category: 'Imagerie abdominale et digestive',
    duration: '25 min',
    level: 'Expert',
    chaptersCount: 5,
    progress: 0,
    image: 'https://images.unsplash.com/photo-1516549655169-df83a0774514?auto=format&fit=crop&w=400&q=80',
    type: 'planchage',
    planchageData: {
      clinicalContext: "Patient de 47 ans aux antécédents d'alcoolisme chronique, hospitalisé pour douleurs abdominales insupportables en barre épigastrique irradiant vers les hypocondres et le dos, apparues en postprandial précoce.",
      images: [
        "https://images.unsplash.com/photo-1516549655169-df83a0774514?auto=format&fit=crop&w=600&h=400&q=80"
      ],
      checklist: [
        "Glandulométrie pancréatique augmentée avec une perte d'homogénéité du rehaussement parenchymateux (nécrose corporelle > 50%).",
        "Présence de multiples coulées de nécrose extrapancréatiques (plus de deux coulées distinctes : rétro-gastrique, pararénales).",
        "Infiltration inflammatoire marquée de la graisse péri-pancréatique et de la loge rénale gauche.",
        "Épanchement liquidien péritonéal de moyenne abondance au niveau de l'espace sous-hépatique.",
        "Perméabilité conservée de l'axe spléno-mésaraïque et de la veine porte (absence de thrombose veineuse)."
      ],
      differentials: [
        "Perforation d'ulcère gastroduodénal en péritoine libre",
        "Infarctus entéro-mésentérique aigu par ischémie vasculaire",
        "Occlusion intestinale aiguë par strangulation herniaire",
        "Anévrisme de l'artère splénique rompu"
      ],
      finalDiagnosis: "Pancréatite aiguë nécrotico-hémorragique grave classée au stade E de Balthazar (CTSI estimé à 8-10 points en raison de la nécrose parenchymateuse étendue).",
      management: [
        "Hospitalisation impérative en unité de réanimation médicale ou de soins intensifs polyvalents.",
        "Mise au repos digestif strict complet avec hydratation hydro-électrolytique massive par voie intraveineuse.",
        "Mise en place d'une nutrition entérale précoce (recommandée par sonde naso-jéjunale) pour prévenir le passage bactérien.",
        "Antibiothérapie par Carbapénèmes orientée uniquement en cas d'infection suspectée ou prouvée des coulées de nécrose sous ponction scannée."
      ],
      gradingScale: [
        { criteria: "Évaluation de l'index de sévérité scanographique (CTSI)", points: 6, details: "Savoir graduer l'atteinte parenchymateuse et classifier en Balthazar E en identifiant les zones mortes peu rehaussées." },
        { criteria: "Analyse des rapports locaux urinaires et vasculaires", points: 4, details: "Vérifier l'absence de thrombose veineuse porte ou splénique et cartographier les coulées d'inflammation." },
        { criteria: "Contrôle de l'évolution (recherche de complications tardives)", points: 4, details: "Expliquer les complications tardives (pseudo-kystes, surinfections, hématomes ou pseudo-anévrismes par érosion vasculaire)." },
        { criteria: "Mesures réanimatoires initiales indispensables", points: 4, details: "Insister sur la réanimation liquidienne abondante, l'analgésie optimale, et l'exclusion d'une antibiothérapie systématique préventive." },
        { criteria: "Aisance de présentation et rigueur d'explication", points: 2, details: "Soutenance structurée, maîtrise de la terminologie médico-chirurgicale requise au DEMS." }
      ]
    }
  },
  {
    id: '105',
    title: 'Masses Rénales Solides (Classification Radiology Assistant)',
    category: 'Imagerie urologique',
    duration: '2h',
    level: 'Intermédiaire',
    chaptersCount: 5,
    progress: 60,
    image: 'https://images.unsplash.com/photo-1576086213369-97a306d36557?auto=format&fit=crop&w=400&q=80',
    type: 'theorique',
    authors: 'Rinze Reinhard, Mandy van der Zon-Conijn et Robin Smithuis',
    publishedAt: '1 Juin 2026',
    chapters: [
      {
        title: "1. Différenciation des Masses Rénales (Ball vs Bean)",
        subtitle: "L'approche systématique de l'analyse scannographique rénal",
        content: "Face à une masse rénale solide à l'examen scannographique (TDM) ou en IRM, la première étape diagnostique consiste à déterminer sa morphologie d'expansion globale.\n\nL'analyse de référence repose sur le signe fondamental 'Ball vs Bean' :\n\n- **Masses de type 'Ball' (Balle)** : Elles bulgent, déforment de manière agressive les contours extérieurs du parenchyme rénal sain et s'étendent de manière sphérique et exophytique. Ce phénotype est fortement suggestif d'une tumeur parenchymateuse primitive telle que le carcinome à cellules rénales (RCC) ou l'oncocytome bénin.\n- **Masses de type 'Bean' (Haricot)** : Elles s'infiltrent ou s'étendent de façon diffuse tout en conservant l'architecture rénale lobée originelle sans bombement focal. Ce phénotype d'infiltration est typique des carcinomes à cellules transitionnelles (TCC) de la voie excrétrice, du lymphome rénal secondaire, des lésions métastatiques ou d'infarctus segmentaires.",
        pearls: [
          "Une lésion de type 'Bean' n'altère pas le contour du rein mais envahit précocement le sinus rénal ou le système excréteur.",
          "90% des tumeurs solides de type 'Ball' chez l'adulte s'avèrent être des carcinomes rénaux (RCC)."
        ],
        tables: [
          {
            title: "Tableau de Diagnostic Différentiel : Ball contre Bean",
            headers: ["Paramètre", "Type Ball (Balle)", "Type Bean (Haricot)"],
            rows: [
              ["Déformation des contours", "Majeure, localisée et asymétrique", "Préservée, homogène ou rétractée"],
              ["Étiologies histologiques", "RCC (cellules claires/papillaire), Oncocytome, AML", "TCC (urothélial), Lymphome, Métastases, Infections"],
              ["Envahissement du sinus pyélique", "Par refoulement mécanique tardif", "Infiltration directe et précoce du sinus"],
              ["Thérapeutique standard", "Néphrectomie partielle chirurgicale ou ablation", "Néphro-urétérectomie (TCC) ou chimiothérapie (Lymphome)"]
            ]
          }
        ],
        figures: [
          {
            url: "https://images.unsplash.com/photo-1579684385127-1ef15d508118?auto=format&fit=crop&q=80&w=400",
            legend: "Figure 1 : Schéma urologique contrastant. À gauche, la déformation de contour globulaire exophytique (Type Ball). À droite, l'envahissement diffus de l'architecture normale (Type Bean).",
            label: "Figure 1 - Morphotypes Évolutifs"
          }
        ]
      },
      {
        title: "2. Le Carcinome Rénal (RCC)",
        subtitle: "Classification histologique, radio-sémiologique et staging de référence",
        content: "Le carcinome à cellules rénales (RCC) représente la néoplasie solide maligne la plus fréquente du rein chez l'adult (environ 85-90% des tumeurs solides corticales).\n\nSes trois principaux sous-types histologiques possèdent des caractères sémiologiques distincts et identifiables au scanner multiphasique injection (sans injection, artériel/cortico-médullaire, portal/néphrographique, tardif) :\n\n- **RCC à cellules claires (70-80%)** : Tumeur hypervasculaire, présentant un rehaussement intense et précoce au temps cortico-médullaire (> 100 UH), souvent hétérogène en raison de zones de nécrose, d'hémorragie ou de dégénérescence kystique centrale.\n- **RCC papillaire (10-15%)** : Tumeur typiquement hypovasculaire, se rehaussant de manière particulièrement discrète, progressive et homogène (< 20 UH d'élévation de densité relative).\n- **RCC chromophobe (5%)** : Souvent volumineux, de structure homogène, avec un rehaussement modéré et présentant parfois une cicatrice fibreuse centrale stellaire imitant l'oncocytome.",
        pearls: [
          "Un rehaussement supérieur à 15-20 UH après injection de produit de contraste iodé signe le caractère solide de toute masse rénale.",
          "Le staging tumoral repose sur la recherche systématique de thrombus tumoral au sein de la veine rénale et de la veine cave supérieure (VCS)."
        ],
        figures: [
          {
            url: "https://images.unsplash.com/photo-1576086213369-97a306d36557?auto=format&fit=crop&w=400&q=80",
            legend: "Figure 2 : Scanner injecté au temps néphrographique montrant une lésion corticale gauche ovalaire asymétrique de type 'Ball' avec composante de nécrose centrale hypodense, confirmée histologiquement comme un RCC à cellules claires.",
            label: "Figure 2 - RCC Cortical Hypervasculaire"
          }
        ]
      },
      {
        title: "3. L'Angiomyolipome (AML)",
        subtitle: "Caractérisation de la graisse macroscopique et écueils diagnostiques",
        content: "L'Angiomyolipome (AML) est une tumeur bénigne appartenant à la famille des PEComes. Elle associe de façon variable des vaisseaux sanguins dystrophiques, des fibres musculaires lisses et du tissu adipeux mature.\n\nLe diagnostic formel d'AML d'imagerie repose uniquement sur l'identification de graisse macroscopique intra-lésionnelle :\n\n- **Au scanner (TDM)** : Présence d'aires d'atténuation très basses, comprises typiquement entre -10 et -100 Unités Hounsfield (UH).\n- **En IRM** : Visualisation d'un liseré de perte de signal marquant la jonction parenchymateuse en séquence d'opposition de phase (artéfact d'encre de Chine) ou effacement du signal hyper T1 sur les séquences avec saturation sélective de la graisse (séquences FAT-SAT).\n\n**Le piège des AML pauvres en graisse (minimal fat AML)** : Près de 5% des AML ne contiennent qu'un contingent minime de graisse indécelable aux examens standards, imitant à la perfection un carcinome rénal (RCC) papillaire. La réalisation d'une biopsie scanno-guidée s'avère dans ce cas incontournable.",
        pearls: [
          "La mise en évidence de calcifications internes exclut pratiquement un angiomyolipome simple et doit faire suspecter un carcinome rénal (RCC) calcifié.",
          "Les AML volumineux de plus de 40 mm présentent un risque élevé de rupture spontanée hémorragique (syndrome urgent de Wunderlich)."
        ],
        figures: [
          {
            url: "https://images.unsplash.com/photo-1516549655169-df83a0774514?auto=format&fit=crop&w=400&q=80",
            legend: "Figure 3 : TDM abdominopelvienne sans injection montrant une volumineuse masse pôle inférieur droit contenant des plages d'atténuation graisseuse spontanée très faible (-45 UH), pathognomonique d'un Angiomyolipome.",
            label: "Figure 3 - AML avec Contingent Adipeux"
          }
        ]
      },
      {
        title: "4. Oncocytome et Carcinome Urothélial (TCC)",
        subtitle: "Sémiologie croisée des masses parenchymateuses et tubulaires du sinus",
        content: "L'Oncocytome est une tumeur épithéliale bénigne représentant environ 5% des masses rénales néoplasiques secondaires. Différencier un oncocytome d'un RCC (principalement le type chromophobe ou à cellules claires) s'avère cliniquement impossible en imagerie :\n\n- **Signe classique évocateur** : Masse homogène de type 'Ball', hypervasculaire, présentant une cicatrice stellaire fibreuse centrale hypodense peu rehaussée. Ce signe n'est présent que dans 30% des cas et la nécrose tumorale d'un RCC agressif peut simuler ce comportement.\n\nLe Carcinome à Cellules Transitionnelles (TCC, ou carcinome urothélial) naît de l'urothélium tapissant le pyélon et les calices :\n\n- **Signe classique évocateur** : Masse typique de forme 'Bean', centrée sur le sinus rénal, engainant et refoulant les structures vasculaires du hile sans déformer le contour du parenchyme périphérique. Il s'accompagne d'une réduction progressive locale du rehaussement et d'épisodes fréquents d'hématuries.",
        pearls: [
          "Il n'existe aucune sémiologie de certitude pour distinguer un oncocytome d'un carcinome à l'imagerie conventionnelle. Toute suspicion justifie une résection ou biopsie clinique.",
          "Les tumeurs TCC pyélocalicielles s'associent souvent à des localisations urothéliales multiples synchrones (uretère, vessie)."
        ]
      },
      {
        title: "5. Diagnostics Différentiels et Pseudo-tumeurs",
        subtitle: "Étourdissements diagnostiques courants : variantes et lésions aiguës",
        content: "Plusieurs structures physiologiques, variantes anatomiques ou pathologies bénignes aiguës simulent de manière trompeuse des masses rénales solides :\n\n- **La bosse dromadaire (Dromedary hump)** : Déformation locale du contour externe du rein gauche secondaire à la pression mécanique de la rate. Sa nature est confirmée par un rehaussement et une perfusion strictement identiques à celle du parenchyme normal adjacent.\n- **L'hypertrophie des colonnes de Bertin** : Prolongement focal de cortex rénal normal plongeant dans le sinus rénal mais respectant les structures cavitaires.\n- **L'infarctus rénal segmentaire** : Plage d'hypoperfusion triangulaire typiquement à base cutanée périphérique, ne prenant pas le contraste, caractérisée cliniquement par le 'liseré cortical' (la perfusion périphérique capsulaire dessine un fin liseré périphérique de cortex préservé).\n- **La pyélonéphrite aiguë focale (néphrite lobaire)** : Foyer d'hypodensité mal délimité s'étendant du sinus au cortex, souvent accompagné de stries de néphrographie tardive et d'infiltration filamenteuse de la graisse périrénale de Gerota.",
        pearls: [
          "Le diagnostic de liseré sous-capsulaire (cortical rim sign) est pathognomonique de la nécrose vasculaire ou de l'infarctus rénal segmentaire aigu.",
          "Une anamnèse clinique soignée (fièvre, lombalgie aiguë brutale) permet d'écarter la majorité des pièges infectieux ou vasculaires."
        ]
      }
    ]
  }
];

export const mockUserStats: UserStats = {
  casesViewed: 24,
  coursesCompleted: 6,
  favoritesCount: 12,
  casesSubmitted: 3,
  globalProgress: 85
};
