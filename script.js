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

        const playerOInput = document.createElement('input');
        playerOInput.setAttribute('type', 'text');
        playerOInput.setAttribute('value', playerO.getName());
        playerOElement.appendChild(playerOInput);
        playerOInput.addEventListener('input', e => playerO.setName(playerOInput.value));
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
        const clearGameBoard = () => {gameBoardArray.forEach(square => square = null)};
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
        };
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
        };

        return {getGameBoard, clearGameBoard, getSquare, setSquare, checkRow, hasEmptySpace};
    })();

    let turn = playerX.getMarker();
    let gameOver = false;

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

    const input = squareIndex =>
    {
        console.log('CLICK!')
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
    displayController.displayBoard(gameBoard.getGameBoard());
    displayController.displayPlayerNames();
    displayController.displayGameState(`It is ${playerX.getName()}'s turn`);

    return {input};
})();



