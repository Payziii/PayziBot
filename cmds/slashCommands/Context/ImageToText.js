const { ContextMenuCommandBuilder, ApplicationCommandType } = require("discord.js");
const { createWorker } = require('tesseract.js');

module.exports = {
    data: new ContextMenuCommandBuilder()
        .setName('Фото в текст')
        .setType(ApplicationCommandType.Message),
    async execute(interaction) {
        await interaction.deferReply({ephemeral: true })
        const message = await interaction.options.getMessage('message')
        if (!message.attachments.size) return interaction.editReply("<:no:1107254682100957224> | В данном сообщении нет картинки")
        const attachment = message.attachments.first()
        if (!attachment.contentType.startsWith('image/')) return interaction.editReply("<:no:1107254682100957224> | В данном сообщении нет картинки")

        const worker = await createWorker('rus+eng');
        const ret = await worker.recognize(attachment.url);
        interaction.editReply(ret.data.text || "Нет текста");
        await worker.terminate();
    },
};
