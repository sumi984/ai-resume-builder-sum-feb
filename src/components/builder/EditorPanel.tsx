import { GenerateButton, ImproveButton } from "@/components/builder/AIToolbar";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { Plus, Trash2, ChevronDown, GripVertical, X } from "lucide-react";
import { useState, KeyboardEvent } from "react";
import type { ResumeData } from "@/types/resume";

interface EditorPanelProps {
  data: ResumeData;
  actions: any;
}

const Section = ({ title, children, defaultOpen = true }: { title: string; children: React.ReactNode; defaultOpen?: boolean }) => {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <Collapsible open={open} onOpenChange={setOpen} className="rounded-lg border bg-card">
      <CollapsibleTrigger className="flex w-full items-center justify-between p-4 font-semibold hover:bg-accent/50">
        {title}
        <ChevronDown className={`h-4 w-4 transition-transform ${open ? "rotate-180" : ""}`} />
      </CollapsibleTrigger>
      <CollapsibleContent className="px-4 pb-4">{children}</CollapsibleContent>
    </Collapsible>
  );
};

const EditorPanel = ({ data, actions }: EditorPanelProps) => {
  const [skillInput, setSkillInput] = useState("");

  const handleSkillKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && skillInput.trim()) {
      e.preventDefault();
      actions.addSkill(skillInput.trim());
      setSkillInput("");
    }
  };

  return (
    <div className="space-y-4">
      {/* Personal Info */}
      <Section title="Personal Information">
        <div className="grid gap-3 sm:grid-cols-2">
          {[
            { field: "fullName", label: "Full Name", placeholder: "John Doe" },
            { field: "email", label: "Email", placeholder: "john@example.com" },
            { field: "phone", label: "Phone", placeholder: "+1 (555) 123-4567" },
            { field: "location", label: "Location", placeholder: "New York, NY" },
            { field: "linkedin", label: "LinkedIn", placeholder: "linkedin.com/in/johndoe" },
            { field: "portfolio", label: "Portfolio", placeholder: "johndoe.com" },
          ].map(({ field, label, placeholder }) => (
            <div key={field} className="space-y-1">
              <Label className="text-xs">{label}</Label>
              <Input
                value={(data.personalInfo as any)[field]}
                onChange={(e) => actions.updatePersonalInfo(field, e.target.value)}
                placeholder={placeholder}
                className="h-9 text-sm"
              />
            </div>
          ))}
        </div>
      </Section>

      {/* Summary */}
      <Section title="Professional Summary">
        <div className="mb-2 flex gap-2">
          <GenerateButton sectionType="summary" context={`${data.personalInfo.fullName}, skills: ${data.skills.join(", ")}, experience: ${data.experience.map(e => e.title + " at " + e.company).join(", ")}`} onResult={(text) => actions.updateSummary(text)} />
          <ImproveButton text={data.summary} sectionType="summary" onResult={(text) => actions.updateSummary(text)} />
        </div>
        <Textarea
          value={data.summary}
          onChange={(e) => actions.updateSummary(e.target.value)}
          placeholder="A brief professional summary highlighting your key qualifications..."
          className="min-h-[100px] text-sm"
        />
      </Section>

      {/* Experience */}
      <Section title="Work Experience">
        {data.experience.map((exp) => (
          <div key={exp.id} className="mb-4 rounded-lg border bg-background p-3">
            <div className="mb-2 flex items-center justify-between">
              <GripVertical className="h-4 w-4 text-muted-foreground" />
              <Button variant="ghost" size="icon" className="h-7 w-7 text-destructive" onClick={() => actions.removeExperience(exp.id)}>
                <Trash2 className="h-3.5 w-3.5" />
              </Button>
            </div>
            <div className="grid gap-2 sm:grid-cols-2">
              <Input value={exp.title} onChange={(e) => actions.updateExperience(exp.id, "title", e.target.value)} placeholder="Job Title" className="h-9 text-sm" />
              <Input value={exp.company} onChange={(e) => actions.updateExperience(exp.id, "company", e.target.value)} placeholder="Company" className="h-9 text-sm" />
              <Input value={exp.location} onChange={(e) => actions.updateExperience(exp.id, "location", e.target.value)} placeholder="Location" className="h-9 text-sm" />
              <div className="flex items-center gap-2">
                <Input value={exp.startDate} onChange={(e) => actions.updateExperience(exp.id, "startDate", e.target.value)} placeholder="Start Date" className="h-9 text-sm" />
                <Input value={exp.endDate} onChange={(e) => actions.updateExperience(exp.id, "endDate", e.target.value)} placeholder="End Date" className="h-9 text-sm" disabled={exp.currentlyWorking} />
              </div>
            </div>
            <div className="mt-2 flex items-center gap-2">
              <Switch checked={exp.currentlyWorking} onCheckedChange={(v) => actions.updateExperience(exp.id, "currentlyWorking", v)} />
              <Label className="text-xs">Currently working here</Label>
            </div>
            <div className="mt-2 space-y-1.5">
              <Label className="text-xs">Bullet Points</Label>
              {exp.bullets.map((bullet, idx) => (
                <div key={idx} className="flex gap-1">
                  <Input value={bullet} onChange={(e) => actions.updateBullet(exp.id, idx, e.target.value)} placeholder="Describe your achievement..." className="h-8 text-sm" />
                  <Button variant="ghost" size="icon" className="h-8 w-8 shrink-0 text-muted-foreground" onClick={() => actions.removeBullet(exp.id, idx)}>
                    <X className="h-3 w-3" />
                  </Button>
                </div>
              ))}
              <Button variant="outline" size="sm" className="h-7 text-xs" onClick={() => actions.addBullet(exp.id)}>
                <Plus className="mr-1 h-3 w-3" /> Add Bullet
              </Button>
            </div>
          </div>
        ))}
        <Button variant="outline" onClick={actions.addExperience} className="w-full">
          <Plus className="mr-1 h-4 w-4" /> Add Experience
        </Button>
      </Section>

      {/* Education */}
      <Section title="Education">
        {data.education.map((edu) => (
          <div key={edu.id} className="mb-3 rounded-lg border bg-background p-3">
            <div className="mb-2 flex justify-end">
              <Button variant="ghost" size="icon" className="h-7 w-7 text-destructive" onClick={() => actions.removeEducation(edu.id)}>
                <Trash2 className="h-3.5 w-3.5" />
              </Button>
            </div>
            <div className="grid gap-2 sm:grid-cols-2">
              <Input value={edu.degree} onChange={(e) => actions.updateEducation(edu.id, "degree", e.target.value)} placeholder="Degree" className="h-9 text-sm" />
              <Input value={edu.school} onChange={(e) => actions.updateEducation(edu.id, "school", e.target.value)} placeholder="School" className="h-9 text-sm" />
              <Input value={edu.location} onChange={(e) => actions.updateEducation(edu.id, "location", e.target.value)} placeholder="Location" className="h-9 text-sm" />
              <div className="flex gap-2">
                <Input value={edu.startDate} onChange={(e) => actions.updateEducation(edu.id, "startDate", e.target.value)} placeholder="Start" className="h-9 text-sm" />
                <Input value={edu.endDate} onChange={(e) => actions.updateEducation(edu.id, "endDate", e.target.value)} placeholder="End" className="h-9 text-sm" />
              </div>
            </div>
          </div>
        ))}
        <Button variant="outline" onClick={actions.addEducation} className="w-full">
          <Plus className="mr-1 h-4 w-4" /> Add Education
        </Button>
      </Section>

      {/* Skills */}
      <Section title="Skills">
        <div className="mb-2 flex flex-wrap gap-1.5">
          {data.skills.map((skill) => (
            <Badge key={skill} variant="secondary" className="gap-1 pr-1">
              {skill}
              <button onClick={() => actions.removeSkill(skill)} className="rounded-full p-0.5 hover:bg-muted">
                <X className="h-3 w-3" />
              </button>
            </Badge>
          ))}
        </div>
        <Input
          value={skillInput}
          onChange={(e) => setSkillInput(e.target.value)}
          onKeyDown={handleSkillKeyDown}
          placeholder="Type a skill and press Enter"
          className="h-9 text-sm"
        />
      </Section>

      {/* Projects */}
      <Section title="Projects" defaultOpen={false}>
        {data.projects.map((proj) => (
          <div key={proj.id} className="mb-3 rounded-lg border bg-background p-3">
            <div className="mb-2 flex justify-end">
              <Button variant="ghost" size="icon" className="h-7 w-7 text-destructive" onClick={() => actions.removeProject(proj.id)}>
                <Trash2 className="h-3.5 w-3.5" />
              </Button>
            </div>
            <div className="grid gap-2 sm:grid-cols-2">
              <Input value={proj.name} onChange={(e) => actions.updateProject(proj.id, "name", e.target.value)} placeholder="Project Name" className="h-9 text-sm" />
              <Input value={proj.url} onChange={(e) => actions.updateProject(proj.id, "url", e.target.value)} placeholder="URL" className="h-9 text-sm" />
            </div>
            <Textarea value={proj.description} onChange={(e) => actions.updateProject(proj.id, "description", e.target.value)} placeholder="Brief description" className="mt-2 min-h-[60px] text-sm" />
            <div className="mt-2 space-y-1.5">
              {proj.bullets.map((b, i) => (
                <div key={i} className="flex gap-1">
                  <Input value={b} onChange={(e) => actions.updateProjectBullet(proj.id, i, e.target.value)} placeholder="Bullet point" className="h-8 text-sm" />
                  <Button variant="ghost" size="icon" className="h-8 w-8 shrink-0" onClick={() => actions.removeProjectBullet(proj.id, i)}>
                    <X className="h-3 w-3" />
                  </Button>
                </div>
              ))}
              <Button variant="outline" size="sm" className="h-7 text-xs" onClick={() => actions.addProjectBullet(proj.id)}>
                <Plus className="mr-1 h-3 w-3" /> Add Bullet
              </Button>
            </div>
          </div>
        ))}
        <Button variant="outline" onClick={actions.addProject} className="w-full">
          <Plus className="mr-1 h-4 w-4" /> Add Project
        </Button>
      </Section>

      {/* Certifications */}
      <Section title="Certifications" defaultOpen={false}>
        {data.certifications.map((cert) => (
          <div key={cert.id} className="mb-3 rounded-lg border bg-background p-3">
            <div className="mb-2 flex justify-end">
              <Button variant="ghost" size="icon" className="h-7 w-7 text-destructive" onClick={() => actions.removeCertification(cert.id)}>
                <Trash2 className="h-3.5 w-3.5" />
              </Button>
            </div>
            <div className="grid gap-2 sm:grid-cols-3">
              <Input value={cert.name} onChange={(e) => actions.updateCertification(cert.id, "name", e.target.value)} placeholder="Name" className="h-9 text-sm" />
              <Input value={cert.issuer} onChange={(e) => actions.updateCertification(cert.id, "issuer", e.target.value)} placeholder="Issuer" className="h-9 text-sm" />
              <Input value={cert.date} onChange={(e) => actions.updateCertification(cert.id, "date", e.target.value)} placeholder="Date" className="h-9 text-sm" />
            </div>
          </div>
        ))}
        <Button variant="outline" onClick={actions.addCertification} className="w-full">
          <Plus className="mr-1 h-4 w-4" /> Add Certification
        </Button>
      </Section>
    </div>
  );
};

export default EditorPanel;
