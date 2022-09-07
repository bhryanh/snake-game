const screen = document.getElementById('screen')
const context = screen.getContext('2d')

const game = createGame();
const keyboardListener = createKeyboardListener();
keyboardListener.subscribe(game.movePlayer)

const player1 = {
    playerId: 'player1',
    playerX: 0,
    playerY: 0
}

const fruit1 = {
    fruitId: 'fruit1',
    fruitX: 2,
    fruitY: 2
}

game.addPlayer(player1)
game.addFruit(fruit1)


function createKeyboardListener() {
    const state = {
        observers: []
    }

    function subscribe(observerFunction) {
        state.observers.push(observerFunction)
    }

    function notifyAll(command){
        console.log(`Notifying ${state.observers.length} observers`)

        for(const observerFunction of state.observers) {
            observerFunction(command)
        }
    }


    document.addEventListener('keydown', handleKeydown)

    function handleKeydown(event) {
        const keyPressed = event.key
    
        const command = {
            playerId: 'player1',
            keyPressed
        }
    
        notifyAll(command)
    }

    return {
        subscribe
    }
}

function renderScreen() {
    clearScreen()

    for(const playerId in game.state.players) {
        const player = game.state.players[playerId]
        context.fillStyle = 'black'
        context.fillRect(player.x, player.y, 1, 1)
    }

    for(const fruitId in game.state.fruits) {
        const fruit = game.state.fruits[fruitId]
        context.fillStyle = 'green'
        context.fillRect(fruit.x, fruit.y, 1, 1)
    }

    requestAnimationFrame(renderScreen)
}

function clearScreen() {
    context.fillStyle = 'white'
    context.clearRect(0, 0, 10, 10)
}

function createGame() {
    const state = {
        players: {},
        fruits: {}
    }

    const acceptedMoves = {
        ArrowUp(player){
            if (player.y - 1 >= 0) {
                player.y -= 1
            }
        },
        ArrowDown(player){
            if(player.y + 1 < screen.height) {
                player.y += 1
            }
        },
        ArrowLeft(player){
            if(player.x - 1 >= 0) {
                player.x -= 1 
            }
        },
        ArrowRight(player){
            if(player.x + 1 < screen.width) {
                player.x += 1 
            }
        }
    }

    function addPlayer(command){
        const playerId = command.playerId
        const playerX = command.playerX
        const playerY = command.playerY

        state.players[playerId] = {
            x: playerX,
            y: playerY
        }
    }

    function removePlayer(command){
        const playerId = command.playerId

        delete state.players[playerId]
    }

    function addFruit(command){
        const fruitId = command.fruitId
        const fruitX = command.fruitX
        const fruitY = command.fruitY

        state.fruits[fruitId] = {
            x: fruitX,
            y: fruitY
        }
    }

    function removeFruit(command){
        const fruitId = command.fruitId

        delete state.fruits[fruitId]
    }

    function checkForFruitCollision(playerId){
        const player = state.players[playerId]

        for(const fruitId in state.fruits){
            const fruit = state.fruits[fruitId]

            if(player.x === fruit.x && player.y === fruit.y) {
                console.log("collision")
                removeFruit( { fruitId: fruitId })
            }
        }
    }

    function movePlayer(command) {
        console.log(`Moving ${command.playerId} with ${command.keyPressed}`)

        const keyPressed = command.keyPressed
        const playerId = command.playerId
        const player = state.players[command.playerId]
        const moveFunction = acceptedMoves[keyPressed]

        if(player && moveFunction) {
            moveFunction(player)
            checkForFruitCollision(playerId)
        }
    }

    return {
        addFruit,
        removeFruit,
        addPlayer,
        removePlayer,
        movePlayer,
        state
    }
}

renderScreen()