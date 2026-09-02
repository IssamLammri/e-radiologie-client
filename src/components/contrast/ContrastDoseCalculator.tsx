import React, { useState, useMemo } from 'react';
import { 
  Calculator, Zap, Layers, AlertTriangle, ShieldCheck, CheckCircle2, 
  Info, Copy, Check, RefreshCw, Droplets, Gauge, Syringe, User, HeartPulse, Sparkles, Scale
} from 'lucide-react';
import { Badge } from '../ui/Badge';
import { Button } from '../ui/Button';

export type ModalityType = 'CT' | 'MRI';
export type PatientCategory = 'adult' | 'pediatric';
export type Gender = 'male' | 'female';

// CT Iodine Concentrations
export interface IodineOption {
  id: string;
  name: string;
  concentration: number; // mgI/mL
  examples: string;
}

export const IODINE_CONCENTRATIONS: IodineOption[] = [
  { id: '300', name: '300 mg I/mL', concentration: 300, examples: 'Omnipaque 300, Xenetix 300, Iomeron 300' },
  { id: '350', name: '350 mg I/mL', concentration: 350, examples: 'Omnipaque 350, Xenetix 350, Iomeron 350' },
  { id: '370', name: '370 mg I/mL', concentration: 370, examples: 'Ultravist 370, Iopamiron 370' },
  { id: '400', name: '400 mg I/mL', concentration: 400, examples: 'Iomeron 400, Xenetix 400' },
];

// MRI Gadolinium Products
export interface GadoliniumOption {
  id: string;
  name: string;
  concentrationMmol: number; // mmol/mL
  type: 'macrocyclic' | 'hepatospecific';
  examples: string;
}

export const GADOLINIUM_PRODUCTS: GadoliniumOption[] = [
  { id: 'dotarem', name: 'Dotarem / Clarscan / ProHance (0.5 mmol/mL)', concentrationMmol: 0.5, type: 'macrocyclic', examples: 'Acide gadotérique - Dose std 0.2 mL/kg' },
  { id: 'gadovist', name: 'Gadovist 1.0 (1.0 mmol/mL)', concentrationMmol: 1.0, type: 'macrocyclic', examples: 'Gadobutrol concentré - Dose std 0.1 mL/kg' },
  { id: 'primovist', name: 'Primovist (0.25 mmol/mL)', concentrationMmol: 0.25, type: 'hepatospecific', examples: 'Gadoxétate - Bili-IRM / Foie - Dose std 0.1 mL/kg' },
];

// Presets
export interface ProtocolPreset {
  id: string;
  label: string;
  modality: ModalityType;
  category: PatientCategory;
  defaultIodineDoseMgKg?: number; // mg I/kg
  defaultGadDoseMmolKg?: number; // mmol/kg
  recommendedFlowRate: number; // mL/s
  description: string;
}

export const PROTOCOL_PRESETS: ProtocolPreset[] = [
  {
    id: 'ct-abdo-std',
    label: 'TDM Abdomino-Pelvien / Thorax',
    modality: 'CT',
    category: 'adult',
    defaultIodineDoseMgKg: 450, // ~1.3 mL/kg at 350 mg/mL
    recommendedFlowRate: 3.0,
    description: 'Bilan parenchymateux portal standard. 400 à 500 mg Iode/kg.'
  },
  {
    id: 'ct-angio-ep',
    label: 'Angio-TDM Pulmonaire / Aorte',
    modality: 'CT',
    category: 'adult',
    defaultIodineDoseMgKg: 400,
    recommendedFlowRate: 4.5,
    description: 'Bolus compact à haut débit pour opacification artérielle maximale.'
  },
  {
    id: 'ct-foie-3phase',
    label: 'TDM Hépatique 3 Phases (CHC/Nodule)',
    modality: 'CT',
    category: 'adult',
    defaultIodineDoseMgKg: 550,
    recommendedFlowRate: 3.5,
    description: 'Haute charge en iode pour maximiser le rehaussement artériel du foie.'
  },
  {
    id: 'ct-pedia',
    label: 'TDM Pédiatrique',
    modality: 'CT',
    category: 'pediatric',
    defaultIodineDoseMgKg: 500, // ~1.5 mL/kg at 300/350
    recommendedFlowRate: 1.5,
    description: 'Adaptation stricte au poids (1.5 à 2.0 mL/kg, max 3 mL/kg).'
  },
  {
    id: 'mri-neuro-std',
    label: 'IRM Cérébrale / Ostéo Standard',
    modality: 'MRI',
    category: 'adult',
    defaultGadDoseMmolKg: 0.1,
    recommendedFlowRate: 2.0,
    description: 'Dose standard de Gadolinium (0.1 mmol/kg).'
  },
  {
    id: 'mri-double-dose',
    label: 'IRM Cérébrale Métastases / Angio-IRM',
    modality: 'MRI',
    category: 'adult',
    defaultGadDoseMmolKg: 0.2,
    recommendedFlowRate: 2.5,
    description: 'Double dose (0.2 mmol/kg) pour recherche de micro-métastases ou MRA.'
  },
  {
    id: 'mri-bili-primovist',
    label: 'Bili-IRM / Hépatique (Primovist)',
    modality: 'MRI',
    category: 'adult',
    defaultGadDoseMmolKg: 0.025, // 0.1 mL/kg at 0.25 mmol/mL
    recommendedFlowRate: 1.5,
    description: 'Gadoxétate spécifique hépato-biliaire (0.025 mmol/kg = 0.1 mL/kg).'
  },
  {
    id: 'mri-pedia',
    label: 'IRM Pédiatrique',
    modality: 'MRI',
    category: 'pediatric',
    defaultGadDoseMmolKg: 0.1,
    recommendedFlowRate: 1.0,
    description: '0.1 mmol/kg avec injection manuelle douce ou poussoir pédiatrique.'
  }
];

export function ContrastDoseCalculator() {
  const [modality, setModality] = useState<ModalityType>('CT');
  const [patientCategory, setPatientCategory] = useState<PatientCategory>('adult');
  const [weightKg, setWeightKg] = useState<number>(70);
  const [heightCm, setHeightCm] = useState<number>(172);
  const [age, setAge] = useState<number>(55);
  const [gender, setGender] = useState<Gender>('male');
  const [useLeanBodyMass, setUseLeanBodyMass] = useState<boolean>(false);

  // Renal function parameters
  const [creatinineUmol, setCreatinineUmol] = useState<number>(80);
  const [creatinineUnit, setCreatinineUnit] = useState<'umol' | 'mgdl'>('umol');
  const [enableEgfrCheck, setEnableEgfrCheck] = useState<boolean>(true);

  // CT specific parameters
  const [selectedIodineId, setSelectedIodineId] = useState<string>('350');
  const [iodineDoseMgKg, setIodineDoseMgKg] = useState<number>(450); // mg I / kg

  // MRI specific parameters
  const [selectedGadolinumId, setSelectedGadolinumId] = useState<string>('dotarem');
  const [gadDoseMmolKg, setGadDoseMmolKg] = useState<number>(0.1); // mmol / kg

  // Injection parameters
  const [flowRate, setFlowRate] = useState<number>(3.5); // mL/s
  const [salineFlush, setSalineFlush] = useState<number>(40); // mL

  const [copied, setCopied] = useState(false);

  // Selected Iodine object
  const selectedIodine = useMemo(() => {
    return IODINE_CONCENTRATIONS.find(i => i.id === selectedIodineId) || IODINE_CONCENTRATIONS[1];
  }, [selectedIodineId]);

  // Selected Gadolinium object
  const selectedGadolinium = useMemo(() => {
    return GADOLINIUM_PRODUCTS.find(g => g.id === selectedGadolinumId) || GADOLINIUM_PRODUCTS[0];
  }, [selectedGadolinumId]);

  // Calculate BMI & Lean Body Mass (LBM - Boer formula)
  const bmi = useMemo(() => {
    if (!heightCm || heightCm <= 0) return 0;
    const heightM = heightCm / 100;
    return weightKg / (heightM * heightM);
  }, [weightKg, heightCm]);

  const leanBodyMassKg = useMemo(() => {
    if (!weightKg || !heightCm) return weightKg;
    let lbm = 0;
    if (gender === 'male') {
      lbm = 0.407 * weightKg + 0.267 * heightCm - 19.2;
    } else {
      lbm = 0.252 * weightKg + 0.473 * heightCm - 48.3;
    }
    return Math.max(25, Math.min(weightKg, Math.round(lbm * 10) / 10));
  }, [weightKg, heightCm, gender]);

  // Effective calculation weight
  const effectiveWeightKg = useMemo(() => {
    if (useLeanBodyMass && bmi >= 28) {
      return leanBodyMassKg;
    }
    return weightKg;
  }, [useLeanBodyMass, bmi, leanBodyMassKg, weightKg]);

  // eGFR (CKD-EPI 2021 race-free equation)
  const egfr = useMemo(() => {
    if (!enableEgfrCheck || !creatinineUmol || creatinineUmol <= 0) return null;
    
    // Convert to mg/dL
    const scrMgDl = creatinineUnit === 'umol' ? creatinineUmol / 88.4 : creatinineUmol;
    const isFemale = gender === 'female';
    const kappa = isFemale ? 0.7 : 0.9;
    const alpha = isFemale ? -0.241 : -0.302;
    const genderMult = isFemale ? 1.012 : 1.0;

    const minRatio = Math.min(scrMgDl / kappa, 1.0);
    const maxRatio = Math.max(scrMgDl / kappa, 1.0);

    const val = 142 * Math.pow(minRatio, alpha) * Math.pow(maxRatio, -1.200) * Math.pow(0.9938, age) * genderMult;
    return Math.round(val);
  }, [creatinineUmol, creatinineUnit, gender, age, enableEgfrCheck]);

  // Renal Status & Recommendations
  const renalStatus = useMemo(() => {
    if (egfr === null) return { level: 'unknown', label: 'Non évalué', color: 'slate', text: 'Fonction rénale non renseignée.' };
    if (egfr >= 60) {
      return { 
        level: 'normal', 
        label: 'Fonction Rénale Normale', 
        color: 'emerald', 
        text: 'Pas de précaution rénale spécifique. Injection autorisée au volume standard.' 
      };
    }
    if (egfr >= 30) {
      return { 
        level: 'moderate', 
        label: 'Insuffisance Rénale Modérée (IRC Stade 3)', 
        color: 'amber', 
        text: 'Risque modéré de néphropathie induite (CIN). Recommandation : Hydratation pré/post-examen (NaCl 0.9%), cibler le volume minimal de PCI (Volume PCI / DFG < 3.0).' 
      };
    }
    return { 
      level: 'severe', 
      label: 'Insuffisance Rénale Sévère (DFG < 30)', 
      color: 'rose', 
      text: 'ATTENTION : Risque élevé de néphropathie aiguë (PCI) ou FNS/NSF (IRM). Discuter indication alternative non injectée ou avis radiologue sénior + hydratation IV lourde.' 
    };
  }, [egfr]);

  // Calculate Volume (mL) and Iodine Content (grams)
  const ctResults = useMemo(() => {
    if (modality !== 'CT') return null;

    // Total Iodine required in mg
    const totalIodineMg = effectiveWeightKg * iodineDoseMgKg;
    let volumeMl = totalIodineMg / selectedIodine.concentration;

    // Pediatric safety cap: max 3 mL/kg or max 150 mL in adults
    if (patientCategory === 'pediatric') {
      volumeMl = Math.min(volumeMl, effectiveWeightKg * 3.0);
    } else {
      volumeMl = Math.min(volumeMl, 150); // Adult max cap
    }

    // Renal adjustment if eGFR < 45
    let renalAdjusted = false;
    if (egfr !== null && egfr < 45 && patientCategory === 'adult') {
      // ESUR rule: Volume PCI (mL) <= 3 * eGFR (mL/min)
      const maxRenalVolume = egfr * 3;
      if (volumeMl > maxRenalVolume) {
        volumeMl = Math.max(40, maxRenalVolume);
        renalAdjusted = true;
      }
    }

    const roundedVolumeMl = Math.round(volumeMl);
    const totalIodineGrams = Math.round((roundedVolumeMl * selectedIodine.concentration) / 100) / 10;
    const volumePerKg = Math.round((roundedVolumeMl / weightKg) * 100) / 100;
    const injectionDurationSec = Math.round((roundedVolumeMl / flowRate) * 10) / 10;

    return {
      volumeMl: roundedVolumeMl,
      totalIodineGrams,
      volumePerKg,
      injectionDurationSec,
      renalAdjusted
    };
  }, [modality, effectiveWeightKg, iodineDoseMgKg, selectedIodine, patientCategory, egfr, flowRate, weightKg]);

  // MRI Gadolinium calculation
  const mriResults = useMemo(() => {
    if (modality !== 'MRI') return null;

    // Total mmol required
    const totalMmol = effectiveWeightKg * gadDoseMmolKg;
    let volumeMl = totalMmol / selectedGadolinium.concentrationMmol;

    // Pediatric safety cap
    if (patientCategory === 'pediatric') {
      volumeMl = Math.min(volumeMl, effectiveWeightKg * 0.4);
    }

    const roundedVolumeMl = Math.round(volumeMl * 10) / 10;
    const injectionDurationSec = Math.round((roundedVolumeMl / flowRate) * 10) / 10;

    return {
      volumeMl: roundedVolumeMl,
      totalMmol: Math.round(totalMmol * 100) / 100,
      injectionDurationSec
    };
  }, [modality, effectiveWeightKg, gadDoseMmolKg, selectedGadolinium, patientCategory, flowRate]);

  // Recommended Catheter Gauge
  const recommendedCatheter = useMemo(() => {
    if (flowRate <= 2.5) return { gauge: '22G', color: 'Bleu', maxFlow: 'Up to 3.0 mL/s' };
    if (flowRate <= 4.0) return { gauge: '20G', color: 'Rose', maxFlow: 'Up to 4.0 mL/s' };
    return { gauge: '18G', color: 'Vert', maxFlow: 'Up to 6.0 mL/s (Requis pour Angio-TDM)' };
  }, [flowRate]);

  // Handle Preset Selection
  const applyPreset = (preset: ProtocolPreset) => {
    setModality(preset.modality);
    setPatientCategory(preset.category);
    setFlowRate(preset.recommendedFlowRate);

    if (preset.modality === 'CT' && preset.defaultIodineDoseMgKg) {
      setIodineDoseMgKg(preset.defaultIodineDoseMgKg);
    }
    if (preset.modality === 'MRI' && preset.defaultGadDoseMmolKg) {
      setGadDoseMmolKg(preset.defaultGadDoseMmolKg);
      if (preset.id === 'mri-bili-primovist') {
        setSelectedGadolinumId('primovist');
      }
    }
  };

  // Copy dosage protocol to clipboard
  const handleCopySummary = () => {
    const isCt = modality === 'CT';
    const volume = isCt ? ctResults?.volumeMl : mriResults?.volumeMl;
    const duration = isCt ? ctResults?.injectionDurationSec : mriResults?.injectionDurationSec;

    const summaryText = `==================================================
DOSAGE DU PRODUIT DE CONTRASTE (${isCt ? 'TDM' : 'IRM'})
==================================================
PATIENT : ${patientCategory === 'adult' ? 'Adulte' : 'Enfant'} (${weightKg} kg, ${heightCm} cm, ${age} ans, ${gender === 'male' ? 'H' : 'F'})
${bmi > 0 ? `IMC : ${bmi.toFixed(1)} kg/m² ${bmi >= 28 ? '(Poids corrigé/Masse maigre appliqué)' : ''}` : ''}
FONCTION RÉNALE : ${egfr !== null ? `DFG = ${egfr} mL/min/1.73m² (${renalStatus.label})` : 'Non renseignée'}

EXAMEN & PRODUIT SELECTIONNÉ :
• Produit : ${isCt ? selectedIodine.name : selectedGadolinium.name}
• Spécification : ${isCt ? `${selectedIodine.examples}` : `${selectedGadolinium.examples}`}

PROTOCOLE D'INJECTION RECOMMANDÉ :
• VOLUME TOTAL DE CONTRASTE : ${volume} mL
• DÉBIT D'INJECTION : ${flowRate} mL/s
• DURÉE D'INJECTION CONTRASTE : ${duration} secondes
• RINÇAGE SÉRUM PHYSIOLOGIQUE : ${salineFlush} mL à ${flowRate} mL/s
• CATHÉTER RECOMMANDÉ : VVP ${recommendedCatheter.gauge} (${recommendedCatheter.color})

PRÉCAUTIONS & CONSIGNES :
${renalStatus.text}
==================================================`;

    navigator.clipboard.writeText(summaryText).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  return (
    <div id="contrast-calculator-card" className="bg-white border border-slate-200 rounded-3xl shadow-lg overflow-hidden">
      
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 p-6 text-white space-y-3 relative">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <span className="p-2 bg-indigo-500/20 text-indigo-300 rounded-xl border border-indigo-400/30">
              <Calculator className="w-5 h-5" />
            </span>
            <Badge variant="outline" className="border-indigo-400/40 text-indigo-200 bg-indigo-950/60 uppercase tracking-widest text-[10px] font-bold">
              CALCULATEUR OFFICIEL DE DOSAGE
            </Badge>
          </div>

          <div className="flex items-center gap-2">
            <Button
              onClick={() => {
                setWeightKg(70);
                setHeightCm(172);
                setAge(55);
                setCreatinineUmol(80);
                setIodineDoseMgKg(450);
                setGadDoseMmolKg(0.1);
                setFlowRate(3.5);
              }}
              size="sm"
              variant="outline"
              className="text-slate-300 border-slate-700 hover:bg-slate-800 text-xs py-1 px-2.5 rounded-lg flex items-center gap-1"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span>Réinitialiser</span>
            </Button>

            <Button
              onClick={handleCopySummary}
              size="sm"
              className="bg-sky-600 hover:bg-sky-500 text-white text-xs font-bold py-1 px-3 rounded-lg flex items-center gap-1.5 shadow-sm"
            >
              {copied ? (
                <>
                  <Check className="w-3.5 h-3.5 text-emerald-300" />
                  <span className="text-emerald-200">Prescription Copiée !</span>
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5" />
                  <span>Copier Prescription</span>
                </>
              )}
            </Button>
          </div>
        </div>

        <div>
          <h2 className="text-2xl font-black text-white tracking-tight">
            Calculateur de Dosage du Produit de Contraste
          </h2>
          <p className="text-slate-300 text-xs sm:text-sm mt-1 max-w-3xl leading-relaxed">
            Optimisation individualisée du volume d'iode (TDM) ou de gadolinium (IRM), calcul automatique du DFG (CKD-EPI) et consignes d'injection par débit-mètre.
          </p>
        </div>
      </div>

      {/* Main Content Layout */}
      <div className="p-6 space-y-8">

        {/* 1. Modality & Patient Category Selection */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          
          {/* Modality Toggle */}
          <div className="space-y-2">
            <label className="text-xs font-bold uppercase text-slate-500 tracking-wider flex items-center gap-1.5">
              <Zap className="w-3.5 h-3.5 text-indigo-600" />
              1. Modalité d'Imagerie
            </label>
            <div className="grid grid-cols-2 gap-2 bg-slate-100 p-1.5 rounded-2xl">
              <button
                type="button"
                onClick={() => setModality('CT')}
                className={`py-2.5 px-3 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 cursor-pointer ${
                  modality === 'CT'
                    ? 'bg-indigo-600 text-white shadow-sm'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <Zap className="w-4 h-4" />
                <span>TDM / Scanner (Iode)</span>
              </button>

              <button
                type="button"
                onClick={() => setModality('MRI')}
                className={`py-2.5 px-3 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 cursor-pointer ${
                  modality === 'MRI'
                    ? 'bg-emerald-600 text-white shadow-sm'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <Layers className="w-4 h-4" />
                <span>IRM (Gadolinium)</span>
              </button>
            </div>
          </div>

          {/* Patient Category Toggle */}
          <div className="space-y-2">
            <label className="text-xs font-bold uppercase text-slate-500 tracking-wider flex items-center gap-1.5">
              <User className="w-3.5 h-3.5 text-sky-600" />
              2. Catégorie Patient
            </label>
            <div className="grid grid-cols-2 gap-2 bg-slate-100 p-1.5 rounded-2xl">
              <button
                type="button"
                onClick={() => {
                  setPatientCategory('adult');
                  if (weightKg < 35) setWeightKg(70);
                }}
                className={`py-2.5 px-3 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 cursor-pointer ${
                  patientCategory === 'adult'
                    ? 'bg-slate-900 text-white shadow-sm'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <User className="w-4 h-4" />
                <span>Adulte</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  setPatientCategory('pediatric');
                  if (weightKg > 40) setWeightKg(20);
                }}
                className={`py-2.5 px-3 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 cursor-pointer ${
                  patientCategory === 'pediatric'
                    ? 'bg-amber-600 text-white shadow-sm'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <Sparkles className="w-4 h-4" />
                <span>Pédiatrique (&lt;15 ans)</span>
              </button>
            </div>
          </div>

        </div>

        {/* Protocol Quick Presets */}
        <div className="space-y-2">
          <label className="text-xs font-bold uppercase text-slate-500 tracking-wider flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-amber-500" />
            Raccourcis & Préréglages d'Examens
          </label>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
            {PROTOCOL_PRESETS.filter(p => p.modality === modality && p.category === patientCategory).map(preset => (
              <button
                key={preset.id}
                onClick={() => applyPreset(preset)}
                className="p-3 rounded-xl border border-slate-200 bg-slate-50 hover:bg-indigo-50 hover:border-indigo-300 text-left transition-all text-xs space-y-1 cursor-pointer group"
              >
                <span className="font-bold text-slate-900 group-hover:text-indigo-900 block truncate">
                  {preset.label}
                </span>
                <span className="text-[10px] text-slate-500 block line-clamp-2">
                  {preset.description}
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* 2. Patient Biometrics & Renal Function Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          
          {/* Left Sub-Card: Patient Parameters */}
          <div className="lg:col-span-6 bg-slate-50 border border-slate-200 rounded-2xl p-5 space-y-4">
            <h3 className="text-xs font-extrabold text-slate-800 uppercase tracking-wider flex items-center gap-2 border-b border-slate-200 pb-2">
              <User className="w-4 h-4 text-sky-600" />
              Paramètres Anthropométriques Patient
            </h3>

            {/* Weight Slider & Input */}
            <div className="space-y-1.5">
              <div className="flex justify-between items-center text-xs font-bold text-slate-700">
                <span>Poids Total (kg) :</span>
                <span className="text-sm font-black text-indigo-700 bg-indigo-50 px-2.5 py-0.5 rounded-lg border border-indigo-200">
                  {weightKg} kg
                </span>
              </div>
              <input
                type="range"
                min={patientCategory === 'pediatric' ? 3 : 30}
                max={patientCategory === 'pediatric' ? 50 : 180}
                value={weightKg}
                onChange={(e) => setWeightKg(Number(e.target.value))}
                className="w-full accent-indigo-600 cursor-pointer"
              />
            </div>

            {/* Height & Age Inputs */}
            <div className="grid grid-cols-3 gap-3 pt-1">
              <div>
                <label className="text-[11px] font-bold text-slate-600 block mb-1">Taille (cm)</label>
                <input
                  type="number"
                  value={heightCm}
                  onChange={(e) => setHeightCm(Number(e.target.value))}
                  className="w-full bg-white border border-slate-200 rounded-xl px-3 py-1.5 text-xs font-bold text-slate-800 outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <div>
                <label className="text-[11px] font-bold text-slate-600 block mb-1">Âge (ans)</label>
                <input
                  type="number"
                  value={age}
                  onChange={(e) => setAge(Number(e.target.value))}
                  className="w-full bg-white border border-slate-200 rounded-xl px-3 py-1.5 text-xs font-bold text-slate-800 outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <div>
                <label className="text-[11px] font-bold text-slate-600 block mb-1">Sexe</label>
                <select
                  value={gender}
                  onChange={(e) => setGender(e.target.value as Gender)}
                  className="w-full bg-white border border-slate-200 rounded-xl px-2 py-1.5 text-xs font-bold text-slate-800 outline-none focus:ring-2 focus:ring-indigo-500 cursor-pointer"
                >
                  <option value="male">Homme</option>
                  <option value="female">Femme</option>
                </select>
              </div>
            </div>

            {/* BMI & Obesity LBM Correction Toggle */}
            {bmi > 0 && (
              <div className="p-3 bg-white border border-slate-200 rounded-xl text-xs space-y-2">
                <div className="flex justify-between items-center text-slate-600">
                  <span>IMC (Indice de Masse Corporelle) :</span>
                  <span className={`font-bold ${bmi >= 30 ? 'text-amber-600 font-mono' : 'text-slate-800'}`}>
                    {bmi.toFixed(1)} kg/m² {bmi >= 30 ? '(Obésité)' : ''}
                  </span>
                </div>

                {bmi >= 28 && (
                  <div className="pt-1 border-t border-slate-100 flex items-center justify-between">
                    <div className="flex items-center gap-1.5">
                      <Scale className="w-3.5 h-3.5 text-indigo-600" />
                      <span className="text-[11px] text-slate-700 font-medium">
                        Calculer sur Masse Maigre ({leanBodyMassKg} kg)
                      </span>
                    </div>
                    <button
                      type="button"
                      onClick={() => setUseLeanBodyMass(!useLeanBodyMass)}
                      className={`px-2 py-0.5 rounded text-[10px] font-bold cursor-pointer transition-colors ${
                        useLeanBodyMass
                          ? 'bg-indigo-600 text-white'
                          : 'bg-slate-200 text-slate-700 hover:bg-slate-300'
                      }`}
                    >
                      {useLeanBodyMass ? 'Activé' : 'Désactivé'}
                    </button>
                  </div>
                )}
              </div>
            )}

          </div>

          {/* Right Sub-Card: Renal Function & eGFR */}
          <div className="lg:col-span-6 bg-slate-50 border border-slate-200 rounded-2xl p-5 space-y-4">
            <div className="flex justify-between items-center border-b border-slate-200 pb-2">
              <h3 className="text-xs font-extrabold text-slate-800 uppercase tracking-wider flex items-center gap-2">
                <HeartPulse className="w-4 h-4 text-rose-600" />
                Bilan Rénal & Estimation du DFG
              </h3>
              <button
                type="button"
                onClick={() => setEnableEgfrCheck(!enableEgfrCheck)}
                className="text-[10px] text-indigo-600 font-bold hover:underline cursor-pointer"
              >
                {enableEgfrCheck ? 'Masquer DFG' : 'Activer DFG'}
              </button>
            </div>

            {enableEgfrCheck ? (
              <div className="space-y-3">
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-[11px] font-bold text-slate-600 block mb-1">Créatininémie</label>
                    <input
                      type="number"
                      value={creatinineUmol}
                      onChange={(e) => setCreatinineUmol(Number(e.target.value))}
                      className="w-full bg-white border border-slate-200 rounded-xl px-3 py-1.5 text-xs font-bold text-slate-800 outline-none focus:ring-2 focus:ring-indigo-500"
                    />
                  </div>

                  <div>
                    <label className="text-[11px] font-bold text-slate-600 block mb-1">Unité</label>
                    <select
                      value={creatinineUnit}
                      onChange={(e) => setCreatinineUnit(e.target.value as 'umol' | 'mgdl')}
                      className="w-full bg-white border border-slate-200 rounded-xl px-2 py-1.5 text-xs font-bold text-slate-800 outline-none focus:ring-2 focus:ring-indigo-500 cursor-pointer"
                    >
                      <option value="umol">µmol/L</option>
                      <option value="mgdl">mg/dL</option>
                    </select>
                  </div>
                </div>

                {/* Calculated eGFR Result Box */}
                {egfr !== null && (
                  <div className={`p-3.5 rounded-2xl border text-xs space-y-1.5 ${
                    renalStatus.level === 'normal'
                      ? 'bg-emerald-50 border-emerald-200 text-emerald-950'
                      : renalStatus.level === 'moderate'
                      ? 'bg-amber-50 border-amber-200 text-amber-950'
                      : 'bg-rose-50 border-rose-200 text-rose-950'
                  }`}>
                    <div className="flex justify-between items-center">
                      <span className="font-extrabold text-xs uppercase flex items-center gap-1.5">
                        {renalStatus.level === 'normal' && <CheckCircle2 className="w-4 h-4 text-emerald-600" />}
                        {renalStatus.level === 'moderate' && <AlertTriangle className="w-4 h-4 text-amber-600" />}
                        {renalStatus.level === 'severe' && <AlertTriangle className="w-4 h-4 text-rose-600" />}
                        DFG Estimé (CKD-EPI 2021) :
                      </span>
                      <span className="text-base font-black font-mono">
                        {egfr} mL/min/1.73m²
                      </span>
                    </div>
                    <p className="text-[11px] leading-relaxed font-medium">
                      {renalStatus.text}
                    </p>
                  </div>
                )}
              </div>
            ) : (
              <div className="text-xs text-slate-400 py-4 text-center">
                Vérification du DFG désactivée.
              </div>
            )}
          </div>

        </div>

        {/* 3. Product & Injection Parameters */}
        <div className="bg-slate-50 border border-slate-200 rounded-2xl p-5 space-y-4">
          <h3 className="text-xs font-extrabold text-slate-800 uppercase tracking-wider flex items-center gap-2 border-b border-slate-200 pb-2">
            <Syringe className="w-4 h-4 text-indigo-600" />
            3. Choix du Produit de Contraste & Consignes d'Injection
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            
            {/* CT or MRI Specific Selector */}
            {modality === 'CT' ? (
              <div className="space-y-3">
                <label className="text-xs font-bold text-slate-700 block">
                  Concentration en Iode (mg I/mL) :
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {IODINE_CONCENTRATIONS.map((iodine) => (
                    <button
                      key={iodine.id}
                      type="button"
                      onClick={() => setSelectedIodineId(iodine.id)}
                      className={`p-2.5 rounded-xl border text-left transition-all text-xs cursor-pointer ${
                        selectedIodineId === iodine.id
                          ? 'bg-indigo-600 text-white border-indigo-600 font-bold shadow-sm'
                          : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-100'
                      }`}
                    >
                      <span className="block text-xs font-bold">{iodine.name}</span>
                      <span className={`text-[10px] block truncate ${selectedIodineId === iodine.id ? 'text-indigo-200' : 'text-slate-400'}`}>
                        {iodine.examples}
                      </span>
                    </button>
                  ))}
                </div>

                <div className="pt-2">
                  <div className="flex justify-between items-center text-xs font-bold text-slate-700 mb-1">
                    <span>Charge Cible en Iode :</span>
                    <span className="font-mono text-indigo-700">{iodineDoseMgKg} mg I / kg</span>
                  </div>
                  <input
                    type="range"
                    min={300}
                    max={650}
                    step={25}
                    value={iodineDoseMgKg}
                    onChange={(e) => setIodineDoseMgKg(Number(e.target.value))}
                    className="w-full accent-indigo-600 cursor-pointer"
                  />
                  <div className="flex justify-between text-[10px] text-slate-400 font-mono mt-0.5">
                    <span>300 (Léger)</span>
                    <span>450 (Standard)</span>
                    <span>600 (Hautement opacifié)</span>
                  </div>
                </div>
              </div>
            ) : (
              <div className="space-y-3">
                <label className="text-xs font-bold text-slate-700 block">
                  Produit de Contraste Gadoliné (IRM) :
                </label>
                <div className="space-y-2">
                  {GADOLINIUM_PRODUCTS.map((gad) => (
                    <button
                      key={gad.id}
                      type="button"
                      onClick={() => setSelectedGadolinumId(gad.id)}
                      className={`w-full p-2.5 rounded-xl border text-left transition-all text-xs cursor-pointer ${
                        selectedGadolinumId === gad.id
                          ? 'bg-emerald-600 text-white border-emerald-600 font-bold shadow-sm'
                          : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-100'
                      }`}
                    >
                      <div className="flex justify-between items-center">
                        <span className="font-bold">{gad.name}</span>
                        <span className={`text-[10px] px-2 py-0.5 rounded-full font-mono ${
                          selectedGadolinumId === gad.id ? 'bg-emerald-700 text-white' : 'bg-slate-100 text-slate-600'
                        }`}>
                          {gad.type}
                        </span>
                      </div>
                      <span className={`text-[10px] block mt-0.5 ${selectedGadolinumId === gad.id ? 'text-emerald-100' : 'text-slate-400'}`}>
                        {gad.examples}
                      </span>
                    </button>
                  ))}
                </div>

                <div className="pt-2">
                  <div className="flex justify-between items-center text-xs font-bold text-slate-700 mb-1">
                    <span>Posologie Cible (mmol/kg) :</span>
                    <span className="font-mono text-emerald-700">{gadDoseMmolKg} mmol/kg</span>
                  </div>
                  <input
                    type="range"
                    min={0.025}
                    max={0.2}
                    step={0.025}
                    value={gadDoseMmolKg}
                    onChange={(e) => setGadDoseMmolKg(Number(e.target.value))}
                    className="w-full accent-emerald-600 cursor-pointer"
                  />
                  <div className="flex justify-between text-[10px] text-slate-400 font-mono mt-0.5">
                    <span>0.025 (Primovist)</span>
                    <span>0.1 (Standard)</span>
                    <span>0.2 (Double dose)</span>
                  </div>
                </div>
              </div>
            )}

            {/* Injection Flow Rate & Catheter Gauge */}
            <div className="space-y-3">
              <div>
                <div className="flex justify-between items-center text-xs font-bold text-slate-700 mb-1">
                  <span>Débit d'Injection au Pousse-Seringue :</span>
                  <span className="font-mono text-indigo-700 font-extrabold text-sm">{flowRate} mL/s</span>
                </div>
                <input
                  type="range"
                  min={1.0}
                  max={5.5}
                  step={0.5}
                  value={flowRate}
                  onChange={(e) => setFlowRate(Number(e.target.value))}
                  className="w-full accent-indigo-600 cursor-pointer"
                />
              </div>

              <div>
                <label className="text-[11px] font-bold text-slate-600 block mb-1">
                  Bolus de Rinçage (Sérum Physio - mL)
                </label>
                <input
                  type="number"
                  value={salineFlush}
                  onChange={(e) => setSalineFlush(Number(e.target.value))}
                  className="w-full bg-white border border-slate-200 rounded-xl px-3 py-1.5 text-xs font-bold text-slate-800 outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              {/* Recommended Catheter Badge */}
              <div className="p-3 bg-white border border-slate-200 rounded-xl text-xs flex items-center justify-between">
                <div>
                  <span className="text-[11px] text-slate-500 block font-bold">Cathéter Veineux Recommandé :</span>
                  <strong className="text-slate-900 text-xs">{recommendedCatheter.maxFlow}</strong>
                </div>
                <div className="text-right">
                  <span className="px-3 py-1 rounded-full text-xs font-black bg-indigo-100 text-indigo-900 border border-indigo-200">
                    {recommendedCatheter.gauge} ({recommendedCatheter.color})
                  </span>
                </div>
              </div>

            </div>

          </div>
        </div>

        {/* 4. FINAL CALCULATED DOSAGE PRESCRIPTION DISPLAY */}
        <div className="bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-900 text-white rounded-3xl p-6 shadow-xl space-y-5 border border-indigo-900/50">
          
          <div className="flex items-center justify-between border-b border-indigo-800/60 pb-3">
            <div className="flex items-center gap-2">
              <Syringe className="w-5 h-5 text-indigo-400" />
              <h3 className="text-base font-extrabold text-white tracking-tight uppercase">
                Résultat Final : Dosage Officiel Recommandé
              </h3>
            </div>
            <Badge className="bg-sky-500 text-white text-[10px] font-bold uppercase">
              {modality === 'CT' ? 'Scanner TDM' : 'IRM Magnétique'}
            </Badge>
          </div>

          {/* Core Metrics Cards Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            
            {/* Card 1 : Volume Total Contrast */}
            <div className="bg-white/10 backdrop-blur-md border border-white/10 rounded-2xl p-4 text-center space-y-1">
              <span className="text-[10px] uppercase font-bold text-slate-300 tracking-wider block">
                VOLUME TOTAL DE CONTRASTE
              </span>
              <div className="text-3xl sm:text-4xl font-black text-sky-300 font-mono">
                {modality === 'CT' ? ctResults?.volumeMl : mriResults?.volumeMl} <span className="text-lg">mL</span>
              </div>
              <span className="text-[10px] text-slate-300 block font-medium">
                {modality === 'CT' 
                  ? `(${ctResults?.volumePerKg} mL/kg - ${ctResults?.totalIodineGrams}g Iode Total)`
                  : `(${mriResults?.totalMmol} mmol total)`}
              </span>
            </div>

            {/* Card 2 : Injection Duration */}
            <div className="bg-white/10 backdrop-blur-md border border-white/10 rounded-2xl p-4 text-center space-y-1">
              <span className="text-[10px] uppercase font-bold text-slate-300 tracking-wider block">
                DURÉE D'INJECTION CONTRASTE
              </span>
              <div className="text-3xl sm:text-4xl font-black text-indigo-300 font-mono">
                {modality === 'CT' ? ctResults?.injectionDurationSec : mriResults?.injectionDurationSec} <span className="text-lg">sec</span>
              </div>
              <span className="text-[10px] text-slate-300 block font-medium">
                À débit de {flowRate} mL/s
              </span>
            </div>

            {/* Card 3 : Saline Flush */}
            <div className="bg-white/10 backdrop-blur-md border border-white/10 rounded-2xl p-4 text-center space-y-1">
              <span className="text-[10px] uppercase font-bold text-slate-300 tracking-wider block">
                RINÇAGE SÉRUM PHYSIO
              </span>
              <div className="text-3xl sm:text-4xl font-black text-emerald-300 font-mono">
                {salineFlush} <span className="text-lg">mL</span>
              </div>
              <span className="text-[10px] text-slate-300 block font-medium">
                Même débit ({flowRate} mL/s)
              </span>
            </div>

          </div>

          {/* Renal Adjustment Warning if applicable */}
          {ctResults?.renalAdjusted && (
            <div className="bg-amber-500/20 border border-amber-400/40 rounded-xl p-3 text-xs text-amber-200 flex items-start gap-2">
              <AlertTriangle className="w-4 h-4 text-amber-300 shrink-0 mt-0.5" />
              <div>
                <strong className="text-white font-bold">Adaptation Rénale Appliquée :</strong> Le volume a été plafonné selon le DFG de {egfr} mL/min (Règle ESUR : Volume max = 3 x DFG = {egfr ? egfr * 3 : ''} mL).
              </div>
            </div>
          )}

          {/* Action Footer */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-2 border-t border-indigo-800/60">
            <div className="text-xs text-slate-300 flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>
                Cathéter VVP recommandé : <strong className="text-white">{recommendedCatheter.gauge} ({recommendedCatheter.color})</strong>
              </span>
            </div>

            <Button
              onClick={handleCopySummary}
              className="bg-sky-500 hover:bg-sky-400 text-white font-extrabold text-xs py-2 px-5 rounded-xl flex items-center gap-2 shadow-lg w-full sm:w-auto justify-center"
            >
              {copied ? (
                <>
                  <Check className="w-4 h-4 text-white" />
                  <span>Copié dans le Presse-papier !</span>
                </>
              ) : (
                <>
                  <Copy className="w-4 h-4" />
                  <span>Copier le Bilan de Dosage</span>
                </>
              )}
            </Button>
          </div>

        </div>

      </div>

    </div>
  );
}
