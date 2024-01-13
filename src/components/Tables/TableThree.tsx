"use client";

import Link from "next/link";
import Loader from "@/components/common/Loader";
import { Pagination } from "flowbite-react";
import { useEffect, useState } from "react";
import WhiteButton from "../Button/WhiteButton";

const TableThree = () => {
  const [loading, setLoading] = useState<boolean>(true);

  // Fetch Data
  const [geodatas, setGeodatas] = useState({ data: [], count: 0 });

  // Search, Pagination, Take
  const [currentFilter, setCurrentFilter] = useState({
    search: "",
    take: 10,
    page: 1,
    mode: "default",
    toggle: true,
  });

  // Action
  const onPageChange = (page: number) =>
    setCurrentFilter({
      ...currentFilter,
      page: page,
      toggle: !currentFilter.toggle,
    });
  const geodataAPI = async () => {
    const res = await fetch(
      "/api/geodata?" +
        new URLSearchParams({
          take: currentFilter.take.toString(),
          page: currentFilter.page.toString(),
        }),
      {
        method: "GET",
        cache: "no-store",
      }
    );
    const { data, count } = await res.json();
    setGeodatas({ data: data, count: count });
  };
  const geodataSearch = async () => {
    const res = await fetch(
      "/api/geodata/search?" +
        new URLSearchParams({
          filter: currentFilter.search,
          take: currentFilter.take.toString(),
          page: currentFilter.page.toString(),
        }),
      {
        method: "GET",
      }
    );
    const { data, count } = await res.json();
    setGeodatas({ data: data, count: count });
  };
  const geodataDelete = async (id: string) => {
    const res = await fetch("/api/geodata/delete", {
      method: "POST",
      body: JSON.stringify({ id: id }),
    });
    if (res.status == 200) {
      setCurrentFilter({ ...currentFilter, toggle: !currentFilter.toggle });
    }
  };

  // Mount
  useEffect(() => {
    setLoading(true);
    if (currentFilter.mode == "search") {
      geodataSearch();
    }
    if (currentFilter.mode == "default") {
      geodataAPI();
    }
    setTimeout(() => setLoading(false), 500);
  }, [currentFilter.toggle]);

  return (
    <>
      <div className="flex justify-between">
        <div className="flex bg-white rounded-lg shadow-md">
          <input
            id="search"
            name="search"
            type="text"
            placeholder="Search..."
            className="flex-grow px-2 border border-gray-200 rounded-l-lg focus:ring-0 focus:border-[#263238] focus:border-2 focus:border-r-0  focus:outline-none"
            value={currentFilter.search}
            onChange={({ target }) => {
              setCurrentFilter({ ...currentFilter, search: target.value });
            }}
            onKeyDown={(e: any) => {
              if (e.key == "Enter") {
                if (currentFilter.search == "") {
                  setCurrentFilter({
                    ...currentFilter,
                    mode: "default",
                    toggle: !currentFilter.toggle,
                    page: 1,
                  });
                  return;
                } else if (currentFilter.search.length <= 3) {
                  window.alert("Please enter more than 3 charaters");
                  return;
                }
                setCurrentFilter({
                  ...currentFilter,
                  mode: "search",
                  toggle: !currentFilter.toggle,
                  page: 1,
                });
              }
            }}
          />
          <button
            className=" group px-3 rounded-r-md border-[#263238] border-solid border-2 hover:bg-[#263238] font-semibold text-[#263238] hover:text-[#FFFFFF]"
            onClick={(e: any) => {
              if (currentFilter.search == "") {
                setCurrentFilter({
                  ...currentFilter,
                  mode: "default",
                  toggle: !currentFilter.toggle,
                  page: 1,
                });
                return;
              } else if (currentFilter.search.length <= 3) {
                window.alert("Please enter more than 3 charaters");
                return;
              }
              setCurrentFilter({
                ...currentFilter,
                mode: "search",
                toggle: !currentFilter.toggle,
                page: 1,
              });
            }}
          >
            <svg
              className="group-hover:fill-white"
              xmlns="http://www.w3.org/2000/svg"
              width="20"
              height="20"
              fill="#000000"
              viewBox="0 0 256 256"
            >
              <path d="M229.66,218.34l-50.07-50.06a88.11,88.11,0,1,0-11.31,11.31l50.06,50.07a8,8,0,0,0,11.32-11.32ZM40,112a72,72,0,1,1,72,72A72.08,72.08,0,0,1,40,112Z"></path>
            </svg>
          </button>
        </div>
        <WhiteButton text="Tambah Data" href="/tables/add" />
      </div>

      <div className="rounded-sm border border-stroke bg-white px-5 pt-6 pb-2.5 shadow-default dark:border-strokedark dark:bg-boxdark sm:px-7.5 xl:pb-1">
        <div className="max-w-full overflow-x-auto">
          {loading ? (
            <Loader />
          ) : (
            <>
              <table className="w-full table-auto my-1">
                <thead>
                  <tr className="bg-gray-2 text-left dark:bg-meta-4">
                    <th className="py-4 px-4 font-medium text-black dark:text-white">
                      No
                    </th>
                    <th className="py-4 px-4 font-medium text-black dark:text-white">
                      Nama
                    </th>
                    <th className="py-4 px-4 font-medium text-black dark:text-white">
                      Instansi Bekerja
                    </th>
                    <th className="py-4 px-4 font-medium text-black dark:text-white">
                      Posisi Bekerja
                    </th>
                    <th className="py-4 px-4 font-medium text-black dark:text-white">
                      Kabupaten/Kota
                    </th>
                    <th className="py-4 px-4 font-medium text-black dark:text-white">
                      Action
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {geodatas?.data.map((item: any, key: number) => (
                    <tr key={key}>
                      <td className="border-b border-[#eee] py-5 px-4 dark:border-strokedark">
                        <p className="text-black dark:text-white">
                          {(key+1)+(10*(currentFilter.page-1))}
                        </p>
                      </td>
                      <td className="border-b border-[#eee] py-5 px-4 dark:border-strokedark">
                        <p className="text-black dark:text-white">
                          {item.nama}
                        </p>
                      </td>
                      <td className="border-b border-[#eee] py-5 px-4 dark:border-strokedark">
                        <p className="text-black dark:text-white">
                          {item.instansi_bekerja}
                        </p>
                      </td>
                      <td className="border-b border-[#eee] py-5 px-4 dark:border-strokedark">
                        <p className="text-black dark:text-white">
                          {item.posisi_bekerja}
                        </p>
                      </td>
                      <td className="border-b border-[#eee] py-5 px-4 dark:border-strokedark">
                        <p className="text-black dark:text-white">
                          {item.Kab_kota}
                        </p>
                      </td>
                      <td className="border-b border-[#eee] py-5 px-4 dark:border-strokedark">
                        <div className="flex items-center space-x-3.5">
                          <Link
                            href={"/detaildata?id=" + item.id}
                            className="hover:text-primary"
                          >
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              width="20"
                              height="20"
                              fill="#000000"
                              viewBox="0 0 256 256"
                            >
                              <path d="M247.31,124.76c-.35-.79-8.82-19.58-27.65-38.41C194.57,61.26,162.88,48,128,48S61.43,61.26,36.34,86.35C17.51,105.18,9,124,8.69,124.76a8,8,0,0,0,0,6.5c.35.79,8.82,19.57,27.65,38.4C61.43,194.74,93.12,208,128,208s66.57-13.26,91.66-38.34c18.83-18.83,27.3-37.61,27.65-38.4A8,8,0,0,0,247.31,124.76ZM128,192c-30.78,0-57.67-11.19-79.93-33.25A133.47,133.47,0,0,1,25,128,133.33,133.33,0,0,1,48.07,97.25C70.33,75.19,97.22,64,128,64s57.67,11.19,79.93,33.25A133.46,133.46,0,0,1,231.05,128C223.84,141.46,192.43,192,128,192Zm0-112a48,48,0,1,0,48,48A48.05,48.05,0,0,0,128,80Zm0,80a32,32,0,1,1,32-32A32,32,0,0,1,128,160Z"></path>
                            </svg>
                          </Link>
                          <Link
                            href={"/tables/edit?id=" + item.id}
                            className="hover:text-primary"
                          >
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              width="20"
                              height="20"
                              fill="#000000"
                              viewBox="0 0 256 256"
                            >
                              <path d="M227.31,73.37,182.63,28.68a16,16,0,0,0-22.63,0L36.69,152A15.86,15.86,0,0,0,32,163.31V208a16,16,0,0,0,16,16H92.69A15.86,15.86,0,0,0,104,219.31L227.31,96a16,16,0,0,0,0-22.63ZM51.31,160,136,75.31,152.69,92,68,176.68ZM48,179.31,76.69,208H48Zm48,25.38L79.31,188,164,103.31,180.69,120Zm96-96L147.31,64l24-24L216,84.68Z"></path>
                            </svg>
                          </Link>
                          <button
                            onClick={(e: any) => geodataDelete(item.id)}
                            className="hover:text-primary"
                          >
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              width="20"
                              height="20"
                              fill="#000000"
                              viewBox="0 0 256 256"
                            >
                              <path d="M216,48H40a8,8,0,0,0,0,16h8V208a16,16,0,0,0,16,16H192a16,16,0,0,0,16-16V64h8a8,8,0,0,0,0-16ZM192,208H64V64H192ZM80,24a8,8,0,0,1,8-8h80a8,8,0,0,1,0,16H88A8,8,0,0,1,80,24Z"></path>
                            </svg>
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              <div className="flex overflow-x-auto sm:justify-end mb-2 mt-2">
                <Pagination
                  currentPage={currentFilter.page}
                  totalPages={Math.ceil(geodatas.count / currentFilter.take)}
                  onPageChange={onPageChange}
                />
              </div>
            </>
          )}
        </div>
      </div>
    </>
  );
};

export default TableThree;
