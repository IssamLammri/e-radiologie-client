import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Search, Filter, SlidersHorizontal, ChevronDown, ChevronUp } from 'lucide-react';
import { Input } from '../components/ui/Input';
import { Button } from '../components/ui/Button';
import { Badge } from '../components/ui/Badge';
import { Card, CardContent } from '../components/ui/Card';
import { mockCases } from '../data/mockData';

export function CasesCatalog() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedModality, setSelectedModality] = useState<string>('Toutes');
  const [selectedSpecialty, setSelectedSpecialty] = useState<string>('Toutes');
  const [showFilters, setShowFilters] = useState(true);
  const [modalitiesOpen, setModalitiesOpen] = useState(false);
  const [specialtiesOpen, setSpecialtiesOpen] = useState(false);
  
  const modalities = ['Toutes', 'Radiographie', 'TDM', 'IRM', 'Échographie'];

  const specialties = [
    'Toutes',
    'Imagerie pédiatrique',
    'Neuroradiologie',
    'Imagerie ORL et cervico-faciale',
    'Imagerie thoracique',
    'Imagerie cardiaque et vasculaire',
    'Imagerie interventionnelle et vasculaire',
    'Imagerie ostéo-articulaire (musculo-squelettique)',
    'Imagerie abdominale et digestive',
    'Imagerie gynécologique',
    'Imagerie urologique',
    'Imagerie sénologique',
    'Imagerie oncologique'
  ];

  const filteredCases = mockCases.filter(c => {
    const matchesSearch = c.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          c.tags.some(t => t.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesModality = selectedModality === 'Toutes' || c.modality === selectedModality;
    const matchesSpecialty = selectedSpecialty === 'Toutes' || c.specialty === selectedSpecialty;
    return matchesSearch && matchesModality && matchesSpecialty;
  });

  return (
    <div className="bg-slate-50 min-h-screen py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header & Search */}
        <div className="mb-8">
          <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">Catalogue de cas cliniques</h1>
          <p className="mt-2 text-slate-600 text-lg">Recherchez et explorez des centaines de diagnostics documentés.</p>
          
          <div className="mt-6 flex flex-col md:flex-row gap-4">
            <div className="relative flex-1">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="h-5 w-5 text-slate-400" />
              </div>
              <Input
                type="text"
                placeholder="Rechercher une pathologie, un organe, un mot-clé..."
                className="pl-10 py-6 text-base"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <Button 
              variant={showFilters ? 'default' : 'outline'} 
              className={`py-6 px-6 gap-2 shrink-0 ${showFilters ? 'bg-blue-600 text-white hover:bg-blue-700' : 'bg-white text-slate-700 hover:bg-slate-50'}`}
              onClick={() => setShowFilters(!showFilters)}
            >
              <SlidersHorizontal className="h-5 w-5" />
              {showFilters ? 'Masquer filtres' : 'Afficher filtres'}
            </Button>
          </div>
          
          {/* Quick Filters Panel */}
          {showFilters && (
            <div id="quick-filters-panel" className="mt-6 bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-4">
              
              {/* Collapsible Imaging Modalities */}
              <div className="border-b border-slate-100 pb-3">
                <button
                  type="button"
                  id="toggle-modalities-btn"
                  onClick={() => setModalitiesOpen(!modalitiesOpen)}
                  className="w-full flex items-center justify-between py-1 group focus:outline-none cursor-pointer"
                >
                  <div className="flex items-center gap-3">
                    <span className="text-xs font-bold text-slate-500 uppercase tracking-widest">
                      Modalités d'imagerie
                    </span>
                    {!modalitiesOpen && (
                      <Badge className="bg-blue-50 text-blue-700 hover:bg-blue-50 font-bold text-[10px] uppercase px-2.5 py-0.5 border-none">
                        Actif : {selectedModality}
                      </Badge>
                    )}
                  </div>
                  <div className="flex items-center gap-1.5 text-xs text-slate-400 group-hover:text-slate-600 transition-colors">
                    <span className="text-[10px] font-medium">{modalitiesOpen ? 'Replier' : 'Déplier'}</span>
                    <ChevronDown className={`h-4 w-4 transform transition-transform duration-200 ${modalitiesOpen ? 'rotate-180' : ''}`} />
                  </div>
                </button>
                
                {modalitiesOpen && (
                  <div className="flex flex-wrap gap-2 mt-3 pt-1 animate-in fade-in duration-200">
                    {modalities.map(mod => (
                      <Badge 
                        key={mod} 
                        variant={selectedModality === mod ? 'default' : 'secondary'}
                        className={`cursor-pointer text-xs py-2 px-4 rounded-full whitespace-nowrap transition-all ${
                          selectedModality === mod 
                            ? 'bg-blue-600 text-white hover:bg-blue-700' 
                            : 'bg-slate-100 text-slate-600 hover:bg-slate-200 border-none'
                        }`}
                        onClick={() => setSelectedModality(mod)}
                      >
                        {mod}
                      </Badge>
                    ))}
                  </div>
                )}
              </div>

              {/* Collapsible Clinical Specialties */}
              <div>
                <button
                  type="button"
                  id="toggle-specialties-btn"
                  onClick={() => setSpecialtiesOpen(!specialtiesOpen)}
                  className="w-full flex items-center justify-between py-1 group focus:outline-none cursor-pointer"
                >
                  <div className="flex items-center gap-3">
                    <span className="text-xs font-bold text-slate-500 uppercase tracking-widest">
                      Spécialités cliniques (12)
                    </span>
                    {!specialtiesOpen && (
                      <Badge className="bg-indigo-50 text-indigo-700 hover:bg-indigo-50 font-bold text-[10px] uppercase px-2.5 py-0.5 border-none truncate max-w-[180px] sm:max-w-none">
                        Actif : {selectedSpecialty}
                      </Badge>
                    )}
                  </div>
                  <div className="flex items-center gap-1.5 text-xs text-slate-400 group-hover:text-slate-600 transition-colors">
                    <span className="text-[10px] font-medium">{specialtiesOpen ? 'Replier' : 'Déplier'}</span>
                    <ChevronDown className={`h-4 w-4 transform transition-transform duration-200 ${specialtiesOpen ? 'rotate-180' : ''}`} />
                  </div>
                </button>
                
                {specialtiesOpen && (
                  <div className="flex flex-wrap gap-2 mt-3 pt-1 animate-in fade-in duration-200">
                    {specialties.map(spec => (
                      <Badge 
                        key={spec} 
                        variant={selectedSpecialty === spec ? 'default' : 'secondary'}
                        className={`cursor-pointer text-xs py-2 px-4 rounded-full whitespace-nowrap transition-all ${
                          selectedSpecialty === spec 
                            ? 'bg-indigo-600 text-white hover:bg-indigo-700' 
                            : 'bg-slate-100 text-slate-600 hover:bg-slate-200 border-none'
                        }`}
                        onClick={() => setSelectedSpecialty(spec)}
                      >
                        {spec}
                      </Badge>
                    ))}
                  </div>
                )}
              </div>

            </div>
          )}
        </div>

        {/* Results Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredCases.map((item) => (
            <Link key={item.id} to={`/cases/${item.id}`} className="group outline-none">
              <Card className="h-full flex flex-col overflow-hidden transition-all duration-200 border-slate-200 hover:shadow-lg hover:border-blue-300">
                <div className="relative aspect-square w-full overflow-hidden bg-black/5">
                  <img 
                    src={item.previewImage} 
                    alt={item.title} 
                    className="absolute inset-0 h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                  <div className="absolute top-3 left-3">
                     <Badge className="bg-white/90 text-slate-900 backdrop-blur-md border border-white/20 font-bold shadow-sm">
                       {item.modality}
                     </Badge>
                  </div>
                  {item.status === 'Vérifié' && (
                    <div className="absolute top-3 right-3">
                       <Badge variant="success" className="bg-emerald-100 text-emerald-800 border-none shadow-sm capitalize">
                         Vérifié
                       </Badge>
                    </div>
                  )}
                </div>
                <CardContent className="flex flex-col flex-grow p-4 gap-3 bg-white">
                  <div className="flex items-center justify-between">
                     <span className="text-xs font-semibold uppercase tracking-wider text-blue-600">{item.specialty}</span>
                     <span className="text-xs font-medium px-2 py-0.5 rounded-sm bg-slate-100 text-slate-600">{item.difficulty}</span>
                  </div>
                  <h3 className="text-base font-bold text-slate-900 leading-tight line-clamp-2">
                    {item.title}
                  </h3>
                  
                  <div className="flex flex-wrap gap-1 mt-1">
                    {item.tags.slice(0,2).map(tag => (
                      <span key={tag} className="text-[10px] bg-slate-50 border border-slate-200 text-slate-500 px-1.5 py-0.5 rounded">#{tag}</span>
                    ))}
                  </div>

                  <div className="mt-auto pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
                     <span>{item.author}</span>
                     <span>{new Date(item.date).toLocaleDateString()}</span>
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
          
          {filteredCases.length === 0 && (
             <div className="col-span-full py-20 text-center text-slate-500">
                <Search className="h-12 w-12 mx-auto text-slate-300 mb-4" />
                <p className="text-lg">Aucun cas ne correspond à votre recherche.</p>
                <Button variant="link" onClick={() => {setSearchTerm(''); setSelectedModality('Toutes'); setSelectedSpecialty('Toutes');}} className="mt-2 text-blue-600">Réinitialiser les filtres</Button>
             </div>
          )}
        </div>
      </div>
    </div>
  );
}
