
// ESTADO
const state = {
    score: {
        playerScore: 0,
        computerScore: 0,
        scoreBox: document.getElementById("score_points"),
    },
    cardSprites: {
        avatar: document.getElementById("card-image"),
        name: document.getElementById("card-name"),
        type: document.getElementById("card-type"),

    },
    fieldCards: {
        player: document.getElementById("player-field-card"),
        computer: document.getElementById("computer-field-card"),
    },

    playerSides: {
    player1: "player-cards",
    player1Box:  document.querySelector("#player-cards"),
    computer: "computer-cards",
    computerBox:  document.querySelector("#computer-cards"),
},

    actions: {
        button: document.getElementById("next-duel"),
    },
};

const playerSides = {
    player1: "player-cards",
    computer: "computer-cards",
};


const pathImages = "./src/assets/icons/";
const cardData = [
    {
        id: 0,
        name: "Blue Eyes White Dragon",
        type: "Paper 🖐",
        img: `${pathImages}dragon.png`,
        WinOf: [1],//A CARTA GANHA DO...
        LoseOf: [2],// A CARTA PERDE PARA...
    },
    {
        id: 1,
        name: "Dark Magician",
        type: "Rock 🌑",
        img: `${pathImages}magician.png`,
        WinOf: [2],//A CARTA GANHA DO...
        LoseOf: [0],// A CARTA PERDE PARA...
    },
    {
        id: 2,
        name: "Exodia",
        type: "Scissors ✌",
        img: `${pathImages}exodia.png`,
        WinOf: [0],//A CARTA GANHA DO...
        LoseOf: [1],// A CARTA PERDE PARA...
    },
];

async function getRandomCardId() {
    const randomIndex = Math.floor(Math.random() * cardData.length);
    return cardData[randomIndex].id;
}

async function createCardImagem(IdCard, fieldSide) {
    const cardImage = document.createElement("img");
    cardImage.setAttribute("height", "100px");
    cardImage.setAttribute("src", "./src/assets/icons/card-back.png");
    cardImage.setAttribute("data-id", IdCard);
    cardImage.classList.add("card");

    if (fieldSide === playerSides.player1) {
      
        cardImage.addEventListener("mouseover", () => {
            drawSelectCard(IdCard);

        });

          cardImage.addEventListener("click", () => {
            setCardsField(cardImage.getAttribute("data-id"));
        });
    }



    return cardImage;
}

async function setCardsField(cardId) {

    await removeAllCardsTmages();

    let computerCardId = await getRandomCardId();

    await showHiddenCardFieldsImages(true);

    await hiddenCardDetails();

    await drawCradsInField(cardId, computerCardId)
  

    let duelResults = await checkDuelResults(cardId, computerCardId);

    await updateScore();
    await drawButton(duelResults)
    
}

async function drawCradsInField(cardId, computerCardId) {
    state.fieldCards.player.src = cardData[cardId].img;
    state.fieldCards.computer.src = cardData[computerCardId].img;

    
}

async function showHiddenCardFieldsImages(value) {
    if(value === true) {
    state.fieldCards.player.style.display = "block";
    state.fieldCards.computer.style.display = "block";
    } 

    if(value === false) {
    state.fieldCards.player.style.display = "none";
    state.fieldCards.computer.style.display = "none";
    
    }
    
}


async function hiddenCardDetails() {
    state.cardSprites.avatar.src = "";
    state.cardSprites.name.innerText = "";
    state.cardSprites.type.innerText = "";
    
}
async function drawButton(text) {
    state.actions.button.innerText = text.toUpperCase();
    state.actions.button.style.display = "block"
    
}

async function updateScore() {
    state.score.scoreBox.innerText = `
    Win: ${state.score.playerScore} | Lose: ${state.score.computerScore}
    `;
    
}

async function checkDuelResults(playerCardId, computerCardId){
    let duelResults = "Draw"
    let playerCard = cardData[playerCardId];

    if(playerCard.WinOf.includes(computerCardId)) {
        duelResults = "Win";
      
        state.score.playerScore++;
    }

     if(playerCard.LoseOf.includes(computerCardId)) {
        duelResults = "Lose";
       
        state.score.computerScore++;
    }
    
     await playAudio(duelResults);

    return duelResults;
    
}
async function removeAllCardsTmages() {

    let {computerBox, player1Box } = state.playerSides;

    let imgElements = computerBox.querySelectorAll("img")
    imgElements.forEach((img) => img.remove());

    imgElements = player1Box.querySelectorAll("img")
    imgElements.forEach((img) => img.remove());


    
}
async function drawSelectCard(index) {
    
    state.cardSprites.avatar.src = cardData[index].img
    state.cardSprites.name.innerText = cardData[index].name
    state.cardSprites.type.innerText = "Attibute : " + cardData[index].type
    
    
}
async function drawCrads(cardNumbers, fieldSide) {
    for (let i = 0; i < cardNumbers; i++) {
        const randomIdCard = await getRandomCardId();
        const cardImage = await createCardImagem(randomIdCard, fieldSide);

        console.log(fieldSide)
        document.getElementById(fieldSide).appendChild(cardImage)
    }

}

async function resetDuel() {
    state.cardSprites.avatar.src = "";
    state.actions.button.style.display = "none";

    state.fieldCards.player.style.display = "none";
    state.fieldCards.computer.style.display = "none";

    init()
}


async function playAudio(status) {
    const audio = new Audio(`./src/assets/audios/${status}.wav`);

 try {
       audio.play();
 } catch {}
    
}
function init() {

    showHiddenCardFieldsImages(false)
    
    drawCrads(5, playerSides.player1);
    drawCrads(5, playerSides.computer);

    const bgm = document.getElementById("bgm");
    bgm.play();
}

init()
