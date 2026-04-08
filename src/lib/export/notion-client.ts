/**
 * Notion API Client
 * Creates pages directly in user's Notion workspace
 */

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
}

interface NotionExportOptions {
  apiToken: string;
  parentPageId?: string;
}

export async function exportToNotion(
  data: ReportData,
  options: NotionExportOptions
): Promise<{ pageId: string; url: string }> {
  const { apiToken, parentPageId } = options;
  const { simulation, personas } = data;

  // Create the page content
  const response = await fetch('https://api.notion.com/v1/pages', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${apiToken}`,
      'Notion-Version': '2022-06-28',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      parent: parentPageId
        ? { page_id: parentPageId }
        : { workspace: true },
      icon: { emoji: '📊' },
      properties: {
        title: {
          title: [
            {
              text: {
                content: `PM Simulator Report: ${simulation.name}`,
              },
            },
          ],
        },
        Status: {
          select: {
            name: 'Completed',
          },
        },
        Industry: {
          select: {
            name: simulation.target_industry,
          },
        },
      },
      children: [
        // Executive Summary
        {
          object: 'block',
          type: 'heading_1',
          heading_1: {
            rich_text: [{ type: 'text', text: { content: 'Executive Summary' } }],
          },
        },
        {
          object: 'block',
          type: 'paragraph',
          paragraph: {
            rich_text: [
              {
                type: 'text',
                text: {
                  content: `This report contains the results of a market simulation for ${simulation.name}. Generated on ${new Date(
                    simulation.created_at
                  ).toLocaleDateString()}.`,
                },
              },
            ],
          },
        },
        // Key Metrics
        ...(simulation.result
          ? [
              {
                object: 'block' as const,
                type: 'heading_2' as const,
                heading_2: {
                  rich_text: [
                    { type: 'text' as const, text: { content: 'Key Metrics' } },
                  ],
                },
              },
              {
                object: 'block' as const,
                type: 'bulleted_list_item' as const,
                bulleted_list_item: {
                  rich_text: [
                    {
                      type: 'text' as const,
                      text: {
                        content: `Conversion Rate: ${(
                          simulation.result.conversion_rate * 100
                        ).toFixed(1)}%`,
                      },
                    },
                  ],
                },
              },
              {
                object: 'block' as const,
                type: 'bulleted_list_item' as const,
                bulleted_list_item: {
                  rich_text: [
                    {
                      type: 'text' as const,
                      text: {
                        content: `Churn Rate: ${(
                          simulation.result.churn_rate * 100
                        ).toFixed(1)}%`,
                      },
                    },
                  ],
                },
              },
              {
                object: 'block' as const,
                type: 'bulleted_list_item' as const,
                bulleted_list_item: {
                  rich_text: [
                    {
                      type: 'text' as const,
                      text: {
                        content: `Net Promoter Score: ${simulation.result.nps.toFixed(
                          1
                        )}`,
                      },
                    },
                  ],
                },
              },
              {
                object: 'block' as const,
                type: 'bulleted_list_item' as const,
                bulleted_list_item: {
                  rich_text: [
                    {
                      type: 'text' as const,
                      text: {
                        content: `Customer Lifetime Value: $${simulation.result.clv.toFixed(
                          0
                        )}`,
                      },
                    },
                  ],
                },
              },
            ]
          : []),
        // Personas Section
        {
          object: 'block',
          type: 'heading_1',
          heading_1: {
            rich_text: [{ type: 'text', text: { content: 'Target Personas' } }],
          },
        },
        // Personas Table
        {
          object: 'block',
          type: 'table',
          table: {
            table_width: 4,
            has_column_header: true,
            has_row_header: false,
            children: [
              // Header row
              {
                object: 'block',
                type: 'table_row',
                table_row: {
                  cells: [
                    [{ type: 'text', text: { content: 'Name' } }],
                    [{ type: 'text', text: { content: 'Role' } }],
                    [{ type: 'text', text: { content: 'Pain Level' } }],
                    [{ type: 'text', text: { content: 'Tech Savviness' } }],
                  ],
                },
              },
              // Data rows
              ...personas.map((persona) => ({
                object: 'block' as const,
                type: 'table_row' as const,
                table_row: {
                  cells: [
                    [{ type: 'text' as const, text: { content: persona.name } }],
                    [{ type: 'text' as const, text: { content: persona.role } }],
                    [
                      {
                        type: 'text' as const,
                        text: { content: `${persona.pain_level}/10` },
                      },
                    ],
                    [
                      {
                        type: 'text' as const,
                        text: { content: `${persona.tech_savviness}/10` },
                      },
                    ],
                  ],
                },
              })),
            ],
          },
        },
        // Footer
        {
          object: 'block',
          type: 'divider',
          divider: {},
        },
        {
          object: 'block',
          type: 'paragraph',
          paragraph: {
            rich_text: [
              {
                type: 'text',
                text: {
                  content: 'Generated by PM Simulator',
                },
                annotations: { italic: true, color: 'gray' },
              },
            ],
          },
        },
      ],
    }),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || 'Failed to create Notion page');
  }

  const result = await response.json();

  return {
    pageId: result.id,
    url: result.url,
  };
}

export type { NotionExportOptions, ReportData, SimulationData, PersonaData };
