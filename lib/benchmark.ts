export interface SectorBenchmark {
  sector: string;
  name: string;
  averageMaturity: number;
  dimensions: Record<string, number>;
  industryStandards?: string[];
}

export const SECTOR_BENCHMARKS: Record<string, SectorBenchmark> = {
  technology: {
    sector: 'technology',
    name: 'Tecnologia',
    averageMaturity: 3.8,
    dimensions: {
      procesos: 3.5,
      personas: 4.0,
      tecnologia: 4.2,
      estrategia: 3.6,
      innovacion: 4.0
    },
    industryStandards: ['ISO 27001', 'CMMI', 'ITIL']
  },
  finance: {
    sector: 'finance',
    name: 'Finanzas',
    averageMaturity: 4.0,
    dimensions: {
      procesos: 4.2,
      personas: 3.8,
      tecnologia: 4.0,
      estrategia: 4.1,
      riesgo: 4.5
    },
    industryStandards: ['ISO 27001', 'PCI-DSS', 'SOX']
  },
  healthcare: {
    sector: 'healthcare',
    name: 'Salud',
    averageMaturity: 3.5,
    dimensions: {
      procesos: 3.8,
      personas: 3.5,
      tecnologia: 3.2,
      calidad: 4.0,
      seguridad: 3.8
    },
    industryStandards: ['ISO 9001', 'HIPAA', 'Joint Commission']
  },
  manufacturing: {
    sector: 'manufacturing',
    name: 'Manufactura',
    averageMaturity: 3.6,
    dimensions: {
      procesos: 4.0,
      personas: 3.4,
      tecnologia: 3.5,
      calidad: 4.2,
      seguridad: 3.8
    },
    industryStandards: ['ISO 9001', 'ISO 14001', 'IATF 16949']
  },
  retail: {
    sector: 'retail',
    name: 'Retail',
    averageMaturity: 3.2,
    dimensions: {
      procesos: 3.3,
      personas: 3.5,
      tecnologia: 3.2,
      cliente: 3.8,
      operaciones: 3.0
    },
    industryStandards: ['ISO 9001', 'PCI-DSS']
  },
  education: {
    sector: 'education',
    name: 'Educacion',
    averageMaturity: 3.0,
    dimensions: {
      procesos: 2.8,
      personas: 3.5,
      tecnologia: 2.8,
      calidad: 3.2,
      innovacion: 2.8
    },
    industryStandards: ['ISO 21001', 'ABET']
  },
  government: {
    sector: 'government',
    name: 'Gobierno',
    averageMaturity: 2.8,
    dimensions: {
      procesos: 3.0,
      personas: 2.5,
      tecnologia: 2.8,
      transparencia: 3.2,
      servicio: 2.6
    },
    industryStandards: ['ISO 9001', 'ISO 27001', 'MIPG']
  },
  logistics: {
    sector: 'logistics',
    name: 'Logistica',
    averageMaturity: 3.4,
    dimensions: {
      procesos: 3.8,
      personas: 3.2,
      tecnologia: 3.5,
      eficiencia: 3.6,
      seguridad: 3.4
    },
    industryStandards: ['ISO 9001', 'ISO 28000', 'BASC']
  }
};

export function getSectorBenchmark(sector: string): SectorBenchmark | null {
  return SECTOR_BENCHMARKS[sector] || null;
}

export function compareToBenchmark(sector: string, currentScore: number): {
  difference: number;
  status: 'above' | 'below' | 'at';
  message: string;
} {
  const benchmark = SECTOR_BENCHMARKS[sector];
  if (!benchmark) {
    return {
      difference: 0,
      status: 'at',
      message: 'Sin benchmark de referencia disponible'
    };
  }

  const difference = currentScore - benchmark.averageMaturity;
  let status: 'above' | 'below' | 'at';
  let message: string;

  if (difference > 0.2) {
    status = 'above';
    message = `Por encima del promedio del sector (${benchmark.averageMaturity.toFixed(1)})`;
  } else if (difference < -0.2) {
    status = 'below';
    message = `Por debajo del promedio del sector (${benchmark.averageMaturity.toFixed(1)})`;
  } else {
    status = 'at';
    message = `En el promedio del sector (${benchmark.averageMaturity.toFixed(1)})`;
  }

  return { difference, status, message };
}
