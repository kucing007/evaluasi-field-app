/**
 * Hardcoded reference data for indikator evaluasi.
 * Source: SIMAN API /eval/api/references/r-skor-indikator/get-all/{kd_sub_sub}
 *
 * Groups follow official section names:
 *  11 - Kepentingan Umum
 *  12 - Manfaat Sosial (hidden in UI, exported as-is)
 *  13 - Tingkat Kepuasan Pengguna
 *  14 - Potensi Penggunaan Masa Depan
 *  15 - Kelayakan Finansial/Ekonomi (hidden in UI, exported as-is)
 *  16 - Kondisi Teknis
 */

export const INDIKATOR_CONFIG = [
    // ==============================
    // 11 — Kepentingan Umum
    // ==============================
    {
        kd_sub_sub: '111111',
        label: 'Kepentingan Umum',
        group: 'Kepentingan Umum',
        type: 'pilihan',
        hidden: false,
        options: [
            { nilai: 'Rahasia Negara', skor: 10 },
            { nilai: 'Alat Utama Sistem Senjata', skor: 10 },
            { nilai: 'Proyek Strategis Nasional', skor: 8 },
            { nilai: 'Kawasan Hutan', skor: 6 },
            { nilai: 'Kepentingan Umum sesuai UU', skor: 5 },
            { nilai: 'Non Kepentingan Umum', skor: 0 },
        ],
    },

    // ==============================
    // 12 — Manfaat Sosial (HIDDEN — calculated in Excel)
    // ==============================
    {
        kd_sub_sub: '121111',
        label: 'Tingkat Penggunaan',
        group: 'Manfaat Sosial',
        type: 'angka',
        unit: '%',
        hint: 'Persentase tingkat penggunaan (0-100)',
        hidden: true,
    },
    {
        kd_sub_sub: '121211',
        label: 'Frekuensi Penggunaan',
        group: 'Manfaat Sosial',
        type: 'angka',
        unit: '%',
        hint: 'Persentase frekuensi penggunaan',
        hidden: true,
    },
    {
        kd_sub_sub: '121311',
        label: 'Jumlah Pengguna',
        group: 'Manfaat Sosial',
        type: 'angka',
        unit: 'orang',
        hint: 'Jumlah pengguna',
        hidden: true,
    },
    {
        kd_sub_sub: '121411',
        label: 'Peran thdp Tupoksi',
        group: 'Manfaat Sosial',
        type: 'angka',
        unit: '%',
        hint: 'Persentase peran terhadap tupoksi',
        hidden: true,
    },
    {
        kd_sub_sub: '121511',
        label: 'Konsistensi Pemanfaatan',
        group: 'Manfaat Sosial',
        type: 'angka',
        unit: '%',
        hint: 'Persentase konsistensi pemanfaatan',
        hidden: true,
    },

    // ==============================
    // 13 — Tingkat Kepuasan Pengguna
    // ==============================
    {
        kd_sub_sub: '131111',
        label: 'Fungsionalitas',
        group: 'Tingkat Kepuasan Pengguna',
        type: 'pilihan',
        hidden: false,
        options: [
            { nilai: 'Sangat Berfungsi', skor: 10 },
            { nilai: 'Berfungsi dengan Baik', skor: 8 },
            { nilai: 'Kurang berfungsi', skor: 5 },
            { nilai: 'Sangat kurang berfungsi', skor: 3 },
            { nilai: 'Tidak berfungsi sama sekali', skor: 0 },
        ],
    },
    {
        kd_sub_sub: '131211',
        label: 'Fitur-fitur',
        group: 'Tingkat Kepuasan Pengguna',
        type: 'pilihan',
        hidden: false,
        options: [
            { nilai: 'Sangat lengkap', skor: 10 },
            { nilai: 'Lengkap', skor: 8 },
            { nilai: 'Kurang Lengkap', skor: 5 },
            { nilai: 'Sangat Kurang Lengkap', skor: 3 },
            { nilai: 'Tidak memiliki fitur', skor: 0 },
        ],
    },
    {
        kd_sub_sub: '131311',
        label: 'Kehandalan',
        group: 'Tingkat Kepuasan Pengguna',
        type: 'pilihan',
        hidden: false,
        options: [
            { nilai: 'Sangat handal', skor: 10 },
            { nilai: 'Handal', skor: 8 },
            { nilai: 'Kurang handal', skor: 5 },
            { nilai: 'Sangat kurang handal', skor: 3 },
            { nilai: 'Tidak memiliki kehandalan', skor: 0 },
        ],
    },
    {
        kd_sub_sub: '131411',
        label: 'Keindahan',
        group: 'Tingkat Kepuasan Pengguna',
        type: 'pilihan',
        hidden: false,
        options: [
            { nilai: 'Sangat indah', skor: 10 },
            { nilai: 'Indah', skor: 8 },
            { nilai: 'Kurang indah', skor: 5 },
            { nilai: 'Jelek', skor: 3 },
            { nilai: 'Tidak memiliki unsur keindahan', skor: 0 },
        ],
    },
    {
        kd_sub_sub: '131511',
        label: 'Daya Tahan',
        group: 'Tingkat Kepuasan Pengguna',
        type: 'pilihan',
        hidden: false,
        options: [
            { nilai: 'Sangat kuat', skor: 10 },
            { nilai: 'Kuat', skor: 8 },
            { nilai: 'Kurang Kuat', skor: 5 },
            { nilai: 'Lemah', skor: 3 },
            { nilai: 'Tidak memilki daya tahan', skor: 0 },
        ],
    },
    {
        kd_sub_sub: '131611',
        label: 'Kemudahan mendapatkan layanan',
        group: 'Tingkat Kepuasan Pengguna',
        type: 'pilihan',
        hidden: false,
        options: [
            { nilai: 'Sangat mudah', skor: 10 },
            { nilai: 'Mudah', skor: 8 },
            { nilai: 'Cukup mudah', skor: 5 },
            { nilai: 'Kurang', skor: 3 },
            { nilai: 'Tidak dapat akses', skor: 0 },
        ],
    },
    {
        kd_sub_sub: '131711',
        label: 'Kualitas layanan',
        group: 'Tingkat Kepuasan Pengguna',
        type: 'pilihan',
        hidden: false,
        options: [
            { nilai: 'Sangat baik', skor: 10 },
            { nilai: 'Baik', skor: 8 },
            { nilai: 'Cukup', skor: 5 },
            { nilai: 'Kurang', skor: 3 },
            { nilai: 'Buruk', skor: 0 },
        ],
    },

    // ==============================
    // 14 — Potensi Penggunaan Masa Depan
    // ==============================
    {
        kd_sub_sub: '141111',
        label: 'Kategori Aset',
        group: 'Potensi Penggunaan Masa Depan',
        type: 'pilihan',
        hidden: false,
        options: [
            { nilai: 'Aset Operasional', skor: 10 },
            { nilai: 'Aset Tambahan', skor: 7 },
            { nilai: 'Non Operasional', skor: 4 },
            { nilai: 'Aset Diatur Khusus', skor: 2 },
        ],
    },
    {
        kd_sub_sub: '141211',
        label: 'Signifikansi Aset',
        group: 'Potensi Penggunaan Masa Depan',
        type: 'pilihan',
        hidden: false,
        options: [
            { nilai: 'Vital', skor: 10 },
            { nilai: 'Penting', skor: 8 },
            { nilai: 'Pemberi Layanan', skor: 6 },
            { nilai: 'Fungsi Pendukung', skor: 4 },
            { nilai: 'Tidak Ada Dampak', skor: 0 },
        ],
    },

    // ==============================
    // 15 — Kelayakan Finansial/Ekonomi (HIDDEN — calculated in Excel)
    // ==============================
    {
        kd_sub_sub: '151211',
        label: 'Biaya Penyusutan',
        group: 'Kelayakan Finansial/Ekonomi',
        type: 'angka',
        unit: 'Rp',
        hint: 'Nilai biaya penyusutan (Rupiah)',
        hidden: true,
    },
    {
        kd_sub_sub: '151212',
        label: 'Biaya Operasional',
        group: 'Kelayakan Finansial/Ekonomi',
        type: 'angka',
        unit: 'Rp',
        hint: 'Nilai biaya operasional (Rupiah)',
        hidden: true,
    },
    {
        kd_sub_sub: '151213',
        label: 'Biaya Pemeliharaan',
        group: 'Kelayakan Finansial/Ekonomi',
        type: 'angka',
        unit: 'Rp',
        hint: 'Nilai biaya pemeliharaan (Rupiah)',
        hidden: true,
    },
    {
        kd_sub_sub: '151214',
        label: 'Biaya Sewa Pasar',
        group: 'Kelayakan Finansial/Ekonomi',
        type: 'angka',
        unit: 'Rp',
        hint: 'Nilai biaya sewa pasar (Rupiah)',
        hidden: true,
    },
    {
        kd_sub_sub: '151215',
        label: 'Kelayakan Biaya 5',
        group: 'Kelayakan Finansial/Ekonomi',
        type: 'angka',
        unit: 'Rp',
        hint: 'Nilai kelayakan biaya (Rupiah)',
        hidden: true,
    },

    // ==============================
    // 16 — Kondisi Teknis
    // ==============================
    {
        kd_sub_sub: '161111',
        label: 'Kondisi Teknis',
        group: 'Kondisi Teknis',
        type: 'pilihan',
        hidden: false,
        options: [
            { nilai: 'Baik', skor: 10 },
            { nilai: 'Rusak Ringan', skor: 7 },
            { nilai: 'Rusak Sedang', skor: 4 },
            { nilai: 'Rusak Berat', skor: 1 },
        ],
    },
];

/**
 * Get visible indikators (not hidden) grouped by group name.
 */
export function getGroupedIndikators() {
    const groups = {};
    for (const ind of INDIKATOR_CONFIG) {
        if (ind.hidden) continue;
        if (!groups[ind.group]) groups[ind.group] = [];
        groups[ind.group].push(ind);
    }
    return groups;
}

/**
 * Get ALL indikators (including hidden) grouped by group name.
 */
export function getAllGroupedIndikators() {
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
 * All indikator kd_sub_sub codes (for Excel columns — includes hidden).
 */
export const INDIKATOR_COLUMNS = INDIKATOR_CONFIG.map((i) => i.kd_sub_sub);

/**
 * Only visible indikators (for progress calculation).
 */
export const VISIBLE_INDIKATORS = INDIKATOR_CONFIG.filter((i) => !i.hidden);

/**
 * Cara evaluasi options.
 */
export const CARA_EVALUASI_OPTIONS = ['On Desk', 'Peninjauan Lapangan'];
