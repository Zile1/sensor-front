import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnDestroy, OnInit } from '@angular/core';
import {Apollo, gql} from "apollo-angular";
import { Subject } from 'rxjs';
import { takeUntil } from "rxjs/operators";
import { Sensor } from 'src/app/models';

const GET_SENSORS = gql`
  {
  sensors {
    temperature
    id
  }
}`

@Component({
  selector: 'app-sensor',
  templateUrl: './sensor.component.html',
  styleUrls: ['./sensor.component.css']
})

export class SensorComponent implements OnInit, OnDestroy {
  public sensorsList: Sensor[];

  private sensorsListNotifier$ = new Subject();

  constructor(private apollo: Apollo) {}

  ngOnInit(): void {
    this.getSensorsList(); // uncomment this when you will have connection to your API
    // this.sensorsList = [{id: 1, temperature: 100}, {id: 2, temperature: 200}, {id: 3, temperature: 300}, {id: 4, temperature: 400}] // remove this after you uncomment above method
  }

  ngOnDestroy(): void {
    this.sensorsListNotifier$.next();
    this.sensorsListNotifier$.complete();
  }

  /**
   * Get sensors list
   *
   * @private
   * @memberof SensorComponent
   */
  private getSensorsList(): void {
    this.apollo.watchQuery({
      query: GET_SENSORS,
    }).valueChanges.pipe(
      takeUntil(this.sensorsListNotifier$))
    .subscribe(({ data: { sensors } }: any) => {
      if (sensors) {
        this.sensorsList = sensors;
      }
    }, (error) => {
      console.log("Something went wrong!", error)
    });
  }

  /**
   * Check if sensors list have some data
   *
   * @readonly
   * @type {boolean}
   * @memberof SensorComponent
   */
  public get isSensorsExists(): boolean {
    return this.sensorsList && this.sensorsList.length > 0;
  }
}
