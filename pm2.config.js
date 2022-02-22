module.exports = {
 apps: [
  {
   name: "NGROK - PM2",
   script: "./index.js",
   watch: true,
   node_args: "--trace-deprecation",
   exec_mode: "cluster",
   ignore_watch: ["[/\\]./", "node_modules", "cache", "^.", "^[.]"],
   watch_options: {
    followSymlinks: false,
   },
   args: ["--color"],
  }
 ],
};