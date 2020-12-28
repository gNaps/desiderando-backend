const { sanitizeEntity } = require('strapi-utils');


/**
 * Read the documentation (https://strapi.io/documentation/developer-docs/latest/concepts/controllers.html#core-controllers)
 * to customize this controller
 */

module.exports = {
    /**
     * Retrieve records.
     *
     * @return {Array}
     */

    async find(ctx) {
        let entities;

        //console.log(ctx.state)
        const { id } = ctx.state.user

        if (ctx.query._q) {
            entities = await strapi.services.desiderioitem.search(ctx.query, id);
        } else {
            entities = await strapi.services.desiderioitem.find(ctx.query, id);
        }

        return entities.map(entity => sanitizeEntity(entity, { model: strapi.models.desiderioitem }));
    },
    /**
     * Retrieve a record.
     *
     * @return {Object}
     */

    async findOne(ctx) {
        const params = { id: ctx.params.id, users: ctx.state.user.id }
        //const { id } = ctx.params;

        const entity = await strapi.services.desiderioitem.findOne(params)
        //const entity = await strapi.services.desiderioitem.findOne({id})
        return sanitizeEntity(entity, { model: strapi.models.desiderioitem })
    },
};
