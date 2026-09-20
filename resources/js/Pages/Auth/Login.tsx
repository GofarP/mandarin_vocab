import InputError from '@/Components/InputError';
import GuestLayout from '@/Layouts/GuestLayout';
import { Head, Link, useForm } from '@inertiajs/react';
import { FormEventHandler } from 'react';
import { LogIn, ArrowRight } from 'lucide-react';

export default function Login({
    status,
    canResetPassword,
}: {
    status?: string;
    canResetPassword: boolean;
}) {
    const { data, setData, post, processing, errors, reset } = useForm({
        email: '',
        password: '',
        remember: false as boolean,
    });

    const submit: FormEventHandler = (e) => {
        e.preventDefault();

        post(route('login'), {
            onFinish: () => reset('password'),
        });
    };

    return (
        <GuestLayout>
            <Head title="Masuk ke Akun" />

            <div className="mb-6">
                <h2 className="text-xl font-bold text-white tracking-tight">
                    Masuk ke Akun
                </h2>
                <p className="text-xs text-slate-400 mt-1">
                    Silakan masuk untuk menambah, mengedit, dan mengelola kosakata Mandarin Anda.
                </p>
            </div>

            {status && (
                <div className="mb-4 text-xs font-medium text-emerald-400 p-3 rounded-xl bg-emerald-950/60 border border-emerald-500/20">
                    {status}
                </div>
            )}

            <form onSubmit={submit} className="space-y-4">
                <div>
                    <label htmlFor="email" className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-1.5">
                        Alamat Email
                    </label>

                    <input
                        id="email"
                        type="email"
                        name="email"
                        value={data.email}
                        placeholder="contoh@email.com"
                        className="w-full px-4 py-2.5 bg-slate-950 border border-slate-700/80 rounded-xl text-white placeholder:text-slate-600 focus:outline-none focus:ring-2 focus:ring-rose-500/50 focus:border-rose-500 text-sm transition-all"
                        autoComplete="username"
                        autoFocus
                        required
                        onChange={(e) => setData('email', e.target.value)}
                    />

                    <InputError message={errors.email} className="mt-1 text-xs text-rose-400" />
                </div>

                <div>
                    <div className="flex items-center justify-between mb-1.5">
                        <label htmlFor="password" className="block text-xs font-semibold uppercase tracking-wider text-slate-300">
                            Kata Sandi
                        </label>
                        {canResetPassword && (
                            <Link
                                href={route('password.request')}
                                className="text-xs text-rose-400 hover:text-rose-300 transition-colors"
                            >
                                Lupa kata sandi?
                            </Link>
                        )}
                    </div>

                    <input
                        id="password"
                        type="password"
                        name="password"
                        value={data.password}
                        placeholder="••••••••"
                        className="w-full px-4 py-2.5 bg-slate-950 border border-slate-700/80 rounded-xl text-white placeholder:text-slate-600 focus:outline-none focus:ring-2 focus:ring-rose-500/50 focus:border-rose-500 text-sm transition-all"
                        autoComplete="current-password"
                        required
                        onChange={(e) => setData('password', e.target.value)}
                    />

                    <InputError message={errors.password} className="mt-1 text-xs text-rose-400" />
                </div>

                <div className="flex items-center justify-between pt-1">
                    <label className="flex items-center gap-2 cursor-pointer select-none text-xs text-slate-400 hover:text-slate-300">
                        <input
                            type="checkbox"
                            name="remember"
                            checked={data.remember}
                            onChange={(e) => setData('remember', e.target.checked)}
                            className="rounded bg-slate-950 border-slate-700 text-rose-600 focus:ring-rose-500 focus:ring-offset-slate-900 w-4 h-4"
                        />
                        <span>Ingat saya di perangkat ini</span>
                    </label>
                </div>

                <div className="pt-3">
                    <button
                        type="submit"
                        disabled={processing}
                        className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-gradient-to-r from-rose-600 to-rose-500 hover:from-rose-500 hover:to-rose-600 text-white font-semibold text-sm shadow-lg shadow-rose-600/30 hover:shadow-rose-600/50 transition-all disabled:opacity-50"
                    >
                        <LogIn className="w-4 h-4" />
                        {processing ? 'Memproses...' : 'Masuk Sekarang'}
                    </button>
                </div>
            </form>
        </GuestLayout>
    );
}
