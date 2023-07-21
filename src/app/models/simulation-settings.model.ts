export interface SimulationSettings {
  startingYear: number;
  startingPopulation: number;
  startingPopulationAgeRangeInput: string;
  startingPopulationAgeRange: [number, number];
  ageOfFirstChildbirth: number;
  timeBetweenBirths: number;
  numberOfChildren: number;
  averageLifespan: number;
  childhoodMortalityRate: number;
  simulationLength: number;
  simulationDelay: number;
}