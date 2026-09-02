import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom';
import { Activity, BookOpen, LayoutDashboard, Search, UploadCloud, UserCircle, Menu, X, Heart, Award, FileText, Brain, ClipboardList, LogOut } from 'lucide-react';
import { useState } from 'react';
import { cn } from '../../lib/utils';
import { Button } from '../ui/Button';
import { useAuth } from '../../contexts/AuthContext';
import { AuthModal } from '../auth/AuthModal';

export function Layout() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { isAuthenticated, user, logout, setShowAuthModal } = useAuth();

  const navigation = [
    { name: 'Accueil', href: '/', icon: Activity },
    ...(isAuthenticated ? [
      { name: 'Cas Cliniques', href: '/cases', icon: Search },
      { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
    ] : [])
  ];

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      {/* Disclaimer Banner */}
      <div className="bg-amber-100 text-amber-900 border-b border-amber-200 text-xs py-2 text-center px-4">
        <strong>Avertissement :</strong> Cette plateforme est destinée à la formation médicale (professionnels et étudiants). Les cas présentés ne remplacent pas un avis médical. Toutes les données patients sont strictement anonymisées.
      </div>

      {/* Navigation */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <Link to="/" className="flex items-center space-x-2">
                <div className="bg-sky-600 w-10 h-10 rounded-lg flex items-center justify-center">
                  <Activity className="h-6 w-6 text-white" />
                </div>
                <span className="text-xl font-bold text-slate-900 tracking-tight">E-Radiologie</span>
              </Link>
            </div>

            {/* Desktop Nav */}
            <nav className="hidden lg:flex items-center justify-center space-x-0.5 xl:space-x-1 overflow-x-auto">
              {navigation.map((item) => {
                const isActive = location.pathname === item.href || (item.href !== '/' && location.pathname.startsWith(item.href));
                return (
                  <Link
                    key={item.name}
                    to={item.href}
                    className={cn(
                      "px-2.5 py-2 rounded-xl text-xs xl:text-sm font-medium transition-colors flex items-center space-x-1.5 whitespace-nowrap",
                      isActive
                        ? "bg-sky-50 text-sky-600 font-bold"
                        : "text-slate-500 hover:bg-slate-50 hover:text-slate-800"
                    )}
                  >
                    <item.icon className="h-4 w-4 shrink-0" />
                    <span>{item.name}</span>
                  </Link>
                );
              })}
            </nav>

            <div className="hidden md:flex items-center space-x-4">
               {isAuthenticated ? (
                 <div className="flex items-center gap-2">
                   <Link to="/profile">
                     <Button variant="outline" size="sm" className="hidden lg:flex gap-2">
                       <UserCircle className="w-4 h-4" />
                       {user?.firstName} {user?.lastName}
                     </Button>
                   </Link>
                   <Button variant="ghost" size="icon" onClick={handleLogout} className="text-slate-400 hover:text-red-600">
                     <LogOut className="h-4 w-4" />
                   </Button>
                 </div>
               ) : (
                 <Button variant="default" size="sm" className="hidden lg:flex gap-2 bg-sky-600 hover:bg-sky-700" onClick={() => setShowAuthModal(true)}>
                   Se connecter
                 </Button>
               )}
            </div>

            {/* Mobile menu button */}
            <div className="flex items-center md:hidden">
              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="inline-flex items-center justify-center p-2 rounded-xl text-slate-400 hover:text-slate-500 hover:bg-slate-100 focus:outline-none"
              >
                {isMobileMenuOpen ? <X className="block h-6 w-6" /> : <Menu className="block h-6 w-6" />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden border-t border-slate-200 bg-white">
            <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
              {navigation.map((item) => {
                 const isActive = location.pathname === item.href || (item.href !== '/' && location.pathname.startsWith(item.href));
                 return (
                  <Link
                    key={item.name}
                    to={item.href}
                    onClick={() => setIsMobileMenuOpen(false)}
                    className={cn(
                      "block px-4 py-3 rounded-xl text-base font-medium flex items-center space-x-3",
                      isActive ? "bg-sky-50 text-sky-600" : "text-slate-700 hover:bg-slate-50"
                    )}
                  >
                    <item.icon className="h-5 w-5" />
                    <span>{item.name}</span>
                  </Link>
                 )
              })}
              {isAuthenticated && (
                <Link
                  to="/profile"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="block px-4 py-3 rounded-xl text-base font-medium text-slate-500 hover:bg-slate-50 flex items-center gap-3"
                >
                  <UserCircle className="h-5 w-5" />
                  Mon Profil
                </Link>
              )}
              {isAuthenticated ? (
                <button
                  onClick={() => {
                    handleLogout();
                    setIsMobileMenuOpen(false);
                  }}
                  className="w-full text-left px-4 py-3 rounded-xl text-base font-medium text-red-500 hover:bg-red-50"
                >
                  Déconnexion
                </button>
              ) : (
                <button
                  onClick={() => {
                    setShowAuthModal(true);
                    setIsMobileMenuOpen(false);
                  }}
                  className="w-full text-left px-4 py-3 rounded-xl text-base font-medium text-sky-600 hover:bg-sky-50"
                >
                  Se connecter
                </button>
              )}
            </div>
          </div>
        )}
      </header>

      {/* Main Content */}
      <main className="flex-1">
        <Outlet />
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-slate-200 mt-auto">
        <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
          <div className="md:flex md:items-center md:justify-between">
            <div className="flex justify-center md:justify-start space-x-6 md:order-2">
              <p className="text-sm text-slate-500">
                E-Radiologie &copy; {new Date().getFullYear()}. Plateforme de e-learning médicale.
              </p>
            </div>
            <div className="mt-8 md:mt-0 md:order-1 flex flex-col items-center md:items-start gap-2">
               <div className="flex items-center justify-center space-x-2">
                  <Activity className="h-5 w-5 text-sky-600" />
                  <span className="text-lg font-semibold text-slate-900">E-Radiologie</span>
               </div>
               <p className="text-sm text-slate-500 flex items-center justify-center md:justify-start gap-1">
                 Application conçue avec 💗 par 
                 <a href="https://www.linkedin.com/in/issam-lammri-2a3174163/" target="_blank" rel="noopener noreferrer" className="font-medium text-slate-700 hover:text-sky-600 transition-colors">
                   Issam LAMMRI
                 </a>
               </p>
            </div>
          </div>
        </div>
      </footer>
      
      <AuthModal />
    </div>
  );
}
