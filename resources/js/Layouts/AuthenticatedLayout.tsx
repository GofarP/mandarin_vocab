import ApplicationLogo from '@/Components/ApplicationLogo';
import Dropdown from '@/Components/Dropdown';
import NavLink from '@/Components/NavLink';
import { Link, usePage } from '@inertiajs/react';
import { PropsWithChildren, ReactNode } from 'react';
import { Home, PenTool, User } from 'lucide-react';

export default function Authenticated({
    header,
    children,
}: PropsWithChildren<{ header?: ReactNode }>) {
    const user = usePage().props.auth.user;
    
    // Helper to determine active state
    const isRouteActive = (routeName: string) => route().current(routeName);

    return (
        <div className="min-h-screen bg-slate-50 dark:bg-slate-900 pb-20 sm:pb-0">
            {/* Desktop Top Navbar */}
            <nav className="hidden sm:block border-b border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 sticky top-0 z-40">
                <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                    <div className="flex h-16 justify-between">
                        <div className="flex">
                            <div className="flex shrink-0 items-center">
                                <Link href="/">
                                    <ApplicationLogo className="block h-9 w-auto fill-current text-emerald-600 dark:text-emerald-500" />
                                </Link>
                            </div>

                            <div className="hidden space-x-8 sm:-my-px sm:ms-10 sm:flex">
                                <NavLink
                                    href={route('vocabs.index')}
                                    active={isRouteActive('vocabs.*') || isRouteActive('dashboard')}
                                >
                                    Kosakata
                                </NavLink>
                                <NavLink
                                    href={route('practice.index')}
                                    active={isRouteActive('practice.*')}
                                >
                                    Latihan
                                </NavLink>
                            </div>
                        </div>

                        <div className="hidden sm:ms-6 sm:flex sm:items-center">
                            <div className="relative ms-3">
                                <Dropdown>
                                    <Dropdown.Trigger>
                                        <span className="inline-flex rounded-md">
                                            <button
                                                type="button"
                                                className="inline-flex items-center rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 px-4 py-2 text-sm font-medium leading-4 text-slate-600 dark:text-slate-300 transition duration-150 ease-in-out hover:text-slate-800 dark:hover:text-white focus:outline-none"
                                            >
                                                {user.name}

                                                <svg
                                                    className="-me-0.5 ms-2 h-4 w-4"
                                                    xmlns="http://www.w3.org/2000/svg"
                                                    viewBox="0 0 20 20"
                                                    fill="currentColor"
                                                >
                                                    <path
                                                        fillRule="evenodd"
                                                        d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                                                        clipRule="evenodd"
                                                    />
                                                </svg>
                                            </button>
                                        </span>
                                    </Dropdown.Trigger>

                                    <Dropdown.Content>
                                        <Dropdown.Link href={route('profile.edit')}>
                                            Profile
                                        </Dropdown.Link>
                                        <Dropdown.Link
                                            href={route('logout')}
                                            method="post"
                                            as="button"
                                        >
                                            Log Out
                                        </Dropdown.Link>
                                    </Dropdown.Content>
                                </Dropdown>
                            </div>
                        </div>
                    </div>
                </div>
            </nav>

            {/* Mobile Top Header (Minimalist) */}
            <div className="sm:hidden flex items-center justify-between px-4 h-16 bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 sticky top-0 z-40">
                <Link href="/">
                    <ApplicationLogo className="block h-8 w-auto fill-current text-emerald-600 dark:text-emerald-500" />
                </Link>
                {/* We don't need a hamburger menu because we have a bottom nav */}
            </div>

            {/* Page Heading */}
            {header && (
                <header className="bg-white dark:bg-slate-900 shadow-sm border-b border-slate-200 dark:border-slate-800 relative z-30">
                    <div className="mx-auto max-w-7xl px-4 py-4 sm:px-6 lg:px-8">
                        {header}
                    </div>
                </header>
            )}

            <main className="max-w-7xl mx-auto">{children}</main>

            {/* Mobile Bottom Navigation Bar */}
            <div className="sm:hidden fixed bottom-0 left-0 right-0 h-16 bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800 flex justify-around items-center px-2 z-50 pb-safe shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.1)] dark:shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.5)]">
                <Link 
                    href={route('vocabs.index')} 
                    className={`flex flex-col items-center justify-center w-full h-full gap-1 transition-colors ${isRouteActive('vocabs.*') || isRouteActive('dashboard') ? 'text-emerald-600 dark:text-emerald-500' : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'}`}
                >
                    <Home className={`w-6 h-6 ${isRouteActive('vocabs.*') || isRouteActive('dashboard') ? 'fill-emerald-100 dark:fill-emerald-900/30' : ''}`} />
                    <span className="text-[10px] font-medium">Kosakata</span>
                </Link>

                <Link 
                    href={route('practice.index')} 
                    className={`flex flex-col items-center justify-center w-full h-full gap-1 transition-colors ${isRouteActive('practice.*') ? 'text-emerald-600 dark:text-emerald-500' : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'}`}
                >
                    <PenTool className={`w-6 h-6 ${isRouteActive('practice.*') ? 'fill-emerald-100 dark:fill-emerald-900/30' : ''}`} />
                    <span className="text-[10px] font-medium">Latihan</span>
                </Link>

                <Link 
                    href={route('profile.edit')} 
                    className={`flex flex-col items-center justify-center w-full h-full gap-1 transition-colors ${isRouteActive('profile.*') ? 'text-emerald-600 dark:text-emerald-500' : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'}`}
                >
                    <User className={`w-6 h-6 ${isRouteActive('profile.*') ? 'fill-emerald-100 dark:fill-emerald-900/30' : ''}`} />
                    <span className="text-[10px] font-medium">Profil</span>
                </Link>
            </div>
        </div>
    );
}
