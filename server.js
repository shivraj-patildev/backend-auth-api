const http = require("http");

const PORT = process.env.PORT || 5000;

const server = http.createServer((req, res) => {
  console.log(`${req.method} ${req.url}`);

  if (req.method === "GET" && req.url === "/documents") {
    res.end("Returning all documents");
  } else if (req.method === "POST" && req.url === "/documents") {
    res.end("Creating a new document");
  } else if (req.method === "PUT" && req.url === "/documents") {
    res.end("Updating a document");
  } else if (req.method === "DELETE" && req.url === "/documents") {
    res.end("Deleting a document");
  } else {
    res.statusCode = 404;
    res.end("Route not found");
  }
});

server.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
