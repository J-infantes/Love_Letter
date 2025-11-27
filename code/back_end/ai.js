function getRandomInt(max) {
    max = Math.floor(max);
    return Math.floor(Math.random() * max);
}

cardsnotplayed = [0,0,1,1,1,1,1,1,2,2,3,3,4,4,5,5,6,6,7,8,9]
function update(cardplayed){
    //A FINIR
}

function play(card1, card2){
    //Princesse
    if (card1.type() == 9){
        return card2;
    }

    //Comtesse
    if (card1.type() == 8){
        if (card2.type() == 5 || card2.type() == 7 || card2.type() == 9){
            return card1;
        }
        else{
            return card2;
        }
    }

    //Roi
    if (card1.type() == 7){
        if (card2.type() == 9){
            return card1;
        }
        else{
            return card2;
        }
    }

    //Chancelier
    if (card1.type() == 6){
        if (card2.type() == 0 || card2.type() == 3 || card2.type() == 4){
            return card2;
        }
        else{
            return card1;
        }
    }

    //Prince
    if (card1.type() == 5){
        if (card2.type() == 7 || card2.type() == 9){
            return card1;
        }
        else{
            return card2;
        }
    }

    //Servante
    if (card1.type() == 4){
        return card1;
    }

    //Baron
    if (card1.type() == 3){
        if (card2.type() == 0 || card2.type() == 1 || card2.type() == 2 || card2.type() == 4){
            return card2;
        }
        else{
            return card1;
        }
    }

    //Pretre
    if (card1.type() == 2){
        if (card2.type() == 0 || card2.type() == 4 || card2.type() == 6){
            return card2;
        }
        else{
            return card1;
        }
    }

    //Garde
    if (card1.type() == 1){
        if (card2.type() == 0 || card2.type() == 2 || card2.type() == 4 || card2.type() == 6){
            return card2;
        }
        else{
            return card1;
        }
    }

    //Espionne
    if (card1.type() == 0){
        if (card2.type() == 4){
            return card2;
        }
        else{
            return card1;
        }
    }
}

//En cas de choix du chancelier, on prend la carte la plus haute ou l'espionne, mais aucune n'a priorité sur l'autre.
function chancelier(card1, card2, card3){
    if (card1.type() == 0 || card1.type() >= card2.type() && card1.type() >= card3.type()){
        return card1;
    }
    if (card2.type() == 0 || card2.type() >= card1.type() && card2.type() >= card3.type()){
        return card2;
    }
    if (card3.type() == 0 || card3.type() >= card1.type() && card3.type() >= card2.type()){
        return card3;
    }
}

function attacksimple(joueurs){
    return getRandomInt(joueurs.length);
}

function guardsimple(){
    r = 1;
    while (r == 1){
        r = getRandomInt(10)
    }
    return r;
}

//A MODIFIER
function attackdifficult(joueurs){
    return getRandomInt(joueurs.length);
}

function guarddifficult(){
    r = 1;
    while (r == 1){
        r = getRandomInt(10)
    }
    return r;
}
