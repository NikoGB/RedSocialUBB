import Image from "next/image";

export default function Profile() {

  

  return (
    <>
      <div className="m-2  flex flex-row items-center gap-2">
        <Image
          src="/bodoque.jpeg"
          alt="Foto Perfil"
          className="rounded-full "
          height={50}
          width={50}
        />
        <h1 className="text-xl font-semibold">Juan Carlos Bodoque</h1>
      </div>
    </>
  );
}
