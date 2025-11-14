
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
                
                break;
            case 3:
                
                break;
            case 4:
                
                break;
            case 5:
                
                break;
            case 6:
                
                break;
            case 7:
                
                break;
            case 8:
                
                break;
            case 9:
                
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
    constructor(card){
        this.#current_card = card;
    }
    get currentcard(){
        return this.#current_card;
    }
}