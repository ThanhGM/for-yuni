const canvas = document.getElementById('celebration');
const context = canvas.getContext('2d');
const envelopeScene = document.getElementById('envelopeScene');
const openCard = document.getElementById('openCard');
const cardContent = document.getElementById('cardContent');
const againButton = document.getElementById('againBtn');
const heartButton = document.getElementById('heartBtn');
const typedMessage = document.getElementById('typedMessage');
const message = 'Anh tự hào về em rất nhiều. Top 15 hôm nay là phần thưởng cho sự chăm chỉ, bản lĩnh và trái tim em đặt vào mỗi buổi live. Cứ tỏa sáng theo cách của em nhé, vì với anh, em luôn là Top 1. ♥';
let particles = [];
let typingTimer;

function resizeCanvas() {
    canvas.width = window.innerWidth * devicePixelRatio;
    canvas.height = window.innerHeight * devicePixelRatio;
    context.setTransform(devicePixelRatio, 0, 0, devicePixelRatio, 0, 0);
}

function burst(x, y, kind = 'spark') {
    const colors = kind === 'heart' ? ['#e04465', '#f27b8d', '#a52d55', '#ffd1d8'] : ['#ff6677', '#ffd36a', '#f7a0a8', '#fff6cf'];
    for (let i = 0; i < 135; i += 1) {
        const angle = Math.random() * Math.PI * 2;
        const speed = 2.5 + Math.random() * 6;
        particles.push({x, y, vx: Math.cos(angle) * speed, vy: Math.sin(angle) * speed, life: 1, color: colors[i % colors.length], size: 2.5 + Math.random() * 3.5, kind});
    }
}

function drawHeart(x, y, size) {
    context.beginPath();
    context.moveTo(x, y + size * 0.35);
    context.bezierCurveTo(x - size * 0.8, y - size * 0.15, x - size * 0.45, y - size * 0.75, x, y - size * 0.25);
    context.bezierCurveTo(x + size * 0.45, y - size * 0.75, x + size * 0.8, y - size * 0.15, x, y + size * 0.35);
    context.fill();
}

function animate() {
    context.clearRect(0, 0, innerWidth, innerHeight);
    particles = particles.filter((particle) => particle.life > 0);
    particles.forEach((particle) => {
        particle.x += particle.vx;
        particle.y += particle.vy;
        particle.vy += 0.08;
        particle.life -= 0.014;
        context.globalAlpha = particle.life;
        context.fillStyle = particle.color;
        context.shadowColor = particle.color;
        context.shadowBlur = particle.kind === 'heart' ? 12 : 18;
        if (particle.kind === 'heart') drawHeart(particle.x, particle.y, particle.size * 2.5);
        else context.fillRect(particle.x, particle.y, particle.size, particle.size * 1.8);
    });
    context.globalAlpha = 1;
    context.shadowBlur = 0;
    requestAnimationFrame(animate);
}

function typeMessage() {
    clearInterval(typingTimer);
    typedMessage.textContent = '';
    let index = 0;
    typingTimer = setInterval(() => {
        typedMessage.textContent += message[index];
        index += 1;
        if (index >= message.length) clearInterval(typingTimer);
    }, 24);
}

function openEnvelope() {
    envelopeScene.classList.add('open');
    openCard.disabled = true;
    openCard.textContent = 'Đã mở thiệp ♥';
    window.setTimeout(() => {
        cardContent.classList.add('visible');
        cardContent.scrollIntoView({behavior: 'smooth', block: 'center'});
        burst(innerWidth * 0.25, innerHeight * 0.25);
        burst(innerWidth * 0.75, innerHeight * 0.25);
        typeMessage();
    }, 850);
}

window.addEventListener('resize', resizeCanvas);
openCard.addEventListener('click', openEnvelope);
againButton.addEventListener('click', () => {
    burst(Math.random() * innerWidth, Math.random() * innerHeight * 0.55);
});
heartButton.addEventListener('click', () => {
    burst(Math.random() * innerWidth, Math.random() * innerHeight * 0.55, 'heart');
});
resizeCanvas();
animate();
