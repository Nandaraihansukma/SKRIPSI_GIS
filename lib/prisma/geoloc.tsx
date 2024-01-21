import prisma from ".";

// export async function getGeoLocs() {
//   try {
//     // Ambil data geoLocation
//     const geoLocations = await prisma.geoLocation.findMany();

//     // Ambil data geoData
//     const geoData = await prisma.geoData.findMany();

//     // Lakukan join atau penggabungan data
//     const joinedData = geoLocations.map((location) => {
//       // Dapatkan geodatas dari geoData yang sesuai dengan geoLocation
//       const geodatas = geoData.filter((data) => data.geoloc_id === location.id);
//       return {
//         ...location,
//         geodatas,
//         _count: { geodatas: geodatas.length }, // Atur _count sesuai jumlah geodatas
//       };
//     });

//     return { res: joinedData };
//   } catch (error) {
//     return { error };
//   }
// }

export async function getGeoLocs(tahun: number) {
  try {
      const res = await prisma.geoLocation.findMany({
          include: {
              geodatas: {
                  where: {
                      tahun: tahun,
                  }
              },
              _count:{
                select:{
                  geodatas:{
                    where:{
                      tahun:tahun
                    }
                  }
                }
              }
          }
      })
      return { res };
  } catch (error) {
      return { error };
  }
}

// export async function getGeoLocs(tahun_mulai: number) {
//   try {
//       const res = await prisma.geoLocation.findMany({
//           include: {
//               geodatas: {
//                   where: {
//                       tahun: tahun_mulai,
//                   }
//               }
//           }
//       })
//       return { res };
//   } catch (error) {
//       return { error };
//   }
// }

export async function findGeoCompByPoint(lat: number, lng: number) {
  try {
    const res = await prisma.geoLocation.findRaw({
      filter: {
        "geojs.geometry": {
          $geoIntersects: {
            $geometry: {
              type: "Point",
              coordinates: [lng, lat],
            },
          },
        },
      },
    });
    return { res };
  } catch (error) {
    return { error };
  }
}
