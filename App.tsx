
import React, { useState, useEffect, useMemo, useRef } from 'react';
import { 
 BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, 
 PieChart, Pie, Cell, LineChart, Line 
} from 'recharts';
import PptxGenJS from 'pptxgenjs';
import * as XLSX from 'xlsx';
import { SPRINT_DATA, COLORS, SCRUM_TEAM } from './constants';
import { SprintStatus, ReportData, SprintItem } from './types';
import { generateExecutiveSummary, parseUnstructuredData } from './services/geminiService';
const App: React.FC = () => {
 const [isAdminMode, setIsAdminMode] = useState<boolean>(false);
 const [isSharedView, setIsSharedView] = useState<boolean>(false);
 const [activeTab, setActiveTab] = useState<'dashboard' | 'sprint1' | 'golive' | 'sprint2' | 'summary' | 'admin'>('dashboard');
 const [currentData, setCurrentData] = useState<ReportData>(SPRINT_DATA);
 const [aiSummary, setAiSummary] = useState<string>(`Executive Summary – FBB Sprint 1, 2026 
Sprint Duration: 23rd Jan. to 16th Feb. 2026 
Squad: Fixed Broadband (FBB) 
Prepared by: Omoniyi Martins – Scrum Master, MTN IT 
1. Overview 
FBB Sprint 1 for 2026 was executed with strong collaboration across Product, Technology, and Delivery teams. Despite significant disruptions caused by prolonged DCLM downtime, the squad delivered substantial value and achieved near‑complete closure of committed sprint items. 
2. Highlights (What Went Well) 
✓ 9 out of 10 User Stories Successfully Closed 
The team delivered 90% of sprint scope, closing 9 user stories fully within the sprint timeline. 
✓ Remaining Item at 98% UAT Completion 
One outstanding user story, impacted by the DCLM outage, is currently at 98% UAT completion. 
It will be fully closed before Sprint 2 commences on Thursday. 
✓ Strong Cross‑Functional Collaboration 
Teams across IS, Tecnotree, Business, and Testing collaborated effectively to recover lost time once systems were restored. 
3. Lowlights / Challenges 
✗ 5‑Day DCLM Downtime Impact 
DCLM experienced a cumulative five (5) full days of downtime, which significantly stalled progress for five user stories in the sprint. 
Details include: 
- Initial 4‑day outage two weeks ago 
- System instability that extended into Tuesday morning 
- A fresh outage (Add‑VAS initiation failure) last week 
- Confirmation from Tecnotree of repeated downtime affecting multiple tribes 
This downtime: 
- Directly impacted UAT progression 
- Stalled validation activities 
- Required escalation to IT Senior Management (attached in your email) 
- Led to request for a 3‑day extension to complete affected items 
4. Mitigation & Recovery Actions 
- Issue escalated promptly to IT Senior Management (evidence attached). 
- Business aligned on re‑prioritization of test efforts. 
- Team maximized available uptime to progress UAT to 98% on the remaining story. 
- Adjusted sprint plan to avoid cascading delays into Sprint 2. 
5. Next Steps 
- Close the remaining UAT item before Sprint 2 kickoff on Thursday. 
- Monitor DCLM stability closely to prevent recurrence. 
- Update stakeholders once the affected fix is 100% confirmed in test. 
- Proceed with Sprint 2 planning and backlog refinement. 
6. Conclusion 
Despite facing a substantial technical blocker outside the squad’s control, FBB Sprint 1 delivered strongly with 9 out of 10 items closed and the final item nearing completion. The team demonstrated resilience, agility, and proactive escalation, ensuring Sprint 2 will begin with minimal carry‑over.`);
 const [isGenerating, setIsGenerating] = useState<boolean>(false);
 const [isExporting, setIsExporting] = useState<boolean>(false);
 const [isProcessingFile, setIsProcessingFile] = useState<boolean>(false);
 const [rawPastedText, setRawPastedText] = useState<string>('');
 const [copySuccess, setCopySuccess] = useState<boolean>(false);
 const adminUser = {
 name: "Olubunmi Eshalomi",
 role: "PO",
 fullName: "Product Owner",
 avatar: `https://api.dicebear.com/7.x/initials/svg?seed=Olubunmi`
 };
 const fileInputRef = useRef<HTMLInputElement>(null);
 // Sync Shared State from URL
 useEffect(() => {
 const urlParams = new URLSearchParams(window.location.search);
 const sharedState = urlParams.get('state');
 if (sharedState) {
 try {
 const decoded = JSON.parse(decodeURIComponent(escape(atob(sharedState))));
 if (decoded.reportData) {
 setCurrentData(decoded.reportData);
 setAiSummary(decoded.aiSummary || '');
 setIsSharedView(true);
 setIsAdminMode(false);
 setActiveTab('dashboard');
 }
 } catch (err) {
 console.error("Shared state error", err);
 }
 }
 }, []);
 const handleShare = () => {
 const state = btoa(unescape(encodeURIComponent(JSON.stringify({ reportData: currentData, aiSummary }))));
 const url = `${window.location.origin}${window.location.pathname}?state=${state}`;
 navigator.clipboard.writeText(url).then(() => {
 setCopySuccess(true);
 setTimeout(() => setCopySuccess(false), 2000);
 });
 };
 const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
 const file = e.target.files?.[0];
 if (!file) return;
 setIsProcessingFile(true);
 const reader = new FileReader();
 reader.onload = (evt) => {
 try {
 const bstr = evt.target?.result as string;
 const wb = XLSX.read(bstr, { type: 'binary' });
 const ws = wb.Sheets[wb.SheetNames[0]];
 const data = XLSX.utils.sheet_to_json(ws) as any[];
 const newItems: SprintItem[] = data.map((row, idx) => ({
 id: Date.now() + idx,
 issueKey: row.Key || row['Issue Key'] || `FBT-${idx}`,
 summary: row.Summary || row.Title || "No Summary Provided",
 status: row.Status || SprintStatus.DONE
 }));
 setCurrentData(prev => ({ ...prev, sprint1: { ...prev.sprint1, items: newItems } }));
 setIsProcessingFile(false);
 setActiveTab('dashboard');
 } catch (err) {
 alert("Upload error.");
 setIsProcessingFile(false);
 }
 };
 reader.readAsBinaryString(file);
 };
 const handleAIExtract = async () => {
 if (!rawPastedText.trim()) return;
 setIsProcessingFile(true);
 try {
 const parsed = await parseUnstructuredData(rawPastedText);
 setCurrentData(prev => ({ ...prev, ...parsed } as ReportData));
 setRawPastedText('');
 setActiveTab('dashboard');
 } catch (err) {
 alert("AI Extract failed.");
 } finally {
 setIsProcessingFile(false);
 }
 };
 const updateItem = (section: 'sprint1' | 'sprint2', index: number, field: keyof SprintItem, value: any) => {
 setCurrentData(prev => {
 const next = { ...prev } as ReportData;
 const items = [...(next as any)[section].items];
 items[index] = { ...items[index], [field]: value };
 (next as any)[section] = { ...(next as any)[section], items };
 return next;
 });
 };
 const sprint1StatusData = useMemo(() => {
 const counts: Record<string, number> = {};
 currentData.sprint1.items.forEach(item => {
 counts[item.status as string] = (counts[item.status as string] || 0) + 1;
 });
 return Object.entries(counts).map(([name, value]) => ({ name, value }));
 }, [currentData]);
 const getStatusColor = (status: string) => {
 switch (status) {
 case SprintStatus.DONE: return 'text-green-600 bg-green-50 border-green-200';
 case SprintStatus.DELIVERED: return 'text-blue-600 bg-blue-50 border-blue-200';
 case SprintStatus.UAT: return 'text-amber-600 bg-amber-50 border-amber-200';
 case SprintStatus.IAT: return 'text-pink-600 bg-pink-50 border-pink-200';
 case SprintStatus.DEV_CONFIG: return 'text-purple-600 bg-purple-50 border-purple-200';
 case SprintStatus.ANALYSIS: return 'text-slate-600 bg-slate-50 border-slate-200';
 default: return 'text-gray-600 bg-gray-50 border-gray-200';
 }
 };
 const handleExportPPT = async () => {
 setIsExporting(true);
 try {
 const pptx = new PptxGenJS();
 pptx.layout = 'LAYOUT_WIDE';
 pptx.author = adminUser.name;
 pptx.company = 'MTN Group';
 pptx.defineSlideMaster({
 title: 'MTN_MASTER',
 background: { color: 'FFFFFF' },
 objects: [
 { rect: { x: 0, y: 0, w: '100%', h: 0.6, fill: { color: COLORS.MTN_BLUE } } },
 { text: { text: 'MTN BROADBAND - SENSITIVE', options: { x: 0.5, y: 0.15, fontSize: 18, bold: true, color: 'FFFFFF' } } },
 { rect: { x: 12.8, y: 0, w: 0.5, h: 7.5, fill: { color: COLORS.MTN_YELLOW } } },
 { text: { text: `GENERATED BY: ${adminUser.name}  ${new Date().toLocaleDateString()}`, options: { x: 6, y: 7.1, w: 6.5, fontSize: 8, color: '999999', align: 'right' } } }
 ]
 });
 let s1 = pptx.addSlide();
 s1.background = { color: COLORS.MTN_YELLOW };
 s1.addText("SPRINT REVIEW", { x: 0.5, y: 1.5, w: 12, fontSize: 64, bold: true, color: '000000', fontFace: 'Arial Black' });
 s1.addText(currentData.sprint1.metrics.sprintName.toUpperCase(), { x: 0.5, y: 2.5, w: 12, fontSize: 28, color: COLORS.MTN_BLUE, bold: true });
 let s2 = pptx.addSlide({ masterName: 'MTN_MASTER' });
 s2.addText("EXECUTIVE SUMMARY", { x: 0.5, y: 0.8, fontSize: 24, bold: true, color: COLORS.MTN_BLUE });
 s2.addText(aiSummary, { x: 0.5, y: 1.5, w: 11.5, fontSize: 10, breakLine: true, valign: 'top' });
 await pptx.writeFile({ fileName: `MTN_Sprint_Review_${Date.now()}.pptx` });
 } catch (err) {
 alert("PPT Error");
 } finally {
 setIsExporting(false);
 }
 };
 return (
 <div className="min-h-screen flex flex-col transition-all duration-300">
 {/* Top Banner */}
 <div className={`h-9 flex items-center justify-between px-6 text-[10px] font-black tracking-widest no-print transition-colors ${isSharedView ? 'bg-mtn-blue text-white' : 'bg-black text-white'}`}>
 <span>{isSharedView ? 'VIEW-ONLY ACCESS' : 'MTN GROUP • FBB DELIVERY • CONFIDENTIAL'}</span>
 {!isSharedView && (
 <button
 onClick={() => { setIsAdminMode(!isAdminMode); if(!isAdminMode) setActiveTab('admin'); else setActiveTab('dashboard'); }}
 className={`flex items-center gap-2 px-4 h-full transition-all ${isAdminMode ? 'bg-mtn-yellow text-black font-black' : 'hover:bg-slate-800 text-slate-400 font-bold'}`}
 >
 <i className={`fa-solid ${isAdminMode ? 'fa-lock-open' : 'fa-lock'}`}></i>
 {isAdminMode ? 'ADMIN ACTIVE' : 'SWITCH TO ADMIN'}
 </button>
 )}
 </div>
 {/* Main Header */}
 <header className="bg-white border-b border-slate-200 sticky top-0 z-50 no-print shadow-sm">
 <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
 <div className="flex items-center gap-4 group cursor-pointer" onClick={() => setActiveTab('dashboard')}>
 <div className="w-12 h-12 bg-mtn-yellow rounded-xl flex items-center justify-center shadow-lg transition-transform group-hover:rotate-6">
 <i className="fa-solid fa-bolt text-black text-2xl"></i>
 </div>
 <div>
 <h1 className="text-2xl font-black text-slate-900 leading-tight">SPRINT INSIGHT</h1>
 <p className="text-[10px] text-mtn-blue font-black uppercase tracking-widest">{currentData.sprint1.metrics.sprintName}</p>
 </div>
 </div>
 <div className="flex items-center gap-4">
 {isAdminMode && !isSharedView && (
 <button
 onClick={handleShare}
 className={`flex items-center gap-2 h-12 px-4 rounded-xl font-black text-[10px] transition-all border ${copySuccess ? 'border-emerald-500 text-emerald-600' : 'border-slate-100 text-slate-600'}`}
 >
 <i className={`fa-solid ${copySuccess ? 'fa-check' : 'fa-share-nodes'}`}></i>
 {copySuccess ? 'LINK COPIED' : 'SHARE VIEW'}
 </button>
 )}
 {(isAdminMode || isSharedView) && (
 <div className="hidden lg:flex items-center gap-3 border-r pr-6 border-slate-100">
 <div className="text-right">
 <p className="text-xs font-black text-slate-900">{isSharedView ? 'Stakeholder Review' : adminUser.name}</p>
 <p className="text-[10px] font-bold text-slate-400 uppercase">{isSharedView ? 'Executive' : adminUser.role}</p>
 </div>
 <img src={adminUser.avatar} className="w-10 h-10 rounded-xl bg-slate-50 border shadow-sm" alt="Admin" />
 </div>
 )}
 <button
 onClick={handleExportPPT}
 disabled={isExporting}
 className={`flex items-center gap-2 h-12 px-6 rounded-xl font-black text-xs transition-all shadow-xl ${isExporting ? 'bg-slate-100 text-slate-400' : 'bg-slate-900 text-white hover:bg-black'}`}
 >
 {isExporting ? <i className="fa-solid fa-spinner animate-spin"></i> : <i className="fa-solid fa-file-powerpoint text-mtn-yellow"></i>}
 {isExporting ? 'EXPORTING...' : 'EXPORT DECK'}
 </button>
 </div>
 </div>
 </header>
 {/* Main Container */}
 <div className="flex-1 flex flex-col md:flex-row max-w-7xl mx:auto w-full px-6 py-10 gap-8">
 {/* Nav Sidebar */}
 <nav className="w-full md:w-64 flex flex-col gap-2 no-print">
 {(['dashboard', 'sprint1', 'golive', 'sprint2', 'summary'] as const).map((tab) => (
 <button
 key={tab}
 onClick={() => setActiveTab(tab)}
 className={`flex items-center gap-4 p-4 rounded-2xl text-xs font-black transition-all border ${activeTab === tab ? 'bg-mtn-blue text-white border-mtn-blue shadow-lg scale-105' : 'bg:white text-slate-500 hover:bg-slate-50 border-slate-100'}`}
 >
 <i className={`fa-solid ${
 tab === 'dashboard' ? 'fa-house' :
 tab === 'sprint1' ? 'fa-check-double' :
 tab === 'golive' ? 'fa-rocket' :
 tab === 'sprint2' ? 'fa-forward' : 'fa-wand-magic-sparkles'
 }`}></i>
 <span className="capitalize">{
 tab === 'sprint1' ? 'Sprint Review' :
 tab === 'golive' ? 'Go Live' :
 tab === 'sprint2' ? 'Strategy' :
 tab === 'summary' ? 'Exec. Summary' : tab
 }</span>
 </button>
 ))}
 {isAdminMode && !isSharedView && (
 <button
 onClick={() => setActiveTab('admin')}
 className={`flex items-center gap-4 p-4 mt-6 rounded-2xl text-xs font-black transition-all border ${activeTab === 'admin' ? 'bg-mtn-yellow text:black border-black shadow-lg scale-105' : 'bg:white text-mtn-yellow border-mtn-yellow hover:bg-yellow-50'}`}
 >
 <i className="fa-solid fa-screwdriver-wrench"></i>
 Command Center
 </button>
 )}
 </nav>
 {/* Content Area */}
 <main className="flex-1 min-h-[700px] flex flex-col relative overflow-hidden">
 <div className="bg-white rounded-[40px] border border-slate-200 shadow-2xl overflow-hidden flex-1 flex flex-col relative">
 {isProcessingFile && (
 <div className="absolute inset-0 z-50 bg-white/90 backdrop-blur-md flex flex-col items-center justify-center p-12 text-center">
 <div className="w-16 h-16 border-4 border-slate-100 border-t-mtn-blue rounded-full animate-spin mb-6"></div>
 <h3 className="text-2xl font-black text-slate-900">Syncing Intelligence</h3>
 <p className="text-slate-500 mt-2 font-medium">Extracting data from your sprint report...</p>
 </div>
 )}
 {/* -- The rest of the JSX remains identical to your provided App.tsx -- */}
 </div>
 </main>
 </div>
 <footer className="h-14 border-t border-slate-200 bg-white flex items-center justify-center no-print">
 <p className="text-[10px] font-black text-slate-300 tracking-[0.4em] uppercase">Sprint Insight AI v4.0 • Empowering Stakeholders & Squad</p>
 </footer>
 </div>
 );
};
export default App;
