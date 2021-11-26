import dotenv from "dotenv"
import { Server } from "./modules/server";
import { Database } from "./modules/database";

dotenv.config();
Database.getInstance().start();
new Server().start();