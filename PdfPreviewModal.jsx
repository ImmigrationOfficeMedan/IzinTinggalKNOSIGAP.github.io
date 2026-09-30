import React from 'react';
import { Download, FileText } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';

/**
 * Modal pratinjau PDF. `doc` = { title, description, url }.
 */
const PdfPreviewModal = ({ doc, open, onOpenChange }) => (
    <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="max-w-3xl">
            <DialogHeader>
                <DialogTitle className="flex items-center gap-2 text-navy">
                    <FileText className="h-5 w-5 text-gold-deep" aria-hidden="true" />
                    {doc?.title || 'Pratinjau Dokumen'}
                </DialogTitle>
                {doc?.description && <DialogDescription>{doc.description}</DialogDescription>}
            </DialogHeader>
            {doc?.url ? (
                <div className="overflow-hidden rounded-xl border border-border bg-muted">
                    <iframe
                        src={doc.url}
                        title={`Pratinjau ${doc.title || 'dokumen'}`}
                        className="h-[60vh] w-full"
                    />
                </div>
            ) : (
                <p className="rounded-xl border border-dashed border-border px-4 py-10 text-center text-sm text-muted-foreground">
                    Berkas belum diunggah. Silakan hubungi petugas.
                </p>
            )}
            {doc?.url && (
                <div className="flex justify-end">
                    <Button asChild className="rounded-xl bg-navy font-semibold hover:bg-navy-light">
                        <a href={doc.url} download target="_blank" rel="noreferrer">
                            <Download className="mr-2 h-4 w-4" aria-hidden="true" />
                            Unduh PDF
                        </a>
                    </Button>
                </div>
            )}
        </DialogContent>
    </Dialog>
);

export default PdfPreviewModal;
