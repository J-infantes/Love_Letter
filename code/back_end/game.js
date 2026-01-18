// game.js
import { Player, Deck, DiscardPile } from './player.js';
import { IASimple, IADifficult } from './ai.js';
import * as ui from './affichage.js';//+ rapide à écrire
import * as ui_ia from './affichage_ia.js';

class Game {
    #players = [];
    #deck = null;
    current_player = 0;
    discard_pile = new DiscardPile();
    difficulty = 0;

    constructor(num_players, difficulty = 0) {
        this.#deck = new Deck();
        this.difficulty = difficulty;
        this.#players.push(new Player(this.#deck, this.discard_pile));
        for (let i = 1; i < num_players; i++) {
            if (difficulty === 0) this.#players.push(new IASimple(this.#deck, this.discard_pile));
            else this.#players.push(new IADifficult(this.#deck, this.discard_pile));
        }

    }

    new_round() {
        ui.log("Nouvelle manche !");


        this.#players.forEach(player => {
            while (player.currentcard.length) {
                player.discard(player.currentcard.pop());
            }
            while (player.equiped_card.length) {
                player.equiped_card.pop();
            }
            player.iseliminated = false;
        });

        this.#players.forEach((p, i) => {
            if (i === 0) ui.retirerEspionneHumain(i);
            ui.retirerServanteIA(i);
            ui.retirerEspionneIA(i);
        });

        this.#deck = new Deck();

        this.#players.forEach(player => {
            const card = this.#deck.draw();
            if (card) player.currentcard.push(card);
        });


        const human = this.#players[0];
        const extraCard = this.#deck.draw();
        if (extraCard) human.currentcard.push(extraCard);


        ui.updateDeckCount(this.#deck.taille());
        ui.renderPlayerHand(human.currentcard);

        this.#players.forEach((p, i) => {
            if (i === 0) return;
            ui.updateCard(p.currentcard.map(c => c.type), i);
        });


        this.current_player = 0;
    }

    restart() {

        this.#players.forEach(player => {
            while (player.currentcard.length) player.discard(player.currentcard.pop());
            while (player.equiped_card.length) player.equiped_card.pop();
        });

        const game = new Game(this.#players.length, this.difficulty);
        game.start();
    }



    async nextTurn() {

        if (this.#players[0].iseliminated) {
            window.restartGame = () => {
                const game = new Game(this.#players.length, this.difficulty);
                game.start();
            };
            ui.afficherFin("Tu as été éliminé !");
            return; // stop le tour si le joueur humain est éliminé
        }

        const alive = this.#players.filter(p => !p.iseliminated);
        if (this.#deck.taille() === 0 || alive.length <= 1) {


            let max = -1;
            let winner = null;
            alive.forEach(p => {
                const cardValue = p.currentcard[0]?.type ?? -1;
                if (cardValue > max) {
                    max = cardValue;
                    winner = p;
                }
            });

            if (winner) winner.points += 1;

            const has_espionne = [];

            this.#players.forEach(player => {
                if (player.iseliminated) return;

                for (let i = 0; i < player.equiped_card.length; i++) {
                    if (
                        player.equiped_card[i].type === 0 &&
                        !has_espionne.includes(player)
                    ) {
                        has_espionne.push(player);
                    }
                }
            });

            if (has_espionne.length === 1) {
                has_espionne[0].points += 1;
            }

            const winnerCard = winner.currentcard[0]; // carte du gagnant pour affichage
            const cardName = winnerCard ? ui.nomCarte(winnerCard.type) : "aucune carte";

            let message = "";
            if (winner === this.#players[0]) {
                message = `Vous gagnez la manche avec ${cardName} !`;
            } else {
                message = `${ui.nomJoueur(this.#players.indexOf(winner))} gagne la manche avec ${cardName} !`;
            }


            message += "<br><br><strong>Scores :</strong><br>";
            this.#players.forEach((p, i) => {
                message += `${ui.nomJoueur(i)} : ${p.points} point(s)<br>`;
            });


            ui.afficherFin(message);


            window.restartGame = () => {
                this.new_round();
                this.start();
            };

            return;
        }

        // boucle pour trouver un joueur vivant
        let currentPlayer = this.#players[this.current_player];
        while (currentPlayer.iseliminated) {
            this.current_player = (this.current_player + 1) % this.#players.length;
            currentPlayer = this.#players[this.current_player];
        }

        ui_ia.AfficherJoueurActuel(this.current_player);
        ui.log(`--- Tour de ${ui.nomJoueur(this.current_player)} ---`);

        currentPlayer.draw();
        ui.updateDeckCount(this.#deck.taille());
        ui.log(`${ui.nomJoueur(this.current_player)} pioche une carte`);

        //On enleve les cartes equipees du joueur humain
        if (currentPlayer.equiped_card.some(c => c.type === 4)) {

            if (this.current_player === 0) ui.retirerServanteHumain();
            else ui.retirerServanteIA(this.current_player);
        }
        if (currentPlayer.iseliminated) {
            if (this.current_player === 0) ui.retirerEspionneHumain();
            else ui_ia.retirerEspionneIA(this.current_player);
        }

        // FONCTIONNEMENT POUR LES IA
        if (currentPlayer instanceof IASimple || currentPlayer instanceof IADifficult) {
            await wait(1000); // temps de réflexion IA necessaire parce que sinon ça passe trop vite, le joueur comprend pas ce qui se passe

            const playedCard = currentPlayer.play();
            ui.log(
                `${ui.nomJoueur(this.current_player)} joue ${ui.nomCarte(playedCard.type)}`
            );

            if (!playedCard) {
                console.warn("IA sans action possible, passe son tour");
                this.current_player = (this.current_player + 1) % this.#players.length;
                await this.nextTurn();
                return;
            }

            if (currentPlayer instanceof IASimple || currentPlayer instanceof IADifficult) {
                ui.retirerServanteIA(this.current_player);
            }



            switch (playedCard.type) {

                case 0:
                    playedCard.activate(currentPlayer, null);
                    ui.afficherEspionneIA(this.current_player);
                    break;


                case 4:
                    playedCard.activate(currentPlayer, null);
                    ui.afficherServanteIA(this.current_player);
                    break;

                case 2: {
                    const target = currentPlayer.pretre(this.#players);
                    if (target) {
                        playedCard.activate(currentPlayer, target);
                        await ui.afficherCartePretre(target.currentcard[0]);
                        ui.log(`→ regarde la main de ${ui.nomJoueur(this.#players.indexOf(target))}`);
                    }
                    break;
                }


                case 3: {
                    const target = currentPlayer.baron(this.#players);

                    if (!target) {
                        console.warn("Pas de cible disponible pour le Baron, tour passé");
                        break;
                    }

                    const cardRestante = currentPlayer.currentcard.find(c => c !== playedCard);

                    const cardCible = target.currentcard[0];

                    // Vérifier que les deux cartes existent avant d'afficher le duel
                    if (!cardRestante || !cardCible) {
                        console.warn("Un des joueurs n'a pas de carte pour le Baron, on applique directement l'effet");
                        playedCard.activate(currentPlayer, target);
                    } else {

                        await ui.afficherDuelBaron({
                            joueurA: currentPlayer,
                            carteA: cardRestante,
                            joueurB: target,
                            carteB: cardCible
                        });


                        playedCard.activate(currentPlayer, target);
                    }

                    break;
                }

                case 5: {
                    const target = currentPlayer.prince(this.#players);
                    if (target) {
                        playedCard.activate(currentPlayer, target);
                        ui.log(`→ force ${ui.nomJoueur(this.#players.indexOf(target))} à défausser`);
                    }
                    break;
                }


                case 7: {
                    const target = currentPlayer.roi(this.#players);
                    if (target) {
                        playedCard.activate(currentPlayer, target);
                        ui.log(`→ échange avec ${ui.nomJoueur(this.#players.indexOf(target))}`);
                    }
                    break;
                }

                case 1: {
                    const [target, guess] = currentPlayer.garde(this.#players);
                    if (target) {
                        playedCard.activate(currentPlayer, target, guess);
                        ui.log(`→ devine ${ui.nomCarte(guess)} sur ${ui.nomJoueur(this.#players.indexOf(target))}`);
                    }
                    break;
                }


                default:
                    playedCard.activate(currentPlayer, null);
            }

            this.afterCardPlayed(playedCard);

            await wait(500);

            this.current_player = (this.current_player + 1) % this.#players.length;
            await this.nextTurn();
        }
        // FONCTIONNEMENT JOUEUR HUAMIN
        else {
            ui.renderPlayerHand(currentPlayer.currentcard, async (selectedCard) => {

                // GARDE
                if (selectedCard.type === 1) {
                    const target = await ui_ia.choisirCibleIA(this.#players);
                    ui.log(`→ cible : ${ui.nomJoueur(this.#players.indexOf(target))}`);
                    const guess = await ui_ia.choisirCarteGarde();
                    ui.log(`→ devine : ${ui.nomCarte(guess)}`);


                    selectedCard.activate(currentPlayer, target, guess);
                    if (target.iseliminated) {
                        ui.log(`💀 ${ui.nomJoueur(this.#players.indexOf(target))} est éliminé`);
                    }
                }
                //PRETRE
                else if (selectedCard.type === 2) {

                    const target = await ui_ia.choisirCibleIA(this.#players);
                    if (!target) return;

                    //On enregistre la carte avant activation sinon ça plante à l'activation après affichage (c'est pareil pour le baron ..)
                    const carteVue = target.currentcard[0];
                    currentPlayer.discard(selectedCard);
                    selectedCard.activate(currentPlayer, target);

                    await ui.afficherCartePretre(carteVue);
                    ui.log(
                        `${ui.nomJoueur(this.current_player)} regarde la main de ${ui.nomJoueur(this.#players.indexOf(target))}`
                    );


                    ui.updateCard(currentPlayer.currentcard.map(c => c.type));
                    ui.renderPlayerHand(currentPlayer.currentcard, async (selectedCard) => {

                    });
                }

                // BARON
                else if (selectedCard.type === 3) {
                    const target = await ui_ia.choisirCibleIA(this.#players);

                    // On enregistre les cartes avant activation sinon ça plante à l'activation après affichage
                    const cardRestante = currentPlayer.currentcard.find(c => c !== selectedCard);
                    const cardCible = target.currentcard[0]; // la carte de la cible


                    await ui.afficherDuelBaron({
                        joueurA: currentPlayer,
                        carteA: cardRestante,
                        joueurB: target,
                        carteB: cardCible
                    });


                    selectedCard.activate(currentPlayer, target);
                }

                else if (selectedCard.type === 0) {
                    ui.afficherEspionneHumain();
                    selectedCard.activate(currentPlayer, null);
                    ui.log(
                        `${ui.nomJoueur(this.current_player)} pose une Espionne`
                    );

                }

                // SERVANTE
                else if (selectedCard.type === 4) {
                    ui.afficherServanteHumain();
                    selectedCard.activate(currentPlayer, null);
                    ui.log(
                        `${ui.nomJoueur(this.current_player)} se protège avec la Servante`
                    );

                }
                //PRINCE
                else if (selectedCard.type === 5) {
                    const target = await ui_ia.choisirCiblePrince(this.#players, this.current_player);
                    if (!target) return;

                    ui.log(`${ui.nomJoueur(this.current_player)} joue le Prince sur ${ui.nomJoueur(this.#players.indexOf(target))}`);


                    currentPlayer.discard(selectedCard); // la met dans la défausse
                    currentPlayer.currentcard.splice(currentPlayer.currentcard.indexOf(selectedCard), 1);
                    ui.updateDeckCount(this.#deck.taille());
                    if (currentPlayer === this.#players[0]) ui.renderPlayerHand(currentPlayer.currentcard);


                    selectedCard.activate(currentPlayer, target);


                    if (target.currentcard.length > 0) {
                        const defausse = target.currentcard.pop();
                        if (defausse) {
                            target.discard(defausse);
                            ui.log(`${ui.nomJoueur(this.#players.indexOf(target))} défausse ${ui.nomCarte(defausse.type)}`);


                            if (defausse.type === 9) {
                                target.iseliminated = true;
                                ui.log(`${ui.nomJoueur(this.#players.indexOf(target))} est éliminé !`);
                            }
                        }
                    }


                    if (!target.iseliminated) {
                        const card = this.#deck.draw();
                        if (card) {
                            target.currentcard.push(card);
                            if (target === this.#players[0]) ui.renderPlayerHand(target.currentcard);
                            ui.updateDeckCount(this.#deck.taille());
                        }
                    }


                    if (target !== currentPlayer) {
                        await this.nextTurn();
                    }
                }


                //CHANCELIER 
                else if (selectedCard.type === 6) {

                    currentPlayer.discard(selectedCard);
                    ui.updateDeckCount(this.#deck.taille());
                    ui.log(`${ui.nomJoueur(this.current_player)} joue le Chancelier`);


                    const nbCartes = Math.min(2, this.#deck.taille());
                    for (let i = 0; i < nbCartes; i++) {
                        const card = currentPlayer.draw();
                        if (card) ui.updateDeckCount(this.#deck.taille());
                    }


                    if (currentPlayer.currentcard.length > 1) {

                        const cartesSousPioche = await ui.choisirChancelier(currentPlayer.currentcard);


                        cartesSousPioche.forEach(c => {
                            const index = currentPlayer.currentcard.indexOf(c);
                            if (index !== -1) {
                                currentPlayer.currentcard.splice(index, 1);
                                currentPlayer.putback(c);
                            }
                        });

                        ui.log(`Cartes remises sous la pioche dans l'ordre choisi`);
                    }


                    ui.renderPlayerHand(currentPlayer.currentcard, async (selectedCard) => {
                        await this.nextTurn();
                    });
                }
                //ROI
                else if (selectedCard.type === 7) {
                    currentPlayer.discard(selectedCard);
                    ui.log(`${ui.nomJoueur(this.current_player)} joue le Roi`);

                    const target = await ui_ia.choisirCibleIA(this.#players);

                    if (!target) return;


                    const playerCard = currentPlayer.currentcard[0];
                    const targetCard = target.currentcard[0];

                    currentPlayer.currentcard[0] = targetCard;
                    target.currentcard[0] = playerCard;

                    // Mise à jour UI
                    ui.updateCard(currentPlayer.currentcard.map(c => c.type));
                    ui.updateCard(target.currentcard.map(c => c.type), target.index);

                    ui.log(`${ui.nomJoueur(this.current_player)} échange sa carte avec ${ui.nomJoueur(target.index)}`);
                }



                //PRINCESSE
                else if (selectedCard.type === 9) {
                    currentPlayer.discard(selectedCard);
                    ui.log(`${ui.nomJoueur(this.current_player)} a défaussé la Princesse et est éliminé !`);
                    currentPlayer.eliminated = true;
                    ui.updateCard(currentPlayer.currentcard.map(c => c.type));
                }



                // AUTRES CARTES
                else {
                    selectedCard.activate(currentPlayer, null);
                }

                this.afterCardPlayed(selectedCard);

                await wait(500);
                this.current_player = (this.current_player + 1) % this.#players.length;

                await this.nextTurn();
            });

        }
    }

    async start() {
        ui.updateDeckCount(this.#deck.taille());
        this.current_player = 0;
        await this.nextTurn();
    }

    afterCardPlayed(card) {
        const currentPlayer = this.#players[this.current_player];

        if (this.current_player === 0) {
            ui.renderPlayerHand(currentPlayer.currentcard, () => { });
        }

        ui.updateCard(currentPlayer.currentcard.map(c => c.type));

        const lastCard = this.discard_pile.getlast();
        if (lastCard) ui.playCard(lastCard);

        ui_ia.AfficherJoueurMort(this.#players);
    }




}
function wait(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

export { Game };

window.game = new Game(5, 0);
window.game.start();

// BOUTON RESTART //marche pas encore parfaitement
document.addEventListener("DOMContentLoaded", () => {
    const restartBtn = document.querySelector("#restart-button button");

    if (restartBtn) {
        restartBtn.addEventListener("click", () => {
            if (game) {
                game.restart();
            } else {
                console.warn("Aucune instance de Game trouvée !");
            }
        });
    }
});

