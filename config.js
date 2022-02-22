module.exports = {
 token: process.env.NGROK_TOKEN,
 defaults: {
  protocol: 'tcp',
  region: 'eu',
  port: '22'
 },
 ssh: { // Enable auto-generated ssh command
   enabled: true,
   user: "igorkowalczyk"
 },
 all_protocols: ['tcp', 'http', 'tls']
}