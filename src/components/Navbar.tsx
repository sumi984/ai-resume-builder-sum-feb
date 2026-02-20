import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { FileText, LogOut, Menu, X } from "lucide-react";
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";

const Navbar = () => {
  const [user, setUser] = useState<any>(null);
  const [mobileOpen, setMobileOpen] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
    });
    return () => subscription.unsubscribe();
  }, []);

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    navigate("/");
  };

  return (
    <header className="sticky top-0 z-50 border-b bg-background/80 backdrop-blur-lg">
      <nav className="container mx-auto flex h-16 items-center justify-between px-4">
        <Link to="/" className="flex items-center gap-2 font-bold text-xl">
          <FileText className="h-6 w-6 text-primary" />
          <span className="gradient-text">ResumeAI</span>
        </Link>

        {/* Desktop */}
        <div className="hidden items-center gap-4 md:flex">
          {user ? (
            <>
              <Button variant="ghost" asChild>
                <Link to="/dashboard">My Resumes</Link>
              </Button>
              <Button variant="outline" size="sm" onClick={handleSignOut}>
                <LogOut className="mr-1 h-4 w-4" /> Sign Out
              </Button>
            </>
          ) : (
            <>
              <Button variant="ghost" asChild>
                <Link to="/auth">Sign In</Link>
              </Button>
              <Button asChild className="gradient-primary border-0">
                <Link to="/auth?tab=signup">Get Started Free</Link>
              </Button>
            </>
          )}
        </div>

        {/* Mobile */}
        <button className="md:hidden" onClick={() => setMobileOpen(!mobileOpen)}>
          {mobileOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </nav>

      {mobileOpen && (
        <div className="border-t bg-background p-4 md:hidden">
          {user ? (
            <div className="flex flex-col gap-2">
              <Button variant="ghost" asChild onClick={() => setMobileOpen(false)}>
                <Link to="/dashboard">My Resumes</Link>
              </Button>
              <Button variant="outline" onClick={() => { handleSignOut(); setMobileOpen(false); }}>
                Sign Out
              </Button>
            </div>
          ) : (
            <div className="flex flex-col gap-2">
              <Button variant="ghost" asChild onClick={() => setMobileOpen(false)}>
                <Link to="/auth">Sign In</Link>
              </Button>
              <Button asChild className="gradient-primary border-0" onClick={() => setMobileOpen(false)}>
                <Link to="/auth?tab=signup">Get Started Free</Link>
              </Button>
            </div>
          )}
        </div>
      )}
    </header>
  );
};

export default Navbar;
