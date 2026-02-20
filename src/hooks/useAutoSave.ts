import { useEffect, useRef, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { ResumeData } from "@/types/resume";

export type SaveStatus = "saved" | "saving" | "unsaved";

export const useAutoSave = (resumeId: string, data: ResumeData, title: string) => {
  const [status, setStatus] = useState<SaveStatus>("saved");
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const prevDataRef = useRef<string>(JSON.stringify(data));
  const prevTitleRef = useRef<string>(title);

  const save = async () => {
    setStatus("saving");
    const { error } = await supabase
      .from("resumes")
      .update({ content: data as any, title })
      .eq("id", resumeId);
    setStatus(error ? "unsaved" : "saved");
  };

  useEffect(() => {
    const currentData = JSON.stringify(data);
    if (currentData === prevDataRef.current && title === prevTitleRef.current) return;

    prevDataRef.current = currentData;
    prevTitleRef.current = title;
    setStatus("unsaved");

    if (timerRef.current) clearTimeout(timerRef.current);
    timerRef.current = setTimeout(save, 3000);

    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [data, title, resumeId]);

  return { status, save };
};
