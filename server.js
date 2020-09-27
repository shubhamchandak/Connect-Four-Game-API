const express = require('express');
var bodyParser = require('body-parser')

const gameController = require("./controller/game");

const app = express();

app.listen(process.env.PORT || 3000);

app.use(bodyParser.json());

app.post("/play", (req, res, next) => {

    const column = req.body.column;
    const token = req.body.token;

    // if token is Active
    let tokenStatus = gameController.getTokenStatus(token);
    if (!token) {
        return res.status(400).json("Token not found");
    } else if(tokenStatus == "INACTIVE") {
        return res.status(404).json("No active game found! Please start a new game.")
    } else if(tokenStatus != "ACTIVE"){
        return res.status(400).json("Invalid token");
    }

    // if column is from 1 to 7
    if(column < 1 || column > 7) {
        return res.status(400).json("Invalid move! Kindly provide column number from 1 to 7 only.")
    }
        
    // if column is not full
    if(gameController.isColumnFull(token, column)) {
        return res.status(400).json("Invalid move! The column is already full. Please try again.")
    }

    const play = gameController.play(token, column);
    return res.json(play);
});

app.get("/start", (req, res, next) => {
    gameController.createNewGame(token => {
        res.json(token); 
        res.end();
    })
});

app.get("/moves/:token", (req, res, next) => {
    const token = req.params.token;
    if (gameController.getTokenStatus(token) == "ACTIVE" || gameController.getTokenStatus(token) == "INACTIVE") {
        game = gameController.getGameByToken(token);
        return res.json({
            "yellow_moves": game["yellow_moves"],
            "red_moves": game["red_moves"]
        });
    }
    else return res.json("TOKEN NOT VALID");
});

app.get("/gamedetails/:token", (req, res, next) => {
    const token = req.params.token;
    // if token is Active
    let tokenStatus = gameController.getTokenStatus(token);
    if (!token) {
        return res.status(400).json("Token not found");
    } else if(tokenStatus != "ACTIVE"){
        return res.status(400).json("Invalid token");
    }

    const game = gameController.getGameByToken(token);
    if(game["game_status"] != "ACTIVE") {
        game["current_player"] = null;
    } else {
        game["current_player"] = game["current_player"] ? "Yellow" : "Red";
    }
    return res.json(game);
});

app.get("/", (req, res, next) => {
    return res.json({
        "api_endpoints" : {
            "/start" : {
                "type" : "GET",
                "description": "start game and return token",
            },
            "/gamedetails/:{token}" : {
                "type" : "GET",
                "description": "get game details by token"
            },
            "/play" : {
                "type" : "POST",
                "description" : "make move and return the current status of the game(WIN/DRAW/NEXT_TURN)",
                "input" : {"token": "{token}", "column": "{column number 1-7}"}
            },
            "/moves/:{token}" : {
                "type" : "GET",
                "description" : "return the array of moves(column number) made by both the players till now"
            }
        }
    })
})