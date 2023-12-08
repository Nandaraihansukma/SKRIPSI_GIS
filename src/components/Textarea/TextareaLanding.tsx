'use client';

import { Textarea, Button } from 'flowbite-react';

function TextareaLanding() {
  return (
    <div className="items-center h-screen">
      <form className="flex-col gap-4">
        <div className="mb-2 block">
          <h5 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-white text-center mt-20">
            Laporkan Kegiatan Deforestasi
          </h5>
          <Textarea
            className="mx-auto w-2/3 py-3 bg-[#EBF4EC] border-[#165728] focus:outline-none focus:border-blue-500 mt-5"
          />
          <Button type="submit" className="mx-auto mt-4 bg-[#174405] hover:bg-[#EFBE55] font-semibold text-white">Submit</Button>
        </div>
      </form>
    </div>
  );
}

export default TextareaLanding;
