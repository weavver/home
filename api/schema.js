
exports.models = [
     // used when a new account is being created
     {
          "$id": "http://home.weavver.com/schema/accountCreate.json",
          "$async": true,
          "type": "object",
          "properties": {
               "email": {
                    "type": "string",
                    "format": "email"
               },
               "phone_number": {
                    "type": "string"
               },
               "password": {
                    "type": "string",
                    "minLength": 6,
                    "maxLength": 50
               }
          },
          "required": ["email", "password"],
          "additionalProperties": false
     },
     {
          "$id": "http://home.weavver.com/schema/account.json",
          "type": "object",
          "properties": {
               "tenants.id": {
                    "type": "string",
                    "default": 0
               },
               "email": {
                    "type": "string",
                    "format": "email"
               },
               "birthday": {
                    "type": "string",
                    "format": "date"
               },
               "password": {
                    "type": "string",
                    "minLength": 6,
                    "maxLength": 50
               },
               "reset_code": {
                    "type": "string"
               },
               "phone_number": {
                    "type": "string"
               }
          },
          "required": ["email", "password"],
          "additionalProperties": false
     },
     // used when an account is being verified
     {
          "$id": "http://home.weavver.com/schema/account_verify.json",
          "type": "object",
          "properties": {
               "email": {
                    "type": "string",
                    "format": "email"
               },
               "code": {
                    "type": "number"
               }
          },
          "required": ["email", "code"],
          "additionalProperties": false
     },
     // used when a password is being reset
     {
          "$id": "http://home.weavver.com/schema/accountPasswordReset.json",
          "$async": true,
          "type": "object",
          "properties": {
               "email": {
                    "type": "string",
                    "format": "email"
               }
          },
          "required": ["email"],
          "additionalProperties": false
     },
     {
          "$id": "http://home.weavver.com/schema/log.json",
          "$async": true,
          "type": "object",
          "properties": {
               "accounts.id": { "type": "string" },
               "message": { "type": "string" },
               "at": { "type": "string", "format": "date" }
          },
          "required": ["foo"],
          "additionalProperties": true
     }
];