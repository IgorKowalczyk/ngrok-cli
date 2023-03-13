import "dotenv/config";
import chalk from "chalk";
import inquirer from "inquirer";
import ngrok from "ngrok";
import ora from "ora";
import { config } from "./config.js";
const spinner = ora(chalk.bold("Connecting...")).start();

await ngrok
 .authtoken(config.token)
 .then(() => {
  spinner.succeed(chalk.bold("Connected to ngrok!"));
 })
 .catch((err) => {
  spinner.fail(chalk.bold("Failed to connect to ngrok!"));
  console.error(err);
 });

const response = await inquirer.prompt([
 {
  type: "list",
  name: "protocol",
  message: "Select a protocol:",
  choices: config.allProtocols.map((protocol) => protocol.toUpperCase()),
  default: "tcp",
 },
]);

const port = await inquirer.prompt([
 {
  type: "input",
  name: "port",
  message: `Select a port for the tunnel (protocol: ${response.protocol}):`,
  default: config.ports.find((port) => port[0] == response.protocol.toLowerCase())[1],
 },
]);

const region = await inquirer.prompt([
 {
  type: "list",
  name: "region",
  message: "Select a region:",
  choices: ["us", "eu", "ap", "au", "sa", "jp", "in"],
  default: "eu",
 },
]);

const connecting = ora(chalk.bold("Connecting...")).start();
const int = ora(chalk.bold("Waiting for interface..."));
await ngrok
 .connect({
  proto: response.protocol.toLowerCase(),
  addr: port.port,
  region: region.region,
  authtoken: config.token,
  onStatusChange: (status) => {
   status == "connected" ? connecting.succeed(chalk.bold(`Connected to ${chalk.cyan(response.protocol)} tunnel using port ${chalk.cyan(port.port)} in ${chalk.cyan(region.region)}`)) : connecting.fail(chalk.bold("Failed to connect!"));
   int.start();
  },
 })
 .then(async (url) => {
  if (response.protocol == "HTTP") int.succeed(chalk.bold("Web interface: " + chalk.cyan(`${url}`)));
  if (response.protocol == "TLS") int.succeed(chalk.bold("Web interface: " + chalk.cyan(`${url}`)));
  if (response.protocol == "TCP") {
   int.succeed(chalk.bold("TCP interface: " + chalk.cyan(`${url}`)));
   const generate = await inquirer.prompt([
    {
     type: "confirm",
     name: "generate",
     message: "Generate a SSH connection string?",
     default: true,
    },
   ]);
   if (generate.generate) console.log(chalk.green("✔ ") + chalk.bold("SSH connection string:"), `ssh -p ${url.split(":")[2]} USERNAME@${url.split(":")[1].toString().replace("//", "")}`);
  }
 })
 .catch((err) => {
  connecting.stop();
  int.fail(chalk.bold.red("Failed to connect! " + err));
 });
