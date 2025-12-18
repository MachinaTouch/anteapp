import { useState, useEffect, useCallback } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { ChevronRight, Filter, Brain, Eye, Lock, MoreVertical, Pencil, Trash2 } from 'lucide-react';
import { AppHeader } from '@/components/layout/AppHeader';
import { BottomNav } from '@/components/layout/BottomNav';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
interface Risk {
  id: string;
  description: string;
  forecast: string;
  status: string;
  created_at: string;
  outcome?: string;
  xp_earned?: number;
  intuition_correct?: boolean;
  is_public?: boolean;
}

export default function Arena() {
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useAuth();
  const { toast } = useToast();
  const [risks, setRisks] = useState<Risk[]>([]);
  const [stats, setStats] = useState({ active: 0, settled: 0, winRate: 0 });
  const [totalXp, setTotalXp] = useState(0);
  const [level, setLevel] = useState(1);
  const [intuitionStats, setIntuitionStats] = useState({ accuracy: 0, correct: 0, incorrect: 0, grade: '—' });
  const [editingRisk, setEditingRisk] = useState<Risk | null>(null);
  const [editDescription, setEditDescription] = useState('');

  const getGrade = (accuracy: number): string => {
    if (accuracy >= 90) return 'A+';
    if (accuracy >= 80) return 'A';
    if (accuracy >= 70) return 'B';
    if (accuracy >= 60) return 'C';
    if (accuracy >= 50) return 'D';
    return 'F';
  };

  const fetchRisks = useCallback(async () => {
    if (!user?.id) return;
    
    // Fetch active risks
    const { data: activeData } = await supabase
      .from('risks')
      .select('*')
      .eq('user_id', user.id)
      .eq('status', 'active')
      .order('created_at', { ascending: false });

    // Fetch settled risks for stats and recent settlements
    const { data: settledData } = await supabase
      .from('risks')
      .select('*')
      .eq('user_id', user.id)
      .eq('status', 'settled')
      .order('settled_at', { ascending: false });

    const activeRisks = activeData || [];
    const settledRisks = settledData || [];
    const allRisks = [...activeRisks, ...settledRisks];

    setRisks(allRisks);
    const active = activeRisks.length;
    const settled = settledRisks.length;
    const wins = settledRisks.filter(r => r.outcome === 'SUCCESS').length;
    
    // Calculate total XP and level (progressive formula)
    const xp = settledRisks.reduce((sum, r) => sum + (r.xp_earned || 0), 0);
    setTotalXp(xp);
    setLevel(Math.floor(Math.sqrt(xp / 50)) + 1);

    // Calculate intuition stats using intuition_correct boolean
    const correctPredictions = settledRisks.filter(r => r.intuition_correct === true).length;
    const incorrectPredictions = settledRisks.filter(r => r.intuition_correct === false).length;
    const totalPredictions = correctPredictions + incorrectPredictions;
    const accuracy = totalPredictions > 0 ? Math.round((correctPredictions / totalPredictions) * 100) : 0;
    
    setIntuitionStats({
      accuracy,
      correct: correctPredictions,
      incorrect: incorrectPredictions,
      grade: totalPredictions > 0 ? getGrade(accuracy) : '—'
    });

    setStats({
      active,
      settled,
      winRate: settled > 0 ? Math.round((wins / settled) * 100) : 0
    });
  }, [user?.id]);

  // Refetch when navigating back to this page
  useEffect(() => {
    if (user) {
      fetchRisks();
    }
  }, [user, location.key, fetchRisks]);


  const getTimeAgo = (date: string) => {
    const diff = Date.now() - new Date(date).getTime();
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    if (days === 0) return 'Today';
    if (days === 1) return '1 day ago';
    if (days < 7) return `${days} days ago`;
    return `${Math.floor(days / 7)} week${Math.floor(days / 7) > 1 ? 's' : ''} ago`;
  };

  const handleDeleteRisk = async (riskId: string) => {
    if (!confirm('Are you sure you want to delete this risk?')) return;
    
    await supabase.from('risks').delete().eq('id', riskId);
    toast({
      title: "Risk Deleted",
      description: "The risk has been removed",
    });
    fetchRisks();
  };

  const handleEditRisk = (risk: Risk) => {
    setEditingRisk(risk);
    setEditDescription(risk.description);
  };

  const handleSaveEdit = async () => {
    if (!editingRisk) return;
    
    const { error } = await supabase
      .from('risks')
      .update({ description: editDescription })
      .eq('id', editingRisk.id);
    
    if (error) {
      toast({
        title: "Error",
        description: "Failed to update risk",
        variant: "destructive",
      });
      return;
    }
    
    setRisks(prev => prev.map(r => 
      r.id === editingRisk.id ? { ...r, description: editDescription } : r
    ));
    
    toast({
      title: "Risk Updated",
      description: "Your changes have been saved",
    });
    
    setEditingRisk(null);
    setEditDescription('');
  };

  const handleTogglePrivacy = async (riskId: string, currentIsPublic: boolean) => {
    const newIsPublic = !currentIsPublic;
    
    const { error } = await supabase
      .from('risks')
      .update({ is_public: newIsPublic })
      .eq('id', riskId);
    
    if (error) {
      toast({
        title: "Error",
        description: "Failed to update privacy setting",
        variant: "destructive",
      });
      return;
    }
    
    // Update local state instantly
    setRisks(prev => prev.map(r => 
      r.id === riskId ? { ...r, is_public: newIsPublic } : r
    ));
    
    toast({
      title: newIsPublic ? "Risk is now Public" : "Risk is now Private",
      description: newIsPublic ? "Visible in Society feed" : "Only you can see this",
    });
  };

  // Demo data if no risks exist
  const demoRisks: Risk[] = [
    { id: '1', description: 'Ask my manager for a 15% raise during tomorrow\'s quarterly review meeting', forecast: 'SUCCESS', status: 'active', created_at: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString() },
    { id: '2', description: 'Cold message 10 potential clients on LinkedIn with my new service offering', forecast: 'FAILURE', status: 'active', created_at: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString() },
    { id: '3', description: 'Have the difficult conversation with my partner about our future plans', forecast: 'SUCCESS', status: 'active', created_at: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString() },
  ];

  const displayRisks = risks.length > 0 ? risks : demoRisks;
  const displaySettlements = risks.filter(r => r.status === 'settled').slice(0, 3);

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
            {(() => {
              // Calculate XP thresholds for current and next level using progressive formula
              const currentLevelMinXp = level > 1 ? (level - 1) * (level - 1) * 50 : 0;
              const nextLevelMinXp = level * level * 50;
              const progressXp = totalXp - currentLevelMinXp;
              const xpNeededForLevel = nextLevelMinXp - currentLevelMinXp;
              const progressPercent = Math.min(100, Math.round((progressXp / xpNeededForLevel) * 100));
              return (
                <>
                  <div className="relative h-2 bg-secondary mb-2">
                    <div className="absolute left-0 top-0 h-full bg-foreground" style={{ width: `${progressPercent}%` }}></div>
                  </div>
                  <div className="flex justify-between text-xs text-muted-foreground font-mono">
                    <span>{totalXp.toLocaleString()} XP</span>
                    <span>{nextLevelMinXp.toLocaleString()} XP</span>
                  </div>
                </>
              );
            })()}
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
              <div className="ml-auto w-10 h-10 border-2 border-foreground flex items-center justify-center">
                <span className="font-black text-sm">{intuitionStats.grade}</span>
              </div>
            </div>
            <div className="grid grid-cols-3 gap-3">
              <div className="text-center">
                <div className="font-mono text-xl font-bold">{intuitionStats.accuracy}%</div>
                <div className="text-xs text-muted-foreground">Accuracy</div>
              </div>
              <div className="text-center">
                <div className="font-mono text-xl font-bold">{intuitionStats.correct}</div>
                <div className="text-xs text-muted-foreground">Correct</div>
              </div>
              <div className="text-center">
                <div className="font-mono text-xl font-bold">{intuitionStats.incorrect}</div>
                <div className="text-xs text-muted-foreground">Incorrect</div>
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
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleTogglePrivacy(risk.id, risk.is_public ?? false);
                        }}
                        className="p-1 hover:bg-secondary rounded transition-colors"
                        title={risk.is_public ? "Make Private" : "Make Public"}
                      >
                        {risk.is_public ? (
                          <Eye className="w-3 h-3 text-foreground" />
                        ) : (
                          <Lock className="w-3 h-3 text-muted-foreground" />
                        )}
                      </button>
                    </div>
                    <p className="text-sm leading-relaxed mb-3">{risk.description}</p>
                  </div>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild onClick={(e) => e.stopPropagation()}>
                      <button className="p-2 text-muted-foreground hover:text-foreground transition-colors">
                        <MoreVertical className="w-4 h-4" />
                      </button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="bg-background border border-border z-50">
                      <DropdownMenuItem onClick={(e) => {
                        e.stopPropagation();
                        handleEditRisk(risk);
                      }}>
                        <Pencil className="w-4 h-4 mr-2" />
                        Edit
                      </DropdownMenuItem>
                      <DropdownMenuItem 
                        className="text-destructive focus:text-destructive"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDeleteRisk(risk.id);
                        }}
                      >
                        <Trash2 className="w-4 h-4 mr-2" />
                        Delete
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
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
                <div className="flex items-center gap-2">
                  <span className="text-muted-foreground text-xs font-mono uppercase tracking-wider">
                    Risk #{1240 - index}
                  </span>
                  {risk.is_public ? (
                    <Eye className="w-3 h-3 text-muted-foreground" />
                  ) : (
                    <Lock className="w-3 h-3 text-muted-foreground" />
                  )}
                </div>
                <span className={`font-mono text-xs font-bold ${risk.outcome === 'SUCCESS' ? 'text-foreground' : 'text-muted-foreground'}`}>
                  {risk.outcome || 'PENDING'}
                </span>
              </div>
              <p className="text-sm leading-relaxed mb-2">{risk.description}</p>
              <div className="flex items-center justify-between pt-2 border-t border-border">
                <span className="text-xs text-muted-foreground">{getTimeAgo(risk.created_at)}</span>
                <span className="font-mono text-sm font-bold">+{risk.xp_earned || 0} XP</span>
              </div>
            </div>
          ))}
        </section>
      </main>

      {/* Edit Risk Modal */}
      <Dialog open={!!editingRisk} onOpenChange={(open) => !open && setEditingRisk(null)}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Edit Risk</DialogTitle>
          </DialogHeader>
          <div className="py-4">
            <Textarea
              value={editDescription}
              onChange={(e) => setEditDescription(e.target.value)}
              placeholder="Describe your risk..."
              className="min-h-[100px]"
            />
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setEditingRisk(null)}>
              Cancel
            </Button>
            <Button onClick={handleSaveEdit}>
              Save Changes
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <BottomNav />
    </div>
  );
}
