const express = require('express')
    , path = require('path')
    , rest = require('./rest') // think of removing CORS and setting up server with the same port
    , passport = require('passport')
    , SteamStrategy = require('passport-openid').Strategy
    , session = require('express-session')
    , SECRET = require('../config.json').SECRET

const server = express();

// PASSPORT
passport.serializeUser((user, done) => done(null, user.identifier))
passport.deserializeUser((identifier, done) => done(null, identifier))
passport.use(new SteamStrategy({
    providerURL: 'http://steamcommunity.com/openid',
    stateless: true,
    returnURL: 'http://localhost:80/auth/steam/return',
    realm: 'http://localhost:80/',
    apiKey: 'A6EB12A0BDD8F78538BE28180EE0A33E'
    }, (identifier, profile, done) => User.findByOpenID({ openId: identifier }, (err, user) => {
        if (err)
            return done(err)
        return done(null, user)
    })
));

// MIDDLEWARE
server.use((req, res, next) => {
    res.set({
      'Access-Control-Request-Method': 'GET',
      'Access-Control-Allow-Methods': 'OPTIONS, GET',
      'Access-Control-Allow-Headers': '*',
      'Access-Control-Allow-Origin': '*'
    });
    next()
})
server.use('/', express.static(path.join(__dirname, '/..', 'build')))
server.use('/rest', rest)
server.use(passport.initialize())
server.use(passport.session())
server.use(session({
    secret: SECRET,
    name: Date.now(),
    resave: false,
    saveUninitialized: true
  }))


ensureAuthentication = (req, res, next) => {
    if (req.isAuthenticated())
        return next()
    res.redirect('/')
}


module.exports = server;