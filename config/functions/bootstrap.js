'use strict';

/**
 * An asynchronous bootstrap function that runs before
 * your application gets started.
 *
 * This gives you an opportunity to set up your data model,
 * run jobs, or perform some special logic.
 *
 * See more details here: https://strapi.io/documentation/developer-docs/latest/concepts/configurations.html#bootstrap
 */

module.exports = () => {

    try {
        if (strapi.connections.default.client.config.client === "pg") {
          await strapi.connections.default.raw(
            `CREATE OR REPLACE FUNCTION lower(id INTEGER)
        RETURNS TEXT AS $$
    BEGIN
        -- casts integer to text
        RETURN lower(cast(id as TEXT));
    END; $$
    LANGUAGE plpgsql`
          );
        }
      } catch (err) {
        console.log("error", err);
      }

};
