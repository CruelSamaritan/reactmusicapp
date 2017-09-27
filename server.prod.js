var express = require('express');
var app = express();

app.set('port', (process.env.PORT || 8080));

app.use(express.static(__dirname + '/public'));

app.get('/', function(req, res) {
    res.sendFile(__dirname + '/index.html');
});

//app.listen(process.env.PORT || 8081);
app.listen(app.get('port'), function() {
    console.log(`Production server at ${__dirname} is running on port: ${app.get('port')}`);
});
