"use client";
import "@/app/globals.css"
import "@/app/data-tables-css.css"
import "@/app/satoshi.css"
import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import NavbarComponent from "@/components/Navbar/NavbarComponent";
import Loader from "@/components/common/Loader";
import Sidebar from "@/components/Sidebar";
import Header from "@/components/Header";
import FooterComponent from "../Footer/FooterComponent";

export default function RootLayoutComponent({
    children,
}: {
    children: React.ReactNode;
}) {
    const [checkSession, changeCheckSession] = useState(false);
    const { data: session, status, update } = useSession();
    const [sidebarOpen, setSidebarOpen] = useState(false);

    const [loading, setLoading] = useState<boolean>(false);

    useEffect(() => {
        console.log(status)
        if (checkSession) {
            window.location.reload()
        }
        setTimeout(() => setLoading(false), 1000);
        setTimeout(() => changeCheckSession(true), 5000);
    }, [status]);
    return (
        <html lang="en">
            <body suppressHydrationWarning={true}>
                <div className="dark:bg-boxdark-2 dark:text-bodydark">
                    {loading ? (
                        <Loader root={true} />
                    ) : (
                        <div className="flex h-screen overflow-hidden">
                            {/* <!-- ===== Sidebar Start ===== --> */}
                            {status == "unauthenticated" ? (
                                null
                            ) : (
                                <Sidebar
                                    sidebarOpen={sidebarOpen}
                                    setSidebarOpen={setSidebarOpen}
                                />
                            )}
                            {/* <!-- ===== Sidebar End ===== --> */}

                            {/* <!-- ===== Content Area Start ===== --> */}
                            <div className="relative flex flex-1 flex-col overflow-y-auto overflow-x-hidden">
                                {/* <!-- ===== Header Start ===== --> */}
                                {status == "unauthenticated" ? (
                                    <NavbarComponent />
                                ) : (
                                    <Header
                                        sidebarOpen={sidebarOpen}
                                        setSidebarOpen={setSidebarOpen}
                                        session={session}
                                    />
                                )}
                                {/* <!-- ===== Header End ===== --> */}

                                {/* <!-- ===== Main Content Start ===== --> */}
                                <main className="flex flex-grow bg-white ">
                                    {children}
                                </main>
                                {status == "unauthenticated" ? (
                                    <FooterComponent/>
                                ) : (
                                    null
                            
                                )}
                            </div>
                            {/* <!-- ===== Content Area End ===== --> */}
                        </div>
                    )}
                </div>
            </body>
        </html>
    );
}
