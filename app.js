const db = require('./queries');
var crypto = require('crypto');
var secret = 'sk_test_104e2d6712930262f6f9b61b824459b84a2268b6';//process.env.SECRET_KEY;
const express = require('express')
const bodyParser = require('body-parser');
const port = 80
var app = express();
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: false }))

// Using Express
app.post("/webhook/paystack", function(req, res) {
    //validate event
    console.log('Hooking...1', req.body)
    var hash = crypto.createHmac('sha512', secret).update(JSON.stringify(req.body)).digest('hex');
    // db.getTransactionByReference('1630123381184')
    if (hash == req.headers['x-paystack-signature']) {
        console.log('Hooking...3')
    // Retrieve the request's body
    var event = req.body;
    // Do something with event  
    }
    console.log('Hooking...4')
    res.sendStatus(200);
});
app.listen(port, () => {
    console.log(`App running on port ${port}.`)
})
// app.listen(8080)