"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const pg_1 = require("pg");
let isDelTable = false;
class PgControl {
    constructor() {
        this.pgClient = new pg_1.Client({
            user: 'postgres',
            host: 'localhost',
            database: 'iot',
            password: 'postgres',
            port: 5432,
        });
        this.createTableCmd = 'CREATE TABLE IF NOT EXISTS tableSensor(id serial PRIMARY KEY , info JSONB, saveTime timestamp WITH TIME ZONE DEFAULT now())';
        this.insertCmd = 'INSERT INTO tableSensor(info) VALUES($1)';
        this.queryAllCmd = 'SELECT * FROM tableSensor';
        this.queryFirstCmd = 'SELECT * FROM tableSensor ORDER BY id ASC LIMIT 1';
        this.queryLastCmd = 'SELECT * FROM tableSensor ORDER BY id desc LIMIT 1';
        this.delAllCmd = 'DELETE FROM tableSensor';
        this.dropTableCmd = 'DROP TABLE IF EXISTS tableSensor';
        // this.begin();
    }
    //create table
    async begin() {
        await this.pgClient.connect();
        ;
        if (isDelTable) {
            await this.DelTable();
        }
        await this.createTable();
        return new Promise((resolve, reject) => {
            resolve();
            console.log('table check ok');
        });
    }
    //delete table
    async DelTable() {
        await this.pgClient.query(this.dropTableCmd);
        return new Promise((resolve, reject) => {
            resolve();
        });
    }
    //create table
    async createTable() {
        await this.pgClient.query(this.createTableCmd);
        return new Promise((resolve, reject) => {
            resolve();
        });
    }
    async writeToDB(temp, hum, light) {
        let data = {
            temperature: temp,
            humidity: hum,
            lightStatus: light
        };
        await this.pgClient.query(this.insertCmd, [data]);
        return new Promise((resolve, reject) => {
            resolve();
        });
    }
    async readAllDB() {
        const res = await this.pgClient.query(this.queryAllCmd);
        /*
        res.rows.forEach(row => {
            console.log('id=');
            console.log(row.id);
            console.log('info=');
            console.log(row.info);
            console.log('savetime=');
            console.log((new Date(row.savetime)).toLocaleString('zh-tw'));
        });
        */
        return new Promise((resolve, reject) => {
            if (res.rows.length > 0) {
                resolve(res.rows);
            }
            else {
                reject([]);
            }
        });
    }
    async readFistDB() {
        const res = await this.pgClient.query(this.queryFirstCmd);
        /*
        res.rows.forEach(row => {
            console.log('id=');
            console.log(row.id);
            console.log('info=');
            console.log(row.info);
            console.log('savetime=');
            console.log((new Date(row.savetime)).toLocaleString('zh-tw'));
        });
        */
        return new Promise((resolve, reject) => {
            if (res.rows.length > 0) {
                resolve(res.rows);
            }
            else {
                reject([]);
            }
        });
    }
    async readLastDB() {
        const res = await this.pgClient.query(this.queryLastCmd);
        /*
        res.rows.forEach(row => {
            console.log('id=');
            console.log(row.id);
            console.log('info=');
            console.log(row.info);
            console.log('savetime=');
            console.log((new Date(row.savetime)).toLocaleString('zh-tw'));
        });
*/
        return new Promise((resolve, reject) => {
            if (res.rows.length > 0) {
                resolve(res.rows);
            }
            else {
                reject([]);
            }
        });
    }
    async delAll() {
        const res = await this.pgClient.query(this.delAllCmd);
        return new Promise((resolve, reject) => {
            resolve();
        });
    }
}
exports.PgControl = PgControl;
