import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronRight, Filter } from 'lucide-react';
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
    const { data, error } = await supabase
      .from('risks')
      .select('*')
      .eq('user_id', user?.id)
      .order('created_at', { ascending: false });

    if (!error && data) {
      setRisks(data);
      const active = data.filter(r => r.status === 'active').length;
      const settled = data.filter(r => r.status === 'settled').length;
      const wins = data.filter(r => r.result === 'success').length;
      setStats({
        active,
        settled,
        winRate: settled > 0 ? Math.round((wins / settled) * 100) : 0
      });
    }
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
  const demoRisks = [
    { id: '1', description: 'Ask my manager for a 15% raise during tomorrow\'s quarterly review meeting', forecast: 'SUCCESS', status: 'active', created_at: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString() },
    { id: '2', description: 'Cold message 10 potential clients on LinkedIn with my new service offering', forecast: 'FAILURE', status: 'active', created_at: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString() },
    { id: '3', description: 'Have the difficult conversation with my partner about our future plans', forecast: 'SUCCESS', status: 'active', created_at: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString() },
  ];

  const displayRisks = risks.length > 0 ? risks : demoRisks;

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
      </main>

      <BottomNav />
    </div>
  );
}
