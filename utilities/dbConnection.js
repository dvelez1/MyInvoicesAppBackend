const sql = require('mssql/msnodesqlv8')

function getConnection() {
        try {
            return new sql.ConnectionPool({
                database: 'Invoices',
                server: '(localdb)\\MSSQLLocalDB',
                driver: 'msnodesqlv8',
                options: {
                    trustedConnection: true
                }
            })

        } catch (error) {
            console.log("Error get connectinString")
        }
    }


module.exports.getConnection = getConnection;