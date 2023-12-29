import Landing from './landing/page';
import { Metadata } from "next";
import { getServerSession } from "next-auth/next"
import Map from './map/page';

export const metadata: Metadata = {
    title: "AlumMap",
    description: "AlumMap adalah peta interaktif untuk pemetaan alumni teknik informatika Unpad",
    // other metadata
};

export default async function Home() {
    const session = await getServerSession();
    return (
        <>
            {session ? (
                <Map />
            ) : (
                <Landing />
            )}
        </>
    )
}
