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
            cardImg.src = `assets/images/playing-card-images/${hideFirstCard ? "card-back" : this.hand[this.hand.length - 1]}.webp`;
            cardImg.alt = `Image of a playing card, value ${this.hand[this.hand.length - 1]}`;
            
            //append the card image to element
            cardContainer.appendChild(cardImg);  
        } else {
            //target the first child image
            const firstChild = cardContainer.firstChild;
            cardImg.src = `assets/images/playing-card-images/${hideFirstCard ? "card-back" : this.hand[0]}.webp`;
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
            if (this.hideFirstCardValue && i===0) {
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
            cardImg.src = "assets/images/playing-card-images/card-back.webp";
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
 
    getHandValue(){
        return this.handValue;
    }
}

class Dealer extends Player {
    constructor() {
        super();
        this.deck = [];
	    this.noOfCardsInDeck = 52;
        this.hideFirstCardValue = true;
    }   

    newDeck() {
        //logic to build a new deck
        this.deck = []; //clear deck for when we create a new deck mid game
        const suits = ['c', 'd', 'h', 's'];
        const values = ['2','3','4','5','6','7','8','9','10','j','q','k','a'];
        let card = '';

        for (let suit of suits) {
            for (let value of values) {
                card = value + suit;
                this.deck.push(card);
            }
        }
    }

    shuffleDeck() {
        //The Fisher Yates Method is used here to shuffle the deck
        for (let i = this.deck.length -1; i > 0; i--) {
            let j = Math.floor(Math.random() * (i+1));
            let k = this.deck[i];
            this.deck[i] = this.deck[j];
            this.deck[j] = k;
            }
    }
    
    dealCard(player) {
        //deal card to specified player
        let card = this.deck.pop();
        player.hand.push(card)
    }

    hideHoleCardValue () {
        this.hideFirstCardValue = true;
    }

    showHoleCardValue () {
        this.hideFirstCardValue = false;
    }

    getNumOfCardInDeck() {
        return this.deck.length;   
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
        if(isNaN(this.betAmount) || this.betAmount % 10 != 0 || this.betAmount === 0) {
            displayModal("invalidBet", this); 
        } else {
            if (this.betAmount > this.chipCount) {
                displayModal("betExceedsChips", this); 
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
            handleGameResults("bust", dealer, this);  
        }
    }

    checkForBlackjack(){
        return this.handValue === 21;
    }

    collectWinnings(typeOfWin)
    {
        if (typeOfWin === "blackjack"){
            this.chipCount += this.betAmount + this.betAmount * 1.5; //3:2 odds
        } else if (typeOfWin === "push") {
            this.chipCount += this.betAmount;   //bet returned
        } else {
            this.chipCount += this.betAmount * 2; // 1:1 odds
        }  
        this.displayChipCount();
    }

    getBetAmount() {
        return this.betAmount;
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

    //Betting input box (user pressed enter)
    document.getElementById("player-bet-input").addEventListener("keydown", function(event) {
        if (event.key === "Enter")
        {
            humanPlayer.placeBet(dealer);
        }
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
        dealersPlay(dealer, humanPlayer); 
    });

    //Game Rules
    const gameRules = document.getElementById("game-rules");
    gameRules.addEventListener("click", function() {
        displayModal("gameRules", humanPlayer); 
    });


    //begin gameplay 
    startGame(dealer, humanPlayer);
}

//logic needed at the start of every game
function startGame(dealer, humanPlayer) {
    //Ensure dealers first card value is hidden
    dealer.hideHoleCardValue (); 
    
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
        displayModal("noChips", humanPlayer);
        displayPlayAgainButton();//, when pressed it will run a function to clear the button and start init game
    }
}

//logic run once the player places their bet
async function startDeal(dealer, humanPlayer) {
    //check if we need a new deck
    if (dealer.getNumOfCardInDeck() < 20) {
        //build and shuffle a new deck
        dealer.newDeck();
        dealer.shuffleDeck();
    }
    
    //dealth one by one so that we can hide the first card and add delays/animation
    
    //Dealer 1st card no delay (remove card backs)
    dealer.dealCard(dealer);
    dealer.clearCards ("dealers-cards");
    dealer.addCardToDisplay("dealers-cards", true);

    //1 sec then player card 1
    await delay(1000);
    dealer.dealCard(humanPlayer);
    humanPlayer.clearCards ("players-cards");
    humanPlayer.addCardToDisplay("players-cards");

    //1 sec then dealer card 2
    await delay(1000);
    dealer.dealCard(dealer);
    dealer.addCardToDisplay("dealers-cards");
    
    //1 sec then player card 2
    await delay(1000);
    dealer.dealCard(humanPlayer);
    humanPlayer.addCardToDisplay("players-cards");

    //calculate and display hand counts
    dealer.calculateHandValue();
    dealer.displayHandValue("dealer-hand-value")
    humanPlayer.calculateHandValue();
    humanPlayer.displayHandValue("player-hand-value")

    //Check for blackJack (auto win)
    if (humanPlayer.checkForBlackjack()) {
        handleGameResults("blackjack", dealer, humanPlayer);
        return; //Exit function and do not enable buttons below 
    }

    //enable hit and stand buttons
    enableHitButton();
    enableStandButton();
}

//logic run once player stands
async function dealersPlay(dealer, humanPlayer) {
    //no more player activity
    disableHitButton();
    disableStandButton();

    //display dealers first card
    dealer.addCardToDisplay("dealers-cards", false, "first");

    //show dealers real hand value 
    dealer.showHoleCardValue();
    dealer.calculateHandValue();
    dealer.displayHandValue("dealer-hand-value");
    await delay(1000);

    //Dealer takes cards until above 17 
    while (dealer.getHandValue() < 17) {
        dealer.dealCard(dealer);
        dealer.addCardToDisplay("dealers-cards");
        dealer.calculateHandValue();
        dealer.displayHandValue("dealer-hand-value");
        await delay(1000);
    }    
    checkWinner(dealer, humanPlayer);
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

//delay function for use in async functions, as learned from geeksforgeeks.org
function delay(millisec) {
    return new Promise(resolve => {setTimeout(() => {resolve ('')}, millisec);} )
}

function checkWinner(dealer, humanPlayer) {
    const dealerValue = dealer.getHandValue();
    const playerValue = humanPlayer.getHandValue();

    //dealer bust, player wins
    if (dealerValue > 21) { 
        handleGameResults("dealerBust", dealer, humanPlayer);
    } else if(playerValue === dealerValue) {
        handleGameResults("push", dealer, humanPlayer);
    } else if (playerValue > dealerValue) {
        handleGameResults("win", dealer, humanPlayer);
    } else {
        handleGameResults("lose", dealer, humanPlayer);
    }
}

function handleGameResults (result, dealer, humanPlayer) {
    const bet = humanPlayer.getBetAmount();
    switch (result) {
        case "win":
            //after half a second let them know they won 
            setTimeout(() => {displayModal("win", humanPlayer);}, 500);
            humanPlayer.collectWinnings("standard");
            break;
        case "lose":
            //after half a second let them know they lost 
            setTimeout(() => {displayModal("lose", humanPlayer); }, 500);
            break;
        case "bust":
            //after half a second let them know their bust 
            setTimeout(() => {displayModal("bust", humanPlayer); }, 500);
            break;
        case "blackjack":
            //after half a second let them know they got blackjack 
            setTimeout(() => {displayModal("blackjack", humanPlayer); }, 500);
            humanPlayer.collectWinnings("blackjack");
            break;

        case "push":
            //after half a second let them know it was a draw 
            setTimeout(() => {displayModal("push", humanPlayer); }, 500);
            humanPlayer.collectWinnings("push");
            break;
        
        case "dealerBust":
            //after half a second let them know they won, dealer bust  
            setTimeout(() => {displayModal("dealerBust", humanPlayer); }, 500);
            humanPlayer.collectWinnings("standard");
            break;

        default:
            break;
    }
    //after 3 seconds restart the game 
    setTimeout(() => {startGame(dealer, humanPlayer);}, 3000) 
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

//Modal 
function displayModal (messageType, humanPlayer) {
    const modalContainer = document.getElementById("modal-container");
    const modalMessage = document.getElementById("modal-message");
    const modalButton = document.getElementById("modal-button");
    const bet = humanPlayer.getBetAmount();

    switch (messageType) {
        case "gameRules":
            modalMessage.innerHTML = `<h2>Blackjack Rules:</h2> <br><br>
            
            <div> Goal: To have a hand value closer to 21 than the dealer's hand, without exceeding 21. <br><br>
            
            Card Values: Number cards (2-10) are worth their face value. Face cards (Jack, Queen, King) are worth 10. Aces can be worth 1 or 11, whichever is better for the hand. <br><br>
            
            1. The player places a bet using the betting input and place bet button. Betting odds are 1:1 for a win or 3:2 for a blackjack. <br><br>
            
            2. The Deal: The dealer deals two cards to the player and themselves. One dealer card is face up, and the other is face down.<br><br>
            
            3. Player's Turn: The player goes first. They can choose to "Hit" and receive another card or "Stand" and keep their current hand.<br><br>

            4. Blackjack: If a player's first two cards are an Ace and a 10-value card, they have a Blackjack and automatically win.<br><br>

            5. Bust: If the player's hand value exceeds 21, they bust and lose the round.<br><br>
            
            6. Dealer's Turn: Once the player stands, it's the dealer's turn. The dealer reveals their face-down card.<br><br>
            
            7. Dealer's Actions: The dealer must hit until their hand value is 17 or more. If the dealer busts, the player wins.<br><br>
            
            8. Winning: The player wins if their hand value is closer to 21 than the dealer's hand without exceeding 21. If both have the same value, it's a push (tie), and the player's bet is returned.<br><br> </div>
            
            <h2>Remember, the goal is to have fun. Good luck and have a great time playing Blackjack!</h2>`;
            styleLargeModal(modalContainer);
            break;

        case "win":
            modalMessage.textContent = `You won €${bet * 2}, Congratulations`;
            styleSmallModal(modalContainer);
            break;

        case "lose":
            modalMessage.textContent = "Dealer wins, Better luck next time";
            styleSmallModal(modalContainer);
            break;

        case "bust":
            modalMessage.textContent = "BUST, You went over 21. Dealer wins, Better luck next time";
            styleSmallModal(modalContainer);
            break;

        case "blackjack":
            modalMessage.textContent = `BLACKJACK! you have 21, You won €${bet + bet * 1.5} , Congratulations`;
            styleSmallModal(modalContainer);
            break;

        case "push":
            modalMessage.textContent = `PUSH, It's a draw with the dealer, You won €${bet}`;
            styleSmallModal(modalContainer);
            break;

        case "dealerBust":
            modalMessage.textContent = `You won €${bet * 2}, dealer bust, Congratulations`;
            styleSmallModal(modalContainer);
            break;

        case "noChips":
            modalMessage.textContent = "You do not have enought chips to place a minimum bet, Thank you for playing, please use the Play Again button to start a new game";
            styleSmallModal(modalContainer);
            break;

        case "invalidBet":
            modalMessage.textContent = "Please enter a valid betting amount in €10 increments, €10, €20, €30, etc. or use the arrows to select a betting amount";
            styleSmallModal(modalContainer);
            break;

        case "betExceedsChips":
            modalMessage.textContent = `The Bet you placed exceeded your chip count, your bet has been place at your chip count €${humanPlayer.chipCount}`;
            styleSmallModal(modalContainer);
            break;
    
        default:
            break;
    }

    //Close button
    const closeButton = document.getElementsByClassName("close")[0];
    closeButton.onclick = function() {
        modalContainer.style.display = "none";
    }

   //OK button
   modalButton.onclick = function() {
        modalContainer.style.display = "none";    
   }

}


function styleSmallModal(modalContainer) {
    modalContainer.style.display = "flex";
    modalContainer.style.justifyContent = "center";
    modalContainer.style.alignItems = "center";
}

function styleLargeModal(modalContainer) {
    modalContainer.style.display = "flex";
    modalContainer.style.justifyContent = "center";
    modalContainer.style.alignItems = "stretch";
}

//Wait for DOM to load before initialising the game 
document.addEventListener("DOMContentLoaded", function() {
    //add event listeners
    
    //begin game set up
    initialiseGame();
})


