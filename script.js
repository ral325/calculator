// constants
const calculatorScreen = document.querySelector("#screen");
const MAX_DECIMALS = 5;

const numberKeys = Array.from(document.querySelectorAll(".number-key"));
const operatorKeys = Array.from(document.querySelectorAll(".operator-key"));

let calcValue = 0;
let lastButtonClicked;
let lastOperatorClicked;
let lastNumberClicked;

// add event listeners
for (let i = 0; i<numberKeys.length; i++) {
    numberKeys[i].addEventListener("click",clickNumber);
}

for (let i = 0; i<operatorKeys.length; i++) {
    operatorKeys[i].addEventListener("click",clickOperator);
}

// listener functions
function clickNumber() {
    let numberClicked = parseInt(convertNumberIdToNumberString(this.id));
    console.log("Number clicked: " + numberClicked);

    // if you click an number after having just clicked a number, update display, but do not update calcValue
    if (lastButtonClicked !== undefined && (lastWasNumberKey() || lastButtonClicked.id === "dot")) {
        updateScreen(calculatorScreen.textContent + numberClicked.toString());
    } else {
        //update screen before doing operations but do not change calcValue
        updateScreen(numberClicked);
        //console.log("else branch")
    }

    lastNumberClicked = this;
    lastButtonClicked = this;
    logCurrentCalcValue();
}

function clickOperator() {
    let operatorClickedId = this.id;
    console.log("Operator clicked: " + operatorClickedId);
    console.log("Last operator clicked: " + (lastOperatorClicked !== undefined ? lastOperatorClicked.id : "undefined"));

    switch (operatorClickedId) {
        case "clear":
            // if we hit clear, nothing else matters, just clear it.
            calcValue = 0;
            updateScreen(calcValue);
            break;
        case "enter":
            enterClicked();
            break;
        case "dot":
            dotClicked();
            break;
        default: // any other operator:
            // if an operator is clicked twice in a row
            if (lastWasOperatorKey()) {
                //console.log("Last button clicked was an operator.")
                if (lastOperatorClicked.id !== "enter") {
                    //finish calculation
                    console.log("Two operators in a row (last was not enter).")
                    calcValue = operate(lastOperatorClicked.id,calcValue,getDisplayValue());
                    updateScreen(calcValue);                                                                  
                } else {
                    // last operator was enter
                    // set calc value to display value
                    calcValue = getDisplayValue();
                }
                                                                        
            //if an operator is clicked after a number key
            } else if (lastWasNumberKey()) {
                // if there was an operation before this number, do that calc and update the screen
                // but if there was a clear, enter, or undefined, update calc value to display value
                if (lastOperatorClicked === undefined || lastOperatorClicked.id === "enter" || lastOperatorClicked.id === "clear" || lastOperatorClicked.id === "dot") {
                    calcValue = getDisplayValue();
                } else {
                    calcValue = operate(lastOperatorClicked.id,calcValue,getDisplayValue());
                    updateScreen(calcValue);
                }

            } else if (lastButtonClicked === undefined) {
                // no change to screen
                console.log("This is the first time we clicked a button! (I hope...)")
            } else {
                // should never reach this case
                throw "HOW IS THIS POSSIBLE???";
            }
            break;
    }

    if (operatorClickedId !== "dot") {
        // don't update if it is a dot
        lastOperatorClicked = this;
    }
    lastButtonClicked = this;
    logCurrentCalcValue();
}

// calculator basic functions
function add(a,b) {
    return a+b;
}

function subtract(a,b) {
    return a-b;
}

function multiply(a,b) {
    return a*b;
}

function divide(a,b) {
    return (b === 0 ? "LMAYO" : a/b);
}

function clear() {
    return 0;
}

function operate(operator,a,b) {
    switch (operator){
        case "add":
            return add(a,b);
        case "subtract":
            return subtract(a,b);
        case "multiply":
            return multiply(a,b);
        case "divide":
            return divide(a,b);
    }
}

// HELPER FUNCTIONS
function convertNumberIdToNumberString(id) {
    return id.slice(1,2);
}

function getDisplayValue() { //return display value as a NUMBER!
    return parseFloat(calculatorScreen.textContent);
}

function logCurrentCalcValue() {
    console.log("Current calc value = " + calcValue);
    console.log()
}

function updateScreen(value) {
    // if it's a number in string form and doesn't end in a period, convert it to a number
    if (typeof value === "string") {//} && value[value.length - 1] === ".") {
        // do not adjust
    //} else if (typeof value === "string" && value[value.length - 1] === "0") {
        // do not adjust
    } else if (!isNaN(value) ) {
        value = Number(value.toFixed(MAX_DECIMALS));
    }
    calculatorScreen.textContent = value;
    console.log("Screen updating to: " + value);
}

function lastWasNumberKey() {
    return numberKeys.indexOf(lastButtonClicked) > -1;
}

function lastWasOperatorKey() {
    return operatorKeys.indexOf(lastButtonClicked) > -1;
}

function enterClicked() {
    if (lastOperatorClicked === undefined) {
        calcValue = getDisplayValue();
        console.log("single enter");
    } else if (lastOperatorClicked.id === "clear") {
        calcValue = getDisplayValue();
        console.log("single enter");
    } else if (lastOperatorClicked.id !== "enter" && lastWasNumberKey()) {
        // if we hit enter, last operator was not enter, and last button was a number key
        calcValue = operate(lastOperatorClicked.id,calcValue,getDisplayValue());
        console.log("single enter")
        updateScreen(calcValue);
    } else if (lastOperatorClicked.id === "enter") {
        console.log("double enter")
        // set calc value to display value (wipe)
        calcValue = getDisplayValue();
    } else {
        console.log("not reachable enterClicked branch")
    }
}

function dotClicked() {
    if (lastWasOperatorKey() && lastOperatorClicked.id !== "clear" && lastOperatorClicked.id !== "enter") {
        // dot doesnt get registered as operator, so if you clicked dot after operator, always treat like 0
        updateScreen("0.");
    } else if (lastWasOperatorKey()) {
        if (getDisplayValue().toString().indexOf(".") < 0) {
            // just add a dot to the display value
            updateScreen(getDisplayValue() + ".");
        } else {
            // do nothing, you can't have multiple dots on screen
            console.log("double dot");
        }
    } else if (lastWasNumberKey()) {
        if (getDisplayValue().toString().indexOf(".") < 0) {
            // just add a dot to the display value
            updateScreen(getDisplayValue() + ".");
        } else {
            // do nothing, you can't have multiple dots on screen
            console.log("double dot");
        }
    } else if (lastButtonClicked === undefined) {
        updateScreen("0.");
    } else {
        console.log("jesus stop reaching these impossible branches.")
    }
}