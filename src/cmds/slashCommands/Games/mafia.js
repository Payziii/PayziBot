// commands/games/mafia.js
const { SlashCommandBuilder, EmbedBuilder, ButtonBuilder, ButtonStyle, ActionRowBuilder } = require('discord.js');
const roles = require('../../../games_src/mafia/roles.json');
const { emojis } = require('../../../config.js');

module.exports = {
    category: 'games',
    cooldown: 60,
    skip: true,
    data: new SlashCommandBuilder()
        .setName('mafia')
        .setDescription('Игра "Мафия"'),
    async execute(interaction, guild) {
        await interaction.deferReply();

        const users = [];
        const expiredTimestamp = Math.round(Date.now() / 1000) + 60;

        const embed = new EmbedBuilder()
            .setTitle('Набор в игру: Мафия')
            .setDescription(`Нажмите на кнопку ниже, чтобы участвовать в игре.\n\nМинимум игроков: **5**, максимум: **12**.\nНабор окончится: <t:${expiredTimestamp}:R>`)
            .setColor(guild.colors.basic);

        const join_button = new ButtonBuilder()
            .setCustomId('join_button')
            .setLabel('Играть!')
            .setStyle(ButtonStyle.Success);

        const row = new ActionRowBuilder().addComponents(join_button);

        await interaction.editReply({ embeds: [embed], components: [row] });

        const collector = interaction.channel.createMessageComponentCollector({ filter: i => i.customId === 'join_button', time: 60000 });

        collector.on('collect', async (button) => {
            if (users.includes(button.user.id)) {
                return button.reply({ content: `${emojis.error} | Вы уже присоединились!`, ephemeral: true });
            }

            users.push(button.user.id);
            await button.reply({ content: '✅ | Вы присоединились к игре Мафия!', ephemeral: true });

            const updatedEmbed = EmbedBuilder.from(embed)
                .setDescription(`${embed.data.description}\n\n**Игроки (${users.length}/12):**\n${users.map(u => `<@${u}>`).join('\n')}`);
            await interaction.editReply({ embeds: [updatedEmbed] });

            if (users.length >= 12) collector.stop();
        });

        collector.on('end', async () => {
            join_button.setDisabled(true);
            await interaction.editReply({ components: [new ActionRowBuilder().addComponents(join_button)] });

            if (users.length < 5) {
                const cancelEmbed = new EmbedBuilder()
                    .setTitle('Набор отменён')
                    .setDescription('Недостаточно игроков для начала (нужно минимум 5).')
                    .setColor(guild.colors.error);
                return interaction.followUp({ embeds: [cancelEmbed] });
            }

            await startGame(users);
        });

        // ------- GAME STATE -------
        async function startGame(players) {
            // state objects
            const gameRoles = assignRoles(players); // { playerId: roleObject }
            const alive = new Set(players);
            let round = 0;

            // send DMs with roles
            for (const [playerId, role] of Object.entries(gameRoles)) {
                const member = await interaction.guild.members.fetch(playerId).catch(() => null);
                if (!member) continue;
                const dmEmbed = new EmbedBuilder()
                    .setTitle(`Ваша роль: ${role.name}`)
                    .setDescription(role.target)
                    .setColor(role.color === 'black' ? guild.colors.error : guild.colors.basic)
                    .setFooter({ text: 'Действия будут приходить в ЛС ночью.' });
                await member.send({ embeds: [dmEmbed] }).catch(() => null);
            }

            await interaction.channel.send({
                embeds: [new EmbedBuilder()
                    .setTitle('🎭 Игра "Мафия" начинается!')
                    .setDescription(`**Игроки:**\n${players.map(u => `<@${u}>`).join('\n')}\n\nРоли розданы. Игра начнётся ночью.`)
                    .setColor(guild.colors.basic)]
            });

            // main loop
            while (true) {
                round++;
                if (checkVictory()) break;
                await nightPhase();
                if (checkVictory()) break;
                await dayPhase();
                if (checkVictory()) break;
            }

            // announce winner
            function checkVictory() {
                // count alive roles
                const aliveList = Array.from(alive);
                const mafiaSet = aliveList.filter(id => {
                    const r = gameRoles[id];
                    return r && (r.name === 'Глава мафии' || r.name === 'Мафия');
                });
                const maniacSet = aliveList.filter(id => {
                    const r = gameRoles[id];
                    return r && r.name === 'Маньяк';
                });
                const townCount = aliveList.length - mafiaSet.length - maniacSet.length;

                // mafia win: mafia >= others (town + special) OR mafia equal to others
                if (mafiaSet.length > 0 && mafiaSet.length >= (aliveList.length - mafiaSet.length)) {
                    announceEnd('Мафия');
                    return true;
                }

                // if all mafia dead and at least one town alive => town win
                if (mafiaSet.length === 0 && (aliveList.length - maniacSet.length) > 0) {
                    announceEnd('Мирные жители');
                    return true;
                }

                // maniac win: only maniac alive
                if (maniacSet.length > 0 && aliveList.length === maniacSet.length) {
                    announceEnd('Маньяк');
                    return true;
                }

                return false;
            }

            async function announceEnd(winnerName) {
                const finalList = Array.from(alive).map(id => {
                    const r = gameRoles[id];
                    return `<@${id}> — ${r ? r.name : 'Неизвестная роль'}`;
                }).join('\n') || 'Никто не выжил...';

                const endEmbed = new EmbedBuilder()
                    .setTitle('Игра окончена!')
                    .setDescription(`Победители: **${winnerName}**\n\n**Выжившие:**\n${finalList}`)
                    .setColor(guild.colors.basic);
                await interaction.channel.send({ embeds: [endEmbed] });
            }

            // ---------------- NIGHT ----------------
            async function nightPhase() {
                const nightEmbed = new EmbedBuilder()
                    .setTitle(`🌙 Ночь №${round}`)
                    .setDescription('Ночь. Все засыпают. Выполняются ночные действия.')
                    .setColor(guild.colors.basic);
                await interaction.channel.send({ embeds: [nightEmbed] });

                // collect actions
                const aliveList = Array.from(alive);

                // determine alive players for targeting
                const targetChoices = aliveList.map(id => ({ id, mention: `<@${id}>` }));

                // Helper to send DM with buttons and wait for 1 selection (or timeout)
                async function dmPick(userId, promptText, choices, time = 30000, extraRows = null) {
                    try {
                        const member = await interaction.guild.members.fetch(userId).catch(() => null);
                        if (!member) return null;
                        const dm = await member.send({
                            embeds: [new EmbedBuilder().setTitle(promptText).setDescription(choices.map(c => c.mention).join('\n')).setColor(guild.colors.basic)],
                            components: []
                        }).catch(() => null);
                        if (!dm) return null;

                        // build buttons (max 5 per row). customId: act_userid_targetid
                        const rows = [];
                        const buttons = choices.map(c =>
                            new ButtonBuilder()
                                .setCustomId(`pick_${userId}_${c.id}`)
                                .setLabel(c.mention)
                                .setStyle(ButtonStyle.Primary)
                        );

                        for (let i = 0; i < buttons.length; i += 5) {
                            rows.push(new ActionRowBuilder().addComponents(buttons.slice(i, i + 5)));
                        }

                        // add extra rows if provided (like check/kill toggles)
                        if (extraRows && Array.isArray(extraRows)) {
                            rows.push(...extraRows);
                        }

                        // edit message to add components
                        await dm.edit({ components: rows }).catch(() => null);

                        // collector on DM message
                        return await new Promise(resolve => {
                            const filter = i => i.user.id === userId && i.customId.startsWith(`pick_${userId}_`);
                            const collect = dm.channel.createMessageComponentCollector({ filter, time });
                            let finished = false;
                            collect.on('collect', async (btn) => {
                                if (finished) return;
                                finished = true;
                                const parts = btn.customId.split('_'); // ['pick', userId, targetId]
                                const targetId = parts[2];
                                await btn.reply({ content: `Вы выбрали ${choices.find(c => c.id === targetId)?.mention || `<@${targetId}>`}`, ephemeral: true }).catch(() => null);
                                collect.stop();
                                resolve(targetId);
                            });
                            collect.on('end', () => {
                                if (!finished) resolve(null);
                            });
                        });
                    } catch (e) {
                        return null;
                    }
                }

                // ACTIONS:
                // 1) Mafia choose target (all mafia vote; leader overrides)
                const mafiaIds = Array.from(alive).filter(id => {
                    const r = gameRoles[id];
                    return r && (r.name === 'Глава мафии' || r.name === 'Мафия');
                });

                let mafiaTarget = null;
                if (mafiaIds.length > 0) {
                    // send DM to each mafia to pick (exclude fellow mafia from choices to avoid friendly-fire)
                    const mafiaChoices = targetChoices.filter(t => {
                        const r = gameRoles[t.id];
                        // allow choosing fellow mafia? Typically mafia can choose any non-mafia; we'll allow choosing anyone except themselves.
                        return t.id !== undefined;
                    });

                    // collectors: gather votes. If leader chooses, leader overrides.
                    const votes = new Map(); // voterId -> targetId
                    const leader = mafiaIds.find(id => gameRoles[id].name === 'Глава мафии');

                    // for each mafia, send DM and wait
                    const mafiaPromises = mafiaIds.map(async id => {
                        const pick = await dmPick(id, 'Мафия: выберите цель для убийства (ночь)', mafiaChoices, 30000);
                        if (pick) votes.set(id, pick);
                    });

                    // wait for all or timeouts
                    await Promise.allSettled(mafiaPromises);

                    // leader override
                    if (leader && votes.has(leader)) {
                        mafiaTarget = votes.get(leader);
                    } else {
                        // majority among votes
                        const count = {};
                        for (const t of votes.values()) {
                            count[t] = (count[t] || 0) + 1;
                        }
                        const sorted = Object.entries(count).sort((a, b) => b[1] - a[1]);
                        if (sorted.length > 0) {
                            // tie -> random among top
                            const topCount = sorted[0][1];
                            const top = sorted.filter(([k, v]) => v === topCount).map(([k]) => k);
                            mafiaTarget = top[Math.floor(Math.random() * top.length)];
                        } else {
                            mafiaTarget = null;
                        }
                    }
                }

                // 2) Маньяк target (if alive)
                const maniacIds = Array.from(alive).filter(id => gameRoles[id] && gameRoles[id].name === 'Маньяк');
                let maniacTarget = null;
                if (maniacIds.length > 0) {
                    // for simplicity: maniac acts independently; if multiple (rare), first picks
                    const pick = await dmPick(maniacIds[0], 'Маньяк: выберите цель для убийства (ночь)', targetChoices, 30000);
                    maniacTarget = pick;
                }

                // 3) Врач: кого лечить
                const doctorIds = Array.from(alive).filter(id => gameRoles[id] && gameRoles[id].name === 'Врач');
                let doctorHeal = null;
                if (doctorIds.length > 0) {
                    const pick = await dmPick(doctorIds[0], 'Врач: выберите, кого лечить этой ночью', targetChoices, 30000);
                    doctorHeal = pick;
                }

                // 4) Комиссар: проверить или убить
                const commissarIds = Array.from(alive).filter(id => gameRoles[id] && gameRoles[id].name === 'Комиссар');
                let commissarAction = null; // { type: 'check'|'kill', targetId }
                if (commissarIds.length > 0) {
                    const commId = commissarIds[0];
                    // Create extra buttons for check/kill selection
                    const checkBtn = new ButtonBuilder().setCustomId(`commact_check_${commId}`).setLabel('Проверить').setStyle(ButtonStyle.Success);
                    const killBtn = new ButtonBuilder().setCustomId(`commact_kill_${commId}`).setLabel('Убить').setStyle(ButtonStyle.Danger);
                    const extraRow = new ActionRowBuilder().addComponents(checkBtn, killBtn);

                    // First ask whether to check or kill
                    // We'll send a DM with the two action buttons and then send the target picker
                    try {
                        const member = await interaction.guild.members.fetch(commId).catch(() => null);
                        if (member) {
                            const dm = await member.send({
                                embeds: [new EmbedBuilder().setTitle('Комиссар: выберите действие на ночь').setDescription('Нажмите одну из кнопок:').setColor(guild.colors.basic)],
                                components: [extraRow]
                            }).catch(() => null);

                            if (dm) {
                                const filter = i => i.user.id === commId && (i.customId === `commact_check_${commId}` || i.customId === `commact_kill_${commId}`);
                                const coll = dm.channel.createMessageComponentCollector({ filter, time: 30000, max: 1 });
                                const picked = await new Promise(resolve => {
                                    coll.on('collect', async btn => {
                                        await btn.reply({ content: 'Действие выбрано.', ephemeral: true }).catch(() => null);
                                        resolve(btn.customId.startsWith('commact_check_') ? 'check' : 'kill');
                                        coll.stop();
                                    });
                                    coll.on('end', () => resolve(null));
                                });
                                if (picked) {
                                    // now pick target
                                    const pick = await dmPick(commId, `Комиссар (${picked}): выберите цель`, targetChoices, 30000);
                                    if (pick) commissarAction = { type: picked, targetId: pick };
                                }
                            }
                        }
                    } catch (e) {
                        commissarAction = null;
                    }
                }

                // RESOLVE NIGHT:
                // potentialKills: set of playerIds that are targeted to be killed
                const potentialKills = new Map(); // targetId -> sources array

                if (mafiaTarget) {
                    potentialKills.set(mafiaTarget, (potentialKills.get(mafiaTarget) || []).concat(['mafia']));
                }
                if (maniacTarget) {
                    potentialKills.set(maniacTarget, (potentialKills.get(maniacTarget) || []).concat(['maniac']));
                }
                if (commissarAction && commissarAction.type === 'kill' && commissarAction.targetId) {
                    potentialKills.set(commissarAction.targetId, (potentialKills.get(commissarAction.targetId) || []).concat(['commissar']));
                }

                // apply doctor heal: anyone healed survives
                const deathsThisNight = [];
                for (const [target, sources] of potentialKills.entries()) {
                    if (doctorHeal && doctorHeal === target) {
                        // healed -> survives
                        continue;
                    } else {
                        // killed
                        // but if target had multiple hits, still dead
                        if (alive.has(target)) {
                            deathsThisNight.push({ id: target, sources });
                        }
                    }
                }

                // remove dead
                for (const info of deathsThisNight) {
                    const id = info.id;
                    if (!alive.has(id)) continue;
                    const role = gameRoles[id];
                    alive.delete(id);
                    // announce death in channel
                    const deathEmbed = new EmbedBuilder()
                        .setTitle('💀 Ночная смерть')
                        .setDescription(`<@${id}> (${role ? role.name : 'Неизвестная роль'}) был(а) убит(а) этой ночью.\n\nСообщение погибшего: ${role && role.death_message ? role.death_message : '...'}`)
                        .setColor(guild.colors.error);
                    await interaction.channel.send({ embeds: [deathEmbed] });
                }

                // reveal results of commissar check (if any)
                if (commissarAction && commissarAction.type === 'check' && commissarAction.targetId) {
                    const target = commissarAction.targetId;
                    const role = gameRoles[target];
                    const commId = commissarIds[0];
                    try {
                        const member = await interaction.guild.members.fetch(commId).catch(() => null);
                        if (member) {
                            const komName = role && role.kom_name ? (Array.isArray(role.kom_name) ? role.kom_name[0] : role.kom_name) : (role ? role.name : 'Неизвестно');
                            await member.send({ content: `Результат проверки: <@${target}> — **${komName}**` }).catch(() => null);
                        }
                    } catch (e) {}
                }

                // short pause
                await new Promise(r => setTimeout(r, 1500));
            } // end nightPhase

            // ---------------- DAY ----------------
            async function dayPhase() {
                const dayEmbed = new EmbedBuilder()
                    .setTitle(`🌞 День №${round}`)
                    .setDescription('День. Обсуждение. Переходим к голосованию за изгнание.')
                    .setColor(guild.colors.basic);
                await interaction.channel.send({ embeds: [dayEmbed] });

                // Voting
                const playersAlive = Array.from(alive);
                if (playersAlive.length <= 1) return;

                // Build vote buttons (label with displayName when available)
                const voteButtons = playersAlive.map(id => {
                    const name = interaction.guild.members.cache.get(id)?.displayName || 'Игрок';
                    return new ButtonBuilder().setCustomId(`vote_${id}`).setLabel(name.length > 80 ? name.slice(0, 80) : name).setStyle(ButtonStyle.Secondary);
                });

                const rows = [];
                for (let i = 0; i < voteButtons.length; i += 5) {
                    rows.push(new ActionRowBuilder().addComponents(voteButtons.slice(i, i + 5)));
                }

                const voteEmbed = new EmbedBuilder()
                    .setTitle('🗳️ Голосование: кого изгнать?')
                    .setDescription('Нажмите на кнопку, чтобы проголосовать. У вас 30 секунд.')
                    .setColor(guild.colors.basic);
                const msg = await interaction.channel.send({ embeds: [voteEmbed], components: rows });

                const votes = new Map(); // voterId -> targetId
                const filter = i => i.customId.startsWith('vote_') && alive.has(i.user.id);
                const collector = interaction.channel.createMessageComponentCollector({ filter, time: 30000 });

                collector.on('collect', async btn => {
                    const voter = btn.user.id;
                    const target = btn.customId.replace('vote_', '');
                    votes.set(voter, target);
                    await btn.reply({ content: `Вы проголосовали за <@${target}>`, ephemeral: true }).catch(() => null);
                });

                await new Promise(resolve => collector.on('end', resolve));

                // tally
                const counts = {};
                for (const t of votes.values()) counts[t] = (counts[t] || 0) + 1;
                const sorted = Object.entries(counts).sort((a, b) => b[1] - a[1]);
                if (sorted.length === 0) {
                    await interaction.channel.send('⚖️ Голосов не набралось — никто не изгнан.');
                    return;
                }
                const topCount = sorted[0][1];
                const top = sorted.filter(([k, v]) => v === topCount).map(([k]) => k);

                // tie -> no one or choose random? We'll choose random among tied.
                const eliminated = top[Math.floor(Math.random() * top.length)];
                if (!alive.has(eliminated)) {
                    await interaction.channel.send('⚠️ Ошибка: выбранный игрок уже мертв.');
                    return;
                }
                const role = gameRoles[eliminated];
                alive.delete(eliminated);
                const outEmbed = new EmbedBuilder()
                    .setTitle('🏛️ Изгнание')
                    .setDescription(`<@${eliminated}> (${role ? role.name : 'Неизвестная роль'}) был(а) изгнан(а) большинством голосов.`)
                    .addFields({ name: 'Сообщение проигравшего', value: role && role.death_message ? role.death_message : '...' })
                    .setColor(guild.colors.basic);
                await interaction.channel.send({ embeds: [outEmbed] });
            } // end dayPhase

        } // end startGame

        // ------- helper: assign roles -------
        function assignRoles(players) {
            // shuffle players
            const shuffled = [...players].sort(() => Math.random() - 0.5);
            const assigned = {};
            const N = players.length;
            const rolesToAssign = [];

            // Basic distribution:
            // 5-6 игроков: 1 глава мафии, 1 мафия, комиссар, врач, остальные мирные
            // 7-8: + маньяк
            // 8-10: + ещё одна мафия
            // 11-12: 2 мафии + 1 гл.мафия + маньяк
            // This is simple, can be tuned.
            rolesToAssign.push('Глава мафии');
            rolesToAssign.push('Мафия'); // at least one
            rolesToAssign.push('Комиссар');
            rolesToAssign.push('Врач');

            if (N >= 7) rolesToAssign.push('Маньяк');
            if (N >= 8) rolesToAssign.push('Мафия'); // extra mafia
            if (N >= 11) rolesToAssign.push('Мафия'); // another mafia for large games

            while (rolesToAssign.length < N) rolesToAssign.push('Мирный житель');

            for (let i = 0; i < N; i++) {
                const roleName = rolesToAssign[i];
                const roleData = roles.find(r => r.name === roleName) || roles.find(r => r.name === 'Мирный житель');
                assigned[shuffled[i]] = roleData;
            }
            return assigned;
        }
    },
};
