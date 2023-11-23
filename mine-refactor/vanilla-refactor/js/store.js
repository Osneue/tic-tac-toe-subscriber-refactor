/**
 * The store class is reponsible for the M part of MVC parttern.
 */

const INIT_STATE = {
  currentMoves: [],
  oldMoves: [],
};

export class Store extends EventTarget {
  players = [];
  key = "";

  constructor(players, key) {
    super();
    this.players = players;
    this.key = key;
  }

  get currentPlayer() {
    return this.players[this.#getState().currentMoves.length % 2];
  }

  get moves() {
    return this.#getState().currentMoves;
  }

  get winner() {
    return this.#getWinner(this.#getState().currentMoves);
  }

  get wins() {
    const winMap = this.#getState().oldMoves.map(
      (moves) => this.#getWinner(moves).winner?.id
    );
    const wins = this.players.map(
      (player) => winMap.filter((id) => id === player.id).length
    );
    const ties = this.#getState().oldMoves.length - wins[0] - wins[1];
    return {
      wins,
      ties,
    };
  }

  playerMove(squareId, player) {
    const move = {
      squareId,
      player,
    };

    const clone = structuredClone(this.#getState());
    clone.currentMoves.push(move);
    this.#setState(clone);
  }

  reset() {
    const clone = structuredClone(this.#getState());
    clone.currentMoves = [];
    this.#setState(clone);
  }

  update() {
    const clone = structuredClone(this.#getState());
    clone.oldMoves.push(clone.currentMoves);
    clone.currentMoves = [];
    this.#setState(clone);
  }

  newRound() {
    const clone = structuredClone(this.#getState());
    clone.currentMoves = [];
    clone.oldMoves = [];
    this.#setState(clone);
  }

  #getWinner(moves) {
    const winner = this.players.find((player) => {
      const isMatched = (playerPattern) => {
        const winningPatterns = [
          [1, 2, 3],
          [1, 5, 9],
          [1, 4, 7],
          [2, 5, 8],
          [3, 5, 7],
          [3, 6, 9],
          [4, 5, 6],
          [7, 8, 9],
        ];

        return winningPatterns.some((winningPattern) =>
          winningPattern.every((squareId) => playerPattern.includes(squareId))
        );
      };

      const playerPattern = moves
        .filter((move) => move.player.id === player.id)
        .map((move) => move.squareId);

      return isMatched(playerPattern);
    });

    if (winner)
      return {
        isCompleted: true,
        winner,
      };

    if (moves.length === 9)
      return {
        isCompleted: true,
        winner: null,
      };

    return {
      isCompleted: false,
      winner: null,
    };
  }

  #getState() {
    const history = window.localStorage.getItem(this.key);
    return history ? JSON.parse(history) : INIT_STATE;
  }

  #setState(newState) {
    window.localStorage.setItem(this.key, JSON.stringify(newState));
    this.dispatchEvent(new Event("state-change"));
  }
}
