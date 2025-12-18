import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Save } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';

export default function ProfileSettings() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { toast } = useToast();
  const [username, setUsername] = useState('');
  const [fullName, setFullName] = useState('');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const fetchProfile = async () => {
      if (!user?.id) return;

      const { data, error } = await supabase
        .from('profiles')
        .select('username, full_name')
        .eq('id', user.id)
        .single();

      if (data) {
        setUsername(data.username || '');
        setFullName(data.full_name || '');
      }
      setLoading(false);
    };

    fetchProfile();
  }, [user?.id]);

  const handleSave = async () => {
    if (!user?.id) return;

    setSaving(true);
    const { error } = await supabase
      .from('profiles')
      .update({
        username: username.trim(),
        full_name: fullName.trim(),
      })
      .eq('id', user.id);

    setSaving(false);

    if (error) {
      toast({
        title: 'Error',
        description: 'Failed to update profile. Please try again.',
        variant: 'destructive',
      });
    } else {
      toast({
        title: 'Profile Updated',
        description: 'Your profile has been saved.',
      });
      navigate('/settings');
    }
  };

  return (
    <div className="max-w-md mx-auto min-h-screen bg-background">
      <header className="fixed top-0 left-0 right-0 max-w-md mx-auto bg-background border-b border-border z-50">
        <div className="px-6 py-5 flex items-center justify-between">
          <button onClick={() => navigate('/settings')} className="text-muted-foreground hover:text-foreground transition-colors">
            <ArrowLeft className="w-5 h-5" />
          </button>
          <h1 className="font-black text-xl tracking-tight">PROFILE</h1>
          <div className="w-5"></div>
        </div>
      </header>

      <main className="pt-[73px] pb-8 px-6">
        {loading ? (
          <div className="flex items-center justify-center py-12">
            <div className="w-1 h-1 bg-foreground animate-pulse"></div>
          </div>
        ) : (
          <div className="space-y-6 py-6">
            <div className="space-y-2">
              <Label htmlFor="email" className="text-xs uppercase tracking-wider text-muted-foreground font-semibold">
                Email
              </Label>
              <Input
                id="email"
                type="email"
                value={user?.email || ''}
                disabled
                className="bg-secondary/30 text-muted-foreground"
              />
              <p className="text-xs text-muted-foreground">Email cannot be changed</p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="username" className="text-xs uppercase tracking-wider text-muted-foreground font-semibold">
                Username
              </Label>
              <Input
                id="username"
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Enter your username"
                className="bg-background border-border"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="fullName" className="text-xs uppercase tracking-wider text-muted-foreground font-semibold">
                Full Name
              </Label>
              <Input
                id="fullName"
                type="text"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                placeholder="Enter your full name"
                className="bg-background border-border"
              />
            </div>

            <Button
              onClick={handleSave}
              disabled={saving}
              className="w-full mt-6"
            >
              {saving ? (
                <span className="flex items-center gap-2">
                  <div className="w-1 h-1 bg-primary-foreground animate-pulse"></div>
                  Saving...
                </span>
              ) : (
                <span className="flex items-center gap-2">
                  <Save className="w-4 h-4" />
                  Save Changes
                </span>
              )}
            </Button>
          </div>
        )}
      </main>
    </div>
  );
}
