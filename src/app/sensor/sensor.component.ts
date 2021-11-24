import { Component, OnInit } from '@angular/core';
import {Apollo, gql} from "apollo-angular";

const GET_SENSORS = gql`
  {
  sensors {
    temperature
    id
  }
}`

export interface Sensor {
  id: number;
  temperature: number;
}

@Component({
  selector: 'app-sensor',
  templateUrl: './sensor.component.html',
  styleUrls: ['./sensor.component.css']
})

export class SensorComponent implements OnInit {
  temperature: number | undefined;
  id: number | undefined;

  constructor(private apollo: Apollo) { }

  ngOnInit(): void {
    this.apollo.watchQuery({
      query: GET_SENSORS,
    }).valueChanges.subscribe((result: any) => {
      const sensors = result.data.sensors;
      if (sensors.length) {
        this.id = sensors[0].id;
        this.temperature = sensors[0].temperature;
      }
    });
  }
}
