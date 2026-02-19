import React, { useState, useRef, useEffect } from 'react';
import gsap from 'gsap';
import { Search, Pill, ChevronRight } from 'lucide-react';
import { COMMON_DRUGS, MOCK_REPORTS } from '../constants';
import { Drug } from '../types';

interface DrugInputProps {
  onSelect: (drug: Drug) => void;
}

const DrugInput: React.FC<DrugInputProps> = ({ onSelect }) => {
  const [query, setQuery] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const [filteredDrugs, setFilteredDrugs] = useState<Drug[]>([]);
  
  const containerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLUListElement>(null);

  useEffect(() => {
    if (query.length > 0) {
      const filtered = COMMON_DRUGS.filter(d => 
        d.name.toLowerCase().includes(query.toLowerCase())
      );
      setFilteredDrugs(filtered);
      setIsOpen(true);
    } else {
      setIsOpen(false);
    }
  }, [query]);

  useEffect(() => {
      if (isOpen && listRef.current) {
          gsap.fromTo(listRef.current.children, 
            { opacity: 0, y: -10 },
            { opacity: 1, y: 0, stagger: 0.05, duration: 0.2 }
          );
      }
  }, [isOpen]);

  const handleFocus = () => {
    gsap.to(containerRef.current, { scale: 1.02, boxShadow: '0 0 30px -5px rgba(34, 211, 238, 0.3)', duration: 0.3 });
  };

  const handleBlur = () => {
    gsap.to(containerRef.current, { scale: 1, boxShadow: '0 0 0px 0px rgba(0,0,0,0)', duration: 0.3 });
    // Delay hiding to allow click
    setTimeout(() => setIsOpen(false), 200);
  };

  const handleSelect = (drug: Drug) => {
      setQuery(drug.name);
      setIsOpen(false);
      onSelect(drug);
  };

  return (
    <div className="w-full max-w-xl mx-auto relative z-50">
      <div 
        ref={containerRef}
        className="relative flex items-center bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl overflow-hidden transition-all"
      >
        <div className="pl-6 text-cyan-400">
            <Search size={24} />
        </div>
        <input
            ref={inputRef}
            type="text"
            className="w-full bg-transparent border-none text-white placeholder-gray-400 px-6 py-5 text-lg focus:outline-none focus:ring-0"
            placeholder="Search for a drug (e.g. Warfarin)..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onFocus={handleFocus}
            onBlur={handleBlur}
            autoComplete="off"
        />
      </div>

      {isOpen && filteredDrugs.length > 0 && (
          <ul ref={listRef} className="absolute w-full mt-4 bg-[#0f172a]/95 backdrop-blur-xl border border-white/10 rounded-2xl overflow-hidden shadow-2xl shadow-black/50">
              {filteredDrugs.map((drug) => (
                  <li 
                    key={drug.id}
                    onClick={() => handleSelect(drug)}
                    className="group flex items-center justify-between p-4 cursor-pointer hover:bg-white/5 transition-colors border-b border-white/5 last:border-0"
                  >
                      <div className="flex items-center gap-4">
                        <div className="p-2 bg-cyan-900/30 rounded-lg text-cyan-400 group-hover:scale-110 transition-transform">
                            <Pill size={20} />
                        </div>
                        <div>
                            <h4 className="font-semibold text-white">{drug.name}</h4>
                            <p className="text-sm text-gray-400">{drug.class}</p>
                        </div>
                      </div>
                      <ChevronRight className="text-gray-600 group-hover:text-white transition-colors" size={18} />
                  </li>
              ))}
          </ul>
      )}

      {isOpen && filteredDrugs.length === 0 && (
          <div className="absolute w-full mt-4 p-4 bg-[#0f172a]/90 backdrop-blur border border-white/10 rounded-2xl text-center text-gray-400">
              No drugs found in database.
          </div>
      )}
    </div>
  );
};

export default DrugInput;