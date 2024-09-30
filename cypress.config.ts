import { defineConfig } from "cypress";

require("dotenv").config();

export default defineConfig({
  e2e: {
    setupNodeEvents(on, config) {
      on("before:run", async (details) => {
        await fetch("http://localhost:3000/api/test-seed", {
          method: "POST",
          headers: {
            authorization: config.env["cypress_api_token"],
          },
        });
      });

      on("after:run", async (details) => {
        await fetch("http://localhost:3000/api/test-seed-clear", {
          method: "POST",
          headers: {
            authorization: config.env["cypress_api_token"],
          },
        });
      });
    },
    experimentalInteractiveRunEvents: true,
  },
  env: {
    auth0_username: process.env.AUTH0_USERNAME,
    auth0_password: process.env.AUTH0_PASSWORD,
    auth0_domain: process.env.AUTH0_DOMAIN,
    auth0_client_id: process.env.REACT_APP_AUTH0_CLIENTID,
    auth0_client_secret: process.env.AUTH0_CLIENT_SECRET,
    cypress_api_token: process.env.CYPRESS_API_TOKEN,
  },
});
