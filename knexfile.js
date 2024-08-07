const dotenv = require("dotenv");
const path = require("path");

if (process.env.NODE_ENV === "test") {
  dotenv.config({ path: path.resolve(__dirname, ".env.test") });
} else {
  dotenv.config({ path: path.resolve(__dirname, ".env") });
}

module.exports = {
  development: {
    client: "pg",
    connection: {
      host: process.env.DB_HOST,
      database: process.env.DB_NAME,
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      charset: "utf8",
    },
  },
  test: {
    client: "pg",
    connection: {
      host: process.env.DB_HOST,
      database: process.env.DB_NAME,
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      charset: "utf8",
    },
  },
};
