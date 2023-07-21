import React from "react";
import { useState, useEffect } from "react";
import {AiOutlineCalendar} from "react-icons/ai";

export default function EventList() {
    const events = [{ nombre: "Party", fecha: "10/1", descripcion: "Descripcion del evento que sucedera en la fecha x", id:0 },
    { nombre: "Party", fecha: "10/3", descripcion: "Descripcion del evento que sucedera  en la fecha x", id:1 },
    { nombre: "Party", fecha: "4/12", descripcion: "Descripcion del evento que sucedera  en la fecha x", id:2 },
    { nombre: "Party", fecha: "31/12", descripcion: "Descripcion del evento que sucedera  en la fecha x y blablabasl como si fuera esta la ultina", id:3 }]

  // map de eventos
  const eventList = events.map((event) => {

    return (
      <li key={event.id} className="flex flex-row border-b snap-start border-background border-dotted p-2 hover:bg-primary hover:text-background ">
        {/* imagen del calendario con la fecha*/}
        <div className="flex relative mt-[5px]">
            <AiOutlineCalendar className="text-8xl text-secondary"/>
            <h1 className="absolute text-secondary text-[18px] text-center w-[55px] left-[20px] bottom-6 font-bold">{event.fecha}</h1>
        </div>
        
        <div className="m-2 flex-wrap overflow-hidden text-ellipsis flex-col h-[85px] max-w-[60%] grow">
          <h1 className="text-xl font-bold">
            {event.nombre}
          </h1>
          <h1 className="text-sm line-clamp-3 text-justify w-[100%] max-w-[100%] ">
            {event.descripcion}
          </h1>
        </div>
      </li>
    );
  });

  return (
    <>
      {/* contenedor */}
      <div className="mb-2 w-[100%]">
        {/* titulo */}
        <h2 className="flex font-bold justify-self-center mr-auto ml-[10px] mb-[10px] text-secondary opacity-80 "> EVENTOS </h2>
        {/* lista de eventos */}
        <ul className="list-container flex flex-col snap-y max-h-64 overflow-hidden overflow-y-scroll rounded-md bg-foreground ">
          {eventList}
        </ul>
      </div>
    </>
  );
}
