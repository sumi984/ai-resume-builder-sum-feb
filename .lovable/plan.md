

## AI Resume Builder SaaS — Full Implementation Plan

### Phase 1: Landing Page & App Shell
- Build a polished landing page with hero section ("Build Your Perfect Resume with AI"), 3 feature cards (AI Generation, ATS Scoring, PDF Export), and CTA buttons
- Shared navbar with logo, nav links, and Sign In / Get Started buttons
- Clean footer
- Set up routing: `/` (landing), `/auth`, `/dashboard`, `/builder/:id`
- Protected route wrapper redirecting unauthenticated users to `/auth`

### Phase 2: Authentication & Database
- Enable Lovable Cloud (Supabase)
- Supabase Auth with email/password signup and login
- Create database tables:
  - `profiles` (plan tier, AI usage tracking, auto-created on signup via trigger)
  - `resumes` (JSONB `content` column for structured resume data)
  - `job_descriptions` (for job tailoring feature)
  - `ai_usage_log` (tracking AI actions)
- RLS policies on all tables (users access only their own data)
- Auth page with signup/login toggle, password reset flow with `/reset-password` page
- Toast notifications for auth success/error

### Phase 3: Dashboard
- Grid of resume cards showing title, last edited date
- "Create New Resume" button → creates DB record → navigates to `/builder/:id`
- Per-resume actions: Edit, Duplicate, Delete (with confirmation dialog)
- Empty state for new users

### Phase 4: Resume Builder — Two-Panel Editor
- Left panel: scrollable editor with collapsible sections
  - Personal Info (name, email, phone, location, LinkedIn, portfolio)
  - Professional Summary (textarea)
  - Work Experience (repeatable entries with bullet points, "currently working" toggle)
  - Education (repeatable entries)
  - Skills (tag-style input with chips)
  - Certifications (repeatable entries)
  - Projects (repeatable entries with bullets)
- Right panel: live preview rendering a professional resume template in real-time
- `useResumeState` custom hook managing the full resume data object
- Auto-save to Supabase every 30 seconds of inactivity with save status indicator
- Manual save button in toolbar
- Responsive: stacked on mobile with tab toggle between editor and preview

### Phase 5: AI Integration
- Enable Lovable AI
- Deploy 5 Supabase Edge Functions via Lovable AI Gateway (`google/gemini-3-flash-preview`):
  - `ai-generate` — write content from scratch for any resume section
  - `ai-improve` — rewrite existing text for stronger impact and quantification
  - `ai-tailor` — rewrite resume sections to match a pasted job description
  - `ai-chat` — streaming conversational AI resume coach in a slide-out sidebar
  - `ai-ats-score` — analyze resume and return score (0–100) with suggestions, keyword matches, and missing keywords
- ✨ Generate / Improve buttons next to Summary, Experience bullets, and Project descriptions
- "Tailor to Job" panel for pasting job descriptions
- Chat sidebar with streaming token-by-token display
- ATS Score collapsible panel
- Error handling for rate limits (429) and payment required (402) with user-friendly toasts

### Phase 6: PDF Export
- "Download PDF" button in builder toolbar
- Client-side PDF generation from live preview using `html2pdf.js`
- A4 format with proper margins, downloads as `{resume-title}.pdf`

### Phase 7: Polish & Final Touches
- Loading skeletons and empty states throughout the app
- Toast notifications for all user actions (saved, generated, downloaded, errors)
- Mobile-responsive adjustments across all pages
- Consistent clean design: white backgrounds, soft shadows, indigo accents for AI elements
- Update page title, meta description, and Open Graph tags for branding

### Phase 8: Deploy
- Publish the app via Lovable's publish button
- Verify all features work end-to-end on the published URL

