import {Outlet} from "react-router-dom";
import {Footer} from "../components/Footer";
import {Header} from "../components/Header";

export const PublicLayout = () => {
    return (
        <div className="min-h-screen flex flex-col">
            <Header />
            <Outlet />
            <Footer />
        </div>
    )
}