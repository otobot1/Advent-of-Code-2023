import fs from "fs";




export const main = () => {
    puzzle1And2();
}




const puzzle1And2 = () => {
    const inputPath = `${process.env.PROJECT_ROOT}/src/day01/input.txt`;
    if (!inputPath) throw "Invalid inputPath";


    const fileContents = fs.readFileSync(inputPath, "utf8");


    const stringArray = fileContents.split(/\r?\n/);
}