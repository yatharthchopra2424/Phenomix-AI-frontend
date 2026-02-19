import React, { useState, useEffect } from 'react';
import { Canvas } from '@react-three/fiber';
import SmoothScroll from './components/SmoothScroll';
import { SceneContent } from './components/DNABackground';
import UploadZone from './components/UploadZone';
import DrugInput from './components/DrugInput';
import ResultsDashboard from './components/ResultsDashboard';
import { Drug, AnalysisReport } from './types';
import { MOCK_REPORTS } from './constants';
import gsap from 'gsap';
import { Dna, ArrowLeft } from 'lucide-react';

enum AppStep {
  UPLOAD,
  DRUG_SELECTION,
  RESULTS
}

const App = () => {
  const [step, setStep] = useState<AppStep>(AppStep.UPLOAD);
  const [file, setFile] = useState<File | null>(null);
  const [selectedDrug, setSelectedDrug] = useState<Drug | null>(null);
  const [report, setReport] = useState<AnalysisReport | null>(null);

  // Initial greeting animation
  useEffect(() => {
    const tl = gsap.timeline();
    tl.fromTo('.hero-text', 
      { opacity: 0, y: 30 },
      { opacity: 1, y: 0, duration: 1, ease: 'power3.out', stagger: 0.2 }
    );
  }, []);

  const handleFileAccepted = (uploadedFile: File) => {
      setFile(uploadedFile);
      // Transition animation
      gsap.to('.step-container', { 
          opacity: 0, 
          y: -20, 
          duration: 0.4, 
          onComplete: () => {
              setStep(AppStep.DRUG_SELECTION);
              gsap.fromTo('.step-container', { opacity: 0, y: 20 }, { opacity: 1, y: 0, duration: 0.4 });
          }
      });
  };

  const handleDrugSelect = (drug: Drug) => {
      setSelectedDrug(drug);
      
      // Simulate analysis
      const mockResult = MOCK_REPORTS[drug.name];
      
      if (mockResult) {
        setReport(mockResult);
        gsap.to('.step-container', { 
            opacity: 0, 
            y: -20, 
            duration: 0.4, 
            onComplete: () => {
                setStep(AppStep.RESULTS);
                gsap.fromTo('.step-container', { opacity: 0, y: 20 }, { opacity: 1, y: 0, duration: 0.4 });
            }
        });
      }
  };

  const handleReset = () => {
      setStep(AppStep.UPLOAD);
      setFile(null);
      setSelectedDrug(null);
      setReport(null);
  };

  return (
    <div className="bg-[#050505] text-white min-h-screen selection:bg-cyan-500/30">
      
      {/* 3D Background Layer */}
      <div className="fixed inset-0 z-0 bg-gradient-to-b from-[#020617] via-[#0f172a] to-[#020617]">
          <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 brightness-100 contrast-150"></div>
          <Canvas camera={{ position: [0, 0, 20], fov: 45 }} dpr={[1, 2]}>
              <SceneContent />
          </Canvas>
      </div>

      <SmoothScroll>
        <div className="relative z-10 flex flex-col min-h-screen px-4 md:px-8 py-8">
            
            {/* Header / Nav */}
            <header className="flex justify-between items-center w-full max-w-7xl mx-auto mb-16 md:mb-24">
                <div className="flex items-center gap-2 cursor-pointer" onClick={handleReset}>
                    <div className="p-2 bg-gradient-to-tr from-cyan-500 to-blue-500 rounded-lg">
                        <Dna size={24} className="text-white" />
                    </div>
                    <span className="font-bold text-xl tracking-tight hidden sm:block">PGx Vision</span>
                </div>
                {step !== AppStep.UPLOAD && (
                    <button 
                        onClick={handleReset}
                        className="flex items-center gap-2 text-sm text-gray-400 hover:text-white transition-colors"
                    >
                        <ArrowLeft size={16} />
                        Start Over
                    </button>
                )}
            </header>

            {/* Main Content Area */}
            <main className="flex-1 w-full max-w-7xl mx-auto flex flex-col items-center justify-center step-container min-h-[60vh]">
                
                {step === AppStep.UPLOAD && (
                    <div className="w-full text-center space-y-12">
                        <div className="space-y-6">
                            <h1 className="hero-text text-5xl md:text-7xl font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-b from-white to-white/50">
                                Unlocking Your <br />
                                <span className="text-cyan-400">Genetic Blueprint</span>
                            </h1>
                            <p className="hero-text text-lg md:text-xl text-gray-400 max-w-2xl mx-auto leading-relaxed">
                                Upload your genomic data to discover how your body metabolizes medications. 
                                Secure, private, and powered by advanced 3D visualization.
                            </p>
                        </div>
                        <div className="hero-text">
                            <UploadZone onFileAccepted={handleFileAccepted} />
                        </div>
                        
                        <div className="hero-text pt-8 flex items-center justify-center gap-8 opacity-50 grayscale hover:grayscale-0 transition-all duration-500">
                           <span className="text-xs uppercase tracking-widest text-gray-500">Supported Formats</span>
                           <div className="px-3 py-1 border border-white/20 rounded text-xs">VCF 4.0</div>
                           <div className="px-3 py-1 border border-white/20 rounded text-xs">23andMe</div>
                           <div className="px-3 py-1 border border-white/20 rounded text-xs">AncestryDNA</div>
                        </div>
                    </div>
                )}

                {step === AppStep.DRUG_SELECTION && (
                    <div className="w-full text-center space-y-8">
                        <div className="space-y-2">
                             <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-green-900/30 border border-green-500/30 text-green-400 text-sm mb-4">
                                <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
                                File Loaded: {file?.name}
                             </div>
                             <h2 className="text-4xl md:text-5xl font-bold">Select Medication</h2>
                             <p className="text-gray-400 max-w-lg mx-auto">
                                Search for a specific drug to analyze potential interactions based on your genetic profile.
                             </p>
                        </div>
                        <DrugInput onSelect={handleDrugSelect} />
                    </div>
                )}

                {step === AppStep.RESULTS && report && (
                    <div className="w-full">
                        <ResultsDashboard report={report} />
                    </div>
                )}

            </main>

            {/* Footer */}
            <footer className="w-full py-8 text-center text-gray-600 text-sm">
                <p>&copy; 2024 PGx Vision. For Research Use Only. Not for diagnostic procedures.</p>
            </footer>

        </div>
      </SmoothScroll>
    </div>
  );
};

export default App;