var crypto = require('crypto');
var secret = 'sk_live_6f302e970dd45ae4164a338c3867986f3571203e';//process.env.SECRET_KEY;
const db = require('./connection');
const express = require('express')
const bodyParser = require('body-parser');
const port = 8080
var app = express();
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: false }))
app.post("/webhook/paystack", async (req, res) => {
    const json = req.body;
    var hash = crypto.createHmac('sha512', secret).update(JSON.stringify(json)).digest('hex');
    if (hash == req.headers['x-paystack-signature']) {
        try{
            const reference = json.data.reference;
            console.log(`Reference ${reference}`)
            const response = await db.getTransactionByReference(reference);
            if(response.rows){
                const transaction = response.rows[0];
                if(transaction !== undefined){
                    if(json.event === 'charge.success'){
                        if(transaction.airtime_id !== null && transaction.status !== 'Completed'){
                            const target = 'airtime';
                            const airtimeID = transaction.airtime_id;
                            let savings = await db.getTotalSavings(target, airtimeID);
                            let withdrawal = await db.getTotalWithdrawal(target, airtimeID);
                            let interest = await db.getTotalInterest(target, airtimeID);
                            let totalSavings = (savings.rows[0].sum !== null ? savings.rows[0].sum : 0) + transaction.amount;
                            let balance = (totalSavings + (interest.rows[0].sum !== null ? 
                                interest.rows[0].sum : 0)) + (withdrawal.rows[0].sum != null ? withdrawal.rows[0].sum : 0)
                            await db.beginTransaction();
                            await db.updateSaving(target, airtimeID, totalSavings, balance);
                            await db.updateTransaction(transaction.id, 'Completed');
                            await db.commitTransaction();
                        }else if(transaction.atm_id !== null && transaction.status !== 'Completed'){
                            const target = 'atm';
                            const atmID = transaction.atm_id;
                            let savings = await db.getTotalSavings(target, atmID);
                            let withdrawal = await db.getTotalWithdrawal(target, atmID);
                            let interest = await db.getTotalInterest(target, atmID);
                            let totalSavings = (savings.rows[0].sum !== null ? savings.rows[0].sum : 0) + transaction.amount;
                            let balance = (totalSavings + (interest.rows[0].sum !== null ? 
                                interest.rows[0].sum : 0)) + (withdrawal.rows[0].sum != null ? withdrawal.rows[0].sum : 0)
                            await db.beginTransaction();
                            await db.updateSaving(target, atmID, totalSavings, balance);
                            await db.updateTransaction(transaction.id, 'Completed');
                            await db.commitTransaction();
                        }else if(transaction.buddie_id !== null && transaction.status !== 'Completed'){
                            const target = 'buddie';
                            const buddieID = transaction.buddie_id;
                            let savings = await db.getTotalSavings(target, buddieID);
                            let withdrawal = await db.getTotalWithdrawal(target, buddieID);
                            let interest = await db.getTotalInterest(target, buddieID);
                            let totalSavings = (savings.rows[0].sum !== null ? savings.rows[0].sum : 0) + transaction.amount;
                            let balance = (totalSavings + (interest.rows[0].sum !== null ? 
                                interest.rows[0].sum : 0)) + (withdrawal.rows[0].sum != null ? withdrawal.rows[0].sum : 0)
                            await db.beginTransaction();
                            await db.updateSaving(target, buddieID, totalSavings, balance);
                            await db.updateTransaction(transaction.id, 'Completed');
                            await db.commitTransaction();
                        }else if(transaction.group_id !== null && transaction.status !== 'Completed'){
                            let target = 'member';
                            const memberID = transaction.member_id;
                            let savings = await db.getTotalSavings(target, memberID);
                            let withdrawal = await db.getTotalWithdrawal(target, memberID);
                            let interest = await db.getTotalInterest(target, memberID);
                            let totalSavings = (savings.rows[0].sum !== null ? savings.rows[0].sum : 0) + transaction.amount;
                            let balance = (totalSavings + (interest.rows[0].sum !== null ? 
                                    interest.rows[0].sum : 0)) + (withdrawal.rows[0].sum != null ? withdrawal.rows[0].sum : 0);
                            await db.beginTransaction();
                            await db.updateSaving(target, memberID, totalSavings, balance);
                            target = 'group';
                            const groupID = transaction.group_id;
                            savings = await db.getTotalSavings(target, groupID);
                            withdrawal = await db.getTotalWithdrawal(target, groupID);
                            interest = await db.getTotalInterest(target, groupID);
                            totalSavings = (savings.rows[0].sum !== null ? savings.rows[0].sum : 0) + transaction.amount;
                            balance = (totalSavings + (interest.rows[0].sum !== null ? 
                                    interest.rows[0].sum : 0)) - (withdrawal.rows[0].sum != null ? withdrawal.rows[0].sum : 0)
                            await db.updateSaving(target, groupID, totalSavings, balance);
                            await db.updateTransaction(transaction.id, 'Completed');
                            await db.commitTransaction();
                        }else if(transaction.smooth_id !== null && transaction.status !== 'Completed'){
                            const target = 'smooth';
                            const smoothID = transaction.smooth_id;
                            let savings = await db.getTotalSavings(target, smoothID);
                            let withdrawal = await db.getTotalWithdrawal(target, smoothID);
                            let interest = await db.getTotalInterest(target, smoothID);
                            let totalSavings = (savings.rows[0].sum !== null ? savings.rows[0].sum : 0) + transaction.amount;
                            let balance = (totalSavings + (interest.rows[0].sum !== null ? 
                                    interest.rows[0].sum : 0)) + (withdrawal.rows[0].sum != null ? withdrawal.rows[0].sum : 0)
                            await db.beginTransaction();      
                            await db.updateSaving(target, smoothID, totalSavings, balance);
                            await db.updateTransaction(transaction.id, 'Completed');
                            await db.commitTransaction();
                        }else if(transaction.kid_id !== null && transaction.status !== 'Completed'){
                            const target = 'kid';
                            const kidID = transaction.kid_id;
                            let savings = await db.getTotalSavings(target, kidID);
                            let withdrawal = await db.getTotalWithdrawal(target, kidID);
                            let interest = await db.getTotalInterest(target, kidID);
                            let totalSavings = (savings.rows[0].sum !== null ? savings.rows[0].sum : 0) + transaction.amount;
                            let balance = (totalSavings + (interest.rows[0].sum !== null ? 
                                    interest.rows[0].sum : 0)) + (withdrawal.rows[0].sum != null ? withdrawal.rows[0].sum : 0)
                            await db.beginTransaction();
                            await db.updateSaving(target, kidID, totalSavings, balance);
                            await db.updateTransaction(transaction.id, 'Completed');
                            await db.commitTransaction();
                        }else
                            await db.updateTransaction(transaction.id, 'Completed');
                    }else if(json.event === 'charge.failed'){
                        await db.updateTransaction(transaction.id, 'Failed');
                    }
                    res.sendStatus(200);
                }else
                    res.sendStatus(404);
            }else
                res.sendStatus(404);
        }catch(error){
            console.log(`Database Error ${error}.`)
            await db.rollbackTransaction();
            // await db.release();
            res.sendStatus(404);
        }
    }else
        res.sendStatus(401);
});
app.listen(port, () => {
    console.log(`App running on port ${port}.`)
})