const { sanitizeEntity } = require('strapi-utils');
const slugify = require('slugify');


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

        if (ctx.query.slug) {
            const entity = await strapi.services.desiderioitem.findOne(ctx.query)
            return sanitizeEntity(entity, { model: strapi.models.desideriolist })
        } else {
            entities = await strapi.services.desiderioitem.find(id);
        }

        return entities.map(entity => sanitizeEntity(entity, { model: strapi.models.desiderioitem }));
    },
    /**
     * Retrieve a record.
     *
     * @return {Object}
     */

    async findOne(ctx) {
        console.log('query', ctx.query)
        const params = { id: ctx.params.id, users: ctx.state.user.id }
        //const { id } = ctx.params;

        const entity = await strapi.services.desiderioitem.findOne(params)
        //const entity = await strapi.services.desiderioitem.findOne({id})
        return sanitizeEntity(entity, { model: strapi.models.desiderioitem })
    },
    /**
     * Count records.
     *
     * @return {Number}
     */

    count(ctx) {
        if (ctx.query._q) {
            return strapi.services.desiderioitem.countSearch(ctx.query);
        }
        return strapi.services.desiderioitem.count(ctx.query);
    },
    /**
     * Count the gift lefts.
     *
     * @return {Number}
     */

    countGiftsLeft(ctx) {
        const params = { id: ctx.params.id }
        return strapi.services.desiderioitem.countGiftsLeft(params);
    },
    /**
     * Insert a new desiderio in a list.
     *
     * @return {Number}
     */

    async insertNewDesiderio(ctx) {
        const { id } = ctx.state.user
        const desiderio = ctx.request.body

        desiderio.users = id
        desiderio.desideriolist = {id: ctx.params.id}

        if(!desiderio.category || desiderio.category === 0) {
            ctx.throw(400, 'Category is missing.');
        }

        if(!desiderio.name || desiderio.name === '') {
            ctx.throw(400, 'Name is missing');
        }

        desiderio.slug = slugify(desiderio.name);

        entity = await strapi.services.desiderioitem.create(desiderio);

        delete entity.users.blocked;
        delete entity.users.confirmed;
        delete entity.users.created_at;
        delete entity.users.invite;
        delete entity.users.provider;
        delete entity.users.role;
        delete entity.users.updated_at;

        return sanitizeEntity(entity, { model: strapi.models.desiderioitem });
    },

    async bookDesiderio(ctx) {
        const userLoggedIn = ctx.state.user
        const { id } = ctx.params

        //const desiderio = ctx.request.body

        console.log('userLoggedIn', userLoggedIn)
        console.log('id desiderio', id)

        entity = await strapi.services.desiderioitem.update({ id }, {bought_by: userLoggedIn});
        return sanitizeEntity(entity, { model: strapi.models.desiderioitem });
    }
};
