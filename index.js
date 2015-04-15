'use strict';

var express = require('express');
var app = express();

var ip = require('ip');
var geoip = require('geoip-lite');

app.get('/', function (req, res, next) {
    var geo = geoip.lookup(ip.isPrivate(req.ip) ? '8.8.8.8' : req.ip);
    res.status(200).send(geo);
});

app.listen(process.env.PORT);