// CLASS DEFINITIONS
class Player {
    constructor(){
        this.hand = [];
        this.handValue = 0;
        this.stand = false;
        this.isBust = false;
    }
    
    addCardToDisplay(elementId, hideFirstCard = false) {
        //target the div that we will display cards in 
        const cardContainer = document.getElementById(elementId);
        
        //create and append the image based on last card added to the hand
        const cardImg = document.createElement('img'); 
        cardImg.src = `../../assets/images/playing-card-images/${hideFirstCard ? "card-back" : this.hand[this.hand.length - 1]}.webp`;
        cardImg.alt = `Image of a playing card, value ${this.hand[this.hand.length - 1]}`;

        //append the card image to element
        cardContainer.appendChild(cardImg);  
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

    checkBust() {
        return this.handValue > 21;
    }

    resetHand(elementId) {
        //clear card values from hand 
        this.hand = [];

        //target the div that we will display empty cards in 
        const cardContainer = document.getElementById(elementId);
        
        //clear out any placeholder images
        cardContainer.innerHTML = "";
        
        //create and append the image of card backs
        for (let i = 0; i < 2; i++) {
            const cardImg = document.createElement('img');
            cardImg.src = "../../assets/images/playing-card-images/card-back.webp";
            cardImg.alt = "Image of the back of a playing card, it is red.";

            //append the card image to element
            cardContainer.appendChild(cardImg);  
        }        
    }

    clearCards(elementId)
    {
        //target the div that we will display empty cards in 
        const cardContainer = document.getElementById(elementId);

        //clear out any placeholder images
        cardContainer.innerHTML = "";
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

    placeBet(dealer) {
        //get bet amount 
        this.betAmount = parseInt(document.getElementById("player-bet-input").value);
        
        //validate user input and place bet 
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

            //deal the cards
            startDeal(dealer, this);
        }
    }

    disableBetting(){
        //lock input and button and return bet to min amount
        disableBetButton();
        disableBetInput();
        resetBetAmount();
    }
    
    enableBetting() {
        enableBetButton();
        enableBetInput();
    }

    hit(dealer){
        dealer.dealCard(this);
        this.addCardToDisplay("players-cards");
        this.calculateHandValue();
        this.displayHandValue("player-hand-value");
        if (this.checkBust()) { 
            disableHitButton();
            //after half a second let them know their bust 
            setTimeout(() => {alert("You are bust, Better luck next time");}, 500);
            //after 4 seconds restart the game 
            setTimeout(() => {startGame(dealer, this);}, 4000) 
        }
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

    //Add even listeners to buttons (located here as it needs access to Player methods)
    //place bet button 
    const placeBetButton = document.getElementById("place-bet-button");
    placeBetButton.addEventListener("click", function() {
        humanPlayer.placeBet(dealer);    
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
    //enable betting
    humanPlayer.enableBetting()

    //move focus to bet
    document.getElementById("player-bet-input").focus();
        
    //block hit and stand buttons
    disableHitButton();
    disableStandButton();
    
    //update max bet allowed
    humanPlayer.setMaxBet();
     
    //display player chip count
    humanPlayer.displayChipCount();

    //clear old cards and display card backs 
    dealer.resetHand("dealers-cards")
    humanPlayer.resetHand("players-cards");
}

async function startDeal(dealer, humanPlayer) {
    //dealth one by one so that we can hide the first card and add delays/animation
    
    //Dealer 1st card no delay (remove card backs)
    dealer.dealCard(dealer);
    dealer.clearCards ("dealers-cards");
    dealer.addCardToDisplay("dealers-cards", true);

    await delay(1000);
    dealer.dealCard(humanPlayer);
    humanPlayer.clearCards ("players-cards");
    humanPlayer.addCardToDisplay("players-cards");

    await delay(1000);
    dealer.dealCard(dealer);
    dealer.addCardToDisplay("dealers-cards");

    await delay(1000);
    dealer.dealCard(humanPlayer);
    humanPlayer.addCardToDisplay("players-cards");
    
    console.log(dealer.hand);
    console.log(humanPlayer.hand);

    //calculate and display hand counts
    dealer.calculateHandValue();
    dealer.displayHandValue("dealer-hand-value")
    humanPlayer.calculateHandValue();
    humanPlayer.displayHandValue("player-hand-value")
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

//delay function for use in async functions, as learned from geeksforgeeks.org
function delay(millisec) {
    return new Promise(resolve => {setTimeout(() => {resolve ('')}, millisec);} )
}

//Wait for DOM to load before initialising the game 
document.addEventListener("DOMContentLoaded", function() {
    //add event listeners
    
    //begin game set up
    initialiseGame();
})


