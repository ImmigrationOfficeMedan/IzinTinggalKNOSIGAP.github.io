import React, { useState } from 'react';
import { Helmet } from 'react-helmet';
import { Link, Navigate, useNavigate } from 'react-router-dom';
import { AlertTriangle, ArrowLeft, ShieldCheck, Stamp } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

const AdminLoginPage = () => {
    const navigate = useNavigate();
    const { user, isAuthed, login } = useAuth();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    if (isAuthed && user?.collectionName === 'users') {
        return <Navigate to="/admin/dashboard" replace />;
    }

    const submit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);
        try {
            await login(email.trim(), password);
            navigate('/admin/dashboard');
        } catch (err) {
            console.error(err);
            setError('Email atau kata sandi tidak sesuai. Area ini khusus petugas.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex min-h-screen flex-col bg-navy-deep">
            <Helmet>
                <title>Login Admin — SIGAP</title>
                <meta name="description" content="Area petugas SIGAP (prototype)." />
            </Helmet>
            <div className="mx-auto flex w-full max-w-7xl items-center justify-between px-4 py-5 sm:px-6">
                <Link to="/" className="flex items-center gap-3 text-white focus-ring rounded-lg">
                    <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/10 text-gold">
                        <Stamp className="h-5 w-5" strokeWidth={1.9} aria-hidden="true" />
                    </span>
                    <span className="leading-tight">
                        <span className="block text-lg font-extrabold tracking-tight">SIGAP</span>
                        <span className="block text-[10px] font-medium uppercase tracking-[0.14em] text-white/60">
                            Area Petugas
                        </span>
                    </span>
                </Link>
                <Button
                    asChild
                    variant="outline"
                    className="rounded-xl border-white/30 bg-transparent text-white hover:bg-white/10 hover:text-white"
                >
                    <Link to="/">
                        <ArrowLeft className="mr-2 h-4 w-4" aria-hidden="true" />
                        Beranda
                    </Link>
                </Button>
            </div>

            <main className="flex flex-1 items-center justify-center px-4 pb-16 sm:px-6">
                <div className="w-full max-w-md rounded-2xl bg-white p-8 shadow-2xl">
                    <div className="flex items-center gap-3">
                        <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-navy text-gold">
                            <ShieldCheck className="h-5 w-5" strokeWidth={1.9} aria-hidden="true" />
                        </span>
                        <div>
                            <h1 className="text-xl font-extrabold tracking-tight text-navy">Login Admin</h1>
                            <p className="text-xs text-muted-foreground">Super Admin & Admin/Petugas</p>
                        </div>
                    </div>

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
                            <Label htmlFor="admin-email">Email petugas</Label>
                            <Input
                                id="admin-email"
                                type="email"
                                autoComplete="email"
                                required
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                placeholder="petugas@sigap.example.id"
                                className="h-11 rounded-xl"
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="admin-password">Kata sandi</Label>
                            <Input
                                id="admin-password"
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
                            {loading ? 'Memproses...' : 'Masuk ke Dashboard Admin'}
                        </Button>
                    </form>

                    <p className="mt-6 rounded-xl bg-gold-soft px-4 py-3 text-xs leading-relaxed text-gold-deep">
                        Login prototype. Akun petugas dibuat oleh Super Admin melalui menu Admin/User.
                    </p>
                </div>
            </main>
        </div>
    );
};

export default AdminLoginPage;
