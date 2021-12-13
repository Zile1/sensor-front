interface Sensor {
  id: number;
  temperature: number;
}

interface Sensors {
  sensors: Sensor[];
}

export { Sensor, Sensors }
