// models/ShoppingCart.js
import { DataTypes } from "sequelize";
import db from "../config/db.js";

const ShoppingCart = db.define(
    "ShoppingCart",
    {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
        },
        quantity: {
            type: DataTypes.INTEGER,
            allowNull: false,
            defaultValue: 1,
        },
        subtotal: {
            type: DataTypes.DECIMAL(10, 2),
            allowNull: false,
        },
        UserId: {
            type: DataTypes.INTEGER, // Ajusta el tipo de datos según tu modelo de usuario
            allowNull: false,
        },
        ProductId: {
            type: DataTypes.INTEGER, // Ajusta el tipo de datos según tu modelo de producto
            allowNull: false,
        },
    },
    {
        timestamps: true,
    }
);

export default ShoppingCart;
