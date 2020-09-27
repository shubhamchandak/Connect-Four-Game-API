class Game {

    player1_moves;
    player2_moves;
    current_player;
    result;
    winner;
    game_status;
    matrix;

    constructor() {
        this.yellow_moves = [];
        this.red_moves = [];
        this.current_player = true;
        this.game_status = "ACTIVE";
        this.result = null;
        this.winner = null;
        this.matrix = [
            [0,0,0,0,0,0,0],
            [0,0,0,0,0,0,0],
            [0,0,0,0,0,0,0],
            [0,0,0,0,0,0,0],
            [0,0,0,0,0,0,0],
            [0,0,0,0,0,0,0]
        ];
    }
}
module.exports = Game;