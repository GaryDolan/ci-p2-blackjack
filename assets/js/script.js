// CLASS DEFINITIONS
class Player {
    constructor(){
        this.hand = [];
        this.handCount = 0;
        this.stand = false;
        this.isBust = false;
    }
    
    calculateHandCount() {
    
    }

    getValueOfCard(card) {
    
    }

    checkBust() {
    
    }

    
}

class Dealer extends Player {
    constructor() {
        super();
        this.deck = [];
	    this.noOfCardsInDeck = 52;
    }   
        newDeck() {
            //logic to build a new deck, may add in building from multiple decks at a later stage
            const suits = ['c', 'd', 'h', 's'];
            const values = ['2','3','4','5','6','7','8','9','10','j','q','','a']
            let card = '';

            for (let value of values) {
                for (let suit of suits) {
                    card = value + suit;
                    console.log(card);
                    this.deck.push(card);
                }
            }
        }

        shuffleDeck() {
            //logic to shuffle deck
        }
        
        dealCard(player) {
            //deal card to specified player
        }

        checkStand () {
            
        }
}

class HumanPlayer extends Player {
    constructor() {
        super();
    
    }
        setChipCount(count) {
            
        }

        getChipCount() {
            
        }

        placeBet(amount) {
            //set bet amount
            //adjust chip count setChipCount
            //display new count
        }

        setStand() {
            
        }
    
}

//FUNCTION DEFINITIONS

function initialiseGame() {
    //initial logic only run once, at the start of a new game 
    const dealer = new Dealer();
    dealer.newDeck();
}

function startGame() {
    //logic to run game 
}

function checkWinner() {
    //logic to check the players hand coundt and determin the winner, displayed winner message and if player won add bet to chip count 1:1 game
}

function displayWinnerMessage() {
    //display who won in div results message for a few seconds and then start a new hand or use a styled alert
}

function resetGame() {
    //return all vars etc to starting conditions for new hand
}

function endGame () {
    //end play, display results, store values for chip count etc.
    //can be used if player chip count reaches 0
}

//GAMEPLAY
//Wait for DOM to load before initialising the game 
document.addEventListener("DOMContentLoaded", function() {
    initialiseGame();
})

//EVENT LISTENERS
