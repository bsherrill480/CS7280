/**
 * Created by brian on 6/22/17.
 */
var express = require('express');
var app = express();

// Serve up content from public directory
app.use(express.static(__dirname + '/public'));

app.listen(process.env.PORT || 3000);