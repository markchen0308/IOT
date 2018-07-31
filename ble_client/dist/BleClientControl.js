"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Noble = require("noble"); //import noble
let ServiceUUID; //service UUID
let Sensor01UUID; //sensor 01 UUID
let LightUUID; //light 01 UUID
class BluetoothController {
    constructor(serviceUUID, sensor01UUID, lightUUID) {
        this.peripheral_sensor = null;
        this.peripheral_Light = null;
        this.charSensor = null;
        this.charLight = null;
        this.peripheral_sensor_mac = 'c2339c3e707c';
        this.peripheral_light_mac = 'ddddd';
        this.peripheral_sensor_data = '';
        ServiceUUID = serviceUUID; //savve service UUID
        Sensor01UUID = sensor01UUID;
        LightUUID = lightUUID;
        this.bleControl();
    }
    bleControl() {
        Noble.on('stateChange', state => {
            if (state === 'poweredOn') {
                console.log('Scanning');
                Noble.startScanning([ServiceUUID]);
                //Noble.startScanning();
            }
            else {
                Noble.stopScanning();
            }
        });
        Noble.on('discover', peripheral => {
            let Mac_Address = peripheral.id;
            if (Mac_Address == this.peripheral_sensor_mac) {
                console.log("Found sensor Mac ADDRESS:" + Mac_Address);
                console.log("start to connect");
                this.peripheral_sensor = peripheral;
                this.peripheral_sensor.connect(error => {
                    this.peripheral_sensor.discoverSomeServicesAndCharacteristics([ServiceUUID], [Sensor01UUID], (error, services, characteristics) => {
                        this.charSensor = characteristics[0];
                        this.charSensor.subscribe(error => {
                            if (error) {
                                console.error('Error subscribing to echoCharacteristic');
                            }
                            else {
                                console.log('Subscribed for echoCharacteristic notifications');
                            }
                        });
                        // data callback receives notifications
                        this.charSensor.on('data', (data, isNotification) => {
                            this.saveSensorData(data);
                        });
                    });
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
                    this.peripheral_Light.discoverSomeServicesAndCharacteristics([ServiceUUID], [LightUUID], (error, services, characteristics) => {
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
    saveSensorData(data) {
        this.peripheral_sensor_data = data;
    }
    readSensorData() {
        return this.peripheral_sensor_data;
    }
    writeLight(str) {
        if (this.charLight != null) {
            let data = new Buffer(str, 'utf-8');
            this.charLight.write(data, true);
        }
    }
}
exports.BluetoothController = BluetoothController;
