'use strict';

/**
 * Read the documentation (https://strapi.io/documentation/developer-docs/latest/concepts/controllers.html#core-controllers)
 * to customize this controller
 */

module.exports = {
    async recoveryPassword(ctx) {
        const user = ctx.request.body;

        // Send an email to validate his subscriptions.
        const template = await strapi.query('setting').find({ setting_key: 'mail_template_recovery_password' }, [])
        strapi.services.email.send('', user.email, 'Recupero Password', 'Recupero Password', template[0].setting_value, '');

        // Send response to the server.
        ctx.send({
        ok: true,
        });
    },
};
