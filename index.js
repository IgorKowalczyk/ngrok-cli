(async () => {
 require("dotenv").config();
 const config = require("./config");
 const ngrok = require("ngrok");
 const chalk = require("chalk");
 console.log(chalk.cyan(chalk.bold("[NGROK] > Starting")));
 await ngrok.authtoken(config.token);
 console.log(chalk.cyan(chalk.bold("[NGROK] > Connected to ngrok tunnel...")));
 // TODO: Ask user for ngrok port, addr and region [5s timeout]
 const url = await ngrok.connect({
  proto: config.defaults.protocol, 
  addr: config.defaults.port,
  authtoken: config.token,
  region: config.defaults.region,
  onStatusChange: (status) => {
    console.info(chalk.bold(chalk.cyan(`[NGROK] > Status: `) + (status == "online" ? chalk.red(status) : chalk.green(status))));
   },
});
console.log(chalk.cyan(chalk.bold(`[NGROK] > URL: ${url}`)));
 if (config.defaults.protocol == "tcp" && config.ssh.enabled == true && config.ssh.user) {
  const port = url.split(":")[2];
  const protocol = url.split(":")[0];
  const adress = url.split(":")[1].toString().replace("//", "");
  console.log(chalk.bold(chalk.cyan("[NGROK] > SSH Command: ") + chalk.whiteBright.bgBlackBright(`ssh -p ${port} ${config.ssh.user}@${adress}`)));
 }
})();