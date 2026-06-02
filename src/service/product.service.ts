import fs from "fs";
import path from "path";

const filePath = path.join(process.cwd(), "./src/database/db.json");

export const readProducts = () => {
    // console.log(process.cwd());
    // console.log(filePath);
    const products = fs.readFileSync(filePath, "utf-8");
    // console.log(products.toString());
    // console.log(products);
    return JSON.parse(products);
}

export const insertProducts = (payload: any) => {
    fs.writeFileSync(filePath, JSON.stringify(payload));
}