import React, { useRef, useState, useEffect } from 'react';
import { Eraser, RotateCcw, Palette, Check } from 'lucide-react';
import { DrawStroke, Point } from '../types.ts';

interface TouchCanvasOverlayProps {
  isActive: boolean;
  onClose: () => void;
  language: 'ar' | 'en';
}

const PALETTE_COLORS = [
  { hex: '#F59E0B', name: 'Amber' },
  { hex: '#06B6D4', name: 'Cyan' },
  { hex: '#10B981', name: 'Lime' },
  { hex: '#F43F5E', name: 'Coral' },
  { hex: '#FFFFFF', name: 'White' },
];

export const TouchCanvasOverlay: React.FC<TouchCanvasOverlayProps> = ({
  isActive,
  onClose,
  language,
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const isAr = language === 'ar';

  const [currentColor, setCurrentColor] = useState<string>('#F59E0B');
  const [lineWidth, setLineWidth] = useState<number>(5);
  const [strokes, setStrokes] = useState<DrawStroke[]>([]);
  const [currentStroke, setCurrentStroke] = useState<Point[] | null>(null);

  // Resize canvas according to container
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const updateCanvasSize = () => {
      const rect = canvas.getBoundingClientRect();
      canvas.width = rect.width;
      canvas.height = rect.height;
      redrawAllStrokes(strokes);
    };

    updateCanvasSize();
    window.addEventListener('resize', updateCanvasSize);
    return () => window.removeEventListener('resize', updateCanvasSize);
  }, [isActive, strokes]);

  const redrawAllStrokes = (allStrokes: DrawStroke[]) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    allStrokes.forEach((stroke) => {
      if (stroke.points.length < 2) return;
      ctx.beginPath();
      ctx.moveTo(stroke.points[0].x, stroke.points[0].y);
      for (let i = 1; i < stroke.points.length; i++) {
        ctx.lineTo(stroke.points[i].x, stroke.points[i].y);
      }
      ctx.strokeStyle = stroke.color;
      ctx.lineWidth = stroke.width;
      ctx.lineCap = 'round';
      ctx.lineJoin = 'round';
      ctx.shadowColor = stroke.color;
      ctx.shadowBlur = 6;
      ctx.stroke();
    });
  };

  const getCanvasCoords = (e: React.MouseEvent | React.TouchEvent): Point | null => {
    const canvas = canvasRef.current;
    if (!canvas) return null;
    const rect = canvas.getBoundingClientRect();

    let clientX = 0;
    let clientY = 0;

    if ('touches' in e && e.touches.length > 0) {
      clientX = e.touches[0].clientX;
      clientY = e.touches[0].clientY;
    } else if ('clientX' in e) {
      clientX = e.clientX;
      clientY = e.clientY;
    } else {
      return null;
    }

    return {
      x: clientX - rect.left,
      y: clientY - rect.top,
    };
  };

  const handleStart = (e: React.MouseEvent | React.TouchEvent) => {
    if (!isActive) return;
    const pt = getCanvasCoords(e);
    if (!pt) return;
    setCurrentStroke([pt]);
  };

  const handleMove = (e: React.MouseEvent | React.TouchEvent) => {
    if (!isActive || !currentStroke) return;
    const pt = getCanvasCoords(e);
    if (!pt) return;

    const nextPoints = [...currentStroke, pt];
    setCurrentStroke(nextPoints);

    // Live draw current stroke segment
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const prevPt = currentStroke[currentStroke.length - 1];
    ctx.beginPath();
    ctx.moveTo(prevPt.x, prevPt.y);
    ctx.lineTo(pt.x, pt.y);
    ctx.strokeStyle = currentColor;
    ctx.lineWidth = lineWidth;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    ctx.shadowColor = currentColor;
    ctx.shadowBlur = 6;
    ctx.stroke();
  };

  const handleEnd = () => {
    if (!isActive || !currentStroke || currentStroke.length < 2) {
      setCurrentStroke(null);
      return;
    }

    const newStroke: DrawStroke = {
      points: currentStroke,
      color: currentColor,
      width: lineWidth,
    };

    const updated = [...strokes, newStroke];
    setStrokes(updated);
    setCurrentStroke(null);
  };

  const clearCanvas = () => {
    setStrokes([]);
    const canvas = canvasRef.current;
    if (canvas) {
      const ctx = canvas.getContext('2d');
      ctx?.clearRect(0, 0, canvas.width, canvas.height);
    }
  };

  const undoLastStroke = () => {
    if (strokes.length === 0) return;
    const updated = strokes.slice(0, -1);
    setStrokes(updated);
    redrawAllStrokes(updated);
  };

  if (!isActive) return null;

  return (
    <div className="absolute inset-0 z-30 pointer-events-auto flex flex-col justify-between">
      {/* Top Floating Drawing Toolbar */}
      <div className="p-3 flex items-center justify-between bg-slate-950/80 backdrop-blur-md border-b border-slate-800 animate-in fade-in duration-200">
        <div className="flex items-center gap-2">
          <span className="text-xs font-bold text-amber-400 px-2 py-1 bg-amber-400/10 rounded border border-amber-400/20">
            {isAr ? 'الرسم المرئي على الشاشة' : 'Visual Stream Draw'}
          </span>
          <div className="flex items-center gap-1.5 ml-2">
            {PALETTE_COLORS.map((col) => (
              <button
                key={col.hex}
                onClick={() => setCurrentColor(col.hex)}
                style={{ backgroundColor: col.hex }}
                className={`w-7 h-7 rounded-full border-2 transition-transform active:scale-90 ${
                  currentColor === col.hex ? 'border-white scale-110 shadow-lg' : 'border-transparent'
                }`}
                title={col.name}
              />
            ))}
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={undoLastStroke}
            disabled={strokes.length === 0}
            className="min-h-[40px] px-2.5 py-1 text-xs font-semibold text-slate-300 hover:text-white bg-slate-900 rounded-lg border border-slate-800 disabled:opacity-40 transition-colors flex items-center gap-1"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">{isAr ? 'تراجع' : 'Undo'}</span>
          </button>

          <button
            onClick={clearCanvas}
            disabled={strokes.length === 0}
            className="min-h-[40px] px-2.5 py-1 text-xs font-semibold text-rose-400 hover:text-rose-300 bg-rose-950/40 rounded-lg border border-rose-900/40 disabled:opacity-40 transition-colors flex items-center gap-1"
          >
            <Eraser className="w-3.5 h-3.5" />
            <span>{isAr ? 'مسح الكل' : 'Clear'}</span>
          </button>

          <button
            onClick={onClose}
            className="min-h-[40px] px-3 py-1 text-xs font-bold text-slate-950 bg-amber-400 hover:bg-amber-300 rounded-lg transition-colors flex items-center gap-1"
          >
            <Check className="w-3.5 h-3.5" />
            <span>{isAr ? 'تم وحفظ' : 'Done'}</span>
          </button>
        </div>
      </div>

      {/* Main Drawing Surface */}
      <canvas
        ref={canvasRef}
        onMouseDown={handleStart}
        onMouseMove={handleMove}
        onMouseUp={handleEnd}
        onMouseLeave={handleEnd}
        onTouchStart={handleStart}
        onTouchMove={handleMove}
        onTouchEnd={handleEnd}
        className="w-full flex-1 cursor-crosshair touch-none"
      />
    </div>
  );
};
