import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { z } from 'zod';

const authSchema = z.object({
  email: z.string().email('Please enter a valid email'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});

export default function Auth() {
  const navigate = useNavigate();
  const { user, signIn, signUp } = useAuth();
  const { toast } = useToast();
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [showForm, setShowForm] = useState(false);

  useEffect(() => {
    if (user) {
      navigate('/arena');
    }
  }, [user, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const validation = authSchema.safeParse({ email, password });
    if (!validation.success) {
      toast({
        title: 'Validation Error',
        description: validation.error.errors[0].message,
        variant: 'destructive',
      });
      return;
    }

    setLoading(true);

    try {
      if (isLogin) {
        const { error } = await signIn(email, password);
        if (error) throw error;
        navigate('/arena');
      } else {
        const { error } = await signUp(email, password);
        if (error) {
          if (error.message.includes('already registered')) {
            toast({
              title: 'Account Exists',
              description: 'This email is already registered. Please sign in.',
            });
            setIsLogin(true);
          } else {
            throw error;
          }
        } else {
          toast({
            title: 'Account Created',
            description: 'Check your email to confirm your account.',
          });
        }
      }
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.message || 'Something went wrong',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  if (!showForm) {
    return (
      <div className="max-w-md mx-auto min-h-screen bg-background flex flex-col">
        <section className="pt-20 pb-12 px-6">
          <div className="flex flex-col items-center justify-center">
            <div className="w-24 h-24 border-2 border-foreground flex items-center justify-center mb-6">
              <span className="font-black text-4xl">A</span>
            </div>
            <h1 className="font-black text-5xl tracking-tight mb-3">ANTE</h1>
            <p className="text-muted-foreground text-sm text-center font-mono uppercase tracking-wider">Risk Registry</p>
          </div>
        </section>

        <section className="px-6 mb-12">
          <div className="border border-border p-6">
            <p className="text-center text-sm leading-relaxed mb-4">
              Courage is not the absence of fear.<br />
              It is action in the presence of it.
            </p>
            <div className="flex justify-center">
              <div className="w-12 h-[1px] bg-border"></div>
            </div>
          </div>
        </section>

        <section className="px-6 flex-1 flex flex-col justify-end pb-12">
          <button
            onClick={() => setShowForm(true)}
            className="w-full border border-foreground bg-foreground text-background py-4 font-bold text-sm uppercase tracking-wider mb-4 hover:bg-transparent hover:text-foreground transition-all"
          >
            Enter The Arena
          </button>
          <p className="text-center text-xs text-muted-foreground font-mono">
            Track your risks. Build your courage.
          </p>
        </section>
      </div>
    );
  }

  return (
    <div className="max-w-md mx-auto min-h-screen bg-background flex flex-col px-6 py-12">
      <button
        onClick={() => setShowForm(false)}
        className="text-muted-foreground hover:text-foreground mb-8 self-start"
      >
        ← Back
      </button>

      <div className="mb-8">
        <h2 className="font-black text-3xl tracking-tight mb-2">
          {isLogin ? 'WELCOME BACK' : 'JOIN THE ARENA'}
        </h2>
        <p className="text-muted-foreground text-sm">
          {isLogin ? 'Continue your journey' : 'Begin tracking your risks'}
        </p>
      </div>

      <div className="flex gap-4 mb-8">
        <button
          onClick={() => setIsLogin(true)}
          className={`flex-1 py-3 text-sm font-mono uppercase tracking-wider border transition-all ${
            isLogin ? 'border-foreground bg-foreground text-background' : 'border-border text-muted-foreground hover:border-foreground hover:text-foreground'
          }`}
        >
          Sign In
        </button>
        <button
          onClick={() => setIsLogin(false)}
          className={`flex-1 py-3 text-sm font-mono uppercase tracking-wider border transition-all ${
            !isLogin ? 'border-foreground bg-foreground text-background' : 'border-border text-muted-foreground hover:border-foreground hover:text-foreground'
          }`}
        >
          Sign Up
        </button>
      </div>

      <form onSubmit={handleSubmit} className="flex flex-col gap-6">
        <div>
          <label className="block text-xs uppercase tracking-wider text-muted-foreground font-semibold mb-2">
            Email
          </label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full bg-transparent border border-border px-4 py-3 text-foreground placeholder:text-muted-foreground focus:border-foreground focus:outline-none transition-colors"
            placeholder="your@email.com"
            required
          />
        </div>

        <div>
          <label className="block text-xs uppercase tracking-wider text-muted-foreground font-semibold mb-2">
            Password
          </label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full bg-transparent border border-border px-4 py-3 text-foreground placeholder:text-muted-foreground focus:border-foreground focus:outline-none transition-colors"
            placeholder="••••••••"
            required
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full border border-foreground bg-foreground text-background py-4 font-bold text-sm uppercase tracking-wider hover:bg-transparent hover:text-foreground transition-all disabled:opacity-50"
        >
          {loading ? 'Loading...' : isLogin ? 'Sign In' : 'Create Account'}
        </button>
      </form>

      <p className="text-center text-xs text-muted-foreground font-mono mt-8">
        By continuing, you accept our terms of courage.
      </p>
    </div>
  );
}
