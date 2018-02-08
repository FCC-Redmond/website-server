define({ "api": [
  {
    "type": "get",
    "url": "/api/v0/members/",
    "title": "Request all members in database",
    "name": "GetMembers",
    "description": "<p>Retrieves all members in database</p>",
    "group": "Members",
    "version": "0.0.1",
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "firstName",
            "description": "<p>Firstname of member</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "lastName",
            "description": "<p>LastName of member</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "email",
            "description": "<p>Email of member</p>"
          },
          {
            "group": "Success 200",
            "type": "Array",
            "optional": false,
            "field": "skills",
            "description": "<p>Skills listed by member</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "linkedInUrl",
            "description": "<p>LinkedIn profile URL of member</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "gitHubUrl",
            "description": "<p>GitHub profile URL of member</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "profileUrl",
            "description": "<p>Profile path of user on FCC Redmond Site e.g. /member/teja</p>"
          },
          {
            "group": "Success 200",
            "type": "Object",
            "optional": false,
            "field": "_id",
            "description": "<p>Database ID of the member</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Success-Response:",
          "content": "HTTP/1.1 200 OK\n[\n {\n     \"skills\": [\n         \"JavaScript\",\n         \"NodeJs\",\n         \"ExpressJs\",\n         \"MongoDB\"\n     ],\n     \"_id\": \"5a78d098670168148c5ebb52\",\n     \"lastName\": \"Kim\",\n     \"firstName\": \"Amber\",\n     \"linkedInUrl\": \"https://www.linkedin.com/in/amberkim\",\n     \"gitHubUrl\": \"https://www.github.com/amber\",\n     \"profileUrl\": \"/member/kim\",\n     \"email\": \"amber@gmail.com\"\n },\n {\n     \"skills\": [\n         \"JavaScript\",\n         \"C#\",\n         \"Azure\",\n         \"NodeJs\",\n         \"ExpressJs\",\n         \"MongoDB\",\n         \"REDIS\"\n     ],\n     \"_id\": \"5a78d145670168148c5ebb54\",\n     \"lastName\": \"Teja\",\n     \"firstName\": \"Apoorva\",\n     \"linkedInUrl\": \"https://www.linkedin.com/in/apoorvateja\",\n     \"gitHubUrl\": \"https://www.github.com/kumbuT\",\n     \"profileUrl\": \"/member/teja\",\n     \"email\": \"apoorva.teja@gmail.com\"\n }\n]",
          "type": "json"
        }
      ]
    },
    "error": {
      "fields": {
        "Error 4xx": [
          {
            "group": "Error 4xx",
            "optional": false,
            "field": "NoMemberFound",
            "description": "<p>Empty Array returned if no members found</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Error-Response:   ",
          "content": "{\n  \"error\": 500\n }",
          "type": "json"
        },
        {
          "title": "Error-Response:",
          "content": "HTTP/1.1 404 Not Found\n {\n  \"error\": \"Not Found\"\n }",
          "type": "json"
        }
      ]
    },
    "filename": "routes/api.js",
    "groupTitle": "Members"
  },
  {
    "type": "POST",
    "url": "/api/v0/members/add",
    "title": "Request to add new member",
    "name": "addMember",
    "description": "<p>Adds a new member if the member's email doesn't already exist in the database. Rejects if the _id parameter is set and is duplicate</p>",
    "group": "Members",
    "version": "0.0.1",
    "parameter": {
      "fields": {
        "Request body": [
          {
            "group": "Request body",
            "type": "JSON",
            "optional": false,
            "field": "memberProfile",
            "description": "<p>Object name of the profile</p>"
          },
          {
            "group": "Request body",
            "type": "Array",
            "optional": false,
            "field": "memberProfile.skills",
            "description": "<p>skills of the user your creating</p>"
          },
          {
            "group": "Request body",
            "type": "String",
            "optional": false,
            "field": "memberProfile.lName",
            "description": "<p>last name of the member you are creating</p>"
          },
          {
            "group": "Request body",
            "type": "String",
            "optional": false,
            "field": "memberProfile.fName",
            "description": "<p>First name of the member you are creating</p>"
          },
          {
            "group": "Request body",
            "type": "String",
            "optional": false,
            "field": "memberProfile.linkedInUrl",
            "description": "<p>LinkedIn profile URL of member you are creating</p>"
          },
          {
            "group": "Request body",
            "type": "String",
            "optional": false,
            "field": "memberProfile.gitHubUrl",
            "description": "<p>GitHub profile URL of the member you are creating</p>"
          },
          {
            "group": "Request body",
            "type": "String",
            "optional": false,
            "field": "memberProfile.profileUrl",
            "description": "<p>FCC Redmond Site Profile URL of the member you are creating</p>"
          },
          {
            "group": "Request body",
            "type": "String",
            "optional": false,
            "field": "memberProfile.email",
            "description": "<p>Email alias of the member you are creating</p>"
          }
        ]
      }
    },
    "success": {
      "fields": {
        "Response body": [
          {
            "group": "Response body",
            "type": "String",
            "optional": false,
            "field": "success",
            "description": "<p>Boolean success indicator. True or False</p>"
          },
          {
            "group": "Response body",
            "type": "String",
            "optional": false,
            "field": "message",
            "description": "<p>Success message with created user ID</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Success-Response:",
          "content": "HTTP/1.1 200 OK\n  {\n    \"success\": true,\n    \"message\": \"New member created with ID:5a7ba3bfef8c0146eca3881e\"\n  }",
          "type": "json"
        }
      ]
    },
    "error": {
      "fields": {
        "Error 4xx": [
          {
            "group": "Error 4xx",
            "optional": false,
            "field": "BadRequest",
            "description": "<p>400 No specific response</p>"
          },
          {
            "group": "Error 4xx",
            "optional": false,
            "field": "UserExists",
            "description": "<p>422 When the member you are creating has the same email alias of an existing member</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Error-Response:",
          "content": "{\n    \"success\":false,  \n    \"message\": \"User Exists!\"\n}",
          "type": "json"
        },
        {
          "title": "Error-Response:",
          "content": "HTTP/1.1 404 Not Found\n {\n  \"error\": \"Not Found\"\n }",
          "type": "json"
        }
      ]
    },
    "filename": "routes/api.js",
    "groupTitle": "Members"
  },
  {
    "type": "get",
    "url": "/api/v0/members/:lName",
    "title": "Request member info by last name",
    "name": "getMemberByLastName",
    "description": "<p>Retrieves one member in database with the given last name. <i>Currently retrieves only one successful last name match.</i></p>",
    "group": "Members",
    "version": "0.0.1",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "lName",
            "description": "<p>Last Name of the member who's profile you want to retrieve</p>"
          }
        ]
      }
    },
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "firstName",
            "description": "<p>Firstname of member</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "lastName",
            "description": "<p>LastName of member</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "email",
            "description": "<p>Email of member</p>"
          },
          {
            "group": "Success 200",
            "type": "Array",
            "optional": false,
            "field": "skills",
            "description": "<p>Skills listed by member</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "linkedInUrl",
            "description": "<p>LinkedIn profile URL of member</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "gitHubUrl",
            "description": "<p>GitHub profile URL of member</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "profileUrl",
            "description": "<p>Profile path of user on FCC Redmond Site e.g. /member/teja</p>"
          },
          {
            "group": "Success 200",
            "type": "Object",
            "optional": false,
            "field": "_id",
            "description": "<p>Database ID of the member</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Success-Response:",
          "content": "HTTP/1.1 200 OK\n  {\n     \"skills\": [\n         \"JavaScript\",\n         \"C#\",\n         \"Azure\",\n         \"NodeJs\",\n         \"ExpressJs\",\n         \"MongoDB\",\n         \"REDIS\"\n     ],\n     \"_id\": \"5a78d145670168148c5ebb54\",\n     \"lastName\": \"Teja\",\n     \"firstName\": \"Apoorva\",\n     \"linkedInUrl\": \"https://www.linkedin.com/in/apoorvateja\",\n     \"gitHubUrl\": \"https://www.github.com/kumbuT\",\n     \"profileUrl\": \"/member/teja\",\n     \"email\": \"apoorva.teja@gmail.com\"\n }",
          "type": "json"
        }
      ]
    },
    "error": {
      "fields": {
        "Error 4xx": [
          {
            "group": "Error 4xx",
            "optional": false,
            "field": "NoMemberFound",
            "description": "<p>404 Response sent if no member with given last name exists</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Error-Response:   ",
          "content": "{\n \"error\": 404\n}",
          "type": "json"
        },
        {
          "title": "Error-Response:",
          "content": "HTTP/1.1 404 Not Found\n {\n  \"error\": \"Not Found\"\n }",
          "type": "json"
        }
      ]
    },
    "filename": "routes/api.js",
    "groupTitle": "Members"
  },
  {
    "type": "get",
    "url": "/api/v0/members?skills=:skills",
    "title": "Request members with the specified skills",
    "name": "getMemberBySkills",
    "description": "<p>Retrieves members with all the skills specified in the query string parameter &quot;skills&quot;. <i>Note that skills query string parameter is a comma separated value of the skills and is case sensitive</i></p>",
    "group": "Members",
    "version": "0.0.1",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "skills",
            "description": "<p>The skills you want to find members by</p>"
          }
        ]
      }
    },
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "firstName",
            "description": "<p>Firstname of member</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "lastName",
            "description": "<p>LastName of member</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "email",
            "description": "<p>Email of member</p>"
          },
          {
            "group": "Success 200",
            "type": "Array",
            "optional": false,
            "field": "skills",
            "description": "<p>Skills listed by member</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "linkedInUrl",
            "description": "<p>LinkedIn profile URL of member</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "gitHubUrl",
            "description": "<p>GitHub profile URL of member</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "profileUrl",
            "description": "<p>Profile path of user on FCC Redmond Site e.g. /member/teja</p>"
          },
          {
            "group": "Success 200",
            "type": "Object",
            "optional": false,
            "field": "_id",
            "description": "<p>Database ID of the member</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Success-Response:",
          "content": "HTTP/1.1 200 OK\n  {\n     \"skills\": [\n         \"JavaScript\",\n         \"C#\",\n         \"Azure\",\n         \"NodeJs\",\n         \"ExpressJs\",\n         \"MongoDB\",\n         \"REDIS\"\n     ],\n     \"_id\": \"5a78d145670168148c5ebb54\",\n     \"lastName\": \"Teja\",\n     \"firstName\": \"Apoorva\",\n     \"linkedInUrl\": \"https://www.linkedin.com/in/apoorvateja\",\n     \"gitHubUrl\": \"https://www.github.com/kumbuT\",\n     \"profileUrl\": \"/member/teja\",\n     \"email\": \"apoorva.teja@gmail.com\"\n }",
          "type": "json"
        }
      ]
    },
    "error": {
      "fields": {
        "Error 4xx": [
          {
            "group": "Error 4xx",
            "optional": false,
            "field": "NoMemberFound",
            "description": "<p>404 Response sent if no member with given last name exists</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Error-Response:   ",
          "content": "{\n \"error\": 404\n}",
          "type": "json"
        },
        {
          "title": "Error-Response:",
          "content": "HTTP/1.1 404 Not Found\n {\n  \"error\": \"Not Found\"\n }",
          "type": "json"
        }
      ]
    },
    "filename": "routes/api.js",
    "groupTitle": "Members"
  }
] });
