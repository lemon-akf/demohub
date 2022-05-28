const jwt = require("jsonwebtoken");
const { PRIVATE_KEY } = require("../app/config");
class anutController {
  async login(ctx, next) {
    // 获取用户请求传递的参数
    console.log("user", ctx.user);
    const { id, name } = ctx.user;
    const token = jwt.sign({ id, name }, PRIVATE_KEY, {
      algorithm: "RS256",
      expiresIn: 60 * 60 * 24,
    });
    // console.log("user", user);
    //数据库查询数据
    // 返回数据
    ctx.body = {
      id,
      name,
      token,
    };
  }
  async test(ctx, next) {
    // console.log("test controller");
    ctx.body = ctx.user;
  }
}
module.exports = new anutController();
