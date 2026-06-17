const API_URL = "http://localhost:5000/api";

// Helper to attach authorization header if token exists
const getHeaders = (isJson = true) => {
  const headers = {};
  if (isJson) {
    headers["Content-Type"] = "application/json";
  }
  
  const savedUser = localStorage.getItem("shopeze_current_user");
  if (savedUser) {
    try {
      const user = JSON.parse(savedUser);
      if (user && user.token) {
        headers["Authorization"] = `Bearer ${user.token}`;
      }
    } catch (e) {
      console.error("Error reading token for header:", e);
    }
  }
  return headers;
};

// Generic request wrapper to handle errors
const request = async (url, options = {}) => {
  try {
    const res = await fetch(url, options);
    
    if (!res.ok) {
      const errorData = await res.json().catch(() => ({}));
      const error = new Error(errorData.message || `HTTP error! status: ${res.status}`);
      error.status = res.status;
      if (res.status === 503) {
        error.isOffline = true;
      }
      throw error;
    }
    
    return await res.json();
  } catch (error) {
    // If it's a TypeError (failed to fetch), the backend is likely offline
    if (error.name === "TypeError") {
      console.warn("Backend server is offline or unreachable. Falling back to local storage simulation.");
      const offlineError = new Error("Backend offline");
      offlineError.isOffline = true;
      throw offlineError;
    }
    throw error;
  }
};

const api = {
  auth: {
    login: async (email, password) => {
      return request(`${API_URL}/auth/login`, {
        method: "POST",
        headers: getHeaders(),
        body: JSON.stringify({ email, password }),
      });
    },
    register: async (name, email, password) => {
      return request(`${API_URL}/auth/register`, {
        method: "POST",
        headers: getHeaders(),
        body: JSON.stringify({ name, email, password }),
      });
    },
    getProfile: async () => {
      return request(`${API_URL}/auth/profile`, {
        headers: getHeaders(),
      });
    },
    updateProfile: async (profileData) => {
      return request(`${API_URL}/auth/profile`, {
        method: "PUT",
        headers: getHeaders(),
        body: JSON.stringify(profileData),
      });
    },
    getUsers: async () => {
      return request(`${API_URL}/auth/users`, {
        headers: getHeaders(),
      });
    },
  },
  
  products: {
    getAll: async () => {
      return request(`${API_URL}/products`);
    },
    getById: async (id) => {
      return request(`${API_URL}/products/${id}`);
    },
    create: async (productData) => {
      return request(`${API_URL}/products`, {
        method: "POST",
        headers: getHeaders(),
        body: JSON.stringify(productData),
      });
    },
    update: async (id, productData) => {
      return request(`${API_URL}/products/${id}`, {
        method: "PUT",
        headers: getHeaders(),
        body: JSON.stringify(productData),
      });
    },
    delete: async (id) => {
      return request(`${API_URL}/products/${id}`, {
        method: "DELETE",
        headers: getHeaders(),
      });
    },
    seed: async (clear = false) => {
      return request(`${API_URL}/products/seed?clear=${clear}`, {
        method: "POST",
      });
    },
  },
  
  orders: {
    place: async (orderData) => {
      return request(`${API_URL}/orders`, {
        method: "POST",
        headers: getHeaders(),
        body: JSON.stringify(orderData),
      });
    },
    getMy: async () => {
      return request(`${API_URL}/orders/my`, {
        headers: getHeaders(),
      });
    },
    getAll: async () => {
      return request(`${API_URL}/orders`, {
        headers: getHeaders(),
      });
    },
    updateStatus: async (id, status) => {
      return request(`${API_URL}/orders/${id}/status`, {
        method: "PUT",
        headers: getHeaders(),
        body: JSON.stringify({ status }),
      });
    },
  },

  cart: {
    get: async () => {
      return request(`${API_URL}/cart`, { headers: getHeaders() });
    },
    save: async (items) => {
      return request(`${API_URL}/cart`, {
        method: "POST",
        headers: getHeaders(),
        body: JSON.stringify({ items }),
      });
    },
  },

  wishlist: {
    get: async () => {
      return request(`${API_URL}/wishlist`, { headers: getHeaders() });
    },
    save: async (products) => {
      return request(`${API_URL}/wishlist`, {
        method: "POST",
        headers: getHeaders(),
        body: JSON.stringify({ products }),
      });
    },
  },
};

export default api;
