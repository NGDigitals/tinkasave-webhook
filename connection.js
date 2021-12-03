const Pool = require('pg').Pool
const ENV = 'test'
const pool = ENV === 'prod' ? new Pool({
  user: 'TinkaMaster',
  host: 'tinkasave.cgmthkmsj5zb.eu-west-2.rds.amazonaws.com',
  database: 'tinkasave-prod',
  password: 'Cistern#_1',
  port: 5432,
}) : (ENV === 'test' ? new Pool({
  user: 'TinkaMaster',
  host: 'tinkasave.cgmthkmsj5zb.eu-west-2.rds.amazonaws.com',
  database: 'tinkasave-test',
  password: 'Cistern#_1',
  port: 5432,
}) : new Pool({
  user: 'postgres',
  host: 'localhost',
  database: 'tinkasave',
  password: 'cistern',
  port: 5432,
}));

const beginTransaction = async () => {
  return pool.query('BEGIN');
}

const commitTransaction = async () => {
  return pool.query('COMMIT');
}

const rollbackTransaction = async () => {
  return pool.query('ROLLBACK');
}

const release = async () => {
  return pool.release();
}

const getTransactionByReference = async (reference) => {
  return pool.query('SELECT * FROM transactions WHERE reference = $1', [reference]);
}

const getTotalSavings = async (target, ID) => {
  return pool.query('SELECT SUM(amount) FROM transactions WHERE ' + target + '_id = $1 AND status = \'Completed\' AND amount > 0', [ID]);
}

const getTotalWithdrawal = async (target, ID) => {
  return pool.query('SELECT SUM(amount) FROM transactions WHERE ' + target + '_id = $1 AND status = \'Completed\' AND amount < 0', [ID]);
}

const getTotalInterest = async (target, ID) => {
  return pool.query('SELECT SUM(amount) FROM interests WHERE ' + target + '_id = $1', [ID]);
}

const updateSaving = async (target, ID, total, balance) => {
  if(target === 'member')
    return pool.query('UPDATE groups_members SET total_savings = $2, balance = $3 WHERE id = $1', [ID, total, balance]);
  else if(target === 'group')
    return pool.query('UPDATE groups SET total_savings = $2 WHERE id = $1', [ID, total]);
  else
    return pool.query('UPDATE ' + target + 's SET total_savings = $2, balance = $3 WHERE id = $1', [ID, total, balance]);
}

const updateTransaction = async (ID, status) => {
  return pool.query('UPDATE transactions SET status = $2 WHERE id = $1', [ID, status]);
}

// const updateTransaction = (id) => {
//   const id = parseInt(request.params.id)
//   const { status } = request.body

//   pool.query('UPDATE transactions SET status = $1 WHERE id = $2', [status, id],
//     (error, results) => {
//       if (error) {
//         throw error
//       }
//       response.status(200).send(`User modified with ID: ${id}`)
//     }
//   )
// }

// const getTransactionByReference = (reference) => {
//   pool.query('SELECT * FROM transactions WHERE reference = $1', [reference], (error, results) => {
//     if (error) {
//       throw error
//     }
//     return results.rows
//     // response.status(200).json(results.rows[0])
//   })
// }

// const updateTransaction = (request, response) => {
//   const id = parseInt(request.params.id)
//   const { status } = request.body

//   pool.query('UPDATE transactions SET status = $1 WHERE id = $2', [status, id],
//     (error, results) => {
//       if (error) {
//         throw error
//       }
//       response.status(200).send(`User modified with ID: ${id}`)
//     }
//   )
// }

module.exports = {
  getTransactionByReference,
  getTotalSavings,
  getTotalInterest,
  getTotalWithdrawal,
  updateSaving,
  updateTransaction,
  beginTransaction,
  commitTransaction,
  rollbackTransaction,
  release
}
