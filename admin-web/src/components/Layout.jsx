import React from 'react';
import Sidebar from './Sidebar';

const Layout = ({ children }) => {
    return (
        <div className="flex h-screen bg-gray-50 font-sans">
            <Sidebar />
            <div className="ml-64 flex-1 flex flex-col overflow-hidden">
                <header className="h-16 bg-white shadow-sm border-b border-gray-200 flex items-center px-8 z-10 justify-between">
                    <h2 className="text-xl font-bold text-gray-800">Admin Portal</h2>
                    <div className="flex items-center space-x-4">
                        <span className="text-sm font-medium text-gray-500">Welcome, Admin</span>
                        <div className="w-8 h-8 rounded-full bg-admin text-white flex items-center justify-center font-bold">A</div>
                    </div>
                </header>
                <main className="flex-1 overflow-x-hidden overflow-y-auto bg-slate-50 p-8">
                    {children}
                </main>
            </div>
        </div>
    );
};

export default Layout;
