"use strict";

const generate = (Model, options) => {
  const single = options.single || Model.modelName.toLowerCase();
  const multi = options.multi || single + "s";
  const prefix = options.prefix || "/api/v1";
  const tags = options.tags || [ "api" ];
  const auth = options.auth || false;

  let populate = true;
  if (options.populate !== undefined) {
    populate = options.populate;
  }

  const config = {
    "auth": auth,
    "tags": tags,
    "prefix": prefix,
    "single": single,
    "multi": multi,
    "populate": populate,
    "routes": {
      "findAll": {
        "enabled": true,
        "method": "GET",
        "path": `${prefix}/${multi}`,
        "description": `Fetch all ${multi}`,
        "notes": `Returns a list of all ${multi}`
      },
      "findOne": {
        "enabled": true,
        "method": "GET",
        "path": `${prefix}/${multi}/{id}`,
        "description": `Find this ${single}`,
        "notes": `Returns the ${single} object belonging to this id`
      },
      "create": {
        "enabled": true,
        "method": "POST",
        "path": `${prefix}/${multi}`,
        "description": `Create a new ${single}`,
        "notes": `Returns the newly created ${single} object`,
        "password": {
          "validate": true,
          "encrypt": true,
          "minlength": 8,
          "numbers": true,
          "uppercase": true,
          "special": true
        }
      },
      "update": {
        "enabled": true,
        "method": "PUT",
        "path": `${prefix}/${multi}/{id}`,
        "description": `Update this ${single}`,
        "notes": `Returns the updated ${single} object`,
        "password": {
          "validate": true,
          "encrypt": true,
          "minlength": 8,
          "numbers": true,
          "uppercase": true,
          "special": true
        }
      },
      "bulkUpdate": {
        "enabled": true,
        "method": "PUT",
        "path": `${prefix}/${multi}`,
        "description": `Update a set of ${multi}`,
        "notes": `Returns the list of updated ${multi}`,
        "password": {
          "validate": true,
          "encrypt": true,
          "minlength": 8,
          "numbers": true,
          "uppercase": true,
          "special": true
        }
      },
      "delete": {
        "enabled": true,
        "method": "DELETE",
        "path": `${prefix}/${multi}/{id}`,
        "description": `Remove this ${single}`,
        "notes": "Returns http status of this action"
      },
      "bulkDelete": {
        "enabled": true,
        "method": "DELETE",
        "path": `${prefix}/${multi}`,
        "description": `Remove a set of ${multi}`,
        "notes": "Returns http status of this action"
      }
    }
  };

  return config;
};

module.exports = {
  generate
};
