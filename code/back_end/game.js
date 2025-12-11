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
                player_played.delete(this);
                player_played.equiped_card.push(this);
            case 1:
                player_played.discard(this);
                if(player_attacked.currentcard[0].type() == guess){
                    player_attacked.discard();
                }
                
            case 2:
                player_played.discard(this);
                print(player_attacked.currentcard[0].type()) //TODO: print to the player / tell the AI
                
                break;
            case 3:
                player_played.discard(this);
                if(player_played.currentcard[0].type() > player_attacked.currentcard[0].type()){
                    player_attacked.discard();
                }
                else{
                    player_played.discard();
                }

                
                break;
            case 4:
                player_played.delete(this);
                player_played.equiped_card.push(this);
                
                break;
            case 5:
                player_played.discard(this);
                player_attacked.discard();
                if(player_attacked.iseliminated){
                    break;
                }
                player_attacked.draw();
                
                break;
            case 6:
                player_played.discard(this);
                player_played.draw();
                player_played.draw();
                if(player_played.currentcard.length == 1){
                    player_played.putback();
                }
                else { //TODO : make AI choose which card to put back / ask player
                    player_played.putback();
                    player_played.putback();
                }
                
                
                
                break;
            case 7:
                player_played.discard(this);
                temp = player_attacked.currentcard[0];
                player_attacked.currentcard[0] = player_played.currentcard[0];
                player_played.currentcard[0] = temp;
                
                break;
            case 8:
                player_played.discard(this);
                
                break;
            case 9:
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
        if (this.#current_card.length == 0){
            this.iseliminated = true;
        }
    }
    delete(card){
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
    constructor(num_players){
        this.#deck = new deck();
        //TODO: make some players AIs
        this.#players.push(new player(this.#deck));
        for(let i=1;i<num_players;i++){
            this.#players.push(new iasimple(this.#deck,this.discard_pile));
            
        }
        this.#players.forEach(element => {
            element.draw();
        });
    }

    start(){
        //game loop
        while(this.#players.filter(p => !p.iseliminated).length > 1 || this.#deck.length > 0){

            for(this.current_player=0;this.current_player<this.#players.length;this.current_player++){

                if(this.#players[this.current_player].iseliminated){
                    continue;
                }
                

                this.#players[this.current_player].draw();
                //player chooses a card to play
                //TODO: make AI choose which card to play / ask player
                //TODO: tell the AIs the card that was just played
                let played_card = this.#players[this.current_player].currentcard[0];
                //TODO: make AI choose which player to attack / ask player
                let attacked_player_index = (this.current_player+1)%this.#players.length;
                while(this.#players[attacked_player_index].iseliminated){
                    attacked_player_index = (attacked_player_index+1)%this.#players.length;
                }

                let attacked_player = this.#players[attacked_player_index];

                played_card.activate(this.#players[this.current_player],attacked_player);

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
        this.#players.forEach(element => {
            element.iseliminated = false;});

        this.#deck = new deck();
        this.#players.forEach(element => {
            element.draw();
        });

    }

    restart(){
        this.#players = []
        this.#deck = new deck();
        //TODO: make some players AIs
        for(let i=0;i<num_players;i++){
            this.#players.push(new player(this.#deck));
        }
        this.#players.forEach(element => {
            element.draw();
        });
    }

    affichage_discard_last(){
        return this.discard_pile.getlast().gettype();
    }
    current_player_chiffre(){
        return this.current_player;
    }

    current_player_player(){
        return this.#players[this.current_player];
    }

    nombre_de_cartes_dans_le_deck(){
        return this.#deck.taille();
    }

}

class discard_pile {
    #cards = []
    constructor(){
        this.#cards = []
    }
    getlast(){
        return this.#cards[this.#cards.length - 1];
    }
    add(card){
        this.#cards.push(card);
    }
}

export {game,player,deck,card,discard_pile};