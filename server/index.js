const express = require("express");
const app = express();

require("dotenv").config();
require("./startup/db")();
require("./startup/cors")(app);
require("./startup/routes")(app);

const port = process.env.PORT || 9000;
app.listen(port, () => console.log(`Listening to PORT ${port}...`));
