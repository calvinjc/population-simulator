export interface PopulationYear {
  year: number;
  populationByAgeMap: Map<number, PopulationByAgeModel>;
  totalPopulation: number;
  totalMales: number;
  totalFemales: number;
  numBirthsThisYear: number;
  numDeathsThisYear: number;
}

export interface PopulationByAgeModel {
  males: number;
  females: number;
}