'use strict';

var express = require('express');
var router = express.Router();
var database = require('../model/db.js');
/**
 * @apiDefine OnNotFoundError Resource not found error
 * 
 * @apiErrorExample Error-Response:
 *  HTTP/1.1 404 Not Found
 *   {
 *    "error": "Not Found"
 *   }
 */

/**
 *  @api {get} /api/v0/members/ Request all members in database
 *  @apiName GetMembers
 *  @apiDescription Retrieves all members in database
 *  @apiGroup Members
 *
 *  @apiVersion 0.0.1
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
 * @apiSuccessExample Success-Response:
 * HTTP/1.1 200 OK
 * [
 *   {
 *       "skills": [
 *           "JavaScript",
 *           "NodeJs",
 *           "ExpressJs",
 *           "MongoDB"
 *       ],
 *       "_id": "5a78d098670168148c5ebb52",
 *       "lastName": "Kim",
 *       "firstName": "Amber",
 *       "linkedInUrl": "https://www.linkedin.com/in/amberkim",
 *       "gitHubUrl": "https://www.github.com/amber",
 *       "profileUrl": "/member/kim",
 *       "email": "amber@gmail.com"
 *   },
 *   {
 *       "skills": [
 *           "JavaScript",
 *           "C#",
 *           "Azure",
 *           "NodeJs",
 *           "ExpressJs",
 *           "MongoDB",
 *           "REDIS"
 *       ],
 *       "_id": "5a78d145670168148c5ebb54",
 *       "lastName": "Teja",
 *       "firstName": "Apoorva",
 *       "linkedInUrl": "https://www.linkedin.com/in/apoorvateja",
 *       "gitHubUrl": "https://www.github.com/kumbuT",
 *       "profileUrl": "/member/teja",
 *       "email": "apoorva.teja@gmail.com"
 *   }
*]
 *
 *@apiError NoMemberFound Empty Array returned if no members found
 *@apiErrorExample Error-Response:   
 *{
 *    "error": 500
 *   }
 * 
 * @apiUse OnNotFoundError
 */

var getMembers = async function (req, res, next) {
    if (req.query.hasOwnProperty("skills")) {
        getMembersBySkills(req,res,next);
    } else {
        try {
            var list = await database.list();
            res.send(list);
        } catch (err) {
            onError(res);
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
 *  @apiVersion 0.0.1
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
 * @apiSuccessExample Success-Response:
 * HTTP/1.1 200 OK
 *    {
 *       "skills": [
 *           "JavaScript",
 *           "C#",
 *           "Azure",
 *           "NodeJs",
 *           "ExpressJs",
 *           "MongoDB",
 *           "REDIS"
 *       ],
 *       "_id": "5a78d145670168148c5ebb54",
 *       "lastName": "Teja",
 *       "firstName": "Apoorva",
 *       "linkedInUrl": "https://www.linkedin.com/in/apoorvateja",
 *       "gitHubUrl": "https://www.github.com/kumbuT",
 *       "profileUrl": "/member/teja",
 *       "email": "apoorva.teja@gmail.com"
 *   }
 *
 * @apiError NoMemberFound  404 Response sent if no member with given last name exists
 * @apiErrorExample Error-Response:   
 * {
 *   "error": 404
 * }
 * 
 * @apiUse OnNotFoundError
 */

var getMemberByLastName = async function (req, res, next) {
    var lastName = req.params.lName;
    try {
        var member = await database.findMember(lastName);
        res.send(member);

    } catch (err) {
        onError(res);
        console.error(err);
    }
};

var addMember = async function (req, res, next) {
    try {
        var member = JSON.parse(req.body);
        var member = await database.insert(member);
        res.send('insert completed');
    } catch (err) {
        onError();
    }
}
/**
 *  @api {get} /api/v0/members?skills=:skills Request members with the specified skills
 *  @apiName getMemberBySkills
 *  @apiDescription Retrieves members with all the skills specified in the query string parameter "skills". <i>Note that skills query string parameter is a comma separated value of the skills and is case sensitive</i>
 *  @apiGroup Members
 *
 *  @apiVersion 0.0.1
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
 * @apiSuccessExample Success-Response:
 * HTTP/1.1 200 OK
 *    {
 *       "skills": [
 *           "JavaScript",
 *           "C#",
 *           "Azure",
 *           "NodeJs",
 *           "ExpressJs",
 *           "MongoDB",
 *           "REDIS"
 *       ],
 *       "_id": "5a78d145670168148c5ebb54",
 *       "lastName": "Teja",
 *       "firstName": "Apoorva",
 *       "linkedInUrl": "https://www.linkedin.com/in/apoorvateja",
 *       "gitHubUrl": "https://www.github.com/kumbuT",
 *       "profileUrl": "/member/teja",
 *       "email": "apoorva.teja@gmail.com"
 *   }
 *
 * @apiError NoMemberFound  404 Response sent if no member with given last name exists
 * @apiErrorExample Error-Response:   
 * {
 *   "error": 404
 * }
 * 
 * @apiUse OnNotFoundError
 */

var getMembersBySkills = async function (req, res, next) {
    var skills = req.query.skills;
    try {
        var members = await database.findMembersBySkills(skills);
        res.send(members);

    } catch (err) {
        onError(res);
        console.error(err);
    }
};

let onError = function (res) {
    let error = new Error('Server Error');
    error.status = 500;
    res.send(error);
};
//setup your routes
router.post('/member', addMember);
router.get('/members', getMembers);
router.get('/members/:lName', getMemberByLastName);


module.exports = router;