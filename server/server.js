const express = require('express');
const app = express();

const database = require('./database');

app.use(express.json())

app.options('/*', function (req, res) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader('Access-Control-Allow-Methods', '*');
  res.setHeader("Access-Control-Allow-Headers", "*");
  res.end();
});

app.get('/players/list', async (req, res) => {
  let results = await database.query("SELECT * FROM Players;");
  res.set('Access-Control-Allow-Origin', '*');
  res.send(results);
})

app.get('/players/*/properties', async (req, res) => {
  let results = await database.query(`SELECT propName, price, color FROM Ownership NATURAL JOIN Properties WHERE playerName="${req.params[0]}" ORDER BY price;`);
  res.set('Access-Control-Allow-Origin', '*');
  res.send(results);
});

app.get('/events', async (req, res) => {
  let results = await database.query(`SELECT * FROM Events ORDER BY time`);
  res.set('Access-Control-Allow-Origin', '*');
  res.send(results);
});

app.post('/players/add', async (req, res) => {
  await database.query(`INSERT INTO Players VALUES("${req.body.name}", 15000000)`);
  res.set('Access-Control-Allow-Origin', '*');
  res.send(true);
})

app.delete('/players/remove', async (req, res) => {
  await database.query(`DELETE FROM Players WHERE name="${req.body.name}"`);
  res.set('Access-Control-Allow-Origin', '*');
  res.send(true);
})

let server = app.listen(8000, () => {
  let host = server.address().address
  let port = server.address().port

  console.log("App listening at http://%s:%s", host, port)
})
