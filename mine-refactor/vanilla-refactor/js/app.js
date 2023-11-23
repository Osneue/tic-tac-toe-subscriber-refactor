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

/**
 * The is the C part of MVC pattern.
 */
function init() {
  const view = new View();
  const store = new Store(players, "game-history");

  view.render(store.currentPlayer, store.moves, store.wins, store.winner);

  store.addEventListener("state-change", () => {
    view.render(store.currentPlayer, store.moves, store.wins, store.winner);
  });

  window.addEventListener("storage", () => {
    view.render(store.currentPlayer, store.moves, store.wins, store.winner);
  });

  view.bindMenuBtn(() => view.toggleMenu());

  view.bindRstBtn(() => {
    store.reset();
  });
  view.bindNewRoundBtn(() => {
    store.newRound();
  });

  view.bindPlayerMove((square) => {
    const existing = store.moves.some((move) => move.squareId === +square.id);
    if (existing) return;

    store.playerMove(+square.id, store.currentPlayer);
  });

  view.bindModalBtn(() => {
    store.update();
  });
}

window.addEventListener("load", init);
