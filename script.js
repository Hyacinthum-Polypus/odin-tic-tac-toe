const displayController = (() =>
{
    const mainContainer = document.querySelector('.main-container');
    
    const _clearDisplay = () => {
        const squares = document.querySelectorAll('.main-container > *');

        squares.forEach(square =>
        {
            mainContainer.removeChild(square);
        });
    }

    const displayBoard = gameBoard => {
        _clearDisplay();
        
        gameBoard.forEach((square, i) =>
        {
            const squareElement = document.createElement('div');
            squareElement.classList.add('square');
            squareElement.textContent = square;
            squareElement.setAttribute('data-square', i);
            squareElement.addEventListener('click', e => game.input(squareElement.getAttribute('data-square')));
            mainContainer.appendChild(squareElement);
        });
    }

    const displayPlayerNames = () =>
    {
        const playerXElement = document.querySelector('.player-x');
        const playerOElement = document.querySelector('.player-o');

        playerXElement.removeChild(document.querySelector('.player-x > *'));
        playerOElement.removeChild(document.querySelector('.player-o > *'));
        
        const playerXInput = document.createElement('input');
        playerXInput.setAttribute('type', 'text');
        playerXInput.setAttribute('value', playerX.getName());
        playerXElement.appendChild(playerXInput);
        playerXInput.addEventListener('input', e => playerX.setName(playerXInput.value));

        if(!game.getAIMode())
        {
            const playerOInput = document.createElement('input');
            playerOInput.setAttribute('type', 'text');
            playerOInput.setAttribute('value', playerO.getName());
            playerOElement.appendChild(playerOInput);
            playerOInput.addEventListener('input', e => playerO.setName(playerOInput.value));    
        }
        else
        {
            const playerOInput = document.createElement('div');
            playerOInput.textContent = playerO.getName();
            playerOElement.appendChild(playerOInput);
        }
    }

    const displayGameState = message =>
    {
        const gameStateElement = document.querySelector('header > h2');
        gameStateElement.textContent = message;
    }

    return {displayBoard, displayPlayerNames, displayGameState};
})();

const playerFactory = ((name, marker) =>
{
    const getName = () => {return name};
    const setName = (newName) => {name = newName};
    const getMarker = () => {return marker};
    return {getName, setName, getMarker};
});

const playerX = playerFactory("Player X", "X");
const playerO = playerFactory("Player O", "O");

const game = (() => 
{
    const gameBoard = (() => 
    {
        let gameBoardArray = [null, null, null, null, null, null, null, null, null];

        const _isValidIndex = (index) => {return (index >= 0 && index < 9)};
        const _indexError = index => {console.log(`${index} is a invalid index! Only indexes 0-8`)};

        const getGameBoard = () => {return gameBoardArray};
        const clearGameBoard = () => {console.log('restart'); gameBoardArray.forEach((square, index, array) => array[index] = null)};
        const getSquare = (index) => {if(_isValidIndex(index)) { return gameBoardArray[index]} else {_indexError(index)}};
        const setSquare = (index, marker) => {if(_isValidIndex(index)) {gameBoardArray[index] = marker; return gameBoardArray[index]} else {_indexError(index)}};
        const checkRow = (marker, square) =>
        {
            square = +square;

            //Check row
            switch(square%3)
            {
                case 0:
                    if(getSquare(square+1) == marker && getSquare(square+2) == marker)
                    return true;
                break;
                case 1:
                    if(getSquare(square-1) == marker && getSquare(square+1) == marker)
                    return true;
                break;
                case 2:
                    if(getSquare(square-1) == marker && getSquare(square-2) == marker)
                    return true;
                break;                    
            }
            //check column
            switch(Math.floor(square/3))
            {
                case 0:
                    if(getSquare(square+3) == marker && getSquare(square+6) == marker)
                    return true;
                break;
                case 1:
                    if(getSquare(square-3) == marker && getSquare(square+3) == marker)
                    return true;
                break;
                case 2:
                    if(getSquare(square-3) == marker && getSquare(square-6) == marker)
                    return true;
                break;
            }
            //check diagonals
            if(getSquare(4) == marker)
            {
                if(getSquare(0) == marker && getSquare(8) == marker)
                {
                    return true;
                }
                else if(getSquare(2) == marker && getSquare(6) == marker)
                {
                    return true;
                }
            }            
            return false;
        }
        const hasEmptySpace = () =>
        {
            return getGameBoard().reduce((hasEmptySquare, currentSquare) =>
            {
                if(currentSquare == null)
                {
                    hasEmptySquare = true;
                }
                return hasEmptySquare;
            }, false);
        }

        return {getGameBoard, clearGameBoard, getSquare, setSquare, checkRow, hasEmptySpace};
    })();

    let turn;
    let gameOver;
    let aiMode = false;

    const _getTurn = () =>
    {
        return turn;
    }

    const _getCurrentPlayer = () =>
    {
        return  turn == playerX.getMarker() ? playerX : playerO;
    }

    const _nextTurn = () =>
    {
        turn = turn == playerX.getMarker() ? playerO.getMarker() : playerX.getMarker();
        displayController.displayGameState(`It is ${_getCurrentPlayer().getName()}'s turn`);

        if(getAIMode() && turn == playerO.getMarker())
        _playAIMove()
    }

    const _toggleAIMode = () =>
    {
        aiMode = !aiMode;
        if(aiMode == true) playerO.setName('Computer'); else playerO.setName('Player O');
        restart();
    }

    const getAIMode = () =>
    {
        return aiMode;
    }

    const restart = () =>
    {
        gameOver = false;
        gameBoard.clearGameBoard();
        turn = playerX.getMarker();
        displayController.displayPlayerNames();
        displayController.displayBoard(gameBoard.getGameBoard());
        displayController.displayGameState(`It is ${_getCurrentPlayer().getName()}'s turn`)
    }


    const _checkWin = square =>
    {
        if(gameBoard.checkRow(_getTurn(), square))
        {
            console.log(`${_getCurrentPlayer().getName()} has won.`);
            displayController.displayGameState(`${_getCurrentPlayer().getName()} has won.`);
            gameOver = true;
        }
        else
        {
            console.log(`${_getCurrentPlayer().getName()} has not won yet.`);
        }
    }

    const _checkTie = () =>
    {
        if(!gameBoard.hasEmptySpace())
        {
            console.log('The game has tied!');
            displayController.displayGameState("Tie! Game Over!");
            gameOver = true;
        }
        else
        {
            console.log('The game has not tied');
        }

    }

    const _checkImmediateWinLoss = marker =>
    {
        //Check rows
        for(let row = 0; row < 3; row++)
        {
            let count = 0;
            let emptyIndex;
            if(gameBoard.getSquare(3*row) == marker) count++; else if(gameBoard.getSquare(3*row) == null) emptyIndex = 3*row;
            if(gameBoard.getSquare(3*row+1) == marker) count++; else if(gameBoard.getSquare(3*row+1) == null) emptyIndex = 3*row+1;
            if(gameBoard.getSquare(3*row+2) == marker) count++; else if(gameBoard.getSquare(3*row+2) == null) emptyIndex = 3*row+2;
            if(count == 2 && emptyIndex != null)
            {
                input(emptyIndex);
                return true;
            }            
        }

        //Check columns
        for(let column = 0; column < 3; column++)
        {
            let count = 0;
            let emptyIndex = null;
            if(gameBoard.getSquare(column) == marker) count++; else if(gameBoard.getSquare(column) == null) emptyIndex = column;
            if(gameBoard.getSquare(column+3) == marker) count++; else if(gameBoard.getSquare(column+3) == null) emptyIndex = column+3;
            if(gameBoard.getSquare(column+6) == marker) count++; else if(gameBoard.getSquare(column+6) == null) emptyIndex = column+6;
            if(count == 2 && emptyIndex != null)
            {
                input(emptyIndex);
                return true;
            } 
        }

        //Check diagnoal rows
        let count = 0;
        let emptyIndex = null;
        if(gameBoard.getSquare(0) == marker) count++; else if(gameBoard.getSquare(0) == null) emptyIndex = 0;
        if(gameBoard.getSquare(4) == marker) count++; else if(gameBoard.getSquare(4) == null) emptyIndex = 4;
        if(gameBoard.getSquare(8) == marker) count++; else if(gameBoard.getSquare(8) == null) emptyIndex = 8;
        if(count == 2 && emptyIndex != null)
        {
            input(emptyIndex);
            return true;
        } 

        count = 0;
        emptyIndex = null;
        if(gameBoard.getSquare(2) == marker) count++; else if(gameBoard.getSquare(2) == null) emptyIndex = 2;
        if(gameBoard.getSquare(4) == marker) count++; else if(gameBoard.getSquare(4) == null) emptyIndex = 4;
        if(gameBoard.getSquare(6) == marker) count++; else if(gameBoard.getSquare(6) == null) emptyIndex = 6;
        if(count == 2 && emptyIndex != null) 
        {
            input(emptyIndex);
            return true;
        }

        return false;
    }

    const _playAIMove = () =>
    {
        //Take immediate win
        if(_checkImmediateWinLoss(playerO.getMarker())) return;

        //Prevent immediate loss
        if(_checkImmediateWinLoss(playerX.getMarker())) return;
        
        if(gameBoard.getSquare(4) == null) return input(4);

        //Make a managed random move
        let randomNumber;

        if(gameBoard.getSquare(4) == playerO.getMarker())
        {
            do
            {
                randomNumber =  Math.floor(Math.random()*100)%4;
                switch(randomNumber)
                {
                    case 0: randomNumber=1; break;
                    case 1: randomNumber=3; break;
                    case 2: randomNumber=5; break;
                    case 3: randomNumber=7; break;
                }
            }
            while(gameBoard.getSquare(randomNumber) != null)
    
            return input(randomNumber);
        }

        if(gameBoard.getSquare(4) == playerX.getMarker())
        {
            do
            {
                randomNumber =  Math.floor(Math.random()*100)%4;
                switch(randomNumber)
                {
                    case 0: randomNumber=0; break;
                    case 1: randomNumber=2; break;
                    case 2: randomNumber=6; break;
                    case 3: randomNumber=8; break;
                }
            }
            while(gameBoard.getSquare(randomNumber) != null)
    
            return input(randomNumber);
        }

        //Make a completely random move
        do
        {
            randomNumber =  Math.floor(Math.random()*100)%8;
        }
        while(gameBoard.getSquare(randomNumber) != null)

        input(randomNumber);
    }

    const input = squareIndex =>
    {
        console.log('CLICK! ')
        if(gameOver) return;
        if(gameBoard.getSquare(squareIndex) == null)
        {
            gameBoard.setSquare(squareIndex, _getTurn());
            displayController.displayBoard(gameBoard.getGameBoard());

            _checkWin(squareIndex);
            if(gameOver) return;
            _checkTie()
            if(gameOver) return;
            _nextTurn();
        }
        else
        {
            console.log("Tile is already marked!");
        }
    }

    //Game Init.
    console.log(getAIMode());

    document.getElementById('restart').addEventListener('click', restart);
    document.getElementById('ai-mode').addEventListener('click', _toggleAIMode);

    return {input, restart, getAIMode};
})();

game.restart();