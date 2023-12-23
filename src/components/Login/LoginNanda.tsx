"use client";

import { Button, Label, TextInput } from "flowbite-react";
import { signIn } from "next-auth/react";
import { useState, MouseEvent } from "react";
import { useRouter } from "next/navigation";

function LoginNanda() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const {push} = useRouter()
  const login = async (e: MouseEvent<HTMLButtonElement>) => {
    console.log("test")
    const res = await signIn("credentialsAuth", {
      email: email,
      password: password,
      redirect: false
    })
    if(res?.ok) push("/")
  }
  return (
    <div className="flex flex-col items-center justify-center">
      <h1 className="text-3xl font-bold mb-4">Login Administrator AlumMap</h1>
      <div className="flex w-full max-w-md flex-col gap-4 mt-6">
        <div>
          <div className="mb-2 block">
            <Label htmlFor="email1" value="Your email" />
          </div>
          <TextInput
            id="email1"
            type="email"
            name="email"
            placeholder="masukkan email anda"
            value={email}
            onChange={e => setEmail(e.currentTarget.value)}
            required
          />
        </div>
        <div>
          <div className="mb-2 block">
            <Label htmlFor="password1" value="Your password" />
          </div>
          <TextInput id="password1" type="password" value={password} required onChange={e => setPassword(e.currentTarget.value)} />
        </div>
        <Button
          className="border-[#263238] border-solid mt-4 border-2 hover:bg-[#263238] font-semibold text-[#263238] hover:text-[#FFFFFF]"
          type="button"
          onClick={login}
        >
          Login
        </Button>
      </div>
    </div>
  );
}

export default LoginNanda;
