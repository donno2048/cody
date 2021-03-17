const venom = require('venom-bot');
var exec = require('child_process').exec, child;
venom.create().then((client) => start(client));
function start(client) {
  client.onAnyMessage(async (message) => {
    if(message.body.slice(0, 1) === "#"){
      var lang = message.body.slice(1, 4);
      var code = message.body.substr(4);
      var start = "";
      var end = "";
      var mess = "";
      if (message.body.slice(1, 5) === "help"){
        client.reply(message.from, '𝕔𝕠𝕕𝕪\n\nThis is a bot to execute code from WhatsApp.\nUse the command _#py <code>_ to run code in Python.\nUse #js and #sh to use JavaScript and Bash.\n\nUse #help to see this help message.', message.id.toString());
        return;
      }
      if (lang === "py ") {
        if (code.includes("'") || code.includes("os")) {
         client.reply(message.from, 'You used an unallowed word use #un to see the list of unallowed words', message.id.toString());
         return;
        }
        start = "python3 -c '";
        end = "'";
      }
      else if (lang === "js ") {
        if (code.includes("'") || code.includes("fs") || code.includes("child")) {
         client.reply(message.from, 'You used an unallowed word use #un to see the list of unallowed words', message.id.toString());
         return;
        }
        start = "node -e '";
        end =  "'";
        code = code.split("\"").join("\\\"");
      }
      else if (lang === "sh ") {
        if (code.includes("mnt") || code.includes("rm") || code.includes("shutdown")) {
         client.reply(message.from, 'You used an unallowed word use #un to see the list of unallowed words', message.id.toString());
         return;
        }
      }
      else if (lang.includes("un")) { //This is purly for security, there are ways to pass that but I don't really care 😅
        client.reply(message.from, '_*Unallowed words:*_\n*py (Python):* _\'_, _os_\n*js (JavaScript):* _\'_, _fs_ and _child_\n*sh (Bash):* _mnt_, _rm_ and _shutdown_', message.id.toString());
        return;
      }
      else {
        client.reply(message.from, 'No valid language specified', message.id.toString());
        return;
      }
      exec(start + code + end, (err, stdout, stderr) => { //On Windows to use wsl add "'wsl ' + " before start (or "'ubuntu run ' + " to use ubuntu and such)
        if (err) {
          client.reply(message.from, `Process got an error: ${err}`, message.id.toString());
        }
        else if (stdout) {
          mess += `Process got a success: ${stdout}`;
          if (stderr) {
            mess += `\nAnd sdterr: ${stderr}`;
          }
          client.reply(message.from, mess, message.id.toString());
        }
      });
    }
  })
}