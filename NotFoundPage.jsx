import React from 'react';
import { Helmet } from 'react-helmet';
import { Link } from 'react-router-dom';
import { Compass } from 'lucide-react';
import SiteHeader from '@/components/site/SiteHeader';
import SiteFooter from '@/components/site/SiteFooter';
import { Button } from '@/components/ui/button';

const NotFoundPage = () => (
    <div className="min-h-screen bg-background">
        <Helmet>
            <title>Halaman Tidak Ditemukan — SIGAP</title>
            <meta name="description" content="Halaman yang Anda cari tidak tersedia di portal SIGAP." />
        </Helmet>
        <SiteHeader />
        <main className="mx-auto max-w-xl px-4 py-28 text-center sm:px-6">
            <Compass className="mx-auto h-12 w-12 text-gold-deep" aria-hidden="true" />
            <h1 className="mt-5 text-3xl font-extrabold tracking-tight text-navy">404 — Halaman tidak ditemukan</h1>
            <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                Tautan yang Anda buka tidak tersedia atau telah dipindahkan. Gunakan pencarian untuk
                menemukan layanan yang Anda butuhkan.
            </p>
            <div className="mt-7 flex flex-wrap justify-center gap-3">
                <Button asChild className="rounded-xl bg-navy font-semibold hover:bg-navy-light">
                    <Link to="/">Kembali ke Beranda</Link>
                </Button>
                <Button asChild variant="outline" className="rounded-xl font-semibold">
                    <Link to="/pencarian">Buka Pencarian</Link>
                </Button>
            </div>
        </main>
        <SiteFooter />
    </div>
);

export default NotFoundPage;
