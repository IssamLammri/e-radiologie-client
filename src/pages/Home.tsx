import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowRight, Search, ShieldCheck, Users, Brain, BookOpen } from 'lucide-react';
import { Button } from '../components/ui/Button';
import { Card, CardContent } from '../components/ui/Card';
import { Badge } from '../components/ui/Badge';
import { ApiCaseItem } from '../types';
import { useAuth } from '../contexts/AuthContext';

export function Home() {
  const [recentCases, setRecentCases] = useState<ApiCaseItem[]>([]);
  const [loading, setLoading] = useState(true);
  const { isAuthenticated, setShowAuthModal } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchRecentCases = async () => {
      try {
        const baseUrl = import.meta.env.VITE_API_BASE_URL || 'http://api.e-radiologie.com';
        const response = await fetch(`${baseUrl}/api/cases/recent`);
        if (!response.ok) throw new Error('Erreur de réseau');
        const data = await response.json();
        setRecentCases(data.items || []);
      } catch (error) {
        console.error("Erreur de chargement des cas récents:", error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchRecentCases();
  }, []);

  const handleCasesClick = (e: React.MouseEvent, target: string) => {
    e.preventDefault();
    if (isAuthenticated) {
      navigate(target);
    } else {
      setShowAuthModal(true);
    }
  };

  return (
    <div className="flex flex-col">
      {/* Hero Section */}
      <section className="relative bg-white pt-16 pb-20 lg:pt-24 lg:pb-32 overflow-hidden border-b border-slate-200">
        <div className="absolute inset-x-0 top-0 h-96 bg-gradient-to-b from-blue-50/50" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <Badge className="mb-6 bg-blue-100 text-blue-800 hover:bg-blue-100">
            Nouveau : Module d'Urgences Thoraciques
          </Badge>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold tracking-tight text-slate-900 max-w-4xl mx-auto">
            L'excellence en imagerie médicale, <br className="hidden md:block" />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-cyan-500">
               accessible à tous.
            </span>
          </h1>
          <p className="mt-6 text-xl text-slate-600 max-w-2xl mx-auto">
            Apprenez la radiologie à travers des cas cliniques réels, des cours structurés et une bibliothèque collaborative d'imagerie médicale destinée aux professionnels de santé.
          </p>
          <div className="mt-10 flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" className="w-full sm:w-auto text-base" onClick={(e) => handleCasesClick(e, '/cases')}>
              Explorer les cas cliniques
              <Search className="ml-2 h-4 w-4" />
            </Button>
            <Button size="lg" variant="outline" className="w-full sm:w-auto text-base" onClick={(e) => handleCasesClick(e, '/submit')}>
              Déposer un cas
            </Button>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-12 bg-slate-50 border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 text-center">
            <div className="p-6 bg-white rounded-2xl shadow-sm border border-slate-100">
              <p className="text-4xl font-bold text-blue-600">1.2k+</p>
              <p className="mt-2 text-sm font-medium text-slate-500">Cas validés</p>
            </div>
            <div className="p-6 bg-white rounded-2xl shadow-sm border border-slate-100">
              <p className="text-4xl font-bold text-cyan-600">45</p>
              <p className="mt-2 text-sm font-medium text-slate-500">Modules de cours</p>
            </div>
            <div className="p-6 bg-white rounded-2xl shadow-sm border border-slate-100">
              <p className="text-4xl font-bold text-teal-600">12</p>
              <p className="mt-2 text-sm font-medium text-slate-500">Spécialités</p>
            </div>
            <div className="p-6 bg-white rounded-2xl shadow-sm border border-slate-100">
              <p className="text-4xl font-bold text-indigo-600">5k+</p>
              <p className="mt-2 text-sm font-medium text-slate-500">Utilisateurs</p>
            </div>
          </div>
        </div>
      </section>

      {/* Recent Cases */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-end mb-8">
            <div>
              <h2 className="text-3xl font-bold text-slate-900 tracking-tight">Cas Récents</h2>
              <p className="mt-2 text-slate-600">Découvrez les derniers cas cliniques validés par le comité.</p>
            </div>
            <button onClick={(e) => handleCasesClick(e, '/cases')} className="hidden md:flex items-center text-blue-600 hover:text-blue-700 font-medium cursor-pointer">
              Voir tout <ArrowRight className="ml-1 h-4 w-4" />
            </button>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {loading ? (
              <div className="col-span-full py-12 text-center text-slate-500">
                Chargement des cas récents...
              </div>
            ) : recentCases.length === 0 ? (
              <div className="col-span-full py-12 text-center text-slate-500">
                Aucun cas récent disponible.
              </div>
            ) : recentCases.slice(0, 3).map((item) => (
              <div key={item.id} onClick={(e) => handleCasesClick(e, `/cases/${item.slug}`)} className="group relative block w-full outline-none cursor-pointer">
                <Card className="h-full flex flex-col overflow-hidden transition-all duration-200 group-hover:shadow-md group-hover:border-blue-200">
                  <div className="relative aspect-[4/3] w-full overflow-hidden bg-slate-100">
                    <img 
                      src={item.primaryMedia?.path || ''} 
                      alt={item.title} 
                      className="absolute inset-0 h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                    />
                    <div className="absolute top-3 right-3 flex gap-2">
                       <Badge className="bg-white/90 text-slate-900 backdrop-blur-sm shadow-sm">{item.modality.name}</Badge>
                    </div>
                  </div>
                  <CardContent className="flex flex-col flex-grow p-5 space-y-3">
                    <div className="flex items-center justify-between">
                       <span className="text-sm font-medium text-blue-600">{item.category.name}</span>
                       <span className="text-xs text-slate-500">{new Date(item.publishedAt).toLocaleDateString()}</span>
                    </div>
                    <h3 className="text-lg font-bold text-slate-900 line-clamp-2 group-hover:text-blue-600 transition-colors">
                      {item.title}
                    </h3>
                    <div className="mt-auto pt-4 flex gap-2 items-center">
                       <Badge variant="secondary" className="text-xs">
                         {item.difficulty.label}
                       </Badge>
                       <span className="text-xs text-slate-500 flex-1 truncate">Par {item.author.displayName}</span>
                    </div>
                  </CardContent>
                </Card>
              </div>
            ))}
          </div>
          <div className="mt-8 text-center md:hidden">
             <Button variant="outline" className="w-full" onClick={(e) => handleCasesClick(e, '/cases')}>Voir tous les cas</Button>
          </div>
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
                Apprenez à repérer et identifier avec précision les structures clés en Radiographie, TDM et IRM grâce à notre atlas interactif. Testez vos connaissances instantanément avec notre module d'évaluation par quiz.
              </p>
              <div className="mt-8 flex flex-wrap gap-4">
                <Button size="lg" disabled className="bg-sky-500/50 cursor-not-allowed text-white">
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
                  <h4 className="font-bold text-white text-base">Apprentissage pratique</h4>
                  <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                    Repères validés par notre conseil d'experts radiologiques avec des fiches cliniques détaillées de garde.
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
           <h2 className="text-3xl font-bold text-slate-900 tracking-tight mb-12">Pourquoi utiliser E-Radiologie ?</h2>
           <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
              <div className="flex flex-col items-center">
                 <div className="h-16 w-16 bg-blue-100 text-blue-600 rounded-2xl flex items-center justify-center mb-6">
                    <ShieldCheck className="h-8 w-8" />
                 </div>
                 <h3 className="text-xl font-semibold mb-3">Contenu Validé</h3>
                 <p className="text-slate-600">Tous les cas sont examinés et certifiés par un comité de radiologues experts avant publication.</p>
              </div>
              <div className="flex flex-col items-center">
                 <div className="h-16 w-16 bg-cyan-100 text-cyan-600 rounded-2xl flex items-center justify-center mb-6">
                    <BookOpen className="h-8 w-8" />
                 </div>
                 <h3 className="text-xl font-semibold mb-3">Apprentissage Structuré</h3>
                 <p className="text-slate-600">Progressez pas à pas grâce à nos modules de cours et analysez des cas du débutant à l'expert.</p>
              </div>
              <div className="flex flex-col items-center">
                 <div className="h-16 w-16 bg-teal-100 text-teal-600 rounded-2xl flex items-center justify-center mb-6">
                    <Users className="h-8 w-8" />
                 </div>
                 <h3 className="text-xl font-semibold mb-3">Communauté</h3>
                 <p className="text-slate-600">Échangez, débattez et posez vos questions directement sur les cas cliniques avec vos pairs.</p>
              </div>
           </div>
        </div>
      </section>
    </div>
  );
}
