const { SlashCommandBuilder } = require("discord.js");

const RsnChat = require('rsnchat');
const rsnchat = new RsnChat(process.env.RSN);

module.exports = {
  cooldown: 45,
  data: new SlashCommandBuilder()
    .setName('ask')
    .setDescription('Задать вопрос нейросети')
    .addStringOption((option) =>
      option.setName('запрос')
        .setDescription('Что вы хотите спросить?')
        .setMaxLength(1024)
        .setRequired(true))
    .addStringOption((option) =>
      option.setName('модель')
        .setDescription('Модель, которой вы задаёте вопрос')
        .setRequired(true)
        .addChoices(
          { name: 'GPT', value: 'gpt' },
          { name: 'Gemini', value: 'gemini' },
          { name: 'Llama', value: 'llama' },
          { name: 'CodeLlama', value: 'codellama' },
          { name: 'Mixtral', value: 'mixtral' }
        )
    ),
  async execute(interaction) {
    await interaction.deferReply();

    const model = interaction.options.getString('модель');
    const text = interaction.options.getString('запрос');

    let res;

    interaction.editReply(`<a:loading:673777314584199169> | Ожидаем ответа...`)

    if (model === 'gpt') {
      await rsnchat.gpt(text)
        .then(response => {
          res = response.message
        }).catch(() => {
          interaction.editReply('<:no:1107254682100957224> | Ошибка. Повторите свой запрос чуть позже, либо измените его!')
          return
        });
    } else if (model === 'gemini') {
      await rsnchat.gemini(text)
        .then(response => {
          res = response.message
        }).catch(() => {
          interaction.editReply('<:no:1107254682100957224> | Ошибка. Повторите свой запрос чуть позже, либо измените его!')
          return 
        });
    } else if (model === 'mixtral') {
      await rsnchat.mixtral(text)
        .then(response => {
          res = response.message
        }).catch(() => {
          interaction.editReply('<:no:1107254682100957224> | Ошибка. Повторите свой запрос чуть позже, либо измените его!')
          return 
        });
    } else if (model === 'codellama') {
      await rsnchat.codellama(text)
        .then(response => {
          res = response.message
        }).catch(() => {
          interaction.editReply('<:no:1107254682100957224> | Ошибка. Повторите свой запрос чуть позже, либо измените его!')
          return 
        });
    } else {
      await rsnchat.llama(text)
        .then(response => {
          res = response.message
        }).catch(() => {
          interaction.editReply('<:no:1107254682100957224> | Ошибка. Повторите свой запрос чуть позже, либо измените его!')
          return 
        });
    }

    if (!res) return interaction.editReply('<:no:1107254682100957224> | Ответ не был получен!');
			if (res.length > 2000) {
				let mess = res;
				mess = mess.substring(0, 1997);
				mess = mess + '...';
				return interaction.editReply(mess);
			}
			interaction.editReply(res);
  },
};
