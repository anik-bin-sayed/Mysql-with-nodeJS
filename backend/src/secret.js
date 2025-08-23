require("dotenv").config();

const server_port = process.env.PORT || 5000;
const jwt_secret = process.env.SECRET || "your_jwt_secret_key";

module.exports = {
  server_port,
  jwt_secret,
};
