const canvas = document.getElementById("game");
const ctx = canvas.getContext("2d");

// =====================================================
// IMÁGENES
// =====================================================

const foxRunImg = new Image();
foxRunImg.src = "assets/fox_run.png";

const foxJumpImg = new Image();
foxJumpImg.src = "assets/fox_jump.png";

const foxDuckImg = new Image();
foxDuckImg.src = "assets/fox_duck.png";

const cactusSmallImg = new Image();
cactusSmallImg.src = "assets/cactus_small.png";

const cactusBigImg = new Image();
cactusBigImg.src = "assets/cactus_big.png";

const cactusDoubleImg = new Image();
cactusDoubleImg.src = "assets/cactus_double.png";

const eagleImg = new Image();
eagleImg.src = "assets/eagle.png";


const bossRunImg = new Image();
bossRunImg.src = "assets/boss_run.png";

const bossJumpImg = new Image();
bossJumpImg.src = "assets/boss_jump.png";
// =====================================================
// FONDO ETAPA 2 - DESIERTO
// =====================================================
const desertBgImg = new Image();
desertBgImg.src = "assets/fondo_etapa2.png";

let desertBgOffset = 0;
// =====================================================
// FONDO ETAPA 3 - NOCHE
// =====================================================
const nightBgImg = new Image();
nightBgImg.src = "assets/fondo_etapa3.png";

let nightBgOffset = 0;
// =====================================================
// FONDO ETAPA 1
// =====================================================
const forestBgImg = new Image();
forestBgImg.src = "assets/fondo_etapa1.png";

let forestBgOffset = 0;
// =====================================================
// FONDO ETAPA FINAL
// =====================================================
const finalBgImg = new Image();
finalBgImg.src = "assets/fondo_etapa_final.png";

let finalBgOffset = 0;

// ================================
// SONIDOS
// ================================

const sounds = {
    jump: new Audio("assets/jump.mp3"),
    coin: new Audio("assets/coin.mp3"),
    specialCoin: new Audio("assets/special_coin.mp3"),
    hit: new Audio("assets/hit.mp3"),
    eagle: new Audio("assets/eagle.mp3"),
    life: new Audio("assets/life.mp3"),
    gameover: new Audio("assets/gameover.mp3"),
    start: new Audio("assets/start.mp3")
};

// =====================================================
// JUGADOR
// =====================================================

let fox = {
    x: 80,
    y: 196,

    width: 64,
    height: 64,

    velocityY: 0,
velocityX: 0,
    gravity: 0.8,
    

jumpPower: -15,

    jumping: false,
 jumpingBack: false,
    ducking: false,

    frame: 0,

    jumpStartX: 80
};

// =====================================================
// VARIABLES
// =====================================================

let ground = 260;

let cactus = [];

let coins = [];

let eagles = [];

let bossProjectiles = [];
let score = 0;

let speed = 6;

let gameOver = false;

let frameDelay = 0;

let lives = 3;

let invulnerable = false;

let invulnerableTime = 0;

let timeOfDay = 0;

let specialCoins = [];

let speedLines = [];

let startScreen = true;

let bossFrame = 0;
let bossFrameTimer = 0;

const BOSS_FRAMES = 8;
const BOSS_FRAME_SPEED = 6;
let bossRunTimer = 0;
// ESCUDO
// =====================================================

let shield = null;
let shieldActive = false;
let shieldTime = 0;

// =====================================================
// NIVELES
// =====================================================

let level = 1;

let levelMessage = "";

let levelMessageTime = 0;

// =====================================================
// JEFE FINAL - NIVEL 4
// =====================================================

// =====================================================
// JEFE
// =====================================================
let boss = {

    active: false,

    x: 0,
    y: 100,

    width: 120,
    height: 120,

    speed: 2,

    direction: 1,

    shootTimer: 0,

    // VIDA
    maxHealth: 10,
    health: 10,

    // PROTECCIÓN
    hitCooldown: 0,

    // SALTO
    velocityY: 0,
    jumping: false,

    // TIEMPO CORRIENDO
    runTimer: 0,

    // PRIMER SALTO
    nextJumpTime: 180
};

let victory = false;
// =====================================================
// SALTO
// =====================================================
function jump() {

    if (
        !fox.jumping &&
        !fox.ducking &&
        !gameOver
    ) {

        fox.velocityY = fox.jumpPower;

        sounds.jump.currentTime = 0;
        sounds.jump.play().catch(() => {});

        fox.jumping = true;

        fox.frame = 0;

        // Guardar posición donde comenzó el salto
        if (level === 4) {
            fox.jumpStartX = fox.x;
        }
    }
}
const btnVictory = document.getElementById("btnVictory");

btnVictory.addEventListener("click", () => {

    victory = false;

    btnVictory.style.display = "none";

    restart();
});
function startGame() {

    startScreen = false;

    restart();
}


// =====================================================
// AGACHARSE
// =====================================================

function duckStart() {

    if (!gameOver && !fox.jumping) {

        fox.ducking = true;

        fox.frame = 0;
    }
}


function duckEnd() {

    fox.ducking = false;

    fox.frame = 0;
}


// =====================================================
// TECLADO
// =====================================================

document.addEventListener("keydown", e => {

    if (e.code === "Space" || e.code === "ArrowUp") {

        e.preventDefault();

        jump();
    }

    if (e.code === "ArrowDown") {

        e.preventDefault();

        duckStart();
    }
});


document.addEventListener("keyup", e => {

    if (e.code === "ArrowDown") {

        duckEnd();
    }
});


// =====================================================
// BOTÓN SALTAR
// =====================================================

const btnJump = document.getElementById("btnJump");

if (btnJump) {

    btnJump.addEventListener("pointerdown", e => {

        e.preventDefault();

        jump();
    });
}


// =====================================================
// BOTÓN AGACHAR
// =====================================================

const btnDuck = document.getElementById("btnDuck");

if (btnDuck) {

    btnDuck.addEventListener("pointerdown", e => {

        e.preventDefault();

        duckStart();
    });


    btnDuck.addEventListener("pointerup", e => {

        e.preventDefault();

        duckEnd();
    });


    btnDuck.addEventListener("pointercancel", () => {

        duckEnd();
    });


    btnDuck.addEventListener("pointerleave", () => {

        duckEnd();
    });
}


// =====================================================
// BOTÓN JUGAR - PANTALLA DE INICIO
// =====================================================

canvas.addEventListener("pointerdown", e => {

    if (!startScreen) return;

    e.preventDefault();

    const rect = canvas.getBoundingClientRect();

    const x =
        (e.clientX - rect.left) *
        (canvas.width / rect.width);

    const y =
        (e.clientY - rect.top) *
        (canvas.height / rect.height);


    // BOTÓN JUGAR
    if (
        x >= canvas.width / 2 - 110 &&
        x <= canvas.width / 2 + 110 &&
        y >= 145 &&
        y <= 205
    ) {

        // REPRODUCIR START
        const startAudio = new Audio("assets/start.mp3");

        startAudio.muted = false;

        startAudio.volume = 1.0;

        startAudio.play()
            .then(() => {

                console.log("start.mp3 reproduciendo");

            })
            .catch(error => {

                console.log(
                    "Error start.mp3:",
                    error
                );

            });


        // INICIAR JUEGO
        startScreen = false;

        restart();
    }

});


// =====================================================
// TOQUE EN PANTALLA
// =====================================================

canvas.addEventListener("touchstart", e => {

    e.preventDefault();

    if (startScreen) {

        return;
    }


    if (gameOver) {

        restart();

    } else {

        jump();
    }

}, { passive: false });


// =====================================================
// CREAR CACTUS
// =====================================================

function createCactus() {

    const tipo = Math.floor(Math.random() * 3);


    if (tipo === 0) {

        cactus.push({

            x: canvas.width,

            y: 212,

            width: 48,

            height: 48,

            tipo: "small"

        });

    }


    else if (tipo === 1) {

        cactus.push({

            x: canvas.width,

            y: 180,

            width: 48,

            height: 80,

            tipo: "big"

        });

    }


    else {

        cactus.push({

            x: canvas.width,

            y: 200,

            width: 70,

            height: 60,

            tipo: "double"

        });
    }
}


// =====================================================
// CREAR MONEDA
// =====================================================

function createCoin() {

    coins.push({

        x: canvas.width,

        y: 150 + Math.random() * 60,

        size: 25

    });
}


function createSpecialCoin() {

    specialCoins.push({

        x: canvas.width,

        y: 120 + Math.random() * 80,

        size: 30,

        rotation: 0

    });
}


// =====================================================
// CREAR ESCUDO
// =====================================================

function createShield() {

    shield = {

        x: canvas.width + 40,

        y: 150 + Math.random() * 70,

        width: 32,

        height: 32,

        rotation: 0

    };
}


// =====================================================
// CREAR ÁGUILA
// =====================================================

function createEagle() {

    eagles.push({

        x: canvas.width + 50,

        // Altura del águila
        y: 175,

        width: 64,

        height: 64,

        frame: 0,

        frameDelay: 0

    });
}

// =====================================================
// ACTUALIZAR ZORRO
// =====================================================

function updateFox() {

    if (startScreen) {
        return;
    }

    if (gameOver) {
        return;
    }


    // GRAVEDAD
    fox.velocityY += fox.gravity;

    fox.y += fox.velocityY;

// ==========================================
// MOVIMIENTO HORIZONTAL DEL REBOTE
// ==========================================

if (fox.jumpingBack && level === 4) {

    fox.x += fox.velocityX;

    // Frenar poco a poco
    fox.velocityX *= 0.99;

    // No permitir que salga por la izquierda
    if (fox.x < 60) {
        fox.x = 60;
        fox.velocityX = 0;
    }
}

// ==========================================
// AVANCE DEL FOX AL SALTAR CONTRA EL JEFE
// SOLO NIVEL 4
// ==========================================

// ==========================================
// AVANCE DEL FOX HACIA EL JEFE
// SOLO NIVEL 4
// ==========================================

// ==========================================
// AVANCE DEL FOX HACIA EL JEFE
// SOLO NIVEL 4
// ==========================================

if (fox.jumping && level === 4 && !fox.jumpingBack) {

    fox.x += 3;

    // ==========================================
    // DETENER EL FOX SOBRE EL JEFE
    // ==========================================

    const bossCenter = boss.x + boss.width / 2;

    // Centro del Fox sobre el centro del jefe
    const targetX = bossCenter - fox.width / 2;

    if (fox.x >= targetX) {
        fox.x = targetX;
    }
}

    // SUELO
    if (fox.y >= ground - fox.height) {

        fox.y = ground - fox.height;

        fox.velocityY = 0;

        fox.jumping = false;
fox.jumpingBack = false;  
fox.velocityX = 0;

  }

// ANIMACIÓN DEL ZORRO
// ANIMACIÓN DEL ZORRO
// Corre y también se anima al agacharse

if (!fox.jumping) {
fox.frame++;

    if (fox.frame >= 8) {
        fox.frame = 0;
    }
}
}


// =====================================================
// CREAR OBJETOS ALEATORIOS
// =====================================================

let obstacleTimer = 0;

function createRandomObjects() {

    if (startScreen || gameOver) {
        return;
    }


    obstacleTimer++;


    // ==============================================
    // DIFICULTAD SEGÚN NIVEL
    // ==============================================

    let interval = 80;


    if (level === 2) {

        interval = 70;
    }


    if (level === 3) {

        interval = 60;
    }
if (level === 4) {
    return;
}

    if (obstacleTimer > interval) {

        obstacleTimer = 0;


        const random = Math.random();


        // ==========================================
        // CACTUS
        // ==========================================

        if (random < 0.45) {

            createCactus();
        }


        // ==========================================
        // MONEDA
        // ==========================================

        else if (random < 0.65) {

            createCoin();
        }


        // ==========================================
        // MONEDA ESPECIAL
        // ==========================================

        else if (random < 0.75) {

            createSpecialCoin();
        }


        // ==========================================
        // ESCUDO
        // ==========================================

        else if (random < 0.82) {

            createShield();
        }


        // ==========================================
        // ÁGUILA
        // ==========================================

        else {

            createEagle();
        }
    }
}


// =====================================================
// ACTUALIZAR OBJETOS
// =====================================================

function updateObjects() {

    if (startScreen || gameOver) {

        return;
    }


    // ==============================================
    // CACTUS
    // ==============================================

    cactus.forEach(c => {

        c.x -= speed;

    });


    cactus = cactus.filter(c => {

        return c.x + c.width > 0;

    });


    // ==============================================
    // MONEDAS
    // ==============================================

    coins.forEach(c => {

        c.x -= speed;

    });


    coins = coins.filter(c => {

        return c.x + c.size > 0;

    });


    // ==============================================
    // MONEDAS ESPECIALES
    // ==============================================

    specialCoins.forEach(c => {

        c.x -= speed;

        c.rotation += 0.08;

    });


    specialCoins = specialCoins.filter(c => {

        return c.x + c.size > 0;

    });


    // ==============================================
    // ESCUDO
    // ==============================================

    if (shield) {

        shield.x -= speed;

        shield.rotation += 0.05;


        if (shield.x + shield.width < 0) {

            shield = null;
        }
    }


    // ==============================================
    // ÁGUILAS
    // ==============================================

    eagles.forEach(e => {

        e.x -= speed;


        // Animación del águila
        e.frameDelay++;


        if (e.frameDelay > 8) {

            e.frame++;

            e.frameDelay = 0;
        }


        if (e.frame > 8) {

            e.frame = 0;
        }

    });


    eagles = eagles.filter(e => {

        return e.x + e.width > 0;

    });


    // ==============================================
    // LÍNEAS DE VELOCIDAD
    // ==============================================

    speedLines.forEach(line => {

        line.x -= speed * 1.5;

    });


    speedLines = speedLines.filter(line => {

        return line.x > -50;

    });


    // Crear líneas de velocidad
    if (Math.random() < 0.08) {

        speedLines.push({

            x: canvas.width,

            y: Math.random() * 220,

            width: 20 + Math.random() * 40,

            height: 2

        });
    }
}


// =====================================================
// COLISIÓN RECTANGULAR
// =====================================================

function collision(a, b) {

    return (

        a.x < b.x + b.width &&

        a.x + a.width > b.x &&

        a.y < b.y + b.height &&

        a.y + a.height > b.y

    );
}


// =====================================================
// ACTUALIZAR NIVEL
// ===================================
function updateLevel() {

    let newLevel = 1;


    // ==============================================
    // NIVEL 1
    // ==============================================

    if (score < 500) {

        newLevel = 1;

    }


    // ==============================================
    // NIVEL 2
    // ==============================================

    else if (score < 1000) {

        newLevel = 2;

    }


    // ==============================================
    // NIVEL 3
    // ==============================================

    else if (score < 2000) {

        newLevel = 3;

    }


    // ==============================================
    // NIVEL 4 - JEFE
    // ==============================================

    else {

        newLevel = 4;

    }


    // ==============================================
    // CAMBIO DE NIVEL
    // ==============================================

    if (newLevel !== level) {

        level = newLevel;


        if (level === 2) {

            levelMessage = "NIVEL 2 - DESIERTO";

            speed += 1;

        }


        if (level === 3) {

            levelMessage = "NIVEL 3 - MONTAÑA";

            speed += 1;

        }


        if (level === 4) {

            levelMessage = "NIVEL 4 - JEFE FINAL";

            levelMessageTime = 180;

            startBoss();

        }


        levelMessageTime = 150;

    }


    // ==============================================
    // CONTADOR DEL MENSAJE
    // ==============================================

    if (levelMessageTime > 0) {

        levelMessageTime--;

    }
}


function startBoss() {

    boss.active = true;

    // Posición horizontal
    boss.x = canvas.width - boss.width - 20;

    // EXACTAMENTE sobre el suelo
    boss.y = ground - boss.height;

    // Comienza corriendo
    boss.jumping = false;

    // Sin velocidad vertical
    boss.velocityY = 0;

    // Primer tiempo de carrera: 5 segundos
    boss.runTimer = 0;
    boss.runDuration = 300;

    // Reiniciar animación
    bossFrame = 0;
    bossFrameTimer = 0;

    // Reiniciar disparos
    boss.shootTimer = 0;

    victory = false;
}

// =====================================================
// ACTUALIZAR JEFE
// =====================================================

// =====================================================
// ACTUALIZAR JEFE
// =====================================================
// =====================================================
// ACTUALIZAR JEFE
// =====================================================

// =====================================================
// ACTUALIZAR JEFE
// =====================================================

function updateBoss() {

    if (!boss.active) return;

    // ==========================================
    // PROTECCIÓN DESPUÉS DE RECIBIR UN GOLPE
    // ==========================================

    if (boss.hitCooldown > 0) {
        boss.hitCooldown--;
    }


    // ==========================================
    // ANIMACIÓN
    // ==========================================

    bossFrameTimer++;

    if (bossFrameTimer >= BOSS_FRAME_SPEED) {

        bossFrameTimer = 0;

        bossFrame++;

        if (bossFrame >= BOSS_FRAMES) {
            bossFrame = 0;
        }
    }


    // ==========================================
    // GRAVEDAD DEL JEFE
    // ==========================================

    if (boss.jumping) {

        boss.velocityY += 0.8;

        boss.y += boss.velocityY;


        // ======================================
        // ATERRIZAR EN EL SUELO
        // ======================================

        const bossGround = ground - boss.height;

        if (boss.y >= bossGround) {

            boss.y = bossGround;

            boss.velocityY = 0;

            boss.jumping = false;

            // Volvemos a contar tiempo corriendo
            boss.runTimer = 0;

            // Próximo salto aleatorio
            boss.nextJumpTime =
                90 + Math.floor(Math.random() * 150);
        }
    }

    else {

        // ======================================
        // ESTÁ CORRIENDO EN EL SUELO
        // ======================================

        boss.y = ground - boss.height;

        boss.runTimer++;


        // ======================================
        // TOCA SALTAR
        // ======================================

        if (boss.runTimer >= boss.nextJumpTime) {

            boss.jumping = true;

            boss.velocityY = -14;

            boss.runTimer = 0;
        }
    }


    // ==========================================
    // DISPAROS
    // ==========================================

    boss.shootTimer++;

    if (boss.shootTimer >= 120) {

        bossShoot();

        boss.shootTimer = 0;
    }
}

// =====================================================
// DISPARAR JEFE
// =====================================================
// =====================================================
// DISPARO DEL JEFE
// =====================================================

function bossShoot() {

    if (!boss.active || gameOver) return;

    bossProjectiles.push({

        // El jefe mira hacia la izquierda
        x: boss.x - 10,

        // Sale aproximadamente desde el centro
        y: boss.y + boss.height / 2 - 10,

        width: 20,
        height: 20,

        // Movimiento hacia la izquierda
        speed: 7
    });
}

// =====================================================
// ACTUALIZAR PROYECTILES
// =====================================================

// =====================================================
// ACTUALIZAR PROYECTILES DEL JEFE
// =====================================================

function updateBossProjectiles() {

    for (let i = bossProjectiles.length - 1; i >= 0; i--) {

        const p = bossProjectiles[i];

        p.x -= p.speed;

        if (p.x + p.width < 0) {

            bossProjectiles.splice(i, 1);
        }
    }
}

// =====================================================
// DIBUJAR PROYECTILES
// =====================================================

// =====================================================
// DIBUJAR PROYECTILES DEL JEFE
// =====================================================

function drawBossProjectiles() {

    bossProjectiles.forEach(p => {

        ctx.save();

        // Bola roja
        ctx.fillStyle = "#ff3030";

        ctx.beginPath();

        ctx.arc(
            p.x + p.width / 2,
            p.y + p.height / 2,
            10,
            0,
            Math.PI * 2
        );

        ctx.fill();

        // Brillo
        ctx.fillStyle = "#ffff00";

        ctx.beginPath();

        ctx.arc(
            p.x + 6,
            p.y + 6,
            3,
            0,
            Math.PI * 2
        );

        ctx.fill();

        ctx.restore();
    });
}
// =====================================================
// DIBUJAR MENSAJE DE NIVEL
// =====================================================

function drawLevelMessage() {

    if (levelMessageTime <= 0) {

        return;
    }


    ctx.save();


    // Fondo del mensaje
    ctx.fillStyle = "rgba(0,0,0,0.55)";


    ctx.fillRect(

        140,

        100,

        canvas.width - 280,

        80

    );


    // Texto
    ctx.fillStyle = "white";

    ctx.font = "bold 28px Arial";

    ctx.textAlign = "center";

    ctx.textBaseline = "middle";


    ctx.fillText(

        levelMessage,

        canvas.width / 2,

        140

    );


    ctx.restore();
}


// =====================================================
// ACTUALIZAR DÍA Y NOCHE
// =====================================================

function updateDayNight() {

    timeOfDay += 0.0005;


    if (timeOfDay > 1) {

        timeOfDay = 0;
    }
}


// =====================================================
// COLOR DEL CIELO
// =====================================================
function drawSky() {

    // =================================================
    // NIVEL 1 - BOSQUE
    // =================================================

    if (level === 1) {

        // Cielo
        ctx.fillStyle = "#87CEEB";

        ctx.fillRect(
            0,
            0,
            canvas.width,
            canvas.height
        );

        // Sol
        ctx.fillStyle = "#FFD93D";

        ctx.beginPath();

        ctx.arc(
            canvas.width - 70,
            55,
            25,
            0,
            Math.PI * 2
        );

        ctx.fill();


     // =================================================
// ÁRBOLES DEL FONDO - NIVEL 1
// =================================================

ctx.fillStyle = "#2E7D32";

for (let x = -80; x < canvas.width + 100; x += 120) {

    // Tronco
    ctx.fillStyle = "#6D4C41";
    ctx.fillRect(x + 48, ground - 105, 14, 105);

    // Copa inferior
    ctx.fillStyle = "#2E7D32";
    ctx.beginPath();
    ctx.arc(x + 55, ground - 120, 38, 0, Math.PI * 2);
    ctx.fill();

    // Copa superior
    ctx.beginPath();
    ctx.arc(x + 35, ground - 145, 30, 0, Math.PI * 2);
    ctx.fill();

    ctx.beginPath();
    ctx.arc(x + 75, ground - 145, 30, 0, Math.PI * 2);
    ctx.fill();

    // Copa central
    ctx.beginPath();
    ctx.arc(x + 55, ground - 165, 32, 0, Math.PI * 2);
    ctx.fill();
}
    }


    // =================================================
    // NIVEL 2 - DESIERTO
    // =================================================

    else if (level === 2) {

        // Cielo cálido
        ctx.fillStyle = "#F4B860";

        ctx.fillRect(
            0,
            0,
            canvas.width,
            canvas.height
        );


        // Sol
        ctx.fillStyle = "#FFD166";

        ctx.beginPath();

        ctx.arc(
            canvas.width - 70,
            55,
            30,
            0,
            Math.PI * 2
        );

        ctx.fill();


        // Dunas
        ctx.fillStyle = "#E8A95B";

        for (
            let x = -100;
            x < canvas.width + 150;
            x += 180
        ) {

            ctx.beginPath();

            ctx.arc(
                x + 90,
                ground + 20,
                100,
                Math.PI,
                Math.PI * 2
            );

            ctx.fill();
        }
    }


    // =================================================
    // NIVEL 3 - MONTAÑA
    // =================================================

    else {

        // Cielo oscuro
        ctx.fillStyle = "#53678A";

        ctx.fillRect(
            0,
            0,
            canvas.width,
            canvas.height
        );


        // Luna
        ctx.fillStyle = "#F5F3CE";

        ctx.beginPath();

        ctx.arc(
            canvas.width - 70,
            55,
            25,
            0,
            Math.PI * 2
        );

        ctx.fill();


        // Montañas lejanas
        ctx.fillStyle = "#3E506B";

        for (
            let x = -100;
            x < canvas.width + 200;
            x += 180
        ) {

            ctx.beginPath();

            ctx.moveTo(x, ground);

            ctx.lineTo(x + 90, 120);

            ctx.lineTo(x + 180, ground);

            ctx.closePath();

            ctx.fill();
        }


        // Montañas cercanas
        ctx.fillStyle = "#29394F";

        for (
            let x = -150;
            x < canvas.width + 250;
            x += 220
        ) {

            ctx.beginPath();

            ctx.moveTo(x, ground);

            ctx.lineTo(x + 110, 160);

            ctx.lineTo(x + 220, ground);

            ctx.closePath();

            ctx.fill();
        }
    }
}

// =====================================================
// DIBUJAR ZORRO
// =====================================================

function drawFox() {

    // AGACHADO
    if (fox.ducking) {

        if (
            foxDuckImg.complete &&
            foxDuckImg.naturalWidth > 0
        ) {

            ctx.drawImage(
                foxDuckImg,
                fox.frame * 64,
                0,
                64,
                64,
                fox.x,
                ground - 64,
                64,
                64
            );
        }

        return;
    }


    // SALTANDO
    if (fox.jumping) {

        ctx.drawImage(
            foxJumpImg,
            fox.x,
            fox.y,
            64,
            64
        );

        return;
    }


    // CORRIENDO
    ctx.drawImage(
        foxRunImg,
        fox.frame * 64,
        0,
        64,
        64,
        fox.x,
        fox.y,
        64,
        64
    );
}
// =====================================================
// DIBUJAR CACTUS
// =====================================================

function drawCactus(c) {

    let img;

    if (c.tipo === "small") {

        img = cactusSmallImg;

    } else if (c.tipo === "big") {

        img = cactusBigImg;

    } else {

        img = cactusDoubleImg;
    }


    ctx.drawImage(
        img,
        c.x,
        c.y,
        c.width,
        c.height
    );
}


// =====================================================
// DIBUJAR ÁGUILA
// =====================================================
function drawEagle(e) {

    if (
        !eagleImg.complete ||
        eagleImg.naturalWidth === 0
    ) {
        return;
    }

    // eagle.png tiene 8 cuadros
    // en una sola fila

    const frameWidth =
        eagleImg.naturalWidth / 8;

    const frameHeight =
        eagleImg.naturalHeight;

    ctx.drawImage(
        eagleImg,
        e.frame * frameWidth,
        0,
        frameWidth,
        frameHeight,
        e.x,
        e.y,
        e.width,
        e.height
    );
}

// =====================================================
// DIBUJAR MONEDA
// =====================================================

function drawCoin(c) {

    ctx.save();


    ctx.beginPath();

    ctx.arc(

        c.x + c.size / 2,

        c.y + c.size / 2,

        c.size / 2,

        0,

        Math.PI * 2

    );


    ctx.fillStyle = "#FFD700";

    ctx.fill();


    ctx.strokeStyle = "#B8860B";

    ctx.lineWidth = 2;

    ctx.stroke();


    ctx.fillStyle = "#FFFFFF";

    ctx.font = "bold 14px Arial";

    ctx.textAlign = "center";

    ctx.textBaseline = "middle";


    ctx.fillText(

        "$",

        c.x + c.size / 2,

        c.y + c.size / 2

    );


    ctx.restore();
}


// =====================================================
// DIBUJAR MONEDA ESPECIAL
// =====================================================

function drawSpecialCoin(c) {

    ctx.save();


    ctx.translate(

        c.x + c.size / 2,

        c.y + c.size / 2

    );


    ctx.rotate(c.rotation);


    ctx.beginPath();

    ctx.arc(

        0,

        0,

        c.size / 2,

        0,

        Math.PI * 2

    );


    ctx.fillStyle = "#FF00FF";

    ctx.fill();


    ctx.strokeStyle = "#FFFFFF";

    ctx.lineWidth = 3;

    ctx.stroke();


    ctx.fillStyle = "#FFFFFF";

    ctx.font = "bold 14px Arial";

    ctx.textAlign = "center";

    ctx.textBaseline = "middle";


    ctx.fillText(

        "★",

        0,

        0

    );


    ctx.restore();
}


// =====================================================
// DIBUJAR ESCUDO
// =====================================================

function drawShield() {

    if (!shield) {

        return;
    }


    ctx.save();


    ctx.translate(

        shield.x + shield.width / 2,

        shield.y + shield.height / 2

    );


    ctx.rotate(shield.rotation);


    // Forma del escudo
    ctx.beginPath();

    ctx.moveTo(
        0,
        -18
    );

    ctx.lineTo(
        15,
        -10
    );

    ctx.lineTo(
        12,
        8
    );

    ctx.lineTo(
        0,
        20
    );

    ctx.lineTo(
        -12,
        8
    );

    ctx.lineTo(
        -15,
        -10
    );

    ctx.closePath();


    ctx.fillStyle = "#2196F3";

    ctx.fill();


    ctx.strokeStyle = "#FFFFFF";

    ctx.lineWidth = 3;

    ctx.stroke();


    // Símbolo
    ctx.fillStyle = "#FFFFFF";

    ctx.font = "bold 13px Arial";

    ctx.textAlign = "center";

    ctx.textBaseline = "middle";


    ctx.fillText(
        "S",
        0,
        0
    );


    ctx.restore();
}


// =====================================================
// DIBUJAR ESCUDO ACTIVO
// =====================================================

function drawActiveShield() {

    if (!shieldActive) {

        return;
    }


    ctx.save();


    ctx.beginPath();


    ctx.arc(

        fox.x + fox.width / 2,

        fox.y + fox.height / 2,

        42,

        0,

        Math.PI * 2

    );


    ctx.strokeStyle =
        "rgba(50,180,255,0.85)";


    ctx.lineWidth = 4;

    ctx.stroke();


    ctx.restore();
}


// =====================================================
// DIBUJAR CORAZONES
// =====================================================

function drawLives() {

    ctx.font = "24px Arial";

    ctx.textAlign = "left";

    ctx.textBaseline = "alphabetic";


    let hearts = "";


    for (let i = 0; i < lives; i++) {

        hearts += "❤️";
    }


    ctx.fillText(

        hearts,

        20,

        40

    );
}


// =====================================================
// DIBUJAR PUNTUACIÓN
// =====================================================
// =====================================================
// DIBUJAR PUNTUACIÓN
// =====================================================

function drawScore() {

    // Borde negro para que se vea sobre cualquier fondo
    ctx.font = "20px Arial";
    ctx.textAlign = "right";
    ctx.lineWidth = 4;
    ctx.strokeStyle = "black";

    ctx.strokeText(
        "Puntos: " + score,
        canvas.width - 20,
        30
    );

    // Texto blanco
    ctx.fillStyle = "white";

    ctx.fillText(
        "Puntos: " + score,
        canvas.width - 20,
        30
    );
}

// =====================================================
// DIBUJAR NIVEL
// =====================================================

function drawLevel() {

    ctx.fillStyle = "black";

    ctx.font = "20px Arial";

    ctx.textAlign = "left";


    ctx.fillText(

        "Nivel: " + level,

        20,

        70

    );
}


// =====================================================
// DIBUJAR LÍNEAS DE VELOCIDAD
// =====================================================

function drawSpeedLines() {

    ctx.save();


    ctx.strokeStyle =
        "rgba(255,255,255,0.45)";


    ctx.lineWidth = 2;


    speedLines.forEach(line => {

        ctx.beginPath();


        ctx.moveTo(

            line.x,

            line.y

        );


        ctx.lineTo(

            line.x + line.width,

            line.y

        );


        ctx.stroke();

    });


    ctx.restore();
}


// =====================================================
// DIBUJAR SUELO
// =====================================================

function drawGround() {

    ctx.fillStyle = "#D4A373";


    ctx.fillRect(

        0,

        ground,

        canvas.width,

        canvas.height - ground

    );


    // Línea superior del suelo
    ctx.fillStyle = "#8B5A2B";


    ctx.fillRect(

        0,

        ground,

        canvas.width,

        5

    );
}


// =====================================================
// DIBUJAR OBJETOS
// =====================================================

function drawObjects() {

    // Cactus
    cactus.forEach(c => {

        drawCactus(c);

    });


    // Monedas
    coins.forEach(c => {

        drawCoin(c);

    });


    // Monedas especiales
    specialCoins.forEach(c => {

        drawSpecialCoin(c);

    });


    // Escudo
    drawShield();


    // Águilas
    eagles.forEach(e => {

        drawEagle(e);

    });
}


// =====================================================
// PANTALLA DE INICIO
// =====================================================

function drawStartScreen() {

    ctx.fillStyle = "rgba(0,0,0,0.25)";

    ctx.fillRect(

        0,

        0,

        canvas.width,

        canvas.height

    );


    ctx.textAlign = "center";


    // Título
    ctx.fillStyle = "white";

    ctx.font = "bold 42px Arial";


    ctx.fillText(

        "FOX RUNNER",

        canvas.width / 2,

        90

    );


    // Botón
    ctx.fillStyle = "#4CAF50";


    ctx.fillRect(

        canvas.width / 2 - 110,

        145,

        220,

        60

    );


    ctx.fillStyle = "white";

    ctx.font = "bold 26px Arial";


    ctx.fillText(

        "JUGAR",

        canvas.width / 2,

        184

    );


    ctx.font = "16px Arial";


    ctx.fillText(

        "Toca JUGAR para comenzar",

        canvas.width / 2,

        230

    );


    ctx.textAlign = "left";
}


// =====================================================
// PANTALLA GAME OVER
// =====================================================

function drawGameOver() {

    if (!gameOver) {

        return;
    }


    ctx.fillStyle =
        "rgba(0,0,0,0.55)";


    ctx.fillRect(

        0,

        0,

        canvas.width,

        canvas.height

    );


    ctx.textAlign = "center";


    ctx.fillStyle = "white";

    ctx.font = "bold 38px Arial";


    ctx.fillText(

        "GAME OVER",

        canvas.width / 2,

        100

    );


    ctx.font = "22px Arial";


    ctx.fillText(

        "Puntos: " + score,

        canvas.width / 2,

        140

    );


    ctx.font = "20px Arial";


    ctx.fillText(

        "Toca la pantalla para volver a jugar",

        canvas.width / 2,

        190

    );


    ctx.textAlign = "left";
}

// =====================================================
// COLISIONES
// =====================================================

function checkCollision() {

    if (startScreen || gameOver) {
        return;
    }


    // ==============================================
    // CAJA DEL ZORRO
    // ==============================================

    let foxBox = {

        x: fox.x + 10,

        y: fox.y + 8,

        width: fox.width - 20,

        height: fox.height - 12

    };

// ATAQUE DEL FOX AL JEFE
checkBossHit(foxBox);
    // ==============================================
    // CACTUS
    // ==============================================

    cactus.forEach(c => {

        let cactusBox = {

            x: c.x + 8,

            y: c.y + 5,

            width: c.width - 16,

            height: c.height - 5

        };


        if (collision(foxBox, cactusBox)) {

            loseLife();

        }

    });


    // ==============================================
    // ÁGUILA
    // ==============================================

    eagles.forEach(e => {

        let eagleBox = {

            x: e.x + 8,

            y: e.y + 10,

            width: e.width - 16,

            height: e.height - 20

        };


        if (collision(foxBox, eagleBox)) {

            loseLife();

        }

    });


    // ==============================================
    // MONEDAS
    // ==============================================

    coins.forEach((c, index) => {

        let	 coinBox = {

            x: c.x,

            y: c.y,

            width: c.size,

            height: c.size

        };


        if (collision(foxBox, coinBox)) {

            score += 30;

            sounds.coin.currentTime = 0;

            sounds.coin.play().catch(() => {});


            coins.splice(index, 1);

        }

    });


    // ==============================================
    // MONEDAS ESPECIALES
    // ==============================================

    specialCoins.forEach((c, index) => {

        let coinBox = {

            x: c.x,

            y: c.y,

            width: c.size,

            height: c.size

        };


        if (collision(foxBox, coinBox)) {

            score += 50;

            sounds.specialCoin.currentTime = 0;

            sounds.specialCoin.play().catch(() => {});


            specialCoins.splice(index, 1);

        }

    });


    // ==============================================
    // ESCUDO
    // ==============================================

    if (shield) {

        let shieldBox = {

            x: shield.x,

            y: shield.y,

            width: shield.width,

            height: shield.height

        };


        if (collision(foxBox, shieldBox)) {

            shield = null;

            shieldActive = true;

            shieldTime = 600;

        }

    }

// ==============================================
// PROYECTILES DEL JEFE
// ==============================================

for (let i = bossProjectiles.length - 1; i >= 0; i--) {

    const p = bossProjectiles[i];

    const projectileBox = {
        x: p.x,
        y: p.y,
        width: p.width,
        height: p.height
    };

    if (collision(foxBox, projectileBox)) {

        // La bola desaparece
        bossProjectiles.splice(i, 1);

        // 🛡️ El escudo bloquea el ataque
        if (shieldActive) {

            shieldActive = false;
            shieldTime = 0;

            continue;
        }

        // 💥 Sin escudo: pierde una vida
        loseLife();
    }
}

}

// ==============================================
// PROYECTILES DEL JEFE
// ==============================================

bossProjectiles.forEach((p, index) => {

    const projectileBox = {
        x: p.x,
        y: p.y,
        width: p.width,
        height: p.height
    };

    if (collision(foxBox, projectileBox)) {

        // Eliminar proyectil
        bossProjectiles.splice(index, 1);

        // El escudo lo bloquea
        if (shieldActive) {

            shieldActive = false;
            shieldTime = 0;

            return;
        }

        // Si no hay escudo, pierde una vida
        loseLife();
    }
});

// =====================================================
// ATAQUE DEL FOX CONTRA EL JEFE
// =====================================================
// =====================================================
// FOX ATACA AL JEFE DESDE ARRIBA
// =====================================================

function checkBossHit(foxBox) {

    if (!boss.active || victory || gameOver) {
        return;
    }

    // El jefe está protegido después de recibir un golpe
    if (boss.hitCooldown > 0) {
        return;
    }

    const bossBox = {
        x: boss.x + 15,
        y: boss.y + 10,
        width: boss.width - 30,
        height: boss.height - 10
    };

    // Comprobar que Fox y jefe se están tocando
    if (!collision(foxBox, bossBox)) {
        return;
    }

    // =================================================
    // SOLO HACE DAÑO CUANDO EL FOX ESTÁ CAYENDO
    // =================================================

    if (!fox.jumping || fox.velocityY <= 0) {
        return;
    }

    // =================================================
    // COMPROBAR QUE VIENE DESDE ARRIBA
    // =================================================

    const foxBottom = fox.y + fox.height;

    const bossTop = boss.y;

    if (foxBottom > bossTop + 30) {
        return;
    }

    // =================================================
    // GOLPE AL JEFE
    // =================================================

    boss.health-= 1;

    if (boss.health < 0) {
        boss.health = 0;
    }

    // Protección temporal
    boss.hitCooldown = 60;

    // Sonido de golpe
    sounds.hit.currentTime = 0;
    sounds.hit.play().catch(() => {});

    // =================================================
    // REBOTE DEL FOX
    // =================================================

    // ==========================================
// REBOTE HACIA LA IZQUIERDA
// ==========================================

// ==========================================
// REBOTE HACIA ATRÁS
// ==========================================

// ==========================================
// REBOTE HACIA ATRÁS
// ==========================================

fox.velocityY = -10;

fox.jumpingBack = true;

// Velocidad horizontal del rebote
fox.velocityX = -22;
// Volver progresivamente hacia donde comenzó el salto
    // =================================================
    // JEFE DERROTADO
    // =================================================

    if (boss.health <= 0) {

    boss.active = false;

    bossProjectiles = [];

    victory = true;

    btnVictory.style.display = "block";

    return;
}
}
// =====================================================
// PERDER VIDA
// =====================================================

function loseLife() {

    if (invulnerable || gameOver) {

        return;
    }


    // ==============================================
    // EL ESCUDO ABSORBE EL GOLPE
    // ==============================================

    if (shieldActive) {

        shieldActive = false;

        shieldTime = 0;


        sounds.hit.currentTime = 0;

        sounds.hit.play().catch(() => {});


        invulnerable = true;

        invulnerableTime = 60;


        return;
    }


    // ==============================================
    // GOLPE NORMAL
    // ==============================================

    sounds.hit.currentTime = 0;

    sounds.hit.play().catch(() => {});


    lives--;


    // ==============================================
    // GAME OVER
    // ==============================================

    if (lives <= 0) {

        lives = 0;

        gameOver = true;


        sounds.gameover.currentTime = 0;

        sounds.gameover.play().catch(() => {});


        return;
    }


    // ==============================================
    // INVULNERABILIDAD
    // ==============================================

    invulnerable = true;

    invulnerableTime = 120;
}


// =====================================================
// REINICIAR JUEGO
// =====================================================

function restart() {

    cactus = [];

    coins = [];

    eagles = [];

    specialCoins = [];
// =====================================================
// REINICIAR JEFE
// =====================================================
// ==========================================
// REINICIAR JEFE
// ==========================================

boss.active = false;

boss.x = canvas.width + 200;
boss.y = 100;

boss.shootTimer = 0;
boss.direction = 1;

// VIDA DEL JEFE COMPLETA
boss.health = boss.maxHealth;

// Reiniciar protección
boss.hitCooldown = 0;

// Reiniciar salto
boss.jumping = false;
boss.velocityY = 0;

bossProjectiles = [];
    // ESCUDO
    shield = null;

    shieldActive = false;

    shieldTime = 0;


    // PUNTUACIÓN
    score = 0;


    // VELOCIDAD
    speed = 6;


    // VIDAS
    lives = 3;


    // NIVEL
    level = 1;

    levelMessage = "";

    levelMessageTime = 0;


    // GAME OVER
    gameOver = false;


    // INVULNERABILIDAD
    invulnerable = false;

    invulnerableTime = 0;


    // OBJETOS
    obstacleTimer = 0;


    // ZORRO
    fox.x = 80;

    fox.y = ground - fox.height;

    fox.velocityY = 0;

    fox.jumping = false;

    fox.ducking = false;

    fox.frame = 0;


    // DÍA / NOCHE
    timeOfDay = 0;


    // LÍNEAS DE VELOCIDAD
    speedLines = [];
}
// =====================================================
// PANTALLA DE VICTORIA
// =====================================================

function drawVictory() {

    if (!victory) return;

    ctx.save();

    // Fondo oscuro transparente
    ctx.fillStyle = "rgba(0, 0, 0, 0.65)";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Texto principal
    ctx.fillStyle = "#FFD700";
    ctx.font = "bold 42px Arial";
    ctx.textAlign = "center";

    ctx.fillText(
        "¡VICTORIA!",
        canvas.width / 2,
        100
    );

    // Texto secundario
    ctx.fillStyle = "white";
    ctx.font = "bold 20px Arial";

    ctx.fillText(
        "¡Has derrotado al jefe!",
        canvas.width / 2,
        135
    );

    ctx.restore();
}
// =====================================================
// DIBUJAR JEFE FINAL
// ==================================================

// =====================================================
// DIBUJAR JEFE FINAL
// =====================================================

// =====================================================
// DIBUJAR JEFE FINAL
// =====================================================

// =====================================================
// DIBUJAR JEFE FINAL
// =====================================================
// =====================================================
// DIBUJAR JEFE FINAL
// =====================================================
// =====================================================
// DIBUJAR JEFE FINAL
// =====================================================
// =====================================================
// DIBUJAR JEFE FINAL
// =====================================================

function drawBoss() {

    if (!boss.active) return;

    const bossWidth = 120;
    const bossHeight = 120;

    const bossX = boss.x;

    // Pies apoyados en el suelo
    const bossY = ground - bossHeight;


    // ==========================================
    // JEFE CORRIENDO
    // ==========================================

    if (!boss.jumping) {

        if (
            bossRunImg.complete &&
            bossRunImg.naturalWidth > 0
        ) {

            const frameWidth =
                bossRunImg.naturalWidth / BOSS_FRAMES;

            const frameHeight =
                bossRunImg.naturalHeight;

            ctx.save();

            // Voltear horizontalmente
            ctx.scale(-1, 1);

            ctx.drawImage(

                bossRunImg,

                bossFrame * frameWidth,
                0,
                frameWidth,
                frameHeight,

                // Nueva posición X al voltear
                -bossX - bossWidth,
                bossY,
                bossWidth,
                bossHeight
            );

            ctx.restore();
        }
    }


    // ==========================================
    // JEFE SALTANDO
    // ==========================================

    else {

        if (
            bossJumpImg.complete &&
            bossJumpImg.naturalWidth > 0
        ) {

            ctx.save();

            // Voltear horizontalmente
            ctx.scale(-1, 1);

            ctx.drawImage(

                bossJumpImg,

                0,
                0,
                bossJumpImg.naturalWidth,
                bossJumpImg.naturalHeight,

                -bossX - bossWidth,
                boss.y,
                bossWidth,
                bossHeight
            );

            ctx.restore();
        }
    }


    // ==========================================
    // ❤️ BARRA DE VIDA
    // ==========================================

    const barWidth = 160;
    const barHeight = 16;

    const barX =
        bossX +
        bossWidth / 2 -
        barWidth / 2;

    const barY =
        bossY - 25;

    ctx.fillStyle = "#222";

    ctx.fillRect(
        barX,
        barY,
        barWidth,
        barHeight
    );


    const healthWidth =
        barWidth *
        Math.max(
            0,
            boss.health / boss.maxHealth
        );

    ctx.fillStyle = "#e63946";

    ctx.fillRect(
        barX,
        barY,
        healthWidth,
        barHeight
    );


    ctx.fillStyle = "#fff";

    ctx.font = "bold 13px Arial";

    ctx.textAlign = "center";

    ctx.fillText(
        "JEFE",
        bossX + bossWidth / 2,
        barY - 6
    );

    ctx.textAlign = "left";
}
// =====================================================
// DIBUJAR
// =====================================================
// =====================================================
// FONDO BOSQUE ETAPA 1
// =====================================================
// =====================================================
// FONDO BOSQUE ETAPA 1 - SIN ESPACIOS VACÍOS
// =====================================================
function drawForestBackground() {

    if (!forestBgImg.complete || forestBgImg.naturalWidth === 0) {
        ctx.fillStyle = "#5f8f3d";
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        return;
    }

    // Movimiento lento del fondo
    forestBgOffset += speed * 0.25;

    const imgRatio =
        forestBgImg.naturalWidth /
        forestBgImg.naturalHeight;

    const drawHeight = canvas.height;
    const drawWidth = drawHeight * imgRatio;

    // Cuando termina una imagen, reiniciamos exactamente
    if (forestBgOffset >= drawWidth) {
        forestBgOffset -= drawWidth;
    }

    // Dibujamos varias copias para garantizar cobertura
    for (let x = -drawWidth - forestBgOffset;
         x < canvas.width + drawWidth;
         x += drawWidth) {

        ctx.drawImage(
            forestBgImg,
            x,
            0,
            drawWidth,
            drawHeight
        );
    }
}

// =====================================================
// FONDO DESIERTO ETAPA 2
// =====================================================

// =====================================================
// FONDO DESIERTO ETAPA 2 + SOL
// =====================================================
function drawDesertBackground() {

    if (!desertBgImg.complete || desertBgImg.naturalWidth === 0) {
        ctx.fillStyle = "#F4B860";
        ctx.fillRect(
            0,
            0,
            canvas.width,
            canvas.height
        );
        return;
    }

    // Movimiento lento del fondo
    desertBgOffset += speed * 0.25;

    const imgRatio =
        desertBgImg.naturalWidth /
        desertBgImg.naturalHeight;

    const drawHeight = canvas.height;
    const drawWidth = drawHeight * imgRatio;

    // Reiniciar sin dejar espacios vacíos
    if (desertBgOffset >= drawWidth) {
        desertBgOffset -= drawWidth;
    }

    // Dibujar varias copias del fondo
    for (
        let x = -drawWidth - desertBgOffset;
        x < canvas.width + drawWidth;
        x += drawWidth
    ) {

        ctx.drawImage(
            desertBgImg,
            x,
            0,
            drawWidth,
            drawHeight
        );
    }

    // =================================================
    // SOL DE LA ETAPA 2
    // =================================================

    ctx.fillStyle = "#FFD166";

    ctx.beginPath();

    ctx.arc(
        canvas.width - 70,
        55,
        30,
        0,
        Math.PI * 2
    );

    ctx.fill();
}
// =====================================================
// FONDO ETAPA 3 - NOCHE + LUNA
// =====================================================
function drawNightBackground() {

    if (!nightBgImg.complete || nightBgImg.naturalWidth === 0) {

        ctx.fillStyle = "#080D2B";

        ctx.fillRect(
            0,
            0,
            canvas.width,
            canvas.height
        );

        return;
    }

    // Movimiento lento del fondo
    nightBgOffset += speed * 0.20;

    const imgRatio =
        nightBgImg.naturalWidth /
        nightBgImg.naturalHeight;

    const drawHeight = canvas.height;
    const drawWidth = drawHeight * imgRatio;

    // Reiniciar sin dejar espacios
    if (nightBgOffset >= drawWidth) {
        nightBgOffset -= drawWidth;
    }

    // Dibujar varias copias del fondo
    for (
        let x = -drawWidth - nightBgOffset;
        x < canvas.width + drawWidth;
        x += drawWidth
    ) {

        ctx.drawImage(
            nightBgImg,
            x,
            0,
            drawWidth,
            drawHeight
        );
    }

    // =================================================
    // LUNA DE LA ETAPA 3
    // =================================================

    ctx.fillStyle = "#F5F3CE";

    ctx.beginPath();

    ctx.arc(
        canvas.width - 70,
        55,
        25,
        0,
        Math.PI * 2
    );

    ctx.fill();
}

// =====================================================
// FONDO ETAPA FINAL - INCENDIO + LUNA MENGUANTE ROJA
// =====================================================
function drawFinalBackground() {

    if (!finalBgImg.complete || finalBgImg.naturalWidth === 0) {

        ctx.fillStyle = "#16050A";

        ctx.fillRect(
            0,
            0,
            canvas.width,
            canvas.height
        );

        return;
    }

    // Movimiento lento del fondo
    finalBgOffset += speed * 0.20;

    const imgRatio =
        finalBgImg.naturalWidth /
        finalBgImg.naturalHeight;

    const drawHeight = canvas.height;
    const drawWidth = drawHeight * imgRatio;

    // Reiniciar sin dejar espacios
    if (finalBgOffset >= drawWidth) {
        finalBgOffset -= drawWidth;
    }

    // Varias copias del fondo
    for (
        let x = -drawWidth - finalBgOffset;
        x < canvas.width + drawWidth;
        x += drawWidth
    ) {

        ctx.drawImage(
            finalBgImg,
            x,
            0,
            drawWidth,
            drawHeight
        );
    }

    // =================================================
    // LUNA MENGUANTE ROJA
    // =================================================

    const moonX = canvas.width - 70;
    const moonY = 55;
    const moonR = 27;

    ctx.fillStyle = "#D72626";

    ctx.beginPath();

    // Parte exterior de la luna
    ctx.arc(
        moonX,
        moonY,
        moonR,
        Math.PI * 0.5,
        Math.PI * 1.5
    );

    // Parte interior curva
    ctx.arc(
        moonX + 12,
        moonY,
        moonR,
        Math.PI * 1.5,
        Math.PI * 0.5,
        true
    );

    ctx.closePath();
    ctx.fill();

    // Pequeño brillo rojo
    ctx.fillStyle = "rgba(255,70,50,0.25)";

    ctx.beginPath();

    ctx.arc(
        moonX - 3,
        moonY - 2,
        moonR + 4,
        Math.PI * 0.55,
        Math.PI * 1.45
    );

    ctx.stroke();
}
function draw() {
    // ==============================================
    // FONDO
    // ==============================================

   if (level === 1) {

    drawForestBackground();

} else if (level === 2) {

    drawDesertBackground();

} else if (level === 3) {

    drawNightBackground();

} else if (level === 4) {

    drawFinalBackground();

} else {

    drawSky();

}

    // ==============================================
    // DÍA / NOCHE
    // ==============================================

    let nightAlpha =
        (Math.sin(timeOfDay * Math.PI * 2) + 1) / 2;


    if (level === 3) {

        nightAlpha = 0.35;
    }


    ctx.fillStyle =
        "rgba(20,30,80," +
        (nightAlpha * 0.35) +
        ")";


    ctx.fillRect(

        0,

        0,

        canvas.width,

        canvas.height

    );


    // ==============================================
    // SUELO
    // ==============================================

    drawGround();


    // ==============================================
    // LÍNEAS DE VELOCIDAD
    // ==============================================

    drawSpeedLines();


    // ==============================================
    // OBJETOS
    // ==============================================

    drawObjects();
// JEFE FINAL
drawBoss();
drawVictory();
drawBossProjectiles();

    // ==============================================
    // ZORRO
    // ==============================================

    drawFox();


    // ==============================================
    // ESCUDO ACTIVO
    // ==============================================

    drawActiveShield();


    // ==============================================
    // VIDAS
    // ==============================================

    drawLives();


    // ==============================================
    // PUNTUACIÓN
    // ==============================================

    drawScore();


    // ==============================================
    // NIVEL
    // ==============================================

    drawLevel();


    // ==============================================
    // MENSAJE DE NIVEL
    // ==============================================

    drawLevelMessage();


    // ==============================================
    // PANTALLA DE INICIO
    // ==============================================

    if (startScreen) {

        drawStartScreen();

    }


    // ==============================================
    // GAME OVER
    // ==============================================

    if (gameOver) {

        drawGameOver();

    }
}


// =====================================================
// BUCLE PRINCIPAL
// =====================================================

function loop() {

    // ==============================================
    // ACTUALIZAR
    // ==============================================

    if (!startScreen && !gameOver) {

        updateFox();

        createRandomObjects();

        updateObjects();
updateBoss();
updateBossProjectiles();
        checkCollision();

        updateLevel();

        updateDayNight();


        // ==========================================
        // INVULNERABILIDAD
        // ==========================================

        if (invulnerable) {

            invulnerableTime--;


            if (invulnerableTime <= 0) {

                invulnerable = false;
            }
        }


        // ==========================================
        // ESCUDO
        // ==========================================

        if (shieldActive) {

            shieldTime--;


            if (shieldTime <= 0) {

                shieldActive = false;

                shieldTime = 0;
            }
        }
    }


    // ==============================================
    // DIBUJAR
    // ==============================================

    draw();


    requestAnimationFrame(loop);
}


// =====================================================
// PUNTUACIÓN Y VELOCIDAD
// =====================================================

setInterval(() => {

    if (!startScreen && !gameOver) {
speed = Math.min(speed + 0.3, 8);
        
        score++;

    }

}, 1000);


// =====================================================
// INICIAR
// =====================================================

loop();
