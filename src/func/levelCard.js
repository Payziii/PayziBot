const { createCanvas, loadImage, GlobalFonts } = require('@napi-rs/canvas')

// Укажи пути к своим файлам шрифтов
GlobalFonts.registerFromPath('./src/fonts/Montserrat-SemiBold.ttf', 'Montserrat')
GlobalFonts.registerFromPath('./src/fonts/Montserrat-Medium.ttf',   'Montserrat')

/**
 * @param {string} nick — никнейм
 * @param {number} lvl — уровень
 * @param {number} progress — прогресс
 * @param {string} avatar — аватар
 * @param {number} rank — ранг
 * @param {number} currentXP — текущий XP
 * @param {number} maxXP — максимальный XP уровня
 */
module.exports = async function create(nick, lvl, progress, avatar, rank, currentXP, maxXP) {

    const canvas = createCanvas(500, 150)
    const ctx    = canvas.getContext('2d')

    const bg = await loadImage('./src/images/rank-background.png')
    ctx.drawImage(bg, 0, 0, 500, 150)

    const ava = await loadImage(avatar)
    ctx.save()
    ctx.beginPath()
    ctx.arc(20 + 50, 25 + 50, 50, 0, Math.PI * 2)
    ctx.closePath()
    ctx.clip()
    ctx.drawImage(ava, 20, 25, 100, 100)
    ctx.restore()

    ctx.fillStyle  = '#FFFFFF'
    ctx.textBaseline = 'top'

    ctx.font = '600 28px Montserrat'
    ctx.fillText(nick, 138, 25)

    {
        let x = 138
        const yLarge = 68       
        const ySmall = 68 + 8  

        ctx.font = '500 16px Montserrat'
        ctx.fillText('Уровень ', x, ySmall)
        x += ctx.measureText('Уровень ').width

        ctx.font = '500 24px Montserrat'
        ctx.fillText(String(lvl), x, yLarge)
        x += ctx.measureText(String(lvl)).width

        ctx.font = '500 16px Montserrat'
        const gap = '      '
        x += ctx.measureText(gap).width

        ctx.fillText('Ранг ', x, ySmall)
        x += ctx.measureText('Ранг ').width

        ctx.font = '500 24px Montserrat'
        ctx.fillText("#"+ String(rank), x, yLarge)
    }

    {
        ctx.font = '500 14px Montserrat'
        const xpText = `${currentXP} / ${maxXP} XP`
        ctx.fillText(xpText, 474 - ctx.measureText(xpText).width, 77)
    }

    const pbX = 130, pbY = 106, pbW = 352, pbH = 25
    const r   = pbH / 2  

    function drawPill(x, y, w, h, radius) {
        const safeR = Math.min(radius, w / 2)
        ctx.beginPath()
        ctx.moveTo(x + safeR, y)
        ctx.lineTo(x + w - safeR, y)
        ctx.arc(x + w - safeR, y + safeR, safeR, -Math.PI / 2,  Math.PI / 2)
        ctx.lineTo(x + safeR, y + h)
        ctx.arc(x + safeR,     y + safeR, safeR,  Math.PI / 2, -Math.PI / 2)
        ctx.closePath()
        ctx.fill()
    }

    ctx.fillStyle = '#1C1917'
    drawPill(pbX, pbY, pbW, pbH, r)

    const fillW = Math.max(0, pbW * Math.min(progress, 1))
    if (fillW > 0) {
        ctx.fillStyle = '#5CB85C'
        drawPill(pbX, pbY, fillW, pbH, r)
    }

    return canvas
}