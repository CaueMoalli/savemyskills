const express = require('express');
const app = express();
const bcrypt = require('bcrypt');

// To start the server on terminal: npm run authDevStart

app.use(express.json());

// Users will be on a MySQL databse on final project
const users = [];

app.get('/users', (req, res) => {
  res.json(users);
});

// Selects the pair "user/password", then adds the salt (crypto) to the password,
// then saves the hashed password with the respective user.
app.post('/users', async (req, res) => {
  try {
    const salt = await bcrypt.genSalt();
    const hashedPassword = await bcrypt.hash(req.body.password, salt);
    const user = { name: req.body.name, password: hashedPassword };
    users.push(user);
    res.status(201).send();
  } catch {
    res.status(500).send();
  }
});

// Login simulation.
app.post('/users/login', async (req, res) => {
  const user = users.find((user) => user.name === req.body.name);
  if (user == null) {
    return res.status(400).send('Cannot fund user');
  }
  try {
    if (await bcrypt.compare(req.body.password, user.password)) {
      res.send('Succces! User and Password matches!');
    } else {
      res.send('Not allowed. User and Password does not match');
    }
  } catch {
    res.status(500).send();
  }
});

app.listen(3000);
