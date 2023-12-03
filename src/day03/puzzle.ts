import fs from "fs";




const DAY_NUM_STRING = "03";    // must be 2 digits

const USE_TEST_INPUT: boolean = false;




export const main = () => {
    puzzle2();
};




const puzzle1 = () => {
    const inputPath = `./src/day${DAY_NUM_STRING}/${USE_TEST_INPUT ? "test-input.txt" : "input.txt"}`;
    if (!inputPath) throw "Invalid inputPath";


    const fileContents = fs.readFileSync(inputPath, "utf8");


    const stringArray = fileContents.split(/\r?\n/);


    let sum = 0;

    stringArray.forEach(
        (_, yIndex) => {
            sum += handleRowPart1(yIndex, stringArray);
        }
    );


    console.log(sum);
};


const handleRowPart1 = (yIndex: number, stringArray: string[]): number => {
    const maxWidth = stringArray[0].length;


    const rowString = stringArray[yIndex];


    let sum = 0;
    let leftXIndex = -1;
    let rightXIndex = -1;

    for (let xIndex = 0; xIndex < maxWidth; xIndex++) {
        const cellString = rowString.charAt(xIndex);

        const num = Number(cellString);

        if (leftXIndex === -1) {
            if (isNaN(num)) continue;   // keep searching for start of a number


            leftXIndex = xIndex;
            rightXIndex = xIndex;
        }
        else {
            if (!isNaN(num)) {  // keep searching for end of the number
                rightXIndex = xIndex;

                if (xIndex < maxWidth - 1) continue;    // if at end of row, number must end here
            }


            const fullNumberString = rowString.slice(leftXIndex, rightXIndex + 1);

            const fullNumber = Number(fullNumberString);

            if (isNaN(fullNumber)) throw `fullNumber "${fullNumberString}" is NaN`;


            if (isPartNumber(leftXIndex, rightXIndex, yIndex, stringArray, fullNumber, sum)) sum += fullNumber;


            leftXIndex = -1;
            rightXIndex = -1;
        }
    };


    return sum;
};


const isPartNumber = (leftXIndex: number, rightXIndex: number, yIndex: number, stringArray: string[], _fullNumber: number, _sum: number): boolean => {
    const maxWidth = stringArray[0].length;
    const maxHeight = stringArray.length;

    for (let y = yIndex - 1; y <= yIndex + 1; y++) {
        if (y < 0) continue;

        if (y >= maxHeight) continue;


        const rowString = stringArray[y];

        for (let x = leftXIndex - 1; x <= rightXIndex + 1; x++) {
            if (x < 0) continue;

            if (x >= maxWidth) continue;


            const cellString = rowString.charAt(x);

            if (cellString !== "." && isNaN(Number(cellString))) return true;   // cell is a symbol
        }
    }


    return false;   // no symbols found
};




const puzzle2 = () => {
    const inputPath = `./src/day${DAY_NUM_STRING}/${USE_TEST_INPUT ? "test-input.txt" : "input.txt"}`;
    if (!inputPath) throw "Invalid inputPath";


    const fileContents = fs.readFileSync(inputPath, "utf8");


    const stringArray = fileContents.split(/\r?\n/);


    let sum = 0;

    stringArray.forEach(
        (_, yIndex) => {
            sum += handleRowPart2(yIndex, stringArray);
        }
    );


    console.log(sum);
};


const handleRowPart2 = (yIndex: number, stringArray: string[]): number => {
    const maxWidth = stringArray[0].length;


    const rowString = stringArray[yIndex];


    let sum = 0;

    [...rowString].forEach(
        (char, xIndex) => {
            if (char !== "*") return;


            const gearRatio = getGearRatio(xIndex, yIndex, stringArray);


            if (gearRatio !== null) sum += gearRatio;
        }
    );


    return sum;
};


const getGearRatio = (xIndex: number, yIndex: number, stringArray: string[]): number | null => {
    let gearRatio: number | undefined = undefined;
    let partNumberCount = 0;


    for (let y = yIndex - 1; y <= yIndex + 1; y++) {
        if (y < 0) continue;


        const rowString = stringArray[y];
        let leftXIndex = -1;
        let rightXIndex = -1;

        for (let x = xIndex - 1; x <= xIndex + 1; x++) {
            if (x < 0) continue;


            const cellString = rowString.charAt(x);

            const isNumber = !isNaN(Number(cellString));


            switch (x) {
                case xIndex - 1: {
                    if (isNumber) leftXIndex = findLeftSideOfNumber(x, rowString);

                    if (y === yIndex) rightXIndex = x;

                    break;
                }
                case xIndex: {
                    if (y === yIndex) continue;

                    if (isNumber) {
                        if (leftXIndex === -1) leftXIndex = x;
                    }
                    else if (leftXIndex !== -1) {
                        rightXIndex = x - 1;
                    }

                    break;
                }
                case xIndex + 1: {
                    if (isNumber) {
                        if (leftXIndex === -1) leftXIndex = x;

                        rightXIndex = findRightSideOfNumber(x, rowString, y);
                    }
                    else if (leftXIndex !== -1) {
                        rightXIndex = x - 1;
                    }

                    break;
                }
                default: {
                    throw "default case reached. this shouldn't happen.";
                }
            }


            if (leftXIndex !== -1 && rightXIndex !== -1) {
                partNumberCount++;

                if (partNumberCount > 2) return 0;


                const numString = rowString.slice(leftXIndex, rightXIndex + 1);

                const num = Number(numString);

                if (isNaN(num)) throw `numString "${numString}" is NaN`;


                if (gearRatio === undefined) gearRatio = num;
                else gearRatio *= num;


                leftXIndex = -1;
                rightXIndex = -1;
            }
        }
    }


    if (partNumberCount === 2 && gearRatio) return gearRatio;
    else return 0;
};


const findLeftSideOfNumber = (x: number, rowString: string): number => {
    for (let currentX = x - 1; currentX >= 0; currentX--) {
        let isStartOfRow = false;

        if (currentX === 0) isStartOfRow = true;


        const cellString = rowString.charAt(currentX);

        if (!isNaN(Number(cellString))) {
            if (isStartOfRow) return 0;

            continue;
        }


        return currentX + 1;
    }


    throw "for loop exited. this shouldn't be possible";
};


const findRightSideOfNumber = (x: number, rowString: string, _y: number): number => {
    const maxWidth = rowString.length;

    for (let currentX = x + 1; currentX < maxWidth; currentX++) {
        let isEndOfRow = false;

        if (currentX === maxWidth - 1) isEndOfRow = true;


        const cellString = rowString.charAt(currentX);

        if (!isNaN(Number(cellString))) {
            if (isEndOfRow) return currentX;

            continue;
        }


        return currentX - 1;
    }


    throw "for loop exited. this shouldn't be possible";
};