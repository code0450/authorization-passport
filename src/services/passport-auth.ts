import { Strategy } from "passport-local";
import bcrypt from "bcrypt";
import passport from "passport"
import { Database } from "../modules/database";


export class PassportAuth {
    private static instance: PassportAuth;

    private constructor() {}

    public static getInstance(): PassportAuth {
        if(!PassportAuth.instance) {
            PassportAuth.instance = new PassportAuth();
        }

        return PassportAuth.instance;
    }

    set() {
        passport.use(new Strategy(async (username, password, cb) => {
            try {
                
                const db = Database.getInstance().getClient();
                const user = await db.db("users").collection("loginInfo").findOne({
                    username: username
                });
                if(!user) {
                    return cb(null, false, {message: 'Incorrect username or password.'})
                }

                const isCorrectPassword = await bcrypt.compare(password, user.password);
                if(isCorrectPassword) {
                    return cb(null, user);
                } else {
                    return cb(null, false, { message: 'Incorrect username or password.' });
                }

            } catch (error) {
                return cb(error);
            }

        }));

        passport.serializeUser((user, cb) => {
            process.nextTick(() => {
                cb(null, {id: user.id, username: user.username})
            })
        })

        passport.deserializeUser((user, cb) => {
            process.nextTick(() => {
                return cb(null, user);
            })
        })
    }
}