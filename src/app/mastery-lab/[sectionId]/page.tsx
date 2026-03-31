"use client";

import { use, useState, useCallback, useEffect } from "react";
import { useRouter } from "next/navigation";
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
  Brain,
  CheckCircle,
  Clock,
  Sparkles,
  MessageSquare,
  Wand2
} from "lucide-react";
import { TemplateSection, TableSchema } from "@/types";

// Import all templates
import { productMindsetTemplate } from "@/data/mastery-lab/section1-product-mindset";
import { creativityInnovationTemplate } from "@/data/mastery-lab/section2-creativity-innovation";
import { criticalThinkingTemplate } from "@/data/mastery-lab/section3-critical-thinking";
import { stakeholderManagementTemplate } from "@/data/mastery-lab/section4-stakeholder-management";
import { coreCompetenciesTemplate } from "@/data/mastery-lab/section5-core-competencies";
import { domainVerticalsTemplate } from "@/data/mastery-lab/section6-domain-verticals";
import { communicationStorytellingTemplate } from "@/data/mastery-lab/section7-communication-storytelling";
import { leadershipGrowthTemplate } from "@/data/mastery-lab/section8-leadership-growth";
import { booksResourcesTemplate } from "@/data/mastery-lab/section9-books-resources";
import { practicalApplicationTemplate } from "@/data/mastery-lab/section10-practical-application";

const TEMPLATES: Record<string, any> = {
  'mastery-section-1': productMindsetTemplate,
  'mastery-section-2': creativityInnovationTemplate,
  'mastery-section-3': criticalThinkingTemplate,
  'mastery-section-4': stakeholderManagementTemplate,
  'mastery-section-5': coreCompetenciesTemplate,
  'mastery-section-6': domainVerticalsTemplate,
  'mastery-section-7': communicationStorytellingTemplate,
  'mastery-section-8': leadershipGrowthTemplate,
  'mastery-section-9': booksResourcesTemplate,
  'mastery-section-10': practicalApplicationTemplate,
};

interface FormState {
  [sectionId: string]: any;
}

interface TableData {
  [sectionId: string]: any[];
}

interface CheckboxState {
  [sectionId: string]: { [optionValue: string]: boolean };
}

export default function MasteryTemplatePage({ params }: { params: { sectionId: string } }) {
  const { sectionId } = params;
  const router = useRouter();
  const template = TEMPLATES[sectionId];

  const [formState, setFormState] = useState<FormState>({});
  const [tableData, setTableData] = useState<TableData>({});
  const [checkboxState, setCheckboxState] = useState<CheckboxState>({});
  const [hiddenSections, setHiddenSections] = useState<Set<string>>(new Set());
  const [collapsedSections, setCollapsedSections] = useState<Set<string>>(new Set());
  const [openHintPanel, setOpenHintPanel] = useState<string | null>(null);
  const [showPreview, setShowPreview] = useState(false);
  const [showExportMenu, setShowExportMenu] = useState(false);
  const [markedComplete, setMarkedComplete] = useState(false);
  const [showAICoach, setShowAICoach] = useState(false);
  const [AISuggestion, setAISuggestion] = useState<string | null>(null);
  const [isLoadingAI, setIsLoadingAI] = useState(false);

  if (!template) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-serif font-bold mb-4">Section Not Found</h1>
          <p className="text-gray-500 mb-4">The mastery section you're looking for doesn't exist.</p>
          <button
            onClick={() => router.push('/mastery-lab')}
            className="px-6 py-3 bg-black text-white rounded-lg font-medium hover:bg-gray-800"
          >
            Back to Mastery Lab
          </button>
        </div>
      </div>
    );
  }

  const visibleSections = template.sections.filter((s: TemplateSection) => !hiddenSections.has(s.id));
  const completionPercentage = Math.round(
    (visibleSections.filter((s: TemplateSection) => {
      if (s.fieldType === 'checkbox') {
        const sectionCheckboxes = checkboxState[s.id] || {};
        return Object.values(sectionCheckboxes).some(v => v);
      }
      return formState[s.id]?.trim() || tableData[s.id]?.some((row: any[]) => row.some(cell => cell));
    }).length / visibleSections.length) * 100
  );

  const handleTableChange = (sectionId: string, rows: any[]) => {
    setTableData((prev) => ({ ...prev, [sectionId]: rows }));
    const section = template.sections.find((s: TemplateSection) => s.id === sectionId);
    if (section?.tableSchema) {
      const headers = section.tableSchema.columns;
      let markdown = `| ${headers.join(' | ')} |\n| ${headers.map(() => '---').join(' | ')} |\n`;
      rows.forEach((row: any[]) => {
        markdown += `| ${row.map((cell: any) => cell || '').join(' | ')} |\n`;
      });
      setFormState((prev) => ({ ...prev, [sectionId]: markdown }));
    }
  };

  const handleCheckboxChange = (sectionId: string, optionValue: string, checked: boolean) => {
    setCheckboxState((prev) => ({
      ...prev,
      [sectionId]: {
        ...(prev[sectionId] || {}),
        [optionValue]: checked,
      },
    }));
  };

  const toggleSectionVisibility = (sectionId: string) => {
    setHiddenSections((prev) => {
      const next = new Set(prev);
      if (next.has(sectionId)) {
        next.delete(sectionId);
      } else {
        next.add(sectionId);
      }
      return next;
    });
  };

  const toggleSectionCollapse = (sectionId: string) => {
    setCollapsedSections((prev) => {
      const next = new Set(prev);
      if (next.has(sectionId)) {
        next.delete(sectionId);
      } else {
        next.add(sectionId);
      }
      return next;
    });
  };

  const getAISuggestion = async () => {
    setIsLoadingAI(true);
    setAISuggestion(null);
    try {
      const response = await fetch('/api/ai/mastery-suggest', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          sectionId,
          completedSections: [],
          userResponses: formState,
        }),
      });
      const data = await response.json();
      if (data.success) {
        setAISuggestion(data.suggestion);
      }
    } catch (error) {
      console.error('AI Suggestion Error:', error);
    } finally {
      setIsLoadingAI(false);
    }
  };

  const handleExport = (format: string) => {
    const content = generateMarkdown();

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
          const printContent = generatePDFContent();
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
      case "google-docs":
      case "notion":
        {
          navigator.clipboard.writeText(content).then(() => {
            const targetUrl = format === 'google-docs'
              ? 'https://docs.google.com/document/create'
              : format === 'notion'
              ? 'https://www.notion.so'
              : null;
            if (targetUrl) window.open(targetUrl, "_blank");
            setTimeout(() => {
              alert("Content copied to clipboard! Paste into your destination and save.");
            }, 1000);
          });
        }
        break;
    }
    setShowExportMenu(false);
  };

  const generateMarkdown = () => {
    let content = `# ${template.name}\n\n`;
    content += `**${template.description}**\n\n`;
    content += `*Estimated Completion Time: ${template.estimatedCompletionTime}*\n\n`;
    content += `---\n\n`;

    template.sections.forEach((section: TemplateSection) => {
      if (!hiddenSections.has(section.id)) {
        content += `## ${section.title}\n\n`;
        if (section.description) {
          content += `${section.description}\n\n`;
        }

        if (section.fieldType === 'table' && tableData[section.id]) {
          const headers = section.tableSchema?.columns || [];
          if (headers.length > 0) {
            content += `| ${headers.join(' | ')} |\n`;
            content += `| ${headers.map(() => '---').join(' | ')} |\n`;
            tableData[section.id].forEach((row: any[]) => {
              content += `| ${row.map((cell: any) => cell || '').join(' | ')} |\n`;
            });
          }
        } else if (section.fieldType === 'checkbox' && checkboxState[section.id]) {
          section.options?.forEach((opt: { value: string; label: string }) => {
            const checked = checkboxState[section.id]?.[opt.value];
            content += `- [${checked ? 'x' : ' '}] ${opt.label}\n`;
          });
        } else if (formState[section.id]) {
          content += `${formState[section.id]}\n\n`;
        }
        content += `\n`;
      }
    });

    if (markedComplete) {
      content += `---\n\n`;
      content += `**Completed:** ${new Date().toLocaleDateString()}\n`;
    }

    return content;
  };

  const generatePDFContent = () => {
    const markdown = generateMarkdown();
    return `
      <!DOCTYPE html>
      <html>
        <head>
          <title>${template.name}</title>
          <style>
            body { font-family: Georgia, serif; padding: 40px; max-width: 800px; margin: 0 auto; }
            h1 { font-size: 24px; border-bottom: 2px solid #000; padding-bottom: 10px; }
            h2 { font-size: 18px; margin-top: 30px; }
            table { border-collapse: collapse; width: 100%; margin: 20px 0; }
            th, td { border: 1px solid #ddd; padding: 12px; text-align: left; }
            th { background: #f5f5f5; font-weight: 600; }
            ul { list-style: none; padding: 0; }
            li { padding: 8px 0; }
          </style>
        </head>
        <body>
          <h1>${template.name}</h1>
          <p><em>${template.description}</em></p>
          ${markdown.split('\n').map(line => {
            if (line.startsWith('## ')) return `<h2>${line.replace('## ', '')}</h2>`;
            if (line.startsWith('|')) return line; // Tables handled separately
            if (line.startsWith('- [')) return `<li>${line.replace(/- \[[ x]\] /g, '')}</li>`;
            if (line.trim() === '') return '<br/>';
            return `<p>${line}</p>`;
          }).join('')}
        </body>
      </html>
    `;
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="sticky top-0 z-40 bg-white border-b border-gray-100">
        <div className="container mx-auto px-6">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-4">
              <button
                onClick={() => router.push('/mastery-lab')}
                className="flex items-center gap-2 text-sm text-gray-500 hover:text-black transition-colors"
              >
                <ArrowLeft className="w-4 h-4" />
                Back to Mastery Lab
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

              {/* AI Coach */}
              <button
                onClick={() => {
                  setShowAICoach(!showAICoach);
                  if (!showAICoach && !AISuggestion) {
                    getAISuggestion();
                  }
                }}
                className={`flex items-center gap-2 px-3 py-2 text-sm rounded-md transition-colors ${
                  showAICoach
                    ? 'bg-purple-50 text-purple-700'
                    : 'text-gray-600 hover:bg-gray-100'
                }`}
              >
                <Sparkles className="w-4 h-4" />
                AI Coach
              </button>

              {/* Mark Complete */}
              <button
                onClick={() => setMarkedComplete(!markedComplete)}
                className={`flex items-center gap-2 px-3 py-2 text-sm rounded-md transition-colors ${
                  markedComplete
                    ? 'bg-green-50 text-green-700'
                    : 'text-gray-600 hover:bg-gray-100'
                }`}
              >
                {markedComplete ? (
                  <>
                    <CheckCircle className="w-4 h-4" />
                    Completed
                  </>
                ) : (
                  <>
                    <CheckCircle className="w-4 h-4" />
                    Mark Complete
                  </>
                )}
              </button>

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

      {/* Info Bar */}
      <div className="bg-gray-50 border-b border-gray-100">
        <div className="container mx-auto px-6 py-3">
          <div className="flex items-center gap-6 text-sm text-gray-600">
            <span className="flex items-center gap-2">
              <Clock className="w-4 h-4" />
              {template.estimatedCompletionTime}
            </span>
            <span className="flex items-center gap-2">
              <Brain className="w-4 h-4" />
              {template.sections.length} sections
            </span>
            <span className="flex items-center gap-2">
              <FileText className="w-4 h-4" />
              Category: {template.category}
            </span>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-6 py-8">
        <div className="flex gap-6">
          {/* Main Content */}
          <div className="flex-1">
            <div className="space-y-4">
              {template.sections.map((section: TemplateSection, index: number) => (
                <CollapsibleSection
                  key={section.id}
                  section={section}
                  index={index}
                  value={formState[section.id] || ""}
                  tableData={tableData[section.id] || []}
                  checkboxState={checkboxState[section.id] || {}}
                  isHidden={hiddenSections.has(section.id)}
                  isCollapsed={collapsedSections.has(section.id)}
                  hasHintContent={!!section.helpText}
                  onChange={(value) => setFormState((prev) => ({ ...prev, [section.id]: value }))}
                  onTableChange={(rows) => handleTableChange(section.id, rows)}
                  onCheckboxChange={(optionValue, checked) => handleCheckboxChange(section.id, optionValue, checked)}
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
              section={template.sections.find((s: TemplateSection) => s.id === openHintPanel)}
              onClose={() => setOpenHintPanel(null)}
              onInsert={(text) => {
                const currentValue = formState[openHintPanel] || '';
                setFormState((prev) => ({ ...prev, [openHintPanel]: currentValue + text }));
              }}
            />
          )}

          {/* AI Coach Panel */}
          {showAICoach && (
            <AICoachPanel
              suggestion={AISuggestion}
              isLoading={isLoadingAI}
              onClose={() => setShowAICoach(false)}
              onRegenerate={getAISuggestion}
            />
          )}
        </div>
      </div>

      {/* Preview Modal */}
      {showPreview && (
        <PreviewModal
          content={generateMarkdown()}
          onClose={() => setShowPreview(false)}
        />
      )}
    </div>
  );
}

function ExportOption({ icon, label, description, onClick }: { icon: any; label: string; description: string; onClick: () => void }) {
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

interface CollapsibleSectionProps {
  section: TemplateSection;
  index: number;
  value: string;
  tableData: any[];
  checkboxState: { [key: string]: boolean };
  isHidden: boolean;
  isCollapsed: boolean;
  hasHintContent: boolean;
  onChange: (value: string) => void;
  onTableChange: (rows: any[]) => void;
  onCheckboxChange: (optionValue: string, checked: boolean) => void;
  onToggleVisibility: () => void;
  onToggleCollapse: () => void;
  onOpenHint: () => void;
}

function CollapsibleSection({
  section,
  index,
  value,
  tableData,
  checkboxState,
  isHidden,
  isCollapsed,
  hasHintContent,
  onChange,
  onTableChange,
  onCheckboxChange,
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

  const isCompleted = value?.trim() || tableData?.some((row: any[]) => row.some(cell => cell)) || Object.values(checkboxState).some(v => v);

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
              isCompleted ? "bg-black text-white" : "bg-gray-200 text-gray-600"
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

      {/* Section Content */}
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

          {/* Checkbox Field Type */}
          {section.fieldType === 'checkbox' && section.options && (
            <div className="space-y-3">
              {section.options.map((option) => (
                <label
                  key={option.value}
                  className="flex items-start gap-3 p-3 border border-gray-200 rounded-md hover:border-gray-300 transition-colors cursor-pointer"
                >
                  <input
                    type="checkbox"
                    checked={checkboxState[option.value] || false}
                    onChange={(e) => onCheckboxChange(option.value, e.target.checked)}
                    className="mt-1 w-4 h-4 text-black border-gray-300 rounded focus:ring-black"
                  />
                  <span className="text-sm text-gray-700">{option.label}</span>
                </label>
              ))}
            </div>
          )}

          {/* Markdown Field Type */}
          {section.fieldType === 'markdown' && (
            <textarea
              value={value}
              onChange={(e) => onChange(e.target.value)}
              placeholder={section.placeholder || "Start writing..."}
              className="w-full min-h-[200px] p-4 bg-white border border-gray-200 rounded-md font-body text-sm focus:outline-none focus:border-gray-400 focus:ring-2 focus:ring-gray-100 transition-all resize-y"
            />
          )}

          {/* Textarea Field Type */}
          {section.fieldType === 'textarea' && (
            <textarea
              value={value}
              onChange={(e) => onChange(e.target.value)}
              placeholder={section.placeholder || "Enter your response..."}
              rows={6}
              className="w-full p-4 bg-white border border-gray-200 rounded-md font-body text-sm focus:outline-none focus:border-gray-400 focus:ring-2 focus:ring-gray-100 transition-all resize-y"
            />
          )}
        </div>
      )}
    </div>
  );
}

function NotionTable({
  schema,
  data,
  onChange,
}: {
  schema: TableSchema;
  data: any[];
  onChange: (rows: any[]) => void;
}) {
  const [hoveredRow, setHoveredRow] = useState<number | null>(null);

  const rows = data.length === 0 ? (schema.rows || [['']]) : data;

  const updateCell = (rowIndex: number, colIndex: number, value: string) => {
    const newRows = rows.map((row, r) =>
      row.map((cell: any, c: number) => (r === rowIndex && c === colIndex ? value : cell))
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

function HintPanel({ section, onClose, onInsert }: { section: TemplateSection | undefined; onClose: () => void; onInsert: (text: string) => void }) {
  if (!section) {
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
      <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100 sticky top-0 bg-white rounded-t-lg">
        <div className="flex items-center gap-2">
          <Lightbulb className="w-5 h-5 text-amber-600" />
          <h3 className="font-semibold text-sm">Guidance</h3>
        </div>
        <button onClick={onClose} className="p-1 hover:bg-gray-100 rounded">
          <X className="w-4 h-4 text-gray-400" />
        </button>
      </div>

      <div className="px-5 py-4">
        {section.helpText && (
          <div className="mb-4 p-3 bg-amber-50 border-l-2 border-amber-400 rounded-r-md">
            <p className="text-sm text-amber-800">{section.helpText}</p>
          </div>
        )}

        {section.placeholder && (
          <div className="mb-4">
            <h4 className="font-medium text-xs text-gray-500 mb-2">Example Format:</h4>
            <div className="p-3 bg-gray-50 rounded-md text-sm text-gray-600 font-mono">
              {section.placeholder}
            </div>
          </div>
        )}

        {/* Insert Elements */}
        <div className="mt-4 pt-4 border-t border-gray-100">
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
      </div>
    </div>
  );
}

function PreviewModal({ content, onClose }: { content: string; onClose: () => void }) {
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

function AICoachPanel({ suggestion, isLoading, onClose, onRegenerate }: { suggestion: string | null; isLoading: boolean; onClose: () => void; onRegenerate: () => void }) {
  return (
    <div className="fixed right-6 top-20 w-96 max-h-[calc(100vh-5rem)] overflow-y-auto bg-white border border-gray-200 rounded-lg shadow-xl z-50 animate-slide-in">
      <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100 sticky top-0 bg-white rounded-t-lg">
        <div className="flex items-center gap-2">
          <Sparkles className="w-5 h-5 text-purple-600" />
          <h3 className="font-semibold text-sm">AI PM Coach</h3>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={onRegenerate}
            disabled={isLoading}
            className="p-1 hover:bg-gray-100 rounded transition-colors disabled:opacity-50"
            title="Regenerate suggestion"
          >
            <Wand2 className={`w-4 h-4 text-gray-400 ${isLoading ? 'animate-spin' : ''}`} />
          </button>
          <button onClick={onClose} className="p-1 hover:bg-gray-100 rounded">
            <X className="w-4 h-4 text-gray-400" />
          </button>
        </div>
      </div>

      <div className="px-5 py-4">
        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-8">
            <div className="w-8 h-8 border-2 border-purple-600 border-t-transparent rounded-full animate-spin mb-3" />
            <p className="text-sm text-gray-500">Analyzing your responses...</p>
          </div>
        ) : suggestion ? (
          <div className="space-y-4">
            <div className="p-3 bg-purple-50 border border-purple-100 rounded-md">
              <div className="flex items-start gap-2">
                <MessageSquare className="w-4 h-4 text-purple-600 flex-shrink-0 mt-0.5" />
                <div className="text-sm text-purple-900 whitespace-pre-wrap">{suggestion}</div>
              </div>
            </div>
            <div className="pt-4 border-t border-gray-100">
              <p className="text-xs text-gray-500 mb-3">
                The AI Coach analyzes your responses and provides personalized guidance based on PM best practices.
              </p>
              <button
                onClick={onRegenerate}
                className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-purple-600 text-white text-sm font-medium rounded-md hover:bg-purple-700 transition-colors"
              >
                <Wand2 className="w-4 h-4" />
                Regenerate Suggestion
              </button>
            </div>
          </div>
        ) : (
          <div className="text-center py-8">
            <Sparkles className="w-12 h-12 mx-auto mb-3 text-purple-300" />
            <p className="text-sm text-gray-600 mb-4">Get personalized coaching on your PM skills</p>
            <button
              onClick={onRegenerate}
              className="px-6 py-2 bg-purple-600 text-white text-sm font-medium rounded-md hover:bg-purple-700 transition-colors"
            >
              Get Suggestion
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
