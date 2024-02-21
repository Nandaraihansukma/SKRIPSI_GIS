"use client";

import Loader from "@/components/common/Loader";
import TableData from "@/components/Table Data/TableData";
import { Pagination } from "flowbite-react";
import { useEffect, useState } from "react";
import { Dropdown } from 'flowbite-react';

function DatabaseComponent() {
    const [loading, setLoading] = useState<boolean>(true);
    const [yearDD, setYearDD] = useState<any>(null);

    // Fetch Data
    const [geodatas, setGeodatas] = useState({ data: [], count: 0 });

    // Search, Pagination, Take
    const [currentFilter, setCurrentFilter] = useState({
        search: "",
        take: 10,
        page: 1,
        year: 0,
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
        const yearDD = await fetch("/api/geodata/year", {
            method: "GET",
        });
        const { data: dataYear }: { data: any } = await yearDD.json();
        setYearDD(dataYear);
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
        console.log(data);
        setGeodatas({ data: data, count: count });
    };
    const geodataSearch = async () => {
        const res = await fetch(
            "/api/geodata/search?" +
            new URLSearchParams({
                filter: currentFilter.search,
                take: currentFilter.take.toString(),
                page: currentFilter.page.toString(),
                year: currentFilter.year.toString(),
            }),
            {
                method: "GET",
            }
        );
        const { data, count } = await res.json();
        setGeodatas({ data: data, count: count });
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
        setTimeout(() => setLoading(false), 1000);
    }, [currentFilter.toggle]);

    return (
        <>
            <div className="w-full flex justify-end px-8">
                <div className="flex mt-4 content-end max-w-md bg-white rounded-lg shadow-md">
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
                                        year: 0,
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
                                    year: 0,
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
                        <svg className="group-hover:fill-white"
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
            </div>
            <Dropdown label="Year" style={{ backgroundColor: "black", color: "white" }} dismissOnClick={false}>
                <Dropdown.Item key={0} onClick={() => setCurrentFilter({ ...currentFilter, mode: "search", year: 0, toggle: !currentFilter.toggle })}>
                    None
                </Dropdown.Item>
                {yearDD?.map((item: any) => {
                    return (
                        <Dropdown.Item key={item} onClick={() => setCurrentFilter({ ...currentFilter, mode: "search", year: item.tahun, toggle: !currentFilter.toggle })}>
                            {item.tahun}
                        </Dropdown.Item>
                    )
                })}
            </Dropdown>

            <div className="relative min-h-[96px] w-full">
                {loading ? (
                    <Loader />
                ) : (
                    <>
                        <TableData data={geodatas.data} currentPage={currentFilter.page} />
                        <div className="flex overflow-x-auto sm:justify-end mx-8 mt-2 mb-8">
                            <Pagination
                                currentPage={currentFilter.page}
                                totalPages={Math.ceil(geodatas.count / currentFilter.take)}
                                onPageChange={onPageChange}
                            />
                        </div>
                    </>
                )}
            </div>
        </>
    );
}
export default DatabaseComponent;
