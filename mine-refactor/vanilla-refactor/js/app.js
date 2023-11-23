import { Store } from "./store.js";
import { View } from "./view.js";

const players = [
  {
    id: 1,
    name: "Player 1",
    icon: "fa-x",
    color: "turquoise",
  },
  {
    id: 2,
    name: "Player 2",
    icon: "fa-o",
    color: "yellow",
  },
];

function initView(view, store) {
  view.initMove(store.moves);
  view.updateScore(store.wins.wins[0], store.wins.wins[1], store.wins.ties);
  view.setTurnIndicator(store.currentPlayer);
}

/**
 * The is the C part of MVC pattern.
 */
function init() {
  const view = new View();
  const store = new Store(players, "game-history");

  initView(view, store);

  window.addEventListener("storage", () => {
    view.clearMoves();
    view.closeModal();
    initView(view, store);
    if (store.winner.isCompleted) {
      view.openModal(`${store.winner.winner.name} wins!`);
    }
  });

  view.bindMenuBtn(() => view.toggleMenu());
  view.bindRstBtn(() => {
    store.reset();
    view.toggleMenu();
    view.clearMoves();
    view.setTurnIndicator(store.currentPlayer);
  });
  view.bindNewRoundBtn(() => {
    store.newRound();
    view.updateScore(store.wins.wins[0], store.wins.wins[1], store.wins.ties);
    view.toggleMenu();
    view.clearMoves();
    view.setTurnIndicator(store.currentPlayer);
  });

  view.bindPlayerMove((square) => {
    const existing = store.moves.some((move) => move.squareId === +square.id);
    if (existing) return;

    view.playerMove(square, store.currentPlayer);

    store.playerMove(+square.id, store.currentPlayer);

    const { isCompleted, winner } = store.winner;
    if (isCompleted) {
      if (winner) view.openModal(`${winner.name} wins!`);
      else view.openModal(`Tie!`);
      return;
    }

    view.setTurnIndicator(store.currentPlayer);
  });

  view.bindModalBtn(() => {
    store.update();
    view.updateScore(store.wins.wins[0], store.wins.wins[1], store.wins.ties);
    view.closeModal();
    view.clearMoves();
    view.setTurnIndicator(store.currentPlayer);
  });
}

window.addEventListener("load", init);
