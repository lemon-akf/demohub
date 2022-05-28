const app = require("./app");
require("./app/database");
const config = require("./app/config");
app.listen(config.APP_PORT, () => {
  console.log("服务器启动成功~端口为", config.APP_PORT);
});
