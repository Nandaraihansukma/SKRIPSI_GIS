import { getGeoLocs } from "@/lib/prisma/geoloc";
import { revalidatePath } from "next/cache";
import { NextRequest } from "next/server";

export const dynamic = 'force-dynamic'
export const fetchCache = 'force-no-store'

// export async function GET(request: NextRequest) {
//     try {
//         const { res, error } = await getGeoLocs();
//         if (error) {
//             return Response.json({ message: "internal server error" }, { status: 500 });
//         }
//         revalidatePath('/');
//         return Response.json({ data: res }, { status: 200 });
//     } catch (error) {
//         return Response.json({ message: "internal server error" }, { status: 500 });
//     }
// }

// export async function GET(request: NextRequest) {
//     try {
//         const year = Number(request.nextUrl.searchParams.get('year') != undefined ? request.nextUrl.searchParams.get('year') : 2013);
//         const { res, error } = await getGeoLocs(year);
//         if (error) {
//             return Response.json({ message: "internal server error" }, { status: 500 });
//         }
//         return Response.json({ data: res }, { status: 200 });
//     } catch (error) {
//         return Response.json({ message: "internal server error" }, { status: 500 });
//     }
// }


export async function GET(request: NextRequest) {
    try {
        const year = Number(request.nextUrl.searchParams.get('year') != undefined ? request.nextUrl.searchParams.get('year') : 2012);
        const { res, error } = await getGeoLocs(year);
        if (error) {
            return Response.json({ message: "internal server error" }, { status: 500 });
        }
        return Response.json({ data: res }, { status: 200 });
    } catch (error) {
        return Response.json({ message: "internal server error" }, { status: 500 });
    }
}