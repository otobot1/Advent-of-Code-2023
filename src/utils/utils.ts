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




type IntervalObject = {
    days?: number;
    hours?: number;
    minutes?: number;
    seconds: number;
}


const getIntervalObject = (milliseconds: number): IntervalObject => {
    const millisecondsPerSecond = 1000;
    const millisecondsPerMinute = millisecondsPerSecond * 60;
    const millisecondsPerHour = millisecondsPerMinute * 60;
    const millisecondsPerDay = millisecondsPerHour * 24;


    let remainder = milliseconds;

    const days = Math.floor(remainder / millisecondsPerDay);
    remainder = remainder % millisecondsPerDay;

    const hours = Math.floor(remainder / millisecondsPerHour);
    remainder = remainder % millisecondsPerHour;

    const minutes = Math.floor(remainder / millisecondsPerMinute);
    remainder = remainder % millisecondsPerMinute;

    const seconds = Math.round(remainder / millisecondsPerSecond);


    const intervalObject: IntervalObject = {
        days: days || undefined,
        hours: (days || hours) ? hours : undefined,
        minutes: (days || hours || minutes) ? minutes : undefined,
        seconds: seconds,
    }


    return intervalObject;
}


export const printProgress = (currentCount: number, totalCount: number | bigint, startTime: number): void => {
    if (totalCount > Number.MAX_SAFE_INTEGER) throw "totalCount is too large!";

    totalCount = Number(totalCount);


    const fractionalCompletion = currentCount / totalCount;
    const percentCompletion = Math.round(fractionalCompletion * 100);


    const currentTime = performance.now();

    const intervalMilliseconds = currentTime - startTime;

    const estimatedFinalIntervalTime = intervalMilliseconds / currentCount * totalCount;

    const estimatedMillisecondsToCompletion = estimatedFinalIntervalTime - intervalMilliseconds;


    const intervalObject = getIntervalObject(estimatedMillisecondsToCompletion);

    let intervalString = (intervalObject.days ? `${intervalObject.days}d ` : "");
    intervalString += (intervalObject.hours || intervalObject.days ? (intervalObject.hours && intervalObject.hours >= 10 ? `${intervalObject.hours}:` : `0${intervalObject.hours}:`) : "");
    intervalString += (intervalObject.minutes || intervalObject.hours || intervalObject.days ? (intervalObject.minutes && intervalObject.minutes >= 10 ? `${intervalObject.minutes}:` : `0${intervalObject.minutes}:`) : "");
    intervalString += `${intervalObject.seconds >= 10 ? intervalObject.seconds : `0${intervalObject.seconds}`}${intervalObject.minutes ? "." : "s."}`;


    console.log(`${currentCount}/${totalCount} - ${percentCompletion}%. Estimated time to completion: ${intervalString}`);
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