import { getServerSession } from "next-auth/next"
import { redirect } from "next/navigation";
import { Metadata } from "next";
import dynamic from 'next/dynamic'

const AddForm = dynamic(() => import('@/components/GeoData/AddForm'), { ssr: false });

export const metadata: Metadata = {
    title: "Form Layout Page | Next.js E-commerce Dashboard Template",
    description: "This is Form Layout page for TailAdmin Next.js",
    // other metadata
};

const TambahForm = async () => {
    const data = await getServerSession();
    if (!data) {
        redirect("/")
    }
    return (
        <div className="w-full 2xl:px-30 px-10 pt-10">
            <AddForm />
        </div>
    );
};

export default TambahForm;
