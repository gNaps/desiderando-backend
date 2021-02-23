const { sanitizeEntity } = require('strapi-utils');
const slugify = require('slugify');

module.exports = {
  /**
   * Retrieve records.
   *
   * @return {Array}
   */

  async find(ctx) {
    let entities;
    
    const { id } = ctx.state.user
    if (ctx.query.slug) {
      console.log('yo', ctx.query)
      //entities = await strapi.services.desideriolist.search(ctx.query);
      const entity = await strapi.services.desideriolist.findOne(ctx.query)
      return sanitizeEntity(entity, { model: strapi.models.desideriolist })
    } else {
      console.log('sono in else e chiamo il find')
      entities = await strapi.services.desideriolist.find(id);
    }

    //console.log('arrivo qui entities', entities)

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
  /**
   * Create a record.
   *
   * @return {Object}
   */

  async create(ctx) {
    let entity;
    const lista = ctx.request.body

    if(!lista.name || lista.name === '') {
        ctx.throw(400, 'Name is missing');
    }

    lista.users = ctx.state.user.id
    lista.slug = slugify(lista.name);
    entity = await strapi.services.desideriolist.create(lista);
    
    return sanitizeEntity(entity, { model: strapi.models.desideriolist });
  },

  async invitesUser(ctx) {
    const currentUser = ctx.state.user.id
    const listId = ctx.params.id
    const { username } = ctx.request.body

    console.log('currentUser', currentUser)
    console.log('listId', listId)
    console.log('username', username)

    const creatorList = await strapi.query('desideriolist').find({ id: listId }, [])
    console.log('creatorList', creatorList)

    if(!creatorList || creatorList.length === 0) {
      ctx.throw(404);
    } else {
      if(!creatorList[0].public && creatorList[0].users != currentUser) {
        ctx.throw(403);
      }
    }

    const userToInvite = await strapi.query('user', 'users-permissions').find({username: username}, [])

    if(!userToInvite || userToInvite.length === 0) {
      ctx.throw(404, 'User not found')
    }

    const invited = await strapi.query('desideriolist').find({ invited_users_contains: userToInvite[0].id }, [])
    console.log('utente recuperato', userToInvite[0])
    console.log('liste a cui utente è invitato', invited)
    
    const found = invited.find((list) => { return list.id == listId})

    if(found) {
      ctx.throw(400, 'This user is already invited');
    }

    let entity;
    entity = await strapi.services.desideriolist.invitesUser(userToInvite[0].id, listId, invited);

    return sanitizeEntity(entity, { model: strapi.plugins['users-permissions'].models.user });
  },

  async update(ctx) {
    const currentUser = ctx.state.user.id
    const listId = ctx.params.id
    const { listName } = ctx.request.body
    
    // Non posso cambiare slug, rompe recupero dei dati 
    // const slug = slugify(listName);

    if(!listName || listName == "") {
      ctx.throw(400, "Name not valid");
    }

    console.log('currentUser', currentUser)
    console.log('listId', listId)
    console.log('listName', listName)

    const creatorList = await strapi.query('desideriolist').find({ id: listId }, [])
    console.log('creatorList', creatorList)

    if(!creatorList || creatorList.length === 0) {
      ctx.throw(404);
    } else {
      if(!creatorList[0].public && creatorList[0].users != currentUser) {
        ctx.throw(403);
      }
    }

    let entity;
    entity = await strapi.services.desideriolist.update(listId, listName);

    
    return sanitizeEntity(entity, { model: strapi.plugins['users-permissions'].models.user });
  }
};