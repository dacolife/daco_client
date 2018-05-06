import { Component, OnInit, Input } from '@angular/core';

@Component({
  moduleId: module.id,
  selector: 'stats',
  templateUrl: './stats.component.html'
})
export class StatsComponent implements OnInit {

  //[number]="666" [comments]="'ДЕЛЕГАТЫ'" [colour]="primary" [type]="globe"
  @Input()  number: number = 777;
  @Input()  colour: string = 'bg-warning';
  @Input()  type: string = 'fa-check';
  @Input()  comments: string = 'Делегаты 66';


  constructor() { }

  ngOnInit() {
  }

}


