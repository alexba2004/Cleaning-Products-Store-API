// models/Product.js
import { DataTypes } from "sequelize";
import db from "../config/db.js";

const Product = db.define(
    "Product",
    {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
        },
        productName: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        productDescription: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        price: {
            type: DataTypes.DECIMAL(10, 2),
            allowNull: false,
        },
        status: {
            type: DataTypes.BOOLEAN,
            defaultValue: true,
        },
        productImage: {
            type: DataTypes.STRING, // Puedes almacenar la ruta a la imagen
        },
    },
    {
        timestamps: true,
    }
);

export default Product;
