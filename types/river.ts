export interface RiverMeasurement {
  type: 'discharge' | 'gageHeight';
  name: string;
  unit: string;
  unitCode: string;
  current: number;
  history: Array<{
    time: string;
    value: number;
  }>;
}

export interface RiverData {
  timestamp: string;
  site: {
    name: string;
    location: {
      latitude: number;
      longitude: number;
    };
  };
  measurements: RiverMeasurement[];
}

export interface TidePrediction {
  time: string;
  height: number;
  type: 'High' | 'Low';
}

export interface TideData {
  timestamp: string;
  station: {
    id: string;
    name: string;
    currentsId?: string;
    currentsName?: string;
  };
  tide: {
    current: string;
    nextHigh: {
      time: string;
      height: number;
      type: string;
    } | null;
    nextLow: {
      time: string;
      height: number;
      type: string;
    } | null;
    predictions: TidePrediction[];
  };
  current: {
    speed: number | null;
    direction: number | null;
    speedUnit: string;
    available: boolean;
    source?: string;
  };
}

export type SafetyLevel = 'safe' | 'caution' | 'danger';

export interface SafetyAssessment {
  level: SafetyLevel;
  color: string;
  message: string;
  recommendations: string[];
}

export interface EducationalLesson {
  id: string;
  title: string;
  description: string;
  content: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  category: 'hydrology' | 'tides' | 'safety' | 'environment';
}
