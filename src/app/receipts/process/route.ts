
import  redis  from "../lib/redis";
import { v4 as uuidv4 } from "uuid";
import { validateReceipt } from "../lib/types";

export async function POST(request: Request){
    try{
        const receipt = await request.json();

        //error checking: check if input body is in the right form
        const validationResult = validateReceipt(receipt);
        if (!validationResult.success) {
        return new Response(
            JSON.stringify({ error: "Invalid receipt format", details: validationResult.error.errors }),
            { status: 400, headers: { "Content-Type": "application/json" } }
        );
        }

        const id = uuidv4();

        //error checking: check if data is stored into Redis
        const result = await redis.set(id, JSON.stringify(receipt));
        if (!result) {
        return new Response(
            JSON.stringify({ error: "Failed to store data in Redis" }),
            { status: 500, headers: { "Content-Type": "application/json" } }
        );
        }

        const response = {id:id};
        return new Response(JSON.stringify(response),{
            headers: {
                "Content-Type": "application/json"
            },
            status: 201
        });
    }
    catch(error){
        console.error("Error handling request:", error);
        return new Response(
          JSON.stringify({ error: "Internal Server Error" }),
          { status: 500, headers: { "Content-Type": "application/json" } }
        );
    }

}