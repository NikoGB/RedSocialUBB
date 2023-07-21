import Head from "next/head";
import { useTheme } from "next-themes";
import { clientRequester } from "../utils/graphqlManager";

import React, { useState, useContext } from "react";
import { UserContext } from '../utils/userContext';
import { useRouter } from "next/router";

export default function Login({ screenWidth }) {
    if(screenWidth == 0){
        return
    }
    
    const { resolvedTheme, setTheme } = useTheme();
    const router = useRouter();
    const { userInfo } = useContext(UserContext);

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");


    const handleLogin = async (e) => {
        e.preventDefault();
        const correoRegex = /^[\w.-]+@[a-zA-Z_-]+?(?:\.[a-zA-Z]{2,6})+$/;

        if (!correoRegex.test(email)) {
            console.log("Email INCORRECTO:", email);
        } else {
            const { buscarUsuarioCorreo } = await clientRequester(
                `query BuscarUsuarioCorreo($correo: String!) {
                    buscarUsuarioCorreo(correo: $correo) {
                        id
                    }
                }`,
                { correo: email }, false)
                .then((data) => {
                    return data;
                })
                .catch((error) => {
                    throw error;
                });

            if (buscarUsuarioCorreo.length > 0) {
                document.cookie = "user=" + buscarUsuarioCorreo[0].id + "; expires=Thu, 01 Jan 2024 00:00:00 UTC; path=/";
                await userInfo();
                router.push("/Feed");
            }
        }
    };

    return (
        <>
            <div
                className={`z-1 fixed bottom-0 left-0 right-0 top-0 ${resolvedTheme === "light" ? "" : " opacity-70 "} 
                bg-background bg-cover bg-fixed`}
            ></div>

            {/* bg */}
            <Head>
                <title>Login</title>
            </Head>
            <main>
                <div className="h-screen w-screen">
                    {/* login form container */}
                    <form
                        onSubmit={handleLogin}
                        className="flex h-full w-full flex-row items-center justify-center "
                    >
                        {screenWidth > 767 && (
                            <div className="z-10 flex h-[80%]  w-[45%] flex-col items-center justify-center rounded-l-[10px] bg-foreground p-4 text-[10px] text-primary shadow-2xl">
                                <div
                                    className="box-border w-[98%] min-w-[98%] max-w-[98%] overflow-hidden rounded-[10px]"
                                    style={{ maxHeight: `90%` }}
                                >
                                    <img
                                        className="mt-[-10%] min-w-full rounded-[10px] object-cover "
                                        style={{ minHeight: "80vh" }}
                                        src="/MainSplash.png"
                                    />
                                </div>
                                <div className="absolute bottom-[20vh]">
                                    {" "}
                                    Red social creada para la Universidad del Bio-Bio
                                </div>
                            </div>
                        )}

                        {/* login form */}
                        <div
                            className="z-10 flex h-[80%] w-[80%] flex-col rounded-l-[10px] rounded-r-[10px] bg-foreground p-[2vw] pl-[12vw] 
            shadow-2xl md:w-[40%] md:rounded-l-[0] md:pl-[5vw]"
                        >
                            {/* login form title */}
                            <h1 className="mt-[5vh] text-4xl font-semibold text-primary ">
                                Iniciar Sesion
                            </h1>
                            <h1 className="mt-[5px] text-lg font-semibold  text-primary ">
                                Inicia sesion para continuar
                            </h1>
                            {/* login form inputs */}
                            <div className="mt-[10vh] flex flex-col">
                                {/* email input */}
                                <input
                                    type="email"
                                    className="my-2 w-5/6 max-w-[400px] rounded-[10px] bg-background p-2  placeholder-secondary outline-none focus:outline-secondary"
                                    placeholder="Correo"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                />

                                {/* password input */}
                                <input
                                    type="password"
                                    className="my-2 mt-[5vh] w-5/6 max-w-[400px] rounded-[10px] bg-background  p-2 placeholder-secondary outline-none focus:outline-secondary"
                                    placeholder="Contraseña"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                />
                            </div>
                            <div className="flex w-full flex-col gap-2  lg:flex-row lg:justify-between">
                                {/* login button */}
                                <button
                                    type="submit"
                                    className=" my-2 mt-[10vh] w-5/6  max-w-[400px]  rounded-[10px] bg-accent p-3  font-semibold hover:bg-primary hover:text-background active:bg-background active:text-primary"
                                >
                                    Iniciar Sesion
                                </button>
                            </div>
                        </div>
                    </form>
                </div>
            </main>
        </>
    );
}
