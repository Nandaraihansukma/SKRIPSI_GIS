"use client";
import React from "react";
import { useSession } from "next-auth/react";
// import Map from "../Maps/TestMap";

// without this the component renders on server and throws an error
import dynamic from "next/dynamic";
import { redirect } from "next/navigation";
const MapOne = dynamic(() => import("@/components/Maps/MapOne"), {
    ssr: false,
});

const Dashboard: React.FC = () => {
    const { data: session, status } = useSession();
    if (status == "unauthenticated") {
        redirect("/")
    }
    return (
        <div className="w-full 2xl:px-30 px-10 pt-10">
           
        </div>
    );
};

export default Dashboard;


