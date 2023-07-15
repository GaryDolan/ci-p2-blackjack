// CLASS DEFINITIONS
class Player {
    constructor(){
        this.hand = [];
        this.handCount = 0;
        this.stand = false;
        this.isBust = false;
    }
    
    displayHand (elementId, hideFirstCard = false) {
        //target the div that we will display cards in 
        const cardContainer = document.getElementById(elementId);
        
        //clear out any placeholder images
        cardContainer.innerHTML = "";
        
        //create and append the image based on hand values
        for (let i = 0; i< this.hand.length; i++) {
            const cardImg = document.createElement('img');
            cardImg.src = `../../assets/images/playing-card-images/${hideFirstCard && i===0 ? "card-back" : this.hand[i]}.webp`;
            cardImg.alt = `Image of a playing card, value ${this.hand [i]}`;

            //append the card image to element
            cardContainer.appendChild(cardImg);  
        }        
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
            const values = ['2','3','4','5','6','7','8','9','10','j','q','k','a']
            let card = '';

            for (let suit of suits) {
                for (let value of values) {
                    card = value + suit;
                    this.deck.push(card);
                }
            }
            //console.log(this.deck);
        }

        shuffleDeck() {
            //The Fisher Yates Method is used here to shuffle the deck
            for (let i = this.deck.length -1; i > 0; i--) {
                let j = Math.floor(Math.random() * (i+1));
                let k = this.deck[i];
                this.deck[i] = this.deck[j];
                this.deck[j] = k;
              }
              console.log(this.deck);
        }
        
        dealCard(player) {
            //deal card to specified player
            let card = this.deck.pop();
            player.hand.push(card)
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
    //initial logic only run once, at the start of a new game. 
    const dealer = new Dealer();
    const humanPlayer = new HumanPlayer();
    dealer.newDeck();
    dealer.shuffleDeck();
    startGame(dealer, humanPlayer);
}

function startGame(dealer, humanPlayer) {
    //deal 2 cards to each player, one at a time.
    const players = [dealer, humanPlayer];
    const cardsPerPlayer = 2;
    for (let i = 0; i < cardsPerPlayer; i++) {
        for (let player of players) {
            dealer.dealCard (player);
        }
    }
    console.log(dealer.hand);
    console.log(humanPlayer.hand);

    //Display dealer and players cards 
    humanPlayer.displayHand("players-cards");
    dealer.displayHand("dealers-cards", true);
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

//BEGIN GAMEPLAY
//Wait for DOM to load before initialising the game 
document.addEventListener("DOMContentLoaded", function() {
    initialiseGame();
})

//EVENT LISTENERS
