import InputError from '@/Components/InputError';
import GuestLayout from '@/Layouts/GuestLayout';
import { Head, Link, useForm } from '@inertiajs/react';
import { FormEventHandler } from 'react';
import { UserPlus, ArrowRight } from 'lucide-react';

export default function Register() {
    const { data, setData, post, processing, errors, reset } = useForm({
        name: '',
        email: '',
        password: '',
        password_confirmation: '',
    });

    const submit: FormEventHandler = (e) => {
        e.preventDefault();

        post(route('register'), {
            onFinish: () => reset('password', 'password_confirmation'),
        });
    };

    return (
        <GuestLayout>
            <Head title="Daftar Akun Baru" />

            <div className="mb-6">
                <h2 className="text-xl font-bold text-white tracking-tight">
                    Daftar Akun Baru
                </h2>
                <p className="text-xs text-slate-400 mt-1">
                    Buat akun untuk mulai menyimpan dan mengelola catatan kosakata Mandarin Anda.
                </p>
            </div>

            <form onSubmit={submit} className="space-y-4">
                <div>
                    <label htmlFor="name" className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-1.5">
                        Nama Lengkap
                    </label>

                    <input
                        id="name"
                        type="text"
                        name="name"
                        value={data.name}
                        placeholder="Nama Anda"
                        className="w-full px-4 py-2.5 bg-slate-950 border border-slate-700/80 rounded-xl text-white placeholder:text-slate-600 focus:outline-none focus:ring-2 focus:ring-rose-500/50 focus:border-rose-500 text-sm transition-all"
                        autoComplete="name"
                        autoFocus
                        required
                        onChange={(e) => setData('name', e.target.value)}
                    />

                    <InputError message={errors.name} className="mt-1 text-xs text-rose-400" />
                </div>

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
                        required
                        onChange={(e) => setData('email', e.target.value)}
                    />

                    <InputError message={errors.email} className="mt-1 text-xs text-rose-400" />
                </div>

                <div>
                    <label htmlFor="password" className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-1.5">
                        Kata Sandi
                    </label>

                    <input
                        id="password"
                        type="password"
                        name="password"
                        value={data.password}
                        placeholder="Minimal 8 karakter"
                        className="w-full px-4 py-2.5 bg-slate-950 border border-slate-700/80 rounded-xl text-white placeholder:text-slate-600 focus:outline-none focus:ring-2 focus:ring-rose-500/50 focus:border-rose-500 text-sm transition-all"
                        autoComplete="new-password"
                        required
                        onChange={(e) => setData('password', e.target.value)}
                    />

                    <InputError message={errors.password} className="mt-1 text-xs text-rose-400" />
                </div>

                <div>
                    <label htmlFor="password_confirmation" className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-1.5">
                        Konfirmasi Kata Sandi
                    </label>

                    <input
                        id="password_confirmation"
                        type="password"
                        name="password_confirmation"
                        value={data.password_confirmation}
                        placeholder="Ulangi kata sandi"
                        className="w-full px-4 py-2.5 bg-slate-950 border border-slate-700/80 rounded-xl text-white placeholder:text-slate-600 focus:outline-none focus:ring-2 focus:ring-rose-500/50 focus:border-rose-500 text-sm transition-all"
                        autoComplete="new-password"
                        required
                        onChange={(e) => setData('password_confirmation', e.target.value)}
                    />

                    <InputError message={errors.password_confirmation} className="mt-1 text-xs text-rose-400" />
                </div>

                <div className="pt-3">
                    <button
                        type="submit"
                        disabled={processing}
                        className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-gradient-to-r from-rose-600 to-rose-500 hover:from-rose-500 hover:to-rose-600 text-white font-semibold text-sm shadow-lg shadow-rose-600/30 hover:shadow-rose-600/50 transition-all disabled:opacity-50"
                    >
                        <UserPlus className="w-4 h-4" />
                        {processing ? 'Memproses...' : 'Daftar Sekarang'}
                    </button>
                </div>

                <div className="text-center pt-4 border-t border-slate-800/80 text-xs text-slate-400">
                    Sudah memiliki akun?{' '}
                    <Link
                        href={route('login')}
                        className="text-rose-400 hover:text-rose-300 font-semibold inline-flex items-center gap-1 transition-colors"
                    >
                        Masuk di sini <ArrowRight className="w-3 h-3" />
                    </Link>
                </div>
            </form>
        </GuestLayout>
    );
}
