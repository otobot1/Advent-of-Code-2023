import fs from "fs";




const DAY_NUM_STRING = "02";    // must be 2 digits

const USE_TEST_INPUT: boolean = false;

const RED_CUBE_COUNT = 12;
const GREEN_CUBE_COUNT = 13;
const BLUE_CUBE_COUNT = 14;




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
        (rowString) => {
            const [gameAndIdString, fullGameRecordString] = rowString.split(":");

            if (isGamePossible(fullGameRecordString)) {
                const [_gameString, gameIdString] = gameAndIdString.split(" ");

                const gameIdNumber = Number(gameIdString);

                if (isNaN(gameIdNumber)) throw "gameIdNumber is NaN";


                sum += gameIdNumber;
            }
        }
    );


    console.log(sum);
};


const isGamePossible = (fullGameRecordString: string): boolean => {
    return fullGameRecordString.split(/,|;/).every(
        (revealedCubesString) => isRevealedCubesStringPossible(revealedCubesString)
    );
};


const isRevealedCubesStringPossible = (revealedCubesString: string): boolean => {
    const [cubeCountString, cubeColourString] = revealedCubesString.trim().split(" ");

    const cubeCountNumber = Number(cubeCountString);

    if (isNaN(cubeCountNumber)) throw "cubeCountNumber is NaN";


    switch (cubeColourString) {
        case "red": {
            return cubeCountNumber <= RED_CUBE_COUNT;
        }
        case "green": {
            return cubeCountNumber <= GREEN_CUBE_COUNT;
        }
        case "blue": {
            return cubeCountNumber <= BLUE_CUBE_COUNT;
        }
        default: {
            throw `no match for cubeColourString "${cubeColourString}"`;
        }
    }
};




const puzzle2 = () => {
    const inputPath = `./src/day${DAY_NUM_STRING}/${USE_TEST_INPUT ? "test-input.txt" : "input.txt"}`;
    if (!inputPath) throw "Invalid inputPath";


    const fileContents = fs.readFileSync(inputPath, "utf8");


    const stringArray = fileContents.split(/\r?\n/);


    let sum = 0;

    stringArray.forEach(
        (rowString) => {
            const [_gameAndIdString, fullGameRecordString] = rowString.split(":");

            const [redCubeMinimum, greenCubeMinimum, blueCubeMinimum] = getMinimumCubeCounts(fullGameRecordString);

            const power = redCubeMinimum * greenCubeMinimum * blueCubeMinimum;

            sum += power;
        }
    );


    console.log(sum);
};


const getMinimumCubeCounts = (fullGameRecordString: string): [number, number, number] => {
    let redCubeMinimum = 0;
    let greenCubeMinimum = 0;
    let blueCubeMinimum = 0;

    fullGameRecordString.split(/,|;/).forEach(
        (revealedCubesString) => {
            const [cubeCountString, cubeColourString] = revealedCubesString.trim().split(" ");
        
            const cubeCountNumber = Number(cubeCountString);
        
            if (isNaN(cubeCountNumber)) throw "cubeCountNumber is NaN";


            switch (cubeColourString) {
                case "red": {
                    if (cubeCountNumber > redCubeMinimum) redCubeMinimum = cubeCountNumber;

                    break;
                }
                case "green": {
                    if (cubeCountNumber > greenCubeMinimum) greenCubeMinimum = cubeCountNumber;

                    break;
                }
                case "blue": {
                    if (cubeCountNumber > blueCubeMinimum) blueCubeMinimum = cubeCountNumber;

                    break;
                }
                default: {
                    throw `no match for cubeColourString "${cubeColourString}"`;
                }
            }
        }
    )


    return [redCubeMinimum, greenCubeMinimum, blueCubeMinimum];
}