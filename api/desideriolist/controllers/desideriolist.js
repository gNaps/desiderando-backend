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

    entities = await strapi.services.desideriolist.find(id);

    if(entities) {
      entities.map((entity) => {
        if(entity.desiderioitems) {
          //count many gifts left
          entity.gifts_left = entity.desiderioitems.filter((element) => { return element.bought_by === null}).length

          //questo non serve al backend
          // if(entity.what_bought && !entity.who_bought) {
          //   entity.desiderioitems.map((desiderio) => {
          //     if(desiderio.bought_by !== null) {
          //       desiderio.bought_by = 'someone'
          //     } 
          //    })
          // } else if(!entity.what_bought) {
          //   entity.desiderioitems.map((desiderio) => desiderio.bought_by = null)
          // }
        }
      })
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