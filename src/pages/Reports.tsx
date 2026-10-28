import { useEffect, useRef, useState } from "react";
import {
  Copy,
  Download,
  Printer,
  Save,
  Search,
  FileText,
  Trash2,
} from "lucide-react";
import {
  allContent,
  api,
  mediaUrl,
  ReportExam,
  ReportTemplate,
  SavedReport,
} from "../lib/contentApi";
import { RichTextEditor } from "../components/ui/RichTextEditor";
import { ContentState } from "../components/ui/ContentState";
import { useAuth } from "../contexts/AuthContext";
import printCss from "../reportPrint.css?raw";

type Personalization = Record<string, string>;
const initialPersonalization = (): Personalization => ({
  clinicName: "",
  clinicAddress: "",
  clinicContact: "",
  patientName: "",
  patientBirthDate: "",
  patientAge: "",
  indication: "",
  practitioner: "",
  documentDate: new Date().toLocaleDateString("en-CA"),
  logoChoice: "cross_blue",
  logoData: "",
});
function plainHtml(html: string) {
  const doc = new DOMParser().parseFromString(html, "text/html");
  doc.querySelectorAll("p,h1,h2,h3,li,br").forEach((el) => el.append("\n"));
  return doc.body.textContent?.trim() || "";
}
function textHtml(text: string) {
  return text
    .split("\n")
    .map(
      (line) =>
        `<p>${line.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;")}</p>`,
    )
    .join("");
}
const dateLabel = (value: string) =>
  /^\d{4}-\d{2}-\d{2}$/.test(value)
    ? value.split("-").reverse().join("/")
    : value;

export function Reports() {
  const { isAuthenticated, user, setShowAuthModal } = useAuth();
  const [exams, setExams] = useState<ReportExam[]>([]);
  const [modalities, setModalities] = useState<{ id: number; name: string }[]>(
    [],
  );
  const [examId, setExamId] = useState<number | null>(null);
  const [templates, setTemplates] = useState<ReportTemplate[]>([]);
  const [templateId, setTemplateId] = useState<number | null>(null);
  const [modalityId, setModalityId] = useState("");
  const [search, setSearch] = useState("");
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [conclusion, setConclusion] = useState("");
  const [personal, setPersonal] = useState<Personalization>(
    initialPersonalization,
  );
  const [loading, setLoading] = useState(true);
  const [templatesLoading, setTemplatesLoading] = useState(false);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");
  const [saving, setSaving] = useState(false);
  const [savedId, setSavedId] = useState<number | null>(null);
  const [saved, setSaved] = useState<SavedReport[]>([]);
  const [previewMode, setPreviewMode] = useState<"layout" | "text">("layout");
  const fileInput = useRef<HTMLInputElement>(null);
  const examRequest = useRef(0);
  const previousUser = useRef<number | null>(null);
  useEffect(() => {
    let active = true;
    Promise.all([
      allContent<ReportExam>("report-exams"),
      api<{ items: { id: number; name: string }[] }>("/api/imaging-modalities"),
    ])
      .then(([e, m]) => {
        if (active) {
          setExams(e);
          setModalities(m.items);
        }
      })
      .catch((e) => active && setError(e.message))
      .finally(() => active && setLoading(false));
    return () => {
      active = false;
    };
  }, []);
  useEffect(() => {
    if (!isAuthenticated) {
      setSaved([]);
      setSavedId(null);
      return;
    }
    let active = true;
    api<{ items: SavedReport[] }>("/api/me/reports")
      .then((r) => active && setSaved(r.items))
      .catch(
        () =>
          active &&
          setError("Impossible de charger vos comptes rendus enregistrés."),
      );
    return () => {
      active = false;
    };
  }, [isAuthenticated]);
  useEffect(() => {
    if (
      previousUser.current !== null &&
      previousUser.current !== (user?.id ?? null)
    ) {
      ++examRequest.current;
      setPersonal(initialPersonalization());
      setContent("");
      setConclusion("");
      setTitle("");
      setSavedId(null);
      setExamId(null);
      setTemplateId(null);
      setTemplates([]);
    }
    previousUser.current = user?.id ?? null;
    if (user)
      setPersonal((p) =>
        p.practitioner
          ? p
          : { ...p, practitioner: `${user.firstName} ${user.lastName}` },
      );
  }, [user]);
  const chooseTemplate = (template: ReportTemplate) => {
    setTemplateId(template.id);
    setContent(template.contentHtml);
    setConclusion(template.conclusionHtml);
    setSavedId(null);
    setNotice("");
  };
  const chooseExam = async (exam: ReportExam) => {
    const request = ++examRequest.current;
    setExamId(exam.id);
    setTitle(exam.name);
    setTemplates([]);
    setTemplateId(null);
    setContent("");
    setConclusion("");
    setSavedId(null);
    setTemplatesLoading(true);
    setError("");
    setNotice("");
    try {
      const result = await allContent<ReportTemplate>("report-templates", {
        exam: String(exam.id),
      });
      if (request !== examRequest.current) return;
      setTemplates(result);
      if (result[0])
        chooseTemplate(
          result.find((template) => template.category === "NORMAL") ||
            result[0],
        );
    } catch (e) {
      if (request === examRequest.current) setError((e as Error).message);
    } finally {
      if (request === examRequest.current) setTemplatesLoading(false);
    }
  };
  const setField = (field: string, value: string) => {
    setPersonal((p) => ({ ...p, [field]: value }));
    setNotice("");
  };
  const importLogo = async (file?: File) => {
    if (!file) return;
    if (
      !["image/png", "image/jpeg", "image/webp"].includes(file.type) ||
      file.size > 1_400_000
    ) {
      setError("Choisir un logo PNG, JPEG ou WebP de moins de 1,4 Mo.");
      return;
    }
    const reader = new FileReader();
    reader.onload = () => {
      setPersonal((p) => ({
        ...p,
        logoChoice: "custom",
        logoData: String(reader.result),
      }));
      setError("");
    };
    reader.onerror = () => setError("Le logo n’a pas pu être lu.");
    reader.readAsDataURL(file);
  };
  const documentText = () =>
    [
      personal.clinicName,
      personal.clinicAddress,
      personal.clinicContact,
      `Date : ${dateLabel(personal.documentDate)}`,
      `COMPTE RENDU : ${title}`,
      `Patient : ${personal.patientName}`,
      `Date de naissance : ${dateLabel(personal.patientBirthDate)}`,
      personal.patientAge ? `Âge : ${personal.patientAge}` : "",
      `Indication : ${personal.indication}`,
      plainHtml(content),
      "CONCLUSION",
      plainHtml(conclusion),
      personal.practitioner,
    ]
      .filter(Boolean)
      .join("\n\n");
  const copy = async () => {
    try {
      await navigator.clipboard.writeText(documentText());
      setNotice("Compte rendu copié.");
    } catch {
      setError(
        "La copie n’est pas disponible dans ce navigateur. Utilisez l’export TXT.",
      );
    }
  };
  const download = () => {
    const url = URL.createObjectURL(
      new Blob([documentText()], { type: "text/plain;charset=utf-8" }),
    );
    const link = document.createElement("a");
    link.href = url;
    link.download = "compte-rendu.txt";
    link.click();
    URL.revokeObjectURL(url);
    setNotice("Export texte préparé, sans enregistrement sur le serveur.");
  };
  const print = () => {
    const article = document.getElementById("report-print");
    const popup = window.open("", "_blank");
    if (!popup || !article) {
      setError(
        "Autorisez l’ouverture de la fenêtre d’impression dans le navigateur.",
      );
      return;
    }
    popup.opener = null;
    popup.document.title = "Compte rendu";
    const style = popup.document.createElement("style");
    style.textContent = printCss;
    popup.document.head.append(style);
    popup.document.body.append(article.cloneNode(true));
    void Promise.all(
      Array.from(popup.document.images).map((image) =>
        image.decode().catch(() => {}),
      ),
    ).then(() => {
      popup.focus();
      popup.print();
    });
  };
  const save = async () => {
    setSaving(true);
    setError("");
    setNotice("");
    try {
      const report = await api<SavedReport>(
        savedId ? `/api/me/reports/${savedId}` : "/api/me/reports",
        {
          method: savedId ? "PATCH" : "POST",
          body: JSON.stringify({
            saveExplicitly: true,
            title,
            contentHtml: content,
            conclusionHtml: conclusion,
            personalization: personal,
          }),
        },
      );
      setSavedId(report.id);
      setContent(report.contentHtml || "");
      setConclusion(report.conclusionHtml || "");
      const result = await api<{ items: SavedReport[] }>("/api/me/reports");
      setSaved(result.items);
      setNotice("Compte rendu enregistré dans votre espace personnel.");
    } catch (e) {
      setError((e as Error).message);
    } finally {
      setSaving(false);
    }
  };
  const openSaved = async (id: number) => {
    ++examRequest.current;
    try {
      const report = await api<SavedReport>(`/api/me/reports/${id}`);
      setSavedId(report.id);
      setTitle(report.title);
      setContent(report.contentHtml || "");
      setConclusion(report.conclusionHtml || "");
      setPersonal({ ...initialPersonalization(), ...report.personalization });
      setTemplateId(null);
      setExamId(null);
      setTemplates([]);
      setError("");
      setNotice(
        "Compte rendu personnel ouvert. Les modifications ne sont pas sauvegardées automatiquement.",
      );
    } catch (e) {
      setError((e as Error).message);
    }
  };
  const deleteSaved = async (id: number) => {
    if (
      !window.confirm("Supprimer ce compte rendu de votre espace personnel ?")
    )
      return;
    try {
      await api(`/api/me/reports/${id}`, { method: "DELETE" });
      setSaved((s) => s.filter((item) => item.id !== id));
      if (savedId === id) setSavedId(null);
      setNotice("Compte rendu supprimé de votre espace.");
    } catch (e) {
      setError((e as Error).message);
    }
  };
  const hasDocument = templateId !== null || savedId !== null;
  const filtered = exams.filter(
    (exam) =>
      (!modalityId || exam.modality.id === Number(modalityId)) &&
      exam.name
        .toLocaleLowerCase("fr")
        .includes(search.toLocaleLowerCase("fr")),
  );
  return (
    <div className="v1-page reports-page">
      <div className="v1-hero">
        <span className="v1-eyebrow">Travailler · Usage individuel</span>
        <h1>Comptes rendus radiologiques</h1>
        <p>
          Sélectionnez un examen, adaptez votre compte rendu et préparez son
          impression.
        </p>
      </div>
      <div className="rounded-xl border border-sky-100 bg-sky-50 p-4 text-sm text-sky-900 mb-6">
        La saisie, l’aperçu, la copie, l’export et l’impression ne sauvegardent
        aucune information sur le serveur. Seul le bouton « Enregistrer dans mon
        espace » conserve volontairement le document.
      </div>
      {error && (
        <p className="v1-state v1-error mb-5" role="alert">
          {error}
        </p>
      )}
      {notice && (
        <p
          className="bg-emerald-50 text-emerald-800 rounded-xl p-4 mb-5 text-sm"
          role="status"
        >
          {notice}
        </p>
      )}
      <ContentState loading={loading}>
        <div className="v1-columns">
          <aside className="space-y-5">
            <div className="v1-panel">
              <h2 className="v1-label mb-4">Examens disponibles</h2>
              <label className="v1-search !mt-0 !mb-3">
                <Search size={16} />
                <input
                  aria-label="Rechercher un examen"
                  placeholder="Rechercher un examen…"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
              </label>
              <label className="v1-label">
                Modalité (facultatif)
                <select
                  aria-label="Modalité (facultatif)"
                  className="v1-input mt-2 mb-4"
                  value={modalityId}
                  onChange={(e) => setModalityId(e.target.value)}
                >
                  <option value="">Toutes les modalités</option>
                  {modalities.map((m) => (
                    <option key={m.id} value={m.id}>
                      {m.name}
                    </option>
                  ))}
                </select>
              </label>
              <div className="space-y-2 max-h-[520px] overflow-y-auto">
                {filtered.map((exam) => (
                  <button
                    key={exam.id}
                    onClick={() => chooseExam(exam)}
                    className={`report-exam ${examId === exam.id ? "active" : ""}`}
                  >
                    <FileText size={16} className="shrink-0" />
                    <span>
                      {exam.name}
                      <small>
                        {exam.modality.name} · {exam.templateCount} modèle(s)
                      </small>
                    </span>
                  </button>
                ))}
                {!filtered.length && (
                  <p className="text-sm text-slate-500">
                    Aucun examen disponible.
                  </p>
                )}
              </div>
            </div>
            {isAuthenticated && (
              <section className="v1-panel">
                <h2 className="v1-label mb-4">
                  Mes comptes rendus enregistrés
                </h2>
                {!saved.length && (
                  <p className="text-sm text-slate-500">
                    Aucun compte rendu enregistré.
                  </p>
                )}
                <ul className="space-y-3">
                  {saved.map((item) => (
                    <li key={item.id} className="flex items-center gap-2">
                      <button
                        className="text-left text-sm text-sky-700 flex-1"
                        onClick={() => openSaved(item.id)}
                      >
                        {item.title}
                        <small className="block text-slate-400">
                          {new Date(item.updatedAt).toLocaleDateString("fr-FR")}
                        </small>
                      </button>
                      <button
                        aria-label={`Supprimer ${item.title}`}
                        className="text-slate-400 hover:text-red-600"
                        onClick={() => deleteSaved(item.id)}
                      >
                        <Trash2 size={16} />
                      </button>
                    </li>
                  ))}
                </ul>
              </section>
            )}
          </aside>
          <div className="space-y-6">
            <ContentState loading={templatesLoading} empty={!hasDocument}>
              <section className="v1-panel">
                <h2 className="font-bold text-lg mb-4">
                  Modèle et contenu du compte rendu
                </h2>
                <label className="v1-label">
                  Titre du document
                  <input
                    className="v1-input mt-2"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    maxLength={255}
                  />
                </label>
                <div className="flex flex-wrap gap-2 my-5">
                  {templates.map((t) => (
                    <button
                      key={t.id}
                      className={`v1-chip ${templateId === t.id ? "active" : ""}`}
                      onClick={() => chooseTemplate(t)}
                    >
                      {t.category === "NORMAL" ? "Normal" : "Pathologique"} ·{" "}
                      {t.label}
                    </button>
                  ))}
                </div>
                <label className="v1-label block mb-2">
                  Texte du compte rendu
                </label>
                <RichTextEditor
                  label="Texte du compte rendu"
                  value={content}
                  onChange={setContent}
                />
                <label className="v1-label block mt-5 mb-2">
                  Conclusion diagnostique
                </label>
                <RichTextEditor
                  label="Conclusion diagnostique"
                  value={conclusion}
                  onChange={setConclusion}
                />
              </section>
              <section className="v1-panel">
                <h2 className="font-bold text-lg mb-2">
                  En-tête & logo de la clinique
                </h2>
                <p className="text-sm text-slate-500 mb-5">
                  Personnalisez le document à imprimer.
                </p>
                <span className="v1-label">Choix du logo</span>
                <div className="grid grid-cols-2 md:grid-cols-5 gap-2 mt-2 mb-5">
                  {[
                    ["cross_blue", "Croix bleue"],
                    ["cross_green", "Croix verte"],
                    ["ring", "Scanner Ring"],
                    ["none", "Sans logo"],
                  ].map(([key, label]) => (
                    <button
                      key={key}
                      className={`logo-option ${personal.logoChoice === key ? "active" : ""}`}
                      onClick={() => setField("logoChoice", key)}
                    >
                      <span className={`clinic-logo ${key}`}>
                        {key === "none" ? "∅" : key === "ring" ? "◌" : "✚"}
                      </span>
                      {label}
                    </button>
                  ))}
                  <button
                    className={`logo-option ${personal.logoChoice === "custom" ? "active" : ""}`}
                    onClick={() => fileInput.current?.click()}
                  >
                    <span className="text-2xl mb-2">▧</span>Importer un logo
                  </button>
                  <input
                    ref={fileInput}
                    aria-label="Importer le logo de la clinique"
                    type="file"
                    accept="image/png,image/jpeg,image/webp"
                    className="hidden"
                    onChange={(e) => importLogo(e.target.files?.[0])}
                  />
                </div>
                <div className="grid md:grid-cols-2 gap-4">
                  {[
                    ["clinicName", "Nom du centre / de la clinique"],
                    ["clinicAddress", "Adresse"],
                    ["clinicContact", "Téléphone / coordonnées"],
                  ].map(([key, label]) => (
                    <label
                      key={key}
                      className={`v1-label ${key === "clinicName" ? "md:col-span-2" : ""}`}
                    >
                      {label}
                      <input
                        className="v1-input mt-2"
                        maxLength={2000}
                        value={personal[key]}
                        onChange={(e) => setField(key, e.target.value)}
                      />
                    </label>
                  ))}
                </div>
              </section>
              <section className="v1-panel">
                <h2 className="font-bold text-lg mb-5">
                  Informations du patient et de l’examen
                </h2>
                <div className="grid md:grid-cols-2 gap-5">
                  {[
                    ["patientName", "Nom du patient", "text"],
                    ["patientBirthDate", "Date de naissance", "date"],
                    ["patientAge", "Âge (facultatif)", "number"],
                    ["documentDate", "Date du document", "date"],
                    ["indication", "Indication clinique", "text"],
                    ["practitioner", "Nom / signature du praticien", "text"],
                  ].map(([key, label, type]) => (
                    <label key={key} className="v1-label">
                      {label}
                      <input
                        className="v1-input mt-2"
                        type={type}
                        min={type === "number" ? "0" : undefined}
                        step={type === "number" ? "1" : undefined}
                        maxLength={2000}
                        value={personal[key]}
                        onChange={(e) => setField(key, e.target.value)}
                      />
                    </label>
                  ))}
                </div>
              </section>
              <section className="v1-panel !p-0 overflow-hidden">
                <div className="flex flex-wrap gap-3 items-center justify-between border-b border-slate-200 p-5">
                  <div>
                    <h2 className="v1-label !text-slate-700">
                      Aperçu en temps réel
                    </h2>
                    <p className="text-xs text-slate-500 mt-1">
                      Vérifiez le document avant impression.
                    </p>
                  </div>
                  <div className="v1-tabs !m-0">
                    <button
                      aria-pressed={previewMode === "layout"}
                      onClick={() => setPreviewMode("layout")}
                    >
                      Mise en page clinique
                    </button>
                    <button
                      aria-pressed={previewMode === "text"}
                      onClick={() => setPreviewMode("text")}
                    >
                      Texte brut éditable
                    </button>
                  </div>
                  <div className="flex gap-2 flex-wrap">
                    <button className="v1-button secondary" onClick={copy}>
                      <Copy size={15} />
                      Copier
                    </button>
                    <button className="v1-button secondary" onClick={download}>
                      <Download size={15} />
                      .TXT
                    </button>
                    <button className="v1-button print" onClick={print}>
                      <Printer size={15} />
                      Imprimer / PDF
                    </button>
                  </div>
                </div>
                {previewMode === "text" && (
                  <div className="p-6">
                    <label className="v1-label">
                      Texte du compte rendu
                      <textarea
                        className="v1-input mt-2 min-h-64"
                        value={plainHtml(content)}
                        onChange={(e) => setContent(textHtml(e.target.value))}
                      />
                    </label>
                    <label className="v1-label block mt-4">
                      Conclusion
                      <textarea
                        className="v1-input mt-2 min-h-24"
                        value={plainHtml(conclusion)}
                        onChange={(e) =>
                          setConclusion(textHtml(e.target.value))
                        }
                      />
                    </label>
                  </div>
                )}
                <div
                  className={`report-paper-container ${previewMode === "text" ? "hidden" : ""}`}
                >
                  <article id="report-print" className="report-paper">
                    <header className="report-letterhead">
                      {personal.logoChoice === "custom" && personal.logoData ? (
                        <img
                          className="w-14 h-14 object-contain"
                          src={mediaUrl(personal.logoData)}
                          alt="Logo de la clinique"
                        />
                      ) : (
                        personal.logoChoice !== "none" && (
                          <span
                            aria-hidden="true"
                            className={`clinic-logo ${personal.logoChoice}`}
                          >
                            {personal.logoChoice === "ring" ? "◌" : "✚"}
                          </span>
                        )
                      )}
                      <div className="flex-1">
                        <h2 className="font-bold uppercase text-sm">
                          {personal.clinicName ||
                            "Nom du centre / de la clinique"}
                        </h2>
                        <p className="text-xs whitespace-pre-wrap">
                          {personal.clinicAddress}
                        </p>
                        <p className="text-xs whitespace-pre-wrap">
                          {personal.clinicContact}
                        </p>
                      </div>
                      <p className="text-xs">
                        Date : {dateLabel(personal.documentDate)}
                      </p>
                    </header>
                    <h3 className="text-center uppercase font-bold underline underline-offset-4 my-8">
                      Compte rendu : {title}
                    </h3>
                    <div className="report-patient">
                      <div>
                        <strong>Patient</strong>
                        <p>{personal.patientName || "—"}</p>
                      </div>
                      <div>
                        <strong>Date de naissance / âge</strong>
                        <p>
                          {[
                            dateLabel(personal.patientBirthDate),
                            personal.patientAge,
                          ]
                            .filter(Boolean)
                            .join(" · ") || "—"}
                        </p>
                      </div>
                    </div>
                    {personal.indication && (
                      <section className="report-indication">
                        <h4>Indication clinique</h4>
                        <p className="italic whitespace-pre-wrap">
                          {personal.indication}
                        </p>
                      </section>
                    )}
                    <div
                      className="rich-content report-body"
                      dangerouslySetInnerHTML={{ __html: content }}
                    />
                    <section className="report-conclusion">
                      <h4>Conclusion diagnostique</h4>
                      <div
                        className="rich-content"
                        dangerouslySetInnerHTML={{ __html: conclusion }}
                      />
                    </section>
                    <footer className="mt-8 pt-4 border-t border-dashed border-slate-200 text-sm">
                      <p>Praticien signataire</p>
                      <strong>{personal.practitioner || "—"}</strong>
                    </footer>
                  </article>
                </div>
              </section>
              <section className="v1-panel">
                <h2 className="font-bold mb-2">Conservation du compte rendu</h2>
                <p className="text-sm text-slate-500 mb-4">
                  L’enregistrement conserve le contenu et les informations de
                  personnalisation dans votre compte. Il reste facultatif et
                  indépendant de l’impression.
                </p>
                {isAuthenticated ? (
                  <button
                    className="v1-button"
                    disabled={saving || !title.trim()}
                    onClick={save}
                  >
                    <Save size={16} />
                    {saving
                      ? "Enregistrement…"
                      : savedId
                        ? "Enregistrer mes modifications"
                        : "Enregistrer dans mon espace"}
                  </button>
                ) : (
                  <button
                    className="v1-button secondary"
                    onClick={() => setShowAuthModal(true)}
                  >
                    Se connecter pour enregistrer volontairement
                  </button>
                )}
              </section>
            </ContentState>
            {examId !== null && !templatesLoading && !templates.length && (
              <p className="v1-state">
                Aucun modèle n’a été renseigné pour cet examen.
              </p>
            )}
          </div>
        </div>
      </ContentState>
    </div>
  );
}
