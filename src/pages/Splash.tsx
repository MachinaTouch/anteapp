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
      }, 2500);
      return () => clearTimeout(redirectTimer);
    }
  }, [user, loading, navigate]);

  return (
    <div className="max-w-md mx-auto min-h-screen bg-background flex flex-col items-center justify-center px-6">
      <div className={`flex flex-col items-center transition-all duration-700 ${showContent ? 'opacity-100 scale-100' : 'opacity-0 scale-95'}`}>
        <div className="w-24 h-24 border-2 border-foreground flex items-center justify-center mb-6 animate-border-pulse">
          <span className="font-black text-4xl">A</span>
        </div>
        <h1 className="font-black text-5xl tracking-tight mb-3">ANTE</h1>
        <p className="text-muted-foreground text-sm text-center font-mono uppercase tracking-wider">Risk Registry</p>
      </div>

      <div className={`mt-16 transition-all duration-700 delay-500 ${showContent ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
        <div className="border border-border p-6 max-w-xs">
          <p className="text-center text-sm leading-relaxed mb-4">
            Courage is not the absence of fear.<br />
            It is action in the presence of it.
          </p>
          <div className="flex justify-center">
            <div className="w-12 h-[1px] bg-border"></div>
          </div>
        </div>
      </div>

      <div className={`absolute bottom-12 transition-all duration-700 delay-1000 ${showContent ? 'opacity-100' : 'opacity-0'}`}>
        <div className="flex items-center gap-2">
          <div className="w-1 h-1 bg-foreground animate-pulse"></div>
          <span className="text-xs font-mono text-muted-foreground">Loading</span>
        </div>
      </div>
    </div>
  );
}
