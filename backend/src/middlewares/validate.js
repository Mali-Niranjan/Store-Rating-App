// simple validators
const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const passwordRegex = /^(?=.{8,16}$)(?=.*[A-Z])(?=.*[^A-Za-z0-9]).*$/;

function validateSignup(req, res, next) {
  const { name, email, password, address } = req.body;
  if (!name || name.length < 20 || name.length > 60) return res.status(400).json({ message: 'Name must be 20-60 characters' });
  if (!email || !emailRegex.test(email)) return res.status(400).json({ message: 'Invalid email' });
  if (!password || !passwordRegex.test(password)) return res.status(400).json({ message: 'Password must be 8-16 chars, one uppercase and one special char' });
  if (address && address.length > 400) return res.status(400).json({ message: 'Address max 400 chars' });
  next();
}

function validateUserCreationByAdmin(req, res, next){
  // admin can create users, similar to signup
  return validateSignup(req, res, next);
}

module.exports = { validateSignup, validateUserCreationByAdmin };
