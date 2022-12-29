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

app.get('/properties', async (req, res) => {
  let results = await database.query("SELECT * FROM Properties;");
  res.set('Access-Control-Allow-Origin', '*');
  res.send(results);
})

app.get('/properties/owned', async (req, res) => {
  let results = await database.query("SELECT * FROM Properties NATURAL JOIN Ownership;");
  res.set('Access-Control-Allow-Origin', '*');
  res.send(results);
})

app.get('/properties/unowned', async (req, res) => {
  let results = await database.query("SELECT Properties.propName, price FROM Properties LEFT JOIN Ownership ON Ownership.propName = Properties.propName WHERE Ownership.propName IS NULL;");
  res.set('Access-Control-Allow-Origin', '*');
  res.send(results);
})

app.get('/properties/*', async (req, res) => {
  let results = await database.query(`SELECT * FROM Properties NATURAL JOIN Ownership WHERE propName = "${req.params[0]}"`)
  res.set('Access-Control-Allow-Origin', '*');
  res.send(results[0]);
});

app.get('/players', async (req, res) => {
  let results = await database.query("SELECT * FROM Players;");
  res.set('Access-Control-Allow-Origin', '*');
  res.send(results);
})

app.get('/players/*/properties', async (req, res) => {
  let results = await database.query(`SELECT propName, price, mortgaged, color FROM Ownership NATURAL JOIN Properties WHERE playerName="${req.params[0]}" ORDER BY price;`);
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

app.post('/players/add_money', async (req, res) => {
  await database.query(changeMoneyAmountQuery(req.body.name, req.body.amount));
  await addEvent(`${req.body.name} had $${Math.abs(req.body.amount).toLocaleString('en-US')} ${req.body.amount <= 0 ? 'subtracted from' : 'added to'} his account.`, `${req.body.amount <= 0 ? 'red' : 'green'}`);
  res.set('Access-Control-Allow-Origin', '*');
  res.send(true);
});

app.post('/players/cross_go', async (req, res) => {
  await database.query(changeMoneyAmountQuery(req.body.name, 2000000));
  await addEvent(`${req.body.name} crossed go.`, 'green');
  res.set('Access-Control-Allow-Origin', '*');
  res.send(true);
});

app.post('/players/buy_property', async (req, res) => {
  res.set('Access-Control-Allow-Origin', '*');
  let row = await database.query(`SELECT price FROM Properties WHERE propName="${req.body.propertyName}"`);
  try {
    await database.query(`INSERT INTO Ownership VALUES("${req.body.propertyName}", "${req.body.name}", 0, false);`);
    await database.query(changeMoneyAmountQuery(req.body.name, -row[0]['price']));
    await addEvent(`${req.body.name} bought ${req.body.propertyName} for $${Math.abs(row[0]['price']).toLocaleString('en-US')}.`, 'red');
    res.send(true);
  }
  catch {
    res.send(false)
  }
});

app.post('/players/*/pay_rent', async (req, res) => {
  res.set('Access-Control-Allow-Origin', '*');
  let propertyData = await database.query(`SELECT * FROM Properties NATURAL JOIN Ownership WHERE propName="${req.body.propertyName}"`);
  let numHouses = propertyData[0]['numHouses'];
  let rent = 0;

  if (req.body.mortgaged === 1) {
    res.send(false);
    return;
  }
  if (req.body.diceRoll !== null) {
    let results = await database.query(`SELECT COUNT(propName) count FROM Ownership NATURAL JOIN Properties WHERE playerName="${propertyData[0]['playerName']}" AND propName LIKE '%Service%';`);
    if (results[0]['count'] === 1) rent = req.body.diceRoll * 40000
    else rent = req.body.diceRoll * 100000
  }
  else if (numHouses === 0) rent = propertyData[0]['rent'];
  else if (numHouses < 5) rent = propertyData[0][numHouses + 'hRent'];
  else rent = propertyData[0]['hotelRent'];

  let owner = propertyData[0]['playerName'];
  let renter = req.params[0];

  if (owner === renter) {
    res.send(false);
    return;
  }

  try {
    await database.query(changeMoneyAmountQuery(renter, -rent));
    await database.query(changeMoneyAmountQuery(owner, rent));
  }
  catch {
    res.send(false);
  }

  await addEvent(`${renter} paid ${owner} $${rent.toLocaleString('en-US')} in rent at ${req.body.propertyName}.`, 'orange');

  res.send(true);
});

app.post('/properties/*/houses', async (req, res) => {
  await database.query(`UPDATE Ownership SET numHouses=(SELECT numHouses WHERE propName="${req.params[0]}") + ${req.body.numHouses} WHERE propName="${req.params[0]}"`);
  let propertyData = await database.query(`SELECT playerName, housePrice FROM Properties NATURAL JOIN Ownership WHERE propName="${req.params[0]}"`);
  let player = propertyData[0]['playerName'];
  let price = propertyData[0]['housePrice'] * req.body.numHouses;
  if (req.body.numHouses < 0) price = price/2;

  await database.query(changeMoneyAmountQuery(player, -price));

  await addEvent(`${player} ${req.body.numHouses > 0 ? 'bought' : 'sold'} ${Math.abs(req.body.numHouses)} houses on ${req.params[0]} for $${Math.abs(price).toLocaleString('en-US')}.`, 'brown');
  res.set('Access-Control-Allow-Origin', '*');
  res.send(true);
});

app.post('/properties/*/mortgage', async (req, res) => {
  let propertyData = await database.query(`SELECT playerName, mortgageValue, mortgaged FROM Properties NATURAL JOIN Ownership WHERE propName="${req.params[0]}"`);
  let mortgaged = propertyData[0]['mortgaged'];
  await database.query(`UPDATE Ownership SET mortgaged=${1-mortgaged} WHERE propName="${req.params[0]}"`);

  let player = propertyData[0]['playerName'];
  let value = (mortgaged === 0) ? propertyData[0]['mortgageValue'] : 1.1 * propertyData[0]['mortgageValue'];

  await database.query(changeMoneyAmountQuery(player, (mortgaged === 0) ? value : -value));

  await addEvent(`${player} ${mortgaged === 0 ? 'mortgaged' : 'un-mortgaged'} ${req.params[0]} for $${Math.abs(value).toLocaleString('en-US')}.`, 'brown');
  res.set('Access-Control-Allow-Origin', '*');
  res.send(true);
});

app.post('/trade', async (req, res) => {
  let player1Properties = req.body.player1Properties;
  let player2Properties = req.body.player2Properties;
  let player1Name = req.body.player1Name;
  let player2Name = req.body.player2Name;
  let amount = req.body.amount;

  player1Properties.forEach(async (property) => {
    await database.query(`UPDATE Ownership SET playerName="${player2Name}" WHERE propName="${property}"`);
  });

  player2Properties.forEach(async (property) => {
    await database.query(`UPDATE Ownership SET playerName="${player1Name}" WHERE propName="${property}"`);
  });

  await database.query(changeMoneyAmountQuery(player1Name, amount));
  await database.query(changeMoneyAmountQuery(player2Name, -amount));

  await addEvent(`${player1Name} traded ${player1Properties.join()} ${(amount < 0) ? "and $" + Math.abs(amount).toLocaleString('en-US') : ""} to ${player2Name} for ${(player2Properties.length !== 0) ? player2Properties.join(): ""}${(amount >= 0 && player2Properties.length !== 0) ? " and $" + Math.abs(amount).toLocaleString('en-US') : ""}${(amount >= 0 && player2Properties.length === 0) ? "$" + Math.abs(amount).toLocaleString('en-US') : ""}.`, 'blue');
  res.set('Access-Control-Allow-Origin', '*');
  res.send(true);
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
