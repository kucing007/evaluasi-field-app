import Dexie from 'dexie';

export const db = new Dexie('EvaluasiBMNDB');

db.version(2).stores({
    pakets: '++id, no_paket, tahun',
    asets: '++id, paket_id, kd_brg, no_aset, status, [kd_brg+no_aset]',
    evaluasis: '++id, &aset_id',
});

// Delete old v1 data if upgrading
db.version(1).stores({
    pakets: '++id, no_paket, tahun',
    asets: '++id, paket_id, kd_brg, no_aset, status, [kd_brg+no_aset]',
    evaluasis: '++id, &aset_id',
});

/**
 * Import daftar aset into a paket.
 * @param {Object} paketInfo - { no_paket, ur_satker, tahun }
 * @param {Array} asetRows - [{ kd_brg, no_aset, ur_sskel, luas, kondisi_barang }]
 * @returns {number} paket_id
 */
export async function importAsetList(paketInfo, asetRows) {
    const paket_id = await db.pakets.add({
        no_paket: paketInfo.no_paket || '',
        ur_satker: paketInfo.ur_satker || '',
        tahun: paketInfo.tahun || new Date().getFullYear(),
        jml_bmn: asetRows.length,
        created_at: new Date().toISOString(),
    });

    const asets = asetRows.map((row) => ({
        paket_id,
        kd_brg: String(row.kd_brg || '').trim(),
        no_aset: String(row.no_aset || '').trim(),
        ur_sskel: String(row.ur_sskel || row.uraian || '').trim(),
        luas: String(row.luas || '').trim(),
        kondisi_barang: String(row.kondisi_barang || row.kondisi || '').trim(),
        status: 'empty', // empty | partial | done
    }));

    await db.asets.bulkAdd(asets);
    return paket_id;
}

/**
 * Get or create evaluasi for an aset.
 */
export async function getOrCreateEvaluasi(aset_id) {
    let evaluasi = await db.evaluasis.where('aset_id').equals(aset_id).first();
    if (!evaluasi) {
        const id = await db.evaluasis.add({
            aset_id,
            cara_evaluasi: '',
            tgl_survey: '',
            catatan: '',
            // Indikator fields (all 21)
            ind_111111: '',
            ind_121111: '', ind_121211: '', ind_121311: '', ind_121411: '', ind_121511: '',
            ind_131111: '', ind_131211: '', ind_131311: '', ind_131411: '',
            ind_131511: '', ind_131611: '', ind_131711: '',
            ind_141111: '', ind_141211: '',
            ind_151211: '', ind_151212: '', ind_151213: '', ind_151214: '', ind_151215: '',
            ind_161111: '',
            updated_at: new Date().toISOString(),
        });
        evaluasi = await db.evaluasis.get(id);
    }
    return evaluasi;
}

/**
 * Update evaluasi fields.
 */
export async function updateEvaluasi(id, fields) {
    await db.evaluasis.update(id, {
        ...fields,
        updated_at: new Date().toISOString(),
    });
}

/**
 * Update aset status based on evaluasi completeness.
 * Only counts visible (non-hidden) indikators.
 */
export async function updateAsetStatus(aset_id) {
    const { VISIBLE_INDIKATORS } = await import('../data/referensi');

    const evaluasi = await db.evaluasis.where('aset_id').equals(aset_id).first();
    if (!evaluasi) {
        await db.asets.update(aset_id, { status: 'empty' });
        return 'empty';
    }

    const visibleKeys = VISIBLE_INDIKATORS.map((i) => `ind_${i.kd_sub_sub}`);
    const filled = visibleKeys.filter((k) => evaluasi[k] !== '' && evaluasi[k] != null).length;
    const hasCaraOrTgl = evaluasi.cara_evaluasi || evaluasi.tgl_survey;

    let status = 'empty';
    if (filled > 0 || hasCaraOrTgl) status = 'partial';
    if (filled >= visibleKeys.length && evaluasi.cara_evaluasi && evaluasi.tgl_survey) status = 'done';

    await db.asets.update(aset_id, { status });
    return status;
}

/**
 * Delete a paket and all its asets + evaluasis.
 */
export async function deletePaket(paketId) {
    const asets = await db.asets.where('paket_id').equals(paketId).toArray();
    const asetIds = asets.map((a) => a.id);

    await db.evaluasis.where('aset_id').anyOf(asetIds).delete();
    await db.asets.where('paket_id').equals(paketId).delete();
    await db.pakets.delete(paketId);
}
