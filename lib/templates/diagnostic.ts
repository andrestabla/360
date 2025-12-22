export interface DiagnosticDimension {
  id: string;
  name: string;
  description: string;
  weight: number;
  weightAIQ?: number;
}

export interface DiagnosticQuestion {
  id: string;
  dimensionId: string;
  text: string;
  type: 'scale' | 'boolean' | 'select';
  options?: string[];
  weight: number;
}

export const DIAGNOSTIC_DIMENSIONS: DiagnosticDimension[] = [
  {
    id: 'dim-procesos',
    name: 'Procesos',
    description: 'Evaluacion de la madurez en gestion de procesos organizacionales',
    weight: 0.25,
    weightAIQ: 0.20
  },
  {
    id: 'dim-personas',
    name: 'Personas',
    description: 'Evaluacion de la madurez en gestion del talento humano',
    weight: 0.20,
    weightAIQ: 0.15
  },
  {
    id: 'dim-tecnologia',
    name: 'Tecnologia',
    description: 'Evaluacion de la madurez en adopcion y uso de tecnologia',
    weight: 0.20,
    weightAIQ: 0.25
  },
  {
    id: 'dim-estrategia',
    name: 'Estrategia',
    description: 'Evaluacion de la madurez en planificacion estrategica',
    weight: 0.20,
    weightAIQ: 0.25
  },
  {
    id: 'dim-cultura',
    name: 'Cultura',
    description: 'Evaluacion de la madurez en cultura organizacional',
    weight: 0.15,
    weightAIQ: 0.15
  }
];

export const DIAGNOSTIC_QUESTIONS: DiagnosticQuestion[] = [
  {
    id: 'q-proc-1',
    dimensionId: 'dim-procesos',
    text: 'Los procesos criticos de la organizacion estan documentados y actualizados?',
    type: 'scale',
    weight: 1
  },
  {
    id: 'q-proc-2',
    dimensionId: 'dim-procesos',
    text: 'Existen indicadores de gestion para medir el desempeno de los procesos?',
    type: 'scale',
    weight: 1
  },
  {
    id: 'q-proc-3',
    dimensionId: 'dim-procesos',
    text: 'Se realizan revisiones periodicas de los procesos para mejora continua?',
    type: 'scale',
    weight: 0.8
  },
  {
    id: 'q-pers-1',
    dimensionId: 'dim-personas',
    text: 'Los roles y responsabilidades estan claramente definidos?',
    type: 'scale',
    weight: 1
  },
  {
    id: 'q-pers-2',
    dimensionId: 'dim-personas',
    text: 'Existe un programa de capacitacion y desarrollo para el personal?',
    type: 'scale',
    weight: 0.9
  },
  {
    id: 'q-pers-3',
    dimensionId: 'dim-personas',
    text: 'Se realizan evaluaciones de desempeno periodicas?',
    type: 'boolean',
    weight: 0.8
  },
  {
    id: 'q-tech-1',
    dimensionId: 'dim-tecnologia',
    text: 'Las herramientas tecnologicas soportan adecuadamente los procesos de negocio?',
    type: 'scale',
    weight: 1
  },
  {
    id: 'q-tech-2',
    dimensionId: 'dim-tecnologia',
    text: 'Existe una estrategia de transformacion digital definida?',
    type: 'boolean',
    weight: 0.9
  },
  {
    id: 'q-tech-3',
    dimensionId: 'dim-tecnologia',
    text: 'La informacion esta integrada entre los diferentes sistemas?',
    type: 'scale',
    weight: 0.8
  },
  {
    id: 'q-est-1',
    dimensionId: 'dim-estrategia',
    text: 'La vision y mision estan claramente comunicadas a toda la organizacion?',
    type: 'scale',
    weight: 1
  },
  {
    id: 'q-est-2',
    dimensionId: 'dim-estrategia',
    text: 'Existen objetivos estrategicos medibles y con seguimiento periodico?',
    type: 'scale',
    weight: 1
  },
  {
    id: 'q-est-3',
    dimensionId: 'dim-estrategia',
    text: 'La estrategia se revisa y actualiza periodicamente?',
    type: 'boolean',
    weight: 0.8
  },
  {
    id: 'q-cult-1',
    dimensionId: 'dim-cultura',
    text: 'Existe una cultura de mejora continua en la organizacion?',
    type: 'scale',
    weight: 1
  },
  {
    id: 'q-cult-2',
    dimensionId: 'dim-cultura',
    text: 'La colaboracion entre areas es fluida y efectiva?',
    type: 'scale',
    weight: 0.9
  },
  {
    id: 'q-cult-3',
    dimensionId: 'dim-cultura',
    text: 'Los valores organizacionales se practican en el dia a dia?',
    type: 'scale',
    weight: 0.8
  }
];

export function calculateDimensionScore(
  dimensionId: string,
  answers: Record<string, number | boolean>
): number {
  const questions = DIAGNOSTIC_QUESTIONS.filter(q => q.dimensionId === dimensionId);
  if (questions.length === 0) return 0;

  let totalWeight = 0;
  let weightedSum = 0;

  questions.forEach(q => {
    const answer = answers[q.id];
    if (answer !== undefined) {
      const score = typeof answer === 'boolean' ? (answer ? 5 : 1) : answer;
      weightedSum += score * q.weight;
      totalWeight += q.weight;
    }
  });

  return totalWeight > 0 ? weightedSum / totalWeight : 0;
}

export function calculateOverallScore(answers: Record<string, number | boolean>): number {
  let totalWeight = 0;
  let weightedSum = 0;

  DIAGNOSTIC_DIMENSIONS.forEach(dim => {
    const dimScore = calculateDimensionScore(dim.id, answers);
    if (dimScore > 0) {
      weightedSum += dimScore * dim.weight;
      totalWeight += dim.weight;
    }
  });

  return totalWeight > 0 ? weightedSum / totalWeight : 0;
}

export function getMaturityLevel(score: number): {
  level: number;
  name: string;
  description: string;
} {
  if (score >= 4.5) {
    return {
      level: 5,
      name: 'Optimizado',
      description: 'Organizacion con procesos optimizados y mejora continua sistematica'
    };
  } else if (score >= 3.5) {
    return {
      level: 4,
      name: 'Gestionado',
      description: 'Procesos medidos y controlados con indicadores definidos'
    };
  } else if (score >= 2.5) {
    return {
      level: 3,
      name: 'Definido',
      description: 'Procesos estandarizados y documentados en toda la organizacion'
    };
  } else if (score >= 1.5) {
    return {
      level: 2,
      name: 'Repetible',
      description: 'Procesos basicos establecidos pero no completamente estandarizados'
    };
  } else {
    return {
      level: 1,
      name: 'Inicial',
      description: 'Procesos ad-hoc sin estandarizacion ni documentacion'
    };
  }
}
