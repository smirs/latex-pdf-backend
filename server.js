// Example server.js snippet for deployment
const express = require("express");
const fs = require("fs");
const mustache = require("mustache");
const { exec } = require("child_process");
const path = require("path");
const cors = require("cors");

const app = express();
app.use(express.json());
app.use(cors()); // allow requests from frontend
app.use(express.static("public"));

// Your /generate endpoint
app.post("/generate", (req, res) => {
  const template = fs.readFileSync("template.tex", "utf8");
  const tex = mustache.render(template, req.body);

  const texPath = path.join(__dirname, "doc.tex");
  fs.writeFileSync(texPath, tex);

  exec("pdflatex -interaction=nonstopmode doc.tex", (err) => {
    if (err) return res.status(500).send("LaTeX compile error");

    const pdf = fs.readFileSync("doc.pdf");
    res.setHeader("Content-Type", "application/pdf");
    res.send(pdf);
  });
});

// Use dynamic port for deployment
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
