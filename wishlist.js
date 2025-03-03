document.addEventListener("DOMContentLoaded", () => {
    const wishlistContainer = document.getElementById("wishlist-container");
    let wishlist = JSON.parse(localStorage.getItem("wishlist")) || [];

    if (wishlist.length === 0) {
        wishlistContainer.innerHTML = "<p>Your wishlist is empty.</p>";
        return;
    }

    wishlist.forEach(product => {
        fetch(`https://fakestoreapi.com/products/${product.id}`)
            .then(response => response.json())
            .then(productData => {
                fetchFakeEcommerceData(productData).then(ecommerceData => {
                    displayWishlistProduct(productData, ecommerceData);
                });
            });
    });

    function fetchFakeEcommerceData(product) {
        return new Promise(resolve => {
            setTimeout(() => {
                resolve([
                    {
                        store: "Amazon",
                        price: (product.price * 0.95).toFixed(2),
                        link: `https://www.amazon.com/s?k=${encodeURIComponent(product.title)}`
                    },
                    {
                        store: "Walmart",
                        price: (product.price * 1.05).toFixed(2),
                        link: `https://www.walmart.com/search?q=${encodeURIComponent(product.title)}`
                    },
                    {
                        store: "eBay",
                        price: (product.price * 0.90).toFixed(2),
                        link: `https://www.ebay.com/sch/i.html?_nkw=${encodeURIComponent(product.title)}`
                    }
                ]);
            }, 500);
        });
    }

    function displayWishlistProduct(product, ecommerceData) {
        const card = document.createElement("div");
        card.classList.add("card");

        let ecommerceHTML = ecommerceData.map(data =>
            `<p><strong>${data.store}:</strong> $${data.price} 
                <a href="${data.link}" target="_blank">
                    <button class="buy-button">Go to Website</button>
                </a>
            </p>`
        ).join("");

        card.innerHTML = `
            <img src="${product.image}" alt="${product.title}">
            <h3>${product.title}</h3>
            ${ecommerceHTML}
            <button class="remove-btn" onclick="removeFromWishlist(${product.id})">Remove from Wishlist</button>
        `;

        wishlistContainer.appendChild(card);
    }

    window.removeFromWishlist = (id) => {
        let updatedWishlist = wishlist.filter(item => item.id !== id);
        localStorage.setItem("wishlist", JSON.stringify(updatedWishlist));
        location.reload(); // Refresh the page to update UI
    };
});
