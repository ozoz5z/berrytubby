
import React, { useState, useMemo } from 'react';
import { GoogleGenerativeAI } from "@google/generative-ai";

// ==========================================
// 1. TYPES (데이터 타입 정의)
// ==========================================
interface Bird {
  id: string;
  year: string;
  name: string;
  birthDate: string; // YYYY.MM.DD
  traits: string;
  snsUrl: string;
  location: string;
  images: {
    recent: string;
    baby: string;
  };
}

interface Parent {
  name: string;
  role: 'Father' | 'Mother';
  species: string;
  birthYear: string;
  birthDateFull: string; // MM.DD
  origin: string;
  description: string;
  color: string;
  imageUrl: string;
}

// ==========================================
// 2. CONSTANTS (초기 데이터)
// ==========================================
const INITIAL_BIRDS: Bird[] = [
  { 
    id: '1', year: '2023', name: '둥이', birthDate: '2023.04.28', location: '경기 포천시', traits: '첫째답게 의젓하고 동생들을 잘 돌봅니다.', snsUrl: '#',
    images: { recent: 'https://picsum.photos/seed/bird1r/500/500', baby: 'https://picsum.photos/seed/bird1b/500/500' }
  },
  { 
    id: '2', year: '2025-03', name: '앵두', birthDate: '2025.03.27', location: '충북 청주시 (오창)', traits: '앵두같은 부리가 귀여운 봄의 전령사입니다.', snsUrl: 'https://www.instagram.com/_.25o3e7._/',
    images: { recent: 'https://picsum.photos/seed/bird3r/500/500', baby: 'https://picsum.photos/seed/bird3b/500/500' }
  },
  { 
    id: '3', year: '2025-03', name: '둘리', birthDate: '2025.03.31', location: '대전광역시', traits: '아빠 뚜비를 닮아 체구가 다부지고 씩씩해요.', snsUrl: '#',
    images: { recent: 'https://picsum.photos/seed/bird4r/500/500', baby: 'https://picsum.photos/seed/bird4b/500/500' }
  },
  { 
    id: '4', year: '2025-06', name: '별하', birthDate: '2025.06.13', location: '서울특별시', traits: '별처럼 높고 빛나는 아이라는 뜻을 가졌습니다.', snsUrl: '#',
    images: { recent: 'https://picsum.photos/seed/bird5r/500/500', baby: 'https://picsum.photos/seed/bird5b/500/500' }
  },
  { 
    id: '5', year: '2025-06', name: '코코', birthDate: '2025.06.17', location: '대전광역시', traits: '눈망울이 초롱초롱하고 호기심이 매우 많습니다.', snsUrl: '#',
    images: { recent: 'https://picsum.photos/seed/bird6r/500/500', baby: 'https://picsum.photos/seed/bird6b/500/500' }
  },
  { 
    id: '6', year: '2025-06', name: '키위', birthDate: '2025.06.21', location: '세종특별자치시', traits: '여름의 싱그러움을 닮은 밝은 성격의 소유자.', snsUrl: '#',
    images: { recent: 'https://picsum.photos/seed/bird7r/500/500', baby: 'https://picsum.photos/seed/bird7b/500/500' }
  },
  { 
    id: '7', year: '2025-09-10', name: '베리', birthDate: '2025.09.28', location: '대전광역시', traits: '엄마 이름을 물려받아 우아한 자태를 뽐냅니다.', snsUrl: '#',
    images: { recent: 'https://picsum.photos/seed/bird9r/500/500', baby: 'https://picsum.photos/seed/bird9b/500/500' }
  },
  { 
    id: '8', year: '2025-09-10', name: '연두', birthDate: '2025.09.29', location: '충북 청주시', traits: '연둣빛 싱그러운 깃털을 가진 다정다감한 성격의 아이입니다.', snsUrl: '#',
    images: { recent: 'https://picsum.photos/seed/bird2r/500/500', baby: 'https://picsum.photos/seed/bird2b/500/500' }
  },
  { 
    id: '9', year: '2025-09-10', name: '막내', birthDate: '2025.10.02', location: '대전광역시', traits: '막내답게 형들을 잘 따르고 애교가 많아요.', snsUrl: '#',
    images: { recent: 'https://picsum.photos/seed/bird10r/500/500', baby: 'https://picsum.photos/seed/bird10b/500/500' }
  }
];

const PARENTS: Parent[] = [
  {
    name: '박베리',
    role: 'Mother',
    species: '블루 퀘이커',
    birthYear: '2020',
    birthDateFull: '01.01',
    origin: '서울',
    description: '박베리는 우리 집의 정신적 지주인 엄마새입니다. 은은한 하늘색 깃털과 따뜻한 성품을 가졌습니다.',
    color: '#00f2ff',
    imageUrl: 'https://picsum.photos/seed/berry_mom/600/600'
  },
  {
    name: '박뚜비',
    role: 'Father',
    species: '그린 퀘이커',
    birthYear: '2021',
    birthDateFull: '03.01',
    origin: '경기',
    description: '박뚜비는 든든한 아빠새입니다. 활기차고 용감하며, 선명한 초록색 깃털이 아주 멋집니다.',
    color: '#00ff88',
    imageUrl: 'https://picsum.photos/seed/tubby_dad/600/600'
  }
];

// ==========================================
// 3. AI SERVICES
// ==========================================
const generateBirdDescription = async (name: string, traits: string): Promise<string> => {
  try {
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `Generate a short, cute personality description (in Korean) for a baby parrot named "${name}" who has these traits: "${traits}". Max 2 sentences.`,
    });
    return response.text?.trim() || "베리와 뚜비의 귀여운 아이입니다.";
  } catch (error) {
    console.error("Gemini failed:", error);
    return "베리와 뚜비의 사랑스러운 아이입니다.";
  }
};

// ==========================================
// 4. SUB-COMPONENTS
// ==========================================

const ParentCard: React.FC<{ parent: Parent }> = ({ parent }) => {
  const ageString = useMemo(() => {
    try {
      const birthYear = parseInt(parent.birthYear);
      const [m, d] = parent.birthDateFull.split('.').map(Number);
      const birth = new Date(birthYear, m - 1, d);
      const now = new Date();
      let totalMonths = (now.getFullYear() - birth.getFullYear()) * 12 + (now.getMonth() - birth.getMonth());
      if (now.getDate() < birth.getDate()) totalMonths--;
      const years = Math.floor(totalMonths / 12);
      const months = totalMonths % 12;
      return years > 0 ? (months > 0 ? `${years}년 ${months}개월` : `${years}년`) : `${months}개월`;
    } catch { return "정보 없음"; }
  }, [parent]);

  return (
    <div className="glass relative overflow-hidden p-6 md:p-10 rounded-[1.5rem] md:rounded-[2.5rem] flex flex-col items-center text-center transition-all duration-700 hover:-translate-y-2 group w-full border border-white/10 shadow-2xl">
      <div className="absolute top-0 left-0 w-full h-1.5 md:h-2" style={{ backgroundColor: parent.color }} />
      <span className="px-4 py-1 md:px-6 md:py-1.5 rounded-full text-[8px] md:text-xs font-black mb-4 md:mb-8 text-black tracking-[0.2em] uppercase" style={{ backgroundColor: parent.color }}>
        {parent.role === 'Mother' ? 'MOMMY' : 'DADDY'}
      </span>
      <div className="relative mb-4 md:mb-8">
        <div className="absolute -inset-2 rounded-full blur-2xl opacity-10 group-hover:opacity-30 transition duration-1000" style={{ backgroundColor: parent.color }} />
        <img src={parent.imageUrl} alt={parent.name} className="relative w-32 h-32 sm:w-44 sm:h-44 md:w-64 md:h-64 lg:w-80 lg:h-80 rounded-full object-cover border-4 transition-all duration-700 group-hover:scale-105 shadow-2xl" style={{ borderColor: parent.color }} />
      </div>
      <h2 className="text-2xl md:text-5xl lg:text-6xl font-black mb-2 md:mb-4 tracking-tighter text-white">{parent.name}</h2>
      <div className="flex flex-col gap-2 mb-6">
        <span className="px-3 py-1 bg-white/5 rounded-lg border border-white/10 text-[10px] md:text-sm text-gray-400 font-bold">{parent.species}</span>
        <div className="flex flex-col md:flex-row items-center justify-center gap-1 md:gap-3">
          <span className="flex items-center gap-1.5 text-[11px] md:text-base font-black text-[#00f2ff]"><span className="opacity-40">🎂</span> {parent.birthYear}.{parent.birthDateFull}</span>
          <span className="px-3 py-1 bg-[#00f2ff]/10 text-[#00f2ff] rounded-lg border border-[#00f2ff]/20 text-[10px] md:text-sm font-black uppercase tracking-wider">현재 {ageString} 차</span>
        </div>
      </div>
      <p className="text-gray-300 leading-relaxed max-w-sm text-[11px] md:text-lg lg:text-xl font-light italic">"{parent.description}"</p>
    </div>
  );
};

const BirdCard: React.FC<{ bird: Bird, onUpdateTraits: (id: string, newTraits: string) => void }> = ({ bird, onUpdateTraits }) => {
  const [showBaby, setShowBaby] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editedTraits, setEditedTraits] = useState(bird.traits);

  const ageString = useMemo(() => {
    try {
      const [y, m, d] = bird.birthDate.split('.').map(Number);
      const birth = new Date(y, m - 1, d);
      const now = new Date();
      let totalMonths = (now.getFullYear() - birth.getFullYear()) * 12 + (now.getMonth() - birth.getMonth());
      if (now.getDate() < birth.getDate()) totalMonths--;
      const resultMonths = Math.max(0, totalMonths);
      const years = Math.floor(resultMonths / 12);
      const months = resultMonths % 12;
      return years > 0 ? (months > 0 ? `${years}년 ${months}개월` : `${years}년`) : `${months}개월`;
    } catch { return "0개월"; }
  }, [bird.birthDate]);

  return (
    <div className="glass rounded-3xl group overflow-hidden transition-all duration-500 hover:border-white/30 flex flex-col h-full border border-white/10 shadow-lg hover:shadow-2xl">
      <div className="relative aspect-square cursor-pointer overflow-hidden" onClick={() => setShowBaby(!showBaby)}>
        <img src={showBaby ? bird.images.baby : bird.images.recent} alt={bird.name} className={`w-full h-full object-cover transition-all duration-1000 ${showBaby ? 'scale-110' : 'scale-100'}`} />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end justify-center pb-6">
          <span className="text-[10px] font-black bg-white/20 backdrop-blur-xl px-4 py-2 rounded-full text-white border border-white/20">
            {showBaby ? '최근 사진 보기' : '아기 시절 보기'}
          </span>
        </div>
        {showBaby && <div className="absolute top-4 right-4 animate-in fade-in zoom-in duration-300"><span className="px-2 py-1 bg-yellow-400 text-black text-[9px] font-black rounded uppercase shadow-lg">BABY</span></div>}
      </div>
      <div className="p-4 md:p-6 flex flex-col flex-grow">
        <div className="flex justify-between items-start mb-1">
          <h3 className="text-lg md:text-2xl font-black tracking-tighter text-white group-hover:text-[#00f2ff] transition-colors">{bird.name}</h3>
          <span className="text-[8px] md:text-[9px] font-black tracking-[0.2em] text-[#00ff88] uppercase pt-1.5 opacity-60">{bird.year}</span>
        </div>
        <div className="mb-4"><span className="inline-block bg-[#00f2ff]/10 text-[#00f2ff] text-[9px] md:text-[10px] font-black px-2 py-0.5 rounded-md border border-[#00f2ff]/20">현재 {ageString} 차</span></div>
        <div className="space-y-1 mb-4 text-[10px] md:text-sm text-gray-400">
          <div className="flex items-center gap-2"><span className="opacity-50">🎂</span><span>{bird.birthDate}</span></div>
          <div className="flex items-center gap-2"><span className="opacity-50">🏠</span><span className="truncate">{bird.location}</span></div>
          <div className="mt-3 bg-white/5 p-3 rounded-xl border border-white/5">
            <div className="text-[8px] font-black text-white/20 uppercase mb-1 flex justify-between">
              <span>특징 및 성격</span>
              {!isEditing && <button onClick={() => setIsEditing(true)} className="hover:text-[#00f2ff]">편집</button>}
            </div>
            {isEditing ? (
              <div className="flex flex-col gap-2">
                <textarea value={editedTraits} onChange={(e) => setEditedTraits(e.target.value)} className="w-full bg-black/40 border border-white/20 rounded-lg p-2 text-white text-[10px] md:text-xs resize-none" rows={3} autoFocus />
                <div className="flex justify-end gap-2">
                   <button onClick={() => setIsEditing(false)} className="text-[10px] font-bold text-gray-500">취소</button>
                   <button onClick={() => { onUpdateTraits(bird.id, editedTraits); setIsEditing(false); }} className="text-[10px] font-bold text-[#00ff88]">저장</button>
                </div>
              </div>
            ) : <p className="text-gray-300 leading-relaxed text-[10px] md:text-xs italic cursor-pointer" onClick={() => setIsEditing(true)}>"{bird.traits}"</p>}
          </div>
        </div>
<a href={bird.snsUrl} target="_blank" rel="noopener noreferrer" 
          className={`mt-auto inline-flex items-center gap-2 text-[9px] md:text-[10px] font-black transition-all duration-300 py-2 w-full justify-center rounded-xl border border-white/20 text-white hover:bg-[#00f2ff] hover:text-black hover:border-[#00f2ff] ${bird.snsUrl === '#' ? 'hidden' : 'opacity-100'}`}
        >
          <span>인스타그램</span>
        </a>
      </div>
    );
  };
const AdminPanel: React.FC<{ isOpen: boolean, onClose: () => void, onAdd: (b: any) => void }> = ({ isOpen, onClose, onAdd }) => {
  const [password, setPassword] = useState('');
  const [isUnlocked, setIsUnlocked] = useState(false);
  if (!isOpen) return null;

  const handlePasswordSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === '0520') setIsUnlocked(true);
    else { alert('비밀번호가 틀렸습니다.'); setPassword(''); }
  };

  const handleAiFill = async () => {
    if (!formData.name || !formData.traits) { alert('이름과 기본 특징을 먼저 입력해주세요!'); return; }
    setIsGenerating(true);
    const desc = await generateBirdDescription(formData.name, formData.traits);
    setFormData(prev => ({ ...prev, traits: desc }));
    setIsGenerating(false);
  };

  return (
    <div className="fixed inset-0 z-[2000] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/90 backdrop-blur-md" onClick={onClose} />
      <div className="relative glass w-full max-w-lg p-10 rounded-[2rem] max-h-[90vh] overflow-y-auto">
        {!isUnlocked ? (
          <div className="py-10 text-center">
            <h2 className="text-2xl font-black mb-6 text-white">관리자 인증</h2>
            <form onSubmit={handlePasswordSubmit} className="space-y-4">
              <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="비밀번호 입력" className="w-full bg-white/5 border border-white/10 rounded-xl px-6 py-4 text-center text-lg focus:outline-none text-white" autoFocus />
              <button className="w-full accent-gradient-bg text-black font-black py-4 rounded-xl text-lg hover:brightness-110">인증하기</button>
            </form>
          </div>
        ) : (
          <form onSubmit={(e) => { e.preventDefault(); onAdd({ ...formData, images: { recent: `https://picsum.photos/seed/${Date.now()}r/600/600`, baby: `https://picsum.photos/seed/${Date.now()}b/600/600` } }); onClose(); }} className="space-y-6">
            <h2 className="text-3xl font-black tracking-tighter text-white">새 정보 추가</h2>
            <div className="grid grid-cols-2 gap-4">
              <input type="text" value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} placeholder="이름" className="bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm focus:outline-none text-white" />
              <select value={formData.year} onChange={(e) => setFormData({...formData, year: e.target.value})} className="bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm focus:outline-none bg-[#111] text-white">
                <option value="2025-10">2025년 10월</option><option value="2025-06">2025년 6월</option><option value="2025-03">2025년 3월</option><option value="2023">2023년</option>
              </select>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <input type="text" value={formData.birthDate} onChange={(e) => setFormData({...formData, birthDate: e.target.value})} placeholder="YYYY.MM.DD" className="bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm focus:outline-none text-white" />
              <input type="text" value={formData.location} onChange={(e) => setFormData({...formData, location: e.target.value})} placeholder="거주 지역" className="bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm focus:outline-none text-white" />
            </div>
            <div>
              <div className="flex justify-between items-center mb-2"><label className="text-[10px] font-black text-white/40 uppercase">Traits</label><button type="button" onClick={handleAiFill} className="text-[10px] font-black text-[#00ff88] bg-[#00ff88]/10 px-2 py-1 rounded-md">{isGenerating ? "AI WRITING..." : "AI AUTO-FILL"}</button></div>
              <textarea value={formData.traits} onChange={(e) => setFormData({...formData, traits: e.target.value})} placeholder="특징 입력" className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm resize-none text-white" rows={3} />
            </div>
            <button type="submit" className="w-full accent-gradient-bg text-black font-black py-5 rounded-2xl text-xl hover:brightness-110">PUBLISH TO ARCHIVE</button>
          </form>
        )}
      </div>
    </div>
  );
};

// ==========================================
// 5. MAIN APP
// ==========================================

const App: React.FC = () => {
  const [birds, setBirds] = useState<Bird[]>(INITIAL_BIRDS);
  const [filter, setFilter] = useState<string>('all');
  const [isAdminOpen, setIsAdminOpen] = useState(false);

  const filteredBirds = useMemo(() => {
    const list = filter === 'all' ? birds : birds.filter(b => b.year === filter);
    return [...list].sort((a, b) => new Date(a.birthDate.replace(/\./g, '-')).getTime() - new Date(b.birthDate.replace(/\./g, '-')).getTime());
  }, [birds, filter]);

  const filterOptions = useMemo(() => Array.from(new Set(birds.map(b => b.year))).sort(), [birds]);

  const birthdayGridData = useMemo(() => {
    const now = new Date();
    const curM = now.getMonth() + 1;
    const curD = now.getDate();
    const parents = PARENTS.map(p => {
      const [m, d] = p.birthDateFull.split('.').map(Number);
      return { name: p.name, date: p.birthDateFull, type: p.role === 'Mother' ? '엄마' : '아빠', color: p.color, isToday: m === curM && d === curD };
    });
    const bds = birds.map(b => {
      const [, m, d] = b.birthDate.split('.').map(Number);
      return { name: b.name, date: `${m < 10 ? '0'+m : m}.${d < 10 ? '0'+d : d}`, type: '자녀', color: '#ffffff', isToday: m === curM && d === curD };
    });
    return [...parents, ...bds].sort((a, b) => {
      const [mA, dA] = a.date.split('.').map(Number);
      const [mB, dB] = b.date.split('.').map(Number);
      return mA !== mB ? mA - mB : dA - dB;
    });
  }, [birds]);

  return (
    <div className="min-h-screen pb-32 overflow-x-hidden selection:bg-[#00f2ff] selection:text-black bg-[#050505]">
      {/* 배경 장식 */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute top-[-10%] left-[-10%] w-[60vw] h-[60vw] rounded-full bg-[#00f2ff]/5 blur-[160px] animate-pulse" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[50vw] h-[50vw] rounded-full bg-[#00ff88]/5 blur-[160px] animate-pulse" />
      </div>

      {/* 헤더 */}
      <header className="relative z-10 pt-16 md:pt-24 pb-12 md:pb-20 text-center px-4">
        <div className="container mx-auto">
          <div className="inline-block mb-6 px-5 py-2 rounded-full border border-white/10 bg-white/5 backdrop-blur-md text-[10px] md:text-[11px] font-black tracking-[0.3em] uppercase text-white">
            BERRY × TUBBY FAMILY TREE
          </div>
          <h1 className="text-4xl sm:text-6xl md:text-8xl lg:text-9xl font-black mb-6 tracking-tighter leading-none flex items-center justify-center gap-2 md:gap-6 flex-wrap">
            <span className="neon-blue">베리</span>
            <span className="text-white/10 text-3xl md:text-6xl select-none mx-1 md:mx-2">X</span>
            <span className="neon-green">뚜비</span>
            <span className="text-white ml-2 md:ml-6">패밀리</span>
          </h1>
          <p className="text-white/60 text-sm md:text-2xl font-light tracking-tight max-w-2xl mx-auto leading-relaxed">
            사랑스러운 <span className="text-[#00f2ff] font-bold">베리</span>와 든든한 <span className="text-[#00ff88] font-bold">뚜비</span>의<br/>
            족보 홈페이지에 오신 것을 환영합니다.
          </p>
        </div>
      </header>

      {/* 메인 콘텐츠 */}
      <main className="container mx-auto px-4 md:px-6 relative z-10">
        {/* 부모새 섹션 */}
        <section className="mb-24 md:mb-40 max-w-6xl mx-auto">
          <div className="grid grid-cols-2 gap-3 md:gap-10">
            {PARENTS.map((p, i) => <ParentCard key={i} parent={p} />)}
          </div>
        </section>

        {/* 아기새 아카이브 섹션 */}
        <section className="mb-40">
           <div className="flex flex-col items-center mb-16">
            <div className="text-center mb-10">
              <h2 className="text-[10px] font-black tracking-[0.4em] text-[#00f2ff] uppercase mb-3">Baby Birds Collection</h2>
              <p className="text-3xl md:text-5xl font-black text-white tracking-tighter">아가새 한눈에 보기</p>
            </div>
            <div className="flex flex-wrap justify-center gap-3 md:gap-4 max-w-4xl">
              <button onClick={() => setFilter('all')} className={`px-6 md:px-8 py-3 rounded-2xl text-xs font-black border transition-all ${filter === 'all' ? 'bg-[#00f2ff] text-black border-[#00f2ff] scale-105' : 'bg-white/5 text-white/40 border-white/10 hover:border-white/30'}`}>전체보기</button>
              {filterOptions.map(opt => (
                <button key={opt} onClick={() => setFilter(opt)} className={`px-6 md:px-8 py-3 rounded-2xl text-xs font-black border transition-all ${filter === opt ? 'bg-[#00ff88] text-black border-[#00ff88] scale-105 shadow-[#00ff88]/20' : 'bg-white/5 text-white/40 border-white/10 hover:border-white/30'}`}>
                  {opt.includes('-') ? `${opt.split('-')[0]}년 ${parseInt(opt.split('-')[1])}월` : `${opt}년`}
                </button>
              ))}
            </div>
          </div>
          <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-8">
            {filteredBirds.map(b => <BirdCard key={b.id} bird={b} onUpdateTraits={(id, t) => setBirds(prev => prev.map(item => item.id === id ? { ...item, traits: t } : item))} />)}
          </div>
        </section>

        {/* 생일 섹션 */}
        <section className="mb-40">
          <div className="text-center mb-12">
            <h2 className="text-[10px] font-black tracking-[0.4em] text-[#00ff88] uppercase mb-3">Birthday Calendar</h2>
            <p className="text-3xl md:text-5xl font-black text-white tracking-tighter">가족 생일 캘린더</p>
          </div>
          <div className="grid grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
            {birthdayGridData.map((item, idx) => (
              <div key={idx} className={`glass p-4 md:p-6 rounded-2xl border transition-all flex flex-col items-center group relative overflow-hidden ${item.isToday ? 'border-[#ff0088] bg-[#ff0088]/20 birthday-pulse scale-105' : 'border-white/5'}`}>
                {item.isToday && <div className="absolute top-0 right-0"><div className="bg-[#ff0088] text-white text-[7px] md:text-[9px] font-black px-2 py-0.5 rounded-bl-lg shadow-lg animate-pulse">Today!</div></div>}
                <span className={`text-[8px] md:text-[9px] font-black uppercase mb-1 ${item.isToday ? 'text-[#ff0088]' : 'text-white/30'}`}>{item.type}</span>
                <span className={`text-sm md:text-xl font-black mb-1 text-center`} style={{ color: item.isToday ? '#ff0088' : (item.color === '#ffffff' ? '#fff' : item.color) }}>{item.name}</span>
                <span className={`text-[10px] md:text-xs font-bold ${item.isToday ? 'text-[#ff0088]/80' : 'text-gray-500'}`}>{item.date}</span>
                {item.isToday && <div className="mt-3 flex flex-col items-center"><span className="text-[9px] font-black text-[#ff0088] mb-1">Happy Birthday!</span><span className="animate-bounce">🎉</span></div>}
              </div>
            ))}
          </div>
          <div className="mt-8 text-center flex flex-col items-center gap-2">
            <div className="h-px w-12 bg-white/10" />
            <p className="text-[10px] md:text-xs text-white font-medium tracking-tight">
              생일 당일에는 카드가 <span className="text-[#ff0088] font-black">네온빛</span>으로 강조되며 특별한 축하 배지가 나타납니다🎉
            </p>
          </div>
        </section>
      </main>

      {/* 관리자 버튼 */}
      <button onClick={() => setIsAdminOpen(true)} className="fixed bottom-10 right-6 md:right-10 w-16 h-16 md:w-20 md:h-20 rounded-full accent-gradient-bg text-black shadow-2xl flex items-center justify-center z-[1000] hover:scale-110 active:scale-95 transition-all">
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round"><path d="M12 5v14"/><path d="M5 12h14"/></svg>
      </button>

      <AdminPanel isOpen={isAdminOpen} onClose={() => setIsAdminOpen(false)} onAdd={(b) => setBirds(prev => [{ ...b, id: Date.now().toString() }, ...prev])} />

      <footer className="py-20 border-t border-white/5 text-center relative z-10">
        <p className="text-white/10 text-[10px] font-black tracking-[0.4em] uppercase">&copy; {new Date().getFullYear()} BERRY × TUBBY FAMILY TREE.</p>
      </footer>
    </div>
  );
};

export default App;
