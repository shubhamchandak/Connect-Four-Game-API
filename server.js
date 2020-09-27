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
    if (!token || gameController.getTokenStatus(token) != "ACTIVE") {
        return res.json("TOKEN NOT VALID");
    }

    // if column is from 1 to 7
    if(column < 1 || column > 7) {
        return res.json("Invalid move! Kindly provide column number from 1 to 7 only.")
    }
        
    // if column is not full
    if(gameController.isColumnFull(token, column)) {
        return res.json("Invalid move! The column is already full.")
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

app.get("/", (req, res, next) => {
    return res.json({
        "api_endpoints" : {
            "/start" : {
                "type" : "GET",
                "description": "returns unique token",
            },
            "/play" : {
                "type" : "POST",
                "description" : "move is made by player and returns the status of game(WIN/DRAW/NEXT_TURN)",
                "input" : "token: {token}, column: {column number 1-7}"
            },
            "/moves/:{token}" : {
                "type" : "GET",
                "description" : "return the array of moves(column number) made by both the players till now"
            }
        }
    })
})