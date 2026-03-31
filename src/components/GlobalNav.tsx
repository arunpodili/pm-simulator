"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Search,
  ChevronDown,
  FileText,
  Book,
  MessageSquare,
  Lightbulb,
  Settings,
  User,
  Download,
  FolderOpen,
  Plus,
  Command,
  X,
} from "lucide-react";

interface NavItem {
  label: string;
  href?: string;
  icon?: React.ReactNode;
  children?: NavItem[];
}

const navItems: NavItem[] = [
  {
    label: "Templates",
    icon: <FileText className="w-4 h-4" />,
    children: [
      { label: "Feature Launch PRD", href: "/simulator?template=prd" },
      { label: "Product Strategy", href: "/simulator?template=strategy" },
      { label: "User Research Plan", href: "/simulator?template=research" },
      { label: "Go-to-Market Plan", href: "/simulator?template=gtm" },
      { label: "Roadmap Planning", href: "/simulator?template=roadmap" },
      { label: "Pricing Change", href: "/simulator?template=pricing" },
    ],
  },
  {
    label: "Case Studies",
    icon: <Book className="w-4 h-4" />,
    children: [
      { label: "Browse All", href: "/case-studies" },
      { label: "SaaS", href: "/case-studies?industry=saas" },
      { label: "FinTech", href: "/case-studies?industry=fintech" },
      { label: "Health", href: "/case-studies?industry=health" },
      { label: "E-commerce", href: "/case-studies?industry=ecommerce" },
      { label: "AI/ML", href: "/case-studies?industry=ai" },
    ],
  },
  {
    label: "Community",
    icon: <MessageSquare className="w-4 h-4" />,
    children: [
      { label: "Forum", href: "/forum" },
      { label: "Ask a Question", href: "/forum?new=true" },
      { label: "Popular Tags", href: "/forum?tags=popular" },
    ],
  },
  {
    label: "Resources",
    icon: <Lightbulb className="w-4 h-4" />,
    children: [
      { label: "Framework Library", href: "/frameworks" },
      { label: "Persona Templates", href: "/personas" },
      { label: "Documentation", href: "/docs" },
    ],
  },
];

export default function GlobalNav() {
  const pathname = usePathname();
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  // Keyboard shortcut for search
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        setSearchOpen(true);
      }
      if (e.key === "Escape") {
        setSearchOpen(false);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  return (
    <>
      <header className="sticky top-0 z-50 bg-white border-b border-gray-100">
        <div className="container mx-auto px-6">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <Link href="/" className="flex items-center gap-3">
              <div className="w-8 h-8 bg-black rounded-lg flex items-center justify-center">
                <Lightbulb className="w-5 h-5 text-white" />
              </div>
              <span className="font-heading font-bold text-lg tracking-tight">
                PM Simulator
              </span>
            </Link>

            {/* Navigation - Dropdowns */}
            <nav className="hidden md:flex items-center gap-1">
              {navItems.map((item) => (
                <Dropdown key={item.label} item={item} pathname={pathname} />
              ))}
            </nav>

            {/* Right Side Actions */}
            <div className="flex items-center gap-3">
              {/* Search */}
              <button
                onClick={() => setSearchOpen(true)}
                className="flex items-center gap-2 px-3 py-2 bg-gray-50 hover:bg-gray-100 rounded-md transition-all min-w-[200px]"
              >
                <Search className="w-4 h-4 text-gray-400" />
                <span className="text-sm text-gray-500">Search...</span>
                <kbd className="ml-auto px-1.5 py-0.5 text-xs bg-white rounded border border-gray-200 text-gray-400">
                  ⌘K
                </kbd>
              </button>

              {/* New Document */}
              <Link
                href="/simulator"
                className="flex items-center gap-2 px-4 py-2 bg-black text-white text-sm font-medium rounded-md hover:bg-gray-800 transition-all"
              >
                <Plus className="w-4 h-4" />
                New
              </Link>

              {/* User Menu */}
              <button className="p-2 hover:bg-gray-100 rounded-md transition-colors">
                <User className="w-5 h-5 text-gray-600" />
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Search Modal */}
      {searchOpen && (
        <SearchModal
          query={searchQuery}
          setQuery={setSearchQuery}
          onClose={() => setSearchOpen(false)}
        />
      )}
    </>
  );
}

function Dropdown({ item, pathname }: { item: NavItem; pathname: string }) {
  const [isOpen, setIsOpen] = useState(false);

  if (!item.children) {
    return (
      <Link
        href={item.href || "#"}
        className={`px-4 py-2 text-sm font-medium rounded-md transition-colors ${
          pathname === item.href
            ? "bg-gray-100 text-black"
            : "text-gray-600 hover:text-black hover:bg-gray-50"
        }`}
      >
        {item.label}
      </Link>
    );
  }

  return (
    <div
      className="relative"
      onMouseEnter={() => setIsOpen(true)}
      onMouseLeave={() => setIsOpen(false)}
    >
      <button
        className={`flex items-center gap-1.5 px-4 py-2 text-sm font-medium rounded-md transition-colors ${
          item.children.some((c) => c.href === pathname)
            ? "bg-gray-100 text-black"
            : "text-gray-600 hover:text-black hover:bg-gray-50"
        }`}
      >
        {item.icon}
        {item.label}
        <ChevronDown className={`w-3.5 h-3.5 transition-transform ${isOpen ? "rotate-180" : ""}`} />
      </button>

      {isOpen && (
        <div className="absolute top-full left-0 mt-1 w-56 bg-white border border-gray-100 rounded-lg shadow-lg py-2 animate-in fade-in slide-in-from-top-2 duration-200">
          {item.children.map((child) => (
            <Link
              key={child.label}
              href={child.href || "#"}
              className={`flex items-center gap-3 px-4 py-2.5 text-sm transition-colors ${
                pathname === child.href
                  ? "bg-gray-50 text-black"
                  : "text-gray-600 hover:bg-gray-50 hover:text-black"
              }`}
            >
              {child.label}
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}

function SearchModal({
  query,
  setQuery,
  onClose,
}: {
  query: string;
  setQuery: (q: string) => void;
  onClose: () => void;
}) {
  const searchResults = [
    { category: "Templates", items: ["Feature Launch PRD", "Product Strategy", "User Research Plan"] },
    { category: "Frameworks", items: ["RICE Prioritization", "Jobs to be Done", "OKRs"] },
    { category: "Case Studies", items: ["How We Reduced Churn by 40%", "Navigating HIPAA Compliance"] },
  ];

  const filteredResults = query
    ? searchResults.map((cat) => ({
        ...cat,
        items: cat.items.filter((item) => item.toLowerCase().includes(query.toLowerCase())),
      }))
    : searchResults;

  return (
    <div className="fixed inset-0 z-[100] flex items-start justify-center pt-[15vh]">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/40 backdrop-sm" onClick={onClose} />

      {/* Modal */}
      <div className="relative w-full max-w-2xl bg-white rounded-xl shadow-2xl border border-gray-100 overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        {/* Search Input */}
        <div className="flex items-center gap-3 px-4 py-3 border-b border-gray-100">
          <Search className="w-5 h-5 text-gray-400" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search templates, frameworks, case studies..."
            className="flex-1 text-base outline-none"
            autoFocus
          />
          <button
            onClick={onClose}
            className="p-1 hover:bg-gray-100 rounded transition-colors"
          >
            <X className="w-5 h-5 text-gray-400" />
          </button>
        </div>

        {/* Results */}
        <div className="max-h-[50vh] overflow-y-auto p-2">
          {filteredResults.every((cat) => cat.items.length === 0) ? (
            <div className="text-center py-12 text-gray-500">
              <Search className="w-12 h-12 mx-auto mb-3 text-gray-300" />
              <p>No results found for "{query}"</p>
            </div>
          ) : (
            filteredResults.map(
              (cat) =>
                cat.items.length > 0 && (
                  <div key={cat.category} className="mb-4">
                    <div className="px-3 py-2 text-xs font-medium text-gray-400 uppercase tracking-wider">
                      {cat.category}
                    </div>
                    {cat.items.map((item) => (
                      <button
                        key={item}
                        className="w-full flex items-center gap-3 px-3 py-2.5 text-sm text-gray-700 hover:bg-gray-50 rounded-md transition-colors"
                        onClick={onClose}
                      >
                        <FileText className="w-4 h-4 text-gray-400" />
                        {item}
                      </button>
                    ))}
                  </div>
                )
            )
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between px-4 py-3 bg-gray-50 border-t border-gray-100">
          <div className="flex items-center gap-4 text-xs text-gray-500">
            <span className="flex items-center gap-1">
              <Command className="w-3 h-3" />
              <kbd className="px-1.5 py-0.5 bg-white rounded border border-gray-200">K</kbd>
              to search
            </span>
            <span className="flex items-center gap-1">
              <kbd className="px-1.5 py-0.5 bg-white rounded border border-gray-200">↑↓</kbd>
              to navigate
            </span>
            <span className="flex items-center gap-1">
              <kbd className="px-1.5 py-0.5 bg-white rounded border border-gray-200">Esc</kbd>
              to close
            </span>
          </div>
          <div className="text-xs text-gray-400">
            {filteredResults.reduce((acc, cat) => acc + cat.items.length, 0)} results
          </div>
        </div>
      </div>
    </div>
  );
}
