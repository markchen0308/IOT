"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Noble = require("noble"); //import noble
let ServiceUUID; //service UUID
let Sensor01UUID; //sensor 01 UUID
let LightUUID; //light 01 UUID
class BluetoothController {
    constructor(serviceUUID, sensor01UUID, lightUUID) {
        ServiceUUID = serviceUUID; //savve service UUID
        Sensor01UUID = sensor01UUID;
        LightUUID = lightUUID;
        this.bleControl();
    }
    bleControl() {
        Noble.on('stateChange', state => {
            if (state === 'poweredOn') {
                console.log('Scanning');
                // Noble.startScanning([ServiceUUID]);
                Noble.startScanning();
            }
            else {
                Noble.stopScanning();
            }
        });
        Noble.on('discover', peripheral => {
            // connect to the first peripheral that is scanned
            let address = peripheral.id;
            let x = peripheral.advertisement;
            // let serviceUuid=peripheral.id;
            //let serviceUuid=peripheral.advertisement.serviceData;
            console.log(address);
            Noble.startScanning();
            // console.log(serviceUuid)
            // console.log('Connecting to name ' '${name}' ${peripheral.id}`);
            //connectAndSetUp(peripheral);
        });
    }
    connectAndSetUp(peripheral) {
        peripheral.connect(error => {
            console.log('Connected to', peripheral.id);
            // specify the services and characteristics to discover
            //const serviceUUIDs = [ECHO_SERVICE_UUID];
            // const characteristicUUIDs = [ECHO_CHARACTERISTIC_UUID];
            peripheral.discoverSomeServicesAndCharacteristics(
            //  serviceUUIDs,
            //   characteristicUUIDs,
            //   onServicesAndCharacteristicsDiscovered
            );
        });
        peripheral.on('disconnect', () => console.log('disconnected'));
    }
    onServicesAndCharacteristicsDiscovered(error, services, characteristics) {
        console.log('Discovered services and characteristics');
        const echoCharacteristic = characteristics[0];
        // data callback receives notifications
        echoCharacteristic.on('data', (data, isNotification) => {
            console.log('Received: "' + data + '"');
        });
        // subscribe to be notified whenever the peripheral update the characteristic
        echoCharacteristic.subscribe(error => {
            if (error) {
                console.error('Error subscribing to echoCharacteristic');
            }
            else {
                console.log('Subscribed for echoCharacteristic notifications');
            }
        });
        // create an interval to send data to the service
        let count = 0;
        setInterval(() => {
            count++;
            const message = new Buffer('hello, ble ' + count, 'utf-8');
            console.log("Sending:  '" + message + "'");
            echoCharacteristic.write(message);
        }, 2500);
    }
}
exports.BluetoothController = BluetoothController;
