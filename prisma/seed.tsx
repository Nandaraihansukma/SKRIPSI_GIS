import prisma from "../lib/prisma";
import bcrypt from "bcrypt";
import ind_kabkota from "./INDKabKota.json";
// import prov_idn from "./provinsi.json";
import geo_data from "./data-pekerjaan-alumni-fix.json";
import { Prisma } from "@prisma/client";

interface GeoDataInput {
  npm: Number;
  instansi_bekerja: String;
  tahun: number;
  Alamat: String;
  provinsi: String;
  Kab_kota: String;
  latitude: Number;
  longitude: Number;
  posisi_bekerja: String;
  mulai_bekerja: String | Date;
  besaran_gaji?: String;
  kesesuaian?: String;
  informasi_loker: String;
  nama: String;
  image_url: String
}
interface GeoLocInput {
  geoId: number;
  name: string;
  geojs: Prisma.InputJsonValue;
  geodatas: { create?: GeoDataInput[] };
}
/**
 * Polygon Provinsi Nanda
 * @returns
 */
function indjson() {
  const {features} = ind_kabkota as any;
  const ind = features.map((item:any) => {
    const temp: GeoLocInput = {
      geoId: Number(item.properties.ID_2),
      name: item.properties.NAME_2,
      geojs: item,
      geodatas: {
        create: undefined,
      },
    };
    return temp;
  });
  return { ind };
}

/**
 * Point Nanda
 * @returns
 */
// function dataalumnijson() {
//   const data = geo_data;
//   const res = data.map((item) => {
//     const temp: GeoDataInput = {
//       npm: item.npm,
//       instansi_bekerja: item.instansi_bekerja,
//       Alamat: item.Alamat,
//       provinsi: item.provinsi,
//       latitude: item.latitude,
//       longitude: item.longitude,
//       posisi_bekerja: item.posisi_bekerja,
//       mulai_bekerja: new Date(item.mulai_bekerja),
//       besaran_gaji: item.besaran_gaji,
//       kesesuaian: item.kesesuaian,
//       informasi_loker: item.informasi_loker,
//       nama: item.nama,
//     };
//     return temp;
//   });
//   return { res };
// }

function dataalumnijson() {
  const data = geo_data;
  const res = data.map((item) => {
    let besaranGaji: string | undefined = item.besaran_gaji;
    // Jika besaran_gaji tidak tersedia, atur menjadi empty string ("")
    if (!besaranGaji) {
      besaranGaji = "";
    }

    let kesesuaian: string | undefined = item.kesesuaian;
    // Jika kesesuaian tidak tersedia, atur menjadi empty string ("")
    if (!kesesuaian) {
      kesesuaian = "";
    }

    const temp: GeoDataInput = {
      npm: item.npm,
      instansi_bekerja: item.instansi_bekerja,
      tahun: item.tahun,
      Alamat: item.Alamat,
      provinsi: item.provinsi,
      Kab_kota: item.Kab_kota,
      latitude: item.latitude,
      longitude: item.longitude,
      posisi_bekerja: item.posisi_bekerja,
      mulai_bekerja: new Date(item.mulai_bekerja),
      besaran_gaji: besaranGaji,
      kesesuaian: kesesuaian,
      informasi_loker: item.informasi_loker,
      nama: item.nama,
      image_url: item.image_url,
    };
    return temp;
  });
  return { res };
}


async function main() {
  const { ind } = indjson();
  const { res } = dataalumnijson();

  // Convert to prisma input
  const prismageodata = res as Prisma.GeoDataCreateManyInput[];
  ind.forEach((element:any) => {
    const resfilter = prismageodata.filter(
      (elem) => elem.Kab_kota == element.name
    );
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
  const admin = await prisma.user.create({
    data: {
      email: "admin@gmail.com",
      name: "admin",
      password: await bcrypt.hash("admin123", rand1),
      salt: rand1,
    },
  });

  // Insert Geoloc and Geodata
  for (let i = 0; i < prismageoloc.length; i++) {
    const gjs = await prisma.geoLocation.create({
      data: prismageoloc[i],
    });
  }

  // Build Geo Index
  const geoidx = await prisma.$runCommandRaw({
    createIndexes: "GeoLocation",
    indexes: [
      {
        key: {
          "geojs.geometry": "2dsphere",
        },
        name: "geospat",
      },
    ],
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
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
