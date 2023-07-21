import { Component } from '@angular/core';
import { SimulationSettings } from '../../models/simulation-settings.model';
import { PopulationSimulatorService } from '../../services/population-simulator.service';

@Component({
  selector: 'app-simulation-settings',
  templateUrl: './simulation-settings.component.html',
  styleUrls: ['./simulation-settings.component.scss']
})
export class SimulationSettingsComponent {
  simulationSettings: SimulationSettings;

  constructor(
    simulatorService: PopulationSimulatorService,
  ) {
    this.simulationSettings = simulatorService.simulationSettings;
  }
}