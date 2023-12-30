"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useSearchParams } from "next/navigation";

export default function EditForm() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [formData, setFormData] = useState({
    nama: "",
    npm: "",
    instansi_bekerja: "",
    Alamat: "",
    posisi_bekerja: "",
    mulai_bekerja:"",
    besaran_gaji:"",
    kesesuaian:"",
    informasi_loker:"",
  });
  const [loading, setLoading] = useState<boolean>(true);

  const geodataAPI = async () => {
    const param = searchParams.get("id");
    const res = await fetch(
      "/api/geodata/id?" +
        new URLSearchParams({
          id: param ? param : "",
        }),
      {
        method: "GET",
        cache: "no-store",
      }
    );
    const { data } = await res.json();
    if (res.status == 200) {
      setFormData({
        nama: data.nama,
        npm: data.npm,
        instansi_bekerja: data.instansi_bekerja,
        Alamat: (formData.Alamat),
        posisi_bekerja: data.posisi_bekerja,
        mulai_bekerja: data.mulai_bekerja,
        besaran_gaji: data.besaran_gaji,
        kesesuaian: data.kesesuaian,
        informasi_loker: data.informasi_loker,
      });
    }
  };
  const editGeoData = async () => {
    const param = searchParams.get("id");
    if (param == null) {
      return;
    }
  
  const mulaiBekerjaDate = new Date(formData.mulai_bekerja); // Membuat objek Date dari formData.mulai_bekerja
  const formattedMulaiBekerja = mulaiBekerjaDate.toISOString(); // Mengubahnya menjadi string format datetime

    const res = await fetch("/api/geodata/update", {
      method: "POST",
      body: JSON.stringify({
        id: param ? param : "",
        data: {
          nama: (formData.nama),
          npm: (formData.npm),
          instansi_bekerja: (formData.instansi_bekerja),
          Alamat: (formData.Alamat),
          posisi_bekerja: (formData.posisi_bekerja),
          mulai_bekerja: (formattedMulaiBekerja),
          besaran_gaji: (formData.besaran_gaji),
          kesesuaian: (formData.kesesuaian),
          informasi_loker: (formData.informasi_loker),
        },
      }),
    });
    const { message } = await res.json();
    if (res.status == 201) {
      router.push("/tables");
    } else {
    }
  };

  useEffect(() => {
    setLoading(true);
    geodataAPI();
    setTimeout(() => setLoading(false), 500);
  }, []);

  return (
    <div className="grid  w-full gap-9 ">
      <div className="flex flex-col w-full gap-9">
        {/* <!-- Form --> */}
        <div className="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
          <div className="border-b border-stroke py-4 px-6.5 dark:border-strokedark">
            <h3 className="font-medium text-black dark:text-white">
              Edit Data
            </h3>
          </div>
          <form
            action= {
              editGeoData
            }
          >
            <div className="p-6.5">
              <div className="mb-4.5">
                <label className="mb-2.5 block text-black dark:text-white">
                  Nama <span className="text-meta-1">*</span>
                </label>
                <input
                  type="text"
                  placeholder="Masukkan nama"
                  className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 font-medium outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary"
                  value={formData.nama}
                  onChange={({ target }) =>
                    setFormData({ ...formData, nama: target.value })
                  }
                  required
                />
              </div>

              <div className="mb-4.5">
                <label className="mb-2.5 block text-black dark:text-white">
                  NPM <span className="text-meta-1">*</span>
                </label>
                <input
                  type="number"
                  onKeyDown={(e)=>{["e", "E", "+", "-"].includes(e.key) && e.preventDefault()}}
                  placeholder="Masukkan npm"
                  className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 font-medium outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary"
                  value={formData.npm}
                  onChange={({ target }) =>
                    setFormData({ ...formData, npm: target.value })
                  }
                  required
                />
              </div>

              <div className="mb-4.5">
                <label className="mb-2.5 block text-black dark:text-white">
                  Instansi Bekerja <span className="text-meta-1">*</span>
                </label>
                <input
                  type="text"
                  placeholder="Masukkan instansi bekerja"
                  className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 font-medium outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary"
                  value={formData.instansi_bekerja}
                  onChange={({ target }) =>
                    setFormData({ ...formData, instansi_bekerja: target.value })
                  }
                  required
                />
              </div>

              <div className="mb-4.5">
                <label className="mb-2.5 block text-black dark:text-white">
                  Posisi Bekerja <span className="text-meta-1">*</span>
                </label>
                <input
                  type="text"
                  placeholder="Masukkan posisi bekerja"
                  className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 font-medium outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary"
                  value={formData.posisi_bekerja}
                  onChange={({ target }) =>
                    setFormData({ ...formData, posisi_bekerja: target.value })
                  }
                  required
                />
              </div>

              <button type="submit" className="flex justify-center rounded bg-[#263238] p-2 font-medium  text-white">
                Simpan
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
