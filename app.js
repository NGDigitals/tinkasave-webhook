const db = require('./queries');
var crypto = require('crypto');
var secret = 'sk_test_104e2d6712930262f6f9b61b824459b84a2268b6';//process.env.SECRET_KEY;
const express = require('express')
const bodyParser = require('body-parser');
const port = 8080
var app = express();
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: false }))
console.log('Welcome to Webhook')
// var json = {
//         event: 'charge.success',
//         data: {
//             id: 1294479537,
//             domain: 'test',
//             status: 'success',
//             reference: '1630209948780',
//             amount: 100000,
//             message: null,
//             gateway_response: 'Approved',
//             paid_at: '2021-08-29T04:05:50.000Z',
//             created_at: '2021-08-29T04:05:50.000Z',
//             channel: 'card',
//             currency: 'NGN',
//             ip_address: null,
//             metadata: '',
//             log: null,
//             fees: 1500,
//             fees_split: null,
//             authorization: {
//                 authorization_code: 'AUTH_ny5mxli7cy',
//                 bin: '408408',
//                 last4: '4081',
//                 exp_month: '08',
//                 exp_year: '2022',
//                 channel: 'card',
//                 card_type: 'visa ',
//                 bank: 'TEST BANK',
//                 country_code: 'NG',
//                 brand: 'visa',
//                 reusable: true,
//                 signature: 'SIG_zwzDblRMTxNyjbEJc3Ml',
//                 account_name: null
//             },
//             customer: {
//                 id: 49366529,
//                 first_name: null,
//                 last_name: null,
//                 email: 'ngdigitalsng@gmail.com',
//                 customer_code: 'CUS_7d5ifc10wr4v5mc',
//                 phone: null,
//                 metadata: null,
//                 risk_action: 'default',
//                 international_format_phone: null
//             },
//             plan: {},
//             subaccount: {},
//             split: {},
//             order_id: null,
//             paidAt: '2021-08-29T04:05:50.000Z',
//             requested_amount: 100000,
//             pos_transaction_data: null,
//             source: { type: 'api', source: 'merchant_api', identifier: null }
//         },
//         order: null,
//         business_name: 'TinkaSave'
//     };
// Using Express
app.post("/webhook/paystack", function(req, res) {
    const json = req.body;
    console.log('Hooking...1', json.event)
    var hash = crypto.createHmac('sha512', secret).update(JSON.stringify(json)).digest('hex');
    console.log('Hooking...2', hash)
    if (hash == req.headers['x-paystack-signature']) {
        console.log('Hooking...3')
        if(json.event === 'charge.success'){
            ;(async function() {
                const reference = json.data.reference
                const response = await db.getTransactionByReference(reference);
                if(response.rows){
                    const transaction = response.rows[0];
                    if(transaction.buddie_id !== null){
                        const target = 'buddie';
                        const buddieID = transaction.buddie_id;
                        try{
                            let savings = await db.getTotalSavings(target, buddieID);
                            let withdrawal = await db.getTotalWithdrawal(target, buddieID);
                            let interest = await db.getTotalInterest(target, buddieID);
                            let totalSavings = (savings.rows[0].sum !== null ? savings.rows[0].sum : 0) + transaction.amount;
                            let balance = (totalSavings + (interest.rows[0].sum !== null ? 
                                    interest.rows[0].sum : 0)) - (withdrawal.rows[0].sum != null ? withdrawal.rows[0].sum : 0)
                            console.log(target, savings.rows[0].sum, withdrawal.rows[0].sum, interest.rows[0].sum, totalSavings, balance)
                            await db.updateSaving(target, buddieID, totalSavings, balance);
                            await db.updateTransaction(transaction.id, 'Completed');
                            res.sendStatus(200);
                        }catch(error){
                            console.log('Buddie Error: ', error)
                        }
                    }else if(transaction.group_id !== null){
                        let target = 'member';
                        const memberID = transaction.member_id;
                        try{
                            let savings = await db.getTotalSavings(target, memberID);
                            let withdrawal = await db.getTotalWithdrawal(target, memberID);
                            let interest = await db.getTotalInterest(target, memberID);
                            let totalSavings = (savings.rows[0].sum !== null ? savings.rows[0].sum : 0) + transaction.amount;
                            let balance = (totalSavings + (interest.rows[0].sum !== null ? 
                                    interest.rows[0].sum : 0)) - (withdrawal.rows[0].sum != null ? withdrawal.rows[0].sum : 0)
                            console.log(target, savings.rows[0].sum, withdrawal.rows[0].sum, interest.rows[0].sum, totalSavings, balance)
                            await db.updateSaving(target, memberID, totalSavings, balance);
                            target = 'group';
                            const groupID = transaction.group_id;
                            savings = await db.getTotalSavings(target, groupID);
                            withdrawal = await db.getTotalWithdrawal(target, groupID);
                            interest = await db.getTotalInterest(target, groupID);
                            totalSavings = (savings.rows[0].sum !== null ? savings.rows[0].sum : 0) + transaction.amount;
                            balance = (totalSavings + (interest.rows[0].sum !== null ? 
                                    interest.rows[0].sum : 0)) - (withdrawal.rows[0].sum != null ? withdrawal.rows[0].sum : 0)
                            console.log(target, savings.rows[0].sum, withdrawal.rows[0].sum, interest.rows[0].sum, totalSavings, balance)
                            await db.updateSaving(target, groupID, totalSavings, balance);
                            await db.updateTransaction(transaction.id, 'Completed');
                            res.sendStatus(200);
                        }catch(error){
                            console.log('Buddie Error: ', error)
                        }
                    }else if(transaction.smooth_id !== null){
                        const target = 'smooth';
                        const smoothID = transaction.smooth_id;
                        try{
                            let savings = await db.getTotalSavings(target, smoothID);
                            let withdrawal = await db.getTotalWithdrawal(target, smoothID);
                            let interest = await db.getTotalInterest(target, smoothID);
                            let totalSavings = (savings.rows[0].sum !== null ? savings.rows[0].sum : 0) + transaction.amount;
                            let balance = (totalSavings + (interest.rows[0].sum !== null ? 
                                    interest.rows[0].sum : 0)) - (withdrawal.rows[0].sum != null ? withdrawal.rows[0].sum : 0)
                            console.log(target, savings.rows[0].sum, withdrawal.rows[0].sum, interest.rows[0].sum, totalSavings, balance)
                            await db.updateSaving(target, smoothID, totalSavings, balance);
                            await db.updateTransaction(transaction.id, 'Completed');
                            res.sendStatus(200);
                        }catch(error){
                            console.log('Buddie Error: ', error)
                        }
                    }else if(transaction.kid_id !== null){
                        const target = 'kid';
                        const kidID = transaction.kid_id;
                        try{
                            let savings = await db.getTotalSavings(target, kidID);
                            let withdrawal = await db.getTotalWithdrawal(target, kidID);
                            let interest = await db.getTotalInterest(target, kidID);
                            let totalSavings = (savings.rows[0].sum !== null ? savings.rows[0].sum : 0) + transaction.amount;
                            let balance = (totalSavings + (interest.rows[0].sum !== null ? 
                                    interest.rows[0].sum : 0)) - (withdrawal.rows[0].sum != null ? withdrawal.rows[0].sum : 0)
                            console.log(target, savings.rows[0].sum, withdrawal.rows[0].sum, interest.rows[0].sum, totalSavings, balance)
                            await db.updateSaving(target, kidID, totalSavings, balance);
                            await db.updateTransaction(transaction.id, 'Completed');
                            res.sendStatus(200);
                        }catch(error){
                            console.log('Buddie Error: ', error)
                        }
                    }
                }
            })()
        }
    }
});
app.listen(port, () => {
    console.log(`App running on port ${port}.`)
})
// app.listen(8080)
// {
//     event: 'charge.success',
//     data: {
//         id: 1294479537,
//         domain: 'test',
//         status: 'success',
//         reference: '1630209948780',
//         amount: 100000,
//         message: null,
//         gateway_response: 'Approved',
//         paid_at: '2021-08-29T04:05:50.000Z',
//         created_at: '2021-08-29T04:05:50.000Z',
//         channel: 'card',
//         currency: 'NGN',
//         ip_address: null,
//         metadata: '',
//         log: null,
//         fees: 1500,
//         fees_split: null,
//         authorization: {
//             authorization_code: 'AUTH_ny5mxli7cy',
//             bin: '408408',
//             last4: '4081',
//             exp_month: '08',
//             exp_year: '2022',
//             channel: 'card',
//             card_type: 'visa ',
//             bank: 'TEST BANK',
//             country_code: 'NG',
//             brand: 'visa',
//             reusable: true,
//             signature: 'SIG_zwzDblRMTxNyjbEJc3Ml',
//             account_name: null
//         },
//         customer: {
//             id: 49366529,
//             first_name: null,
//             last_name: null,
//             email: 'ngdigitalsng@gmail.com',
//             customer_code: 'CUS_7d5ifc10wr4v5mc',
//             phone: null,
//             metadata: null,
//             risk_action: 'default',
//             international_format_phone: null
//         },
//         plan: {},
//         subaccount: {},
//         split: {},
//         order_id: null,
//         paidAt: '2021-08-29T04:05:50.000Z',
//         requested_amount: 100000,
//         pos_transaction_data: null,
//         source: { type: 'api', source: 'merchant_api', identifier: null }
//     },
//     order: null,
//     business_name: 'TinkaSave'
// }