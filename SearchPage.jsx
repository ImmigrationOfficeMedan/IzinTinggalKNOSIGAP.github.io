import React, { useEffect, useMemo, useState } from 'react';
import { Helmet } from 'react-helmet';
import { Link, useSearchParams } from 'react-router-dom';
import { AlertTriangle, ArrowRight, Search, SearchX } from 'lucide-react';
import pb from '@/lib/pocketbaseClient';
import SiteHeader from '@/components/site/SiteHeader';
import SiteFooter from '@/components/site/SiteFooter';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';

const TYPE_STYLE = {
    Layanan: 'bg-navy text-white',
    'Tata Cara': 'bg-navy-soft text-navy',
    Persyaratan: 'bg-navy-soft text-navy',
    Dokumen: 'bg-gold-soft text-gold-deep',
    Biaya: 'bg-gold-soft text-gold-deep',
    'Estimasi Waktu': 'bg-gold-soft text-gold-deep',
    FAQ: 'bg-secondary text-navy',
    Penjamin: 'bg-secondary text-navy',
    Peraturan: 'bg-secondary text-navy',
};

const SearchPage = () => {
    const [params, setParams] = useSearchParams();
    const [query, setQuery] = useState(params.get('q') || '');
    const [serviceFilter, setServiceFilter] = useState('semua');
    const [services, setServices] = useState([]);
    const [index, setIndex] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        let cancelled = false;
        const load = async () => {
            setLoading(true);
            setError('');
            try {
                const [
                    svc,
                    procedures,
                    requirements,
                    documents,
                    fees,
                    times,
                    faqs,
                    gFaq,
                    gObl,
                    gProc,
                    gDocs,
                    regs,
                ] = await Promise.all([
                    pb.collection('services').getFullList({ sort: 'order' }),
                    pb.collection('procedures').getFullList(),
                    pb.collection('requirements').getFullList(),
                    pb.collection('documents').getFullList(),
                    pb.collection('fees').getFullList(),
                    pb.collection('processing_times').getFullList(),
                    pb.collection('faq').getFullList(),
                    pb.collection('guarantor_faq').getFullList(),
                    pb.collection('guarantor_obligations').getFullList(),
                    pb.collection('guarantor_procedures').getFullList(),
                    pb.collection('guarantor_documents').getFullList(),
                    pb.collection('regulations').getFullList(),
                ]);
                if (cancelled) return;
                const slugOf = {};
                svc.forEach((s) => {
                    slugOf[s.id] = s.slug;
                });
                const items = [];
                svc.forEach((s) =>
                    items.push({
                        id: `svc-${s.id}`,
                        type: 'Layanan',
                        title: s.title,
                        snippet: s.tagline,
                        serviceSlug: s.slug,
                        url: `/layanan/${s.slug}`,
                    }),
                );
                procedures.forEach((p) =>
                    items.push({
                        id: `proc-${p.id}`,
                        type: 'Tata Cara',
                        title: p.title,
                        snippet: p.description,
                        serviceSlug: slugOf[p.service],
                        url: `/layanan/${slugOf[p.service]}#tata-cara`,
                    }),
                );
                requirements.forEach((r) =>
                    items.push({
                        id: `req-${r.id}`,
                        type: 'Persyaratan',
                        title: r.label,
                        snippet: r.description,
                        serviceSlug: slugOf[r.service],
                        url: `/layanan/${slugOf[r.service]}#persyaratan`,
                    }),
                );
                documents.forEach((d) =>
                    items.push({
                        id: `doc-${d.id}`,
                        type: 'Dokumen',
                        title: d.title,
                        snippet: d.description,
                        serviceSlug: slugOf[d.service],
                        url: `/layanan/${slugOf[d.service]}#dokumen`,
                    }),
                );
                fees.forEach((f) =>
                    items.push({
                        id: `fee-${f.id}`,
                        type: 'Biaya',
                        title: f.label,
                        snippet: `${f.amount || 'Rp XXX.XXX'} — ${f.note || ''}`,
                        serviceSlug: slugOf[f.service],
                        url: `/layanan/${slugOf[f.service]}#biaya`,
                    }),
                );
                times.forEach((t) =>
                    items.push({
                        id: `time-${t.id}`,
                        type: 'Estimasi Waktu',
                        title: t.label,
                        snippet: `${t.estimate || 'X Hari Kerja'} — ${t.note || ''}`,
                        serviceSlug: slugOf[t.service],
                        url: `/layanan/${slugOf[t.service]}#biaya`,
                    }),
                );
                faqs.forEach((f) =>
                    items.push({
                        id: `faq-${f.id}`,
                        type: 'FAQ',
                        title: f.question,
                        snippet: f.answer,
                        serviceSlug: f.service ? slugOf[f.service] : undefined,
                        url: f.service ? `/layanan/${slugOf[f.service]}#faq` : '/#faq',
                    }),
                );
                gFaq.forEach((f) =>
                    items.push({
                        id: `gfaq-${f.id}`,
                        type: 'Penjamin',
                        title: f.question,
                        snippet: f.answer,
                        serviceSlug: 'penjamin',
                        url: '/penjamin',
                    }),
                );
                gObl.forEach((o) =>
                    items.push({
                        id: `gobl-${o.id}`,
                        type: 'Penjamin',
                        title: o.title,
                        snippet: o.description,
                        serviceSlug: 'penjamin',
                        url: '/penjamin',
                    }),
                );
                gProc.forEach((p) =>
                    items.push({
                        id: `gproc-${p.id}`,
                        type: 'Penjamin',
                        title: p.title,
                        snippet: p.description,
                        serviceSlug: 'penjamin',
                        url: '/penjamin',
                    }),
                );
                gDocs.forEach((d) =>
                    items.push({
                        id: `gdoc-${d.id}`,
                        type: 'Dokumen',
                        title: d.title,
                        snippet: d.description,
                        serviceSlug: 'penjamin',
                        url: '/penjamin',
                    }),
                );
                regs.forEach((r) =>
                    items.push({
                        id: `reg-${r.id}`,
                        type: 'Peraturan',
                        title: r.title,
                        snippet: `${r.reference || ''} — ${r.description || ''}`,
                        url: '/penjamin',
                    }),
                );
                setServices(svc);
                setIndex(items);
            } catch (err) {
                if (!cancelled) setError('Pencarian belum dapat dimuat. Periksa koneksi Anda lalu coba lagi.');
                console.error(err);
            } finally {
                if (!cancelled) setLoading(false);
            }
        };
        load();
        return () => {
            cancelled = true;
        };
    }, []);

    const activeQuery = (params.get('q') || '').trim().toLowerCase();

    const results = useMemo(() => {
        if (!activeQuery) return [];
        return index.filter((item) => {
            const matchQuery = `${item.title} ${item.snippet || ''}`.toLowerCase().includes(activeQuery);
            const matchService =
                serviceFilter === 'semua' || item.serviceSlug === serviceFilter;
            return matchQuery && matchService;
        });
    }, [index, activeQuery, serviceFilter]);

    const grouped = useMemo(() => {
        const map = {};
        results.forEach((r) => {
            map[r.type] = map[r.type] || [];
            map[r.type].push(r);
        });
        return map;
    }, [results]);

    const submit = (e) => {
        e.preventDefault();
        setParams({ q: query.trim() });
    };

    return (
        <div className="min-h-screen bg-background">
            <Helmet>
                <title>Pencarian — SIGAP</title>
                <meta
                    name="description"
                    content="Cari layanan, persyaratan, tata cara, dokumen, biaya, FAQ, dan informasi penjamin di portal SIGAP."
                />
            </Helmet>
            <SiteHeader />

            <section className="bg-navy-deep text-white">
                <div className="mx-auto max-w-4xl px-4 py-14 sm:px-6">
                    <p className="font-mono text-[11px] font-medium uppercase tracking-[0.22em] text-gold">
                        Pencarian Global
                    </p>
                    <h1 className="mt-3 text-2xl font-extrabold tracking-tight sm:text-3xl">
                        Cari layanan izin tinggal...
                    </h1>
                    <form onSubmit={submit} className="mt-6 flex flex-col gap-3 sm:flex-row" role="search">
                        <label htmlFor="search-input" className="sr-only">
                            Kata kunci pencarian
                        </label>
                        <div className="relative flex-1">
                            <Search
                                className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground"
                                aria-hidden="true"
                            />
                            <Input
                                id="search-input"
                                value={query}
                                onChange={(e) => setQuery(e.target.value)}
                                placeholder="Contoh: ITAS, ITAP, ITK, Alih Status..."
                                className="h-12 rounded-xl border-white/20 bg-white/95 pl-11 text-foreground"
                            />
                        </div>
                        <Button type="submit" className="h-12 rounded-xl bg-gold px-6 font-bold text-navy-deep hover:bg-gold/90">
                            Cari Layanan
                        </Button>
                    </form>
                    <div className="mt-4 max-w-xs">
                        <label htmlFor="filter-layanan" className="mb-1.5 block font-mono text-[10px] uppercase tracking-[0.18em] text-white/60">
                            Filter layanan
                        </label>
                        <Select value={serviceFilter} onValueChange={setServiceFilter}>
                            <SelectTrigger id="filter-layanan" className="rounded-xl border-white/20 bg-white/95 text-foreground">
                                <SelectValue placeholder="Semua layanan" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="semua">Semua layanan</SelectItem>
                                {services.map((s) => (
                                    <SelectItem key={s.id} value={s.slug}>
                                        {s.title}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>
                </div>
            </section>

            <main className="mx-auto max-w-4xl px-4 py-12 sm:px-6">
                {loading && (
                    <div className="space-y-3" aria-busy="true">
                        {Array.from({ length: 4 }).map((_, i) => (
                            <div key={i} className="h-20 animate-pulse rounded-2xl bg-muted" />
                        ))}
                    </div>
                )}

                {!loading && error && (
                    <div className="rounded-2xl border border-destructive/30 bg-destructive/5 px-6 py-10 text-center">
                        <AlertTriangle className="mx-auto h-8 w-8 text-destructive" aria-hidden="true" />
                        <p className="mt-3 text-sm font-semibold text-destructive">{error}</p>
                        <Button
                            variant="outline"
                            className="mt-4 rounded-xl"
                            onClick={() => window.location.reload()}
                        >
                            Muat Ulang
                        </Button>
                    </div>
                )}

                {!loading && !error && !activeQuery && (
                    <div className="rounded-2xl border border-dashed border-border px-6 py-14 text-center">
                        <Search className="mx-auto h-9 w-9 text-muted-foreground" aria-hidden="true" />
                        <h2 className="mt-4 text-lg font-bold text-navy">Mulai dengan kata kunci</h2>
                        <p className="mx-auto mt-1.5 max-w-md text-sm text-muted-foreground">
                            Pencarian mencakup layanan, persyaratan, tata cara, dokumen, biaya, FAQ, dan
                            informasi penjamin.
                        </p>
                    </div>
                )}

                {!loading && !error && activeQuery && results.length === 0 && (
                    <div className="rounded-2xl border border-dashed border-border px-6 py-14 text-center">
                        <SearchX className="mx-auto h-9 w-9 text-muted-foreground" aria-hidden="true" />
                        <h2 className="mt-4 text-lg font-bold text-navy">
                            Tidak ada hasil untuk “{activeQuery}”
                        </h2>
                        <p className="mx-auto mt-1.5 max-w-md text-sm text-muted-foreground">
                            Coba kata kunci lain, periksa ejaan, atau longgarkan filter layanan.
                        </p>
                        <Button
                            variant="outline"
                            className="mt-5 rounded-xl"
                            onClick={() => setServiceFilter('semua')}
                        >
                            Hapus Filter
                        </Button>
                    </div>
                )}

                {!loading && !error && activeQuery && results.length > 0 && (
                    <div>
                        <p className="mb-6 text-sm text-muted-foreground">
                            <span className="font-bold text-navy">{results.length}</span> hasil untuk “
                            {activeQuery}”
                        </p>
                        {Object.entries(grouped).map(([type, items]) => (
                            <section key={type} className="mb-8">
                                <div className="mb-3 flex items-center gap-3">
                                    <h2 className="font-mono text-[11px] font-semibold uppercase tracking-[0.2em] text-gold-deep">
                                        {type}
                                    </h2>
                                    <span className="rule-line" aria-hidden="true" />
                                    <span className="font-mono text-[11px] text-muted-foreground">
                                        {items.length}
                                    </span>
                                </div>
                                <ul className="space-y-2.5">
                                    {items.map((item) => (
                                        <li key={item.id}>
                                            <Link
                                                to={item.url}
                                                className="group card-soft flex items-center gap-4 p-4 transition-all hover:-translate-y-0.5 hover:border-navy/30 focus-ring"
                                            >
                                                <span
                                                    className={`shrink-0 rounded-full px-2.5 py-1 font-mono text-[10px] font-semibold uppercase tracking-wider ${TYPE_STYLE[item.type] || 'bg-secondary text-navy'}`}
                                                >
                                                    {item.type}
                                                </span>
                                                <span className="min-w-0 flex-1">
                                                    <span className="block truncate text-sm font-bold text-navy">
                                                        {item.title}
                                                    </span>
                                                    <span className="block truncate text-xs text-muted-foreground">
                                                        {item.snippet}
                                                    </span>
                                                </span>
                                                <ArrowRight
                                                    className="h-4 w-4 shrink-0 text-muted-foreground transition-transform group-hover:translate-x-1 group-hover:text-navy"
                                                    aria-hidden="true"
                                                />
                                            </Link>
                                        </li>
                                    ))}
                                </ul>
                            </section>
                        ))}
                    </div>
                )}
            </main>

            <SiteFooter />
        </div>
    );
};

export default SearchPage;
