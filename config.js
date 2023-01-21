export const config = {
 token: process.env.NGROK_TOKEN,
 defaults: {
  protocol: "tcp",
  region: "eu",
  port: "22",
 },
 allProtocols: ["tcp", "http", "tls"],
 ports: [
  ["tcp", "22"],
  ["http", "80"],
  ["tls", "443"],
 ],
};
