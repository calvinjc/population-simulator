import { TestBed } from '@angular/core/testing';

import { PopulationSimulatorService } from './population-simulator.service';
import { PopulationByAgeModel, PopulationYear } from '../models/population-year.model';

describe('PopulationSimulatorService', () => {
  let service: PopulationSimulatorService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PopulationSimulatorService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should increase population for a given age, number of males and number of females', () => {
    const populationYear = {
      year: 0,
      populationByAgeMap: new Map<number, PopulationByAgeModel>(),
      totalPopulation: 0,
      totalFemales: 0,
      totalMales: 0,
      numBirthsThisYear: 0,
      numDeathsThisYear: 0,
    } as PopulationYear;
    const age = 30;
    const numberMales = 10;
    const numberFemales = 5;
    const populationByAgeModel = {} as PopulationByAgeModel;
    populationByAgeModel.males = 20;
    populationByAgeModel.females = 15;
    populationYear.populationByAgeMap.set(age, populationByAgeModel);

    service.simulateBirths(populationYear);

    expect(populationByAgeModel.males).toEqual(30);
    expect(populationByAgeModel.females).toEqual(20);
  });

  it('should not increase population for an age that does not exist', () => {
    const populationYear = {
      year: 0,
      populationByAgeMap: new Map<number, PopulationByAgeModel>(),
      totalPopulation: 0,
      totalFemales: 0,
      totalMales: 0,
      numBirthsThisYear: 0,
      numDeathsThisYear: 0,
    } as PopulationYear;
    const age = 30;
    const numberMales = 10;
    const numberFemales = 5;

    service.simulateBirths(populationYear);

    expect(populationYear.populationByAgeMap.size).toEqual(0);
  });

  it('should not increase population for a gender below zero', () => {
    const populationYear = {
      year: 0,
      populationByAgeMap: new Map<number, PopulationByAgeModel>(),
      totalPopulation: 0,
      totalFemales: 0,
      totalMales: 0,
      numBirthsThisYear: 0,
      numDeathsThisYear: 0,
    } as PopulationYear;
    const age = 30;
    const numberMales = 20;
    const numberFemales = 15;
    const populationByAgeModel = {} as PopulationByAgeModel;
    populationByAgeModel.males = 10;
    populationByAgeModel.females = 5;
    populationYear.populationByAgeMap.set(age, populationByAgeModel);

    service.simulateBirths(populationYear);

    expect(populationByAgeModel.males).toEqual(10);
    expect(populationByAgeModel.females).toEqual(5);
  });

  it('should not increase population for no women giving birth', () => {
    const populationYear = {
      year: 0,
      populationByAgeMap: new Map<number, PopulationByAgeModel>(),
      totalPopulation: 0,
      totalFemales: 0,
      totalMales: 0,
      numBirthsThisYear: 0,
      numDeathsThisYear: 0,
    } as PopulationYear;
    const age = 30;
    const numberMales = 20;
    const numberFemales = 0;
    const populationByAgeModel = {} as PopulationByAgeModel;
    populationByAgeModel.males = 10;
    populationByAgeModel.females = 5;
    populationYear.populationByAgeMap.set(age, populationByAgeModel);

    service.simulateBirths(populationYear);

    expect(populationByAgeModel.males).toEqual(10);
    expect(populationByAgeModel.females).toEqual(5);
  });

  it('should increase population for one woman giving birth', () => {
    const populationYear = {
      year: 0,
      populationByAgeMap: new Map<number, PopulationByAgeModel>(),
      totalPopulation: 0,
      totalFemales: 0,
      totalMales: 0,
      numBirthsThisYear: 0,
      numDeathsThisYear: 0,
    } as PopulationYear;
    const age = 30;
    const numberMales = 20;
    const numberFemales = 1;
    const populationByAgeModel = {} as PopulationByAgeModel;
    populationByAgeModel.males = 10;
    populationByAgeModel.females = 1;
    populationYear.populationByAgeMap.set(age, populationByAgeModel);

    service.simulateBirths(populationYear);

    expect(populationByAgeModel.males).toEqual(11);
    expect(populationByAgeModel.females).toEqual(12);
  });

  it('should simulate adult deaths for a given age', () => {
    const populationYear = {
      year: 0,
      populationByAgeMap: new Map<number, PopulationByAgeModel>(),
      totalPopulation: 0,
      totalFemales: 0,
      totalMales: 0,
      numBirthsThisYear: 0,
      numDeathsThisYear: 0,
    } as PopulationYear;
    const age = 70;
    const populationByAgeModel = {} as PopulationByAgeModel;
    populationByAgeModel.males = 10;
    populationByAgeModel.females = 5;
    populationYear.populationByAgeMap.set(age, populationByAgeModel);

    service.simulateAdultDeaths(populationYear);

    expect(populationYear.numDeathsThisYear).toEqual(15);
    expect(populationYear.populationByAgeMap.size).toEqual(0);
  });

  it('should not simulate adult deaths for an age that does not exist', () => {
    const populationYear = {
      year: 0,
      populationByAgeMap: new Map<number, PopulationByAgeModel>(),
      totalPopulation: 0,
      totalFemales: 0,
      totalMales: 0,
      numBirthsThisYear: 0,
      numDeathsThisYear: 0,
    } as PopulationYear;
    const age = 70;

    service.simulateAdultDeaths(populationYear);

    expect(populationYear.numDeathsThisYear).toEqual(0);
    expect(populationYear.populationByAgeMap.size).toEqual(0);
  });

  it('should simulate adult deaths for a given age with no people', () => {
    const populationYear = {
      year: 0,
      populationByAgeMap: new Map<number, PopulationByAgeModel>(),
      totalPopulation: 0,
      totalFemales: 0,
      totalMales: 0,
      numBirthsThisYear: 0,
      numDeathsThisYear: 0,
    } as PopulationYear;
    const age = 70;
    const populationByAgeModel = {} as PopulationByAgeModel;
    populationByAgeModel.males = 0;
    populationByAgeModel.females = 0;
    populationYear.populationByAgeMap.set(age, populationByAgeModel);

    service.simulateAdultDeaths(populationYear);

    expect(populationYear.numDeathsThisYear).toEqual(0);
    expect(populationYear.populationByAgeMap.size).toEqual(0);
  });

  it('should decrease population for a given age, number of males and number of females', () => {
    const populationYear = {
      year: 0,
      populationByAgeMap: new Map<number, PopulationByAgeModel>(),
      totalPopulation: 0,
      totalFemales: 0,
      totalMales: 0,
      numBirthsThisYear: 0,
      numDeathsThisYear: 0,
    } as PopulationYear;
    const age = 30;
    const numberMales = 10;
    const numberFemales = 5;
    const populationByAgeModel = {} as PopulationByAgeModel;
    populationByAgeModel.males = 20;
    populationByAgeModel.females = 15;
    populationYear.populationByAgeMap.set(age, populationByAgeModel);

    service.decreasePopulation(populationYear, age, numberMales, numberFemales);

    expect(populationByAgeModel.males).toEqual(10);
    expect(populationByAgeModel.females).toEqual(10);
  });

  it('should not decrease population for an age that does not exist', () => {
    const populationYear = {
      year: 0,
      populationByAgeMap: new Map<number, PopulationByAgeModel>(),
      totalPopulation: 0,
      totalFemales: 0,
      totalMales: 0,
      numBirthsThisYear: 0,
      numDeathsThisYear: 0,
    } as PopulationYear;
    const age = 30;
    const numberMales = 10;
    const numberFemales = 5;

    service.decreasePopulation(populationYear, age, numberMales, numberFemales);

    expect(populationYear.populationByAgeMap.size).toEqual(0);
  });

  it('should not decrease population for a gender below zero', () => {
    const populationYear = {
      year: 0,
      populationByAgeMap: new Map<number, PopulationByAgeModel>(),
      totalPopulation: 0,
      totalFemales: 0,
      totalMales: 0,
      numBirthsThisYear: 0,
      numDeathsThisYear: 0,
    } as PopulationYear;
    const age = 30;
    const numberMales = 20;
    const numberFemales = 15;
    const populationByAgeModel = {} as PopulationByAgeModel;
    populationByAgeModel.males = 10;
    populationByAgeModel.females = 5;
    populationYear.populationByAgeMap.set(age, populationByAgeModel);

    service.decreasePopulation(populationYear, age, numberMales, numberFemales);

    expect(populationByAgeModel.males).toEqual(0);
    expect(populationByAgeModel.females).toEqual(0);
  });

  it('evenlyDistributedNumbers: should return evenly distributed numbers', () => {
    const maxDataPoints = 5;
    const simulationLength = 100;
    const result = service.evenlyDistributedNumbers(maxDataPoints, simulationLength);
    expect(result).toEqual([0, 25, 50, 75, 100]);
  });

  it('evenlyDistributedNumbers: should return last value if one data point', () => {
    const maxDataPoints = 1;
    const simulationLength = 100;
    const result = service.evenlyDistributedNumbers(maxDataPoints, simulationLength);
    expect(result).toEqual([100]);
  });

  it('evenlyDistributedNumbers: should return evenly distributed numbers with zero simulation length', () => {
    const maxDataPoints = 5;
    const simulationLength = 0;
    const result = service.evenlyDistributedNumbers(maxDataPoints, simulationLength);
    expect(result).toEqual([0, 0, 0, 0, 0]);
  });
});
