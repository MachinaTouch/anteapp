import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { X } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';

export default function NewRisk() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { toast } = useToast();
  const [description, setDescription] = useState('');
  const [forecast, setForecast] = useState<'SUCCESS' | 'FAILURE' | null>(null);
  const [deadline, setDeadline] = useState('3');
  const [loading, setLoading] = useState(false);

  const charCount = description.length;
  const maxChars = 280;

  const handleSubmit = async () => {
    if (!description || !forecast) {
      toast({
        title: 'Incomplete',
        description: 'Please complete all fields',
        variant: 'destructive',
      });
      return;
    }

    setLoading(true);

    try {
      const { error } = await supabase.from('risks').insert({
        user_id: user?.id,
        description,
        forecast,
        deadline_days: parseInt(deadline),
        status: 'active',
      });

      if (error) throw error;

      toast({
        title: 'Risk Placed',
        description: 'Your wager has been recorded. Good luck.',
      });
      navigate('/arena');
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.message || 'Failed to create risk',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto min-h-screen bg-background relative">
      <header className="fixed top-0 left-0 right-0 max-w-md mx-auto bg-background border-b border-border z-50">
        <div className="px-6 py-5 flex items-center justify-between">
          <button onClick={() => navigate(-1)} className="text-foreground hover:text-muted-foreground transition-colors">
            <X className="w-6 h-6" />
          </button>
          <h1 className="font-black text-xl tracking-tight">NEW ANTE</h1>
          <div className="w-6"></div>
        </div>
      </header>

      <main className="pt-[73px]">
        <section className="px-6 py-8">
          <div className="mb-8">
            <div className="flex items-center gap-2 mb-3">
              <div className="w-1 h-1 bg-signal"></div>
              <label className="block text-xs uppercase tracking-wider text-muted-foreground font-semibold">Risk Description</label>
            </div>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value.slice(0, maxChars))}
              placeholder="Describe the risk you're taking..."
              className="w-full h-32 bg-transparent border border-border p-4 text-foreground placeholder:text-muted-foreground resize-none focus:border-foreground focus:outline-none transition-colors"
            />
            <div className="flex justify-between mt-2">
              <span className="text-xs text-muted-foreground font-mono">Be specific. Be honest.</span>
              <span className={`text-xs font-mono ${charCount > maxChars * 0.9 ? 'text-signal' : 'text-muted-foreground'}`}>
                {charCount}/{maxChars}
              </span>
            </div>
          </div>

          <div className="mb-8">
            <div className="flex items-center gap-2 mb-3">
              <div className="w-1 h-1 bg-signal"></div>
              <label className="block text-xs uppercase tracking-wider text-muted-foreground font-semibold">Your Forecast</label>
            </div>
            <p className="text-xs text-muted-foreground mb-4">Predict the outcome. Earn bonus XP if correct.</p>
            <div className="grid grid-cols-2 gap-4">
              <button
                onClick={() => setForecast('SUCCESS')}
                className={`border p-4 text-center transition-all ${
                  forecast === 'SUCCESS'
                    ? 'border-foreground bg-foreground text-background'
                    : 'border-border text-foreground hover:border-foreground'
                }`}
              >
                <div className="font-mono text-lg font-bold mb-1">SUCCESS</div>
                <div className="text-xs opacity-70">I will succeed</div>
              </button>
              <button
                onClick={() => setForecast('FAILURE')}
                className={`border p-4 text-center transition-all ${
                  forecast === 'FAILURE'
                    ? 'border-foreground bg-foreground text-background'
                    : 'border-border text-foreground hover:border-foreground'
                }`}
              >
                <div className="font-mono text-lg font-bold mb-1">FAILURE</div>
                <div className="text-xs opacity-70">I will fail</div>
              </button>
            </div>
          </div>

          <div className="mb-8">
            <div className="flex items-center gap-2 mb-3">
              <div className="w-1 h-1 bg-signal"></div>
              <label className="block text-xs uppercase tracking-wider text-muted-foreground font-semibold">Deadline</label>
            </div>
            <div className="grid grid-cols-4 gap-2">
              {['1', '3', '7', '14'].map((days) => (
                <button
                  key={days}
                  onClick={() => setDeadline(days)}
                  className={`border p-3 text-center transition-all ${
                    deadline === days
                      ? 'border-foreground bg-foreground text-background'
                      : 'border-border text-foreground hover:border-foreground'
                  }`}
                >
                  <div className="font-mono text-sm font-bold">{days}D</div>
                </button>
              ))}
            </div>
          </div>

          <div className="border border-border p-5 mb-8">
            <div className="flex items-center justify-between mb-4">
              <span className="text-xs uppercase tracking-wider text-muted-foreground font-semibold">Potential XP</span>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <div className="text-xs text-muted-foreground mb-1">Base Courage</div>
                <div className="font-mono text-xl font-bold">+100 XP</div>
              </div>
              <div>
                <div className="text-xs text-muted-foreground mb-1">Intuition Bonus</div>
                <div className="font-mono text-xl font-bold">+50 XP</div>
              </div>
            </div>
          </div>

          <button
            onClick={handleSubmit}
            disabled={!description || !forecast || loading}
            className="w-full border border-foreground bg-foreground text-background py-4 font-bold text-sm uppercase tracking-wider hover:bg-transparent hover:text-foreground transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? 'Placing...' : 'Place Your Ante'}
          </button>

          <p className="text-center text-xs text-muted-foreground font-mono mt-4">
            Once placed, you cannot back out.
          </p>
        </section>
      </main>
    </div>
  );
}
