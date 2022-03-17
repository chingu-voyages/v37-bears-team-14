export interface QuerySuggestion {
  query: string;
  score: number;
}

export interface ComputationTrendingSearch {
  suggestions: QuerySuggestion[];
  start: string;
  end: string;
  analyzed: number;
  maxAnalyzed: number;
  timeElapsedMs: number;
  createdAt: Date;
}
