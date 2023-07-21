import { TestBed } from '@angular/core/testing';

import { PopulationSimulatorService } from './population-simulator.service';

describe('PopulationSimulatorService', () => {
  let service: PopulationSimulatorService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PopulationSimulatorService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
