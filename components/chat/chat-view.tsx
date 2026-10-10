"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useLoginModal } from "@/components/auth/login-modal-provider";
import { useAuth } from "@/components/auth/auth-context";

export type Message = {
  id: string;
  senderId: string;
  text: string;
  timestamp: string;
  isMe: boolean;
  meetingCard?: {
    title: string;
    time: string;
    meetUrl: string;
  };
};

export type Conversation = {
  id: string;
  user: {
    id: string;
    name: string;
    avatar: string;
    role: "MENTOR" | "STUDENT";
    headline: string;
    isOnline: boolean;
  };
  lastMessage: string;
  lastMessageTime: string;
  unreadCount: number;
  messages: Message[];
};

export const INITIAL_CONVERSATIONS: Conversation[] = [
  {
    id: "conv-aarav",
    user: {
      id: "mentor-aarav",
      name: "Aarav Sharma",
      avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80",
      role: "MENTOR",
      headline: "Senior Frontend Engineer @ Stripe",
      isOnline: true,
    },
    lastMessage: "Looking forward to our React session tomorrow at 10:00 AM! Here is the meeting link.",
    lastMessageTime: "10:45 AM",
    unreadCount: 1,
    messages: [
      {
        id: "m-1",
        senderId: "student-me",
        text: "Hi Aarav! I saw your post on React component patterns and state management. I'm building a dashboard for my college capstone and running into re-render bottlenecks.",
        timestamp: "Yesterday, 4:30 PM",
        isMe: true,
      },
      {
        id: "m-2",
        senderId: "mentor-aarav",
        text: "Hey! Glad to connect. Re-render issues usually come down to context granularity or creating inline object references in custom hooks.",
        timestamp: "Yesterday, 4:42 PM",
        isMe: false,
      },
      {
        id: "m-3",
        senderId: "mentor-aarav",
        text: "Feel free to book a 30-min 1:1 call so we can screen share your repo and fix it together.",
        timestamp: "Yesterday, 4:43 PM",
        isMe: false,
      },
      {
        id: "m-4",
        senderId: "student-me",
        text: "Awesome, I just confirmed the 10:00 AM slot for tomorrow!",
        timestamp: "10:30 AM",
        isMe: true,
      },
      {
        id: "m-5",
        senderId: "mentor-aarav",
        text: "Looking forward to our React session tomorrow at 10:00 AM! Here is the meeting link.",
        timestamp: "10:45 AM",
        isMe: false,
        meetingCard: {
          title: "1:1 Mentorship — React State Architecture",
          time: "Tomorrow, Oct 4 • 10:00 AM - 10:30 AM",
          meetUrl: "https://meet.google.com/xyz-skillverse-call",
        },
      },
    ],
  },
  {
    id: "conv-maya",
    user: {
      id: "mentor-maya",
      name: "Dr. Maya Patel",
      avatar: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=200&q=80",
      role: "MENTOR",
      headline: "AI Researcher & Applied Data Scientist",
      isOnline: true,
    },
    lastMessage: "I reviewed your RAG chunking code snippet. Check out RecursiveCharacterTextSplitter.",
    lastMessageTime: "Yesterday",
    unreadCount: 0,
    messages: [
      {
        id: "m-m1",
        senderId: "student-me",
        text: "Hello Dr. Maya! Which chunking overlap ratio do you recommend for technical documentation in ChromaDB?",
        timestamp: "Yesterday, 2:15 PM",
        isMe: true,
      },
      {
        id: "m-m2",
        senderId: "mentor-maya",
        text: "I reviewed your RAG chunking code snippet. Check out RecursiveCharacterTextSplitter with chunk_size=800 and chunk_overlap=150.",
        timestamp: "Yesterday, 3:00 PM",
        isMe: false,
      },
    ],
  },
  {
    id: "conv-rohan",
    user: {
      id: "head-rohan",
      name: "Rohan Kumar",
      avatar: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=200&q=80",
      role: "STUDENT",
      headline: "Team Head • SkillVerse Mobile App Project",
      isOnline: false,
    },
    lastMessage: "Welcome to the team! I'll add you to our Discord channel for the React Native build.",
    lastMessageTime: "2 days ago",
    unreadCount: 0,
    messages: [
      {
        id: "m-r1",
        senderId: "head-rohan",
        text: "Welcome to the team! I'll add you to our Discord channel for the React Native build.",
        timestamp: "2 days ago",
        isMe: false,
      },
    ],
  },
];

export default function ChatView() {
  const openLoginModal = useLoginModal();
  const { user } = useAuth();

  const [conversations, setConversations] = useState<Conversation[]>(INITIAL_CONVERSATIONS);
  const [activeConvId, setActiveConvId] = useState<string>("conv-aarav");
  const [messageInput, setMessageInput] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [isScheduleModalOpen, setIsScheduleModalOpen] = useState(false);
  const [meetingTopic, setMeetingTopic] = useState("");

  const activeConv = conversations.find((c) => c.id === activeConvId) || conversations[0];

  const filteredConversations = conversations.filter((c) =>
    c.user.name.toLowerCase().includes(searchQuery.toLowerCase().trim())
  );

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!messageInput.trim()) return;

    const newMessage: Message = {
      id: `msg-${Date.now()}`,
      senderId: user?.id || "me",
      text: messageInput.trim(),
      timestamp: "Just now",
      isMe: true,
    };

    setConversations((prev) =>
      prev.map((c) => {
        if (c.id === activeConv.id) {
          return {
            ...c,
            lastMessage: messageInput.trim(),
            lastMessageTime: "Just now",
            messages: [...c.messages, newMessage],
          };
        }
        return c;
      })
    );

    setMessageInput("");
  };

  const handleScheduleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!meetingTopic.trim()) return;

    const meetingMessage: Message = {
      id: `meet-${Date.now()}`,
      senderId: user?.id || "me",
      text: `I scheduled a meeting: ${meetingTopic}`,
      timestamp: "Just now",
      isMe: true,
      meetingCard: {
        title: meetingTopic,
        time: "Upcoming • Instant Video Link",
        meetUrl: `https://meet.google.com/call-${Math.random().toString(36).substring(7)}`,
      },
    };

    setConversations((prev) =>
      prev.map((c) => {
        if (c.id === activeConv.id) {
          return {
            ...c,
            lastMessage: `Scheduled: ${meetingTopic}`,
            lastMessageTime: "Just now",
            messages: [...c.messages, meetingMessage],
          };
        }
        return c;
      })
    );

    setIsScheduleModalOpen(false);
    setMeetingTopic("");
  };

  return (
    <div className="min-h-screen bg-slate-50/50 py-6 px-4 sm:px-8">
      <div className="mx-auto max-w-6xl">
        {/* Breadcrumb */}
        <div className="mb-4 flex items-center gap-2 text-xs font-medium text-slate-500">
          <Link href="/" className="hover:text-slate-900 transition-colors">
            Home
          </Link>
          <span>/</span>
          <span className="text-slate-900 font-semibold">Direct Messages</span>
        </div>

        {/* CHAT CONTAINER (Edinsta + Teachfloor style) */}
        <div className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm grid grid-cols-1 md:grid-cols-12 min-h-[640px] max-h-[80vh]">
          {/* 1. LEFT PANE: CONVERSATIONS LIST (4 cols) */}
          <div className="border-r border-slate-100 md:col-span-4 flex flex-col bg-slate-50/40">
            {/* Conversations Header */}
            <div className="p-4 border-b border-slate-100 bg-white">
              <div className="flex items-center justify-between">
                <h1 className="text-lg font-bold text-slate-900">Messages</h1>
                <span className="rounded-full bg-blue-50 px-2 py-0.5 text-xs font-bold text-blue-700">
                  {conversations.length} active
                </span>
              </div>

              {/* Search Bar */}
              <div className="relative mt-3">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search chats..."
                  className="w-full rounded-xl border border-slate-200 bg-slate-50/70 py-2 pl-8 pr-3 text-xs text-slate-900 placeholder:text-slate-400 focus:border-blue-500 focus:bg-white focus:outline-none"
                />
                <svg
                  className="size-4 text-slate-400 absolute left-2.5 top-2.5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
            </div>

            {/* Conversation Items */}
            <div className="flex-1 overflow-y-auto divide-y divide-slate-100/60">
              {filteredConversations.map((conv) => {
                const isActive = conv.id === activeConv.id;

                return (
                  <button
                    key={conv.id}
                    type="button"
                    onClick={() => setActiveConvId(conv.id)}
                    className={`flex w-full items-start gap-3 p-4 text-left transition-colors ${
                      isActive ? "bg-white shadow-xs" : "hover:bg-slate-100/60"
                    }`}
                  >
                    <div className="relative size-11 shrink-0 overflow-hidden rounded-full border border-slate-200">
                      <img
                        src={conv.user.avatar}
                        alt={conv.user.name}
                        className="size-full object-cover"
                      />
                      {conv.user.isOnline && (
                        <span className="absolute bottom-0 right-0 size-2.5 rounded-full border-2 border-white bg-emerald-500" />
                      )}
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-1 truncate">
                          <span className="text-xs font-bold text-slate-900 truncate">
                            {conv.user.name}
                          </span>
                          {conv.user.role === "MENTOR" && (
                            <svg className="size-3 text-blue-600 shrink-0" fill="currentColor" viewBox="0 0 20 20" aria-label="Mentor">
                              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                            </svg>
                          )}
                        </div>
                        <span className="text-[10px] text-slate-400 shrink-0 ml-1">
                          {conv.lastMessageTime}
                        </span>
                      </div>

                      <p className="mt-1 text-[11px] text-slate-500 truncate leading-snug">
                        {conv.lastMessage}
                      </p>
                    </div>

                    {conv.unreadCount > 0 && (
                      <span className="flex size-4 shrink-0 items-center justify-center rounded-full bg-blue-600 text-[9px] font-bold text-white">
                        {conv.unreadCount}
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          {/* 2. RIGHT PANE: ACTIVE MESSAGE THREAD (8 cols) */}
          <div className="md:col-span-8 flex flex-col bg-white">
            {/* Active Thread Header */}
            <div className="flex items-center justify-between border-b border-slate-100 p-4">
              <div className="flex items-center gap-3">
                <div className="relative size-10 shrink-0 overflow-hidden rounded-full border border-slate-200">
                  <img
                    src={activeConv.user.avatar}
                    alt={activeConv.user.name}
                    className="size-full object-cover"
                  />
                  {activeConv.user.isOnline && (
                    <span className="absolute bottom-0 right-0 size-2.5 rounded-full border-2 border-white bg-emerald-500" />
                  )}
                </div>

                <div>
                  <div className="flex items-center gap-2">
                    <h2 className="text-sm font-bold text-slate-900">{activeConv.user.name}</h2>
                    <span className="text-[11px] text-emerald-600 font-semibold">● Online</span>
                  </div>
                  <p className="text-[11px] text-slate-500 truncate max-w-xs sm:max-w-sm">
                    {activeConv.user.headline}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setIsScheduleModalOpen(true)}
                  className="inline-flex h-9 items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-3 text-xs font-semibold text-slate-700 shadow-xs transition hover:bg-slate-50"
                >
                  <svg className="size-3.5 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                  </svg>
                  <span className="hidden sm:inline">Schedule Call</span>
                </button>

                <Link
                  href={`/mentor/${activeConv.user.id}`}
                  className="inline-flex h-9 items-center justify-center rounded-xl bg-slate-900 px-3 text-xs font-semibold text-white transition hover:bg-blue-600"
                >
                  View Profile
                </Link>
              </div>
            </div>

            {/* Messages Scroll Area */}
            <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4 bg-slate-50/30">
              {/* Date divider */}
              <div className="text-center">
                <span className="rounded-full bg-slate-100 px-3 py-1 text-[10px] font-semibold text-slate-500">
                  Direct Mentorship Chat
                </span>
              </div>

              {activeConv.messages.map((msg) => (
                <div
                  key={msg.id}
                  className={`flex flex-col ${msg.isMe ? "items-end" : "items-start"}`}
                >
                  <div
                    className={`max-w-md rounded-2xl p-3.5 text-xs sm:text-sm leading-relaxed ${
                      msg.isMe
                        ? "bg-slate-900 text-white rounded-br-xs"
                        : "bg-white text-slate-800 border border-slate-200 rounded-bl-xs shadow-xs"
                    }`}
                  >
                    <p>{msg.text}</p>

                    {/* Embedded Meeting Card (Teachfloor style) */}
                    {msg.meetingCard && (
                      <div className="mt-3 rounded-xl border border-blue-200 bg-blue-50 p-3 text-slate-900">
                        <div className="flex items-center gap-2 font-bold text-xs text-blue-900">
                          <svg className="size-3.5 shrink-0 text-blue-700" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                          </svg>
                          <span>{msg.meetingCard.title}</span>
                        </div>
                        <p className="mt-1 text-[11px] text-slate-600">{msg.meetingCard.time}</p>
                        <a
                          href={msg.meetingCard.meetUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="mt-2.5 flex h-8 items-center justify-center rounded-lg bg-blue-600 px-3 text-xs font-bold text-white transition hover:bg-blue-700"
                        >
                          Join Google Meet Call →
                        </a>
                      </div>
                    )}
                  </div>
                  <span className="mt-1 text-[10px] text-slate-400 px-1">{msg.timestamp}</span>
                </div>
              ))}
            </div>

            {/* Message Input Box */}
            <form onSubmit={handleSendMessage} className="p-3 border-t border-slate-100 bg-white">
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  value={messageInput}
                  onChange={(e) => setMessageInput(e.target.value)}
                  placeholder={`Message ${activeConv.user.name}...`}
                  className="flex-1 rounded-xl border border-slate-200 bg-slate-50/50 py-3 px-4 text-xs sm:text-sm text-slate-900 placeholder:text-slate-400 focus:border-blue-500 focus:bg-white focus:outline-none"
                />

                <button
                  type="submit"
                  disabled={!messageInput.trim()}
                  className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-slate-900 text-white transition hover:bg-blue-600 disabled:opacity-40"
                >
                  <svg className="size-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3" />
                  </svg>
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>

      {/* SCHEDULE MEETING MODAL */}
      {isScheduleModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4 backdrop-blur-xs">
          <div className="w-full max-w-md rounded-3xl bg-white p-6 shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="text-base font-bold text-slate-900">Schedule Video Meeting</h3>
              <button
                type="button"
                onClick={() => setIsScheduleModalOpen(false)}
                className="rounded-full p-1 text-slate-400 hover:bg-slate-100"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleScheduleSubmit} className="mt-4 space-y-4">
              <div>
                <label className="text-xs font-bold text-slate-700">Meeting Topic / Agenda</label>
                <input
                  type="text"
                  value={meetingTopic}
                  onChange={(e) => setMeetingTopic(e.target.value)}
                  placeholder="e.g. React Re-render Diagnostics 1:1"
                  required
                  className="mt-1.5 h-11 w-full rounded-xl border border-slate-200 px-3 text-xs text-slate-900 focus:border-blue-500 focus:outline-none"
                />
              </div>

              <p className="text-[11px] text-slate-500">
                A secure Google Meet video link will be generated and shared in the chat with {activeConv.user.name}.
              </p>

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsScheduleModalOpen(false)}
                  className="rounded-xl border border-slate-200 px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="rounded-xl bg-slate-900 px-5 py-2 text-xs font-bold text-white transition hover:bg-blue-600"
                >
                  Generate Meet Link & Share →
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
