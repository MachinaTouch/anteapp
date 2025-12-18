import { useNavigate } from 'react-router-dom';
import { ArrowLeft, HelpCircle, Mail } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function HelpSettings() {
  const navigate = useNavigate();

  const handleContactSupport = () => {
    window.location.href = 'mailto:support@ante.app';
  };

  return (
    <div className="max-w-md mx-auto min-h-screen bg-background">
      <header className="fixed top-0 left-0 right-0 max-w-md mx-auto bg-background border-b border-border z-50">
        <div className="px-6 py-5 flex items-center justify-between">
          <button onClick={() => navigate('/settings')} className="text-muted-foreground hover:text-foreground transition-colors">
            <ArrowLeft className="w-5 h-5" />
          </button>
          <h1 className="font-black text-xl tracking-tight">HELP CENTER</h1>
          <div className="w-5"></div>
        </div>
      </header>

      <main className="pt-[73px] pb-8 px-6">
        <div className="py-6 space-y-6">
          <div className="flex items-start gap-4 p-6 border border-border bg-secondary/20">
            <HelpCircle className="w-6 h-6 text-muted-foreground flex-shrink-0 mt-0.5" />
            <div>
              <h3 className="font-semibold mb-2">Need Help?</h3>
              <p className="text-muted-foreground text-sm leading-relaxed">
                Having trouble with the app or have questions about your risks? 
                Our support team is here to help you on your journey of courage.
              </p>
            </div>
          </div>

          <Button
            onClick={handleContactSupport}
            className="w-full"
          >
            <Mail className="w-4 h-4 mr-2" />
            Contact Support
          </Button>
        </div>
      </main>
    </div>
  );
}
