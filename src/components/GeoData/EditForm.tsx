"use client";

import { useEffect, useState, useMemo, useRef } from "react";
import Loader from "@/components/common/Loader";
import { MapContainer, TileLayer, Marker } from "react-leaflet";
import L from "leaflet";
import MarkerIcon from "leaflet/dist/images/marker-icon.png";
import "leaflet/dist/leaflet.css";
import { useRouter } from "next/navigation";
import { useSearchParams } from "next/navigation";
import { GeoData } from "@prisma/client";

export default function EditForm({ geo_data }: { geo_data: GeoData }) {
  const [formData, setFormData] = useState<GeoData>(geo_data);
  const [loading, setLoading] = useState<boolean>(true);
  const markerRef = useRef<any>(null);
  const router = useRouter();

  const searchParams = useSearchParams();

  const DraggableMarker = () => {
    const eventHandlers = useMemo(
      () => ({
        dragend() {
          const marker = markerRef.current;
          if (marker != null) {
            const latlng = marker.getLatLng();
            setFormData({
              ...formData,
              latitude: latlng.lat,
              longitude: latlng.lng,
            });
          }
        },
      }),
      []
    );

    return (
      <Marker
        draggable={true}
        eventHandlers={eventHandlers}
        position={[formData.latitude, formData.longitude]}
        ref={markerRef}
        icon={
          new L.Icon({
            iconUrl: MarkerIcon.src,
            iconRetinaUrl: MarkerIcon.src,
            iconSize: [25, 41],
            iconAnchor: [12.5, 41],
            popupAnchor: [0, -41],
          })
        }
      ></Marker>
    );
  };

  const getMarkerGeoComp = async () => {
    const res = await fetch(
      "/api/geoloc/findarea?" +
        new URLSearchParams({
          lat: formData.latitude.toString(),
          lng: formData.longitude.toString(),
        }),
      {
        method: "GET",
      }
    );
    const { data } = await res.json();
    if (data.length != 0) {
      setFormData({
        ...formData,
        geoloc_id: data[0]?._id.$oid,
        Kab_kota: data[0]?.name,
      });
    } else {
      setFormData({ ...formData, geoloc_id: "", Kab_kota: "None" });
    }
  };

  // const geodataAPI = async () => {
  //   const param = searchParams.get("id");
  //   const res = await fetch(
  //     "/api/geodata/id?" +
  //       new URLSearchParams({
  //         id: param ? param : "",
  //       }),
  //     {
  //       method: "GET",
  //       cache: "no-store",
  //     }
  //   );
  //   const { data } = await res.json();
  //   if (res.status == 200) {
  //     setFormData({
  //       lat: data.latitude,
  //       lng: data.longitude,
  //       nama: data.nama,
  //       npm: data.npm,
  //       tahun: data.tahun,
  //       prov_id: data.geoloc_id,
  //       provinsi: formData.provinsi,
  //       Kab_kota: formData.Kab_kota,
  //       instansi_bekerja: data.instansi_bekerja,
  //       Alamat: data.Alamat,
  //       posisi_bekerja: data.posisi_bekerja,
  //       mulai_bekerja: data.mulai_bekerja,
  //       besaran_gaji: data.besaran_gaji,
  //       kesesuaian: data.kesesuaian,
  //       informasi_loker: data.informasi_loker,
  //     });
  //   }
  // };
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
          latitude: formData.latitude,
          longitude: formData.longitude,
          nama: formData.nama,
          npm: formData.npm,
          tahun: formData.tahun,
          provinsi: formData.provinsi,
          Kab_kota: formData.Kab_kota,
          instansi_bekerja: formData.instansi_bekerja,
          Alamat: formData.Alamat,
          posisi_bekerja: formData.posisi_bekerja,
          mulai_bekerja: formattedMulaiBekerja,
          besaran_gaji: formData.besaran_gaji,
          kesesuaian: formData.kesesuaian,
          informasi_loker: formData.informasi_loker,
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
    // geodataAPI();
    setTimeout(() => setLoading(false), 500);
  }, []);

  useEffect(() => {
    getMarkerGeoComp();
  }, [formData.latitude, formData.longitude]);

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
          <div className="h-96">
            {loading ? (
              <Loader />
            ) : (
              <>
                <MapContainer
                  center={[formData.latitude, formData.longitude]}
                  zoom={5}
                  scrollWheelZoom={true}
                  style={{
                    width: "100%",
                    height: "100%",
                  }}
                >
                  <TileLayer
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                  />
                  <DraggableMarker />
                </MapContainer>
              </>
            )}
          </div>
          <form action={editGeoData}>
            <div className="p-6.5">
              <div className="mb-4.5">
                <label className="mb-2.5 block text-black dark:text-white">
                  Latitude <span className="text-meta-1">*</span>
                </label>
                <input
                  type="number"
                  onKeyDown={(e) => {
                    ["e", "E", "+", "-"].includes(e.key) && e.preventDefault();
                  }}
                  placeholder="Enter Latitude"
                  className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 font-medium outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary"
                  value={formData.latitude}
                  disabled
                />
              </div>

              <div className="mb-4.5">
                <label className="mb-2.5 block text-black dark:text-white">
                  Longitude <span className="text-meta-1">*</span>
                </label>
                <input
                  type="number"
                  onKeyDown={(e) => {
                    ["e", "E", "+", "-"].includes(e.key) && e.preventDefault();
                  }}
                  placeholder="Enter Longitude"
                  className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 font-medium outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary"
                  value={formData.longitude}
                  disabled
                />
              </div>

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
                  onKeyDown={(e) => {
                    ["e", "E", "+", "-"].includes(e.key) && e.preventDefault();
                  }}
                  placeholder="Masukkan npm"
                  className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 font-medium outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary"
                  value={formData.npm}
                  onChange={({ target }) =>
                    setFormData({ ...formData, npm: Number(target.value) })
                  }
                  required
                />
              </div>

              <div className="mb-4.5">
                <label className="mb-2.5 block text-black dark:text-white">
                  Angkatan <span className="text-meta-1">*</span>
                </label>
                <input
                  type="number"
                  onKeyDown={(e) => {
                    ["e", "E", "+", "-"].includes(e.key) && e.preventDefault();
                  }}
                  placeholder="Masukkan tahun angkatan"
                  className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 font-medium outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary"
                  value={formData.tahun}
                  onChange={({ target }) =>
                    setFormData({ ...formData, tahun: Number(target.value) })
                  }
                  required
                />
              </div>

              <div className="mb-4.5">
                <label className="mb-2.5 block text-black dark:text-white">
                  Kabupaten/Kota <span className="text-meta-1">*</span>
                </label>
                <input
                  type="text"
                  placeholder="Masukkan kabupaten/kota"
                  className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 font-medium outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary"
                  value={formData.Kab_kota}
                  onChange={({ target }) =>
                    setFormData({ ...formData, Kab_kota: target.value })
                  }
                  disabled
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
                  Alamat Instansi <span className="text-meta-1">*</span>
                </label>
                <input
                  type="text"
                  placeholder="Masukkan alamat"
                  className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 font-medium outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary"
                  value={formData.Alamat}
                  onChange={({ target }) =>
                    setFormData({ ...formData, Alamat: target.value })
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

              <div className="mb-4.5">
                <label className="mb-2.5 block text-black dark:text-white">
                  Tanggal Mulai Bekerja <span className="text-meta-1">*</span>
                </label>
                <input
                  type="date"
                  placeholder="Masukkan tanggal mulai bekerja"
                  className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 font-medium outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary"
                  value={new Date(formData.mulai_bekerja)
                    .toLocaleString("sv-SE")
                    .substring(0, 10)}
                  onChange={({ target }) => {
                    if (
                      target.value != "" &&
                      new Date(target.value) > new Date()
                    ) {
                      target.value = new Date()
                        .toLocaleString("sv-SE")
                        .substring(0, 10);
                    }
                    setFormData({
                      ...formData,
                      mulai_bekerja: new Date(target.value),
                    });
                  }}
                  required
                />
              </div>

              {/* <div className="mb-4.5">
                <label className="mb-2.5 block text-black dark:text-white">
                  Besaran Gaji <span className="text-meta-1">*</span>
                </label>
                <input
                  type="text"
                  placeholder="Masukkan besaran gaji"
                  className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 font-medium outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary"
                  value={formData.besaran_gaji}
                  onChange={({ target }) =>
                    setFormData({ ...formData, besaran_gaji: target.value })
                  }
                  required
                />
              </div> */}

              <div className="mb-4.5">
                <label className="mb-2.5 block text-black dark:text-white">
                  Besaran Gaji <span className="text-meta-1">*</span>
                </label>
                <select
                  className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 font-medium outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary"
                  value={formData.besaran_gaji}
                  onChange={({ target }) =>
                    setFormData({ ...formData, besaran_gaji: target.value })
                  }
                  required
                >
                  <option value="" disabled>
                    Pilih besaran gaji
                  </option>
                  <option value="0 - 5.000.000">0 - 5.000.000</option>
                  <option value="5.000.000 - 10.000.000">
                    5.000.000 - 10.000.000
                  </option>
                  <option value="10.000.000 - 15.000.000">
                    10.000.000 - 15.000.000
                  </option>
                  <option value="Lainnya">Lainnya</option>
                  {/* Tambahkan opsi lainnya sesuai dengan besaran gaji yang diperlukan */}
                </select>
              </div>

              <div className="mb-4.5">
                <label className="mb-2.5 block text-black dark:text-white">
                  Apakah sesuai dengan harapan sebelum menerima pekerjaan
                  tersebut <span className="text-meta-1">*</span>
                </label>
                <div className="flex space-x-4">
                  {" "}
                  {/* Gunakan container flex untuk menampilkan radio button secara horizontal */}
                  <label className="flex items-center">
                    <input
                      type="radio"
                      name="kesesuaian"
                      value="Sesuai"
                      checked={formData.kesesuaian === "Sesuai"}
                      onChange={() =>
                        setFormData({ ...formData, kesesuaian: "Sesuai" })
                      }
                      className="mr-2"
                      required
                    />
                    Sesuai
                  </label>
                  <label className="flex items-center">
                    <input
                      type="radio"
                      name="kesesuaian"
                      value="Tidak Sesuai"
                      checked={formData.kesesuaian === "Tidak Sesuai"}
                      onChange={() =>
                        setFormData({ ...formData, kesesuaian: "Tidak Sesuai" })
                      }
                      className="mr-2"
                      required
                    />
                    Tidak Sesuai
                  </label>
                </div>
              </div>

              {/* <div className="mb-4.5">
                <label className="mb-2.5 block text-black dark:text-white">
                  Informasi Loker <span className="text-meta-1">*</span>
                </label>
                <input
                  type="text"
                  placeholder="Masukkan informasi loker"
                  className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 font-medium outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary"
                  value={formData.informasi_loker}
                  onChange={({ target }) =>
                    setFormData({ ...formData, informasi_loker: target.value })
                  }
                  required
                />
              </div> */}

              <div className="mb-4.5">
                <label className="mb-2.5 block text-black dark:text-white">
                  Informasi Lowongan Kerja{" "}
                  <span className="text-meta-1">*</span>
                </label>
                <select
                  className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 font-medium outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary"
                  value={formData.informasi_loker}
                  onChange={({ target }) =>
                    setFormData({ ...formData, informasi_loker: target.value })
                  }
                  required
                >
                  <option value="" disabled>
                    Pilih informasi lowongan kerja
                  </option>
                  <option value="Teman">Teman</option>
                  <option value="Alumni">Alumni</option>
                  <option value="Keluarga">Keluarga</option>
                  <option value="Lainnya">Lainnya</option>
                  {/* Tambahkan opsi lainnya sesuai kebutuhan */}
                </select>
              </div>

              <button
                type="submit"
                className="flex justify-center rounded bg-[#263238] p-2 font-medium  text-white"
              >
                Simpan
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
