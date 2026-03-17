import { Trash2, Sparkles, CheckCircle2, XCircle, Clock, Loader2 } from 'lucide-react';

const GEN_STATUS = {
  pending:    { label: 'Not Generated', color: 'bg-gray-100 text-gray-500', icon: Clock },
  processing: { label: 'Generating…',  color: 'bg-blue-100 text-blue-600', icon: null },
  completed:  { label: 'Generated',    color: 'bg-green-100 text-green-600', icon: CheckCircle2 },
  failed:     { label: 'Failed',       color: 'bg-red-100 text-red-500', icon: XCircle },
};

export default function GarmentQueueCard({ garment, onSelect, onDelete, isSelected }) {
  const cfg = GEN_STATUS[garment.genStatus] || GEN_STATUS.pending;
  const Icon = cfg.icon;
  const isUploading = garment.uploadStatus === 'uploading';
  const uploadError = garment.uploadStatus === 'error';

  // Use local preview immediately, fall back to file_url once uploaded
  const displayUrl = garment.preview || garment.file_url;

  return (
    <div
      className={`bg-white rounded-2xl overflow-hidden border-2 transition-all ${
        isSelected ? 'border-[#E8B86D] shadow-md scale-[1.01]' : 'border-gray-100 hover:border-gray-200'
      }`}
    >
      {/* Image */}
      <div
        className="relative cursor-pointer"
        style={{ aspectRatio: '3/4' }}
        onClick={() => !isUploading && garment.genStatus !== 'processing' && onSelect(garment)}
      >
        {displayUrl ? (
          <img src={displayUrl} alt="Garment" className="w-full h-full object-cover" />
        ) : (
          <div className="w-full h-full bg-gray-100 flex items-center justify-center">
            <Loader2 size={24} className="text-gray-300 animate-spin" />
          </div>
        )}

        {/* Upload overlay */}
        {isUploading && (
          <div className="absolute inset-0 bg-black/30 flex flex-col items-center justify-center gap-1.5">
            <div className="w-6 h-6 border-3 border-white/30 border-t-white rounded-full animate-spin" />
            <p className="text-white text-[10px] font-dm font-medium">Uploading…</p>
          </div>
        )}

        {/* Upload error */}
        {uploadError && (
          <div className="absolute inset-0 bg-red-500/20 flex items-center justify-center">
            <XCircle size={28} className="text-red-500" />
          </div>
        )}

        {/* Generation processing */}
        {garment.genStatus === 'processing' && (
          <div className="absolute inset-0 bg-white/70 flex items-center justify-center">
            <div className="w-8 h-8 border-4 border-[#E8B86D]/30 border-t-[#E8B86D] rounded-full animate-spin" />
          </div>
        )}

        {/* Result thumbnail */}
        {garment.genStatus === 'completed' && garment.result_url && (
          <div className="absolute inset-0 flex items-end p-2">
            <img
              src={garment.result_url}
              alt="Result"
              className="w-10 h-10 object-cover rounded-xl border-2 border-white shadow"
            />
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="p-2 flex flex-col gap-1.5">
        {isUploading ? (
          <span className="inline-flex items-center gap-1 text-[10px] font-dm font-semibold px-2 py-1 rounded-full self-start bg-blue-50 text-blue-500">
            <Loader2 size={10} className="animate-spin" /> Uploading…
          </span>
        ) : uploadError ? (
          <span className="inline-flex items-center gap-1 text-[10px] font-dm font-semibold px-2 py-1 rounded-full self-start bg-red-100 text-red-500">
            <XCircle size={10} /> Upload failed
          </span>
        ) : (
          <span className={`inline-flex items-center gap-1 text-[10px] font-dm font-semibold px-2 py-1 rounded-full self-start ${cfg.color}`}>
            {Icon && <Icon size={10} />}
            {cfg.label}
          </span>
        )}

        <div className="flex gap-1.5">
          {!isUploading && !uploadError && garment.genStatus !== 'processing' && garment.genStatus !== 'completed' && (
            <button
              onClick={() => onSelect(garment)}
              className="flex-1 flex items-center justify-center gap-1 py-2 bg-[#1A1A2E] text-white rounded-xl text-xs font-dm font-semibold min-h-[36px]"
            >
              <Sparkles size={11} className="text-[#E8B86D]" />
              Generate
            </button>
          )}
          {garment.genStatus === 'completed' && (
            <button
              onClick={() => onSelect(garment)}
              className="flex-1 flex items-center justify-center gap-1 py-2 bg-[#E8B86D]/10 text-[#1A1A2E] border border-[#E8B86D]/30 rounded-xl text-xs font-dm font-semibold min-h-[36px]"
            >
              Regenerate
            </button>
          )}
          <button
            onClick={(e) => { e.stopPropagation(); onDelete(garment.id); }}
            className="flex items-center justify-center w-9 py-2 bg-red-50 text-red-400 rounded-xl min-h-[36px]"
          >
            <Trash2 size={12} />
          </button>
        </div>
      </div>
    </div>
  );
}