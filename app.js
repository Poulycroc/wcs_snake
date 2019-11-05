var canvas = ctx = null
var viewportX = viewportY = 0
var gridSize = tc = 20
var trail = []
var listPlayers = [
    { idPlayer: 0, nickname: 'Kate', email: 'kate@gmail.com' },
    { idPlayer: 1, nickname: 'Nada', email: 'nada@gmail.com' },
    { idPlayer: 2, nickname: 'Rose', email: 'rose@gmail.com' },
    { idPlayer: 3, nickname: 'Nandi', email: 'nandi@gmail.com' }
]

var listScores = [
    { idPlayer: 0, score: 0 },
    { idPlayer: 1, score: 0 },
    { idPlayer: 2, score: 0 },
    { idPlayer: 3, score: 0 }
]

var currentPlayer = ""
var currentPlayerPosition = ""
var interval = null
var marioSong = null
var ovationSound = null


window.onload = function() {
    canvas = document.getElementById('canvas')
    ctx = canvas.getContext('2d')
    document.addEventListener('keydown', keyPush)
    playerChoice(listPlayers)
    marioSong = new Audio("http://23.237.126.42/ost/super-mario-bros/khbnvkqp/01%20-%20Super%20Mario%20Bros.mp3")
    ovationSound = new Audio("C:\\sounds\\Ovation.mp3")
    interval = setInterval(game, 1000 / 5)
}

var screen = {
    draw: function({ width, height }, ctx) {
        ctx.fillStyle = 'black'
        ctx.fillRect(0, 0, width, height)
        printPlayer(currentPlayer)
        printScore(currentPlayerPosition)
    }
}
var food = {
    x: 15,
    y: 15,
    spawn: function() {
        this.x = Math.floor(Math.random() * gridSize)
        this.y = Math.floor(Math.random() * gridSize)
    },
    draw: function(ctx) {
        ctx.fillStyle = 'red'
        ctx.fillRect(
            this.x * gridSize,
            this.y * gridSize,
            gridSize - 2,
            gridSize - 2
        )
    }
}
var snake = {
    x: viewportX,
    y: viewportY,
    tail: 5,

    initArray: function() {
        trail.push({ x: this.x, y: this.y })
    },

    update: function() {
        this.x += viewportX
        this.y = this.y + viewportY
        if (this.x == food.x && this.y == food.y) {
            ovationSound.play()
            food.spawn()
                //this.tail = this.tail * 2
            listScores[currentPlayerPosition].score += 5
        }
        while (trail.length > this.tail) {
            trail.shift()
        }

    },
    draw: function(ctx) {
        for (let i = 0; i < trail.length; i++) {
            ctx.fillStyle = 'green'
            ctx.fillRect(
                trail[i].x * gridSize,
                trail[i].y * gridSize,
                gridSize - 2,
                gridSize - 2
            )
            if (trail.length < this.tail) {
                trail.push({ x: this.x, y: this.y })
            }
        }
    },
    eraseSnake: function(ctx) {

        for (let i = 4; i >= 0; i--) {
            ctx.fillStyle = 'black'
            ctx.fillRect(
                trail[i].x * gridSize,
                trail[i].y * gridSize,
                gridSize - 2,
                gridSize - 2
            )
        }
    },
    outside: function({ width, height }) {
        /*if (this.x * gridSize > width) this.x = 0
        if (this.y * gridSize > height) this.y = 0*/
        if (this.x * gridSize > width || this.y * gridSize > height) {
            this.x = 0
            marioSong.play()
            snake.eraseSnake(ctx)
            printGameOver()
            clearInterval(interval)

        }
        /*       if (this.y * gridSize > height) {
                   this.y = 0
                   marioSong.play()
                   snake.eraseSnake(ctx)
                   printGameOver()
                   clearInterval(interval)
               }*/
    }
}

function game() {
    screen.draw(canvas, ctx)
    snake.initArray()
    snake.draw(ctx)
    snake.update()
    snake.outside(canvas)
    food.draw(ctx)
}

function printPlayer(name) {
    ctx.font = "15px Arial"
    ctx.fillStyle = "red"
    ctx.textAlign = "left"
    ctx.fillText(name, 50, 25)
}

function printScore(position) {
    ctx.font = "15px Arial"
    ctx.fillStyle = "red"
    ctx.textAlign = "right"
    ctx.fillText("Score:" + listScores[position].score, 350, 25)
}

function printGameOver() {
    ctx.font = "30px Arial"
    ctx.fillStyle = "hsl(25,100%,50%)"
    ctx.textAlign = "center"
    ctx.fillText("GAME OVER", 200, 200)
}

function drawEffect(text = 'default') {
    var i = 1;
    ctx.fillText(text.substr(0, i), 200, 200)
    i++
    if (i < text.length) {
        requestAnimationFrame(drawEffect(text))
    }
}

function changeVpPosition(x, y) {
    viewportX = x
    viewportY = y
}

function playerChoice(listPlayers) {
    var result = listPlayers[Math.floor(Math.random() * listPlayers.length)]
    currentPlayerPosition = result.idPlayer
    currentPlayer = result.nickname
}

function keyPush({ keyCode }) {
    switch (keyCode) {
        case 37: // left
            changeVpPosition(-1, 0)
            break;
        case 38: // up
            changeVpPosition(0, -1)
            break;
        case 39: // right
            changeVpPosition(1, 0)
            break;
        case 40: // bottom
            changeVpPosition(0, 1)
            break;
    }
    //How to retrieve key CODE
    //var fc = function(event) {console.log(event)}
    //document.addEventListener("keydown",fc);
}