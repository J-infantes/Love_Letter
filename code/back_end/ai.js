import "./game.js";

//A CODER : se souvenir de PR
//A CODER : se souvenir des guess gardes (autres joueurs)

function getRandomInt(max) {
        max = Math.floor(max);
        return Math.floor(Math.random() * max);
    }

class ia extends player {
    cardsnotplayed = [0,0,1,1,1,1,1,1,2,2,3,3,4,4,5,5,6,6,7,8,9];
    remindC = null;
    remindG = [];
    remindPR = [];

    update(cardplayed, joueur){
        typeplayed = cardplayed.type();
        suppressed = false;
        let i = 0;
        while (suppressed == false){
            if (this.cardsnotplayed[i] == typeplayed){
                this.cardsnotplayed.splice(i, 1);
                suppressed = true;
            }
        }
        for (let j = 0; j < this.remindG.length; j++){
            if (this.remindG[j][0] == joueur){
                this.remindG.splice(j, 1);
            }
        }
        for (let j = 0; j < this.remindPR.length; j++){
            if (this.remindPR[j][0] == joueur && this.remindPR[j][1] == cardplayed.type()){
                this.remindPR.splice(j, 1);
            }
        }
        if (this.remindC != null){
            if (cardplayed.type() == 6 && joueur != me){
                this.remindC.push = [10];
            }
            if (super.deck.taille() == 3 && this.remindC.length == 2){
                this.remindPR.push = [joueur, this.remindC[1][0]];
            }
            if (super.deck.taille() == 2 && this.remindC.length == 2){
                this.remindPR.push = [joueur, this.remindC[1][1]];
            }
            if (super.deck.taille() == 1 && this.remindC.length == 1){
                this.remindPR.push = [joueur, this.remindC[0][0]];
            }
            if (super.deck.taille() == 0 && this.remindC.length == 1){
                this.remindPR.push = [joueur, this.remindC[0][1]];
            }
        }
    }

    retourpretre(typecard){
        this.remindPR[-1][1] = typecard;
    }

    play(){
        card1 = super.currentcard()[0];
        card2 = super.currentcard()[1];
        //Princesse
        if (card1.type() == 9){
            return card2;
        }

        //Comtesse
        else if (card1.type() == 8){
            if (card2.type() == 5 || card2.type() == 7 || card2.type() == 9){
                return card1;
            }
            else{
                return card2;
            }
        }

        //Roi
        else if (card1.type() == 7){
            if (card2.type() == 9){
                return card1;
            }
            else{
                return card2;
            }
        }

        //Chancelier
        else if (card1.type() == 6){
            if (card2.type() == 0 || card2.type() == 3 || card2.type() == 4 || super.deck.taille() <= 1){
                return card2;
            }
            else{
                return card1;
            }
        }

        //Prince
        else if (card1.type() == 5){
            if ((card2.type() == 7 || card2.type() == 9) && super.deck.taille() != 0){
                return card1;
            }
            else{
                return card2;
            }
        }

        //Servante
        else if (card1.type() == 4){
            return card1;
        }

        //Baron
        else if (card1.type() == 3){
            if (card2.type() == 0 || card2.type() == 1 || card2.type() == 2 || card2.type() == 4){
                return card2;
            }
            else{
                return card1;
            }
        }

        //Pretre
        else if (card1.type() == 2){
            if (card2.type() == 0 || card2.type() == 4 || card2.type() == 6){
                return card2;
            }
            else{
                return card1;
            }
        }

        //Garde
        else if (card1.type() == 1){
            if (card2.type() == 0 || card2.type() == 2 || card2.type() == 4 || card2.type() == 6){
                return card2;
            }
            else{
                return card1;
            }
        }

        //Espionne
        else if (card1.type() == 0){
            if (card2.type() == 4){
                return card2;
            }
            else{
                return card1;
            }
        }
    }
}

class iasimple extends ia {

    roi(joueurs){
        return this.attack(joueurs);
    }
    prince(joueurs){
        return this.attack(joueurs);
    }
    baron(joueurs){
        return this.attack(joueurs);
    }
    pretre(joueurs){
        return this.attack(joueurs);
    }
    garde(joueurs){
        return [this.attack(joueurs), this.guard()];
    }

    attack(joueurs){
        i = 0;
        protec = true;
        while (joueurs[i] == this || protec == true){
            protec = false;
            i = getRandomInt(joueurs.length);
            for (let j = 0; j < joueurs[i].equiped_card.length; j++){
                if (joueurs[i].equiped_card[j].type() == 4){
                    protec = true;
                }
            }
        }
        return joueurs[i];
    }

    guard(){
        r = 1;
        while (r == 1){
            r = getRandomInt(10);
        }
        return r;
    }

    //En cas de choix du chancelier, on prend la carte la plus haute ou l'espionne, mais aucune n'a priorité sur l'autre.
    chancelier(){
        if (super.currentcard().length == 3){
            card1 = super.currentcard()[0];
            card2 = super.currentcard()[1];
            card3 = super.currentcard()[2];
            if (card1.type() == 0 || card1.type() >= card2.type() && card1.type() >= card3.type()){
                return [card2, card3];
            }
            else if (card2.type() == 0 || card2.type() >= card1.type() && card2.type() >= card3.type()){
                return [card1, card3];
            }
            else if (card3.type() == 0 || card3.type() >= card1.type() && card3.type() >= card2.type()){
                return [card1, card2];
            }
        }
        else {
            //L'IA vient de s'autodétruire
            return super.currentcard();
        }
    }
}

class iadifficult extends ia {

    roi(joueurs){
        this.remindPR.push = [this.attack(joueurs), super.currentcard()[0].type()];
        return this.remindPR[-1][0];
    }
    prince(joueurs){
        return this.attack(joueurs);
    }
    baron(joueurs){
        return this.attack(joueurs);
    }
    pretre(joueurs){
        this.remindPR.push = [this.attack(joueurs), 10];
        return this.remindPR[-1][0];
    }
    garde(joueurs){
        this.remindG.push = [this.attack(joueurs), this.guard()];
        return this.remindG[-1];
    }

    attack(joueurs){
        // A adapter aux cartes
        cibles = [];
        for (let j = 0; j < joueurs.length; j++){
            for (let k = 0; k < joueurs[j].equiped_card.length; k++){
                if (joueurs[j].equiped_card[k].type() == 0 && joueurs[j] != this){
                    cibles.push(joueurs[j]);
                }
            }
            if (joueurs[j].points != 0 && joueurs[j] != this){
                cibles.push(joueurs[j]);
            }
        }


        if (cibles.length != 0){
            for (let e = 0; e < cibles.length; e++){
                servante = false;
                for (let r = 0; r < joueurs[e].equiped_card.length; r++){
                    if (joueurs[e].equiped_card[r].type() == 4){
                        servante = true;
                    }
                }
                if (servante == true){
                    cibles.splice(e, 1);
                }
            }
        }
        if (cibles.length == 0){
            cibles = joueurs;
        }

        i = 0;
        protec = true;
        while (cibles[i] == this || protec == true){
            protec = false;
            i = getRandomInt(cibles.length);
            for (let l = 0; l < cibles[i].equiped_card.length; l++){
                if (cibles[i].equiped_card[l].type() == 4){
                    protec = true;
                }
            }
        }
        return cibles[i];
    }

    guard(){

        guess = this.cardsnotplayed;
        mycard = super.currentcard()[0];
        suppressed = false;
        let g = 0;
        while (suppressed == false){
            if (guess[g] == mycard){
                guess.splice(g, 1);
                suppressed = true;
            }
        }

        onlyguards = true;
        for (let i = 0; i < guess.length; i++){
            if (guess[i]!=1){
                onlyguards = false;
            }
        }

        if (onlyguards == false){
            r = getRandomInt(guess.length);
            while (guess[r] == 1){
                r = getRandomInt(guess.length)
            }
            return guess[r];
        }
        else {
            r = 1;
            while (r == 1){
                r = getRandomInt(10);
            }
            return r;
        }
    }

    chancelier(){
        cards = super.currentcard();
        if (cards.length == 3){
            chosen_card = null;
            //Prise de la princesse
            for (let i = 0; i < 3; i++){
                if (cards[i] == 9){
                    chosen_card = cards[i];
                    cards.splice(i, 1);
                }
            }

            //Sinon, prise de l'espionne
            if (chosen_card == null){
                for (let i = 0; i < 3; i++){
                    if (cards[i] == 0){
                        chosen_card = cards[i];
                        cards.splice(i, 1);
                    }
                }
            }

            //Sinon, prise de la comtesse
            if (chosen_card == null){
                for (let i = 0; i < 3; i++){
                    if (cards[i] == 8){
                        chosen_card = cards[i];
                        cards.splice(i, 1);
                    }
                }
            }

            //Sinon, prise du roi
            if (chosen_card == null){
                for (let i = 0; i < 3; i++){
                    if (cards[i] == 7){
                        chosen_card = cards[i];
                        cards.splice(i, 1);
                    }
                }
            }
            
            //Sinon, prise de la carte la plus haute
            if (chosen_card == null){
                if (cards[0].type() >= cards[1].type() && cards[0].type() >= cards[2].type()){
                    chosen_card = cards[0];
                    cards.splice(0, 1);
                }
                else if (cards[1].type() >= cards[0].type() && cards[1].type() >= cards[2].type()){
                    chosen_card = cards[1];
                    cards.splice(1, 1);
                }
                else if (cards[2].type() >= cards[1].type() && cards[2].type() >= cards[0].type()){
                    chosen_card = cards[2];
                    cards.splice(2, 1);
                }
            }
            
            //Remise des cartes restantes
            this.remindC = cards;
        }
        return cards;
    }
}

export {ia, iasimple, iadifficult};
