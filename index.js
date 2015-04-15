'use strict';

var express = require('express');
var app = express();

var ip = require('ip');
var geoip = require('geoip-lite');

app.use(function (req, res, next) {
    var geo = geoip.lookup(ip.isPrivate(req.ip) ? '8.8.8.8' : req.ip);
    res.status(200).send(geo);
});

app.use(function (req, res, next) {
    res.send(404);
});

app.use(function (err, req, res, next) {
    res.send(500);
});

app.listen(process.env.PORT, function (err) {
    console.log('listening', err);
});