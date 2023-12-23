import React from "react";
import { Metadata } from "next";
import { getServerSession } from "next-auth/next"
import { redirect } from "next/navigation";
import LoginNanda from "@/components/Login/LoginNanda";

export const metadata: Metadata = {
    title: "Signin Page",
    description: "This is Signin page",
    // other metadata
};

const SignIn: React.FC = async () => {
    const data = await getServerSession();
    if (data) {
        redirect("/")
    }
    return (
        <div className="h-screen w-screen 2xl:px-30 grid content-center">
            <LoginNanda/>
        </div>
    );
};

export default SignIn;