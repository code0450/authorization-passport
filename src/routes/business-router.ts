import express from 'express';
import { Database } from '../modules/database';
import { authCheck } from "./auth-check";


export class BusinessRouter {
    private db;
    public router;

    constructor() {
        this.db = Database.getInstance().getClient();
        this.router = express.Router();


        this.router.post('/', authCheck, async (req: express.Request, res: express.Response) => {
            try {
                await this.db.db("userQuotes").collection("setOne").insertOne({
                    name: req.body.name,
                    quote: req.body.quote
                });
                res.json("Success");
            } catch (error: any) {
                throw new Error(error.message)
            }
        });

        this.router.get('/', authCheck, async (req: express.Request, res: express.Response) => {
            try {
                const result = await this.db.db("userQuotes").collection("setOne").find().toArray();
                res.json(result);
            } catch (error: any) {
                throw new Error(error.message)
            }
        });

        this.router.put('/', authCheck, async (req: express.Request, res: express.Response) => {
            try {
                await this.db.db("userQuotes").collection("setOne").updateOne({
                    name: req.body.name,
                }, {
                    $set: { quote: req.body.quote }
                });

                res.json("Success");
            } catch (error: any) {
                throw new Error(error.message)
            }
        });

        this.router.delete('/', authCheck, async (req: express.Request, res: express.Response) => {
            try {
                await this.db.db("userQuotes").collection("setOne").deleteOne({
                    name: req.body.name,
                    quote: req.body.quote
                });

                res.json("Success");
            } catch (error: any) {
                throw new Error(error.message)
            }
        });
    }
}