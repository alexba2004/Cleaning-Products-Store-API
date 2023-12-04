document.addEventListener("DOMContentLoaded", function () {
    updateTotal();
    showShoppingCart();

    document.getElementById("pay-now-btn").addEventListener("click", buyNow);
});

function updateTotal() {
    const total = shoppingCartItems.reduce((sum, cartItem) => {
        const productPrice = parseFloat(cartItem.Product.price.replace("$", ""));
        return sum + productPrice * cartItem.quantity;
    }, 0);

    const totalPurchaseParagraph = document.getElementById("total-purchase");
    totalPurchaseParagraph.textContent = `Total de compra: $${total.toFixed(2)}`;
}

function showShoppingCart() {
    const productList = document.getElementById("product-list");
    productList.innerHTML = "";

    shoppingCartItems.forEach((cartItem) => {
        const listItem = document.createElement("li");
        listItem.className = "mb-4";
        listItem.innerHTML = `
            <div class="p-4 text-center">
                <div class="product-container mb-2 flex justify-between items-center h-full p-4 border border-gray-300 rounded" id="${cartItem.Product ? cartItem.Product.productName : "Unknown"}-container">
                    <div class="left-container flex items-center">
                        <img src="${cartItem.Product ? cartItem.Product.productImage.toLowerCase() : "unknown"}" alt="${cartItem.Product ? cartItem.Product.productName : "Unknown"}" class="h-32 w-32 object-contain rounded-full product-image mb-2 mr-4">
                        <div class="flex flex-col items-start text-left"> 
                            <p class="text-sm font-semibold mt-auto mb-2 text-center">${cartItem.Product ? cartItem.Product.productName : "Unknown"}</p>
                            <p class="text-sm font-bold text-green-500 mb-2">Precio: $${cartItem.Product ? cartItem.Product.price : "Unknown"}</p>
                            <p id="quantity-${cartItem.Product.id}" class="text-sm font-semibold mb-2">Cantidad: ${cartItem.quantity || "Unknown"}</p>
                            <p id="subtotal-${cartItem.Product.id}" class="text-sm font-semibold mb-2">Subtotal: $${(parseFloat(cartItem.Product ? cartItem.Product.price.replace("$", "") : 0) * (cartItem.quantity || 0)).toFixed(2) || "Unknown"}</p>
                        </div>
                    </div>
                    <div class="right-container flex items-center"> 
                        <button class="bg-blue-500 text-white p-2 m-2 rounded" onclick="openPopup('${cartItem.Product ? cartItem.Product.id : "Unknown"}')">Editar</button>
                        <button class="bg-red-500 text-white p-2 m-2 rounded" onclick="deleteProduct('${cartItem.Product ? cartItem.Product.id : "Unknown"}')">Eliminar</button>
                    </div>
                </div>
            </div>
        `;

        productList.appendChild(listItem);
    });
}

function openPopup(productId) {
    const product = shoppingCartItems.find((item) => item.Product.id === parseInt(productId));

    if (product) {
        const popupContainer = document.getElementById("popup-container");
        const popupContent = document.getElementById("popup-content");
        const popupImage = document.getElementById("popup-image");
        const popupProductName = document.getElementById("popup-product-name");
        const popupProductDescription = document.getElementById("popup-product-description");
        const popupProductPrice = document.getElementById("popup-product-price");
        const quantityInput = document.getElementById("quantity");
        const saveButton = document.getElementById("add-to-cart-btn");

        quantityInput.value = product.quantity || 1;

        popupImage.src = `${product.Product.productImage.toLowerCase()}`;
        popupImage.alt = product.Product.productName;
        popupProductName.textContent = product.Product.productName;
        popupProductDescription.textContent = product.Product.productDescription;
        popupProductPrice.textContent = `Precio: $${product.Product.price}`;

        saveButton.onclick = function () {
            saveAndClosePopup(productId);
        };

        popupContainer.classList.remove("hidden");
    }
}

function closePopup() {
    const popupContainer = document.getElementById("popup-container");
    const saveButton = document.getElementById("add-to-cart-btn");
    const cancelButton = document.getElementById("buy-now-btn-popup");

    saveButton.onclick = saveAndClosePopup;
    cancelButton.onclick = closePopup;

    popupContainer.classList.add("hidden");
}

function deleteProduct(productName) {
    const productIndex = products.findIndex((p) => p.productName === productName);

    if (productIndex !== -1) {
        products.splice(productIndex, 1);

        const productContainer = document.getElementById(`${productName}-container`);
        productContainer.remove();

        updateTotal();
    }
}

async function saveAndClosePopup(productId) {
    const popupContainer = document.getElementById("popup-container");
    const quantityInput = document.getElementById("quantity");
    const saveButton = document.getElementById("add-to-cart-btn");
    const updatedQuantity = parseInt(quantityInput.value) || 0;

    if (productId) {
        const cartItem = shoppingCartItems.find((item) => item.Product.id === productId);

        if (cartItem) {
            await ShoppingCart.update({ quantity: parseInt(updatedQuantity) || 0 }, { where: { ProductId: productId } });

            const updatedCartItem = await ShoppingCart.findOne({
                where: { ProductId: productId },
                include: [{ model: Product }],
            });

            const index = shoppingCartItems.findIndex((item) => item.Product.id === productId);
            if (index !== -1) {
                shoppingCartItems[index] = updatedCartItem ? updatedCartItem.dataValues : null;
            }

            // Actualizar la cantidad y el subtotal en la página
            const quantityElement = document.getElementById(`quantity-${productId}`);
            if (quantityElement) {
                quantityElement.textContent = `Cantidad: ${updatedQuantity}`;
            }

            const subtotalElement = document.getElementById(`subtotal-${productId}`);
            if (subtotalElement) {
                subtotalElement.textContent = `Subtotal: $${(parseFloat(updatedCartItem.Product.price.replace("$", "")) * updatedQuantity).toFixed(2) || "Unknown"}`;
            }

            updateTotal(); // Agregado para actualizar el total después de guardar
        }
    }

    const response = await fetch(`/addToCart/${productId}`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            userId: 1,
            productId: productId,
            quantity: updatedQuantity,
        }),
    });

    const result = await response.json();
    if (result.success && result.total !== undefined) {
        updateTotal();
        const totalPurchaseParagraph = document.getElementById("total-purchase");
        totalPurchaseParagraph.textContent = `Total de compra: $${result.total.toFixed(2)}`;

        showShoppingCart();
    }

    saveButton.onclick = saveAndClosePopup;
    closePopup();
}

function buyNow() {
    updateTotal();
    // Agrega aquí la lógica para realizar la compra, si es necesario
}
