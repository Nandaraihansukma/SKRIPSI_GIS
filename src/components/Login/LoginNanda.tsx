"use client";

// import { Button, Label, TextInput } from "flowbite-react";
// import { signIn } from "next-auth/react";
// import { useState, MouseEvent } from "react";
// import { useRouter } from "next/navigation";

// function LoginNanda() {
//   const [email, setEmail] = useState("")
//   const [password, setPassword] = useState("")
//   const {push} = useRouter()
//   const login = async (e: MouseEvent<HTMLButtonElement>) => {
//     console.log("test")
//     const res = await signIn("credentialsAuth", {
//       email: email,
//       password: password,
//       redirect: false
//     })
//     if(res?.ok) push("/")
//   }
//   return (
//     <div className="flex flex-col items-center justify-center">
//       <h1 className="text-3xl font-bold mb-4">Login Administrator AlumMap</h1>
//       <div className="flex w-full max-w-md flex-col gap-4 mt-6">
//         <div>
//           <div className="mb-2 block">
//             <Label htmlFor="email1" value="Your email" />
//           </div>
//           <TextInput
//             id="email1"
//             type="email"
//             name="email"
//             placeholder="masukkan email anda"
//             value={email}
//             onChange={e => setEmail(e.currentTarget.value)}
//             required
//           />
//         </div>
//         <div>
//           <div className="mb-2 block">
//             <Label htmlFor="password1" value="Your password" />
//           </div>
//           <TextInput id="password1" type="password" value={password} required onChange={e => setPassword(e.currentTarget.value)} />
//         </div>
//         <Button
//           className="border-[#263238] border-solid mt-4 border-2 hover:bg-[#263238] font-semibold text-[#263238] hover:text-[#FFFFFF]"
//           type="button"
//           onClick={login}
//         >
//           Login
//         </Button>
//       </div>
//     </div>
//   );
// }

// export default LoginNanda;

// import { Formik, Form, Field, ErrorMessage } from 'formik';
// import { Button, Label } from 'flowbite-react';
// import { signIn } from 'next-auth/react';
// import { useRouter } from "next/navigation";
// import * as Yup from 'yup';

// function LoginNanda() {
//   const { push } = useRouter();

//   const validationSchema = Yup.object().shape({
//     email: Yup.string().email('Invalid email').required('Required'),
//     password: Yup.string().required('Required'),
//   });

//   const handleSubmit = async (values: { email: any; password: any; }) => {
//     const res = await signIn('credentialsAuth', {
//       email: values.email,
//       password: values.password,
//       redirect: false,
//     });

//     if (res?.ok) push('/');
//   };

//   return (
//     <div className="flex flex-col items-center justify-center">
//       <h1 className="text-3xl font-bold mb-4">Login Administrator AlumMap</h1>
//       <Formik
//         initialValues={{ email: '', password: '' }}
//         validationSchema={validationSchema}
//         onSubmit={handleSubmit}
//       >
//         {() => (
//           <Form className="flex w-full max-w-md flex-col gap-4 mt-6">
//             <div>
//               <div className="mb-2 block">
//                 <Label htmlFor="email1" value="Your email" />
//               </div>
//               <Field
//                 id="email1"
//                 type="email"
//                 name="email"
//                 placeholder="Enter your email"
//                 className="border border-gray-300 rounded-md px-3 py-2 w-full"
//               />
//               <ErrorMessage name="email" component="div" className="text-red-500 !text-xs pl-1 pt-1" />
//             </div>
//             <div>
//               <div className="mb-2 block">
//                 <Label htmlFor="password1" value="Your password" />
//               </div>
//               <Field
//                 id="password1"
//                 type="password"
//                 name="password"
//                 placeholder="Enter your password"
//                 className="border border-gray-300 rounded-md px-3 py-2 w-full"
//               />
//               <ErrorMessage name="password" component="div" className="text-red-500 !text-xs pl-1 pt-1" />
//             </div>
//             <Button
//               type="submit"
//               className="border-[#263238] border-solid mt-4 border-2 hover:bg-[#263238] font-semibold text-[#263238] hover:text-[#FFFFFF]"
//             >
//               Login
//             </Button>
//           </Form>
//         )}
//       </Formik>
//     </div>
//   );
// }

// export default LoginNanda;

import React, { useEffect, useState } from "react";
import { Button, Label, TextInput } from 'flowbite-react';
import { useFormState } from "react-dom";
import { LoginAction } from "./LoginAction";
import ModalComponent from "@/components/Modal/ModalComponent";


const initialState = {
    message: null,
}

function LoginForm() {
    const [state, loginFormAction] = useFormState(LoginAction, initialState);
    const [disableLogin, setDisableLogin] = useState(false);
    const [optModal, setOptModal] = useState<{
        open: boolean,
        status: "success" | "error",
        message: string
    }>({
        open: false,
        status: "success",
        message: ""
    });

    const setModal = ({ open, status, message }: { open: boolean, status: "success" | "error", message: string }) => {
        setOptModal({ open: open, status: status, message: message });
    }
    useEffect(() => {
        if (state.message == null || state.message == "Success") {
            return
        }
        setDisableLogin(false);
        setOptModal({ open: true, status: "error", message: state.message });
    }, [state])

    return (
        <>
            <ModalComponent optModal={optModal} setModal={setModal} />
            <div className="h-fit w-full max-h-fit max-w-screen-2xl py-10 my-auto mx-autorounded-sm dark:border-strokedark dark:bg-boxdark">
                <div className="grid h-full place-items-center">
                    <div className="max-w-2xl w-full py-3 xl:py-15 px-[5%] lg:px-[10%] border border-stroke bg-white shadow-default">
                        <form className="flex w-full flex-col gap-4" action={loginFormAction} onSubmit={(e)=>{
                            setDisableLogin(true);
                        }}>
                            <h2 className="text-2xl font-bold text-[#263238] dark:text-white sm:text-title-xl2">
                                Administrator AlumMap<br />
                            </h2>

                            <div>
                                <div className="mb-2 block">
                                    <Label className="text-md" htmlFor="email" value="Email" />
                                </div>
                                <TextInput id="email" name="email" type="email" placeholder="Enter your email" required shadow />
                            </div>
                            <div>
                                <div className="mb-2 block">
                                    <Label className="text-md" htmlFor="password" value="Password" />
                                </div>
                                <TextInput id="password" name="password" type="password" placeholder="Enter your password" required shadow />
                            </div>
                            <Button id="login-bttn" className="border-[#263238] border-solid border-2 hover:bg-[#263238] font-semibold text-[#263238] hover:text-[#FFFFFF]" type="submit" disabled={disableLogin}>
                                <span className="font-satoshi text-base">
                                    Masuk
                                </span>
                            </Button>
                        </form>
                    </div>
                </div>
            </div>
        </>
    );
}

export default LoginForm;