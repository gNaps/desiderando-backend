'use strict';
const TokenGenerator = require('uuid-token-generator');

/**
 * Read the documentation (https://strapi.io/documentation/developer-docs/latest/concepts/services.html#core-services)
 * to customize this service
 */

module.exports = {
    /**
   * Promise to add record
   *
   * @return {Promise}
   */

  async create(user) {
    const tokgen = new TokenGenerator(); // Default is a 128-bit token encoded in base58
    const token = tokgen.generate();
    
    const tokenUser = {
        user_tokenuser: user,
        token: token
    }

    const entry = await strapi.query('tokenuser').create(tokenUser);

    return entry;
  },
};