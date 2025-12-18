import { useState } from 'react';
import { Lock, Star } from 'lucide-react';
import { AppHeader } from '@/components/layout/AppHeader';
import { BottomNav } from '@/components/layout/BottomNav';

export default function Society() {
  const [isPro, setIsPro] = useState(false);
  const [showPaywall, setShowPaywall] = useState(true);
  const [activeTab, setActiveTab] = useState<'feed' | 'leaderboard'>('feed');

  const handleStartTrial = () => {
    setShowPaywall(false);
    setIsPro(true);
  };

  const featuredCourage = {
    user: 'Anonymous #1089',
    text: 'Quit my stable job to start my own company. Terrified but alive.',
    xp: 250,
    likes: 147,
  };

  const feedItems = [
    { id: 1, user: 'Anonymous #2891', time: '4 hours ago', text: 'Told my parents I\'m dropping out of medical school to pursue art. They\'ve wanted me to be a doctor since I was 5.', result: 'FAILURE', forecast: 'MATCH', xp: 150 },
    { id: 2, user: 'Anonymous #5634', time: '6 hours ago', text: 'Published my first YouTube video about my mental health journey. Face on camera, real name, everything.', result: 'SUCCESS', forecast: 'MISMATCH', xp: 100 },
    { id: 3, user: 'Anonymous #1247', time: '8 hours ago', text: 'Asked for a promotion after 3 years of being overlooked. Finally stood up for myself.', result: 'SUCCESS', forecast: 'MATCH', xp: 150 },
    { id: 4, user: 'Anonymous #8821', time: '12 hours ago', text: 'Sent the text ending a toxic friendship of 10 years. Hardest thing I\'ve ever done.', result: 'SUCCESS', forecast: 'MATCH', xp: 150 },
  ];

  const leaderboard = [
    { rank: 1, user: 'StormRider', xp: 12450, risks: 156, winRate: 82 },
    { rank: 2, user: 'FearlessFox', xp: 11200, risks: 142, winRate: 79 },
    { rank: 3, user: 'BoldVenture', xp: 10800, risks: 138, winRate: 81 },
    { rank: 4, user: 'RiskTaker99', xp: 9650, risks: 125, winRate: 77 },
    { rank: 5, user: 'CourageKing', xp: 8900, risks: 118, winRate: 75 },
  ];

  return (
    <div className="max-w-md mx-auto min-h-screen bg-background relative pb-20">
      <AppHeader />

      <section className="fixed top-[73px] left-0 right-0 max-w-md mx-auto bg-background border-b border-border z-40">
        <div className="px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-muted-foreground text-xs uppercase tracking-wider font-semibold">Global Ledger</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-1 h-1 bg-signal animate-pulse"></div>
            <span className="font-mono text-sm">1,247 Members</span>
          </div>
        </div>
      </section>

      <main className="pt-[145px] px-6 pb-6">
        <section className="mb-8">
          <div className="flex items-center justify-between mb-2">
            <h2 className="font-black text-3xl tracking-tight">THE SOCIETY</h2>
            {!isPro && <Lock className="w-4 h-4 text-muted-foreground" />}
          </div>
          <p className="text-muted-foreground text-sm mb-4">Witness the courage of others. Anonymous risks, real outcomes.</p>
          
          <div className="border border-border p-4">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-muted-foreground text-xs uppercase tracking-wider mb-1">Your Status</div>
                <div className="font-mono text-lg font-bold">{isPro ? 'PRO MEMBER' : 'FREE MEMBER'}</div>
              </div>
              {!isPro && (
                <button
                  onClick={() => setShowPaywall(true)}
                  className="border border-foreground px-4 py-2 text-xs font-mono uppercase tracking-wider hover:bg-foreground hover:text-background transition-all"
                >
                  Upgrade
                </button>
              )}
            </div>
          </div>
        </section>

        {/* Toggle Tabs */}
        <section className="mb-6">
          <div className="grid grid-cols-2 gap-2">
            <button
              onClick={() => setActiveTab('feed')}
              className={`py-3 text-sm font-mono uppercase tracking-wider border transition-all ${
                activeTab === 'feed'
                  ? 'border-foreground bg-foreground text-background'
                  : 'border-border text-muted-foreground hover:border-foreground hover:text-foreground'
              }`}
            >
              Live Feed
            </button>
            <button
              onClick={() => setActiveTab('leaderboard')}
              className={`py-3 text-sm font-mono uppercase tracking-wider border transition-all ${
                activeTab === 'leaderboard'
                  ? 'border-foreground bg-foreground text-background'
                  : 'border-border text-muted-foreground hover:border-foreground hover:text-foreground'
              }`}
            >
              Leaderboard
            </button>
          </div>
        </section>

        {/* Featured Courage */}
        <section className="mb-8">
          <div className="flex items-center gap-2 mb-4">
            <Star className="w-4 h-4 text-foreground" />
            <h3 className="font-black text-lg tracking-tight">FEATURED COURAGE</h3>
          </div>
          <div className={`border-2 border-foreground p-5 ${!isPro ? 'blur-content' : ''}`}>
            <div className="flex items-center gap-2 mb-3">
              <div className="w-8 h-8 bg-foreground text-background flex items-center justify-center font-mono font-bold text-xs">★</div>
              <div>
                <div className="text-xs font-mono">{featuredCourage.user}</div>
                <div className="text-xs text-muted-foreground">Today's Top Risk</div>
              </div>
            </div>
            <p className="text-sm leading-relaxed mb-4 font-medium">{featuredCourage.text}</p>
            <div className="flex items-center justify-between pt-3 border-t border-border">
              <div className="flex items-center gap-2">
                <span className="text-xs text-muted-foreground">{featuredCourage.likes} inspired</span>
              </div>
              <div className="font-mono text-lg font-bold">+{featuredCourage.xp} XP</div>
            </div>
          </div>
        </section>

        {/* Stats (blurred for free users) */}
        <section className="mb-8">
          <div className="grid grid-cols-3 gap-3">
            <div className="border border-border p-4">
              <div className="text-muted-foreground text-xs uppercase tracking-wider mb-1">Risks Today</div>
              <div className={`font-mono text-xl font-bold ${!isPro ? 'blur-content' : ''}`}>247</div>
            </div>
            <div className="border border-border p-4">
              <div className="text-muted-foreground text-xs uppercase tracking-wider mb-1">Avg XP</div>
              <div className={`font-mono text-xl font-bold ${!isPro ? 'blur-content' : ''}`}>142</div>
            </div>
            <div className="border border-border p-4">
              <div className="text-muted-foreground text-xs uppercase tracking-wider mb-1">Success Rate</div>
              <div className={`font-mono text-xl font-bold ${!isPro ? 'blur-content' : ''}`}>67%</div>
            </div>
          </div>
        </section>

        {/* Content based on tab */}
        {activeTab === 'feed' ? (
          <section className="mb-8">
            <h3 className="font-black text-xl tracking-tight mb-4">LIVE FEED</h3>
            {feedItems.map((item) => (
              <div key={item.id} className={`border border-border p-5 mb-3 ${!isPro ? 'blur-content' : ''}`}>
                <div className="flex items-center gap-2 mb-3">
                  <div className="w-8 h-8 bg-secondary"></div>
                  <div>
                    <div className="text-xs font-mono">{item.user}</div>
                    <div className="text-xs text-muted-foreground">{item.time}</div>
                  </div>
                </div>
                <p className="text-sm leading-relaxed mb-4">{item.text}</p>
                <div className="flex items-center justify-between pt-3 border-t border-border">
                  <div className="flex items-center gap-3">
                    <div>
                      <div className="text-muted-foreground text-xs uppercase tracking-wider mb-1">Result</div>
                      <div className="font-mono text-xs">{item.result}</div>
                    </div>
                    <div>
                      <div className="text-muted-foreground text-xs uppercase tracking-wider mb-1">Forecast</div>
                      <div className="font-mono text-xs">{item.forecast}</div>
                    </div>
                  </div>
                  <div className="font-mono text-lg font-bold">+{item.xp} XP</div>
                </div>
              </div>
            ))}
          </section>
        ) : (
          <section className="mb-8">
            <h3 className="font-black text-xl tracking-tight mb-4">TOP RISK TAKERS</h3>
            {leaderboard.map((entry) => (
              <div key={entry.rank} className={`border border-border p-4 mb-3 ${!isPro ? 'blur-content' : ''}`}>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="w-8 h-8 border border-foreground flex items-center justify-center font-mono font-bold">
                      {entry.rank}
                    </div>
                    <div>
                      <div className="font-mono font-bold">{entry.user}</div>
                      <div className="text-xs text-muted-foreground">{entry.risks} risks • {entry.winRate}% win rate</div>
                    </div>
                  </div>
                  <div className="font-mono text-lg font-bold">{entry.xp.toLocaleString()}</div>
                </div>
              </div>
            ))}
          </section>
        )}
      </main>

      {/* Paywall Overlay */}
      {showPaywall && !isPro && (
        <div className="fixed inset-0 bg-background/95 z-50 flex items-center justify-center p-6">
          <div className="w-full max-w-sm border border-foreground p-8 animate-fade-in">
            <div className="text-center mb-8">
              <div className="w-16 h-16 border-2 border-foreground flex items-center justify-center mx-auto mb-4">
                <Lock className="w-8 h-8" />
              </div>
              <h3 className="font-black text-2xl tracking-tight mb-2">UNLOCK THE SOCIETY</h3>
              <p className="text-muted-foreground text-sm">
                See how others are taking risks. Learn from their courage.
              </p>
            </div>

            <div className="space-y-4 mb-8">
              <div className="flex items-center gap-3">
                <div className="w-1 h-1 bg-signal"></div>
                <span className="text-sm">Full access to live risk feed</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-1 h-1 bg-signal"></div>
                <span className="text-sm">Global leaderboard rankings</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-1 h-1 bg-signal"></div>
                <span className="text-sm">Community insights & stats</span>
              </div>
            </div>

            {/* Price */}
            <div className="text-center mb-6">
              <span className="font-mono text-3xl font-black">$4.99</span>
              <span className="text-muted-foreground text-sm">/mo</span>
            </div>

            <button
              onClick={handleStartTrial}
              className="w-full border border-foreground bg-foreground text-background py-4 font-bold text-sm uppercase tracking-wider hover:bg-transparent hover:text-foreground transition-all mb-4"
            >
              Start 7-Day Free Trial
            </button>

            <button
              onClick={() => setShowPaywall(false)}
              className="w-full text-muted-foreground text-sm font-mono hover:text-foreground transition-colors"
            >
              Maybe later
            </button>
          </div>
        </div>
      )}

      <BottomNav />
    </div>
  );
}
