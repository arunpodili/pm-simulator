"use client";

import { useState } from "react";
import {
  MessageSquare,
  TrendingUp,
  Search,
  Plus,
  Heart,
  MessageCircle,
  Eye,
  Clock,
  User,
  Tag,
  Filter,
} from "lucide-react";

// Sample forum posts data (will be replaced with database)
const samplePosts = [
  {
    id: "1",
    title: "How do you handle stakeholder requests that conflict with roadmap?",
    author: "Alex Kim",
    authorRole: "Senior PM @ TechCorp",
    category: "stakeholder-management",
    content:
      "I'm constantly getting requests from sales for custom features that would derail our Q2 roadmap. How do you all balance keeping stakeholders happy while staying focused on strategic priorities?",
    upvotes: 89,
    views: 2340,
    answers: 12,
    tags: ["stakeholders", "roadmap", "prioritization"],
    createdAt: "2025-03-28T10:30:00Z",
    hasAcceptedAnswer: true,
  },
  {
    id: "2",
    title: "Best practices for A/B test sample size in B2B?",
    author: "Maria Santos",
    authorRole: "Product Lead @ SaaSflow",
    category: "technical",
    content:
      "We have ~500 MAU in our target segment. Traditional power calculations say we need weeks for significance. How do you all handle experimentation with limited traffic?",
    upvotes: 67,
    views: 1890,
    answers: 8,
    tags: ["ab-testing", "b2b", "metrics", "experimentation"],
    createdAt: "2025-03-27T14:15:00Z",
    hasAcceptedAnswer: false,
  },
  {
    id: "3",
    title: "Transitioning from B2C to B2B PM - what surprised you?",
    author: "Jordan Lee",
    authorRole: "PM @ StartupXYZ",
    category: "career",
    content:
      "I've spent 5 years in consumer products and just took a B2B PM role. What are the biggest mindset shifts I should prepare for?",
    upvotes: 124,
    views: 4560,
    answers: 23,
    tags: ["career", "b2b", "b2c", "transition"],
    createdAt: "2025-03-26T09:00:00Z",
    hasAcceptedAnswer: false,
  },
  {
    id: "4",
    title: "Framework for deciding when to build vs buy?",
    author: "Priya Patel",
    authorRole: "VP Product @ FinTech Co",
    category: "methodology",
    content:
      "Looking for a structured approach to evaluate build vs buy decisions. We're facing this for analytics, customer support tools, and more. What frameworks have worked for you?",
    upvotes: 156,
    views: 5230,
    answers: 18,
    tags: ["build-vs-buy", "framework", "strategy"],
    createdAt: "2025-03-25T16:45:00Z",
    hasAcceptedAnswer: true,
  },
  {
    id: "5",
    title: "Dealing with technical debt as a non-technical PM?",
    author: "Chris Morgan",
    authorRole: "PM @ E-comm Plus",
    category: "general",
    content:
      "Engineering keeps flagging tech debt but I struggle to prioritize it against feature work. How do you evaluate and advocate for tech debt without being able to estimate it yourself?",
    upvotes: 201,
    views: 6780,
    answers: 31,
    tags: ["technical-debt", "prioritization", "engineering"],
    createdAt: "2025-03-24T11:20:00Z",
    hasAcceptedAnswer: true,
  },
  {
    id: "6",
    title: "How to say no to a CEO's feature request?",
    author: "Taylor Wright",
    authorRole: "Head of Product @ ScaleUp",
    category: "stakeholder-management",
    content:
      "Our CEO wants a feature that doesn't align with our strategy and would take significant eng resources. I need to push back but want to do it diplomatically. Scripts?",
    upvotes: 312,
    views: 8900,
    answers: 27,
    tags: ["ceo", "stakeholders", "saying-no", "diplomacy"],
    createdAt: "2025-03-23T08:30:00Z",
    hasAcceptedAnswer: true,
  },
];

const categories = [
  { id: "all", name: "All Posts", icon: MessageSquare },
  { id: "general", name: "General", icon: MessageCircle },
  { id: "stakeholder-management", name: "Stakeholder Management", icon: User },
  { id: "career", name: "Career", icon: TrendingUp },
  { id: "technical", name: "Technical", icon: Filter },
  { id: "methodology", name: "Methodology", icon: Tag },
];

export default function ForumPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [sortBy, setSortBy] = useState("recent");
  const [showNewPostModal, setShowNewPostModal] = useState(false);

  const filteredPosts = samplePosts.filter((post) => {
    const matchesSearch =
      post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      post.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
      post.tags.some((tag) => tag.toLowerCase().includes(searchQuery.toLowerCase()));
    const matchesCategory = selectedCategory === "all" || post.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <header className="bg-white border-b">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <MessageSquare className="w-6 h-6 text-blue-600" />
              <span className="text-xl font-bold">PM Simulator</span>
            </div>
            <nav className="flex items-center gap-6">
              <a href="/simulator" className="text-sm text-slate-600 hover:text-slate-900">
                Simulator
              </a>
              <a href="/case-studies" className="text-sm text-slate-600 hover:text-slate-900">
                Case Studies
              </a>
              <a href="/forum" className="text-sm text-slate-900 font-medium">
                Forum
              </a>
            </nav>
          </div>
        </div>
      </header>

      {/* Hero */}
      <section className="bg-white border-b">
        <div className="container mx-auto px-4 py-12">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-bold text-slate-900 mb-4">
                PM Community Forum
              </h1>
              <p className="text-lg text-slate-600 max-w-2xl">
                Get advice from experienced PMs, share your challenges, and learn from the
                community. No question is too basic.
              </p>
            </div>
            <button
              onClick={() => setShowNewPostModal(true)}
              className="bg-blue-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-blue-700 transition flex items-center gap-2"
            >
              <Plus className="w-5 h-5" />
              Ask a Question
            </button>
          </div>
        </div>
      </section>

      {/* Content */}
      <section className="container mx-auto px-4 py-6">
        <div className="flex gap-6">
          {/* Sidebar - Categories */}
          <aside className="w-64 flex-shrink-0">
            <div className="bg-white rounded-xl border p-4 sticky top-4">
              <h3 className="font-semibold mb-3">Categories</h3>
              <nav className="space-y-1">
                {categories.map((cat) => (
                  <button
                    key={cat.id}
                    onClick={() => setSelectedCategory(cat.id)}
                    className={`w-full flex items-center gap-2 px-3 py-2 rounded-lg text-sm transition ${
                      selectedCategory === cat.id
                        ? "bg-blue-50 text-blue-700"
                        : "text-slate-600 hover:bg-slate-50"
                    }`}
                  >
                    <cat.icon className="w-4 h-4" />
                    {cat.name}
                  </button>
                ))}
              </nav>

              <div className="mt-6 pt-6 border-t">
                <h3 className="font-semibold mb-3 text-sm">Popular Tags</h3>
                <div className="flex flex-wrap gap-1">
                  {["stakeholders", "roadmap", "metrics", "career", "ab-testing", "prioritization"].map(
                    (tag) => (
                      <span
                        key={tag}
                        className="text-xs bg-slate-100 text-slate-600 px-2 py-1 rounded cursor-pointer hover:bg-slate-200"
                      >
                        #{tag}
                      </span>
                    )
                  )}
                </div>
              </div>
            </div>
          </aside>

          {/* Main - Posts List */}
          <main className="flex-1">
            {/* Search and Sort */}
            <div className="bg-white rounded-xl border p-4 mb-4 flex items-center gap-4">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input
                  type="text"
                  placeholder="Search questions..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="border rounded-lg px-3 py-2 text-sm focus:outline-none"
              >
                <option value="recent">Most Recent</option>
                <option value="top">Top Voted</option>
                <option value="discussed">Most Discussed</option>
              </select>
            </div>

            {/* Posts */}
            <div className="space-y-3">
              {filteredPosts.map((post) => (
                <ForumPostCard key={post.id} post={post} />
              ))}
            </div>

            {filteredPosts.length === 0 && (
              <div className="text-center py-12 text-slate-500 bg-white rounded-xl border">
                <Search className="w-12 h-12 mx-auto mb-4 text-slate-300" />
                <p>No posts found matching your search.</p>
              </div>
            )}
          </main>
        </div>
      </section>

      {/* New Post Modal */}
      {showNewPostModal && (
        <NewPostModal onClose={() => setShowNewPostModal(false)} />
      )}
    </div>
  );
}

function ForumPostCard({ post }: { post: any }) {
  const timeAgo = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diff = Math.floor((now.getTime() - date.getTime()) / 1000);
    if (diff < 60) return "just now";
    if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
    if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
    return `${Math.floor(diff / 86400)}d ago`;
  };

  return (
    <article className="bg-white rounded-xl border p-5 hover:border-blue-300 transition">
      <div className="flex items-start gap-4">
        {/* Vote Count */}
        <div className="flex flex-col items-center gap-1 min-w-[50px]">
          <button className="p-1 hover:bg-slate-100 rounded">
            <Heart className="w-5 h-5 text-slate-400 hover:text-red-500" />
          </button>
          <span className="font-semibold text-sm">{post.upvotes}</span>
          <span className="text-xs text-slate-400">votes</span>
        </div>

        {/* Content */}
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-2">
            {post.hasAcceptedAnswer && (
              <span className="text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded-full flex items-center gap-1">
                <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                  <path
                    fillRule="evenodd"
                    d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                    clipRule="evenodd"
                  />
                </svg>
                Solved
              </span>
            )}
            <span className="text-xs bg-slate-100 text-slate-600 px-2 py-0.5 rounded">
              {post.category}
            </span>
          </div>

          <h3 className="font-semibold text-lg mb-2">{post.title}</h3>
          <p className="text-slate-600 text-sm mb-3 line-clamp-2">{post.content}</p>

          <div className="flex flex-wrap gap-1 mb-3">
            {post.tags.map((tag: string) => (
              <span
                key={tag}
                className="text-xs bg-slate-100 text-slate-600 px-2 py-1 rounded hover:bg-slate-200 cursor-pointer"
              >
                #{tag}
              </span>
            ))}
          </div>

          <div className="flex items-center justify-between text-xs text-slate-500">
            <div className="flex items-center gap-4">
              <span className="flex items-center gap-1">
                <User className="w-3 h-3" />
                {post.author}
              </span>
              <span className="flex items-center gap-1">
                <Clock className="w-3 h-3" />
                {timeAgo(post.createdAt)}
              </span>
              <span className="flex items-center gap-1">
                <MessageCircle className="w-3 h-3" />
                {post.answers} answers
              </span>
              <span className="flex items-center gap-1">
                <Eye className="w-3 h-3" />
                {(post.views / 1000).toFixed(1)}k views
              </span>
            </div>
          </div>
        </div>
      </div>
    </article>
  );
}

function NewPostModal({ onClose }: { onClose: () => void }) {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [category, setCategory] = useState("general");

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-xl max-w-2xl w-full max-h-[80vh] overflow-y-auto">
        <div className="p-6 border-b">
          <h3 className="font-semibold text-lg">Ask a Question</h3>
        </div>
        <div className="p-6 space-y-4">
          <div>
            <label className="block text-sm font-medium mb-2">Title</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Summarize your question in one sentence"
              className="w-full border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Category</label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              {categories.filter((c) => c.id !== "all").map((cat) => (
                <option key={cat.id} value={cat.id}>
                  {cat.name}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">
              Details (provide context, what you've tried, industry if relevant)
            </label>
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Give the community enough context to help you..."
              rows={6}
              className="w-full border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Tags</label>
            <input
              type="text"
              placeholder="Add up to 5 tags (comma separated)"
              className="w-full border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>
        <div className="p-6 border-t flex justify-end gap-2">
          <button
            onClick={onClose}
            className="px-4 py-2 text-slate-600 hover:bg-slate-100 rounded"
          >
            Cancel
          </button>
          <button
            onClick={() => {
              alert("Post submitted! (This is a demo - backend needed)");
              onClose();
            }}
            className="px-6 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            Post Question
          </button>
        </div>
      </div>
    </div>
  );
}
