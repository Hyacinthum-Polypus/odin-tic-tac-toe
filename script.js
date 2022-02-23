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
        const _indexError = () => {console.log("Invalid index! Only indexes 0-8")};

        const getGameBoard = () => {return gameBoardArray};
        const clearGameBoard = () => {gameBoardArray.forEach(square => square = null)};
        const getSquare = (index) => {if(_isValidIndex(index)) { return gameBoardArray[index]} else {_indexError()}};
        const setSquare = (index, marker) => {if(_isValidIndex(index)) {gameBoardArray[index] = marker; return gameBoardArray[index]} else {_indexError()}};

        return {getGameBoard, clearGameBoard, getSquare, setSquare};
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

    let turn = 'X';

    const getTurn = () =>
    {
        return turn;
    }

    const nextTurn = () =>
    {
        turn = turn == 'X' ? 'O' : 'X';
    }

    const input = (squareIndex) =>
    {
        console.log('CLICK!')
        if(gameBoard.getSquare(squareIndex) == null)
        {
            gameBoard.setSquare(squareIndex, getTurn());
            nextTurn();
            displayController.displayBoard(gameBoard.getGameBoard());
        }
        else
        {
            console.log("Tile is already marked!");
        }
    }

    displayController.displayBoard(gameBoard.getGameBoard());

    return {input};
})();



