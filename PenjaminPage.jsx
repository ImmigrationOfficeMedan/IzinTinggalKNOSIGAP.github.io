import React, { useEffect, useState } from 'react';
import { Helmet } from 'react-helmet';
import { Link } from 'react-router-dom';
import {
    AlertTriangle,
    BadgeCheck,
    BookMarked,
    CheckCircle2,
    Download,
    Eye,
    FileText,
    Handshake,
    Scale,
    UserRound,
    XCircle,
} from 'lucide-react';
import pb from '@/lib/pocketbaseClient';
import Reveal from '@/components/Reveal';
import SiteHeader from '@/components/site/SiteHeader';
import SiteFooter from '@/components/site/SiteFooter';
import DataNotice from '@/components/site/DataNotice';
import FaqAccordion from '@/components/site/FaqAccordion';
import PdfPreviewModal from '@/components/site/PdfPreviewModal';
import { Button } from '@/components/ui/button';
import { getDocUrl } from '@/lib/docs';

const SectionBlock = ({ id, eyebrow, title, children }) => (
    <section id={id} className="scroll-mt-28 py-12">
        <Reveal>
            <div className="mb-8">
                <div className="flex items-center gap-4">
                    <span className="eyebrow">{eyebrow}</span>
                    <span className="rule-line" aria-hidden="true" />
                </div>
                <h2 className="mt-3 text-xl font-extrabold tracking-tight text-navy sm:text-2xl">{title}</h2>
            </div>
        </Reveal>
        {children}
    </section>
);

const PenjaminPage = () => {
    const [procedures, setProcedures] = useState([]);
    const [obligations, setObligations] = useState([]);
    const [faqs, setFaqs] = useState([]);
    const [docs, setDocs] = useState([]);
    const [regs, setRegs] = useState([]);
    const [requirements, setRequirements] = useState([]);
    const [error, setError] = useState('');
    const [preview, setPreview] = useState(null);

    useEffect(() => {
        let cancelled = false;
        const load = async () => {
            try {
                const [proc, obl, faq, doc, reg, penjaminSvc] = await Promise.all([
                    pb.collection('guarantor_procedures').getFullList({ sort: 'step' }),
                    pb.collection('guarantor_obligations').getFullList({ sort: 'order' }),
                    pb.collection('guarantor_faq').getFullList({ sort: 'order' }),
                    pb.collection('guarantor_documents').getFullList({ sort: 'order' }),
                    pb.collection('regulations').getFullList({ sort: 'order' }),
                    pb.collection('services').getFirstListItem('slug="penjamin"'),
                ]);
                let req = [];
                try {
                    req = await pb
                        .collection('requirements')
                        .getFullList({ filter: `service="${penjaminSvc.id}"`, sort: 'order' });
                } catch (_) {
                    req = [];
                }
                if (cancelled) return;
                setProcedures(proc);
                setObligations(obl);
                setFaqs(faq);
                setDocs(doc.filter((d) => d.active));
                setRegs(reg);
                setRequirements(req);
            } catch (err) {
                if (!cancelled) setError('Konten penjamin belum dapat dimuat. Silakan coba lagi.');
                console.error(err);
            }
        };
        load();
        return () => {
            cancelled = true;
        };
    }, []);

    const kewajiban = obligations.filter((o) => o.kind === 'kewajiban');
    const dos = obligations.filter((o) => o.kind === 'do');
    const donts = obligations.filter((o) => o.kind === 'dont');

    return (
        <div className="min-h-screen bg-background">
            <Helmet>
                <title>Penjamin — SIGAP</title>
                <meta
                    name="description"
                    content="Peran penjamin bagi Orang Asing: tata cara pembuatan akun, persyaratan, dokumen, kewajiban, serta dasar ketentuan. (Prototype — data contoh)"
                />
            </Helmet>
            <SiteHeader />

            {/* HERO */}
            <section className="bg-navy-deep text-white">
                <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6">
                    <p className="font-mono text-[11px] font-medium uppercase tracking-[0.22em] text-gold">
                        Penjamin / Guarantor
                    </p>
                    <h1 className="mt-3 max-w-3xl text-3xl font-extrabold tracking-tight sm:text-4xl">
                        Penjamin bagi Orang Asing
                    </h1>
                    <p className="mt-4 max-w-2xl text-sm leading-relaxed text-white/75 sm:text-base">
                        Penjamin adalah perorangan, perusahaan, atau organisasi yang bertanggung jawab atas
                        keberadaan dan kegiatan Orang Asing selama berada di wilayah Indonesia. Pelajari
                        peran, tata cara registrasi akun, dan kewajibannya di halaman ini.
                    </p>
                    <div className="mt-8 flex flex-wrap gap-3">
                        <Button asChild className="rounded-xl bg-gold font-bold text-navy-deep hover:bg-gold/90">
                            <Link to="/penjamin/login">
                                <UserRound className="mr-2 h-4 w-4" aria-hidden="true" />
                                Login Penjamin
                            </Link>
                        </Button>
                        <Button
                            asChild
                            variant="outline"
                            className="rounded-xl border-white/30 bg-transparent font-semibold text-white hover:bg-white/10 hover:text-white"
                        >
                            <Link to="/layanan/penjamin">Lihat Layanan Penjamin</Link>
                        </Button>
                    </div>
                </div>
            </section>

            <div className="mx-auto max-w-7xl px-4 sm:px-6">
                <DataNotice className="relative z-10 -mt-6 shadow-lg" />
                {error && (
                    <p className="mt-6 rounded-xl border border-destructive/30 bg-destructive/5 px-4 py-3 text-sm text-destructive">
                        {error}
                    </p>
                )}

                {/* Tata cara akun */}
                <SectionBlock id="tata-cara" eyebrow="Tata Cara" title="Pembuatan akun penjamin">
                    <ol className="relative border-l-2 border-border">
                        {procedures.map((p, i) => (
                            <Reveal key={p.id} delay={Math.min(i * 0.05, 0.25)}>
                                <li className="relative flex gap-5 pb-8 pl-8 last:pb-0">
                                    <span className="absolute -left-[17px] flex h-8 w-8 items-center justify-center rounded-full border-2 border-gold bg-white font-mono text-xs font-bold text-navy">
                                        {p.step || i + 1}
                                    </span>
                                    <div className="card-soft flex-1 p-5">
                                        <h3 className="text-[15px] font-bold text-navy">{p.title}</h3>
                                        <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground">
                                            {p.description}
                                        </p>
                                    </div>
                                </li>
                            </Reveal>
                        ))}
                    </ol>
                </SectionBlock>

                {/* Persyaratan */}
                <SectionBlock id="persyaratan" eyebrow="Persyaratan" title="Persyaratan registrasi penjamin">
                    <ul className="grid gap-3 md:grid-cols-2">
                        {requirements.map((r) => (
                            <li key={r.id} className="card-soft flex items-start gap-4 p-5">
                                <BadgeCheck className="mt-0.5 h-5 w-5 shrink-0 text-gold-deep" aria-hidden="true" />
                                <div>
                                    <div className="flex flex-wrap items-center gap-2">
                                        <h3 className="text-sm font-bold text-navy">{r.label}</h3>
                                        <span
                                            className={
                                                r.kind === 'wajib'
                                                    ? 'rounded-full bg-navy px-2.5 py-0.5 font-mono text-[10px] font-semibold uppercase tracking-wider text-white'
                                                    : 'rounded-full bg-gold-soft px-2.5 py-0.5 font-mono text-[10px] font-semibold uppercase tracking-wider text-gold-deep'
                                            }
                                        >
                                            {r.kind === 'wajib' ? 'Wajib' : 'Tambahan'}
                                        </span>
                                    </div>
                                    <p className="mt-1 text-[13px] leading-relaxed text-muted-foreground">
                                        {r.description}
                                    </p>
                                </div>
                            </li>
                        ))}
                    </ul>
                </SectionBlock>

                {/* Dokumen */}
                <SectionBlock id="dokumen" eyebrow="Dokumen" title="Dokumen & formulir penjamin">
                    <ul className="grid gap-3 md:grid-cols-2">
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
                </SectionBlock>

                {/* Kewajiban */}
                <SectionBlock id="kewajiban" eyebrow="Kewajiban" title="Kewajiban penjamin">
                    <ul className="grid gap-3 md:grid-cols-2">
                        {kewajiban.map((o) => (
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
                </SectionBlock>

                {/* Do & Don't */}
                <SectionBlock id="do-dont" eyebrow="Panduan" title="Do & Don't untuk penjamin">
                    <div className="grid gap-6 lg:grid-cols-2">
                        <div className="card-soft overflow-hidden">
                            <div className="border-b border-border bg-navy px-5 py-3">
                                <h3 className="text-sm font-bold text-white">Yang sebaiknya dilakukan</h3>
                            </div>
                            <ul className="divide-y divide-border">
                                {dos.map((o) => (
                                    <li key={o.id} className="flex items-start gap-3 px-5 py-3.5">
                                        <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-emerald-600" aria-hidden="true" />
                                        <div>
                                            <p className="text-sm font-semibold text-navy">{o.title}</p>
                                            <p className="mt-0.5 text-xs leading-relaxed text-muted-foreground">
                                                {o.description}
                                            </p>
                                        </div>
                                    </li>
                                ))}
                            </ul>
                        </div>
                        <div className="card-soft overflow-hidden">
                            <div className="border-b border-border bg-destructive px-5 py-3">
                                <h3 className="text-sm font-bold text-white">Yang harus dihindari</h3>
                            </div>
                            <ul className="divide-y divide-border">
                                {donts.map((o) => (
                                    <li key={o.id} className="flex items-start gap-3 px-5 py-3.5">
                                        <XCircle className="mt-0.5 h-4 w-4 shrink-0 text-destructive" aria-hidden="true" />
                                        <div>
                                            <p className="text-sm font-semibold text-navy">{o.title}</p>
                                            <p className="mt-0.5 text-xs leading-relaxed text-muted-foreground">
                                                {o.description}
                                            </p>
                                        </div>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>
                </SectionBlock>

                {/* Dasar ketentuan */}
                <SectionBlock id="ketentuan" eyebrow="Dasar Ketentuan" title="Referensi peraturan">
                    <ul className="space-y-3">
                        {regs.map((r) => (
                            <li key={r.id} className="card-soft flex items-start gap-4 p-5">
                                <BookMarked className="mt-0.5 h-5 w-5 shrink-0 text-gold-deep" aria-hidden="true" />
                                <div>
                                    <h3 className="text-sm font-bold text-navy">{r.title}</h3>
                                    <p className="mt-0.5 font-mono text-xs text-gold-deep">{r.reference}</p>
                                    <p className="mt-1 text-[13px] leading-relaxed text-muted-foreground">
                                        {r.description}
                                    </p>
                                </div>
                            </li>
                        ))}
                    </ul>
                    <p className="mt-4 flex items-start gap-2 text-xs text-muted-foreground">
                        <AlertTriangle className="mt-0.5 h-3.5 w-3.5 shrink-0 text-gold-deep" aria-hidden="true" />
                        Nomor dan judul peraturan masih berupa placeholder dan akan diperbarui oleh petugas.
                    </p>
                </SectionBlock>

                {/* FAQ */}
                <SectionBlock id="faq" eyebrow="FAQ" title="Pertanyaan seputar penjamin">
                    <div className="card-soft px-5 py-2 sm:px-7">
                        <FaqAccordion items={faqs} />
                    </div>
                </SectionBlock>

                {/* CTA */}
                <section className="pb-16">
                    <div className="overflow-hidden rounded-2xl bg-navy-deep px-6 py-10 text-center text-white sm:px-10">
                        <Handshake className="mx-auto h-9 w-9 text-gold" aria-hidden="true" />
                        <h2 className="mt-4 text-xl font-extrabold tracking-tight sm:text-2xl">
                            Sudah memiliki akun penjamin?
                        </h2>
                        <p className="mx-auto mt-2 max-w-xl text-sm text-white/70">
                            Masuk ke dashboard penjamin untuk memantau status akun, dokumen, dan Orang Asing
                            yang Anda jamin (prototype — data contoh).
                        </p>
                        <Button asChild className="mt-6 rounded-xl bg-gold font-bold text-navy-deep hover:bg-gold/90">
                            <Link to="/penjamin/login">
                                <UserRound className="mr-2 h-4 w-4" aria-hidden="true" />
                                Login Penjamin
                            </Link>
                        </Button>
                    </div>
                </section>
            </div>

            <PdfPreviewModal doc={preview} open={!!preview} onOpenChange={() => setPreview(null)} />
            <SiteFooter />
        </div>
    );
};

export default PenjaminPage;
