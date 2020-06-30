import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { Chart } from 'chart.js';
import { EstadisticasService } from '../../api/estadisticas.service';

@Component({
  selector: 'app-graphics',
  templateUrl: './graphics.component.html',
  styleUrls: ['./graphics.component.scss'],
})
export class GraphicsComponent implements OnInit {

  @ViewChild('barCharttareas', {read: ElementRef, static: true}) barCharttareas: ElementRef;
  @ViewChild('barChartforos', {read: ElementRef, static: true}) barChartforos: ElementRef;
  @ViewChild('barChartrecursos', {read: ElementRef, static: true}) barChartrecursos: ElementRef;

  bars: any;
  colorArray: any;
  public Estadisticas: any = [];
  public tareas: any[] = [];
  public foros: any[] = [];
  public recursos: any[] = [];
  public color: any;


  constructor(private apiEstadistica: EstadisticasService) { }

  ngOnInit() {
    console.log("this.apiEstadistica.get()");



    this.apiEstadistica.get().subscribe(data => {
      console.log(data);
      this.Estadisticas = data;
      this.Estadisticas.estadisticames.forEach(item => {
            this.tareas.push(item.tareas);
            this.foros.push(item.foros);
            this.recursos.push(item.recursos);
      });

      console.log(this.tareas);

      this.createBarChart(this.tareas, this.barCharttareas, '#F4315D');
      this.createBarChart(this.foros, this.barChartforos, '#6228cf');
      this.createBarChart(this.recursos, this.barChartrecursos, '#FF426D');
    });
  }

  ionViewDidEnter() {
   
  }

  createBarChart(lista: any[], elemento: any, color: any) {

    let ctx = elemento.nativeElement;
    ctx.height = 300;
    this.generateColorArray(12);
    this.bars = new Chart(ctx, {
      type: 'horizontalBar',
      data: {
        labels: ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'],
        datasets: [{
          data: lista,
          backgroundColor: color, // array should have same number of elements as number of dataset
       //   borderColor: 'rgb(38, 194, 129)',// array should have same number of elements as number of dataset
       //   borderWidth: 1
        }]
      },
      options: {
        legend: {
          display: false
      },
        scales: {
          xAxes: [{

            gridLines: {
              drawOnChartArea: false
            },
          }],
          yAxes: [{
            barPercentage: 0.6,
            categoryPercentage: 0.6,
            ticks: {
              beginAtZero: true
            },
            gridLines: {
              drawOnChartArea: false
            }
          }]
        }
      }
    });
  }

  generateColorArray(num) {
    this.colorArray = [];
    for (let i = 0; i < num; i++) {
      this.colorArray.push('#' + Math.floor(Math.random() * 16777215).toString(16));
    }
  }

}
