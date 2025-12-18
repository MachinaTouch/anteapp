import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { X, Lightbulb, AlertCircle } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';

const CATEGORIES = [
  { id: 'career', label: 'Career', icon: '💼' },
  { id: 'relationships', label: 'Relationships', icon: '💬' },
  { id: 'personal', label: 'Personal Growth', icon: '🌱' },
  { id: 'financial', label: 'Financial', icon: '💰' },
  { id: 'health', label: 'Health', icon: '🏃' },
  { id: 'creative', label: 'Creative', icon: '🎨' },
];

export default function NewRisk() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { toast } = useToast();
  const [description, setDescription] = useState('');
  const [forecast, setForecast] = useState<'SUCCESS' | 'FAILURE' | null>(null);
  const [deadline, setDeadline] = useState('3');
  const [category, setCategory] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const charCount = description.length;
  const maxChars = 500;
  const minChars = 20;
  const isDescriptionTooShort = charCount > 0 && charCount < minChars;

  const handleSubmit = async () => {
    if (!description || !forecast) {
      toast({
        title: 'Incomplete',
        description: 'Please complete all fields',
        variant: 'destructive',
      });
      return;
    }

    if (charCount < minChars) {
      toast({
        title: 'Too Short',
        description: `Please describe your risk in at least ${minChars} characters`,
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
        category,
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
          {/* Tip Box */}
          <div className="border border-border p-4 mb-8 bg-secondary/20">
            <div className="flex items-start gap-3">
              <Lightbulb className="w-5 h-5 text-muted-foreground flex-shrink-0 mt-0.5" />
              <div>
                <h4 className="font-bold text-sm mb-1">Tips for a Good Risk</h4>
                <ul className="text-xs text-muted-foreground space-y-1">
                  <li>• Be specific about what you're doing</li>
                  <li>• Include when you'll take action</li>
                  <li>• Make it measurable - how will you know it's done?</li>
                </ul>
              </div>
            </div>
          </div>

          {/* Category Selector */}
          <div className="mb-8">
            <div className="flex items-center gap-2 mb-3">
              <div className="w-1 h-1 bg-signal"></div>
              <label className="block text-xs uppercase tracking-wider text-muted-foreground font-semibold">Category</label>
            </div>
            <div className="grid grid-cols-3 gap-2">
              {CATEGORIES.map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => setCategory(category === cat.id ? null : cat.id)}
                  className={`border p-3 text-center transition-all ${
                    category === cat.id
                      ? 'border-foreground bg-foreground text-background'
                      : 'border-border text-foreground hover:border-foreground'
                  }`}
                >
                  <div className="text-lg mb-1">{cat.icon}</div>
                  <div className="text-xs font-mono">{cat.label}</div>
                </button>
              ))}
            </div>
          </div>

          {/* Risk Description */}
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
            <div className="flex justify-between items-center mt-2">
              <div className="flex items-center gap-2">
                {isDescriptionTooShort && (
                  <>
                    <AlertCircle className="w-3 h-3 text-signal" />
                    <span className="text-xs text-signal font-mono">Min {minChars} characters</span>
                  </>
                )}
                {!isDescriptionTooShort && charCount > 0 && (
                  <span className="text-xs text-muted-foreground font-mono">Be specific. Be honest.</span>
                )}
              </div>
              <span className={`text-xs font-mono ${
                isDescriptionTooShort ? 'text-signal' : 
                charCount > maxChars * 0.9 ? 'text-signal' : 'text-muted-foreground'
              }`}>
                {charCount}/{maxChars}
              </span>
            </div>
          </div>

          {/* Forecast */}
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

          {/* Deadline */}
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

          {/* Potential XP */}
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
            disabled={!description || !forecast || loading || isDescriptionTooShort}
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
