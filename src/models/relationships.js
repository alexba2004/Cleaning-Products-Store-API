import User from "./user.js";
import Product from "./product.js";
import ShoppingCart from "./shoppingCart.js";
import UserPurchase from "./userPurchase.js";

User.hasOne(ShoppingCart, { foreignKey: "UserId" });
ShoppingCart.belongsTo(User, { foreignKey: "UserId" });

ShoppingCart.belongsTo(Product, { foreignKey: "ProductId" });
Product.hasMany(ShoppingCart, { foreignKey: "ProductId" });

UserPurchase.belongsTo(User, { foreignKey: "UserId" });
User.hasMany(UserPurchase, { foreignKey: "UserId" });

export { User, Product, ShoppingCart, UserPurchase };
