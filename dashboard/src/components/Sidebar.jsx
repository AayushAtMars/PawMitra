import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import {
    HomeIcon,
    ExclamationTriangleIcon,
    HeartIcon,
    UsersIcon,
    Cog6ToothIcon,
    ArrowLeftOnRectangleIcon,
    CheckBadgeIcon
} from '@heroicons/react/24/outline';

const Sidebar = () => {
    const navigate = useNavigate();
    const adminUser = JSON.parse(localStorage.getItem('adminUser') || '{}');

    const navigation = [
        { name: 'Overview', href: '/', icon: HomeIcon },
        { name: 'Verifications', href: '/verifications', icon: CheckBadgeIcon },
        { name: 'Incidents', href: '/incidents', icon: ExclamationTriangleIcon },
        { name: 'Pets', href: '/pets', icon: HeartIcon },
        { name: 'Volunteers', href: '/volunteers', icon: UsersIcon },
        { name: 'Settings', href: '/settings', icon: Cog6ToothIcon },
    ];

    const handleLogout = () => {
        localStorage.removeItem('adminToken');
        localStorage.removeItem('adminUser');
        navigate('/login');
    };

    return (
        <div className="flex flex-col w-64 h-screen bg-[#2D2D2D] text-white fixed left-0 top-0 shadow-xl z-50">
            {/* Brand Logo Area */}
            <div className="flex items-center gap-3 px-6 py-8 border-b border-gray-700/50">
                <div className="w-10 h-10 bg-[#F4A261] rounded-xl flex items-center justify-center shadow-lg shadow-orange-500/20">
                    <span className="text-xl">🐾</span>
                </div>
                <div>
                    <h1 className="text-lg font-black tracking-tight text-white">PawMitra</h1>
                    <p className="text-[10px] uppercase tracking-widest text-gray-400 font-bold">Admin Panel</p>
                </div>
            </div>

            {/* Navigation Links */}
            <nav className="flex-1 mt-6 px-4 space-y-1">
                {navigation.map((item) => (
                    <NavLink
                        key={item.name}
                        to={item.href}
                        className={({ isActive }) => `
              flex items-center gap-3 px-4 py-3.5 rounded-xl transition-all duration-200 group
              ${isActive
                                ? 'bg-[#F4A261] text-white shadow-lg shadow-orange-500/30'
                                : 'text-gray-400 hover:bg-gray-800 hover:text-white'}
            `}
                    >
                        <item.icon className="w-5 h-5" />
                        <span className="font-semibold text-sm">{item.name}</span>
                    </NavLink>
                ))}
            </nav>

            {/* User Profile & Logout */}
            <div className="p-4 mt-auto border-t border-gray-700/50">
                <div className="flex items-center gap-3 px-4 py-3 bg-gray-800/50 rounded-2xl mb-3">
                    <div className="w-8 h-8 rounded-full bg-gray-600 flex items-center justify-center text-xs font-bold ring-2 ring-gray-700">
                        {adminUser.name?.charAt(0) || 'A'}
                    </div>
                    <div className="flex-1 min-w-0">
                        <p className="text-xs font-bold truncate">{adminUser.name || 'Admin'}</p>
                        <p className="text-[10px] text-gray-500 truncate">{adminUser.email || 'admin@pawmitra.com'}</p>
                    </div>
                </div>

                <button
                    onClick={handleLogout}
                    className="flex items-center gap-3 w-full px-4 py-3 text-gray-400 hover:text-red-400 hover:bg-red-500/10 rounded-xl transition-all duration-200"
                >
                    <ArrowLeftOnRectangleIcon className="w-5 h-5" />
                    <span className="font-bold text-sm">Logout</span>
                </button>
            </div>
        </div>
    );
};

export default Sidebar;
