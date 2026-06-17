const validateRegister = (req, res, next) => {
  const { name, email, password } = req.body;
  if (!name || !email || !password) {
    return res.status(400).json({ message: "Name, email, and password are required." });
  }
  if (password.length < 6) {
    return res.status(400).json({ message: "Password must be at least 6 characters long." });
  }
  next();
};

const validateLogin = (req, res, next) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({ message: "Email and password are required." });
  }
  next();
};

const validateProduct = (req, res, next) => {
  const { name, category, price, stock } = req.body;
  if (!name || !category || price === undefined || stock === undefined) {
    return res.status(400).json({ message: "Name, category, price, and stock are required." });
  }
  if (parseFloat(price) < 0) {
    return res.status(400).json({ message: "Price cannot be negative." });
  }
  if (parseInt(stock) < 0) {
    return res.status(400).json({ message: "Stock cannot be negative." });
  }
  next();
};

module.exports = { validateRegister, validateLogin, validateProduct };
