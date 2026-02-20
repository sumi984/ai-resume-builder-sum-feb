import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { useToast } from "@/hooks/use-toast";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Plus, FileText, MoreVertical, Copy, Trash2, Pencil } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

interface Resume {
  id: string;
  title: string;
  updated_at: string;
}

const Dashboard = () => {
  const [resumes, setResumes] = useState<Resume[]>([]);
  const [loading, setLoading] = useState(true);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const navigate = useNavigate();
  const { toast } = useToast();

  const fetchResumes = async () => {
    const { data, error } = await supabase
      .from("resumes")
      .select("id, title, updated_at")
      .order("updated_at", { ascending: false });
    if (error) {
      toast({ title: "Error loading resumes", description: error.message, variant: "destructive" });
    } else {
      setResumes(data ?? []);
    }
    setLoading(false);
  };

  useEffect(() => { fetchResumes(); }, []);

  const createResume = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;
    const { data, error } = await supabase
      .from("resumes")
      .insert({ user_id: user.id, title: "Untitled Resume", content: {} })
      .select("id")
      .single();
    if (error) {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    } else if (data) {
      navigate(`/builder/${data.id}`);
    }
  };

  const duplicateResume = async (id: string) => {
    const original = resumes.find((r) => r.id === id);
    if (!original) return;
    const { data: fullResume } = await supabase.from("resumes").select("*").eq("id", id).single();
    if (!fullResume) return;
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;
    const { error } = await supabase.from("resumes").insert({
      user_id: user.id,
      title: `${fullResume.title} (Copy)`,
      content: fullResume.content,
    });
    if (error) {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    } else {
      toast({ title: "Duplicated!" });
      fetchResumes();
    }
  };

  const deleteResume = async () => {
    if (!deleteId) return;
    const { error } = await supabase.from("resumes").delete().eq("id", deleteId);
    if (error) {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    } else {
      toast({ title: "Resume deleted" });
      fetchResumes();
    }
    setDeleteId(null);
  };

  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      <main className="flex-1 py-10">
        <div className="container mx-auto px-4">
          <div className="mb-8 flex items-center justify-between">
            <h1 className="text-3xl font-bold">My Resumes</h1>
            <Button onClick={createResume} className="gradient-primary border-0">
              <Plus className="mr-1 h-4 w-4" /> New Resume
            </Button>
          </div>

          {loading ? (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {[1, 2, 3].map((i) => <Skeleton key={i} className="h-40 rounded-xl" />)}
            </div>
          ) : resumes.length === 0 ? (
            <Card className="mx-auto max-w-md border-dashed">
              <CardContent className="flex flex-col items-center gap-4 py-12 text-center">
                <div className="rounded-xl bg-accent p-4">
                  <FileText className="h-8 w-8 text-primary" />
                </div>
                <h2 className="text-xl font-semibold">No resumes yet</h2>
                <p className="text-muted-foreground">Create your first AI-powered resume to get started.</p>
                <Button onClick={createResume} className="gradient-primary border-0">
                  <Plus className="mr-1 h-4 w-4" /> Create Resume
                </Button>
              </CardContent>
            </Card>
          ) : (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {resumes.map((r) => (
                <Card
                  key={r.id}
                  className="group cursor-pointer transition-shadow hover:shadow-lg hover:shadow-primary/5"
                  onClick={() => navigate(`/builder/${r.id}`)}
                >
                  <CardContent className="flex items-start justify-between p-6">
                    <div className="flex items-start gap-3">
                      <div className="mt-1 rounded-lg bg-accent p-2">
                        <FileText className="h-5 w-5 text-primary" />
                      </div>
                      <div>
                        <h3 className="font-semibold">{r.title}</h3>
                        <p className="text-sm text-muted-foreground">
                          Updated {new Date(r.updated_at).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild onClick={(e) => e.stopPropagation()}>
                        <Button variant="ghost" size="icon" className="opacity-0 group-hover:opacity-100">
                          <MoreVertical className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end" onClick={(e) => e.stopPropagation()}>
                        <DropdownMenuItem onClick={() => navigate(`/builder/${r.id}`)}>
                          <Pencil className="mr-2 h-4 w-4" /> Edit
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => duplicateResume(r.id)}>
                          <Copy className="mr-2 h-4 w-4" /> Duplicate
                        </DropdownMenuItem>
                        <DropdownMenuItem className="text-destructive" onClick={() => setDeleteId(r.id)}>
                          <Trash2 className="mr-2 h-4 w-4" /> Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </main>
      <Footer />

      <AlertDialog open={!!deleteId} onOpenChange={() => setDeleteId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Resume?</AlertDialogTitle>
            <AlertDialogDescription>This action cannot be undone.</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={deleteResume} className="bg-destructive text-destructive-foreground">
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default Dashboard;
