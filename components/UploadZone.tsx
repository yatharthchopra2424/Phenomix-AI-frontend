import React, { useRef, useState } from 'react';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import { UploadCloud, FileType, CheckCircle, AlertTriangle } from 'lucide-react';
import Loader from './UI/Loader';

interface UploadZoneProps {
  onFileAccepted: (file: File) => void;
}

const UploadZone: React.FC<UploadZoneProps> = ({ onFileAccepted }) => {
  const [isDragging, setIsDragging] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isValidating, setIsValidating] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const iconRef = useRef<HTMLDivElement>(null);

  const { contextSafe } = useGSAP({ scope: containerRef });

  const animateIn = contextSafe(() => {
    gsap.to(containerRef.current, { scale: 1.02, borderColor: '#22d3ee', duration: 0.3, ease: 'power2.out' });
    gsap.to(iconRef.current, { y: -10, duration: 0.3, ease: 'back.out(1.7)' });
  });

  const animateOut = contextSafe(() => {
    gsap.to(containerRef.current, { scale: 1, borderColor: 'rgba(255,255,255,0.1)', duration: 0.3 });
    gsap.to(iconRef.current, { y: 0, duration: 0.3 });
  });

  const animateError = contextSafe(() => {
     gsap.fromTo(containerRef.current, 
        { x: -10 }, 
        { x: 10, duration: 0.1, repeat: 5, yoyo: true, ease: 'sine.inOut', onComplete: () => gsap.to(containerRef.current, { x: 0 }) }
    );
  });

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
    animateIn();
  };

  const handleDragLeave = () => {
    setIsDragging(false);
    animateOut();
  };

  const validateFile = (file: File) => {
    setIsValidating(true);
    setError(null);

    // Simulate validation delay for effect
    setTimeout(() => {
        if (!file.name.toLowerCase().endsWith('.vcf')) {
            setError('Invalid file format. Please upload a .vcf file.');
            setIsValidating(false);
            animateError();
            return;
        }
        
        if (file.size > 5 * 1024 * 1024) { // 5MB
            setError('File size exceeds 5MB limit.');
            setIsValidating(false);
            animateError();
            return;
        }

        setIsValidating(false);
        onFileAccepted(file);
    }, 1500);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    animateOut();
    
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
        validateFile(e.dataTransfer.files[0]);
        e.dataTransfer.clearData();
    }
  };

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
      if (e.target.files && e.target.files.length > 0) {
          validateFile(e.target.files[0]);
      }
  }

  return (
    <div 
        ref={containerRef}
        className={`
            relative w-full max-w-2xl mx-auto p-12 border-2 border-dashed rounded-3xl 
            transition-colors duration-300 backdrop-blur-md bg-white/5
            flex flex-col items-center justify-center gap-6 cursor-pointer overflow-hidden
            ${isDragging ? 'bg-cyan-900/20 border-cyan-400' : 'border-white/10 hover:border-white/30'}
        `}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={() => document.getElementById('file-input')?.click()}
    >
        <input 
            type="file" 
            id="file-input" 
            className="hidden" 
            accept=".vcf"
            onChange={handleFileInput}
        />
        
        <div ref={iconRef} className="relative z-10">
            {isValidating ? (
                <Loader />
            ) : error ? (
                <AlertTriangle className="w-16 h-16 text-red-500" />
            ) : (
                <UploadCloud className={`w-16 h-16 ${isDragging ? 'text-cyan-400' : 'text-gray-400'}`} />
            )}
        </div>

        <div className="text-center space-y-2 z-10">
            {isValidating ? (
                 <p className="text-xl font-medium text-cyan-400">Validating genomic data...</p>
            ) : error ? (
                <div className="space-y-1">
                    <p className="text-xl font-medium text-red-400">Upload Failed</p>
                    <p className="text-sm text-red-300/80">{error}</p>
                </div>
            ) : (
                <>
                    <h3 className="text-2xl font-semibold text-white">
                        {isDragging ? 'Drop VCF File Here' : 'Upload Genomic Data'}
                    </h3>
                    <p className="text-gray-400 max-w-sm mx-auto">
                        Drag and drop your .vcf file here, or click to browse. Max size 5MB.
                    </p>
                </>
            )}
        </div>

        {/* Decorative Grid */}
        <div className="absolute inset-0 z-0 opacity-10 pointer-events-none" 
             style={{ backgroundImage: 'radial-gradient(circle, #ffffff 1px, transparent 1px)', backgroundSize: '20px 20px' }}>
        </div>
    </div>
  );
};

export default UploadZone;