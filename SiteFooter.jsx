import React from 'react';
import { Link } from 'react-router-dom';
import { Mail, MapPin, Phone, Stamp } from 'lucide-react';
const SERVICE_LINKS = [['ITK — Izin Tinggal Kunjungan', '/layanan/itk'], ['ITAS — Izin Tinggal Terbatas', '/layanan/itas'], ['ITAP — Izin Tinggal Tetap', '/layanan/itap'], ['Bridging Visa', '/layanan/bridging-visa'], ['Alih Status Izin Tinggal', '/layanan/alih-status-izin-tinggal'], ['Perubahan Data', '/layanan/perubahan-data'], ['Anak Berkewarganegaraan Ganda', '/layanan/anak-berkewarganegaraan-ganda'], ['Penjamin', '/layanan/penjamin']];
const SiteFooter = () => <footer className="bg-navy-deep text-white">
        <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6">
            <div className="grid gap-10 md:grid-cols-2 lg:grid-cols-4">
                <div>
                    <div className="flex items-center gap-3">
                        <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/10 text-gold">
                            <Stamp className="h-5 w-5" strokeWidth={1.9} aria-hidden="true" />
                        </span>
                        <div className="leading-tight">
                            <p className="text-lg font-extrabold tracking-tight">SIGAP</p>
                            <p className="text-[10px] font-medium uppercase tracking-[0.14em] text-white/60">
                                Digital Immigration Service Center
                            </p>
                        </div>
                    </div>
                    <p className="mt-4 text-sm leading-relaxed text-white/70">
                        Portal informasi dan pelayanan izin tinggal keimigrasian bagi Orang Asing.
                        Prototype dengan data contoh.
                    </p>
                </div>

                <nav aria-label="Layanan">
                    <h3 className="font-mono text-[11px] font-medium uppercase tracking-[0.2em] text-gold">
                        Layanan
                    </h3>
                    <ul className="mt-4 space-y-2 text-sm text-white/75">
                        {SERVICE_LINKS.map(([label, href]) => <li key={href}>
                                <Link to={href} className="transition-colors hover:text-gold">
                                    {label}
                                </Link>
                            </li>)}
                    </ul>
                </nav>

                <nav aria-label="Bantuan">
                    <h3 className="font-mono text-[11px] font-medium uppercase tracking-[0.2em] text-gold">
                        Bantuan
                    </h3>
                    <ul className="mt-4 space-y-2 text-sm text-white/75">
                        <li><Link to="/#faq" className="transition-colors hover:text-gold">Pertanyaan Umum (FAQ)</Link></li>
                        <li><Link to="/penjamin" className="transition-colors hover:text-gold">Informasi Penjamin</Link></li>
                        <li><Link to="/pencarian" className="transition-colors hover:text-gold">Pencarian Layanan</Link></li>
                        <li><Link to="/penjamin/login" className="transition-colors hover:text-gold">Login Penjamin</Link></li>
                    </ul>
                </nav>

                <div>
                    <h3 className="font-mono text-[11px] font-medium uppercase tracking-[0.2em] text-gold">
                        Kontak
                    </h3>
                    <ul className="mt-4 space-y-3 text-sm text-white/75">
                        <li className="flex items-start gap-2.5">
                            <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-gold" aria-hidden="true" />
                            <span>Jl. Gatot Subroto KM. 6,2 No. 268A, Medan Helvetia, Kota Medan</span>
                        </li>
                        <li className="flex items-start gap-2.5">
                            <Phone className="mt-0.5 h-4 w-4 shrink-0 text-gold" aria-hidden="true" />
                            <span>+6285260865586</span>
                        </li>
                        <li className="flex items-start gap-2.5">
                            <Mail className="mt-0.5 h-4 w-4 shrink-0 text-gold" aria-hidden="true" />
                            <span>Kanim.Medan@imigrasi.go.id</span>
                        </li>
                    </ul>
                </div>
            </div>

            <div className="mt-12 border-t border-white/15 pt-6">
                <p className="text-xs leading-relaxed text-white/60">
                    Disclaimer: Seluruh informasi pada portal ini merupakan data contoh untuk keperluan
                    prototype dan dapat diperbarui sesuai peraturan perundang-undangan yang berlaku.
                    Bukan merupakan nasihat hukum.
                </p>
                <p className="mt-3 text-xs text-white/50">
                    © {new Date().getFullYear()} SIGAP — Digital Immigration Service Center. Prototype.
                </p>
            </div>
        </div>
    </footer>;
export default SiteFooter;