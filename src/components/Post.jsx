import { AiFillHeart, AiOutlineComment, AiOutlineSend, AiOutlineMenu, AiOutlinePicture } from "react-icons/ai";

import React, { useState, useEffect } from 'react';
import ImgsDisplay from "@/components/ImgsDisplay"
import { debounce } from 'lodash';

export default function Post({ post, addComment, removePost, likePost, usuario, inFriends, modal }) {
    const date = new Date();
    const checkTimeStamp = (time) => {
        const secsAgo = (date - new Date(time)) / 1000;

        if (secsAgo < 60) { //min
            const res = Math.round(secsAgo);
            return "Hace " + res + " segundo" + (res > 1 ? "s" : "");

        } else if (secsAgo < 3600) {//hora
            const res = Math.round(secsAgo / 60);
            return "Hace " + res + " minuto" + (res > 1 ? "s" : "");

        } else if (secsAgo < 86400) {//dia
            const res = Math.round(secsAgo / 3600);
            return "Hace " + res + " hora" + (res > 1 ? "s" : "");

        } else if (secsAgo < 2592000) {//mes
            const res = Math.round(secsAgo / 86400);
            return "Hace " + res + " dia" + (res > 1 ? "s" : "");

        } else {
            const res = Math.round(secsAgo / 2592000);
            return "Hace " + res + " mes" + (res > 1 ? "es" : "");

        }
    }

    const [newComment, setNewComment] = useState({
        texto: '',
        imagenes: [],
        esComentario: post.id
    });
    const handleCommentChange = (event) => {
        setNewComment({ ...newComment, texto: event.target.value });
    };
    const handleCommentSubmit = (event) => {
        event.preventDefault();
        if (newComment.texto != "") {

            addComment({ ...newComment, inFriends: inFriends });
            setNewComment({
                texto: '',
                imagenes: [],
                esComentario: post.id
            });
        }
    };

    const handleLike = (id, likes) => {
        likePost({ id: id, dislike: likes.includes(usuario.id), inFriends: inFriends })
    }

    const OptionsMenu = ({ userPostID, postID }) => {
        const [showOptionMenu, setShowOptionMenu] = useState(false);

        const handleOptionsButtonClick = () => {
            setShowOptionMenu(!showOptionMenu);
        }

        const clickOut = async() => {
            await new Promise((resolve) => setTimeout(resolve, 100));
            setShowOptionMenu(false);
        }

        return (
            <div className="relative justify-self-center p-[10px]"  >
                <button className="flex items-center self-center mr-[10px] ml-auto opacity-80 font-bold hover:text-accent"  onBlurCapture={()=> clickOut()} onClick={() => handleOptionsButtonClick()}>
                    <AiOutlineMenu style={{ marginLeft: '0.25rem', width: '1.5rem', height: '1.5rem' }} />
                </button>
                {showOptionMenu && (
                    <div className="cursor-pointer absolute top-90 z-3 left-[-170px] w-[200px] overflow-hidden rounded-[10px] bg-background shadow-md"  >
                        <ul>
                            {userPostID == usuario.id && <li className="p-[10px] hover:bg-primary hover:text-background"   onClick={() => modal(()=> removePost({ id: postID, inFriends: inFriends }), "¿Estas seguro de eliminar la publicacion?") }>Delete</li>}
                            <li className="p-[10px] hover:bg-primary hover:text-background" >Report</li>
                        </ul>
                    </div>
                )}
            </div>
        )
    }

    return (
        <>
            <div className="my-[20px] px-[2vw] lg:py-[40px] py-[20px] rounded-[10px] bg-foreground shadow-2xl">
                <div className="flex items-start w-full mb-[1rem]">
                    <img
                        className="lg:ml-0 ml-[2vw] w-[4rem] h-[4rem] rounded-lg mr-[1rem]"
                        src={post.usuario.foto_perfil}
                        alt={`${post.usuario.username}'s profile picture`}
                    />
                    <div className="flex-grow">
                        <h2 className="mb-0 mr-[10px] font-bold">{post.usuario.username.charAt(0).toUpperCase() + post.usuario.username.slice(1)}
                            {post.enGrupo && <h2 className="mb-0 mr-[8px] font-thin text-secondary">/{post.enGrupo.nombre}</h2>}
                        </h2>
                        <p className="opacity-70 mt-[4px]">{checkTimeStamp(post.fecha)}</p>
                    </div>

                    <OptionsMenu userPostID={post.usuario.id} postID={post.id} />

                </div>

                <div className="text-base font-normal leading-6 opacity-100 break-words">
                    <div className="lg:ml-0 ml-[2vw] mt-[20px]">
                        {post.texto}
                    </div>
                    {post.imagenes.length > 0 &&
                        <div className=" mt-[20px] mb-[-10px] flex items-start flex-wrap rounded-[10px] box-border">
                            {ImgsDisplay({ images: post.imagenes, containerHeight: 500, containerMaxHeight: 1000 })} </div>}
                </div>


                <div className="flex justify-start items-center mt-[20px] mb-[30px] lg:ml-[5px] ml-[2vw]" >
                    <DebouncedLikeButton id={post.id} likes={post.likes} onClick={handleLike} usID={usuario.id} isComment={false} />
                    <div className="flex items-center mr-[1.5rem] opacity-80 font-bold">
                        <AiOutlineComment className="w-[1.5rem] h-[1.5rem] mr-[0.5rem] fill-current opacity-80" />
                        <span>{post.comentarios.length}</span>
                    </div>
                </div>




                <div className="flex flex-col mt-[1rem]">
                    {post.comentarios.length > 0 && (
                        <div className="list-none m-0 p-0">

                            {post.comentarios.length > 3 && (
                                <button
                                    className="m-[10px]"
                                    onClick={() => alert('Ver mas comentarios...')}>
                                    Ver mas comentarios...
                                </button>
                            )}

                            {post.comentarios.slice(Math.max(0, post.comentarios.length - 3), post.comentarios.length).map((comment, index) => (

                                <div key={index} className="flex items-start w-full  bg-backgroundAlpha mb-[14px] rounded-[10px] pr-[10px] pb-[10px]" style={{ borderTop: "1px solid var(--bg-color)" }}>

                                    <img
                                        className="w-[3rem] h-[3rem] rounded-[10px] ml-[1rem] mt-[15px]"
                                        src={comment.usuario.foto_perfil}
                                        alt={`${comment.usuario.username}'s profile picture`}
                                    />
                                    <div className="flex flex-col flex-grow mx-[2vw] mt-[10px] rounded-lg">
                                        <h2 className="my-[5px] mr-[10px]  font-bold">{comment.usuario.username.charAt(0).toUpperCase() + comment.usuario.username.slice(1)}</h2>

                                        {comment.imagenes.length > 0 &&
                                            <div className="mt-[10px] mb-[5px] mx-auto flex items-start flex-wrap rounded-[10px] box-border w-full"> {ImgsDisplay({ images: comment.imagenes, containerHeight: 250, containerMaxHeight: 250 })} </div>}

                                        <div className="flex flex-row w-full mb-[10px]">
                                            <div className="mr-[20px]">
                                                <h2 className="text-base font-normal leading-6 opacity-100 break-words">{comment.texto}</h2>
                                                <p className="opacity-70 mt-[4px]">{checkTimeStamp(comment.fecha)}</p>
                                            </div>

                                            <div className="flex items-center self-center ml-auto mr-[-20px] mt-[-20px]" >
                                                <DebouncedLikeButton id={comment.id} likes={comment.likes} onClick={handleLike} usID={usuario.id} isComment={true} />

                                                <OptionsMenu userPostID={comment.usuario.id} postID={comment.id} />
                                            </div>
                                        </div>


                                    </div>
                                </div>

                            ))}
                        </div>
                    )}


                    <form className="border-t-[2px] border-dotted border-background pt-[20px] flex flex-row" onSubmit={handleCommentSubmit}>

                        <button className="bg-background flex items-center pl-[20px] rounded-l-[10px] hover:text-accent">
                            <AiOutlinePicture className="w-[1.3rem] h-[1.3rem] fill-current opacity-80" />
                        </button>
                        <textarea className="p-[10px] pl-[20px] bg-background text-base w-[93%] h-[45px] outline-none placeholder-secondary focus:outline-none  resize-none focus:h-[110px] focus:pt-[20px]
                    transition-height duration-300 ease-in-out "

                            type="text"
                            placeholder="Comenta algo..."
                            value={newComment.texto}
                            onChange={handleCommentChange}
                        />
                        <button className="bg-background flex items-center pr-[20px] rounded-r-[10px] hover:text-accent" type="submit"><AiOutlineSend /></button>
                    </form>


                </div>
            </div>



            
        </>
    );
}

const debouncedClick = debounce((id, likes, onClick) => {
    onClick(id, likes);
}, 500, {
    'leading': true,
    'trailing': false
});

const DebouncedLikeButton = ({ id, likes, onClick, usID, isComment }) => {

    const handleClick = () => {
        debouncedClick(id, likes, onClick);
    };

    if (isComment) {
        return (

            <button className="flex items-center self-center mr-[10px] ml-auto opacity-80 font-bold hover:text-accent" onClick={handleClick}>
                <AiFillHeart style={{ color: likes.some((lik) => lik.id == usID) ? 'var(--primary-color)' : 'inherit' }} />
                <span className="ml-[0.25rem]">{likes.length}</span>
            </button>
        );
    } else {
        return (
            <button className="flex items-center mr-[1.5rem] opacity-80 font-bold hover:text-accent" onClick={handleClick}>
                <AiFillHeart className={`${likes.some((lik) => lik.id == usID) ? 'text-accent' : 'inherit'} w-[1.5rem] h-[1.5rem] mr-[0.5rem] fill-current opacity-80`} />
                <span>{likes.length}</span>
            </button>

        )
    }

};