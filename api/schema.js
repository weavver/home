
exports.models = [
     // used when a new account is being created
     {
          "$id": "http://accounts.weavver.com/schemas/accountCreate.json",
          "type": "object",
          "properties": {
               "email": {
                    "type": "string",
                    "format": "email"
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
          "$id": "http://accounts.weavver.com/schemas/user.json",
          "type": "object",
          "properties": {
               "tenants.id": {
                    "type": "string",
                    "format": "email",
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
                    "format": "email"
               },
               "reset_code": {
                    "type": "string",
                    "format": "email"
               },
               "phone_number": {
                    "type": "string",
                    "format": "email"
               }
          },
          "required": ["email"],
          "additionalProperties": true
     },
     // used when a password is being reset
     {
          "$id": "http://accounts.weavver.com/schemas/accountPasswordReset.json",
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
          "$id": "http://accounts.weavver.com/schemas/log.json",
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