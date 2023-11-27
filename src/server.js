import express from "express";
import productRoutes from "./routes/productRoutes.js";
import db from "./config/db.js";
import dotenv from "dotenv";
import chalk from "chalk";
import "../src/config/initialize.js";

const app = express();

dotenv.config({
    path: "src/.env",
});

app.use(express.json());

app.set("view engine", "pug");
app.set("views", "./src/views");
app.use(express.static("./src/public"));

db.authenticate()
    .then(() => {
        console.log(chalk.green("============================================================="));
        console.log(chalk.green("Conexión a la base de datos establecida con éxito"));
        console.log(chalk.green("============================================================="));

        return db.sync();
    })
    .then(() => {
        console.log(chalk.green("============================================================="));
        console.log(chalk.green("Se han sincronizado las tablas existentes en la base de datos"));
        console.log(chalk.green("============================================================="));
    })
    .catch((error) => {
        console.error(chalk.red("============================================================="));
        console.error(chalk.red("Error al conectar a la base de datos:", error));
        console.error(chalk.red("============================================================="));
    });

// Iniciar el servicio HTTP
app.listen(process.env.SERVER_PORT, () => {
    console.log(chalk.green("=========================[DATA BASE]========================="));
    console.log(chalk.green("El servicio HTTP ha sido iniciado"));
    console.log(chalk.green("============================================================="));
    console.log(chalk.green(`El servicio está escuchando en el puerto: ${process.env.SERVER_PORT}`));
    console.log(chalk.green("============================================================="));
});

app.use("/", productRoutes);
