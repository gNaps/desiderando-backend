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
                console.log('i', i)
                myList[i].invited = false;
                myList[i].gifts_left = await strapi.services.desiderioitem.countGiftsLeft({id: myList[i].id})
            }
        }

        console.log('myList', myList)

        if(invited.length > 0) {
            for(let i = 0; i < invited.length; i++) {
                invited[i].invited = true;
                invited[i].gifts_left = await strapi.services.desiderioitem.countGiftsLeft({id: invited[i].id})
            }
        }

        return myList.concat(invited)
    },
    /**
     * Promise to fetch record
     *
     * @return {Promise}
     */

    findOne(params) {
        return strapi.query('desideriolist').findOne(params, ['desiderioitems']);
    },

    async invitesUser(user, listId, lists) {
        const entity = await strapi.query('user', 'users-permissions').update({id: user}, {desideriolists_invited: [...lists, listId]})
        return entity
    }
};
