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

  if (projectId === "pdf-ocr-telegram") {
    const logPath = "/Users/sainttom/STALEPOETRY/AI/Workflow Automation/Brokerage/pdf-ocr-telegram/data/logs/jobs.json";

    try {
      const data = fs.readFileSync(logPath, "utf-8");
      const logs = JSON.parse(data);

      const now = new Date();
      const last24h = logs.filter(l => {
        const t = new Date(l.timestamp);
        return (now - t) <= 24 * 60 * 60 * 1000;
      }).length;

      const success = logs.filter(l => l.status === "success").length;

      return res.json({
        project: projectId,
        success,
        last24h
      });
    } catch (e) {
      return res.json({
        project: projectId,
        success: 0,
        last24h: 0
      });
    }
  }

  res.json({
    project: projectId,
    message: "no data yet"
  });
});

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});