import fs from "fs";




const USE_TEST_INPUT: boolean = false;




export const main = () => {
    puzzle2();
};




const puzzle1 = () => {
    const inputPath = `./src/day01/${USE_TEST_INPUT ? "test-input.txt" : "input.txt"}`;
    if (!inputPath) throw "Invalid inputPath";


    const fileContents = fs.readFileSync(inputPath, "utf8");


    const stringArray = fileContents.split(/\r?\n/);


    let sum = 0;

    stringArray.forEach(
        (rowString) => {
            let firstNumber: number | undefined = undefined;
            let lastNumber: number | undefined = undefined;

            [...rowString].forEach(
                (char) => {
                    const numberCandidate = Number(char);

                    if (isNaN(numberCandidate)) return;

                    if (firstNumber === undefined) firstNumber = numberCandidate;

                    lastNumber = numberCandidate;
                }
            );

            if (firstNumber === undefined || lastNumber === undefined) throw "undefined";

            const combinedString = `${firstNumber}${lastNumber}`;

            const combinedNumber = Number(combinedString);

            if (isNaN(combinedNumber)) throw "combinedNumber is NaN";

            sum += combinedNumber;
        }
    );


    console.log(sum);
};




const puzzle2 = () => {
    const inputPath = `./src/day01/${USE_TEST_INPUT ? "test-input.txt" : "input.txt"}`;
    if (!inputPath) throw "Invalid inputPath";


    const fileContents = fs.readFileSync(inputPath, "utf8");


    const stringArray = fileContents.split(/\r?\n/);


    let sum = 0;

    stringArray.forEach(
        (rowString) => {
            const [firstNumber, lastNumber] = parseRow(rowString);

            if (firstNumber === undefined || lastNumber === undefined) throw "undefined";

            const combinedString = `${firstNumber}${lastNumber}`;

            const combinedNumber = Number(combinedString);

            if (isNaN(combinedNumber)) throw "combinedNumber is NaN";

            sum += combinedNumber;
        }
    );


    console.log(sum);
};




/** [firstNumber, lastNumber] */
const parseRow = (rowString: string): [number, number] => {
    let firstNumber: number | undefined;
    let lastNumber: number | undefined;

    for (let i = 0; i < rowString.length;) {
        let num: number | undefined;


        const numberCandidate = Number(rowString.charAt(i));

        if (!isNaN(numberCandidate)) {
            num = numberCandidate;
            i++;
        }
        else {
            const [numberCandidate, nextIncrement] = checkForNumberWords(rowString.slice(i));

            if (numberCandidate !== null) num = numberCandidate;

            i += nextIncrement;
        }


        if (num === undefined) continue;

        if (firstNumber === undefined) firstNumber = num;

        lastNumber = num;
    }


    if (firstNumber === undefined) throw "firstNumber is undefined";
    if (lastNumber === undefined) throw "lastNumber is undefined";

    return [firstNumber, lastNumber];
};




/** [foundNumber, nextIncrement] */
const checkForNumberWords = (trimmedRowString: string): [number | null, number] => {
    switch (trimmedRowString.slice(0, 3)) {
        case "one": {
            return [1, 3];
        }
        case "two": {
            return [2, 3];
        }
        case "six": {
            return [6, 3];
        }
    }


    switch (trimmedRowString.slice(0, 4)) {
        case "four": {
            return [4, 4];
        }
        case "five": {
            return [5, 4];
        }
        case "nine": {
            return [9, 4];
        }
    }


    switch (trimmedRowString.slice(0, 5)) {
        case "three": {
            return [3, 5];
        }
        case "seven": {
            return [7, 5];
        }
        case "eight": {
            return [8, 5];
        }
    }


    return [null, 1];
};