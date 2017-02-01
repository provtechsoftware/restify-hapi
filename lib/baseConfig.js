"use strict";

const generate = (Model, options) => {
  const single = options.single || Model.modelName.toLowerCase();
  const multi = options.multi || single + 's';
  const prefix = options.prefix || "/api/v1";
  const tags = options.tags || [ "api" ];
  const auth = options.auth || false;

  const config = {
    "auth": auth,
    "tags": tags,
    "prefix": prefix,
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
        "notes": `Returns the newly created ${single} object`
      },
      "update": {
        "enabled": true,
        "method": "PUT",
        "path": `${prefix}/${multi}/{id}`,
        "description": `Update this ${single}`,
        "notes": `Returns the updated ${single} object`
      },
      "bulkUpdate": {
        "enabled": true,
        "method": "PUT",
        "path": `${prefix}/${multi}`,
        "description": `Update a set of ${multi}`,
        "notes": `Returns the list of updated ${multi}`
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
  }

  return config;
}

module.exports = {
  generate
};