/* eslint no-console:off */
const express = require ('express');
const bodyParser = require ('body-parser');
const cookieParser = require ('cookie-parser');
const expressSession = require ('express-session');
const fs = require ('fs');
const path = require ('path');
//const passport = require ('passport');
//const auth = require ('./auth');
//const db = require ('./db');
const routes = require ('./routes');

var https = require('https');
var http = require('http');

var sslPath = '/etc/letsencrypt/live/movementvote.org/';

var SSL_PORT = 4000;

// the secret for the session, should be set in an environment variable
// some random text used as a placeholder for dev
const sessionSecret = process.env.SESSION_SECRET || 'randomtext_yueierp';

// ensure HTTPS is used for all interactions
const httpsOnly = (req, res, next) => {
  if (req.headers['x-forwarded-proto'] &&
    req.headers['x-forwarded-proto'] !== 'https') {
    return res.redirect (['https://', req.hostname, req.url].join (''));
  } else {
    return next ();
  }
};

function start (port) {
  return new Promise ((resolve, reject) => {
    console.log ('Starting server');
    try {
      const app = express ();

      // if production deployment, only allow https connections
      if (process.env.NODE_ENV === 'production') {
        app.use (httpsOnly);
      }

      // set up HTTP parsers and session manager
      app.use (cookieParser ());
      app.use (bodyParser.json ());
      app.use (bodyParser.urlencoded ({ extended: true }));
      app.use (expressSession ({
        secret: sessionSecret,
        saveUninitialized: true,
        resave: true,
      }));

      // set up passport authentication, attach to express session manager
      // auth.init ();
      // app.use (passport.initialize ());
      // app.use (passport.session ());

      // create server with HTML and REST routes
      routes.init (app);

      console.log ('back from routes');

      // handle zipped javascript content
      app.get ('*.js', (req, res) => {
        const file = path.join (__dirname, `public${req.path}.gz`);
        if (fs.existsSync (file)) {
          res.set ({
            'content-type': 'text/javascript',
            'content-encoding': 'gzip',
          });
          res.sendFile (file);
        } else {
          res.set ({
            'content-type': 'text/javascript',
          });
          res.sendFile (path.join (__dirname, `public${req.path}`));
        }
      });

      // static file handling
      app.use (express.static (path.join (__dirname, 'public')));

      // for not explicitly handled HTML routes, return root document
      app.use ('*', (req, res) => {
        res.sendFile (path.join (__dirname, 'public/index.html'));
      });

      var listening = (port) => {
        return () => {
          console.log (`Server listening on port ${port}`);
          resolve ();
        };
      };

      try {
        /*
          IMPORTANT NOTES:
           - Congratulations! Your certificate and chain have been saved at
             /etc/letsencrypt/live/movementvote.org/fullchain.pem. Your cert
             will expire on 2017-03-18. To obtain a new or tweaked version of
             this certificate in the future, simply run certbot-auto again. To
             non-interactively renew *all* of your certificates, run
             "certbot-auto renew"
           - If you lose your account credentials, you can recover through
             e-mails sent to victor.stone@gmail.com.
           - Your account credentials have been saved in your Certbot
             configuration directory at /etc/letsencrypt. You should make a
             secure backup of this folder now. This configuration directory will
             also contain certificates and private keys obtained by Certbot so
             making regular backups of this folder is ideal.
           - If you like Certbot, please consider supporting our work by:

             Donating to ISRG / Let's Encrypt:   https://letsencrypt.org/donate
             Donating to EFF:                    https://eff.org/donate-le
        */
          if( fs.statSync(sslPath).isDirectory() ) {
          var options = {
              key: fs.readFileSync(sslPath + 'privkey.pem'),
              cert: fs.readFileSync(sslPath + 'fullchain.pem')
          };
          https.createServer(options, app).listen(SSL_PORT,listening(SSL_PORT));
        }
      } catch(err) {
        console.log( 'wups catch: ' + err );
      }

      http.createServer(app).listen(port,listening(port));

    } catch (err)  {
      reject (err);
    }
  });
}

exports.start = start;
