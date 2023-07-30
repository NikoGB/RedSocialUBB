import {
    AiOutlineHome, AiOutlineUser, AiOutlineSetting, AiOutlineCalendar, AiOutlineApartment,
    AiOutlineMenu
} from "react-icons/ai";

import { useRouter } from 'next/router';
import React, { useState, useEffect, useContext } from 'react';
import { UserContext } from '../utils/userContext';


import Header from "../components/Header"
import Chat from "../components/Chat";
import FriendsList from "../components/FriendList";
import EventList from "../components/EventList";


export default function Home({ screenWidth, children }) {

    const router = useRouter();

    const [prevScrollPos, setPrevScrollPos] = useState(0);
    const [headerVisible, setHeaderVisible] = useState(true)

    const [actPage, setActPage] = useState(0);
    const [isNavigating, setIsNavigating] = useState(false);

    const { userInfo, user, chats } = useContext(UserContext);

    
    useEffect(() => {
        if (!user) {
            
            userInfo().then(info => {
                console.log("Usuario Conectado", info)
                console.log(info);
            })
        }

    }, []);

    useEffect(() => {
        const handleScroll = () => {
            const currentScrollPos = window.scrollY;
            const isHeaderVisible = prevScrollPos > currentScrollPos || currentScrollPos < 20;

            setPrevScrollPos(currentScrollPos);
            setHeaderVisible(isHeaderVisible);

        };

        window.addEventListener('scroll', handleScroll);

        return () => {
            window.removeEventListener('scroll', handleScroll);
        };
    }, [prevScrollPos]);

    const handleMenuTransitions = (idx) => {
        if (idx === actPage || isNavigating) { return; }

        setIsNavigating(true);
        setActPage(idx);
    };

    useEffect(() => {
        let navigationTimeout = null;

        if (isNavigating) {
            document.title = 'Cargando...'; // Set the title to show the spinner

            navigationTimeout = setTimeout(() => {
                const href = actPage == 0 ? '/Feed' : '/Friends';
                router.push(href);
            }, 200);
        } else {
            document.title = 'uChat - Home'; // Restore the original title
        }

        return () => {
            if (navigationTimeout) {
                clearTimeout(navigationTimeout);
                setIsNavigating(false);
            }
        };
    }, [isNavigating, actPage, router]);

    if(!user){
        return(<></>)
    }

    return (<>

        {
            <div className="flex justify-center items-start ">
               
                {/* Seccion Izquierda */}
                {screenWidth >= 1024 &&
                    <>
                        <div className={`fixed flex flex-col items-center w-[20vw] z-2 left-8 ${headerVisible ? "transform transition-transform duration-100 ease-in-out translate-y-[90px]" :
                            "transform transition-transform duration-100 ease-in-out translate-y-[30px]"}`}>

                            {/* Boton Perfil */}
                            <div className="flex justify-start items-center bg-foreground w-full h-[100px] rounded-[10px] overflow-hidden cursor-pointer hover:bg-primary hover:text-foreground shadow-md">
                                <img className="object-cover w-[60px] h-[60px] rounded-[6px] mr-4 ml-4" src={user.foto_perfil} alt={`${user.username}'s profile picture`} />

                                <div className="flex flex-col ml-1 mt-3 mb-3 mr-[20px]  w-[calc(100%-150px)]">
                                    <h2 className="text-[18px] font-bold whitespace-nowrap overflow-hidden overflow-ellipsis max-w-[100%]">{user.username}</h2>
                                    <p className="mt-1 text-base whitespace-nowrap overflow-hidden overflow-ellipsis max-w-[100%]">{user.correo}</p>
                                </div>
                                <AiOutlineMenu className="w-[1.5rem] h-[1.5rem] mr-[15px]" />

                            </div>


                            {/* Menu isquierdo */}
                            <div className="flex flex-col bg-foreground w-full mt-[30px] rounded-lg overflow-hidden shadow-md">
                                {homeMenuElements({ actPage, handleMenuTransitions })}
                            </div>
                        </div>
                        <div className={`fixed flex flex-col items-center w-[20vw] z-2 right-8 
                            ${headerVisible ? "transform transition-transform duration-100 ease-in-out translate-y-[90px]" :
                                "transform transition-transform duration-100 ease-in-out translate-y-[30px]"}`}>
                            {/*Seccion derecha*/}
                            <EventList />

                            <FriendsList friends={user.amigos} hide={actPage === 1} />
                        </div>
                    </>
                }


                {/* Chats */}
                <div className="fixed z-20 bottom-0 flex right-0 items-end pointer-events-none">
                    {chats.filter((x) => x.active).map((chat) => (
                        <Chat key={chat.id} chatInfo={chat} user={user} />
                    ))}
                </div>
                <Header headerVisible={headerVisible} screenWidth={screenWidth} user={user} menuElements={homeMenuElements({ actPage, handleMenuTransitions })}/>
               
                <div className="overflow-hidden ">
                    <div className={`absolute left-0 right-0 z-[-1] flex justify-center items-start ${isNavigating ? "animate-verticalOut" : "animate-verticalIn"}`}>
                        {children}
                    </div>
                </div>
            </div>

        }


    </>
    );
}




const homeMenuElements = ({ actPage, handleMenuTransitions }) => {
    const buttStyle = "flex justify-start items-center w-full h-[60px] p-[20px] pl-[30px] text-lg font-bold text-secondary transition-colors border-b border-background hover:bg-primary hover:text-foreground"

    const actButtonStyle = (idx) => {
        if (idx == actPage) {
            return {

                style: { color: 'var(--text-color)', borderLeft: '4px solid var(--text-color)' },
                onMouseEnter: (e) => { e.target.style.color = 'var(--accent-color)' },
                onMouseLeave: (e) => { e.target.style.color = 'var(--text-color)' }
            };
        } else {
            return ({})
        }
    }

    return (
        <>
            <button className={buttStyle} {...actButtonStyle(0)} onClick={() => handleMenuTransitions(0)}>
                <AiOutlineHome className="w-[25px] h-[25px] mr-[3vw]" /> Feed </button>

            <button className={buttStyle} {...actButtonStyle(1)} onClick={() => handleMenuTransitions(1)}>
                <AiOutlineUser className="w-[25px] h-[25px] mr-[3vw]" /> Amigos </button>

            <button className={buttStyle} {...actButtonStyle(2)} onClick={() => handleMenuTransitions(2)}>
                <AiOutlineCalendar className="w-[25px] h-[25px] mr-[3vw]" /> Eventos </button>

            <button className={buttStyle} {...actButtonStyle(3)} onClick={() => handleMenuTransitions(3)}>
                <AiOutlineApartment className="w-[25px] h-[25px] mr-[3vw]" /> Comunidades </button>

            <button className={buttStyle} {...actButtonStyle(4)} onClick={() => handleMenuTransitions(4)}>
                <AiOutlineSetting className="w-[25px] h-[25px] mr-[3vw]" /> Ajustes </button>
        </>
    )
}

