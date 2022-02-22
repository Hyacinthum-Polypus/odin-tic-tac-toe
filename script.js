const Game = (() => {
    const GameBoard = (() => 
    {
    let gameBoard = [null, null, null, null, null, null, null, null, null];

    const _isValidIndex = (index) => {return (index >= 0 && index < 9)};
    const _indexError = () => {console.log("Invalid index! Only indexes 0-8")};

    const getGameBoard = () => {return gameBoard};
    const clearGameBoard = () => {gameBoard.forEach(square => square = null)};
    const getSquare = (index) => {if(_isValidIndex(index)) { return gameBoard[index]} else {_indexError()}};
    const setSquare = (index, marker) => {if(_isValidIndex(index)) {gameBoard[index] = marker; return gameBoard[index]} else {_indexError()}};

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


    return {playerX, playerO};
})();




