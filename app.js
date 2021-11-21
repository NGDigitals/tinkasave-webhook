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
    console.log(`JSON Received ${json}.`)
    var hash = crypto.createHmac('sha512', secret).update(JSON.stringify(json)).digest('hex');
    if (hash == req.headers['x-paystack-signature']) {
        if(json.event == 'charge.success'){
            try{
                const reference = json.data.reference;
                console.log(`Data Ref ${reference}.`)
                const response = await db.getTransactionByReference(reference);
                console.log(`Data Response ${response}.`)
                if(response.rows){
                    const transaction = response.rows[0];
                    console.log(`Data Trans ${transaction}.`)
                    if(transaction !== undefined){
                        console.log(`Updating Trans...`)
                        if(transaction.buddie_id !== null && transaction.status !== 'Completed'){
                            console.log(`Updating Buddie...1`)
                            const target = 'buddie';
                            const buddieID = transaction.buddie_id;
                            let savings = await db.getTotalSavings(target, buddieID);
                            let withdrawal = await db.getTotalWithdrawal(target, buddieID);
                            console.log(`Updating Buddie...2`)
                            // let interest = await db.getTotalInterest(target, buddieID);
                            let totalSavings = (savings.rows[0].sum !== null ? savings.rows[0].sum : 0) + transaction.amount;
                            console.log(`Updating Buddie...3`)
                            // let totalWithdrawal = 
                            //     withdrawal.rows[0].sum != null ? 
                            //     (withdrawal.rows[0].sum < 0 ? withdrawal.rows[0].sum : -withdrawal.rows[0].sum) : 0
                            // let balance = totalSavings + totalWithdrawal;
                            let balance = totalSavings + /*(interest.rows[0].sum !== null ? 
                                interest.rows[0].sum : 0)) +*/ (withdrawal.rows[0].sum != null ? withdrawal.rows[0].sum : 0)
                                console.log(`Updating Buddie...3`)
                            await db.beginTransaction();
                            await db.updateSaving(target, buddieID, totalSavings, balance);
                            console.log(`Updating Buddie...4`)
                            await db.updateTransaction(transaction.id, 'Completed');
                            await db.commitTransaction();
                            console.log(`Updating Buddie...5`)
                            res.sendStatus(200);
                        }else if(transaction.group_id !== null && transaction.status !== 'Completed'){
                            let target = 'member';
                            const memberID = transaction.member_id;
                            let savings = await db.getTotalSavings(target, memberID);
                            let withdrawal = await db.getTotalWithdrawal(target, memberID);
                            let interest = await db.getTotalInterest(target, memberID);
                            let totalSavings = (savings.rows[0].sum !== null ? savings.rows[0].sum : 0) + transaction.amount;
                            // let totalWithdrawal = 
                            //     withdrawal.rows[0].sum != null ? 
                            //     (withdrawal.rows[0].sum < 0 ? withdrawal.rows[0].sum : -withdrawal.rows[0].sum) : 0
                            // let balance = totalSavings + interest + totalWithdrawal;
                            let balance = (totalSavings + (interest.rows[0].sum !== null ? 
                                    interest.rows[0].sum : 0)) + (withdrawal.rows[0].sum != null ? withdrawal.rows[0].sum : 0)
                            await db.beginTransaction();
                            await db.updateSaving(target, memberID, totalSavings, balance);
                            target = 'group';
                            const groupID = transaction.group_id;
                            savings = await db.getTotalSavings(target, groupID);
                            withdrawal = await db.getTotalWithdrawal(target, groupID);
                            interest = await db.getTotalInterest(target, groupID);
                            totalSavings = (savings.rows[0].sum !== null ? savings.rows[0].sum : 0) + transaction.amount;
                            // totalWithdrawal = 
                            //     withdrawal.rows[0].sum != null ? 
                            //     (withdrawal.rows[0].sum < 0 ? withdrawal.rows[0].sum : -withdrawal.rows[0].sum) : 0
                            // balance = totalSavings + interest + totalWithdrawal;
                            balance = (totalSavings + (interest.rows[0].sum !== null ? 
                                    interest.rows[0].sum : 0)) - (withdrawal.rows[0].sum != null ? withdrawal.rows[0].sum : 0)
                            await db.updateSaving(target, groupID, totalSavings, balance);
                            await db.updateTransaction(transaction.id, 'Completed');
                            await db.commitTransaction();
                            res.sendStatus(200);
                        }else if(transaction.smooth_id !== null && transaction.status !== 'Completed'){
                            const target = 'smooth';
                            const smoothID = transaction.smooth_id;
                            let savings = await db.getTotalSavings(target, smoothID);
                            let withdrawal = await db.getTotalWithdrawal(target, smoothID);
                            let interest = await db.getTotalInterest(target, smoothID);
                            let totalSavings = (savings.rows[0].sum !== null ? savings.rows[0].sum : 0) + transaction.amount;
                            // let totalWithdrawal = 
                            //     withdrawal.rows[0].sum != null ? 
                            //     (withdrawal.rows[0].sum < 0 ? withdrawal.rows[0].sum : -withdrawal.rows[0].sum) : 0
                            // let balance = totalSavings + interest + totalWithdrawal;
                            let balance = (totalSavings + (interest.rows[0].sum !== null ? 
                                    interest.rows[0].sum : 0)) + (withdrawal.rows[0].sum != null ? withdrawal.rows[0].sum : 0)
                            await db.beginTransaction();      
                            await db.updateSaving(target, smoothID, totalSavings, balance);
                            await db.updateTransaction(transaction.id, 'Completed');
                            await db.commitTransaction();
                            res.sendStatus(200);
                        }else if(transaction.kid_id !== null && transaction.status !== 'Completed'){
                            const target = 'kid';
                            const kidID = transaction.kid_id;
                            let savings = await db.getTotalSavings(target, kidID);
                            let withdrawal = await db.getTotalWithdrawal(target, kidID);
                            let interest = await db.getTotalInterest(target, kidID);
                            let totalSavings = (savings.rows[0].sum !== null ? savings.rows[0].sum : 0) + transaction.amount;
                            // let totalWithdrawal = 
                            //     withdrawal.rows[0].sum != null ? 
                            //     (withdrawal.rows[0].sum < 0 ? withdrawal.rows[0].sum : -withdrawal.rows[0].sum) : 0
                            // let balance = totalSavings + interest + totalWithdrawal;
                            let balance = (totalSavings + (interest.rows[0].sum !== null ? 
                                    interest.rows[0].sum : 0)) + (withdrawal.rows[0].sum != null ? withdrawal.rows[0].sum : 0)
                            await db.beginTransaction();
                            await db.updateSaving(target, kidID, totalSavings, balance);
                            await db.updateTransaction(transaction.id, 'Completed');
                            await db.commitTransaction();
                            res.sendStatus(200);
                        }else
                            res.sendStatus(404);
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
            res.sendStatus(404);
    }else
        res.sendStatus(401);
});
app.listen(port, () => {
    console.log(`App running on port ${port}.`)
})