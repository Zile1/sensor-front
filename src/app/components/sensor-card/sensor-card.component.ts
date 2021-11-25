import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-sensor-card',
  templateUrl: './sensor-card.component.html',
  styleUrls: ['./sensor-card.component.css']
})
export class SensorCardComponent implements OnInit {

  @Input() id: number;
  @Input() temperature: number;

  constructor() { }

  ngOnInit(): void {
  }

}
