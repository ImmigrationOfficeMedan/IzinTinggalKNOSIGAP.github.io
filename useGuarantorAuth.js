import { useEffect, useState } from 'react';
import pb from '@/lib/pocketbaseClient';

const asGuarantor = (record) =>
    record && record.collectionName === 'guarantors' ? record : null;

/**
 * Auth khusus penjamin (koleksi auth `guarantors`), terpisah dari akun admin
 * (`users`) yang dikelola AuthContext.
 */
export function useGuarantorAuth() {
    const [guarantor, setGuarantor] = useState(asGuarantor(pb.authStore.record));

    useEffect(
        () => pb.authStore.onChange((_token, record) => setGuarantor(asGuarantor(record))),
        [],
    );

    return {
        guarantor,
        isGuarantor: !!guarantor && pb.authStore.isValid,
        login: (email, password) =>
            pb.collection('guarantors').authWithPassword(email, password),
        logout: () => pb.authStore.clear(),
    };
}

export default useGuarantorAuth;
