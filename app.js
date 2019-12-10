const express = require('express')
const path = require('path')


var app = express();
app.use(express.static(path.join(__dirname, 'scripts')));


app.listen(3000, () => console.log('Listening on port 3000'));

app.get('/', function(req, res){
  res.sendFile(__dirname + '/index.html');
})

app.get('/scripts/:item', function(req, res){
  res.sendFile(path.join(__dirname, 'scripts', req.params.img))
})