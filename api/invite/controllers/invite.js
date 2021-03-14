'use strict';

/**
 * Read the documentation (https://strapi.io/documentation/developer-docs/latest/concepts/controllers.html#core-controllers)
 * to customize this controller
 */

module.exports = {
    async recoveryPassword(ctx) {
        const userLoggedIn = ctx.request.body;
        const userToSend = await strapi.query('user', 'users-permissions').find({email: userLoggedIn.email}, [])
        
        if(!userToSend || userToSend.length == 0)
        {
            // email inserita non equivale a nessun utente
        } 

        // Generate token of the request
        const token = await strapi.services.tokenuser.create(userToSend[0]);
        console.log("token generato è ", token)
        const page = `${process.env.FRONTEND_URL}/auth/changePassword?token=${token.token}`;

        // Send an email to validate his subscriptions.
        const template = await strapi.query('setting').find({ setting_key: 'mail_template_recovery_password' }, []);

        let messageEmail = template[0].setting_value;
        messageEmail = messageEmail.replace("{{0}}", userToSend[0].username);
        messageEmail = messageEmail.replace("{{1}}", userLoggedIn.device);
        messageEmail = messageEmail.replace("{{2}}", userLoggedIn.browser);
        messageEmail = messageEmail.replace("{{3}}", page);
        
        strapi.services.email.send('', userLoggedIn.email, 'Recupero Password', 'Recupero Password', messageEmail, '');

        // Send response to the frontend.
        ctx.send({
            ok: true,
        });
    },
};
