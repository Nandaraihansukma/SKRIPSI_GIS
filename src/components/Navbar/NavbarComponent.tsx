'use client';

import { Navbar, Button } from 'flowbite-react';
import { usePathname } from "next/navigation";

function NavbarComponent() {
    const pathname = usePathname();
    if (pathname == "/login") {
        return (null);
    }
    return (
        <Navbar className="bg-[#174405] 2xl:px-30 px-10 text-white" fluid rounded>
            <Navbar.Brand href="/">
                <img src="../assets/logo.png" className="mr-3 h-6 sm:h-5" alt="logo" />
                <span className="self-center whitespace-nowrap text-xl font-semibold dark:text-white">SIG</span>
            </Navbar.Brand>
            <div className="flex md:order-2">
                <Button href="/" className="custom-link bg-[#174405] text-white">Contact Us</Button>
                <Navbar.Toggle />
            </div>
            <Navbar.Collapse>
                <Button href="/" className="custom-link bg-[#174405] hover:bg-[#EFBE55] text-white">Home</Button>
                <Button href="/map" className="custom-link bg-[#174405] hover:bg-[#EFBE55] text-white">Maps</Button>
                <Button href="/database" className="custom-link bg-[#174405] hover:bg-[#EFBE55] text-white">Data</Button>
            </Navbar.Collapse>
            {/* <div className="flex md:order-2"></div> */}
        </Navbar>
    );
}

export default NavbarComponent;




