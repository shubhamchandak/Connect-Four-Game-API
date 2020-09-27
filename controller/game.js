const fs = require('fs');
const path = require('path');

const dbPath = path.join(__dirname, "..", "database.json");
const Game = require("./../models/game");

exports.createNewGame = (cb) => {
    const token = Date.now();
    const data = require(dbPath);
    data[token] = new Game();
    fs.writeFile(dbPath, JSON.stringify(data), (err) => cb(token));
}

exports.getTokenStatus = (token) => {
    if(!token) return "Token not found!"
    const data = require(dbPath);
    if(data[token]) {
        return data[token]["game_status"];
    }
    return "Invalid token!";
}

exports.isColumnFull = (token, column) => {
    const data = require(dbPath);
    return data[token]["matrix"][0][column-1] != 0;
}

exports.play = (token, column) => {
    const data = require(dbPath);
    const game = data[token];
    let row;
    for(let i = 5; i >= 0; i--) {
        if(game["matrix"][i][column-1] == 0) {
            game["current_player"] = !game["current_player"];
            game["matrix"][i][column-1] = game["current_player"] ? "r" : "y";
            if(game["current_player"]) game["yellow_moves"].push(column); 
            else game["red_moves"].push(column);
            game["result"] = game["current_player"] ? "Yellow's turn next." : "Red's turn next";
            row = i;
            break;
        }
    }
    if(isWin(game["matrix"], row, column-1)) {
        game["winner"] = game["current_player"] ? "RED" : "YELLOW";
        game["game_status"] = "INACTIVE";
        game["result"] = game["current_player"] ? "Red wins" : "Yellow wins";
    } else if(isDraw(game["matrix"])) {
        game["game_status"] = "INACTIVE";
        game["result"] = "It is a draw!"
    }
    fs.writeFileSync(dbPath, JSON.stringify(data));
    return {status: game["result"], game: game["matrix"]};
}

exports.getGameByToken = (token) => {
    const data = require(dbPath);
    return data[token];
}

function isDraw(matrix) {
    for(let i = 0; i < 7; i++) if(matrix[0][i] == 0) return false;
    return true;
}

function isWin(matrix, I, J) {
    // check row
    for(let j = 1, counter = 1; j < 7; j++) {
        if(matrix[I][j] == matrix[I][j-1] && matrix[I][j] != 0) counter++;
        else counter = 1;
        if(counter == 4) return true;
    }

    // check column
    for(let i = 1, counter = 1; i < 6; i++) {
        if(matrix[i][J] == matrix[i-1][J] && matrix[i][J] != 0) counter++;
        else counter = 1;
        if(counter == 4) return true;
    }

    // check diagonals
    for(let i = I+7, j = J-7, counter = 1; i >= 0 && j < 7; i--, j++) {
        if(i < 5 && j > 0) {
            if(matrix[i][j] == matrix[i+1][j-1] && matrix[i][j] != 0) counter++;
            else counter = 1;
            if(counter == 4) return true;
        }
    }
    for(let i = I+7, j = J+7, counter = 1; i > 0 && j > 0; i--, j--) {
        if(i < 6 && j < 7) {
            if(matrix[i][j] == matrix[i-1][j-1] && matrix[i][j] != 0) counter++;
            else counter = 1;
            if(counter == 4) return true;
        }
    }
    return false;
}