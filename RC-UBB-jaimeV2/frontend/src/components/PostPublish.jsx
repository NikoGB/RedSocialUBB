import { AiOutlineSend, AiOutlinePicture } from "react-icons/ai";
import React, { useState, useContext } from 'react';


export default function PostPublish({ user, addPost }) {

    const [newPost, setNewPost] = useState({
        texto: '',
        imagenes: []
    });

    const handlePostSubmit = (event) => {

        event.preventDefault();
        if (newPost.texto != "") {
            addPost(newPost).then((post) => { //CHARGE UNTIL POSTED

            })

            setNewPost({
                texto: "",
                imagenes: []
            });

        }

    };

    const handlePostChange = (event) => {
        setNewPost({ ...newPost, texto: event.target.value });
    };

    return (
        <div className="flex w-full  items-center border-[2px] border-dotted border-background  px-[10px] mt-[20px] mb-[20px] bg-foreground rounded-[10px] shadow-2xl" >

            <img className="w-[50px] h-[50px] rounded-[6px] mr-4 ml-4" src={user.foto_perfil} alt={`${user.username}'s profile picture`} />

            <form className="w-[86%] mx-auto py-[20px] flex flex-row" onSubmit={handlePostSubmit}>

                <button className="flex items-center pl-[20px] bg-background rounded-tl-lg rounded-bl-lg ml-[2px] hover:text-accent">
                    <AiOutlinePicture className="h-[1.3rem] w-[1.3rem] fill-current opacity-80" />
                </button>

                <textarea className="p-[10px] pl-[20px] bg-background text-base w-[93%] h-[45px] outline-none focus:outline-none placeholder-secondary resize-none focus:h-[110px] focus:pt-[20px] transition-height duration-300 ease-in-out "
                    type="text"
                    placeholder="¿Que quieres decir?..."
                    value={newPost.texto}
                    onChange={handlePostChange}
                />
                <button className="flex items-center pr-[20px] bg-background rounded-tr-lg rounded-br-lg mr-[2px] hover:text-accent" type="submit">
                    <AiOutlineSend className="h-[1.3rem] w-[1.3rem] fill-current opacity-80" /></button>
            </form>
        </div>
    );
};

