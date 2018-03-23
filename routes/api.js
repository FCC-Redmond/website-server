'use strict';

const express = require('express');
const router = express.Router();
const database = require('../model/member.js');
const fccEvents = require('../core/fbClient.js');
const config = require('../config.js');
/**
 * @apiDefine OnNotFoundError Resource not found error
 * 
 * @apiErrorExample Error-Response:
 *  HTTP/1.1 404 Not Found
 *   {
 *        "success": false,
 *        "error": "Not Found"
 *   }
 */

/**
 *  @api {get} /api/v0/members/ Request all members in database
 *  @apiName GetMembers
 *  @apiDescription Retrieves all members in database
 *  @apiGroup Members
 *
 *  @apiVersion 0.0.2
 *  
 *  @apiSuccess {String}   firstName   Firstname of member
 *  @apiSuccess {String}   lastName    LastName of member 
 *  @apiSuccess {String}   email       Email of member 
 *  @apiSuccess {Array}    skills      Skills listed by member
 *  @apiSuccess {String}   linkedInUrl LinkedIn profile URL of member
 *  @apiSuccess {String}   gitHubUrl   GitHub profile URL of member 
 *  @apiSuccess {String}   profileUrl  Profile path of user on FCC Redmond Site e.g. /member/teja
 *  @apiSuccess {Object}   _id         Database ID of the member
 * 
 *  @apiSuccess (Response body) {Boolean}   success   Boolean success indicator. True or False
 *  @apiSuccess (Response body) {String}    message   Success message with updated user ID
 *  @apiSuccess (Response body) {JSON}      data      Member profiles
 *  @apiSuccessExample Success-Response:
 *  HTTP/1.1 200 OK
 *  {"success":true,
 *   "message": "Found 2 members in database", 
 *      "data": [
 *              {
 *                   "skills": [
 *                   "JavaScript",
 *                   "NodeJs",
 *                   "ExpressJs",
 *                 "MongoDB"
 *               ],
 *               "_id": "5a78d098670168148c5ebb52",
 *               "lastName": "Kim",
 *               "firstName": "Amber",
 *               "linkedInUrl": "https://www.linkedin.com/in/amberkim",
 *               "gitHubUrl": "https://www.github.com/amber",
 *               "profileUrl": "/member/kim",
 *               "email": "amber@gmail.com",
 *               "addTS" "2018-02-08 11:37:02.104",
 *               "modifiedTS": "2018-02-08 11:37:02.104",
 *               "__V": 0
 * 
 *              },
 *              {
 *               "skills": [
 *                          "JavaScript",
 *                          "C#",
 *                          "Azure",
 *                          "NodeJs",
 *                          "ExpressJs",
 *                          "MongoDB",
 *                          "REDIS"
 *                          ],
 *                  "_id": "5a78d145670168148c5ebb54",
 *                  "lastName": "Teja",
 *                  "firstName": "Apoorva",
 *                  "linkedInUrl": "https://www.linkedin.com/in/apoorvateja",
 *                  "gitHubUrl": "https://www.github.com/kumbuT",
 *                  "profileUrl": "/member/teja",
 *                  "email": "apoorva.teja@gmail.com",
 *                  "addTS" "2018-02-08 11:37:02.104",
 *                  "modifiedTS": "2018-02-08 11:37:02.104",
 *                  "__V": 0
 *                  }
 *              ]
 * }
 *  @apiError NoMemberFound Empty Array returned if no members found
 *  @apiErrorExample Error-Response:   
 *  {
 *    "error": 500
 *   }
 * 
 *  @apiUse OnNotFoundError
 */

var getMembers = async function (req, res, next) {
    if ("skills" in req.query) {
        getMembersBySkills(req, res, next);
    } else {
        try {
            var list = await database.list();
            let message = "";
            switch (list.length) {
                case 0:
                    message = "No members in database";
                    break;
                case 1:
                    message = "Found 1 member in database";
                    break;
                default:
                    message = "Found " + list.length + " members in database";
                    break;
            }
            res.status(200).send({
                "success": true,
                "message": message,
                "data": list
            });
        } catch (err) {
            onError(res, err);
            console.error(err);
        }
    }

};

/**
 *  @api {get} /api/v0/members/:lName Request member info by last name
 *  @apiName getMemberByLastName
 *  @apiDescription Retrieves one member in database with the given last name. <i>Currently retrieves only one successful last name match.</i> 
 *  @apiGroup Members
 *
 *  @apiVersion 0.0.2
 * 
 *  @apiParam {String} lName Last Name of the member who's profile you want to retrieve
 *  
 *  @apiSuccess {String}   firstName   Firstname of member
 *  @apiSuccess {String}   lastName    LastName of member 
 *  @apiSuccess {String}   email       Email of member 
 *  @apiSuccess {Array}    skills      Skills listed by member
 *  @apiSuccess {String}   linkedInUrl LinkedIn profile URL of member
 *  @apiSuccess {String}   gitHubUrl   GitHub profile URL of member 
 *  @apiSuccess {String}   profileUrl  Profile path of user on FCC Redmond Site e.g. /member/teja
 *  @apiSuccess {Object}   _id         Database ID of the member
 * 
 *  @apiSuccess (Response body) {Boolean}   success   Boolean success indicator. True or False
 *  @apiSuccess (Response body) {String}    message   Success message with updated user ID
 *  @apiSuccess (Response body) {JSON}      data      Member profiles 
 * 
 *  @apiSuccessExample Success-Response:
 *  HTTP/1.1 200 OK
 *  {"success":true,
 *   "message": "Found 3 members in the database with the skills JavaScript",
 *   "data": [
 *              {
 *                   "skills": [
 *                   "JavaScript",
 *                   "NodeJs",
 *                   "ExpressJs",
 *                 "MongoDB"
 *               ],
 *               "_id": "5a78d098670168148c5ebb52",
 *               "lastName": "Kim",
 *               "firstName": "Amber",
 *               "linkedInUrl": "https://www.linkedin.com/in/amberkim",
 *               "gitHubUrl": "https://www.github.com/amber",
 *               "profileUrl": "/member/kim",
 *               "email": "amber@gmail.com"
 *               "addTS" "2018-02-08 11:37:02.104",
 *               "modifiedTS": "2018-02-08 11:37:02.104",
 *               "__V": 0
 *              }]
 * }
 *
 *  @apiError NoMemberFound  404 Response sent if no member with given last name exists
 *  @apiErrorExample Error-Response:   
 *    {
 *     "error": 404
 *    }
 * 
 *  @apiUse OnNotFoundError
 */

var getMemberByLastName = async function (req, res, next) {
    var lastName = req.params.lName;
    try {
        var member = await database.findMember(lastName);
        if (!member || member.length == 0) {
            res.status(200).send({
                "success": false,
                "message": 'No members with last name ' + lastName + ' found'
            });
        } else {
            res.status(200).send({
                "success": true,
                "message": "Found " + member.length + " member(s) with the last name " + lastName,
                "data": member
            });
        }


    } catch (err) {
        onError(res, err);
        console.error(err);
    }
};

/**
 *  @api {get} /api/v0/members?skills=:skills Request members with the specified skills
 *  @apiName getMemberBySkills
 *  @apiDescription Retrieves members with all the skills specified in the query string parameter "skills". <i>Note that skills query string parameter is a comma separated value of the skills and is case sensitive</i>
 *  @apiGroup Members
 *
 *  @apiVersion 0.0.2
 * 
 *  @apiParam {String} skills The skills you want to find members by
 *  
 *  @apiSuccess {String}   firstName   Firstname of member
 *  @apiSuccess {String}   lastName    LastName of member 
 *  @apiSuccess {String}   email       Email of member 
 *  @apiSuccess {Array}    skills      Skills listed by member
 *  @apiSuccess {String}   linkedInUrl LinkedIn profile URL of member
 *  @apiSuccess {String}   gitHubUrl   GitHub profile URL of member 
 *  @apiSuccess {String}   profileUrl  Profile path of user on FCC Redmond Site e.g. /member/teja
 *  @apiSuccess {Object}   _id         Database ID of the member
 * 
 *  @apiSuccess (Response body) {Boolean}   success   Boolean success indicator. True or False
 *  @apiSuccess (Response body) {String}    message   Success message with updated user ID
 *  @apiSuccess (Response body) {JSON}      data      Member profiles
 *  
 * @apiSuccessExample Success-Response:
 *  HTTP/1.1 200 OK
 *    {
 *       "success": true,
 *       "message": "Found 1 member in database with skills JavaScript"
 *         "data"  : {"skills": [
 *                         "JavaScript",
 *                         "C#",
 *                         "Azure",
 *                         "NodeJs",
 *                         "ExpressJs",
 *                         "MongoDB",
 *                         "REDIS"
 *                      ],
 *                  "_id": "5a78d145670168148c5ebb54",
 *                  "lastName": "Teja",
 *                  "firstName": "Apoorva",
 *                  "linkedInUrl": "https://www.linkedin.com/in/apoorvateja",
 *                  "gitHubUrl": "https://www.github.com/kumbuT",
 *                  "profileUrl": "/member/teja",
 *                  "email": "apoorva.teja@gmail.com"
 *                  "addTS" "2018-02-08 11:37:02.104",
 *                  "modifiedTS": "2018-02-08 11:37:02.104",
 *                  "__V": 0
 *                  }
 *   }
 *
 *  @apiError NoMemberFound  404 Response sent if no member with given last name exists
 *  @apiErrorExample Error-Response:   
 *  {
 *   "error": 404
 *  }
 * 
 *  @apiUse OnNotFoundError
 */

var getMembersBySkills = async function (req, res, next) {
    var skills = req.query.skills;
    try {
        var members = await database.findMembersBySkills(skills);
        if (!members || members.length == 0) {
            res.status(200).send({
                "success": false,
                "message": 'No members with the skills "' + skills + '" found'
            });
        } else {
            res.status(200).send({
                "success": true,
                "message": "Found " + members.length + " in database",
                "data": members
            });
        }
    } catch (err) {
        onError(res, err);
        console.error(err);
    }
};

/**
 *  @api {POST} /api/v0/members/add Request to add new member
 *  @apiName addMember
 *  @apiDescription Adds a new member if the member's email doesn't already exist in the database. Rejects if the _id parameter is set and is duplicate
 *  @apiGroup Members
 *
 *  @apiVersion 0.0.2
 * 
 *  @apiParam (Request body) {JSON}   memberProfile Object name of the profile
 *  @apiParam (Request body) {Array}  memberProfile.skills skills of the user your creating
 *  @apiParam (Request body) {String} memberProfile.lName last name of the member you are creating
 *  @apiParam (Request body) {String} memberProfile.fName First name of the member you are creating
 *  @apiParam (Request body) {String} memberProfile.linkedInUrl LinkedIn profile URL of member you are creating
 *  @apiParam (Request body) {String} memberProfile.gitHubUrl GitHub profile URL of the member you are creating
 *  @apiParam (Request body) {String} memberProfile.profileUrl FCC Redmond Site Profile URL of the member you are creating
 *  @apiParam (Request body) {String} memberProfile.email Email alias of the member you are creating
 * 
 *  @apiSuccess (Response body) {String}   success   Boolean success indicator. True or False
 *  @apiSuccess (Response body) {String}   message   Success message with created user ID

 * 
 *  @apiSuccessExample Success-Response:
 *  HTTP/1.1 201 OK
 *    {
 *      "success": true,
 *      "message": "New member created with ID:5a7ba3bfef8c0146eca3881e"
 *    }
 *
 *  @apiError BadRequest  400 No specific response
 * 
 *  @apiError UserExists  422 When the member you are creating has the same email alias of an existing member
 *  @apiErrorExample Error-Response:
 *  {
 *      "success":false,  
 *      "message": "User Exists!"
 *  }
 * 
 * @apiUse OnNotFoundError
 */
var addMember = function (req, res, next) {
    try {
        if ("memberProfile" in req.body) {
            let newMember = req.body.memberProfile;
            if (!newMember.hasOwnProperty("email")) {
                res.status(422).send({
                    "success": false,
                    "message": "memberProfile doesn't have email property"
                });
            } else {
                /**
                 * @description Callback function that accepts any error in the add event and the newly created member
                 * @param {Object} err Error object. Can be null or undefined.
                 * @param {Object} member JSON Object of the member that was created
                 */
                let cb = function (err, member) {
                    if (err) {
                        onError(res, err, 500);
                        return;
                    }
                    if (member && 'id' in member) {
                        res.status(201).send({
                            "success": true,
                            "message": "New member created with ID:" + member.id
                        });
                    } else {
                        onError(res, new Error("Failed to add member because ID propert was not found"));
                    }
                }
                //setup the addTS and modifiedTS
                newMember.addTS = Date.now();
                newMember.modifiedTS = "";
                database.addMember(newMember, cb);
            }
        } else {
            res.status(422).send({
                "success": false,
                "message": "memberProfile wasn't found in the request body"
            });
        }
    } catch (err) {
        onError(res, err);
        console.error(err);
    }
};

/**
 *  @api {PUT} /api/v0/members/:memberID Request to update member profile
 *  @apiName updateMember
 *  @apiDescription Update a member profile if their ID is valid and they exist in database
 *  @apiGroup Members
 *
 *  @apiVersion 0.0.2
 * 
 *  @apiParam (Request body) {JSON}   memberProfile Object name of the profile
 *  @apiParam (Request body) {Array}  memberProfile.skills skills of the user your creating
 *  @apiParam (Request body) {String} memberProfile.lName last name of the member you are creating
 *  @apiParam (Request body) {String} memberProfile.fName First name of the member you are creating
 *  @apiParam (Request body) {String} memberProfile.linkedInUrl LinkedIn profile URL of member you are creating
 *  @apiParam (Request body) {String} memberProfile.gitHubUrl GitHub profile URL of the member you are creating
 *  @apiParam (Request body) {String} memberProfile.profileUrl FCC Redmond Site Profile URL of the member you are creating
 *  @apiParam (Request body) {String} memberProfile.email Email alias of the member you are creating
 * 
 *  @apiSuccess (Response body) {Boolean}   success   Boolean success indicator. True or False
 *  @apiSuccess (Response body) {String}    message   Success message with updated user ID
 *  @apiSuccess (Response body) {JSON}      data      Updated member profile 

 * 
 *  @apiSuccessExample Success-Response:
 *  HTTP/1.1 200 OK
 *    {
 *      "success": true,
 *      "message": "Member profile with id: 5a7d0e48e7e0d91ee810ffa4 was updated.",
 *      "data": {
 *                  "skills": [
 *                              "JavaScript",
 *                              "Html5"
 *                              ],
 *                  "addTS": "2018-02-09T02:58:16.164Z",
 *                  "modifiedTS": "2018-02-09T02:58:16.164Z",
 *                  "_id": "5a7d0e48e7e0d91ee810ffa4",
 *                  "lastName": "Smith",
 *                  "firstName": "Sam",
 *                  "profileUrl": "/members/Smith",
 *                  "linkedInUrl": "https://www.linkedin.com/in/smith",
 *                  "gitHubUrl": "https://github.com/smith",
 *                  "email": "smith@gmail.com",
 *                  "__v": 0
 *              }
 *    }
 *
 *  @apiError BadRequest  400 No specific response
 * 
 *  @apiUse OnNotFoundError
 */
var updateMember = async function (req, res, next) {
    try {
        if ("memberProfile" in req.body) {
            let memberProfile = req.body.memberProfile;
            console.log('api.js updateMember try if memberProfile', memberProfile);
            let memberId = req.params.id;
            if (!checkMongoDbId(memberId)) {
                onError(res, new Error("The provided ID is not a valid mongoDb ID"), 500);
                return;
            }

            /**
             * 
             * @param {Object} error                    Error object. Can be null or undefined
             * @param {*}      updatedMemberProfile     The updated Member Profile for caller validation
             */
            let cb = function (error, updatedMemberProfile) {
                if (error) {
                    onError(res, error, 500);
                    return;
                } else if (!updatedMemberProfile) {
                    onError(res, new Error("Invalid ID sent. Nothing was updated"), 400);
                } else {
                    res.status(200).send({
                        "success": true,
                        "message": "Member profile with id: " + memberId + " was updated.",
                        "data": updatedMemberProfile
                    });
                }
            }
            await database.updateMember(memberProfile, memberId, cb);
        } else {
            res.status(422).send({
                "success": false,
                "message": "memberProfile wasn't found in the request body"
            });
        }
    } catch (err) {
        onError(res, err);
        console.error(err);
    }
};

/**
 *  @api {DELETE} /api/v0/members/:memberID Request to remove member profile
 *  @apiName removeMember
 *  @apiDescription Remove a member if their ID is valid and they're in DB
 *  @apiGroup Members
 *
 *  @apiVersion 0.0.2
 * 
 * 
 *  @apiSuccess (Response body) {Boolean}   success   Boolean success indicator. True or False
 *  @apiSuccess (Response body) {String}    message   Success message with updated user ID
 * 
 *  @apiSuccessExample Success-Response:
 *  HTTP/1.1 200 OK
 *    {
 *      "success": true,
 *      "message": "Member profile with id: 5a7d0e48e7e0d91ee810ffa4 was removed.",
 *
 *  @apiError BadRequest  400 No specific response
 * 
 *  @apiUse OnNotFoundError
 */
let removeMember = function (req, res, next) {
    try {
        let memberId = req.params.id;
        if (!checkMongoDbId(memberId)) {
            onError(res, new Error("The provided ID is not a valid mongoDb ID"), 500);
            return;
        }
        let cb = function (err, member) {
            if (err) {
                onError(res, err);
                console.error(err);
                return;
            }
            if (!member) {
                res.status(200).send({
                    "status": false,
                    "message": "No member with the provided ID " + memberId + " found"
                });
            } else {
                res.status(200).send({
                    "success": true,
                    "message": "Member with ID:" + memberId + " removed."
                });
            }
        }

        database.removeMember(memberId, cb);
    } catch (err) {
        onError(res, err);
        console.error(err);
    }
};

/**
 *  @api {GET} /api/v0/facebook/events/:pageId Request events of facebook page
 *  @apiName getFacebookEvents
 *  @apiDescription Get the events from a public Facebook page
 *  @apiGroup Facebook
 *
 *  @apiVersion 0.0.2
 * 
 * 
 *  @apiSuccess (Response body) {Boolean}   success   Boolean success indicator. True or False
 *  @apiSuccess (Response body) {String}    message   Success message with all the provided page events
 * 
 *  @apiSuccessExample Success-Response:
 *  HTTP/1.1 200 OK
 *    {
 *      "success": true,
 *      "message": "Member profile with id: 5a7d0e48e7e0d91ee810ffa4 was removed.",
 *
 *  @apiError BadRequest  400 No specific response
 * 
 *  @apiUse OnNotFoundError
 */
let getFacebookEvents = function (req, res, next) {
    try {
        let pageId = req.params.pageId;
        var results = {};
        fccEvents.init().then(token => {
            results.token = token;
            return fccEvents.getEventsFromPage(pageId, results.token);
        }).then(events => {
            console.log(events);
            res.status(200).send(events)
        }).catch(err => {
            console.log(err);
            onError(res, err, 500);
        });
    } catch (err) {
        onError(res, err, 500);
    }
}

/**
 * 
 */
let getFacebookEvents = function (req, res, next) {
    try {
        var results = {};
        fccEvents.init().then(token => {
            results.token = token;
            return fccEvents.getEventsFromPage(config.facebook.pageId, results.token);
        }).then(events => {
            console.log(events);
            res.status(200).send(events)
        }).catch(err => console.log(err));
    } catch (err) {
        onError(res, err, 500);
    }
}

/**
 * 
 * @param {*} ObjectId 
 */
let checkMongoDbId = function (id) {
    return /^[0-9a-fA-F]{24}$/g.test(id);
};

/**
 * @param {Object} res         response object sent from caller
 * @param {Object} error       Error object sent
 * @param {Number} statusCode  HTTP error code. Optional. If provided then use it insead of generic 500 error
 */

let onError = function (res, error, statusCode) {

    if (statusCode && typeof statusCode == "Number") {
        res.status(statusCode).send(error.message);
    } else {
        res.status(500).send({
            "success": false,
            "message": error.message
        });
    }

};


//setup your routes
router.get('/members', getMembers);
router.get('/members/:lName', getMemberByLastName);
router.post('/members/add', addMember);
router.put('/members/:id', updateMember);
router.delete('/members/:id', removeMember);
router.get('/facebook/events/:pageId', getFacebookEvents);
module.exports = router;