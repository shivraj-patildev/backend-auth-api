const express = require("express");

const app = express();

app.use(express.json());

const PORT = process.env.PORT || 5000;

const documents = [
  { id: 1, name: "Resume.pdf" },
  { id: 2, name: "Invoice.pdf" },
  { id: 3, name: "Contract.docx" },
];

app.get("/", (req, res) => {
  res.send("Home Page");
});

app.get("/about", (req, res) => {
  res.send("About Page");
});

app.get("/documents", (req, res) => {
  res.json(documents);
});

app.get("/documents/:id", (req, res) => {
  const id = Number(req.params.id);

  const document = documents.find((doc) => doc.id === id);

  if (!document) {
    return res.status(404).json({ message: "Document not found" });
  }

  res.json(document);
});

app.post("/documents", (req, res) => {
  console.log("Body:", req.body);
  const { name } = req.body;

  const newDocument = {
    id: documents.length + 1,
    name,
  };

  documents.push(newDocument);

  res.status(201).json(newDocument);
});

app.put("/documents/:id", (req, res) => {
  const id = Number(req.params.id);
  const { name } = req.body;

  const document = documents.find((doc) => doc.id === id);

  if (!document) {
    return res.status(404).json({ message: "Document not found" });
  }

  document.name = name;

  res.json(document);
});

app.delete("/documents/:id", (req, res) => {
  const id = Number(req.params.id);

  const index = documents.findIndex((doc) => doc.id === id);

  if (index === -1) {
    return res.status(404).json({ message: "Document not found" });
  }

  const deletedDocument = documents.splice(index, 1);

  res.json(deletedDocument[0]);
});
app.listen(PORT, () => {
  console.log(`Server running  at http://localhost:${PORT}`);
});
