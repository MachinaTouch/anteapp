import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Settings, Filter, Brain, Trophy, Lightbulb, Flame, ChevronRight } from 'lucide-react';
import { AppHeader } from '@/components/layout/AppHeader';
import { BottomNav } from '@/components/layout/BottomNav';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { format } from 'date-fns';

interface SettledRisk {
  id: string;
  description: string;
  outcome: string;
  forecast: string;
  xp_earned: number;
  settled_at: string;
}

export default function Ledger() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [activeHistoryFilter, setActiveHistoryFilter] = useState<'all' | 'success' | 'failure'>('all');
  const [settledRisks, setSettledRisks] = useState<SettledRisk[]>([]);
  const [totalRisks, setTotalRisks] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRisksData = async () => {
      if (!user) {
        setLoading(false);
        return;
      }

      // Fetch all risks count
      const { count: allCount } = await supabase
        .from('risks')
        .select('*', { count: 'exact', head: true })
        .eq('user_id', user.id);

      // Fetch settled risks with details
      const { data: settledData, error } = await supabase
        .from('risks')
        .select('id, description, outcome, forecast, xp_earned, settled_at')
        .eq('user_id', user.id)
        .eq('status', 'settled')
        .order('settled_at', { ascending: false });

      if (!error && settledData) {
        setSettledRisks(settledData);
      }
      setTotalRisks(allCount || 0);
      setLoading(false);
    };

    fetchRisksData();
  }, [user]);

  // Calculate real stats from data
  const totalXp = settledRisks.reduce((sum, risk) => sum + (risk.xp_earned || 0), 0);
  const level = Math.floor(totalXp / 100) + 1;
  const completedCount = settledRisks.length;
  const completionRate = totalRisks > 0 ? Math.round((completedCount / totalRisks) * 100) : 0;
  const xpToNextLevel = 100 - (totalXp % 100);
  const levelProgress = (totalXp % 100);

  const riskHistory = [
    { id: 1, success: true }, { id: 2, success: true }, { id: 3, success: false },
    { id: 4, success: true }, { id: 5, success: true }, { id: 6, success: true },
    { id: 7, success: false }, { id: 8, success: true }, { id: 9, success: true },
    { id: 10, success: true }, { id: 11, success: true }, { id: 12, success: false },
    { id: 13, success: true }, { id: 14, success: true }, { id: 15, success: true },
    { id: 16, success: true }, { id: 17, success: false }, { id: 18, success: true },
    { id: 19, success: true }, { id: 20, success: true }, { id: 21, success: true },
    { id: 22, success: true }, { id: 23, success: true }, { id: 24, success: false },
    { id: 25, success: true }, { id: 26, success: true }, { id: 27, success: true },
    { id: 28, success: true }, { id: 29, success: true }, { id: 30, success: true },
  ];

  const filteredHistory = settledRisks.filter(item => {
    if (activeHistoryFilter === 'all') return true;
    if (activeHistoryFilter === 'success') return item.outcome === 'SUCCESS';
    return item.outcome === 'FAILURE';
  });

  return (
    <div className="max-w-md mx-auto min-h-screen bg-background relative pb-20">
      <AppHeader />

      <section className="pt-[73px] px-6 pb-6 border-b border-border">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="font-black text-3xl tracking-tight mb-1">THE LEDGER</h2>
            <p className="text-muted-foreground text-sm font-mono">Member since Jan 2024</p>
          </div>
          <button
            onClick={() => navigate('/settings')}
            className="border border-border p-3 hover:border-foreground transition-colors"
          >
            <Settings className="w-5 h-5" />
          </button>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="border border-border p-4">
            <div className="text-muted-foreground text-xs uppercase tracking-wider mb-2">Total XP</div>
            <div className="font-mono text-3xl font-black">{totalXp.toLocaleString()}</div>
            <div className="text-muted-foreground text-xs font-mono mt-1">Level {level}</div>
          </div>
          <div className="border border-border p-4">
            <div className="text-muted-foreground text-xs uppercase tracking-wider mb-2">Completed</div>
            <div className="font-mono text-3xl font-black">{completedCount}</div>
            <div className="text-muted-foreground text-xs font-mono mt-1">of {totalRisks} risks</div>
          </div>
        </div>
      </section>

      <main className="px-6 pb-6">
        {/* Courage Index */}
        <section className="py-8 border-b border-border">
          <h3 className="font-black text-2xl tracking-tight mb-6">COURAGE INDEX</h3>
          <div className="border border-border p-6 mb-4">
            <div className="flex items-center justify-between mb-4">
              <span className="text-muted-foreground text-xs uppercase tracking-wider">Current Score</span>
              <span className="font-mono text-4xl font-black">{totalXp.toLocaleString()}</span>
            </div>
            <div className="relative h-3 bg-secondary mb-3">
              <div className="absolute left-0 top-0 h-full bg-foreground" style={{ width: `${levelProgress}%` }}></div>
            </div>
            <div className="flex justify-between text-xs text-muted-foreground font-mono">
              <span>Level {level}</span>
              <span>{xpToNextLevel} XP to Level {level + 1}</span>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-3">
            <div className="border border-border p-4 text-center">
              <div className="font-mono text-2xl font-bold mb-1">{totalRisks}</div>
              <div className="text-muted-foreground text-xs uppercase tracking-wider">Total Risks</div>
            </div>
            <div className="border border-border p-4 text-center">
              <div className="font-mono text-2xl font-bold mb-1">{completedCount}</div>
              <div className="text-muted-foreground text-xs uppercase tracking-wider">Completed</div>
            </div>
            <div className="border border-border p-4 text-center">
              <div className="font-mono text-2xl font-bold mb-1">{completionRate}%</div>
              <div className="text-muted-foreground text-xs uppercase tracking-wider">Completion</div>
            </div>
          </div>
        </section>

        {/* Intuition Grade */}
        <section className="py-8 border-b border-border">
          <h3 className="font-black text-2xl tracking-tight mb-6">INTUITION GRADE</h3>

          <div className="border border-border p-6 mb-6">
            <div className="flex items-center justify-between mb-6">
              <div>
                <div className="text-muted-foreground text-xs uppercase tracking-wider mb-2">Accuracy Rating</div>
                <div className="font-mono text-5xl font-black">—%</div>
              </div>
              <div className="w-24 h-24 border-4 border-foreground relative flex items-center justify-center">
                <span className="font-black text-3xl">—</span>
              </div>
            </div>

            <div className="relative h-4 bg-secondary mb-2">
              <div className="absolute left-0 top-0 h-full bg-foreground" style={{ width: '0%' }}></div>
            </div>

            <div className="flex justify-between text-xs text-muted-foreground font-mono mb-6">
              <span>0%</span>
              <span>50%</span>
              <span>100%</span>
            </div>

            <div className="grid grid-cols-2 gap-4 pt-4 border-t border-border">
              <div>
                <div className="text-muted-foreground text-xs uppercase tracking-wider mb-1">Correct</div>
                <div className="font-mono text-2xl font-bold">—</div>
              </div>
              <div>
                <div className="text-muted-foreground text-xs uppercase tracking-wider mb-1">Incorrect</div>
                <div className="font-mono text-2xl font-bold">—</div>
              </div>
            </div>
          </div>

          <div className="border border-border p-5">
            <div className="flex items-start gap-3 mb-4">
              <Brain className="w-5 h-5 text-muted-foreground mt-1" />
              <div className="flex-1">
                <h4 className="font-bold text-sm mb-1">Intuition Trend</h4>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  Complete more risks to see your intuition analytics here.
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2 pt-3 border-t border-border">
              <div className="w-2 h-2 bg-foreground"></div>
              <span className="text-xs font-mono text-muted-foreground">COMING SOON</span>
            </div>
          </div>
        </section>

        {/* XP Breakdown */}
        <section className="py-8 border-b border-border">
          <h3 className="font-black text-2xl tracking-tight mb-6">XP BREAKDOWN</h3>

          <div className="space-y-4 mb-6">
            <div className="border border-border p-5">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-3">
                  <Trophy className="w-5 h-5" />
                  <div>
                    <div className="text-sm font-bold">Base Courage XP</div>
                    <div className="text-xs text-muted-foreground">From completing risks</div>
                  </div>
                </div>
                <div className="font-mono text-xl font-bold">{totalXp}</div>
              </div>
              <div className="h-2 bg-secondary">
                <div className="h-full bg-foreground" style={{ width: '100%' }}></div>
              </div>
            </div>

            <div className="border border-border p-5">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-3">
                  <Lightbulb className="w-5 h-5" />
                  <div>
                    <div className="text-sm font-bold">Intuition Bonus XP</div>
                    <div className="text-xs text-muted-foreground">From correct forecasts</div>
                  </div>
                </div>
                <div className="font-mono text-xl font-bold">—</div>
              </div>
              <div className="h-2 bg-secondary">
                <div className="h-full bg-foreground" style={{ width: '0%' }}></div>
              </div>
            </div>

            <div className="border border-border p-5">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-3">
                  <Flame className="w-5 h-5" />
                  <div>
                    <div className="text-sm font-bold">Streak Multiplier</div>
                    <div className="text-xs text-muted-foreground">From consistency</div>
                  </div>
                </div>
                <div className="font-mono text-xl font-bold">—</div>
              </div>
              <div className="h-2 bg-secondary">
                <div className="h-full bg-foreground" style={{ width: '0%' }}></div>
              </div>
            </div>
          </div>

          <div className="border border-foreground p-5">
            <div className="flex items-center justify-between">
              <span className="font-bold text-lg">TOTAL XP EARNED</span>
              <span className="font-mono text-3xl font-black">{totalXp.toLocaleString()}</span>
            </div>
          </div>
        </section>

        {/* Risk History Visualization */}
        <section className="py-8 border-b border-border">
          <div className="flex items-center justify-between mb-6">
            <h3 className="font-black text-2xl tracking-tight">RISK HISTORY</h3>
            <button className="text-muted-foreground hover:text-foreground transition-colors">
              <Filter className="w-4 h-4" />
            </button>
          </div>

          <div className="border border-border p-5 mb-4">
            <div className="flex items-center justify-between mb-4">
              <span className="text-muted-foreground text-xs uppercase tracking-wider">Visualization</span>
              <span className="text-muted-foreground text-xs font-mono">Last 30 Risks</span>
            </div>
            <div className="flex flex-wrap gap-2">
              {riskHistory.map((risk) => (
                <div
                  key={risk.id}
                  className={`w-6 h-6 ${risk.success ? 'bg-foreground' : 'bg-secondary'}`}
                ></div>
              ))}
            </div>
            <div className="flex items-center gap-6 mt-4 pt-4 border-t border-border">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-foreground"></div>
                <span className="text-xs text-muted-foreground">Success</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-secondary"></div>
                <span className="text-xs text-muted-foreground">Failure</span>
              </div>
            </div>
          </div>
        </section>

        {/* Complete History List */}
        <section className="py-8">
          <div className="flex items-center justify-between mb-6">
            <h3 className="font-black text-2xl tracking-tight">COMPLETE HISTORY</h3>
          </div>

          {/* Filter Tabs */}
          <div className="grid grid-cols-3 gap-2 mb-6">
            {(['all', 'success', 'failure'] as const).map((filter) => (
              <button
                key={filter}
                onClick={() => setActiveHistoryFilter(filter)}
                className={`py-2 text-xs font-mono uppercase tracking-wider border transition-all ${
                  activeHistoryFilter === filter
                    ? 'border-foreground bg-foreground text-background'
                    : 'border-border text-muted-foreground hover:border-foreground'
                }`}
              >
                {filter}
              </button>
            ))}
          </div>

          {/* History List */}
          {loading ? (
            <div className="border border-border p-4 text-center text-muted-foreground">
              Loading history...
            </div>
          ) : filteredHistory.length === 0 ? (
            <div className="border border-border p-4 text-center text-muted-foreground">
              No settled risks yet.
            </div>
          ) : (
            filteredHistory.map((item, index) => (
              <div key={item.id} className="border border-border p-4 mb-3">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-muted-foreground text-xs font-mono uppercase tracking-wider">
                    Risk #{settledRisks.length - index}
                  </span>
                  <span className={`font-mono text-xs font-bold ${
                    item.outcome === 'SUCCESS' ? 'text-foreground' : 'text-muted-foreground'
                  }`}>
                    {item.outcome}
                  </span>
                </div>
                <p className="text-sm leading-relaxed mb-3">{item.description}</p>
                <div className="flex items-center justify-between pt-3 border-t border-border">
                  <div className="flex items-center gap-4">
                    <div>
                      <div className="text-muted-foreground text-xs uppercase tracking-wider mb-1">Forecast</div>
                      <div className="font-mono text-xs">{item.forecast}</div>
                    </div>
                    <div>
                      <div className="text-muted-foreground text-xs uppercase tracking-wider mb-1">Date</div>
                      <div className="font-mono text-xs">{item.settled_at ? format(new Date(item.settled_at), 'MMM d, yyyy') : '-'}</div>
                    </div>
                  </div>
                  <div className="font-mono text-lg font-bold">+{item.xp_earned || 0} XP</div>
                </div>
              </div>
            ))
          )}
        </section>
      </main>

      <BottomNav />
    </div>
  );
}
