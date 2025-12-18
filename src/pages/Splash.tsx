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

  const handleEnterArena = () => {
    if (user) {
      navigate('/arena');
    } else {
      navigate('/auth');
    }
  };

  return (
    <div className="max-w-md mx-auto min-h-screen bg-void flex flex-col px-6 py-12 overflow-hidden">
      {/* Top Section - Logo */}
      <div className={`flex flex-col items-center opacity-0 ${showContent ? 'animate-fade-in' : ''}`}>
        {/* Logo Box */}
        <div className="w-24 h-24 border-2 border-stark flex items-center justify-center mb-6 animate-border-pulse">
          <span className="font-sans font-black text-5xl text-stark">A</span>
        </div>
        
        {/* Title */}
        <h1 className="font-sans font-black text-5xl tracking-tight text-stark mb-3">ANTE</h1>
        
        {/* Tagline with decorative lines */}
        <div className="flex items-center gap-3 mt-2 opacity-0 animate-fade-in" style={{ animationDelay: '400ms', animationFillMode: 'forwards' }}>
          <div className="w-8 h-[1px] bg-ghost"></div>
          <p className="text-ghost text-xs font-sans uppercase tracking-[0.2em]">Place Your Courage</p>
          <div className="w-8 h-[1px] bg-ghost"></div>
        </div>
      </div>

      {/* Middle Section - Quote Box */}
      <div 
        className="mt-12 opacity-0 animate-slide-up"
        style={{ animationDelay: '600ms', animationFillMode: 'forwards' }}
      >
        <div className="border border-steel p-6 relative">
          {/* Quote marks */}
          <div className="absolute -top-3 left-4 bg-void px-2">
            <span className="text-ghost text-2xl font-serif">"</span>
          </div>
          
          <p className="text-ghost text-sm font-sans leading-relaxed text-center italic">
            Courage is not the absence of fear, but the willingness to act despite it. Every risk you take, every fear you face, builds the person you're becoming.
          </p>
          
          {/* Philosophy label */}
          <div className="flex items-center justify-center gap-2 mt-4 pt-4 border-t border-steel">
            <span className="text-ghost text-xs font-sans uppercase tracking-wider">The Ante Philosophy</span>
            <svg className="w-3 h-3 text-ghost" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
            </svg>
          </div>
        </div>
      </div>

      {/* Stats Section */}
      <div 
        className="mt-10 opacity-0 animate-slide-up"
        style={{ animationDelay: '900ms', animationFillMode: 'forwards' }}
      >
        <div className="grid grid-cols-3 gap-3">
          {/* Members */}
          <div className="border border-steel p-4 text-center">
            <p className="font-mono font-bold text-2xl text-stark">1K+</p>
            <p className="text-ghost text-xs font-sans uppercase tracking-wider mt-1">Members</p>
          </div>
          
          {/* Risks */}
          <div className="border border-steel p-4 text-center">
            <p className="font-mono font-bold text-2xl text-stark">50K+</p>
            <p className="text-ghost text-xs font-sans uppercase tracking-wider mt-1">Risks</p>
          </div>
          
          {/* Accuracy */}
          <div className="border border-steel p-4 text-center">
            <p className="font-mono font-bold text-2xl text-stark">78%</p>
            <p className="text-ghost text-xs font-sans uppercase tracking-wider mt-1">Accuracy</p>
          </div>
        </div>
      </div>

      {/* Spacer */}
      <div className="flex-1" />

      {/* Footer - Enter Button */}
      <div 
        className="mt-8 opacity-0 animate-slide-up"
        style={{ animationDelay: '1200ms', animationFillMode: 'forwards' }}
      >
        <button
          onClick={handleEnterArena}
          disabled={loading}
          className="w-full bg-stark text-void font-sans font-bold text-sm uppercase tracking-wider py-4 px-6 hover:bg-ghost transition-colors duration-200 disabled:opacity-50"
        >
          {loading ? 'Loading...' : 'Enter The Arena'}
        </button>
      </div>
    </div>
  );
}
