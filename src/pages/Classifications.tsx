import { useEffect, useState } from "react";
import { ChevronDown, ChevronRight, Info, Search } from "lucide-react";
import { allContent, Classification, Specialty } from "../lib/contentApi";
import { ContentState } from "../components/ui/ContentState";
import { LegacyClassificationCalculator } from "../components/LegacyClassificationCalculator";

export function Classifications() {
  const [specialties, setSpecialties] = useState<Specialty[]>([]);
  const [items, setItems] = useState<Classification[]>([]);
  const [specialty, setSpecialty] = useState<number | null>(null);
  const [search, setSearch] = useState("");
  const [expanded, setExpanded] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [reload, setReload] = useState(0);
  useEffect(() => {
    let active = true;
    setLoading(true);
    setError("");
    Promise.all([
      allContent<Specialty>("specialties"),
      allContent<Classification>("classifications"),
    ])
      .then(([s, c]) => {
        if (active) {
          setSpecialties(s);
          setItems(c);
        }
      })
      .catch((e) => active && setError(e.message))
      .finally(() => active && setLoading(false));
    return () => {
      active = false;
    };
  }, [reload]);
  const filtered = items.filter(
    (item) =>
      (specialty === null || item.specialty.id === specialty) &&
      item.name
        .toLocaleLowerCase("fr")
        .includes(search.toLocaleLowerCase("fr")),
  );
  return (
    <div className="v1-page">
      <div className="v1-hero">
        <span className="v1-eyebrow">
          Références scientifiques & grilles de score
        </span>
        <h1>Classifications Utiles en Imagerie Médicale</h1>
        <p>
          Retrouvez les classifications et leurs règles d’évaluation par
          spécialité.
        </p>
        <label className="v1-search">
          <Search size={20} />
          <input
            aria-label="Rechercher une classification"
            placeholder="Rechercher une classification (ex : Bosniak, Fazekas, BIRADS…)"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </label>
      </div>
      <ContentState loading={loading} error={error}>
        <div className="v1-columns">
          <aside className="v1-panel v1-sidebar">
            <h2 className="v1-label">Spécialités</h2>
            <button
              className={specialty === null ? "selected" : ""}
              onClick={() => setSpecialty(null)}
            >
              Toutes les spécialités <span>{items.length}</span>
            </button>
            {specialties.map((s) => (
              <button
                key={s.id}
                className={specialty === s.id ? "selected" : ""}
                onClick={() => setSpecialty(s.id)}
              >
                {s.name}
                <span>{s.classificationCount}</span>
              </button>
            ))}
          </aside>
          <div className="space-y-5">
            <ContentState empty={filtered.length === 0}>
              {filtered.map((item) => (
                <article
                  className="v1-panel !p-0 overflow-hidden"
                  key={item.id}
                >
                  <button
                    className="w-full text-left p-6 flex items-center justify-between gap-4"
                    aria-expanded={expanded === item.id}
                    onClick={() =>
                      setExpanded(expanded === item.id ? null : item.id)
                    }
                  >
                    <div>
                      <div className="flex flex-wrap gap-2 mb-2">
                        <span className="v1-tag">{item.specialty.name}</span>
                        <span className="v1-tag v1-tag-purple">
                          {item.type}
                        </span>
                      </div>
                      <h2 className="text-lg font-bold text-slate-900">
                        {item.name}
                      </h2>
                      <p className="mt-2 text-sm text-slate-500 leading-relaxed">
                        {item.description}
                      </p>
                    </div>
                    {expanded === item.id ? (
                      <ChevronDown
                        className="shrink-0 text-sky-600"
                        size={18}
                      />
                    ) : (
                      <ChevronRight
                        className="shrink-0 text-slate-400"
                        size={18}
                      />
                    )}
                  </button>
                  {expanded === item.id && (
                    <div className="border-t border-slate-100 p-5 bg-slate-50/50">
                      <div className="flex gap-3 rounded-xl border border-slate-300 bg-white p-4 mb-5">
                        <Info size={18} className="text-sky-500 shrink-0" />
                        <div>
                          <h3 className="v1-label !text-slate-800">
                            Indications générales
                          </h3>
                          <p className="text-sm whitespace-pre-wrap mt-1">
                            {item.indications}
                          </p>
                        </div>
                      </div>
                      <h3 className="font-bold text-sm mb-3 uppercase">
                        Règles d’évaluation sémiologiques
                      </h3>
                      <div className="overflow-x-auto rounded-xl border border-slate-300">
                        <table className="v1-table">
                          <thead>
                            <tr>
                              <th>Grade / score</th>
                              <th>Sémiologie</th>
                              <th>Description clinique</th>
                            </tr>
                          </thead>
                          <tbody>
                            {item.rules.map((rule, i) => (
                              <tr key={rule.id || i}>
                                <td className="font-mono font-semibold">
                                  {rule.grade}
                                </td>
                                <td className="font-semibold">
                                  {rule.semiology}
                                </td>
                                <td>{rule.clinicalDescription}</td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                      {item.rules.length === 0 && (
                        <p className="text-sm text-slate-500 p-4">
                          Aucune règle renseignée.
                        </p>
                      )}
                      <LegacyClassificationCalculator
                        key={item.id}
                        calculatorKey={item.calculatorKey}
                      />
                    </div>
                  )}
                </article>
              ))}
            </ContentState>
          </div>
        </div>
      </ContentState>
      {error && (
        <button
          className="v1-button mt-4"
          onClick={() => setReload((x) => x + 1)}
        >
          Réessayer
        </button>
      )}
    </div>
  );
}
