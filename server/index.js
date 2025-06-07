const express = require('express');
const cors = require('cors');
const app = express();
const port = 3000;

app.use(cors());
app.use(express.json());

let funds = [];

app.post('/funds', (req, res) => {
  const { userId, amount, description } = req.body;
  funds.push({ userId, amount, description, date: new Date() });
  res.json({ success: true });
});

app.get('/funds/balance', (req, res) => {
  const summary = {};
  for (const f of funds) {
    summary[f.userId] = (summary[f.userId] || 0) + f.amount;
  }

  const details = Object.entries(summary).map(([userId, amount]) => ({ userId, amount }));
  const total = details.reduce((acc, item) => acc + item.amount, 0);

  res.json({ total, details });
});

app.get('/funds/history', (req, res) => {
  res.json(funds);
});

app.listen(port, () => {
  console.log(`✅ API Server listening at http://localhost:${port}`);
});
