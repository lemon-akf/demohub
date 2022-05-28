const Router = require("koa-router");

const { login, test } = require("../controller/auth.controller");
const { verifyLogin, verifyAuth } = require("../middleware/auth.middleware");

const authRouter = new Router({ prefix: "" });

authRouter.post("/login", verifyLogin, login);
authRouter.post("/test", verifyAuth, test);

module.exports = authRouter;
