import Product from "../models/product.js";
import ShoppingCart from "../models/shoppingCart.js";

const productHome = async (req, res) => {
    res.render("products/product-home.pug", {
        page: "Home",
        showHeader: true,
        showFooter: true,
        data: req.body,
    });
};

const productSale = async (req, res) => {
    try {
        // Obtiene todos los productos de la base de datos
        const products = await Product.findAll({ where: { status: true } });

        // Renderiza la vista y pasa los productos como variable
        res.render("products/product-sale.pug", {
            page: "Sale",
            showHeader: true,
            showFooter: true,
            data: req.body,
            products, // Pasa los productos a la vista
        });
    } catch (error) {
        console.error("Error al obtener productos:", error);
        res.status(500).send("Error interno del servidor");
    }
};

const addShoppingCart = async (req, res) => {
    try {
        const { userId, productId, quantity } = req.body;

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
        // Obtén los datos del carrito de compras desde la base de datos
        const shoppingCartItems = await ShoppingCart.findAll({
            include: [{ model: Product }],
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

const logoutController = async (req, res) => {
    try {
        // Aquí deberías agregar la lógica para eliminar el carrito del usuario
        const userId = 1; // Reemplaza con el campo correcto del usuario
        await ShoppingCart.destroy({ where: { UserId: userId } });

        res.redirect("/login"); // Redirige a la página principal u otra página después del logout
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Error during logout" });
    }
};

export { productHome, productSale, shoppingCart, addShoppingCart, deleteProduct, logoutController };
