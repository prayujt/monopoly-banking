const mysql = require('mysql2/promise')

const mysql_user = {
  host: process.env.SQL_HOST,
  user: process.env.SQL_USER,
  password: process.env.SQL_PASSWORD,
  database: process.env.MONOPOLY_SQL_DATABASE
};

let connection = null;

const connect = async () => {
  connection = await mysql.createConnection(mysql_user, {
    multipleStatements: true,
  });
}

const query = async (query) => {
  if (connection == null) await connect();
  const [rows, fields] = await connection.execute(query);
  return rows;
}

module.exports = {
  connect: connect,
  query: query
}
