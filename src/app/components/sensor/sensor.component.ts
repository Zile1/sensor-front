import { Component, OnDestroy, OnInit } from '@angular/core';
import { Apollo, gql } from "apollo-angular";
import { Subject } from 'rxjs';
import { takeUntil } from "rxjs/operators";
import { Sensor, Sensors } from 'src/app/models';
import { Socket } from "ngx-socket-io";

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

  constructor(private apollo: Apollo,
              private socket: Socket) {}

  ngOnInit(): void {
    this.getSensorsList();
    this.listenSocket();
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
  private async getSensorsList(): Promise<void> {
    this.apollo.watchQuery<Sensors>({
      query: GET_SENSORS,
    }).valueChanges.pipe(
      takeUntil(this.sensorsListNotifier$))
      .subscribe((result: any) => {
        if (result.data.sensors) {
          result.data.sensors.forEach((sensor: Sensor) => {
            this.joinRoom(`sensor/${sensor.id}`);
          });
          this.sensorsList = result.data.sensors;
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

  /**
   * Count sensors
   *
   * @readonly
   * @type {number}
   * @memberOf SensorComponent
   */
  public get countSensors(): number {
    return this.sensorsList && this.sensorsList.length;
  }

  /**
   * Join sensor room in order to listen changes.
   *
   * @type {string}
   * @param room
   * @memberOf SensorComponent
   */
  public async joinRoom(room: string): Promise<void> {
    this.socket.emit('joinRoom', room);
  }

  /**
   * Listen socket changes.
   *
   * @private
   * @memberOf SensorComponent
   */
  private async listenSocket(): Promise<void> {
    this.socket.on('sensor', (data: Sensor) => {
      this.sensorsList.forEach((sensor) => {
        console.log(sensor);
        if (sensor.id === data.id) {
          sensor.temperature = data.temperature;
        }
      });
    });
  }
}
