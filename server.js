const express = require("express");
const fs = require("fs");
const csv = require("csv-parse/sync");

const app = express();
const PORT = 3000;

app.use(express.static("frontend"));

app.get("/projects", (req, res) => {
  const data = fs.readFileSync("./projects.json", "utf-8");
  res.json(JSON.parse(data));
});

app.get("/stats/:id", (req, res) => {
  const projectId = req.params.id;

  // PDF PROJECT
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

  // EMAIL PROJECT (FIXED WITH YOUR REAL LOGIC)
  if (projectId === "email-outreach-system") {
    const csvPath = "/Users/sainttom/STALEPOETRY/AI/Workflow Automation/Brokerage/email-outreach-system/data/active/leads.csv";

    try {
      const raw = fs.readFileSync(csvPath, "utf-8");

      const records = csv.parse(raw, {
        columns: true,
        skip_empty_lines: true
      });

      const now = new Date();

      let sentTotal = 0;
      let replyTotal = 0;

      let sentWeek = 0;
      let replyWeek = 0;

      let sentMonth = 0;
      let replyMonth = 0;

      const startOfWeek = new Date(now);
      startOfWeek.setDate(now.getDate() - now.getDay());

      const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);

      records.forEach(row => {
        const outreachStatus = row["outreach_status"];
        const dateSent = row["date_sent"];
        const replyReceived = row["reply_received"];
        const replyDate = row["reply_date"];

        // SENT
        if (outreachStatus === "sent" && dateSent) {
          const d = new Date(dateSent);
          if (!isNaN(d)) {
            sentTotal++;
            if (d >= startOfWeek) sentWeek++;
            if (d >= startOfMonth) sentMonth++;
          }
        }

        // REPLIES
        if (replyReceived === "yes" && replyDate) {
          const d = new Date(replyDate);
          if (!isNaN(d)) {
            replyTotal++;
            if (d >= startOfWeek) replyWeek++;
            if (d >= startOfMonth) replyMonth++;
          }
        }
      });

      return res.json({
        project: projectId,
        sentTotal,
        sentWeek,
        sentMonth,
        replyTotal,
        replyWeek,
        replyMonth
      });

    } catch (e) {
      return res.json({
        project: projectId,
        sentTotal: 0,
        sentWeek: 0,
        sentMonth: 0,
        replyTotal: 0,
        replyWeek: 0,
        replyMonth: 0
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