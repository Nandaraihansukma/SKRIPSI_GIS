import { getGeoLocs } from "@/lib/prisma/geoloc";
import { revalidatePath } from "next/cache";
import { NextRequest } from "next/server";

export async function GET(request: NextRequest) {
    try {
        const { res, error } = await getGeoLocs();
        if (error) {
            return Response.json({ message: "internal server error" }, { status: 500 });
        }
        revalidatePath('/');
        return Response.json({ data: res }, { status: 200 });
    } catch (error) {
        return Response.json({ message: "internal server error" }, { status: 500 });
    }
}
