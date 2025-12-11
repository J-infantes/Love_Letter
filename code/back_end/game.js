import {iasimple,ia,iadifficult} from './ai.js';
class card {
    #_type = 0;
    constructor(type) {
        this.#_type = type;
    }

    get type(){
        return this.#_type;
    }


    activate(player_played,player_attacked,guess=0){
        switch (this.#_type) {
            case 0:
                //espionne
                player_played.delete(this);
                player_played.equiped_card.push(this);
            case 1:
                //garde
                player_played.discard(this);
                if(player_attacked.currentcard[0].type() == guess){
                    player_attacked.discard();
                }
                
            case 2:
                //prêtre
                player_played.discard(this);
                print(player_attacked.currentcard[0].type()) //TODO: print to the player / tell the AI
                //call RetourPrêtre(player_attacked.currentcard[0].type()) pour AI
                if (player_played instanceof ia){
                    player_played.retour_pretre(player_attacked.currentcard[0].type());
                }
                
                break;
            case 3:
                //baron
                player_played.discard(this);
                if(player_played.currentcard[0].type() > player_attacked.currentcard[0].type()){
                    player_attacked.discard();
                }
                else if(player_played.currentcard[0].type() < player_attacked.currentcard[0].type()){
                    player_played.discard();
                }

                
                break;
            case 4:
                //servante
                player_played.delete(this);
                player_played.equiped_card.push(this);
                
                break;
            case 5:
                //prince
                player_played.discard(this);
                player_attacked.discard();
                if(player_attacked.iseliminated){
                    break;
                }
                player_attacked.draw();
                
                break;
            case 6:
                //chancelier
                player_played.discard(this);
                if (player_played.deck.taille() > 1){
                    player_played.draw();
                    player_played.draw();
                }
                else if (player_played.deck.taille() == 1){
                    player_played.draw();
                }
                



                if(player_played.currentcard.length == 1){
                    player_played.putback();
                }
                else if (player_played instanceof ia){
                    let cards = [];
                    cards = player_played.chancelier();
                    player_played.putback(cards[0]);
                    player_played.putback(cards[1]);
                    break;
                }
                //TODO: ask player which card to put back
                
                
                
                break;
            case 7:
                //roi
                player_played.discard(this);
                temp = player_attacked.currentcard[0];
                player_attacked.currentcard[0] = player_played.currentcard[0];
                player_played.currentcard[0] = temp;
                
                break;
            case 8:
                //comtesse
                player_played.discard(this);
                
                break;
            case 9:
                //princesse
                player_played.discard(this);
                
                
                break;
            default:
                break;
        }
    }
}

class player {
    iseliminated = false
    points = 0
    #current_card = []
    equiped_card = []
    deck = null
    discard_pile = null

    constructor(deck,discard_pile){
        this.#current_card = deck.draw();
        this.deck = deck;
        this.discard_pile = discard_pile;
    }

    servante(){
        //discard servante to stop effect
        for(let i=0;i<this.equiped_card.length;i++){
            if(this.equiped_card[i].type == 4){
                this.discard_pile.add(this.equiped_card[i]);
                this.equiped_card.splice(i,1);
                break;
            }
        }
    } 

    get currentcard(){
        return this.#current_card;
    }
    draw(){
        //draw a card from deck
        this.#current_card.push(this.deck.draw());
    }
    discard(card=null){
        //discard a card
        if(card == null){
            card = this.#current_card[0];
            if(card.type == 9){
                this.iseliminated = true;
            }
            this.discard_pile.add(card);
            this.#current_card.shift();

        }
        else{
            let index = this.#current_card.indexOf(card);
            if(index > -1){
                this.#current_card.splice(index,1);
                if(card.type == 9){
                    this.iseliminated = true;
                }
                this.discard_pile.add(card);

            }
        }
        //check if player has no cards left
        if(this.#current_card.length == 0){
            this.iseliminated = true;
        }
        
    }
    putback(card = null){
        //put back a card at end of deck
        let index = this.#current_card.indexOf(card);
            if(index > -1){
                this.#current_card.splice(index,1);
                if(card.type == 9){
                    this.iseliminated = true;
                }
                this.deck.putback(card);
            }
            //check if player has no cards left
        if (this.#current_card.length == 0){
            this.iseliminated = true;
        }
    }
    delete(card){
        //remove a card from current cards without discarding
        let index = this.#current_card.indexOf(card);
        if(index > -1){
            this.#current_card.splice(index,1);
        }
    }

}

function print(data){
    console.log(data)
}

class deck {
    #cards = []
    constructor(){
        this.#cards.push(new card(0));
        this.#cards.push(new card(0));
        this.#cards.push(new card(1));
        this.#cards.push(new card(1));
        this.#cards.push(new card(1));
        this.#cards.push(new card(1));
        this.#cards.push(new card(1));
        this.#cards.push(new card(1));
        this.#cards.push(new card(2));
        this.#cards.push(new card(2));
        this.#cards.push(new card(3));
        this.#cards.push(new card(3));
        this.#cards.push(new card(4));
        this.#cards.push(new card(4));
        this.#cards.push(new card(5));
        this.#cards.push(new card(5));
        this.#cards.push(new card(6));
        this.#cards.push(new card(6));
        this.#cards.push(new card(7));
        this.#cards.push(new card(8));
        this.#cards.push(new card(9));
        this.#cards = this.#cards.sort(() => Math.random() - 0.5);
        this.draw();
    }
    draw(){
        return this.#cards.pop();
    }
    putback(card){
        this.#cards.unshift(card);
    }
    taille(){
        return this.#cards.length;
    }

}

class game {
    #players = []
    #deck = null
    current_player=0;
    discard_pile = new discard_pile();
    difficulty = 0;

    constructor(num_players,difficulty = 0){
        this.#deck = new deck();
        //add players
        this.#players.push(new player(this.#deck));
        for(let i=1;i<num_players;i++){
            if(difficulty == 0){
                this.#players.push(new iasimple(this.#deck,this.discard_pile));
            }
            else if(difficulty == 1){
                this.#players.push(new iadifficult(this.#deck,this.discard_pile));
            }
        }

    }

    start(){
        //game loop
        while(this.#players.filter(p => !p.iseliminated).length > 1 || this.#deck.length > 0){

            for(this.current_player=0;this.current_player<this.#players.length;this.current_player++){
                
                //skip eliminated players
                if(this.#players[this.current_player].iseliminated){
                    continue;
                }
                
                // check if player has a servante to discard
                if(this.#players[this.current_player].equiped_card.some(card => card.type == 4)){
                    //servante effect
                    this.#players[this.current_player].servante();
                }
                

                this.#players[this.current_player].draw();
                //player chooses a card to play
                //TODO: ask player
                if (this.#players[this.current_player] instanceof ia){
                    let played_card = this.#players[this.current_player].play();
                }
                else{
                    //TODO: ask player which card to play
                let played_card = this.#players[this.current_player].currentcard[0];
                }

                // Update AIs about played card
                this.#players.forEach(element => {
                    if(element instanceof ia){
                        element.update(played_card,this.current_player);
                    }
                });

                //TODO: make AI choose which player to attack / ask player
                if (this.#players[this.current_player] instanceof ia){
                    if([0,4,8,9,6].includes(played_card.type())){
                        played_card.activate(this.#players[this.current_player],null);
                    }
                    else if(played_card.type() == 1){
                        [target_player,guess] = this.#players[this.current_player].garde(this.#players);
                        played_card.activate(this.#players[this.current_player],target_player,guess);
                    }
                    else if(played_card.type() == 2){
                        target_player = this.#players[this.current_player].pretre(this.#players);
                        played_card.activate(this.#players[this.current_player],target_player);
                    }
                    else if(played_card.type() == 3){
                        target_player = this.#players[this.current_player].baron(this.#players);
                        played_card.activate(this.#players[this.current_player],target_player);
                    }
                    else if(played_card.type() == 5){
                        target_player = this.#players[this.current_player].prince(this.#players);
                        played_card.activate(this.#players[this.current_player],target_player);
                    }
                    else if(played_card.type() == 7){
                        target_player = this.#players[this.current_player].roi(this.#players);
                        played_card.activate(this.#players[this.current_player],target_player);
                    }
                }

                //check if deck is empty
                if(this.#deck.taille() == 0){
                    break;
                }
                
            }
        }
        //determine who gets a point
        let winners = [];
        this.#players.forEach(element => {
            if(!element.iseliminated){
                winners.push(element);
            }});
        max =-1;
        for(let i=0;i<winners.length;i++){
            if(winners[i].currentcard[0].type() > max){
                max = winners[i].currentcard[0].type();
            }
            winner = this.#players.indexOf(winners[i]);
        }
        this.#players[winner].points += 1;

        has_espionne = [];
        this.#players.forEach(element => {
            for(let i=0;i<element.equiped_card.length;i++){
                if(element.equiped_card[i].type() == 0 && !element.iseliminated && has_espionne.includes(element) == false){
                    has_espionne.push(element);
                }
            }
        });
        if(has_espionne.length == 1){
            has_espionne[0].points += 1;
        }
        
        //check if someone has won
        this.#players.forEach(element => {
            if(element.points >= 3){
                print("Player "+this.#players.indexOf(element)+" wins the game!"); //TODO: end the game with win
                // TODO: restart or end the game
                // TODO: make the player loose
                return;
            }
            else {
                this.new_round(); // TODO: start a new round
            }
        });

        
    }

    new_round(){
        //reset players
        this.#players.forEach(element => {
            element.iseliminated = false;});
        //reset deck
        this.#deck = new deck();
        //initial draw
        this.#players.forEach(element => {
            element.draw();
        });

    }

    restart(){
        //reset everything
        this.#players = []
        this.#deck = new deck();
        this.#players.push(new player(this.#deck));
        for(let i=1;i<num_players;i++){
            if(difficulty == 0){
                this.#players.push(new iasimple(this.#deck,this.discard_pile));
            }
            else if(difficulty == 1){
                this.#players.push(new iadifficult(this.#deck,this.discard_pile));
            }
        }
        this.#players.forEach(element => {
            element.draw();
        });
    }

    affichage_discard_last(){
        //show last card in discard pile
        return this.discard_pile.getlast().gettype();
    }
    current_player_chiffre(){
        //return current player index
        return this.current_player;
    }

    current_player_player(){
        //return current player object
        return this.#players[this.current_player];
    }

    nombre_de_cartes_dans_le_deck(){
        //return number of cards in deck
        return this.#deck.taille();
    }

}

class discard_pile {
    #cards = []
    constructor(){
        this.#cards = []
    }
    getlast(){
        //return last card in discard pile
        return this.#cards[this.#cards.length - 1];
    }
    add(card){
        //add card to discard pile
        this.#cards.push(card);
    }
}

export {game,player,deck,card,discard_pile};