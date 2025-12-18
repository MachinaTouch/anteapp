import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Shield } from 'lucide-react';

export default function PrivacySettings() {
  const navigate = useNavigate();

  return (
    <div className="max-w-md mx-auto min-h-screen bg-background">
      <header className="fixed top-0 left-0 right-0 max-w-md mx-auto bg-background border-b border-border z-50">
        <div className="px-6 py-5 flex items-center justify-between">
          <button onClick={() => navigate('/settings')} className="text-muted-foreground hover:text-foreground transition-colors">
            <ArrowLeft className="w-5 h-5" />
          </button>
          <h1 className="font-black text-xl tracking-tight">PRIVACY</h1>
          <div className="w-5"></div>
        </div>
      </header>

      <main className="pt-[73px] pb-8 px-6">
        <div className="py-6">
          <div className="flex items-start gap-4 p-6 border border-border bg-secondary/20">
            <Shield className="w-6 h-6 text-muted-foreground flex-shrink-0 mt-0.5" />
            <div>
              <h3 className="font-semibold mb-2">Your Data is Secure</h3>
              <p className="text-muted-foreground text-sm leading-relaxed">
                Your data is secure. Risks marked private are never shown to the Society. 
                We take your privacy seriously and ensure your personal wagers remain confidential.
              </p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
