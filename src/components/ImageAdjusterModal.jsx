import React, { useState, useRef, useEffect } from 'react';
import { X, ZoomIn, ZoomOut, RotateCw, Check, Move, Crop, Maximize, RefreshCw } from 'lucide-react';

const VIEWPORT_SIZE = 300;  // Viewport box width & height in px (mobile friendly)
const CROP_CIRCLE_SIZE = 240; // Diameter of the circle crop guide in px
const OUTPUT_SIZE = 600;    // Canvas output dimension in px

export const ImageAdjusterModal = ({ imageSrc, isOpen, onCancel, onSave }) => {
  const [zoom, setZoom] = useState(1);
  const [rotation, setRotation] = useState(0);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [imgDimensions, setImgDimensions] = useState({ width: CROP_CIRCLE_SIZE, height: CROP_CIRCLE_SIZE });

  const imageRef = useRef(null);

  // Measure natural dimensions & auto-fit on load
  const handleImageLoaded = () => {
    const img = imageRef.current;
    if (!img) return;

    const naturalWidth = img.naturalWidth || 600;
    const naturalHeight = img.naturalHeight || 600;
    const naturalAspect = naturalWidth / naturalHeight;

    let baseW = CROP_CIRCLE_SIZE;
    let baseH = CROP_CIRCLE_SIZE;

    if (naturalAspect >= 1) {
      baseW = CROP_CIRCLE_SIZE * naturalAspect;
      baseH = CROP_CIRCLE_SIZE;
    } else {
      baseW = CROP_CIRCLE_SIZE;
      baseH = CROP_CIRCLE_SIZE / naturalAspect;
    }

    setImgDimensions({ width: baseW, height: baseH });
    setZoom(1);
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
    setZoom(prev => Math.min(Math.max(parseFloat((prev + delta).toFixed(2)), 0.3), 3.5));
  };

  // Touch handlers for mobile devices
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

  // 100% Mathematically Exact 1:1 Canvas Crop
  const handleApplyCrop = () => {
    const canvas = document.createElement('canvas');
    canvas.width = OUTPUT_SIZE;
    canvas.height = OUTPUT_SIZE;
    const ctx = canvas.getContext('2d');

    const img = imageRef.current;
    if (!img) return;

    // Enable high quality anti-aliasing
    ctx.imageSmoothingEnabled = true;
    ctx.imageSmoothingQuality = 'high';

    // Fill background
    ctx.fillStyle = '#0f172a';
    ctx.fillRect(0, 0, OUTPUT_SIZE, OUTPUT_SIZE);

    // Scale factor from Circle Guide in DOM to Canvas Output
    const scaleFactor = OUTPUT_SIZE / CROP_CIRCLE_SIZE;

    ctx.save();
    // 1. Move to center of the crop circle
    ctx.translate(OUTPUT_SIZE / 2, OUTPUT_SIZE / 2);

    // 2. Apply drag translation
    ctx.translate(position.x * scaleFactor, position.y * scaleFactor);

    // 3. Apply rotation
    ctx.rotate((rotation * Math.PI) / 180);

    // 4. Apply zoom scaling
    ctx.scale(zoom * scaleFactor, zoom * scaleFactor);

    // 5. Draw image centered
    ctx.drawImage(
      img,
      -imgDimensions.width / 2,
      -imgDimensions.height / 2,
      imgDimensions.width,
      imgDimensions.height
    );

    ctx.restore();

    // Export ultra-clear JPEG data URL
    const croppedDataUrl = canvas.toDataURL('image/jpeg', 0.96);
    onSave(croppedDataUrl);
  };

  return (
    <div
      className="fixed inset-0 z-50 bg-slate-950/90 backdrop-blur-md flex items-center justify-center p-4 animate-fade-in select-none"
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
    >
      <div className="bg-slate-900 border border-slate-800 rounded-3xl shadow-2xl max-w-lg w-full overflow-hidden flex flex-col p-6 space-y-4 text-white">
        
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <div className="flex items-center gap-2.5">
            <div className="p-2 bg-indigo-600/20 text-indigo-400 rounded-xl">
              <Crop className="w-5 h-5 text-indigo-400" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white tracking-tight">Adjust & Position Profile Photo</h3>
              <p className="text-xs text-slate-400">Everything inside the circle will be saved as your profile picture</p>
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

        {/* Viewport Box */}
        <div
          style={{ width: `${VIEWPORT_SIZE}px`, height: `${VIEWPORT_SIZE}px` }}
          className="relative mx-auto rounded-2xl overflow-hidden bg-slate-950 border-2 border-indigo-500/40 shadow-2xl flex items-center justify-center cursor-grab active:cursor-grabbing"
          onMouseDown={handleMouseDown}
          onWheel={handleWheel}
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleMouseUp}
        >
          {/* Base-sized image matching exact coordinate space */}
          <img
            ref={imageRef}
            src={imageSrc}
            onLoad={handleImageLoaded}
            alt="Crop Preview"
            style={{
              width: `${imgDimensions.width}px`,
              height: `${imgDimensions.height}px`,
              minWidth: `${imgDimensions.width}px`,
              minHeight: `${imgDimensions.height}px`,
              transform: `translate(${position.x}px, ${position.y}px) rotate(${rotation}deg) scale(${zoom})`,
              transition: isDragging ? 'none' : 'transform 0.05s ease-out',
              imageRendering: 'auto'
            }}
            className="pointer-events-none select-none max-w-none"
            draggable={false}
          />

          {/* Exact Circular Crop Guide Mask */}
          <div className="absolute inset-0 pointer-events-none flex items-center justify-center">
            <div
              style={{ width: `${CROP_CIRCLE_SIZE}px`, height: `${CROP_CIRCLE_SIZE}px` }}
              className="rounded-full border-2 border-indigo-400 shadow-[0_0_0_9999px_rgba(15,23,42,0.82)] ring-4 ring-indigo-400/20"
            ></div>
          </div>

          <div className="absolute top-3 left-3 px-2.5 py-1 rounded-full bg-slate-900/85 backdrop-blur text-[11px] text-slate-300 font-mono flex items-center gap-1.5 shadow">
            <Move className="w-3.5 h-3.5 text-indigo-400 animate-pulse" /> Drag freely
          </div>

          <div className="absolute bottom-3 right-3 px-2.5 py-1 rounded-full bg-slate-900/85 backdrop-blur text-[10px] text-indigo-300 font-mono shadow">
            Scroll to zoom
          </div>
        </div>

        {/* Controls Bar */}
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
                onClick={() => setZoom(prev => Math.max(parseFloat((prev - 0.1).toFixed(2)), 0.3))}
                className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition"
                title="Zoom Out"
              >
                <ZoomOut className="w-4 h-4" />
              </button>
              <input
                type="range"
                min="0.3"
                max="3.5"
                step="0.02"
                value={zoom}
                onChange={(e) => setZoom(parseFloat(e.target.value))}
                className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-indigo-500"
              />
              <button
                type="button"
                onClick={() => setZoom(prev => Math.min(parseFloat((prev + 0.1).toFixed(2)), 3.5))}
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
                  setZoom(0.85);
                  setPosition({ x: 0, y: 0 });
                }}
                className="px-3 py-1.5 bg-slate-800 hover:bg-indigo-600/30 hover:border-indigo-500/40 border border-slate-700 text-slate-300 hover:text-white rounded-lg transition flex items-center gap-1.5 text-xs font-semibold"
                title="Center and fit face inside circle"
              >
                <Maximize className="w-3.5 h-3.5 text-indigo-400" /> Center Frame
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
                setZoom(1);
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
