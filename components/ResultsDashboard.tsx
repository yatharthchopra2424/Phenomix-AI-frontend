import React, { useRef, useEffect } from 'react';
import gsap from 'gsap';
import { AnalysisReport, RiskLevel } from '../types';
import { AlertCircle, CheckCircle2, AlertTriangle, Download, Copy } from 'lucide-react';

interface ResultsDashboardProps {
  report: AnalysisReport;
}

const ResultsDashboard: React.FC<ResultsDashboardProps> = ({ report }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const cardsRef = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    if (containerRef.current) {
        gsap.fromTo(containerRef.current, 
            { opacity: 0, y: 50 },
            { opacity: 1, y: 0, duration: 0.8, ease: 'power3.out' }
        );

        if (cardsRef.current.length) {
            gsap.fromTo(cardsRef.current,
                { opacity: 0, x: -20 },
                { opacity: 1, x: 0, stagger: 0.2, duration: 0.6, delay: 0.3 }
            );
        }
    }
  }, [report]);

  const getRiskColor = (level: RiskLevel) => {
      switch(level) {
          case RiskLevel.SAFE: return 'text-green-400 border-green-500/30 bg-green-900/10';
          case RiskLevel.CAUTION: return 'text-yellow-400 border-yellow-500/30 bg-yellow-900/10';
          case RiskLevel.HIGH_RISK: return 'text-red-400 border-red-500/30 bg-red-900/10';
          default: return 'text-gray-400';
      }
  };

  const getRiskIcon = (level: RiskLevel) => {
    switch(level) {
        case RiskLevel.SAFE: return <CheckCircle2 className="w-6 h-6" />;
        case RiskLevel.CAUTION: return <AlertTriangle className="w-6 h-6" />;
        case RiskLevel.HIGH_RISK: return <AlertCircle className="w-6 h-6" />;
    }
  };

  return (
    <div ref={containerRef} className="w-full max-w-4xl mx-auto space-y-8 pb-20">
      
      {/* Header Summary */}
      <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-8 shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-cyan-500/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 pointer-events-none"></div>
        
        <div className="relative z-10">
            <div className="flex justify-between items-start mb-6">
                <div>
                    <h2 className="text-4xl font-bold mb-2 bg-clip-text text-transparent bg-gradient-to-r from-white to-gray-400">
                        {report.drugName}
                    </h2>
                    <span className="px-3 py-1 rounded-full text-xs font-semibold bg-white/10 text-gray-300 uppercase tracking-wider border border-white/10">
                        Pharmacogenomic Report
                    </span>
                </div>
                <div className="flex gap-3">
                    <button className="p-3 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 transition-colors group" title="Download JSON">
                        <Download className="w-5 h-5 text-gray-400 group-hover:text-white" />
                    </button>
                    <button className="p-3 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 transition-colors group" title="Copy Summary">
                        <Copy className="w-5 h-5 text-gray-400 group-hover:text-white" />
                    </button>
                </div>
            </div>
            
            <p className="text-lg text-gray-300 leading-relaxed border-l-4 border-cyan-500 pl-4">
                {report.summary}
            </p>
        </div>
      </div>

      {/* Gene Detail Cards */}
      <div className="grid gap-6">
          {report.results.map((result, idx) => (
              <div 
                key={idx}
                ref={(el) => (cardsRef.current[idx] = el)}
                className={`
                    relative p-6 rounded-2xl border backdrop-blur-md transition-all duration-300 hover:scale-[1.01]
                    ${getRiskColor(result.riskLevel)}
                `}
              >
                  <div className="flex items-start justify-between gap-4">
                      <div className="flex-1">
                          <div className="flex items-center gap-3 mb-4">
                              <span className="text-2xl font-bold">{result.gene}</span>
                              <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-black/20 text-sm font-mono">
                                  <span>Genotype:</span>
                                  <span className="text-white">{result.genotype}</span>
                              </div>
                          </div>
                          
                          <div className="grid md:grid-cols-2 gap-6">
                              <div>
                                  <h4 className="text-sm uppercase tracking-wider opacity-70 mb-1">Phenotype</h4>
                                  <p className="font-medium text-lg text-white/90">{result.phenotype}</p>
                              </div>
                              <div>
                                  <h4 className="text-sm uppercase tracking-wider opacity-70 mb-1">Recommendation</h4>
                                  <p className="font-medium text-lg text-white/90">{result.recommendation}</p>
                              </div>
                          </div>
                      </div>

                      <div className={`
                          p-4 rounded-full bg-black/20 animate-pulse
                      `}>
                          {getRiskIcon(result.riskLevel)}
                      </div>
                  </div>
              </div>
          ))}
      </div>
    </div>
  );
};

export default ResultsDashboard;