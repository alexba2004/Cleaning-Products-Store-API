import Product from "../models/product.js";
import ShoppingCart from "../models/shoppingCart.js";
import jsonWebToken from "jsonwebtoken";

const productHome = async (req, res) => {
    const userId = getUserIdFromToken(req);
    res.render("products/product-home.pug", {
        page: "Home",
        showHeader: true,
        showFooter: true,
        data: req.body,
        userId,
    });
};

const productSale = async (req, res) => {
    try {
        // Obtiene todos los productos de la base de datos
        const products = await Product.findAll({ where: { status: true } });

        const userId = getUserIdFromToken(req);

        // Renderiza la vista y pasa los productos como variable
        res.render("products/product-sale.pug", {
            page: "Sale",
            showHeader: true,
            showFooter: true,
            data: req.body,
            products, // Pasa los productos a la vista
            userId,
        });
    } catch (error) {
        console.error("Error al obtener productos:", error);
        res.status(500).send("Error interno del servidor");
    }
};

const addShoppingCart = async (req, res) => {
    try {
        const userId = getUserIdFromToken(req);
        const { productId, quantity } = req.body;

        // Verifica que userId y productId estén presentes en la solicitud
        if (!userId || !productId || !quantity) {
            return res.status(400).json({ success: false, error: "userId, productId, and quantity are required" });
        }

        // Buscar el producto en la base de datos para obtener su precio
        const product = await Product.findByPk(productId);

        if (!product) {
            return res.status(404).json({ success: false, error: "Product not found" });
        }

        // Calcular el subtotal en el servidor
        const subtotal = product.price * quantity;

        // Buscar el producto en el carrito del usuario
        const cartItem = await ShoppingCart.findOne({
            where: {
                UserId: userId,
                ProductId: productId,
            },
        });

        if (cartItem) {
            // Si el producto ya está en el carrito, actualiza la cantidad y recalcula el subtotal
            cartItem.quantity = quantity;
            cartItem.subtotal = product.price * cartItem.quantity;
            await cartItem.save();
        } else {
            // Si el producto no está en el carrito, crea un nuevo registro
            await ShoppingCart.create({
                UserId: userId,
                ProductId: productId,
                quantity,
                subtotal,
            });
        }

        res.json({ success: true });
    } catch (error) {
        console.error("Error al agregar al carrito:", error);

        res.status(500).json({ success: false, error: "Internal server error" });
    }
};

const shoppingCart = async (req, res) => {
    try {
        // Obtén el ID del usuario desde el token
        const userId = getUserIdFromToken(req);

        // Obtén los datos del carrito de compras para el usuario desde la base de datos
        const shoppingCartItems = await ShoppingCart.findAll({
            include: [
                {
                    model: Product,
                },
            ],
            where: {
                UserId: userId,
            },
        });

        // Renderiza la vista y pasa los datos del carrito de compras como variable
        res.render("products/shopping-cart.pug", {
            page: "Shopping Cart",
            showHeader: true,
            showFooter: true,
            shoppingCartItems, // Pasa los datos del carrito de compras a la vista
        });
    } catch (error) {
        console.error("Error al obtener el carrito de compras:", error);
        res.status(500).send("Error interno del servidor");
    }
};

const deleteProduct = async (req, res) => {
    const productId = req.params.productId;

    try {
        // Elimina el producto del carrito en la base de datos
        await ShoppingCart.destroy({
            where: {
                ProductId: productId,
            },
        });

        return res.json({ success: true });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ success: false, error: "Error al eliminar el producto." });
    }
};

const getUserIdFromToken = (req) => {
    const token = req.cookies._token;
    if (!token) {
        return null; // O manejar el error de alguna manera
    }

    try {
        const decoded = jsonWebToken.verify(token, process.env.JWT_SECRET_HASH_STRING);
        return decoded.userID;
    } catch (error) {
        console.error("Error al decodificar el token:", error);
        return null; // O manejar el error de alguna manera
    }
};

async function calculateTotal(req, res) {
    try {
        const userId = getUserIdFromToken(req);

        const shoppingCartItems = await ShoppingCart.findAll({
            attributes: ["subtotal"], // Solo seleccionamos la columna 'subtotal'
            include: [
                {
                    model: Product,
                    attributes: [], // Excluimos las demás columnas de Product
                },
            ],
            where: { userId: userId },
        });

        const total = shoppingCartItems.reduce((sum, cartItem) => {
            return sum + parseFloat(cartItem.subtotal);
        }, 0);

        res.json({ total });
    } catch (error) {
        console.error("Error al calcular el total:", error);
        res.status(500).json({ error: "Error al calcular el total" });
    }
}

const getProductQuantity = async (req, res) => {
    const { productId } = req.params;

    try {
        // Busca la cantidad del producto en el carrito de compras
        const cartItem = await ShoppingCart.findOne({
            where: { ProductId: productId }, // Ajusta según tu modelo
            attributes: ["quantity"],
        });

        // Si se encuentra, devuelve la cantidad, de lo contrario, devuelve 0
        const quantity = cartItem ? cartItem.quantity : 0;
        res.json({ quantity });
    } catch (error) {
        console.error("Error al obtener la cantidad del producto:", error);
        res.status(500).json({ error: "Error al obtener la cantidad del producto" });
    }
};

async function deleteCartItem(req, res) {
    try {
        const { productId } = req.params;

        // Elimina el producto del carrito de compra
        const result = await ShoppingCart.destroy({
            where: { ProductId: productId },
        });

        if (result) {
            // Devuelve una respuesta exitosa
            res.json({ success: true });
        } else {
            res.status(404).json({ success: false, message: "Product not found in the shopping cart." });
        }
    } catch (error) {
        console.error("Error deleting product from shopping cart:", error);
        res.status(500).json({ success: false, message: "Internal server error." });
    }
}

export { productHome, productSale, shoppingCart, addShoppingCart, deleteProduct, calculateTotal, getProductQuantity, deleteCartItem };
