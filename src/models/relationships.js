import User from "./user.js";
import Product from "./product.js";
import ShoppingCart from "./shoppingCart.js";
import UserPurchase from "./userPurchase.js";

User.hasMany(ShoppingCart, { foreignKey: "UserId" });
ShoppingCart.belongsTo(User, { foreignKey: "UserId" });

Product.belongsToMany(ShoppingCart, { through: "ProductShoppingCart" });
ShoppingCart.belongsToMany(Product, { through: "ProductShoppingCart" });

UserPurchase.belongsTo(User);
User.hasMany(UserPurchase);

UserPurchase.belongsToMany(ShoppingCart, { through: "UserPurchaseShoppingCart" });
ShoppingCart.belongsToMany(UserPurchase, { through: "UserPurchaseShoppingCart" });

export { User, Product, ShoppingCart, UserPurchase };
