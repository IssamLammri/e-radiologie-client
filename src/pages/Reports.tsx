import { useState, useEffect } from 'react';
import { 
  FileText, Copy, Check, Search, Download, Printer, 
  Info, Sparkles, Filter, RefreshCw, FileEdit, UserCheck,
  Building2, Lock, BookOpen, ArrowRight, ShieldCheck
} from 'lucide-react';
import { Badge } from '../components/ui/Badge';
import { Input } from '../components/ui/Input';
import { Button } from '../components/ui/Button';

export type ReportModality = 'Radiographie standard' | 'Échographie' | 'Écho-Doppler' | 'TDM' | 'IRM';

export interface ReportTemplate {
  id: string;
  title: string;
  modality: ReportModality;
  mainExamCategory: string; // Examen principal
  indicationDefault: string;
  normalVersion: {
    technique: string;
    description: string;
    conclusion: string;
  };
  pathologicalVersion?: {
    pathologyName: string;
    technique: string;
    description: string;
    conclusion: string;
  };
}

export const MAIN_EXAM_CATEGORIES = [
  'Toutes les catégories',
  'Thorax & Poumon',
  'Abdomen & Tube Digestif',
  'Foie & Voies Biliaires',
  'Rénale & Urologie',
  'Pelvis & Gynécologie',
  'Paroi abdominale',
  'Ostéo-articulaire',
  'Vasculaire',
  'Neuroradiologie'
] as const;

export const templatesData: ReportTemplate[] = [
  {
    id: 'rx-thorax',
    title: 'Radiographie Thoracique (Face/Profil)',
    modality: 'Radiographie standard',
    mainExamCategory: 'Thorax & Poumon',
    indicationDefault: 'Toux persistante et dyspnée à l\'effort.',
    normalVersion: {
      technique: 'Cliché thoracique de face en inspiration profonde debout complété par un cliché de profil.',
      description: 'Absence d\'anomalie parenchymateuse focale d\'allure évolutive.\nPas de foyer de condensation alvéolaire ni d\'infiltrat interstitiel suspect.\nRelativité et rapports hili-médiastinaux normaux. Index cardio-thoracique dans les limites de la normale.\nPas d\'épanchement pleural ni de pneumothorax décelables.\nCul-de-sacs pleuraux libres.\nStructures osseuses de la cage thoracique intègres de présentation normale.',
      conclusion: 'Examen radiographique thoracique dans les limites de la normale. Pas de foyer pneumonique aigu.'
    },
    pathologicalVersion: {
      pathologyName: 'Pneumopathie alvéolaire lobaire',
      technique: 'Cliché thoracique de face en inspiration profonde debout.',
      description: 'Présence d\'un foyer de condensation alvéolaire systématisé, lobaire supérieur droit, contenant un bronchogramme aérique.\nAbsence d\'autre anomalie parenchymateuse controlatérale.\nIndex cardio-thoracique conservé.\nPas de comblement franc des cul-de-sacs pleuraux.',
      conclusion: 'Foyer de condensation alvéolaire du lobe supérieur droit évoquant au premier chef une pneumopathie bactérienne aiguë franche lobaire supérieure.'
    }
  },
  {
    id: 'rx-genou',
    title: 'Radiographie du Genou (Face/Profil/Charge)',
    modality: 'Radiographie standard',
    mainExamCategory: 'Ostéo-articulaire',
    indicationDefault: 'Gonalgie mécanique droite chronique.',
    normalVersion: {
      technique: 'Incidences de face en charge et profil strict du genou droit.',
      description: 'Conservation de l\'interligne articulaire fémoro-tibial (médial et latéral) ainsi que fémoro-patellaire.\nPas de pincement localisé ni d\'ostéophyte marginal.\nAbsence de géode d\'hyperpression sous-chondrale ou d\'ostéosclérose.\nTrame osseuse de densité normale.',
      conclusion: 'Radiographie du genou droit de structure normale. Absence de signe d\'arthrose débutante.'
    },
    pathologicalVersion: {
      pathologyName: 'Gonarthrose fémoro-tibiale',
      technique: 'Incidences de face en charge et profil du genou droit.',
      description: 'Pincement asymétrique marqué de l\'interligne fémoro-tibial médial.\nOstéophytose marginale fémoro-tibiale et fémoro-patellaire.\nCondensation osseuse sous-chondrale prédominante au niveau du compartiment interne.',
      conclusion: 'Arthrose fémoro-tibiale interne droite de grade avancé (Kellgren-Lawrence grade III) avec arthrose fémoro-patellaire associée.'
    }
  },
  {
    id: 'rx-bassin',
    title: 'Radiographie du Bassin & Hanches (Face)',
    modality: 'Radiographie standard',
    mainExamCategory: 'Ostéo-articulaire',
    indicationDefault: 'Bilan de coxalgie bilatérale et boiterie d\'esquive.',
    normalVersion: {
      technique: 'Cliché de face du bassin en décubitus dorsal, pieds en rotation interne de 15 degrees.',
      description: 'Interlignes coxo-fémoraux de hauteur conservée et symétrique.\nToits des acétabula réguliers sans condensation sous-chondrale ni ostéophytose.\nIntégrité des branches ilio- et pubo-ischiatiques. Absence de rupture des cintres cervico-obturateurs.',
      conclusion: 'Radiographie du bassin et des hanches d\'aspect physiologique. Absence de coxarthrose.'
    },
    pathologicalVersion: {
      pathologyName: 'Coxarthrose prédominante droite',
      technique: 'Radiographie du bassin de face et profil de faux profil de Lequesne.',
      description: 'Pincement supérieur et supero-externe de l\'interligne coxo-fémoral droit.\nCondensation de l\'os sous-chondral acétabulaire avec petites géodes de sous-pression.\nOstéophytes volumineux de la tête fémorale droite.',
      conclusion: 'Coxarthrose prédominante droite évoluée sur dysplasie supero-externe a minima.'
    }
  },
  {
    id: 'echo-abces-hepatique',
    title: 'Échographie Hépato-biliaire — Abcès hépatique',
    modality: 'Échographie',
    mainExamCategory: 'Foie & Voies Biliaires',
    indicationDefault: 'Fièvre, douleur de l\'hypochondre droit et syndrome infectieux.',
    normalVersion: {
      technique: 'Examen de l\'étage sus-mésocolique par voie trans-pariétale.',
      description: 'Foie de taille normale, bords lisses, échostructure homogène sans processus expansif focal solide ou liquide décelable.\nVoies biliaires intra- et extra-hépatiques de calibre normal.\nVésicule biliaire saine.',
      conclusion: 'Échographie abdominale normale : absence de collection hépatique suspecte.'
    },
    pathologicalVersion: {
      pathologyName: 'Abcès hépatique',
      technique: 'Examen abdominal ciblé par échographie transpariétale intercostale et sous-costale.',
      description: 'Mise en évidence au niveau du segment VI du foie d\'une volumineuse formation de contours irréguliers (52 x 44 mm).\nCette lésion présente une paroi épaisse hypoéchogène et un centre hétérogène de tonalité liquidienne épaisse avec débris échogènes sédimentés.\nRenforcement acoustique postérieur net et halo hypoéchogène d\'œdème périlésionnel.',
      conclusion: 'Collection hépatique collectée du segment VI d\'aspect évocateur en premier lieu d\'un abcès hépatique.'
    }
  },
  {
    id: 'echo-chc',
    title: 'Échographie Hépatique — Carcinome Hépatocellulaire (CHC)',
    modality: 'Échographie',
    mainExamCategory: 'Foie & Voies Biliaires',
    indicationDefault: 'Surveillance systématique d\'une cirrhose post-hépatite.',
    normalVersion: {
      technique: 'Examen hépatique complet par sonde sectorielle de 3.5 MHz.',
      description: 'Foie de morphologie régulière, contours lisses, d\'échostructure homogène. Pas de nodule suspect individualisable.',
      conclusion: 'Échographie de dépistage nodulaire négative.'
    },
    pathologicalVersion: {
      pathologyName: 'Nodule hépatique suspect (CHC)',
      technique: 'Échographie hépatique transpariétale multi-incidences couplée au Doppler pulsé et couleur.',
      description: 'Sur un foie de contours irréguliers bosselés d\'architecture hétérogène nodulaire évocatrice d\'une hépatopathie cirrhogène :\nMise en évidence d\'une formation tumorale solide hétérogène, majoritairement hypoéchogène (36 x 30 mm) au niveau du segment V.\nPrésence de flux artériels anarchiques intratumoraux au Doppler couleur avec index de résistance élevé.',
      conclusion: 'Nodule hépatique solide suspect du segment V, évocateur de carcinome hépatocellulaire (CHC) sur cirrhose. Scanner ou IRM requis.'
    }
  },
  {
    id: 'echo-cholecystite-aigue',
    title: 'Échographie Hépato-biliaire — Cholécystite aiguë',
    modality: 'Échographie',
    mainExamCategory: 'Foie & Voies Biliaires',
    indicationDefault: 'Douleur intense fébrile de l\'hypochondre droit (Signe de Murphy +).',
    normalVersion: {
      technique: 'Analyse en temps réel de la loge vésiculaire.',
      description: 'Vésicule biliaire de taille normale, de contenu transsonique homogène, à paroi mince (< 3 mm).',
      conclusion: 'Vésicule saine sans lésion inflammatoire ou lithiasique.'
    },
    pathologicalVersion: {
      pathologyName: 'Cholécystite aiguë lithiasique',
      technique: 'Échographie ciblée en temps réel de la région vésiculaire.',
      description: 'La vésicule biliaire est distendue (95 x 45 mm), avec d\'importants calculs enclavés dans l\'infundibulum formant des cônes d\'ombre nets.\nLa paroi de la vésicule est épaissie à 6.0 mm, feuilletée avec un œdème sous-séreux.\nLe Murphy échographique sous le transducteur est très douloureux.',
      conclusion: 'Aspect échographique caractéristique de cholécystite aiguë lithiasique.'
    }
  },
  {
    id: 'echo-appendicite-aigue',
    title: 'Échographie Abdominale — Appendicite aiguë',
    modality: 'Échographie',
    mainExamCategory: 'Abdomen & Tube Digestif',
    indicationDefault: 'Douleur aiguë spontanée de la fosse iliaque droite (McBurney +).',
    normalVersion: {
      technique: 'Mise en charge par compression graduelle de la fosse iliaque droite.',
      description: 'Pas d\'épaississement de la paroi cæcale ou d\'image tubulaire suspecte.',
      conclusion: 'Absence de signe échographique d\'appendicite aiguë.'
    },
    pathologicalVersion: {
      pathologyName: 'Appendicite aiguë obstructive',
      technique: 'Échographie de la FID par sonde linéaire haute fréquence.',
      description: 'Individualisation d\'une structure tubulaire en doigt de gant, borgne, non compressible et douloureuse sous l\'effet du transducteur (8.5 mm de diamètre).\nLa paroi de l\'appendice est épaissie à 3.4 mm avec hyperémie Doppler en cocarde.\nPrésence d\'un stercolithe hyperéchogène intraluminal de 7 mm.',
      conclusion: 'Sémiologie échographique typique d\'une appendicite aiguë obstructive sur calcul stercoral.'
    }
  },
  {
    id: 'echo-crohn',
    title: 'Échographie Digestive — Maladie de Crohn (Poussée iléale)',
    modality: 'Échographie',
    mainExamCategory: 'Abdomen & Tube Digestif',
    indicationDefault: 'Douleurs abdominales récurrentes et suspicion de poussée d\'AINS/MICHI.',
    normalVersion: {
      technique: 'Échographie digestive fine de l\'anse grêle terminale.',
      description: 'L\'iléon terminal présente une paroi fine mesurée à 1.8 mm, dépressible et souple.',
      conclusion: 'Fin de l\'iléon d\'allure saine sans anomalie de structure.'
    },
    pathologicalVersion: {
      pathologyName: 'Maladie de Crohn active',
      technique: 'Exploration d\'échographie digestive ciblée de la fosse iliaque droite.',
      description: 'Mise en évidence d\'un épaississement pariétal majeur, circonférentiel (7.5 mm) de l\'iléon terminal sur environ 13 cm.\nPerte de la stratification pariétale avec saillie hyperéchogène de la graisse mésentérique encerclant l\'anse (fat creeping).\nHyperémie pariétale au Doppler couleur.',
      conclusion: 'Épaississement iléal segmentaire très évocateur d\'une phase active d\'une maladie de Crohn.'
    }
  },
  {
    id: 'echo-adenomyose',
    title: 'Échographie Pelvienne — Adénomyose Utérine',
    modality: 'Échographie',
    mainExamCategory: 'Pelvis & Gynécologie',
    indicationDefault: 'Dysménorrhée sévère progressive et ménométrorragies.',
    normalVersion: {
      technique: 'Examen pelvien complet par sonde sus-pubienne et endovaginale.',
      description: 'Utérus antéversé de taille et contours réguliers sans anomalie du myomètre.\nEndomètre fin et régulier.',
      conclusion: 'Échographie gynécologique normale.'
    },
    pathologicalVersion: {
      pathologyName: 'Adénomyose utérine diffuse',
      technique: 'Exploration endovaginale haute résolution par transducteur 7.5 MHz.',
      description: 'L\'utérus est globalement augmenté de volume, d\'allure globuleuse (92 mm).\nAsymétrie d\'épaisseur marquée des parois myométriales avec un épaississement prédominant de la paroi postérieure.\nMicrokystes sous-endométriaux anéchogènes (1 à 3 mm) avec stries d\'échogénicité linéaire.',
      conclusion: 'Sémiologie échographique typique hautement évocatrice d\'une adénomyose utérine diffuse.'
    }
  },
  {
    id: 'echo-agenesie-rein',
    title: 'Échographie Rénale — Agénésie Rénale Unilatérale',
    modality: 'Échographie',
    mainExamCategory: 'Rénale & Urologie',
    indicationDefault: 'Bilan systématique d\'une découverte fortuite ou biologique.',
    normalVersion: {
      technique: 'Examen complet des fosses lombaires et de la région pelvienne.',
      description: 'Visualisation de deux reins en position lombaire habituelle de taille, structure cortico-médullaire et orientation normales.',
      conclusion: 'Parenchyme rénal bilatéral physiologique.'
    },
    pathologicalVersion: {
      pathologyName: 'Agénésie rénale gauche',
      technique: 'Examen complet des aires lombaires, du rétropéritoine et de la région pelvienne.',
      description: 'Absence totale de visualisation de rein gauche dans la loge lombaire ou en position ectopique pelvienne.\nLe rein droit présente une hypertrophie compensatrice saine (136 mm), d\'échostructure normale.',
      conclusion: 'Agénésie rénale gauche confirmée avec hypertrophie compensatrice saine du rein droit.'
    }
  },
  {
    id: 'echo-diastasis',
    title: 'Échographie Paroi Abdominale — Diastasis des Grands Droits',
    modality: 'Échographie',
    mainExamCategory: 'Paroi abdominale',
    indicationDefault: 'Bombement de la ligne blanche abdominale lors de l\'effort.',
    normalVersion: {
      technique: 'Examen de la paroi médiane abdominale au repos et à la contraction.',
      description: 'Muscles grands droits jointifs au niveau de la ligne blanche, sans écartement anormal.',
      conclusion: 'Paroi abdominale médiane intacte.'
    },
    pathologicalVersion: {
      pathologyName: 'Diastasis des grands droits',
      technique: 'Échographie dynamique à haute résolution de la ligne blanche.',
      description: 'Mise en évidence d\'un écartement significatif des deux corps musculaires des grands droits de l\'abdomen mesuré à 38 mm en région péri-ombilicale.\nL\'aponévrose médiane est étirée mais continue. Absence d\'orifice herniaire.',
      conclusion: 'Diastasis marqué des muscles grands droits de la paroi médiane sans hernie associée.'
    }
  },
  {
    id: 'doppler-veineux',
    title: 'Écho-Doppler Veineux des Membres Inférieurs (Thrombose)',
    modality: 'Écho-Doppler',
    mainExamCategory: 'Vasculaire',
    indicationDefault: 'Œdème et douleur unilatérale aiguë du mollet gauche.',
    normalVersion: {
      technique: 'Examen écho-Doppler pulsé et couleur des troncs veineux profonds et superficiels des deux membres inférieurs.',
      description: 'RÉSEAU VEINEUX PROFOND :\n- Perméabilité complète des veines fémorales communes, superficielles, poplitées et jambières.\n- Élastogrammes de compression complets sous la sonde (veines entièrement compressibles).\n- Flux spontanés rythmés par la respiration.\n- Absence de thrombus endoluminal.\nRÉSEAU SUPERFICIEL : Pas de thrombose des grande et petite saphènes.',
      conclusion: 'Écho-Doppler veineux des membres inférieurs normal. Absence de thrombose veineuse profonde (TVP).'
    },
    pathologicalVersion: {
      pathologyName: 'Thrombose Veineuse Profonde (TVP) fémoro-poplitée',
      technique: 'Examen Doppler ciblé du membre inférieur gauche.',
      description: 'Défaut d\'incompressibilité complète de la veine fémorale superficielle au tiers moyen de la cuisse et de la veine poplitée gauche.\nMatériel thrombotique intraluminal obstruant la quasi-totalité de la lumière veineuse avec absence de signal couleur en mode Doppler couleur.',
      conclusion: 'Thrombose veineuse profonde fémoro-poplitée gauche aiguë obstructive.'
    }
  },
  {
    id: 'doppler-carotide',
    title: 'Écho-Doppler des Vaisseaux Cervicaux (Carotides & Vertébrales)',
    modality: 'Écho-Doppler',
    mainExamCategory: 'Vasculaire',
    indicationDefault: 'Bilan d\'accident vasculaire cérébral ischémique transitoire (AIT).',
    normalVersion: {
      technique: 'Exploration écho-Doppler couleur et pulsé des carotides communes, internes, externes et artères vertébrales.',
      description: 'ARTÈRES CAROTIDES COMMUNES : Calibrées, lisses. Épaisseur intima-média (EIM = 0.7 mm) normale.\nARTÈRES CAROTIDES INTERNES (ACI) ET EXTERNES : Absence de plaque d\'athérome significative au niveau des bifurcations.\nFlux Doppler physiologiques (VSM ACI < 100 cm/s).\nARTÈRES VERTÉBRALES : Flux antérogrades de direction normale.',
      conclusion: 'Examen écho-Doppler carotidien et vertébral normal. Absence d\'athéromatose sténosante.'
    },
    pathologicalVersion: {
      pathologyName: 'Sténose carotidienne interne serrée',
      technique: 'Exploration de l\'arbre artériel cervical par Doppler bidimensionnel et spectral.',
      description: 'Volumineuse plaque athéromateuse calcifiée et fibreuse à l\'origine de l\'artère carotide interne droite (ACI).\nVitesse systolique maximale (VSM) enregistrée à la zone de sténose à 260 cm/s avec un rapport ACI/ACC de 4.2, signant une sténose hémodynamiquement significative (70-80%).',
      conclusion: 'Sténose athéromateuse serrée (70-80% NASCET) de la carotide interne droite. Recommandation d\'avis spécialisé.'
    }
  },
  {
    id: 'tdm-cerebral',
    title: 'TDM Cérébral sans injection',
    modality: 'TDM',
    mainExamCategory: 'Neuroradiologie',
    indicationDefault: 'Céphalées brutales atypiques ou traumatisme crânien.',
    normalVersion: {
      technique: 'Acquisition hélicoïdale de la base du crâne au vertex sans injection de produit de contraste iodé.',
      description: 'Absence d\'anomalie de densité spontanée du parenchyme cérébral sous et sus-tentoriel.\nPas de collection péricérébrale extra-durale ou sous-durale visible.\nAbsence d\'hyperdensité spontanée dans les citernes de la base.\nSystème ventriculaire de taille, morphologie et position normales.',
      conclusion: 'TDM cérébral sans anomalie significative décelable. Pas de saignement intracrânien ni d\'ischémie aiguë.'
    },
    pathologicalVersion: {
      pathologyName: 'Signes précoces d\'AVC ischémique',
      technique: 'Scanner cérébral rapide sans injection intraveineuse.',
      description: 'Effacement des sillons corticaux de la sylvienne gauche associé à une dédifférenciation cortico-sous-corticale au niveau du territoire insulaire et du noyau lenticulaire gauche.\nAbsence d\'épanchement sanguin intracrânien éruptif.',
      conclusion: 'Signes scanographiques précoces d\'ischémie aiguë dans le territoire sylvien superficiel et profond gauche. Absence de contre-indication hémorragique à une thrombolyse.'
    }
  },
  {
    id: 'tdm-thoracique',
    title: 'TDM Thoracique Injecté (Angio-scanner pulmonaire)',
    modality: 'TDM',
    mainExamCategory: 'Thorax & Poumon',
    indicationDefault: 'Suspicion d\'embolie pulmonaire aiguë devant dyspnée et douleur thoracique.',
    normalVersion: {
      technique: 'Acquisition tomodensitométrique millimétrique centrée sur le thorax au temps artériel pulmonaire après injection de produit de contraste iodé.',
      description: 'Opacification homogène du tronc de l\'artère pulmonaire, des branches principales droite et gauche, des artères lobaires, segmentaires et sous-segmentaires bilatérales.\nAbsence de lacune intraluminale ou de thrombus obstructif.\nParenchyme pulmonaire bilatéral sans foyer de condensation ni opacité en verre dépoli.\nPas d\'épanchement pleural.',
      conclusion: 'Angio-scanner pulmonaire négatif : absence d\'embolie pulmonaire décelable.'
    },
    pathologicalVersion: {
      pathologyName: 'Embolie Pulmonaire Bilatérale',
      technique: 'Angio-scanner pulmonaire au temps d\'opacification maximale de l\'artère pulmonaire.',
      description: 'Visualisation de multiples défauts de rehaussement endoluminaux (lacunes) au niveau de l\'artère lobaire inférieure droite et de la branche segmentaire postérieure du lobe supérieur gauche.\nIndex ventriculaire droit / ventricule gauche (VD/VG) mesuré à 0.85 (pas de signe majeur de cœur pulmonaire aigu).',
      conclusion: 'Embolie pulmonaire fibrino-cruorique récente bilatérale (segmentaire et lobaire) sans retentissement majeur sur le ventricule droit.'
    }
  },
  {
    id: 'tdm-abdo-pelvienne',
    title: 'TDM Abdomino-pelvienne injectée',
    modality: 'TDM',
    mainExamCategory: 'Abdomen & Tube Digestif',
    indicationDefault: 'Suspicion de diverticulite aiguë fébrile ou syndrome occlusif.',
    normalVersion: {
      technique: 'Acquisition hélicoïdale abdomino-pelvienne après injection de produit de contraste iodé (temps portal).',
      description: 'Pancréas, rate, surrénales et reins de morphologie et rehaussement physiologiques.\nAbsence d\'anomalie de calibre de la lumière digestive. Pas de pneumopéritoine ni d\'épanchement liquidien libre intra-abdominal.\nAppendice de calibre normal rétroversé sain de structure régulière.',
      conclusion: 'Examen tomodensitométrique abdomino-pelvien injecté physiologique. Pas de foyer infectieux profond.'
    },
    pathologicalVersion: {
      pathologyName: 'Diverticulite aiguë sigmoïdienne',
      technique: 'Scanner abdomino-pelvien injecté au temps portal.',
      description: 'Épaississement circonférentiel régulier de la paroi du côlon sigmoïde sur environ 8 cm, associé à la présence de multiples diverticules de la paroi colique.\nDensification marquée de la graisse péricolique adjacente avec présence de quelques bulles d\'air millimétriques extraluminales (micro-perforations couvertes).',
      conclusion: 'Diverticulite sigmoïdienne aiguë non compliquée d\'abcès franc ni de pneumopéritoine massif (Stade Ia Hinchey).'
    }
  },
  {
    id: 'irm-genou',
    title: 'IRM du Genou',
    modality: 'IRM',
    mainExamCategory: 'Ostéo-articulaire',
    indicationDefault: 'Instabilité du genou suite à une entorse lors de la pratique sportive.',
    normalVersion: {
      technique: 'Protocoles sur appareil à haut champ 1.5 T (T1, T2 DP-FATSAT) dans les trois plans.',
      description: 'LIGAMENTS CROISÉS : LCA et LCP continus, d\'orientation et de signal normaux.\nMÉNISQUES : Ménisques interne et externe d\'aspect triangulaire en signal homogène noir sans fissure.\nLIGAMENTS COLLATÉRAUX : Fins et normaux.\nCARTILAGE ET OS : Pas d\'œdème osseux ni de lésion cartilagineuse focalisée.',
      conclusion: 'IRM du genou dans les limites de la normale. Intégrité des structures ligamentaires et méniscales.'
    },
    pathologicalVersion: {
      pathologyName: 'Rupture complète du LCA',
      technique: 'Protocoles standards trois plans en densité de proton avec fat-sat.',
      description: 'LIGAMENTS CROISÉS : Rupture complète des fibres du ligament croisé antérieur (LCA) dans sa portion moyenne avec hypersignal T2 diffus et horizontalisation du moignon distal.\nSTRUCTURE OSSEUSE : Présence d\'un œdème de contusion osseuse (kissing contusion) du condyle fémoral externe et du plateau tibial externe.',
      conclusion: 'Rupture complète du ligament croisé antérieur droit associée à des contusions osseuses typiques de pivot d\'entorse.'
    }
  },
  {
    id: 'irm-cerebrale',
    title: 'IRM Cérébrale',
    modality: 'IRM',
    mainExamCategory: 'Neuroradiologie',
    indicationDefault: 'Bilan de vertiges et paresthésies des membres.',
    normalVersion: {
      technique: 'Séquences T1, T2, FLAIR, Diffusion (DWI), cartographie ADC et T1 après injection de Gadolinium.',
      description: 'Absence d\'anomalie de signal d\'aspect pathologique focal du parenchyme cérébral.\nPas de restriction du coefficient apparent de diffusion (ADC).\nPas d\'anomalie de signal sur la séquence FLAIR au sein de la substance blanche.\nPas de prise de contraste anormale après injection de Gadolinium.',
      conclusion: 'IRM cérébrale morphologique et de diffusion normale pour l\'âge.'
    },
    pathologicalVersion: {
      pathologyName: 'Lésions démyélinisantes (SEP)',
      technique: 'Examen IRM multiparamétrique cérébral systématique.',
      description: 'Présence de multiples anomalies de signal en hypersignal T2 et FLAIR, de forme ovoïde, touchant préférentiellement la substance blanche péri-ventriculaire (doigts de Dawson).\nRehaussement franc de deux lésions sur la séquence T1 après injection de Gadolinium.',
      conclusion: 'Présence de lésions démyélinisantes disséminées dans l\'espace et dans le temps, compatibles avec une sclérose en plaques (Critères de McDonald).'
    }
  }
];

export function Reports() {
  // Main Navigation Section
  const [mainSection, setMainSection] = useState<'individual' | 'clinic'>('individual');

  // --- INDIVIDUAL MODE STATES ---
  const [indSearch, setIndSearch] = useState('');
  const [indModality, setIndModality] = useState<ReportModality | 'Toutes'>('Toutes');
  const [indCategory, setIndCategory] = useState<string>('Toutes les catégories');
  const [indSelectedTemplate, setIndSelectedTemplate] = useState<ReportTemplate>(templatesData[0]);
  const [indIsPathological, setIndIsPathological] = useState(false);
  const [indCopiedReport, setIndCopiedReport] = useState(false);
  const [indCopiedConclusion, setIndCopiedConclusion] = useState(false);

  // --- CLINIC MODE STATES ---
  const [selectedModality, setSelectedModality] = useState<ReportModality>('Radiographie standard');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTemplate, setSelectedTemplate] = useState<ReportTemplate>(templatesData[0]);
  
  const [patientName, setPatientName] = useState('Jean Dupont');
  const [patientDob, setPatientDob] = useState('15/08/1982');
  const [customIndication, setCustomIndication] = useState('');
  const [isPathological, setIsPathological] = useState(false);
  const [radiologistSignature, setRadiologistSignature] = useState('Dr BOUMERTA');
  
  const [selectedLogo, setSelectedLogo] = useState<'cross_blue' | 'cross_green' | 'imaging_ring' | 'custom' | 'none'>('cross_blue');
  const [customLogoBase64, setCustomLogoBase64] = useState<string>('');
  const [clinicName, setClinicName] = useState("CENTRE D'IMAGERIE EXCELLENCE - E-RADIOLOGIE");
  const [clinicAddress, setClinicAddress] = useState("12 Avenue de la République, 75011 Paris");
  const [clinicPhone, setClinicPhone] = useState("Tél: 01 42 34 56 78 | Email: contact@e-radiologie.fr");
  
  const [customTechnique, setCustomTechnique] = useState('');
  const [customDescription, setCustomDescription] = useState('');
  const [customConclusion, setCustomConclusion] = useState('');

  const [previewTab, setPreviewTab] = useState<'layout' | 'raw'>('layout');
  const [manualFullText, setManualFullText] = useState('');
  const [isFullTextManuallyEdited, setIsFullTextManuallyEdited] = useState(false);
  const [copied, setCopied] = useState(false);

  // Sync clinic editable fields when clinic template or pathology changes
  useEffect(() => {
    const version = isPathological && selectedTemplate.pathologicalVersion 
      ? selectedTemplate.pathologicalVersion 
      : selectedTemplate.normalVersion;

    setCustomTechnique(version.technique);
    setCustomDescription(version.description);
    setCustomConclusion(version.conclusion);
    setIsFullTextManuallyEdited(false);
  }, [selectedTemplate.id, isPathological]);

  // Handle transfer from Individual Mode to Clinic Mode
  const handleTransferToClinic = (tpl: ReportTemplate, pathological: boolean) => {
    setSelectedTemplate(tpl);
    setIsPathological(pathological);
    setCustomIndication(tpl.indicationDefault);
    const version = pathological && tpl.pathologicalVersion ? tpl.pathologicalVersion : tpl.normalVersion;
    setCustomTechnique(version.technique);
    setCustomDescription(version.description);
    setCustomConclusion(version.conclusion);
    setMainSection('clinic');
  };

  // Filter templates for Individual Mode
  const filteredIndTemplates = templatesData.filter(t => {
    const matchesModality = indModality === 'Toutes' || t.modality === indModality;
    const matchesCategory = indCategory === 'Toutes les catégories' || t.mainExamCategory === indCategory;
    const matchesSearch = indSearch.trim() === '' ||
      t.title.toLowerCase().includes(indSearch.toLowerCase()) ||
      t.normalVersion.conclusion.toLowerCase().includes(indSearch.toLowerCase()) ||
      (t.pathologicalVersion?.pathologyName.toLowerCase().includes(indSearch.toLowerCase()) ?? false);
    return matchesModality && matchesCategory && matchesSearch;
  });

  // Filter templates for Clinic Mode
  const filteredClinicTemplates = templatesData.filter(t => {
    const matchesModality = t.modality === selectedModality;
    const matchesSearch = searchQuery.trim() === '' || 
      t.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.normalVersion.conclusion.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (t.pathologicalVersion?.pathologyName.toLowerCase().includes(searchQuery.toLowerCase()) ?? false);
    return matchesModality && matchesSearch;
  });

  const handleSelectClinicTemplate = (tpl: ReportTemplate) => {
    setSelectedTemplate(tpl);
    setCustomIndication(tpl.indicationDefault);
    setIsPathological(false);
    setCustomTechnique(tpl.normalVersion.technique);
    setCustomDescription(tpl.normalVersion.description);
    setCustomConclusion(tpl.normalVersion.conclusion);
    setIsFullTextManuallyEdited(false);
  };

  // Helper to compile report text in Clinic Mode
  const generateClinicReportText = () => {
    if (isFullTextManuallyEdited && manualFullText) {
      return manualFullText;
    }
    const currentDate = new Date().toLocaleDateString('fr-FR');
    const indicationValue = customIndication || selectedTemplate.indicationDefault;

    return `==================================================
${clinicName.toUpperCase()}
==================================================
Le : ${currentDate}

COMPTE RENDU D'EXAMEN : ${selectedTemplate.title.toUpperCase()}
--------------------------------------------------
PATIENT : ${patientName}
DATE DE NAISSANCE : ${patientDob}
--------------------------------------------------

INDICATION :
${indicationValue}

TECHNIQUE :
${customTechnique}

RÉSULTATS :
${customDescription}

CONCLUSION :
${customConclusion}

--------------------------------------------------
Examen interprété par : ${radiologistSignature}
Rapport validé électroniquement.
==================================================`;
  };

  // Compile standard reference report text in Individual Mode
  const generateIndReportText = () => {
    const version = indIsPathological && indSelectedTemplate.pathologicalVersion 
      ? indSelectedTemplate.pathologicalVersion 
      : indSelectedTemplate.normalVersion;

    return `COMPTE RENDU TYPE : ${indSelectedTemplate.title.toUpperCase()}
MODALITÉ : ${indSelectedTemplate.modality}
EXAMEN PRINCIPAL : ${indSelectedTemplate.mainExamCategory}
VERSION : ${indIsPathological && indSelectedTemplate.pathologicalVersion ? `PATHOLOGIQUE (${indSelectedTemplate.pathologicalVersion.pathologyName})` : 'NORMALE / PHYSIOLOGIQUE'}
--------------------------------------------------
INDICATION CLINIQUE TYPE :
${indSelectedTemplate.indicationDefault}

TECHNIQUE D'EXPLORATION :
${version.technique}

RÉSULTATS ET OBSERVATIONS :
${version.description}

CONCLUSION DIAGNOSTIQUE :
${version.conclusion}
--------------------------------------------------
(Modèle type de référence non modifiable)`;
  };

  const handleCopyIndReport = () => {
    navigator.clipboard.writeText(generateIndReportText()).then(() => {
      setIndCopiedReport(true);
      setTimeout(() => setIndCopiedReport(false), 2000);
    });
  };

  const handleCopyIndConclusion = () => {
    const version = indIsPathological && indSelectedTemplate.pathologicalVersion 
      ? indSelectedTemplate.pathologicalVersion 
      : indSelectedTemplate.normalVersion;
    navigator.clipboard.writeText(version.conclusion).then(() => {
      setIndCopiedConclusion(true);
      setTimeout(() => setIndCopiedConclusion(false), 2000);
    });
  };

  const handleCopyToClipboardClinic = () => {
    const text = generateClinicReportText();
    navigator.clipboard.writeText(text).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  const handleDownloadClinic = () => {
    const text = generateClinicReportText();
    const element = document.createElement("a");
    const file = new Blob([text], {type: 'text/plain;charset=utf-8'});
    element.href = URL.createObjectURL(file);
    element.download = `CR_${selectedTemplate.id}_${patientName.replace(/\s+/g, '_')}.txt`;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  const handlePrintClinic = () => {
    const currentDate = new Date().toLocaleDateString('fr-FR');
    const printWindow = window.open('', '_blank');
    if (!printWindow) return;

    let logoHtml = '';
    if (selectedLogo === 'custom' && customLogoBase64) {
      logoHtml = `<img src="${customLogoBase64}" style="max-height: 60px; max-width: 150px; object-fit: contain;" />`;
    } else if (selectedLogo === 'cross_blue') {
      logoHtml = `
        <svg width="50" height="50" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <rect x="9" y="2" width="6" height="20" rx="1.5" fill="#2563eb"/>
          <rect x="2" y="9" width="20" height="6" rx="1.5" fill="#2563eb"/>
          <circle cx="12" cy="12" r="2.5" fill="#ffffff"/>
        </svg>
      `;
    } else if (selectedLogo === 'cross_green') {
      logoHtml = `
        <svg width="50" height="50" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <rect x="9" y="2" width="6" height="20" rx="1.5" fill="#059669"/>
          <rect x="2" y="9" width="20" height="6" rx="1.5" fill="#059669"/>
          <circle cx="12" cy="12" r="2.5" fill="#ffffff"/>
        </svg>
      `;
    } else if (selectedLogo === 'imaging_ring') {
      logoHtml = `
        <svg width="50" height="50" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <circle cx="12" cy="12" r="9" stroke="#4f46e5" stroke-width="2.5" stroke-dasharray="3 2" />
          <circle cx="12" cy="12" r="4.5" fill="#4f46e5" />
        </svg>
      `;
    }

    printWindow.document.write(`
      <!DOCTYPE html>
      <html>
        <head>
          <title>Compte Rendu - ${patientName}</title>
          <style>
            @media print {
              body { background-color: white !important; color: #000000 !important; }
            }
            body { background-color: white; color: #111827; font-family: Calibri, Arial, sans-serif; margin: 40px; }
            .report-header { display: flex; align-items: center; border-bottom: 2px solid #334155; padding-bottom: 15px; margin-bottom: 25px; }
            .logo-container { margin-right: 20px; }
            .clinic-name { font-size: 18px; font-weight: bold; color: #0f172a; margin: 0; text-transform: uppercase; }
            .clinic-meta { font-size: 11px; color: #475569; margin: 3px 0 0 0; }
            .report-title { font-size: 16px; font-weight: bold; text-transform: uppercase; border-bottom: 2.5px solid #000; display: inline-block; padding-bottom: 4px; }
            .patient-card { background-color: #f8fafc; border: 1px solid #cbd5e1; padding: 12px; margin-bottom: 25px; display: flex; justify-content: space-between; font-size: 13px; }
            .section { margin-bottom: 20px; }
            .section-title { font-size: 13px; font-weight: bold; text-transform: uppercase; color: #0f172a; border-bottom: 1.5px solid #cbd5e1; padding-bottom: 3px; margin-bottom: 8px; }
            .section-body { font-size: 13px; line-height: 1.5; color: #1e293b; white-space: pre-wrap; }
            .conclusion-box { border: 2px solid #000000; padding: 12px; background-color: #f8fafc; margin-top: 20px; }
            .footer { margin-top: 40px; border-top: 1px dashed #94a3b8; padding-top: 12px; font-size: 11px; text-align: right; }
          </style>
        </head>
        <body>
          <div class="report-header">
            ${logoHtml ? `<div class="logo-container">${logoHtml}</div>` : ''}
            <div style="flex-grow: 1;">
              <h1 class="clinic-name">${clinicName}</h1>
              <p class="clinic-meta">${clinicAddress}</p>
              <p class="clinic-meta">${clinicPhone}</p>
            </div>
            <div style="text-align: right; font-size: 11px; color: #475569;">Le : ${currentDate}</div>
          </div>
          <div style="text-align: center; margin-bottom: 25px;">
            <h2 class="report-title">COMPTE RENDU : ${selectedTemplate.title.toUpperCase()}</h2>
          </div>
          <div class="patient-card">
            <div><strong>PATIENT :</strong> ${patientName}</div>
            <div><strong>DATE DE NAISSANCE :</strong> ${patientDob}</div>
            <div><strong>DATE D'EXAMEN :</strong> ${currentDate}</div>
          </div>
          <div class="section"><h3 class="section-title">INDICATION</h3><div class="section-body">${customIndication || selectedTemplate.indicationDefault}</div></div>
          <div class="section"><h3 class="section-title">TECHNIQUE D'EXPLORATION</h3><div class="section-body">${customTechnique}</div></div>
          <div class="section"><h3 class="section-title">RÉSULTATS</h3><div class="section-body">${customDescription}</div></div>
          <div class="section conclusion-box"><h3 class="section-title" style="border:none; margin-bottom:4px; color:#000;">CONCLUSION</h3><div class="section-body" style="font-weight:bold; color:#000;">${customConclusion}</div></div>
          <div class="footer"><p style="margin:0; font-weight:bold;">Interprété par : ${radiologistSignature}</p><p style="margin:3px 0 0 0; color:#64748b;">Rapport validé électroniquement le ${currentDate}</p></div>
        </body>
      </html>
    `);
    printWindow.document.close();
    printWindow.focus();
    setTimeout(() => { printWindow.print(); }, 250);
  };

  const renderHeaderLogo = () => {
    if (selectedLogo === 'custom' && customLogoBase64) {
      return <img src={customLogoBase64} alt="Logo" className="max-h-12 max-w-[120px] object-contain rounded" referrerPolicy="no-referrer" />;
    } else if (selectedLogo === 'cross_blue') {
      return (
        <svg width="36" height="36" viewBox="0 0 24 24" fill="none" className="text-blue-600 shrink-0" xmlns="http://www.w3.org/2000/svg">
          <rect x="9" y="2" width="6" height="20" rx="1.5" fill="currentColor"/>
          <rect x="2" y="9" width="20" height="6" rx="1.5" fill="currentColor"/>
          <circle cx="12" cy="12" r="2.5" fill="#ffffff"/>
        </svg>
      );
    } else if (selectedLogo === 'cross_green') {
      return (
        <svg width="36" height="36" viewBox="0 0 24 24" fill="none" className="text-emerald-600 shrink-0" xmlns="http://www.w3.org/2000/svg">
          <rect x="9" y="2" width="6" height="20" rx="1.5" fill="currentColor"/>
          <rect x="2" y="9" width="20" height="6" rx="1.5" fill="currentColor"/>
          <circle cx="12" cy="12" r="2.5" fill="#ffffff"/>
        </svg>
      );
    } else if (selectedLogo === 'imaging_ring') {
      return (
        <svg width="36" height="36" viewBox="0 0 24 24" fill="none" className="text-indigo-600 shrink-0" xmlns="http://www.w3.org/2000/svg">
          <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="2.5" strokeDasharray="3 2" />
          <circle cx="12" cy="12" r="4.5" fill="currentColor" />
        </svg>
      );
    }
    return null;
  };

  const activeIndVersion = indIsPathological && indSelectedTemplate.pathologicalVersion 
    ? indSelectedTemplate.pathologicalVersion 
    : indSelectedTemplate.normalVersion;

  return (
    <div id="reports-root" className="bg-slate-50 min-h-screen py-10 font-sans">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Main Page Title Header */}
        <div id="reports-header" className="mb-8 text-center max-w-4xl mx-auto space-y-3">
          <Badge variant="outline" className="px-3.5 py-1 text-emerald-700 border-emerald-300 bg-emerald-50 rounded-full font-bold uppercase text-[10px] tracking-widest shadow-sm">
            DOCUMENTATION & IMPRESSION D'IMAGERIE
          </Badge>
          <h1 className="text-3xl font-black text-slate-900 tracking-tight sm:text-4xl">
            Comptes Rendus Radiologiques
          </h1>
          <p className="text-slate-600 text-sm sm:text-base leading-relaxed">
            Consultez les modèles de référence non modifiables ou générez des comptes-rendus officiels pour votre centre ou clinique.
          </p>
        </div>

        {/* TOP LEVEL NAVIGATION TOGGLE: 2 PARTIES */}
        <div className="mb-8 bg-slate-200/80 p-2 rounded-2xl border border-slate-300/70 shadow-inner max-w-3xl mx-auto flex flex-col sm:flex-row gap-2">
          <button
            id="tab-usage-individuel"
            onClick={() => setMainSection('individual')}
            className={`flex-1 py-3 px-4 rounded-xl text-xs sm:text-sm font-bold transition-all flex items-center justify-center gap-2.5 cursor-pointer ${
              mainSection === 'individual'
                ? 'bg-rose-600 text-white shadow-md ring-2 ring-rose-500/30'
                : 'text-slate-700 hover:text-slate-900 hover:bg-slate-300/60'
            }`}
          >
            <UserCheck className="w-4 h-4 shrink-0" />
            <span>1. Usage Individuel (Médecin)</span>
            <span className="text-[9px] bg-rose-700/80 text-white px-2 py-0.5 rounded-full uppercase font-mono tracking-wider ml-1 hidden sm:inline-block">
              Non Modifiables
            </span>
          </button>

          <button
            id="tab-usage-clinique"
            onClick={() => setMainSection('clinic')}
            className={`flex-1 py-3 px-4 rounded-xl text-xs sm:text-sm font-bold transition-all flex items-center justify-center gap-2.5 cursor-pointer ${
              mainSection === 'clinic'
                ? 'bg-rose-600 text-white shadow-md ring-2 ring-rose-500/30'
                : 'text-slate-700 hover:text-slate-900 hover:bg-slate-300/60'
            }`}
          >
            <Building2 className="w-4 h-4 shrink-0" />
            <span>2. Centres & Cliniques</span>
            <span className="text-[9px] bg-rose-700/80 text-white px-2 py-0.5 rounded-full uppercase font-mono tracking-wider ml-1 hidden sm:inline-block">
              Éditeur Officiel
            </span>
          </button>
        </div>

        {/* ==================================================================== */}
        {/* PARTIE 1 : USAGE INDIVIDUEL (COMPTES RENDUS TYPES NON MODIFIABLES) */}
        {/* ==================================================================== */}
        {mainSection === 'individual' && (
          <div className="space-y-6">
            
            {/* Header info banner for Individual Mode */}
            <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="p-1.5 rounded-lg bg-rose-100 text-rose-600 font-bold text-xs flex items-center gap-1">
                    <Lock className="w-3.5 h-3.5" /> Modèles Référence
                  </span>
                  <h2 className="text-base font-bold text-slate-900">
                    Comptes-Rendus Types Non Modifiables
                  </h2>
                </div>
                <p className="text-xs text-slate-500">
                  Organisés par <strong>Modalités</strong> et <strong>Examens Principaux</strong>. Consultez, copiez et intégrez dans votre dictée vocale ou logiciel.
                </p>
              </div>

              {/* Category Dropdown filter */}
              <div className="flex items-center gap-2 shrink-0">
                <span className="text-xs font-bold text-slate-500 uppercase">Examen Principal :</span>
                <select
                  id="ind-category-select"
                  value={indCategory}
                  onChange={(e) => setIndCategory(e.target.value)}
                  className="bg-slate-50 border border-slate-200 text-slate-800 text-xs font-semibold rounded-xl px-3 py-2 outline-none focus:ring-2 focus:ring-rose-500 cursor-pointer"
                >
                  {MAIN_EXAM_CATEGORIES.map((cat) => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* Modalities Filter Pills */}
            <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div className="flex items-center gap-2 shrink-0">
                <Filter className="h-4 w-4 text-slate-400" />
                <span className="text-xs font-bold text-slate-600 uppercase tracking-wider">Modalités :</span>
              </div>

              <div className="flex flex-wrap gap-2">
                <button
                  onClick={() => setIndModality('Toutes')}
                  className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                    indModality === 'Toutes'
                      ? 'bg-rose-600 text-white shadow-sm'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  Toutes les modalités
                </button>
                {(['Radiographie standard', 'Échographie', 'Écho-Doppler', 'TDM', 'IRM'] as ReportModality[]).map((mod) => (
                  <button
                    key={mod}
                    onClick={() => setIndModality(mod)}
                    className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                      indModality === mod
                        ? 'bg-rose-600 text-white shadow-sm'
                        : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                    }`}
                  >
                    {mod}
                  </button>
                ))}
              </div>

              <div className="relative max-w-xs w-full">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-slate-400" />
                <Input
                  id="ind-search-input"
                  placeholder="Rechercher par examen ou pathologie..."
                  value={indSearch}
                  onChange={(e) => setIndSearch(e.target.value)}
                  className="py-1.5 px-8 text-xs rounded-xl bg-slate-50 border-slate-200 focus:bg-white w-full"
                />
              </div>
            </div>

            {/* Main Grid: Left catalogue of examens principaux, Right read-only display */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
              
              {/* Left Column: Catalogue List */}
              <div className="lg:col-span-4 bg-white border border-slate-200 rounded-2xl p-4 shadow-sm space-y-3">
                <div className="flex items-center justify-between border-b pb-2">
                  <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                    Examens Principaux ({filteredIndTemplates.length})
                  </h3>
                  <span className="text-[10px] bg-slate-100 text-slate-600 px-2 py-0.5 rounded-full font-mono">
                    Non Modifiables
                  </span>
                </div>

                {filteredIndTemplates.length === 0 ? (
                  <div className="text-center py-8 text-xs text-slate-400">
                    Aucun compte-rendu type ne correspond à ces critères.
                  </div>
                ) : (
                  <div className="space-y-2 max-h-[600px] overflow-y-auto pr-1">
                    {filteredIndTemplates.map((tpl) => {
                      const isSelected = indSelectedTemplate.id === tpl.id;
                      return (
                        <button
                          key={tpl.id}
                          onClick={() => {
                            setIndSelectedTemplate(tpl);
                            setIndIsPathological(false);
                          }}
                          className={`w-full text-left p-3 rounded-xl border transition-all flex flex-col gap-1.5 cursor-pointer ${
                            isSelected
                              ? 'bg-rose-50 border-rose-400 shadow-sm'
                              : 'border-slate-100 hover:bg-slate-50'
                          }`}
                        >
                          <div className="flex items-center justify-between gap-1">
                            <span className={`text-xs font-bold ${isSelected ? 'text-rose-950' : 'text-slate-800'}`}>
                              {tpl.title}
                            </span>
                            <span className="text-[9px] font-semibold px-2 py-0.5 rounded bg-slate-100 text-slate-600 shrink-0">
                              {tpl.modality}
                            </span>
                          </div>
                          
                          <div className="flex items-center justify-between text-[10px] text-slate-500">
                            <span className="font-medium text-slate-600">{tpl.mainExamCategory}</span>
                            {tpl.pathologicalVersion && (
                              <span className="text-amber-600 font-bold flex items-center gap-1">
                                ● {tpl.pathologicalVersion.pathologyName}
                              </span>
                            )}
                          </div>
                        </button>
                      );
                    })}
                  </div>
                )}
              </div>

              {/* Right Column: Read-Only Standard Reference Viewer */}
              <div className="lg:col-span-8 space-y-6">
                
                <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm space-y-6 relative overflow-hidden">
                  
                  {/* Lock Indicator Bar */}
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b pb-4">
                    <div>
                      <div className="flex items-center gap-2">
                        <Badge className="bg-slate-800 text-white text-[10px] px-2.5 py-0.5 rounded-md font-mono uppercase">
                          {indSelectedTemplate.modality}
                        </Badge>
                        <Badge className="bg-rose-100 text-rose-700 text-[10px] px-2.5 py-0.5 rounded-md font-bold uppercase border border-rose-200">
                          {indSelectedTemplate.mainExamCategory}
                        </Badge>
                      </div>
                      <h2 className="text-xl font-extrabold text-slate-900 mt-2">
                        {indSelectedTemplate.title}
                      </h2>
                    </div>

                    {/* Version Switcher (Normale vs Pathologique) */}
                    {indSelectedTemplate.pathologicalVersion && (
                      <div className="flex bg-slate-100 p-1 rounded-xl border border-slate-200 shrink-0">
                        <button
                          onClick={() => setIndIsPathological(false)}
                          className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                            !indIsPathological
                              ? 'bg-emerald-600 text-white shadow-sm'
                              : 'text-slate-600 hover:text-slate-900'
                          }`}
                        >
                          Version Normale
                        </button>
                        <button
                          onClick={() => setIndIsPathological(true)}
                          className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                            indIsPathological
                              ? 'bg-amber-600 text-white shadow-sm'
                              : 'text-slate-600 hover:text-slate-900'
                          }`}
                        >
                          Pathologie : {indSelectedTemplate.pathologicalVersion.pathologyName}
                        </button>
                      </div>
                    )}
                  </div>

                  {/* READ-ONLY DISPLAY BOX (Non Modifiable) */}
                  <div className="bg-slate-50 border border-slate-200 rounded-2xl p-6 sm:p-8 space-y-5 relative">
                    
                    <div className="flex items-center justify-between text-[11px] font-bold uppercase tracking-wider text-slate-400 border-b pb-2">
                      <span className="flex items-center gap-1.5 text-slate-600">
                        <ShieldCheck className="w-4 h-4 text-emerald-600" />
                        Compte-Rendu Type Standardisé Non Modifiable
                      </span>
                      <span className="font-mono text-slate-400">RÉFÉRENCE OFFICIELLE</span>
                    </div>

                    {/* Section 1: Indication */}
                    <div className="space-y-1">
                      <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest block">
                        Indication Clinique Type :
                      </span>
                      <p className="text-xs text-slate-800 font-semibold italic bg-white p-3 rounded-xl border border-slate-200">
                        {indSelectedTemplate.indicationDefault}
                      </p>
                    </div>

                    {/* Section 2: Technique */}
                    <div className="space-y-1">
                      <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest block">
                        Technique d'Exploration :
                      </span>
                      <p className="text-xs text-slate-800 font-medium bg-white p-3 rounded-xl border border-slate-200 leading-relaxed">
                        {activeIndVersion.technique}
                      </p>
                    </div>

                    {/* Section 3: Description / Résultats */}
                    <div className="space-y-1">
                      <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest block">
                        Résultats & Observations Sémiologiques :
                      </span>
                      <div className="text-xs text-slate-800 font-medium bg-white p-4 rounded-xl border border-slate-200 leading-relaxed whitespace-pre-wrap">
                        {activeIndVersion.description}
                      </div>
                    </div>

                    {/* Section 4: Conclusion */}
                    <div className="space-y-1">
                      <span className="text-[10px] font-extrabold text-slate-900 uppercase tracking-widest block">
                        Conclusion Diagnostique :
                      </span>
                      <div className="text-xs text-slate-950 font-bold bg-emerald-50/80 p-4 rounded-xl border-2 border-emerald-500/80 leading-relaxed">
                        {activeIndVersion.conclusion}
                      </div>
                    </div>

                  </div>

                  {/* Actions toolbar for Individual Mode */}
                  <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-2 border-t">
                    <div className="flex gap-2 w-full sm:w-auto">
                      <Button
                        id="btn-copy-full-report"
                        onClick={handleCopyIndReport}
                        className={`flex-1 sm:flex-initial gap-1.5 text-xs font-bold px-4 py-2 rounded-xl transition-all cursor-pointer ${
                          indCopiedReport 
                            ? 'bg-emerald-600 text-white' 
                            : 'bg-slate-900 hover:bg-slate-800 text-white'
                        }`}
                      >
                        {indCopiedReport ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                        <span>{indCopiedReport ? 'Compte-rendu copié !' : 'Copier le compte-rendu'}</span>
                      </Button>

                      <Button
                        id="btn-copy-conclusion"
                        variant="outline"
                        onClick={handleCopyIndConclusion}
                        className="gap-1.5 text-xs font-bold px-4 py-2 rounded-xl border-slate-300 text-slate-700 hover:bg-slate-100 cursor-pointer"
                      >
                        {indCopiedConclusion ? <Check className="w-4 h-4 text-emerald-600" /> : <BookOpen className="w-4 h-4 text-slate-500" />}
                        <span>{indCopiedConclusion ? 'Conclusion copiée !' : 'Copier conclusion'}</span>
                      </Button>
                    </div>

                    <Button
                      id="btn-transfer-clinic"
                      onClick={() => handleTransferToClinic(indSelectedTemplate, indIsPathological)}
                      className="w-full sm:w-auto gap-1.5 text-xs font-bold px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-700 text-white shadow-sm cursor-pointer"
                    >
                      <span>Transférer dans l'Éditeur Clinique</span>
                      <ArrowRight className="w-4 h-4" />
                    </Button>
                  </div>

                </div>

              </div>

            </div>

          </div>
        )}

        {/* ==================================================================== */}
        {/* PARTIE 2 : USAGE POUR LES CENTRES D'IMAGERIE ET CLINIQUES */}
        {/* ==================================================================== */}
        {mainSection === 'clinic' && (
          <div className="space-y-8">
            
            {/* Navigation modalities grid inside main container */}
            <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div className="flex items-center gap-1.5 shrink-0">
                <Filter className="h-4 w-4 text-slate-400" />
                <span className="text-xs font-bold text-slate-500 uppercase tracking-widest">Modalités :</span>
              </div>

              {/* 5 Modalities navigation row */}
              <div className="flex flex-wrap gap-2">
                {(['Radiographie standard', 'Échographie', 'Écho-Doppler', 'TDM', 'IRM'] as ReportModality[]).map((mod) => {
                  const isActive = selectedModality === mod;
                  return (
                    <button
                      key={mod}
                      onClick={() => {
                        setSelectedModality(mod);
                        const matched = templatesData.find(t => t.modality === mod);
                        if (matched) {
                          handleSelectClinicTemplate(matched);
                        }
                      }}
                      className={`px-4 py-2 rounded-xl text-xs font-bold uppercase transition-all tracking-wider cursor-pointer ${
                        isActive 
                          ? 'bg-rose-600 text-white shadow-md' 
                          : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                      }`}
                    >
                      {mod}
                    </button>
                  );
                })}
              </div>

              {/* Search templates input */}
              <div className="relative max-w-xs w-full">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                <Input
                  id="template-search-clinic"
                  placeholder="Rechercher un modèle..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="py-1 px-9 text-xs rounded-xl bg-slate-50 border-slate-200 focus:bg-white w-full"
                />
              </div>
            </div>

            {/* Main Work Area */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
              
              {/* LEFT LIST - Templates for the selected modality */}
              <div className="lg:col-span-4 bg-white border border-slate-200 rounded-2xl p-4 shadow-sm space-y-4">
                <div>
                  <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest pl-1 mb-2">Examens disponibles</h3>
                  {filteredClinicTemplates.length === 0 ? (
                    <div className="text-center py-8 text-xs text-slate-400">
                      Aucun modèle trouvé pour cette recherche.
                    </div>
                  ) : (
                    <div className="flex flex-col space-y-2">
                      {filteredClinicTemplates.map((tpl) => {
                        const isSelected = selectedTemplate.id === tpl.id;
                        return (
                          <button
                            key={tpl.id}
                            onClick={() => handleSelectClinicTemplate(tpl)}
                            className={`text-left p-3 rounded-xl border transition-all flex flex-col gap-1 cursor-pointer ${
                              isSelected 
                                ? 'bg-rose-50 border-rose-400 font-semibold' 
                                : 'border-slate-100 font-normal hover:bg-slate-50'
                            }`}
                          >
                            <div className="flex items-center gap-1.5">
                              <FileText className={`h-4 w-4 ${isSelected ? 'text-rose-600' : 'text-slate-400'}`} />
                              <span className={`text-xs ${isSelected ? 'text-rose-950 font-bold' : 'text-slate-700 font-medium'}`}>{tpl.title}</span>
                            </div>
                            {tpl.pathologicalVersion && (
                              <div className="pl-5 flex items-center gap-1">
                                <span className="w-1.5 h-1.5 rounded-full bg-amber-500"></span>
                                <span className="text-[10px] text-slate-500">Inclus : {tpl.pathologicalVersion.pathologyName}</span>
                              </div>
                            )}
                          </button>
                        );
                      })}
                    </div>
                  )}
                </div>

                {/* Quick Helper guidelines on structured medical reporting */}
                <div className="bg-slate-50 rounded-xl p-4 border border-slate-150 space-y-2">
                  <div className="flex items-center gap-1.5">
                    <Sparkles className="h-4 w-4 text-rose-500" />
                    <h4 className="text-xs font-bold text-slate-700">En-tête Officiel de Clinique</h4>
                  </div>
                  <p className="text-[11px] text-slate-500 leading-relaxed font-normal">
                    Personnalisez le nom du centre, l'adresse, le logo et l'identité du patient pour imprimer un document médical prêt à être remis.
                  </p>
                </div>
              </div>

              {/* RIGHT VIEWPORT - Interactive Template Form & Dynamic Preview */}
              <div className="lg:col-span-8 space-y-6">
                
                {/* Clinical Branding Header Configuration */}
                <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm space-y-6">
                  <div>
                    <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                      <span className="p-1 px-1.5 rounded-md bg-rose-100 text-rose-700">🎨</span>
                      <span>En-tête & Logo de la Clinique</span>
                    </h2>
                    <p className="text-xs text-slate-500 font-medium mt-0.5">Configurez l'en-tête de votre compte rendu à imprimer.</p>
                  </div>

                  <div className="space-y-4">
                    {/* Logo selection row */}
                    <div className="space-y-2">
                      <span className="text-xs font-bold text-slate-700 uppercase tracking-wider block">Choix du Logo</span>
                      <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
                        <button
                          type="button"
                          onClick={() => setSelectedLogo('cross_blue')}
                          className={`p-2.5 rounded-xl border text-xs font-bold transition-all flex flex-col items-center justify-center gap-1.5 cursor-pointer ${
                            selectedLogo === 'cross_blue'
                              ? 'border-blue-500 bg-blue-50 text-blue-700'
                              : 'border-slate-200 hover:bg-slate-50 text-slate-600'
                          }`}
                        >
                          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" className="text-blue-600" xmlns="http://www.w3.org/2000/svg">
                            <rect x="9" y="2" width="6" height="20" rx="1.5" fill="currentColor"/>
                            <rect x="2" y="9" width="20" height="6" rx="1.5" fill="currentColor"/>
                          </svg>
                          <span>Croix Bleue</span>
                        </button>

                        <button
                          type="button"
                          onClick={() => setSelectedLogo('cross_green')}
                          className={`p-2.5 rounded-xl border text-xs font-bold transition-all flex flex-col items-center justify-center gap-1.5 cursor-pointer ${
                            selectedLogo === 'cross_green'
                              ? 'border-emerald-500 bg-emerald-50 text-emerald-700'
                              : 'border-slate-200 hover:bg-slate-50 text-slate-600'
                          }`}
                        >
                          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" className="text-emerald-600" xmlns="http://www.w3.org/2000/svg">
                            <rect x="9" y="2" width="6" height="20" rx="1.5" fill="currentColor"/>
                            <rect x="2" y="9" width="20" height="6" rx="1.5" fill="currentColor"/>
                          </svg>
                          <span>Croix Verte</span>
                        </button>

                        <button
                          type="button"
                          onClick={() => setSelectedLogo('imaging_ring')}
                          className={`p-2.5 rounded-xl border text-xs font-bold transition-all flex flex-col items-center justify-center gap-1.5 cursor-pointer ${
                            selectedLogo === 'imaging_ring'
                              ? 'border-indigo-500 bg-indigo-50 text-indigo-700'
                              : 'border-slate-200 hover:bg-slate-50 text-slate-600'
                          }`}
                        >
                          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" className="text-indigo-600" xmlns="http://www.w3.org/2000/svg">
                            <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="2.5" strokeDasharray="3 2"/>
                            <circle cx="12" cy="12" r="4.5" fill="currentColor"/>
                          </svg>
                          <span>Scanner Ring</span>
                        </button>

                        <button
                          type="button"
                          onClick={() => setSelectedLogo('none')}
                          className={`p-2.5 rounded-xl border text-xs font-bold transition-all flex flex-col items-center justify-center gap-1.5 cursor-pointer ${
                            selectedLogo === 'none'
                              ? 'border-slate-900 bg-slate-50 text-slate-900'
                              : 'border-slate-200 hover:bg-slate-50 text-slate-600'
                          }`}
                        >
                          <span className="text-base">🚫</span>
                          <span>Sans Logo</span>
                        </button>

                        <div className="relative">
                          <input
                            type="file"
                            id="custom-logo-input-clinic"
                            accept="image/*"
                            onChange={(e) => {
                              const file = e.target.files?.[0];
                              if (file) {
                                const reader = new FileReader();
                                reader.onloadend = () => {
                                  setCustomLogoBase64(reader.result as string);
                                  setSelectedLogo('custom');
                                };
                                reader.readAsDataURL(file);
                              }
                            }}
                            className="hidden"
                          />
                          <button
                            type="button"
                            onClick={() => document.getElementById('custom-logo-input-clinic')?.click()}
                            className={`p-2.5 w-full rounded-xl border text-xs font-bold transition-all flex flex-col items-center justify-center gap-1.5 cursor-pointer ${
                              selectedLogo === 'custom'
                                ? 'border-amber-500 bg-amber-50 text-amber-700'
                                : 'border-slate-200 hover:bg-slate-50 text-slate-600'
                            }`}
                          >
                            <span className="text-base">📁</span>
                            <span>{customLogoBase64 ? 'Logo Chargé' : 'Importer Logo'}</span>
                          </button>
                        </div>
                      </div>
                    </div>

                    {/* Clinic Text Inputs */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      <div className="md:col-span-2 space-y-1">
                        <label htmlFor="clinic-name-field" className="text-xs font-bold text-slate-700 uppercase tracking-wider block">Nom du Centre / Clinique</label>
                        <Input
                          id="clinic-name-field"
                          value={clinicName}
                          onChange={(e) => setClinicName(e.target.value)}
                          className="py-2 text-xs font-semibold"
                        />
                      </div>
                      <div className="space-y-1">
                        <label htmlFor="clinic-address-field" className="text-xs font-bold text-slate-700 uppercase tracking-wider block">Adresse</label>
                        <Input
                          id="clinic-address-field"
                          value={clinicAddress}
                          onChange={(e) => setClinicAddress(e.target.value)}
                          className="py-2 text-xs"
                        />
                      </div>
                      <div className="space-y-1">
                        <label htmlFor="clinic-phone-field" className="text-xs font-bold text-slate-700 uppercase tracking-wider block">Téléphone / Contact</label>
                        <Input
                          id="clinic-phone-field"
                          value={clinicPhone}
                          onChange={(e) => setClinicPhone(e.target.value)}
                          className="py-2 text-xs"
                        />
                      </div>
                    </div>

                  </div>
                </div>

                {/* Template editing control dashboard */}
                <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm space-y-6">
                  
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b pb-4">
                    <div>
                      <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                        <FileEdit className="h-5 w-5 text-rose-600" />
                        <span>Informations du Patient & Examen</span>
                      </h2>
                      <p className="text-xs text-slate-500 font-medium mt-0.5">Saisissez les données patient et personnalisez les observations.</p>
                    </div>
                  </div>

                  {/* Grid of form inputs for real-time injection */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    
                    <div className="space-y-1.5">
                      <label htmlFor="patient-name-field-clinic" className="text-xs font-bold text-slate-700 uppercase tracking-wider block">Nom du Patient</label>
                      <Input
                        id="patient-name-field-clinic"
                        value={patientName}
                        onChange={(e) => setPatientName(e.target.value)}
                        placeholder="ex: Jean Dupont"
                        className="py-2 rounded-lg text-xs"
                      />
                    </div>

                    <div className="space-y-1.5">
                      <label htmlFor="patient-dob-field-clinic" className="text-xs font-bold text-slate-700 uppercase tracking-wider block">Né(e) le</label>
                      <Input
                        id="patient-dob-field-clinic"
                        value={patientDob}
                        onChange={(e) => setPatientDob(e.target.value)}
                        placeholder="JJ/MM/AAAA"
                        className="py-2 rounded-lg text-xs"
                      />
                    </div>

                    <div className="md:col-span-2 space-y-1.5">
                      <label htmlFor="report-indication-field-clinic" className="text-xs font-bold text-slate-700 uppercase tracking-wider block">Indication Clinique</label>
                      <Input
                        id="report-indication-field-clinic"
                        value={customIndication}
                        onChange={(e) => setCustomIndication(e.target.value)}
                        placeholder={selectedTemplate.indicationDefault}
                        className="py-2 rounded-lg text-xs w-full"
                      />
                    </div>

                    <div className="space-y-1.5">
                      <label htmlFor="report-signature-field-clinic" className="text-xs font-bold text-slate-700 uppercase tracking-wider block">Signature du Praticien</label>
                      <Input
                        id="report-signature-field-clinic"
                        value={radiologistSignature}
                        onChange={(e) => setRadiologistSignature(e.target.value)}
                        placeholder="Nom du médecin"
                        className="py-2 rounded-lg text-xs"
                      />
                    </div>

                    {/* Normal/Pathology selector preset */}
                    {selectedTemplate.pathologicalVersion && (
                      <div className="space-y-1.5 flex flex-col justify-end">
                        <label className="text-xs font-bold text-slate-700 uppercase tracking-wider block mb-1">Résultat clinique de l'examen</label>
                        <div className="grid grid-cols-2 gap-2 bg-slate-50 p-1.5 border border-slate-200 rounded-xl">
                          <button
                            onClick={() => setIsPathological(false)}
                            className={`py-1.5 px-3 text-xs font-bold rounded-lg transition-all uppercase tracking-wider flex items-center justify-center gap-1 cursor-pointer ${
                              !isPathological 
                                ? 'bg-emerald-600 text-white shadow-sm' 
                                : 'text-slate-500 hover:text-slate-700'
                            }`}
                          >
                            <UserCheck className="w-3.5 h-3.5" />
                            <span>Normal</span>
                          </button>
                          <button
                            onClick={() => setIsPathological(true)}
                            className={`py-1.5 px-3 text-xs font-bold rounded-lg transition-all uppercase tracking-wider flex items-center justify-center gap-1 cursor-pointer ${
                              isPathological 
                                ? 'bg-amber-600 text-white shadow-sm' 
                                : 'text-slate-500 hover:text-slate-700'
                            }`}
                          >
                            <span className="w-2 h-2 rounded-full bg-white animate-pulse"></span>
                            <span className="truncate">{selectedTemplate.pathologicalVersion.pathologyName}</span>
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {/* PREVIEW CONTAINER (Layout vs Raw TXT) */}
                <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm">
                  
                  <div className="bg-slate-50 px-6 py-4 border-b border-slate-200 flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
                    <div className="flex items-center gap-3">
                      <span className="relative flex h-2.5 w-2.5">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
                      </span>
                      <div>
                        <span className="text-xs font-bold text-slate-700 uppercase tracking-widest block">Aperçu en temps réel</span>
                        <p className="text-[10px] text-slate-500">Modifiez et vérifiez le document avant impression</p>
                      </div>
                    </div>

                    {/* Switch view modes */}
                    <div className="flex bg-slate-200 p-1 rounded-xl shrink-0">
                      <button
                        onClick={() => setPreviewTab('layout')}
                        className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
                          previewTab === 'layout' 
                            ? 'bg-white text-slate-900 shadow-sm' 
                            : 'text-slate-500 hover:text-slate-800'
                        }`}
                      >
                        <FileText className="w-3.5 h-3.5" />
                        <span>Mise en page clinique</span>
                      </button>
                      <button
                        onClick={() => {
                          if (!isFullTextManuallyEdited) {
                            setManualFullText(generateClinicReportText());
                          }
                          setPreviewTab('raw');
                        }}
                        className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
                          previewTab === 'raw' 
                            ? 'bg-white text-slate-900 shadow-sm' 
                            : 'text-slate-500 hover:text-slate-800'
                        }`}
                      >
                        <FileEdit className="w-3.5 h-3.5" />
                        <span>Texte brut éditable</span>
                      </button>
                    </div>

                    {/* Actions */}
                    <div className="flex items-center gap-2 justify-end">
                      <Button 
                        onClick={handleCopyToClipboardClinic} 
                        size="sm" 
                        className={`gap-1 px-3 py-1.5 rounded-lg text-xs font-bold cursor-pointer ${copied ? 'bg-emerald-600 text-white' : 'bg-slate-900 hover:bg-slate-800 text-white'}`}
                      >
                        {copied ? <Check className="h-3.5 w-3.5" /> : <Copy className="h-3.5 w-3.5" />}
                        <span>{copied ? 'Copié !' : 'Copier'}</span>
                      </Button>

                      <Button 
                        onClick={handleDownloadClinic} 
                        variant="outline" 
                        size="sm" 
                        className="gap-1 px-3 py-1.5 rounded-lg text-xs font-bold bg-white border-slate-200 text-slate-600 hover:text-slate-800 cursor-pointer"
                      >
                        <Download className="h-3.5 w-3.5 text-slate-400" />
                        <span>.TXT</span>
                      </Button>

                      <Button 
                        onClick={handlePrintClinic} 
                        variant="outline" 
                        size="sm" 
                        className="gap-1 px-3 py-1.5 rounded-lg text-xs font-bold bg-rose-50 border-rose-200 text-rose-700 hover:bg-rose-100 cursor-pointer"
                      >
                        <Printer className="h-3.5 w-3.5 text-rose-600" />
                        <span>Imprimer / PDF</span>
                      </Button>
                    </div>
                  </div>

                  {/* Rendering Paper Workspace */}
                  <div className="bg-slate-100/60 p-6 flex justify-center items-stretch min-h-[450px]">
                    
                    {previewTab === 'layout' ? (
                      /* PAPER LAYOUT PREVIEW */
                      <div className="bg-white text-slate-900 w-full max-w-[700px] shadow-lg border border-slate-200 rounded-xl p-8 font-sans text-left flex flex-col gap-6">
                        
                        {/* Header */}
                        <div className="flex items-center justify-between border-b border-slate-300 pb-4">
                          <div className="flex items-center gap-3">
                            {renderHeaderLogo()}
                            <div>
                              <p className="text-sm font-extrabold text-slate-900 uppercase tracking-wide">
                                {clinicName}
                              </p>
                              <p className="text-[10px] text-slate-500 leading-tight block">{clinicAddress}</p>
                              <p className="text-[10px] text-slate-500 block">{clinicPhone}</p>
                            </div>
                          </div>
                          <div className="text-right text-[10px] text-slate-500 shrink-0">
                            Date: {new Date().toLocaleDateString('fr-FR')}
                          </div>
                        </div>

                        {/* Title */}
                        <div className="text-center my-1">
                          <h2 className="text-sm font-bold text-slate-800 border-b-2 border-slate-800 inline-block pb-0.5 uppercase">
                            COMPTE RENDU : {selectedTemplate.title}
                          </h2>
                        </div>

                        {/* Patient Grid */}
                        <div className="bg-slate-50 border border-slate-200 rounded-xl p-3 grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs font-medium text-slate-800">
                          <div>
                            <span className="text-slate-400 font-bold uppercase text-[9px] block">PATIENT :</span>
                            <span className="text-slate-900 font-semibold">{patientName}</span>
                          </div>
                          <div>
                            <span className="text-slate-400 font-bold uppercase text-[9px] block">DATE DE NAISSANCE :</span>
                            <span className="text-slate-900">{patientDob}</span>
                          </div>
                        </div>

                        {/* Editable sections inside paper layout */}
                        <div className="space-y-4">
                          <div className="border-l-2 border-slate-300 pl-3">
                            <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">Indication</span>
                            <p className="text-xs text-slate-900 mt-1 leading-relaxed font-semibold italic">
                              {customIndication || selectedTemplate.indicationDefault}
                            </p>
                          </div>

                          <div className="border-l-2 border-emerald-500 pl-3">
                            <label className="text-[10px] font-bold text-emerald-600 uppercase tracking-wider block">Technique d'exploration</label>
                            <textarea
                              value={customTechnique}
                              onChange={(e) => setCustomTechnique(e.target.value)}
                              className="w-full text-xs text-slate-800 mt-1 leading-relaxed bg-transparent border-none p-0 focus:ring-0 focus:outline-none resize-y font-sans font-medium"
                              rows={2}
                            />
                          </div>

                          <div className="border-l-2 border-sky-500 pl-3">
                            <label className="text-[10px] font-bold text-sky-600 uppercase tracking-wider block">Résultats & Observations</label>
                            <textarea
                              value={customDescription}
                              onChange={(e) => setCustomDescription(e.target.value)}
                              className="w-full text-xs text-slate-800 mt-1 leading-relaxed bg-transparent border-none p-0 focus:ring-0 focus:outline-none resize-y font-sans font-medium"
                              rows={5}
                            />
                          </div>

                          <div className="border-2 border-slate-900 p-4 bg-slate-50 rounded-lg">
                            <label className="text-[10px] font-extrabold text-slate-950 uppercase tracking-wider block mb-1">Conclusion Diagnostique</label>
                            <textarea
                              value={customConclusion}
                              onChange={(e) => setCustomConclusion(e.target.value)}
                              className="w-full text-xs text-slate-950 font-bold bg-transparent border-none p-0 focus:ring-0 focus:outline-none resize-y font-sans"
                              rows={3}
                            />
                          </div>
                        </div>

                        {/* Footer */}
                        <div className="mt-auto border-t border-dashed border-slate-200 pt-3 flex justify-between items-end text-[10px] text-slate-500">
                          <div>
                            <span className="block font-bold text-slate-700">Praticien Signataire :</span>
                            <span className="font-bold text-slate-900 text-xs">{radiologistSignature}</span>
                          </div>
                          <div className="text-right italic">
                            Document médical validé électroniquement.
                          </div>
                        </div>

                      </div>
                    ) : (
                      /* RAW TEXT EDITABLE PREVIEW */
                      <div className="bg-white text-slate-900 w-full max-w-[700px] shadow-lg border border-slate-200 rounded-xl p-6 flex flex-col gap-4 font-mono">
                        <div className="flex items-center justify-between border-b pb-2">
                          <span className="text-[10px] uppercase font-bold text-slate-500">
                            Éditeur Libre - Compte Rendu Brut (.TXT)
                          </span>
                          {isFullTextManuallyEdited && (
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={() => setIsFullTextManuallyEdited(false)}
                              className="text-[9px] text-slate-500 hover:text-rose-600 font-bold px-1.5 py-0.5 h-auto bg-slate-100 rounded"
                            >
                              Réinitialiser
                            </Button>
                          )}
                        </div>
                        
                        <textarea
                          value={generateClinicReportText()}
                          onChange={(e) => {
                            setManualFullText(e.target.value);
                            setIsFullTextManuallyEdited(true);
                          }}
                          className="w-full h-full min-h-[400px] text-xs leading-relaxed text-slate-800 bg-transparent border-none p-0 font-mono focus:ring-0 focus:outline-none resize-y"
                        />
                      </div>
                    )}

                  </div>

                </div>

              </div>

            </div>

          </div>
        )}

      </div>
    </div>
  );
}
