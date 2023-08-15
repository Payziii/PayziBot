const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");

module.exports = {
    data: new SlashCommandBuilder()
        .setName("userinfo")
        .setDescription("Получить информацию о пользователе")
        .addUserOption((option) =>
            option
                .setName("пользователь")
                .setDescription("Пользователь, чья информация вас интересует")
                .setRequired(false)
        ),
    async execute(interaction, guild) {
        const user = interaction.options.getUser("пользователь") || interaction.user;
        const url = `https://cdn.discordapp.com/avatars/${user.id}/${user.avatar}.webp?size=4096`;
        const status = {
            offline: "<:offline:674463290755252277>",
            online: "<:online:674463345625268225>",
            dnd: "<:dnd:674463406983610410>",
            idle: "<:idle:674463345927258152>",
        };
        const member = await interaction.guild.members.cache.get(user.id);
        let activity;
        if(!member.presence) {
            activity = "None"
        }else{
            activity = member.presence.activities[0] || "None";
        }
        let a = "1";
        if(activity.name === "Custom Status") {
            a = "Custom Status"
            activity = member.presence.activities[0].state;
        }
            
            if(activity === "None") {
                activity = ""
        }else if(a != "Custom Status") { activity = `Играет в **${activity.name}**`}

        const flags = {
            "": "None",
            "ActiveDeveloper": "<:ActiveDeveloper:1106487595803877376>",
            "BugHunterLevel1": "<:BugHunter1:1106488199397789707>",
            "BugHunterLevel2": "<:BugHunter2:1106488253047115806>",
            "CertifiedModerator": "<:CertifiedModerator:1106488362333917215> ",
            "HypeSquadOnlineHouse1": "<:HypeSquadBravery:1106488701325955072>",
            "HypeSquadOnlineHouse2": "<:HypeSquadBrilliance:1106527440379068436>",
            "HypeSquadOnlineHouse3": "<:HypeSquadBalance:1106488947372200056>",
            "Hypesquad": "<:HypeSquadEvents:1106489062698795010>",
            "Partner": "<:DiscordPartner:1106489199546339409>",
            "PremiumEarlySupporter": "<:EarlySupporter:1106489367645659146>",
            "Staff": "<:DiscordStaff:1106489645237285015>",
            "VerifiedBot": "<:Bot:732119152755474444>",
            "VerifiedDeveloper": "<:Developer:1106490170917781616>"
        };

        const embed = new EmbedBuilder()
            .setColor(guild.colors.basic)
            .setTitle(`${status[member.presence?.status ?? "offline"]} ${user.username}`)
            .setDescription(`${activity}
            <:arrow:1140937463209152572> Значки: ${user.flags.toArray().map(flag => flags[flag]).filter(Boolean).join(' ')}`)
            .setThumbnail(url)
            .addFields(
                {
                    name: "Дата регистрации",
                    value: `<t:${(user.createdTimestamp/1000).toFixed(0)}:D> (<t:${(user.createdTimestamp/1000).toFixed(0)}:R>)`,
                    inline: true,
                },
                {
                    name: "Зашел на сервер",
                    value: `<t:${(member.joinedTimestamp/1000).toFixed(0)}:D> (<t:${(member.joinedTimestamp/1000).toFixed(0)}:R>)`,
                    inline: true,
                },
                {
                    name: "Роли",
                    value: `${member.roles.cache.filter(r => r.id !== r.guild.id).map(r => r).join(', ') || "Отсутствуют"}`,
                }
            )
            .setFooter({text: `ID: ${user.id}`});
        await interaction.reply({embeds: [embed]});
    },
};
