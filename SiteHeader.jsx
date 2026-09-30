import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Menu, Search, Stamp, UserRound } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger, SheetTitle } from '@/components/ui/sheet';
const NAV_ITEMS = [{
  label: 'Beranda',
  href: '/'
}, {
  label: 'Layanan',
  href: '/#layanan'
}, {
  label: 'Persyaratan',
  href: '/#persyaratan'
}, {
  label: 'Tata Cara',
  href: '/#tata-cara'
}, {
  label: 'Biaya',
  href: '/#biaya'
}, {
  label: 'FAQ',
  href: '/#faq'
}, {
  label: 'Kontak',
  href: '/#kontak'
}];
const LangToggle = () => {
  const [notice, setNotice] = useState(false);
  return <div className="relative flex items-center rounded-full border border-white/25 p-0.5 font-mono text-[11px] font-medium">
            <span className="rounded-full bg-gold px-2.5 py-1 text-navy-deep">ID</span>
            <button type="button" onClick={() => {
      setNotice(true);
      window.setTimeout(() => setNotice(false), 2600);
    }} className="rounded-full px-2.5 py-1 text-white/80 transition-colors hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold" aria-label="English version (segera hadir)">
                EN
            </button>
            {notice && <span className="absolute right-0 top-full z-50 mt-2 w-52 rounded-lg border border-border bg-popover px-3 py-2 font-sans text-xs text-popover-foreground shadow-lg">
                    Versi Bahasa Inggris sedang disiapkan.
                </span>}
        </div>;
};
const SiteHeader = () => {
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  return <header className="sticky top-0 z-50">
            {/* Strip status prototype */}
            <div className="bg-navy-deep text-white">
                <div className="mx-auto flex h-9 max-w-7xl items-center justify-between gap-4 px-4 sm:px-6">
                    <p className="truncate font-mono text-[10.5px] uppercase tracking-[0.18em] text-white/70">Portal</p>
                    <LangToggle />
                </div>
            </div>

            {/* Bar utama */}
            <div className="border-b border-border bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/85">
                <div className="mx-auto flex h-16 max-w-7xl items-center justify-between gap-3 px-4 sm:px-6">
                    <Link to="/" className="flex items-center gap-3 focus-ring rounded-lg" aria-label="SIGAP — Beranda">
                        <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-navy text-gold">
                            <Stamp className="h-5 w-5" strokeWidth={1.9} aria-hidden="true" />
                        </span>
                        <span className="leading-tight">
                            <span className="block text-lg font-extrabold tracking-tight text-navy">SIGAP</span>
                            <span className="block text-[10px] font-medium uppercase tracking-[0.14em] text-muted-foreground">
                                STAY PERMIT GUIDANCE AND ACESS PLATFORM
                            </span>
                        </span>
                    </Link>

                    <nav className="hidden items-center gap-1 lg:flex" aria-label="Navigasi utama">
                        {NAV_ITEMS.map(item => <Link key={item.label} to={item.href} className="rounded-lg px-3 py-2 text-sm font-medium text-foreground/80 transition-colors hover:bg-secondary hover:text-navy focus-ring">
                                {item.label}
                            </Link>)}
                    </nav>

                    <div className="flex items-center gap-2">
                        <Button variant="outline" size="icon" className="rounded-xl border-border" onClick={() => navigate('/pencarian')} aria-label="Buka pencarian">
                            <Search className="h-4 w-4" aria-hidden="true" />
                        </Button>
                        <Button className="hidden rounded-xl bg-navy font-semibold hover:bg-navy-light sm:inline-flex" onClick={() => navigate('/penjamin/login')}><UserRound className="mr-2 h-4 w-4" aria-hidden="true" />Login&nbsp;</Button>
                        <Sheet open={open} onOpenChange={setOpen}>
                            <SheetTrigger asChild>
                                <Button variant="outline" size="icon" className="rounded-xl lg:hidden" aria-label="Buka menu">
                                    <Menu className="h-5 w-5" aria-hidden="true" />
                                </Button>
                            </SheetTrigger>
                            <SheetContent side="right" className="w-80">
                                <SheetTitle className="text-left text-navy">Menu SIGAP</SheetTitle>
                                <nav className="mt-6 flex flex-col gap-1" aria-label="Navigasi seluler">
                                    {NAV_ITEMS.map(item => <Link key={item.label} to={item.href} onClick={() => setOpen(false)} className="rounded-lg px-3 py-3 text-sm font-medium text-foreground/85 transition-colors hover:bg-secondary">
                                            {item.label}
                                        </Link>)}
                                    <Button className="mt-4 rounded-xl bg-navy font-semibold hover:bg-navy-light" onClick={() => {
                  setOpen(false);
                  navigate('/penjamin/login');
                }}>
                                        <UserRound className="mr-2 h-4 w-4" aria-hidden="true" />
                                        Login Penjamin
                                    </Button>
                                </nav>
                            </SheetContent>
                        </Sheet>
                    </div>
                </div>
            </div>
        </header>;
};
export default SiteHeader;