import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useLiveQuery } from 'dexie-react-hooks';
import { db } from '../db';
import {
    ArrowLeft,
    Search,
    Download,
    ChevronRight,
    CheckCircle2,
    Clock,
    Circle,
    Filter,
} from 'lucide-react';

export default function AsetListPage() {
    const { paketId } = useParams();
    const navigate = useNavigate();
    const [search, setSearch] = useState('');
    const [filterStatus, setFilterStatus] = useState('all');

    const paket = useLiveQuery(() => db.pakets.get(Number(paketId)), [paketId]);
    const asets = useLiveQuery(
        () => db.asets.where('paket_id').equals(Number(paketId)).toArray(),
        [paketId]
    );

    if (!paket) return null;

    const filtered = (asets || []).filter((a) => {
        const matchSearch =
            !search ||
            a.kd_brg.toLowerCase().includes(search.toLowerCase()) ||
            a.no_aset.includes(search) ||
            a.ur_sskel.toLowerCase().includes(search.toLowerCase());

        const matchStatus = filterStatus === 'all' || a.status === filterStatus;

        return matchSearch && matchStatus;
    });

    const total = asets?.length || 0;
    const done = asets?.filter((a) => a.status === 'done').length || 0;
    const partial = asets?.filter((a) => a.status === 'partial').length || 0;
    const empty = total - done - partial;

    const statusIcon = (status) => {
        switch (status) {
            case 'done':
                return <CheckCircle2 size={18} className="text-emerald-400" />;
            case 'partial':
                return <Clock size={18} className="text-amber-400" />;
            default:
                return <Circle size={18} className="text-[--color-text-dim] opacity-40" />;
        }
    };

    return (
        <div className="min-h-dvh pb-24">
            {/* Header */}
            <div className="page-header">
                <div className="flex items-center gap-3 mb-3">
                    <button onClick={() => navigate('/')} className="p-1 -ml-1">
                        <ArrowLeft size={22} />
                    </button>
                    <div className="flex-1 min-w-0">
                        <h1 className="text-base font-bold truncate">{paket.no_paket}</h1>
                        <p className="text-xs text-[--color-text-dim] truncate">{paket.ur_satker}</p>
                    </div>
                </div>

                {/* Stats strip */}
                <div className="flex gap-2 mb-3">
                    {[
                        { label: 'Total', val: total, style: 'bg-blue-500/15 text-blue-400' },
                        { label: 'Selesai', val: done, style: 'bg-emerald-500/15 text-emerald-400' },
                        { label: 'Sebagian', val: partial, style: 'bg-amber-500/15 text-amber-400' },
                        { label: 'Belum', val: empty, style: 'bg-white/5 text-[--color-text-dim]' },
                    ].map((s) => (
                        <div key={s.label} className={`flex-1 rounded-xl py-2 text-center ${s.style}`}>
                            <div className="text-base font-bold">{s.val}</div>
                            <div className="text-[10px] opacity-70">{s.label}</div>
                        </div>
                    ))}
                </div>

                {/* Search */}
                <div className="relative">
                    <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-[--color-text-dim]" />
                    <input
                        className="input-field pl-9 text-sm"
                        placeholder="Cari kd barang, NUP, uraian..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                    />
                </div>

                {/* Filter */}
                <div className="flex gap-2 mt-3">
                    {[
                        { key: 'all', label: 'Semua' },
                        { key: 'empty', label: 'Belum' },
                        { key: 'partial', label: 'Sebagian' },
                        { key: 'done', label: 'Selesai' },
                    ].map((f) => (
                        <button
                            key={f.key}
                            onClick={() => setFilterStatus(f.key)}
                            className={`text-xs px-3 py-1.5 rounded-full transition-colors ${filterStatus === f.key
                                    ? 'bg-blue-500/20 text-blue-400 font-medium'
                                    : 'bg-white/5 text-[--color-text-dim]'
                                }`}
                        >
                            {f.label}
                        </button>
                    ))}
                </div>
            </div>

            {/* Aset List */}
            <div className="px-5 space-y-2">
                {filtered.map((a, i) => (
                    <div
                        key={a.id}
                        className="glass-card px-4 py-3 flex items-center gap-3 cursor-pointer"
                        onClick={() => navigate(`/aset/${a.id}`)}
                    >
                        {statusIcon(a.status)}
                        <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2">
                                <span className="text-xs font-mono text-blue-400">{a.kd_brg}</span>
                                <span className="text-xs text-[--color-text-dim]">NUP {a.no_aset}</span>
                            </div>
                            <p className="text-sm truncate mt-0.5">{a.ur_sskel || '-'}</p>
                        </div>
                        <ChevronRight size={16} className="text-[--color-text-dim] flex-shrink-0" />
                    </div>
                ))}

                {filtered.length === 0 && (
                    <p className="text-center text-[--color-text-dim] text-sm py-8">
                        {search ? 'Tidak ditemukan' : 'Belum ada aset'}
                    </p>
                )}
            </div>

            {/* FAB - Export */}
            <button
                onClick={() => navigate(`/export/${paketId}`)}
                className="fab btn-primary"
                title="Export Excel"
            >
                <Download size={22} />
            </button>
        </div>
    );
}
