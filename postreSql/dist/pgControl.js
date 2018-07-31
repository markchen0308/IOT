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
        this.createTableCmd = 'CREATE TABLE IF NOT EXISTS tableSensor(id serial PRIMARY KEY , info JSONB, saveTime timestamp without time zone DEFAULT now())';
        this.insertCmd = 'INSERT INTO tableSensor(info) VALUES($1)';
        this.queryAllCmd = 'SELECT * FROM tableSensor';
        this.queryFirstCmd = 'SELECT * FROM tableSensor ORDER BY id ASC LIMIT 1';
        this.queryLastCmd = 'SELECT * FROM tableSensor ORDER BY id desc LIMIT 1';
        this.delAllCmd = 'DELETE FROM tableSensor';
        this.dropTableCmd = 'DROP TABLE IF EXISTS tableSensor';
        this.saveData = {
            temp: 10,
            humidity: 100,
            light: 1
        };
        this.begin();
    }
    async begin() {
        await this.connectDB();
        if (isDelTable) {
            await this.DelTable();
        }
        await this.createTable();
        await this.writeToDB(21, 50, true);
        //await this.readAllDB();
        await this.readLastDB();
    }
    async connectDB() {
        await this.pgClient.connect();
    }
    async DelTable() {
        await this.pgClient.query(this.dropTableCmd);
    }
    //create table
    async createTable() {
        await this.pgClient.query(this.createTableCmd);
        //  await this.pgClient.end()
    }
    async writeToDB(temp, hum, light) {
        let data = {
            temperature: temp,
            humidity: hum,
            lightStatus: light
        };
        await this.pgClient.query(this.insertCmd, [data]);
    }
    async readAllDB() {
        const res = await this.pgClient.query(this.queryAllCmd);
        res.rows.forEach(row => {
            console.log(row);
        });
    }
    async readFistDB() {
        const res = await this.pgClient.query(this.queryFirstCmd);
        res.rows.forEach(row => {
            console.log(row);
        });
    }
    async readLastDB() {
        const res = await this.pgClient.query(this.queryLastCmd);
        res.rows.forEach(row => {
            console.log(row);
        });
    }
    async delAll() {
        const res = await this.pgClient.query(this.delAllCmd);
    }
}
exports.PgControl = PgControl;
