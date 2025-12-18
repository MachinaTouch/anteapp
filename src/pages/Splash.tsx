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

  const handleGetStarted = () => {
    if (user) {
      navigate('/arena');
    } else {
      navigate('/auth');
    }
  };

  return (
    <div className="max-w-md mx-auto min-h-screen flex flex-col items-center px-6 py-12 overflow-hidden" style={{ backgroundColor: '#050505' }}>
      {/* Top Section - Logo */}
      <div className={`flex flex-col items-center opacity-0 ${showContent ? 'animate-fade-in' : ''}`}>
        {/* Logo Box */}
        <div className="w-32 h-32 border-2 border-steel flex items-center justify-center mb-6">
          <span className="font-sans font-black text-6xl text-stark">A</span>
        </div>
        
        {/* Title */}
        <h1 className="font-sans font-black text-5xl tracking-tight text-stark mb-2">ANTE</h1>
        
        {/* Tagline with decorative lines */}
        <div className="flex items-center gap-3 mt-1">
          <div className="w-6 h-[1px]" style={{ backgroundColor: '#666666' }}></div>
          <p className="text-xs font-sans uppercase tracking-[0.3em]" style={{ color: '#888888' }}>Place Your Courage</p>
          <div className="w-6 h-[1px]" style={{ backgroundColor: '#666666' }}></div>
        </div>
      </div>

      {/* Philosophy Text - Light Grey (#CCCCCC) */}
      <div 
        className="mt-12 text-center opacity-0 animate-fade-in"
        style={{ animationDelay: '400ms', animationFillMode: 'forwards' }}
      >
        <p className="text-lg font-sans leading-relaxed" style={{ color: '#CCCCCC' }}>Track your risks.</p>
        <p className="text-lg font-sans leading-relaxed mt-1" style={{ color: '#CCCCCC' }}>Build your courage.</p>
        <p className="text-lg font-sans leading-relaxed mt-1" style={{ color: '#CCCCCC' }}>Trust your intuition.</p>
      </div>

      {/* Spacer */}
      <div className="flex-1" />

      {/* Loading Indicator - Light Grey (#CCCCCC) */}
      <div 
        className="flex flex-col items-center gap-3 mb-4 opacity-0 animate-fade-in"
        style={{ animationDelay: '800ms', animationFillMode: 'forwards' }}
      >
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 animate-pulse" style={{ backgroundColor: '#CCCCCC' }}></div>
          <div className="w-2 h-2 animate-pulse" style={{ backgroundColor: '#CCCCCC', animationDelay: '200ms' }}></div>
          <div className="w-2 h-2 animate-pulse" style={{ backgroundColor: '#CCCCCC', animationDelay: '400ms' }}></div>
        </div>
        <span className="text-xs font-sans uppercase tracking-[0.2em]" style={{ color: '#CCCCCC' }}>Initializing</span>
      </div>

      {/* Stats Section */}
      <div 
        className="w-full opacity-0 animate-slide-up"
        style={{ animationDelay: '600ms', animationFillMode: 'forwards' }}
      >
        <div className="border border-steel grid grid-cols-3 divide-x divide-steel">
          {/* Members */}
          <div className="p-4 text-center">
            <p className="font-mono font-bold text-2xl text-stark">1K+</p>
            <p className="text-xs font-sans uppercase tracking-wider mt-1" style={{ color: '#CCCCCC' }}>Members</p>
          </div>
          
          {/* Risks */}
          <div className="p-4 text-center">
            <p className="font-mono font-bold text-2xl text-stark">50K+</p>
            <p className="text-xs font-sans uppercase tracking-wider mt-1" style={{ color: '#CCCCCC' }}>Risks</p>
          </div>
          
          {/* Accuracy */}
          <div className="p-4 text-center">
            <p className="font-mono font-bold text-2xl text-stark">78%</p>
            <p className="text-xs font-sans uppercase tracking-wider mt-1" style={{ color: '#CCCCCC' }}>Accuracy</p>
          </div>
        </div>
      </div>

      {/* Footer - Get Started Button */}
      <div 
        className="w-full mt-6 opacity-0 animate-slide-up"
        style={{ animationDelay: '1000ms', animationFillMode: 'forwards' }}
      >
        <button
          onClick={handleGetStarted}
          disabled={loading}
          className="w-full bg-stark text-void font-sans font-bold text-base uppercase tracking-wider py-5 hover:bg-ghost transition-colors duration-200 disabled:opacity-50"
        >
          GET STARTED
        </button>
        <p className="text-xs font-sans text-center mt-4 tracking-wide" style={{ color: '#CCCCCC' }}>Tap to enter The Arena</p>
      </div>
    </div>
  );
}
