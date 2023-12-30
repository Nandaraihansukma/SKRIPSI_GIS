import { getServerSession } from "next-auth/next"
import { redirect } from "next/navigation";
import { Metadata } from "next";
import EditForm from "@/components/GeoData/EditForm";
export const metadata: Metadata = {
    title: "Form Edit | Admin AlumMap",
    description: "This is form edit data",
    // other metadata
};

const EditFormPage = async () => {
    const data = await getServerSession();
    if (!data) {
        redirect("/")
    }
    return (
        <div className="w-full 2xl:px-30 px-10 pt-10">
            <EditForm />
        </div>
    );
};

export default EditFormPage;
