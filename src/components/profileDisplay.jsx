
import { AiOutlineMenu } from "react-icons/ai";

export default function ProfileDisplay() {
  return (
    <>
      <div className="m-2 flex flex-row items-center justify-between gap-2 rounded p-2 text-white dark:bg-[#231842] dark:text-textDarkColor">
        {/* nombre y correo container */}
        <img
          src="/img1.jpg"
          alt="Foto Perfil"
          className="rounded "
          height={50}
          width={50}
        />
        <div className="flex flex-col overflow-x-hidden">
          <h1 className="text-lg font-semibold">Juan Carlos Bodoque</h1>
          <h1 className="">correo@correo.com</h1>
        </div>
        {/* boton de opciones */}
        <button
          id="dropdownMenuIconButton"
          data-dropdown-toggle="dropdownDots"
          className="inline-flex  items-center rounded-lg bg-white p-2 text-center text-sm font-medium text-gray-900 hover:bg-gray-100 focus:outline-none focus:ring-4 focus:ring-gray-50 dark:bg-gray-800 dark:text-white dark:hover:bg-gray-700 dark:focus:ring-gray-600"
          type="button"
        >
          <AiOutlineMenu className="w-5 h-5" />
        </button>
        {/* TODO: integrar la barra lateral izq del jaime en el dropdown */}
        {/* <div
          id="dropdownDots"
          class="z-10 hidden w-44 divide-y divide-gray-100 rounded-lg bg-white shadow dark:divide-gray-600 dark:bg-gray-700"
        >
          <ul
            class="py-2 text-sm text-gray-700 dark:text-gray-200"
            aria-labelledby="dropdownMenuIconButton"
          >
            <li>
              <Link
                href="#"
                class="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white"
              >
                Dashboard
              </Link>
            </li>
            <li>
              <Link
                href="#"
                class="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white"
              >
                Settings
              </Link>
            </li>
            <li>
              <Link
                href="#"
                class="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white"
              >
                Earnings
              </Link>
            </li>
          </ul>
          <div class="py-2">
            <Link
              href="#"
              class="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 dark:text-gray-200 dark:hover:bg-gray-600 dark:hover:text-white"
            >
              Separated link
            </Link>
          </div>
        </div> */}
        
      </div>
    </>
  );
}
