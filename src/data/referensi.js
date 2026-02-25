/**
 * Hardcoded reference data for indikator evaluasi.
 * Source: SIMAN API /eval/api/references/r-skor-indikator/get-all/{kd_sub_sub}
 *
 * Can be overridden by user import.
 */

export const INDIKATOR_CONFIG = [
    // === Kepentingan Umum ===
    {
        kd_sub_sub: '111111',
        label: 'Kepentingan Umum',
        group: 'Kepentingan Umum',
        type: 'pilihan',
        options: [
            { nilai: 'Rahasia Negara', skor: 10 },
            { nilai: 'Alat Utama Sistem Senjata', skor: 10 },
            { nilai: 'Proyek Strategis Nasional', skor: 8 },
            { nilai: 'Kawasan Hutan', skor: 6 },
            { nilai: 'Kepentingan Umum sesuai UU', skor: 5 },
            { nilai: 'Non Kepentingan Umum', skor: 0 },
        ],
    },

    // === Manfaat Sosial ===
    {
        kd_sub_sub: '121111',
        label: 'Manfaat Sosial - Tingkat Penggunaan',
        group: 'Manfaat Sosial',
        type: 'angka',
        unit: '%',
        hint: 'Persentase tingkat penggunaan (0-100)',
    },
    {
        kd_sub_sub: '121211',
        label: 'Manfaat Sosial - Frekuensi Penggunaan',
        group: 'Manfaat Sosial',
        type: 'angka',
        unit: '%',
        hint: 'Persentase frekuensi penggunaan',
    },
    {
        kd_sub_sub: '121311',
        label: 'Manfaat Sosial - Jumlah Pengguna',
        group: 'Manfaat Sosial',
        type: 'angka',
        unit: 'orang',
        hint: 'Jumlah pengguna',
    },
    {
        kd_sub_sub: '121411',
        label: 'Manfaat Sosial - Peran thdp Tupoksi',
        group: 'Manfaat Sosial',
        type: 'angka',
        unit: '%',
        hint: 'Persentase peran terhadap tupoksi',
    },
    {
        kd_sub_sub: '121511',
        label: 'Manfaat Sosial - Konsistensi Pemanfaatan',
        group: 'Manfaat Sosial',
        type: 'angka',
        unit: '%',
        hint: 'Persentase konsistensi pemanfaatan',
    },

    // === Tingkat Kepuasan ===
    {
        kd_sub_sub: '131111',
        label: 'Kepuasan - Kenyamanan',
        group: 'Tingkat Kepuasan',
        type: 'pilihan',
        options: [
            { nilai: 'Sangat Puas', skor: 10 },
            { nilai: 'Puas', skor: 8 },
            { nilai: 'Cukup Puas', skor: 5 },
            { nilai: 'Tidak Puas', skor: 3 },
            { nilai: 'Sangat Tidak Puas', skor: 0 },
        ],
    },
    {
        kd_sub_sub: '131211',
        label: 'Kepuasan - Keamanan',
        group: 'Tingkat Kepuasan',
        type: 'pilihan',
        options: [
            { nilai: 'Sangat Puas', skor: 10 },
            { nilai: 'Puas', skor: 8 },
            { nilai: 'Cukup Puas', skor: 5 },
            { nilai: 'Tidak Puas', skor: 3 },
            { nilai: 'Sangat Tidak Puas', skor: 0 },
        ],
    },
    {
        kd_sub_sub: '131311',
        label: 'Kepuasan - Kemudahan Akses',
        group: 'Tingkat Kepuasan',
        type: 'pilihan',
        options: [
            { nilai: 'Sangat Puas', skor: 10 },
            { nilai: 'Puas', skor: 8 },
            { nilai: 'Cukup Puas', skor: 5 },
            { nilai: 'Tidak Puas', skor: 3 },
            { nilai: 'Sangat Tidak Puas', skor: 0 },
        ],
    },
    {
        kd_sub_sub: '131411',
        label: 'Kepuasan - Kebersihan',
        group: 'Tingkat Kepuasan',
        type: 'pilihan',
        options: [
            { nilai: 'Sangat Puas', skor: 10 },
            { nilai: 'Puas', skor: 8 },
            { nilai: 'Cukup Puas', skor: 5 },
            { nilai: 'Tidak Puas', skor: 3 },
            { nilai: 'Sangat Tidak Puas', skor: 0 },
        ],
    },
    {
        kd_sub_sub: '131511',
        label: 'Kepuasan - Ketersediaan Fasilitas',
        group: 'Tingkat Kepuasan',
        type: 'pilihan',
        options: [
            { nilai: 'Sangat Puas', skor: 10 },
            { nilai: 'Puas', skor: 8 },
            { nilai: 'Cukup Puas', skor: 5 },
            { nilai: 'Tidak Puas', skor: 3 },
            { nilai: 'Sangat Tidak Puas', skor: 0 },
        ],
    },
    {
        kd_sub_sub: '131611',
        label: 'Kepuasan - Kesesuaian Fungsi',
        group: 'Tingkat Kepuasan',
        type: 'pilihan',
        options: [
            { nilai: 'Sangat Puas', skor: 10 },
            { nilai: 'Puas', skor: 8 },
            { nilai: 'Cukup Puas', skor: 5 },
            { nilai: 'Tidak Puas', skor: 3 },
            { nilai: 'Sangat Tidak Puas', skor: 0 },
        ],
    },
    {
        kd_sub_sub: '131711',
        label: 'Kepuasan - Estetika',
        group: 'Tingkat Kepuasan',
        type: 'pilihan',
        options: [
            { nilai: 'Sangat Puas', skor: 10 },
            { nilai: 'Puas', skor: 8 },
            { nilai: 'Cukup Puas', skor: 5 },
            { nilai: 'Tidak Puas', skor: 3 },
            { nilai: 'Sangat Tidak Puas', skor: 0 },
        ],
    },

    // === Potensi Penggunaan ===
    {
        kd_sub_sub: '141111',
        label: 'Potensi - Tingkat Pemanfaatan',
        group: 'Potensi Penggunaan',
        type: 'pilihan',
        options: [
            { nilai: 'Dimanfaatkan', skor: 10 },
            { nilai: 'Tidak Dimanfaatkan', skor: 0 },
        ],
    },
    {
        kd_sub_sub: '141211',
        label: 'Potensi - Potensi Pemanfaatan',
        group: 'Potensi Penggunaan',
        type: 'pilihan',
        options: [
            { nilai: 'Berpotensi', skor: 10 },
            { nilai: 'Tidak Berpotensi', skor: 0 },
        ],
    },

    // === Kelayakan Biaya ===
    {
        kd_sub_sub: '151211',
        label: 'Biaya Penyusutan',
        group: 'Kelayakan Biaya',
        type: 'angka',
        unit: 'Rp',
        hint: 'Nilai biaya penyusutan (Rupiah)',
    },
    {
        kd_sub_sub: '151212',
        label: 'Biaya Operasional',
        group: 'Kelayakan Biaya',
        type: 'angka',
        unit: 'Rp',
        hint: 'Nilai biaya operasional (Rupiah)',
    },
    {
        kd_sub_sub: '151213',
        label: 'Biaya Pemeliharaan',
        group: 'Kelayakan Biaya',
        type: 'angka',
        unit: 'Rp',
        hint: 'Nilai biaya pemeliharaan (Rupiah)',
    },
    {
        kd_sub_sub: '151214',
        label: 'Biaya Sewa Pasar',
        group: 'Kelayakan Biaya',
        type: 'angka',
        unit: 'Rp',
        hint: 'Nilai biaya sewa pasar (Rupiah)',
    },
    {
        kd_sub_sub: '151215',
        label: 'Kelayakan Biaya 5',
        group: 'Kelayakan Biaya',
        type: 'angka',
        unit: 'Rp',
        hint: 'Nilai kelayakan biaya (Rupiah)',
    },

    // === Kondisi Teknis ===
    {
        kd_sub_sub: '161111',
        label: 'Kondisi Teknis',
        group: 'Kondisi Teknis',
        type: 'pilihan',
        options: [
            { nilai: 'Baik', skor: 10 },
            { nilai: 'Rusak Ringan', skor: 7 },
            { nilai: 'Rusak Sedang', skor: 4 },
            { nilai: 'Rusak Berat', skor: 1 },
        ],
    },
];

/**
 * Group indikators by their group name.
 */
export function getGroupedIndikators() {
    const groups = {};
    for (const ind of INDIKATOR_CONFIG) {
        if (!groups[ind.group]) groups[ind.group] = [];
        groups[ind.group].push(ind);
    }
    return groups;
}

/**
 * Find indikator config by kd_sub_sub.
 */
export function getIndikatorConfig(kd_sub_sub) {
    return INDIKATOR_CONFIG.find((i) => i.kd_sub_sub === kd_sub_sub);
}

/**
 * All indikator kd_sub_sub codes (for Excel columns).
 */
export const INDIKATOR_COLUMNS = INDIKATOR_CONFIG.map((i) => i.kd_sub_sub);

/**
 * Cara evaluasi options.
 */
export const CARA_EVALUASI_OPTIONS = ['On Desk', 'Peninjauan Lapangan'];
