'use strict';

var cluster = require('cluster');

if (cluster.isMaster) {
    for (var i = 0; i < require('os').cpus().length; ++i) {
        cluster.fork();
    }
} else {
    var assert = require('assert');
    var express = require('express');
    var app = express();

    var ip = require('ip');
    var geoip = require('geoip-lite');

    app.use(function (req, res, next) {
        var geo = geoip.lookup(ip.isPrivate(req.ip) ? '8.8.8.8' : req.ip);
        console.log('geo', geo);
        res.status(200).json(geo);
    });

    app.use(function (req, res, next) {
        res.send(404);
    });

    app.use(function (err, req, res, next) {
        res.send(500);
    });

    assert(process.env.PORT, 'process.env.PORT required');
    app.listen(process.env.PORT, function (err) {
        console.log('listening to port ' + process.env.PORT, err);
    });
}