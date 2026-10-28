import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  ArrowRight,
  FileText,
  ShieldCheck,
  Users,
  Brain,
  BookOpen,
} from "lucide-react";
import { Button } from "../components/ui/Button";
import { Card, CardContent } from "../components/ui/Card";
import { Badge } from "../components/ui/Badge";
import { api, type Course, mediaUrl } from "../lib/contentApi";

export function Home() {
  const [recentCourses, setRecentCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [retry, setRetry] = useState(0);

  useEffect(() => {
    const controller = new AbortController();
    setLoading(true);
    setError("");
    // The API returns courses in creation order, newest first.
    api<{ items: Course[] }>("/api/content/courses?limit=3&page=1", {
      signal: controller.signal,
    })
      .then((data) => {
        if (!controller.signal.aborted) setRecentCourses(data.items);
      })
      .catch((error) => {
        if (!controller.signal.aborted) setError(error.message);
      })
      .finally(() => {
        if (!controller.signal.aborted) setLoading(false);
      });
    return () => controller.abort();
  }, [retry]);

  return (
    <div className="flex flex-col">
      {/* Hero Section */}
      <section className="relative bg-white pt-16 pb-20 lg:pt-24 lg:pb-32 overflow-hidden border-b border-slate-200">
        <div className="absolute inset-x-0 top-0 h-96 bg-gradient-to-b from-blue-50/50" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <Badge className="mb-6 bg-blue-100 text-blue-800 hover:bg-blue-100">
            Cours, entraînement et pratique en radiologie
          </Badge>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold tracking-tight text-slate-900 max-w-4xl mx-auto">
            Approfondissez vos connaissances, <br className="hidden md:block" />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-cyan-500">
              enrichissez votre pratique.
            </span>
          </h1>
          <p className="mt-6 text-xl text-slate-600 max-w-2xl mx-auto">
            Explorez des cours structurés, entraînez-vous avec les planchages
            DEMS et consultez les classifications utiles en imagerie médicale.
            Retrouvez aussi vos modèles de comptes rendus dans un même espace.
          </p>
          <div className="mt-10 flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/academy"
              className="inline-flex items-center justify-center gap-2 min-h-11 px-8 py-3 rounded-xl bg-sky-600 text-white font-semibold shadow-sm hover:bg-sky-700 transition-colors focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-sky-600"
            >
              Découvrir les cours
              <BookOpen className="h-4 w-4" aria-hidden="true" />
            </Link>
            <Link
              to="/reports"
              className="inline-flex items-center justify-center gap-2 min-h-11 px-8 py-3 rounded-xl border border-slate-200 bg-white text-slate-600 font-semibold hover:bg-slate-50 transition-colors focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-sky-600"
            >
              Accéder aux comptes rendus
              <FileText className="h-4 w-4" aria-hidden="true" />
            </Link>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-12 bg-slate-50 border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 text-center">
            <div className="p-6 bg-white rounded-2xl shadow-sm border border-slate-100">
              <p className="text-4xl font-bold text-blue-600">1.2k+</p>
              <p className="mt-2 text-sm font-medium text-slate-500">
                Cas validés
              </p>
            </div>
            <div className="p-6 bg-white rounded-2xl shadow-sm border border-slate-100">
              <p className="text-4xl font-bold text-cyan-600">45</p>
              <p className="mt-2 text-sm font-medium text-slate-500">
                Modules de cours
              </p>
            </div>
            <div className="p-6 bg-white rounded-2xl shadow-sm border border-slate-100">
              <p className="text-4xl font-bold text-teal-600">12</p>
              <p className="mt-2 text-sm font-medium text-slate-500">
                Spécialités
              </p>
            </div>
            <div className="p-6 bg-white rounded-2xl shadow-sm border border-slate-100">
              <p className="text-4xl font-bold text-indigo-600">5k+</p>
              <p className="mt-2 text-sm font-medium text-slate-500">
                Utilisateurs
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Recent courses */}
      <section
        className="py-16 bg-white"
        aria-labelledby="recent-courses-title"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-end gap-4 mb-8">
            <div>
              <h2
                id="recent-courses-title"
                className="text-3xl font-bold text-slate-900 tracking-tight"
              >
                Cours récemment ajoutés
              </h2>
              <p className="mt-2 text-slate-600">
                Découvrez les derniers cours disponibles dans l’Academy.
              </p>
            </div>
            <Link
              to="/academy"
              className="inline-flex items-center text-blue-600 hover:text-blue-700 font-medium shrink-0"
            >
              Voir tous les cours{" "}
              <ArrowRight className="ml-1 h-4 w-4" aria-hidden="true" />
            </Link>
          </div>
          {loading ? (
            <div role="status" className="py-12 text-center text-slate-500">
              Chargement des cours récents…
            </div>
          ) : error ? (
            <div className="py-12 text-center">
              <p role="alert" className="text-red-600">
                {error}
              </p>
              <Button
                variant="outline"
                className="mt-4"
                onClick={() => setRetry((value) => value + 1)}
              >
                Réessayer
              </Button>
            </div>
          ) : recentCourses.length === 0 ? (
            <div className="py-12 text-center text-slate-500">
              Aucun cours disponible pour le moment. Les prochains cours
              apparaîtront ici.
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {recentCourses.map((course) => (
                <Link
                  key={course.id}
                  to={`/academy/courses/${course.id}`}
                  className="group block rounded-2xl focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-sky-600"
                >
                  <Card className="h-full flex flex-col overflow-hidden transition-all duration-200 group-hover:shadow-md group-hover:border-blue-200">
                    <div className="relative aspect-[4/3] w-full overflow-hidden bg-slate-100">
                      {course.imagePath ? (
                        <img
                          src={mediaUrl(course.imagePath)}
                          alt=""
                          loading="lazy"
                          className="absolute inset-0 h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                        />
                      ) : (
                        <div className="flex h-full items-center justify-center text-sky-300">
                          <BookOpen size={48} aria-hidden="true" />
                        </div>
                      )}
                    </div>
                    <CardContent className="flex flex-col flex-grow p-5 space-y-3">
                      <span className="text-sm font-medium text-blue-600">
                        {course.specialty.name}
                      </span>
                      <h3 className="text-lg font-bold text-slate-900 line-clamp-2 group-hover:text-blue-600 transition-colors">
                        {course.title}
                      </h3>
                      <p className="text-sm text-slate-500">
                        {course.authorName} · {course.institution}
                      </p>
                      <span className="mt-auto pt-4 inline-flex gap-2 items-center text-sm font-semibold text-sky-600">
                        Consulter le cours{" "}
                        <ArrowRight size={16} aria-hidden="true" />
                      </span>
                    </CardContent>
                  </Card>
                </Link>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Radio-Anatomie Interactive Section */}
      <section className="py-16 bg-gradient-to-r from-sky-900 to-indigo-950 text-white relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(14,165,233,0.15),transparent_40%)]" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="lg:flex lg:items-center lg:justify-between gap-12">
            <div className="max-w-2xl">
              <Badge className="mb-4 bg-sky-500/20 text-sky-300 hover:bg-sky-500/20 border border-sky-500/30 font-bold uppercase text-[10px] tracking-widest px-3 py-1">
                MODULE D'ENTRAÎNEMENT INTERACTIF
              </Badge>
              <h2 className="text-3xl font-extrabold tracking-tight sm:text-4xl">
                Maîtrisez la Radio-Anatomie
              </h2>
              <p className="mt-4 text-slate-300 text-lg leading-relaxed">
                Apprenez à repérer et identifier avec précision les structures
                clés en Radiographie, TDM et IRM grâce à notre atlas interactif.
                Testez vos connaissances instantanément avec notre module
                d'évaluation par quiz.
              </p>
              <div className="mt-8 flex flex-wrap gap-4">
                <Button
                  size="lg"
                  disabled
                  className="bg-sky-500/50 cursor-not-allowed text-white"
                >
                  Bientôt disponible
                </Button>
              </div>
            </div>

            <div className="mt-12 lg:mt-0 flex-shrink-0 flex justify-center">
              <div className="bg-slate-900/40 backdrop-blur-md p-6 rounded-3xl border border-white/10 shadow-xl max-w-sm flex items-center gap-4">
                <div className="p-4 rounded-2xl bg-sky-500/10 text-sky-400 border border-sky-500/20 shrink-0">
                  <Brain className="h-10 w-10 animate-pulse" />
                </div>
                <div>
                  <h4 className="font-bold text-white text-base">
                    Apprentissage pratique
                  </h4>
                  <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                    Repères validés par notre conseil d'experts radiologiques
                    avec des fiches cliniques détaillées de garde.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="py-16 lg:py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold text-slate-900 tracking-tight mb-12">
            Pourquoi utiliser E-Radiologie ?
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
            <div className="flex flex-col items-center">
              <div className="h-16 w-16 bg-blue-100 text-blue-600 rounded-2xl flex items-center justify-center mb-6">
                <ShieldCheck className="h-8 w-8" />
              </div>
              <h3 className="text-xl font-semibold mb-3">Contenu Validé</h3>
              <p className="text-slate-600">
                Tous les cas sont examinés et certifiés par un comité de
                radiologues experts avant publication.
              </p>
            </div>
            <div className="flex flex-col items-center">
              <div className="h-16 w-16 bg-cyan-100 text-cyan-600 rounded-2xl flex items-center justify-center mb-6">
                <BookOpen className="h-8 w-8" />
              </div>
              <h3 className="text-xl font-semibold mb-3">
                Apprentissage Structuré
              </h3>
              <p className="text-slate-600">
                Progressez pas à pas grâce à nos modules de cours et analysez
                des cas du débutant à l'expert.
              </p>
            </div>
            <div className="flex flex-col items-center">
              <div className="h-16 w-16 bg-teal-100 text-teal-600 rounded-2xl flex items-center justify-center mb-6">
                <Users className="h-8 w-8" />
              </div>
              <h3 className="text-xl font-semibold mb-3">Communauté</h3>
              <p className="text-slate-600">
                Échangez, débattez et posez vos questions directement sur les
                cas cliniques avec vos pairs.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
