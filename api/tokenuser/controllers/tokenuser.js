'use strict';
const tokenuser = require("../services/tokenuser");
const { sanitizeEntity } = require('strapi-utils');

/**
 * Read the documentation (https://strapi.io/documentation/developer-docs/latest/concepts/controllers.html#core-controllers)
 * to customize this controller
 */

module.exports = {
  /**
   * Verifica se il token è ancora valido.
   * @return {Object}
   */

  async findOne(ctx) {
    const { id } = ctx.params;
    console.log("il token da verificare => ", id);

    const tokenUser = await strapi.query('tokenuser').find({token: id}, []);
    console.log("il token trovato => ", tokenUser[0]);

    if(!tokenUser || tokenUser.length == 0) {
        ctx.throw(404, "Token not found");
    }

    const tokenDate = tokenUser[0].created_at;
    const istantTime = new Date();
    const diffTime = Math.abs(istantTime - tokenDate);

    console.log("tokenDate ", tokenDate);
    console.log("istantTime ", istantTime);
    console.log("diffTime ", diffTime);

    if(diffTime >= 7200000) {
        ctx.throw(403, "Token expired");
    }

    return sanitizeEntity(tokenUser, { model: strapi.models.tokenuser });
  },

  /**
   * Aggiorna la password
   * @return {Object}
   */

  async updatePasswordByToken(ctx) {
    const request = ctx.request.body;

    if(request.newPassword !== request.confirmPassword) {
      ctx.throw(400, "The two passwords not matching");
    }

    const tokenUser = await strapi.query('tokenuser').find({token: request.token}, []);
    console.log("il token trovato => ", tokenUser[0]);

    if(!tokenUser || tokenUser.length == 0) {
        ctx.throw(404, "Token not found");
    }

    const tokenDate = tokenUser[0].created_at;
    const istantTime = new Date();
    const diffTime = Math.abs(istantTime - tokenDate);

    if(diffTime >= 7200000) {
        ctx.throw(403, "Token expired");
    }

    const user = await strapi.query('user', 'users-permissions').find({id: tokenUser.user_tokenuser}, [])
    console.log("utente trovato => ", user[0]);
    //user[0].password = request.newPassword;

    const password = await strapi.plugins['users-permissions'].services.user.hashPassword({password: request.newPassword});

    if(password === user[0].password) {
      ctx.throw(400, "New password can not be the same as old");
    }

    const entity = await strapi.query('user', 'users-permissions').update({id: user[0].id}, {password: password});

    return sanitizeEntity(entity, { model: strapi.models.tokenuser });
  },
};
