const http = require("http");
const PORT = process.env.PORT || 5000;

const server = http.createServer((req, res) => {
  if (req.method === "POST" && req.url === "/documents") {
    let body = "";

    req.on("data", (chunk) => {
      body += chunk;
    });

    req.on("end", () => {
      console.log("Raw body:", body);

      const document = JSON.parse(body);

      console.log("Parsed object:", document);

      res.end(`Received document: ${document.name}`);
    });
  } else {
    res.end("Use POST /documents");
  }
});

server.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
