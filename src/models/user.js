import { DataTypes } from "sequelize";
import db from "../config/db.js";

import bcrypt from "bcrypt";

const User = db.define(
    "users",
    {
        name: {
            type: DataTypes.STRING,
            allowNull: false,
        },

        email: {
            type: DataTypes.STRING,
            unique: true,
            allowNull: false,
        },

        address: {
            type: DataTypes.STRING,
            allowNull: false,
        },

        password: {
            type: DataTypes.STRING,
            allowNull: false,
        },

        token: {
            type: DataTypes.STRING,
            unique: true,
            defaultValue: "",
        },
        verified: {
            type: DataTypes.BOOLEAN,
            defaultValue: false,
        },
    },
    {
        hooks: {
            beforeCreate: async (user) => {
                const salt = await bcrypt.genSalt(10);
                user.password = await bcrypt.hash(user.password, salt);
            },
        },
        scopes: {
            deletePassword: {
                attributes: {
                    exclude: ["password", "token", "verified", "createdAt", "updatedAt"],
                },
            },
        },
    }
);

User.prototype.verifyPassword = function (password) {
    return bcrypt.compareSync(password, this.password);
};

export default User;
