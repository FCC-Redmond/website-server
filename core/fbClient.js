'use strict';

const {
    Facebook,
    FacebookApiException
} = require('fb');


let fbClient = {};
let fb;

fbClient.init = () => {
    return new Promise((resolve, reject) => {
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

};

fbClient.getEventsFromPage = (pageID, accessToken) => {
    return new Promise((resolve, reject) => {
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
