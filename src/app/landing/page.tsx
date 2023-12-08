import React from 'react';
import TextLanding from '@/components/Text/TextLanding';
import CardLanding from '@/components/Card/CardLanding';
import TextareaLanding from '@/components/Textarea/TextareaLanding';

function Landing() {
  return (
    <div className='h-[3029px] w-full 2xl:px-30 px-10 bg-cover bg-top' style={{ backgroundImage: "url('/assets/bg/bg-landing.png')"}}>
        <TextLanding/>
        <CardLanding/>
        <TextareaLanding/>
      {/* Konten halaman Anda akan ada di sini */}
    </div>
  );
};
export default Landing;

