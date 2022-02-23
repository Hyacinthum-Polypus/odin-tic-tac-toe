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

    return {displayBoard};
})();

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
                else if(getGameBoard(2) == marker && getSquare(6) == marker)
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

    const _playerFactory = ((name, marker) =>
    {
        const getName = () => {return name};
        const setName = (newName) => {name = newName};
        const getMarker = () => {return marker};
        return {getName, setName, getMarker};
    });

    const playerX = _playerFactory("Player X", "X");
    const playerO = _playerFactory("Player O", "O");

    let turn = playerX.getMarker();

    const _getTurn = () =>
    {
        return turn;
    }

    const _nextTurn = () =>
    {
        turn = turn == playerX.getMarker() ? playerO.getMarker() : playerX.getMarker();
    }

    const _checkWin = square =>
    {
        if(gameBoard.checkRow(_getTurn(), square))
        {
            console.log(`Player ${_getTurn()} has won.`);
        }
        else
        {
            console.log(`Player ${_getTurn()} has not won yet.`);
        }
    }

    const _checkTie = () =>
    {
        if(gameBoard.hasEmptySpace())
        {
            console.log('The game has not tied');
        }
        else
        {
            console.log('The game has tied!');
        }
    }

    const input = (squareIndex) =>
    {
        console.log('CLICK!')
        if(gameBoard.getSquare(squareIndex) == null)
        {
            gameBoard.setSquare(squareIndex, _getTurn());
            _checkWin(squareIndex);
            _checkTie()
            _nextTurn();
            displayController.displayBoard(gameBoard.getGameBoard());
        }
        else
        {
            console.log("Tile is already marked!");
        }
    }

    //Init!
    displayController.displayBoard(gameBoard.getGameBoard());

    return {input};
})();



