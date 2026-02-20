import { ResumeData } from "@/types/resume";
import { Mail, Phone, MapPin, Linkedin, Globe } from "lucide-react";

const ResumePreview = ({ data }: { data: ResumeData }) => {
  const { personalInfo, summary, experience, education, skills, certifications, projects } = data;

  return (
    <div className="mx-auto w-full max-w-[210mm] bg-white p-8 text-[11px] leading-relaxed text-gray-900 shadow-lg" id="resume-preview">
      {/* Header */}
      <header className="mb-4 border-b-2 border-gray-800 pb-3 text-center">
        <h1 className="mb-1 text-2xl font-bold tracking-tight text-gray-900">
          {personalInfo.fullName || "Your Name"}
        </h1>
        <div className="flex flex-wrap items-center justify-center gap-3 text-[10px] text-gray-600">
          {personalInfo.email && (
            <span className="flex items-center gap-1"><Mail className="h-3 w-3" />{personalInfo.email}</span>
          )}
          {personalInfo.phone && (
            <span className="flex items-center gap-1"><Phone className="h-3 w-3" />{personalInfo.phone}</span>
          )}
          {personalInfo.location && (
            <span className="flex items-center gap-1"><MapPin className="h-3 w-3" />{personalInfo.location}</span>
          )}
          {personalInfo.linkedin && (
            <span className="flex items-center gap-1"><Linkedin className="h-3 w-3" />{personalInfo.linkedin}</span>
          )}
          {personalInfo.portfolio && (
            <span className="flex items-center gap-1"><Globe className="h-3 w-3" />{personalInfo.portfolio}</span>
          )}
        </div>
      </header>

      {/* Summary */}
      {summary && (
        <section className="mb-3">
          <h2 className="mb-1 text-xs font-bold uppercase tracking-widest text-gray-700">Professional Summary</h2>
          <p className="text-gray-700">{summary}</p>
        </section>
      )}

      {/* Experience */}
      {experience.length > 0 && (
        <section className="mb-3">
          <h2 className="mb-1 text-xs font-bold uppercase tracking-widest text-gray-700">Experience</h2>
          {experience.map((exp) => (
            <div key={exp.id} className="mb-2">
              <div className="flex items-baseline justify-between">
                <div>
                  <span className="font-semibold">{exp.title || "Position"}</span>
                  {exp.company && <span className="text-gray-600"> · {exp.company}</span>}
                </div>
                <span className="text-[10px] text-gray-500">
                  {exp.startDate}{exp.startDate && " – "}{exp.currentlyWorking ? "Present" : exp.endDate}
                </span>
              </div>
              {exp.location && <div className="text-[10px] text-gray-500">{exp.location}</div>}
              {exp.bullets.filter(Boolean).length > 0 && (
                <ul className="ml-4 mt-1 list-disc text-gray-700">
                  {exp.bullets.filter(Boolean).map((b, i) => <li key={i}>{b}</li>)}
                </ul>
              )}
            </div>
          ))}
        </section>
      )}

      {/* Education */}
      {education.length > 0 && (
        <section className="mb-3">
          <h2 className="mb-1 text-xs font-bold uppercase tracking-widest text-gray-700">Education</h2>
          {education.map((edu) => (
            <div key={edu.id} className="mb-1 flex items-baseline justify-between">
              <div>
                <span className="font-semibold">{edu.degree || "Degree"}</span>
                {edu.school && <span className="text-gray-600"> · {edu.school}</span>}
              </div>
              <span className="text-[10px] text-gray-500">{edu.startDate}{edu.startDate && " – "}{edu.endDate}</span>
            </div>
          ))}
        </section>
      )}

      {/* Skills */}
      {skills.length > 0 && (
        <section className="mb-3">
          <h2 className="mb-1 text-xs font-bold uppercase tracking-widest text-gray-700">Skills</h2>
          <p className="text-gray-700">{skills.join(" · ")}</p>
        </section>
      )}

      {/* Projects */}
      {projects.length > 0 && (
        <section className="mb-3">
          <h2 className="mb-1 text-xs font-bold uppercase tracking-widest text-gray-700">Projects</h2>
          {projects.map((proj) => (
            <div key={proj.id} className="mb-2">
              <span className="font-semibold">{proj.name || "Project"}</span>
              {proj.url && <span className="ml-2 text-[10px] text-gray-500">{proj.url}</span>}
              {proj.description && <p className="text-gray-600">{proj.description}</p>}
              {proj.bullets.filter(Boolean).length > 0 && (
                <ul className="ml-4 mt-1 list-disc text-gray-700">
                  {proj.bullets.filter(Boolean).map((b, i) => <li key={i}>{b}</li>)}
                </ul>
              )}
            </div>
          ))}
        </section>
      )}

      {/* Certifications */}
      {certifications.length > 0 && (
        <section>
          <h2 className="mb-1 text-xs font-bold uppercase tracking-widest text-gray-700">Certifications</h2>
          {certifications.map((cert) => (
            <div key={cert.id} className="mb-1 flex items-baseline justify-between">
              <div>
                <span className="font-semibold">{cert.name || "Certification"}</span>
                {cert.issuer && <span className="text-gray-600"> · {cert.issuer}</span>}
              </div>
              {cert.date && <span className="text-[10px] text-gray-500">{cert.date}</span>}
            </div>
          ))}
        </section>
      )}
    </div>
  );
};

export default ResumePreview;
