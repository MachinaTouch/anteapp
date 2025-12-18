import { useState } from 'react';
import { Bell, User } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export function AppHeader() {
  const navigate = useNavigate();
  const [showNotifications, setShowNotifications] = useState(false);

  const notifications = [
    { id: 1, text: 'Risk #1247 expires tomorrow', time: '2h ago' },
    { id: 2, text: 'You earned +150 XP!', time: '5h ago' },
    { id: 3, text: 'New member joined your tier', time: '1d ago' },
  ];

  return (
    <header className="fixed top-0 left-0 right-0 max-w-md mx-auto bg-background border-b border-border z-50">
      <div className="px-6 py-5 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 border border-foreground flex items-center justify-center">
            <span className="font-black text-xs">A</span>
          </div>
          <h1 className="font-black text-xl tracking-tight">ANTE</h1>
        </div>
        <div className="flex items-center gap-4">
          <div className="relative">
            <button 
              onClick={() => setShowNotifications(!showNotifications)}
              className="text-muted-foreground hover:text-foreground transition-colors"
            >
              <Bell className="w-5 h-5" />
            </button>
            
            {showNotifications && (
              <div className="absolute right-0 top-10 w-64 bg-popover border border-border z-50 animate-slide-up">
                <div className="px-4 py-3 border-b border-border">
                  <span className="text-xs font-mono uppercase tracking-wider text-muted-foreground">Notifications</span>
                </div>
                {notifications.map((notif) => (
                  <div key={notif.id} className="px-4 py-3 border-b border-border hover:bg-secondary/50 cursor-pointer">
                    <p className="text-sm mb-1">{notif.text}</p>
                    <span className="text-xs text-muted-foreground font-mono">{notif.time}</span>
                  </div>
                ))}
                <div className="px-4 py-3">
                  <button className="text-xs font-mono uppercase tracking-wider text-muted-foreground hover:text-foreground">
                    Mark all read
                  </button>
                </div>
              </div>
            )}
          </div>
          <button 
            onClick={() => navigate('/ledger')}
            className="text-muted-foreground hover:text-foreground transition-colors"
          >
            <User className="w-5 h-5" />
          </button>
        </div>
      </div>
    </header>
  );
}
