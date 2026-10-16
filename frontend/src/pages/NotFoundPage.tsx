import { ArrowRight, SearchX } from "lucide-react"
import { Link } from "react-router-dom"

export const NotFoundPage = () => {

    return (
        <div className="flex-1 flex flex-col items-center justify-center py-16">
            <SearchX className="w-16 h-16 mb-4" />
            <h1 className="uppercase text-4xl font-bold mb-1">404</h1>
            <p className="text-slate-600">PAGE NOT FOUND</p>
            <Link to="/" className="bg-indigo-600 text-white px-5 py-2.5 rounded-xl hover:bg-indigo-700 mt-6 flex items-center gap-2">Обратно на главную <ArrowRight className="w-6 h-6" /></Link>
        </div>
    )
}