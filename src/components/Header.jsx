import {
    AiOutlineComment, AiOutlineSearch, AiOutlineBell, AiOutlineBulb, AiFillCaretLeft, AiOutlineMenu
} from "react-icons/ai";

import React, { useState, useEffect, useContext } from 'react';
import { UserContext } from '../utils/userContext';
import { useTheme } from "next-themes";


export default function Header({ headerVisible, screenWidth, user, menuElements }) {

    const { resolvedTheme, setTheme } = useTheme();
    const { lastMsgChats, getLastMsgChats, changeChatState, isNewMsgs, setIsNewMsgs } = useContext(UserContext);

    const [chatsMenuOpen, setChatsMenuOpen] = useState(false);
    const [sideMenuOpen, setSideMenuOpen] = useState(false)
    const [onHoverLi, setOnHoverLi] = useState(-1);


    useEffect(()=>{
        if (!lastMsgChats || lastMsgChats.length == 0) {
            getLastMsgChats();
        }
    }, [])

    const handleLastMsgs = () => {
        setChatsMenuOpen(!chatsMenuOpen)
        
    }

    return (
        <>
            <header className={`fixed flex items-center z-99 h-[70px] w-screen bg-foreground shadow-md ${headerVisible ? 'transform -translate-y-0 transition-transform duration-100 ease-in-out' : 'transform -translate-y-[70px] transition-transform duration-100 ease-in-out'}`}>

                {(screenWidth >= 1024 &&
                    <div className="flex items-center w-200">
                        <img className="relative mt-[7px] ml-[7vw] w-[140px] h-[50px]" src="/LogoUchat.png" alt="Your Logo" />
                        {/* <img className="mask" /></div> */}
                    </div>)
                    ||
                    <button onClick={() => setSideMenuOpen(true)} className="ml-[10vw] my-[14px]">
                        <img className=" w-[4vw] h-[4vw] min-w-[40px] min-h-[40px] rounded-[6px] " src={user.foto_perfil} alt={`${user.username}'s profile picture`} />
                        {/* <AiOutlineMenu className="text-secondary w-[2rem] h-[2rem] hover:text-accent" /> */}
                    </button>
                }

                <div className={"absolute flex-grow flex justify-center left-1/2 items-center w-0 " + (screenWidth < 768 ? "ml-[8vw]" : "")}>
                    <form className="flex items-center min-w-[60vw] md:min-w-[30vw] w-[30vw] bg-background rounded-[10px] m-[30px]" action="#">
                        <input className="flex-grow border-none bg-background text-base rounded-[10px]  p-[10px] pl-[20px] w-[92%] max-[w-100%] placeholder-secondary focus:outline-none" type="text" placeholder="Buscar" />
                        {<button className="border-none bg-transparent text-base text-inherit w-[8%] min-w-[30px]" type="submit">
                            <AiOutlineSearch className="w-[1.5rem] h-[1.5rem]" />
                        </button>}
                    </form>
                </div>

                {(screenWidth > 768 && <div className="flex justify-between items-center lg:w-[15vw] w-[18vw] min-w-[150px] ml-auto mr-[5vw]">
                    <button className="relative inline-block min-w-[45px] w-[45px] h-[45px] rounded-[10px] bg-primary text-background hover:bg-background hover:text-primary"
                        onClick={() => {handleLastMsgs(); setIsNewMsgs(false); }}>
                        <AiOutlineComment className="ml-[11px] w-[1.5rem] h-[1.5rem] " />
                        {isNewMsgs &&
                            <div className="absolute top-[3px] right-[3px]  w-3 h-3 bg-accent rounded-full">
                                <div className=" animate-ping absolute  w-3 h-3 bg-accent rounded-full" /> 
                            </div>}
                    </button>
                    <button className="relative inline-block min-w-[45px] w-[45px] h-[45px] rounded-[10px] bg-primary text-background hover:bg-background hover:text-primary">
                        <AiOutlineBell className="ml-[11px] w-[1.5rem] h-[1.5rem] " />
                        {false && //Reemplazar por la condicion de nueva notificacion
                            <div className="absolute top-[3px] right-[3px] w-3 h-3 bg-accent rounded-full">
                                <div className="animate-ping absolute w-3 h-3 bg-accent rounded-full" />
                            </div>}
                    </button>
                    <button className="relative inline-block min-w-[45px] w-[45px] h-[45px] rounded-[10px] bg-background text-primary hover:bg-primary hover:text-background"
                        onClick={() => setTheme(resolvedTheme === 'dark' ? 'light' : 'dark')}>
                        <AiOutlineBulb className="ml-[11px] w-[1.5rem] h-[1.5rem] " />
                    </button>

                </div>)}

                <div className="absolute left-0 mb-[-90px] h-[20px] w-full bg-gradient-to-t from-transparent to-background" />
                {chatsMenuOpen && PrevChats(lastMsgChats, setOnHoverLi, onHoverLi, changeChatState)}

            </header>

            {screenWidth < 1024 && <SideMenu user={user} sideMenuOpen={sideMenuOpen} setSideMenuOpen={setSideMenuOpen} menuElements={menuElements} setTheme={setTheme} handleLastMsgs={handleLastMsgs} />}

        </>
    );
}

const PrevChats = (lastMsgChats, setOnHoverLi, onHoverLi, changeChatState) => {

    return (
        <ul className="list-container shadow-2xl bg-background fixed top-[76px] sm:right-0 md:right-[5vw] xl:right-[8vw]
        md:max-w-[300px] max-w-[100vw] h-[400px] rounded-[10px]  border-[1px] border-foreground" onMouseOut={() => setOnHoverLi(-1)}>

            {lastMsgChats.map((chat, index) => (
                <li key={chat.id} className="flex flex-row cursor-pointer border-b h-[60px] items-center snap-start border-secondary border-dotted p-2 hover:bg-primary hover:text-background "
                    onMouseOver={() => setOnHoverLi(index)} onClick={() => changeChatState(chat.id, true)}>
                    <img src={chat.mensajes[0].usuario.foto_perfil} className='w-[40px] h-[40px] rounded-[10px] md:mr-[0.5rem] mr-[1rem] ml-[1rem]' alt={`${chat.mensajes[0].usuario.username}'s profile picture`} />
                    <h1 className={`text-[16px] font-bold ${index == onHoverLi ? "text-background" : "text-secondary"} mr-[10px]`}> {chat.mensajes[0].usuario.username.charAt(0).toUpperCase() + chat.mensajes[0].usuario.username.slice(1) + ":   "} </h1>
                    <h1 className='text-[16px] font-thin truncate'> {chat.mensajes[0].texto} </h1>
                    {chat.newMsg && <div className="absolute right-3 w-3 h-3 bg-accent rounded-full">
                        <div className="animate-ping absolute w-3 h-3 bg-accent rounded-full" /></div>}
                </li>
            ))}
        </ul>
    )
}


const SideMenu = ({ user, sideMenuOpen, setSideMenuOpen, menuElements, setTheme, handleLastMsgs }) => {
    const buttStyle = "flex justify-start items-center w-full h-[60px] p-[20px] pl-[30px] text-lg font-bold text-secondary transition-colors hover:bg-primary hover:text-foreground"

    return (
        <div className="relative">
            <div className={`fixed top-0 left-0 w-64 shadow-2xl bg-background h-full overflow-hidden transition-transform duration-300 ease-in-out transform ${sideMenuOpen ? 'translate-x-0' : '-translate-x-full'}`} >

                <div className="flex justify-start items-center w-full h-[100px] overflow-hidden cursor-pointer hover:bg-primary hover:text-foreground shadow-md">
                    <img className="object-cover w-[60px] h-[60px] rounded-[6px] mr-4 ml-4" src={user.foto_perfil} alt={`${user.username}'s profile picture`} />

                    <div className="flex flex-col ml-1 mt-3 mb-3 mr-[20px]  w-[calc(100%-150px)]">
                        <h2 className="text-[18px] font-bold whitespace-nowrap overflow-hidden overflow-ellipsis max-w-[100%]">{user.username}</h2>
                        <p className="mt-1 text-base whitespace-nowrap overflow-hidden overflow-ellipsis max-w-[100%]">{user.correo}</p>
                    </div>
                    <AiOutlineMenu className="w-[1.5rem] h-[1.5rem] mr-[15px]" />

                </div>

                <button className="z-10 p-2 w-full hover:bg-primary hover:text-background" onClick={() => setSideMenuOpen(false)} >
                    <AiFillCaretLeft className="w-[2rem] h-[2rem] ml-auto mr-0" />
                </button>


                <ul className="py-[1vh]">
                    <button className={buttStyle} onClick={() => handleLastMsgs()}>
                        <AiOutlineComment className="w-[25px] h-[25px] mr-[3vw]" /> Chats
                    </button>
                    <button className={buttStyle}>
                        <AiOutlineBell className="w-[25px] h-[25px] mr-[3vw]" /> Notificaciones
                    </button>
                </ul>

                <div className='w-[90%] h-[1px] mt-[5px] mb-[10px]  mx-auto bg-gradient-to-r from-transparent from-[-5%] via-secondary via-30% to-transparent to-105%' />

                <ul className="py-[1vh]">
                    {menuElements}
                </ul>

                <div className='w-[90%] h-[1px] mt-[5px] mb-[10px]  mx-auto bg-gradient-to-r from-transparent from-[-5%] via-secondary via-30% to-transparent to-105%' />

                <button className={"flex justify-start items-center w-full h-[60px] p-[20px] pl-[30px] text-lg font-bold transition-colors  py-[1vh] hover:bg-background hover:text-primary bg-primary text-background"} onClick={() => setTheme((prevTheme) => prevTheme === 'dark' ? 'light' : 'dark')}>
                    <AiOutlineBulb className="w-[25px] h-[25px] mr-[3vw]" /> Cambiar tema
                </button>
            </div>
        </div>
    );
};