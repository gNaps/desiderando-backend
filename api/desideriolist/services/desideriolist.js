'use strict';

/**
 * Read the documentation (https://strapi.io/documentation/developer-docs/latest/concepts/services.html#core-services)
 * to customize this service
 */

module.exports = {
    /**
     * Promise to fetch all records
     *
     * @return {Promise}
     */
    async find(params, populate) {
        const myList = await strapi.query('desideriolist').find({ users: params }, []);
        const invited = await strapi.query('desideriolist').find({ invited_users_contains: params }, [])

        if(myList.length > 0) {
            for(let i = 0; i < myList.length; i++) {
                myList[i].invited = false;
                myList[i].gifts_left = await strapi.services.desiderioitem.countGiftsLeft({id: myList[i].id});

                const owner =  await strapi.query('user', 'users-permissions').findOne({ id: myList[i].users }, ["username"]);
                myList[i].owner = owner.username;
            }
        }

        if(invited.length > 0) {
            for(let i = 0; i < invited.length; i++) {
                invited[i].invited = true;
                invited[i].gifts_left = await strapi.services.desiderioitem.countGiftsLeft({id: invited[i].id})

                const owner =  await strapi.query('user', 'users-permissions').findOne({ id: invited[i].users }, ["username"]);
                invited[i].owner = owner.username;
            }
        }

        return myList.concat(invited)
    },
    /**
     * Promise to fetch record
     *
     * @return {Promise}
     */

    async findOne(params) {
        const list = await strapi.query('desideriolist').findOne(params, ['desiderioitems']);
        const owner =  await strapi.query('user', 'users-permissions').findOne({ id: list.users }, []);
        console.log("owner => ", owner)

        list.owner = owner.username;
        return list;
    },

    async invitesUser(user, listId, lists) {
        const entity = await strapi.query('user', 'users-permissions').update({id: user}, {desideriolists_invited: [...lists, listId]})
        return entity
    },

    async update(listId, name) {
        const entity = await strapi.query('desideriolist').update({id: listId}, {name: name})
        

        delete entity.users.blocked
        delete entity.users.confirmationToken
        delete entity.users.confirmed
        delete entity.users.created_at
        delete entity.users.created_by
        delete entity.users.invite
        delete entity.users.password
        delete entity.users.provider
        delete entity.users.resetPasswordToken
        delete entity.users.role
        delete entity.users.updated_at
        delete entity.users.updated_by 
        
        return entity
    }
};
