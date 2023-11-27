// models/UserPurchase.js
import { DataTypes } from "sequelize";
import db from "../config/db.js";

const UserPurchase = db.define(
    "UserPurchase",
    {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
        },
        totalPayment: {
            type: DataTypes.DECIMAL(10, 2),
            allowNull: false,
        },
    },
    {
        timestamps: true,
    }
);

export default UserPurchase;
