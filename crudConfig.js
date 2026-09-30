import {
    Baby,
    BookMarked,
    Clock3,
    FileText,
    Handshake,
    HelpCircle,
    Layers,
    ListChecks,
    ListOrdered,
    ScrollText,
    Settings,
    ShieldCheck,
    UserCog,
    Wallet,
    LayoutDashboard,
} from 'lucide-react';

const ICON_OPTIONS = [
    'Plane',
    'Briefcase',
    'Home',
    'RefreshCw',
    'ArrowLeftRight',
    'FileEdit',
    'Baby',
    'Handshake',
    'FileText',
].map((v) => ({ value: v, label: v }));

const serviceColumn = {
    key: 'service',
    label: 'Layanan',
    render: (item, ctx) => ctx.servicesById?.[item.service]?.code || '—',
};

const activeColumn = {
    key: 'active',
    label: 'Status',
    render: (item) => (item.active ? 'Aktif' : 'Nonaktif'),
};

const withPasswordConfirm = (payload) => {
    const next = { ...payload };
    if (next.password) {
        next.passwordConfirm = next.password;
    } else {
        delete next.password;
        delete next.passwordConfirm;
    }
    return next;
};

export const CRUD_CONFIGS = {
    services: {
        collection: 'services',
        label: 'Layanan',
        singular: 'layanan',
        sort: 'order',
        titleOf: (r) => r.title,
        fields: [
            { name: 'title', label: 'Judul layanan', type: 'text', required: true },
            { name: 'slug', label: 'Slug URL', type: 'text', required: true, help: 'Huruf kecil, tanda hubung. Contoh: itas' },
            { name: 'code', label: 'Kode', type: 'text', required: true, help: 'Contoh: ITAS' },
            { name: 'short_title', label: 'Judul singkat', type: 'text' },
            { name: 'tagline', label: 'Tagline', type: 'text' },
            { name: 'description', label: 'Deskripsi', type: 'textarea' },
            { name: 'icon', label: 'Ikon', type: 'select', options: ICON_OPTIONS },
            { name: 'service_type', label: 'Jenis layanan', type: 'text', help: 'Contoh: Kunjungan, Terbatas, Tetap' },
            { name: 'guarantor_required', label: 'Memerlukan penjamin', type: 'bool' },
            { name: 'active', label: 'Aktif (tampil di portal)', type: 'bool' },
            { name: 'order', label: 'Urutan', type: 'number' },
        ],
        columns: [
            { key: 'order', label: '#' },
            { key: 'code', label: 'Kode' },
            { key: 'title', label: 'Judul' },
            { key: 'service_type', label: 'Jenis' },
            activeColumn,
        ],
    },
    procedures: {
        collection: 'procedures',
        label: 'Tata Cara',
        singular: 'langkah tata cara',
        sort: 'step',
        titleOf: (r) => r.title,
        fields: [
            { name: 'service', label: 'Layanan', type: 'relation', required: true },
            { name: 'step', label: 'Langkah ke-', type: 'number', required: true },
            { name: 'title', label: 'Judul langkah', type: 'text', required: true },
            { name: 'description', label: 'Deskripsi', type: 'textarea' },
        ],
        columns: [serviceColumn, { key: 'step', label: 'Langkah' }, { key: 'title', label: 'Judul' }],
    },
    requirements: {
        collection: 'requirements',
        label: 'Persyaratan',
        singular: 'persyaratan',
        sort: 'order',
        titleOf: (r) => r.label,
        fields: [
            { name: 'service', label: 'Layanan', type: 'relation', required: true },
            { name: 'label', label: 'Nama persyaratan', type: 'text', required: true },
            { name: 'description', label: 'Deskripsi', type: 'textarea' },
            {
                name: 'kind',
                label: 'Jenis',
                type: 'select',
                required: true,
                options: [
                    { value: 'wajib', label: 'WAJIB' },
                    { value: 'tambahan', label: 'TAMBAHAN' },
                ],
            },
            { name: 'order', label: 'Urutan', type: 'number' },
        ],
        columns: [
            serviceColumn,
            { key: 'label', label: 'Persyaratan' },
            {
                key: 'kind',
                label: 'Jenis',
                render: (item) => (item.kind === 'wajib' ? 'WAJIB' : 'TAMBAHAN'),
            },
        ],
    },
    documents: {
        collection: 'documents',
        label: 'Dokumen PDF',
        singular: 'dokumen',
        sort: 'order',
        hasFile: true,
        titleOf: (r) => r.title,
        fields: [
            { name: 'service', label: 'Layanan', type: 'relation' },
            { name: 'title', label: 'Judul dokumen', type: 'text', required: true },
            { name: 'description', label: 'Deskripsi', type: 'textarea' },
            { name: 'file', label: 'Berkas PDF (maks. 10 MB)', type: 'file' },
            { name: 'external_url', label: 'URL contoh (bila belum ada berkas)', type: 'text' },
            { name: 'active', label: 'Aktif (tampil di portal)', type: 'bool' },
            { name: 'order', label: 'Urutan', type: 'number' },
        ],
        columns: [
            serviceColumn,
            { key: 'title', label: 'Judul' },
            {
                key: 'file',
                label: 'Berkas',
                render: (item) => (item.file ? 'PDF terunggah' : item.external_url ? 'URL contoh' : 'Kosong'),
            },
            { key: 'downloads', label: 'Unduhan' },
            activeColumn,
        ],
    },
    fees: {
        collection: 'fees',
        label: 'Biaya',
        singular: 'biaya',
        sort: '-created',
        titleOf: (r) => r.label,
        fields: [
            { name: 'service', label: 'Layanan', type: 'relation', required: true },
            { name: 'label', label: 'Komponen biaya', type: 'text', required: true },
            { name: 'amount', label: 'Nominal', type: 'text', help: 'Placeholder: Rp XXX.XXX' },
            { name: 'note', label: 'Catatan', type: 'textarea' },
        ],
        columns: [serviceColumn, { key: 'label', label: 'Komponen' }, { key: 'amount', label: 'Nominal' }],
    },
    processing_times: {
        collection: 'processing_times',
        label: 'Lama Proses',
        singular: 'estimasi proses',
        sort: '-created',
        titleOf: (r) => r.label,
        fields: [
            { name: 'service', label: 'Layanan', type: 'relation', required: true },
            { name: 'label', label: 'Proses', type: 'text', required: true },
            { name: 'estimate', label: 'Estimasi', type: 'text', help: 'Placeholder: X Hari Kerja' },
            { name: 'note', label: 'Catatan', type: 'textarea' },
        ],
        columns: [serviceColumn, { key: 'label', label: 'Proses' }, { key: 'estimate', label: 'Estimasi' }],
    },
    faq: {
        collection: 'faq',
        label: 'FAQ',
        singular: 'pertanyaan',
        sort: 'order',
        titleOf: (r) => r.question,
        fields: [
            { name: 'service', label: 'Layanan (kosongkan untuk FAQ umum)', type: 'relation' },
            { name: 'question', label: 'Pertanyaan', type: 'text', required: true },
            { name: 'answer', label: 'Jawaban', type: 'textarea', required: true },
            { name: 'order', label: 'Urutan', type: 'number' },
        ],
        columns: [serviceColumn, { key: 'question', label: 'Pertanyaan' }],
    },
    guarantors: {
        collection: 'guarantors',
        label: 'Penjamin',
        singular: 'akun penjamin',
        sort: '-created',
        titleOf: (r) => r.name,
        beforeSave: withPasswordConfirm,
        fields: [
            { name: 'name', label: 'Nama penjamin', type: 'text', required: true },
            { name: 'email', label: 'Email', type: 'text', required: true },
            { name: 'company', label: 'Perusahaan / organisasi', type: 'text' },
            { name: 'phone', label: 'Telepon', type: 'text' },
            {
                name: 'status',
                label: 'Status akun',
                type: 'select',
                required: true,
                options: [
                    { value: 'aktif', label: 'Aktif' },
                    { value: 'pending', label: 'Pending' },
                    { value: 'nonaktif', label: 'Nonaktif' },
                ],
            },
            { name: 'password', label: 'Kata sandi (wajib saat membuat akun)', type: 'password' },
        ],
        columns: [
            { key: 'name', label: 'Nama' },
            { key: 'email', label: 'Email' },
            { key: 'company', label: 'Perusahaan' },
            { key: 'status', label: 'Status' },
        ],
    },
    guarantor_procedures: {
        collection: 'guarantor_procedures',
        label: 'Tata Cara Penjamin',
        singular: 'langkah penjamin',
        sort: 'step',
        titleOf: (r) => r.title,
        fields: [
            { name: 'step', label: 'Langkah ke-', type: 'number', required: true },
            { name: 'title', label: 'Judul langkah', type: 'text', required: true },
            { name: 'description', label: 'Deskripsi', type: 'textarea' },
        ],
        columns: [{ key: 'step', label: 'Langkah' }, { key: 'title', label: 'Judul' }],
    },
    guarantor_obligations: {
        collection: 'guarantor_obligations',
        label: 'Kewajiban Penjamin',
        singular: 'kewajiban',
        sort: 'order',
        titleOf: (r) => r.title,
        fields: [
            { name: 'title', label: 'Judul', type: 'text', required: true },
            { name: 'description', label: 'Deskripsi', type: 'textarea' },
            {
                name: 'kind',
                label: 'Kategori',
                type: 'select',
                required: true,
                options: [
                    { value: 'kewajiban', label: 'Kewajiban' },
                    { value: 'do', label: "Do" },
                    { value: 'dont', label: "Don't" },
                ],
            },
            { name: 'order', label: 'Urutan', type: 'number' },
        ],
        columns: [
            { key: 'title', label: 'Judul' },
            {
                key: 'kind',
                label: 'Kategori',
                render: (item) =>
                    item.kind === 'kewajiban' ? 'Kewajiban' : item.kind === 'do' ? 'Do' : "Don't",
            },
        ],
    },
    guarantor_documents: {
        collection: 'guarantor_documents',
        label: 'Dokumen Penjamin',
        singular: 'dokumen penjamin',
        sort: 'order',
        hasFile: true,
        titleOf: (r) => r.title,
        fields: [
            { name: 'title', label: 'Judul dokumen', type: 'text', required: true },
            { name: 'description', label: 'Deskripsi', type: 'textarea' },
            { name: 'file', label: 'Berkas PDF (maks. 10 MB)', type: 'file' },
            { name: 'external_url', label: 'URL contoh (bila belum ada berkas)', type: 'text' },
            { name: 'active', label: 'Aktif (tampil di portal)', type: 'bool' },
            { name: 'order', label: 'Urutan', type: 'number' },
        ],
        columns: [
            { key: 'title', label: 'Judul' },
            {
                key: 'file',
                label: 'Berkas',
                render: (item) => (item.file ? 'PDF terunggah' : item.external_url ? 'URL contoh' : 'Kosong'),
            },
            { key: 'downloads', label: 'Unduhan' },
            activeColumn,
        ],
    },
    guarantor_faq: {
        collection: 'guarantor_faq',
        label: 'FAQ Penjamin',
        singular: 'pertanyaan penjamin',
        sort: 'order',
        titleOf: (r) => r.question,
        fields: [
            { name: 'question', label: 'Pertanyaan', type: 'text', required: true },
            { name: 'answer', label: 'Jawaban', type: 'textarea', required: true },
            { name: 'order', label: 'Urutan', type: 'number' },
        ],
        columns: [{ key: 'question', label: 'Pertanyaan' }],
    },
    regulations: {
        collection: 'regulations',
        label: 'Referensi Peraturan',
        singular: 'referensi peraturan',
        sort: 'order',
        titleOf: (r) => r.title,
        fields: [
            { name: 'title', label: 'Judul peraturan', type: 'text', required: true },
            { name: 'reference', label: 'Nomor / rujukan', type: 'text', help: 'Placeholder: [Nomor peraturan — placeholder]' },
            { name: 'description', label: 'Deskripsi', type: 'textarea' },
            { name: 'order', label: 'Urutan', type: 'number' },
        ],
        columns: [{ key: 'title', label: 'Judul' }, { key: 'reference', label: 'Rujukan' }],
    },
    users: {
        collection: 'users',
        label: 'Admin/User',
        singular: 'akun petugas',
        sort: '-created',
        titleOf: (r) => r.name || r.email,
        beforeSave: withPasswordConfirm,
        fields: [
            { name: 'name', label: 'Nama', type: 'text', required: true },
            { name: 'email', label: 'Email', type: 'text', required: true },
            {
                name: 'role',
                label: 'Peran',
                type: 'select',
                required: true,
                options: [
                    { value: 'super_admin', label: 'Super Admin' },
                    { value: 'admin', label: 'Admin/Petugas' },
                ],
            },
            { name: 'password', label: 'Kata sandi (wajib saat membuat akun)', type: 'password' },
        ],
        columns: [
            { key: 'name', label: 'Nama' },
            { key: 'email', label: 'Email' },
            {
                key: 'role',
                label: 'Peran',
                render: (item) => (item.role === 'super_admin' ? 'Super Admin' : 'Admin/Petugas'),
            },
        ],
    },
};

export const ADMIN_SECTIONS = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard, type: 'dashboard' },
    { id: 'services', label: 'Layanan', icon: Layers, type: 'crud' },
    { id: 'procedures', label: 'Tata Cara', icon: ListOrdered, type: 'crud' },
    { id: 'requirements', label: 'Persyaratan', icon: ListChecks, type: 'crud' },
    { id: 'documents', label: 'Dokumen PDF', icon: FileText, type: 'crud' },
    { id: 'fees', label: 'Biaya', icon: Wallet, type: 'crud' },
    { id: 'processing_times', label: 'Lama Proses', icon: Clock3, type: 'crud' },
    { id: 'faq', label: 'FAQ', icon: HelpCircle, type: 'crud' },
    { id: 'guarantors', label: 'Penjamin', icon: Handshake, type: 'crud' },
    { id: 'guarantor_obligations', label: 'Kewajiban Penjamin', icon: ShieldCheck, type: 'crud' },
    { id: 'guarantor_documents', label: 'Dokumen Penjamin', icon: FileText, type: 'crud' },
    { id: 'guarantor_procedures', label: 'Tata Cara Penjamin', icon: ListOrdered, type: 'crud' },
    { id: 'guarantor_faq', label: 'FAQ Penjamin', icon: Baby, type: 'crud' },
    { id: 'regulations', label: 'Referensi Peraturan', icon: BookMarked, type: 'crud' },
    { id: 'users', label: 'Admin/User', icon: UserCog, type: 'crud' },
    { id: 'audit', label: 'Audit Log', icon: ScrollText, type: 'audit' },
    { id: 'settings', label: 'Pengaturan', icon: Settings, type: 'settings' },
];
