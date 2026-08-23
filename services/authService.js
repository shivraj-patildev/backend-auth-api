const userRepository = require("../repositories/userRepository");

const jwt = require("jsonwebtoken");

const bcrypt = require("bcrypt");

async function register(email, password) {
  const existingUser = await userRepository.findUserByEmail(email);
  if (existingUser) {
    const error = new Error("User already exists");
    error.status = 409;
    throw error;
  }

  const password_hash = await bcrypt.hash(password, 10);

  const user = {
    email,
    password_hash,
    role: "user",
  };
  const createUser = await userRepository.createUser(user);
  const safeUser = {
    id: createUser.id,
    email: createUser.email,
    role: createUser.role,
  };

  return safeUser;
}

async function login(email, password) {
  const user = await userRepository.findUserByEmail(email);
  if (!user) {
    const error = new Error("Invalid Credentials");
    error.status = 401;
    throw error;
  }

  const passwordMatches = await bcrypt.compare(password, user.password_hash);
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
