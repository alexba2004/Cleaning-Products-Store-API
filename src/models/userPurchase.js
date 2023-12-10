// models/UserPurchase.js
import { DataTypes } from "sequelize";
import db from "../config/db.js";

const UserPurchase = db.define(
    "UserPurchase",
    {
        totalPayment: {
            type: DataTypes.DECIMAL(10, 2),
            allowNull: false,
        },
        description: {
            type: DataTypes.STRING, // O el tipo de datos que prefieras para la descripción
            allowNull: true, // Puedes ajustar esto según tus requisitos
        },
        purchaseIdentifier: {
            type: DataTypes.STRING, // Puedes ajustar el tipo de datos según tus necesidades
            allowNull: false,
            unique: true, // Esto asegura que no haya identificadores duplicados
        },
    },
    {
        timestamps: true,
    }
);

export default UserPurchase;
