import React, { createContext, useContext, useState, useEffect } from "react";
import api from "../services/api";

const ShopContext = createContext();

const INITIAL_PRODUCTS = [
  {
    id: 1,
    name: "Wireless Noise-Cancelling Headphones",
    category: "Electronics",
    price: 299.99,
    rating: 4.8,
    reviewCount: 128,
    image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500&auto=format&fit=crop&q=60",
    stock: 15,
    description: "Experience high-fidelity audio with active noise-cancellation, custom EQ settings, and up to 40 hours of battery life. Perfect for travel, work, and intense focus.",
    specs: { Brand: "Acoustix", Weight: "250g", Color: "Midnight Black", Warranty: "1 Year" }
  },
  {
    id: 2,
    name: "Smart Fitness Watch Pro",
    category: "Electronics",
    price: 199.99,
    rating: 4.5,
    reviewCount: 84,
    image: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=500&auto=format&fit=crop&q=60",
    stock: 8,
    description: "Track your daily workouts, monitor your heart rate, sleep quality, and stay connected with call and notification alerts. Water-resistant up to 50m with a 7-day battery life.",
    specs: { Brand: "FitTech", Weight: "45g", Color: "Slate Gray", Warranty: "1 Year" }
  },
  {
    id: 3,
    name: "Minimalist Leather Wallet",
    category: "Accessories",
    price: 49.99,
    rating: 4.7,
    reviewCount: 56,
    image: "https://images.unsplash.com/photo-1627123424574-724758594e93?w=500&auto=format&fit=crop&q=60",
    stock: 30,
    description: "Handcrafted from full-grain leather, this slim wallet features RFID-blocking technology and space for up to 8 cards plus cash. Fits perfectly in front pockets.",
    specs: { Brand: "Hide & Co", Weight: "30g", Color: "Tan Leather", Warranty: "Lifetime" }
  },
  {
    id: 4,
    name: "Ergonomic Mechanical Keyboard",
    category: "Electronics",
    price: 129.99,
    rating: 4.9,
    reviewCount: 92,
    image: "https://images.unsplash.com/photo-1618384887929-16ec33faf9c1?w=500&auto=format&fit=crop&q=60",
    stock: 12,
    description: "Customizable RGB backlit mechanical keyboard with hot-swappable tactile brown switches. Ergonomic split layout helps reduce wrist strain for long typing sessions.",
    specs: { Brand: "Clicky", Weight: "950g", Color: "Chalk White", Warranty: "2 Years" }
  },
  {
    id: 5,
    name: "Modern Ceramic Coffee Mug",
    category: "Home & Kitchen",
    price: 24.99,
    rating: 4.4,
    reviewCount: 37,
    image: "https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?w=500&auto=format&fit=crop&q=60",
    stock: 25,
    description: "Double-walled insulated ceramic mug that keeps your beverage hot for hours. Ergonomic matte finish exterior and splash-proof slide lid.",
    specs: { Brand: "ClayWorks", Weight: "350g", Color: "Matte Gray", Warranty: "30 Days" }
  },
  {
    id: 6,
    name: "Cushioned Running Sneakers",
    category: "Apparel",
    price: 89.99,
    rating: 4.6,
    reviewCount: 73,
    image: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=500&auto=format&fit=crop&q=60",
    stock: 18,
    description: "Lightweight and breathable running shoes with ultra-responsive cushioning. Provides superior shock absorption and maximum energy return on tracks or roads.",
    specs: { Brand: "SwiftRun", Weight: "280g", Color: "Crimson Red", Warranty: "6 Months" }
  },
  {
    id: 7,
    name: "Waterproof Travel Backpack",
    category: "Accessories",
    price: 79.99,
    rating: 4.7,
    reviewCount: 65,
    image: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=500&auto=format&fit=crop&q=60",
    stock: 20,
    description: "Durable tear-resistant, waterproof backpack featuring a dedicated padded 15.6-inch laptop pocket, anti-theft back zippers, and USB charging port access.",
    specs: { Brand: "Nomad", Weight: "800g", Color: "Charcoal Black", Warranty: "1 Year" }
  },
  {
    id: 8,
    name: "Portable Bluetooth Speaker",
    category: "Electronics",
    price: 59.99,
    rating: 4.5,
    reviewCount: 49,
    image: "https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?w=500&auto=format&fit=crop&q=60",
    stock: 15,
    description: "Compact, rugged speaker with 360-degree sound. IPX7 waterproof rating makes it perfect for pool parties, camping, or hiking. Up to 12 hours playtime.",
    specs: { Brand: "BoomBox", Weight: "400g", Color: "Forest Green", Warranty: "1 Year" }
  }
];

const INITIAL_USERS = [
  { email: "admin@shopeze.com", password: "admin123", name: "Admin Shopeze", role: "admin" },
  { email: "user@shopeze.com", password: "user123", name: "John Doe", role: "customer", address: "123 Main St, Springfield" }
];

export const ShopProvider = ({ children }) => {
  const [products, setProducts] = useState(() => {
    const saved = localStorage.getItem("shopeze_products");
    return saved ? JSON.parse(saved) : INITIAL_PRODUCTS;
  });

  const [users, setUsers] = useState(() => {
    const saved = localStorage.getItem("shopeze_users");
    return saved ? JSON.parse(saved) : INITIAL_USERS;
  });

  const [currentUser, setCurrentUser] = useState(() => {
    const saved = localStorage.getItem("shopeze_current_user");
    return saved ? JSON.parse(saved) : null;
  });

  const [cart, setCart] = useState(() => {
    const saved = localStorage.getItem("shopeze_cart");
    return saved ? JSON.parse(saved) : [];
  });

  const [wishlist, setWishlist] = useState(() => {
    const saved = localStorage.getItem("shopeze_wishlist");
    return saved ? JSON.parse(saved) : [];
  });

  const [comparison, setComparison] = useState(() => {
    const saved = localStorage.getItem("shopeze_comparison");
    return saved ? JSON.parse(saved) : [];
  });

  const [orders, setOrders] = useState(() => {
    const saved = localStorage.getItem("shopeze_orders");
    return saved ? JSON.parse(saved) : [];
  });

  const [searchQuery, setSearchQuery] = useState("");
  const [activeCoupon, setActiveCoupon] = useState(null);
  const [isOffline, setIsOffline] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // Sync state to local storage on changes (always runs for local backup)
  useEffect(() => {
    localStorage.setItem("shopeze_products", JSON.stringify(products));
  }, [products]);

  useEffect(() => {
    localStorage.setItem("shopeze_users", JSON.stringify(users));
  }, [users]);

  useEffect(() => {
    if (currentUser) {
      localStorage.setItem("shopeze_current_user", JSON.stringify(currentUser));
    } else {
      localStorage.removeItem("shopeze_current_user");
    }
  }, [currentUser]);

  useEffect(() => {
    localStorage.setItem("shopeze_cart", JSON.stringify(cart));
  }, [cart]);

  useEffect(() => {
    localStorage.setItem("shopeze_wishlist", JSON.stringify(wishlist));
  }, [wishlist]);

  useEffect(() => {
    localStorage.setItem("shopeze_comparison", JSON.stringify(comparison));
  }, [comparison]);

  useEffect(() => {
    localStorage.setItem("shopeze_orders", JSON.stringify(orders));
  }, [orders]);

  // Initial Sync from API
  useEffect(() => {
    const initData = async () => {
      setIsLoading(true);
      try {
        // Fetch products
        const dbProducts = await api.products.getAll();
        setProducts(dbProducts);
        setIsOffline(false);
      } catch (error) {
        if (error.isOffline) {
          setIsOffline(true);
        }
      }

      // If logged in, fetch user's cart, wishlist, and orders
      if (currentUser && currentUser.token) {
        try {
          const dbCart = await api.cart.get();
          // Transform simple productId mapping back to full items list
          const fullCart = [];
          for (const item of dbCart) {
            const prod = products.find((p) => p.id === item.productId);
            if (prod) {
              fullCart.push({ product: prod, quantity: item.quantity });
            }
          }
          if (fullCart.length > 0) setCart(fullCart);

          const dbWishlist = await api.wishlist.get();
          setWishlist(dbWishlist);

          const dbOrders = await api.orders.getMy();
          setOrders(dbOrders);
        } catch (error) {
          console.warn("Failed to sync personal user data with backend:", error.message);
        }
      }
      setIsLoading(false);
    };

    initData();
  }, [currentUser?.token]);

  // Auth Operations
  const loginUser = async (email, password) => {
    try {
      const response = await api.auth.login(email, password);
      setCurrentUser(response);
      setIsOffline(false);
      return { success: true, user: response };
    } catch (error) {
      if (error.isOffline) {
        setIsOffline(true);
        // Fallback local auth
        const foundUser = users.find(
          (u) => u.email.toLowerCase() === email.toLowerCase() && u.password === password
        );
        if (foundUser) {
          setCurrentUser(foundUser);
          return { success: true, user: foundUser };
        }
        return { success: false, error: "Invalid email or password (Offline)." };
      }
      return { success: false, error: error.message };
    }
  };

  const registerUser = async (name, email, password) => {
    try {
      const response = await api.auth.register(name, email, password);
      setCurrentUser(response);
      setIsOffline(false);
      return { success: true, user: response };
    } catch (error) {
      if (error.isOffline) {
        setIsOffline(true);
        // Fallback local registration
        const exists = users.some((u) => u.email.toLowerCase() === email.toLowerCase());
        if (exists) {
          return { success: false, error: "Email already registered." };
        }
        const newUser = { name, email, password, role: "customer", address: "" };
        setUsers((prev) => [...prev, newUser]);
        setCurrentUser(newUser);
        return { success: true, user: newUser };
      }
      return { success: false, error: error.message };
    }
  };

  const logoutUser = () => {
    setCurrentUser(null);
    setCart([]);
    setWishlist([]);
    setActiveCoupon(null);
  };

  const updateProfile = async (updatedDetails) => {
    if (!currentUser) return;
    try {
      const response = await api.auth.updateProfile(updatedDetails);
      setCurrentUser(response);
      setIsOffline(false);
    } catch (error) {
      if (error.isOffline) {
        setIsOffline(true);
      }
      // Fallback local update
      const newProfile = { ...currentUser, ...updatedDetails };
      setCurrentUser(newProfile);
      setUsers((prev) =>
        prev.map((u) => (u.email.toLowerCase() === currentUser.email.toLowerCase() ? newProfile : u))
      );
    }
  };

  // Cart Operations
  const addToCart = (productId, quantity = 1) => {
    const product = products.find((p) => p.id === productId);
    if (!product) return;

    let updatedCart;
    setCart((prev) => {
      const existing = prev.find((item) => item.product.id === productId);
      if (existing) {
        const newQty = Math.min(existing.quantity + quantity, product.stock);
        updatedCart = prev.map((item) =>
          item.product.id === productId ? { ...item, quantity: newQty } : item
        );
      } else {
        updatedCart = [...prev, { product, quantity: Math.min(quantity, product.stock) }];
      }

      // Sync with server if logged in
      if (currentUser && currentUser.token && !isOffline) {
        const simpleItems = updatedCart.map((item) => ({
          productId: item.product.id,
          quantity: item.quantity,
        }));
        api.cart.save(simpleItems).catch((e) => console.error("Error saving cart to backend:", e));
      }

      return updatedCart;
    });
  };

  const removeFromCart = (productId) => {
    setCart((prev) => {
      const updatedCart = prev.filter((item) => item.product.id !== productId);
      
      // Sync with server if logged in
      if (currentUser && currentUser.token && !isOffline) {
        const simpleItems = updatedCart.map((item) => ({
          productId: item.product.id,
          quantity: item.quantity,
        }));
        api.cart.save(simpleItems).catch((e) => console.error("Error saving cart to backend:", e));
      }

      return updatedCart;
    });
  };

  const updateCartQuantity = (productId, quantity) => {
    const product = products.find((p) => p.id === productId);
    if (!product) return;

    if (quantity <= 0) {
      removeFromCart(productId);
    } else {
      setCart((prev) => {
        const updatedCart = prev.map((item) =>
          item.product.id === productId
            ? { ...item, quantity: Math.min(quantity, product.stock) }
            : item
        );

        // Sync with server if logged in
        if (currentUser && currentUser.token && !isOffline) {
          const simpleItems = updatedCart.map((item) => ({
            productId: item.product.id,
            quantity: item.quantity,
          }));
          api.cart.save(simpleItems).catch((e) => console.error("Error saving cart to backend:", e));
        }

        return updatedCart;
      });
    }
  };

  // Wishlist Operations
  const addToWishlist = (productId) => {
    if (wishlist.includes(productId)) return;
    const updatedWishlist = [...wishlist, productId];
    setWishlist(updatedWishlist);

    if (currentUser && currentUser.token && !isOffline) {
      api.wishlist.save(updatedWishlist).catch((e) => console.error("Error saving wishlist to backend:", e));
    }
  };

  const removeFromWishlist = (productId) => {
    const updatedWishlist = wishlist.filter((id) => id !== productId);
    setWishlist(updatedWishlist);

    if (currentUser && currentUser.token && !isOffline) {
      api.wishlist.save(updatedWishlist).catch((e) => console.error("Error saving wishlist to backend:", e));
    }
  };

  const moveToCart = (productId) => {
    addToCart(productId, 1);
    removeFromWishlist(productId);
  };

  const applyCoupon = (code) => {
    const uppercaseCode = code.toUpperCase().trim();
    if (uppercaseCode === "SHOPSAVE10") {
      setActiveCoupon({ code: "SHOPSAVE10", discount: 0.1 });
      return { success: true, message: "10% discount coupon applied!" };
    } else if (uppercaseCode === "SHOPSAVE20") {
      setActiveCoupon({ code: "SHOPSAVE20", discount: 0.2 });
      return { success: true, message: "20% discount coupon applied!" };
    }
    return { success: false, error: "Invalid coupon code." };
  };

  const removeCoupon = () => {
    setActiveCoupon(null);
  };

  const getCartTotals = () => {
    const subtotal = cart.reduce((acc, item) => acc + item.product.price * item.quantity, 0);
    const discountAmount = activeCoupon ? subtotal * activeCoupon.discount : 0;
    const discountedSubtotal = subtotal - discountAmount;

    // Shipping: Free for orders over $100 after discount, otherwise $15. Free if cart empty.
    const shipping = cart.length === 0 ? 0 : discountedSubtotal >= 100 ? 0 : 15.0;
    const tax = discountedSubtotal * 0.08; // 8% sales tax
    const total = discountedSubtotal + shipping + tax;

    return {
      subtotal: parseFloat(subtotal.toFixed(2)),
      discount: parseFloat(discountAmount.toFixed(2)),
      shipping: parseFloat(shipping.toFixed(2)),
      tax: parseFloat(tax.toFixed(2)),
      total: parseFloat(total.toFixed(2)),
    };
  };

  // Comparison Operations
  const toggleCompare = (product) => {
    setComparison((prev) => {
      const exists = prev.some((p) => p.id === product.id);
      if (exists) {
        return prev.filter((p) => p.id !== product.id);
      }
      if (prev.length >= 3) {
        alert("You can compare a maximum of 3 products at a time.");
        return prev;
      }
      return [...prev, product];
    });
  };

  const clearCompare = () => {
    setComparison([]);
  };

  // Checkout Operations
  const placeOrder = async (shippingInfo = {}) => {
    if (!currentUser) return { success: false, error: "Must be logged in to place order." };
    if (cart.length === 0) return { success: false, error: "Cart is empty." };

    const totals = getCartTotals();
    const simpleItems = cart.map((item) => ({
      product: {
        id: item.product.id,
        name: item.product.name,
        price: item.product.price,
        image: item.product.image,
        category: item.product.category,
      },
      quantity: item.quantity,
    }));

    try {
      const response = await api.orders.place({
        items: simpleItems,
        totals,
        shippingInfo,
      });

      // Update local product stocks
      setProducts((prevProducts) =>
        prevProducts.map((p) => {
          const cartItem = cart.find((item) => item.product.id === p.id);
          if (cartItem) {
            return { ...p, stock: Math.max(0, p.stock - cartItem.quantity) };
          }
          return p;
        })
      );

      // Add to orders list
      setOrders((prev) => [response, ...prev]);

      // Clear local states
      setCart([]);
      setActiveCoupon(null);
      
      // Clear remote cart as well
      if (currentUser && currentUser.token && !isOffline) {
        api.cart.save([]).catch((e) => console.error(e));
      }

      return { success: true, orderId: response.id };
    } catch (error) {
      if (error.isOffline) {
        setIsOffline(true);
      } else {
        return { success: false, error: error.message };
      }

      // Fallback local placement
      const orderId = "ORD-" + Math.floor(100000 + Math.random() * 900000);
      const dateStr = new Date().toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
      });

      const newOrder = {
        id: orderId,
        date: dateStr,
        status: "Pending",
        items: [...cart],
        totals,
        email: currentUser.email,
        shippingInfo,
      };

      // Decrement stock for local state
      setProducts((prevProducts) =>
        prevProducts.map((p) => {
          const cartItem = cart.find((item) => item.product.id === p.id);
          if (cartItem) {
            return { ...p, stock: Math.max(0, p.stock - cartItem.quantity) };
          }
          return p;
        })
      );

      setOrders((prev) => [newOrder, ...prev]);
      setCart([]);
      setActiveCoupon(null);

      return { success: true, orderId: newOrder.id };
    }
  };

  // Admin Operations
  const addProduct = async (productData) => {
    try {
      const response = await api.products.create(productData);
      setProducts((prev) => [...prev, response]);
      return { success: true, product: response };
    } catch (error) {
      if (error.isOffline) {
        setIsOffline(true);
      }
      // Fallback local
      const nextId = products.length > 0 ? Math.max(...products.map((p) => p.id)) + 1 : 1;
      const newProduct = {
        id: nextId,
        name: productData.name,
        category: productData.category,
        price: parseFloat(productData.price) || 0,
        rating: 5.0,
        reviewCount: 0,
        image:
          productData.image ||
          "https://images.unsplash.com/photo-1531403009284-440f080d1e12?w=500&auto=format&fit=crop&q=60",
        stock: parseInt(productData.stock) || 0,
        description: productData.description || "",
        specs: productData.specs || { Brand: "Generic", Weight: "N/A", Color: "N/A", Warranty: "N/A" },
      };

      setProducts((prev) => [...prev, newProduct]);
      return { success: true, product: newProduct };
    }
  };

  const updateProduct = async (productId, updatedData) => {
    try {
      const response = await api.products.update(productId, updatedData);
      setProducts((prev) => prev.map((p) => (p.id === productId ? response : p)));
      return { success: true };
    } catch (error) {
      if (error.isOffline) {
        setIsOffline(true);
      }
      // Fallback local
      setProducts((prev) =>
        prev.map((p) => {
          if (p.id === productId) {
            return {
              ...p,
              ...updatedData,
              price: parseFloat(updatedData.price) ?? p.price,
              stock: parseInt(updatedData.stock) ?? p.stock,
            };
          }
          return p;
        })
      );
      return { success: true };
    }
  };

  const deleteProduct = async (productId) => {
    try {
      await api.products.delete(productId);
      setIsOffline(false);
    } catch (error) {
      if (error.isOffline) {
        setIsOffline(true);
      }
    }

    // Always update local states
    setProducts((prev) => prev.filter((p) => p.id !== productId));
    setCart((prev) => prev.filter((item) => item.product.id !== productId));
    setComparison((prev) => prev.filter((p) => p.id !== productId));
    setWishlist((prev) => prev.filter((id) => id !== productId));

    return { success: true };
  };

  const updateOrderStatus = async (orderId, status) => {
    try {
      const response = await api.orders.updateStatus(orderId, status);
      setOrders((prev) => prev.map((order) => (order.id === orderId ? response : order)));
      return { success: true };
    } catch (error) {
      if (error.isOffline) {
        setIsOffline(true);
      }
      // Fallback local
      setOrders((prev) =>
        prev.map((order) => (order.id === orderId ? { ...order, status } : order))
      );
      return { success: true };
    }
  };

  return (
    <ShopContext.Provider
      value={{
        products,
        users,
        currentUser,
        cart,
        wishlist,
        comparison,
        orders,
        searchQuery,
        activeCoupon,
        isOffline,
        isLoading,
        setSearchQuery,
        loginUser,
        registerUser,
        logoutUser,
        updateProfile,
        addToCart,
        removeFromCart,
        updateCartQuantity,
        addToWishlist,
        removeFromWishlist,
        moveToCart,
        applyCoupon,
        removeCoupon,
        getCartTotals,
        toggleCompare,
        clearCompare,
        placeOrder,
        addProduct,
        updateProduct,
        deleteProduct,
        updateOrderStatus,
      }}
    >
      {children}
    </ShopContext.Provider>
  );
};

export const useShop = () => useContext(ShopContext);
