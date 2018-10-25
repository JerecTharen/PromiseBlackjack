
class TheCards {
    constructor(deckID,pOneCards,pOneScore,pTwoCards,pTwoScore){
        this.deckID = deckID;
        this.pOneCards = pOneCards;
        this.pOneScore = pOneScore;
        this.pTwoCards = pTwoCards;
        this.pTwoScore = pTwoScore;
    }
}
class Card {
    constructor(value,img,points){
        this.value = value;
        this.img = img;
        this.points = points;
    }
}

let theDeck = undefined;


function newDeck(){
    return new Promise( (resolve,reject) => {
        $.ajax({
            url: "https://deckofcardsapi.com/api/deck/new/shuffle/?deck_count=1",
            type: "GET",
            success: (response, status) => {
                resolve(response);
            },
            error: (error)=>{
                reject(error);
            }
        })
    });
}

function drawCard (deckID, count){
    return new Promise( (resolve, reject) => {
        $.ajax({
            url: `https://deckofcardsapi.com/api/deck/${deckID}/draw/?count=${count}`,
            type: "GET",
            success: (response,status) => {
                resolve(response);
            },
            error: (error) => {
                reject(error);
            }
        });
    });
}

let deckProm = newDeck();
deckProm.then(data => {

    theDeck = new TheCards(data.deck_id,[],0,[],0);

    drawCard(data.deck_id, 4).then(cardData => {

        theDeck.pOneCards.push(new Card(cardData.cards[0].code,cardData.cards[0].image,cardData.cards[0].value));
        theDeck.pOneCards.push(new Card(cardData.cards[1].code,cardData.cards[1].image,cardData.cards[1].value));

        theDeck.pTwoCards.push(new Card(cardData.cards[2].code,cardData.cards[2].image,cardData.cards[2].value));
        theDeck.pTwoCards.push(new Card(cardData.cards[3].code,cardData.cards[3].image,cardData.cards[3].value));
        draw();

    });

});

function hit(player){
    deckProm.then((data)=>{
        drawCard(theDeck.deckID,1).then((cardData)=>{
            player.push(new Card(cardData.cards[0].code,cardData.cards[0].image,cardData.cards[0].value));
            draw();
        })
    })
}

function aNewDeck(){
    deckProm = newDeck();
    deckProm.then(data => {
        theDeck = undefined;
        theDeck = new TheCards(data.deck_id,[],0,[],0);

        drawCard(data.deck_id, 4).then(cardData => {

            theDeck.pOneCards.push(new Card(cardData.cards[0].code,cardData.cards[0].image,cardData.cards[0].value));
            theDeck.pOneCards.push(new Card(cardData.cards[1].code,cardData.cards[1].image,cardData.cards[1].value));

            theDeck.pTwoCards.push(new Card(cardData.cards[2].code,cardData.cards[2].image,cardData.cards[2].value));
            theDeck.pTwoCards.push(new Card(cardData.cards[3].code,cardData.cards[3].image,cardData.cards[3].value));
            draw();

        });

    });
}


function cardValue(theCard,ace){
    let theVal = 0;
    switch(theCard){
        case "2":
            theVal = 2;
            break;
        case "3":
            theVal = 3;
            break;
        case "4":
            theVal = 4;
            break;
        case "5":
            theVal = 5;
            break;
        case "6":
            theVal = 6;
            break;
        case "7":
            theVal = 7;
            break;
        case "8":
            theVal = 8;
            break;
        case "9":
            theVal = 9;
            break;
        case "0":
            theVal = 10;
            break;
        case "JACK":
            theVal = 10;
            break;
        case "QUEEN":
            theVal = 10;
            break;
        case "KING":
            theVal = 10;
            break;
        case "ACE":
            theVal = ace;
            break;
    }
    return theVal;
}

function givePoints(player,score){
    let points = 0;
    points += score;
    // score -= score;
    for(let i = 0; i < player.length;i++){
        points += cardValue(player[i].points,11);
    }
    if (points > 21){
        points = 0;
        for (let x = 0; x < player.length;x++){
           points += cardValue(player[x].points,1);
        }
    }
    return points;
}

function draw(){
    let oneCards = document.getElementById('pOneCards');
    let twoCards = document.getElementById('pTwoCards');
    let allCards = "";
    for(let i = 0; i < theDeck.pOneCards.length; i++){
        allCards += '<img src="./back.png" alt="a card">';
    }
    oneCards.innerHTML = allCards;
    allCards = "";
    for(let x = 0; x < theDeck.pTwoCards.length; x++){
        allCards += '<img src="./back.png" alt="a card">';
    }
    twoCards.innerHTML = allCards;
    for (let y = 0; y < 2; y++){
        document.getElementsByTagName('h3')[y].innerHTML = "Score: ";
    }
}

function show(pNum,playerCards){
    let DOMCards = document.getElementById(pNum);
    let allCards = "";
    // for(let i = 0; i < playerCards.length; i++){
    //     allCards += "<img src='./back.png' alt='a card'>";
    // }
    // DOMCards.innerHTML = allCards;
    draw();
    let i = (function(){
            if (playerCards === theDeck.pOneCards){
                return 0;
            }
            else{
                return theDeck.pOneCards.length;
            }
    })();
    for(let x = i; x < i + playerCards.length; x++){
        document.getElementsByTagName('img')[x].setAttribute('src',`${playerCards[x-i].img}`);
    }

    if (playerCards === theDeck.pOneCards){
        theDeck.pOneScore = givePoints(playerCards,theDeck.pOneScore);
        document.getElementById('pOneScore').innerHTML = `Score: ${theDeck.pOneScore}`;
    }
    else{
        theDeck.pTwoScore = givePoints(playerCards,theDeck.pTwoScore);
        document.getElementById('pTwoScore').innerHTML = `Score: ${theDeck.pTwoScore}`;
    }



    // givePoints
}
