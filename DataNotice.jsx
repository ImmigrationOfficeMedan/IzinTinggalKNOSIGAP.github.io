import React from 'react';
import { AlertTriangle } from 'lucide-react';
import { cn } from '@/lib/utils';

/**
 * Penanda bahwa seluruh konten masih berupa data contoh.
 */
const DataNotice = ({ className = '' }) => (
    <div
        role="note"
        className={cn(
            'flex items-start gap-2.5 rounded-xl border border-gold/40 bg-gold-soft px-4 py-3 text-[13px] leading-relaxed text-gold-deep',
            className,
        )}
    >
        <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0" aria-hidden="true" />
        <p>
            <span className="font-semibold">DATA CONTOH</span> — Harap diperbarui oleh petugas
            sebelum website digunakan secara resmi.
        </p>
    </div>
);

export default DataNotice;
