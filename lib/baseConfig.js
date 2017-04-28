"use strict";

const Joi = require("joi");

const validateUserSettings = (Model, options) => {
  const single = options.single || Model.modelName.toLowerCase();
  const multi = options.multi || single + "s";
  const prefix = options.prefix || "/api/v1";
  const tags = options.tags || [ "api" ];
  const auth = options.auth || false;

  let populate = true;
  if (options.populate !== undefined) {
    populate = options.populate;
  }

  const passwordSchema = () => {
    const schema = Joi.object({
      "validate": Joi.boolean().description("whether to enable password validation for this route or not").default(true),
      "encrypt": Joi.boolean().description("whether to enable password encryption for this route or not").default(true),
      "minlength": Joi.number().description("specify the minimum lenght requirement for passwords").default(8),
      "numbers": Joi.boolean().description("whether passwords must contain numbers or not").default(true),
      "uppercase": Joi.boolean().description("whether passwords must contain uppercase letters or not").default(true),
      "special": Joi.boolean().description("whether passwords must contain special characters or not").default(true)
    }).description("the password settings for this route");

    return schema;
  };

  const findAllSchema = () => {
    const schema = Joi.object({
      "enabled": Joi.boolean().description("whether to enable or to disable this route").default(true),
      "populate": Joi.boolean().description("whether to populate the references of this model for this route").default(false),
      "method": Joi.string().description("this routes http method").valid("GET").default("GET"),
      "path": Joi.string().description("this routes path").valid(`${prefix}/${multi}`).default(`${prefix}/${multi}`),
      "description": Joi.string().description("this routes description").default(`Fetch all ${multi}`),
      "notes": Joi.string().description("this routes notes").default(`Returns a list of all ${multi}`),
    }).description("provides the findAll route for this model").default({
      "enabled": true,
      "method": "GET",
      "path": `${prefix}/${multi}`,
      "description": `Fetch all ${multi}`,
      "notes": `Returns a list of all ${multi}`,
      "populate": false
    });

    return schema;
  };

  const findOneSchema = () => {
    const schema = Joi.object({
      "enabled": Joi.boolean().description("whether to enable or to disable this route").default(true),
      "populate": Joi.boolean().description("whether to populate the references of this model for this route").default(true),
      "method": Joi.string().description("this routes http method").valid("GET").default("GET"),
      "path": Joi.string().description("this routes path").valid(`${prefix}/${multi}/{id}`).default(`${prefix}/${multi}/{id}`),
      "description": Joi.string().description("this routes description").default(`Find this ${single}`),
      "notes": Joi.string().description("this routes notes").default(`Returns the ${single} object belonging to this id`),
    }).description("provides the findOne route for this model").default({
      "enabled": true,
      "method": "GET",
      "path": `${prefix}/${multi}/{id}`,
      "description": `Find this ${single}`,
      "notes": `Returns the ${single} object belonging to this id`,
      "populate": true
    });

    return schema;
  };

  const createSchema = () => {
    const schema = Joi.object({
      "enabled": Joi.boolean().description("whether to enable or to disable this route").default(true),
      "password": passwordSchema(),
      "method": Joi.string().description("this routes http method").valid("POST").default("POST"),
      "path": Joi.string().description("this routes path").valid(`${prefix}/${multi}`).default(`${prefix}/${multi}`),
      "description": Joi.string().description("this routes description").default(`Create a new ${single}`),
      "notes": Joi.string().description("this routes notes").default(`Returns the newly created ${single} object`),
    }).description("provides the create route for this model").default({
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
    });

    return schema;
  };

  const updateSchema = () => {
    const schema = Joi.object({
      "enabled": Joi.boolean().description("whether to enable or to disable this route").default(true),
      "password": passwordSchema(),
      "method": Joi.string().description("this routes http method").valid("PUT").default("PUT"),
      "path": Joi.string().description("this routes path").valid(`${prefix}/${multi}/{id}`).default(`${prefix}/${multi}/{id}`),
      "description": Joi.string().description("this routes description").default(`Update this ${single}`),
      "notes": Joi.string().description("this routes notes").default(`Returns the updated ${single} object`),
    }).description("provides the update route for this model").default({
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
    });

    return schema;
  };

  const bulkUpdateSchema = () => {
    const schema = Joi.object({
      "enabled": Joi.boolean().description("whether to enable or to disable this route").default(true),
      "password": passwordSchema(),
      "method": Joi.string().description("this routes http method").valid("PUT").default("PUT"),
      "path": Joi.string().description("this routes path").valid(`${prefix}/${multi}`).default(`${prefix}/${multi}`),
      "description": Joi.string().description("this routes description").default(`Update a set of ${multi}`),
      "notes": Joi.string().description("this routes notes").default(`Returns the list of updated ${multi}`),
    }).description("provides the bulk update route for this model").default({
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
    });

    return schema;
  };

  const deleteSchema = () => {
    const schema = Joi.object({
      "enabled": Joi.boolean().description("whether to enable or to disable this route").default(true),
      "method": Joi.string().description("this routes http method").valid("DELETE").default("DELETE"),
      "path": Joi.string().description("this routes path").valid(`${prefix}/${multi}/{id}`).default(`${prefix}/${multi}/{id}`),
      "description": Joi.string().description("this routes description").default(`Remove this ${single}`),
      "notes": Joi.string().description("this routes notes").default("Returns http status of this action"),
    }).description("provides the delete route for this model").default({
      "enabled": true,
      "method": "DELETE",
      "path": `${prefix}/${multi}/{id}`,
      "description": `Remove this ${single}`,
      "notes": "Returns http status of this action"
    });

    return schema;
  };

  const bulkDeleteSchema = () => {
    const schema = Joi.object({
      "enabled": Joi.boolean().description("whether to enable or to disable this route").default(true),
      "method": Joi.string().description("this routes http method").valid("DELETE").default("DELETE"),
      "path": Joi.string().description("this routes path").valid(`${prefix}/${multi}`).default(`${prefix}/${multi}`),
      "description": Joi.string().description("this routes description").default(`Remove a set of ${multi}`),
      "notes": Joi.string().description("this routes notes").default("Returns http status of this action"),
    }).description("provides the bulk delete route for this model").default({
      "enabled": true,
      "method": "DELETE",
      "path": `${prefix}/${multi}`,
      "description": `Remove a set of ${multi}`,
      "notes": "Returns http status of this action"
    });

    return schema;
  };

  const routesSchema = () => {
    const schema = Joi.object({
      "findAll": findAllSchema(),
      "findOne": findOneSchema(),
      "create": createSchema(),
      "update": updateSchema(),
      "bulkUpdate": bulkUpdateSchema(),
      "delete": deleteSchema(),
      "bulkDelete": bulkDeleteSchema()
    }).description("this models routes");

    return schema;
  };

  const schema = Joi.object({
    "auth": Joi.alternatives().try(
      Joi.boolean().valid(false).description("disable auth globally"),
      Joi.string().description("choose your custom authentication schema"),
      Joi.object().description("choose your custom authentication values").example({scope: ["admin"]})
    ).description("hapijs authentication settings").default(auth),
    "tags": Joi.array().min(1).description("tag your API routes").default(tags).example(["api"]),
    "prefix": Joi.string().description("tag your api with a custom prefix").default("/api/v1").example("/api/v1"),
    "single": Joi.string().description("give your model a custom single resource name (default is model name)").default(single).example("company"),
    "multi": Joi.string().description("give your model a custom multi resource name (default is model name with a s at the end)").default(multi).example("companies"),
    "hasMany": Joi.array().items(Joi.object({
      "fieldName": Joi.string().required().description("the attribute field name").example("employees"),
      "destroy": Joi.boolean().required().description("whether to remove the references on destroy or not").example("true").default(true)
    })).description("the has many relationship configs").default(false),
    "populate": Joi.boolean().description("wether you want to globally populate your mongoose references or not").default(populate),
    "routes": routesSchema()
  });

  if (!options.routes) {
    options.routes = {};
  }

  const config = Joi.validate(options, schema);
  if (config.error) {
    throw new Error(config.error);
  }

  return config.value;
};


module.exports = {
  validateUserSettings
};
