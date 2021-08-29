const Pool = require('pg').Pool
const pool = new Pool({
  user: 'postgres',
  host: 'localhost',
  database: 'tinkasave',
  password: 'cistern',
  port: 5432,
})

async function getPerson(personId) {
  const text = `SELECT * FROM transactions WHERE id = $1`;
  const values = [personId];
  return pool.query(text, values);
}

const getTransactionByReference = (reference) => {
  console.log('Reference', reference)
  pool.query('SELECT * FROM transactions WHERE reference = $1', [reference], (error, results) => {
    if (error) {
      throw error
    }
    console.log(results.rows)
    // response.status(200).json(results.rows)
  })
}

const updateTransaction = (request, response) => {
  const id = parseInt(request.params.id)
  const { status } = request.body

  pool.query('UPDATE transactions SET status = $1 WHERE id = $2', [status, id],
    (error, results) => {
      if (error) {
        throw error
      }
      response.status(200).send(`User modified with ID: ${id}`)
    }
  )
}

module.exports = {
  getPerson,
  getTransactionByReference,
  updateTransaction,
}
