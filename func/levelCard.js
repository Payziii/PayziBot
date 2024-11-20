const { createCanvas, loadImage, registerFont } = require('@napi-rs/canvas')
registerFont('../fonts/Montserrat-Medium.ttf', { family: "Montserrat", weight: '500' })

module.exports = async function create(nick, lvl, progress) {

    const canvas = createCanvas(500, 200)
    const ctx = canvas.getContext('2d')
    image = loadImage('./img.png')
        ctx.drawImage(image, 0, 0)
        ctx.font = '500 30px Montserrat'
        const textWidth = ctx.measureText(nick).width;
        ctx.fillStyle = "#d8dee9"
        ctx.fillText(`${lvl} LVL`, 380, 35)
        ctx.fillText(nick, 500 - textWidth - 10, 190)
        secondImage = loadImage('./pz.png')
            ctx.save();
            ctx.beginPath();
            ctx.arc(10 + 50, 10 + 50, 50, 0, Math.PI * 2, true);
            ctx.closePath();
            ctx.clip();

            const gradient = ctx.createRadialGradient(
                10 + 50, 10 + 50, 50 - 15,
                10 + 50, 10 + 50, 50 + 15
            );
            gradient.addColorStop(0, 'rgba(0, 0, 0, 1)');
            gradient.addColorStop(1, 'rgba(0, 0, 0, 0)');

            ctx.fillStyle = gradient;
            ctx.fillRect(10, 10, 50 * 2, 50 * 2);

            // Рисование второй картинки внутри круглой маски
            ctx.drawImage(secondImage, 10, 10, 50 * 2, 50 * 2);

            ctx.restore();

            // Рисование полосы прогресса
            const progressX = 150; // Координата X начала полосы прогресса
            const progressY = 100; // Координата Y начала полосы прогресса
            const progressWidth = 300; // Ширина полосы прогресса
            const progressHeight = 20; // Высота полосы прогресса
            const progressValue = progress; // Значение прогресса (от 0 до 1)
            const cornerRadius = 5; // Радиус закругления углов

            // Рисование фона полосы прогресса
            ctx.fillStyle = '#434c5e'; // Цвет фона полосы прогресса
            ctx.beginPath();
            ctx.moveTo(progressX + cornerRadius, progressY);
            ctx.lineTo(progressX + progressWidth - cornerRadius, progressY);
            ctx.quadraticCurveTo(progressX + progressWidth, progressY, progressX + progressWidth, progressY + cornerRadius);
            ctx.lineTo(progressX + progressWidth, progressY + progressHeight - cornerRadius);
            ctx.quadraticCurveTo(progressX + progressWidth, progressY + progressHeight, progressX + progressWidth - cornerRadius, progressY + progressHeight);
            ctx.lineTo(progressX + cornerRadius, progressY + progressHeight);
            ctx.quadraticCurveTo(progressX, progressY + progressHeight, progressX, progressY + progressHeight - cornerRadius);
            ctx.lineTo(progressX, progressY + cornerRadius);
            ctx.quadraticCurveTo(progressX, progressY, progressX + cornerRadius, progressY);
            ctx.closePath();
            ctx.fill();

            // Рисование текущего прогресса
            ctx.fillStyle = '#8fbcbb'; // Цвет прогресса
            ctx.beginPath();
            ctx.moveTo(progressX + cornerRadius, progressY);
            ctx.lineTo(progressX + progressWidth * progressValue - cornerRadius, progressY);
            ctx.quadraticCurveTo(progressX + progressWidth * progressValue, progressY, progressX + progressWidth * progressValue, progressY + cornerRadius);
            ctx.lineTo(progressX + progressWidth * progressValue, progressY + progressHeight - cornerRadius);
            ctx.quadraticCurveTo(progressX + progressWidth * progressValue, progressY + progressHeight, progressX + progressWidth * progressValue - cornerRadius, progressY + progressHeight);
            ctx.lineTo(progressX + cornerRadius, progressY + progressHeight);
            ctx.quadraticCurveTo(progressX, progressY + progressHeight, progressX, progressY + progressHeight - cornerRadius);
            ctx.lineTo(progressX, progressY + cornerRadius);
            ctx.quadraticCurveTo(progressX, progressY, progressX + cornerRadius, progressY);
            ctx.closePath();
            ctx.fill();

            // Рисование обводки полосы прогресса
            ctx.strokeStyle = '#2e3440'; // Цвет обводки
            ctx.lineWidth = 1.5; // Толщина обводки
            ctx.beginPath();
            ctx.moveTo(progressX + cornerRadius, progressY);
            ctx.lineTo(progressX + progressWidth - cornerRadius, progressY);
            ctx.quadraticCurveTo(progressX + progressWidth, progressY, progressX + progressWidth, progressY + cornerRadius);
            ctx.lineTo(progressX + progressWidth, progressY + progressHeight - cornerRadius);
            ctx.quadraticCurveTo(progressX + progressWidth, progressY + progressHeight, progressX + progressWidth - cornerRadius, progressY + progressHeight);
            ctx.lineTo(progressX + cornerRadius, progressY + progressHeight);
            ctx.quadraticCurveTo(progressX, progressY + progressHeight, progressX, progressY + progressHeight - cornerRadius);
            ctx.lineTo(progressX, progressY + cornerRadius);
            ctx.quadraticCurveTo(progressX, progressY, progressX + cornerRadius, progressY);
            ctx.closePath();
            ctx.stroke();
        return await canvas.encode('png')
}