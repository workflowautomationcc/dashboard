const express = require("express");
const fs = require("fs");

const app = express();
const PORT = 3000;

app.use(express.static("frontend"));

app.get("/projects", (req, res) => {
  const data = fs.readFileSync("./projects.json", "utf-8");
  res.json(JSON.parse(data));
});

app.get("/stats/:id", (req, res) => {
  const projectId = req.params.id;

  res.json({
    project: projectId,
    message: "stats will go here"
  });
});

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});