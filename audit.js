import pb from '@/lib/pocketbaseClient';

/**
 * Catat aktivitas admin ke audit_logs. Kegagalan pencatatan tidak boleh
 * mengganggu aksi utama, jadi error hanya di-log ke console.
 */
export async function logAudit(action, entity, detail = '') {
    try {
        const actor = pb.authStore.record;
        await pb.collection('audit_logs').create({
            actor: actor?.id || null,
            actor_name: actor?.name || actor?.email || 'tidak dikenal',
            action,
            entity,
            detail: String(detail).slice(0, 500),
        });
    } catch (err) {
        console.warn('Gagal mencatat audit log', err);
    }
}
