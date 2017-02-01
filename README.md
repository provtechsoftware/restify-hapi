# hapi-restify
Restify mongoose models for hapi to use with joi and boom (and swagger)

# Options
* `auth` - the applied auth schema / strategy -  default: `false`
* `tags` - the hapijs connection tags - default: `["api"]`
* `prefix` - the routes prefix - default: `"/api/v1"`
* `routes` - for each route one can specify the following options:
    * `enabled` - wether to use this route or not - default `true`
    * `method` - which http method to use `GET|POST|PUT|DELETE`
    * `path` - which path to use - default `${prefix}/${resource}</{id}>`
    * `description` - description used by hapi swagger - see source for default
    * `notes` - notes used by hapi swagger - see source for default
* `available routes`
    * `findAll` - a list of all entries for this resource
    * `findOne` - the resource found by the param id
    * `create` - create a new resource
    * `update` - update an existing resource
    * `bulkUpdate` - update a set of resources
    * `delete` - delete an existing resource
    * `bulkDelete` - delete a set of resources

## Example
```json
{
    "auth": { "scope": [ "admin" ] },
    "tags": [ "api", "backend" ],
    "prefix": "/api/v2",
    "single": "company",
    "multi": "companies",
    "findAll": {
        "enabled": false
    }
}
```