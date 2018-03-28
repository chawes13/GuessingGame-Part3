//Model
function Game(){
    this.winningNumber = generateWinningNumber();
    this.playersGuess = null;
    this.pastGuesses = [];
}

Game.prototype.playersGuessSubmission = function(guess){
    if(typeof guess === "number" && guess >= 1 && guess <= 100){
        this.playersGuess = guess;
        return this.checkGuess();
    } else {
        throw "That is an invalid guess.";
    }
}

Game.prototype.checkGuess = function(){
    if(this.playersGuess === this.winningNumber){
        return "You Win!";
    } else if(this.pastGuesses.includes(this.playersGuess)){
        return "You have already guessed that number. Guess Again!";
    } else {
        this.pastGuesses.push(this.playersGuess);
        if(this.pastGuesses.length === 5){
            return "You Lose.";
        } else{
            return this.indicateDirection(this.difference());
        }
    }
}

//Refactored checkGuess to make it more readable
Game.prototype.indicateDirection = function(diff){
    if(diff < 10){
        return "You're burning up!";
    } else if(diff < 25){
        return "You're lukewarm.";
    } else if(diff < 50){
        return "You're a bit chilly.";
    } else {
        return "You're ice cold!";
    }
}

Game.prototype.difference = function(){
    return Math.abs(this.playersGuess - this.winningNumber);
}

Game.prototype.isLower = function(){
    return this.playersGuess < this.winningNumber;
}

Game.prototype.provideHint = function(){
    return shuffle([this.winningNumber, generateWinningNumber(), generateWinningNumber()]);
}

//Helper Functions
function newGame(){
    return new Game();
}

//Generates winning numbers (inclusive of both min and max)
function generateWinningNumber(){
    return Math.floor(Math.random()*100 + 1);
}

//Manipulates same array
function shuffle(arr){
    var m = arr.length, t, i;
    while(m){
        i = Math.floor(Math.random()*m--);
        t = arr[m];
        //Put the randomly selected element into the back of deck
        arr[m] = arr[i];
        //Put the current element back into i to be shuffled
        arr[i] = t;
    }
    return arr;
}

/*
    jQuery DOM Manipulation

*/

var game = newGame();

$(document).ready(function(){

    var title = $("#title");
    var subtitle = $("#subtitle");
    var resetBtn = $("#reset");
    var helpBtn = $("#help");
    var submitBtn = $("#submit");
    var playerInput = $("#player-input");
    var hint = game.provideHint(); //Only show one hint per game, otherwise it is too easy to cheat the system

    //listeners
    submitBtn.on('click', evaluateGuess);
    $('body').on('keypress', function(e){
        if(e.which === 13){
            evaluateGuess();
        }
    });

    resetBtn.on('click', function(){
        game = newGame();
        title.text("Play the Guessing Game!");
        subtitle.text("Guess a number between 1-100!");
        playerInput.val("");
        $(".guess").find("li").text("-");
        enableInputs(true);
        hint = game.provideHint();
    });

    helpBtn.on('click', function(){
        title.text("The winning number is " +hint[0]+ ", "+hint[1]+", or " +hint[2]);
    });

    //Controller
    function evaluateGuess(){
        try{
            var result = game.playersGuessSubmission(+playerInput.val());
            displayResults(result);
        } catch(e){
            console.log(e);
            title.text("An invalid guess was entered. Guess again!");
            playerInput.val(""); 
        }
    }
    
    function displayResults(result){
        
        title.text(result);
       
        if(result.includes("Win")){
            endGame(true);
        } else {
            if(result.includes("Lose")){
                endGame(false);
            } else {
                game.isLower() ? subtitle.text("Guess Higher!") : subtitle.text("Guess Lower!");
            }
            
            var length = game.pastGuesses.length;
            $("#guesses").find(".guess").find(":nth-child("+length+")").text(game.pastGuesses[length - 1]);
            playerInput.val("");
        }
    }
    
    function endGame(won){
        if(won){
            playerInput.val(game.playersGuess);
        } 
        subtitle.text("Click the 'Reset' button to play again!");
        enableInputs(false);
    }

    function enableInputs(enable){
        if(enable){
            playerInput.removeAttr('disabled');
            submitBtn.removeAttr('disabled');
            helpBtn.removeAttr('disabled');
        } else {
            playerInput.attr('disabled', true);
            submitBtn.attr('disabled', true);
            helpBtn.attr('disabled', true);
        }
    }

});
