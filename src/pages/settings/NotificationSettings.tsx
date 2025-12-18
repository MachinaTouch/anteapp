import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Bell } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';

export default function NotificationSettings() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { toast } = useToast();
  const [notificationsEnabled, setNotificationsEnabled] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSettings = async () => {
      if (!user?.id) return;

      const { data } = await supabase
        .from('profiles')
        .select('notifications_enabled')
        .eq('id', user.id)
        .single();

      if (data) {
        setNotificationsEnabled(data.notifications_enabled ?? true);
      }
      setLoading(false);
    };

    fetchSettings();
  }, [user?.id]);

  const handleToggle = async (enabled: boolean) => {
    if (!user?.id) return;

    setNotificationsEnabled(enabled);

    const { error } = await supabase
      .from('profiles')
      .update({ notifications_enabled: enabled })
      .eq('id', user.id);

    if (error) {
      setNotificationsEnabled(!enabled);
      toast({
        title: 'Error',
        description: 'Failed to update settings. Please try again.',
        variant: 'destructive',
      });
    } else {
      toast({
        title: enabled ? 'Notifications Enabled' : 'Notifications Disabled',
        description: enabled 
          ? 'You will receive notifications about your risks.' 
          : 'You will no longer receive notifications.',
      });
    }
  };

  return (
    <div className="max-w-md mx-auto min-h-screen bg-background">
      <header className="fixed top-0 left-0 right-0 max-w-md mx-auto bg-background border-b border-border z-50">
        <div className="px-6 py-5 flex items-center justify-between">
          <button onClick={() => navigate('/settings')} className="text-muted-foreground hover:text-foreground transition-colors">
            <ArrowLeft className="w-5 h-5" />
          </button>
          <h1 className="font-black text-xl tracking-tight">NOTIFICATIONS</h1>
          <div className="w-5"></div>
        </div>
      </header>

      <main className="pt-[73px] pb-8 px-6">
        {loading ? (
          <div className="flex items-center justify-center py-12">
            <div className="w-1 h-1 bg-foreground animate-pulse"></div>
          </div>
        ) : (
          <div className="py-6">
            <div className="flex items-center justify-between py-4 border-b border-border">
              <div className="flex items-center gap-4">
                <Bell className="w-5 h-5 text-muted-foreground" />
                <div>
                  <Label htmlFor="notifications" className="font-medium cursor-pointer">
                    Allow Notifications
                  </Label>
                  <p className="text-sm text-muted-foreground">
                    Get reminders about your active risks
                  </p>
                </div>
              </div>
              <Switch
                id="notifications"
                checked={notificationsEnabled}
                onCheckedChange={handleToggle}
              />
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
