import express from "express";
import session from "express-session";
import passport from "passport";
import { PassportAuth } from "../services/passport-auth";
import { BusinessRouter } from "../routes/business-router";
import { AuthRouter } from "../routes/auth-router";


export class Server {
    private server;

    start() {
        this.server = express();

        PassportAuth.getInstance().set();

        this.server.use(express.json());
        this.server.use(session({secret: process.env.SESSION_SECRET, resave: true, saveUninitialized: false}))
        this.server.use(passport.initialize());
        this.server.use(passport.session());

        this.server.use(new BusinessRouter().router);
        this.server.use(new AuthRouter().router);

        this.server.listen(
            process.env.PORT,
            () => console.log(`Server running on http://localhost:${process.env.PORT}`)
        )
    }
}