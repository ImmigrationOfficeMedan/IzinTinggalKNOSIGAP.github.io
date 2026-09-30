import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { toast } from 'sonner';
import { Download, Eye, FileText, Pencil, Plus, RefreshCw, Trash2 } from 'lucide-react';
import pb from '@/lib/pocketbaseClient';
import { logAudit } from '@/lib/audit';
import { getDocUrl, validatePdf } from '@/lib/docs';
import PdfPreviewModal from '@/components/site/PdfPreviewModal';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';

const NONE = '__none__';

const CrudManager = ({ config }) => {
    const [items, setItems] = useState([]);
    const [services, setServices] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [dialogOpen, setDialogOpen] = useState(false);
    const [editing, setEditing] = useState(null);
    const [values, setValues] = useState({});
    const [file, setFile] = useState(null);
    const [formError, setFormError] = useState('');
    const [saving, setSaving] = useState(false);
    const [preview, setPreview] = useState(null);

    const hasRelation = config.fields.some((f) => f.type === 'relation');

    const servicesById = useMemo(() => {
        const map = {};
        services.forEach((s) => {
            map[s.id] = s;
        });
        return map;
    }, [services]);

    const load = useCallback(async () => {
        setLoading(true);
        setError('');
        try {
            const records = await pb
                .collection(config.collection)
                .getFullList({ sort: config.sort || '-created' });
            setItems(records);
            if (hasRelation) {
                const svc = await pb.collection('services').getFullList({ sort: 'order' });
                setServices(svc);
            }
        } catch (err) {
            console.error(err);
            setError('Data belum dapat dimuat. Silakan coba lagi.');
        } finally {
            setLoading(false);
        }
    }, [config.collection, config.sort, hasRelation]);

    useEffect(() => {
        load();
    }, [load]);

    const defaults = () => {
        const v = {};
        config.fields.forEach((f) => {
            if (f.type === 'bool') v[f.name] = false;
            else if (f.type === 'number') v[f.name] = items.length + 1;
            else if (f.type === 'select') v[f.name] = f.options?.[0]?.value || '';
            else v[f.name] = '';
        });
        return v;
    };

    const openNew = () => {
        setEditing(null);
        setValues(defaults());
        setFile(null);
        setFormError('');
        setDialogOpen(true);
    };

    const openEdit = (record) => {
        setEditing(record);
        const v = {};
        config.fields.forEach((f) => {
            if (f.type === 'file' || f.type === 'password') return;
            v[f.name] = record[f.name] ?? (f.type === 'bool' ? false : '');
        });
        setValues(v);
        setFile(null);
        setFormError('');
        setDialogOpen(true);
    };

    const setValue = (name, value) => setValues((prev) => ({ ...prev, [name]: value }));

    const save = async (e) => {
        e.preventDefault();
        setFormError('');

        for (const f of config.fields) {
            if (!f.required) continue;
            if (f.type === 'bool' || f.type === 'file' || f.type === 'password') continue;
            const val = values[f.name];
            if (val === '' || val === undefined || val === null) {
                setFormError(`Kolom "${f.label}" wajib diisi.`);
                return;
            }
        }
        const passwordField = config.fields.find((f) => f.type === 'password');
        if (!editing && passwordField && !values[passwordField.name]) {
            setFormError('Kata sandi wajib diisi saat membuat akun baru.');
            return;
        }

        setSaving(true);
        try {
            let payload;
            if (file) {
                const fileError = validatePdf(file);
                if (fileError) {
                    setFormError(fileError);
                    setSaving(false);
                    return;
                }
                payload = new FormData();
                config.fields.forEach((f) => {
                    if (f.type === 'file' || f.type === 'password') return;
                    const val = values[f.name];
                    if (val === '' || val === undefined || val === null) return;
                    payload.append(f.name, String(val));
                });
                payload.append(config.fields.find((f) => f.type === 'file').name, file);
            } else {
                const obj = {};
                config.fields.forEach((f) => {
                    if (f.type === 'file') return;
                    let val = values[f.name];
                    if (f.type === 'number') val = val === '' || val === undefined ? 0 : Number(val);
                    if (f.type === 'relation' && !val) return;
                    if (f.type === 'password' && !val) return;
                    obj[f.name] = val;
                });
                payload = config.beforeSave ? config.beforeSave(obj, !!editing) : obj;
            }

            if (editing) {
                await pb.collection(config.collection).update(editing.id, payload);
                await logAudit('update', config.collection, config.titleOf(editing));
                toast.success(`${config.label} berhasil diperbarui.`);
            } else {
                await pb.collection(config.collection).create(payload);
                await logAudit('create', config.collection, values.title || values.name || values.label || values.question || '');
                toast.success(`${config.label} berhasil ditambahkan.`);
            }
            setDialogOpen(false);
            await load();
        } catch (err) {
            console.error(err);
            const detail =
                err?.response?.data &&
                Object.values(err.response.data)
                    .map((d) => d?.message)
                    .filter(Boolean)
                    .join(' ');
            setFormError(
                err?.status === 403 || err?.status === 404
                    ? 'Akses ditolak. Peran Anda tidak mengizinkan aksi ini.'
                    : `Gagal menyimpan. ${detail || 'Periksa kembali isian Anda.'}`,
            );
        } finally {
            setSaving(false);
        }
    };

    const remove = async (record) => {
        const label = config.titleOf(record);
        if (!window.confirm(`Hapus ${config.singular} "${label}"? Tindakan ini tidak dapat dibatalkan.`)) return;
        try {
            await pb.collection(config.collection).delete(record.id);
            await logAudit('delete', config.collection, label);
            toast.success(`${config.label} berhasil dihapus.`);
            await load();
        } catch (err) {
            console.error(err);
            toast.error('Gagal menghapus. Peran Anda mungkin tidak mengizinkan aksi ini.');
        }
    };

    const toggleActive = async (record) => {
        try {
            await pb.collection(config.collection).update(record.id, { active: !record.active });
            await logAudit('update', config.collection, `${config.titleOf(record)} → ${record.active ? 'nonaktif' : 'aktif'}`);
            setItems((prev) =>
                prev.map((it) => (it.id === record.id ? { ...it, active: !record.active } : it)),
            );
        } catch (err) {
            console.error(err);
            toast.error('Gagal mengubah status.');
        }
    };

    return (
        <div>
            <div className="flex flex-wrap items-center justify-between gap-3">
                <div>
                    <h2 className="text-lg font-extrabold tracking-tight text-navy">{config.label}</h2>
                    <p className="text-xs text-muted-foreground">
                        {items.length} entri · perubahan langsung tampil di portal publik
                    </p>
                </div>
                <div className="flex gap-2">
                    <Button variant="outline" size="sm" className="rounded-xl" onClick={load} disabled={loading}>
                        <RefreshCw className={`mr-2 h-4 w-4 ${loading ? 'animate-spin' : ''}`} aria-hidden="true" />
                        Muat Ulang
                    </Button>
                    <Button size="sm" className="rounded-xl bg-navy font-semibold hover:bg-navy-light" onClick={openNew}>
                        <Plus className="mr-2 h-4 w-4" aria-hidden="true" />
                        Tambah
                    </Button>
                </div>
            </div>

            {error && (
                <p className="mt-4 rounded-xl border border-destructive/30 bg-destructive/5 px-4 py-3 text-sm text-destructive">
                    {error}
                </p>
            )}

            <div className="card-soft mt-5 overflow-x-auto">
                {loading ? (
                    <div className="space-y-2 p-5" aria-busy="true">
                        {Array.from({ length: 4 }).map((_, i) => (
                            <div key={i} className="h-10 animate-pulse rounded-lg bg-muted" />
                        ))}
                    </div>
                ) : items.length === 0 ? (
                    <p className="px-5 py-12 text-center text-sm text-muted-foreground">
                        Belum ada data. Klik "Tambah" untuk membuat entri pertama.
                    </p>
                ) : (
                    <table className="w-full min-w-[640px] text-left text-sm">
                        <thead>
                            <tr className="border-b border-border bg-secondary/60">
                                {config.columns.map((c) => (
                                    <th
                                        key={c.key}
                                        className="px-4 py-3 font-mono text-[10.5px] font-semibold uppercase tracking-[0.14em] text-muted-foreground"
                                    >
                                        {c.label}
                                    </th>
                                ))}
                                <th className="px-4 py-3 text-right font-mono text-[10.5px] font-semibold uppercase tracking-[0.14em] text-muted-foreground">
                                    Aksi
                                </th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-border">
                            {items.map((item) => (
                                <tr key={item.id} className="transition-colors hover:bg-secondary/40">
                                    {config.columns.map((c) => (
                                        <td key={c.key} className="max-w-[260px] truncate px-4 py-3 text-foreground/85">
                                            {c.key === 'active' ? (
                                                <button
                                                    type="button"
                                                    onClick={() => toggleActive(item)}
                                                    className={`rounded-full px-2.5 py-1 font-mono text-[10px] font-semibold uppercase tracking-wider transition-colors focus-ring ${
                                                        item.active
                                                            ? 'bg-emerald-100 text-emerald-800 hover:bg-emerald-200'
                                                            : 'bg-muted text-muted-foreground hover:bg-border'
                                                    }`}
                                                    aria-label={`Ubah status ${config.titleOf(item)}`}
                                                >
                                                    {item.active ? 'Aktif' : 'Nonaktif'}
                                                </button>
                                            ) : c.render ? (
                                                c.render(item, { servicesById })
                                            ) : (
                                                String(item[c.key] ?? '—')
                                            )}
                                        </td>
                                    ))}
                                    <td className="px-4 py-3">
                                        <div className="flex justify-end gap-1.5">
                                            {config.hasFile && getDocUrl(item) && (
                                                <>
                                                    <Button
                                                        variant="ghost"
                                                        size="icon"
                                                        className="h-8 w-8 rounded-lg"
                                                        onClick={() =>
                                                            setPreview({
                                                                title: item.title,
                                                                description: item.description,
                                                                url: getDocUrl(item),
                                                            })
                                                        }
                                                        aria-label={`Pratinjau ${item.title}`}
                                                    >
                                                        <Eye className="h-4 w-4" aria-hidden="true" />
                                                    </Button>
                                                    <Button
                                                        variant="ghost"
                                                        size="icon"
                                                        className="h-8 w-8 rounded-lg"
                                                        asChild
                                                    >
                                                        <a
                                                            href={getDocUrl(item)}
                                                            download
                                                            target="_blank"
                                                            rel="noreferrer"
                                                            aria-label={`Unduh ${item.title}`}
                                                        >
                                                            <Download className="h-4 w-4" aria-hidden="true" />
                                                        </a>
                                                    </Button>
                                                </>
                                            )}
                                            <Button
                                                variant="ghost"
                                                size="icon"
                                                className="h-8 w-8 rounded-lg"
                                                onClick={() => openEdit(item)}
                                                aria-label={`Ubah ${config.titleOf(item)}`}
                                            >
                                                <Pencil className="h-4 w-4" aria-hidden="true" />
                                            </Button>
                                            <Button
                                                variant="ghost"
                                                size="icon"
                                                className="h-8 w-8 rounded-lg text-destructive hover:bg-destructive/10 hover:text-destructive"
                                                onClick={() => remove(item)}
                                                aria-label={`Hapus ${config.titleOf(item)}`}
                                            >
                                                <Trash2 className="h-4 w-4" aria-hidden="true" />
                                            </Button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )}
            </div>

            {/* Form dialog */}
            <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
                <DialogContent className="max-h-[85vh] max-w-xl overflow-y-auto">
                    <DialogHeader>
                        <DialogTitle className="text-navy">
                            {editing ? `Ubah ${config.singular}` : `Tambah ${config.singular}`}
                        </DialogTitle>
                        <DialogDescription>
                            Lengkapi formulir berikut. Kolom bertanda wajib harus diisi.
                        </DialogDescription>
                    </DialogHeader>
                    <form onSubmit={save} className="space-y-4">
                        {config.fields.map((f) => (
                            <div key={f.name} className="space-y-2">
                                {f.type === 'bool' ? (
                                    <div className="flex items-center justify-between rounded-xl border border-border px-4 py-3">
                                        <Label htmlFor={`f-${f.name}`} className="cursor-pointer">
                                            {f.label}
                                        </Label>
                                        <Switch
                                            id={`f-${f.name}`}
                                            checked={!!values[f.name]}
                                            onCheckedChange={(v) => setValue(f.name, v)}
                                        />
                                    </div>
                                ) : f.type === 'textarea' ? (
                                    <>
                                        <Label htmlFor={`f-${f.name}`}>
                                            {f.label}
                                            {f.required && <span className="text-destructive"> *</span>}
                                        </Label>
                                        <Textarea
                                            id={`f-${f.name}`}
                                            value={values[f.name] ?? ''}
                                            onChange={(e) => setValue(f.name, e.target.value)}
                                            rows={3}
                                            className="rounded-xl"
                                        />
                                    </>
                                ) : f.type === 'select' ? (
                                    <>
                                        <Label htmlFor={`f-${f.name}`}>
                                            {f.label}
                                            {f.required && <span className="text-destructive"> *</span>}
                                        </Label>
                                        <Select
                                            value={values[f.name] || f.options?.[0]?.value}
                                            onValueChange={(v) => setValue(f.name, v)}
                                        >
                                            <SelectTrigger id={`f-${f.name}`} className="rounded-xl">
                                                <SelectValue />
                                            </SelectTrigger>
                                            <SelectContent>
                                                {f.options.map((o) => (
                                                    <SelectItem key={o.value} value={o.value}>
                                                        {o.label}
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                    </>
                                ) : f.type === 'relation' ? (
                                    <>
                                        <Label htmlFor={`f-${f.name}`}>
                                            {f.label}
                                            {f.required && <span className="text-destructive"> *</span>}
                                        </Label>
                                        <Select
                                            value={values[f.name] || NONE}
                                            onValueChange={(v) => setValue(f.name, v === NONE ? '' : v)}
                                        >
                                            <SelectTrigger id={`f-${f.name}`} className="rounded-xl">
                                                <SelectValue placeholder="Pilih layanan" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                {!f.required && (
                                                    <SelectItem value={NONE}>— Tidak terkait —</SelectItem>
                                                )}
                                                {services.map((s) => (
                                                    <SelectItem key={s.id} value={s.id}>
                                                        {s.title}
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                    </>
                                ) : f.type === 'file' ? (
                                    <>
                                        <Label htmlFor={`f-${f.name}`}>{f.label}</Label>
                                        {editing?.[f.name] && (
                                            <p className="flex items-center gap-2 rounded-lg bg-secondary px-3 py-2 text-xs text-muted-foreground">
                                                <FileText className="h-3.5 w-3.5" aria-hidden="true" />
                                                Berkas saat ini: {editing[f.name]} — pilih berkas baru untuk
                                                mengganti (replace).
                                            </p>
                                        )}
                                        <Input
                                            id={`f-${f.name}`}
                                            type="file"
                                            accept="application/pdf,.pdf"
                                            onChange={(e) => setFile(e.target.files?.[0] || null)}
                                            className="rounded-xl"
                                        />
                                        <p className="text-xs text-muted-foreground">
                                            Hanya PDF, maksimal 10 MB.
                                        </p>
                                    </>
                                ) : (
                                    <>
                                        <Label htmlFor={`f-${f.name}`}>
                                            {f.label}
                                            {f.required && <span className="text-destructive"> *</span>}
                                        </Label>
                                        <Input
                                            id={`f-${f.name}`}
                                            type={f.type === 'number' ? 'number' : f.type === 'password' ? 'password' : 'text'}
                                            value={values[f.name] ?? ''}
                                            onChange={(e) => setValue(f.name, e.target.value)}
                                            className="rounded-xl"
                                            autoComplete={f.type === 'password' ? 'new-password' : 'off'}
                                        />
                                    </>
                                )}
                                {f.help && <p className="text-xs text-muted-foreground">{f.help}</p>}
                            </div>
                        ))}

                        {formError && (
                            <p role="alert" className="rounded-xl border border-destructive/30 bg-destructive/5 px-4 py-3 text-sm text-destructive">
                                {formError}
                            </p>
                        )}

                        <div className="flex justify-end gap-2 pt-2">
                            <Button
                                type="button"
                                variant="outline"
                                className="rounded-xl"
                                onClick={() => setDialogOpen(false)}
                            >
                                Batal
                            </Button>
                            <Button
                                type="submit"
                                disabled={saving}
                                className="rounded-xl bg-navy font-semibold hover:bg-navy-light"
                            >
                                {saving ? 'Menyimpan...' : 'Simpan'}
                            </Button>
                        </div>
                    </form>
                </DialogContent>
            </Dialog>

            <PdfPreviewModal doc={preview} open={!!preview} onOpenChange={() => setPreview(null)} />
        </div>
    );
};

export default CrudManager;
