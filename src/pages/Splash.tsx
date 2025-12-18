import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';

export default function Splash() {
  const navigate = useNavigate();
  const { user, loading } = useAuth();
  const [showContent, setShowContent] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setShowContent(true), 100);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (!loading) {
      const redirectTimer = setTimeout(() => {
        if (user) {
          navigate('/arena');
        } else {
          navigate('/auth');
        }
      }, 3000);
      return () => clearTimeout(redirectTimer);
    }
  }, [user, loading, navigate]);

  return (
    <div className="max-w-md mx-auto min-h-screen bg-void flex flex-col items-center justify-center px-6 overflow-hidden">
      {/* Main Logo Section */}
      <div className={`flex flex-col items-center opacity-0 ${showContent ? 'animate-fade-in' : ''}`}>
        {/* Logo Box */}
        <div className="w-20 h-20 border-2 border-stark flex items-center justify-center mb-6 animate-border-pulse">
          <span className="font-sans font-black text-4xl text-stark">A</span>
        </div>
        
        {/* Title */}
        <h1 className="font-sans font-black text-5xl tracking-tight text-stark mb-2">ANTE</h1>
        
        {/* Tagline with decorative lines */}
        <div className="flex items-center gap-3 mt-2 opacity-0 animate-fade-in" style={{ animationDelay: '400ms', animationFillMode: 'forwards' }}>
          <div className="w-8 h-[1px] bg-ghost"></div>
          <p className="text-ghost text-xs font-sans uppercase tracking-[0.2em]">Place Your Courage</p>
          <div className="w-8 h-[1px] bg-ghost"></div>
        </div>
      </div>

      {/* Philosophy Section */}
      <div 
        className="mt-16 max-w-xs opacity-0 animate-slide-up"
        style={{ animationDelay: '800ms', animationFillMode: 'forwards' }}
      >
        <div className="text-center space-y-1">
          <p className="text-ghost text-sm font-sans leading-relaxed">Track your risks.</p>
          <p className="text-ghost text-sm font-sans leading-relaxed">Build your courage.</p>
          <p className="text-ghost text-sm font-sans leading-relaxed">Trust your intuition.</p>
        </div>
      </div>

      {/* Loading Indicator */}
      <div 
        className="absolute bottom-16 flex flex-col items-center gap-4 opacity-0 animate-fade-in"
        style={{ animationDelay: '1200ms', animationFillMode: 'forwards' }}
      >
        {/* Three dots loading animation */}
        <div className="flex items-center gap-2">
          <div className="w-1.5 h-1.5 bg-stark rounded-full animate-pulse-glow"></div>
          <div className="w-1.5 h-1.5 bg-stark rounded-full animate-pulse-glow" style={{ animationDelay: '200ms' }}></div>
          <div className="w-1.5 h-1.5 bg-stark rounded-full animate-pulse-glow" style={{ animationDelay: '400ms' }}></div>
        </div>
        <span className="text-xs font-sans text-ghost uppercase tracking-[0.15em]">Initializing</span>
      </div>
    </div>
  );
}
