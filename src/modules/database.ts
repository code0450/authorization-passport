import { MongoClient } from "mongodb";

export class Database {
    private client;
    private static instance: Database;


    private constructor() {
        this.client = new MongoClient(process.env.DB_URI as string);
    }

    public static getInstance(): Database {
        if(!Database.instance) {
            Database.instance = new Database();
        }

        return Database.instance;
    }

    async start() {
        try {

            await this.client.connect();
            console.log('Database connected');

        } catch (error: any) {

            console.log(error)

        } 
    }

    getClient() {
        return this.client;
    }
}