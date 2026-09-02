export interface ApiCategory {
  id: number;
  name: string;
  slug: string;
  description: string | null;
  active: boolean;
  position: number;
}

export interface ApiModality {
  id: number;
  name: string;
  slug: string;
  code: string;
  active: boolean;
  position: number;
}

export interface ApiDifficulty {
  value: string;
  label: string;
}

export interface ApiAuthor {
  id: number;
  firstName: string;
  lastName: string;
  displayName: string;
}

export interface ApiStatus {
  value: string;
  label: string;
}

export interface ApiMedia {
  id: number;
  path: string;
  mediaType: string;
  title: string | null;
  caption: string | null;
  altText: string | null;
  position: number;
  isPrimary: boolean;
}

export interface ApiReference {
  id: number;
  title: string;
  authors: string | null;
  source: string;
  url: string | null;
  doi: string | null;
  position: number;
}

export interface ApiCaseItem {
  id: number;
  title: string;
  slug: string;
  modality: ApiModality;
  category: ApiCategory;
  difficulty: ApiDifficulty;
  author: ApiAuthor;
  status: ApiStatus;
  publishedAt: string;
  createdAt: string;
  updatedAt: string;
  primaryMedia: ApiMedia | null;
}

export interface ApiCaseDetail extends ApiCaseItem {
  patientGender: { value: string; label: string };
  patientAge: number;
  clinicalContext: string;
  trainingInstruction: string | null;
  trainingPlaceholder: string | null;
  expertDescription: string | null;
  diagnosis: string;
  globalDiscussion: string;
  media: ApiMedia[];
  references: ApiReference[];
}

export interface ApiRecentCasesResponse {
  items: ApiCaseItem[];
}

export interface User {
  id: number;
  email: string;
  firstName: string;
  lastName: string;
  roles: string[];
}

export type DifficultyLevel = 'Débutant' | 'Intermédiaire' | 'Expert';
export type Modality = 'Radiographie' | 'TDM' | 'IRM' | 'Échographie' | 'TEP' | 'Mammographie';
export type Specialty = 
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

export interface Case {
  id: string;
  title: string;
  specialty: Specialty;
  modality: Modality;
  difficulty: DifficultyLevel;
  previewImage: string;
  images: string[];
  tags: string[];
  author: string;
  date: string;
  status: 'Vérifié' | 'En attente';
  patientInfo: {
    age: string;
    gender: 'M' | 'F' | 'Autre';
    clinicalContext: string;
  };
  description: string;
  questions: { question: string; explanation: string }[];
  diagnosis: string;
  discussion: string;
  keyPoints: string[];
  references: string[];
}

export interface CourseChapter {
  title: string;
  content: string;
  subtitle?: string;
  pearls?: string[];
  tables?: {
    title: string;
    headers: string[];
    rows: string[][];
  }[];
  figures?: {
    url: string;
    legend: string;
    label?: string;
  }[];
  sections?: {
    heading: string;
    body: string;
    pearls?: string[];
    figures?: {
      url: string;
      legend: string;
      label?: string;
    }[];
  }[];
}

export interface Course {
  id: string;
  title: string;
  subtitle?: string;
  category: Specialty;
  duration: string; // e.g., "45 min"
  level: DifficultyLevel;
  chaptersCount: number;
  progress?: number; // percentage
  image: string;
  type: 'theorique' | 'planchage';
  authors?: string;
  affiliation?: string;
  publishedAt?: string;
  updatedAt?: string;
  introduction?: string;
  keyTakeaways?: string[];
  chapters?: CourseChapter[];
  planchageData?: {
    clinicalContext: string;
    images: string[];
    checklist: string[];
    differentials: string[];
    finalDiagnosis: string;
    management: string[];
    gradingScale: { criteria: string; points: number; details: string }[];
  };
}

export interface UserStats {
  casesViewed: number;
  coursesCompleted: number;
  favoritesCount: number;
  casesSubmitted: number;
  globalProgress: number;
}
