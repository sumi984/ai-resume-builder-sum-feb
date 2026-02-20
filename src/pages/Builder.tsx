import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useResumeState } from "@/hooks/useResumeState";
import { useAutoSave } from "@/hooks/useAutoSave";
import { ResumeData, emptyResume } from "@/types/resume";
import EditorPanel from "@/components/builder/EditorPanel";
import ResumePreview from "@/components/builder/ResumePreview";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { useToast } from "@/hooks/use-toast";
import { ArrowLeft, Save, Download, Eye, PenLine, Check, Loader2, AlertCircle } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { ATSScorePanel, ChatSidebar } from "@/components/builder/AIToolbar";

const Builder = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);
  const [title, setTitle] = useState("Untitled Resume");
  const [mobileTab, setMobileTab] = useState<"editor" | "preview">("editor");

  const {
    data, setData,
    updatePersonalInfo, updateSummary,
    addExperience, updateExperience, removeExperience,
    addBullet, updateBullet, removeBullet,
    addEducation, updateEducation, removeEducation,
    addSkill, removeSkill,
    addCertification, updateCertification, removeCertification,
    addProject, updateProject, removeProject,
    addProjectBullet, updateProjectBullet, removeProjectBullet,
  } = useResumeState();

  const { status, save } = useAutoSave(id!, data, title);

  useEffect(() => {
    const load = async () => {
      const { data: resume, error } = await supabase
        .from("resumes")
        .select("*")
        .eq("id", id!)
        .single();
      if (error || !resume) {
        toast({ title: "Resume not found", variant: "destructive" });
        navigate("/dashboard");
        return;
      }
      setTitle(resume.title);
      const content = resume.content as unknown as ResumeData;
      setData(content && Object.keys(content).length > 0 ? content : emptyResume);
      setLoading(false);
    };
    load();
  }, [id]);

  const handleDownloadPdf = async () => {
    const el = document.getElementById("resume-preview");
    if (!el) return;
    const html2pdf = (await import("html2pdf.js")).default;
    html2pdf().set({
      margin: 0,
      filename: `${title || "resume"}.pdf`,
      image: { type: "jpeg", quality: 0.98 },
      html2canvas: { scale: 2, useCORS: true },
      jsPDF: { unit: "mm", format: "a4", orientation: "portrait" },
    }).from(el).save();
    toast({ title: "PDF downloaded!" });
  };

  const statusIcon = status === "saved" ? <Check className="h-3.5 w-3.5 text-green-500" /> : status === "saving" ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <AlertCircle className="h-3.5 w-3.5 text-yellow-500" />;

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <Skeleton className="h-12 w-48" />
      </div>
    );
  }

  const actions = {
    updatePersonalInfo, updateSummary,
    addExperience, updateExperience, removeExperience,
    addBullet, updateBullet, removeBullet,
    addEducation, updateEducation, removeEducation,
    addSkill, removeSkill,
    addCertification, updateCertification, removeCertification,
    addProject, updateProject, removeProject,
    addProjectBullet, updateProjectBullet, removeProjectBullet,
  };

  return (
    <div className="flex h-screen flex-col">
      {/* Toolbar */}
      <header className="flex items-center gap-2 border-b bg-background px-4 py-2">
        <Button variant="ghost" size="icon" onClick={() => navigate("/dashboard")}>
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <Input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="h-8 max-w-[200px] border-0 bg-transparent text-sm font-semibold shadow-none focus-visible:ring-0"
        />
        <div className="flex items-center gap-1 text-xs text-muted-foreground">
          {statusIcon}
          <span className="hidden sm:inline">{status === "saved" ? "Saved" : status === "saving" ? "Saving..." : "Unsaved"}</span>
        </div>
        <div className="ml-auto flex items-center gap-2 relative">
          <div className="hidden sm:flex items-center gap-2">
            <ATSScorePanel data={data} />
            <ChatSidebar data={data} />
          </div>
          <Button variant="outline" size="sm" onClick={save} className="h-8">
            <Save className="mr-1 h-3.5 w-3.5" /> Save
          </Button>
          <Button size="sm" onClick={handleDownloadPdf} className="h-8 gradient-primary border-0">
            <Download className="mr-1 h-3.5 w-3.5" /> PDF
          </Button>
        </div>
      </header>

      {/* Mobile tab toggle */}
      <div className="flex border-b md:hidden">
        <button
          className={`flex-1 py-2 text-center text-sm font-medium ${mobileTab === "editor" ? "border-b-2 border-primary text-primary" : "text-muted-foreground"}`}
          onClick={() => setMobileTab("editor")}
        >
          <PenLine className="mr-1 inline h-4 w-4" /> Editor
        </button>
        <button
          className={`flex-1 py-2 text-center text-sm font-medium ${mobileTab === "preview" ? "border-b-2 border-primary text-primary" : "text-muted-foreground"}`}
          onClick={() => setMobileTab("preview")}
        >
          <Eye className="mr-1 inline h-4 w-4" /> Preview
        </button>
      </div>

      {/* Two-panel layout */}
      <div className="flex flex-1 overflow-hidden">
        {/* Editor */}
        <div className={`w-full overflow-y-auto border-r p-4 md:w-1/2 ${mobileTab !== "editor" ? "hidden md:block" : ""}`}>
          <ScrollArea className="h-full">
            <EditorPanel data={data} actions={actions} />
          </ScrollArea>
        </div>

        {/* Preview */}
        <div className={`w-full overflow-y-auto bg-muted/30 p-4 md:w-1/2 ${mobileTab !== "preview" ? "hidden md:block" : ""}`}>
          <ScrollArea className="h-full">
            <ResumePreview data={data} />
          </ScrollArea>
        </div>
      </div>
    </div>
  );
};

export default Builder;
