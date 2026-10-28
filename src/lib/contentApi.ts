export type Specialty = {
  id: number;
  name: string;
  position: number;
  classificationCount: number;
  courseCount: number;
};
export type EvaluationRule = {
  id?: number;
  grade: string;
  semiology: string;
  clinicalDescription: string;
  position?: number;
};
export type Classification = {
  id: number;
  name: string;
  type: string;
  description: string;
  indications: string;
  specialty: Pick<Specialty, "id" | "name">;
  rules: EvaluationRule[];
  calculatorKey: string | null;
};
export type BlockLayout =
  "IMAGE_LEFT" | "IMAGE_RIGHT" | "IMAGE_TOP" | "IMAGE_BOTTOM";
export type CourseBlock = {
  id?: number;
  contentHtml: string;
  imagePath: string | null;
  layout: BlockLayout;
};
export type CourseSection = {
  id?: number;
  title: string;
  blocks: CourseBlock[];
  children: CourseSection[];
};
export type Course = {
  id: number;
  title: string;
  imagePath: string;
  authorName: string;
  institution: string;
  specialty: Pick<Specialty, "id" | "name">;
  sections?: CourseSection[];
};
export const answerFields = [
  ["identification", "Identification du dossier radiologique"],
  ["analyticStudy", "Étude analytique"],
  ["syntheticStudy", "Étude synthétique"],
  ["differentialDiagnosis", "Diagnostic différentiel"],
  ["management", "Conduite à tenir"],
] as const;
export type DemsAnswers = Record<(typeof answerFields)[number][0], string>;
export type DemsExercise = {
  id: number;
  name: string;
  maskedName: string;
  imagePath: string;
  clinicalPresentation: string;
};
export type ReportExam = {
  id: number;
  name: string;
  modality: { id: number; name: string };
  templateCount: number;
};
export type ReportTemplate = {
  id: number;
  label: string;
  category: "NORMAL" | "PATHOLOGICAL";
  contentHtml: string;
  conclusionHtml: string;
  examId: number;
};
export type SavedReport = {
  id: number;
  title: string;
  updatedAt: string;
  contentHtml?: string;
  conclusionHtml?: string;
  personalization?: Record<string, string>;
};

export const API_BASE = (
  import.meta.env.VITE_API_BASE_URL || "https://api.e-radiologie.com"
).replace(/\/$/, "");
export function mediaUrl(path: string) {
  return path.startsWith("/uploads/") ? API_BASE + path : path;
}

export async function api<T>(
  path: string,
  options: RequestInit = {},
): Promise<T> {
  const token = localStorage.getItem("auth_token");
  const response = await fetch(API_BASE + path, {
    ...options,
    cache: "no-store",
    headers: {
      Accept: "application/json",
      ...(options.body ? { "Content-Type": "application/json" } : {}),
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...options.headers,
    },
  });
  if (!response.ok) {
    const error = await response.json().catch(() => ({}));
    throw new Error(
      error.message || "Le contenu n’a pas pu être chargé. Réessayez.",
    );
  }
  return response.status === 204 ? (undefined as T) : response.json();
}

export async function allContent<T>(
  resource: string,
  filters: Record<string, string> = {},
): Promise<T[]> {
  const params = new URLSearchParams({ ...filters, limit: "100" });
  let page = 1,
    pages = 1;
  const items: T[] = [];
  do {
    params.set("page", String(page));
    const result = await api<{
      items: T[];
      pagination: { totalPages: number };
    }>(`/api/content/${resource}?${params}`);
    items.push(...result.items);
    pages = result.pagination.totalPages;
  } while (++page <= pages);
  return items;
}
