//#region SQL Server

// const sql = require("mssql/msnodesqlv8"); // TODO: For SQL Server
// function getConnection() {
//   try {
//     return new sql.ConnectionPool({
//       database: "Invoices",
//       server: "(localdb)\\MSSQLLocalDB",
//       driver: "msnodesqlv8",
//       options: {
//         trustedConnection: true,
//       },
//     });
//   } catch (error) {
//     console.log("Error get connectinString");
//   }
// }

//#endregion

// My Sql
const mysql = require("mysql")

// Local MySQL CONNECTION
// function getMySqlConnection() {
//   try {
//     return new mysql.createPool({
//       host: "",
//       user:'',
//       password: '',
//       database: "",
//       connectionLimit : , //important
//       debug:false,
//     });
//   } catch (error) {
//     console.log("Error get MySql connectinString");
//   }
// }

module.exports = {
  // getConnection,
  getMySqlConnection
}