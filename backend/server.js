require("dotenv").config();
const express = require("express");
const cors = require("cors");

const app = express();
app.use(cors());
app.use(express.json());

// Porta definida no .env
const PORT = process.env.PORT || 4001;

// Rotas
const authRoutes = require("./routes/auth");
const aiRoutes = require("./routes/ai");
const historyRoutes = require("./routes/history");

app.use("/auth", authRoutes);
app.use("/ai", aiRoutes);
app.use("/history", historyRoutes);

app.listen(PORT, () => {
  console.log(`Backend rodando na porta ${PORT}`);
});
