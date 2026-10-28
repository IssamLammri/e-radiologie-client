import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { api, Course, CourseSection, mediaUrl } from "../lib/contentApi";
import { ContentState } from "../components/ui/ContentState";

function Outline({ sections }: { sections: CourseSection[] }) {
  return (
    <ul className="space-y-2 border-l border-slate-200 pl-3">
      {sections.map((s, i) => (
        <li key={s.id || i}>
          <a
            className="text-sm text-slate-600 hover:text-sky-600"
            href={`#section-${s.id}`}
          >
            {s.title}
          </a>
          {s.children.length > 0 && <Outline sections={s.children} />}
        </li>
      ))}
    </ul>
  );
}
function Sections({
  sections,
  depth = 0,
}: {
  sections: CourseSection[];
  depth?: number;
}) {
  return (
    <>
      {sections.map((s, i) => (
        <section
          key={s.id || i}
          id={`section-${s.id}`}
          className="scroll-mt-24 mb-10"
        >
          <h2
            className={`${depth ? "text-xl" : "text-2xl border-b pb-3"} font-bold mb-5`}
          >
            {s.title}
          </h2>
          {s.blocks.map((b, j) => (
            <div key={b.id || j} className={`course-block layout-${b.layout}`}>
              {b.imagePath && (
                <figure>
                  <img
                    src={mediaUrl(b.imagePath)}
                    alt="Illustration du cours"
                    className="rounded-xl max-w-full"
                  />
                </figure>
              )}
              {b.contentHtml && (
                <div
                  className="rich-content"
                  dangerouslySetInnerHTML={{ __html: b.contentHtml }}
                />
              )}
            </div>
          ))}
          <Sections sections={s.children} depth={depth + 1} />
        </section>
      ))}
    </>
  );
}
export function CourseDetail() {
  const { id } = useParams();
  const [course, setCourse] = useState<Course | null>(null);
  const [error, setError] = useState("");
  useEffect(() => {
    let active = true;
    setCourse(null);
    setError("");
    api<Course>(`/api/content/courses/${id}`)
      .then((c) => active && setCourse(c))
      .catch((e) => active && setError(e.message));
    return () => {
      active = false;
    };
  }, [id]);
  return (
    <div className="v1-page">
      <Link to="/academy" className="text-sm text-sky-600">
        ← Retour à l’Academy
      </Link>
      <ContentState loading={!course && !error} error={error}>
        {course && (
          <>
            <div className="v1-hero !text-left">
              <span className="v1-tag">{course.specialty.name}</span>
              <h1>{course.title}</h1>
              <p>
                {course.authorName} · {course.institution}
              </p>
            </div>
            <div className="v1-columns">
              <aside className="v1-panel self-start lg:sticky lg:top-24">
                <h2 className="v1-label mb-4">Sommaire</h2>
                <Outline sections={course.sections || []} />
              </aside>
              <article className="v1-panel">
                <img
                  className="max-h-80 w-full object-contain rounded-xl mb-8"
                  src={mediaUrl(course.imagePath)}
                  alt="Présentation du cours"
                />
                <Sections sections={course.sections || []} />
                {!course.sections?.length && (
                  <p className="text-slate-500">
                    Le contenu de ce cours n’a pas encore été renseigné.
                  </p>
                )}
              </article>
            </div>
          </>
        )}
      </ContentState>
    </div>
  );
}
