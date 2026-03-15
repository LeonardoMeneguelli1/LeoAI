const jwt = require("jsonwebtoken");

module.exports = (req, res, next) => {
  const authHeader = req.headers["authorization"];
  const token = authHeader?.split(" ")[1];
  
  console.log("Verificando autenticação...");
  console.log("   Authorization header:", authHeader ? "✓ Presente" : "✗ Ausente");
  
  if (!token) {
    console.log("Token ausente");
    return res.status(401).json({ error: "Token ausente" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    console.log("✅ Token válido para:", decoded.email);
    req.user = decoded;
    next();
  } catch (err) {
    console.log("Token inválido ou expirado:", err.message);
    res.status(401).json({ error: "Token inválido ou expirado" });
  }
};