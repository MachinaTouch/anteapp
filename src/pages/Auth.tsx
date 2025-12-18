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

  return (
    <div className="max-w-md mx-auto min-h-screen flex flex-col px-6 py-12 overflow-hidden" style={{ backgroundColor: '#050505' }}>
      {/* Back Button */}
      <button
        onClick={() => navigate('/')}
        className="mb-8 self-start font-sans text-sm transition-colors duration-300 flex items-center gap-2 hover:text-stark"
        style={{ color: '#CCCCCC' }}
      >
        <span className="text-lg">←</span> Back
      </button>

      {/* Header */}
      <div className={`mb-8 opacity-0 ${showContent ? 'animate-fade-in' : ''}`}>
        <h2 className="font-sans font-black text-3xl tracking-tight text-stark mb-2">
          {isLogin ? 'WELCOME BACK' : 'JOIN THE ARENA'}
        </h2>
        <p className="text-sm font-sans" style={{ color: '#CCCCCC' }}>
          {isLogin ? 'Continue your journey' : 'Begin tracking your risks'}
        </p>
      </div>

      {/* Toggle Buttons */}
      <div className="flex gap-4 mb-8 opacity-0 animate-fade-in" style={{ animationDelay: '100ms', animationFillMode: 'forwards' }}>
        <button
          onClick={() => setIsLogin(true)}
          className={`flex-1 py-3 text-sm font-sans uppercase tracking-wider border transition-all duration-300 ${
            isLogin 
              ? 'border-stark bg-stark text-void' 
              : 'border-steel hover:border-stark'
          }`}
          style={{ color: isLogin ? undefined : '#CCCCCC' }}
        >
          Sign In
        </button>
        <button
          onClick={() => setIsLogin(false)}
          className={`flex-1 py-3 text-sm font-sans uppercase tracking-wider border transition-all duration-300 ${
            !isLogin 
              ? 'border-stark bg-stark text-void' 
              : 'border-steel hover:border-stark'
          }`}
          style={{ color: !isLogin ? undefined : '#CCCCCC' }}
        >
          Sign Up
        </button>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} className="flex flex-col gap-6 opacity-0 animate-fade-in" style={{ animationDelay: '200ms', animationFillMode: 'forwards' }}>
        <div>
          <label className="block text-xs uppercase tracking-wider font-sans font-semibold mb-2" style={{ color: '#CCCCCC' }}>
            Email
          </label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full bg-transparent border border-steel px-4 py-3 text-stark font-sans focus:border-stark focus:outline-none transition-colors duration-300"
            placeholder="your@email.com"
            style={{ '::placeholder': { color: '#666666' } } as any}
            required
          />
        </div>

        <div>
          <label className="block text-xs uppercase tracking-wider font-sans font-semibold mb-2" style={{ color: '#CCCCCC' }}>
            Password
          </label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full bg-transparent border border-steel px-4 py-3 text-stark font-sans focus:border-stark focus:outline-none transition-colors duration-300"
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
      <p className="text-center text-xs font-sans mt-8 tracking-wide" style={{ color: '#888888' }}>
        By continuing, you accept our terms of courage.
      </p>
    </div>
  );
}
