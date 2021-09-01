var crypto = require('crypto');
var secret = 'sk_test_104e2d6712930262f6f9b61b824459b84a2268b6';//process.env.SECRET_KEY;
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
        if(json.event == 'charge.success'){
            try{
                const reference = json.data.reference;
                const response = await db.getTransactionByReference(reference);
                if(response.rows){
                    const transaction = response.rows[0];
                    if(transaction.buddie_id !== null){
                        const target = 'buddie';
                        const buddieID = transaction.buddie_id;
                        let savings = await db.getTotalSavings(target, buddieID);
                        let withdrawal = await db.getTotalWithdrawal(target, buddieID);
                        let interest = await db.getTotalInterest(target, buddieID);
                        let totalSavings = (savings.rows[0].sum !== null ? savings.rows[0].sum : 0) + transaction.amount;
                        let balance = (totalSavings + (interest.rows[0].sum !== null ? 
                                interest.rows[0].sum : 0)) - (withdrawal.rows[0].sum != null ? withdrawal.rows[0].sum : 0)
                        // await db.beginTransaction();
                        // await db.updateSaving(target, buddieID, totalSavings, balance);
                        await db.updateTransaction(transaction.id, 'Completed');
                        // await db.commitTransaction();
                        res.sendStatus(200);
                    }else if(transaction.group_id !== null){
                        let target = 'member';
                        const memberID = transaction.member_id;
                        let savings = await db.getTotalSavings(target, memberID);
                        let withdrawal = await db.getTotalWithdrawal(target, memberID);
                        let interest = await db.getTotalInterest(target, memberID);
                        let totalSavings = (savings.rows[0].sum !== null ? savings.rows[0].sum : 0) + transaction.amount;
                        let balance = (totalSavings + (interest.rows[0].sum !== null ? 
                                interest.rows[0].sum : 0)) - (withdrawal.rows[0].sum != null ? withdrawal.rows[0].sum : 0)
                        // await db.beginTransaction();
                        // await db.updateSaving(target, memberID, totalSavings, balance);
                        target = 'group';
                        const groupID = transaction.group_id;
                        savings = await db.getTotalSavings(target, groupID);
                        withdrawal = await db.getTotalWithdrawal(target, groupID);
                        interest = await db.getTotalInterest(target, groupID);
                        totalSavings = (savings.rows[0].sum !== null ? savings.rows[0].sum : 0) + transaction.amount;
                        balance = (totalSavings + (interest.rows[0].sum !== null ? 
                                interest.rows[0].sum : 0)) - (withdrawal.rows[0].sum != null ? withdrawal.rows[0].sum : 0)
                        // await db.updateSaving(target, groupID, totalSavings, balance);
                        await db.updateTransaction(transaction.id, 'Completed');
                        // await db.commitTransaction();
                        res.sendStatus(200);
                    }else if(transaction.smooth_id !== null){
                        const target = 'smooth';
                        const smoothID = transaction.smooth_id;
                        let savings = await db.getTotalSavings(target, smoothID);
                        let withdrawal = await db.getTotalWithdrawal(target, smoothID);
                        let interest = await db.getTotalInterest(target, smoothID);
                        let totalSavings = (savings.rows[0].sum !== null ? savings.rows[0].sum : 0) + transaction.amount;
                        let balance = (totalSavings + (interest.rows[0].sum !== null ? 
                                interest.rows[0].sum : 0)) - (withdrawal.rows[0].sum != null ? withdrawal.rows[0].sum : 0)
                        await db.beginTransaction();      
                        // await db.updateSaving(target, smoothID, totalSavings, balance);
                        await db.updateTransaction(transaction.id, 'Completed');
                        // await db.commitTransaction();
                        res.sendStatus(200);
                    }else if(transaction.kid_id !== null){
                        const target = 'kid';
                        const kidID = transaction.kid_id;
                        let savings = await db.getTotalSavings(target, kidID);
                        let withdrawal = await db.getTotalWithdrawal(target, kidID);
                        let interest = await db.getTotalInterest(target, kidID);
                        let totalSavings = (savings.rows[0].sum !== null ? savings.rows[0].sum : 0) + transaction.amount;
                        let balance = (totalSavings + (interest.rows[0].sum !== null ? 
                                interest.rows[0].sum : 0)) - (withdrawal.rows[0].sum != null ? withdrawal.rows[0].sum : 0)
                        // await db.beginTransaction();
                        // await db.updateSaving(target, kidID, totalSavings, balance);
                        await db.updateTransaction(transaction.id, 'Completed');
                        // await db.commitTransaction();
                        res.sendStatus(200);
                    }
                }
            }catch(error){
                await db.rollbackTransaction();
                await db.release();
                console.log('Database Error: ', error)
            }
        }
    }
    res.sendStatus(404);
});
app.listen(port, () => {
    console.log(`App running on port ${port}.`)
})