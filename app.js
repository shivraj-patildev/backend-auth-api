const express = require("express");

const app = express();

app.use(express.json());

const PORT = process.env.PORT || 5000;

const documents = [
  { id: 1, name: "Resume.pdf" },
  { id: 2, name: "Invoice.pdf" },
  { id: 3, name: "Contract.docx" },
];

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

app.get("/", (req, res) => {
  res.json({ time: req.requestTime, count: req.requestCount });
});

app.get("/about", (req, res) => {
  res.json({ time: req.requestTime, count: req.requestCount });
});

app.get("/documents", (req, res) => {
  res.json({ documents, time: req.requestTime, count: req.requestCount });
});

app.get("/documents/:id", (req, res, next) => {
  const id = Number(req.params.id);

  const document = documents.find((doc) => doc.id === id);

  if (!document) {
    const error = new Error("Document to get not found");
    error.status = 404;
    return next(error);
  }
  res.json(document);
});

app.post("/documents", validateDocument, (req, res) => {
  console.log("Body:", req.body);
  const { name } = req.body;

  const newDocument = {
    id: documents.length + 1,
    name,
  };

  documents.push(newDocument);

  res.status(201).json(newDocument);
});

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

app.delete("/documents/:id", (req, res, next) => {
  const id = Number(req.params.id);

  const index = documents.findIndex((doc) => doc.id === id);

  if (index === -1) {
    const error = new Error("Document to Delete not found");
    error.status = 404;
    return next(error);
  }

  const deletedDocument = documents.splice(index, 1);

  res.json(deletedDocument[0]);
});

app.use((err, req, res, next) => {
  res.status(err.status || 500).json({
    message: err.message || "Internal Server Error",
    errors: err.errors || [],
  });
});

app.listen(PORT, () => {
  console.log(`Server running  at http://localhost:${PORT}`);
});
