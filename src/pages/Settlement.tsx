import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, MoreVertical } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { formatDistanceToNow } from 'date-fns';

interface Risk {
  id: string;
  description: string;
  forecast: string;
  created_at: string;
}

export default function Settlement() {
  const navigate = useNavigate();
  const { id } = useParams();
  const { toast } = useToast();
  const [outcome, setOutcome] = useState('');
  const [result, setResult] = useState<'SUCCESS' | 'FAILURE' | null>(null);
  const [intuition, setIntuition] = useState<'yes' | 'no' | null>(null);
  const [loading, setLoading] = useState(false);
  const [showXpAnimation, setShowXpAnimation] = useState(false);
  const [earnedXp, setEarnedXp] = useState(0);
  const [risk, setRisk] = useState<Risk | null>(null);
  const [fetchingRisk, setFetchingRisk] = useState(true);

  useEffect(() => {
    const fetchRisk = async () => {
      if (!id) return;
      
      setFetchingRisk(true);
      const { data, error } = await supabase
        .from('risks')
        .select('id, description, forecast, created_at')
        .eq('id', id)
        .maybeSingle();
      
      if (error) {
        toast({
          title: 'Error',
          description: 'Failed to load risk data',
          variant: 'destructive',
        });
        navigate('/arena');
        return;
      }
      
      if (!data) {
        toast({
          title: 'Not Found',
          description: 'Risk not found',
          variant: 'destructive',
        });
        navigate('/arena');
        return;
      }
      
      setRisk(data);
      setFetchingRisk(false);
    };
    
    fetchRisk();
  }, [id, navigate, toast]);

  const placedAt = risk?.created_at 
    ? formatDistanceToNow(new Date(risk.created_at), { addSuffix: true })
    : '';

  const handleSubmit = async () => {
    if (!outcome || !result || !intuition) {
      toast({
        title: 'Incomplete',
        description: 'Please complete all fields',
        variant: 'destructive',
      });
      return;
    }

    setLoading(true);

    try {
      // Calculate XP
      const xp = intuition === 'yes' ? 150 : 100;
      setEarnedXp(xp);

      // Update risk in database
      await supabase
        .from('risks')
        .update({
          status: 'settled',
          result,
          outcome_notes: outcome,
          intuition_correct: intuition === 'yes',
          xp_earned: xp,
          settled_at: new Date().toISOString(),
        })
        .eq('id', id);

      // Show XP animation
      setShowXpAnimation(true);
      
      setTimeout(() => {
        setShowXpAnimation(false);
        navigate('/arena');
        toast({
          title: 'Risk Settled',
          description: `You earned +${xp} XP!`,
        });
      }, 1500);
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.message || 'Failed to settle risk',
        variant: 'destructive',
      });
      setLoading(false);
    }
  };

  if (fetchingRisk) {
    return (
      <div className="max-w-md mx-auto min-h-screen bg-background flex items-center justify-center">
        <div className="w-1 h-1 bg-foreground animate-pulse"></div>
      </div>
    );
  }

  if (!risk) {
    return null;
  }

  return (
    <div className="max-w-md mx-auto min-h-screen bg-background relative">
      <header className="fixed top-0 left-0 right-0 max-w-md mx-auto bg-background border-b border-border z-50">
        <div className="px-6 py-5 flex items-center justify-between">
          <button onClick={() => navigate(-1)} className="text-muted-foreground hover:text-foreground transition-colors">
            <ArrowLeft className="w-5 h-5" />
          </button>
          <h1 className="font-black text-xl tracking-tight">SETTLEMENT</h1>
          <button className="text-muted-foreground hover:text-foreground transition-colors">
            <MoreVertical className="w-5 h-5" />
          </button>
        </div>
      </header>

      <main className="pt-[73px]">
        <section className="px-6 pt-6 pb-4 border-b border-border">
          <div className="flex items-center gap-2 mb-3">
            <div className="w-1 h-1 bg-signal"></div>
            <span className="text-muted-foreground text-xs font-mono uppercase tracking-wider">Risk #{risk.id.slice(0, 8).toUpperCase()}</span>
          </div>
          <p className="text-lg font-medium leading-relaxed mb-4">{risk.description}</p>
          <div className="flex items-center gap-4 text-xs text-muted-foreground font-mono">
            <span>Placed: {placedAt}</span>
            <span>•</span>
            <span>Forecast: {risk.forecast?.toUpperCase() || 'N/A'}</span>
          </div>
        </section>

        <section className="px-6 py-6">
          <div className="mb-8">
            <div className="flex items-center gap-2 mb-3">
              <div className="w-1 h-1 bg-signal"></div>
              <label className="block text-xs uppercase tracking-wider text-muted-foreground font-semibold">What Happened?</label>
            </div>
            <textarea
              value={outcome}
              onChange={(e) => setOutcome(e.target.value)}
              placeholder="Describe the outcome..."
              className="w-full h-24 bg-transparent border border-border p-4 text-foreground placeholder:text-muted-foreground resize-none focus:border-foreground focus:outline-none transition-colors"
            />
          </div>

          <div className="mb-8">
            <div className="flex items-center gap-2 mb-3">
              <div className="w-1 h-1 bg-signal"></div>
              <label className="block text-xs uppercase tracking-wider text-muted-foreground font-semibold">Result</label>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <button
                onClick={() => setResult('SUCCESS')}
                className={`border p-4 text-center transition-all ${
                  result === 'SUCCESS'
                    ? 'border-foreground bg-foreground text-background'
                    : 'border-border text-foreground hover:border-foreground'
                }`}
              >
                <div className="font-mono text-lg font-bold">SUCCESS</div>
              </button>
              <button
                onClick={() => setResult('FAILURE')}
                className={`border p-4 text-center transition-all ${
                  result === 'FAILURE'
                    ? 'border-foreground bg-foreground text-background'
                    : 'border-border text-foreground hover:border-foreground'
                }`}
              >
                <div className="font-mono text-lg font-bold">FAILURE</div>
              </button>
            </div>
          </div>

          <div className="mb-8">
            <div className="flex items-center gap-2 mb-3">
              <div className="w-1 h-1 bg-signal"></div>
              <label className="block text-xs uppercase tracking-wider text-muted-foreground font-semibold">Did Your Forecast Match?</label>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <button
                onClick={() => setIntuition('yes')}
                className={`border p-4 text-center transition-all ${
                  intuition === 'yes'
                    ? 'border-foreground bg-foreground text-background'
                    : 'border-border text-foreground hover:border-foreground'
                }`}
              >
                <div className="font-mono text-lg font-bold">YES</div>
                <div className="text-xs opacity-70">+50 bonus XP</div>
              </button>
              <button
                onClick={() => setIntuition('no')}
                className={`border p-4 text-center transition-all ${
                  intuition === 'no'
                    ? 'border-foreground bg-foreground text-background'
                    : 'border-border text-foreground hover:border-foreground'
                }`}
              >
                <div className="font-mono text-lg font-bold">NO</div>
                <div className="text-xs opacity-70">No bonus</div>
              </button>
            </div>
          </div>

          <div className="border border-border p-5 mb-8">
            <div className="flex items-center justify-between">
              <span className="text-xs uppercase tracking-wider text-muted-foreground font-semibold">XP Reward</span>
              <span className="font-mono text-2xl font-bold">
                +{intuition === 'yes' ? 150 : intuition === 'no' ? 100 : '???'} XP
              </span>
            </div>
          </div>

          <button
            onClick={handleSubmit}
            disabled={!outcome || !result || !intuition || loading}
            className="w-full border border-foreground bg-foreground text-background py-4 font-bold text-sm uppercase tracking-wider hover:bg-transparent hover:text-foreground transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? 'Settling...' : 'Settle Risk'}
          </button>
        </section>
      </main>

      {/* XP Animation Overlay */}
      {showXpAnimation && (
        <div className="fixed inset-0 bg-background/90 flex items-center justify-center z-50">
          <div className="text-center animate-xp-float">
            <div className="font-mono text-6xl font-black mb-2">+{earnedXp}</div>
            <div className="text-xl font-bold">XP EARNED</div>
          </div>
        </div>
      )}
    </div>
  );
}
