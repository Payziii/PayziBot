const { RsnChat } = require("rsnchat");
const rsnchat = new RsnChat(process.env.RSN);
const { emojis } = require("../../config.js");

exports.run = async (client, message, args) => {
  message.reply(`${emojis.loading} | Ожидаем ответа...`).then(async (msg) => {
    let text1 = args.join(" ");
    let text = text1
      .replace("--gpt", "")
      .replace("--gemini", "")
      .replace("--grok2mini", "")
      .replace("--grok2", "")

    let model;
    let suc = true;

    if (text1.endsWith("--grok2mini")) model = "grok-2-mini";
    else if (text1.endsWith("--grok2")) model = "grok-2";
    else if (text1.endsWith("--gpt")) model = "gpt";
    else model = "gemini";

    if (model === "gpt") {
      await rsnchat.chat(text, "gpt4")
        .then((response) => {
          res = response.message;
        })
        .catch(() => {
          msg.edit(
            `${emojis.error} | Ошибка. Повторите свой запрос чуть позже, либо измените его!`
          );
          return (suc = false);
        });
    } else if (model === "gemini") {
      await rsnchat.chat(text, "gemini")
        .then((response) => {
          res = response.message;
        })
        .catch(() => {
          msg.edit(
            `${emojis.error} | Ошибка. Повторите свой запрос чуть позже, либо измените его!`
          );
          return (suc = false);
        });
    } else if (model === "grok-2") {
      await rsnchat.chat(text, "grok-2")
        .then((response) => {
          res = response.message;
        })
        .catch(() => {
          msg.edit(
            `${emojis.error} | Ошибка. Повторите свой запрос чуть позже, либо измените его!`
          );
          return (suc = false);
        });
    } else {
      await rsnchat.chat(text, "grok-2-mini")
        .then((response) => {
          res = response.message;
        })
        .catch(() => {
          msg.edit(
            `${emojis.error} | Ошибка. Повторите свой запрос чуть позже, либо измените его!`
          );
          return (suc = false);
        });
    }

    if (!suc) return;
    if (!res) return msg.edit(`${emojis.error} | Ответ не был получен!`);
    if (res.length > 2000) {
      let mess = res;
      mess = mess.substring(0, 1930);
      mess = mess + "...\n\n-# Ответ был обрезан из-за ограничений Discord!";
      return msg.edit(mess);
    }
    msg.edit(res);
  });
};
exports.help = {
  name: ",ask",
  aliases: [
    ",chatgpt4",
    "gpt4",
    ",гпт4",
    "gpt4",
    ",гпт",
    ",gpt",
  ],
  description: "Генерация текста через нейросети",
};
