
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
                player_played.equiped_card.push(this);
                return true
            case 1:
                guess =0;
                if(player_attacked.currentcard[0].type() == guess){
                    player_attacked.iseliminated = true
                    return true
                }
                return false
                
            case 2:
                print(player_attacked.currentcard[0].type())
                
                break;
            case 3:
                if(player_played.currentcard[0].type() > player_attacked.currentcard[0].type()){
                    player_attacked.iseliminated = true
                }
                else{
                    player_played.iseliminated = true
                }

                
                break;
            case 4:
                player_played.equiped_card.push(this);
                
                break;
            case 5:
                player_attacked.discard();
                player_attacked.draw();
                
                break;
            case 6:
                player_played.draw();
                player_played.draw();
                player_played.putback();
                player_played.putback();
                
                break;
            case 7:
                temp = player_attacked.currentcard[0];
                player_attacked.currentcard[0] = player_played.currentcard[0];
                player_played.currentcard[0] = temp;
                
                break;
            case 8:
                
                break;
            case 9:
                player_played.iseliminated = true;
                
                break;
            default:
                break;
        }

    }



}

class player {
    iseliminated = false
    #current_card = []
    equiped_card = []
    deck = null
    constructor(deck){
        this.#current_card = deck.draw();
        this.deck = deck;
    }
    get currentcard(){
        return this.#current_card;
    }
    draw(){
        //draw a card from deck
        this.#current_card.push(this.deck.draw());
    }
    discard(){
        this.#current_card = []
    }
    putback(){
        //put back a card at end of deck
        this.deck.putback(this.#current_card[0]);
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