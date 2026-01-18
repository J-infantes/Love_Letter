
class Card {
    #_type;
    constructor(type) { this.#_type = type; }
    get type() { return this.#_type; }


    activate(player_played, player_attacked = null, guess = 0) {
        switch (this.#_type) {
            case 0:
                player_played.delete(this);
                player_played.equiped_card.push(this);
                break;

            case 1:
                player_played.discard(this);
                if (
                    player_attacked &&
                    player_attacked.currentcard[0] && //sécurité rajoutée pour le garde parce que ça bugait
                    player_attacked.currentcard[0].type === guess
                ) {
                    player_attacked.discard();
                }
                break;

            case 2:
                player_played.discard(this);
                if (player_played.retourpretre && player_attacked?.currentcard[0]) {
                    player_played.retourpretre(player_attacked.currentcard[0].type);
                }
                break;

            case 3:
                player_played.discard(this);
                if (player_attacked) {
                    const playedType = player_played.currentcard[0]?.type ?? -1;
                    const attackedType = player_attacked.currentcard[0]?.type ?? -1;

                    if (playedType > attackedType && player_attacked.currentcard[0]) player_attacked.discard();
                    else if (playedType < attackedType && player_played.currentcard[0]) player_played.discard();
                    // si égalité il se passe rien comme dans les regles
                }
                break;

            case 4:
                player_played.delete(this);
                player_played.equiped_card.push(this);
                break;

            case 5:
                player_played.discard(this);
                if (player_attacked && player_attacked.currentcard[0]) {
                    player_attacked.discard();
                    if (!player_attacked.iseliminated) player_attacked.draw();
                }
                break;

            case 6:
                player_played.discard(this);
                const nbToDraw = player_played.deck.taille();
                if (nbToDraw > 1) {
                    player_played.draw();
                    player_played.draw();
                } else if (nbToDraw === 1) {
                    player_played.draw();
                }

                if (player_played.currentcard.length === 1) {
                    player_played.putback();
                } else if (player_played.chancelier) {
                    const cards = player_played.chancelier();
                    if (cards?.[0]) player_played.putback(cards[0]);
                    if (cards?.[1]) player_played.putback(cards[1]);
                }
                break;

            case 7:
                player_played.discard(this);
                if (player_attacked) {
                    const temp = player_attacked.currentcard[0];
                    if (temp && player_played.currentcard[0]) {
                        player_attacked.currentcard[0] = player_played.currentcard[0];
                        player_played.currentcard[0] = temp;
                    }
                }
                break;

            case 8:
                player_played.discard(this);
                break;

            case 9:
                player_played.discard(this);
                break;
        }
    }

}


class Deck {
    #cards = [];
    constructor() {
        const types = [0, 0, 1, 1, 1, 1, 1, 1, 2, 2, 3, 3, 4, 4, 5, 5, 6, 6, 7, 8, 9];
        this.#cards = types.map(t => new Card(t)).sort(() => Math.random() - 0.5);
    }
    draw() { return this.#cards.pop(); }
    putback(card) { this.#cards.unshift(card); }
    taille() { return this.#cards.length; }

}


class DiscardPile {
    #cards = [];
    add(card) { this.#cards.push(card); }
    getlast() { return this.#cards[this.#cards.length - 1]; }
}


class Player {
    #current_card = [];
    equiped_card = [];
    iseliminated = false;
    points = 0;
    deck = null;
    discard_pile = null;

    constructor(deck, discard_pile) {
        this.deck = deck;
        this.discard_pile = discard_pile;
        this.#current_card.push(deck.draw());
    }

    get currentcard() { return this.#current_card; }

    draw() { this.#current_card.push(this.deck.draw()); }

    discard(card = null) {
        if (!card) card = this.#current_card[0];
        const idx = this.#current_card.indexOf(card);
        if (idx > -1) this.#current_card.splice(idx, 1);
        this.discard_pile.add(card);
        if (card.type === 9) this.iseliminated = true;
        if (this.#current_card.length === 0) this.iseliminated = true;
    }

    putback(card = null) {
        if (!card) card = this.#current_card[0];
        const idx = this.#current_card.indexOf(card);
        if (idx > -1) this.#current_card.splice(idx, 1);
        this.deck.putback(card);
        if (this.#current_card.length === 0) this.iseliminated = true;
    }

    delete(card) {
        const idx = this.#current_card.indexOf(card);
        if (idx > -1) this.#current_card.splice(idx, 1);
    }

    servante() {
        for (let i = 0; i < this.equiped_card.length; i++) {
            if (this.equiped_card[i].type === 4) {
                this.discard_pile.add(this.equiped_card[i]);
                this.equiped_card.splice(i, 1);
                break;
            }
        }
    }
    resetForNewRound() {
        this.#current_card = [];
        this.equiped_card = [];
    }
}

export { Card, Deck, Player, DiscardPile };
