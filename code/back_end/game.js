
class card {
    #_type = 0;
    constructor(type) {
        this.#_type = type;
    }

    get type(){
        return this.#_type;
    }


    activate(player_played,player_attacked){
        switch (this.#_type) {
            case 0:
                player_played.delete(this);
                player_played.equiped_card.push(this);
                return true
            case 1:
                player_played.discard(this);
                guess =0;
                if(player_attacked.currentcard[0].type() == guess){
                    player_attacked.iseliminated = true
                    return true
                }
                return false
                
            case 2:
                player_played.discard(this);
                print(player_attacked.currentcard[0].type())
                
                break;
            case 3:
                player_played.discard(this);
                if(player_played.currentcard[0].type() > player_attacked.currentcard[0].type()){
                    player_attacked.iseliminated = true
                }
                else{
                    player_played.iseliminated = true
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
                player_played.putback();
                player_played.putback();
                
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
        
    }
    putback(){
        //put back a card at end of deck
        this.deck.putback(this.#current_card[0]);
        this.#current_card.shift();
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

}

class game {
    #players = []
    #deck = null
    constructor(num_players){
        this.#deck = new deck();
        for(let i=0;i<num_players;i++){
            this.#players.push(new player(this.#deck));
        }
    }

    start(){
        //game loop
        while(this.#players.filter(p => !p.iseliminated).length > 1 || this.#deck.length > 0){
            for(let i=0;i<this.#players.length;i++){
                if(this.#players[i].iseliminated){
                    continue;
                }
                this.#players[i].draw();
                //player chooses a card to play
                let played_card = this.#players[i].currentcard[0];
                let attacked_player_index = (i+1)%this.#players.length;
                while(this.#players[attacked_player_index].iseliminated){
                    attacked_player_index = (attacked_player_index+1)%this.#players.length;
                }
                let attacked_player = this.#players[attacked_player_index];
                played_card.activate(this.#players[i],attacked_player);
                
            }
        }
        nbplayeralive=0;
        this.#players.forEach(element => {
            if(!element.iseliminated){
                nbplayeralive++;
            }
            
        });
        if(nbplayeralive>1){
            winner = this.#players.reduce((prev, current) => (prev.currentcard[0].type > current.currentcard[0].type) ? prev : current);
        }
        else
        {
            winner = this.#players.find(p => !p.iseliminated);
        }
        
        print("Player "+this.#players.indexOf(winner)+" wins!");

    }

    restart(){
        this.#players = []
        this.#deck = new deck();
        for(let i=0;i<num_players;i++){
            this.#players.push(new player(this.#deck));
        }
    }

}

class discard_pile {
    #cards = []
    constructor(){
        this.#cards = []
    }
    add(card){
        this.#cards.push(card);
    }
}