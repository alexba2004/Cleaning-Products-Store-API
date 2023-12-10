// models/ShoppingCart.js
import { DataTypes } from "sequelize";
import db from "../config/db.js";

const ShoppingCart = db.define(
    "ShoppingCart",
    {
        quantity: {
            type: DataTypes.INTEGER,
            allowNull: false,
            defaultValue: 1,
        },
        subtotal: {
            type: DataTypes.DECIMAL(10, 2),
            allowNull: false,
        },
    },
    {
        timestamps: true,
    }
);

export default ShoppingCart;
