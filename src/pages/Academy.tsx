import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Award, BookOpen, Search, ArrowRight } from "lucide-react";
import {
  allContent,
  Course,
  DemsExercise,
  Specialty,
  mediaUrl,
} from "../lib/contentApi";
import { ContentState } from "../components/ui/ContentState";

export function Academy() {
  const [tab, setTab] = useState<"courses" | "dems">("courses");
  const [courses, setCourses] = useState<Course[]>([]);
  const [exercises, setExercises] = useState<DemsExercise[]>([]);
  const [specialties, setSpecialties] = useState<Specialty[]>([]);
  const [specialty, setSpecialty] = useState<number | null>(null);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  useEffect(() => {
    let active = true;
    Promise.all([
      allContent<Course>("courses"),
      allContent<DemsExercise>("dems-exercises"),
      allContent<Specialty>("specialties"),
    ])
      .then(([c, d, s]) => {
        if (active) {
          setCourses(c);
          setExercises(d);
          setSpecialties(s);
        }
      })
      .catch((e) => active && setError(e.message))
      .finally(() => active && setLoading(false));
    return () => {
      active = false;
    };
  }, []);
  const filteredCourses = courses.filter(
    (c) =>
      (specialty === null || c.specialty.id === specialty) &&
      c.title.toLocaleLowerCase("fr").includes(search.toLocaleLowerCase("fr")),
  );
  const filteredExercises = exercises.filter((c) =>
    `${c.name} ${c.maskedName}`
      .toLocaleLowerCase("fr")
      .includes(search.toLocaleLowerCase("fr")),
  );
  return (
    <div className="v1-page">
      <div className="v1-hero">
        <span className="v1-eyebrow">
          E-learning médical & entraînement examens
        </span>
        <h1>E-Radiologie Academy</h1>
        <p>
          Perfectionnez vos compétences analytiques et préparez vos épreuves
          d’interprétation.
        </p>
        <div className="v1-tabs">
          <button
            aria-pressed={tab === "courses"}
            onClick={() => setTab("courses")}
          >
            <BookOpen size={18} />
            Cours théoriques
          </button>
          <button aria-pressed={tab === "dems"} onClick={() => setTab("dems")}>
            <Award size={18} />
            Planchages DEMS
          </button>
        </div>
        <label className="v1-search">
          <Search size={20} />
          <input
            aria-label="Rechercher dans l’Academy"
            placeholder={
              tab === "courses"
                ? "Rechercher un cours…"
                : "Rechercher un planchage…"
            }
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </label>
      </div>
      {tab === "courses" && (
        <div className="flex flex-wrap justify-center gap-2 mb-8">
          <button
            className={`v1-chip ${specialty === null ? "active" : ""}`}
            onClick={() => setSpecialty(null)}
          >
            Toutes
          </button>
          {specialties.map((s) => (
            <button
              key={s.id}
              className={`v1-chip ${specialty === s.id ? "active" : ""}`}
              onClick={() => setSpecialty(s.id)}
            >
              {s.name}
            </button>
          ))}
        </div>
      )}
      <ContentState
        loading={loading}
        error={error}
        empty={
          tab === "courses"
            ? filteredCourses.length === 0
            : filteredExercises.length === 0
        }
      >
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {tab === "courses"
            ? filteredCourses.map((course) => (
                <Link
                  key={course.id}
                  to={`/academy/courses/${course.id}`}
                  className="v1-panel !p-0 overflow-hidden hover:border-sky-300 transition-colors"
                >
                  <img
                    className="h-44 w-full object-cover"
                    src={mediaUrl(course.imagePath)}
                    alt=""
                  />
                  <div className="p-5">
                    <span className="v1-tag">{course.specialty.name}</span>
                    <h2 className="font-bold text-xl mt-3 mb-2">
                      {course.title}
                    </h2>
                    <p className="text-sm text-slate-500">
                      {course.authorName} · {course.institution}
                    </p>
                    <span className="text-sky-600 flex gap-2 items-center mt-5 text-sm font-semibold">
                      Consulter le cours <ArrowRight size={16} />
                    </span>
                  </div>
                </Link>
              ))
            : filteredExercises.map((exercise) => (
                <Link
                  key={exercise.id}
                  to={`/academy/dems/${exercise.id}`}
                  className="v1-panel !p-0 overflow-hidden hover:border-sky-300"
                >
                  <img
                    className="h-44 w-full object-cover"
                    src={mediaUrl(exercise.imagePath)}
                    alt=""
                  />
                  <div className="p-5">
                    <span className="v1-tag">Planchage DEMS</span>
                    <h2 className="font-bold text-xl mt-3">
                      {exercise.maskedName}
                    </h2>
                    <p className="text-sm text-slate-500 mt-2">
                      Cinq réponses libres, puis une comparaison avec le corrigé
                      de référence.
                    </p>
                    <span className="text-sky-600 flex gap-2 items-center mt-5 text-sm font-semibold">
                      Commencer <ArrowRight size={16} />
                    </span>
                  </div>
                </Link>
              ))}
        </div>
      </ContentState>
    </div>
  );
}
