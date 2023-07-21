import '../styles/globals.css'
import { ThemeProvider } from 'next-themes'
import React, { useEffect, useState } from 'react';
import { UserProvider } from '../utils/userContext';
import { useTheme } from "next-themes";
import ConfirmModal from "../components/ConfirmModal"

export default function App({ Component, pageProps }) {
    const { resolvedTheme } = useTheme();
    const [screenWidth, setWidth] = useState(0);
    const [modalOpen, setModalOpen] = useState(false);
    const [modalConfirm, setModalConfirm] = useState(null);
    const [modalMsg, setModalMsg] = useState("");
    
    useEffect(() => {
        function handleResize() {
            setWidth(window.innerWidth);
        }

        handleResize()
        window.addEventListener('resize', handleResize);

        return () => window.removeEventListener('resize', handleResize);
    }, []);

    const getLayout = Component.getLayout || ((page) => <div className="absolute left-0 right-0">{page}</div>);

    const showModal = async (handleConfirm, msg)=>{
        const auxConfirm = async ()=>{  await handleConfirm(); setModalOpen(false);}
        setModalMsg(msg);
        setModalOpen(true)
        setModalConfirm(()=>auxConfirm)
    }


    return (
        <UserProvider>
            <ThemeProvider>
                <div className={`fixed z-[-1] top-0 left-0 right-0 bottom-0 ${resolvedTheme === 'light' ? "" : " opacity-70 "} bg-background bg-cover bg-fixed`} />

                
                    {getLayout(<Component {...pageProps} screenWidth={screenWidth} showModal={showModal}/>, screenWidth)}

                    {modalOpen && <ConfirmModal isOpen={modalOpen} onClose={() => setModalOpen(false)} onConfirm={modalConfirm} msg={modalMsg} />}
                    
            </ThemeProvider>
        </UserProvider>
    )
}
