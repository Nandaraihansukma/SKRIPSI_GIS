'use client';

import { usePathname } from "next/navigation";

function FooterComponent() {
  const pathname = usePathname();
    if (pathname == "/login"|| pathname == "/map") {
        return (null);
    }
    return (
      <footer className="bg-[#263238] py-3 h-12 w-full text-center">
          <p style={{ color: 'white'}}>
          © Nanda Raihan Sukma - 140810200015
          </p>
      </footer>
    );
  }
  
  export default FooterComponent;

