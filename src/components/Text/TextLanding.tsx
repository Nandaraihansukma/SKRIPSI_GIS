'use client';

import React from 'react';
import { Button } from 'flowbite-react';

function TextLanding() {
  return (
    <div className="text-left pl-15 mt-5 max-w-xl"> {/* Menambahkan padding kiri, margin atas, dan lebar maksimum */}
      <h1 className="text-4xl md:text-6xl font-bold text-gray-800 mb-8">AlumMap</h1>
      <p className="text-lg md:text-xl mb-4 text-gray-600 text-justify">Selamat datang di AlumMap, platform inovatif yang secara khusus didedikasikan untuk menggambarkan jejak karier alumni dari Program Studi Teknik Informatika Universitas Padjadjaran. AlumMap merupakan sebuah sistem informasi geografis yang memungkinkan Anda untuk menjelajahi, menemukan, dan melacak lokasi tempat kerja alumni. </p>
      <Button href="/map" className="mt-4 border-[#263238] border-solid border-2 hover:bg-[#263238] w-full md:w-auto md:inline-block py-1 font-semibold text-[#263238] hover:text-[#FFFFFF]">Jelajahi Peta</Button>
    </div>
  );
}

export default TextLanding;




