'use client';

import { FileText, FileSpreadsheet, Database, Cloud, Check } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/Card';

export type ExportFormat = 'pdf' | 'docx' | 'notion' | 'google-docs';

interface FormatOption {
  id: ExportFormat;
  name: string;
  description: string;
  icon: React.ComponentType<{ className?: string }>;
  badge?: string;
}

const formats: FormatOption[] = [
  {
    id: 'pdf',
    name: 'PDF',
    description: 'Professional report with cover page and charts',
    icon: FileText,
    badge: 'Recommended',
  },
  {
    id: 'docx',
    name: 'Word Document',
    description: 'Editable document for collaboration',
    icon: FileSpreadsheet,
  },
  {
    id: 'notion',
    name: 'Notion',
    description: 'Create page in your Notion workspace',
    icon: Database,
  },
  {
    id: 'google-docs',
    name: 'Google Docs',
    description: 'Create document in Google Drive',
    icon: Cloud,
  },
];

interface FormatSelectorProps {
  selectedFormat: ExportFormat | null;
  onSelect: (format: ExportFormat) => void;
}

export function FormatSelector({ selectedFormat, onSelect }: FormatSelectorProps) {
  return (
    <div className="grid grid-cols-2 gap-4">
      {formats.map((format) => {
        const Icon = format.icon;
        const isSelected = selectedFormat === format.id;

        return (
          <Card
            key={format.id}
            className={`cursor-pointer transition-all ${
              isSelected
                ? 'border-blue-500 ring-2 ring-blue-500'
                : 'hover:border-gray-400'
            }`}
            onClick={() => onSelect(format.id)}
          >
            <CardContent className="p-4">
              <div className="flex items-start gap-3">
                <div
                  className={`p-2 rounded-lg ${
                    isSelected ? 'bg-blue-100' : 'bg-gray-100'
                  }`}
                >
                  <Icon
                    className={`h-5 w-5 ${
                      isSelected ? 'text-blue-600' : 'text-gray-600'
                    }`}
                  />
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <span className="font-medium">{format.name}</span>
                    {isSelected && (
                      <Check className="h-4 w-4 text-blue-500" />
                    )}
                  </div>
                  <p className="text-sm text-gray-500 mt-1">{format.description}</p>
                  {format.badge && (
                    <span className="inline-block mt-2 text-xs bg-blue-100 text-blue-700 px-2 py-0.5 rounded">
                      {format.badge}
                    </span>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}
