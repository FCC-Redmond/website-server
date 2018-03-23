'use strict';

<<<<<<< HEAD
const { Facebook, FacebookApiException } = require('fb');
let secrets = require('../secrets/secrets.js');
=======
const {
    Facebook,
    FacebookApiException
} = require('fb');

>>>>>>> 92f4442c843cfa6c2f42ba8db935fa797b35e9bb

let fbClient = {};
let fb;

fbClient.init = () => {
    return new Promise((resolve, reject) => {
<<<<<<< HEAD
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
=======
        try {
            fb = new Facebook(process.env.FBAPPSECRET);
            fb.api('oauth/access_token', {
                client_id: process.env.FBAPPID,
                client_secret: process.env.FBAPPSECRET,
                grant_type: 'client_credentials'
            }, res => {
                if (!res || res.error) {
                    !res ? reject('Error occurred') : reject(res.error);
                } else {
                    resolve(res.access_token);
                }
            });
        } catch (err) {
            reject(err);
        }
    });

>>>>>>> 92f4442c843cfa6c2f42ba8db935fa797b35e9bb
};

fbClient.getEventsFromPage = (pageID, accessToken) => {
    return new Promise((resolve, reject) => {
<<<<<<< HEAD
        fb.api("/" + pageID + "/events?access_token="+ accessToken , res => {
            if (!res || res.error) {
                !res ? reject('Error occurred') : reject(res.error);
            } else {
                resolve(res);
            }
        });
    });
};

module.exports = fbClient;
=======
        try {
            fb.api("/" + pageID + "/events?access_token=" + accessToken, res => {
                if (!res || res.error) {
                    !res ? reject('Error occurred') : reject(res.error);
                } else {
                    resolve(res);
                }
            });
        } catch (err) {
            reject(err);
        }
    });
};

module.exports = fbClient;
>>>>>>> 92f4442c843cfa6c2f42ba8db935fa797b35e9bb
