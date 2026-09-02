import { useParams, Link } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { 
  ArrowLeft, ZoomIn, Info, CheckCircle2,
  Brain, Check, Edit3 
} from 'lucide-react';
import { Badge } from '../components/ui/Badge';
import { Button } from '../components/ui/Button';
import { Card, CardContent } from '../components/ui/Card';
import { ApiCaseDetail } from '../types';

export function CaseDetail() {
  const { id: slug } = useParams(); // Using id from router, but treating it as slug
  const [caseData, setCaseData] = useState<ApiCaseDetail | null>(null);
  const [loading, setLoading] = useState(true);
  
  const [userDraft, setUserDraft] = useState('');
  const [showExpertDescription, setShowExpertDescription] = useState(false);

  useEffect(() => {
    const fetchCase = async () => {
      try {
        const baseUrl = import.meta.env.VITE_API_BASE_URL || 'http://api.e-radiologie.com';
        const response = await fetch(`${baseUrl}/api/cases/${slug}`);
        if (!response.ok) throw new Error('Erreur de chargement');
        const data = await response.json();
        setCaseData(data);
      } catch (error) {
        console.error("Erreur:", error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchCase();
  }, [slug]);

  if (loading) {
    return <div className="p-12 text-center text-slate-500">Chargement des détails du cas...</div>;
  }

  if (!caseData) {
    return <div className="p-8 text-center">Cas non trouvé.</div>;
  }

  const primaryImage = caseData.media?.find(m => m.isPrimary)?.path || caseData.media?.[0]?.path;

  return (
    <div className="bg-slate-50 min-h-screen pb-20">
      {/* Header Bar */}
      <header className="bg-white border-b border-slate-200 sticky top-16 z-40 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
           <div className="flex items-center gap-4">
              <Link to="/cases" className="text-slate-400 hover:text-slate-900 transition-colors">
                <ArrowLeft className="h-5 w-5" />
              </Link>
              <h1 className="text-xl font-bold text-slate-900 line-clamp-1">{caseData.title}</h1>
           </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
           
           {/* Left Column: Images and Visuals (Takes up 2/3) */}
           <div className="lg:col-span-2 space-y-6">
              {/* Image Viewer */}
              {primaryImage && (
                <Card className="overflow-hidden border-slate-200 shadow-sm bg-black group relative">
                  <div className="relative aspect-square md:aspect-[4/3] flex items-center justify-center">
                      <img src={primaryImage} alt="Image médicale" className="max-h-full max-w-full object-contain" />
                      <Button variant="secondary" size="icon" className="absolute bottom-4 right-4 rounded-full bg-white/10 hover:bg-white/20 text-white border-white/20 backdrop-blur-md">
                        <ZoomIn className="h-5 w-5" />
                      </Button>
                  </div>
                </Card>
              )}

              {/* Diagnosis & Discussion Panel */}
              <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6 space-y-8">
                 
                 {/* Drafting Workspace */}
                 <section className="bg-gradient-to-br from-indigo-50 to-slate-50 border border-slate-200 rounded-xl p-5 sm:p-6 space-y-4">
                    <div className="flex items-center gap-2">
                       <div className="p-1 px-2.5 bg-indigo-600 text-white rounded-lg text-xs font-bold font-mono tracking-wider">ENTRAÎNEMENT</div>
                       <h3 className="text-base font-bold text-slate-900 flex items-center gap-1.5">
                          <Edit3 className="h-4 w-4 text-indigo-600" />
                          Rédaction Radiologique Libre
                       </h3>
                    </div>
                    <p className="text-sm text-slate-600 leading-relaxed text-left">
                       {caseData.trainingInstruction || "Examinez attentivement le cas et l'imagerie ci-dessus. Essayez de rédiger votre propre description d'interprétation en formant de courtes phrases simples et descriptives."}
                    </p>

                    <div className="space-y-3">
                       <textarea
                          value={userDraft}
                          onChange={(e) => setUserDraft(e.target.value)}
                          placeholder={caseData.trainingPlaceholder || "Exemple : Volumineuse opacité homogène systématisée du lobe supérieur droit..."}
                          rows={4}
                          className="w-full text-sm bg-white border border-slate-200 rounded-xl p-3.5 focus:border-indigo-600 focus:ring-1 focus:ring-indigo-600 outline-none shadow-sm font-sans placeholder:text-slate-400"
                       />
                       <div className="flex justify-between items-center">
                          <span className="text-xs text-slate-400 font-mono">
                             {userDraft.trim().split(/\s+/).filter(Boolean).length} mots saisis
                          </span>
                       </div>
                    </div>
                  </section>

                  {/* Complete Expert Description */}
                  <section className="border border-slate-200 rounded-xl p-5 sm:p-6 bg-white space-y-4">
                     <div className="flex items-center justify-between border-b pb-2 mb-2">
                        <h2 className="text-base font-bold flex items-center gap-2 text-slate-800">
                           <Info className="h-5 w-5 text-emerald-600" />
                           Description complète proposée par l'auteur
                        </h2>
                        {!showExpertDescription && (
                           <Button
                              variant="outline"
                              size="sm"
                              onClick={() => setShowExpertDescription(true)}
                              className="text-xs text-indigo-600 border-indigo-200 hover:bg-indigo-50/50 cursor-pointer"
                           >
                              Révéler la description
                           </Button>
                        )}
                     </div>

                     {showExpertDescription ? (
                        <div className="space-y-3 animate-fade-in text-left">
                           <p className="text-slate-705 leading-relaxed text-sm bg-slate-50/80 p-4 rounded-xl border border-slate-100 shadow-inner">
                              {caseData.expertDescription}
                           </p>
                           <p className="text-[10px] font-bold text-slate-400">
                              * Cette description de référence est validée par l'expert d'admission.
                           </p>
                        </div>
                     ) : (
                        <div className="py-6 text-center border-2 border-dashed border-slate-100 rounded-xl">
                           <p className="text-xs text-slate-400 italic">
                              Rédigez votre brouillon ci-dessus ou cliquez sur "Révéler" pour comparer vos notes.
                           </p>
                        </div>
                     )}
                  </section>

                  <section>
                     <h2 className="text-lg font-bold border-b border-slate-100 pb-2 mb-4 flex items-center gap-2">
                        <CheckCircle2 className="h-5 w-5 text-emerald-600" /> Diagnostic Retenu
                     </h2>
                     <div className="p-4 bg-emerald-50 border border-emerald-100 text-emerald-900 rounded-lg font-semibold text-lg text-left">
                        {caseData.diagnosis}
                     </div>
                  </section>

                  <section>
                     <h2 className="text-lg font-bold border-b border-slate-100 pb-2 mb-4 text-left">Discussion Globale</h2>
                     <p className="text-slate-700 leading-relaxed text-sm text-left">{caseData.globalDiscussion}</p>
                  </section>
               </div>

           </div>

           {/* Right Column: Metadata and Details (Takes up 1/3) */}
           <div className="space-y-6">
              
              {/* Context Card */}
              <Card className="shadow-sm">
                 <CardContent className="p-6 space-y-4">
                    <div className="flex flex-wrap gap-2 mb-4">
                       <Badge>{caseData.modality?.name}</Badge>
                       <Badge variant="secondary">{caseData.category?.name}</Badge>
                       <Badge variant="outline">{caseData.difficulty?.label}</Badge>
                    </div>

                    <div className="space-y-3 pt-2">
                       <div>
                          <p className="text-xs text-slate-500 font-semibold uppercase tracking-wider">Patient</p>
                          <p className="text-sm font-medium text-slate-900">
                             {caseData.patientGender?.label}, {caseData.patientAge} ans
                          </p>
                       </div>
                       <div>
                          <p className="text-xs text-slate-500 font-semibold uppercase tracking-wider">Histoire Clinique</p>
                          <p className="text-sm text-slate-700 mt-1 pb-2 border-b border-slate-100">{caseData.clinicalContext}</p>
                       </div>
                    </div>
                 </CardContent>
              </Card>

              {/* Author & References */}
              <Card className="shadow-sm bg-slate-50">
                 <CardContent className="p-5">
                    <p className="text-sm text-slate-500 mb-1">Auteur du cas</p>
                    <p className="font-semibold text-slate-900">{caseData.author?.displayName}</p>
                    <p className="text-xs text-slate-400 mt-1">Publié le {new Date(caseData.publishedAt).toLocaleDateString()}</p>
                    
                    {caseData.references && caseData.references.length > 0 && (
                       <div className="mt-4 pt-4 border-t border-slate-200">
                          <p className="text-xs text-slate-500 font-semibold uppercase">Références</p>
                          {caseData.references.map((ref, idx) => (
                             <p key={idx} className="text-xs text-slate-600 mt-1 italic">
                                {ref.title} {ref.source ? `(${ref.source})` : ''}
                             </p>
                          ))}
                       </div>
                    )}
                 </CardContent>
              </Card>

           </div>
        </div>
      </div>
    </div>
  );
}
