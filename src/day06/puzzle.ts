import fs from "fs";

import { getNumberArrayFromString } from "../utils/utils";




const DAY_NUM_STRING = "06";    // must be 2 digits

const USE_TEST_INPUT: boolean = false;




/** [time, distance] */
type Game = [number, number];




export const main = () => {
    puzzle1and2();
};




const puzzle1and2 = () => {
    const inputPath = `./src/day${DAY_NUM_STRING}/${USE_TEST_INPUT ? "test-input.txt" : "input.txt"}`;
    if (!inputPath) throw "Invalid inputPath";


    const fileContents = fs.readFileSync(inputPath, "utf8");


    const stringArray = fileContents.split(/\r?\n/);
    

    const gamesArray = getGames(stringArray);


    let product = 1;

    gamesArray.forEach((game) => {
        const amount = getAmountFromGame(game);

        product *= amount;
    });


    console.log(product);
};


const getGames = (stringArray: string[]): Game[] => {
    const [timesString, distancesString] = stringArray;

    const timesArray = getNumberArrayFromString(timesString.split(":")[1]);
    const distancesArray = getNumberArrayFromString(distancesString.split(":")[1]);


    const gamesArray: Game[] = [];

    for (let i = 0; i < timesArray.length; i++) {
        gamesArray.push([timesArray[i], distancesArray[i]]);
    }


    return gamesArray;
}


const getAmountFromGame = (game: Game): number => {
    const [time, distance] = game;


    const discriminant = time * time - 4 * distance;

    const x1 = (-time + Math.sqrt(discriminant)) / (2 * -1);
    const x2 = (-time - Math.sqrt(discriminant)) / (2 * -1);

    const amount = Math.ceil(x2) - Math.floor(x1) - 1;


    return amount;
}