import { useNavigate, useLocation } from 'react-router-dom';
import { Swords, Plus, Users, BookOpen } from 'lucide-react';

export function BottomNav() {
  const navigate = useNavigate();
  const location = useLocation();

  const navItems = [
    { path: '/arena', icon: Swords, label: 'Arena' },
    { path: '/new-risk', icon: Plus, label: 'New' },
    { path: '/society', icon: Users, label: 'Society' },
    { path: '/ledger', icon: BookOpen, label: 'Ledger' },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 max-w-md mx-auto bg-background border-t border-border z-50">
      <div className="grid grid-cols-4">
        {navItems.map((item) => {
          const isActive = location.pathname === item.path;
          const Icon = item.icon;
          
          return (
            <button
              key={item.path}
              onClick={() => navigate(item.path)}
              className={`flex flex-col items-center py-4 transition-colors ${
                isActive ? 'text-foreground' : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              {item.path === '/new-risk' ? (
                <div className={`w-10 h-10 border ${isActive ? 'border-foreground bg-foreground' : 'border-muted-foreground'} flex items-center justify-center`}>
                  <Icon className={`w-5 h-5 ${isActive ? 'text-background' : ''}`} />
                </div>
              ) : (
                <>
                  <Icon className="w-5 h-5 mb-1" />
                  <span className="text-[10px] font-mono uppercase tracking-wider">{item.label}</span>
                </>
              )}
            </button>
          );
        })}
      </div>
    </nav>
  );
}
