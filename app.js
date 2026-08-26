require("dotenv").config();

const authService = require("./services/authService");

const documentService = require("./services/documentService");

const authenticateUser = require("./middleware/authenticateUser");

const validateAuthInput = require("./middleware/validateAuthInput");

const validateDocument = require("./middleware/validateDocument");

const requireRole = require("./middleware/requireRole");

const validateDocumentId = require("./middleware/validateDocumentId");

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

app.post("/register", validateAuthInput, async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const user = await authService.register(email, password);
    res.status(201).json({ user });
  } catch (error) {
    next(error);
  }
});

app.post("/login", validateAuthInput, async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const token = await authService.login(email, password);
    res.json({ token });
  } catch (error) {
    next(error);
  }
});

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

app.get(
  "/documents/:id",
  authenticateUser,
  validateDocumentId,
  async (req, res, next) => {
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
  },
);

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

app.put(
  "/documents/:id",
  authenticateUser,
  validateDocumentId,
  async (req, res, next) => {
    const documentId = Number(req.params.id);
    const { name } = req.body;
    const userId = req.user.userId;
    try {
      const document = await documentService.updateDocumentByIdAndUserId(
        documentId,
        userId,
        name,
      );

      if (!document) {
        const error = new Error("Document to Update not found");
        error.status = 404;
        return next(error);
      }

      res.json(document);
    } catch (err) {
      next(err);
    }
  },
);

app.delete(
  "/documents/:id",
  authenticateUser,
  requireRole("user"),
  validateDocumentId,
  async (req, res, next) => {
    try {
      const documentId = Number(req.params.id);
      const userId = req.user.userId;

      const document = await documentService.deleteDocumentByIdAndUserId(
        documentId,
        userId,
      );

      if (!document) {
        const error = new Error("Document to Delete not found");
        error.status = 404;
        return next(error);
      }

      res
        .status(200)
        .json({ message: "document deleted successfully", document });
    } catch (err) {
      next(err);
    }
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
