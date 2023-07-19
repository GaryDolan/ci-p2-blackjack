// CLASS DEFINITIONS
class Player {
    constructor(){
        this.hand = [];
        this.handValue = 0;
        this.stand = false;
        this.isBust = false;
    }
    
    addCardToDisplay(elementId, hideFirstCard = false, position = "last") {
        //target the div that we will display cards in 
        const cardContainer = document.getElementById(elementId);
        
        //create and append the image based on the position passed in 
        const cardImg = document.createElement('img');
        if (position === "last") {
            cardImg.src = `../../assets/images/playing-card-images/${hideFirstCard ? "card-back" : this.hand[this.hand.length - 1]}.webp`;
            cardImg.alt = `Image of a playing card, value ${this.hand[this.hand.length - 1]}`;
            
            //append the card image to element
            cardContainer.appendChild(cardImg);  
        } else {
            //target the first child image
            const firstChild = cardContainer.firstChild;
            cardImg.src = `../../assets/images/playing-card-images/${hideFirstCard ? "card-back" : this.hand[0]}.webp`;
            cardImg.alt = `Image of a playing card, value ${this.hand[0]}`;

            //delete first card and insert new
            cardContainer.insertBefore(cardImg, firstChild);
            cardContainer.removeChild(firstChild);
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

    checkBust() {
        return this.handValue > 21;
    }

    resetHand(cardContainerId, handValueContainerId) {
        //clear handValue and display
        this.handValue = 0;
        this.displayHandValue(handValueContainerId);
        
        //clear card values from hand 
        this.hand = [];
        
        //target the div that we will display empty cards in 
        const cardContainer = document.getElementById(cardContainerId);
        
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
 
    //These functions are overridden in the derived classes (dealer, humanPlayer)
    hit(){

    }

    stand () {

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

    displayHoleCard() {

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

    hasMinBetAmount() {
        return this.chipCount > 10;
    }

    placeBet(dealer) {
        //get bet amount 
        this.betAmount = parseInt(document.getElementById("player-bet-input").value);
        
        //validate user input and place bet 
        if(isNaN(this.betAmount) || this.betAmount % 10 != 0 ) {
            alert ("Please enter a valid betting mount in €10 increments, €10, €20, €30, etc. or use the arrows to select a betting amount");
        } else {
            if (this.betAmount > this.chipCount) {
                alert(`The Bet you placed exceeded your chip count, your bet has been place at your chip count €${this.chipCount}`);
                this.betAmount = this.chipCount;
            }
            //adjust chip count 
            this.chipCount -= this.betAmount;
            this.displayChipCount();

            //disable betting button and input 
            this.disableBetting();

            //deal the cards
            startDeal(dealer, this);
        }
    }

    clearBet() {
        this.betAmount = 0;
    }

    disableBetting() {
        //lock input and button and return bet to min amount
        disableBetButton();
        disableBetInput();
        resetBetAmount();
    }
    
    enableBetting() {
        enableBetButton();
        enableBetInput();
    }

    hit(dealer) {
        dealer.dealCard(this);
        this.addCardToDisplay("players-cards");
        this.calculateHandValue();
        this.displayHandValue("player-hand-value");
        if (this.checkBust()) { 
            disableHitButton();
            disableStandButton();
            //after half a second let them know their bust 
            setTimeout(() => {alert("You are bust, Better luck next time");}, 500);
            //after 3 seconds restart the game 
            setTimeout(() => {startGame(dealer, this);}, 3000) 
        }
    }

    checkForBlackjack(){
        return this.handValue === 21;
    }

    collectWinnings(typeOfWin)
    {
        if (typeOfWin === "blackjack"){
            this.chipCount += this.betAmount + this.betAmount * 1.5; //3:2 odds
        }else {
            this.chipCount += this.betAmount * 2; // 1:1 odds
        }  
        this.displayChipCount();
    }
}

//FUNCTION DEFINITIONS

//initial logic only run once, at the start of a new game. 
function initialiseGame() {
    const dealer = new Dealer();
    const humanPlayer = new HumanPlayer();
    dealer.newDeck();
    dealer.shuffleDeck();

    //Add even listeners to buttons (located here as it needs access to Player methods)
    
    //Place bet button 
    const placeBetButton = document.getElementById("place-bet-button");
    placeBetButton.addEventListener("click", function() {
        humanPlayer.placeBet(dealer);    
    });

    //Hit button
    const hitButton = document.getElementById("hit-button");
    hitButton.addEventListener("click", function() {
        humanPlayer.hit(dealer); 
    });

    //Play again button
    const playAgainButton = document.getElementById("play-again-button");
    playAgainButton.addEventListener("click", function() {
        startAdditionalGame(dealer, humanPlayer);
    });

    //Stand button
    const standButton = document.getElementById("stand-button");
    standButton.addEventListener("click", function() {
        dealersPlay(dealer); 
    });

    //begin gameplay 
    startGame(dealer, humanPlayer);
}

//logic needed at the start of every game
function startGame(dealer, humanPlayer) {
    //clear old bet 
    humanPlayer.clearBet();

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
    dealer.resetHand("dealers-cards", "dealer-hand-value")
    humanPlayer.resetHand("players-cards", "player-hand-value");
    
    if (humanPlayer.hasMinBetAmount()) {
        //enable betting
        humanPlayer.enableBetting()
    }else {
        alert("You do not have enought chips to place a minimum bet, Thank you for playing, please use the Play Again to start a new game");
        displayPlayAgainButton();//, when pressed it will run a function to clear the button and start init game
    }
}

//logic run once the placer places their bet
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

    //Check for blackJack (auto win)
    if (humanPlayer.checkForBlackjack()) {
        displayGameResultsMsg("blackjack", dealer, humanPlayer);
        humanPlayer.collectWinnings("blackjack");
        return; //Exit function and do not enable buttons below 
    }

    //enable hit and stand buttons
    enableHitButton();
    enableStandButton();
}

//logic run once player stands()
function dealersPlay(dealer) {
    disableHitButton();
    disableStandButton();

    //display dealers first card
    dealer.addCardToDisplay("dealers-cards", false, "first");
    //hit until 17 or bust
    //logic if bust
    //logic if 17
    //logic if stand and we need to decide a winnder
    //start new game

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
    document.getElementById("player-bet-input").value = 10;
}


//Regular functions
function checkWinner() {
    //logic to check the players hand coundt and determin the winner, displayed winner message and if player won add bet to chip count 1:1 game
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

function displayGameResultsMsg (result, dealer, player) {
    switch (result) {
        case "win":
            //after half a second let them know their bust 
            setTimeout(() => {alert("You win, Congratulations");}, 500);
            break;
        case "lose":
            //after half a second let them know their bust 
            setTimeout(() => {alert("Dealer wins, Better luck next time");}, 500);
            break;
        case "bust":
            //after half a second let them know their bust 
            setTimeout(() => {alert("BUST, You went over 21. Dealer wins, Better luck next time");}, 500);
            break;
        case "blackjack":
            //after half a second let them know their bust 
            setTimeout(() => {alert("BLACKJACK! you have 21, You win, Congratulations");}, 500);
            break;

        case "push":
            //after half a second let them know their bust 
            setTimeout(() => {alert("PUSH, It's a draw with the dealer");}, 500);
            break;
    
        default:
            console.log("invalid result")
            break;
    }
    //after 3 seconds restart the game 
    setTimeout(() => {startGame(dealer, player);}, 3000) 
}

function displayPlayAgainButton() {
    //Hide player chip count 
    const chipCountContainer = document.getElementsByClassName("player-chip-count");
    chipCountContainer[0].style.display = "none";

    //Hide butting input 
    const bettingInput = document.getElementsByClassName("betting-input");
    bettingInput[0].style.display = "none";

    //Hide place bet button
    const betButton = document.getElementById("place-bet-button");
    betButton.style.display = "none";

    //Display play again button  
    const newGameButton = document.getElementById("play-again-button");
    newGameButton.style.display = "block";
}

function startAdditionalGame(dealer, humanPlayer) {
    //Display player chip count 
    const chipCountContainer = document.getElementsByClassName("player-chip-count");
    chipCountContainer[0].style.display = "block";

    //Display butting input 
    const bettingInput = document.getElementsByClassName("betting-input");
    bettingInput[0].style.display = "flex";

    //Display place bet button
    const betButton = document.getElementById("place-bet-button");
    betButton.style.display = "block";

    //Hide play again button  
    const newGameButton = document.getElementById("play-again-button");
    newGameButton.style.display = "none";

    //Give the players some chips
    humanPlayer.adjustChipCount(1000);

    //call start game
    startGame(dealer, humanPlayer);

}

//Wait for DOM to load before initialising the game 
document.addEventListener("DOMContentLoaded", function() {
    //add event listeners
    
    //begin game set up
    initialiseGame();
})


