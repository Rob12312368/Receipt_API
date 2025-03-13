import  redis  from "../../lib/redis";
import { ReceiptSchema, Receipt } from "../../lib/types";
import { z } from "zod";

const uuidSchema = z.string().uuid(); 

type tParams = Promise<{ id: string }>;

export async function GET(req: Request, { params }: { params: tParams }) {
    try {
        const { id } = await params;
  
        //error checking: check if uuid is in the right form
        if (!uuidSchema.safeParse(id).success) {
            return new Response(
            JSON.stringify({ error: "Invalid UUID format" }),
            { status: 400, headers: { "Content-Type": "application/json" } }
            );
        }
  
        const rawData = await redis.get(id);

        //error checking: check if data can be found in redis
        if (!rawData) {
            return new Response(
            JSON.stringify({ error: `Receipt with id ${id} not found` }),
            { status: 404, headers: { "Content-Type": "application/json" } }
            );
        }

        const receipt = ReceiptSchema.parse(JSON.parse(rawData));
        const points = countPoints(receipt);
  
        return new Response(
            JSON.stringify({ points }),
            { status: 200, headers: { "Content-Type": "application/json" } }
        );
    
    } catch (error) {
        console.error(" Unexpected Error:", error);
        return new Response(
            JSON.stringify({ error: "Internal Server Error" }),
            { status: 500, headers: { "Content-Type": "application/json" } }
        );
    }
}
  
function countPoints(receipt: Receipt): number {

    const retailer = receipt.retailer;
    const purchaseDate = new Date(receipt.purchaseDate);
    const purchaseTime = receipt.purchaseTime;
    const total = parseFloat(receipt.total);
    const items = receipt.items.map((item) => ({
        ...item,
        price: parseFloat(item.price)
    }));
    
    let points = 0;

    //One point for every alphanumeric character in the retailer name.
    const alphanumericMatches = retailer.match(/[a-z0-9]/gi);
    if (alphanumericMatches) {
        points += alphanumericMatches.length;
    }
  
    //50 points if the total is a round dollar amount with no cents.
    if (Number.isInteger(total)) {
        points += 50;
    }
  
    //25 points if the total is a multiple of 0.25.
    if (Number.isInteger(total * 4)) {
        points += 25;
    }

    //5 points for every two items on the receipt
    points += Math.floor(items.length / 2) * 5;
  
    //If the trimmed length of the item description is a multiple of 3, multiply the price by 0.2 and round up to the nearest integer. The result is the number of points earned.
    for (const item of items) {
        const trimmedLength = item.shortDescription.trim().length;
        if (trimmedLength % 3 === 0) {
            points += Math.ceil(item.price * 0.2);
        }
    }

    //6 points if the day in the purchase date is odd.
    if (purchaseDate.getUTCDate() % 2 === 1) {
        points += 6;
    }

    //10 points if the time of purchase is after 2:00pm and before 4:00pm.
    const [hourStr, minuteStr] = purchaseTime.split(":");
    const hours = parseInt(hourStr, 10);
    const minutes = parseInt(minuteStr, 10);
    const totalMinutes = hours * 60 + minutes;
    if (totalMinutes > 14 * 60 && totalMinutes < 16 * 60) {
        points += 10;
    }
  
    return points;
}
  