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

const changeMoneyAmountQuery = (name, amount) => {
   return `UPDATE Players SET balance=(SELECT balance WHERE name="${name}") + ${amount} WHERE name="${name}";`;
}

const addEvent = async (event, color) => {
  let result = await database.query(`INSERT INTO Events(event, color) VALUES("${event}", "${color}")`);
  return result;
}

// Get Requests

app.get('/reset', async (req, res) => {
  await database.query("DELETE FROM Players;");
  await database.query("DELETE FROM Ownership;");
  await database.query("DELETE FROM Events;");
  await database.query("INSERT INTO Events(event, color) VALUES(\"Game started!\", \"green\")");
  res.set('Access-Control-Allow-Origin', '*');
  res.send(true);
})

app.get('/properties/list', async (req, res) => {
  let results = await database.query("SELECT * FROM Properties;");
  res.set('Access-Control-Allow-Origin', '*');
  res.send(results);
})

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
  let results = await database.query(`SELECT * FROM Events ORDER BY time DESC;`);
  res.set('Access-Control-Allow-Origin', '*');
  res.send(results);
});


// Post Requests

app.post('/players/add', async (req, res) => {
  await database.query(`INSERT INTO Players VALUES("${req.body.name}", 15000000);`);
  res.set('Access-Control-Allow-Origin', '*');
  res.send(true);
});

app.post('/players/add', async (req, res) => {
  await database.query(`INSERT INTO Players VALUES("${req.body.name}", 15000000);`);
  res.set('Access-Control-Allow-Origin', '*');
  res.send(true);
});

app.post('/players/cross_go', async (req, res) => {
  await database.query(changeMoneyAmountQuery(req.body.name, 2000000));
  await addEvent(`${req.body.name} crossed go!`, 'green');
  res.set('Access-Control-Allow-Origin', '*');
  res.send(true);
});

app.post('/players/buy_property', async (req, res) => {
  res.set('Access-Control-Allow-Origin', '*');
  let row = await database.query(`SELECT price FROM Properties WHERE propName="${req.body.propertyName}"`);
  await database.query(changeMoneyAmountQuery(req.body.name, -row[0]['price']));
  try {
    await database.query(`INSERT INTO Ownership VALUES("${req.body.propertyName}", "${req.body.name}");`);
    await addEvent(`${req.body.name} bought ${req.body.propertyName} for ${row[0]['price']}!`, 'red');
    res.send(true);
  }
  catch {
    res.send(false)
  }
});

// Delete Requests

app.delete('/players/remove', async (req, res) => {
  await database.query(`DELETE FROM Players WHERE name="${req.body.name}";`);
  res.set('Access-Control-Allow-Origin', '*');
  res.send(true);
});


let server = app.listen(8000, () => {
  let host = server.address().address
  let port = server.address().port

  console.log("App listening at http://%s:%s", host, port)
});
