/* jshint esversion: 8, esnext: false*/ /* This sets the correct configuration for the JSHint validator*/

//////////////////////////////// CLASSES //////////////////////////////
/**
 * Represents a player in the game.
 * @class
 */
class Player {
    /**
     * Creates a new player instance.
     * Initialises the player's hand, handValue and isBust status.
     */
    constructor(){
        this.hand = [];
        this.handValue = 0;
        this.isBust = false;
    }
    
    /**
     * Adds a card to he display of a player's hand. 
     * @param {string} elementId - The ID of the HTML element which hold the card image.
     * @param {boolean} hideFirstCard - Flag to hide the dealers hole card.
     * @param {string} position - Position to add card image, used to show dealers hole card.
     */
    addCardToDisplay(elementId, hideFirstCard = false, position = "last") {
        //Target the div that we will display cards in 
        const cardContainer = document.getElementById(elementId);
        
        //Create and append the image based on the position passed in 
        const cardImg = document.createElement('img');
        if (position === "last") {
            cardImg.src = `assets/images/playing-card-images/${hideFirstCard ? "card-back" : this.hand[this.hand.length - 1]}.webp`;
            cardImg.alt = `Image of a playing card, value ${this.hand[this.hand.length - 1]}`;
            
            //Append the card image to element
            cardContainer.appendChild(cardImg);  
        } else {
            //Target the first child image
            const firstChild = cardContainer.firstChild;
            cardImg.src = `assets/images/playing-card-images/${hideFirstCard ? "card-back" : this.hand[0]}.webp`;
            cardImg.alt = `Image of a playing card, value ${this.hand[0]}`;

            //Delete first card and insert new
            cardContainer.insertBefore(cardImg, firstChild);
            cardContainer.removeChild(firstChild);
        } 
    }

    /**
     * Calculates the value of a players hand.
     * Updates the players handValue property.
     */
    calculateHandValue() {
        this.handValue = 0; //reset to clear any prev value
        const faceCards = ['j','q','k'];
        let numAces = 0;

        for (let i = 0; i < this.hand.length; i++) {
            const cardValue = this.hand[i];
            if (this.hideFirstCardValue && i === 0) {
                //Don't add value for dealer hidden card
            } else if (faceCards.some(faceCard => cardValue.includes(faceCard))) { //do we have a face card
                this.handValue += 10;
            } else if (this.hand[i].includes ('a')) {
                //Check if we have aces and keep count
                numAces ++;
            } else {
                //Add value for norm cards
                this.handValue += parseInt(this.hand[i].slice(0, this.hand[i].length - 1));
            }
        }
        
        //Add value for aces card based on not busting player
        for (let i = 0; i < numAces; i++) {
            if (this.handValue + 11 > 21) {
                this.handValue += 1;
            } else {
                this.handValue += 11;
            }
        }
    }

    /**
     * Displays the player's hand value.
     * @param {string} elementId - The ID of the HTML element that will display the hand value.
     */
    displayHandValue(elementId) {
        document.getElementById(elementId).textContent = this.handValue;
    }

    /**
     * Checks if the player's hand value is bust (greater than 21). 
     * @returns 
     */
    checkBust() {
        return this.handValue > 21;
    }

    /**
     * Resets player's handValue and hand for the next round.
     * @param {string} cardContainerId - ID of the HTML element that holds player's cards. 
     * @param {string} handValueContainerId - ID of the HTML element that displays the hand value.
     */
    resetHand(cardContainerId, handValueContainerId) {
        //Clear handValue and display
        this.handValue = 0;
        this.displayHandValue(handValueContainerId);
        
        //Clear card values from hand 
        this.hand = [];
        
        //Target the div that we will display empty cards in 
        const cardContainer = document.getElementById(cardContainerId);
        
        //Clear out any placeholder images
        cardContainer.innerHTML = "";
        
        //Create and append the image of card backs
        for (let i = 0; i < 2; i++) {
            const cardImg = document.createElement('img');
            cardImg.src = "assets/images/playing-card-images/card-back.webp";
            cardImg.alt = "Image of the back of a playing card, it is red.";

            //append the card image to element
            cardContainer.appendChild(cardImg);  
        }        
    }

    /**
     * Clears Player's cards (used to clear face down cards).
     * @param {string} elementId - The ID of the HTML element that holds the player's cards.
     */
    clearCards(elementId)
    {
        //Target the div that we will display empty cards in 
        const cardContainer = document.getElementById(elementId);

        //Clear out any placeholder images
        cardContainer.innerHTML = "";
    }

    /**
     * Gets the value of the player's hand.
     * @returns {number} The current value of the player's hand.
     */
    getHandValue(){
        return this.handValue;
    }
}

/**
 * Represents the dealer in the game, inheriting from Player class.
 * @class
 * @extends Player
 */
class Dealer extends Player {
    /**
     * Creates a new Dealer instance.
     * Initialises the dealer's deck, number of cards in the deck and hideFirstCardValue flag.
     */
    constructor() {
        super();
        this.deck = [];
	    this.noOfCardsInDeck = 52;
        this.hideFirstCardValue = true;
    }   

    /**
     * Creates a new set of cards in the dealer's deck. 
     */
    newDeck() {
        //Logic to build a new deck
        this.deck = []; //Clear deck for when we create a new deck mid game
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

    /**
     * Shuffles the dealer's deck using the Fisher yates method.
     */
    shuffleDeck() {
        for (let i = this.deck.length -1; i > 0; i--) {
            let j = Math.floor(Math.random() * (i+1));
            let k = this.deck[i];
            this.deck[i] = this.deck[j];
            this.deck[j] = k;
        }
    }

    /**
     * Deals a card to a specific player
     * @param {Player} player - The player that the cards will be dealt to (dealer or humanPlayer). 
     */
    dealCard(player) {
        let card = this.deck.pop();
        player.hand.push(card);
    }

    /**
     * Hides the value of the dealers hole (first) card.
     */
    hideHoleCardValue() {
        this.hideFirstCardValue = true;
    }

    /**
     * Shows the value of the dealers hole (first) card.
     */
    showHoleCardValue() {
        this.hideFirstCardValue = false;
    }

    /**
     * Get the number of cards remaining in dealer's deck.
     * @returns {number} - Represents current number of cards in dealer's deck. 
     */
    getNumOfCardInDeck() {
        return this.deck.length;   
    }
}

/**
 * Represents a human player in the game, inheriting from Player class
 * @class
 * @extends Player
 */
class HumanPlayer extends Player {
    /**
     * Creates a new HumanPlayer instance.
     * Initialises the human player's chip count and bet amount.
     */
    constructor() {
        super();
        this.chipCount = 1000;
        this.betAmount = 0;
    }

    /**
     * Adjusts the human player's chip count.
     * @param {number} count - The new human player chip count.
     */
    adjustChipCount(count) {
        this.chipCount = count;            
    }

    /**
     * Displays the human player's chip count.
     */
    displayChipCount() {
        document.getElementById("chip-count").textContent = this.chipCount;
    }

    /**
     * Sets the maximum bet allowed in the betting input (base on human player chip count).
     */
    setMaxBet() {
        document.getElementById("player-bet-input").max = this.chipCount;
    }

    /**
     * Check that the human player had the minimum amount to place a bet.
     * @returns {boolean} - True if player has enough chips to bet, false if not.
     */
    hasMinBetAmount() {
        return this.chipCount >= 10;
    }

    /**
     * Places human player's bet based on betting input value.
     * Validates bet, if valid Dealer then deals cards.
     * @param {Dealer} dealer - The dealer object that will deal the cards.
     */
    placeBet(dealer) {
        //Get bet amount 
        this.betAmount = parseInt(document.getElementById("player-bet-input").value);
        
        //Validate user input and place bet 
        if(isNaN(this.betAmount) || this.betAmount % 10 != 0 || this.betAmount === 0) {
            displayModal("invalidBet", this); 
        } else {
            if (this.betAmount > this.chipCount) {
                displayModal("betExceedsChips", this); 
                this.betAmount = this.chipCount;
            }
            //Adjust chip count 
            this.chipCount -= this.betAmount;
            this.displayChipCount();

            //Disable betting button and input 
            this.disableBetting();

            //Deal the cards
            startDeal(dealer, this);
        }
    }

    /**
     * Clears the bet amount, ready for a new game.
     */
    clearBet() {
        this.betAmount = 0;
    }

    /**
     * Disables the betting input and button after a human player places a bet.
     */
    disableBetting() {
        //Lock input and button and return bet to min amount
        disableBetButton();
        disableBetInput();
        resetBetAmount();
    }
 
    /**
     * Enabled the betting input and button, allowing human player to place bets again.
     */
    enableBetting() {
        enableBetButton();
        enableBetInput();
    }

    /**
     * Deals a new cards to the player and updates displayed cards (triggered by hit button).
     * @param {Dealer} dealer - The dealer object that deals the card to the human player. 
     */
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

    /**
     * Checks if the player achieves a hand value of 21 (blackjack). Only checked on his first two cards. 
     * @returns {boolean} - True if the player has blackjack, false if not.
     */
    checkForBlackjack(){
        return this.handValue === 21;
    }

    /**
     * Collects the human players winnings based on the type of win.
     * Updates human players chip count to include winnings.
     * @param {string} typeOfWin - Specifies how the player won (blackjack, push or standard).
     */
    collectWinnings(typeOfWin){
        if (typeOfWin === "blackjack"){
            this.chipCount += this.betAmount + this.betAmount * 1.5; //3:2 odds
        } else if (typeOfWin === "push") {
            this.chipCount += this.betAmount;   //Bet returned
        } else {
            this.chipCount += this.betAmount * 2; //1:1 odds
        }  
        this.displayChipCount();
    }

    /**
     * Gets the human players current betting amount 
     * @returns {number} - The players current betting amount
     */
    getBetAmount() {
        return this.betAmount;
    }
}

////////////////////////////// FUNCTIONS ////////////////////////////

//GAME CONTROL FUNCTIONS
/**
 * Initial logic only run once, at the start of a new game. 
 * It creates new dealer and human player objects, 
 * sets up event listeners and starts the gameplay.
 */
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

    //Background music and speaker icon
    //music off by default
    const speakerIcon = document.getElementById("speaker-icon");
    speakerIcon.addEventListener("click", function() {
        toggleAudio(speakerIcon);
    });

    //Begin gameplay 
    startGame(dealer, humanPlayer);
}

/**
 * Logic needed at the start of every game to reset the game state,
 * enable betting, display card back and display players chip count.
 * 
 * @param {Dealer} dealer - The dealer object in the game.
 * @param {HumanPlayer} humanPlayer - The human player object in the game.
 */
function startGame(dealer, humanPlayer) {
    //Ensure dealers first card value is hidden
    dealer.hideHoleCardValue (); 
    
    //Clear old bet 
    humanPlayer.clearBet();

    //Move focus to bet
    document.getElementById("player-bet-input").focus();
        
    //Block hit and stand buttons
    disableHitButton();
    disableStandButton();
    
    //Update max bet allowed
    humanPlayer.setMaxBet();
     
    //Display player chip count
    humanPlayer.displayChipCount();

    //Clear old cards and display card backs 
    dealer.resetHand("dealers-cards", "dealer-hand-value");
    humanPlayer.resetHand("players-cards", "player-hand-value");
    
    if (humanPlayer.hasMinBetAmount()) {
        //Enable betting
        humanPlayer.enableBetting();
    }else {
        displayModal("noChips", humanPlayer);
        displayPlayAgainButton();
    }
}

/**
 * Logic run once the player places their bet. It checks if a new deck is needed,
 * deals the cards to human player and dealer and checks for blackjack.
 * @param {Dealer} dealer - The dealer object in the game.
 * @param {HumanPlayer} humanPlayer - The human player object in the game.
 * @returns - Used to exit the gameplay if human player achieves blackjack. 
 */
async function startDeal(dealer, humanPlayer) {
    //Check if we need a new deck
    if (dealer.getNumOfCardInDeck() < 20) {
        //Build and shuffle a new deck
        dealer.newDeck();
        dealer.shuffleDeck();
    }
    
    //Dealt one by one so that we can hide the first card and add delays
    
    //Dealer 1st card no delay
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

    //Calculate and display hand counts
    dealer.calculateHandValue();
    dealer.displayHandValue("dealer-hand-value");
    humanPlayer.calculateHandValue();
    humanPlayer.displayHandValue("player-hand-value");

    //Check for blackjack (auto win)
    if (humanPlayer.checkForBlackjack()) {
        handleGameResults("blackjack", dealer, humanPlayer);
        return; //Exit function and do not enable buttons below 
    }

    //Enable hit and stand buttons
    enableHitButton();
    enableStandButton();
}

/**
 * Logic run once player stands. It plays out the dealer's turn,
 * checks who the winner is and handles the game results.
 * @param {Dealer} dealer - The dealer object in the game. 
 * @param {HumanPlayer} humanPlayer - The human player object in the game. 
 */
async function dealersPlay(dealer, humanPlayer) {
    //No more player activity
    disableHitButton();
    disableStandButton();

    //Display dealers hole card
    dealer.addCardToDisplay("dealers-cards", false, "first");

    //Show dealers hand value including hole card 
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
    
//CONTAINER FUNCTIONS
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

//REGULAR FUNCTIONS

/**
 * Delay function for use in async functions, as learned from geeksforgeeks.org.
 * 
 * @param {number} millisec - The delay time in milliseconds.
 * @returns {Promise} - A promise that resolves after the specified delay.
 */
function delay(millisec) {
    return new Promise(resolve => {setTimeout(() => {resolve ('');}, millisec);});
}

/**
 * Check who won the game, dealer or player.
 * Calls game results based on the type of win.
 * @param {Dealer} dealer - The dealer object in the game.
 * @param {HumanPlayer} humanPlayer - The human player object in the game.
 */
function checkWinner(dealer, humanPlayer) {
    const dealerValue = dealer.getHandValue();
    const playerValue = humanPlayer.getHandValue();

    //Dealer bust, player wins
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

/**
 * Handles the game results based on the game results.
 * @param {string} result - The result of the game (win, lose, push etc.)
 * @param {Dealer} dealer - The dealer object in the game. 
 * @param {HumanPlayer} humanPlayer - The human player object in the game.
 */
function handleGameResults (result, dealer, humanPlayer) {
    switch (result) {
        case "win":
            //After half a second let them know they won 
            setTimeout(() => {displayModal("win", humanPlayer);}, 500);
            humanPlayer.collectWinnings("standard");
            break;
        case "lose":
            //After half a second let them know they lost 
            setTimeout(() => {displayModal("lose", humanPlayer); }, 500);
            break;
        case "bust":
            //After half a second let them know their bust 
            setTimeout(() => {displayModal("bust", humanPlayer); }, 500);
            break;
        case "blackjack":
            //After half a second let them know they got blackjack 
            setTimeout(() => {displayModal("blackjack", humanPlayer); }, 500);
            humanPlayer.collectWinnings("blackjack");
            break;

        case "push":
            //After half a second let them know it was a draw 
            setTimeout(() => {displayModal("push", humanPlayer); }, 500);
            humanPlayer.collectWinnings("push");
            break;
        
        case "dealerBust":
            //After half a second let them know they won, dealer bust  
            setTimeout(() => {displayModal("dealerBust", humanPlayer); }, 500);
            humanPlayer.collectWinnings("standard");
            break;

        default:
            break;
    }
    //After 3 seconds restart the game 
    setTimeout(() => {startGame(dealer, humanPlayer);}, 3000); 
}

/**
 * Displays the play again button when human player does not have enough chips for min bet.
 * Hides other elements that are replaced by the play again button (chip count, betting input, place bet button).
 * It allows the human player to start a new game when they run out of chips.
 */
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

/**
 * Restarts the game (Play again button pressed) and gives player chips.
 * Hides the play again button and displays elements in its place.
 * Elements displayed are chip count, betting input and place bet button. 
 *  
 * @param {Dealer} dealer - The dealer object in the game.
 * @param {HumanPlayer} humanPlayer - The human player object in the game.
 */
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

    //Call start game
    startGame(dealer, humanPlayer);
}

function toggleAudio(speakerIcon) {
    const backgroundMusic = document.getElementById("background-music");

    if (backgroundMusic.paused) {
        backgroundMusic.play();
        toggleAudioIcon(speakerIcon, true);
    } else {
        backgroundMusic.pause();
        toggleAudioIcon(speakerIcon, false);
    }
}

function toggleAudioIcon(speakerIcon, isAudioOn) {
    if (isAudioOn) {
        speakerIcon.classList.remove("fa-volume-xmark");
        speakerIcon.classList.add("fa-volume-high");
    } else {
        speakerIcon.classList.remove("fa-volume-high");
        speakerIcon.classList.add("fa-volume-xmark");
    }
}

//MODAL FUNCTIONS 
/**
 * Displays a modal pop up with a specified message.
 * @param {string} messageType - Type of message to be displayed in the modal.
 * @param {HumanPlayer} humanPlayer - The human player object in the game. 
 */
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
            modalMessage.textContent = "You do not have enough chips to place a minimum bet, Thank you for playing, please use the Play Again button to start a new game";
            styleSmallModal(modalContainer);
            break;

        case "invalidBet":
            modalMessage.textContent = "Please enter a valid betting amount in €10 increments, €10, €20, €30, etc.";
            styleSmallModal(modalContainer);
            break;

        case "betExceedsChips":
            modalMessage.textContent = `The Bet you placed exceeded your chip count, your bet has been placed at your chip count €${humanPlayer.chipCount}`;
            styleSmallModal(modalContainer);
            break;
    
        default:
            break;
    }

    //Close button
    const closeButton = document.getElementsByClassName("close")[0];
    closeButton.onclick = function() {
        modalContainer.style.display = "none";
    };

   //OK button
   modalButton.onclick = function() {
        modalContainer.style.display = "none";    
   };
}

/**
 * Styles the modal container for a large message
 * @param {HTMLElement} modalContainer - The HTML element representing the modal container 
 */
function styleSmallModal(modalContainer) {
    modalContainer.style.display = "flex";
    modalContainer.style.justifyContent = "center";
    modalContainer.style.alignItems = "center";
}

/**
 * Styles the modal container for a small message
 * @param {HTMLElement} modalContainer - The HTML element representing the modal container 
 */
function styleLargeModal(modalContainer) {
    modalContainer.style.display = "flex";
    modalContainer.style.justifyContent = "center";
    modalContainer.style.alignItems = "stretch";
}

//Wait for DOM to load before initialising the game 
document.addEventListener("DOMContentLoaded", function() {
    //Begin game set up
    initialiseGame();
});


