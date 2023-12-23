import Landing from './landing/page';
import { Metadata } from "next";
import { getServerSession } from "next-auth/next"
import Map from './map/page';

export const metadata: Metadata = {
    title: "TailAdmin | Next.js  Dashboard Template",
    description: "This is Home Blog page for TailAdmin Next.js",
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
