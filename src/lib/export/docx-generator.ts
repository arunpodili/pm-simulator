/**
 * Docx Generator using docx library
 * Creates editable Word documents
 */
import {
  Document,
  Paragraph,
  TextRun,
  HeadingLevel,
  Table,
  TableCell,
  TableRow,
  WidthType,
  AlignmentType,
  BorderStyle,
  Packer,
} from 'docx';
import { saveAs } from 'file-saver';

interface SimulationData {
  id: string;
  name: string;
  created_at: string;
  target_industry: string;
  status: string;
  result?: {
    conversion_rate: number;
    churn_rate: number;
    nps: number;
    clv: number;
  };
}

interface PersonaData {
  name: string;
  role: string;
  pain_level: number;
  tech_savviness: number;
}

interface ReportData {
  simulation: SimulationData;
  personas: PersonaData[];
  structuredData?: Record<string, any>;
}

export async function generateDocx(data: ReportData): Promise<Blob> {
  const { simulation, personas } = data;
  const result = simulation.result;

  const doc = new Document({
    sections: [
      {
        properties: {},
        children: [
          // Title
          new Paragraph({
            text: 'PM Simulator Report',
            heading: HeadingLevel.TITLE,
            alignment: AlignmentType.CENTER,
            spacing: { after: 400 },
          }),

          // Product Name
          new Paragraph({
            text: simulation.name,
            heading: HeadingLevel.HEADING_1,
            alignment: AlignmentType.CENTER,
            spacing: { after: 200 },
          }),

          // Metadata
          new Paragraph({
            children: [
              new TextRun({ text: 'Generated: ', bold: true }),
              new TextRun(new Date(simulation.created_at).toLocaleDateString()),
            ],
            alignment: AlignmentType.CENTER,
            spacing: { after: 100 },
          }),
          new Paragraph({
            children: [
              new TextRun({ text: 'Industry: ', bold: true }),
              new TextRun(simulation.target_industry),
            ],
            alignment: AlignmentType.CENTER,
            spacing: { after: 400 },
          }),

          // Executive Summary Section
          new Paragraph({
            text: 'Executive Summary',
            heading: HeadingLevel.HEADING_1,
            spacing: { before: 400, after: 200 },
          }),

          new Paragraph({
            text: `This report contains the results of a market simulation for ${simulation.name}. The simulation analyzed user behavior and market dynamics to predict adoption, churn, and revenue outcomes.`,
            spacing: { after: 200 },
          }),

          // Metrics
          ...(result
            ? [
                new Paragraph({
                  text: 'Key Metrics',
                  heading: HeadingLevel.HEADING_2,
                  spacing: { before: 200, after: 100 },
                }),
                new Paragraph({
                  children: [
                    new TextRun({ text: 'Conversion Rate: ', bold: true }),
                    new TextRun(`${(result.conversion_rate * 100).toFixed(1)}%`),
                  ],
                  spacing: { after: 100 },
                }),
                new Paragraph({
                  children: [
                    new TextRun({ text: 'Churn Rate: ', bold: true }),
                    new TextRun(`${(result.churn_rate * 100).toFixed(1)}%`),
                  ],
                  spacing: { after: 100 },
                }),
                new Paragraph({
                  children: [
                    new TextRun({ text: 'Net Promoter Score: ', bold: true }),
                    new TextRun(result.nps.toFixed(1)),
                  ],
                  spacing: { after: 100 },
                }),
                new Paragraph({
                  children: [
                    new TextRun({ text: 'Customer Lifetime Value: ', bold: true }),
                    new TextRun(`$${result.clv.toFixed(0)}`),
                  ],
                  spacing: { after: 200 },
                }),
              ]
            : []),

          // Personas Section
          new Paragraph({
            text: 'Target Personas',
            heading: HeadingLevel.HEADING_1,
            spacing: { before: 400, after: 200 },
          }),

          // Personas Table
          new Table({
            width: { size: 100, type: WidthType.PERCENTAGE },
            rows: [
              // Header
              new TableRow({
                children: [
                  new TableCell({
                    children: [new Paragraph({ text: 'Name', bold: true })],
                    shading: { fill: 'F5F5F5' },
                  }),
                  new TableCell({
                    children: [new Paragraph({ text: 'Role', bold: true })],
                    shading: { fill: 'F5F5F5' },
                  }),
                  new TableCell({
                    children: [new Paragraph({ text: 'Pain Level', bold: true })],
                    shading: { fill: 'F5F5F5' },
                  }),
                  new TableCell({
                    children: [new Paragraph({ text: 'Tech Savviness', bold: true })],
                    shading: { fill: 'F5F5F5' },
                  }),
                ],
              }),
              // Data rows
              ...personas.map(
                (persona) =>
                  new TableRow({
                    children: [
                      new TableCell({ children: [new Paragraph(persona.name)] }),
                      new TableCell({ children: [new Paragraph(persona.role)] }),
                      new TableCell({
                        children: [new Paragraph(`${persona.pain_level}/10`)],
                      }),
                      new TableCell({
                        children: [new Paragraph(`${persona.tech_savviness}/10`)],
                      }),
                    ],
                  })
              ),
            ],
            borders: {
              top: { style: BorderStyle.SINGLE, size: 1, color: '000000' },
              bottom: { style: BorderStyle.SINGLE, size: 1, color: '000000' },
              left: { style: BorderStyle.SINGLE, size: 1, color: '000000' },
              right: { style: BorderStyle.SINGLE, size: 1, color: '000000' },
              insideHorizontal: { style: BorderStyle.SINGLE, size: 1, color: '000000' },
              insideVertical: { style: BorderStyle.SINGLE, size: 1, color: '000000' },
            },
          }),
        ],
      },
    ],
  });

  const blob = await Packer.toBlob(doc);
  return blob;
}

export async function downloadDocx(data: ReportData, filename?: string): Promise<void> {
  const blob = await generateDocx(data);
  const defaultFilename = `pm-simulator-report-${data.simulation.id.slice(0, 8)}.docx`;
  saveAs(blob, filename || defaultFilename);
}

export type { ReportData, SimulationData, PersonaData };
