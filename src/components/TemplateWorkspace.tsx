"use client";

import { useState, useCallback, useEffect } from "react";
import { Template, TemplateFormState, LearnContent } from "@/types";
import { learnContent } from "@/content/learn";
import { generateMarkdown, generatePDFContent } from "@/lib/documentGenerator";
import { useUser } from "@/context/UserContext";
import {
  Lightbulb,
  X,
  ChevronDown,
  Download,
  Eye,
  ArrowLeft,
  EyeOff,
  FileText,
  FileJson,
  ExternalLink,
  Copy,
  Share2,
  Search,
  Table as TableIcon,
  List,
  Type,
  CheckSquare,
  Plus,
  Trash2,
} from "lucide-react";

interface TemplateWorkspaceProps {
  template: Template;
  onBack: () => void;
}

export default function TemplateWorkspace({ template, onBack }: TemplateWorkspaceProps) {
  const { profile } = useUser();
  const [formState, setFormState] = useState<TemplateFormState>({});
  const [hiddenSections, setHiddenSections] = useState<Set<string>>(new Set());
  const [collapsedSections, setCollapsedSections] = useState<Set<string>>(new Set());
  const [openHintPanel, setOpenHintPanel] = useState<string | null>(null);
  const [showPreview, setShowPreview] = useState(false);
  const [showExportMenu, setShowExportMenu] = useState(false);
  const [tableData, setTableData] = useState<Record<string, any[]>>({});

  // Pre-populate with user profile data
  useEffect(() => {
    if (profile) {
      const metaSection = template.sections.find(s => s.id === 'document-meta');
      if (metaSection && !formState['document-meta']) {
        let metaContent = `| Document Owner | ${profile.name} |
| Company | ${profile.company} |
| Role | ${profile.role} |
| Status | Draft |
| Version | 1.0 |`;
        setFormState(prev => ({ ...prev, 'document-meta': metaContent }));
      }
    }
  }, [profile, template.sections]);

  const handleChange = useCallback((sectionId: string, value: any) => {
    setFormState((prev) => ({ ...prev, [sectionId]: value }));
  }, []);

  const handleTableChange = useCallback((sectionId: string, rows: any[]) => {
    setTableData((prev) => ({ ...prev, [sectionId]: rows }));
    const section = template.sections.find(s => s.id === sectionId);
    if (section?.tableSchema) {
      const headers = section.tableSchema.columns;
      let markdown = `| ${headers.join(' | ')} |\n| ${headers.map(() => '---').join(' | ')} |\n`;
      rows.forEach(row => {
        markdown += `| ${row.map(cell => cell || '').join(' | ')} |\n`;
      });
      setFormState((prev) => ({ ...prev, [sectionId]: markdown }));
    }
  }, [template.sections]);

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
          const blob = new Blob([content], { type: "text/markdown;charset=utf-8" });
          const url = URL.createObjectURL(blob);
          const a = document.createElement("a");
          a.href = url;
          a.download = `${template.name.replace(/\s+/g, "-").toLowerCase()}.md`;
          document.body.appendChild(a);
          a.click();
          document.body.removeChild(a);
          URL.revokeObjectURL(url);
        }
        break;
      case "pdf":
        {
          const printContent = generatePDFContent(template, formState);
          const printWindow = window.open("", "_blank", "width=1200,height=800");
          if (printWindow) {
            printWindow.document.write(printContent);
            printWindow.document.close();
            printWindow.focus();
            setTimeout(() => {
              printWindow.print();
            }, 250);
          }
        }
        break;
      case "docx":
        {
          navigator.clipboard.writeText(content).then(() => {
            alert("Content copied to clipboard! Paste into Word and save as .docx");
          }).catch(() => {
            const textarea = document.createElement("textarea");
            textarea.value = content;
            document.body.appendChild(textarea);
            textarea.select();
            document.execCommand("copy");
            document.body.removeChild(textarea);
            alert("Content copied to clipboard! Paste into Word and save as .docx");
          });
        }
        break;
      case "google-docs":
        {
          navigator.clipboard.writeText(content).then(() => {
            window.open("https://docs.google.com/document/create", "_blank");
            setTimeout(() => {
              alert("Content copied to clipboard! Paste into your Google Doc (Ctrl/Cmd+V)");
            }, 1000);
          });
        }
        break;
      case "notion":
        {
          navigator.clipboard.writeText(content).then(() => {
            window.open("https://www.notion.so", "_blank");
            setTimeout(() => {
              alert("Content copied to clipboard! Paste into Notion (Ctrl/Cmd+Shift+V for plain text)");
            }, 1000);
          });
        }
        break;
    }
    setShowExportMenu(false);
  }, [template, formState]);

  const visibleSections = template.sections.filter((s) => !hiddenSections.has(s.id));
  const completionPercentage = Math.round(
    (visibleSections.filter((s) => formState[s.id]?.trim() || tableData[s.id]?.some(row => row.some(cell => cell))).length / visibleSections.length) * 100
  );

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="sticky top-0 z-40 bg-white border-b border-gray-100">
        <div className="container mx-auto px-6">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-4">
              <button
                onClick={onBack}
                className="flex items-center gap-2 text-sm text-gray-500 hover:text-black transition-colors"
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
                  <div className="absolute top-full right-0 mt-2 w-64 bg-white border border-gray-100 rounded-lg shadow-lg py-2 z-50 animate-scale-in">
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
        <div className="flex gap-6">
          {/* Main Content - Full Width */}
          <div className="flex-1">
            {/* Template Sections */}
            <div className="space-y-4">
              {template.sections.map((section, index) => (
                <CollapsibleSection
                  key={section.id}
                  section={section}
                  index={index}
                  value={formState[section.id] || ""}
                  tableData={tableData[section.id] || []}
                  isHidden={hiddenSections.has(section.id)}
                  isCollapsed={collapsedSections.has(section.id)}
                  hasHintContent={!!section.learnContentId}
                  userProfile={profile}
                  onChange={(value) => handleChange(section.id, value)}
                  onTableChange={(rows) => handleTableChange(section.id, rows)}
                  onToggleVisibility={() => toggleSectionVisibility(section.id)}
                  onToggleCollapse={() => toggleSectionCollapse(section.id)}
                  onOpenHint={() => setOpenHintPanel(openHintPanel === section.id ? null : section.id)}
                />
              ))}
            </div>
          </div>

          {/* Hint Panel */}
          {openHintPanel && (
            <HintPanel
              content={getLearnContent(openHintPanel)}
              section={template.sections.find((s) => s.id === openHintPanel)}
              onClose={() => setOpenHintPanel(null)}
              onInsert={(text) => {
                const textarea = document.querySelector('textarea:focus') as HTMLTextAreaElement;
                if (textarea) {
                  const start = textarea.selectionStart;
                  const end = textarea.selectionEnd;
                  const currentValue = formState[openHintPanel] || '';
                  const updated = currentValue.slice(0, start) + text + currentValue.slice(end);
                  handleChange(openHintPanel, updated);
                  setTimeout(() => {
                    textarea.focus();
                    textarea.selectionStart = textarea.selectionEnd = start + text.length;
                  }, 0);
                } else {
                  handleChange(openHintPanel, (formState[openHintPanel] || '') + text + '\n');
                }
              }}
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
// EXPORT OPTION
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
// COLLAPSIBLE SECTION - Full Width
// ============================================

interface CollapsibleSectionProps {
  section: any;
  index: number;
  value: string;
  tableData: any[];
  isHidden: boolean;
  isCollapsed: boolean;
  hasHintContent: boolean;
  userProfile: any;
  onChange: (value: string) => void;
  onTableChange: (rows: any[]) => void;
  onToggleVisibility: () => void;
  onToggleCollapse: () => void;
  onOpenHint: () => void;
}

function CollapsibleSection({
  section,
  index,
  value,
  tableData,
  isHidden,
  isCollapsed,
  hasHintContent,
  userProfile,
  onChange,
  onTableChange,
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

  const isCompleted = value?.trim() || tableData?.some(row => row.some(cell => cell));

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
              isCompleted
                ? "bg-black text-white"
                : "bg-gray-200 text-gray-600"
            }`}
          >
            {isCompleted ? "✓" : index + 1}
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
          <ChevronDown
            className={`w-5 h-5 text-gray-400 transition-transform ${
              isCollapsed ? "" : "rotate-180"
            }`}
          />
        </div>
      </div>

      {/* Section Content - Full Width */}
      {!isCollapsed && (
        <div className="px-6 py-5">
          {/* Help Text */}
          {section.helpText && (
            <div className="mb-4 p-3 bg-gray-50 border-l-2 border-gray-300 rounded-r-md">
              <p className="text-sm text-gray-700">{section.helpText}</p>
            </div>
          )}

          {/* Table Field Type */}
          {section.fieldType === 'table' && section.tableSchema && (
            <NotionTable
              schema={section.tableSchema}
              data={tableData}
              onChange={onTableChange}
            />
          )}

          {/* Markdown Field Type */}
          {section.fieldType === 'markdown' && (
            <textarea
              value={value}
              onChange={(e) => onChange(e.target.value)}
              placeholder="Start writing... Use '/' for commands"
              className="w-full min-h-[200px] p-4 bg-white border border-gray-200 rounded-md font-body text-sm focus:outline-none focus:border-gray-400 focus:ring-2 focus:ring-gray-100 transition-all resize-y"
              style={{ fontFamily: "var(--font-body)" }}
            />
          )}

          {/* Structured Field Type */}
          {section.fieldType === 'structured' && section.structuredFields && (
            <StructuredFields
              fields={section.structuredFields}
              value={value}
              onChange={onChange}
              userProfile={userProfile}
            />
          )}
        </div>
      )}
    </div>
  );
}

// ============================================
// NOTION-LIKE TABLE - Full Width
// ============================================

function NotionTable({
  schema,
  data,
  onChange,
}: {
  schema: { columns: string[]; rows?: any[] };
  data: any[];
  onChange: (rows: any[]) => void;
}) {
  const [hoveredRow, setHoveredRow] = useState<number | null>(null);

  const rows = data.length === 0 ? (schema.rows || [['']]) : data;

  const updateCell = (rowIndex: number, colIndex: number, value: string) => {
    const newRows = rows.map((row, r) =>
      r.map((cell: any, c) => (r === rowIndex && c === colIndex ? value : cell))
    );
    onChange(newRows);
  };

  const addRow = () => {
    onChange([...rows, new Array(schema.columns.length).fill('')]);
  };

  const deleteRow = (rowIndex: number) => {
    if (rows.length === 1) return;
    onChange(rows.filter((_, i) => i !== rowIndex));
  };

  return (
    <div className="border border-gray-200 rounded-lg overflow-hidden my-2">
      {/* Table Toolbar */}
      <div className="flex items-center justify-between px-4 py-2 bg-gray-50 border-b border-gray-200">
        <div className="flex items-center gap-2">
          <TableIcon className="w-4 h-4 text-gray-400" />
          <span className="text-sm text-gray-500">{rows.length} row{rows.length !== 1 ? 's' : ''}</span>
        </div>
        <button
          onClick={addRow}
          className="flex items-center gap-1.5 text-sm text-gray-600 hover:text-black"
        >
          <Plus className="w-4 h-4" />
          Add row
        </button>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-gray-50">
              {schema.columns.map((col, i) => (
                <th
                  key={i}
                  className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-b border-gray-200 whitespace-nowrap"
                >
                  {col}
                </th>
              ))}
              <th className="w-10 px-4 py-3 border-b border-gray-200"></th>
            </tr>
          </thead>
          <tbody>
            {rows.map((row, rowIndex) => (
              <tr
                key={rowIndex}
                className="hover:bg-gray-50"
                onMouseEnter={() => setHoveredRow(rowIndex)}
                onMouseLeave={() => setHoveredRow(null)}
              >
                {row.map((cell: any, colIndex: number) => (
                  <td
                    key={colIndex}
                    className="px-4 py-2 border-b border-gray-100"
                  >
                    <input
                      type="text"
                      value={cell || ''}
                      onChange={(e) => updateCell(rowIndex, colIndex, e.target.value)}
                      className="w-full px-3 py-2 text-sm bg-transparent border border-gray-200 rounded focus:outline-none focus:border-gray-400 focus:ring-1 focus:ring-gray-200 transition-all"
                    />
                  </td>
                ))}
                <td className="px-4 py-2 border-b border-gray-100">
                  {hoveredRow === rowIndex && (
                    <button
                      onClick={() => deleteRow(rowIndex)}
                      className="p-1.5 hover:bg-red-50 rounded transition-colors"
                      disabled={rows.length === 1}
                    >
                      <Trash2 className="w-4 h-4 text-gray-400 hover:text-red-500" />
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

// ============================================
// STRUCTURED FIELDS
// ============================================

function StructuredFields({
  fields,
  value,
  onChange,
  userProfile,
}: {
  fields: { key: string; label: string; placeholder: string }[];
  value: string;
  onChange: (value: string) => void;
  userProfile: any;
}) {
  const [localFields, setLocalFields] = useState<Record<string, string>>({});

  const updateField = (key: string, fieldValue: string) => {
    const newFields = { ...localFields, [key]: fieldValue };
    setLocalFields(newFields);

    let combined = '';
    fields.forEach(f => {
      if (newFields[f.key]) {
        combined += `### ${f.label}\n${newFields[f.key]}\n\n`;
      }
    });
    onChange(combined.trim());
  };

  return (
    <div className="space-y-4 my-2">
      {fields.map((field) => (
        <div
          key={field.key}
          className="p-4 border border-gray-200 rounded-lg hover:border-gray-300 transition-colors"
        >
          <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">
            {field.label}
          </label>
          <textarea
            value={localFields[field.key] || ''}
            onChange={(e) => updateField(field.key, e.target.value)}
            placeholder={field.placeholder}
            rows={3}
            className="w-full bg-transparent outline-none text-sm font-body resize-none placeholder:text-gray-300"
          />
        </div>
      ))}
    </div>
  );
}

// ============================================
// HINT PANEL
// ============================================

interface HintPanelProps {
  content: LearnContent | undefined;
  section: any;
  onClose: () => void;
  onInsert: (text: string) => void;
}

function HintPanel({ content, section, onClose, onInsert }: HintPanelProps) {
  const [searchQuery, setSearchQuery] = useState('');

  const getExamples = () => {
    const examples: Record<string, string[]> = {
      'document-meta': [
        '| Document Owner | Your Name |',
        '| Status | Draft |',
      ],
      'problem-statement': [
        '### Current State\nUsers are frustrated with...',
        '### Evidence\n40% drop-off rate in analytics...',
      ],
      'success-metrics': [
        '| Metric | Baseline | Target | Timeline |',
        '| Activation Rate | 45% | 65% | 6 weeks |',
      ],
      'functional-requirements': [
        '| ID | Requirement | Priority |',
        '| FR-001 | User can login | P0 |',
      ],
    };
    return examples[section?.id] || [];
  };

  const examples = getExamples();

  if (!content) {
    return (
      <div className="fixed right-6 top-20 w-96 bg-white border border-gray-200 rounded-lg shadow-xl p-5 z-50 animate-slide-in">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-semibold text-sm">Guidance</h3>
          <button onClick={onClose} className="p-1 hover:bg-gray-100 rounded">
            <X className="w-4 h-4" />
          </button>
        </div>
        <p className="text-sm text-gray-600">No detailed guidance available.</p>
      </div>
    );
  }

  return (
    <div className="fixed right-6 top-20 w-96 max-h-[calc(100vh-5rem)] overflow-y-auto bg-white border border-gray-200 rounded-lg shadow-xl z-50 animate-slide-in">
      {/* Header */}
      <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100 sticky top-0 bg-white rounded-t-lg">
        <div className="flex items-center gap-2">
          <Lightbulb className="w-5 h-5 text-amber-600" />
          <h3 className="font-semibold text-sm">{content.title}</h3>
        </div>
        <button onClick={onClose} className="p-1 hover:bg-gray-100 rounded">
          <X className="w-4 h-4 text-gray-400" />
        </button>
      </div>

      {/* Search */}
      <div className="px-5 py-4 border-b border-gray-100">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search guidance..."
            className="w-full pl-10 pr-3 py-2 text-sm bg-gray-50 border border-gray-200 rounded-md focus:outline-none focus:border-gray-300"
          />
        </div>
      </div>

      {/* Content */}
      <div className="px-5 py-4">
        <span className="inline-block px-2.5 py-1 text-xs font-medium bg-gray-100 text-gray-600 rounded-full mb-4">
          {content.category}
        </span>

        <div className="prose prose-sm max-w-none">
          {content.content
            .split('\n')
            .filter(line => !searchQuery || line.toLowerCase().includes(searchQuery.toLowerCase()))
            .map((paragraph, i) => {
              if (paragraph.startsWith('## ')) {
                return (
                  <h4 key={i} className="font-heading font-semibold text-sm mt-4 mb-2">
                    {paragraph.replace('## ', '')}
                  </h4>
                );
              }
              if (paragraph.startsWith('### ')) {
                return (
                  <h5 key={i} className="font-medium text-xs text-gray-700 mt-3 mb-1.5">
                    {paragraph.replace('### ', '')}
                  </h5>
                );
              }
              if (paragraph.startsWith('- ') || paragraph.startsWith('✅ ') || paragraph.startsWith('❌ ')) {
                return (
                  <li key={i} className="text-sm text-gray-700 ml-4">
                    {paragraph}
                  </li>
                );
              }
              if (paragraph.startsWith('> ')) {
                return (
                  <blockquote
                    key={i}
                    className="border-l-2 border-gray-200 pl-4 my-3 text-sm text-gray-600 italic"
                  >
                    {paragraph.replace('> ', '')}
                  </blockquote>
                );
              }
              if (paragraph.trim() === '') return null;
              return (
                <p key={i} className="text-sm text-gray-700 mb-2">
                  {paragraph}
                </p>
              );
            })}
        </div>

        {/* Quick Insert */}
        {examples.length > 0 && (
          <div className="mt-6 pt-6 border-t border-gray-100">
            <h4 className="font-medium text-xs text-gray-500 mb-3">Quick Insert</h4>
            <div className="space-y-2">
              {examples.map((example, i) => (
                <button
                  key={i}
                  onClick={() => onInsert(example)}
                  className="w-full text-left px-3 py-2.5 text-xs bg-gray-50 hover:bg-gray-100 rounded-md transition-colors"
                >
                  {example}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Insert Elements */}
        <div className="mt-6 pt-6 border-t border-gray-100">
          <h4 className="font-medium text-xs text-gray-500 mb-3">Insert Element</h4>
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => onInsert('| Column 1 | Column 2 |\n|----------|----------|\n| Value | Value |')}
              className="flex items-center gap-1.5 px-2.5 py-2 text-xs bg-gray-50 hover:bg-gray-100 rounded-md transition-colors"
            >
              <TableIcon className="w-3.5 h-3.5" />
              Table
            </button>
            <button
              onClick={() => onInsert('- Item 1\n- Item 2\n- Item 3')}
              className="flex items-center gap-1.5 px-2.5 py-2 text-xs bg-gray-50 hover:bg-gray-100 rounded-md transition-colors"
            >
              <List className="w-3.5 h-3.5" />
              List
            </button>
            <button
              onClick={() => onInsert('### Heading\n\nContent here...')}
              className="flex items-center gap-1.5 px-2.5 py-2 text-xs bg-gray-50 hover:bg-gray-100 rounded-md transition-colors"
            >
              <Type className="w-3.5 h-3.5" />
              Heading
            </button>
            <button
              onClick={() => onInsert('- [ ] Task 1\n- [ ] Task 2\n- [ ] Task 3')}
              className="flex items-center gap-1.5 px-2.5 py-2 text-xs bg-gray-50 hover:bg-gray-100 rounded-md transition-colors"
            >
              <CheckSquare className="w-3.5 h-3.5" />
              Checklist
            </button>
          </div>
        </div>

        {/* Read Time */}
        <div className="mt-6 pt-6 border-t border-gray-100">
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
      <div className="relative bg-white rounded-xl shadow-2xl w-full max-w-5xl max-h-[85vh] overflow-hidden animate-scale-in">
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
          <h3 className="font-heading font-semibold text-lg">Document Preview</h3>
          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                navigator.clipboard.writeText(content).then(() => {
                  alert("Copied to clipboard!");
                });
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
