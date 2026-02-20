import { FileText } from "lucide-react";

const Footer = () => (
  <footer className="border-t bg-muted/40 py-8">
    <div className="container mx-auto flex flex-col items-center gap-4 px-4 text-center text-sm text-muted-foreground md:flex-row md:justify-between md:text-left">
      <div className="flex items-center gap-2 font-semibold text-foreground">
        <FileText className="h-5 w-5 text-primary" />
        ResumeAI
      </div>
      <p>© {new Date().getFullYear()} ResumeAI. Build better resumes with AI.</p>
    </div>
  </footer>
);

export default Footer;
