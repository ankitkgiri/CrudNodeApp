const express = require('express');
const bodyParser = require('body-parser')
const MongoClient = require('mongodb').MongoClient;
const app = express();

app.use(express.static('public'))
app.use(bodyParser.urlencoded({ extended: true }));
app.set('view engine', 'ejs');

app.use(bodyParser.json())

let db;
MongoClient.connect("mongodb+srv://ankitgiri:ankit123@cluster0.ew0ynvt.mongodb.net/?retryWrites=true&w=majority", (err, database) => {


    if (err) {
        return console.log(err);
    } else {
        db = database.db('Cluster0');
        app.listen(3000, function () { console.log('listening to 3000') });
    }
})


app.get('/', (req, res) => {

    let cursor = db.collection('quotes').find().toArray((err, result) => {
        if (err) return console.log(err)

        res.render('index.ejs', { quotes: result })

    });
})


console.log("Hello, World");

app.post('/quotes', (req, res) => {
    db.collection('quotes').insertOne(req.body, (err, result) => {
        if (err) return console.log(err)

        console.log("Saved to Database!");
        res.redirect('/');
    })
});


app.put('/quotes', (req, res) => {
    db.collection('quotes').findOneAndUpdate({ name: 'yoda' }, { $set: { name: req.body.name, quote: req.body.quote } }, { sort: { _id: -1 }, upsert: true }, (err, result) => { if (err) return res.send(err);    res.send(result) })
   // fetch({ /* request */ }).then(res => {  if (res.ok) return res.json()}).then(data => {  console.log(data);  window.location.reload(true)});
})


app.delete('/quotes', (req, res) => {
   db.collection('quotes').findOneAndDelete({name: req.body.name}, (err, result) => { if (err) return res.send(err);    res.send(result) })
})