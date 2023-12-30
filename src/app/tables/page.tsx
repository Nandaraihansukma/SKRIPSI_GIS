import { getServerSession } from "next-auth/next"
import { redirect } from "next/navigation";
// import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";
import WhiteButton from "@/components/Button/WhiteButton";
import TableThree from "@/components/Tables/TableThree";


import { Metadata } from "next";
export const metadata: Metadata = {
    title: "Tables Page | AlumMap Admin",
    description: "This is Tables page for Admin AlumMap",
    // other metadata
};

const TablesPage = async () => {
    const data = await getServerSession();
    if (!data) {
        redirect("/")
    }
    return (
        <>
            <div className="w-full 2xl:px-30 px-10 pt-10">
                {/* <Breadcrumb pageName="Tables" /> */}
                <div className="flex flex-col gap-10">
                    <TableThree />
                </div>
            </div>
        </>
    );
};

export default TablesPage;
