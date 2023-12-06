import fs from "fs";
import { isEmptyString, getNumberFromString } from "~/utils/utils";




const DAY_NUM_STRING = "04";    // must be 2 digits

const USE_TEST_INPUT: boolean = false;




type CardRecord = {
    cardIdNumber: number;
    matchingNumberCount: number;
    totalCopies: number;
};


/** key === cardIdNumber */
type CardRecordCollection = {
    [key: number]: CardRecord;
};




export const main = () => {
    puzzle2();
};




const puzzle1 = () => {
    const inputPath = `./src/day${DAY_NUM_STRING}/${USE_TEST_INPUT ? "test-input.txt" : "input.txt"}`;
    if (!inputPath) throw "Invalid inputPath";


    const fileContents = fs.readFileSync(inputPath, "utf8");


    const stringArray = fileContents.split(/\r?\n/);


    const gameScoresArray: number[] = stringArray.map((rowString) => parseGame(rowString, false));


    const sum = gameScoresArray.reduce(
        (previousValue, currentValue) => previousValue + currentValue,
        0,
    );


    console.log(sum);
};




const puzzle2 = () => {
    const inputPath = `./src/day${DAY_NUM_STRING}/${USE_TEST_INPUT ? "test-input.txt" : "input.txt"}`;
    if (!inputPath) throw "Invalid inputPath";


    const fileContents = fs.readFileSync(inputPath, "utf8");


    const stringArray = fileContents.split(/\r?\n/);


    const cardRecordCollection: CardRecordCollection = {};

    stringArray.forEach((rowString) => parseGame(rowString, true, cardRecordCollection));


    const totalCardCount = getTotalCardCount(cardRecordCollection);


    console.log(totalCardCount);
};




const parseGame = <
    IsPartTwo extends boolean,
    ReturnType extends (
        IsPartTwo extends false ?
        number :
        void
    ),
>(
    rowString: string,
    isPartTwo: boolean,
    cardRecordCollection?: CardRecordCollection,
): ReturnType => {
    const [cardAndIdString, combinedNumbersString] = rowString.split(":");

    const [winningNumbersString, myNumbersString] = combinedNumbersString.split("|");


    const winningNumbersArray = winningNumbersString.trim().split(" ").filter((value) => !isEmptyString(value)).map((numString) => getNumberFromString(numString));

    const myNumbersArray = myNumbersString.trim().split(" ").filter((value) => !isEmptyString(value)).map((numString) => getNumberFromString(numString));


    const matchingNumbersArray = myNumbersArray.filter((num) => winningNumbersArray.includes(num));

    const matchingNumberCount = matchingNumbersArray.length;


    let cardScore: number;

    if (matchingNumberCount > 0) {
        cardScore = 2 ** (matchingNumberCount - 1);
    }
    else {
        cardScore = 0;
    }


    if (!isPartTwo) {
        return cardScore as ReturnType;
    }


    if (cardRecordCollection === undefined) throw "must provide cardRecords for part two";


    const [_cardString, cardIdString] = cardAndIdString.split(" ").filter((value) => !isEmptyString(value));

    const cardIdNumber = Number(cardIdString);

    if (isNaN(cardIdNumber)) throw `cardIdNumber "${cardIdString} is NaN`;


    if (cardRecordCollection[cardIdNumber] !== undefined) throw `cardRecord already exists for card "${cardIdNumber}"`;


    cardRecordCollection[cardIdNumber] = { cardIdNumber, matchingNumberCount, totalCopies: 1 };


    return undefined as ReturnType;
};


const getTotalCardCount = (cardRecordCollection: CardRecordCollection): number => {
    const cardRecordArray = Object.values(cardRecordCollection);
    const cardRecordCollectionSize = cardRecordArray.length;


    cardRecordArray.forEach((currentCardRecord) => addCopies(currentCardRecord, cardRecordCollection, cardRecordCollectionSize));


    const totalCardCount = cardRecordArray.reduce(
        (currentSum, currentCardRecord) => currentSum += currentCardRecord.totalCopies,
        0,
    );


    return totalCardCount;
};


const addCopies = (currentCardRecord: CardRecord, cardRecordCollection: CardRecordCollection, cardRecordCollectionSize: number): void => {
    const {cardIdNumber, matchingNumberCount} = currentCardRecord;


    for (let i = 1; i <= matchingNumberCount; i++) {
        const id = cardIdNumber + i;

        if (id > cardRecordCollectionSize) throw `id "${id}" > cardRecordCollectionSize "${cardRecordCollectionSize}"`;


        const card = cardRecordCollection[id];

        if (card === undefined) throw `card for id "${id}" is undefined`;


        card.totalCopies += currentCardRecord.totalCopies;
    }
}


// const getTotalCardCount = (cardRecordCollection: CardRecordCollection): number => {
//     const cardRecordArray = Object.values(cardRecordCollection);
//     const cardRecordCollectionSize = cardRecordArray.length;

    
//     for (let outerIndex = 1; outerIndex <= cardRecordCollectionSize; outerIndex++) {
//         const currentCardRecord = cardRecordCollection[outerIndex];

//         if (currentCardRecord === undefined) throw `currentCardRecord is undefined for outerIndex = "${outerIndex}"`;


//         const {cardIdNumber, matchingNumberCount} = currentCardRecord;

//         if (cardIdNumber !== outerIndex) throw `cardIdNumber "${cardIdNumber}" !== outerIndex "${outerIndex}"`;

//         for (let i = 1; i <= matchingNumberCount; i++) {
//             const id = cardIdNumber + i;

//             if (id > cardRecordCollectionSize) throw `id "${id}" > cardRecordCollectionSize "${cardRecordCollectionSize}"`;


//             const card = cardRecordCollection[id];

//             if (card === undefined) throw `card for id "${id}" is undefined`;


//             card.totalCopies += currentCardRecord.totalCopies;
//         }
//     }


//     const totalCardCount = cardRecordArray.reduce(
//         (currentSum, currentCardRecord) => currentSum += currentCardRecord.totalCopies,
//         0,
//     );


//     return totalCardCount;
// };