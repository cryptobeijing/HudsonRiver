import { SafetyLevel, SafetyAssessment } from '@/types/river';

export function assessSafety(
  discharge?: number,
  currentSpeed?: number | null,
  tideState?: string
): SafetyAssessment {
  let level: SafetyLevel = 'safe';
  const recommendations: string[] = [];

  // Discharge thresholds (cubic feet per second)
  // Normal Hudson River flow is ~5,000-20,000 cfs
  // Only flag danger for extreme flooding conditions
  const DISCHARGE_CAUTION = 30000;
  const DISCHARGE_DANGER = 50000; // Major flooding

  // Current speed thresholds (knots)
  // Normal tidal currents in Hudson are 1-3 knots
  // Only flag danger for extreme conditions
  const CURRENT_CAUTION = 2.5;
  const CURRENT_DANGER = 4.0; // Unusually strong, likely storm surge

  // Assess discharge
  if (discharge) {
    if (discharge > DISCHARGE_DANGER) {
      level = 'danger';
      recommendations.push('🚫 EXTREME FLOODING - DO NOT kayak');
      recommendations.push('Major storm or flood event - dangerous conditions');
    } else if (discharge > DISCHARGE_CAUTION) {
      if (level === 'safe') level = 'caution';
      recommendations.push('⚠️ High river flow - experienced kayakers only');
      recommendations.push('Stay close to shore and be aware of stronger currents');
    }
  }

  // Assess current speed
  if (currentSpeed && currentSpeed > 0) {
    if (currentSpeed > CURRENT_DANGER) {
      level = 'danger';
      recommendations.push('🚫 EXTREME CURRENTS - DO NOT kayak');
      recommendations.push('Unusually strong currents - likely storm or extreme conditions');
    } else if (currentSpeed > CURRENT_CAUTION) {
      if (level === 'safe') level = 'caution';
      recommendations.push('⚠️ Strong currents - experienced kayakers only');
      recommendations.push('Consider waiting for slack tide or stay near shore');
    }
  }

  // Tide recommendations
  if (tideState) {
    if (tideState.includes('Flood')) {
      recommendations.push('📈 Tide is rising - current flowing upstream');
    } else if (tideState.includes('Ebb')) {
      recommendations.push('📉 Tide is falling - current flowing downstream');
    }
  }

  // General recommendations based on safety level
  if (level === 'safe') {
    recommendations.unshift('✅ Conditions are favorable for kayaking');
    recommendations.push('Always wear a life jacket');
    recommendations.push('Check weather forecast');
  } else if (level === 'caution') {
    recommendations.unshift('⚠️ Use caution - conditions require experience');
  } else {
    recommendations.unshift('🚫 DANGEROUS - Stay off the water');
  }

  const messages = {
    safe: 'Safe for recreational kayaking',
    caution: 'Proceed with caution - experienced paddlers only',
    danger: 'Dangerous conditions - DO NOT kayak',
  };

  const colors = {
    safe: 'text-green-800 bg-green-100 border-green-500',
    caution: 'text-yellow-800 bg-yellow-100 border-yellow-500',
    danger: 'text-red-800 bg-red-100 border-red-500',
  };

  return {
    level,
    color: colors[level],
    message: messages[level],
    recommendations,
  };
}

export function formatDischarge(value: number): string {
  if (value >= 1000) {
    return `${(value / 1000).toFixed(1)}k ft³/s`;
  }
  return `${value.toFixed(0)} ft³/s`;
}

export function formatTideHeight(value: number): string {
  return `${value.toFixed(2)} ft`;
}

export function getCurrentDirection(degrees: number | null): string {
  if (degrees === null) return 'Unknown';

  const directions = ['N', 'NE', 'E', 'SE', 'S', 'SW', 'W', 'NW'];
  const index = Math.round(degrees / 45) % 8;
  return directions[index];
}

export function getTimeUntil(targetTime: string): string {
  const now = new Date();
  const target = new Date(targetTime);
  const diff = target.getTime() - now.getTime();

  if (diff < 0) return 'Passed';

  const hours = Math.floor(diff / (1000 * 60 * 60));
  const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));

  if (hours > 0) {
    return `in ${hours}h ${minutes}m`;
  }
  return `in ${minutes}m`;
}
