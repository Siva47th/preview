import React, { useState, useRef, useEffect } from 'react';
import { X, ZoomIn, ZoomOut, RotateCw, Check, Move, Crop } from 'lucide-react';

export const ImageAdjusterModal = ({ imageSrc, isOpen, onCancel, onSave }) => {
  const [zoom, setZoom] = useState(1);
  const [rotation, setRotation] = useState(0);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });

  const canvasRef = useRef(null);
  const imageRef = useRef(null);

  // Reset adjustments on open
  useEffect(() => {
    if (isOpen) {
      setZoom(1);
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
    const size = 320; // High resolution output square
    canvas.width = size;
    canvas.height = size;
    const ctx = canvas.getContext('2d');

    const img = imageRef.current;
    if (!img) return;

    // Clean background
    ctx.fillStyle = '#0f172a';
    ctx.fillRect(0, 0, size, size);

    ctx.save();
    // Translate to center of canvas
    ctx.translate(size / 2, size / 2);
    ctx.rotate((rotation * Math.PI) / 180);
    ctx.scale(zoom, zoom);

    // Calculate dimensions maintaining aspect ratio
    const imgAspect = img.naturalWidth / img.naturalHeight;
    let drawWidth = size;
    let drawHeight = size;

    if (imgAspect > 1) {
      drawWidth = size * imgAspect;
    } else {
      drawHeight = size / imgAspect;
    }

    // Draw with position offset
    ctx.drawImage(
      img,
      -drawWidth / 2 + position.x,
      -drawHeight / 2 + position.y,
      drawWidth,
      drawHeight
    );

    ctx.restore();

    // Export high-quality WebP / JPEG data URL
    const croppedDataUrl = canvas.toDataURL('image/jpeg', 0.92);
    onSave(croppedDataUrl);
  };

  return (
    <div
      className="fixed inset-0 z-50 bg-slate-950/85 backdrop-blur-md flex items-center justify-center p-4 animate-fade-in select-none"
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
    >
      <div className="bg-slate-900 border border-slate-800 rounded-3xl shadow-2xl max-w-md w-full overflow-hidden flex flex-col p-6 space-y-5 text-white">
        
        {/* Top Header */}
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <div className="flex items-center gap-2">
            <div className="p-1.5 bg-indigo-600/20 text-indigo-400 rounded-lg">
              <Crop className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-white">Adjust Profile Picture</h3>
              <p className="text-[10px] text-slate-400">Drag to position, zoom and rotate your image</p>
            </div>
          </div>
          <button
            type="button"
            onClick={onCancel}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Interactive Crop Viewport with Circular Mask */}
        <div
          className="relative w-64 h-64 sm:w-72 sm:h-72 mx-auto rounded-2xl overflow-hidden bg-slate-950 border-2 border-indigo-500/40 shadow-inner flex items-center justify-center cursor-grab active:cursor-grabbing"
          onMouseDown={handleMouseDown}
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleMouseUp}
        >
          {/* Draggable & Zoomable Image */}
          <img
            ref={imageRef}
            src={imageSrc}
            alt="Crop Preview"
            style={{
              transform: `translate(${position.x}px, ${position.y}px) scale(${zoom}) rotate(${rotation}deg)`,
              transition: isDragging ? 'none' : 'transform 0.1s ease-out'
            }}
            className="max-w-none pointer-events-none"
            draggable={false}
          />

          {/* Circular Crop Guide Mask */}
          <div className="absolute inset-0 pointer-events-none flex items-center justify-center">
            <div className="w-56 h-56 rounded-full border-2 border-indigo-400/80 shadow-[0_0_0_9999px_rgba(15,23,42,0.65)] ring-2 ring-indigo-400/20"></div>
          </div>

          <div className="absolute top-2 left-2 px-2 py-0.5 rounded bg-slate-900/80 backdrop-blur text-[10px] text-slate-300 font-mono flex items-center gap-1">
            <Move className="w-3 h-3 text-indigo-400" /> Drag to position
          </div>
        </div>

        {/* Interactive Controls Bar */}
        <div className="space-y-3 bg-slate-950/60 p-3.5 rounded-2xl border border-slate-800/80">
          
          {/* Zoom Slider */}
          <div className="space-y-1">
            <div className="flex items-center justify-between text-xs text-slate-300">
              <span className="flex items-center gap-1 text-[11px] font-semibold text-slate-400">
                <ZoomIn className="w-3.5 h-3.5 text-indigo-400" /> Zoom Scale
              </span>
              <span className="font-mono text-indigo-400 font-bold text-[11px]">{Math.round(zoom * 100)}%</span>
            </div>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setZoom(prev => Math.max(prev - 0.2, 0.5))}
                className="p-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white"
              >
                <ZoomOut className="w-3.5 h-3.5" />
              </button>
              <input
                type="range"
                min="0.5"
                max="3.0"
                step="0.05"
                value={zoom}
                onChange={(e) => setZoom(parseFloat(e.target.value))}
                className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-indigo-500"
              />
              <button
                type="button"
                onClick={() => setZoom(prev => Math.min(prev + 0.2, 3.0))}
                className="p-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white"
              >
                <ZoomIn className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* Rotate & Reset Controls */}
          <div className="flex items-center justify-between pt-1 border-t border-slate-800/60 text-xs">
            <button
              type="button"
              onClick={() => setRotation(prev => (prev + 90) % 360)}
              className="px-2.5 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white rounded-lg transition flex items-center gap-1.5 text-[11px] font-medium"
            >
              <RotateCw className="w-3.5 h-3.5 text-indigo-400" /> Rotate 90°
            </button>
            
            <button
              type="button"
              onClick={() => {
                setZoom(1);
                setRotation(0);
                setPosition({ x: 0, y: 0 });
              }}
              className="px-2.5 py-1.5 text-slate-400 hover:text-slate-200 transition text-[11px]"
            >
              Reset Position
            </button>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center justify-end gap-2.5 pt-1">
          <button
            type="button"
            onClick={onCancel}
            className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl text-xs font-semibold transition"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleApplyCrop}
            className="px-5 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-bold shadow-lg shadow-indigo-600/30 transition flex items-center gap-1.5"
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
