import React, { useContext, useState, useEffect } from 'react';
import { UserContext } from '../utils/userContext';

import { AiOutlineLoading3Quarters } from "react-icons/ai";

import Home from '../components/Home';
import PostPublish from "../components/PostPublish";
import Post from "../components/Post";


const Feed = ({showModal}) => {
    const [onRecomendations, setOnRecomendations] = useState(false)
    const [isTransitioning, setIsTransitioning] = useState(false)
    const { user, addComment, removePost, likePost } = useContext(UserContext)



    useEffect(() => {
        let transitionTimeout = null;

        if (isTransitioning) {
            transitionTimeout = setTimeout(() => {

                setOnRecomendations((prevOn) => !prevOn);
                setIsTransitioning(false);

            }, 200);
        }

        return () => {
            if (transitionTimeout) {
                clearTimeout(transitionTimeout);
                setIsTransitioning(false);
            }
        };
    }, [isTransitioning]);


    return (<div className="lg:w-[55vw] lg:max-w-[90vw]  lg:px-10 w-[100vw] max-w-[100vw] mt-[80px] text-current z-10">
        <div className='flex  w-[calc(100%-10px)] justify-between  sm:text-[18px] text-[5vw]  mt-[20px] ml-[10px] items-center font-bold '>
            <h1 className='text-[20px] font-bold text-secondary sm:text-[18px] text-[5vw]'>Publicaciones</h1>
            <button className={`rounded-t-[10px] border-[2px] sm:ml-[5vw] ml-0 border-b-0 sm:w-[35%] w-[30%] h-[40px] 
                    ${!onRecomendations ? "text-background bg-secondary border-secondary hover:text-primary hover:bg-background hover:border-primary" : "bg-background border-secondary text-secondary"}
                    `} onClick={() => { !onRecomendations && setIsTransitioning(true) }} >
                Novedades
            </button>
            <button className={`rounded-t-[10px]  border-[2px] border-b-0 sm:w-[35%] w-[30%] h-[40px] 
                    ${onRecomendations ? "text-background bg-secondary border-secondary hover:text-primary hover:bg-background hover:border-primary" : "bg-background border-secondary text-secondary"}`}
                onClick={() => { onRecomendations && setIsTransitioning(true) }} >
                Conocidos
            </button>
        </div>
        <div className='w-[100%] h-[4px] mt-[-4px] mb-[30px] bg-gradient-to-r from-transparent from-[-5%] via-secondary via-30% to-transparent to-105%' />


        <div className={`${isTransitioning ? "animate-horizontalOut" : "animate-horizontalIn"}`}>
            {(onRecomendations && <RecomendationsFeed likePost={likePost} user={user} addComment={addComment} removePost={removePost} modal={showModal}/>)
                || <FriendsFeed likePost={likePost} user={user} addComment={addComment} removePost={removePost} modal={showModal}/>}

        </div>
    </div>)
}

const FriendsFeed = ({ likePost, user, addComment, removePost, modal }) => {
    const { getFriendsPosts, friendsPosts, addPost } = useContext(UserContext)
    const [postsChecked, setPostsChecked] = useState(false);

    useEffect(() => {
        if (!friendsPosts || friendsPosts.length == 0) {
            getFriendsPosts(user.id).then(()=>{
                setPostsChecked(true);
            });
        }else{
            setPostsChecked(true);
        }
    }, []);



    return (
        <>
           
             <PostPublish user={user} addPost={addPost} />
            {(postsChecked && friendsPosts.map((post) => (
                (!post.waiting && <Post post={post} key={post.id} likePost={likePost} addComment={addComment} removePost={removePost} usuario={user} inFriends={true} modal={modal}/>)
                || 
                <WaitingPost key={-1}/>
            )))
            ||
            <div className="animate-bounce items-center text-center text-[20px] font-bold">
                <AiOutlineLoading3Quarters className="animate-spin font-bold h-[80px] w-[80px] mt-[20vh] mx-auto text-primary" />
                Cargando...
            </div>
            } 
        </>

    )
}

const RecomendationsFeed = ({ user, addComment, likePost, removePost, modal }) => {
    const { getRecomendations, recomendations } = useContext(UserContext)
    const [postsChecked, setPostsChecked] = useState(false);

    useEffect(() => {
        if (!recomendations || recomendations.length == 0) {
            getRecomendations(user.id).then(()=>{
                setPostsChecked(true);
            });
        }else{
            setPostsChecked(true);
        }
    }, []);


    return (
        <>

            {(postsChecked && recomendations.map((post) => (
                <Post post={post} key={post.id} likePost={likePost} addComment={addComment} removePost={removePost} usuario={user} inFriends={false} modal={modal}/>
            ))) ||
                <div className="animate-bounce items-center text-center text-[20px] font-bold">
                    <AiOutlineLoading3Quarters className="animate-spin font-bold h-[80px] w-[80px] mt-[30vh] mx-auto text-primary" />
                    Cargando...
                </div>}
        </>

    )
}

const WaitingPost = ()=>{
    return(
        <div className="animate-pulse  items-center shadow-2xl text-center mb-[20px] text-[20px] p-[10px] h-[150px] max-h-[150px] font-bold bg-foreground w-full rounded-[10px]">
                
        <div className='opacity-60 flex px-[20px]'>
            <div className="rounded-[10px] bg-secondary h-[75px] w-[75px] mr-[10px]"></div>

            <div className="flex-1 space-y-6 py-1">
                <div className="h-3 bg-secondary rounded "></div>

                <div className="space-y-3">
                    <div className="grid grid-cols-3 gap-4">
                        <div className="h-3 bg-secondary rounded col-span-2"></div>
                        <div className="h-3 bg-secondary rounded col-span-1"></div>
                    </div>
                    <div className="h-3 bg-secondary rounded"></div>
                </div>
            </div>
        </div>

        <div className="relative w-[100%] mt-[-4%] text-primary font-bold text-center">
            Creando publicacion...
        </div>
        
        <AiOutlineLoading3Quarters className="relative top-[-80%]  animate-spin font-bold  h-[60px] w-[60px] mx-auto text-primary mb-[10px]" />

    </div>
    )
}

Feed.getLayout = function getLayout(page, screenWidth) {
    return <Home screenWidth={screenWidth}>{page}</Home>;
};



export default Feed;
