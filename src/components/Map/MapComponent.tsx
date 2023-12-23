"use client";

import Loader from "@/components/common/Loader";
import { MapContainer, TileLayer, GeoJSON, Popup } from "react-leaflet";
import L from "leaflet";
import MarkerIcon from "leaflet/dist/images/marker-icon.png";
import "leaflet/dist/leaflet.css";
import { useEffect, useState } from "react";
import { Card } from "flowbite-react";
import { Dropdown } from "flowbite-react";

interface Geolocs {
  id: String;
  geoId: number;
  name: String;
  geojs: GeoJSON.GeoJsonObject;
  color?: string;
  _count: { geodatas: number };
  geodatas?: GeoDatas[];
}
interface GeoDatas {
  id: String;
  npm: Number;
  instansi_bekerja: String;
  Alamat: String;
  provinsi: String;
  latitude: Number;
  longitude: Number;
  posisi_bekerja: String;
  mulai_bekerja: String | Date;
  besaran_gaji?: String;
  kesesuaian?: String;
  informasi_loker: String;
  nama: String;
}
const MapComponent = () => {
  const [loading, setLoading] = useState<boolean>(true);
  const [geolocs, setGeolocs] = useState<Geolocs[]>([]);
  const [calculations, setCalculations] = useState({
    mean: 0,
    std: 0,
    n: 0,
    upper: 0,
    lower: 0,
  });
  const [year, setYear] = useState<number>(2013);

  const mean = (data: Geolocs[], calc: { count: number; mean: number }) => {
    let count = 0;
    let sum = 0;
    data.forEach((elem) => {
      if (elem._count.geodatas != 0) {
        count += 1; //ada berapa provinsi yang dihitung
        sum += elem._count.geodatas; //ada berapa alumni yang ada di provinsi tersebut
      }
    });
    if (count != 0) {
      calc.count = count;
      calc.mean = sum / count;
    }
  };

  const std = (
    data: Geolocs[],
    calc: { count: number; mean: number; std: number }
  ) => {
    let sum = 0;
    data.forEach((elem) => {
      if (elem._count.geodatas != 0) {
        sum += Math.pow(elem._count.geodatas - calc.mean, 2);
      }
    });
    if (calc.count != 0) {
      calc.std = Math.sqrt(sum / (calc.count - 1));
    }
  };

  const assignColor = (
    data: Geolocs[],
    calc: {
      upper: { val: number; exist: boolean };
      lower: { val: number; exist: boolean };
    }
  ) => {
    const result = data.map((elem) => {
      if (elem._count.geodatas != 0) {
        if (elem._count.geodatas > calc.upper.val) {
          calc.upper.exist = true;
          elem.color = "green";
          return elem;
        }
        if (elem._count.geodatas < calc.lower.val) {
          calc.lower.exist = true;
          elem.color = "red";
          return elem;
        }
        if (
          elem._count.geodatas >= calc.lower.val &&
          elem._count.geodatas <= calc.upper.val
        ) {
          elem.color = "yellow";
          return elem;
        }
      }
      return elem;
    });
    return result;
  };

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
      console.log(calc_var.n);
      console.log(calc_var.upper.val);
      calc_var.upper.val = calc_var.mean + calc_var.n * calc_var.std;
      calc_var.lower.val = calc_var.mean - calc_var.n * calc_var.std;
      temp = assignColor(data, calc_var);
      if (!calc_var.upper.exist || !calc_var.lower.exist) {
        calc_var.n -= 0.1;
      }
      tries += 1;
    }
    setCalculations({
      mean: Number(calc_var.mean.toFixed(3)),
      std: Number(calc_var.std.toFixed(3)),
      n: Number(calc_var.n.toFixed(3)),
      upper: Number(calc_var.upper.val.toFixed(3)),
      lower: Number(calc_var.lower.val.toFixed(3)),
    });
    console.log(
      calc_var.mean +
        " " +
        calc_var.std +
        " " +
        calc_var.upper.val +
        " " +
        calc_var.lower.val +
        " "
    );
    const result = temp;
    return result;
  };

  const geolocsAPI = async () => {
    const res = await fetch(
      "/api/geoloc?" +
        new URLSearchParams({
          year: year.toString(),
        }),
      {
        method: "GET",
      }
    );
    const { data }: { data: Geolocs[] } = await res.json();
    console.log(data);
    const result = calculate(data);
    setGeolocs(result);
  };

  useEffect(() => {
    setLoading(true);
    geolocsAPI();
    setTimeout(() => setLoading(false), 1000);
  }, [year]);

  return (
    <div className="relative flex flex-col items-center h-full">
      {loading ? <Loader /> : null}
      <MapContainer
        center={[-3.3675549, 117.1377759]}
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
        {geolocs?.map((item: Geolocs) => {
          const percent = Math.floor(Math.random() * (80 - 20 + 1) + 20);
          return (
            <GeoJSON
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
                  }),
                });
              }}
              onEachFeature={function (feature, layer) {
                let sumstr = "";
                sumstr += String(item._count.geodatas);
                const popUpContent = `<Popup>
                                ${sumstr} Alumni
                            </Popup>`;
                layer.bindPopup(popUpContent);
              }}
              pathOptions={{
                fillColor: item.color != undefined ? item.color : "blue",
                fillOpacity: 0.4,
                weight: 1,
                opacity: 1,
                color: "black",
              }}
            />
          );
        })}
      </MapContainer> 
      <div className="fixed z-1200 flex items-start w-fit">
        <div>
          <Card className="max-w-sm fixed top-15 bottom-2 right-0 z-1200 rounded-none">
            <div className="flex items-center justify-between">
              <h6 className="text-sm font-bold leading-none text-gray-900 dark:text-white">
                Ketarangan Peta Alumni
              </h6>
            </div>
            <div className="flow-root">
              <ul className="divide-y divide-gray-200 dark:divide-gray-700">
                <li className="py-1 sm:py-2">
                  <div className="flex items-center space-x-4">
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-medium text-gray-900 dark:text-white">
                        Jumlah Alumni Tertinggi
                      </p>
                    </div>
                    <div className="inline-flex items-center text-base font-semibold text-gray-900 dark:text-white">
                      <div className="w-3 h-3 mx-2 bg-green-500 rounded-full"></div>{" "}
                      {/* Hijau */}
                    </div>
                  </div>
                </li>
                <li className="py-1 sm:py-2">
                  <div className="flex items-center space-x-4">
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-medium text-gray-900 dark:text-white">
                        Jumlah Alumni Sedang{" "}
                      </p>
                    </div>
                    <div className="inline-flex items-center text-base font-semibold text-gray-900 dark:text-white">
                      <div className="w-3 h-3 mx-2 bg-yellow-300 rounded-full"></div>{" "}
                      {/* Kuning */}
                    </div>
                  </div>
                </li>
                <li className="py-1 sm:py-2">
                  <div className="flex items-center space-x-4">
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-medium text-gray-900 dark:text-white">
                        Jumlah Alumni Terendah{" "}
                      </p>
                    </div>
                    <div className="inline-flex items-center text-base font-semibold text-gray-900 dark:text-white">
                      <div className="w-3 h-3 mx-2 bg-red-500 rounded-full"></div>{" "}
                      {/* Merah */}
                    </div>
                  </div>
                </li>
                <li className="py-1 sm:py-2">
                  <div className="flex items-center space-x-4">
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-medium text-gray-900 dark:text-white">
                        n
                      </p>
                    </div>
                    <div className="inline-flex items-center text-base font-semibold text-gray-900 dark:text-white">
                      {calculations.n}
                    </div>
                  </div>
                </li>
                <li className="py-1 sm:py-2">
                  <div className="flex items-center space-x-4">
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-medium text-gray-900 dark:text-white">
                        std
                      </p>
                    </div>
                    <div className="inline-flex items-center text-base font-semibold text-gray-900 dark:text-white">
                      {calculations.std}
                    </div>
                  </div>
                </li>
                <li className="py-1 sm:py-2">
                  <div className="flex items-center space-x-4">
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-medium text-gray-900 dark:text-white">
                        mean
                      </p>
                    </div>
                    <div className="inline-flex items-center text-base font-semibold text-gray-900 dark:text-white">
                      {calculations.mean}
                    </div>
                  </div>
                </li>
                <li className="py-1 sm:py-2">
                  <div className="flex items-center space-x-4">
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-medium text-gray-900 dark:text-white">
                        upper
                      </p>
                    </div>
                    <div className="inline-flex items-center text-base font-semibold text-gray-900 dark:text-white">
                      {calculations.upper}
                    </div>
                  </div>
                </li>
                <li className="py-1 sm:py-2">
                  <div className="flex items-center space-x-4">
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-medium text-gray-900 dark:text-white">
                        lower
                      </p>
                    </div>
                    <div className="inline-flex items-center text-base font-semibold text-gray-900 dark:text-white">
                      {calculations.lower}
                    </div>
                  </div>
                </li>
              </ul>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};
export default MapComponent;
