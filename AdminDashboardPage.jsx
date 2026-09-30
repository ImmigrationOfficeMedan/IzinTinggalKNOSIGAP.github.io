import React, { useEffect, useState } from 'react';
import { Helmet } from 'react-helmet';
import { Navigate, useNavigate } from 'react-router-dom';
import { FileText, Handshake, Layers, LogOut, Menu, Stamp, TrendingUp } from 'lucide-react';
import pb from '@/lib/pocketbaseClient';
import { useAuth } from '@/contexts/AuthContext';
import DataNotice from '@/components/site/DataNotice';
import CrudManager from '@/components/admin/CrudManager';
import { ADMIN_SECTIONS, CRUD_CONFIGS } from './crudConfig';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger, SheetTitle } from '@/components/ui/sheet';

const ROLE_LABEL = { super_admin: 'Super Admin', admin: 'Admin/Petugas' };

const SidebarNav = ({ active, onSelect }) => (
    <nav aria-label="Menu admin" className="flex h-full flex-col">
        <div className="flex items-center gap-3 px-5 py-5">
            <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-white/10 text-gold">
                <Stamp className="h-4 w-4" strokeWidth={1.9} aria-hidden="true" />
            </span>
            <div className="leading-tight">
                <p className="text-sm font-extrabold tracking-tight text-white">SIGAP Admin</p>
                <p className="font-mono text-[9.5px] uppercase tracking-[0.16em] text-white/50">
                    Content Management
                </p>
            </div>
        </div>
        <ul className="flex-1 space-y-0.5 overflow-y-auto px-3 pb-4">
            {ADMIN_SECTIONS.map((s) => (
                <li key={s.id}>
                    <button
                        type="button"
                        onClick={() => onSelect(s.id)}
                        aria-current={active === s.id ? 'page' : undefined}
                        className={`flex w-full items-center gap-2.5 rounded-xl px-3.5 py-2.5 text-[13px] font-medium transition-colors focus-ring ${
                            active === s.id
                                ? 'bg-gold font-semibold text-navy-deep'
                                : 'text-white/70 hover:bg-white/10 hover:text-white'
                        }`}
                    >
                        <s.icon className="h-4 w-4 shrink-0" aria-hidden="true" />
                        {s.label}
                    </button>
                </li>
            ))}
        </ul>
    </nav>
);

const AdminDashboardPage = () => {
    const navigate = useNavigate();
    const { user, isAuthed, logout } = useAuth();
    const [section, setSection] = useState('dashboard');
    const [stats, setStats] = useState(null);
    const [logs, setLogs] = useState([]);
    const [logsError, setLogsError] = useState('');
    const [mobileOpen, setMobileOpen] = useState(false);

    const isAdmin = isAuthed && user?.collectionName === 'users';

    useEffect(() => {
        if (!isAdmin) return;
        let cancelled = false;
        const loadStats = async () => {
            try {
                const [svcAll, svcActive, docs, guar] = await Promise.all([
                    pb.collection('services').getList(1, 1),
                    pb.collection('services').getList(1, 1, { filter: 'active = true' }),
                    pb.collection('documents').getFullList(),
                    pb.collection('guarantors').getList(1, 1),
                ]);
                if (cancelled) return;
                setStats({
                    services: svcAll.totalItems,
                    active: svcActive.totalItems,
                    documents: docs.length,
                    downloads: docs.reduce((sum, d) => sum + (d.downloads || 0), 0),
                    guarantors: guar.totalItems,
                });
            } catch (err) {
                console.error(err);
            }
        };
        loadStats();
        return () => {
            cancelled = true;
        };
    }, [isAdmin, section]);

    useEffect(() => {
        if (!isAdmin || section !== 'audit') return;
        let cancelled = false;
        setLogsError('');
        pb.collection('audit_logs')
            .getList(1, 100, { sort: '-created' })
            .then((res) => {
                if (!cancelled) setLogs(res.items);
            })
            .catch((err) => {
                console.error(err);
                if (!cancelled) setLogsError('Audit log belum dapat dimuat.');
            });
        return () => {
            cancelled = true;
        };
    }, [isAdmin, section]);

    if (!isAdmin) return <Navigate to="/admin/login" replace />;

    const doLogout = () => {
        logout();
        navigate('/admin/login');
    };

    const selectSection = (id) => {
        setSection(id);
        setMobileOpen(false);
    };

    const activeSection = ADMIN_SECTIONS.find((s) => s.id === section);

    const statCards = stats
        ? [
              { icon: Layers, label: 'Total Layanan', value: stats.services },
              { icon: FileText, label: 'Total Dokumen PDF', value: stats.documents },
              { icon: TrendingUp, label: 'Total Download', value: stats.downloads },
              { icon: Layers, label: 'Layanan Aktif', value: stats.active },
              { icon: Handshake, label: 'Total Penjamin', value: stats.guarantors },
          ]
        : [];

    return (
        <div className="min-h-screen bg-background">
            <Helmet>
                <title>Dashboard Admin — SIGAP</title>
                <meta name="description" content="Dashboard pengelolaan konten SIGAP (prototype)." />
            </Helmet>

            <div className="lg:grid lg:grid-cols-[260px_1fr]">
                {/* Sidebar desktop */}
                <aside className="sticky top-0 hidden h-screen bg-navy-deep lg:block">
                    <SidebarNav active={section} onSelect={selectSection} />
                </aside>

                <div className="min-w-0">
                    {/* Topbar */}
                    <header className="sticky top-0 z-40 border-b border-border bg-white/95 backdrop-blur">
                        <div className="flex h-16 items-center justify-between gap-3 px-4 sm:px-6">
                            <div className="flex items-center gap-3">
                                <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
                                    <SheetTrigger asChild>
                                        <Button variant="outline" size="icon" className="rounded-xl lg:hidden" aria-label="Buka menu admin">
                                            <Menu className="h-5 w-5" aria-hidden="true" />
                                        </Button>
                                    </SheetTrigger>
                                    <SheetContent side="left" className="w-72 bg-navy-deep p-0">
                                        <SheetTitle className="sr-only">Menu Admin</SheetTitle>
                                        <SidebarNav active={section} onSelect={selectSection} />
                                    </SheetContent>
                                </Sheet>
                                <h1 className="text-base font-extrabold tracking-tight text-navy">
                                    {activeSection?.label || 'Dashboard'}
                                </h1>
                            </div>
                            <div className="flex items-center gap-3">
                                <div className="hidden text-right sm:block">
                                    <p className="text-sm font-bold text-navy">{user?.name || user?.email}</p>
                                    <p className="font-mono text-[10px] uppercase tracking-[0.14em] text-gold-deep">
                                        {ROLE_LABEL[user?.role] || 'Petugas'}
                                    </p>
                                </div>
                                <Button variant="outline" size="sm" className="rounded-xl" onClick={doLogout}>
                                    <LogOut className="mr-2 h-4 w-4" aria-hidden="true" />
                                    Logout
                                </Button>
                            </div>
                        </div>
                    </header>

                    <main className="px-4 py-8 sm:px-6">
                        <DataNotice className="mb-6" />

                        {section === 'dashboard' && (
                            <div>
                                <h2 className="text-lg font-extrabold tracking-tight text-navy">
                                    Ringkasan Portal
                                </h2>
                                <p className="text-xs text-muted-foreground">
                                    Statistik berikut dihitung dari data contoh yang tersimpan.
                                </p>
                                <div className="mt-5 grid grid-cols-2 gap-3 sm:grid-cols-3 xl:grid-cols-5">
                                    {(stats ? statCards : Array.from({ length: 5 })).map((c, i) =>
                                        stats ? (
                                            <div key={c.label} className="card-soft p-5">
                                                <c.icon className="h-5 w-5 text-gold-deep" strokeWidth={1.8} aria-hidden="true" />
                                                <p className="mt-3 text-2xl font-extrabold text-navy">{c.value}</p>
                                                <p className="mt-0.5 font-mono text-[10px] uppercase tracking-[0.14em] text-muted-foreground">
                                                    {c.label}
                                                </p>
                                            </div>
                                        ) : (
                                            <div key={i} className="h-28 animate-pulse rounded-2xl bg-muted" />
                                        ),
                                    )}
                                </div>
                                <div className="card-soft mt-6 p-6">
                                    <h3 className="text-sm font-bold text-navy">Panduan cepat</h3>
                                    <ul className="mt-3 list-disc space-y-1.5 pl-5 text-sm leading-relaxed text-muted-foreground">
                                        <li>Gunakan menu di samping untuk mengelola layanan, tata cara, persyaratan, dokumen, biaya, lama proses, dan FAQ.</li>
                                        <li>Menu Dokumen PDF mendukung unggah, pratinjau, unduh, ganti (replace), aktif/nonaktif, urutan, dan hapus.</li>
                                        <li>Seluruh perubahan tercatat pada Audit Log.</li>
                                        <li>Ganti seluruh data contoh sebelum portal digunakan secara resmi.</li>
                                    </ul>
                                </div>
                            </div>
                        )}

                        {activeSection?.type === 'crud' && (
                            <CrudManager key={section} config={CRUD_CONFIGS[section]} />
                        )}

                        {section === 'audit' && (
                            <div>
                                <h2 className="text-lg font-extrabold tracking-tight text-navy">Audit Log</h2>
                                <p className="text-xs text-muted-foreground">
                                    Jejak aktivitas petugas pada konten portal.
                                </p>
                                {logsError && (
                                    <p className="mt-4 rounded-xl border border-destructive/30 bg-destructive/5 px-4 py-3 text-sm text-destructive">
                                        {logsError}
                                    </p>
                                )}
                                <div className="card-soft mt-5 overflow-x-auto">
                                    {logs.length === 0 ? (
                                        <p className="px-5 py-12 text-center text-sm text-muted-foreground">
                                            Belum ada aktivitas tercatat.
                                        </p>
                                    ) : (
                                        <table className="w-full min-w-[640px] text-left text-sm">
                                            <thead>
                                                <tr className="border-b border-border bg-secondary/60">
                                                    {['Waktu', 'Petugas', 'Aksi', 'Entitas', 'Detail'].map((h) => (
                                                        <th
                                                            key={h}
                                                            className="px-4 py-3 font-mono text-[10.5px] font-semibold uppercase tracking-[0.14em] text-muted-foreground"
                                                        >
                                                            {h}
                                                        </th>
                                                    ))}
                                                </tr>
                                            </thead>
                                            <tbody className="divide-y divide-border">
                                                {logs.map((log) => (
                                                    <tr key={log.id}>
                                                        <td className="whitespace-nowrap px-4 py-3 font-mono text-xs text-muted-foreground">
                                                            {new Date(log.created).toLocaleString('id-ID')}
                                                        </td>
                                                        <td className="px-4 py-3 text-foreground/85">{log.actor_name}</td>
                                                        <td className="px-4 py-3">
                                                            <span className="rounded-full bg-navy-soft px-2.5 py-0.5 font-mono text-[10px] font-semibold uppercase tracking-wider text-navy">
                                                                {log.action}
                                                            </span>
                                                        </td>
                                                        <td className="px-4 py-3 font-mono text-xs text-foreground/85">{log.entity}</td>
                                                        <td className="max-w-[280px] truncate px-4 py-3 text-muted-foreground">
                                                            {log.detail || '—'}
                                                        </td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    )}
                                </div>
                            </div>
                        )}

                        {section === 'settings' && (
                            <div>
                                <h2 className="text-lg font-extrabold tracking-tight text-navy">Pengaturan</h2>
                                <div className="card-soft mt-5 divide-y divide-border">
                                    {[
                                        ['Nama portal', 'SIGAP — Digital Immigration Service Center'],
                                        ['Bahasa utama', 'Bahasa Indonesia (struktur ID | EN tersedia untuk pengembangan)'],
                                        ['Status konten', 'DATA CONTOH — wajib diperbarui petugas sebelum digunakan resmi'],
                                        ['Mode', 'Prototype — belum terintegrasi sistem resmi'],
                                    ].map(([label, value]) => (
                                        <div key={label} className="flex flex-col gap-1 px-5 py-4 sm:flex-row sm:items-center sm:justify-between">
                                            <span className="text-sm text-muted-foreground">{label}</span>
                                            <span className="text-sm font-semibold text-navy">{value}</span>
                                        </div>
                                    ))}
                                </div>
                                <p className="mt-4 text-xs leading-relaxed text-muted-foreground">
                                    Pengaturan lanjutan (nama instansi, kanal kontak resmi, integrasi) akan
                                    ditambahkan pada tahap pengembangan berikutnya.
                                </p>
                            </div>
                        )}
                    </main>
                </div>
            </div>
        </div>
    );
};

export default AdminDashboardPage;
