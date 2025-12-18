import { useState, useEffect } from 'react';
import { Lock, Star, Heart } from 'lucide-react';
import { AppHeader } from '@/components/layout/AppHeader';
import { BottomNav } from '@/components/layout/BottomNav';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { formatDistanceToNow } from 'date-fns';

interface FeedRisk {
  id: string;
  description: string;
  created_at: string;
  xp_potential: number;
  status: string;
  forecast: string;
  profiles: {
    username: string | null;
    avatar_url: string | null;
  } | null;
  inspiration_count: number;
  is_inspired: boolean;
}

interface LeaderboardUser {
  id: string;
  username: string | null;
  avatar_url: string | null;
  xp_total: number;
}

const calculateLevel = (xpTotal: number): number => {
  return Math.floor(Math.sqrt(xpTotal / 50)) + 1;
};

export default function Society() {
  const { user } = useAuth();
  const [isPro, setIsPro] = useState(false);
  const [showPaywall, setShowPaywall] = useState(false);
  const [activeTab, setActiveTab] = useState<'feed' | 'leaderboard'>('feed');
  const [loading, setLoading] = useState(true);
  const [feedRisks, setFeedRisks] = useState<FeedRisk[]>([]);
  const [leaderboard, setLeaderboard] = useState<LeaderboardUser[]>([]);
  const [featuredRisk, setFeaturedRisk] = useState<FeedRisk | null>(null);
  const [memberCount, setMemberCount] = useState(0);

  useEffect(() => {
    const fetchData = async () => {
      if (!user) {
        setLoading(false);
        setShowPaywall(true);
        return;
      }

      // Fetch pro status
      const { data: profileData } = await supabase
        .from('profiles')
        .select('is_pro')
        .eq('id', user.id)
        .maybeSingle();

      if (profileData) {
        setIsPro(profileData.is_pro === true);
        setShowPaywall(profileData.is_pro !== true);
      } else {
        setShowPaywall(true);
      }

      // Fetch member count
      const { count } = await supabase
        .from('profiles')
        .select('*', { count: 'exact', head: true });
      setMemberCount(count || 0);

      // Fetch public risks with profile data and inspiration counts
      const { data: risksData } = await supabase
        .from('risks')
        .select(`
          id,
          description,
          created_at,
          xp_potential,
          status,
          forecast,
          profiles:user_id (
            username,
            avatar_url
          )
        `)
        .eq('is_public', true)
        .order('created_at', { ascending: false })
        .limit(20);

      if (risksData) {
        // Fetch inspiration counts and user's inspirations
        const riskIds = risksData.map(r => r.id);
        
        const { data: inspirationCounts } = await supabase
          .from('inspirations')
          .select('risk_id')
          .in('risk_id', riskIds);

        const { data: userInspirations } = await supabase
          .from('inspirations')
          .select('risk_id')
          .eq('user_id', user.id)
          .in('risk_id', riskIds);

        const countMap: Record<string, number> = {};
        inspirationCounts?.forEach(i => {
          countMap[i.risk_id] = (countMap[i.risk_id] || 0) + 1;
        });

        const userInspiredSet = new Set(userInspirations?.map(i => i.risk_id) || []);

        const enrichedRisks: FeedRisk[] = risksData.map(risk => {
          // Handle the profiles data - it could be an array or object depending on the join
          const profileData = Array.isArray(risk.profiles) ? risk.profiles[0] : risk.profiles;
          return {
            id: risk.id,
            description: risk.description,
            created_at: risk.created_at,
            xp_potential: risk.xp_potential,
            status: risk.status,
            forecast: risk.forecast,
            profiles: profileData as { username: string | null; avatar_url: string | null } | null,
            inspiration_count: countMap[risk.id] || 0,
            is_inspired: userInspiredSet.has(risk.id),
          };
        });

        setFeedRisks(enrichedRisks);

        // Set featured as the one with most inspirations
        if (enrichedRisks.length > 0) {
          const featured = [...enrichedRisks].sort((a, b) => b.inspiration_count - a.inspiration_count)[0];
          setFeaturedRisk(featured);
        }
      }

      // Fetch leaderboard
      const { data: leaderboardData } = await supabase
        .from('profiles')
        .select('id, username, avatar_url, xp_total')
        .order('xp_total', { ascending: false })
        .limit(50);

      if (leaderboardData) {
        setLeaderboard(leaderboardData);
      }

      setLoading(false);
    };

    fetchData();
  }, [user]);

  const handleInspire = async (riskId: string, isCurrentlyInspired: boolean) => {
    if (!user) return;

    if (isCurrentlyInspired) {
      // Remove inspiration
      await supabase
        .from('inspirations')
        .delete()
        .eq('risk_id', riskId)
        .eq('user_id', user.id);
    } else {
      // Add inspiration
      await supabase
        .from('inspirations')
        .insert({ risk_id: riskId, user_id: user.id });
    }

    // Update local state
    setFeedRisks(prev => prev.map(risk => {
      if (risk.id === riskId) {
        return {
          ...risk,
          is_inspired: !isCurrentlyInspired,
          inspiration_count: isCurrentlyInspired 
            ? risk.inspiration_count - 1 
            : risk.inspiration_count + 1,
        };
      }
      return risk;
    }));

    // Update featured if needed
    if (featuredRisk?.id === riskId) {
      setFeaturedRisk(prev => prev ? {
        ...prev,
        is_inspired: !isCurrentlyInspired,
        inspiration_count: isCurrentlyInspired 
          ? prev.inspiration_count - 1 
          : prev.inspiration_count + 1,
      } : null);
    }
  };

  const handleStartTrial = async () => {
    setShowPaywall(false);
    setIsPro(true);
  };

  const getDisplayName = (profiles: { username: string | null } | null) => {
    return profiles?.username || 'Anonymous';
  };

  const getResultLabel = (status: string) => {
    if (status === 'success') return 'SUCCESS';
    if (status === 'failure') return 'FAILURE';
    return 'PENDING';
  };

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
            <span className="font-mono text-sm">{memberCount.toLocaleString()} Members</span>
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
        {featuredRisk && (
          <section className="mb-8">
            <div className="flex items-center gap-2 mb-4">
              <Star className="w-4 h-4 text-foreground" />
              <h3 className="font-black text-lg tracking-tight">FEATURED COURAGE</h3>
            </div>
            <div className={`border-2 border-foreground p-5 ${!isPro ? 'blur-content' : ''}`}>
              <div className="flex items-center gap-2 mb-3">
                {featuredRisk.profiles?.avatar_url ? (
                  <img 
                    src={featuredRisk.profiles.avatar_url} 
                    alt="" 
                    className="w-8 h-8 object-cover"
                  />
                ) : (
                  <div className="w-8 h-8 bg-foreground text-background flex items-center justify-center font-mono font-bold text-xs">★</div>
                )}
                <div>
                  <div className="text-xs font-mono">{getDisplayName(featuredRisk.profiles)}</div>
                  <div className="text-xs text-muted-foreground">Top Risk</div>
                </div>
              </div>
              <p className="text-sm leading-relaxed mb-4 font-medium">{featuredRisk.description}</p>
              <div className="flex items-center justify-between pt-3 border-t border-border">
                <button
                  onClick={() => handleInspire(featuredRisk.id, featuredRisk.is_inspired)}
                  className={`flex items-center gap-2 transition-colors ${
                    featuredRisk.is_inspired ? 'text-foreground' : 'text-muted-foreground hover:text-foreground'
                  }`}
                >
                  <Heart className={`w-4 h-4 ${featuredRisk.is_inspired ? 'fill-current' : ''}`} />
                  <span className="text-xs">{featuredRisk.inspiration_count} inspired</span>
                </button>
                <div className="font-mono text-lg font-bold">+{featuredRisk.xp_potential} XP</div>
              </div>
            </div>
          </section>
        )}

        {/* Content based on tab */}
        {activeTab === 'feed' ? (
          <section className="mb-8">
            <h3 className="font-black text-xl tracking-tight mb-4">LIVE FEED</h3>
            {loading ? (
              <div className="text-center py-8 text-muted-foreground">Loading...</div>
            ) : feedRisks.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">No public risks yet</div>
            ) : (
              feedRisks.map((risk) => (
                <div key={risk.id} className={`border border-border p-5 mb-3 ${!isPro ? 'blur-content' : ''}`}>
                  <div className="flex items-center gap-2 mb-3">
                    {risk.profiles?.avatar_url ? (
                      <img 
                        src={risk.profiles.avatar_url} 
                        alt="" 
                        className="w-8 h-8 object-cover"
                      />
                    ) : (
                      <div className="w-8 h-8 bg-secondary"></div>
                    )}
                    <div>
                      <div className="text-xs font-mono">{getDisplayName(risk.profiles)}</div>
                      <div className="text-xs text-muted-foreground">
                        {formatDistanceToNow(new Date(risk.created_at), { addSuffix: true })}
                      </div>
                    </div>
                  </div>
                  <p className="text-sm leading-relaxed mb-4">{risk.description}</p>
                  <div className="flex items-center justify-between pt-3 border-t border-border">
                    <div className="flex items-center gap-4">
                      <div>
                        <div className="text-muted-foreground text-xs uppercase tracking-wider mb-1">Result</div>
                        <div className="font-mono text-xs">{getResultLabel(risk.status)}</div>
                      </div>
                      <button
                        onClick={() => handleInspire(risk.id, risk.is_inspired)}
                        className={`flex items-center gap-1 transition-colors ${
                          risk.is_inspired ? 'text-foreground' : 'text-muted-foreground hover:text-foreground'
                        }`}
                      >
                        <Heart className={`w-4 h-4 ${risk.is_inspired ? 'fill-current' : ''}`} />
                        <span className="text-xs">{risk.inspiration_count}</span>
                      </button>
                    </div>
                    <div className="font-mono text-lg font-bold">+{risk.xp_potential} XP</div>
                  </div>
                </div>
              ))
            )}
          </section>
        ) : (
          <section className="mb-8">
            <h3 className="font-black text-xl tracking-tight mb-4">TOP RISK TAKERS</h3>
            {loading ? (
              <div className="text-center py-8 text-muted-foreground">Loading...</div>
            ) : leaderboard.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">No users yet</div>
            ) : (
              leaderboard.map((entry, index) => (
                <div 
                  key={entry.id} 
                  className={`border p-4 mb-3 ${
                    entry.id === user?.id 
                      ? 'border-foreground bg-foreground/5' 
                      : 'border-border'
                  } ${!isPro ? 'blur-content' : ''}`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className={`w-8 h-8 border flex items-center justify-center font-mono font-bold ${
                        index < 3 ? 'border-foreground bg-foreground text-background' : 'border-foreground'
                      }`}>
                        {index + 1}
                      </div>
                      <div className="flex items-center gap-3">
                        {entry.avatar_url ? (
                          <img 
                            src={entry.avatar_url} 
                            alt="" 
                            className="w-8 h-8 object-cover"
                          />
                        ) : null}
                        <div>
                          <div className="font-mono font-bold">
                            {entry.username || 'Anonymous'}
                            {entry.id === user?.id && <span className="text-muted-foreground ml-2">(You)</span>}
                          </div>
                          <div className="text-xs text-muted-foreground">Level {calculateLevel(entry.xp_total)}</div>
                        </div>
                      </div>
                    </div>
                    <div className="font-mono text-lg font-bold">{entry.xp_total.toLocaleString()}</div>
                  </div>
                </div>
              ))
            )}
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
