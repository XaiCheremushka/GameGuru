import React, { useEffect, useRef } from 'react';
import '../../styles/css/animated-background.css';

const AnimatedBackground = () => {
    const canvasRef = useRef(null);

    useEffect(() => {
        const canvas = canvasRef.current;
        const ctx = canvas.getContext('2d');
        let animationFrameId;
        let time = 0;

        // Устанавливаем размеры canvas
        const updateCanvasSize = () => {
            canvas.width = canvas.offsetWidth;
            canvas.height = canvas.offsetHeight;
        };
        updateCanvasSize();
        window.addEventListener('resize', updateCanvasSize);

        // Начальные параметры игры
        const paddleHeight = canvas.height * 0.2;
        const paddleWidth = 12;
        const ballSize = 8;
        const paddleRadius = paddleWidth / 2;

        let ball = {
            x: canvas.width / 2,
            y: canvas.height / 2,
            dx: 9,
            dy: 9,
            size: ballSize
        };

        let leftPaddle = {
            x: paddleWidth * 2,
            y: canvas.height / 2 - paddleHeight / 2,
            width: paddleWidth,
            height: paddleHeight,
            baseY: canvas.height / 2 - paddleHeight / 2
        };

        let rightPaddle = {
            x: canvas.width - paddleWidth * 3,
            y: canvas.height / 2 - paddleHeight / 2,
            width: paddleWidth,
            height: paddleHeight,
            baseY: canvas.height / 2 - paddleHeight / 2
        };

        // Функция для отрисовки скругленного прямоугольника
        const drawRoundedRect = (x, y, width, height, radius) => {
            ctx.beginPath();
            ctx.moveTo(x + radius, y);
            ctx.lineTo(x + width - radius, y);
            ctx.quadraticCurveTo(x + width, y, x + width, y + radius);
            ctx.lineTo(x + width, y + height - radius);
            ctx.quadraticCurveTo(x + width, y + height, x + width - radius, y + height);
            ctx.lineTo(x + radius, y + height);
            ctx.quadraticCurveTo(x, y + height, x, y + height - radius);
            ctx.lineTo(x, y + radius);
            ctx.quadraticCurveTo(x, y, x + radius, y);
            ctx.closePath();
            ctx.fill();
        };

        // Функция отрисовки
        const draw = () => {
            time += 0.026;

            // Очищаем canvas
            ctx.fillStyle = 'transparent';
            ctx.clearRect(0, 0, canvas.width, canvas.height);

            // Рисуем пульсирующий градиентный круг
            const centerX = canvas.width / 2;
            const centerY = canvas.height / 2;
            const maxRadius = Math.max(canvas.width, canvas.height) * 0.4;
            const scale = 0.8 + Math.sin(time * 0.5) * 0.2; // Пульсация от 0.6 до 1.0
            const currentRadius = maxRadius * scale;

            const gradient = ctx.createRadialGradient(
                centerX, centerY, 0,
                centerX, centerY, currentRadius
            );
            gradient.addColorStop(0, 'rgba(255, 255, 255, 0.15)');
            gradient.addColorStop(0.5, 'rgba(255, 255, 255, 0.05)');
            gradient.addColorStop(1, 'rgba(255, 255, 255, 0)');

            ctx.fillStyle = gradient;
            ctx.beginPath();
            ctx.arc(centerX, centerY, currentRadius, 0, Math.PI * 2);
            ctx.fill();

            // Устанавливаем параметры рендеринга для более четких линий
            ctx.imageSmoothingEnabled = true;
            ctx.imageSmoothingQuality = 'high';

            // Рисуем мяч
            ctx.fillStyle = '#FFFFFF';
            ctx.beginPath();
            ctx.arc(ball.x, ball.y, ball.size, 0, Math.PI * 2);
            ctx.fill();

            // Обновляем позиции ракеток
            leftPaddle.y = leftPaddle.baseY + Math.sin(time * 1.2) * (canvas.height * 0.35);
            rightPaddle.y = rightPaddle.baseY + 
                Math.sin(time * 1.8) * (canvas.height * 0.25) + 
                Math.cos(time * 0.8) * (canvas.height * 0.15);

            // Ограничиваем движение ракеток
            leftPaddle.y = Math.max(0, Math.min(canvas.height - paddleHeight, leftPaddle.y));
            rightPaddle.y = Math.max(0, Math.min(canvas.height - paddleHeight, rightPaddle.y));

            // Рисуем ракетки со скругленными углами
            ctx.fillStyle = '#FFFFFF';
            drawRoundedRect(leftPaddle.x, leftPaddle.y, leftPaddle.width, leftPaddle.height, paddleRadius);
            drawRoundedRect(rightPaddle.x, rightPaddle.y, rightPaddle.width, rightPaddle.height, paddleRadius);

            // Обновляем позицию мяча
            ball.x += ball.dx;
            ball.y += ball.dy;

            // Отскок от верхней и нижней границы
            if (ball.y + ball.size > canvas.height || ball.y - ball.size < 0) {
                ball.dy = -ball.dy;
            }

            // Отскок от ракеток
            if (
                (ball.x - ball.size < leftPaddle.x + leftPaddle.width &&
                ball.y > leftPaddle.y && 
                ball.y < leftPaddle.y + leftPaddle.height) ||
                (ball.x + ball.size > rightPaddle.x &&
                ball.y > rightPaddle.y &&
                ball.y < rightPaddle.y + rightPaddle.height)
            ) {
                ball.dx = -ball.dx;
            }

            // Сброс мяча при выходе за границы
            if (ball.x < 0 || ball.x > canvas.width) {
                ball.x = canvas.width / 2;
                ball.y = canvas.height / 2;
            }

            animationFrameId = requestAnimationFrame(draw);
        };

        draw();

        return () => {
            window.removeEventListener('resize', updateCanvasSize);
            cancelAnimationFrame(animationFrameId);
        };
    }, []);

    return (
        <div className="animated-background">
            <canvas ref={canvasRef} className="pong-canvas" />
        </div>
    );
};

export default AnimatedBackground; 