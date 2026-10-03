
SKILLVERSE — MASTER DEVELOPMENT RULES

You are the coding agent for SkillVerse, a college-level peer-to-peer skill learning platform.

IMPORTANT:
Treat the existing project structure, database schema, and approved requirements as the source of truth. Do not redesign the architecture unless explicitly asked.

TECH STACK

- Next.js 16 App Router
- React 19
- TypeScript
- Tailwind CSS
- PostgreSQL
- Prisma
- Zod
- AI API only for Skill Assessment and Career Guidance

USER ROLES

- STUDENT
- MENTOR
- ADMIN

CORE WORKFLOW

STUDENT:
Profile → Search skill → View mentor posts → View mentor profile → Book/request session → Chat → Complete session → Review/report

MENTOR:
Profile → Create Free/Paid session posts → Receive booking requests → Accept/Reject → Chat → Conduct session → Receive reviews

ADMIN:
Manage users → Moderate posts → Review reports → Manage inappropriate content

AI:

1. Skill Assessment
2. Career Guidance with learning roadmap toward a target career position

COMMUNITY:
Users can create project posts.
Students can request to join.
The project/team head must approve the request before the student becomes a member.

SEARCH:
Searching a skill such as "React" must return relevant mentor posts containing that skill.
Do NOT implement mathematical matching, match percentages, AI matching, Skill Coins, XP, badges, or leaderboards.

DATABASE PRINCIPLES
Use a simple relational schema.

Core tables:

- User
- Profile
- Post
- Booking
- Review
- Conversation
- Message
- SkillAssessment
- ProjectPost
- ProjectJoinRequest
- Report

Do not create additional tables unless the requirement genuinely requires them.

ARCHITECTURE RULES

- Keep the existing folder structure.
- Do not create unnecessary folders/files.
- Follow feature-based organization where appropriate.
- Reuse existing components, utilities, hooks and types.
- Do not duplicate logic.
- Do not create abstractions without a real need.
- Prefer simple, readable code over clever code.
- Keep components focused and maintainable.
- Keep business logic out of UI components when practical.
- Validate input with Zod.
- Use TypeScript properly. Avoid `any`.
- Never silently change existing behavior.
- Never modify backend/database architecture unless required for the current task.
- Never install a package unless it is genuinely necessary.
- Before creating a new file, check whether an existing file can be reused.
- Before creating a new component, check whether an existing component already solves the problem.

UI RULES

- Build UI brick-by-brick.
- Match the approved design/reference closely.
- Keep the UI responsive.
- Do not redesign unrelated screens.
- Do not add features that are not requested.
- Use Tailwind consistently.
- Keep spacing, typography and components consistent throughout the application.

DEVELOPMENT METHOD

For every task:

1. Understand the existing code first.
2. Identify the smallest required change.
3. Reuse existing architecture.
4. Implement only that change.
5. Check for TypeScript/errors.
6. Verify that existing functionality still works.
7. Only then move to the next task.

DO NOT:

- Over-engineer
- Create speculative features
- Create unnecessary DTOs/services/interfaces
- Duplicate components
- Add random libraries
- Change working code without reason
- Rewrite entire files for small changes
- Generate mock backend logic when real project logic exists
- Add AI where normal application logic is sufficient

BRICK-BY-BRICK PRIORITY

Build in this order unless explicitly changed:

1. Project foundation
2. Authentication
3. User/Profile
4. Mentor Posts
5. Skill Search & Filters
6. Mentor Profile
7. Booking
8. Chat
9. Reviews
10. Reports/Admin moderation
11. Community Projects
12. Project Join Requests + Team Head Approval
13. AI Skill Assessment
14. AI Career Guidance
15. Testing
16. Deployment

IMPORTANT:
Do not work on multiple unrelated features at once.

Before coding, briefly state:

- What you found
- What files will change
- What you will implement

Then implement only the requested brick.

These rules remain active for all future SkillVerse development unless I explicitly change them.
