import { UploadCloud, AlertTriangle } from "lucide-react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../components/ui/Card";
import { Button } from "../components/ui/Button";
import { Input } from "../components/ui/Input";

export function SubmitCase() {
  return (
    <div className="bg-slate-50 min-h-screen py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">
            Déposer un cas clinique
          </h1>
          <p className="mt-2 text-slate-600 text-lg">
            Partagez votre expertise avec la communauté. Votre cas sera relu par
            notre comité scientifique.
          </p>
        </div>

        <div className="bg-amber-50 border-l-4 border-amber-500 p-4 mb-8 rounded-r-md flex items-start gap-4">
          <AlertTriangle className="h-6 w-6 text-amber-500 shrink-0" />
          <div>
            <h3 className="text-amber-800 font-bold">
              Anonymisation stricte requise
            </h3>
            <p className="text-amber-700 text-sm mt-1">
              Vous êtes responsable de l'anonymisation des données. Assurez-vous
              de supprimer tout nom, date de naissance, identifiant
              d'établissement ou toute autre donnée permettant d'identifier le
              patient sur les images avant l'upload.
            </p>
          </div>
        </div>

        <form className="space-y-8">
          {/* Section 1: Images */}
          <Card className="border-slate-200">
            <CardHeader className="bg-slate-50/50 border-b border-slate-100 pb-4">
              <CardTitle className="text-lg">Images Médicales</CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              <div className="border-2 border-dashed border-slate-300 rounded-xl p-10 flex flex-col items-center justify-center bg-slate-50 hover:bg-slate-100 transition-colors cursor-pointer">
                <UploadCloud className="h-10 w-10 text-slate-400 mb-4" />
                <p className="font-semibold text-slate-900 mb-1">
                  Cliquez ou glissez-déposez vos images ici
                </p>
                <p className="text-sm text-slate-500">
                  DICOM, JPEG, PNG acceptés (Max 50MB)
                </p>
                <Button type="button" variant="secondary" className="mt-6">
                  Parcourir les fichiers
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Section 2: Patient Context */}
          <Card className="border-slate-200">
            <CardHeader className="bg-slate-50/50 border-b border-slate-100 pb-4">
              <CardTitle className="text-lg">Contexte Clinique</CardTitle>
            </CardHeader>
            <CardContent className="p-6 space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-slate-900">
                    Âge du patient
                  </label>
                  <Input placeholder="Ex: 45 ans" />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-slate-900">
                    Sexe
                  </label>
                  <select className="flex h-10 w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2">
                    <option>Sélectionner...</option>
                    <option>Homme</option>
                    <option>Femme</option>
                  </select>
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-semibold text-slate-900">
                  Histoire de la maladie
                </label>
                <textarea
                  className="flex w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2 min-h-[100px]"
                  placeholder="Décrivez les antécédents, l'histoire de la maladie et l'examen clinique..."
                ></textarea>
              </div>
            </CardContent>
          </Card>

          {/* Section 3: Diagnostic */}
          <Card className="border-slate-200">
            <CardHeader className="bg-slate-50/50 border-b border-slate-100 pb-4">
              <CardTitle className="text-lg">
                Diagnostic et Discussion
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6 space-y-6">
              <div className="space-y-2">
                <label className="text-sm font-semibold text-slate-900">
                  Titre du cas
                </label>
                <Input placeholder="Titre clair et descriptif" />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-slate-900">
                    Spécialité
                  </label>
                  <select className="flex h-10 w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2">
                    <option>Imagerie pédiatrique</option>
                    <option>Neuroradiologie</option>
                    <option>Imagerie ORL et cervico-faciale</option>
                    <option>Imagerie thoracique</option>
                    <option>Imagerie cardiaque et vasculaire</option>
                    <option>Imagerie interventionnelle et vasculaire</option>
                    <option>Imagerie ostéo-articulaire (musculo-squelettique)</option>
                    <option>Imagerie abdominale et digestive</option>
                    <option>Imagerie gynécologique</option>
                    <option>Imagerie urologique</option>
                    <option>Imagerie sénologique</option>
                    <option>Imagerie oncologique</option>
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-slate-900">
                    Modalité
                  </label>
                  <select className="flex h-10 w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2">
                    <option>Radiographie</option>
                    <option>TDM</option>
                    <option>IRM</option>
                    <option>Échographie</option>
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-slate-900">
                    Difficulté
                  </label>
                  <select className="flex h-10 w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2">
                    <option>Débutant</option>
                    <option>Intermédiaire</option>
                    <option>Expert</option>
                  </select>
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-semibold text-slate-900">
                  Diagnostic Retenu
                </label>
                <Input placeholder="Quel est le diagnostic final ?" />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-semibold text-slate-900">
                  Discussion (Optionnel)
                </label>
                <textarea
                  className="flex w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2 min-h-[100px]"
                  placeholder="Partagez des explications, des points à retenir..."
                ></textarea>
              </div>
            </CardContent>
          </Card>

          <div className="flex items-center justify-end gap-4 pt-4 border-t border-slate-200">
            <Button type="button" variant="outline" size="lg">
              Annuler
            </Button>
            <Button type="button" variant="default" size="lg">
              Soumettre pour validation
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
