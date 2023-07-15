// CLASS DEFINITIONS
class Player {
    constructor(){
        
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
    
    }   
        newDeck() {
            //logic to build a new deck, may add in building from multiple decks at a later stage
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
    //initial logic only run at the start of a new game 
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


//EVENT LISTENERS
