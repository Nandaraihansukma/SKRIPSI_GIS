import { getServerSession } from "next-auth/next";
import { redirect } from "next/navigation";
import { Metadata } from "next";
import { getGeoDataByID } from "@/lib/prisma/geodata";
import dynamic from 'next/dynamic'

export const metadata: Metadata = {
  title: "Form Edit | Admin AlumMap",
  description: "This is form edit data",
  // other metadata
};

const EditMapComp = dynamic(() => import('@/components/GeoData/EditForm'), { ssr: false });


const EditFormPage = async ({
  searchParams,
}: {
  searchParams: { [key: string]: string | string[] | undefined };
}) => {
  const data = await getServerSession();
  if (!data) {
    redirect("/");
  }
  if (typeof searchParams.id == "string") {
    const { res } = await getGeoDataByID(searchParams.id);
    if (res) {
      return (
        <div className="w-full 2xl:px-30 px-10 pt-10">
          <EditMapComp geo_data={res} />
        </div>
      );
    }
  }
};

export default EditFormPage;
