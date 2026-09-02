import { useState } from 'react';
import { X, Mail, Lock, Loader2, ArrowRight } from 'lucide-react';
import { Button } from '../ui/Button';
import { useAuth } from '../../contexts/AuthContext';
import { Input } from '../ui/Input';

type AuthMode = 'login' | 'register' | 'forgot_password';

export function AuthModal() {
  const { showAuthModal, setShowAuthModal, login } = useAuth();
  const [mode, setMode] = useState<AuthMode>('login');
  
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  if (!showAuthModal) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccessMsg('');

    const baseUrl = import.meta.env.VITE_API_BASE_URL || 'http://api.e-radiologie.com';

    try {
      if (mode === 'login') {
        const response = await fetch(`${baseUrl}/api/login_check`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email, password })
        });
        
        if (!response.ok) throw new Error('Email ou mot de passe incorrect');
        
        const data = await response.json();
        if (data.token) {
          await login(data.token);
          setShowAuthModal(false);
        }
      } else if (mode === 'forgot_password') {
        const response = await fetch(`${baseUrl}/api/auth/forgot-password`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email })
        });
        
        if (!response.ok) throw new Error('Une erreur est survenue');
        setSuccessMsg('Si cette adresse existe, un email de réinitialisation a été envoyé.');
      } else if (mode === 'register') {
        // Register is not specified in the api endpoints, we will show a placeholder or message
        setError("La création de compte n'est pas encore disponible publiquement.");
      }
    } catch (err: any) {
      setError(err.message || 'Une erreur est survenue');
    } finally {
      setLoading(false);
    }
  };

  const closeModal = () => {
    setShowAuthModal(false);
    setMode('login');
    setEmail('');
    setPassword('');
    setError('');
    setSuccessMsg('');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-md overflow-hidden relative animate-in fade-in zoom-in duration-200">
        <button 
          onClick={closeModal}
          className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 transition-colors"
        >
          <X className="h-5 w-5" />
        </button>
        
        <div className="p-8">
          <h2 className="text-2xl font-bold text-slate-900 mb-2">
            {mode === 'login' ? 'Connexion' : 
             mode === 'register' ? 'Créer un compte' : 
             'Mot de passe oublié'}
          </h2>
          <p className="text-slate-500 mb-6 text-sm">
            {mode === 'login' ? 'Accédez à votre espace E-Radiologie' : 
             mode === 'register' ? 'Rejoignez la communauté E-Radiologie' : 
             'Entrez votre email pour réinitialiser votre mot de passe'}
          </p>

          <form onSubmit={handleSubmit} className="space-y-4">
            {error && <div className="p-3 bg-red-50 text-red-600 text-sm rounded-lg border border-red-100">{error}</div>}
            {successMsg && <div className="p-3 bg-emerald-50 text-emerald-600 text-sm rounded-lg border border-emerald-100">{successMsg}</div>}

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Email</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Mail className="h-4 w-4 text-slate-400" />
                </div>
                <Input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="pl-10"
                  placeholder="votre@email.com"
                  required
                />
              </div>
            </div>

            {mode !== 'forgot_password' && (
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Mot de passe</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Lock className="h-4 w-4 text-slate-400" />
                  </div>
                  <Input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="pl-10"
                    placeholder="••••••••"
                    required
                  />
                </div>
                {mode === 'login' && (
                  <div className="flex justify-end mt-1">
                    <button 
                      type="button" 
                      onClick={() => setMode('forgot_password')}
                      className="text-xs text-blue-600 hover:text-blue-700"
                    >
                      Mot de passe oublié ?
                    </button>
                  </div>
                )}
              </div>
            )}

            <Button type="submit" className="w-full bg-blue-600 hover:bg-blue-700" disabled={loading}>
              {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : 
               mode === 'login' ? 'Se connecter' : 
               mode === 'register' ? 'Créer mon compte' : 
               'Réinitialiser le mot de passe'}
            </Button>
          </form>

          <div className="mt-6 text-center text-sm text-slate-500">
            {mode === 'login' ? (
              <>
                Pas encore de compte ?{' '}
                <button type="button" onClick={() => setMode('register')} className="text-blue-600 hover:text-blue-700 font-medium">
                  Créer un compte
                </button>
              </>
            ) : (
              <>
                Vous avez déjà un compte ?{' '}
                <button type="button" onClick={() => setMode('login')} className="text-blue-600 hover:text-blue-700 font-medium">
                  Se connecter
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
