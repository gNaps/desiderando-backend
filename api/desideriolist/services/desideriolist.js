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
    find(params, populate) {
        console.log(params)
        return strapi.query('desideriolist').find({ users: params }, ['desiderioitems']);
    },
    /**
     * Promise to fetch record
     *
     * @return {Promise}
     */

    findOne(params) {
        console.log(params)
        return strapi.query('desideriolist').findOne(params, ['desiderioitems']);
    },
};
