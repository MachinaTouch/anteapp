import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, User, Bell, Shield, HelpCircle, LogOut, ChevronRight, RotateCcw } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';

export default function SettingsPage() {
  const navigate = useNavigate();
  const { signOut, user } = useAuth();
  const { toast } = useToast();
  const [totalXp, setTotalXp] = useState(0);
  const [level, setLevel] = useState(1);

  useEffect(() => {
    const fetchUserStats = async () => {
      if (!user?.id) return;

      const { data } = await supabase
        .from('risks')
        .select('xp_earned')
        .eq('user_id', user.id)
        .eq('status', 'settled');

      if (data) {
        const xp = data.reduce((sum, r) => sum + (r.xp_earned || 0), 0);
        setTotalXp(xp);
        setLevel(Math.floor(xp / 100) + 1);
      }
    };

    fetchUserStats();
  }, [user?.id]);

  const handleSignOut = async () => {
    await signOut();
    toast({
      title: 'Signed Out',
      description: 'You have been signed out successfully.',
    });
    navigate('/auth');
  };

  const handleRestorePurchases = () => {
    toast({
      title: 'Restoring Purchases',
      description: 'Checking for previous purchases...',
    });
    // Simulate restore
    setTimeout(() => {
      toast({
        title: 'No Purchases Found',
        description: 'No previous purchases were found for this account.',
      });
    }, 2000);
  };

  const settingsSections = [
    {
      title: 'Account',
      items: [
        { icon: User, label: 'Profile', description: 'Edit your profile information', path: '/settings/profile' },
        { icon: Bell, label: 'Notifications', description: 'Manage notification preferences', path: '/settings/notifications' },
      ],
    },
    {
      title: 'Privacy & Security',
      items: [
        { icon: Shield, label: 'Privacy', description: 'Control your data and visibility', path: '/settings/privacy' },
      ],
    },
    {
      title: 'Support',
      items: [
        { icon: HelpCircle, label: 'Help Center', description: 'Get help and support', path: '/settings/help' },
      ],
    },
  ];

  return (
    <div className="max-w-md mx-auto min-h-screen bg-background">
      <header className="fixed top-0 left-0 right-0 max-w-md mx-auto bg-background border-b border-border z-50">
        <div className="px-6 py-5 flex items-center justify-between">
          <button onClick={() => navigate(-1)} className="text-muted-foreground hover:text-foreground transition-colors">
            <ArrowLeft className="w-5 h-5" />
          </button>
          <h1 className="font-black text-xl tracking-tight">SETTINGS</h1>
          <div className="w-5"></div>
        </div>
      </header>

      <main className="pt-[73px] pb-8">
        {/* User Info */}
        <section className="px-6 py-6 border-b border-border">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 border border-border flex items-center justify-center">
              <User className="w-8 h-8 text-muted-foreground" />
            </div>
            <div>
              <div className="font-bold text-lg">{user?.email || 'Anonymous'}</div>
              <div className="text-muted-foreground text-sm font-mono">Level {level} • {totalXp.toLocaleString()} XP</div>
            </div>
          </div>
        </section>

        {/* Settings Sections */}
        {settingsSections.map((section) => (
          <section key={section.title} className="px-6 py-6 border-b border-border">
            <h3 className="text-xs uppercase tracking-wider text-muted-foreground font-semibold mb-4">{section.title}</h3>
            <div className="space-y-1">
              {section.items.map((item) => {
                const Icon = item.icon;
                return (
                  <button
                    key={item.label}
                    onClick={() => navigate(item.path)}
                    className="w-full flex items-center justify-between py-4 hover:bg-secondary/30 transition-colors -mx-2 px-2"
                  >
                    <div className="flex items-center gap-4">
                      <Icon className="w-5 h-5 text-muted-foreground" />
                      <div className="text-left">
                        <div className="font-medium">{item.label}</div>
                        <div className="text-sm text-muted-foreground">{item.description}</div>
                      </div>
                    </div>
                    <ChevronRight className="w-4 h-4 text-muted-foreground" />
                  </button>
                );
              })}
            </div>
          </section>
        ))}

        {/* Purchases Section */}
        <section className="px-6 py-6 border-b border-border">
          <h3 className="text-xs uppercase tracking-wider text-muted-foreground font-semibold mb-4">Purchases</h3>
          <button
            onClick={handleRestorePurchases}
            className="w-full flex items-center justify-between py-4 hover:bg-secondary/30 transition-colors -mx-2 px-2"
          >
            <div className="flex items-center gap-4">
              <RotateCcw className="w-5 h-5 text-muted-foreground" />
              <div className="text-left">
                <div className="font-medium">Restore Purchases</div>
                <div className="text-sm text-muted-foreground">Restore previous subscriptions</div>
              </div>
            </div>
            <ChevronRight className="w-4 h-4 text-muted-foreground" />
          </button>
        </section>

        {/* Sign Out */}
        <section className="px-6 py-6">
          <button
            onClick={handleSignOut}
            className="w-full flex items-center justify-between py-4 text-signal hover:bg-secondary/30 transition-colors -mx-2 px-2"
          >
            <div className="flex items-center gap-4">
              <LogOut className="w-5 h-5" />
              <div className="text-left">
                <div className="font-medium">Sign Out</div>
                <div className="text-sm opacity-70">End your session</div>
              </div>
            </div>
          </button>
        </section>

        {/* App Info */}
        <section className="px-6 py-8 text-center">
          <div className="w-12 h-12 border border-border flex items-center justify-center mx-auto mb-3">
            <span className="font-black text-sm">A</span>
          </div>
          <div className="text-sm text-muted-foreground font-mono">ANTE v1.0.0</div>
          <div className="text-xs text-muted-foreground mt-1">Built with courage</div>
        </section>
      </main>
    </div>
  );
}
