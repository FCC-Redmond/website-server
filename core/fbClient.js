'use strict';

const { Facebook, FacebookApiException } = require('fb');
let secrets = require('../secrets/secrets.js');



let fbClient = {};
let fb;

fbClient.init = () => {
    return new Promise((resolve, reject) => {
        fb = new Facebook(secrets.facebook);
        fb.api('oauth/access_token', {
            client_id: secrets.facebook.appID,
            client_secret: secrets.facebook.appSecret,
            grant_type: 'client_credentials'
        }, res => {
            if (!res || res.error) {
                !res ? reject('Error occurred') : reject(res.error);
            } else {
                resolve(res.access_token);
            }
        });
    });
};

fbClient.getEventsFromGroup = (groupID, accessToken) => {
    return new Promise((resolve, reject) => {
        fb.api("/" + groupID + "/events?access_token="+ accessToken, res => {
            if (!res || res.error) {
                !res ? reject('Error occurred') : reject(res.error);
            } else {
                resolve(res);
            }
        });
    });
};

module.exports = fbClient;
