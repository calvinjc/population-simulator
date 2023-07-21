import { Injectable } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { Chart } from 'chart.js/auto';

import { SimulationSettings } from '../models/simulation-settings.model';
import { PopulationByAgeModel, PopulationYear } from '../models/population-year.model';

@Injectable({
  providedIn: 'root'
})
export class PopulationSimulatorService {
  tableDataSource = new MatTableDataSource<PopulationYear>();

  simulationSettings: SimulationSettings = {
    startingYear: new Date().getFullYear(),
    startingPopulation: 200,
    startingPopulationAgeRangeInput: "1-65",
    startingPopulationAgeRange: [1, 65],
    ageOfFirstChildbirth: 24,
    timeBetweenBirths: 3,
    numberOfChildren: 3,
    averageLifespan: 80,
    childhoodMortalityRate: 0.08,
    simulationLength: 100,
    simulationDelay: 0
  };

  currentYear = this.simulationSettings.startingYear;
  currentPopulation = this.simulationSettings.startingPopulation;
  currentBirths = 0;
  currentDeaths = 0;

  birthingAges: number[] = [];
  simulationYearsToUpdateTheChart: number[] = [];

  populationHistory: PopulationYear[] = [];

  isNextChildABoy = Math.random() < 0.5;

  constructor() { }

  async startSimulation(chart: Chart) {
    chart.data.labels = [];
    chart.data.datasets[0].data = [];
    chart.data.datasets[1].data = [];
    chart.data.datasets[2].data = [];
    chart.update();

    const ageRangeSplit = this.simulationSettings.startingPopulationAgeRangeInput.split('-');
    if (ageRangeSplit.length === 2) {
      this.simulationSettings.startingPopulationAgeRange = [parseInt(ageRangeSplit[0]), parseInt(ageRangeSplit[1])];
    } else if (ageRangeSplit.length === 1) {
      this.simulationSettings.startingPopulationAgeRange = [parseInt(ageRangeSplit[0]), parseInt(ageRangeSplit[0])];
    } else {
      console.log(`Invalid age range input: ${this.simulationSettings.startingPopulationAgeRangeInput}`);
      return;
    }

    this.birthingAges = [];
    for (let i = 0; i < this.simulationSettings.numberOfChildren; i++) {
      this.birthingAges.push(this.simulationSettings.ageOfFirstChildbirth + (i * this.simulationSettings.timeBetweenBirths));
    }

    const MAX_DATA_POINTS = 101;
    this.simulationYearsToUpdateTheChart = this.evenlyDistributedNumbers(MAX_DATA_POINTS, this.simulationSettings.simulationLength);

    this.populationHistory = [this.createInitialAgeDistribution()];
    this.updateCharts(chart, 0);

    // year zero is the initial ages, so start at year 1
    // simulate the number of years specified in the settings with a delay between each year
    for (let i = 1; i <= this.simulationSettings.simulationLength; i++) {
      this.simulateYear(i);

      // optionally add a simulation delay to make a fun animation effect on shorter simulations
      if (i < this.simulationSettings.simulationLength - 1) {
        await new Promise(resolve => setTimeout(resolve, this.simulationSettings.simulationDelay));
      }

      this.updateCharts(chart, i);
    }
  }

  createInitialAgeDistribution(): PopulationYear {
    const populationYear: PopulationYear = {
      year: 0,
      populationByAgeMap: new Map<number, PopulationByAgeModel>(),
      totalPopulation: 0,
      totalFemales: 0,
      totalMales: 0,
      numBirthsThisYear: 0,
      numDeathsThisYear: 0,
    };
    
    const [minAge, maxAge] = this.simulationSettings.startingPopulationAgeRange;
    const ageRangeLength = maxAge - minAge + 1;

    let startingMalePopulation = Math.floor(this.simulationSettings.startingPopulation / 2);
    let startingFemalePopulation = Math.floor(this.simulationSettings.startingPopulation / 2);
    const remainder = this.simulationSettings.startingPopulation % 2;
    if (remainder === 1) {
      if (this.isNextChildABoy) {
        startingMalePopulation++;
      } else {
        startingFemalePopulation++;
      }
      this.isNextChildABoy = !this.isNextChildABoy;
    }

    // If the starting population is greater than or equal to the age range length,
    // distribute the population evenly across all ages within the range.
    const malePopulationPerAge = Math.floor(startingMalePopulation / ageRangeLength);
    const femalePopulationPerAge = Math.floor(startingFemalePopulation / ageRangeLength);
    if (malePopulationPerAge > 0 || femalePopulationPerAge > 0){
      for (let i = minAge; i <= maxAge; i++) {
        this.increasePopulation(populationYear, i, malePopulationPerAge, femalePopulationPerAge);
      }
    }

    // Distribute the remaining individuals randomly but evenly across the age range
    const remainingMales = startingMalePopulation % ageRangeLength;
    const pickedMaleAges: number[] = [];
    for (let i = 0; i < remainingMales; i++) {
      let randomAgeIndex = Math.floor(Math.random() * ageRangeLength) + minAge;
      while (pickedMaleAges.includes(randomAgeIndex)) {
        randomAgeIndex = Math.floor(Math.random() * ageRangeLength) + minAge;
      }
      pickedMaleAges.push(randomAgeIndex);

      this.incrementPopulation(populationYear, randomAgeIndex, true);
    }

    const remainingFemales = startingFemalePopulation % ageRangeLength;
    const pickedFemaleAges: number[] = [];
    for (let i = 0; i < remainingFemales; i++) {
      let randomAgeIndex = Math.floor(Math.random() * ageRangeLength) + minAge;
      while (pickedFemaleAges.includes(randomAgeIndex)) {
        randomAgeIndex = Math.floor(Math.random() * ageRangeLength) + minAge;
      }
      pickedFemaleAges.push(randomAgeIndex);

      this.incrementPopulation(populationYear, randomAgeIndex, false);
    }

    populationYear.populationByAgeMap.forEach((populationByAge) => {
      populationYear.totalMales += populationByAge.males;
      populationYear.totalFemales += populationByAge.females;
    });
    populationYear.totalPopulation = populationYear.totalMales + populationYear.totalFemales;

    return populationYear;
  }

  simulateYear(year: number) {
    const previousYear = this.populationHistory[year - 1];
    
    // clone the previous year's populationByAgeMap but increment all the ages by 1
    const newYearAgeMap = new Map<number, PopulationByAgeModel>();
    previousYear.populationByAgeMap.forEach((populationByAge, age) => {
      newYearAgeMap.set(age + 1, {...populationByAge});
    });

    // we haven't added or removed anyone yet, so the population numbers are the same as the previous year
    const newYear: PopulationYear = {
      ...previousYear,
      year: year,
      populationByAgeMap: newYearAgeMap,
      numBirthsThisYear: 0,
      numDeathsThisYear: 0,
    };

    this.simulateBirths(newYear);
    this.simulateAdultDeaths(newYear);
    this.simulateChildhoodDeaths(newYear);

    // update total populations for the year
    newYear.totalMales = 0;
    newYear.totalFemales = 0;
    newYear.populationByAgeMap.forEach((populationByAge) => {
      newYear.totalMales += populationByAge.males;
      newYear.totalFemales += populationByAge.females;
    });
    newYear.totalPopulation = newYear.totalMales + newYear.totalFemales;

    this.populationHistory.push(newYear);
  }

  simulateBirths(populationYear: PopulationYear) {
    this.birthingAges.forEach((birthingAge) => {
      const populationByAgeModel = populationYear.populationByAgeMap.get(birthingAge);
      if (populationByAgeModel) {
        const numberOfWomenGivingBirthAtThisAge = populationByAgeModel.females;

        let maleBabiesBorn = Math.floor(numberOfWomenGivingBirthAtThisAge / 2);
        let femaleBabiesBorn = Math.floor(numberOfWomenGivingBirthAtThisAge / 2);
        const remainder = numberOfWomenGivingBirthAtThisAge % 2;
        if (remainder === 1) {
          if (this.isNextChildABoy) {
            maleBabiesBorn++;
          } else {
            femaleBabiesBorn++;
          }
          this.isNextChildABoy = !this.isNextChildABoy;
        }

        if (maleBabiesBorn + femaleBabiesBorn > 0) {
          this.increasePopulation(populationYear, 0, maleBabiesBorn, femaleBabiesBorn); // :)
          populationYear.numBirthsThisYear += maleBabiesBorn + femaleBabiesBorn;
        }
      }
    });
  }

  simulateAdultDeaths(populationYear: PopulationYear) {
    /**
     * Obviously this isn't realistic since not everyone dies at the same age
     * but especially on a large scale the average works out to be just that: an average
     */
    // TODO: enhance this to be more realistic and include a standard deviation
    const theAgeEveryoneDies = this.simulationSettings.averageLifespan;
    const dyingPeople = populationYear.populationByAgeMap.get(theAgeEveryoneDies);
    populationYear.numDeathsThisYear = (dyingPeople?.males || 0) + (dyingPeople?.females || 0);
    populationYear.populationByAgeMap.delete(theAgeEveryoneDies); // :'(
  }

  simulateChildhoodDeaths(populationYear: PopulationYear) {
    /**
     * Obviously this isn't realistic similar to the adult deaths. Letting all children live to the age of the first childbirth
     * boosts the numbers slightly but not significantly especially on a longer simulation.
     * The important thing is that the childhood mortality rate is applied prior to the age women start giving birth.
     */
    // TODO: enhance this to be more realistic and spread the child mortality rate evenly across the "childhood" years.
    const theAgeBeforeWomenStartGivingBirth = this.simulationSettings.ageOfFirstChildbirth - 1;
    const ageModel = populationYear.populationByAgeMap.get(theAgeBeforeWomenStartGivingBirth);
    if (ageModel) {
      // round down so that at low populations you don't kill off all the child bearing women
      const numMaleDeaths = Math.floor(ageModel.males * this.simulationSettings.childhoodMortalityRate);
      const numFemaleDeaths = Math.floor(ageModel.females * this.simulationSettings.childhoodMortalityRate);

      this.decreasePopulation(populationYear, theAgeBeforeWomenStartGivingBirth, numMaleDeaths, numFemaleDeaths); // :'(
    }
  }

  incrementPopulation(populationYear: PopulationYear, age: number, isMale: boolean) {
    this.increasePopulation(populationYear, age, isMale ? 1 : 0, isMale ? 0 : 1);
  }

  increasePopulation(populationYear: PopulationYear, age: number, numberMales: number, numberFemales: number) {
    let populationByAgeModel = populationYear.populationByAgeMap.get(age);
    if (!populationByAgeModel) {
      populationByAgeModel = {
        males: 0,
        females: 0,
      };
    }
    populationByAgeModel.males += numberMales;
    populationByAgeModel.females += numberFemales;

    populationYear.populationByAgeMap.set(age, populationByAgeModel);
  }

  decreasePopulation(populationYear: PopulationYear, age: number, numberMales: number, numberFemales: number) {
    let populationByAgeModel = populationYear.populationByAgeMap.get(age);
    if (!populationByAgeModel) {
      console.log(`You shouldn't be trying to decrese population for an age that doesn't exist ${JSON.stringify(populationYear)}, ${age}, ${numberMales}, ${numberFemales}`);
      return;
    }

    populationByAgeModel.males -= numberMales;
    populationByAgeModel.females -= numberFemales;

    if (populationByAgeModel.males < 0) { 
      populationByAgeModel.males = 0;
      console.log(`You shouldn't be trying to decrese population for a gender below zero ${JSON.stringify(populationYear)}, ${age}, ${numberMales}, ${numberFemales}`);
    }
    if (populationByAgeModel.females < 0) { 
      populationByAgeModel.females = 0;
      console.log(`You shouldn't be trying to decrese population for a gender below zero ${JSON.stringify(populationYear)}, ${age}, ${numberMales}, ${numberFemales}`);
    }

    populationYear.populationByAgeMap.set(age, populationByAgeModel);
  }

  updateCharts(chart: Chart, simulationYear: number) {
    this.currentYear = this.populationHistory[simulationYear].year + this.simulationSettings.startingYear;
    this.currentPopulation = this.populationHistory[simulationYear].totalPopulation;
    this.currentBirths = this.populationHistory[simulationYear].numBirthsThisYear;
    this.currentDeaths = this.populationHistory[simulationYear].numDeathsThisYear;

    this.tableDataSource.data.push({
      ...this.populationHistory[simulationYear],
      year: this.currentYear,
    });

    // The simulation algorithm is performant, however continuously adding data points makes the chart render function slow.
    // implement a maximum number of data points to ensure consistent performance
    if (this.simulationYearsToUpdateTheChart.includes(simulationYear)) {
      chart.data.labels?.push(this.currentYear);
      chart.data.datasets[0].data.push(this.currentPopulation);
      chart.data.datasets[1].data.push(this.currentBirths);
      chart.data.datasets[2].data.push(this.currentDeaths);
      chart.options.scales!['y1']!.max = Math.max(this.currentBirths, this.currentDeaths) * 3;
      chart.update();
    }
  }

  evenlyDistributedNumbers(maxDataPoints: number, simulationLength: number): number[] {
    const step = simulationLength / (maxDataPoints - 1);
    const result = new Array(maxDataPoints).fill(0);
    for (let i = 1; i < maxDataPoints; i++) {
      result[i] = Math.round(result[i - 1] + step);
    }
    result[maxDataPoints - 1] = simulationLength;
    return result;
  }
}
