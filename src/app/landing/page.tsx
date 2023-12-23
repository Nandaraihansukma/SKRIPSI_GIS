import React from 'react';
import TextLanding from '@/components/Text/TextLanding';
import { getServerSession } from "next-auth/next";
import { redirect } from "next/navigation";


async function Landing() {
  const session = await getServerSession();
  if (session) {
    redirect("/");
  }
  return (
      <div className='w-full 2xl:px-30 px-10 bg-white flex items-center'>
        <img src="/assets/gambarHome.png" alt="gambarHome" className="w-150 h-auto ml-20 mr-10" />
          <TextLanding/>
    </div>
  );
};
export default Landing;

