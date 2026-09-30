import pb from '@/lib/pocketbaseClient';

/** URL berkas dokumen: prioritas file unggahan PocketBase, lalu URL eksternal/contoh. */
export function getDocUrl(doc) {
    if (!doc) return '';
    if (doc.file) return pb.files.getURL(doc, doc.file);
    return doc.external_url || '';
}

/** Ukuran file terformat ramah. */
export function formatFileSize(bytes) {
    if (!bytes && bytes !== 0) return '';
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

/** Validasi unggahan PDF: tipe dan ukuran maksimal 10 MB. */
export function validatePdf(file) {
    if (!file) return 'Berkas belum dipilih.';
    const isPdf = file.type === 'application/pdf' || file.name.toLowerCase().endsWith('.pdf');
    if (!isPdf) return 'Hanya berkas PDF yang diperbolehkan.';
    if (file.size > 10 * 1024 * 1024) return 'Ukuran berkas maksimal 10 MB.';
    return null;
}
