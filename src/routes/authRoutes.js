const express = require('express');
const mysql = require('mysql');
const dbconfig = require('../config/database');
const connection = mysql.createConnection(dbconfig.connection)
const passport = require('passport');
const debug = require('debug')('app:authRoutes');
const bcrypt = require('bcrypt-nodejs');

module.exports = function(app, passport) {


    app.get('/',isLoggedIn,function(req,res){
        var row = [];
        var row2=[];
        connection.query('select * from users where id = ?',[req.user.id], function (err, rows) {
            if (err) {
                console.log(err);
            } else {
                if (rows.length) {
                    for (var i = 0, len = rows.length; i < len; i++) {
                        row[i] = rows[i];

                    }
                }
                console.log(row);

            }

            res.render('index.ejs', {rows : row}); // user.ejs ye gönderiyoruz .
        });
    });

    app.get('/login', function(req, res) {

        res.render('login.ejs',{ message: req.flash('loginMessage') });

    });

    app.get('/signup', function(req, res){
        res.render('signup.ejs',{message: req.flash('signupMessage')});
      });

    app.post('/signup', passport.authenticate('local-signup', {
            successRedirect: '/login',
            failureRedirect: '/signup',
            failureFlash : true
    }));

    app.post('/login', passport.authenticate('local-login', {
            successRedirect : '/',
            failureRedirect : '/login',
            failureFlash : true
        }),
        function(req, res) {
            console.log("hello");

            if (req.body.remember) {
              req.session.cookie.maxAge = 1000 * 60 * 3;
            } else {
              req.session.cookie.expires = false;
            }
        res.redirect('/');
    });
    app.get('/logout', function(req, res) {
        req.logout();
        res.redirect('/');
    });


    
    //edit user
    app.get('/profile', function(req, res, next){
        connection.query('SELECT * FROM users WHERE id = ?', req.query.id, function(err, rs){
            res.render('profile', {
                user: rs[0]
            });
        });
    });

    app.post('profile')


};

function isLoggedIn(req,res,next){
	if(req.isAuthenticated())
		return next();
	res.redirect('/login');
}
