/**
 * PDF Generator using @react-pdf/renderer
 * Creates professional reports with cover page, TOC, and charts
 */
import {
  Document,
  Page,
  Text,
  View,
  StyleSheet,
  Font,
  PDFDownloadLink,
} from '@react-pdf/renderer';

// Define styles
const styles = StyleSheet.create({
  page: {
    padding: 40,
    fontSize: 12,
    fontFamily: 'Helvetica',
  },
  cover: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    textAlign: 'center',
  },
  coverTitle: {
    fontSize: 32,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  coverSubtitle: {
    fontSize: 18,
    color: '#666',
    marginBottom: 10,
  },
  coverMeta: {
    fontSize: 12,
    color: '#999',
    marginTop: 40,
  },
  section: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#000',
    paddingBottom: 5,
  },
  subsectionTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    marginBottom: 8,
    marginTop: 12,
  },
  text: {
    marginBottom: 6,
    lineHeight: 1.5,
  },
  bold: {
    fontWeight: 'bold',
  },
  metrics: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginVertical: 10,
  },
  metricBox: {
    width: '30%',
    padding: 10,
    margin: 5,
    backgroundColor: '#f5f5f5',
    borderRadius: 4,
  },
  metricLabel: {
    fontSize: 10,
    color: '#666',
  },
  metricValue: {
    fontSize: 16,
    fontWeight: 'bold',
    marginTop: 4,
  },
  table: {
    width: '100%',
    marginVertical: 10,
  },
  tableRow: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
    paddingVertical: 6,
  },
  tableHeader: {
    backgroundColor: '#f5f5f5',
    fontWeight: 'bold',
  },
  tableCell: {
    flex: 1,
    paddingHorizontal: 4,
  },
});

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
  result?: {
    conversion_rate: number;
    churn_rate: number;
    nps: number;
    clv: number;
  };
}

// Cover Page Component
const CoverPage = ({ simulation }: { simulation: SimulationData }) => (
  <Page size="A4" style={styles.page}>
    <View style={styles.cover}>
      <Text style={styles.coverTitle}>PM Simulator Report</Text>
      <Text style={styles.coverSubtitle}>{simulation.name}</Text>
      <Text style={styles.coverMeta}>
        Generated: {new Date(simulation.created_at).toLocaleDateString()}
      </Text>
      <Text style={styles.coverMeta}>Industry: {simulation.target_industry}</Text>
    </View>
  </Page>
);

// Executive Summary Page
const ExecutiveSummary = ({ simulation, result }: ReportData) => (
  <Page size="A4" style={styles.page}>
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>Executive Summary</Text>

      {result && (
        <View style={styles.metrics}>
          <View style={styles.metricBox}>
            <Text style={styles.metricLabel}>Conversion Rate</Text>
            <Text style={styles.metricValue}>{(result.conversion_rate * 100).toFixed(1)}%</Text>
          </View>
          <View style={styles.metricBox}>
            <Text style={styles.metricLabel}>Churn Rate</Text>
            <Text style={styles.metricValue}>{(result.churn_rate * 100).toFixed(1)}%</Text>
          </View>
          <View style={styles.metricBox}>
            <Text style={styles.metricLabel}>NPS</Text>
            <Text style={styles.metricValue}>{result.nps.toFixed(1)}</Text>
          </View>
          <View style={styles.metricBox}>
            <Text style={styles.metricLabel}>Customer Lifetime Value</Text>
            <Text style={styles.metricValue}>${result.clv.toFixed(0)}</Text>
          </View>
        </View>
      )}

      <Text style={styles.text}>
        This report contains the results of a market simulation for {simulation.name}.
        The simulation analyzed user behavior and market dynamics to predict adoption,
        churn, and revenue outcomes.
      </Text>
    </View>
  </Page>
);

// Personas Section
const PersonasSection = ({ personas }: { personas: PersonaData[] }) => (
  <Page size="A4" style={styles.page}>
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>Target Personas</Text>

      <View style={styles.table}>
        <View style={[styles.tableRow, styles.tableHeader]}>
          <Text style={styles.tableCell}>Name</Text>
          <Text style={styles.tableCell}>Role</Text>
          <Text style={styles.tableCell}>Pain Level</Text>
          <Text style={styles.tableCell}>Tech Savviness</Text>
        </View>

        {personas.map((persona, index) => (
          <View key={index} style={styles.tableRow}>
            <Text style={styles.tableCell}>{persona.name}</Text>
            <Text style={styles.tableCell}>{persona.role}</Text>
            <Text style={styles.tableCell}>{persona.pain_level}/10</Text>
            <Text style={styles.tableCell}>{persona.tech_savviness}/10</Text>
          </View>
        ))}
      </View>
    </View>
  </Page>
);

// Main Report Document
const ReportDocument = ({ simulation, personas, structuredData }: ReportData) => (
  <Document>
    <CoverPage simulation={simulation} />
    <ExecutiveSummary simulation={simulation} personas={personas} structuredData={structuredData} />
    <PersonasSection personas={personas} />
  </Document>
);

// React component for download link
interface PDFGeneratorProps {
  data: ReportData;
  filename?: string;
  children: (props: { loading: boolean }) => React.ReactNode;
}

export function PDFGenerator({ data, filename, children }: PDFGeneratorProps) {
  const defaultFilename = `pm-simulator-report-${data.simulation.id.slice(0, 8)}.pdf`;

  return (
    <PDFDownloadLink
      document={<ReportDocument {...data} />}
      fileName={filename || defaultFilename}
    >
      {children}
    </PDFDownloadLink>
  );
}

export { ReportDocument };
export type { ReportData, SimulationData, PersonaData };
