"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Noble = require("noble"); //import noble
let ServiceUUID; //service UUID
let Sensor01UUID; //sensor 01 UUID
let LightUUID; //light 01 UUID
class BluetoothController {
    constructor(serviceUUID, sensor01UUID, lightUUID) {
        this.peripheral_sensor_TH = null;
        this.peripheral_sensor_pir = null;
        this.peripheral_Light = null;
        this.charSensorTH = null; //Characteristic of temperature and humidity sensor
        this.charSensorPir = null; //Characteristic of PIR sensor
        this.charLight = null; ////Characteristic of Light 
        this.peripheral_sensor_TH_mac = 'c2339c3e707c'; //mac address of temperature and humidity sensor
        this.peripheral_sensor_pir_mac = 'c04c0feb4f9e'; //mac address of PIR sensor
        this.peripheral_light_mac = 'ddddd';
        this.peripheral_TH_sensor_data = ''; //temperature and humidity sensor data
        this.peripheral_pir_sensor_data = ''; //pri sensor data
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
            if (Mac_Address == this.peripheral_sensor_TH_mac) //get temperature and humidity address
             {
                console.log("Found sensor Mac ADDRESS:" + Mac_Address);
                console.log("start to connect");
                this.peripheral_sensor_TH = peripheral;
                this.peripheral_sensor_TH.connect(error => {
                    this.peripheral_sensor_TH.discoverSomeServicesAndCharacteristics([ServiceUUID], [Sensor01UUID], (error, services, characteristics) => {
                        this.charSensorTH = characteristics[0]; //save first  characteristics
                        this.charSensorTH.subscribe(error => {
                            if (error) {
                                console.error('Error subscribing to Characteristic of TH sensor');
                            }
                            else {
                                console.log('Subscribed for Characteristic of TH sensor notifications');
                            }
                        });
                        // data callback receives notifications
                        this.charSensorTH.on('data', (data, isNotification) => {
                            this.saveTHSensorData(data); //save sensor data
                        });
                    });
                });
                //listen to disconnection event 
                this.peripheral_sensor_TH.on('disconnect', () => {
                    console.log('TH sensor is disconnected');
                    this.peripheral_sensor_TH = null;
                    this.charSensorTH = null;
                    this.saveTHSensorData('');
                });
            }
            else if (Mac_Address == this.peripheral_sensor_pir_mac) //get pir address
             {
                console.log("Found PIR sensor Mac ADDRESS:" + Mac_Address);
                console.log("start to connect");
                this.peripheral_sensor_pir = peripheral;
                this.peripheral_sensor_pir.connect(error => {
                    this.peripheral_sensor_pir.discoverSomeServicesAndCharacteristics([ServiceUUID], [Sensor01UUID], (error, services, characteristics) => {
                        this.charSensorPir = characteristics[0];
                        this.charSensorPir.subscribe(error => {
                            if (error) {
                                console.error('Error subscribing to Characteristic of PIR');
                            }
                            else {
                                console.log('Subscribed for Characteristic of PIR notifications');
                            }
                        });
                        // data callback receives notifications
                        this.charSensorPir.on('data', (data, isNotification) => {
                            this.savePirSensorData(data);
                        });
                    });
                });
                //listen to disconnection event 
                this.peripheral_sensor_pir.on('disconnect', () => {
                    console.log('PIR sensor is disconnected');
                    this.peripheral_sensor_pir = null;
                    this.charSensorPir = null;
                    this.savePirSensorData(''); //save sensor data
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
    //save temperature and humidity sensor data
    saveTHSensorData(data) {
        this.peripheral_TH_sensor_data = data;
    }
    //save PIR sensor data
    savePirSensorData(data) {
        this.peripheral_pir_sensor_data = data;
    }
    // read temperature and humidity sensor data
    readTHSensorData() {
        return this.peripheral_TH_sensor_data;
    }
    //read pir sensor data
    readPIRSensorData() {
        return this.peripheral_pir_sensor_data;
    }
    //write data to light
    writeLight(str) {
        if (this.charLight != null) {
            let data = new Buffer(str, 'utf-8');
            this.charLight.write(data, true);
        }
    }
}
exports.BluetoothController = BluetoothController;
