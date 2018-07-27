"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Bleno = require("bleno"); //import bleno
let ServiceUUID; //service UUID
let Sensor01UUID; //sensor 01 UUID
let LightUUID; //light 01 UUID
//create a new class of  Characteristic for device extending Characteristic of bleno
class BluetoothController {
    //class initialize
    constructor(deviceName, serviceUUID, sensor01UUID, lightUUID) {
        this.isAdvertising = false;
        this.deviceName = deviceName; //save device name
        ServiceUUID = serviceUUID; //savve service UUID
        Sensor01UUID = sensor01UUID;
        LightUUID = lightUUID;
        console.log('start ble');
        this.bleControl(); //execute bleControl()
    }
    //if exit
    dispose(callback) {
        if (this.isAdvertising) {
            Bleno.stopAdvertising(callback); //stop advertising
        }
        else {
            callback();
        }
    }
    onWriteRequest(data) {
        console.log('data write ' + data.toString());
    }
    bleControl() {
        //ble open
        Bleno.on('stateChange', (state) => {
            console.log('bluetooth', `stateChange: ${state}, address = ${Bleno.address}`);
            if (state === 'poweredOn') {
                Bleno.startAdvertising(this.deviceName, [ServiceUUID]); //start to advertise
            }
            else {
                Bleno.stopAdvertising(); //ble fail, stop to advertise
            }
        });
        //connecting event
        Bleno.on('accept', (clientAddress) => {
            console.log('bluetooth', `accept, client: ${clientAddress}`); //show client's information
            Bleno.updateRssi(); //triggle RSSI update event
        });
        //disconnect event
        Bleno.on('disconnect', (clientAddress) => {
            console.log('bluetooth', `disconnect, client: ${clientAddress}`);
        });
        //RSSI update event
        Bleno.on('rssiUpdate', (rssi) => {
            console.log('bluetooth', `rssiUpdate: ${rssi}`); //show rssi
        });
        Bleno.on('mtuChange', (mtu) => {
            console.log('bluetooth', `mtuChange: ${mtu}`);
        });
        //start advertising event
        Bleno.on('advertisingStart', (error) => {
            console.log('bluetooth', `advertisingStart: ${error ? error : 'success'}`);
            if (!error) {
                this.isAdvertising = true;
                Bleno.setServices([
                    new Bleno.PrimaryService({
                        uuid: ServiceUUID,
                        characteristics: [
                            new LightCharacteristic((data) => {
                                this.onWriteRequest(data);
                            }),
                            new Sensor01Characteristic(),
                        ],
                    }),
                ]);
            }
            else {
                console.log('ble fail');
            }
        });
        Bleno.on('advertisingStop', () => {
            this.isAdvertising = false;
            console.log('bluetooth', 'advertisingStop');
        });
        //setting service sevent
        Bleno.on('servicesSet', (error) => {
            console.log('bluetooth', `servicesSet: ${error ? error : 'success'}`);
        });
    }
    ;
}
exports.BluetoothController = BluetoothController;
class Sensor01Characteristic extends Bleno.Characteristic {
    constructor() {
        super({
            uuid: Sensor01UUID,
            properties: ['read'],
        });
    }
    onReadRequest(offset, callback) {
        try {
            const data = Buffer.from('status ok');
            callback(Bleno.Characteristic.RESULT_SUCCESS, data.slice(offset));
        }
        catch (error) {
            callback(Bleno.Characteristic.RESULT_UNLIKELY_ERROR);
        }
    }
}
class LightCharacteristic extends Bleno.Characteristic {
    constructor(onWriteRequestCb) {
        super({
            uuid: LightUUID,
            properties: ['write'],
        });
        this.callback = onWriteRequestCb;
    }
    onWriteRequest(data, offset, withoutResponse, callback) {
        if (offset > 0) {
            console.log('offset = ' + offset.toString());
            this.callback(data.slice(offset));
        }
        else {
            this.callback(data);
        }
        callback(this.RESULT_SUCCESS);
    }
}
