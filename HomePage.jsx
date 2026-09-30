import React, { useEffect, useState } from 'react';
import { Helmet } from 'react-helmet';
import { Link, useNavigate } from 'react-router-dom';
import {
    ArrowRight,
    BadgeCheck,
    BookOpen,
    FileText,
    Globe2,
    Handshake,
    Mail,
    MapPin,
    Phone,
    Plane,
    ScanLine,
    Search,
} from 'lucide-react';
import pb from '@/lib/pocketbaseClient';
import Reveal from '@/components/Reveal';
import SiteHeader from '@/components/site/SiteHeader';
import SiteFooter from '@/components/site/SiteFooter';
import DataNotice from '@/components/site/DataNotice';
import FaqAccordion from '@/components/site/FaqAccordion';
import ServiceIcon from '@/components/site/ServiceIcon';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

const HERO_IMG = 'https://images.hostinger.com/130ae023-739e-4ebe-8d51-9a4bcb947b57.png';
const PASSPORT_IMG = 'https://images.hostinger.com/93e83651-c402-46fb-be75-450df07f76c0.png';
const OFFICE_IMG = 'https://images.hostinger.com/d5d8a4df-f6ad-4b9b-9d14-8fa097ea6162.png';

const JOURNEY = [
    { icon: Globe2, label: 'Negara Asal' },
    { icon: Plane, label: 'Perjalanan Internasional' },
    { icon: ScanLine, label: 'Pemeriksaan Imigrasi' },
    { icon: BookOpen, label: 'Paspor & Visa' },
    { icon: FileText, label: 'Permohonan Izin Tinggal' },
    { icon: Handshake, label: 'Penjamin' },
    { icon: BadgeCheck, label: 'Izin Tinggal' },
];

const SectionHeading = ({ eyebrow, title, description }) => (
    <div className="mb-10">
        <div className="flex items-center gap-4">
            <span className="eyebrow">{eyebrow}</span>
            <span className="rule-line" aria-hidden="true" />
        </div>
        <h2 className="mt-3 text-2xl font-extrabold tracking-tight text-navy sm:text-3xl">{title}</h2>
        {description && (
            <p className="mt-2 max-w-2xl text-sm leading-relaxed text-muted-foreground">{description}</p>
        )}
    </div>
);

const HomePage = () => {
    const navigate = useNavigate();
    const [query, setQuery] = useState('');
    const [services, setServices] = useState([]);
    const [faqs, setFaqs] = useState([]);
    const [fees, setFees] = useState([]);
    const [times, setTimes] = useState([]);
    const [error, setError] = useState('');

    useEffect(() => {
        let cancelled = false;
        const load = async () => {
            try {
                const [svc, faqAll, feeAll, timeAll] = await Promise.all([
                    pb.collection('services').getFullList({ sort: 'order' }),
                    pb.collection('faq').getFullList({ sort: 'order' }),
                    pb.collection('fees').getFullList({ expand: 'service' }),
                    pb.collection('processing_times').getFullList({ expand: 'service' }),
                ]);
                if (cancelled) return;
                setServices(svc.filter((s) => s.active));
                setFaqs(faqAll.filter((f) => !f.service));
                setFees(feeAll);
                setTimes(timeAll);
            } catch (err) {
                if (!cancelled) setError('Konten belum dapat dimuat. Silakan muat ulang halaman.');
                console.error(err);
            }
        };
        load();
        return () => {
            cancelled = true;
        };
    }, []);

    const submitSearch = (e) => {
        e.preventDefault();
        navigate(`/pencarian?q=${encodeURIComponent(query.trim())}`);
    };

    return (
        <div className="min-h-screen bg-background">
            <Helmet>
                <title>SIGAP — Layanan Izin Tinggal Keimigrasian bagi Orang Asing</title>
                <meta
                    name="description"
                    content="Portal informasi dan pelayanan izin tinggal keimigrasian bagi Orang Asing: tata cara, persyaratan, biaya, dan estimasi waktu penyelesaian. (Prototype — data contoh)"
                />
            </Helmet>
            <SiteHeader />

            {/* HERO */}
            <section className="relative overflow-hidden bg-navy-deep text-white">
                <img
                    src={HERO_IMG}
                    alt="Suasana terminal bandara internasional dan area pemeriksaan imigrasi (ilustrasi)"
                    className="absolute inset-0 h-full w-full object-cover opacity-40"
                />
                <div
                    className="absolute inset-0 bg-gradient-to-r from-navy-deep via-navy-deep/85 to-navy/40"
                    aria-hidden="true"
                />
                <div className="relative mx-auto flex min-h-[82dvh] max-w-7xl flex-col justify-center px-4 py-20 sm:px-6">
                    <Reveal>
                        <p className="font-mono text-[11px] font-medium uppercase tracking-[0.24em] text-gold">
                            Digital Immigration Service Center
                        </p>
                        <h1 className="mt-4 max-w-3xl text-3xl font-extrabold leading-tight tracking-tight sm:text-5xl">
                            Layanan Izin Tinggal Keimigrasian bagi Orang Asing
                        </h1>
                        <p className="mt-5 max-w-2xl text-base leading-relaxed text-white/80 sm:text-lg">
                            Pelajari tata cara, persyaratan, biaya, dan waktu penyelesaian layanan izin
                            tinggal — dalam satu portal yang jelas dan mudah diikuti.
                        </p>
                    </Reveal>
                    <Reveal delay={0.12}>
                        <form
                            onSubmit={submitSearch}
                            className="mt-8 flex max-w-2xl flex-col gap-3 sm:flex-row"
                            role="search"
                        >
                            <label htmlFor="hero-search" className="sr-only">
                                Cari layanan izin tinggal
                            </label>
                            <div className="relative flex-1">
                                <Search
                                    className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground"
                                    aria-hidden="true"
                                />
                                <Input
                                    id="hero-search"
                                    value={query}
                                    onChange={(e) => setQuery(e.target.value)}
                                    placeholder="Contoh: ITAS, ITAP, ITK, Alih Status..."
                                    className="h-12 rounded-xl border-white/20 bg-white/95 pl-11 text-foreground placeholder:text-muted-foreground"
                                />
                            </div>
                            <Button
                                type="submit"
                                className="h-12 rounded-xl bg-gold px-7 font-bold text-navy-deep hover:bg-gold/90"
                            >
                                Cari Layanan
                            </Button>
                        </form>
                        <p className="mt-6 font-mono text-xs uppercase tracking-[0.2em] text-white/70">
                            Informasi Lengkap. Dokumen Siap. Perjalanan Lebih Mudah.
                        </p>
                    </Reveal>
                </div>
            </section>

            <div className="mx-auto max-w-7xl px-4 sm:px-6">
                <DataNotice className="relative z-10 -mt-7 shadow-lg" />
            </div>

            {/* QUICK ACCESS */}
            <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6" aria-labelledby="quick-access">
                <Reveal>
                    <SectionHeading
                        eyebrow="Akses Cepat"
                        title="Saya ingin mengurus..."
                        description="Pilih layanan untuk melihat tata cara, persyaratan, dokumen, biaya, dan estimasi waktu."
                    />
                </Reveal>
                {error && (
                    <p className="rounded-xl border border-destructive/30 bg-destructive/5 px-4 py-3 text-sm text-destructive">
                        {error}
                    </p>
                )}
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
                    {services.map((s, i) => (
                        <Reveal key={s.id} delay={Math.min(i * 0.05, 0.3)}>
                            <Link
                                to={`/layanan/${s.slug}`}
                                className="group card-soft flex h-full flex-col p-5 transition-all duration-200 hover:-translate-y-1 hover:border-navy/30 hover:shadow-xl focus-ring"
                            >
                                <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-navy-soft text-navy transition-colors group-hover:bg-navy group-hover:text-gold">
                                    <ServiceIcon name={s.icon} className="h-5 w-5" />
                                </span>
                                <span className="mt-4 font-mono text-[10px] font-semibold uppercase tracking-[0.18em] text-gold-deep">
                                    {s.code}
                                </span>
                                <span className="mt-1 text-[15px] font-bold leading-snug text-navy">
                                    {s.title}
                                </span>
                                <span className="mt-2 text-[13px] leading-relaxed text-muted-foreground">
                                    {s.tagline}
                                </span>
                                <span className="mt-auto inline-flex items-center gap-1.5 pt-4 text-[13px] font-semibold text-navy-light">
                                    Lihat detail
                                    <ArrowRight
                                        className="h-3.5 w-3.5 transition-transform group-hover:translate-x-1"
                                        aria-hidden="true"
                                    />
                                </span>
                            </Link>
                        </Reveal>
                    ))}
                </div>
            </section>

            {/* IMMIGRATION JOURNEY */}
            <section id="tata-cara" className="border-y border-border bg-white py-16">
                <div className="mx-auto max-w-7xl px-4 sm:px-6">
                    <Reveal>
                        <SectionHeading
                            eyebrow="Immigration Journey"
                            title="Alur perjalanan keimigrasian"
                            description="Gambaran umum tahapan dari negara asal hingga memperoleh izin tinggal."
                        />
                    </Reveal>
                    <ol className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-7">
                        {JOURNEY.map((step, i) => (
                            <Reveal key={step.label} delay={i * 0.06}>
                                <li className="relative flex h-full flex-col items-center rounded-2xl border border-border bg-background p-4 text-center">
                                    <span className="absolute left-3 top-3 font-mono text-[10px] font-semibold text-gold-deep">
                                        {String(i + 1).padStart(2, '0')}
                                    </span>
                                    <span className="mt-3 flex h-11 w-11 items-center justify-center rounded-full bg-navy text-gold">
                                        <step.icon className="h-5 w-5" strokeWidth={1.8} aria-hidden="true" />
                                    </span>
                                    <span className="mt-3 text-[12.5px] font-semibold leading-snug text-navy">
                                        {step.label}
                                    </span>
                                </li>
                            </Reveal>
                        ))}
                    </ol>
                </div>
            </section>

            {/* DAFTAR LAYANAN */}
            <section id="layanan" className="mx-auto max-w-7xl px-4 py-16 sm:px-6">
                <Reveal>
                    <SectionHeading
                        eyebrow="Daftar Layanan"
                        title="Layanan izin tinggal"
                        description="Delapan layanan utama yang dikelola melalui portal ini."
                    />
                </Reveal>
                <div className="divide-y divide-border overflow-hidden rounded-2xl border border-border bg-white">
                    {services.map((s) => (
                        <Link
                            key={s.id}
                            to={`/layanan/${s.slug}`}
                            className="group flex items-center gap-4 px-5 py-4 transition-colors hover:bg-secondary/60 focus-ring sm:px-6"
                        >
                            <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-navy-soft text-navy">
                                <ServiceIcon name={s.icon} className="h-5 w-5" />
                            </span>
                            <span className="min-w-0 flex-1">
                                <span className="block truncate text-[15px] font-bold text-navy">{s.title}</span>
                                <span className="block truncate text-[13px] text-muted-foreground">{s.tagline}</span>
                            </span>
                            <span className="hidden rounded-full border border-border px-3 py-1 font-mono text-[10px] uppercase tracking-wider text-muted-foreground sm:block">
                                {s.service_type}
                            </span>
                            <ArrowRight
                                className="h-4 w-4 shrink-0 text-muted-foreground transition-transform group-hover:translate-x-1 group-hover:text-navy"
                                aria-hidden="true"
                            />
                        </Link>
                    ))}
                </div>
            </section>

            {/* PERSIAPAN DOKUMEN */}
            <section id="persyaratan" className="border-y border-border bg-navy-soft/50 py-16">
                <div className="mx-auto grid max-w-7xl items-center gap-10 px-4 sm:px-6 lg:grid-cols-2">
                    <Reveal>
                        <div className="overflow-hidden rounded-2xl shadow-xl">
                            <img
                                src={PASSPORT_IMG}
                                alt="Ilustrasi paspor fiktif, cap visa, dan kartu izin tinggal di atas meja"
                                className="h-full w-full object-cover"
                                loading="lazy"
                            />
                        </div>
                    </Reveal>
                    <Reveal delay={0.1}>
                        <div className="flex items-center gap-4">
                            <span className="eyebrow">Persiapan Dokumen</span>
                            <span className="rule-line" aria-hidden="true" />
                        </div>
                        <h2 className="mt-3 text-2xl font-extrabold tracking-tight text-navy sm:text-3xl">
                            Siapkan dokumen sebelum mengajukan
                        </h2>
                        <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                            Setiap layanan memiliki checklist persyaratan berlabel{' '}
                            <span className="font-semibold text-navy">WAJIB</span> dan{' '}
                            <span className="font-semibold text-navy">TAMBAHAN</span>, serta pusat dokumen
                            berisi formulir PDF yang dapat dipratinjau dan diunduh.
                        </p>
                        <ul className="mt-6 space-y-3">
                            {[
                                'Periksa masa berlaku paspor sebelum memulai permohonan.',
                                'Unduh formulir resmi dari pusat dokumen pada halaman layanan.',
                                'Pastikan penjamin Anda telah terdaftar bila layanan membutuhkannya.',
                            ].map((item) => (
                                <li key={item} className="flex items-start gap-3 text-sm text-foreground/85">
                                    <BadgeCheck className="mt-0.5 h-4 w-4 shrink-0 text-gold-deep" aria-hidden="true" />
                                    {item}
                                </li>
                            ))}
                        </ul>
                        <Button
                            asChild
                            className="mt-7 rounded-xl bg-navy font-semibold hover:bg-navy-light"
                        >
                            <Link to="/layanan/itas">Lihat contoh persyaratan</Link>
                        </Button>
                    </Reveal>
                </div>
            </section>

            {/* PENJAMIN */}
            <section id="penjamin" className="mx-auto max-w-7xl px-4 py-16 sm:px-6">
                <div className="grid items-center gap-10 lg:grid-cols-2">
                    <Reveal className="order-2 lg:order-1">
                        <div className="flex items-center gap-4">
                            <span className="eyebrow">Penjamin</span>
                            <span className="rule-line" aria-hidden="true" />
                        </div>
                        <h2 className="mt-3 text-2xl font-extrabold tracking-tight text-navy sm:text-3xl">
                            Peran penjamin dalam izin tinggal
                        </h2>
                        <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                            Penjamin — perorangan, perusahaan, atau organisasi — bertanggung jawab atas
                            keberadaan dan kegiatan Orang Asing selama berada di Indonesia. Pelajari tata
                            cara registrasi akun, kewajiban, serta dokumen yang diperlukan.
                        </p>
                        <div className="mt-7 flex flex-wrap gap-3">
                            <Button asChild className="rounded-xl bg-navy font-semibold hover:bg-navy-light">
                                <Link to="/penjamin">Pelajari Peran Penjamin</Link>
                            </Button>
                        </div>
                    </Reveal>
                    <Reveal delay={0.1} className="order-1 lg:order-2">
                        <div className="overflow-hidden rounded-2xl shadow-xl">
                            <img
                                src={OFFICE_IMG}
                                alt="Ilustrasi petugas layanan membantu pengunjung di konter layanan modern"
                                className="h-full w-full object-cover"
                                loading="lazy"
                            />
                        </div>
                    </Reveal>
                </div>
            </section>

            {/* BIAYA & ESTIMASI */}
            <section id="biaya" className="border-y border-border bg-white py-16">
                <div className="mx-auto max-w-7xl px-4 sm:px-6">
                    <Reveal>
                        <SectionHeading
                            eyebrow="Biaya & Estimasi"
                            title="Biaya dan estimasi waktu penyelesaian"
                            description="Seluruh nominal dan estimasi di bawah ini adalah data contoh (placeholder)."
                        />
                    </Reveal>
                    <div className="grid gap-6 lg:grid-cols-2">
                        <Reveal>
                            <div className="card-soft overflow-hidden">
                                <div className="border-b border-border bg-navy px-5 py-3.5">
                                    <h3 className="text-sm font-bold text-white">Biaya Layanan (contoh)</h3>
                                </div>
                                <ul className="divide-y divide-border">
                                    {fees.slice(0, 12).map((f) => (
                                        <li key={f.id} className="flex items-center justify-between gap-4 px-5 py-3.5">
                                            <div className="min-w-0">
                                                <p className="truncate text-sm font-semibold text-navy">{f.label}</p>
                                                <p className="text-xs text-muted-foreground">
                                                    {f.expand?.service?.short_title || 'Umum'}
                                                </p>
                                            </div>
                                            <span className="shrink-0 font-mono text-sm font-semibold text-gold-deep">
                                                {f.amount || 'Rp XXX.XXX'}
                                            </span>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        </Reveal>
                        <Reveal delay={0.08}>
                            <div className="card-soft overflow-hidden">
                                <div className="border-b border-border bg-navy px-5 py-3.5">
                                    <h3 className="text-sm font-bold text-white">Estimasi Waktu (contoh)</h3>
                                </div>
                                <ul className="divide-y divide-border">
                                    {times.slice(0, 8).map((t) => (
                                        <li key={t.id} className="flex items-center justify-between gap-4 px-5 py-3.5">
                                            <div className="min-w-0">
                                                <p className="truncate text-sm font-semibold text-navy">{t.label}</p>
                                                <p className="text-xs text-muted-foreground">
                                                    {t.expand?.service?.short_title || 'Umum'}
                                                </p>
                                            </div>
                                            <span className="shrink-0 font-mono text-sm font-semibold text-gold-deep">
                                                {t.estimate || 'X Hari Kerja'}
                                            </span>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        </Reveal>
                    </div>
                </div>
            </section>

            {/* FAQ */}
            <section id="faq" className="mx-auto max-w-4xl px-4 py-16 sm:px-6">
                <Reveal>
                    <SectionHeading
                        eyebrow="FAQ"
                        title="Pertanyaan yang sering diajukan"
                    />
                </Reveal>
                <Reveal delay={0.08}>
                    <div className="card-soft px-5 py-2 sm:px-7">
                        <FaqAccordion items={faqs} />
                    </div>
                </Reveal>
            </section>

            {/* KONTAK */}
            <section id="kontak" className="border-t border-border bg-navy-soft/50 py-16">
                <div className="mx-auto max-w-7xl px-4 sm:px-6">
                    <Reveal>
                        <SectionHeading
                            eyebrow="Kontak"
                            title="Butuh bantuan petugas?"
                            description="Kanal kontak di bawah ini masih berupa data contoh."
                        />
                    </Reveal>
                    <div className="grid gap-4 sm:grid-cols-3">
                        {[
                            { icon: MapPin, title: 'Kantor Layanan', body: 'Jl. Gatot Subroto KM. 6,2 No. 268A, Medan Helvetia, Kota Medan' },
                            { icon: Phone, title: 'Call Center', body: '(+628560865586)' },
                            { icon: Mail, title: 'Surel', body: 'Kanim.Medan@imigrasi.go.id' },
                        ].map((c) => (
                            <Reveal key={c.title}>
                                <div className="card-soft h-full p-6">
                                    <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-navy text-gold">
                                        <c.icon className="h-5 w-5" strokeWidth={1.8} aria-hidden="true" />
                                    </span>
                                    <h3 className="mt-4 text-[15px] font-bold text-navy">{c.title}</h3>
                                    <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground">{c.body}</p>
                                </div>
                            </Reveal>
                        ))}
                    </div>
                </div>
            </section>

            <SiteFooter />
        </div>
    );
};

export default HomePage;
