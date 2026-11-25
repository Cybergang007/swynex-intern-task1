const express = require("express");
const dotenv = require("dotenv");

dotenv.config();

const app = express();
app.use(express.json({ limit: "1mb" }));

const healthRoutes = require("./routes/health.routes");
const taskRoutes = require("./routes/task.routes");

app.use("/", healthRoutes);
app.use("/api/tasks", taskRoutes);

// Consistent response for malformed JSON and unexpected errors.
app.use((err, req, res, next) => {
  if (err instanceof SyntaxError && err.status === 400 && "body" in err) {
    return res.status(400).json({ success: false, message: "Request body contains invalid JSON." });
  }
  console.error(err);
  return res.status(500).json({ success: false, message: "Internal server error." });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
