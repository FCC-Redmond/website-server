'use strict';

var app = app || {};

const https = require('https');
const querystring = require('querystring');

(module => {
    const gitHubClient = {};
    let requestPath = {
        "login": "/login/oauth"
    };

    gitHubClient.login = (code, state) => {

        return new Promise((resolve, reject) => {
            let parameters = querystring.stringify({
                "client_id": process.env.gitHubClientId,
                "client_secret": process.env.gitHubClientSecret,
                "code": code,
                "state": state //unguessable random string provide with authorize call 
            });
            let options = {
                hostname: 'api.github.com',
                port: 443,
                path: requestPath.login + '/' + parameters,
                method: 'POST',
                headers: {
                    'accept': 'application/json'
                }
            };
            https.request(options, (res) => {
                let response = '';
                res.on('data', (d) => {
                    response += d;
                });
                res.on('end', () => {
                    resolve(response);
                });
                res.on('error', (err) => {
                    reject(err);
                });
            });
        });
    }

    module.gitHubClient = gitHubClient;
})(app);
