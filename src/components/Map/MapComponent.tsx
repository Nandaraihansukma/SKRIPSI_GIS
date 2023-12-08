"use client";

import Loader from "@/components/common/Loader";
import { MapContainer, TileLayer, GeoJSON, Popup } from "react-leaflet";
import L from "leaflet";
import MarkerIcon from "leaflet/dist/images/marker-icon.png";
import "leaflet/dist/leaflet.css";
import { useEffect, useState } from "react";

interface Geolocs {
    id: String,
    geoId: number,
    name: String,
    geojs: GeoJSON.GeoJsonObject
    color?: string
    geodatas?: GeoDatas[]
}
interface GeoDatas {
    id: String,
    tahun: number,
    provinsi: String,
    kawasan_hutan: number,
    bukan_kawasan_hutan: number,
    total_deforestasi: number,
}
const MapComponent = () => {
    const [loading, setLoading] = useState<boolean>(true);
    const [geolocs, setGeolocs] = useState<Geolocs[]>([]);
    const [calculations, setCalculations] = useState({
        mean: 0,
        std: 0,
        n: 0,
    });
    const [year, setYear] = useState<number>(2013);

    const mean = (data: Geolocs[], calc: { count: number, mean: number }) => {
        let count = 0;
        let sum = 0;
        data.forEach((elem) => {
            if (elem.geodatas?.length == 1) {
                count += 1;
                sum += elem.geodatas[0]?.total_deforestasi;
            }
        });
        if (count != 0) {
            calc.count = count;
            calc.mean = sum / count;
        }
    }

    const std = (data: Geolocs[], calc: { count: number, mean: number, std: number }) => {
        let sum = 0;
        data.forEach((elem) => {
            if (elem.geodatas?.length == 1) {
                sum += Math.pow(elem.geodatas[0]?.total_deforestasi - calc.mean, 2);
            }
        });
        if (calc.count != 0) {
            calc.std = Math.sqrt(sum / (calc.count - 1));
        }
    }

    const assignColor = (data: Geolocs[], calc: { upper: { val: number, exist: boolean }, lower: { val: number, exist: boolean } }) => {
        const result = data.map((elem) => {
            if (elem.geodatas?.length == 1) {
                if (elem.geodatas[0]?.total_deforestasi > calc.upper.val) {
                    calc.upper.exist = true;
                    elem.color = "green";
                    return elem;
                }
                if (elem.geodatas[0]?.total_deforestasi < calc.lower.val) {
                    calc.lower.exist = true;
                    elem.color = "red";
                    return elem;
                }
                if (elem.geodatas[0]?.total_deforestasi >= calc.lower.val && elem.geodatas[0]?.total_deforestasi <= calc.upper.val) {
                    elem.color = "yellow";
                    return elem;
                }
            }
            return elem;
        });
        return result;
    }

    const calculate = (data: Geolocs[]) => {
        if (data.length == 0) {
            return data;
        }
        let calc_var = {
            count: 0,
            mean: 0,
            std: 0,
            n: 1,
            upper: { val: 0, exist: false },
            lower: { val: 0, exist: false },
        };
        mean(data, calc_var);
        if (calc_var.count == 0) {
            return data;
        }
        std(data, calc_var);
        let tries = 0;
        let temp = data;
        while ((!calc_var.upper.exist || !calc_var.lower.exist) && tries != 8) {
            console.log(calc_var.n)
            calc_var.upper.val = calc_var.mean + (calc_var.n * calc_var.std);
            calc_var.lower.val = calc_var.mean - (calc_var.n * calc_var.std);
            temp = assignColor(data, calc_var);
            if (!calc_var.upper.exist || !calc_var.lower.exist) {
                calc_var.n -= 0.1;
            }
            tries += 1;
        }
        setCalculations({ mean: calc_var.mean, std: calc_var.std, n: calc_var.n });
        const result = temp;
        return result;
    }

    const geolocsAPI = async () => {
        const res = await fetch('/api/geoloc?' + new URLSearchParams({
            year: year.toString(),
        }), {
            method: "GET",
        })
        const { data }: { data: Geolocs[] } = await res.json()
        const result = calculate(data);
        setGeolocs(result);
    }

    useEffect(() => {
        setLoading(true)
        geolocsAPI()
        setTimeout(() => setLoading(false), 1000);
    }, [year])

    return (
        <div className="relative flex flex-col items-center h-full">
            {loading ? (<Loader />) : (null)}
            <MapContainer
                center={[-3.3675549, 117.1377759]}
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
                {geolocs?.map((item: Geolocs) => {
                    const percent = Math.floor(Math.random() * (80 - 20 + 1) + 20)
                    return (<GeoJSON
                        key={JSON.stringify(item)}
                        data={item.geojs}
                        pointToLayer={function (geoJsonPoint, latlng) {
                            return L.marker(latlng, {
                                icon: new L.Icon({
                                    iconUrl: MarkerIcon.src,
                                    iconRetinaUrl: MarkerIcon.src,
                                    iconSize: [25, 41],
                                    iconAnchor: [12.5, 41],
                                    popupAnchor: [0, -41],
                                })
                            });
                        }
                        }
                        onEachFeature={function (feature, layer) {
                            let sumstr = "";
                            item.geodatas?.forEach(elem => sumstr += elem.provinsi + " " + elem.tahun + " " + elem.total_deforestasi + "<br />")
                            const popUpContent = (`<Popup>
                                ${sumstr}
                            </Popup>`);
                            layer.bindPopup(popUpContent);
                        }}
                        pathOptions={{
                            fillColor: item.color != undefined ? item.color : "blue",
                            fillOpacity: 0.4,
                            weight: 1,
                            opacity: 1,
                            color: "black"
                        }} />)
                })}
            </MapContainer>
            <div className="fixed bottom-2 z-1200 flex flex-col items-center w-fit bg-white shadow-md rounded p-2">
                <div >
                    <button className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-4 rounded-l" onClick={(e: any) => setYear(year - 1)}>
                        Prev
                    </button>
                    <span>{calculations.n}</span>
                    <button className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-4 rounded-r" onClick={(e: any) => setYear(year + 1)}>
                        Next
                    </button>
                </div>
            </div>
        </div>
    );
};

export default MapComponent;
