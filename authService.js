const userRepository = require("./userRepository");

const jwt = require("jsonwebtoken");

const bcrypt = require("bcrypt");

async function register(email, password) {
  const existingUser = userRepository.findUserByEmail(email);
  if (existingUser) {
    const error = new Error("User already exists");
    error.status = 409;
    throw error;
  }

  const passwordHash = await bcrypt.hash(password, 10);

  const user = {
    id: Date.now(),
    email,
    passwordHash,
    role: "user",
  };
  userRepository.createUser(user);
  const safeUser = {
    id: Date.now(),
    email,
    role: "user",
  };

  return safeUser;
}

async function login(email, password) {
  const user = userRepository.findUserByEmail(email);
  if (!user) {
    const error = new Error("Invalid Credentials");
    error.status = 401;
    throw error;
  }

  const passwordMatches = await bcrypt.compare(password, user.passwordHash);
  if (!passwordMatches) {
    const error = new Error("Invalid Credentials");
    error.status = 401;
    throw error;
  }

  const token = jwt.sign(
    {
      userId: user.id,
      role: user.role,
    },
    process.env.JWT_SECRET,
    {
      expiresIn: "1h",
    },
  );

  return token;
}

module.exports = {
  login,
  register,
};
