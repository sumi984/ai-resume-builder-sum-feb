import { useState, useCallback } from "react";
import { ResumeData, emptyResume, Experience, Education, Certification, Project } from "@/types/resume";

const genId = () => crypto.randomUUID();

export const useResumeState = (initial?: ResumeData) => {
  const [data, setData] = useState<ResumeData>(initial ?? emptyResume);

  const updatePersonalInfo = useCallback((field: string, value: string) => {
    setData((prev) => ({ ...prev, personalInfo: { ...prev.personalInfo, [field]: value } }));
  }, []);

  const updateSummary = useCallback((summary: string) => {
    setData((prev) => ({ ...prev, summary }));
  }, []);

  // Experience
  const addExperience = useCallback(() => {
    const entry: Experience = { id: genId(), title: "", company: "", location: "", startDate: "", endDate: "", currentlyWorking: false, bullets: [""] };
    setData((prev) => ({ ...prev, experience: [...prev.experience, entry] }));
  }, []);

  const updateExperience = useCallback((id: string, field: string, value: any) => {
    setData((prev) => ({
      ...prev,
      experience: prev.experience.map((e) => (e.id === id ? { ...e, [field]: value } : e)),
    }));
  }, []);

  const removeExperience = useCallback((id: string) => {
    setData((prev) => ({ ...prev, experience: prev.experience.filter((e) => e.id !== id) }));
  }, []);

  const addBullet = useCallback((expId: string) => {
    setData((prev) => ({
      ...prev,
      experience: prev.experience.map((e) => (e.id === expId ? { ...e, bullets: [...e.bullets, ""] } : e)),
    }));
  }, []);

  const updateBullet = useCallback((expId: string, idx: number, value: string) => {
    setData((prev) => ({
      ...prev,
      experience: prev.experience.map((e) =>
        e.id === expId ? { ...e, bullets: e.bullets.map((b, i) => (i === idx ? value : b)) } : e
      ),
    }));
  }, []);

  const removeBullet = useCallback((expId: string, idx: number) => {
    setData((prev) => ({
      ...prev,
      experience: prev.experience.map((e) =>
        e.id === expId ? { ...e, bullets: e.bullets.filter((_, i) => i !== idx) } : e
      ),
    }));
  }, []);

  // Education
  const addEducation = useCallback(() => {
    const entry: Education = { id: genId(), degree: "", school: "", location: "", startDate: "", endDate: "" };
    setData((prev) => ({ ...prev, education: [...prev.education, entry] }));
  }, []);

  const updateEducation = useCallback((id: string, field: string, value: string) => {
    setData((prev) => ({
      ...prev,
      education: prev.education.map((e) => (e.id === id ? { ...e, [field]: value } : e)),
    }));
  }, []);

  const removeEducation = useCallback((id: string) => {
    setData((prev) => ({ ...prev, education: prev.education.filter((e) => e.id !== id) }));
  }, []);

  // Skills
  const addSkill = useCallback((skill: string) => {
    setData((prev) => {
      if (prev.skills.includes(skill)) return prev;
      return { ...prev, skills: [...prev.skills, skill] };
    });
  }, []);

  const removeSkill = useCallback((skill: string) => {
    setData((prev) => ({ ...prev, skills: prev.skills.filter((s) => s !== skill) }));
  }, []);

  // Certifications
  const addCertification = useCallback(() => {
    const entry: Certification = { id: genId(), name: "", issuer: "", date: "" };
    setData((prev) => ({ ...prev, certifications: [...prev.certifications, entry] }));
  }, []);

  const updateCertification = useCallback((id: string, field: string, value: string) => {
    setData((prev) => ({
      ...prev,
      certifications: prev.certifications.map((c) => (c.id === id ? { ...c, [field]: value } : c)),
    }));
  }, []);

  const removeCertification = useCallback((id: string) => {
    setData((prev) => ({ ...prev, certifications: prev.certifications.filter((c) => c.id !== id) }));
  }, []);

  // Projects
  const addProject = useCallback(() => {
    const entry: Project = { id: genId(), name: "", description: "", url: "", bullets: [""] };
    setData((prev) => ({ ...prev, projects: [...prev.projects, entry] }));
  }, []);

  const updateProject = useCallback((id: string, field: string, value: any) => {
    setData((prev) => ({
      ...prev,
      projects: prev.projects.map((p) => (p.id === id ? { ...p, [field]: value } : p)),
    }));
  }, []);

  const removeProject = useCallback((id: string) => {
    setData((prev) => ({ ...prev, projects: prev.projects.filter((p) => p.id !== id) }));
  }, []);

  const addProjectBullet = useCallback((projId: string) => {
    setData((prev) => ({
      ...prev,
      projects: prev.projects.map((p) => (p.id === projId ? { ...p, bullets: [...p.bullets, ""] } : p)),
    }));
  }, []);

  const updateProjectBullet = useCallback((projId: string, idx: number, value: string) => {
    setData((prev) => ({
      ...prev,
      projects: prev.projects.map((p) =>
        p.id === projId ? { ...p, bullets: p.bullets.map((b, i) => (i === idx ? value : b)) } : p
      ),
    }));
  }, []);

  const removeProjectBullet = useCallback((projId: string, idx: number) => {
    setData((prev) => ({
      ...prev,
      projects: prev.projects.map((p) =>
        p.id === projId ? { ...p, bullets: p.bullets.filter((_, i) => i !== idx) } : p
      ),
    }));
  }, []);

  return {
    data,
    setData,
    updatePersonalInfo,
    updateSummary,
    addExperience, updateExperience, removeExperience,
    addBullet, updateBullet, removeBullet,
    addEducation, updateEducation, removeEducation,
    addSkill, removeSkill,
    addCertification, updateCertification, removeCertification,
    addProject, updateProject, removeProject,
    addProjectBullet, updateProjectBullet, removeProjectBullet,
  };
};
