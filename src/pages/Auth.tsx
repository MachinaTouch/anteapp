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
  const [showContent, setShowContent] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setShowContent(true), 100);
    return () => clearTimeout(timer);
  }, []);

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
      <div className="max-w-md mx-auto min-h-screen bg-void flex flex-col overflow-hidden">
        {/* Hero Section */}
        <section className="pt-20 pb-12 px-6">
          <div className={`flex flex-col items-center opacity-0 ${showContent ? 'animate-fade-in' : ''}`}>
            {/* Logo */}
            <div className="w-20 h-20 border-2 border-stark flex items-center justify-center mb-6 animate-border-pulse">
              <span className="font-sans font-black text-4xl text-stark">A</span>
            </div>
            <h1 className="font-sans font-black text-5xl tracking-tight text-stark mb-2">ANTE</h1>
            <div className="flex items-center gap-3 mt-2">
              <div className="w-8 h-[1px] bg-ghost"></div>
              <p className="text-ghost text-xs font-sans uppercase tracking-[0.2em]">Place Your Courage</p>
              <div className="w-8 h-[1px] bg-ghost"></div>
            </div>
          </div>
        </section>

        {/* Philosophy Card */}
        <section 
          className="px-6 mb-12 opacity-0 animate-slide-up"
          style={{ animationDelay: '400ms', animationFillMode: 'forwards' }}
        >
          <div className="border border-steel p-6 bg-void">
            <p className="text-center text-sm font-sans text-ghost leading-relaxed mb-4">
              Courage is not the absence of fear,<br />
              but the willingness to act despite it.
            </p>
            <div className="flex justify-center">
              <div className="w-12 h-[1px] bg-steel"></div>
            </div>
          </div>
        </section>

        {/* Stats Section */}
        <section 
          className="px-6 mb-12 opacity-0 animate-slide-up"
          style={{ animationDelay: '600ms', animationFillMode: 'forwards' }}
        >
          <div className="grid grid-cols-3 gap-4 text-center">
            <div className="border border-steel p-4">
              <p className="font-mono font-bold text-xl text-stark">1K+</p>
              <p className="text-ghost text-xs font-sans uppercase tracking-wider mt-1">Members</p>
            </div>
            <div className="border border-steel p-4">
              <p className="font-mono font-bold text-xl text-stark">50K+</p>
              <p className="text-ghost text-xs font-sans uppercase tracking-wider mt-1">Risks</p>
            </div>
            <div className="border border-steel p-4">
              <p className="font-mono font-bold text-xl text-stark">78%</p>
              <p className="text-ghost text-xs font-sans uppercase tracking-wider mt-1">Accuracy</p>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section 
          className="px-6 flex-1 flex flex-col justify-end pb-12 opacity-0 animate-slide-up"
          style={{ animationDelay: '800ms', animationFillMode: 'forwards' }}
        >
          <button
            onClick={() => setShowForm(true)}
            className="w-full border border-stark bg-stark text-void py-4 font-sans font-bold text-sm uppercase tracking-wider mb-4 hover:bg-transparent hover:text-stark transition-all duration-300"
          >
            Enter The Arena
          </button>
          <p className="text-center text-xs text-ghost font-sans tracking-wide">
            Track your risks. Build your courage.
          </p>
        </section>
      </div>
    );
  }

  return (
    <div className="max-w-md mx-auto min-h-screen bg-void flex flex-col px-6 py-12 overflow-hidden">
      {/* Back Button */}
      <button
        onClick={() => setShowForm(false)}
        className="text-ghost hover:text-stark mb-8 self-start font-sans text-sm transition-colors duration-300 flex items-center gap-2"
      >
        <span className="text-lg">←</span> Back
      </button>

      {/* Header */}
      <div className="mb-8 animate-fade-in">
        <h2 className="font-sans font-black text-3xl tracking-tight text-stark mb-2">
          {isLogin ? 'WELCOME BACK' : 'JOIN THE ARENA'}
        </h2>
        <p className="text-ghost text-sm font-sans">
          {isLogin ? 'Continue your journey' : 'Begin tracking your risks'}
        </p>
      </div>

      {/* Toggle Buttons */}
      <div className="flex gap-4 mb-8 animate-fade-in" style={{ animationDelay: '100ms' }}>
        <button
          onClick={() => setIsLogin(true)}
          className={`flex-1 py-3 text-sm font-sans uppercase tracking-wider border transition-all duration-300 ${
            isLogin 
              ? 'border-stark bg-stark text-void' 
              : 'border-steel text-ghost hover:border-stark hover:text-stark'
          }`}
        >
          Sign In
        </button>
        <button
          onClick={() => setIsLogin(false)}
          className={`flex-1 py-3 text-sm font-sans uppercase tracking-wider border transition-all duration-300 ${
            !isLogin 
              ? 'border-stark bg-stark text-void' 
              : 'border-steel text-ghost hover:border-stark hover:text-stark'
          }`}
        >
          Sign Up
        </button>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} className="flex flex-col gap-6 animate-fade-in" style={{ animationDelay: '200ms' }}>
        <div>
          <label className="block text-xs uppercase tracking-wider text-ghost font-sans font-semibold mb-2">
            Email
          </label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full bg-transparent border border-steel px-4 py-3 text-stark font-sans placeholder:text-ghost/50 focus:border-stark focus:outline-none transition-colors duration-300"
            placeholder="your@email.com"
            required
          />
        </div>

        <div>
          <label className="block text-xs uppercase tracking-wider text-ghost font-sans font-semibold mb-2">
            Password
          </label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full bg-transparent border border-steel px-4 py-3 text-stark font-sans placeholder:text-ghost/50 focus:border-stark focus:outline-none transition-colors duration-300"
            placeholder="••••••••"
            required
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full border border-stark bg-stark text-void py-4 font-sans font-bold text-sm uppercase tracking-wider hover:bg-transparent hover:text-stark transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? (
            <span className="flex items-center justify-center gap-2">
              <span className="w-1.5 h-1.5 bg-void rounded-full animate-pulse"></span>
              <span className="w-1.5 h-1.5 bg-void rounded-full animate-pulse" style={{ animationDelay: '150ms' }}></span>
              <span className="w-1.5 h-1.5 bg-void rounded-full animate-pulse" style={{ animationDelay: '300ms' }}></span>
            </span>
          ) : (
            isLogin ? 'Sign In' : 'Create Account'
          )}
        </button>
      </form>

      {/* Footer */}
      <p className="text-center text-xs text-ghost font-sans mt-8 tracking-wide">
        By continuing, you accept our terms of courage.
      </p>
    </div>
  );
}
