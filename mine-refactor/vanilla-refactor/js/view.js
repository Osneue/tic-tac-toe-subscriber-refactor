/**
 * The store class is reponsible for the V part of MVC parttern.
 */

export class View {
  $ = {};
  $$ = {};

  constructor() {
    // Single elements
    this.$.menu = this.#qs('[data-id="menu"]');
    this.$.menuBtn = this.#qs('[data-id="menu-btn"]');
    this.$.menuItems = this.#qs('[data-id="menu-items"]');
    this.$.resetBtn = this.#qs('[data-id="reset-btn"]');
    this.$.newRoundBtn = this.#qs('[data-id="new-round-btn"]');
    this.$.modal = this.#qs('[data-id="modal"]');
    this.$.modalText = this.#qs('[data-id="modal-text"]');
    this.$.modalBtn = this.#qs('[data-id="modal-btn"]');
    this.$.turn = this.#qs('[data-id="turn"]');
    this.$.p1Wins = this.#qs('[data-id="p1-wins"]');
    this.$.p2Wins = this.#qs('[data-id="p2-wins"]');
    this.$.ties = this.#qs('[data-id="ties"]');
    this.$.grid = this.#qs('[data-id="grid"]');

    // Element lists
    this.$$.squares = this.#qsAll('[data-id="square"]');
  }

  bindMenuBtn(handler) {
    this.$.menuBtn.addEventListener("click", handler);
  }

  bindRstBtn(handler) {
    this.$.resetBtn.addEventListener("click", handler);
  }

  bindNewRoundBtn(handler) {
    this.$.newRoundBtn.addEventListener("click", handler);
  }

  bindModalBtn(handler) {
    this.$.modalBtn.addEventListener("click", handler);
  }

  bindPlayerMove(handler) {
    this.$$.squares.forEach((square) => {
      square.addEventListener("click", () => handler(square));
    });
  }

  toggleMenu() {
    this.$.menuItems.classList.toggle("hidden");
  }

  setTurnIndicator(player) {
    this.$.turn.replaceChildren();
    const icon = document.createElement("i");
    const text = document.createElement("p");
    icon.classList.add("fa-solid", player.icon, player.color);
    text.innerText = `${player.name}, you're up!`;
    text.classList.add(player.color);
    this.$.turn.append(icon, text);
  }

  playerMove(square, player) {
    const icon = document.createElement("i");

    icon.classList.add("fa-solid", player.icon, player.color);

    square.replaceChildren(icon);
  }

  initMove(moves) {
    this.$$.squares.forEach((square) => {
      const player = moves.find((move) => move.squareId === +square.id)?.player;
      if (player) this.playerMove(square, player);
    });
  }

  clearMoves() {
    this.$$.squares.forEach((square) => square.replaceChildren());
  }

  openModal(str) {
    this.$.modalText.innerText = str;
    this.$.modal.classList.remove("hidden");
  }

  closeModal(str) {
    this.$.modal.classList.add("hidden");
  }

  updateScore(p1Wins, p2Wins, ties) {
    this.$.p1Wins.innerText = `${p1Wins} Wins`;
    this.$.p2Wins.innerText = `${p2Wins} Wins`;
    this.$.ties.innerText = `${ties} Wins`;
  }

  #qs(selector) {
    const elem = document.querySelector(selector);
    if (!elem) throw new Error(`Element not found: ${selector}`);
    return elem;
  }

  #qsAll(selector) {
    const elems = document.querySelectorAll(selector);
    if (!elems) throw new Error(`Elements not found: ${selector}`);
    return elems;
  }
}
