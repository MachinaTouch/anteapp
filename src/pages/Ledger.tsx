import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Settings, Filter, Brain, Trophy, Lightbulb, Flame, ChevronRight } from 'lucide-react';
import { AppHeader } from '@/components/layout/AppHeader';
import { BottomNav } from '@/components/layout/BottomNav';
import { useAuth } from '@/contexts/AuthContext';

export default function Ledger() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [activeHistoryFilter, setActiveHistoryFilter] = useState<'all' | 'success' | 'failure'>('all');

  const stats = {
    totalXp: 1250,
    level: 12,
    globalRank: 247,
    percentile: 5,
    totalRisks: 50,
    completed: 47,
    completionRate: 94,
    accuracyRating: 78,
    grade: 'B+',
    correct: 37,
    incorrect: 10,
    baseXp: 850,
    intuitionXp: 300,
    streakXp: 100,
  };

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

  const completeHistory = [
    { id: 1247, description: 'Asked my manager for a 15% raise', result: 'success', forecast: 'SUCCESS', xp: 150, date: '2 days ago' },
    { id: 1246, description: 'Cold messaged 10 potential clients on LinkedIn', result: 'failure', forecast: 'FAILURE', xp: 150, date: '5 days ago' },
    { id: 1245, description: 'Had the difficult conversation with my partner', result: 'success', forecast: 'SUCCESS', xp: 150, date: '1 week ago' },
    { id: 1244, description: 'Submitted my resignation letter', result: 'success', forecast: 'FAILURE', xp: 100, date: '1 week ago' },
    { id: 1243, description: 'Confronted my landlord about the broken heater', result: 'success', forecast: 'SUCCESS', xp: 150, date: '2 weeks ago' },
    { id: 1242, description: 'Asked for a promotion after being passed over twice', result: 'failure', forecast: 'SUCCESS', xp: 100, date: '2 weeks ago' },
    { id: 1241, description: 'Told my parents about my career change', result: 'success', forecast: 'FAILURE', xp: 100, date: '3 weeks ago' },
    { id: 1240, description: 'Published my first blog post', result: 'success', forecast: 'SUCCESS', xp: 150, date: '3 weeks ago' },
  ];

  const filteredHistory = completeHistory.filter(item => {
    if (activeHistoryFilter === 'all') return true;
    return item.result === activeHistoryFilter;
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
            <div className="font-mono text-3xl font-black">{stats.totalXp.toLocaleString()}</div>
            <div className="text-muted-foreground text-xs font-mono mt-1">Level {stats.level}</div>
          </div>
          <div className="border border-border p-4">
            <div className="text-muted-foreground text-xs uppercase tracking-wider mb-2">Global Rank</div>
            <div className="font-mono text-3xl font-black">#{stats.globalRank}</div>
            <div className="text-muted-foreground text-xs font-mono mt-1">Top {stats.percentile}%</div>
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
              <span className="font-mono text-4xl font-black">{stats.totalXp.toLocaleString()}</span>
            </div>
            <div className="relative h-3 bg-secondary mb-3">
              <div className="absolute left-0 top-0 h-full bg-foreground" style={{ width: '65%' }}></div>
            </div>
            <div className="flex justify-between text-xs text-muted-foreground font-mono">
              <span>Level {stats.level}</span>
              <span>350 XP to Level 13</span>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-3">
            <div className="border border-border p-4 text-center">
              <div className="font-mono text-2xl font-bold mb-1">{stats.totalRisks}</div>
              <div className="text-muted-foreground text-xs uppercase tracking-wider">Total Risks</div>
            </div>
            <div className="border border-border p-4 text-center">
              <div className="font-mono text-2xl font-bold mb-1">{stats.completed}</div>
              <div className="text-muted-foreground text-xs uppercase tracking-wider">Completed</div>
            </div>
            <div className="border border-border p-4 text-center">
              <div className="font-mono text-2xl font-bold mb-1">{stats.completionRate}%</div>
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
                <div className="font-mono text-5xl font-black">{stats.accuracyRating}%</div>
              </div>
              <div className="w-24 h-24 border-4 border-foreground relative flex items-center justify-center">
                <span className="font-black text-3xl">{stats.grade}</span>
              </div>
            </div>

            <div className="relative h-4 bg-secondary mb-2">
              <div className="absolute left-0 top-0 h-full bg-foreground" style={{ width: `${stats.accuracyRating}%` }}></div>
            </div>

            <div className="flex justify-between text-xs text-muted-foreground font-mono mb-6">
              <span>0%</span>
              <span>50%</span>
              <span>100%</span>
            </div>

            <div className="grid grid-cols-2 gap-4 pt-4 border-t border-border">
              <div>
                <div className="text-muted-foreground text-xs uppercase tracking-wider mb-1">Correct</div>
                <div className="font-mono text-2xl font-bold">{stats.correct}</div>
              </div>
              <div>
                <div className="text-muted-foreground text-xs uppercase tracking-wider mb-1">Incorrect</div>
                <div className="font-mono text-2xl font-bold">{stats.incorrect}</div>
              </div>
            </div>
          </div>

          <div className="border border-border p-5">
            <div className="flex items-start gap-3 mb-4">
              <Brain className="w-5 h-5 text-muted-foreground mt-1" />
              <div className="flex-1">
                <h4 className="font-bold text-sm mb-1">Intuition Trend</h4>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  Your forecast accuracy has improved by 12% over the past 30 days. Keep trusting your instincts.
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2 pt-3 border-t border-border">
              <div className="w-2 h-2 bg-foreground"></div>
              <span className="text-xs font-mono text-muted-foreground">UPWARD TRAJECTORY</span>
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
                <div className="font-mono text-xl font-bold">{stats.baseXp}</div>
              </div>
              <div className="h-2 bg-secondary">
                <div className="h-full bg-foreground" style={{ width: '68%' }}></div>
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
                <div className="font-mono text-xl font-bold">{stats.intuitionXp}</div>
              </div>
              <div className="h-2 bg-secondary">
                <div className="h-full bg-foreground" style={{ width: '24%' }}></div>
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
                <div className="font-mono text-xl font-bold">{stats.streakXp}</div>
              </div>
              <div className="h-2 bg-secondary">
                <div className="h-full bg-foreground" style={{ width: '8%' }}></div>
              </div>
            </div>
          </div>

          <div className="border border-foreground p-5">
            <div className="flex items-center justify-between">
              <span className="font-bold text-lg">TOTAL XP EARNED</span>
              <span className="font-mono text-3xl font-black">{stats.totalXp.toLocaleString()}</span>
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
          {filteredHistory.map((item) => (
            <div key={item.id} className="border border-border p-4 mb-3">
              <div className="flex items-center justify-between mb-2">
                <span className="text-muted-foreground text-xs font-mono uppercase tracking-wider">
                  Risk #{item.id}
                </span>
                <span className={`font-mono text-xs font-bold ${
                  item.result === 'success' ? 'text-foreground' : 'text-muted-foreground'
                }`}>
                  {item.result.toUpperCase()}
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
                    <div className="font-mono text-xs">{item.date}</div>
                  </div>
                </div>
                <div className="font-mono text-lg font-bold">+{item.xp} XP</div>
              </div>
            </div>
          ))}
        </section>
      </main>

      <BottomNav />
    </div>
  );
}
