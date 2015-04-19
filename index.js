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

    var geoip = require('geoip-lite');
    var cors = require('cors');

    app.enable('trust proxy');
    app.use(cors());
    app.use(function (req, res, next) {
        var geo = geoip.lookup(req.ip);
        console.log(req.ip, geo);
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