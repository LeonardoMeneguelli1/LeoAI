const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const db = require("../mockDB");

exports.register = async (req, res) => {
  const { email, password } = req.body;
  const hash = await bcrypt.hash(password, 10);
  db.users.push({ id: db.users.length + 1, email, password: hash });
  db.usage[email] = 0;
  res.json({ message: "Usuário registrado (mock)" });
};

exports.login = async (req, res) => {
  const { email, password } = req.body;
  const user = db.users.find(u => u.email === email);
  if (!user) return res.status(404).json({ error: "Usuário não encontrado" });

  const valid = await bcrypt.compare(password, user.password);
  if (!valid) return res.status(401).json({ error: "Senha inválida" });

  const token = jwt.sign({ email }, process.env.JWT_SECRET, { expiresIn: "7d" });
  console.log("✅ Token gerado para:", email);
  res.json({ token });
};
