import { z } from "zod";

// const ItemSchema = z.object({
//     shortDescription: z.string(),
//     price: z.string().transform((val) => Number(val)),
// });

// export const ReceiptSchema = z.object({
//     retailer: z.string(),
//     purchaseDate: z.string().transform((val) => new Date(val)),
//     purchaseTime: z.string().regex(/^([01]\d|2[0-3]):[0-5]\d$/, "Invalid time format, expected 24-hour format (HH:MM)"),
//     total: z.string().transform((val) => Number(val)),
//     items: z.array(ItemSchema),
// });

const ItemSchema = z.object({
    shortDescription: z.string(),
    price: z.string().regex(/^\d+\.\d{2}$/, "Invalid price format, expected two decimal places"),
});

export const ReceiptSchema = z.object({
    retailer: z.string(),
    purchaseDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Invalid date format, expected YYYY-MM-DD"),
    purchaseTime: z.string().regex(/^([01]\d|2[0-3]):[0-5]\d$/, "Invalid time format, expected 24-hour format (HH:MM)"),
    total: z.string().regex(/^\d+\.\d{2}$/, "Invalid total format, expected two decimal places"),
    items: z.array(ItemSchema).min(1),
});


export type Receipt = z.infer<typeof ReceiptSchema>;

export function validateReceipt(data: unknown) {
    return ReceiptSchema.safeParse(data);
}