import chalk from "chalk";
import bd from "./db.js";
import User from "../models/user.js";
import Product from "../models/product.js";
import ShoppingCart from "../models/shoppingCart.js";
import UserPurchase from "../models/userPurchase.js";
import { User as UserModel, Product as ProductModel, ShoppingCart as ShoppingCartModel, UserPurchase as UserPurchaseModel } from "../models/relationships.js";

const initializeApp = async () => {
    try {
        // Prueba de conexión a la base de datos
        await bd.authenticate();
        console.log(chalk.green("============================================================="));
        console.log(chalk.green("Conexión a la base de datos establecida con éxito."));
        console.log(chalk.green("============================================================="));

        // Verifica si la base de datos está vacía
        const tables = await bd.query(`SELECT TABLE_NAME FROM INFORMATION_SCHEMA.TABLES WHERE TABLE_TYPE = 'BASE TABLE' AND TABLE_SCHEMA = '${bd.config.database}'`, { type: bd.QueryTypes.SELECT });

        if (tables && tables.length === 0) {
            // La base de datos está vacía, crea las tablas
            await User.sync();
            await Product.sync();
            await ShoppingCart.sync();
            await UserPurchase.sync();

            // Set up relationships
            UserModel.hasMany(ShoppingCartModel, { foreignKey: "UserId" });
            ShoppingCartModel.belongsTo(UserModel, { foreignKey: "UserId" });

            ProductModel.belongsToMany(ShoppingCartModel, { through: "ProductShoppingCart" });
            ShoppingCartModel.belongsToMany(ProductModel, { through: "ProductShoppingCart" });

            UserPurchaseModel.belongsTo(UserModel);
            UserModel.hasMany(UserPurchaseModel);

            UserPurchaseModel.belongsToMany(ShoppingCartModel, { through: "UserPurchaseShoppingCart" });
            ShoppingCartModel.belongsToMany(UserPurchaseModel, { through: "UserPurchaseShoppingCart" });

            console.log(chalk.green("============================================================="));
            console.log(chalk.green("Tablas y relaciones creadas correctamente."));
            console.log(chalk.green("============================================================="));
        } else {
            console.log(chalk.green("============================================================="));
            console.log(chalk.green("La base de datos ya contiene tablas. No se realizaron cambios."));
            console.log(chalk.green("============================================================="));
        }
    } catch (error) {
        console.error("Error al verificar o crear tablas:", error);
    } finally {
        try {
            console.log(chalk.green("============================================================="));
            console.log(chalk.green("Conexión cerrada correctamente."));
            console.log(chalk.green("============================================================="));
        } catch (closeError) {
            console.log(chalk.red("============================================================="));
            console.error(chalk.red("Error al cerrar la conexión:", closeError));
            console.log(chalk.red("============================================================="));
        }
    }
};

// Llama a la función de inicialización
initializeApp();
export default initializeApp;
