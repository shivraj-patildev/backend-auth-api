require("dotenv").config();

const authService = require("./services/authService");

const jwt = require("jsonwebtoken");

const documentRepository = require("./repositories/documentRepository");
const documentService = require("./services/documentService");

const express = require("express");

const app = express();

app.use(express.json());

const PORT = process.env.PORT || 5000;

app.use((req, res, next) => {
  console.log(`${req.method} ${req.url}`);
  next();
});

app.use((req, res, next) => {
  req.requestTime = new Date();
  next();
});

let requestCount = 0;
app.use((req, res, next) => {
  requestCount += 1;
  req.requestCount = requestCount;
  next();
});

app.post("/register", async (req, res, next) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      const error = new Error("Email and password are required");
      error.status = 400;
      throw error;
    }
    const user = await authService.register(email, password);
    res.status(201).json(user);
  } catch (error) {
    next(error);
  }
});

app.post("/login", async (req, res, next) => {
  try {
    const { email, password, role } = req.body;
    if (!email || !password) {
      const error = new Error("Email and Password are required");
      error.status = 400;
      next(error);
    }

    const token = await authService.login(email, password);
    res.json({ token });
  } catch (error) {
    next(error);
  }
});

function validateDocument(req, res, next) {
  const { name, type, size } = req.body;
  const errors = [];

  if (!name || name.trim() === "") {
    errors.push("Document name is required");
  }

  if (!type || type.trim === "") {
    errors.push("Document type is required");
  }

  if (typeof size !== "number" || size <= 0) {
    errors.push("Document size must be a positive number");
  }

  if (errors.length > 0) {
    const error = new Error("Validation Failed!");
    error.status = 400;
    error.errors = errors;
    return next(error);
  }
  next();
}

function authenticateUser(req, res, next) {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    const error = new Error("Authentication required");
    error.status = 401;
    return next(error);
  }

  const token = authHeader.split(" ")[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    error.status = 401;
    next(error);
  }
}

function requireRole(role) {
  return (req, res, next) => {
    if (req.user.role !== role) {
      const error = new Error(`${role} access required`);
      error.status = 403;
      return next(error);
    }
    next();
  };
}

app.get("/", (req, res) => {
  res.json({ time: req.requestTime, count: req.requestCount });
});

app.get("/about", (req, res) => {
  res.json({ time: req.requestTime, count: req.requestCount });
});

app.get("/documents", authenticateUser, async (req, res, next) => {
  try {
    const documents = await documentService.getDocumentsByUserId(
      req.user.userId,
    );
    res.status(200).json(documents);
  } catch (err) {
    next(err);
  }
});

app.get("/documents/:id", authenticateUser, async (req, res, next) => {
  try {
    const documentId = Number(req.params.id);
    const userId = req.user.userId;

    const document = await documentService.getDocumentByIdAndUserId(
      documentId,
      userId,
    );

    if (!document) {
      return res.status(404).json({
        message: "Document not found",
      });
    }
    res.status(200).json(document);
  } catch (err) {
    next(err);
  }
});

app.post(
  "/documents",
  validateDocument,
  authenticateUser,
  async (req, res, next) => {
    try {
      const { name } = req.body;
      const userId = req.user.userId;

      const document = await documentService.createDocument(name, userId);
      res.status(201).json(document);
    } catch (err) {
      next(err);
    }
  },
);

app.put("/documents/:id", (req, res, next) => {
  const id = Number(req.params.id);
  const { name } = req.body;

  const document = documents.find((doc) => doc.id === id);

  if (!document) {
    const error = new Error("Document to Update not found");
    error.status = 404;
    return next(error);
  }

  document.name = name;

  res.json(document);
});

app.delete(
  "/documents/:id",
  authenticateUser,
  requireRole("admin"),
  (req, res, next) => {
    const id = Number(req.params.id);

    const index = documents.findIndex((doc) => doc.id === id);

    if (index === -1) {
      const error = new Error("Document to Delete not found");
      error.status = 404;
      return next(error);
    }

    const deletedDocument = documents.splice(index, 1);

    res.json(deletedDocument[0]);
  },
);

app.use((err, req, res, next) => {
  res.status(err.status || 500).json({
    message: err.message || "Internal Server Error",
    errors: err.errors || [],
  });
});

app.listen(PORT, () => {
  console.log(`Server running  at http://localhost:${PORT}`);
});
