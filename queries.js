const Pool = require('pg').Pool
const ENV = 'dev'
const pool = ENV === 'prod' ? new Pool({
  user: 'DevMaster',
  host: 'ec2-18-217-115-210.us-east-2.compute.amazonaws.com',
  database: 'tinkasave',
  password: 'Cistern#_1',
  port: 6432,
}) : (ENV === 'test' ? new Pool({
  user: 'DevMaster',
  host: 'ec2-18-217-115-210.us-east-2.compute.amazonaws.com',
  database: 'tinkasave',
  password: 'Cistern#_1',
  port: 6432,
}) : new Pool({
  user: 'postgres',
  host: 'localhost',
  database: 'tinkasave',
  password: 'cistern',
  port: 5432,
}));

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

const updateSaving = async (target, ID, savings, balance) => {
  if(target === 'member')
    return pool.query('UPDATE groups_' + target + 's SET total_savings = $2, balance = $3 WHERE id = $1', [ID, savings, balance]);
  else
  return pool.query('UPDATE ' + target + 's SET total_savings = $2, balance = $3 WHERE id = $1', [ID, savings, balance]);
}

// const getTotalGroupSavings = async (ID) => {
//   return pool.query('SELECT SUM(amount) FROM transactions WHERE group_id = $1 AND status = \'Completed\' AND amount > 0', [ID]);
// }

// const getTotalGroupWithdrawal = async (ID) => {
//   return pool.query('SELECT SUM(amount) FROM transactions WHERE group_id = $1 AND status = \'Completed\' AND amount < 0', [ID]);
// }

// const getTotalGroupInterest = async (ID) => {
//   return pool.query('SELECT SUM(amount) FROM interests WHERE group_id = $1', [ID]);
// }

// const updateGroup = async (ID, savings, balance) => {
//   return pool.query('UPDATE groups SET total_savings = $2, balance = $3 WHERE id = $1', [ID, savings, balance]);
// }

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
  // getTotalGroupSavings,
  // getTotalGroupInterest,
  // getTotalGroupWithdrawal,
  // updateGroup,
  updateTransaction,
}
