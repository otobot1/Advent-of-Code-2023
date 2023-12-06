import fs from "fs";

import { getNumberArrayFromString, printProgress } from "../utils/utils.js";




const DAY_NUM_STRING = "05";    // must be 2 digits

const USE_TEST_INPUT: boolean = false;




type MapEntry = [number, number, number];

type Map = MapEntry[];




export const main = () => {
    puzzle2();
};




const puzzle1 = () => {
    const inputPath = `./src/day${DAY_NUM_STRING}/${USE_TEST_INPUT ? "test-input.txt" : "input.txt"}`;
    if (!inputPath) throw "Invalid inputPath";


    const fileContents = fs.readFileSync(inputPath, "utf8");


    const stringArray = fileContents.split(/\r?\n/);


    const [seedNumbers, mapArray] = getSeedsAndMaps(stringArray);


    const locationArray: number[] = getLocationNumbers(seedNumbers, mapArray);


    const lowestLocation = locationArray.reduce(
        (previousValue, currentValue) => {
            if (currentValue < previousValue) return currentValue;

            return previousValue;
        },
        Infinity,
    );


    console.log(lowestLocation);
};




const puzzle2 = () => {
    const inputPath = `./src/day${DAY_NUM_STRING}/${USE_TEST_INPUT ? "test-input.txt" : "input.txt"}`;
    if (!inputPath) throw "Invalid inputPath";


    const fileContents = fs.readFileSync(inputPath, "utf8");


    const stringArray = fileContents.split(/\r?\n/);


    const [seedNumbers, mapArray] = getSeedsAndMaps(stringArray);


    const lowestLocation = getLowestLocation(seedNumbers, mapArray);


    console.log(lowestLocation);
};




const getSeedsAndMaps = (stringArray: string[]): [number[], Map[]] => {
    const [seedsRowString, emptyRowString, ...trimmedStringArray] = stringArray;

    if (emptyRowString !== "") throw "emptyRowString is not an empty string";


    const [_seedString, seedNumbersString] = seedsRowString.split(":");

    const seedNumbers = getNumberArrayFromString(seedNumbersString);


    const mapArray = getMapArray(trimmedStringArray);


    return [seedNumbers, mapArray];
};


const getMapArray = (trimmedStringArray: string[]): Map[] => {
    const mapArray: Map[] = [];

    let currentMap: Map = [];

    trimmedStringArray.forEach(
        (rowString) => {
            const firstCharacter = rowString.charAt(0);
            const isNumber = !isNaN(Number(firstCharacter));

            if (firstCharacter === "") {    // empty row
                if (currentMap.length === 0) throw "currentMap is empty";


                mapArray.push(currentMap);


                currentMap = [];
            }
            else if (isNumber) {    // mapEntry
                const mapEntry = getNumberArrayFromString(rowString);

                assertsIsMapEntry(mapEntry);


                currentMap.push(mapEntry);
            }
            else {  // text row
                return;
            }
        }
    );


    // handle last map
    if (currentMap.length === 0) throw "currentMap is empty for the last map";

    mapArray.push(currentMap);


    return mapArray;
};


function assertsIsMapEntry(numberArray: number[]): asserts numberArray is MapEntry {
    if (numberArray.length !== 3) throw `numberArray is the wrong length. length = "${numberArray.length}"`;
};




const getLocationNumbers = (seedNumbers: number[], mapArray: Map[]): number[] => {
    const locationNumbers = mapArray.reduce(
        (oldNumbers, currentMap) => {   // oldNumbers = return value of previous callback. currentMap = current array element
            const newNumbers = applyMap(oldNumbers, currentMap);

            if (newNumbers.length !== seedNumbers.length) throw "the count of numbers has changed";

            return newNumbers;
        },
        [...seedNumbers],   // initial value (used as "oldNumbers" for the first element)
    );


    return locationNumbers;
};


const applyMap = (oldNumbers: number[], currentMap: Map): number[] => {
    const newNumbers = oldNumbers.map(
        (oldNum) => getNewNum(oldNum, currentMap, false)
    );


    return newNumbers;
};


const getNewNum = (oldNumber: number, currentMap: Map, isDirectionReversed: boolean): number => {
    let newNumber = oldNumber;

    currentMap.forEach(
        (currentMapEntry) => {
            const [destinationRangeStart, sourceRangeStart, rangeLength] = currentMapEntry;


            const mappedDestinationRangeStart = isDirectionReversed ? sourceRangeStart : destinationRangeStart;
            const mappedSourceRangeStart = isDirectionReversed ? destinationRangeStart : sourceRangeStart;


            if (oldNumber >= mappedSourceRangeStart && oldNumber < mappedSourceRangeStart + rangeLength) {
                if (oldNumber !== newNumber) throw "attempted to apply a second mapEntry to newNumber";

                const offset = oldNumber - mappedSourceRangeStart;

                newNumber = mappedDestinationRangeStart + offset;
            }
        }
    );


    return newNumber;
};




const getLowestLocation = (seedNumbers: number[], mapArray: Map[]): number => {
    const startTime = performance.now();

    
    const reversedMapArray = mapArray.toReversed();
    const limit = 20000000000;

    for (let currentLocationNumber = 1; currentLocationNumber < limit; currentLocationNumber++) {
        const currentSeedNumber = reversedMapArray.reduce(
            (oldNumber, currentMap, _i) => getNewNum(oldNumber, currentMap, true),
            currentLocationNumber,
        );


        for (let index = 0; index < seedNumbers.length; index += 2) {
            const seedRangeStart = seedNumbers[index];
            const seedRangeLength = seedNumbers[index + 1];

            if (currentSeedNumber >= seedRangeStart && currentSeedNumber < seedRangeStart + seedRangeLength) return currentLocationNumber;
        }


        if (currentLocationNumber % 1000000 === 0) printProgress(currentLocationNumber,limit, startTime);
    }


    throw "no valid locations found";
};