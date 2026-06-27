import { Bell, Search } from "lucide-react";

export default function DashboardHeader() {
    return (
        <div className="flex items-center justify-between border-b border-slate-700 px-8 py-5">

            {/* Left */}
            <h1 className="text-4xl font-bold text-white">
                Dashboard
            </h1>

            {/* Right */}
            <div className="flex items-center gap-4">

                {/* Search */}
                <div className="relative">

                    <Search
                        size={20}
                        className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
                    />

                    <input
                        type="text"
                        placeholder="Search applicants, jobs..."
                        className="w-80 bg-slate-800 border border-slate-700 rounded-xl pl-12 pr-4 py-3 text-white placeholder:text-slate-400 outline-none focus:border-green-500"
                    />

                </div>

                {/* Notification */}
                <button className="w-12 h-12 rounded-xl bg-slate-800 border border-slate-700 flex items-center justify-center hover:bg-slate-700 transition">

                    <Bell
                        size={22}
                        className="text-slate-300"
                    />

                </button>

            </div>

        </div>
    );
}