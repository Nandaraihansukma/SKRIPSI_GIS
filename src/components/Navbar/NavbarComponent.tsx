'use client';

import { Navbar, Button } from 'flowbite-react';
import { usePathname } from "next/navigation";


function NavbarComponent() {
    const pathname = usePathname();
    if (pathname == "/login") {
        return (null);
    }
    return (
        <Navbar className="bg-[#407BFF] sticky top-0 right-0 z-50">
            <Navbar.Brand href="/">
                <img src="../assets/logonavbar.png" className="h-9 sm:h-9" alt="logonavbar" />
            </Navbar.Brand>
            <Navbar.Collapse className="ml-auto">
                <Button href="/" className={`custom-link hover:bg-[#263238] hover:scale-60 rounded-md text-white ${pathname.includes("landing") && "bg-[#263238] dark:bg-meta-4"}`}>Home</Button>
                <Button href="/map" className={`custom-link hover:bg-[#263238] hover:scale-60 rounded-md text-white ${pathname.includes("map") && "bg-[#263238] dark:bg-meta-4"}`}>Peta Alumni</Button>
                <Button href="/database" className={`custom-link hover:bg-[#263238] hover:scale-60 rounded-md text-white ${pathname.includes("database") && "bg-[#263238] dark:bg-meta-4"}`}>Data</Button>
            </Navbar.Collapse>
            {/* <div className="flex md:order-2"></div> */}
        </Navbar>
    );
}

export default NavbarComponent;

// 'use client';

// import { Navbar, Button } from 'flowbite-react';
// import { useEffect, useState } from 'react';

// function NavbarComponent() {
//     const [isNavbarVisible, setIsNavbarVisible] = useState(true);

//     useEffect(() => {
//         const handleScroll = () => {
//             const currentScrollPos = window.pageYOffset;
//             setIsNavbarVisible(currentScrollPos < 10); // Ubah angka 50 sesuai dengan kebutuhan
//         };

//         window.addEventListener('scroll', handleScroll);
//         return () => window.removeEventListener('scroll', handleScroll);
//     }, []);

//     return (
//         <Navbar className={`bg-[#407BFF] ${isNavbarVisible ? 'fixed top-0 w-full z-50' : 'hidden'}`}>
//             <Navbar.Brand href="/">
//                 <img src="../assets/logonavbar.png" className="h-9 sm:h-9" alt="logonavbar" />
//             </Navbar.Brand>
//             <Navbar.Collapse className="ml-auto">
//                 <Button href="/" className="custom-link hover:bg-[#263238] hover:scale-60 rounded-md text-white">Home</Button>
//                 <Button href="/map" className="custom-link hover:bg-[#263238] hover:scale-60 rounded-md text-white">Maps</Button>
//                 <Button href="/database" className="custom-link hover:bg-[#263238] hover:scale-60 rounded-md text-white">Data</Button>
//             </Navbar.Collapse>
//         </Navbar>
//     );
// }

// export default NavbarComponent;
