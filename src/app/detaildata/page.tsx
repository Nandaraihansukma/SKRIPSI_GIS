import { getGeoDataByID } from "@/lib/prisma/geodata";
import { Table } from 'flowbite-react';

async function DetailData({
  searchParams,
}: {
  searchParams: { [key: string]: string | string[] | undefined };
}) {
  if (typeof searchParams.id == "string") {
    const { res } = await getGeoDataByID(searchParams.id);
    if (res) {
      return (
        <div className="w-full 2xl:px-30 px-10 bg-white flex items-center">
          <img
            src="/assets/gambarDetailData.png"
            alt="gambarDetailData"
            className="w-150 h-auto ml-20 mr-10"
          />
          {/* <TextDetailData/> */}
          <div className="text-left pl-15 max-w-xl">
            <h1 className="text-2xl md:text-3xl font-bold text-gray-800 mb-4">
              Detail Data
            </h1>
            <table>
                <tbody>
                    <tr>
                        <td className="whitespace-nowrap">Nama</td>
                        <td className="px-4">:</td>
                        <td>{res.nama}</td>
                    </tr>
                    <tr>
                        <td className="whitespace-nowrap">NPM</td>
                        <td className="px-4">:</td>
                        <td>{res.npm}</td>
                    </tr>
                    <tr>
                        <td className="whitespace-nowrap">Instansi Bekerja</td>
                        <td className="px-4">:</td>
                        <td>{res.instansi_bekerja}</td>
                    </tr>
                    <tr className="py-14">
                        <td className="whitespace-nowrap align-top">Alamat Instansi</td>
                        <td className="px-4 align-top">:</td>
                        <td>{res.Alamat}</td>
                    </tr>
                    <tr>
                        <td className="whitespace-nowrap">Posisi Bekerja</td>
                        <td className="px-4">:</td>
                        <td>{res.posisi_bekerja}</td>
                    </tr>
                    <tr>
                        <td className="whitespace-nowrap">Perkiraan Gaji</td>
                        <td className="px-4">:</td>
                        <td>{res.besaran_gaji}</td>
                    </tr>
                </tbody>
            </table>
          </div>
          {/* Konten halaman Anda akan ada di sini */}
        </div>
      );
    }
  }
  return (
    <div className="w-full 2xl:px-30 px-10 bg-white flex items-center">
      {/* <TextDetailData/> */}
      <div className="text-left pl-15 mt-20 max-w-xl">
        <h1 className="text-2xl md:text-3xl font-bold text-gray-800 mb-4">
          No Data
        </h1>
      </div>
      {/* Konten halaman Anda akan ada di sini */}
    </div>
  );
}
export default DetailData;
