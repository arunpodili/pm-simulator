"use client";

import { useState, useCallback } from "react";
import { Template, TemplateFormState, LearnContent } from "@/types";
import { learnContent } from "@/content/learn";
import { generateMarkdown, generatePDFContent } from "@/lib/documentGenerator";
import {
  Lightbulb,
  X,
  ChevronDown,
  ChevronUp,
  Download,
  Eye,
  CheckCircle,
  AlertCircle,
  ArrowLeft,
  EyeOff,
  Settings,
  Plus,
  Trash2,
  FileText,
  FileJson,
  ExternalLink,
  Copy,
  Share2,
} from "lucide-react";

interface TemplateWorkspaceProps {
  template: Template;
  onBack: () => void;
}

export default function TemplateWorkspace({ template, onBack }: TemplateWorkspaceProps) {
  const [formState, setFormState] = useState<TemplateFormState>({});
  const [hiddenSections, setHiddenSections] = useState<Set<string>>(new Set());
  const [collapsedSections, setCollapsedSections] = useState<Set<string>>(new Set());
  const [openHintPanel, setOpenHintPanel] = useState<string | null>(null);
  const [showPreview, setShowPreview] = useState(false);
  const [showExportMenu, setShowExportMenu] = useState(false);

  const handleChange = useCallback((sectionId: string, value: any) => {
    setFormState((prev) => ({ ...prev, [sectionId]: value }));
  }, []);

  const toggleSectionVisibility = useCallback((sectionId: string) => {
    setHiddenSections((prev) => {
      const next = new Set(prev);
      if (next.has(sectionId)) {
        next.delete(sectionId);
      } else {
        next.add(sectionId);
      }
      return next;
    });
  }, []);

  const toggleSectionCollapse = useCallback((sectionId: string) => {
    setCollapsedSections((prev) => {
      const next = new Set(prev);
      if (next.has(sectionId)) {
        next.delete(sectionId);
      } else {
        next.add(sectionId);
      }
      return next;
    });
  }, []);

  const getLearnContent = useCallback((sectionId: string): LearnContent | undefined => {
    const section = template.sections.find((s) => s.id === sectionId);
    if (!section?.learnContentId) return undefined;
    return learnContent.find((lc) => lc.id === section.learnContentId);
  }, [template.sections]);

  const handleExport = useCallback((format: string) => {
    const content = generateMarkdown(template, formState);

    switch (format) {
      case "markdown":
        {
          const blob = new Blob([content], { type: "text/markdown" });
          const url = URL.createObjectURL(blob);
          const a = document.createElement("a");
          a.href = url;
          a.download = `${template.name.replace(/\s+/g, "-").toLowerCase()}.md`;
          a.click();
          URL.revokeObjectURL(url);
        }
        break;
      case "pdf":
        {
          // Create print-friendly window
          const printWindow = window.open("", "_blank");
          printWindow?.document.write(generatePDFContent(template, formState));
          printWindow?.document.close();
          printWindow?.focus();
          setTimeout(() => printWindow?.print(), 250);
        }
        break;
      case "docx":
        {
          // For now, copy to clipboard with notification
          navigator.clipboard.writeText(content);
          alert("Content copied! Paste into Word and save as .docx");
        }
        break;
      case "google-docs":
        {
          navigator.clipboard.writeText(content);
          window.open("https://docs.google.com/document/create", "_blank");
          setTimeout(() => {
            alert("Content copied to clipboard! Paste into your Google Doc.");
          }, 1000);
        }
        break;
      case "notion":
        {
          navigator.clipboard.writeText(content);
          window.open("https://www.notion.so", "_blank");
          setTimeout(() => {
            alert("Content copied! Paste into Notion (Ctrl/Cmd+Shift+V for plain text)");
          }, 1000);
        }
        break;
    }
    setShowExportMenu(false);
  }, [template, formState]);

  const visibleSections = template.sections.filter((s) => !hiddenSections.has(s.id));
  const completionPercentage = Math.round(
    (visibleSections.filter((s) => formState[s.id]?.trim()).length / visibleSections.length) * 100
  );

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="sticky top-0 z-40 bg-white border-b border-gray-100">
        <div className="container mx-auto px-6">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-4">
              <button
                onClick={onBack}
                className="flex items-center gap-2 text-sm text-gray-600 hover:text-black transition-colors"
              >
                <ArrowLeft className="w-4 h-4" />
                Back
              </button>
              <div className="h-6 w-px bg-gray-200" />
              <div>
                <h1 className="font-heading font-semibold text-lg">{template.name}</h1>
                <p className="text-xs text-gray-500">{template.description}</p>
              </div>
            </div>

            <div className="flex items-center gap-4">
              {/* Progress */}
              <div className="flex items-center gap-3">
                <div className="w-32 h-2 bg-gray-100 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-black transition-all duration-300"
                    style={{ width: `${completionPercentage}%` }}
                  />
                </div>
                <span className="text-sm font-medium text-gray-600">{completionPercentage}%</span>
              </div>

              {/* Preview */}
              <button
                onClick={() => setShowPreview(!showPreview)}
                className="flex items-center gap-2 px-3 py-2 text-sm text-gray-600 hover:bg-gray-100 rounded-md transition-colors"
              >
                <Eye className="w-4 h-4" />
                Preview
              </button>

              {/* Export Menu */}
              <div
                className="relative"
                onMouseEnter={() => setShowExportMenu(true)}
                onMouseLeave={() => setShowExportMenu(false)}
              >
                <button className="flex items-center gap-2 px-4 py-2 bg-black text-white text-sm font-medium rounded-md hover:bg-gray-800 transition-colors">
                  <Download className="w-4 h-4" />
                  Export
                  <ChevronDown className="w-3.5 h-3.5" />
                </button>

                {showExportMenu && (
                  <div className="absolute top-full right-0 mt-2 w-64 bg-white border border-gray-100 rounded-lg shadow-lg py-2 z-50">
                    <ExportOption
                      icon={<FileText className="w-5 h-5" />}
                      label="Markdown"
                      description=".md file"
                      onClick={() => handleExport("markdown")}
                    />
                    <ExportOption
                      icon={<FileText className="w-5 h-5" />}
                      label="PDF"
                      description="Print-ready format"
                      onClick={() => handleExport("pdf")}
                    />
                    <ExportOption
                      icon={<FileJson className="w-5 h-5" />}
                      label="Word Document"
                      description=".docx (copy to clipboard)"
                      onClick={() => handleExport("docx")}
                    />
                    <div className="border-t border-gray-100 my-2" />
                    <ExportOption
                      icon={<ExternalLink className="w-5 h-5" />}
                      label="Google Docs"
                      description="Open in new tab"
                      onClick={() => handleExport("google-docs")}
                    />
                    <ExportOption
                      icon={<Share2 className="w-5 h-5" />}
                      label="Notion"
                      description="Open in new tab"
                      onClick={() => handleExport("notion")}
                    />
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-6 py-8">
        <div className="flex gap-8">
          {/* Main Content */}
          <div className="flex-1 max-w-5xl">
            {/* Document Controls */}
            <div className="mb-6 p-4 bg-white border border-gray-100 rounded-lg">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <button className="flex items-center gap-2 text-sm text-gray-600 hover:text-black">
                    <Plus className="w-4 h-4" />
                    Add Section
                  </button>
                  <button className="flex items-center gap-2 text-sm text-gray-600 hover:text-black">
                    <Settings className="w-4 h-4" />
                    Configure
                  </button>
                </div>
                <span className="text-sm text-gray-500">
                  {hiddenSections.size} section{hiddenSections.size !== 1 ? "s" : ""} hidden
                </span>
              </div>
            </div>

            {/* Template Sections */}
            <div className="space-y-4">
              {template.sections.map((section, index) => (
                <CollapsibleSection
                  key={section.id}
                  section={section}
                  index={index}
                  value={formState[section.id] || ""}
                  isHidden={hiddenSections.has(section.id)}
                  isCollapsed={collapsedSections.has(section.id)}
                  hasHintContent={!!section.learnContentId}
                  onChange={(value) => handleChange(section.id, value)}
                  onToggleVisibility={() => toggleSectionVisibility(section.id)}
                  onToggleCollapse={() => toggleSectionCollapse(section.id)}
                  onOpenHint={() => setOpenHintPanel(openHintPanel === section.id ? null : section.id)}
                />
              ))}
            </div>
          </div>

          {/* Hint Panel - Fixed Position */}
          {openHintPanel && (
            <HintPanel
              content={getLearnContent(openHintPanel)}
              section={template.sections.find((s) => s.id === openHintPanel)}
              onClose={() => setOpenHintPanel(null)}
            />
          )}
        </div>
      </div>

      {/* Preview Modal */}
      {showPreview && (
        <PreviewModal
          content={generateMarkdown(template, formState)}
          onClose={() => setShowPreview(false)}
        />
      )}
    </div>
  );
}

// ============================================
// EXPORT OPTION COMPONENT
// ============================================

function ExportOption({
  icon,
  label,
  description,
  onClick,
}: {
  icon: React.ReactNode;
  label: string;
  description: string;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className="w-full flex items-start gap-3 px-4 py-3 hover:bg-gray-50 transition-colors"
    >
      <div className="w-10 h-10 bg-gray-100 rounded-md flex items-center justify-center flex-shrink-0">
        {icon}
      </div>
      <div className="text-left">
        <div className="text-sm font-medium text-gray-900">{label}</div>
        <div className="text-xs text-gray-500">{description}</div>
      </div>
    </button>
  );
}

// ============================================
// COLLAPSIBLE SECTION COMPONENT
// ============================================

interface CollapsibleSectionProps {
  section: any;
  index: number;
  value: string;
  isHidden: boolean;
  isCollapsed: boolean;
  hasHintContent: boolean;
  onChange: (value: string) => void;
  onToggleVisibility: () => void;
  onToggleCollapse: () => void;
  onOpenHint: () => void;
}

function CollapsibleSection({
  section,
  index,
  value,
  isHidden,
  isCollapsed,
  hasHintContent,
  onChange,
  onToggleVisibility,
  onToggleCollapse,
  onOpenHint,
}: CollapsibleSectionProps) {
  if (isHidden) {
    return (
      <div className="bg-gray-50 border border-gray-200 border-dashed rounded-lg p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3 text-gray-500">
            <EyeOff className="w-4 h-4" />
            <span className="text-sm font-medium">{section.title}</span>
          </div>
          <button
            onClick={onToggleVisibility}
            className="text-sm text-gray-600 hover:text-black"
          >
            Show Section
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white border border-gray-200 rounded-lg overflow-hidden transition-all hover:border-gray-300">
      {/* Section Header */}
      <div
        className="flex items-center justify-between px-6 py-4 bg-gray-50 cursor-pointer"
        onClick={onToggleCollapse}
      >
        <div className="flex items-center gap-4">
          <span
            className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${
              value?.trim()
                ? "bg-black text-white"
                : "bg-gray-200 text-gray-600"
            }`}
          >
            {value?.trim() ? "✓" : index + 1}
          </span>
          <div>
            <h3 className="font-heading font-semibold text-base">{section.title}</h3>
            {section.description && (
              <p className="text-xs text-gray-500 mt-0.5">{section.description}</p>
            )}
          </div>
        </div>

        <div className="flex items-center gap-1">
          {hasHintContent && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                onOpenHint();
              }}
              className="p-2 hover:bg-gray-200 rounded-md transition-colors"
              title="Show guidance"
            >
              <Lightbulb className="w-4 h-4 text-amber-600" />
            </button>
          )}
          <button
            onClick={(e) => {
              e.stopPropagation();
              onToggleVisibility();
            }}
            className="p-2 hover:bg-gray-200 rounded-md transition-colors"
            title="Hide section"
          >
            <EyeOff className="w-4 h-4" />
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
            }}
            className="p-2 hover:bg-gray-200 rounded-md transition-colors"
            title="Section settings"
          >
            <Settings className="w-4 h-4" />
          </button>
          <ChevronDown
            className={`w-5 h-5 text-gray-400 transition-transform ${
              isCollapsed ? "" : "rotate-180"
            }`}
          />
        </div>
      </div>

      {/* Section Content */}
      {!isCollapsed && (
        <div className="px-6 py-5">
          {section.helpText && (
            <div className="mb-4 p-3 bg-gray-50 border-l-2 border-gray-300 rounded-r-md">
              <p className="text-sm text-gray-700">{section.helpText}</p>
            </div>
          )}

          {/* Structured Fields for complex sections */}
          {section.id === "problem-statement" || section.id === "executive-summary" ? (
            <StructuredFields
              sectionId={section.id}
              value={value}
              onChange={onChange}
            />
          ) : (
            <textarea
              value={value}
              onChange={(e) => onChange(e.target.value)}
              placeholder={section.placeholder || "Start writing..."}
              className="w-full min-h-[200px] p-4 bg-white border border-gray-200 rounded-md font-body text-sm focus:outline-none focus:border-gray-400 focus:ring-2 focus:ring-gray-100 transition-all resize-y"
              style={{ fontFamily: "var(--font-body)" }}
            />
          )}

          {/* Example Text (Always Visible) */}
          {section.placeholder && (
            <div className="mt-4 p-4 bg-gray-50 rounded-md">
              <p className="text-xs font-medium text-gray-400 uppercase tracking-wider mb-2">
                Example
              </p>
              <pre className="text-sm text-gray-600 whitespace-pre-wrap font-body">
                {section.placeholder}
              </pre>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

// ============================================
// STRUCTURED FIELDS COMPONENT
// ============================================

function StructuredFields({
  sectionId,
  value,
  onChange,
}: {
  sectionId: string;
  value: string;
  onChange: (value: string) => void;
}) {
  const [fields, setFields] = useState({
    what: "",
    who: "",
    why: "",
    impact: "",
    when: "",
  });

  const updateField = (field: string, fieldValue: string) => {
    const newFields = { ...fields, [field]: fieldValue };
    setFields(newFields);
    // Combine into single value for export
    onChange(
      `### What\n${newFields.what}\n\n### Who\n${newFields.who}\n\n### Why\n${newFields.why}\n\n### Impact\n${newFields.impact}\n\n### When\n${newFields.when}`
    );
  };

  return (
    <div className="space-y-4">
      <StructuredField
        label="What"
        placeholder="What is the problem/solution?"
        value={fields.what}
        onChange={(v) => updateField("what", v)}
        example="Enterprise customers take 14 days average to activate"
      />
      <StructuredField
        label="Who"
        placeholder="Who experiences this?"
        value={fields.who}
        onChange={(v) => updateField("who", v)}
        example="New SMB customers, ~40% of signups"
      />
      <StructuredField
        label="Why"
        placeholder="Why does this matter?"
        value={fields.why}
        onChange={(v) => updateField("why", v)}
        example="Delayed time-to-value correlates with churn"
      />
      <StructuredField
        label="Impact"
        placeholder="What's the business impact?"
        value={fields.impact}
        onChange={(v) => updateField("impact", v)}
        example="~$2M annual ARR loss from early churn"
      />
      <StructuredField
        label="When"
        placeholder="When does this occur?"
        value={fields.when}
        onChange={(v) => updateField("when", v)}
        example="During initial onboarding, days 1-14"
      />
    </div>
  );
}

function StructuredField({
  label,
  placeholder,
  value,
  onChange,
  example,
}: {
  label: string;
  placeholder: string;
  value: string;
  onChange: (value: string) => void;
  example: string;
}) {
  const [isFocused, setIsFocused] = useState(false);

  return (
    <div
      className={`p-4 border rounded-md transition-all ${
        isFocused
          ? "border-gray-400 bg-white shadow-sm"
          : "border-gray-200 bg-gray-50"
      }`}
    >
      <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">
        {label}
      </label>
      <textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
        placeholder={placeholder}
        rows={2}
        className="w-full bg-transparent outline-none text-sm font-body resize-none"
      />
      {value && (
        <div className="mt-3 pt-3 border-t border-gray-100">
          <p className="text-xs text-gray-400 mb-1">💡 Example:</p>
          <p className="text-sm text-gray-600">{example}</p>
        </div>
      )}
    </div>
  );
}

// ============================================
// HINT PANEL COMPONENT (Interactive)
// ============================================

interface HintPanelProps {
  content: LearnContent | undefined;
  section: any;
  onClose: () => void;
}

function HintPanel({ content, section, onClose }: HintPanelProps) {
  if (!content) {
    return (
      <div className="fixed right-6 top-24 w-96 bg-white border border-gray-200 rounded-lg shadow-lg p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-semibold">Guidance</h3>
          <button onClick={onClose} className="p-1 hover:bg-gray-100 rounded">
            <X className="w-4 h-4" />
          </button>
        </div>
        <p className="text-sm text-gray-600">
          No detailed guidance available for this section.
        </p>
      </div>
    );
  }

  return (
    <div className="fixed right-6 top-24 w-96 max-h-[calc(100vh-8rem)] overflow-y-auto bg-white border border-gray-200 rounded-lg shadow-lg z-50">
      {/* Header */}
      <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
        <div className="flex items-center gap-2">
          <Lightbulb className="w-5 h-5 text-amber-600" />
          <h3 className="font-heading font-semibold text-base">{content.title}</h3>
        </div>
        <button onClick={onClose} className="p-1 hover:bg-gray-100 rounded">
          <X className="w-4 h-4 text-gray-400" />
        </button>
      </div>

      {/* Content */}
      <div className="p-5">
        {/* Category Badge */}
        <span
          className={`inline-block px-2.5 py-1 text-xs font-medium rounded-full mb-4 ${
            content.category === "how-to"
              ? "bg-gray-100 text-gray-700"
              : content.category === "best-practice"
              ? "bg-gray-100 text-gray-700"
              : content.category === "concept"
              ? "bg-gray-100 text-gray-700"
              : "bg-gray-100 text-gray-700"
          }`}
        >
          {content.category.replace("-", " ")}
        </span>

        {/* Content Body */}
        <div className="prose prose-sm max-w-none">
          {content.content.split("\n").map((paragraph, i) => {
            if (paragraph.startsWith("## ")) {
              return (
                <h4 key={i} className="font-heading font-semibold text-base mt-4 mb-2">
                  {paragraph.replace("## ", "")}
                </h4>
              );
            }
            if (paragraph.startsWith("### ")) {
              return (
                <h5 key={i} className="font-ui font-semibold text-sm mt-3 mb-1.5 text-gray-700">
                  {paragraph.replace("### ", "")}
                </h5>
              );
            }
            if (paragraph.startsWith("- ") || paragraph.startsWith("✅ ") || paragraph.startsWith("❌ ")) {
              return (
                <li key={i} className="text-sm text-gray-700 ml-4">
                  {paragraph}
                </li>
              );
            }
            if (paragraph.startsWith("> ")) {
              return (
                <blockquote
                  key={i}
                  className="border-l-2 border-gray-200 pl-4 my-3 text-sm text-gray-600 italic"
                >
                  {paragraph.replace("> ", "")}
                </blockquote>
              );
            }
            if (paragraph.startsWith("|")) {
              // Simple table rendering
              return (
                <div key={i} className="my-3 overflow-x-auto">
                  <table className="w-full text-sm border-collapse">
                    <tbody>
                      {paragraph.split("\n").map((row, j) => (
                        <tr key={j} className={j === 1 ? "border-b-2 border-gray-300" : "border-b border-gray-100"}>
                          {row.split("|").filter(Boolean).map((cell, k) => (
                            <td key={k} className="px-3 py-2 text-gray-700">
                              {cell.trim()}
                            </td>
                          ))}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              );
            }
            if (paragraph.trim() === "") {
              return <div key={i} className="h-3" />;
            }
            return (
              <p key={i} className="text-sm text-gray-700 mb-2">
                {paragraph}
              </p>
            );
          })}
        </div>

        {/* Read Time */}
        <div className="mt-6 pt-4 border-t border-gray-100">
          <p className="text-xs text-gray-400">
            📚 {content.readTime} min read · Based on PM best practices
          </p>
        </div>
      </div>
    </div>
  );
}

// ============================================
// PREVIEW MODAL
// ============================================

interface PreviewModalProps {
  content: string;
  onClose: () => void;
}

function PreviewModal({ content, onClose }: PreviewModalProps) {
  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-8">
      <div className="absolute inset-0 bg-black/50 backdrop-sm" onClick={onClose} />
      <div className="relative bg-white rounded-xl shadow-2xl w-full max-w-5xl max-h-[85vh] overflow-hidden">
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
          <h3 className="font-heading font-semibold text-lg">Document Preview</h3>
          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                navigator.clipboard.writeText(content);
                alert("Copied to clipboard!");
              }}
              className="flex items-center gap-2 px-3 py-1.5 text-sm text-gray-600 hover:bg-gray-100 rounded-md transition-colors"
            >
              <Copy className="w-4 h-4" />
              Copy
            </button>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-md transition-colors"
            >
              <X className="w-5 h-5 text-gray-400" />
            </button>
          </div>
        </div>
        <div className="p-8 overflow-y-auto max-h-[calc(85vh-80px)] bg-gray-50">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8 max-w-3xl mx-auto">
            <pre className="whitespace-pre-wrap font-body text-sm text-gray-800">{content}</pre>
          </div>
        </div>
      </div>
    </div>
  );
}
