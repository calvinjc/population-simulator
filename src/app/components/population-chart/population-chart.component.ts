import { Component, OnInit } from '@angular/core';

import { Chart } from 'chart.js/auto';
import { PopulationSimulatorService } from '../../services/population-simulator.service';

@Component({
  selector: 'app-population-chart',
  templateUrl: './population-chart.component.html',
  styleUrls: ['./population-chart.component.scss']
})
export class PopulationChartComponent implements OnInit {
  showTable = false;
  chart!: Chart;
  
  constructor(
    public simulatorService: PopulationSimulatorService,
  ) {}

  ngOnInit() {
    const chartEl = document.getElementById('populationChart')
    this.chart = new Chart(
      chartEl as HTMLCanvasElement,
      {
        type: 'line',
        data: {
          labels: [],
          datasets: [
            {
              label: 'Population',
              borderColor: '#0f99f6',
              backgroundColor: '#36a2eb',
              data: [],
              yAxisID: 'y',
            },
            {
              label: 'Births',
              borderColor: '#18bcbc',
              backgroundColor: '#4bc0c0',
              data: [],
              yAxisID: 'y1',
            },
            {
              label: 'Deaths',
              borderColor: '#f17d0a',
              backgroundColor: '#ff9f40',
              data: [],
              yAxisID: 'y1',
            }
          ]
        },
        options: {
          responsive: true,
          interaction: {
            mode: 'index',
            intersect: false,
          },
          scales: {
            y: {
              type: 'linear',
              display: true,
              position: 'left',
            },
            y1: {
              type: 'linear',
              display: true,
              position: 'right',
      
              // grid line settings
              grid: {
                drawOnChartArea: false, // only want the grid lines for one axis to show up
              },
            },
          }
        }
      }
    );
  }

  async onSimulationStartClick() {
    this.chart.data.labels = [];
    this.chart.data.datasets[0].data = [];
    await this.simulatorService.startSimulation(this.chart);

    this.chart.update();
  }
}
