//SQL Server
const sql = require("mssql/msnodesqlv8");
// My Sql
const mysql = require("mysql")

function getConnection() {
  try {
    return new sql.ConnectionPool({
      database: "Invoices",
      server: "(localdb)\\MSSQLLocalDB",
      driver: "msnodesqlv8",
      options: {
        trustedConnection: true,
      },
    });
  } catch (error) {
    console.log("Error get connectinString");
  }
}

function getMySqlConnection() {
  try {
    return new mysql.createPool({
      connectionLimit : 100, //important
      database: "Invoices",
      user:'root',
      password: '49bcrfem',
      host: "localhost",
      debug:false,
    });
  } catch (error) {
    console.log("Error get MySql connectinString");
  }
}

// module.exports.getConnection = getConnection;
// module.exports.getMySqlConnection = getMySqlConnection;


module.exports = {
  getConnection,
  getMySqlConnection
}