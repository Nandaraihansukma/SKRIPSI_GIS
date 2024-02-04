import { getYear } from "@/lib/prisma/geodata";
import { NextRequest } from "next/server";
import { revalidatePath } from 'next/cache'


export async function GET(request: NextRequest) {
    try {
        const { res: data, error: geodataserr } = await getYear();
        if (geodataserr) {
            return Response.json({ message: "internal server error" }, { status: 500 });
        }
        revalidatePath('/')
        return Response.json({ data: data }, { status: 200 });
    } catch (error) {
        return Response.json({ message: "internal server error" }, { status: 500 });
    }
}