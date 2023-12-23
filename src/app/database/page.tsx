import DatabaseComponent from "@/components/Database/DatabaseComponent";
import React from "react";
import { getServerSession } from "next-auth/next";
import { redirect } from "next/navigation";

async function DBPage() {
  const session = await getServerSession();
  if (session) {
    redirect("/");
  }
  return (
    <div className="w-full xl:px-30 px-10 mt-4">
      <DatabaseComponent />
    </div>
  );
}

export default DBPage;

