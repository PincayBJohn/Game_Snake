/* 
   Integrantes:
   * Palma Laz Ariel Leonardo
   * Pincay Baque John Alexander
   * Jhimy Andres Vergara Villacís
   * Zambrano Mendoza Nelson Gustavo

   Paralelo: "B"

   Materia: DESARROLLO BASADO EN PLATAFORMA
*/


const playBoard = document.querySelector(".zona");
const scoreElement = document.querySelector(".score");
const highScoreElement = document.querySelector(".high-score");
const controls = document.querySelectorAll(".controls i");

let gameOver = false;
let foodX, foodY;
let snakeX = 5, snakeY = 5;
let velocityX = 0, velocityY = 0;
let snakeBody = [];
let setIntervalId;
let score = 0;

// Obteniendo puntuación alta del almacenamiento local
let highScore = localStorage.getItem("high-score") || 0;
highScoreElement.innerText = `Record: ${highScore}`;

const updateFoodPosition = () => {
// Pasando un valor aleatorio de 1 a 30 como posición de comida
    foodX = Math.floor(Math.random() * 30) + 1;
    foodY = Math.floor(Math.random() * 30) + 1;
}

const handleGameOver = () => {
// Borrando el cronómetro y recargando la página al terminar el juego
    clearInterval(setIntervalId);
    location.reload();
}

const changeDirection = e => {
// Cambiar el valor de velocidad según la pulsación de una tecla
    if(e.key === "ArrowUp" && velocityY != 1) {
        velocityX = 0;
        velocityY = -1;
    } else if(e.key === "ArrowDown" && velocityY != -1) {
        velocityX = 0;
        velocityY = 1;
    } else if(e.key === "ArrowLeft" && velocityX != 1) {
        velocityX = -1;
        velocityY = 0;
    } else if(e.key === "ArrowRight" && velocityX != -1) {
        velocityX = 1;
        velocityY = 0;
    }
}

// Llamar a changeDirection en cada clic de tecla y pasar el valor del conjunto de datos clave como un objeto
controls.forEach(button => button.addEventListener("click", () => changeDirection({ key: button.dataset.key })));

const initGame = () => {
    if(gameOver) return handleGameOver();
    let html = `<div class="food" style="grid-area: ${foodY} / ${foodX}"></div>`;

// Comprobando si la serpiente golpeó la comida
    if(snakeX === foodX && snakeY === foodY) {
        updateFoodPosition();
        snakeBody.push([foodY, foodX]); // Empujando la posición de la comida hacia el cuerpo de la serpiente.
        score++; // incrementa la puntuación en 1
        highScore = score >= highScore ? score : highScore;
        localStorage.setItem("high-score", highScore);
        scoreElement.innerText = `Puntuación: ${score}`;
        highScoreElement.innerText = `Record: ${highScore}`;
    }
// Actualizando la posición de la cabeza de la serpiente según la velocidad actual
    snakeX += velocityX;
    snakeY += velocityY;
    
// Avanzando los valores de los elementos en el cuerpo de la serpiente en uno
    for (let i = snakeBody.length - 1; i > 0; i--) {
        snakeBody[i] = snakeBody[i - 1];
    }
    snakeBody[0] = [snakeX, snakeY]; // Estableciendo el primer elemento del cuerpo de la serpiente en la posición actual de la serpiente

// Comprobando si la cabeza de la serpiente está fuera de la pared, si es así configura gameOver en verdadero
    if(snakeX <= 0 || snakeX > 30 || snakeY <= 0 || snakeY > 30) {
        return gameOver = true;
    }

    for (let i = 0; i < snakeBody.length; i++) {
//Añadiendo un div para cada parte del cuerpo de la serpiente
        html += `<div class="snake" style="grid-area: ${snakeBody[i][1]} / ${snakeBody[i][0]}">♦️</div>`;
// Comprobando si la cabeza de serpiente golpeó el cuerpo, si es así configura gameOver en verdadero
        if (i !== 0 && snakeBody[0][1] === snakeBody[i][1] && snakeBody[0][0] === snakeBody[i][0]) {
            gameOver = true;
        }
    }
    playBoard.innerHTML = html;
}

updateFoodPosition();
setIntervalId = setInterval(initGame, 100);
document.addEventListener("keyup", changeDirection);