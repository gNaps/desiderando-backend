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
    find(params, id) {
        console.log(id)
        return strapi.query('desiderioitem').find({users: id }, []);
    },
    /**
     * Promise to fetch record
     *
     * @return {Promise}
     */

    findOne(params) {
        console.log(params)
        return strapi.query('desiderioitem').findOne(params, ['desideriolist', 'bought_by']);
    },
    /**
     * Promise to search records
     *
     * @return {Promise}
     */

    search(params) {
        return strapi.query('desiderioitem').search(params, []);
    },
    /**
     * Promise to count records
     *
     * @return {Promise}
     */
    count(params) {
        return strapi.query('desiderioitem').count(params);
    },
    /**
     * Given an id of list return the gift left
     * @param {any} params 
     */
    async countGiftsLeft(params) {
        const items = await strapi.query('desiderioitem').count({ desideriolist: params.id, bought_by_null: true }, ['bought_by'])
        return items
    },
};
