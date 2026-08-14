const express = require("express");

const app = express();

const PORT = process.env.PORT || 5000;

app.get("/", (req, res) => {
  res.send("Home Page");
});

app.get("/about", (req, res) => {
  res.send("About Page");
});

app.use(express.json());
app.post("/documents", (req, res) => {
  console.log(req.body);
  res.send(`Received ${req.body.name}`);
});

app.listen(PORT, () => {
  console.log(`Server running  at http://localhost:${PORT}`);
});
