'use client';

import Loader from "@/components/common/Loader";
import { MapContainer, TileLayer, Marker } from "react-leaflet";
import L from "leaflet";
import MarkerIcon from "leaflet/dist/images/marker-icon.png";
import "leaflet/dist/leaflet.css";
import { useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from 'next/navigation'


export default function AddForm() {
    const center = {
        lat: -3.3675549,
        lng: 117.1377759,
    }

    const [formData, setFormData] = useState({
        lat: center.lat,
        lng: center.lng,
        nama: "",
        npm: "",
        prov_id:"",
        provinsi: "None",
        instansi_bekerja: "",
        Alamat: "",
        posisi_bekerja: "",
        mulai_bekerja: "",
        besaran_gaji: "",
        kesesuaian: "",
        informasi_loker: "",
    });
    const [loading, setLoading] = useState<boolean>(true);
    const markerRef = useRef<any>(null)
    const router = useRouter()


    const DraggableMarker = () => {
        const eventHandlers = useMemo(
            () => ({
                dragend() {
                    const marker = markerRef.current
                    if (marker != null) {
                        const latlng = marker.getLatLng();
                        setFormData({ ...formData, lat: latlng.lat, lng: latlng.lng })
                    }
                },
            }),
            [],
        )

        return (
            <Marker
                draggable={true}
                eventHandlers={eventHandlers}
                position={[formData.lat, formData.lng]}
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
            >
            </Marker>
        )
    }
    const getMarkerGeoComp = async () => {
        const res = await fetch('/api/geoloc/findarea?' + new URLSearchParams({
            lat: formData.lat.toString(),
            lng: formData.lng.toString(),
        }), {
            method: "GET",
        })
        const { data } = await res.json()
        if (data.length != 0) {
            setFormData({ ...formData, prov_id: data[0]?._id.$oid, provinsi: data[0]?.name })
        } else {
            setFormData({ ...formData, prov_id: "", provinsi: "None" })
        }
    }
    const addGeoData = async () => {
        if(formData.prov_id == ""){
            return
        }
        const mulaiBekerjaDate = new Date(formData.mulai_bekerja); // Membuat objek Date dari formData.mulai_bekerja
        const formattedMulaiBekerja = mulaiBekerjaDate.toISOString(); // Mengubahnya menjadi string format datetime

        const res = await fetch('/api/geodata/add', {
            method: "POST",
            body: JSON.stringify({
                geoloc_id: formData.prov_id,
                data: {
                    latitude: (formData.lat),
                    longitude: (formData.lng),
                    nama: (formData.nama),
                    npm: Number(formData.npm),
                    provinsi: (formData.provinsi),
                    instansi_bekerja: (formData.instansi_bekerja),
                    Alamat: (formData.Alamat),
                    posisi_bekerja: (formData.posisi_bekerja),
                    mulai_bekerja: (formattedMulaiBekerja),
                    besaran_gaji: (formData.besaran_gaji),
                    kesesuaian: (formData.kesesuaian),
                    informasi_loker: (formData.informasi_loker),
                }
            })
        })
        const { message } = await res.json()
        if (res.status == 201) {
            router.push("/tables");
        } else {
        }
    }

    useEffect(() => {
        setLoading(true)
        setTimeout(() => setLoading(false), 500);
    }, [])

    useEffect(() => {
        getMarkerGeoComp()
    }, [formData.lat, formData.lng])

    return (
        <div className="grid  w-full gap-9 ">
            <div className="flex flex-col w-full gap-9">
                {/* <!-- Form --> */}
                <div className="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
                    <div className="border-b border-stroke py-4 px-6.5 dark:border-strokedark">
                        <h3 className="font-medium text-black dark:text-white">
                            Tambah Data
                        </h3>
                    </div>
                    <div className="h-96">
                        {loading ? (<Loader />) : (
                            <>
                                <MapContainer
                                    center={[center.lat, center.lng]}
                                    zoom={5}
                                    scrollWheelZoom={true}
                                    style={{
                                        width: "100%",
                                        height: "100%"
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
                    <form action={ 
                        addGeoData
                    }>
                        <div className="p-6.5">

                            <div className="mb-4.5">
                                <label className="mb-2.5 block text-black dark:text-white">
                                    Latitude <span className="text-meta-1">*</span>
                                </label>
                                <input
                                    type="number"
                                    onKeyDown={(e)=>{["e", "E", "+", "-"].includes(e.key) && e.preventDefault()}}
                                    placeholder="Enter Latitude"
                                    className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 font-medium outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary"
                                    value={formData.lat}
                                    disabled
                                />
                            </div>

                            <div className="mb-4.5">
                                <label className="mb-2.5 block text-black dark:text-white">
                                    Longitude <span className="text-meta-1">*</span>
                                </label>
                                <input
                                    type="number"
                                    onKeyDown={(e)=>{["e", "E", "+", "-"].includes(e.key) && e.preventDefault()}}
                                    placeholder="Enter Longitude"
                                    className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 font-medium outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary"
                                    value={formData.lng}
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
                                    Provinsi <span className="text-meta-1">*</span>
                                </label>
                                <input
                                    type="text"
                                    placeholder="Masukkan provinsi"
                                    className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 font-medium outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary"
                                    value={formData.provinsi}
                                    onChange={({ target }) =>
                                        setFormData({ ...formData, provinsi: target.value })
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
                                    placeholder="Masukkan alamat instansi"
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
                                    value={formData.mulai_bekerja}
                                    onChange={({ target }) =>
                                        setFormData({ ...formData, mulai_bekerja: target.value })
                                    }
                                    required
                                />
                            </div>

                            <div className="mb-4.5">
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
                            </div>

                            <div className="mb-4.5">
                                <label className="mb-2.5 block text-black dark:text-white">
                                    Kesesuaian <span className="text-meta-1">*</span>
                                </label>
                                <input
                                    type="text"
                                    placeholder="Sesuai/tidak"
                                    className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 font-medium outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary"
                                    value={formData.kesesuaian}
                                    onChange={({ target }) =>
                                        setFormData({ ...formData, kesesuaian: target.value })
                                    }
                                    required
                                />
                            </div>

                            <div className="mb-4.5">
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
                            </div>

                            <button className="flex justify-center rounded bg-[#263238] p-3 font-medium text-white" type="submit">
                                Tambah
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    )
}