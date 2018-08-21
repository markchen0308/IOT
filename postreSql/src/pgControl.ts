import { Client, QueryResult } from 'pg'
import { promises } from 'fs';


let isDelTable: boolean = false;

export class PgControl {


    pgClient = new Client({
        user: 'postgres',
        host: 'localhost',//127.0.0.1
        database: 'iot',
        password: 'postgres',
        port: 5432,
    })



    createTableCmd: string = 'CREATE TABLE IF NOT EXISTS tableSensor(id serial PRIMARY KEY , info JSONB, saveTime timestamp WITH TIME ZONE DEFAULT now())';
    insertCmd: string = 'INSERT INTO tableSensor(info) VALUES($1)';
    queryAllCmd: string = 'SELECT * FROM tableSensor';
    queryFirstCmd: string = 'SELECT * FROM tableSensor ORDER BY id ASC LIMIT 1';
    queryLastCmd: string = 'SELECT * FROM tableSensor ORDER BY id desc LIMIT 1';
    delAllCmd: string = 'DELETE FROM tableSensor';
    dropTableCmd: string = 'DROP TABLE IF EXISTS tableSensor'




    constructor() {

        // this.begin();
    }
    
    //create table
    async begin(): Promise<void> {
        await this.pgClient.connect();;
        if (isDelTable) {
            await this.DelTable();
        }
        await this. createTable();
        return new Promise<void>((resolve, reject) => {
            resolve();
            console.log('table check ok');
        });

    }


    //delete table
    async DelTable(): Promise<void> {
        await this.pgClient.query(this.dropTableCmd);
        return new Promise<void>((resolve, reject) => {
            resolve();
        });

    }
    //create table
    async createTable(): Promise<void> {

        await this.pgClient.query(this.createTableCmd);
        return new Promise<void>((resolve, reject) => {
            resolve();
        });
    }

    async writeToDB(temp: number, hum: number, light: boolean): Promise<void> {

        let data = {
            temperature: temp,
            humidity: hum,
            lightStatus: light
        }

        await this.pgClient.query(this.insertCmd, [data]);
        return new Promise<void>((resolve, reject) => {
            resolve();
        });

    }

    async  readAllDB(): Promise<any[]> {
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
        return new Promise<any[]>((resolve, reject) => {
            if (res.rows.length > 0) {
                resolve(res.rows)
            }
            else {
                reject([])
            }
        });
    }


    async readFistDB(): Promise<any[]> {
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
        return new Promise<any[]>((resolve, reject) => {
            if (res.rows.length > 0) {
                resolve(res.rows)
            }
            else {
                reject([])
            }
        });
    }

    async readLastDB(): Promise<any[]> {
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
        return new Promise<any[]>((resolve, reject) => {
            if (res.rows.length > 0) {
                resolve(res.rows)
            }
            else {
                reject([])
            }
        });


    }

    async delAll(): Promise<void> {
        const res = await this.pgClient.query(this.delAllCmd);
        return new Promise<void>((resolve, reject) => {
            resolve();
        });
    }

}


