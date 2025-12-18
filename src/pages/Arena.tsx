import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronRight, Filter, Brain } from 'lucide-react';
import { AppHeader } from '@/components/layout/AppHeader';
import { BottomNav } from '@/components/layout/BottomNav';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';

interface Risk {
  id: string;
  description: string;
  forecast: string;
  status: string;
  created_at: string;
  result?: string;
}

export default function Arena() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [risks, setRisks] = useState<Risk[]>([]);
  const [stats, setStats] = useState({ active: 0, settled: 0, winRate: 0 });
  const [totalXp, setTotalXp] = useState(1250);
  const [level, setLevel] = useState(12);

  useEffect(() => {
    if (user) {
      fetchRisks();
    }
  }, [user]);

  const fetchRisks = async () => {
    // Fetch active risks
    const { data: activeData, error: activeError } = await supabase
      .from('risks')
      .select('*')
      .eq('user_id', user?.id)
      .eq('status', 'active')
      .order('created_at', { ascending: false });

    // Fetch settled risks for stats and recent settlements
    const { data: settledData, error: settledError } = await supabase
      .from('risks')
      .select('*')
      .eq('user_id', user?.id)
      .eq('status', 'settled')
      .order('settled_at', { ascending: false });
    const activeRisks = activeData || [];
    const settledRisks = settledData || [];
    const allRisks = [...activeRisks, ...settledRisks];

    setRisks(allRisks);
    const active = activeRisks.length;
    const settled = settledRisks.length;
    const wins = settledRisks.filter(r => r.result === 'success').length;
    setStats({
      active,
      settled,
      winRate: settled > 0 ? Math.round((wins / settled) * 100) : 0
    });
  };

  const getTimeAgo = (date: string) => {
    const diff = Date.now() - new Date(date).getTime();
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    if (days === 0) return 'Today';
    if (days === 1) return '1 day ago';
    if (days < 7) return `${days} days ago`;
    return `${Math.floor(days / 7)} week${Math.floor(days / 7) > 1 ? 's' : ''} ago`;
  };

  // Demo data if no risks exist
  const demoRisks: Risk[] = [
    { id: '1', description: 'Ask my manager for a 15% raise during tomorrow\'s quarterly review meeting', forecast: 'SUCCESS', status: 'active', created_at: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString() },
    { id: '2', description: 'Cold message 10 potential clients on LinkedIn with my new service offering', forecast: 'FAILURE', status: 'active', created_at: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString() },
    { id: '3', description: 'Have the difficult conversation with my partner about our future plans', forecast: 'SUCCESS', status: 'active', created_at: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString() },
  ];

  const demoSettlements: Risk[] = [
    { id: '4', description: 'Asked for a promotion after being passed over twice', forecast: 'SUCCESS', result: 'success', status: 'settled', created_at: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString() },
    { id: '5', description: 'Confronted my landlord about the broken heater', forecast: 'FAILURE', result: 'success', status: 'settled', created_at: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000).toISOString() },
  ];

  const displayRisks = risks.length > 0 ? risks : demoRisks;
  const displaySettlements = risks.filter(r => r.status === 'settled').length > 0 
    ? risks.filter(r => r.status === 'settled').slice(0, 3) 
    : demoSettlements;

  return (
    <div className="max-w-md mx-auto min-h-screen bg-background relative pb-20">
      <AppHeader />

      <section className="fixed top-[73px] left-0 right-0 max-w-md mx-auto bg-background border-b border-border z-40">
        <div className="px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-muted-foreground text-xs uppercase tracking-wider font-semibold">Total XP</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="font-mono text-2xl font-bold tracking-tight">{totalXp.toLocaleString()}</span>
            <div className="w-1 h-1 bg-foreground animate-pulse"></div>
          </div>
        </div>
      </section>

      <main className="pt-[145px] px-6 pb-6">
        <section className="mb-8">
          <div className="flex items-center justify-between mb-2">
            <h2 className="font-black text-3xl tracking-tight">THE ARENA</h2>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-signal animate-pulse"></div>
              <span className="text-muted-foreground text-xs font-mono">LIVE</span>
            </div>
          </div>
          <p className="text-muted-foreground text-sm">Active wagers pending completion</p>
        </section>

        <section className="mb-8 border border-border p-4">
          <div className="grid grid-cols-3 gap-4">
            <div className="border-r border-border pr-4">
              <div className="text-muted-foreground text-xs uppercase tracking-wider mb-1">Active</div>
              <div className="font-mono text-2xl font-bold">{String(stats.active || 3).padStart(2, '0')}</div>
            </div>
            <div className="border-r border-border pr-4">
              <div className="text-muted-foreground text-xs uppercase tracking-wider mb-1">Settled</div>
              <div className="font-mono text-2xl font-bold">{stats.settled || 47}</div>
            </div>
            <div>
              <div className="text-muted-foreground text-xs uppercase tracking-wider mb-1">Win Rate</div>
              <div className="font-mono text-2xl font-bold">{stats.winRate || 78}%</div>
            </div>
          </div>
        </section>

        <section className="mb-8">
          <div className="border border-border p-5">
            <div className="flex items-center justify-between mb-3">
              <span className="text-muted-foreground text-xs uppercase tracking-wider font-semibold">Courage Index</span>
              <span className="font-mono text-sm">Level {level}</span>
            </div>
            <div className="relative h-2 bg-secondary mb-2">
              <div className="absolute left-0 top-0 h-full bg-foreground" style={{ width: '65%' }}></div>
            </div>
            <div className="flex justify-between text-xs text-muted-foreground font-mono">
              <span>650 XP</span>
              <span>1000 XP</span>
            </div>
          </div>
        </section>

        {/* Intuition Analysis Card */}
        <section className="mb-8">
          <div className="border border-border p-5">
            <div className="flex items-center gap-3 mb-4">
              <Brain className="w-5 h-5 text-muted-foreground" />
              <div>
                <h4 className="font-bold text-sm">Intuition Analysis</h4>
                <p className="text-xs text-muted-foreground">Your forecast accuracy</p>
              </div>
            </div>
            <div className="grid grid-cols-3 gap-3">
              <div className="text-center">
                <div className="font-mono text-xl font-bold">78%</div>
                <div className="text-xs text-muted-foreground">Accuracy</div>
              </div>
              <div className="text-center">
                <div className="font-mono text-xl font-bold">37</div>
                <div className="text-xs text-muted-foreground">Correct</div>
              </div>
              <div className="text-center">
                <div className="font-mono text-xl font-bold">10</div>
                <div className="text-xs text-muted-foreground">Incorrect</div>
              </div>
            </div>
            <div className="mt-4 pt-3 border-t border-border">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-foreground"></div>
                <span className="text-xs font-mono text-muted-foreground">TRENDING UPWARD +12%</span>
              </div>
            </div>
          </div>
        </section>

        <section className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-black text-xl tracking-tight">ACTIVE WAGERS</h3>
            <button className="text-muted-foreground hover:text-foreground transition-colors">
              <Filter className="w-4 h-4" />
            </button>
          </div>

          {displayRisks.filter(r => r.status === 'active').map((risk, index) => (
            <div
              key={risk.id}
              onClick={() => navigate(`/settlement/${risk.id}`)}
              className="border border-border mb-4 hover:border-foreground transition-colors cursor-pointer"
            >
              <div className="p-5">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <div className="w-1 h-1 bg-signal"></div>
                      <span className="text-muted-foreground text-xs font-mono uppercase tracking-wider">
                        Risk #{1247 - index}
                      </span>
                    </div>
                    <p className="text-sm leading-relaxed mb-3">{risk.description}</p>
                  </div>
                </div>
                <div className="flex items-center justify-between pt-3 border-t border-border">
                  <div className="flex items-center gap-4">
                    <div>
                      <div className="text-muted-foreground text-xs uppercase tracking-wider mb-1">Placed</div>
                      <div className="font-mono text-xs">{getTimeAgo(risk.created_at)}</div>
                    </div>
                    <div>
                      <div className="text-muted-foreground text-xs uppercase tracking-wider mb-1">Forecast</div>
                      <div className="font-mono text-xs">{risk.forecast}</div>
                    </div>
                  </div>
                  <div className="text-muted-foreground">
                    <ChevronRight className="w-4 h-4" />
                  </div>
                </div>
              </div>
            </div>
          ))}
        </section>

        {/* Recent Settlements */}
        <section className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-black text-xl tracking-tight">RECENT SETTLEMENTS</h3>
            <button 
              onClick={() => navigate('/ledger')}
              className="text-muted-foreground hover:text-foreground transition-colors text-xs font-mono"
            >
              View All →
            </button>
          </div>

          {displaySettlements.map((risk, index) => (
            <div
              key={risk.id}
              className="border border-border mb-3 p-4"
            >
              <div className="flex items-center justify-between mb-2">
                <span className="text-muted-foreground text-xs font-mono uppercase tracking-wider">
                  Risk #{1240 - index}
                </span>
                <span className={`font-mono text-xs font-bold ${risk.result === 'success' ? 'text-foreground' : 'text-muted-foreground'}`}>
                  {risk.result === 'success' ? 'SUCCESS' : 'FAILURE'}
                </span>
              </div>
              <p className="text-sm leading-relaxed mb-2">{risk.description}</p>
              <div className="flex items-center justify-between pt-2 border-t border-border">
                <span className="text-xs text-muted-foreground">{getTimeAgo(risk.created_at)}</span>
                <span className="font-mono text-sm font-bold">+150 XP</span>
              </div>
            </div>
          ))}
        </section>
      </main>

      <BottomNav />
    </div>
  );
}
