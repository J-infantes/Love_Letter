// ai.js
import { Player } from './player.js';

function getRandomInt(max) {
    return Math.floor(Math.random() * Math.floor(max));
}


class IA extends Player {
    cardsnotplayed = [0, 0, 1, 1, 1, 1, 1, 1, 2, 2, 3, 3, 4, 4, 5, 5, 6, 6, 7, 8, 9];
    remindC = [];
    remindG = [];
    remindPR = [];

    update(cardplayed, joueur) {
        const typeplayed = cardplayed.type;


        const idx = this.cardsnotplayed.indexOf(typeplayed);
        if (idx > -1) this.cardsnotplayed.splice(idx, 1);


        this.remindG = this.remindG.filter(g => g[0] !== joueur);
        this.remindPR = this.remindPR.filter(pr => pr[0] !== joueur || pr[1] !== typeplayed);


        if (this.remindC.length > 0) {
            const deckSize = this.deck.taille();
            if (typeplayed === 6 && joueur !== this) this.remindC.push(10);
            if (deckSize === 3 && this.remindC.length === 2) this.remindPR.push([joueur, this.remindC[1]]);
            if (deckSize === 2 && this.remindC.length === 2) this.remindPR.push([joueur, this.remindC[1]]);
            if (deckSize === 1 && this.remindC.length === 1) this.remindPR.push([joueur, this.remindC[0]]);
            if (deckSize === 0 && this.remindC.length === 1) this.remindPR.push([joueur, this.remindC[0]]);
        }
    }

    retourpretre(typecard) {
        if (this.remindPR.length > 0) this.remindPR[this.remindPR.length - 1][1] = typecard;
    }

    play() {
        const cards = this.currentcard;
        if (!cards[0]) {
            console.warn("IA n'a pas de carte à jouer !");
            return null;
        }
        const card1 = cards[0];
        const card2 = cards[1];

        // Princesse
        if (card1.type === 9) return card2;

        // Comtesse
        if (card1.type === 8 && [5, 7, 9].includes(card2.type)) return card1;
        if (card1.type === 8) return card2;

        // Roi
        if (card1.type === 7 && card2.type === 9) return card1;
        if (card1.type === 7) return card2;

        // Chancelier
        if (card1.type === 6 && ([0, 3, 4].includes(card2.type) || this.deck.taille() <= 1)) return card2;
        if (card1.type === 6) return card1;

        // Prince
        if (card1.type === 5 && [7, 9].includes(card2.type) && this.deck.taille() !== 0) return card1;
        if (card1.type === 5) return card2;

        // Servante
        if (card1.type === 4) return card1;

        // Baron
        if (card1.type === 3 && [0, 1, 2, 4].includes(card2.type)) return card2;
        if (card1.type === 3) return card1;

        // Prêtre
        if (card1.type === 2 && [0, 4, 6].includes(card2.type)) return card2;
        if (card1.type === 2) return card1;

        // Garde
        if (card1.type === 1 && [0, 2, 4, 6].includes(card2.type)) return card2;
        if (card1.type === 1) return card1;

        // Espionne
        if (card1.type === 0 && card2.type === 4) return card2;
        return card1;
    }
}


class IASimple extends IA {
    roi(joueurs) { return this.attack(joueurs); }
    prince(joueurs) { return this.attack(joueurs); }
    baron(joueurs) { return this.attack(joueurs); }
    pretre(joueurs) { return this.attack(joueurs); }
    garde(joueurs) { return [this.attack(joueurs), this.guard()]; }

    attack(joueurs) {
        const ciblesValides = joueurs.filter(j =>
            j !== this &&
            !j.equiped_card.some(c => c.type === 4)
        );


        if (ciblesValides.length === 0) {
            return null;
        }

        return ciblesValides[getRandomInt(ciblesValides.length)];
    }


    guard() {
        let r = 1;
        while (r === 1) r = getRandomInt(10);
        return r;
    }

    chancelier() {
        const cards = this.currentcard.slice();
        if (cards.length !== 3) return cards;

        const [c1, c2, c3] = cards;
        if (c1.type === 0 || c1.type >= c2.type && c1.type >= c3.type) return [c2, c3];
        if (c2.type === 0 || c2.type >= c1.type && c2.type >= c3.type) return [c1, c3];
        if (c3.type === 0 || c3.type >= c1.type && c3.type >= c2.type) return [c1, c2];
        return [c1, c2];
    }
}


class IADifficult extends IA {
    roi(joueurs) {
        const cible = this.attack(joueurs);
        this.remindPR.push([cible, this.currentcard[0].type]);
        return cible;
    }
    prince(joueurs) { return this.attack(joueurs); }
    baron(joueurs) { return this.attack(joueurs); }
    pretre(joueurs) {
        const cible = this.attack(joueurs);
        this.remindPR.push([cible, 10]);
        return cible;
    }
    garde(joueurs) {
        const cible = this.attack(joueurs);
        const guess = this.guard();
        this.remindG.push([cible, guess]);
        return [cible, guess];
    }

    attack(joueurs) {
        let cibles = [];
        for (const j of joueurs) {
            if (j !== this && j.equiped_card.some(c => c.type === 0)) cibles.push(j);
            else if (j !== this && j.points !== 0) cibles.push(j);
        }
        if (cibles.length === 0) cibles = joueurs;

        let cible;
        do {
            cible = cibles[getRandomInt(cibles.length)];
        } while (cible === this || cible.equiped_card.some(c => c.type === 4));

        return cible;
    }

    guard() {
        let guess = [...this.cardsnotplayed];
        guess = guess.filter(g => g !== this.currentcard[0].type);
        let onlyguards = guess.every(g => g === 1);
        let r;
        if (!onlyguards) {
            do { r = guess[getRandomInt(guess.length)]; } while (r === 1);
        } else {
            do { r = getRandomInt(10); } while (r === 1);
        }
        return r;
    }

    chancelier() {
        const cards = [...this.currentcard];
        if (cards.length !== 3) return cards;

        let chosen = null;
        for (const t of [9, 0, 8, 7]) {
            const idx = cards.findIndex(c => c.type === t);
            if (idx !== -1) { chosen = cards[idx]; cards.splice(idx, 1); break; }
        }

        this.remindC = cards;
        return [chosen, ...cards];
    }
}

export { IA, IASimple, IADifficult };
