import express from 'express';
import bcrypt from "bcrypt";
import passport from "passport"
import * as EmailValidator from "email-validator";
import { Database } from '../modules/database';

export class AuthRouter {
    public router;
    private db;

    constructor() {
        this.db = Database.getInstance().getClient();
        this.router = express.Router();

        this.router.post('/login', passport.authenticate('local', {
                successRedirect: '/',
                failureMessage: true
            })
        );

        this.router.get('/login', async (req: express.Request, res: express.Response) => {
            res.json("Unsuccessful! Try to Log In");
        });

        this.router.post('/logout', async (req: express.Request, res: express.Response) => {
            req.logout();
            res.json("Logged out");
        });

        this.router.post('/register', async (req: express.Request, res: express.Response) => {
            try {
                const hashedPassword = await bcrypt.hash(req.body.password, 12);
                const isDuplicate = await this.db.db("users").collection("loginInfo").countDocuments({
                    username: req.body.username
                }, { limit: 1 });

                if (EmailValidator.validate(req.body.email) && !isDuplicate) {

                    await this.db.db("users").collection("loginInfo").insertOne({
                        date: Date.now().toString(),
                        username: req.body.username,
                        email: req.body.email,
                        password: hashedPassword
                    });
                    res.json("Created. Can login now");
                } else {
                    res.status(406).json("Invalid email or login");
                }

            } catch (error: any) {
                throw new Error(error.message)
            }
        })
    }
}