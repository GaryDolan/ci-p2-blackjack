// CLASS DEFINITIONS
class Player {
    constructor(){
        this.hand = [];
        this.handValue = 0;
        this.stand = false;
        this.isBust = false;
        this.hideFirstCard = false;
    }
    
    setHideFirstCard() {
        this.hideFirstCard = true;
    }

    resetHideFirstCard() {
        this.hideFirstCard = flase;
    }

    displayHand (elementId) {
        //target the div that we will display cards in 
        const cardContainer = document.getElementById(elementId);
        
        //clear out any placeholder images
        cardContainer.innerHTML = "";
        
        //create and append the image based on hand values
        for (let i = 0; i < this.hand.length; i++) {
            const cardImg = document.createElement('img');
            cardImg.src = `../../assets/images/playing-card-images/${this.hideFirstCard && i===0 ? "card-back" : this.hand[i]}.webp`;
            cardImg.alt = `Image of a playing card, value ${this.hand [i]}`;

            //append the card image to element
            cardContainer.appendChild(cardImg);  
        }        
    }

    calculateHandValue() {
        this.handValue = 0; //reset to clear any prev value
        const faceCards = ['j','q','k'];
        let numAces = 0;

        for (let i = 0; i < this.hand.length; i++) {
            if (this.hideFirstCard && i===0) {
                //dont add value for dealer hidden card
            } else if (faceCards.some(faceCard => this.hand[i].includes(faceCard))){ //do we have a face card
                this.handValue += 10;    
            } else if (this.hand[i].includes ('a')) {
                //check if we have aces and keep count
                numAces ++;
            } else {
                //add value for norm cards
                this.handValue += parseInt(this.hand[i].slice(0, this.hand[i].length - 1));
            }
        }
        
        //add value for aces card based on not busting player
        for (let i = 0; i < numAces; i++) {
            if (this.handValue + 11 > 21) {
                this.handValue += 1;
            } else {
                this.handValue += 11;
            }
        }
    }

    displayHandValue(elementId) {
        document.getElementById(elementId).textContent = this.handValue;
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
    dealer.setHideFirstCard();
    dealer.displayHand("dealers-cards");
    humanPlayer.displayHand("players-cards");

    //calculate and display hand counts
    dealer.calculateHandValue();
    dealer.displayHandValue("dealer-hand-value")
    humanPlayer.calculateHandValue();
    humanPlayer.displayHandValue("player-hand-value")
    
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
