import { useEffect, useRef, useState } from "react";
import { Link, useParams } from "react-router-dom";
import {
  api,
  answerFields,
  DemsAnswers,
  DemsExercise,
  mediaUrl,
} from "../lib/contentApi";
import { ContentState } from "../components/ui/ContentState";

const blank = (): DemsAnswers => ({
  identification: "",
  analyticStudy: "",
  syntheticStudy: "",
  differentialDiagnosis: "",
  management: "",
});
export function DemsDetail() {
  const { id } = useParams();
  const [exercise, setExercise] = useState<DemsExercise | null>(null);
  const [answers, setAnswers] = useState<DemsAnswers>(blank);
  const [reference, setReference] = useState<DemsAnswers | null>(null);
  const [showName, setShowName] = useState(false);
  const [duration, setDuration] = useState(10);
  const [remaining, setRemaining] = useState(600);
  const [running, setRunning] = useState(false);
  const deadline = useRef(0);
  const [revealing, setRevealing] = useState(false);
  const [error, setError] = useState("");
  useEffect(() => {
    let active = true;
    setExercise(null);
    setAnswers(blank());
    setReference(null);
    setRunning(false);
    setRemaining(600);
    setDuration(10);
    setError("");
    api<DemsExercise>(`/api/content/dems-exercises/${id}`)
      .then((c) => active && setExercise(c))
      .catch((e) => active && setError(e.message));
    return () => {
      active = false;
    };
  }, [id]);
  useEffect(() => {
    if (!running) return;
    const tick = () => {
      const seconds = Math.max(
        0,
        Math.ceil((deadline.current - Date.now()) / 1000),
      );
      setRemaining(seconds);
      if (!seconds) setRunning(false);
    };
    const interval = window.setInterval(tick, 250);
    tick();
    return () => window.clearInterval(interval);
  }, [running]);
  const start = () => {
    if (remaining > 0) {
      deadline.current = Date.now() + remaining * 1000;
      setRunning(true);
    }
  };
  const reveal = async () => {
    setRevealing(true);
    setError("");
    try {
      const result = await api<{ answers: DemsAnswers }>(
        `/api/content/dems-exercises/${id}/results`,
        { method: "POST" },
      );
      setReference(result.answers);
    } catch (e) {
      setError((e as Error).message);
    } finally {
      setRevealing(false);
    }
  };
  return (
    <div className="v1-page">
      <Link to="/academy" className="text-sm text-sky-600">
        ← Retour à l’Academy
      </Link>
      <ContentState
        loading={!exercise && !error}
        error={!exercise ? error : ""}
      >
        {exercise && (
          <>
            <div className="v1-hero !text-left">
              <span className="v1-tag">Planchage DEMS</span>
              <h1>{showName ? exercise.name : exercise.maskedName}</h1>
              <label className="text-sm flex items-center gap-2 mt-4">
                <input
                  type="checkbox"
                  checked={showName}
                  onChange={(e) => setShowName(e.target.checked)}
                />
                Afficher le nom du planchage
              </label>
            </div>
            <div className="v1-panel mb-6 flex flex-wrap items-center gap-4">
              <label className="text-sm">
                Durée initiale (minutes)
                <input
                  className="v1-input !w-24 ml-3"
                  type="number"
                  min="1"
                  step="1"
                  value={duration}
                  onChange={(e) => {
                    const minutes = Number(e.target.value);
                    if (Number.isFinite(minutes) && minutes >= 1) {
                      setDuration(minutes);
                      setRemaining(Math.round(minutes * 60));
                      setRunning(false);
                    }
                  }}
                />
              </label>
              <output
                aria-label="Temps restant"
                className="text-3xl font-mono font-bold text-slate-900"
              >
                {Math.floor(remaining / 60)
                  .toString()
                  .padStart(2, "0")}
                :{(remaining % 60).toString().padStart(2, "0")}
              </output>
              <button
                className="v1-button"
                onClick={running ? () => setRunning(false) : start}
                disabled={!remaining}
              >
                {running ? "Pause" : "Démarrer"}
              </button>
              <button
                className="v1-button secondary"
                onClick={() => {
                  setRunning(false);
                  setRemaining(duration * 60);
                }}
              >
                Réinitialiser
              </button>
              {remaining === 0 && (
                <p role="status" className="text-amber-700 text-sm">
                  Temps écoulé. Vos réponses sont conservées.
                </p>
              )}
            </div>
            <div className="grid md:grid-cols-2 gap-6 mb-6">
              <div className="v1-panel">
                <img
                  className="w-full max-h-[500px] object-contain"
                  src={mediaUrl(exercise.imagePath)}
                  alt="Dossier radiologique du planchage"
                />
              </div>
              <div className="v1-panel">
                <h2 className="font-bold text-lg mb-4">
                  Présentation clinique d’admission
                </h2>
                <p className="whitespace-pre-wrap leading-relaxed">
                  {exercise.clinicalPresentation}
                </p>
              </div>
            </div>
            <div className="space-y-6">
              {answerFields.map(([key, label]) => (
                <section className="v1-panel" key={key}>
                  <h2 className="font-bold mb-4">{label}</h2>
                  <div className={reference ? "grid md:grid-cols-2 gap-5" : ""}>
                    <label className="block">
                      <span className="v1-label">Votre réponse</span>
                      <textarea
                        className="v1-input mt-2 min-h-36"
                        aria-label={label}
                        value={answers[key]}
                        onChange={(e) =>
                          setAnswers((a) => ({ ...a, [key]: e.target.value }))
                        }
                      />
                    </label>
                    {reference && (
                      <div>
                        <h3 className="v1-label !text-sky-600">
                          Réponse de référence
                        </h3>
                        <p className="whitespace-pre-wrap rounded-xl bg-sky-50 p-4 mt-2 min-h-36 text-sm leading-relaxed">
                          {reference[key]}
                        </p>
                      </div>
                    )}
                  </div>
                </section>
              ))}
            </div>
            {error && (
              <p role="alert" className="text-red-600 mt-5">
                {error}
              </p>
            )}
            <button
              className="v1-button mt-6"
              disabled={revealing}
              onClick={reveal}
            >
              {revealing ? "Chargement…" : "Afficher les résultats"}
            </button>
            <p className="text-sm text-slate-500 mt-3">
              Vos réponses restent dans cette page et ne sont pas enregistrées.
              Aucune notation automatique.
            </p>
          </>
        )}
      </ContentState>
    </div>
  );
}
