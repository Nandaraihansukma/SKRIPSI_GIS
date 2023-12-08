import prisma from "../lib/prisma";
import bcrypt from "bcrypt";
// import ind_kabkota from "./INDKabKota.json";
import prov_idn from "./provinsi.json";
import deforest from "./Deforestasi-Indonesia.json";
// import geo_data from "./Data pekerjaan alumni.json";
import { Prisma } from "@prisma/client";
import { writeFileSync } from "fs";


interface GeoDataInput {
    tahun: number,
    provinsi: string,
    kawasan_hutan: number,
    bukan_kawasan_hutan: number,
    total_deforestasi: number,
}
interface GeoLocInput {
    geoId: number,
    name: string,
    geojs: Prisma.InputJsonValue
    geodatas: { create?: GeoDataInput[] }
}
/**
 * Polygon Provinsi Indah
 * @returns 
 */
function indjson() {
    const { features } = prov_idn;
    const ind = features.map((item) => {
        const temp: GeoLocInput = {
            geoId: Number(item.properties.prov_id),
            name: item.properties.name,
            geojs: item,
            geodatas: {
                create: undefined
            }
        }
        return temp
    });
    return { ind };
}
/**
 * Data Indah
 * @returns 
 */
function deforestasijson() {
    const data = deforest;
    const res = data.map((item) => {
        const temp: GeoDataInput = {
            tahun: item.tahun,
            provinsi: item.provinsi,
            kawasan_hutan: item.kawasan_hutan,
            bukan_kawasan_hutan: item.bukan_kawasan_hutan,
            total_deforestasi: item.total_deforestasi,
        }
        return temp
    });
    return { res };
}

/**
 * Point Nanda
 * @returns 
 */
// function datajson() {
//     const data = geo_data;
//     const ind = data.map((item) => {
//         const temp: GeoLocInput = {
//             geoId: Number(item.npm),
//             name: item.nama,
//             geojs: {
//                 type: "Feature",
//                 geometry: {
//                     type: "Point",
//                     coordinates: [item.longitude, item.latitude]
//                 },
//                 properties: {
//                     npm: item.npm,
//                     nama: item.nama
//                 }
//             }
//         }
//         return temp
//     });
//     return { ind };
// }

async function main() {
    const { ind } = indjson();
    const { res } = deforestasijson();

    // Convert to prisma input
    const prismageodata = res as Prisma.GeoDataCreateManyInput[];
    ind.forEach(element => {
        const resfilter = prismageodata.filter((elem) => elem.provinsi == element.name);
        element.geodatas.create = resfilter;
    });
    const prismageoloc = ind as Prisma.GeoLocationCreateInput[];

    // Drop Collection
    try {
        const dropuser = await prisma.$runCommandRaw({
            drop: "User",
        });
        const dropgeoloc = await prisma.$runCommandRaw({
            drop: "GeoLocation",
        });
        const dropgeodata = await prisma.$runCommandRaw({
            drop: "GeoData",
        });
    } catch (error: any) {
        // console.log(error);
    }

    // Insert Account
    const rand1 = await bcrypt.genSalt(10);
    const johndoe = await prisma.user.create({
        data: {
            email: 'johndoe19@email.com',
            name: 'John Doe',
            password: await bcrypt.hash('johndoe123', rand1),
            salt: rand1
        },
    })
    const rand2 = await bcrypt.genSalt(10);
    const janedoe = await prisma.user.create({
        data: {
            email: 'janedoe19@email.com',
            name: 'Jane Doe',
            password: await bcrypt.hash('janedoe123', rand2),
            salt: rand2
        },
    })

    // Insert Geoloc and Geodata
    for (let i = 0; i < prismageoloc.length; i++) {
        const gjs = await prisma.geoLocation.create({
            data: prismageoloc[i]
        });
    }

    // Build Geo Index
    const geoidx = await prisma.$runCommandRaw({
        createIndexes: "GeoLocation",
        indexes: [
            {
                key: {
                    "geojs.geometry": "2dsphere"
                },
                name: "geospat"
            }
        ]
    });
    // const geofind = await prisma.geoLocation.findRaw({
    //     filter: {
    //         geometry: {
    //             $geoWithin: {
    //                 $geometry: {
    //                     type: "Polygon",
    //                     coordinates: [[[0, 0], [3, 6], [6, 1], [0, 0]]]
    //                 }
    //             }
    //         }
    //     }
    // });
}
main()
    .then(async () => {
        await prisma.$disconnect()
    })
    .catch(async (e) => {
        console.error(e)
        await prisma.$disconnect()
        process.exit(1)
    })