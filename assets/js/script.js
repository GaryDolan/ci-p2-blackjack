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

    hit(dealer){

    }

    getValueOfCard(card) {
    
    }

    checkBust() {
        return this.handValue > 21;
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
        this.chipCount = 1000;
        this.betAmount = 0;
    }
        
    adjustChipCount(count) {
        this.chipCount = count;            
    }

    displayChipCount() {
        document.getElementById("chip-count").textContent = this.chipCount;
    }

    setMaxBet() {
        document.getElementById("player-bet-input").max = this.chipCount;
    }

    placeBet() {
        //get bet amount 
        this.betAmount = parseInt(document.getElementById("player-bet-input").value);
        
        //validate user input and place bet 
        console.log(this.betAmount);
        if(isNaN(this.betAmount) || this.betAmount % 25 != 0 ) {
            alert ("Please enter a valid betting mount in €25 increments, €25, €50, €75, etc. or use the arrows to select a betting amount");
        } else {
            if (this.betAmount > this.chipCount) {
                alert(`The Bet you placed exceeded your chip count, your bet has been place at your chip count €${this.chipCount}`);
                this.betAmount = this.chipCount;
            }
            //adjust chip count 
            this.chipCount -= this.betAmount;
            this.displayChipCount();

            //enable hit and stand buttons
            enableHitButton();
            enableStandButton();

            //disable betting button and input 
            this.disableBetting();
        }
    }

    disableBetting(){
        //lock input and button and return bet to min amount
        disableBetButton();
        disableBetInput();
        resetBetAmount();
    }
    
    enableBetting() {
        //set betting back up 
    }

    hit(dealer){
        dealer.dealCard(this);
        this.displayHand("players-cards");
        this.calculateHandValue();
        this.displayHandValue("player-hand-value");
        if (this.checkBust()) {
            //disable hit button
            disableHitButton();
            setTimeout(() => {
                alert("You are bust, Better luck next time");
            }, 1000);

        }
    }

    setStand() {
        
    }
}

//FUNCTION DEFINITIONS

function initialiseGame() {
    //move focus to bet
    document.getElementById("player-bet-input").focus();

    //initial logic only run once, at the start of a new game. 
    const dealer = new Dealer();
    const humanPlayer = new HumanPlayer();
    dealer.newDeck();
    dealer.shuffleDeck();

    //Add even listeners to buttons (located here as it needs access to Player methods)
    //place bet button 
    const placeBetButton = document.getElementById("place-bet-button");
    placeBetButton.addEventListener("click", function() {
        humanPlayer.placeBet();    
    });

    //hit button
    const hitButton = document.getElementById("hit-button");
    hitButton.addEventListener("click", function() {
        humanPlayer.hit(dealer); 
    });

    //begin gameplay 
    startGame(dealer, humanPlayer);
}

function startGame(dealer, humanPlayer) {
    //block hit and stand buttons
    disableHitButton();
    disableStandButton();
    
        //update max bet allowed
    humanPlayer.setMaxBet();
    
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
    
    //display player chip count
    humanPlayer.displayChipCount();
}

//container functions
function disableHitButton() {
    document.getElementById("hit-button").disabled = true;
}

function enableHitButton() {
    document.getElementById("hit-button").disabled = false;
}

function disableBetButton() {
    document.getElementById("place-bet-button").disabled = true;
}

function enableBetButton() {
    document.getElementById("place-bet-button").disabled = false;
}

function disableStandButton() {
    document.getElementById("stand-button").disabled = true;
}

function enableStandButton() {
    document.getElementById("stand-button").disabled = false;
}

function disableBetInput() {
    document.getElementById("player-bet-input").disabled = true;
}

function enableBetInput() {
    document.getElementById("player-bet-input").disabled = false;
}

function resetBetAmount() {
    document.getElementById("player-bet-input").value = 25;
}


//Regular functions
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


//Wait for DOM to load before initialising the game 
document.addEventListener("DOMContentLoaded", function() {
    //add event listeners
    
    //begin game set up
    initialiseGame();
})


