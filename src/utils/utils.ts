import fs from "fs";




export const writeOutputToFile = (outputFilePath: string, outputString: string, maxFileIndex = 10, fileIndex = 0): void => {
    try {
        if (outputFilePath.endsWith(".txt")) outputFilePath = outputFilePath.slice(0, outputFilePath.length - ".txt".length);


        let alteredPath = `${outputFilePath}.txt`;


        if (fileIndex) alteredPath = `${outputFilePath}${fileIndex}.txt`;


        fs.writeFileSync(alteredPath, outputString, { flag: "wx" });
    }
    catch (error) {
        if (fileIndex < maxFileIndex) {
            fileIndex++;

            writeOutputToFile(outputFilePath, outputString, maxFileIndex, fileIndex);
        }
        else throw "maxFileIndex reached";
    }
}




export const isEmptyString = (string: string): boolean => {
    if (string === "") return true;

    return false;
};


export const getNumberFromString = (numString: string): number => {
    const num = Number(numString);

    if (isNaN(num)) throw `numString "${numString}" is NaN`;

    return num;
};




/** default delimiter = " " */
export const getNumberArrayFromString = (string: string, delimiter = " "): number[] => {
    const stringArray = string.trim().split(delimiter);

    const numStringArray = stringArray.filter((value) => !isEmptyString(value));

    const numArray = numStringArray.map((value) => getNumberFromString(value));

    return numArray;
}