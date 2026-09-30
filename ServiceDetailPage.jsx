import React, { useEffect, useState } from 'react';
import { Helmet } from 'react-helmet';
import { Link, useParams } from 'react-router-dom';
import {
    AlertTriangle,
    BadgeCheck,
    ChevronRight,
    Clock3,
    Download,
    Eye,
    FileText,
    Handshake,
    Layers,
    Wallet,
} from 'lucide-react';
import pb from '@/lib/pocketbaseClient';
import Reveal from '@/components/Reveal';
import SiteHeader from '@/components/site/SiteHeader';
import SiteFooter from '@/components/site/SiteFooter';
import DataNotice from '@/components/site/DataNotice';
import FaqAccordion from '@/components/site/FaqAccordion';
import PdfPreviewModal from '@/components/site/PdfPreviewModal';
import ServiceIcon from '@/components/site/ServiceIcon';
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

const ServiceDetailPage = () => {
    const { slug } = useParams();
    const [service, setService] = useState(null);
    const [procedures, setProcedures] = useState([]);
    const [requirements, setRequirements] = useState([]);
    const [documents, setDocuments] = useState([]);
    const [fees, setFees] = useState([]);
    const [times, setTimes] = useState([]);
    const [faqs, setFaqs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [preview, setPreview] = useState(null);

    useEffect(() => {
        let cancelled = false;
        const load = async () => {
            setLoading(true);
            setError('');
            try {
                const svc = await pb
                    .collection('services')
                    .getFirstListItem(`slug="${slug}"`);
                const filter = `service="${svc.id}"`;
                const [proc, req, doc, fee, time, faq] = await Promise.all([
                    pb.collection('procedures').getFullList({ filter, sort: 'step' }),
                    pb.collection('requirements').getFullList({ filter, sort: 'order' }),
                    pb.collection('documents').getFullList({ filter, sort: 'order' }),
                    pb.collection('fees').getFullList({ filter }),
                    pb.collection('processing_times').getFullList({ filter }),
                    pb.collection('faq').getFullList({ filter, sort: 'order' }),
                ]);
                if (cancelled) return;
                setService(svc);
                setProcedures(proc);
                setRequirements(req);
                setDocuments(doc.filter((d) => d.active));
                // Biaya "Perpanjangan ITAS" hanya tampil di ringkasan beranda,
                // tidak ditampilkan pada halaman detail ITAS.
                setFees(
                    fee.filter(
                        (f) => !(slug === 'itas' && f.label === 'Perpanjangan ITAS'),
                    ),
                );
                setTimes(time);
                setFaqs(faq);
            } catch (err) {
                if (!cancelled) {
                    setError(
                        err?.status === 404
                            ? 'Layanan tidak ditemukan. Periksa kembali tautan yang Anda buka.'
                            : 'Konten layanan belum dapat dimuat. Silakan coba lagi.',
                    );
                }
                console.error(err);
            } finally {
                if (!cancelled) setLoading(false);
            }
        };
        load();
        return () => {
            cancelled = true;
        };
    }, [slug]);

    const openPreview = (doc) =>
        setPreview({ title: doc.title, description: doc.description, url: getDocUrl(doc) });

    if (loading) {
        return (
            <div className="min-h-screen bg-background">
                <SiteHeader />
                <div className="mx-auto max-w-7xl px-4 py-24 sm:px-6" aria-busy="true">
                    <div className="h-8 w-56 animate-pulse rounded-lg bg-muted" />
                    <div className="mt-4 h-14 w-full max-w-xl animate-pulse rounded-lg bg-muted" />
                    <div className="mt-10 grid gap-4 sm:grid-cols-3 lg:grid-cols-5">
                        {Array.from({ length: 5 }).map((_, i) => (
                            <div key={i} className="h-28 animate-pulse rounded-2xl bg-muted" />
                        ))}
                    </div>
                </div>
                <SiteFooter />
            </div>
        );
    }

    if (error || !service) {
        return (
            <div className="min-h-screen bg-background">
                <SiteHeader />
                <div className="mx-auto max-w-2xl px-4 py-28 text-center sm:px-6">
                    <AlertTriangle className="mx-auto h-10 w-10 text-gold-deep" aria-hidden="true" />
                    <h1 className="mt-4 text-2xl font-extrabold text-navy">Layanan tidak tersedia</h1>
                    <p className="mt-2 text-sm text-muted-foreground">{error}</p>
                    <Button asChild className="mt-6 rounded-xl bg-navy font-semibold hover:bg-navy-light">
                        <Link to="/">Kembali ke Beranda</Link>
                    </Button>
                </div>
                <SiteFooter />
            </div>
        );
    }

    const infoCards = [
        {
            icon: FileText,
            label: service.summary_label || 'Jumlah Dokumen',
            value: service.summary_value || `${documents.length} berkas`,
            multiline: !!service.summary_value,
        },
        { icon: Wallet, label: 'Biaya (contoh)', value: fees[0]?.amount || 'Rp XXX.XXX' },
        { icon: Clock3, label: 'Estimasi (contoh)', value: times[0]?.estimate || 'X Hari Kerja' },
        { icon: Layers, label: 'Jenis Layanan', value: service.service_type || '—' },
        {
            icon: Handshake,
            label: 'Penjamin',
            value: service.guarantor_required ? 'Diperlukan' : 'Tidak wajib',
        },
    ];

    return (
        <div className="min-h-screen bg-background">
            <Helmet>
                <title>{service.title} — SIGAP</title>
                <meta name="description" content={`${service.tagline} Tata cara, persyaratan, dokumen, biaya, dan estimasi waktu (data contoh).`} />
            </Helmet>
            <SiteHeader />

            {/* HERO layanan */}
            <section className="bg-navy-deep text-white">
                <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6">
                    <nav aria-label="Breadcrumb" className="flex items-center gap-1.5 font-mono text-[11px] uppercase tracking-[0.16em] text-white/60">
                        <Link to="/" className="transition-colors hover:text-gold">Beranda</Link>
                        <ChevronRight className="h-3 w-3" aria-hidden="true" />
                        <Link to="/#layanan" className="transition-colors hover:text-gold">Layanan</Link>
                        <ChevronRight className="h-3 w-3" aria-hidden="true" />
                        <span className="text-gold">{service.short_title || service.code}</span>
                    </nav>
                    <div className="mt-8 flex flex-col gap-6 sm:flex-row sm:items-start">
                        <span className="flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl bg-white/10 text-gold">
                            <ServiceIcon name={service.icon} className="h-8 w-8" />
                        </span>
                        <div>
                            <p className="font-mono text-[11px] font-medium uppercase tracking-[0.22em] text-gold">
                                {service.code} · {service.service_type}
                            </p>
                            <h1 className="mt-2 text-2xl font-extrabold tracking-tight sm:text-4xl">
                                {service.title}
                            </h1>
                            <p className="mt-3 max-w-2xl text-sm leading-relaxed text-white/75 sm:text-base">
                                {service.tagline}
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            <div className="mx-auto max-w-7xl px-4 sm:px-6">
                <DataNotice className="relative z-10 -mt-6 shadow-lg" />

                {/* Kartu informasi ringkas */}
                <div className="mt-8 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
                    {infoCards.map((c) => (
                        <div key={c.label} className="card-soft p-4">
                            <c.icon className="h-5 w-5 text-gold-deep" strokeWidth={1.8} aria-hidden="true" />
                            <p className="mt-3 font-mono text-[10px] uppercase tracking-[0.16em] text-muted-foreground">
                                {c.label}
                            </p>
                            <p className={`mt-1 text-sm font-bold text-navy ${c.multiline ? 'whitespace-pre-line leading-snug' : ''}`}>
                                {c.value}
                            </p>
                        </div>
                    ))}
                </div>

                {/* Deskripsi */}
                <SectionBlock id="deskripsi" eyebrow="Deskripsi" title="Tentang layanan ini">
                    <p className="max-w-3xl text-[15px] leading-relaxed text-foreground/85">
                        {service.description}
                    </p>
                </SectionBlock>

                {/* Tata cara */}
                <SectionBlock id="tata-cara" eyebrow="Tata Cara" title="Alur permohonan">
                    <ol className="relative space-y-0 border-l-2 border-border pl-0">
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
                <SectionBlock id="persyaratan" eyebrow="Persyaratan" title="Checklist kelengkapan">
                    <ul className="grid gap-3 md:grid-cols-2">
                        {requirements.map((r) => (
                            <li key={r.id} className="card-soft flex items-start gap-4 p-5">
                                <BadgeCheck className="mt-0.5 h-5 w-5 shrink-0 text-gold-deep" aria-hidden="true" />
                                <div className="min-w-0">
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
                <SectionBlock id="dokumen" eyebrow="Pusat Dokumen" title="Formulir & dokumen PDF">
                    {documents.length === 0 ? (
                        <p className="rounded-xl border border-dashed border-border px-4 py-8 text-center text-sm text-muted-foreground">
                            Belum ada dokumen yang diunggah untuk layanan ini.
                        </p>
                    ) : (
                        <ul className="grid gap-3 md:grid-cols-2">
                            {documents.map((d) => (
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
                                            onClick={() => openPreview(d)}
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
                    )}
                </SectionBlock>

                {/* Biaya & estimasi */}
                <SectionBlock id="biaya" eyebrow="Biaya & Waktu" title="Biaya dan estimasi penyelesaian">
                    <div className="grid gap-6 lg:grid-cols-2">
                        <div className="card-soft overflow-hidden">
                            <div className="border-b border-border bg-navy px-5 py-3">
                                <h3 className="text-sm font-bold text-white">Biaya (contoh)</h3>
                            </div>
                            <ul className="divide-y divide-border">
                                {fees.map((f) => (
                                    <li key={f.id} className="px-5 py-3.5">
                                        <div className="flex items-center justify-between gap-4">
                                            <p className="text-sm font-semibold text-navy">{f.label}</p>
                                            <span className="font-mono text-sm font-semibold text-gold-deep">
                                                {f.amount || 'Rp XXX.XXX'}
                                            </span>
                                        </div>
                                        {f.note && <p className="mt-1 text-xs text-muted-foreground">{f.note}</p>}
                                    </li>
                                ))}
                                {fees.length === 0 && (
                                    <li className="px-5 py-6 text-center text-sm text-muted-foreground">
                                        Data biaya belum tersedia.
                                    </li>
                                )}
                            </ul>
                        </div>
                        <div className="card-soft overflow-hidden">
                            <div className="border-b border-border bg-navy px-5 py-3">
                                <h3 className="text-sm font-bold text-white">Estimasi waktu (contoh)</h3>
                            </div>
                            <ul className="divide-y divide-border">
                                {times.map((t) => (
                                    <li key={t.id} className="px-5 py-3.5">
                                        <div className="flex items-center justify-between gap-4">
                                            <p className="text-sm font-semibold text-navy">{t.label}</p>
                                            <span className="font-mono text-sm font-semibold text-gold-deep">
                                                {t.estimate || 'X Hari Kerja'}
                                            </span>
                                        </div>
                                        {t.note && <p className="mt-1 text-xs text-muted-foreground">{t.note}</p>}
                                    </li>
                                ))}
                                {times.length === 0 && (
                                    <li className="px-5 py-6 text-center text-sm text-muted-foreground">
                                        Data estimasi belum tersedia.
                                    </li>
                                )}
                            </ul>
                        </div>
                    </div>
                </SectionBlock>

                {/* Catatan penting */}
                <SectionBlock id="catatan" eyebrow="Catatan Penting" title="Hal yang perlu diperhatikan">
                    <ul className="space-y-3">
                        {[
                            'Seluruh biaya, estimasi waktu, dan persyaratan pada halaman ini adalah data contoh dan akan diperbarui sesuai peraturan yang berlaku.',
                            'Pastikan seluruh dokumen asli dan masih berlaku saat diserahkan kepada petugas.',
                            'Kelengkapan berkas yang tidak memenuhi ketentuan dapat memperlambat proses permohonan.',
                        ].map((note) => (
                            <li
                                key={note}
                                className="flex items-start gap-3 rounded-xl border border-gold/30 bg-gold-soft/60 px-4 py-3 text-sm leading-relaxed text-foreground/85"
                            >
                                <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0 text-gold-deep" aria-hidden="true" />
                                {note}
                            </li>
                        ))}
                    </ul>
                </SectionBlock>

                {/* Info penjamin */}
                {service.guarantor_required && (
                    <SectionBlock id="info-penjamin" eyebrow="Penjamin" title="Layanan ini memerlukan penjamin">
                        <div className="card-soft flex flex-col items-start gap-5 p-6 sm:flex-row sm:items-center">
                            <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-navy text-gold">
                                <Handshake className="h-6 w-6" strokeWidth={1.8} aria-hidden="true" />
                            </span>
                            <div className="flex-1">
                                <p className="text-sm leading-relaxed text-foreground/85">
                                    Permohonan {service.short_title || service.code} membutuhkan penjamin yang
                                    terdaftar. Pelajari peran, kewajiban, dan tata cara registrasi penjamin
                                    sebelum mengajukan permohonan.
                                </p>
                            </div>
                            <Button asChild className="rounded-xl bg-navy font-semibold hover:bg-navy-light">
                                <Link to="/penjamin">Informasi Penjamin</Link>
                            </Button>
                        </div>
                    </SectionBlock>
                )}

                {/* FAQ */}
                <SectionBlock id="faq" eyebrow="FAQ" title="Pertanyaan seputar layanan ini">
                    <div className="card-soft px-5 py-2 sm:px-7">
                        <FaqAccordion items={faqs} />
                    </div>
                </SectionBlock>

                {/* Kontak CTA */}
                <section className="pb-16">
                    <div className="overflow-hidden rounded-2xl bg-navy-deep px-6 py-10 text-center text-white sm:px-10">
                        <h2 className="text-xl font-extrabold tracking-tight sm:text-2xl">
                            Masih ada pertanyaan tentang {service.short_title || service.code}?
                        </h2>
                        <p className="mx-auto mt-2 max-w-xl text-sm text-white/70">
                            Hubungi kanal layanan pada bagian kontak, atau gunakan pencarian untuk menemukan
                            informasi lain.
                        </p>
                        <div className="mt-6 flex flex-wrap justify-center gap-3">
                            <Button asChild className="rounded-xl bg-gold font-bold text-navy-deep hover:bg-gold/90">
                                <Link to="/#kontak">Hubungi Kami</Link>
                            </Button>
                            <Button
                                asChild
                                variant="outline"
                                className="rounded-xl border-white/30 bg-transparent font-semibold text-white hover:bg-white/10 hover:text-white"
                            >
                                <Link to="/pencarian">Cari Informasi</Link>
                            </Button>
                        </div>
                    </div>
                </section>
            </div>

            <PdfPreviewModal doc={preview} open={!!preview} onOpenChange={() => setPreview(null)} />
            <SiteFooter />
        </div>
    );
};

export default ServiceDetailPage;
