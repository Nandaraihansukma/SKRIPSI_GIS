import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";
import { getGeoDataByID } from "@/lib/prisma/geodata";
import { Table } from "flowbite-react";
import { BreadcrumbItem } from "flowbite-react/lib/esm/components/Breadcrumb/BreadcrumbItem";
import Link from "next/link";

async function DetailData({
  searchParams,
}: {
  searchParams: { [key: string]: string | string[] | undefined };
}) {
  if (typeof searchParams.id == "string") {
    const { res } = await getGeoDataByID(searchParams.id);
    if (res) {
      return (
        <div className="block mx-11 bg-white">
          <Breadcrumb pageName={"Detail Data"} />
          <div className="w-full 2xl:px-30 px-10 bg-white flex items-center sm:items-center sm:justify-between">
            <img
              src="/assets/gambarDetailData.png"
              alt="gambarDetailData"
              className="w-100 h-auto ml-10 mr-40"
            />

            <div className="text-left pl-15 max-w-xl">
              <div className="mb-4">
                {res.image_url && (
                  <img
                    src={res.image_url}
                    alt="Foto Profil"
                    className="w-50 h-60"
                  />
                )}
              </div>
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
                    <td className="whitespace-nowrap align-top">
                      Alamat Instansi
                    </td>
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
        </div>
      );
    }
  }

  return (
    <div className="w-full 2xl:px-30 px-10 bg-white flex items-center">
      <Breadcrumb pageName={"detaildata"} />
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
