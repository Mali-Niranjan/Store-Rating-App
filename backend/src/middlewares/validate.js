const validateSignup = (req, res, next) => {
  const { name, email, password } = req.body;
  if (!name || !email || !password) {
    return res.status(400).json({ ok: false, message: "All fields are required" });
  }
  next();
};

module.exports = { validateSignup };
