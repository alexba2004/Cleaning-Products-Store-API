import { exit } from "node:process";
import User from "../../models/user.js";
import Product from "../../models/product.js";
import ShoppingCart from "../../models/shoppingCart.js";
import UserPurchase from "../../models/userPurchase.js";
import productsData from "./productSeed.js";
import usersData from "./userSeed.js";
import db from "../../config/db.js";
import chalk from "chalk";

const importData = async () => {
    try {
        await db.authenticate();
        await db.sync();
        await Promise.all(await Product.bulkCreate(productsData), await User.bulkCreate(usersData));
        console.log(chalk.green("=====================================================================\nSe han importado los datos de las tablas catalogo de manera correcta\n====================================================================="));
        exit();
    } catch (error) {
        console.log(chalk.red(`=====================================================================\n${error}\n=====================================================================`));
        exit(1);
    }
};

if (process.argv[2] === "-i") {
    importData();
}
