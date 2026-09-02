import { Search, LogOut, Award, Clock } from 'lucide-react';
import { mockUserStats, mockCases } from '../data/mockData';
import { Card, CardContent } from '../components/ui/Card';
import { Button } from '../components/ui/Button';

export function Dashboard() {
  return (
    <div className="bg-slate-50 min-h-screen py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
          <div>
            <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">Bonjour, Dr BOUMERTA</h1>
            <p className="mt-1 text-slate-600">Voici un résumé de votre activité et de votre progression.</p>
          </div>
          <Button variant="outline" className="self-start md:self-auto text-slate-600">
            <LogOut className="mr-2 h-4 w-4" />
            Déconnexion
          </Button>
        </div>

        {/* Global Progress */}
        <Card className="mb-8 border-slate-200">
           <CardContent className="p-6">
              <div className="flex flex-col md:flex-row items-center justify-between gap-6">
                 <div className="flex items-center gap-4 w-full md:w-auto">
                    <div className="h-16 w-16 bg-blue-100 rounded-full flex items-center justify-center shrink-0">
                       <Award className="h-8 w-8 text-blue-600" />
                    </div>
                    <div>
                       <h2 className="text-xl font-bold text-slate-900">Niveau : Intermédiaire</h2>
                       <p className="text-slate-500 text-sm">Continuez à valider des modules pour passer au niveau Expert.</p>
                    </div>
                 </div>
                 <div className="w-full md:w-1/3">
                    <div className="flex justify-between text-sm font-medium mb-2">
                       <span className="text-slate-700">Progression globale</span>
                       <span className="text-blue-600">{mockUserStats.globalProgress}%</span>
                    </div>
                    <div className="w-full bg-slate-100 rounded-full h-3">
                       <div className="bg-blue-600 h-3 rounded-full" style={{ width: `${mockUserStats.globalProgress}%` }}></div>
                    </div>
                 </div>
              </div>
           </CardContent>
        </Card>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardContent className="p-6 flex items-center gap-4">
              <div className="p-3 bg-indigo-50 text-indigo-600 rounded-xl">
                <Search className="h-6 w-6" />
              </div>
              <div>
                 <p className="text-2xl font-bold text-slate-900">{mockUserStats.casesViewed}</p>
                 <p className="text-sm text-slate-500 font-medium">Cas consultés</p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Recent Activity */}
        <h2 className="text-xl font-bold text-slate-900 mb-4">Reprendre l'apprentissage</h2>
        <div className="grid grid-cols-1 gap-6">
           <Card className="border-slate-200">
              <div className="p-5 border-b border-slate-100 flex items-center justify-between">
                 <h3 className="font-semibold text-slate-800 flex items-center gap-2">
                    <Clock className="w-5 h-5 text-slate-400" /> Cas récents
                 </h3>
                 <Button variant="ghost" size="sm" className="text-blue-600">Voir tout</Button>
              </div>
              <div className="divide-y divide-slate-100">
                 {mockCases.slice(2, 5).map(c => (
                    <div key={c.id} className="p-4 flex items-center gap-4 hover:bg-slate-50 transition-colors">
                       <img src={c.previewImage} alt="" className="w-16 h-16 rounded-lg object-cover" />
                       <div className="flex-1">
                          <p className="font-medium text-slate-900 line-clamp-1">{c.title}</p>
                          <p className="text-sm text-slate-500">{c.specialty} • {c.modality}</p>
                       </div>
                       <Button variant="outline" size="sm">Consulter</Button>
                    </div>
                 ))}
              </div>
           </Card>
        </div>

      </div>
    </div>
  );
}
