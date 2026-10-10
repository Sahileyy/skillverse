"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useAuth, AuthUser } from "@/components/auth/auth-context";
import { useLoginModal } from "@/components/auth/login-modal-provider";
import { ProfileUpdateInput } from "@/lib/validations/profile";

type ProfileEditFormProps = {
  user: AuthUser;
  onSave: (data: ProfileUpdateInput) => Promise<void>;
  onCancel: () => void;
  isSaving: boolean;
};

function ProfileEditForm({ user, onSave, onCancel, isSaving }: ProfileEditFormProps) {
  const role = user.role;
  const [name, setName] = useState(user.name || "");
  const [education, setEducation] = useState(user.profile?.education || "");
  const [headline, setHeadline] = useState(user.profile?.headline || "");
  const [bio, setBio] = useState(user.profile?.bio || "");
  const [skills, setSkills] = useState<string[]>(user.profile?.skills || []);
  const [skillsInput, setSkillsInput] = useState("");
  const [interests, setInterests] = useState<string[]>(user.profile?.interests || []);
  const [interestsInput, setInterestsInput] = useState("");
  const [careerGoal, setCareerGoal] = useState(user.profile?.careerGoal || "");
  const [image, setImage] = useState(user.image || "");
  const [githubUrl, setGithubUrl] = useState(user.profile?.githubUrl || "");
  const [linkedinUrl, setLinkedinUrl] = useState(user.profile?.linkedinUrl || "");

  const handleAddSkill = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" || e.key === ",") {
      e.preventDefault();
      const val = skillsInput.trim().replace(/^,+|,+$/g, "");
      if (val && !skills.includes(val)) {
        setSkills((prev) => [...prev, val]);
        setSkillsInput("");
      }
    }
  };

  const handleRemoveSkill = (skillToRemove: string) => {
    setSkills((prev) => prev.filter((s) => s !== skillToRemove));
  };

  const handleAddInterest = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" || e.key === ",") {
      e.preventDefault();
      const val = interestsInput.trim().replace(/^,+|,+$/g, "");
      if (val && !interests.includes(val)) {
        setInterests((prev) => [...prev, val]);
        setInterestsInput("");
      }
    }
  };

  const handleRemoveInterest = (interestToRemove: string) => {
    setInterests((prev) => prev.filter((i) => i !== interestToRemove));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const finalSkills = [...skills];
    const skillTrim = skillsInput.trim().replace(/^,+|,+$/g, "");
    if (skillTrim && !finalSkills.includes(skillTrim)) {
      finalSkills.push(skillTrim);
    }

    const finalInterests = [...interests];
    const interestTrim = interestsInput.trim().replace(/^,+|,+$/g, "");
    if (interestTrim && !finalInterests.includes(interestTrim)) {
      finalInterests.push(interestTrim);
    }

    onSave({
      name,
      education: education || null,
      headline: headline || null,
      bio: bio || null,
      skills: finalSkills,
      interests: finalInterests,
      careerGoal: careerGoal || null,
      image: image || null,
      githubUrl: githubUrl || null,
      linkedinUrl: linkedinUrl || null,
    });
  };

  return (
    <form onSubmit={handleSubmit} className="rounded-3xl border border-slate-200 bg-white p-6 sm:p-8 shadow-xs space-y-6">
      <div className="border-b border-slate-100 pb-4">
        <h2 className="text-base font-bold text-slate-900">Edit Your {role} Profile</h2>
        <p className="text-xs text-slate-500 mt-0.5">
          Update your learning credentials, technical interests, and platform settings.
        </p>
      </div>

      <div className="grid gap-5 sm:grid-cols-2">
        {/* Full Name */}
        <div>
          <label className="block text-xs font-bold text-slate-700">Full Name *</label>
          <input
            type="text"
            required
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="e.g. Sahil Krishna"
            className="mt-1.5 w-full rounded-xl border border-slate-200 px-3.5 py-2.5 text-xs text-slate-900 focus:border-blue-600 focus:outline-none focus:ring-1 focus:ring-blue-600"
          />
        </div>

        {/* Education */}
        <div>
          <label className="block text-xs font-bold text-slate-700">Education / College *</label>
          <input
            type="text"
            value={education}
            onChange={(e) => setEducation(e.target.value)}
            placeholder="e.g. B.Tech Computer Science, Sreepathy Institute"
            className="mt-1.5 w-full rounded-xl border border-slate-200 px-3.5 py-2.5 text-xs text-slate-900 focus:border-blue-600 focus:outline-none focus:ring-1 focus:ring-blue-600"
          />
        </div>

        {/* Headline */}
        <div>
          <label className="block text-xs font-bold text-slate-700">Headline</label>
          <input
            type="text"
            value={headline}
            onChange={(e) => setHeadline(e.target.value)}
            placeholder={role === "MENTOR" ? "e.g. Full-Stack Lead @ Startup" : "e.g. Aspiring Backend Engineer"}
            className="mt-1.5 w-full rounded-xl border border-slate-200 px-3.5 py-2.5 text-xs text-slate-900 focus:border-blue-600 focus:outline-none focus:ring-1 focus:ring-blue-600"
          />
        </div>

        {/* Role Specific: Career Goal (Student) or Profile Image (Mentor/Admin) */}
        {role === "STUDENT" ? (
          <div>
            <label className="block text-xs font-bold text-slate-700">Career Goal *</label>
            <input
              type="text"
              value={careerGoal}
              onChange={(e) => setCareerGoal(e.target.value)}
              placeholder="e.g. Full-Stack Developer, AI Engineer, UI/UX Architect"
              className="mt-1.5 w-full rounded-xl border border-slate-200 px-3.5 py-2.5 text-xs text-slate-900 focus:border-blue-600 focus:outline-none focus:ring-1 focus:ring-blue-600"
            />
          </div>
        ) : (
          <div>
            <label className="block text-xs font-bold text-slate-700">Profile Image URL (Optional)</label>
            <input
              type="url"
              value={image}
              onChange={(e) => setImage(e.target.value)}
              placeholder="https://example.com/avatar.jpg"
              className="mt-1.5 w-full rounded-xl border border-slate-200 px-3.5 py-2.5 text-xs text-slate-900 focus:border-blue-600 focus:outline-none focus:ring-1 focus:ring-blue-600"
            />
          </div>
        )}
      </div>

      {/* Experience / Bio for Mentor or General Bio */}
      <div>
        <label className="block text-xs font-bold text-slate-700">
          {role === "MENTOR" ? "Experience & Bio *" : "Bio / About You"}
        </label>
        <textarea
          rows={3}
          value={bio}
          onChange={(e) => setBio(e.target.value)}
          placeholder={
            role === "MENTOR"
              ? "Share your industry background, mentorship philosophy, and key projects..."
              : "A short summary of what you are working on or learning..."
          }
          className="mt-1.5 w-full rounded-xl border border-slate-200 p-3 text-xs text-slate-900 focus:border-blue-600 focus:outline-none focus:ring-1 focus:ring-blue-600"
        />
      </div>

      {/* Skills Tag Input */}
      <div>
        <label className="block text-xs font-bold text-slate-700">
          Technical Skills * (Press Enter or comma to add)
        </label>
        <div className="mt-1.5 flex flex-wrap items-center gap-1.5 rounded-xl border border-slate-200 p-2.5 focus-within:border-blue-600 focus-within:ring-1 focus-within:ring-blue-600">
          {skills.map((skill) => (
            <span
              key={skill}
              className="inline-flex items-center gap-1 rounded-lg bg-blue-50 px-2.5 py-1 text-xs font-bold text-blue-700"
            >
              {skill}
              <button
                type="button"
                onClick={() => handleRemoveSkill(skill)}
                className="size-3.5 hover:text-red-600"
              >
                ×
              </button>
            </span>
          ))}
          <input
            type="text"
            value={skillsInput}
            onChange={(e) => setSkillsInput(e.target.value)}
            onKeyDown={handleAddSkill}
            placeholder={skills.length === 0 ? "Type skill (e.g. React, Next.js, Python)..." : "Add more..."}
            className="min-w-[120px] flex-1 border-none bg-transparent p-0 text-xs text-slate-900 focus:outline-none"
          />
        </div>
      </div>

      {/* Interests Tag Input */}
      <div>
        <label className="block text-xs font-bold text-slate-700">
          Areas of Interest * (Press Enter or comma to add)
        </label>
        <div className="mt-1.5 flex flex-wrap items-center gap-1.5 rounded-xl border border-slate-200 p-2.5 focus-within:border-blue-600 focus-within:ring-1 focus-within:ring-blue-600">
          {interests.map((interest) => (
            <span
              key={interest}
              className="inline-flex items-center gap-1 rounded-lg bg-purple-50 px-2.5 py-1 text-xs font-bold text-purple-700"
            >
              {interest}
              <button
                type="button"
                onClick={() => handleRemoveInterest(interest)}
                className="size-3.5 hover:text-red-600"
              >
                ×
              </button>
            </span>
          ))}
          <input
            type="text"
            value={interestsInput}
            onChange={(e) => setInterestsInput(e.target.value)}
            onKeyDown={handleAddInterest}
            placeholder={interests.length === 0 ? "Type interest (e.g. Open Source, System Design, AI)..." : "Add more..."}
            className="min-w-[120px] flex-1 border-none bg-transparent p-0 text-xs text-slate-900 focus:outline-none"
          />
        </div>
      </div>

      {/* External Links */}
      <div className="grid gap-5 sm:grid-cols-2">
        <div>
          <label className="block text-xs font-bold text-slate-700">GitHub URL</label>
          <input
            type="url"
            value={githubUrl}
            onChange={(e) => setGithubUrl(e.target.value)}
            placeholder="https://github.com/username"
            className="mt-1.5 w-full rounded-xl border border-slate-200 px-3.5 py-2.5 text-xs text-slate-900 focus:border-blue-600 focus:outline-none"
          />
        </div>

        <div>
          <label className="block text-xs font-bold text-slate-700">LinkedIn URL</label>
          <input
            type="url"
            value={linkedinUrl}
            onChange={(e) => setLinkedinUrl(e.target.value)}
            placeholder="https://linkedin.com/in/username"
            className="mt-1.5 w-full rounded-xl border border-slate-200 px-3.5 py-2.5 text-xs text-slate-900 focus:border-blue-600 focus:outline-none"
          />
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex items-center justify-end gap-3 pt-3">
        <button
          type="button"
          onClick={onCancel}
          className="h-10 rounded-xl px-4 text-xs font-semibold text-slate-600 hover:bg-slate-100"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={isSaving}
          className="h-10 rounded-xl bg-slate-900 px-6 text-xs font-bold text-white shadow-xs transition hover:bg-slate-800 disabled:opacity-50"
        >
          {isSaving ? "Saving..." : "Save Profile Changes"}
        </button>
      </div>
    </form>
  );
}

export default function ProfileView() {
  const { user, refreshUser, isLoading: isAuthLoading } = useAuth();
  const openLoginModal = useLoginModal();

  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [xpCelebration, setXpCelebration] = useState<number | null>(null);

  const handleSaveProfile = async (formData: ProfileUpdateInput) => {
    setIsSaving(true);
    setErrorMessage(null);
    setSuccessMessage(null);
    setXpCelebration(null);

    try {
      const res = await fetch("/api/profile", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (!res.ok) {
        setErrorMessage(data.error || "Failed to update profile");
        setIsSaving(false);
        return;
      }

      await refreshUser();
      setIsEditing(false);
      setSuccessMessage(data.message || "Profile updated successfully!");

      if (data.xpAwarded && data.xpAwarded > 0) {
        setXpCelebration(data.xpAwarded);
      }
    } catch {
      setErrorMessage("Network error while saving profile. Please try again.");
    } finally {
      setIsSaving(false);
    }
  };

  if (isAuthLoading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <div className="size-8 animate-spin rounded-full border-2 border-slate-900 border-t-transparent" />
      </div>
    );
  }

  if (!user) {
    return (
      <div className="mx-auto max-w-lg py-20 px-4 text-center">
        <div className="mx-auto flex size-16 items-center justify-center rounded-2xl bg-blue-50 text-blue-600">
          <svg className="size-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7 7z" />
          </svg>
        </div>
        <h2 className="mt-4 text-2xl font-bold text-slate-900">Sign in to View Your Profile</h2>
        <p className="mt-2 text-sm text-slate-600">
          Create and manage your student or mentor profile, earn skill assessment verification, and track your career roadmap.
        </p>
        <button
          onClick={openLoginModal}
          className="mt-6 inline-flex h-11 items-center justify-center rounded-xl bg-slate-900 px-6 text-sm font-semibold text-white shadow-xs transition hover:bg-slate-800"
        >
          Sign In / Register
        </button>
      </div>
    );
  }

  const role = user.role;
  const isProfileComplete = Boolean(
    user.profile?.education &&
    user.profile?.skills && user.profile.skills.length > 0 &&
    user.profile?.interests && user.profile.interests.length > 0 &&
    (role === "MENTOR" ? user.profile?.bio : user.profile?.careerGoal)
  );

  return (
    <div className="min-h-screen bg-slate-50/50 py-10 px-4 sm:px-8">
      <div className="mx-auto max-w-4xl space-y-6">
        {/* Navigation Breadcrumb */}
        <div className="flex items-center justify-between text-xs font-medium text-slate-500">
          <div className="flex items-center gap-2">
            <Link href="/" className="hover:text-slate-900 transition-colors">
              Home
            </Link>
            <span>/</span>
            <span className="text-slate-900 font-semibold">User Profile</span>
          </div>

          <div className="flex items-center gap-2">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-amber-100 px-3 py-1 text-xs font-bold text-amber-800">
              ⚡ {user.xp || 0} XP
            </span>
          </div>
        </div>

        {/* XP Award Celebration Alert */}
        {xpCelebration && (
          <div className="rounded-2xl border border-amber-300 bg-amber-50 p-4 text-amber-900 shadow-xs flex items-center justify-between animate-fade-in">
            <div className="flex items-center gap-3">
              <span className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-amber-400 text-slate-950 font-black text-lg">
                ⚡
              </span>
              <div>
                <p className="font-bold text-sm">+{xpCelebration} XP Earned!</p>
                <p className="text-xs text-amber-800">
                  Congratulations on completing your SkillVerse profile setup!
                </p>
              </div>
            </div>
            <button
              onClick={() => setXpCelebration(null)}
              className="text-xs font-semibold text-amber-700 hover:text-amber-900"
            >
              Dismiss
            </button>
          </div>
        )}

        {/* Feedback Messages */}
        {successMessage && (
          <div className="rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-xs font-semibold text-emerald-800">
            {successMessage}
          </div>
        )}
        {errorMessage && (
          <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-xs font-semibold text-red-800">
            {errorMessage}
          </div>
        )}

        {/* 1. PROFILE HEADER CARD (ADPList / µLearn Clean Aesthetic) */}
        <div className="overflow-hidden rounded-3xl border border-slate-200 bg-white p-6 sm:p-8 shadow-xs">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 pb-6 border-b border-slate-100">
            <div className="flex items-center gap-4">
              <div className="flex size-16 sm:size-20 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-tr from-slate-900 to-slate-700 text-xl sm:text-2xl font-bold text-white shadow-xs">
                {user.image ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={user.image} alt={user.name} className="size-full rounded-2xl object-cover" />
                ) : (
                  user.name.slice(0, 2).toUpperCase()
                )}
              </div>

              <div>
                <div className="flex items-center gap-1.5 flex-wrap">
                  <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900">{user.name}</h1>
                  {role === "MENTOR" && (
                    <svg className="size-4 text-blue-600 shrink-0" fill="currentColor" viewBox="0 0 20 20" aria-label="Verified Mentor">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                  )}
                  <span className="text-xs font-medium text-slate-500">
                    • {role === "MENTOR" && user.profile?.mentorLevel ? user.profile.mentorLevel : role === "MENTOR" ? "Mentor" : role === "ADMIN" ? "Admin" : "Member"}
                  </span>
                </div>
                <p className="text-xs sm:text-sm text-slate-500 mt-0.5">{user.email}</p>
                {user.profile?.headline && (
                  <p className="text-xs font-medium text-slate-700 mt-1">{user.profile.headline}</p>
                )}
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => {
                  setIsEditing(!isEditing);
                  setErrorMessage(null);
                  setSuccessMessage(null);
                }}
                className={`h-10 px-4 rounded-xl text-xs font-bold transition flex items-center gap-1.5 ${
                  isEditing
                    ? "bg-slate-100 text-slate-700 hover:bg-slate-200"
                    : "bg-slate-900 text-white hover:bg-slate-800 shadow-xs"
                }`}
              >
                {isEditing ? "Cancel Editing" : "Edit Profile"}
              </button>
            </div>
          </div>

          {/* Activity / XP Bar */}
          <div className="pt-4 flex flex-wrap items-center justify-between gap-3 text-xs text-slate-600">
            <div className="flex items-center gap-2">
              <span className="font-semibold text-slate-900">Profile Status:</span>
              <span className={`inline-flex items-center gap-1 font-semibold ${isProfileComplete ? "text-emerald-600" : "text-amber-600"}`}>
                <span className={`size-2 rounded-full ${isProfileComplete ? "bg-emerald-500" : "bg-amber-500"}`} />
                {isProfileComplete ? "Complete (+20 XP Earned)" : "Incomplete (Fill all fields for +20 XP)"}
              </span>
            </div>

            <div className="flex items-center gap-4">
              {role === "MENTOR" ? (
                <>
                  <Link href="/assessment?quiz=mentor_accreditation" className="text-amber-700 hover:underline font-semibold flex items-center gap-1">
                    <span>👑 AI Mentor Accreditation & Rating →</span>
                  </Link>
                  <Link href="/mentor/dashboard" className="text-blue-600 hover:underline font-semibold">
                    Mentor Studio & Ads →
                  </Link>
                </>
              ) : (
                <>
                  <Link href="/assessment" className="text-blue-600 hover:underline font-semibold">
                    Take AI Assessment →
                  </Link>
                  <Link href="/roadmap" className="text-blue-600 hover:underline font-semibold">
                    View Career Roadmap →
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>

        {/* MENTOR AI LEVEL ACCREDITATION STATUS CARD */}
        {role === "MENTOR" && !isEditing && (
          <div className="rounded-3xl border border-amber-300/80 bg-gradient-to-r from-slate-950 via-slate-900 to-indigo-950 p-6 sm:p-7 text-white shadow-md">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-5">
              <div className="flex items-start gap-4">
                <div className="flex size-14 shrink-0 items-center justify-center rounded-2xl bg-amber-400 text-slate-950 text-2xl shadow-md font-bold">
                  {user.profile?.mentorLevel?.includes("Master") ? "👑" : user.profile?.mentorLevel?.includes("Senior") ? "🎖️" : user.profile?.mentorLevel?.includes("Associate") ? "🎓" : "🧭"}
                </div>
                <div>
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="rounded-full bg-amber-400/20 border border-amber-400/30 px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider text-amber-300">
                      AI Mentor Accreditation
                    </span>
                    {user.profile?.mentorScore && (
                      <span className="text-xs text-indigo-200 font-semibold">
                        Score: {user.profile.mentorScore}%
                      </span>
                    )}
                  </div>

                  <h3 className="mt-1 text-xl font-extrabold text-white">
                    {user.profile?.mentorLevel ? (
                      <>
                        Decided Level: <span className="text-amber-300">{user.profile.mentorLevel}</span>
                      </>
                    ) : (
                      "Accreditation Pending — Take Assessment to Decide Level"
                    )}
                  </h3>

                  <p className="mt-1 text-xs text-slate-300 max-w-xl leading-relaxed">
                    {user.profile?.mentorLevel === "Master Mentor"
                      ? "Tier 1 Accredited: Certified to conduct System Architecture sessions, Capstone code audits, and Executive Mentorship."
                      : user.profile?.mentorLevel === "Senior Mentor"
                      ? "Tier 2 Accredited: Certified for Full-Stack Architecture, Deep-Dive Code Reviews, and Interview Prep."
                      : user.profile?.mentorLevel === "Associate Mentor"
                      ? "Tier 3 Accredited: Certified for Foundational Tutoring, Syntax Debugging, and Concept Scaffolding."
                      : "Complete the 5-minute technical and pedagogical evaluation to determine your official mentor level and showcase verified credibility to students."}
                  </p>
                </div>
              </div>

              <Link
                href="/assessment?quiz=mentor_accreditation"
                className="inline-flex shrink-0 items-center justify-center gap-2 rounded-xl bg-amber-400 hover:bg-amber-300 px-5 py-3 text-xs font-black text-slate-950 shadow-md transition hover:scale-[1.02]"
              >
                <span>{user.profile?.mentorLevel ? "Retake to Level Up" : "Take AI Mentor Assessment (+15 XP)"}</span>
                <span>→</span>
              </Link>
            </div>
          </div>
        )}

        {/* MENTOR SKILL ADS & DISCOVERY PORTAL CARD */}
        {role === "MENTOR" && !isEditing && (
          <div className="rounded-3xl border border-blue-200 bg-gradient-to-r from-blue-50/70 via-indigo-50/50 to-white p-6 sm:p-7 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-5">
            <div className="flex items-start gap-4">
              <div className="flex size-14 shrink-0 items-center justify-center rounded-2xl bg-blue-600 text-white text-2xl shadow-md font-bold">
                📢
              </div>
              <div>
                <span className="rounded-full bg-blue-100 border border-blue-200 px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider text-blue-700">
                  Student Discovery Hub
                </span>
                <h3 className="mt-1 text-lg font-extrabold text-slate-900">
                  Post Skill Ads to Let Students Find You
                </h3>
                <p className="mt-0.5 text-xs text-slate-600 max-w-xl leading-relaxed">
                  List your technical expertise, set session pricing (Free / Paid), and define your availability. Published ads appear directly in the student search directory.
                </p>
              </div>
            </div>

            <Link
              href="/mentor/dashboard"
              className="inline-flex shrink-0 items-center justify-center gap-2 rounded-xl bg-slate-900 hover:bg-slate-800 px-5 py-3 text-xs font-bold text-white shadow-xs transition hover:scale-[1.02]"
            >
              <span>Go to Mentor Studio & Post Ad</span>
              <span>→</span>
            </Link>
          </div>
        )}

        {/* 2. EDIT FORM OR VIEW PROFILE */}
        {isEditing ? (
          <ProfileEditForm
            user={user}
            onSave={handleSaveProfile}
            onCancel={() => setIsEditing(false)}
            isSaving={isSaving}
          />
        ) : (
          /* 3. READ-ONLY PROFILE DISPLAY */
          <div className="grid gap-6 md:grid-cols-3">
            {/* Left Column: Education & Goal */}
            <div className="space-y-6 md:col-span-2">
              {/* About / Bio */}
              <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-xs">
                <h3 className="text-sm font-bold text-slate-900">
                  {role === "MENTOR" ? "Experience & Background" : "About & Career Vision"}
                </h3>
                <p className="mt-3 text-xs leading-relaxed text-slate-600">
                  {user.profile?.bio || "No summary provided yet. Click 'Edit Profile' to add your background."}
                </p>

                {role === "STUDENT" && user.profile?.careerGoal && (
                  <div className="mt-4 rounded-xl border border-blue-100 bg-blue-50/60 p-3 text-xs">
                    <span className="font-bold text-blue-900">Target Career Goal: </span>
                    <span className="text-blue-800 font-medium">{user.profile.careerGoal}</span>
                  </div>
                )}
              </div>

              {/* Skills */}
              <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-xs">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-bold text-slate-900">
                    {role === "MENTOR" ? "Mentoring Domains & Skills" : "Verified & Practiced Skills"}
                  </h3>
                  <Link
                    href={role === "MENTOR" ? "/assessment?quiz=mentor_accreditation" : "/assessment"}
                    className="text-xs font-semibold text-blue-600 hover:underline"
                  >
                    {role === "MENTOR" ? "Accredit Competency →" : "Test Skills →"}
                  </Link>
                </div>
                <div className="mt-3 flex flex-wrap gap-2">
                  {user.profile?.skills && user.profile.skills.length > 0 ? (
                    user.profile.skills.map((skill) => (
                      <Link
                        key={skill}
                        href={`/assessment?skill=${encodeURIComponent(skill)}`}
                        className="group inline-flex items-center gap-1.5 rounded-xl border border-slate-200 bg-slate-50 px-3 py-1.5 text-xs font-semibold text-slate-800 transition hover:border-blue-400 hover:bg-blue-50/60 hover:text-blue-700"
                        title={role === "MENTOR" ? `Take AI Mentor Evaluation in ${skill}` : `Take 5-Question AI Quiz in ${skill}`}
                      >
                        <span>{skill}</span>
                        <span className="text-[10px] text-slate-400 group-hover:text-blue-600">⚡</span>
                      </Link>
                    ))
                  ) : (
                    <p className="text-xs text-slate-400 italic">No skills listed yet.</p>
                  )}
                </div>
              </div>

              {/* Interests */}
              <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-xs">
                <h3 className="text-sm font-bold text-slate-900">Areas of Interest</h3>
                <div className="mt-3 flex flex-wrap gap-2">
                  {user.profile?.interests && user.profile.interests.length > 0 ? (
                    user.profile.interests.map((interest) => (
                      <span
                        key={interest}
                        className="rounded-lg bg-purple-50 px-3 py-1.5 text-xs font-semibold text-purple-700"
                      >
                        {interest}
                      </span>
                    ))
                  ) : (
                    <p className="text-xs text-slate-400 italic">No interests listed yet.</p>
                  )}
                </div>
              </div>
            </div>

            {/* Right Column: Meta details, Education, Admin box */}
            <div className="space-y-6">
              {/* Education Box */}
              <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-xs">
                <h3 className="text-sm font-bold text-slate-900">Education</h3>
                <p className="mt-2 text-xs font-medium text-slate-700">
                  {user.profile?.education || "Not specified"}
                </p>
              </div>

              {/* XP Summary Box */}
              <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-xs">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-bold text-slate-900">Experience Points</h3>
                  <span className="text-lg font-black text-amber-500">⚡ {user.xp || 0}</span>
                </div>
                <p className="mt-2 text-[11px] text-slate-500">
                  Earn XP by completing skill assessments (+10), career roadmap milestones (+5), and keeping your profile updated (+20).
                </p>
                <div className="mt-4 space-y-2 border-t border-slate-100 pt-3 text-[11px]">
                  <div className="flex items-center justify-between">
                    <span className="text-slate-600">Profile Complete</span>
                    <span className={user.completedActivities?.includes("profile_completed") ? "font-bold text-emerald-600" : "text-slate-400"}>
                      {user.completedActivities?.includes("profile_completed") ? "✓ 20 XP" : "Pending (+20 XP)"}
                    </span>
                  </div>
                </div>
              </div>

              {/* Social Links */}
              <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-xs">
                <h3 className="text-sm font-bold text-slate-900">Connect</h3>
                <div className="mt-3 space-y-2 text-xs">
                  {user.profile?.githubUrl ? (
                    <a
                      href={user.profile.githubUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="flex items-center gap-2 text-slate-600 hover:text-slate-900 font-medium"
                    >
                      <span>GitHub</span> →
                    </a>
                  ) : (
                    <p className="text-[11px] text-slate-400 italic">No GitHub URL added</p>
                  )}
                  {user.profile?.linkedinUrl ? (
                    <a
                      href={user.profile.linkedinUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="flex items-center gap-2 text-slate-600 hover:text-slate-900 font-medium"
                    >
                      <span>LinkedIn</span> →
                    </a>
                  ) : (
                    <p className="text-[11px] text-slate-400 italic">No LinkedIn URL added</p>
                  )}
                </div>
              </div>

              {/* Admin Panel Link / Info (if ADMIN) */}
              {role === "ADMIN" && (
                <div className="rounded-3xl border border-purple-200 bg-purple-50/60 p-5 shadow-xs">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-purple-900">
                    Administrator Controls
                  </h3>
                  <p className="mt-1 text-xs text-purple-800">
                    You have administrative access to moderate community projects, review reported content, and manage users.
                  </p>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
