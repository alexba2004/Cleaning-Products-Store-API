import User from "./user.js";
import Product from "./product.js";
import ShoppingCart from "./shoppingCart.js";
import UserPurchase from "./userPurchase.js";

User.hasMany(ShoppingCart, { foreignKey: "UserId", onDelete: "CASCADE" });
User.hasMany(UserPurchase, { foreignKey: "UserId", onDelete: "CASCADE" });

ShoppingCart.belongsTo(User, { foreignKey: "UserId", onDelete: "CASCADE" });
ShoppingCart.belongsTo(Product, { foreignKey: "ProductId", onDelete: "CASCADE" });

UserPurchase.belongsTo(User, { foreignKey: "UserId", onDelete: "CASCADE" });

export { User, Product, ShoppingCart, UserPurchase };
