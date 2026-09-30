import React, { useEffect, useState } from 'react';
import { Helmet } from 'react-helmet';
import { Link, Navigate, useNavigate } from 'react-router-dom';
import {
    Bell,
    Download,
    Eye,
    FileText,
    Handshake,
    HelpCircle,
    Info,
    LayoutDashboard,
    LogOut,
    Scale,
    Stamp,
    UserRound,
    Users,
} from 'lucide-react';
import pb from '@/lib/pocketbaseClient';
import useGuarantorAuth from '@/hooks/useGuarantorAuth';
import DataNotice from '@/components/site/DataNotice';
import FaqAccordion from '@/components/site/FaqAccordion';
import PdfPreviewModal from '@/components/site/PdfPreviewModal';
import { Button } from '@/components/ui/button';
import { getDocUrl } from '@/lib/docs';

const MENU = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'orang-asing', label: 'Orang Asing yang Dijamin', icon: Users },
    { id: 'dokumen', label: 'Dokumen', icon: FileText },
    { id: 'notifikasi', label: 'Notifikasi', icon: Bell },
    { id: 'profil', label: 'Profil', icon: UserRound },
    { id: 'layanan', label: 'Informasi Layanan', icon: Info },
    { id: 'kewajiban', label: 'Kewajiban', icon: Scale },
    { id: 'faq', label: 'FAQ', icon: HelpCircle },
    { id: 'bantuan', label: 'Bantuan', icon: Handshake },
];

const STATUS_STYLE = {
    aktif: 'bg-emerald-100 text-emerald-800',
    pending: 'bg-gold-soft text-gold-deep',
    nonaktif: 'bg-destructive/10 text-destructive',
};

const PenjaminDashboardPage = () => {
    const navigate = useNavigate();
    const { guarantor, isGuarantor, logout } = useGuarantorAuth();
    const [section, setSection] = useState('dashboard');
    const [docs, setDocs] = useState([]);
    const [obligations, setObligations] = useState([]);
    const [faqs, setFaqs] = useState([]);
    const [services, setServices] = useState([]);
    const [preview, setPreview] = useState(null);

    useEffect(() => {
        if (!isGuarantor) return;
        let cancelled = false;
        const load = async () => {
            try {
                const [d, o, f, s] = await Promise.all([
                    pb.collection('guarantor_documents').getFullList({ sort: 'order' }),
                    pb.collection('guarantor_obligations').getFullList({ sort: 'order' }),
                    pb.collection('guarantor_faq').getFullList({ sort: 'order' }),
                    pb.collection('services').getFullList({ sort: 'order' }),
                ]);
                if (cancelled) return;
                setDocs(d.filter((x) => x.active));
                setObligations(o);
                setFaqs(f);
                setServices(s.filter((x) => x.active));
            } catch (err) {
                console.error(err);
            }
        };
        load();
        return () => {
            cancelled = true;
        };
    }, [isGuarantor]);

    if (!isGuarantor) return <Navigate to="/penjamin/login" replace />;

    const sponsored = Array.isArray(guarantor?.sponsored) ? guarantor.sponsored : [];
    const notifications = Array.isArray(guarantor?.notifications) ? guarantor.notifications : [];

    const doLogout = () => {
        logout();
        navigate('/penjamin/login');
    };

    return (
        <div className="min-h-screen bg-background">
            <Helmet>
                <title>Dashboard Penjamin — SIGAP</title>
                <meta name="description" content="Dashboard penjamin SIGAP (prototype — data contoh)." />
            </Helmet>

            {/* Topbar */}
            <header className="sticky top-0 z-40 border-b border-border bg-white/95 backdrop-blur">
                <div className="mx-auto flex h-16 max-w-7xl items-center justify-between gap-3 px-4 sm:px-6">
                    <Link to="/" className="flex items-center gap-3 focus-ring rounded-lg">
                        <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-navy text-gold">
                            <Stamp className="h-4.5 w-4.5" strokeWidth={1.9} aria-hidden="true" />
                        </span>
                        <span className="leading-tight">
                            <span className="block text-base font-extrabold tracking-tight text-navy">SIGAP</span>
                            <span className="block text-[10px] font-medium uppercase tracking-[0.14em] text-muted-foreground">
                                Dashboard Penjamin (Prototype)
                            </span>
                        </span>
                    </Link>
                    <div className="flex items-center gap-3">
                        <span
                            className={`hidden rounded-full px-3 py-1 font-mono text-[10px] font-semibold uppercase tracking-wider sm:inline-block ${STATUS_STYLE[guarantor?.status] || 'bg-muted text-muted-foreground'}`}
                        >
                            Akun {guarantor?.status || '—'}
                        </span>
                        <Button variant="outline" size="sm" className="rounded-xl" onClick={doLogout}>
                            <LogOut className="mr-2 h-4 w-4" aria-hidden="true" />
                            Logout
                        </Button>
                    </div>
                </div>
            </header>

            <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6">
                <DataNotice className="mb-6" />
                <p className="mb-6 rounded-xl border border-border bg-white px-4 py-3 text-xs leading-relaxed text-muted-foreground">
                    Dashboard ini adalah prototype. Status akun, dokumen, dan daftar Orang Asing yang dijamin
                    merupakan data contoh — bukan status real-time dan belum terintegrasi dengan sistem resmi.
                </p>

                <div className="grid gap-8 lg:grid-cols-[240px_1fr]">
                    {/* Sidebar */}
                    <nav aria-label="Menu dashboard penjamin" className="lg:sticky lg:top-24 lg:self-start">
                        <ul className="flex gap-1 overflow-x-auto rounded-2xl border border-border bg-white p-2 lg:flex-col lg:overflow-visible">
                            {MENU.map((m) => (
                                <li key={m.id} className="shrink-0">
                                    <button
                                        type="button"
                                        onClick={() => setSection(m.id)}
                                        aria-current={section === m.id ? 'page' : undefined}
                                        className={`flex w-full items-center gap-2.5 whitespace-nowrap rounded-xl px-3.5 py-2.5 text-sm font-medium transition-colors focus-ring ${
                                            section === m.id
                                                ? 'bg-navy text-white'
                                                : 'text-foreground/75 hover:bg-secondary'
                                        }`}
                                    >
                                        <m.icon className="h-4 w-4" aria-hidden="true" />
                                        {m.label}
                                    </button>
                                </li>
                            ))}
                        </ul>
                    </nav>

                    {/* Konten */}
                    <main>
                        {section === 'dashboard' && (
                            <div>
                                <h1 className="text-xl font-extrabold tracking-tight text-navy">
                                    Selamat datang, {guarantor?.name || 'Penjamin'}
                                </h1>
                                <p className="mt-1 text-sm text-muted-foreground">
                                    Ringkasan akun penjamin Anda (data contoh).
                                </p>
                                <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-4">
                                    {[
                                        { label: 'Status Akun', value: guarantor?.status || '—' },
                                        { label: 'Orang Asing Dijamin', value: sponsored.length },
                                        { label: 'Dokumen Tersedia', value: docs.length },
                                        { label: 'Notifikasi', value: notifications.length },
                                    ].map((c) => (
                                        <div key={c.label} className="card-soft p-4">
                                            <p className="font-mono text-[10px] uppercase tracking-[0.16em] text-muted-foreground">
                                                {c.label}
                                            </p>
                                            <p className="mt-1.5 text-lg font-extrabold capitalize text-navy">
                                                {c.value}
                                            </p>
                                        </div>
                                    ))}
                                </div>
                                <div className="card-soft mt-6 p-6">
                                    <h2 className="text-sm font-bold text-navy">Notifikasi terbaru</h2>
                                    <ul className="mt-3 space-y-3">
                                        {notifications.slice(0, 3).map((n, i) => (
                                            <li key={i} className="flex items-start gap-3 text-sm">
                                                <Bell className="mt-0.5 h-4 w-4 shrink-0 text-gold-deep" aria-hidden="true" />
                                                <div>
                                                    <p className="font-semibold text-navy">{n.title}</p>
                                                    <p className="text-muted-foreground">{n.body}</p>
                                                </div>
                                            </li>
                                        ))}
                                        {notifications.length === 0 && (
                                            <li className="text-sm text-muted-foreground">Belum ada notifikasi.</li>
                                        )}
                                    </ul>
                                </div>
                            </div>
                        )}

                        {section === 'orang-asing' && (
                            <div>
                                <h1 className="text-xl font-extrabold tracking-tight text-navy">
                                    Orang Asing yang Dijamin
                                </h1>
                                <p className="mt-1 text-sm text-muted-foreground">Daftar berikut adalah data contoh.</p>
                                {sponsored.length === 0 ? (
                                    <p className="mt-6 rounded-xl border border-dashed border-border px-4 py-10 text-center text-sm text-muted-foreground">
                                        Belum ada Orang Asing yang terdaftar pada akun Anda.
                                    </p>
                                ) : (
                                    <ul className="mt-6 grid gap-3 md:grid-cols-2">
                                        {sponsored.map((p, i) => (
                                            <li key={i} className="card-soft p-5">
                                                <div className="flex items-center justify-between gap-3">
                                                    <h3 className="text-sm font-bold text-navy">{p.name}</h3>
                                                    <span className="rounded-full bg-navy-soft px-2.5 py-0.5 font-mono text-[10px] font-semibold uppercase tracking-wider text-navy">
                                                        {p.permit}
                                                    </span>
                                                </div>
                                                <p className="mt-1 text-xs text-muted-foreground">
                                                    Kewarganegaraan: {p.nationality}
                                                </p>
                                                <p className="mt-2 text-xs font-semibold text-gold-deep">{p.status}</p>
                                            </li>
                                        ))}
                                    </ul>
                                )}
                            </div>
                        )}

                        {section === 'dokumen' && (
                            <div>
                                <h1 className="text-xl font-extrabold tracking-tight text-navy">Dokumen Penjamin</h1>
                                <p className="mt-1 text-sm text-muted-foreground">
                                    Formulir dan dokumen yang dapat dipratinjau dan diunduh.
                                </p>
                                <ul className="mt-6 space-y-3">
                                    {docs.map((d) => (
                                        <li key={d.id} className="card-soft flex items-center gap-4 p-5">
                                            <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-navy-soft text-navy">
                                                <FileText className="h-5 w-5" strokeWidth={1.8} aria-hidden="true" />
                                            </span>
                                            <div className="min-w-0 flex-1">
                                                <h3 className="truncate text-sm font-bold text-navy">{d.title}</h3>
                                                <p className="truncate text-xs text-muted-foreground">{d.description}</p>
                                            </div>
                                            <div className="flex shrink-0 gap-2">
                                                <Button
                                                    variant="outline"
                                                    size="sm"
                                                    className="rounded-lg"
                                                    onClick={() =>
                                                        setPreview({
                                                            title: d.title,
                                                            description: d.description,
                                                            url: getDocUrl(d),
                                                        })
                                                    }
                                                >
                                                    <Eye className="mr-1.5 h-3.5 w-3.5" aria-hidden="true" />
                                                    Pratinjau
                                                </Button>
                                                {getDocUrl(d) && (
                                                    <Button asChild size="sm" className="rounded-lg bg-navy hover:bg-navy-light">
                                                        <a href={getDocUrl(d)} download target="_blank" rel="noreferrer">
                                                            <Download className="h-3.5 w-3.5" aria-hidden="true" />
                                                            <span className="sr-only">Unduh {d.title}</span>
                                                        </a>
                                                    </Button>
                                                )}
                                            </div>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        )}

                        {section === 'notifikasi' && (
                            <div>
                                <h1 className="text-xl font-extrabold tracking-tight text-navy">Notifikasi</h1>
                                <ul className="mt-6 space-y-3">
                                    {notifications.map((n, i) => (
                                        <li key={i} className="card-soft flex items-start gap-4 p-5">
                                            <Bell className="mt-0.5 h-5 w-5 shrink-0 text-gold-deep" aria-hidden="true" />
                                            <div>
                                                <p className="text-sm font-bold text-navy">{n.title}</p>
                                                <p className="mt-0.5 text-sm text-muted-foreground">{n.body}</p>
                                                {n.date && (
                                                    <p className="mt-1 font-mono text-[11px] text-muted-foreground">{n.date}</p>
                                                )}
                                            </div>
                                        </li>
                                    ))}
                                    {notifications.length === 0 && (
                                        <li className="rounded-xl border border-dashed border-border px-4 py-10 text-center text-sm text-muted-foreground">
                                            Belum ada notifikasi.
                                        </li>
                                    )}
                                </ul>
                            </div>
                        )}

                        {section === 'profil' && (
                            <div>
                                <h1 className="text-xl font-extrabold tracking-tight text-navy">Profil Penjamin</h1>
                                <div className="card-soft mt-6 divide-y divide-border">
                                    {[
                                        ['Nama', guarantor?.name],
                                        ['Perusahaan / Organisasi', guarantor?.company || '—'],
                                        ['Email', guarantor?.email],
                                        ['Telepon', guarantor?.phone || '—'],
                                        ['Status Akun', guarantor?.status || '—'],
                                    ].map(([label, value]) => (
                                        <div key={label} className="flex items-center justify-between gap-4 px-5 py-3.5">
                                            <span className="text-sm text-muted-foreground">{label}</span>
                                            <span className="text-sm font-semibold capitalize text-navy">{value}</span>
                                        </div>
                                    ))}
                                </div>
                                <p className="mt-4 text-xs text-muted-foreground">
                                    Perubahan data profil dilakukan melalui petugas (prototype).
                                </p>
                            </div>
                        )}

                        {section === 'layanan' && (
                            <div>
                                <h1 className="text-xl font-extrabold tracking-tight text-navy">Informasi Layanan</h1>
                                <ul className="mt-6 grid gap-3 md:grid-cols-2">
                                    {services.map((s) => (
                                        <li key={s.id}>
                                            <Link
                                                to={`/layanan/${s.slug}`}
                                                className="card-soft block h-full p-5 transition-all hover:-translate-y-0.5 hover:border-navy/30 focus-ring"
                                            >
                                                <p className="font-mono text-[10px] font-semibold uppercase tracking-[0.18em] text-gold-deep">
                                                    {s.code}
                                                </p>
                                                <h3 className="mt-1 text-sm font-bold text-navy">{s.title}</h3>
                                                <p className="mt-1 text-xs leading-relaxed text-muted-foreground">
                                                    {s.tagline}
                                                </p>
                                            </Link>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        )}

                        {section === 'kewajiban' && (
                            <div>
                                <h1 className="text-xl font-extrabold tracking-tight text-navy">Kewajiban Penjamin</h1>
                                <ul className="mt-6 grid gap-3 md:grid-cols-2">
                                    {obligations
                                        .filter((o) => o.kind === 'kewajiban')
                                        .map((o) => (
                                            <li key={o.id} className="card-soft flex items-start gap-4 p-5">
                                                <Scale className="mt-0.5 h-5 w-5 shrink-0 text-gold-deep" aria-hidden="true" />
                                                <div>
                                                    <h3 className="text-sm font-bold text-navy">{o.title}</h3>
                                                    <p className="mt-1 text-[13px] leading-relaxed text-muted-foreground">
                                                        {o.description}
                                                    </p>
                                                </div>
                                            </li>
                                        ))}
                                </ul>
                            </div>
                        )}

                        {section === 'faq' && (
                            <div>
                                <h1 className="text-xl font-extrabold tracking-tight text-navy">FAQ Penjamin</h1>
                                <div className="card-soft mt-6 px-5 py-2 sm:px-7">
                                    <FaqAccordion items={faqs} />
                                </div>
                            </div>
                        )}

                        {section === 'bantuan' && (
                            <div>
                                <h1 className="text-xl font-extrabold tracking-tight text-navy">Bantuan</h1>
                                <div className="card-soft mt-6 p-6">
                                    <p className="text-sm leading-relaxed text-foreground/85">
                                        Jika Anda membutuhkan bantuan terkait akun penjamin, hubungi kanal
                                        layanan berikut (data contoh):
                                    </p>
                                    <ul className="mt-4 space-y-2 text-sm text-muted-foreground">
                                        <li>Call center: (021) 000-0000 — hari kerja, jam layanan</li>
                                        <li>Surel: layanan@sigap.example.id</li>
                                        <li>Kantor layanan: Jl. Contoh Alamat No. 00, Jakarta</li>
                                    </ul>
                                    <Button asChild className="mt-6 rounded-xl bg-navy font-semibold hover:bg-navy-light">
                                        <Link to="/#kontak">Lihat Halaman Kontak</Link>
                                    </Button>
                                </div>
                            </div>
                        )}
                    </main>
                </div>
            </div>

            <PdfPreviewModal doc={preview} open={!!preview} onOpenChange={() => setPreview(null)} />
        </div>
    );
};

export default PenjaminDashboardPage;
