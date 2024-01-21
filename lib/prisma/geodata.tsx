import prisma from ".";

export async function getGeoDatas(take: number, page: number) {
  try {
    const res = await prisma.geoData.findMany({
      skip: (page - 1) * take,
      take: take,
      orderBy: [
        {
            nama: 'asc',
        },
        {
            id: 'asc',
        },
    ]
    });
    const count = await prisma.geoData.count();
    return { res, count };
  } catch (error) {
    return { error };
  }
}

export async function getGeoDataByID(id: string) {
  try {
    const res = await prisma.geoData.findFirst({
      where: {
        id: id,
      },
    });
    return { res };
  } catch (error) {
    return { error };
  }
}

export async function getGeoDataByName(
  name: string,
  take: number,
  page: number
) {
  try {
    const res = await prisma.geoData.findMany({
      skip: (page - 1) * take,
      take: take,
      where: {
        OR: [
          {
            nama: {
              contains: name,
              mode: "insensitive",
            },
          },
          {
            posisi_bekerja: {
              contains: name,
              mode: "insensitive",
            },
          },
          {
            Kab_kota: {
              contains: name,
              mode: "insensitive",
            },
          },
          {
            instansi_bekerja: {
              contains: name,
              mode: "insensitive",
            },
          },
          // {
          //   tahun: {
          //     equals: parseInt(name, 10), 
          //   },
          // },
        ],
      },
      orderBy: [
        {
          id: "asc",
        },
      ],
    });
    const count = await prisma.geoData.count({
      where: {
        OR: [
          {
            nama: {
              contains: name,
              mode: "insensitive",
            },
          },
          {
            posisi_bekerja: {
              contains: name,
              mode: "insensitive",
            },
          },
          {
            Kab_kota: {
              contains: name,
              mode: "insensitive",
            },
          },
          {
            instansi_bekerja: {
              contains: name,
              mode: "insensitive",
            },
          },
          // {
          //   tahun: {
          //     equals: parseInt(name, 10), 
          //   },
          // },
        ],
      },
      orderBy: [
        {
          id: "asc",
        },
      ]
    });
    return { res, count };
  } catch (error) {
    return { error };
  }
}

// export async function getGeoDataYear() {
//   try {
    
//     const res = await prisma.geoData.findMany({
//       select: {
//         tahun: true,
//       },
//       distinct: ['tahun'],
//     });
//       return { res };
//   } catch (error) {
//     console.log(error)
//       return { error };
//   }
// }

export async function getYear() {
  try {
      const res = await prisma.geoData.findMany({
          distinct: ['tahun'],
          select: {
            tahun: true,
          },
          orderBy: [
              {
                  tahun: 'asc',
              },
              {
                  id: 'asc',
              },
          ] 
      })

      return { res };
  } catch (error) {
      return { error };
  }
}

export async function addGeoData(id: string, data: any) {
  try {
    const res = await prisma.geoLocation.update({
      where: {
        id: id,
      },
      data: {
        geodatas: {
          create: data,
        },
      },
    });
    return { res };
  } catch (error) {
    console.log(error)
    return { error };
  }
}

export async function editGeoData(id: string, data: any) {
  try {
    const res = await prisma.geoData.update({
      where: {
        id: id,
      },
      data: data,
    });
    return { res };
  } catch (error) {
    return { error };
  }
}

export async function deleteGeoData(id: string) {
  try {
    const res = await prisma.geoData.delete({
      where: {
        id: id,
      },
    });
    return { res };
  } catch (error) {
    return { error };
  }
}
