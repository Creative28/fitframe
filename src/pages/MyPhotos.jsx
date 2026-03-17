import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { base44 } from '@/api/base44Client';
import AppHeader from '@/components/layout/AppHeader';
import { Download, Trash2, RefreshCw, Link2, Plus, Check } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';

export default function MyPhotos() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [photos, setPhotos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deletingId, setDeletingId] = useState(null);
  const [tryOnUrl, setTryOnUrl] = useState(null);

  useEffect(() => {
    loadPhotos();
  }, []);

  const loadPhotos = async () => {
    try {
      const user = await base44.auth.me();
      const results = await base44.entities.Photo.filter(
        { created_by: user.email },
        '-created_date',
        50
      );
      setPhotos(results);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (photo) => {
    setDeletingId(photo.id);
    try {
      await base44.entities.Photo.delete(photo.id);
      setPhotos(prev => prev.filter(p => p.id !== photo.id));
    } catch (e) {
      console.error(e);
    } finally {
      setDeletingId(null);
    }
  };

  const handleDownload = async (url, format = 'original') => {
    if (!url) return;
    try {
      const response = await fetch(url);
      const blob = await response.blob();
      const blobUrl = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = blobUrl;
      link.download = `just-fit-it-${format}-${Date.now()}.jpg`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(blobUrl);
    } catch {
      window.open(url, '_blank');
    }
  };

  const handleCreateTryOnLink = async (photo) => {
    const garmentId = photo.garment_id;
    if (!garmentId) return;
    const code = Math.random().toString(36).substring(2, 10);
    await base44.entities.TryOnLink.create({
      garment_id: garmentId,
      unique_code: code,
      garment_image_url: photo.generated_image_url,
      views_count: 0,
      completions_count: 0,
      is_active: true,
    });
    const url = `${window.location.origin}/try/${code}`;
    try {
      await navigator.clipboard.writeText(url);
    } catch {
      // clipboard may be unavailable
    }
    // Show modal with the URL so user can manually copy/share
    setTryOnUrl(url);
  };
  if (loading) {
    return (
      <div className="min-h-screen bg-[#FAFAF8]">
        <AppHeader title="My Photos" />
        <div className="flex justify-center py-20">
          <div className="w-8 h-8 border-4 border-[#E8B86D]/30 border-t-[#E8B86D] rounded-full animate-spin" />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FAFAF8] pb-28">
      <AppHeader title="My Photos" />

      <div className="px-4 py-4">
        {photos.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 gap-4 text-center">
            <div className="w-20 h-20 rounded-full bg-gray-100 flex items-center justify-center text-4xl">📸</div>
            <h3 className="font-playfair text-xl font-bold text-[#1A1A2E]">No photos yet</h3>
            <p className="text-gray-400 font-dm text-sm max-w-xs">Generate your first model photo in the Studio</p>
            <button
              onClick={() => navigate('/studio')}
              className="flex items-center gap-2 px-6 py-3.5 bg-[#1A1A2E] text-white rounded-2xl font-dm font-semibold text-sm min-h-[48px]"
            >
              <Plus size={16} />
              Create Your First Photo
            </button>
          </div>
        ) : (
          <>
            <p className="text-sm font-dm text-gray-400 mb-4">{photos.length} photo{photos.length !== 1 ? 's' : ''} saved</p>
            <div className="grid grid-cols-2 gap-3">
              {photos.map(photo => (
                <PhotoCard
                  key={photo.id}
                  photo={photo}
                  onDelete={handleDelete}
                  onDownload={handleDownload}
                  onTryOn={handleCreateTryOnLink}
                  onRegenerate={() => navigate('/studio')}
                  isDeleting={deletingId === photo.id}
                />
              ))}
            </div>
          </>
        )}
      </div>
    </div>

      {/* Try-On Link Modal */}
      {tryOnUrl && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-end justify-center sm:items-center px-4">
          <div className="bg-white rounded-t-3xl sm:rounded-3xl w-full max-w-md p-6 pb-10">
            <h2 className="font-playfair text-xl font-bold text-[#1A1A2E] mb-1">✅ Try-On Link Ready!</h2>
            <p className="text-sm font-dm text-gray-500 mb-4">Copy the link below and send it to your customer via WhatsApp, DM, or anywhere.</p>
            <div className="flex items-center gap-2 bg-gray-50 border border-gray-200 rounded-xl px-3 py-3 mb-4">
              <span className="text-xs font-dm text-gray-700 break-all flex-1">{tryOnUrl}</span>
            </div>
            <div className="flex flex-col gap-2">
              <button
                onClick={() => {
                  navigator.clipboard.writeText(tryOnUrl).catch(() => {});
                  toast({ title: 'Copied!', description: 'Link copied to clipboard' });
                }}
                className="w-full py-3.5 bg-[#1A1A2E] text-white rounded-2xl font-dm font-semibold text-sm"
              >
                📋 Copy Link
              </button>
              <a
                href={`https://wa.me/?text=${encodeURIComponent('Try on this item: ' + tryOnUrl)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full py-3.5 bg-[#25D366] text-white rounded-2xl font-dm font-semibold text-sm text-center"
              >
                💬 Share via WhatsApp
              </a>
              <button
                onClick={() => setTryOnUrl(null)}
                className="w-full py-3 text-gray-400 font-dm text-sm"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function PhotoCard({ photo, onDelete, onDownload, onTryOn, onRegenerate, isDeleting }) {
  const [showActions, setShowActions] = useState(false);

  return (
    <div className="bg-white rounded-2xl overflow-hidden border border-gray-100 shadow-sm">
      <div
        className="relative cursor-pointer"
        style={{ aspectRatio: '3/4' }}
        onClick={() => setShowActions(!showActions)}
      >
        <img
          src={photo.generated_image_url}
          alt="Generated photo"
          className="w-full h-full object-cover"
        />
        {isDeleting && (
          <div className="absolute inset-0 bg-white/70 flex items-center justify-center">
            <div className="w-6 h-6 border-2 border-[#E8B86D]/30 border-t-[#E8B86D] rounded-full animate-spin" />
          </div>
        )}
      </div>

      {showActions && (
        <div className="p-2 flex flex-col gap-1.5">
          <button
            onClick={() => onDownload(photo.generated_image_url)}
            className="flex items-center gap-2 w-full px-3 py-2 bg-[#1A1A2E] text-white rounded-xl text-xs font-dm font-semibold min-h-[36px]"
          >
            <Download size={13} /> Download
          </button>
          <div className="grid grid-cols-2 gap-1.5">
            <button
              onClick={() => onTryOn(photo)}
              className="flex items-center justify-center gap-1.5 py-2 bg-[#E8B86D]/10 text-[#1A1A2E] rounded-xl text-xs font-dm font-semibold min-h-[36px] border border-[#E8B86D]/30"
            >
              <Link2 size={11} /> Try-On
            </button>
            <button
              onClick={() => onDelete(photo)}
              disabled={isDeleting}
              className="flex items-center justify-center gap-1.5 py-2 bg-red-50 text-red-500 rounded-xl text-xs font-dm font-semibold min-h-[36px]"
            >
              <Trash2 size={11} /> Delete
            </button>
          </div>
        </div>
      )}
    </div>
  );
}