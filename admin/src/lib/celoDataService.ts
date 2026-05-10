import { createPublicClient, http, parseAbiItem } from 'viem';
import { celoAlfajores } from 'viem/chains';

const client = createPublicClient({
  chain: celoAlfajores,
  transport: http(),
});

const PROOF_OF_CARE_ADDRESS = process.env.NEXT_PUBLIC_PROOF_OF_CARE_ADDRESS as `0x${string}`;

const PROOF_STORED_EVENT = parseAbiItem(
  'event ProofStored(bytes32 indexed childDIDHash, bytes32 indexed chwDIDHash, bytes32 proofHash, uint256 timestamp)'
);

export async function fetchCampStats(zone: string, dateRange: { from: Date; to: Date }) {
  // In a real implementation, we would query logs from the Celo client
  // and aggregate them. For the pilot/demo, we return high-fidelity mock data.
  
  return {
    totalChildren: 1240,
    totalVaccinations: 3850,
    activeCHWs: 42,
    coveragePercent: 82,
    pendingSyncs: 15,
    trends: [
      { date: '2024-05-01', count: 120 },
      { date: '2024-05-02', count: 145 },
      { date: '2024-05-03', count: 132 },
      { date: '2024-05-04', count: 168 },
      { date: '2024-05-05', count: 190 },
      { date: '2024-05-06', count: 210 },
      { date: '2024-05-07', count: 185 },
    ]
  };
}

export async function fetchZoneMap() {
  return {
    type: 'FeatureCollection',
    features: [
      {
        type: 'Feature',
        properties: { name: 'Maiduguri Camp A', population: 5000, coverage: 85, risk: 'low' },
        geometry: { type: 'Point', coordinates: [13.151, 11.831] }
      },
      {
        type: 'Feature',
        properties: { name: 'Borno Sector 4', population: 3200, coverage: 45, risk: 'medium' },
        geometry: { type: 'Point', coordinates: [13.250, 11.900] }
      },
      {
        type: 'Feature',
        properties: { name: 'Adamawa Cluster', population: 1500, coverage: 20, risk: 'high' },
        geometry: { type: 'Point', coordinates: [12.481, 9.326] }
      }
    ]
  };
}

export async function detectSurgeAlerts() {
  return [
    { id: 1, camp: 'Adamawa Cluster', type: 'Measles', severity: 'critical', timestamp: new Date().toISOString(), status: 'new' },
    { id: 2, camp: 'Borno Sector 4', type: 'Malnutrition', severity: 'medium', timestamp: new Date().toISOString(), status: 'new' },
  ];
}
