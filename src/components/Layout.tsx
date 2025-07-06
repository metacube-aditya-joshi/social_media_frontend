import { Outlet } from "react-router-dom";
import Navbar from "./Navbar";
import { Sidebar } from "lucide-react";

const Layout =()=>{
    return (
            <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
                <Navbar/>
                <div className="flex">
                    <Sidebar/>
                    <main className="flex-1 ml-64 p-6">
                        <Outlet/>
                    </main>
                </div>

            </div>
    )
}

export default Layout;