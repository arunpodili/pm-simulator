/**
 * Google Docs API Client
 * Creates documents directly in user's Google Drive
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

interface GoogleDocsExportOptions {
  accessToken: string;
  folderId?: string;
}

export async function exportToGoogleDocs(
  data: ReportData,
  options: GoogleDocsExportOptions
): Promise<{ documentId: string; url: string }> {
  const { accessToken, folderId } = options;
  const { simulation, personas } = data;

  // Create the document
  const createResponse = await fetch('https://docs.googleapis.com/v1/documents', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${accessToken}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      title: `PM Simulator Report: ${simulation.name}`,
    }),
  });

  if (!createResponse.ok) {
    const error = await createResponse.json();
    throw new Error(error.error?.message || 'Failed to create Google Doc');
  }

  const doc = await createResponse.json();
  const documentId = doc.documentId;

  // Build the content
  const requests: any[] = [
    // Insert title
    {
      insertText: {
        location: { index: 1 },
        text: `PM Simulator Report: ${simulation.name}\n\n`,
      },
    },
    // Format title as heading 1
    {
      updateParagraphStyle: {
        range: { startIndex: 1, endIndex: simulation.name.length + 22 },
        paragraphStyle: { namedStyleType: 'HEADING_1' },
        fields: 'namedStyleType',
      },
    },
    // Insert metadata
    {
      insertText: {
        location: { index: simulation.name.length + 23 },
        text: `Industry: ${simulation.target_industry}\nGenerated: ${new Date(
          simulation.created_at
        ).toLocaleDateString()}\n\n`,
      },
    },
    // Executive Summary
    {
      insertText: {
        location: { index: simulation.name.length + 55 },
        text: 'Executive Summary\n',
      },
    },
    {
      updateParagraphStyle: {
        range: {
          startIndex: simulation.name.length + 55,
          endIndex: simulation.name.length + 73,
        },
        paragraphStyle: { namedStyleType: 'HEADING_2' },
        fields: 'namedStyleType',
      },
    },
    {
      insertText: {
        location: { index: simulation.name.length + 73 },
        text: `This report contains the results of a market simulation for ${simulation.name}.\n\n`,
      },
    },
  ];

  // Add metrics if available
  if (simulation.result) {
    requests.push(
      {
        insertText: {
          location: { index: simulation.name.length + 150 },
          text: 'Key Metrics\n',
        },
      },
      {
        updateParagraphStyle: {
          range: {
            startIndex: simulation.name.length + 150,
            endIndex: simulation.name.length + 162,
          },
          paragraphStyle: { namedStyleType: 'HEADING_3' },
          fields: 'namedStyleType',
        },
      },
      {
        insertText: {
          location: { index: simulation.name.length + 162 },
          text: `• Conversion Rate: ${(simulation.result.conversion_rate * 100).toFixed(
            1
          )}%\n`,
        },
      },
      {
        insertText: {
          location: { index: simulation.name.length + 200 },
          text: `• Churn Rate: ${(simulation.result.churn_rate * 100).toFixed(1)}%\n`,
        },
      },
      {
        insertText: {
          location: { index: simulation.name.length + 230 },
          text: `• Net Promoter Score: ${simulation.result.nps.toFixed(1)}\n`,
        },
      },
      {
        insertText: {
          location: { index: simulation.name.length + 260 },
          text: `• Customer Lifetime Value: $${simulation.result.clv.toFixed(0)}\n\n`,
        },
      }
    );
  }

  // Add Personas section
  requests.push(
    {
      insertText: {
        location: { index: simulation.name.length + 300 },
        text: 'Target Personas\n',
      },
    },
    {
      updateParagraphStyle: {
        range: {
          startIndex: simulation.name.length + 300,
          endIndex: simulation.name.length + 317,
        },
        paragraphStyle: { namedStyleType: 'HEADING_2' },
        fields: 'namedStyleType',
      },
    }
  );

  // Add personas table
  let currentIndex = simulation.name.length + 317;
  personas.forEach((persona) => {
    requests.push(
      {
        insertText: {
          location: { index: currentIndex },
          text: `${persona.name} - ${persona.role}\n`,
        },
      },
      {
        updateParagraphStyle: {
          range: {
            startIndex: currentIndex,
            endIndex: currentIndex + persona.name.length + persona.role.length + 4,
          },
          paragraphStyle: { namedStyleType: 'HEADING_3' },
          fields: 'namedStyleType',
        },
      },
      {
        insertText: {
          location: { index: currentIndex + persona.name.length + persona.role.length + 4 },
          text: `Pain Level: ${persona.pain_level}/10\nTech Savviness: ${persona.tech_savviness}/10\n\n`,
        },
      }
    );
    currentIndex +=
      persona.name.length + persona.role.length + 50;
  });

  // Batch update the document
  const batchUpdateResponse = await fetch(
    `https://docs.googleapis.com/v1/documents/${documentId}:batchUpdate`,
    {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ requests }),
    }
  );

  if (!batchUpdateResponse.ok) {
    const error = await batchUpdateResponse.json();
    throw new Error(error.error?.message || 'Failed to update Google Doc');
  }

  return {
    documentId,
    url: `https://docs.google.com/document/d/${documentId}/edit`,
  };
}

export type { GoogleDocsExportOptions, ReportData, SimulationData, PersonaData };
