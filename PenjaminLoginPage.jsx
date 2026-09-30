import React, { useState } from 'react';
import { Helmet } from 'react-helmet';
import { Link, useNavigate } from 'react-router-dom';
import { AlertTriangle, ArrowLeft, LogIn, Stamp } from 'lucide-react';
import useGuarantorAuth from '@/hooks/useGuarantorAuth';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

const PenjaminLoginPage = () => {
    const navigate = useNavigate();
    const { login } = useGuarantorAuth();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const submit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);
        try {
            await login(email.trim(), password);
            navigate('/penjamin/dashboard');
        } catch (err) {
            console.error(err);
            setError('Email atau kata sandi tidak sesuai, atau akun belum aktif. Silakan coba lagi.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex min-h-screen flex-col bg-navy-deep">
            <Helmet>
                <title>Login Penjamin — SIGAP</title>
                <meta name="description" content="Masuk ke dashboard penjamin SIGAP (prototype)." />
            </Helmet>
            <div className="mx-auto flex w-full max-w-7xl items-center justify-between px-4 py-5 sm:px-6">
                <Link to="/" className="flex items-center gap-3 text-white focus-ring rounded-lg">
                    <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/10 text-gold">
                        <Stamp className="h-5 w-5" strokeWidth={1.9} aria-hidden="true" />
                    </span>
                    <span className="leading-tight">
                        <span className="block text-lg font-extrabold tracking-tight">SIGAP</span>
                        <span className="block text-[10px] font-medium uppercase tracking-[0.14em] text-white/60">
                            Portal Penjamin
                        </span>
                    </span>
                </Link>
                <Button
                    asChild
                    variant="outline"
                    className="rounded-xl border-white/30 bg-transparent text-white hover:bg-white/10 hover:text-white"
                >
                    <Link to="/penjamin">
                        <ArrowLeft className="mr-2 h-4 w-4" aria-hidden="true" />
                        Kembali
                    </Link>
                </Button>
            </div>

            <main className="flex flex-1 items-center justify-center px-4 pb-16 sm:px-6">
                <div className="w-full max-w-md rounded-2xl bg-white p-8 shadow-2xl">
                    <h1 className="text-xl font-extrabold tracking-tight text-navy">Login Penjamin</h1>
                    <p className="mt-1.5 text-sm text-muted-foreground">
                        Masuk untuk mengelola penjaminan Anda. Prototype — belum terhubung ke sistem resmi.
                    </p>

                    {error && (
                        <p
                            role="alert"
                            className="mt-5 flex items-start gap-2.5 rounded-xl border border-destructive/30 bg-destructive/5 px-4 py-3 text-sm text-destructive"
                        >
                            <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0" aria-hidden="true" />
                            {error}
                        </p>
                    )}

                    <form onSubmit={submit} className="mt-6 space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="email">Email penjamin</Label>
                            <Input
                                id="email"
                                type="email"
                                autoComplete="email"
                                required
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                placeholder="nama@perusahaan.co.id"
                                className="h-11 rounded-xl"
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="password">Kata sandi</Label>
                            <Input
                                id="password"
                                type="password"
                                autoComplete="current-password"
                                required
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                placeholder="••••••••••"
                                className="h-11 rounded-xl"
                            />
                        </div>
                        <Button
                            type="submit"
                            disabled={loading}
                            className="h-11 w-full rounded-xl bg-navy font-semibold hover:bg-navy-light"
                        >
                            <LogIn className="mr-2 h-4 w-4" aria-hidden="true" />
                            {loading ? 'Memproses...' : 'Masuk ke Dashboard'}
                        </Button>
                    </form>

                    <p className="mt-6 rounded-xl bg-gold-soft px-4 py-3 text-xs leading-relaxed text-gold-deep">
                        Belum memiliki akun? Registrasi akun penjamin dilakukan melalui petugas sesuai tata
                        cara pada halaman Penjamin.
                    </p>
                </div>
            </main>
        </div>
    );
};

export default PenjaminLoginPage;
