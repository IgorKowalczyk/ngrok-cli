import "dotenv/config";
import { select, number, confirm } from "@inquirer/prompts";
import chalk from "chalk";
import ngrok from "ngrok";
import ora from "ora";
import { config } from "./config.js";

try {
 const protocolAnswer = await select({
  message: "Select a protocol:",
  choices: config.allProtocols.map((protocol) => {
   return { name: protocol.toUpperCase(), value: protocol };
  }),
  default: "tcp",
 });

 const portAnswer = await number({
  name: "port",
  message: `Select a port for the tunnel (protocol: ${protocolAnswer.toUpperCase()}):`,
  default: config.ports.find((port) => port[0] == protocolAnswer)[1],
 });

 const regionAnswer = await select({
  message: "Select a region:",
  choices: ["us", "eu", "ap", "au", "sa", "jp", "in"],
  default: "eu",
 });

 const connecting = ora(chalk.bold("Connecting...")).start();
 const int = ora(chalk.bold("Waiting for interface..."));

 const url = await ngrok.connect({
  proto: protocolAnswer,
  addr: portAnswer,
  region: regionAnswer,
  authtoken: config.token,
  onStatusChange: (status) => {
   status == "connected" ? connecting.succeed(chalk.bold(`Connected to ${chalk.cyan(protocolAnswer)} tunnel using port ${chalk.cyan(portAnswer)} in ${chalk.cyan(regionAnswer)}`)) : connecting.fail(chalk.bold("Failed to connect!"));
   int.start();
  },
 });

 if (!url) int.fail(chalk.bold("Failed to connect! Please try again!"));

 if (protocolAnswer == "http") int.succeed(chalk.bold("Web interface: " + chalk.cyan(`${url}`)));
 if (protocolAnswer == "tls") int.succeed(chalk.bold("Web interface: " + chalk.cyan(`${url}`)));
 if (protocolAnswer == "tcp") {
  int.succeed(chalk.bold("TCP interface: " + chalk.cyan(`${url}`)));
  const generateAnswer = await confirm({
   message: "Generate a SSH connection string?",
   default: true,
  });
  if (generateAnswer) console.log(chalk.green("✔ ") + chalk.bold("SSH connection string:"), `ssh -p ${url.split(":")[2]} USERNAME@${url.split(":")[1].toString().replace("//", "")}`);
 }
} catch (err) {
 console.error(err);
}
