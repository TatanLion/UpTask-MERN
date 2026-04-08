import { useNavigate } from "react-router-dom";

export default function NotFoundView() {

    const navigate = useNavigate();

    return (
        <div className="max-w-screen-md mx-auto text-slate-100 text-center">
            <h1 className="text-6xl font-black mb-5">404</h1>
            <h3 className="text-4xl font-bold text-center">Página no encontrada</h3>
            <p className="text-center mt-4">Lo sentimos, la página que estás buscando no existe.</p>
            <button
                className="bg-purple-400 hover:bg-purple-500 px-10 py-3 text-white text-xl font-bold mt-6 cursor-pointer transition-colors"
                onClick={() => navigate("/")}
            >
                Volver a la página principal
            </button>
        </div>
    )
}
