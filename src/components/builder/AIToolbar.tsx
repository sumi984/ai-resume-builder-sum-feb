import { useState } from "react";
import { streamAI, callAI } from "@/lib/ai";
import { ResumeData } from "@/types/resume";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { useToast } from "@/hooks/use-toast";
import {
  Sparkles,
  Wand2,
  Target,
  MessageCircle,
  ChevronDown,
  Loader2,
  Send,
  CheckCircle,
  AlertTriangle,
  XCircle,
} from "lucide-react";

interface AIToolbarProps {
  data: ResumeData;
  onUpdateSummary: (summary: string) => void;
}

// Generate Summary
export const GenerateButton = ({ sectionType, context, onResult }: { sectionType: string; context: string; onResult: (text: string) => void }) => {
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const generate = async () => {
    setLoading(true);
    let result = "";
    await streamAI({
      functionName: "ai-generate",
      body: { sectionType, context },
      onDelta: (chunk) => { result += chunk; onResult(result); },
      onDone: () => setLoading(false),
      onError: (msg) => { toast({ title: "AI Error", description: msg, variant: "destructive" }); setLoading(false); },
    });
  };

  return (
    <Button variant="outline" size="sm" className="h-7 gap-1 text-xs text-primary" onClick={generate} disabled={loading}>
      {loading ? <Loader2 className="h-3 w-3 animate-spin" /> : <Sparkles className="h-3 w-3" />}
      Generate
    </Button>
  );
};

// Improve text
export const ImproveButton = ({ text, sectionType, onResult }: { text: string; sectionType: string; onResult: (text: string) => void }) => {
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const improve = async () => {
    if (!text.trim()) { toast({ title: "No text to improve" }); return; }
    setLoading(true);
    let result = "";
    await streamAI({
      functionName: "ai-improve",
      body: { text, sectionType },
      onDelta: (chunk) => { result += chunk; onResult(result); },
      onDone: () => setLoading(false),
      onError: (msg) => { toast({ title: "AI Error", description: msg, variant: "destructive" }); setLoading(false); },
    });
  };

  return (
    <Button variant="outline" size="sm" className="h-7 gap-1 text-xs text-primary" onClick={improve} disabled={loading}>
      {loading ? <Loader2 className="h-3 w-3 animate-spin" /> : <Wand2 className="h-3 w-3" />}
      Improve
    </Button>
  );
};

// ATS Score Panel
export const ATSScorePanel = ({ data }: { data: ResumeData }) => {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [score, setScore] = useState<any>(null);
  const [jobDesc, setJobDesc] = useState("");
  const { toast } = useToast();

  const analyze = async () => {
    setLoading(true);
    try {
      const result = await callAI("ai-ats-score", { resume: data, jobDescription: jobDesc });
      setScore(result);
    } catch (e: any) {
      toast({ title: "AI Error", description: e.message, variant: "destructive" });
    }
    setLoading(false);
  };

  const scoreColor = score?.score >= 80 ? "text-green-600" : score?.score >= 60 ? "text-yellow-600" : "text-red-600";
  const ScoreIcon = score?.score >= 80 ? CheckCircle : score?.score >= 60 ? AlertTriangle : XCircle;

  return (
    <Collapsible open={open} onOpenChange={setOpen}>
      <CollapsibleTrigger asChild>
        <Button variant="outline" size="sm" className="h-8 gap-1">
          <Target className="h-3.5 w-3.5" /> ATS Score
          <ChevronDown className={`h-3 w-3 transition-transform ${open ? "rotate-180" : ""}`} />
        </Button>
      </CollapsibleTrigger>
      <CollapsibleContent className="absolute right-0 top-full z-50 mt-2 w-80 rounded-lg border bg-card p-4 shadow-lg">
        <div className="space-y-3">
          <Textarea value={jobDesc} onChange={(e) => setJobDesc(e.target.value)} placeholder="Paste job description (optional)..." className="min-h-[80px] text-sm" />
          <Button onClick={analyze} disabled={loading} className="w-full gradient-primary border-0" size="sm">
            {loading ? <Loader2 className="mr-1 h-3.5 w-3.5 animate-spin" /> : <Target className="mr-1 h-3.5 w-3.5" />}
            Analyze
          </Button>
          {score && (
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <ScoreIcon className={`h-5 w-5 ${scoreColor}`} />
                <span className={`text-2xl font-bold ${scoreColor}`}>{score.score}</span>
                <span className="text-sm text-muted-foreground">/ 100</span>
              </div>
              {score.suggestions?.length > 0 && (
                <div>
                  <p className="mb-1 text-xs font-semibold">Suggestions:</p>
                  <ul className="space-y-1 text-xs text-muted-foreground">
                    {score.suggestions.map((s: string, i: number) => <li key={i}>• {s}</li>)}
                  </ul>
                </div>
              )}
              {score.matchedKeywords?.length > 0 && (
                <div>
                  <p className="mb-1 text-xs font-semibold text-green-600">Matched Keywords:</p>
                  <div className="flex flex-wrap gap-1">{score.matchedKeywords.map((k: string) => <Badge key={k} variant="secondary" className="text-xs">{k}</Badge>)}</div>
                </div>
              )}
              {score.missingKeywords?.length > 0 && (
                <div>
                  <p className="mb-1 text-xs font-semibold text-red-600">Missing Keywords:</p>
                  <div className="flex flex-wrap gap-1">{score.missingKeywords.map((k: string) => <Badge key={k} variant="outline" className="text-xs">{k}</Badge>)}</div>
                </div>
              )}
            </div>
          )}
        </div>
      </CollapsibleContent>
    </Collapsible>
  );
};

// Chat Sidebar
type ChatMsg = { role: "user" | "assistant"; content: string };

export const ChatSidebar = ({ data }: { data: ResumeData }) => {
  const [messages, setMessages] = useState<ChatMsg[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const send = async () => {
    if (!input.trim() || loading) return;
    const userMsg: ChatMsg = { role: "user", content: input };
    const newMessages = [...messages, userMsg];
    setMessages(newMessages);
    setInput("");
    setLoading(true);

    let assistantSoFar = "";
    const upsert = (chunk: string) => {
      assistantSoFar += chunk;
      setMessages((prev) => {
        const last = prev[prev.length - 1];
        if (last?.role === "assistant") {
          return prev.map((m, i) => (i === prev.length - 1 ? { ...m, content: assistantSoFar } : m));
        }
        return [...prev, { role: "assistant", content: assistantSoFar }];
      });
    };

    await streamAI({
      functionName: "ai-chat",
      body: { messages: newMessages, resume: data },
      onDelta: upsert,
      onDone: () => setLoading(false),
      onError: (msg) => { toast({ title: "AI Error", description: msg, variant: "destructive" }); setLoading(false); },
    });
  };

  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="outline" size="sm" className="h-8 gap-1">
          <MessageCircle className="h-3.5 w-3.5" /> AI Coach
        </Button>
      </SheetTrigger>
      <SheetContent className="flex w-full flex-col sm:max-w-md">
        <SheetHeader>
          <SheetTitle className="flex items-center gap-2"><Sparkles className="h-5 w-5 text-primary" /> AI Resume Coach</SheetTitle>
        </SheetHeader>
        <ScrollArea className="flex-1 pr-2">
          <div className="space-y-4 py-4">
            {messages.length === 0 && (
              <p className="text-center text-sm text-muted-foreground">Ask me anything about your resume! I can help improve sections, suggest skills, or give career advice.</p>
            )}
            {messages.map((msg, i) => (
              <div key={i} className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
                <div className={`max-w-[85%] rounded-lg px-3 py-2 text-sm ${msg.role === "user" ? "bg-primary text-primary-foreground" : "bg-muted"}`}>
                  {msg.content}
                </div>
              </div>
            ))}
            {loading && messages[messages.length - 1]?.role !== "assistant" && (
              <div className="flex justify-start">
                <div className="rounded-lg bg-muted px-3 py-2"><Loader2 className="h-4 w-4 animate-spin" /></div>
              </div>
            )}
          </div>
        </ScrollArea>
        <div className="flex gap-2 border-t pt-3">
          <Textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); send(); } }}
            placeholder="Ask about your resume..."
            className="min-h-[40px] text-sm"
          />
          <Button onClick={send} disabled={loading || !input.trim()} size="icon" className="shrink-0 gradient-primary border-0">
            <Send className="h-4 w-4" />
          </Button>
        </div>
      </SheetContent>
    </Sheet>
  );
};
