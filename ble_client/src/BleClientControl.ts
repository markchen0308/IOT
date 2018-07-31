import * as Noble from 'noble';//import noble

let ServiceUUID: string;//service UUID
let Sensor01UUID: string;//sensor 01 UUID
let LightUUID: string;//light 01 UUID

export class BluetoothController {

    peripheral_sensor: Noble.Peripheral = null;
    peripheral_Light: Noble.Peripheral = null;
    charSensor: Noble.Characteristic = null;
    charLight: Noble.Characteristic = null;
    peripheral_sensor_mac: string = 'c2339c3e707c';
    peripheral_light_mac: string = 'ddddd';
    peripheral_sensor_data: string = '';


    constructor(serviceUUID: string, sensor01UUID: string, lightUUID: string) {
        ServiceUUID = serviceUUID;//savve service UUID
        Sensor01UUID = sensor01UUID;
        LightUUID = lightUUID;
        this.bleControl();

    }

    public bleControl() {

        Noble.on('stateChange', state => {
            if (state === 'poweredOn') {
                console.log('Scanning');
                Noble.startScanning([ServiceUUID]);
                //Noble.startScanning();
            } else {
                Noble.stopScanning();
            }
        });


        Noble.on('discover', peripheral => {

            let Mac_Address: string = peripheral.id;

            if (Mac_Address == this.peripheral_sensor_mac) {
                console.log("Found sensor Mac ADDRESS:" + Mac_Address);
                console.log("start to connect");
                this.peripheral_sensor = peripheral;
                this.peripheral_sensor.connect(error => {
                    this.peripheral_sensor.discoverSomeServicesAndCharacteristics(
                        [ServiceUUID],
                        [Sensor01UUID],
                        (error: string, services: Noble.Service[], characteristics: Noble.Characteristic[]) => {
                            this.charSensor = characteristics[0];
                            this.charSensor.subscribe(error => {
                                if (error) {
                                    console.error('Error subscribing to echoCharacteristic');
                                } else {
                                    console.log('Subscribed for echoCharacteristic notifications');
                                }
                            });
                            // data callback receives notifications
                            this.charSensor.on('data', (data, isNotification) => {
                                this.saveSensorData(data);
                            });
                        }
                    );
                });

                this.peripheral_sensor.on('disconnect', () => {
                    console.log('sensor is disconnected');
                    this.peripheral_sensor = null;
                    this.charSensor = null;
                    this.saveSensorData('');
                });
            }

            else if (Mac_Address == this.peripheral_light_mac) {
                console.log("Found Light Mac ADDRESS:" + Mac_Address);
                console.log("start to connect");
                this.peripheral_Light = peripheral;
                this.peripheral_Light.connect(error => {
                    this.peripheral_Light.discoverSomeServicesAndCharacteristics(
                        [ServiceUUID],
                        [LightUUID],
                        (error: string, services: Noble.Service[], characteristics: Noble.Characteristic[]) => {
                            this.charLight = characteristics[0];
                        });
                    
                });

                this.peripheral_Light.on('disconnect', () => {
                    console.log('Light is disconnected');
                    this.peripheral_Light = null;
                    this.charLight = null;
                });
            }
        });
    }

    public saveSensorData(data: string) {
        this.peripheral_sensor_data = data;
    }

    public readSensorData(): string {
        return this.peripheral_sensor_data;
    }

   
    public writeLight(str: string) {
        if (this.charLight != null) {
            let data = new Buffer(str, 'utf-8');
            this.charLight.write(data, true);
        }
    }



}