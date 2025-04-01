import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { connect } from "./database/connection";
import routes from "./routes";

dotenv.config();

const PORT = process.env.PORT || 3000;

const app = express();

app.use(express.json());

app.use(cors());

connect();

app.listen(PORT, () => {
    console.log(`Rodando na porta ${PORT}...`);
});

app.use(routes);