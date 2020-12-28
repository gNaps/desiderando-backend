const { sanitizeEntity } = require('strapi-utils');

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
      entities = await strapi.services.desideriolist.search(ctx.query, id);
    } else {
      entities = await strapi.services.desideriolist.find(ctx.query, id);
    }

    return entities.map(entity => sanitizeEntity(entity, { model: strapi.models.desideriolist }));
  },
  /**
   * Retrieve a record.
   *
   * @return {Object}
   */

  async findOne(ctx) {
    const params = { id: ctx.params.id, users: ctx.state.user.id }

    const entity = await strapi.services.desideriolist.findOne(params)
    return sanitizeEntity(entity, { model: strapi.models.desideriolist })
  },
};