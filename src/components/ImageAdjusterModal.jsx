import React, { useState, useRef, useEffect } from 'react';
import { X, ZoomIn, ZoomOut, RotateCw, Check, Move, Crop, Maximize, RefreshCw } from 'lucide-react';

export const ImageAdjusterModal = ({ imageSrc, isOpen, onCancel, onSave }) => {
  const [zoom, setZoom] = useState(0.7);
  const [rotation, setRotation] = useState(0);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });

  const imageRef = useRef(null);

  // Auto-fit image when opened
  const handleImageLoaded = () => {
    const img = imageRef.current;
    if (!img) return;
    // Calculate initial scale to comfortably fit whole photo inside circular guide
    const naturalRatio = img.naturalWidth / img.naturalHeight;
    if (naturalRatio < 1) {
      // Tall portrait photo -> start at zoomed out scale (0.55 - 0.7)
      setZoom(0.6);
    } else {
      setZoom(0.75);
    }
    setPosition({ x: 0, y: 0 });
  };

  useEffect(() => {
    if (isOpen) {
      setRotation(0);
      setPosition({ x: 0, y: 0 });
      setIsDragging(false);
    }
  }, [isOpen, imageSrc]);

  if (!isOpen || !imageSrc) return null;

  // Mouse Drag handlers for panning
  const handleMouseDown = (e) => {
    setIsDragging(true);
    setDragStart({
      x: e.clientX - position.x,
      y: e.clientY - position.y
    });
  };

  const handleMouseMove = (e) => {
    if (!isDragging) return;
    setPosition({
      x: e.clientX - dragStart.x,
      y: e.clientY - dragStart.y
    });
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  // Mouse Wheel Zoom
  const handleWheel = (e) => {
    e.preventDefault();
    const delta = e.deltaY > 0 ? -0.05 : 0.05;
    setZoom(prev => Math.min(Math.max(parseFloat((prev + delta).toFixed(2)), 0.15), 3.0));
  };

  // Touch handlers for mobile
  const handleTouchStart = (e) => {
    if (e.touches.length === 1) {
      setIsDragging(true);
      setDragStart({
        x: e.touches[0].clientX - position.x,
        y: e.touches[0].clientY - position.y
      });
    }
  };

  const handleTouchMove = (e) => {
    if (!isDragging || e.touches.length !== 1) return;
    setPosition({
      x: e.touches[0].clientX - dragStart.x,
      y: e.touches[0].clientY - dragStart.y
    });
  };

  // Crop & Export function via HTML5 Canvas
  const handleApplyCrop = () => {
    const canvas = document.createElement('canvas');
    const size = 400; // High resolution square output
    canvas.width = size;
    canvas.height = size;
    const ctx = canvas.getContext('2d');

    const img = imageRef.current;
    if (!img) return;

    ctx.fillStyle = '#0f172a';
    ctx.fillRect(0, 0, size, size);

    ctx.save();
    // Translate to center of canvas
    ctx.translate(size / 2, size / 2);
    ctx.rotate((rotation * Math.PI) / 180);
    ctx.scale(zoom, zoom);

    // Calculate dimensions maintaining aspect ratio relative to viewport
    const imgAspect = img.naturalWidth / img.naturalHeight;
    let drawWidth = size;
    let drawHeight = size;

    if (imgAspect > 1) {
      drawWidth = size * imgAspect;
    } else {
      drawHeight = size / imgAspect;
    }

    // Scale position offset from viewport (approx 340px) to canvas output (400px)
    const positionScale = size / 340;

    ctx.drawImage(
      img,
      -drawWidth / 2 + position.x * positionScale,
      -drawHeight / 2 + position.y * positionScale,
      drawWidth,
      drawHeight
    );

    ctx.restore();

    // Export high-quality JPEG data URL
    const croppedDataUrl = canvas.toDataURL('image/jpeg', 0.95);
    onSave(croppedDataUrl);
  };

  return (
    <div
      className="fixed inset-0 z-50 bg-slate-950/90 backdrop-blur-md flex items-center justify-center p-4 animate-fade-in select-none"
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
    >
      <div className="bg-slate-900 border border-slate-800 rounded-3xl shadow-2xl max-w-lg w-full overflow-hidden flex flex-col p-6 space-y-4 text-white">
        
        {/* Top Header */}
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <div className="flex items-center gap-2.5">
            <div className="p-2 bg-indigo-600/20 text-indigo-400 rounded-xl">
              <Crop className="w-5 h-5 text-indigo-400" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white tracking-tight">Adjust & Position Profile Picture</h3>
              <p className="text-xs text-slate-400">Drag photo to center your face • Scroll or use slider to zoom</p>
            </div>
          </div>
          <button
            type="button"
            onClick={onCancel}
            className="p-1.5 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Extra Spacious Interactive Crop Viewport */}
        <div
          className="relative w-80 h-80 sm:w-96 sm:h-96 mx-auto rounded-2xl overflow-hidden bg-slate-950 border-2 border-indigo-500/40 shadow-2xl flex items-center justify-center cursor-grab active:cursor-grabbing"
          onMouseDown={handleMouseDown}
          onWheel={handleWheel}
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleMouseUp}
        >
          {/* Draggable & Zoomable Image */}
          <img
            ref={imageRef}
            src={imageSrc}
            onLoad={handleImageLoaded}
            alt="Crop Preview"
            style={{
              transform: `translate(${position.x}px, ${position.y}px) scale(${zoom}) rotate(${rotation}deg)`,
              transition: isDragging ? 'none' : 'transform 0.08s ease-out'
            }}
            className="max-w-none pointer-events-none"
            draggable={false}
          />

          {/* Circular Crop Guide Mask with Dark Vignette */}
          <div className="absolute inset-0 pointer-events-none flex items-center justify-center">
            <div className="w-64 h-64 sm:w-72 sm:h-72 rounded-full border-2 border-indigo-400 shadow-[0_0_0_9999px_rgba(15,23,42,0.72)] ring-4 ring-indigo-400/20"></div>
          </div>

          <div className="absolute top-3 left-3 px-2.5 py-1 rounded-full bg-slate-900/80 backdrop-blur text-[11px] text-slate-300 font-mono flex items-center gap-1.5 shadow">
            <Move className="w-3.5 h-3.5 text-indigo-400 animate-pulse" /> Drag freely in any direction
          </div>

          <div className="absolute bottom-3 right-3 px-2.5 py-1 rounded-full bg-slate-900/80 backdrop-blur text-[10px] text-indigo-300 font-mono shadow">
            Scroll mouse wheel to zoom
          </div>
        </div>

        {/* Interactive Controls Bar */}
        <div className="space-y-3 bg-slate-950/80 p-4 rounded-2xl border border-slate-800">
          
          {/* Zoom Slider */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between text-xs text-slate-300">
              <span className="flex items-center gap-1.5 font-semibold text-slate-300">
                <ZoomIn className="w-4 h-4 text-indigo-400" /> Zoom Level
              </span>
              <span className="font-mono text-indigo-400 font-bold text-xs bg-indigo-500/10 px-2 py-0.5 rounded border border-indigo-500/20">
                {Math.round(zoom * 100)}%
              </span>
            </div>
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => setZoom(prev => Math.max(parseFloat((prev - 0.1).toFixed(2)), 0.15))}
                className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition"
                title="Zoom Out"
              >
                <ZoomOut className="w-4 h-4" />
              </button>
              <input
                type="range"
                min="0.15"
                max="3.0"
                step="0.02"
                value={zoom}
                onChange={(e) => setZoom(parseFloat(e.target.value))}
                className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-indigo-500"
              />
              <button
                type="button"
                onClick={() => setZoom(prev => Math.min(parseFloat((prev + 0.1).toFixed(2)), 3.0))}
                className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition"
                title="Zoom In"
              >
                <ZoomIn className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Quick Fit, Rotate & Reset Controls */}
          <div className="flex items-center justify-between pt-2 border-t border-slate-800/80 text-xs">
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => {
                  setZoom(0.5);
                  setPosition({ x: 0, y: 0 });
                }}
                className="px-3 py-1.5 bg-slate-800 hover:bg-indigo-600/30 hover:border-indigo-500/40 border border-slate-700 text-slate-300 hover:text-white rounded-lg transition flex items-center gap-1.5 text-xs font-semibold"
                title="Zoom out to fit whole portrait"
              >
                <Maximize className="w-3.5 h-3.5 text-indigo-400" /> Fit Whole Photo
              </button>
              <button
                type="button"
                onClick={() => setRotation(prev => (prev + 90) % 360)}
                className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white rounded-lg transition flex items-center gap-1.5 text-xs font-medium"
              >
                <RotateCw className="w-3.5 h-3.5 text-indigo-400" /> Rotate 90°
              </button>
            </div>
            
            <button
              type="button"
              onClick={() => {
                setZoom(0.7);
                setRotation(0);
                setPosition({ x: 0, y: 0 });
              }}
              className="px-2.5 py-1.5 text-slate-400 hover:text-white transition text-xs flex items-center gap-1"
            >
              <RefreshCw className="w-3 h-3" /> Reset
            </button>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center justify-end gap-3 pt-1">
          <button
            type="button"
            onClick={onCancel}
            className="px-4 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl text-xs font-semibold transition"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleApplyCrop}
            className="px-6 py-2.5 bg-indigo-600 hover:bg-indigo-500 active:bg-indigo-700 text-white rounded-xl text-xs font-extrabold shadow-lg shadow-indigo-600/30 transition flex items-center gap-2"
          >
            <Check className="w-4 h-4" />
            <span>Apply Crop & Set Photo</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default ImageAdjusterModal;
