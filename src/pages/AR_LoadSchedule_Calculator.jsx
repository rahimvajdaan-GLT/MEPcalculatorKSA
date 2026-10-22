import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Plus, Trash2, Calculator, Copy, Download, Zap, TrendingUp, Settings, Eye, Filter, X } from 'lucide-react';
import { motion } from 'framer-motion';
import { toast } from 'sonner';
import LanguageSwitcher from '../components/layout/LanguageSwitcher';

const loadTypes = [
  { value: 'lighting', label: 'إضاءة' },
  { value: 'sockets', label: 'مقابس' },
  { value: 'hvac', label: 'معدات تكييف' },
  { value: 'pumps', label: 'مضخات' },
  { value: 'elevators', label: 'مصاعد' },
  { value: 'kitchen', label: 'مطبخ' },
  { value: 'elv', label: 'ELV' },
  { value: 'other', label: 'أخرى' }
];

const panelTypes = [
  { value: 'MDB', label: 'MDB' },
  { value: 'SMDB', label: 'SMDB' },
  { value: 'DB', label: 'DB' },
  { value: 'MCC', label: 'MCC' },
  { value: 'Other', label: 'أخرى' }
];

const exampleLoads = [
  { name: 'إضاءة – الطابق الأرضي', qty: 1, loadType: 'lighting', phase: '3P', voltage: 400, unit: 'kW', value: 18, pf: 0.95, demandFactor: 0.9, panel: 'DB-L1', panelType: 'DB', feeder: '', circuitNo: '1-20', notes: '' },
  { name: 'مقابس صغيرة – مكاتب', qty: 1, loadType: 'sockets', phase: '3P', voltage: 400, unit: 'kW', value: 25, pf: 0.95, demandFactor: 0.7, panel: 'DB-P1', panelType: 'DB', feeder: '', circuitNo: '1-15', notes: '' },
  { name: 'AHU-01', qty: 1, loadType: 'hvac', phase: '3P', voltage: 400, unit: 'kW', value: 22, pf: 0.90, demandFactor: 1.0, panel: 'SMDB-01', panelType: 'SMDB', feeder: 'F1', circuitNo: '1', notes: '' },
  { name: 'AHU-02', qty: 1, loadType: 'hvac', phase: '3P', voltage: 400, unit: 'kW', value: 18, pf: 0.90, demandFactor: 1.0, panel: 'SMDB-01', panelType: 'SMDB', feeder: 'F2', circuitNo: '2', notes: '' },
  { name: 'مجموعة FCU', qty: 1, loadType: 'hvac', phase: '3P', voltage: 400, unit: 'kW', value: 12, pf: 0.90, demandFactor: 0.9, panel: 'SMDB-01', panelType: 'SMDB', feeder: 'F3', circuitNo: '3-8', notes: '' },
  { name: 'مضخة مياه مبردة-01', qty: 1, loadType: 'pumps', phase: '3P', voltage: 400, unit: 'kW', value: 11, pf: 0.88, demandFactor: 1.0, panel: 'MCC-01', panelType: 'MCC', feeder: 'P1', circuitNo: '1', notes: '' },
  { name: 'مضخة مياه مبردة-02 (احتياطي)', qty: 1, loadType: 'pumps', phase: '3P', voltage: 400, unit: 'kW', value: 11, pf: 0.88, demandFactor: 0.0, panel: 'MCC-01', panelType: 'MCC', feeder: 'P2', circuitNo: '2', notes: '' },
  { name: 'مضخة حريق (كهربائية)', qty: 1, loadType: 'pumps', phase: '3P', voltage: 400, unit: 'kW', value: 45, pf: 0.90, demandFactor: 1.0, panel: 'MDB-01', panelType: 'MDB', feeder: 'FP', circuitNo: '1', notes: '' },
  { name: 'مضخة جوكي', qty: 1, loadType: 'pumps', phase: '3P', voltage: 400, unit: 'kW', value: 4, pf: 0.90, demandFactor: 1.0, panel: 'MDB-01', panelType: 'MDB', feeder: 'JP', circuitNo: '2', notes: '' },
  { name: 'مصعد-01', qty: 1, loadType: 'elevators', phase: '3P', voltage: 400, unit: 'kW', value: 15, pf: 0.90, demandFactor: 0.8, panel: 'SMDB-01', panelType: 'SMDB', feeder: 'L1', circuitNo: '3', notes: '' },
  { name: 'معدات مطبخ', qty: 1, loadType: 'kitchen', phase: '3P', voltage: 400, unit: 'kW', value: 30, pf: 0.95, demandFactor: 0.6, panel: 'DB-P1', panelType: 'DB', feeder: '', circuitNo: '16-20', notes: '' },
  { name: 'أحمال ELV/ICT', qty: 1, loadType: 'elv', phase: '1P', voltage: 230, unit: 'kW', value: 3, pf: 0.95, demandFactor: 1.0, panel: 'DB-ELV1', panelType: 'DB', feeder: '', circuitNo: '1-6', notes: '' }
];

function calculateRow(row) {
  const qty = parseFloat(row.qty) || 1;
  const value = parseFloat(row.value) || 0;
  const pf = parseFloat(row.pf) || 0.9;
  const demandFactor = parseFloat(row.demandFactor) || 1;
  const voltage = parseFloat(row.voltage) || (row.phase === '1P' ? 230 : 400);
  
  let connectedKW = 0;
  let connectedKVA = 0;
  
  if (row.unit === 'kW') {
    connectedKW = value * qty;
    connectedKVA = connectedKW / pf;
  } else if (row.unit === 'kVA') {
    connectedKVA = value * qty;
    connectedKW = connectedKVA * pf;
  } else if (row.unit === 'A') {
    if (row.phase === '1P') {
      connectedKVA = (voltage * value * qty) / 1000;
    } else {
      connectedKVA = (Math.sqrt(3) * voltage * value * qty) / 1000;
    }
    connectedKW = connectedKVA * pf;
  }
  
  const demandKW = connectedKW * demandFactor;
  const demandKVA = connectedKVA * demandFactor;
  
  let current = 0;
  if (row.phase === '1P') {
    current = (demandKVA * 1000) / voltage;
  } else {
    current = (demandKVA * 1000) / (Math.sqrt(3) * voltage);
  }
  
  return {
    connectedKW: connectedKW.toFixed(2),
    connectedKVA: connectedKVA.toFixed(2),
    demandKW: demandKW.toFixed(2),
    demandKVA: demandKVA.toFixed(2),
    current: current.toFixed(1)
  };
}

export default function AR_LoadSchedule_Calculator() {
  const navigate = useNavigate();
  const [loads, setLoads] = useState([{
    id: 1,
    name: '',
    qty: 1,
    loadType: 'other',
    phase: '3P',
    voltage: 400,
    unit: 'kW',
    value: 0,
    pf: 0.9,
    demandFactor: 1.0,
    panel: 'MDB-01',
    panelType: 'MDB',
    feeder: '',
    circuitNo: '',
    notes: ''
  }]);

  const [panels, setPanels] = useState([
    { name: 'MDB-01', type: 'MDB', voltage: 400, phase: '3P' },
    { name: 'SMDB-01', type: 'SMDB', voltage: 400, phase: '3P' },
    { name: 'MCC-01', type: 'MCC', voltage: 400, phase: '3P' },
    { name: 'DB-L1', type: 'DB', voltage: 400, phase: '3P' },
    { name: 'DB-P1', type: 'DB', voltage: 400, phase: '3P' },
    { name: 'DB-ELV1', type: 'DB', voltage: 230, phase: '1P' }
  ]);

  const [filterPanel, setFilterPanel] = useState('all');
  const [filterLoadType, setFilterLoadType] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedPanelDetails, setSelectedPanelDetails] = useState(null);
  const [showPanelSettings, setShowPanelSettings] = useState(false);
  const [autoRecalc, setAutoRecalc] = useState(true);
  const [calcTimeout, setCalcTimeout] = useState(null);

  const addLoad = () => {
    setLoads([...loads, {
      id: Date.now(),
      name: '',
      qty: 1,
      loadType: 'other',
      phase: '3P',
      voltage: 400,
      unit: 'kW',
      value: 0,
      pf: 0.9,
      demandFactor: 1.0,
      panel: panels[0]?.name || 'MDB-01',
      panelType: panels[0]?.type || 'MDB',
      feeder: '',
      circuitNo: '',
      notes: ''
    }]);
  };

  const removeLoad = (id) => {
    if (loads.length > 1) {
      setLoads(loads.filter(l => l.id !== id));
    }
  };

  const updateLoad = (id, field, value) => {
    setLoads(loads.map(l => {
      if (l.id === id) {
        const updated = { ...l, [field]: value };
        if (field === 'phase') {
          updated.voltage = value === '1P' ? 230 : 400;
        }
        if (field === 'panel') {
          const panel = panels.find(p => p.name === value);
          if (panel) {
            updated.panelType = panel.type;
          }
        }
        return updated;
      }
      return l;
    }));
  };

  const duplicateLoad = (id) => {
    const load = loads.find(l => l.id === id);
    if (load) {
      const newLoad = { ...load, id: Date.now(), name: load.name + ' (copy)' };
      setLoads([...loads, newLoad]);
    }
  };

  const clearAll = () => {
    if (window.confirm('هل أنت متأكد من حذف جميع الأحمال؟')) {
      setLoads([{
        id: Date.now(),
        name: '',
        qty: 1,
        loadType: 'other',
        phase: '3P',
        voltage: 400,
        unit: 'kW',
        value: 0,
        pf: 0.9,
        demandFactor: 1.0,
        panel: panels[0]?.name || 'MDB-01',
        panelType: panels[0]?.type || 'MDB',
        feeder: '',
        circuitNo: '',
        notes: ''
      }]);
    }
  };

  const addPanel = () => {
    const newName = `Panel-${panels.length + 1}`;
    setPanels([...panels, { name: newName, type: 'DB', voltage: 400, phase: '3P' }]);
  };

  const removePanel = (name) => {
    if (panels.length > 1) {
      setPanels(panels.filter(p => p.name !== name));
    }
  };

  const updatePanel = (oldName, field, value) => {
    setPanels(panels.map(p => {
      if (p.name === oldName) {
        if (field === 'name') {
          // Update all loads with this panel
          setLoads(loads.map(l => l.panel === oldName ? { ...l, panel: value } : l));
          return { ...p, name: value };
        }
        return { ...p, [field]: value };
      }
      return p;
    }));
  };

  const loadExample = () => {
    setLoads(exampleLoads.map((load, idx) => ({ ...load, id: Date.now() + idx })));
    toast.success('تم تحميل المثال التوضيحي');
  };

  const calculateSummary = () => {
    let totalConnectedKW = 0;
    let totalConnectedKVA = 0;
    let totalDemandKW = 0;
    let totalDemandKVA = 0;
    
    const results = loads.map(load => {
      const calc = calculateRow(load);
      totalConnectedKW += parseFloat(calc.connectedKW);
      totalConnectedKVA += parseFloat(calc.connectedKVA);
      totalDemandKW += parseFloat(calc.demandKW);
      totalDemandKVA += parseFloat(calc.demandKVA);
      return { ...load, ...calc };
    });
    
    const current3P = (totalDemandKVA * 1000) / (Math.sqrt(3) * 400);
    const current1P = (totalDemandKVA * 1000) / 230;
    const diversityRatio = totalConnectedKW > 0 ? (totalDemandKW / totalConnectedKW) * 100 : 0;
    
    const topLoads = results
      .sort((a, b) => parseFloat(b.demandKW) - parseFloat(a.demandKW))
      .slice(0, 5);

    // Panel summaries
    const panelSummaries = {};
    results.forEach(load => {
      if (!panelSummaries[load.panel]) {
        const panelConfig = panels.find(p => p.name === load.panel);
        panelSummaries[load.panel] = {
          name: load.panel,
          type: load.panelType,
          connectedKW: 0,
          connectedKVA: 0,
          demandKW: 0,
          demandKVA: 0,
          loads: [],
          voltage: panelConfig?.voltage || 400,
          phase: panelConfig?.phase || '3P',
          hasMixedPhases: false
        };
      }
      panelSummaries[load.panel].connectedKW += parseFloat(load.connectedKW);
      panelSummaries[load.panel].connectedKVA += parseFloat(load.connectedKVA);
      panelSummaries[load.panel].demandKW += parseFloat(load.demandKW);
      panelSummaries[load.panel].demandKVA += parseFloat(load.demandKVA);
      panelSummaries[load.panel].loads.push(load);
      
      // Check for mixed phases
      if (load.phase !== panelSummaries[load.panel].phase) {
        panelSummaries[load.panel].hasMixedPhases = true;
      }
    });

    // Calculate panel currents
    Object.values(panelSummaries).forEach(panel => {
      const voltage = panel.voltage;
      const phase = panel.phase;
      
      if (phase === '1P') {
        panel.current = (panel.demandKVA * 1000) / voltage;
      } else {
        panel.current = (panel.demandKVA * 1000) / (Math.sqrt(3) * voltage);
      }
    });
    
    return {
      totalConnectedKW: totalConnectedKW.toFixed(1),
      totalConnectedKVA: totalConnectedKVA.toFixed(1),
      totalDemandKW: totalDemandKW.toFixed(1),
      totalDemandKVA: totalDemandKVA.toFixed(1),
      current3P: current3P.toFixed(1),
      current1P: current1P.toFixed(1),
      diversityRatio: diversityRatio.toFixed(1),
      topLoads,
      results,
      panelSummaries: Object.values(panelSummaries)
    };
  };

  // Auto-recalculate with debounce
  useEffect(() => {
    if (autoRecalc) {
      if (calcTimeout) clearTimeout(calcTimeout);
      const timeout = setTimeout(() => {
        // Trigger recalculation
      }, 300);
      setCalcTimeout(timeout);
      return () => clearTimeout(timeout);
    }
  }, [loads, autoRecalc]);

  const summary = calculateSummary();

  const filteredLoads = summary.results.filter(load => {
    const panelMatch = filterPanel === 'all' || load.panel === filterPanel;
    const typeMatch = filterLoadType === 'all' || load.loadType === filterLoadType;
    const searchMatch = searchTerm === '' || 
      load.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      load.panel.toLowerCase().includes(searchTerm.toLowerCase());
    return panelMatch && typeMatch && searchMatch;
  });

  const copySummary = () => {
    let text = `
ملخص جدول الأحمال الكهربائية
═══════════════════════════════
إجمالي الحمل المركب: ${summary.totalConnectedKW} كيلوواط (${summary.totalConnectedKVA} كيلو فولت أمبير)
إجمالي الحمل الفعلي: ${summary.totalDemandKW} كيلوواط (${summary.totalDemandKVA} كيلو فولت أمبير)
التيار المقدر @ 400V 3P: ${summary.current3P} أمبير
معامل التنوع: ${summary.diversityRatio}%

ملخص اللوحات:
═══════════════════════════════`;
    
    summary.panelSummaries.forEach(panel => {
      text += `\n${panel.name} (${panel.type}): ${panel.demandKW.toFixed(1)} كيلوواط | ${panel.current.toFixed(1)} أمبير`;
    });

    text += `\n\nأعلى 5 أحمال فعلية:\n`;
    text += summary.topLoads.map((l, i) => `${i + 1}. ${l.name || 'بدون اسم'} - ${l.demandKW} كيلوواط`).join('\n');
    
    navigator.clipboard.writeText(text.trim());
    toast.success('تم نسخ الملخص');
  };

  const exportCSV = () => {
    const headers = ['الاسم', 'العدد', 'النوع', 'الطور', 'الجهد', 'الوحدة', 'القيمة', 'PF', 'معامل الطلب', 'اللوحة', 'نوع اللوحة', 'المغذي', 'الدائرة', 'kW مركب', 'kVA مركب', 'kW فعلي', 'kVA فعلي', 'التيار (A)', 'ملاحظات'];
    const rows = summary.results.map(r => [
      r.name, r.qty, r.loadType, r.phase, r.voltage, r.unit, r.value, r.pf, r.demandFactor,
      r.panel, r.panelType, r.feeder, r.circuitNo,
      r.connectedKW, r.connectedKVA, r.demandKW, r.demandKVA, r.current, r.notes
    ]);
    const csv = [headers, ...rows].map(row => row.join(',')).join('\n');
    const blob = new Blob(['\ufeff' + csv], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = 'load-schedule.csv';
    link.click();
    toast.success('تم تصدير الملف');
  };

  const exportPanelSummary = () => {
    const headers = ['اللوحة', 'النوع', 'kW مركب', 'kVA مركب', 'kW فعلي', 'kVA فعلي', 'التيار (A)', 'الجهد', 'الطور'];
    const rows = summary.panelSummaries.map(p => [
      p.name, p.type, p.connectedKW.toFixed(1), p.connectedKVA.toFixed(1),
      p.demandKW.toFixed(1), p.demandKVA.toFixed(1), p.current.toFixed(1),
      p.voltage, p.phase
    ]);
    const csv = [headers, ...rows].map(row => row.join(',')).join('\n');
    const blob = new Blob(['\ufeff' + csv], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = 'panel-summary.csv';
    link.click();
    toast.success('تم تصدير ملخص اللوحات');
  };

  const exportPanel = (panelName) => {
    const panel = summary.panelSummaries.find(p => p.name === panelName);
    if (!panel) return;
    
    const headers = ['الاسم', 'العدد', 'النوع', 'الطور', 'الجهد', 'الوحدة', 'القيمة', 'PF', 'معامل الطلب', 'المغذي', 'الدائرة', 'kW مركب', 'kVA مركب', 'kW فعلي', 'kVA فعلي', 'التيار (A)', 'ملاحظات'];
    const rows = panel.loads.map(r => [
      r.name, r.qty, r.loadType, r.phase, r.voltage, r.unit, r.value, r.pf, r.demandFactor,
      r.feeder, r.circuitNo, r.connectedKW, r.connectedKVA, r.demandKW, r.demandKVA, r.current, r.notes
    ]);
    const csv = [headers, ...rows].map(row => row.join(',')).join('\n');
    const blob = new Blob(['\ufeff' + csv], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `panel-${panelName}.csv`;
    link.click();
    toast.success(`تم تصدير ${panelName}`);
  };

  return (
    <div className="min-h-screen bg-slate-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-3xl font-bold text-slate-900 mb-2">ملخص جدول الأحمال الكهربائية</h1>
            <p className="text-slate-600">إعداد ملخص جدول الأحمال يدوياً مع حسابات تلقائية - لا يتطلب قاعدة بيانات</p>
          </div>
          <LanguageSwitcher currentLanguage="ar" targetPage="EN_LoadSchedule_Calculator" />
        </div>

        {/* Calculation Status */}
        <Card className="mb-6 border-emerald-200 bg-emerald-50">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-2">
                  <Calculator className="w-5 h-5 text-emerald-600" />
                  <span className="font-semibold text-emerald-900">الحالة:</span>
                  <Badge className="bg-emerald-600 text-white">جاهز للحساب</Badge>
                </div>
                <div className="flex items-center gap-2 me-4">
                  <input
                    type="checkbox"
                    id="autoRecalc"
                    checked={autoRecalc}
                    onChange={(e) => setAutoRecalc(e.target.checked)}
                    className="w-4 h-4"
                  />
                  <label htmlFor="autoRecalc" className="text-sm text-slate-600">
                    إعادة الحساب التلقائي (300ms)
                  </label>
                </div>
              </div>
              <div className="text-sm text-slate-600">
                {loads.length} صف | {summary.panelSummaries.length} لوحة
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Panel Settings */}
        <Card className="mb-6">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>إدارة اللوحات</CardTitle>
              <Button onClick={addPanel} size="sm" variant="outline">
                <Plus className="w-4 h-4 me-2" />
                إضافة لوحة
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid gap-3">
              {panels.map((panel) => (
                <div key={panel.name} className="flex items-center gap-3 p-3 bg-slate-50 rounded-lg">
                  <Input
                    value={panel.name}
                    onChange={(e) => updatePanel(panel.name, 'name', e.target.value)}
                    className="w-40"
                  />
                  <Select value={panel.type} onValueChange={(v) => updatePanel(panel.name, 'type', v)}>
                    <SelectTrigger className="w-32">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {panelTypes.map(t => <SelectItem key={t.value} value={t.value}>{t.label}</SelectItem>)}
                    </SelectContent>
                  </Select>
                  <Select value={panel.phase} onValueChange={(v) => updatePanel(panel.name, 'phase', v)}>
                    <SelectTrigger className="w-24">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="1P">1P</SelectItem>
                      <SelectItem value="3P">3P</SelectItem>
                    </SelectContent>
                  </Select>
                  <Input
                    type="number"
                    value={panel.voltage}
                    onChange={(e) => updatePanel(panel.name, 'voltage', e.target.value)}
                    className="w-24"
                    placeholder="الجهد"
                  />
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => removePanel(panel.name)}
                    className="text-red-500 hover:text-red-700"
                    disabled={panels.length === 1}
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Filters */}
        <Card className="mb-6">
          <CardContent className="p-4">
            <div className="flex flex-wrap gap-3 items-center">
              <div className="flex items-center gap-2">
                <Filter className="w-4 h-4 text-slate-500" />
                <Label className="text-sm">تصفية:</Label>
              </div>
              <Select value={filterPanel} onValueChange={setFilterPanel}>
                <SelectTrigger className="w-40">
                  <SelectValue placeholder="كل اللوحات" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">كل اللوحات</SelectItem>
                  {panels.map(p => <SelectItem key={p.name} value={p.name}>{p.name}</SelectItem>)}
                </SelectContent>
              </Select>
              <Select value={filterLoadType} onValueChange={setFilterLoadType}>
                <SelectTrigger className="w-40">
                  <SelectValue placeholder="كل الأنواع" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">كل الأنواع</SelectItem>
                  {loadTypes.map(t => <SelectItem key={t.value} value={t.value}>{t.label}</SelectItem>)}
                </SelectContent>
              </Select>
              <div className="flex-1 min-w-[200px]">
                <Input
                  placeholder="بحث..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              {(filterPanel !== 'all' || filterLoadType !== 'all' || searchTerm) && (
                <Button variant="ghost" size="sm" onClick={() => { setFilterPanel('all'); setFilterLoadType('all'); setSearchTerm(''); }}>
                  <X className="w-4 h-4 me-2" />
                  إلغاء التصفية
                </Button>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Inputs Table */}
        <Card className="mb-6">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>جدول الأحمال ({filteredLoads.length})</CardTitle>
              <div className="flex gap-2 flex-wrap">
                <Button onClick={addLoad} size="sm">
                  <Plus className="w-4 h-4 me-2" />
                  إضافة صف
                </Button>
                <Button onClick={loadExample} variant="outline" size="sm">
                  <Zap className="w-4 h-4 me-2" />
                  تحميل مثال
                </Button>
                <Button onClick={clearAll} variant="outline" size="sm" className="text-red-600">
                  <X className="w-4 h-4 me-2" />
                  مسح الكل
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full text-sm border-collapse">
                <thead>
                  <tr className="border-b bg-slate-50">
                    <th className="p-2 text-right font-semibold">الاسم</th>
                    <th className="p-2 text-right font-semibold w-16">العدد</th>
                    <th className="p-2 text-right font-semibold">النوع</th>
                    <th className="p-2 text-right font-semibold">اللوحة</th>
                    <th className="p-2 text-right font-semibold w-20">الطور</th>
                    <th className="p-2 text-right font-semibold w-20">الجهد (V)</th>
                    <th className="p-2 text-right font-semibold w-20">الوحدة</th>
                    <th className="p-2 text-right font-semibold w-24">القيمة</th>
                    <th className="p-2 text-right font-semibold w-20">PF</th>
                    <th className="p-2 text-right font-semibold w-24">معامل الطلب</th>
                    <th className="p-2 text-right font-semibold">المغذي</th>
                    <th className="p-2 text-right font-semibold">الدائرة</th>
                    <th className="p-2 w-10"></th>
                  </tr>
                </thead>
                <tbody>
                  {filteredLoads.map((load) => (
                    <tr key={load.id} className="border-b">
                      <td className="p-2">
                        <Input
                          value={load.name}
                          onChange={(e) => updateLoad(load.id, 'name', e.target.value)}
                          placeholder="اسم الحمل"
                          className="text-sm"
                        />
                      </td>
                      <td className="p-2">
                        <Input
                          type="number"
                          value={load.qty}
                          onChange={(e) => updateLoad(load.id, 'qty', e.target.value)}
                          className="text-sm"
                          min="1"
                        />
                      </td>
                      <td className="p-2">
                        <Select value={load.loadType} onValueChange={(v) => updateLoad(load.id, 'loadType', v)}>
                          <SelectTrigger className="text-sm h-9">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            {loadTypes.map(t => (
                              <SelectItem key={t.value} value={t.value}>{t.label}</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </td>
                      <td className="p-2">
                        <Select value={load.panel} onValueChange={(v) => updateLoad(load.id, 'panel', v)}>
                          <SelectTrigger className="text-sm h-9">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            {panels.map(p => (
                              <SelectItem key={p.name} value={p.name}>{p.name}</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </td>
                      <td className="p-2">
                        <Select value={load.phase} onValueChange={(v) => updateLoad(load.id, 'phase', v)}>
                          <SelectTrigger className="text-sm h-9">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="1P">1P</SelectItem>
                            <SelectItem value="3P">3P</SelectItem>
                          </SelectContent>
                        </Select>
                      </td>
                      <td className="p-2">
                        <Input
                          type="number"
                          value={load.voltage}
                          onChange={(e) => updateLoad(load.id, 'voltage', e.target.value)}
                          className="text-sm"
                        />
                      </td>
                      <td className="p-2">
                        <Select value={load.unit} onValueChange={(v) => updateLoad(load.id, 'unit', v)}>
                          <SelectTrigger className="text-sm h-9">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="kW">kW</SelectItem>
                            <SelectItem value="kVA">kVA</SelectItem>
                            <SelectItem value="A">A</SelectItem>
                          </SelectContent>
                        </Select>
                      </td>
                      <td className="p-2">
                        <Input
                          type="number"
                          step="0.1"
                          value={load.value}
                          onChange={(e) => updateLoad(load.id, 'value', e.target.value)}
                          className="text-sm"
                        />
                      </td>
                      <td className="p-2">
                        <Input
                          type="number"
                          step="0.05"
                          min="0.1"
                          max="1"
                          value={load.pf}
                          onChange={(e) => updateLoad(load.id, 'pf', e.target.value)}
                          className="text-sm"
                        />
                      </td>
                      <td className="p-2">
                        <Input
                          type="number"
                          step="0.05"
                          min="0"
                          max="1"
                          value={load.demandFactor}
                          onChange={(e) => updateLoad(load.id, 'demandFactor', e.target.value)}
                          className="text-sm"
                        />
                      </td>
                      <td className="p-2">
                        <Input
                          value={load.feeder}
                          onChange={(e) => updateLoad(load.id, 'feeder', e.target.value)}
                          placeholder="المغذي"
                          className="text-sm w-20"
                        />
                      </td>
                      <td className="p-2">
                        <Input
                          value={load.circuitNo}
                          onChange={(e) => updateLoad(load.id, 'circuitNo', e.target.value)}
                          placeholder="الدائرة"
                          className="text-sm w-20"
                        />
                      </td>
                      <td className="p-2">
                        <div className="flex gap-1">
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => duplicateLoad(load.id)}
                            className="h-8 w-8 text-blue-500 hover:text-blue-700"
                            title="تكرار"
                          >
                            <Copy className="w-4 h-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => removeLoad(load.id)}
                            className="h-8 w-8 text-red-500 hover:text-red-700"
                            disabled={loads.length === 1}
                            title="حذف"
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>

        {/* Overall Summary */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200">
            <CardContent className="p-4">
              <div className="text-sm text-blue-600 mb-1">إجمالي الحمل المركب</div>
              <div className="text-2xl font-bold text-blue-900">{summary.totalConnectedKW} كيلوواط</div>
              <div className="text-xs text-blue-600">{summary.totalConnectedKVA} كيلو فولت أمبير</div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-emerald-50 to-emerald-100 border-emerald-200">
            <CardContent className="p-4">
              <div className="text-sm text-emerald-600 mb-1">إجمالي الحمل الفعلي</div>
              <div className="text-2xl font-bold text-emerald-900">{summary.totalDemandKW} كيلوواط</div>
              <div className="text-xs text-emerald-600">{summary.totalDemandKVA} كيلو فولت أمبير</div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-amber-50 to-amber-100 border-amber-200">
            <CardContent className="p-4">
              <div className="text-sm text-amber-600 mb-1">التيار المقدر @ 400V 3P</div>
              <div className="text-2xl font-bold text-amber-900">{summary.current3P} A</div>
              <div className="text-xs text-amber-600">@ 230V 1P: {summary.current1P} A</div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200">
            <CardContent className="p-4">
              <div className="text-sm text-purple-600 mb-1">معامل التنوع</div>
              <div className="text-2xl font-bold text-purple-900">{summary.diversityRatio}%</div>
              <div className="text-xs text-purple-600">Demand / Connected</div>
            </CardContent>
          </Card>
        </div>

        {/* Panel Summary */}
        <Card className="mb-6">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>ملخص اللوحات</CardTitle>
              <Button onClick={exportPanelSummary} variant="outline" size="sm">
                <Download className="w-4 h-4 me-2" />
                تصدير
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b bg-slate-50">
                    <th className="p-2 text-right font-semibold">اللوحة</th>
                    <th className="p-2 text-right font-semibold">النوع</th>
                    <th className="p-2 text-right font-semibold">kW مركب</th>
                    <th className="p-2 text-right font-semibold">kVA مركب</th>
                    <th className="p-2 text-right font-semibold">kW فعلي</th>
                    <th className="p-2 text-right font-semibold">kVA فعلي</th>
                    <th className="p-2 text-right font-semibold">التيار (A)</th>
                    <th className="p-2 text-right font-semibold">الجهد / الطور</th>
                    <th className="p-2 text-right font-semibold">الأحمال</th>
                    <th className="p-2 text-center"></th>
                  </tr>
                </thead>
                <tbody>
                  {summary.panelSummaries.map((panel) => (
                    <tr key={panel.name} className="border-b hover:bg-slate-50">
                      <td className="p-2 font-medium">{panel.name}</td>
                      <td className="p-2">
                        <Badge variant="secondary">{panel.type}</Badge>
                      </td>
                      <td className="p-2">{panel.connectedKW.toFixed(1)}</td>
                      <td className="p-2">{panel.connectedKVA.toFixed(1)}</td>
                      <td className="p-2 font-semibold text-emerald-600">{panel.demandKW.toFixed(1)}</td>
                      <td className="p-2">{panel.demandKVA.toFixed(1)}</td>
                      <td className="p-2 font-bold">
                        {panel.current.toFixed(1)}
                        {panel.hasMixedPhases && <span className="text-xs text-amber-600 ms-1">*</span>}
                      </td>
                      <td className="p-2 text-xs">{panel.voltage}V {panel.phase}</td>
                      <td className="p-2 text-center">
                        <Badge variant="outline">{panel.loads.length}</Badge>
                      </td>
                      <td className="p-2 text-center">
                        <div className="flex gap-1">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => setSelectedPanelDetails(panel)}
                          >
                            <Eye className="w-4 h-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => exportPanel(panel.name)}
                          >
                            <Download className="w-4 h-4" />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            {summary.panelSummaries.some(p => p.hasMixedPhases) && (
              <p className="text-xs text-amber-600 mt-2">* اللوحة تحتوي على أحمال بأطوار مختلطة</p>
            )}
          </CardContent>
        </Card>

        {/* Panel Details Dialog */}
        {selectedPanelDetails && (
          <Dialog open={!!selectedPanelDetails} onOpenChange={() => setSelectedPanelDetails(null)}>
            <DialogContent className="max-w-5xl max-h-[80vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>تفاصيل {selectedPanelDetails.name}</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div className="grid grid-cols-4 gap-4">
                  <div className="p-3 bg-blue-50 rounded">
                    <div className="text-xs text-blue-600">kW مركب</div>
                    <div className="text-lg font-bold">{selectedPanelDetails.connectedKW.toFixed(1)}</div>
                  </div>
                  <div className="p-3 bg-emerald-50 rounded">
                    <div className="text-xs text-emerald-600">kW فعلي</div>
                    <div className="text-lg font-bold">{selectedPanelDetails.demandKW.toFixed(1)}</div>
                  </div>
                  <div className="p-3 bg-amber-50 rounded">
                    <div className="text-xs text-amber-600">التيار</div>
                    <div className="text-lg font-bold">{selectedPanelDetails.current.toFixed(1)} A</div>
                  </div>
                  <div className="p-3 bg-purple-50 rounded">
                    <div className="text-xs text-purple-600">الأحمال</div>
                    <div className="text-lg font-bold">{selectedPanelDetails.loads.length}</div>
                  </div>
                </div>
                
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b bg-slate-50">
                      <th className="p-2 text-right">الاسم</th>
                      <th className="p-2 text-right">المغذي</th>
                      <th className="p-2 text-right">الدائرة</th>
                      <th className="p-2 text-right">kW فعلي</th>
                      <th className="p-2 text-right">التيار (A)</th>
                    </tr>
                  </thead>
                  <tbody>
                    {selectedPanelDetails.loads.map((load) => (
                      <tr key={load.id} className="border-b">
                        <td className="p-2">{load.name}</td>
                        <td className="p-2">{load.feeder || '-'}</td>
                        <td className="p-2">{load.circuitNo || '-'}</td>
                        <td className="p-2 font-semibold">{load.demandKW}</td>
                        <td className="p-2">{load.current}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </DialogContent>
          </Dialog>
        )}

        <div className="grid lg:grid-cols-3 gap-6 mb-6">
          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle>أعلى 5 أحمال فعلية</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {summary.topLoads.map((load, idx) => (
                  <div key={idx} className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
                    <div className="flex items-center gap-3">
                      <Badge variant="secondary">{idx + 1}</Badge>
                      <div>
                        <div className="font-medium">{load.name || 'بدون اسم'}</div>
                        <div className="text-xs text-slate-500">
                          {load.panel} | {load.qty}x {load.value} {load.unit} | PF: {load.pf}
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="font-bold text-emerald-600">{load.demandKW} كيلوواط</div>
                      <div className="text-xs text-slate-500">{load.current} أمبير</div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>تصدير</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <Button onClick={copySummary} variant="outline" className="w-full">
                <Copy className="w-4 h-4 me-2" />
                نسخ الملخص
              </Button>
              <Button onClick={exportCSV} variant="outline" className="w-full">
                <Download className="w-4 h-4 me-2" />
                تصدير كامل (CSV)
              </Button>
              <Button onClick={exportPanelSummary} variant="outline" className="w-full">
                <Download className="w-4 h-4 me-2" />
                تصدير اللوحات (CSV)
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Results Table */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>النتائج التفصيلية</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b bg-slate-50">
                    <th className="p-2 text-right font-semibold">الاسم</th>
                    <th className="p-2 text-right font-semibold">اللوحة</th>
                    <th className="p-2 text-right font-semibold">kW مركب</th>
                    <th className="p-2 text-right font-semibold">kVA مركب</th>
                    <th className="p-2 text-right font-semibold">kW فعلي</th>
                    <th className="p-2 text-right font-semibold">kVA فعلي</th>
                    <th className="p-2 text-right font-semibold">التيار (A)</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredLoads.map((load) => (
                    <tr key={load.id} className="border-b hover:bg-slate-50">
                      <td className="p-2">{load.name || 'بدون اسم'}</td>
                      <td className="p-2">
                        <Badge variant="outline" className="text-xs">{load.panel}</Badge>
                      </td>
                      <td className="p-2">{load.connectedKW}</td>
                      <td className="p-2">{load.connectedKVA}</td>
                      <td className="p-2 font-semibold">{load.demandKW}</td>
                      <td className="p-2">{load.demandKVA}</td>
                      <td className="p-2">{load.current}</td>
                    </tr>
                  ))}
                  <tr className="border-t-2 font-bold bg-slate-100">
                    <td className="p-2">المجموع</td>
                    <td className="p-2"></td>
                    <td className="p-2">{summary.totalConnectedKW}</td>
                    <td className="p-2">{summary.totalConnectedKVA}</td>
                    <td className="p-2 text-emerald-600">{summary.totalDemandKW}</td>
                    <td className="p-2">{summary.totalDemandKVA}</td>
                    <td className="p-2">{summary.current3P}</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>

        {/* Worked Example */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>شرح المثال التوضيحي</CardTitle>
          </CardHeader>
          <CardContent className="prose prose-slate max-w-none">
            <p className="text-slate-600 leading-relaxed">
              المثال التوضيحي يوضح جدول أحمال نموذجي لمبنى تجاري متوسط الحجم مع توزيع الأحمال على اللوحات المختلفة:
            </p>
            <ul className="text-slate-600 space-y-2">
              <li><strong>DB-L1:</strong> لوحة الإضاءة - تحتوي على الإضاءة مع معامل طلب 0.9</li>
              <li><strong>DB-P1:</strong> لوحة المقابس - المقابس ومعدات المطبخ مع معاملات طلب مختلفة</li>
              <li><strong>SMDB-01:</strong> لوحة فرعية - وحدات التكييف (AHU, FCU) مع معاملات طلب عالية</li>
              <li><strong>MCC-01:</strong> مركز التحكم بالمحركات - مضخات المياه المبردة (واحدة عاملة + احتياطي)</li>
              <li><strong>MDB-01:</strong> اللوحة الرئيسية - مضخات الحريق والمصاعد مع معاملات طلب متنوعة</li>
              <li><strong>DB-ELV1:</strong> لوحة الأحمال الصغيرة - أحمال ELV/ICT</li>
            </ul>
            
            <h4 className="text-lg font-semibold mt-6 mb-3">ملخص اللوحات:</h4>
            <p className="text-slate-600">
              يتم حساب تيار كل لوحة بناءً على إجمالي الحمل الفعلي (Demand kVA) والجهد والطور المحدد للوحة. 
              عند وجود أحمال بأطوار مختلطة في نفس اللوحة، يتم استخدام إعدادات اللوحة الافتراضية ويتم الإشارة إلى ذلك بعلامة (*).
            </p>

            <div className="bg-blue-50 border-r-4 border-blue-500 p-4 mt-6">
              <p className="text-sm text-blue-900">
                <strong>ملاحظة:</strong> معامل الطلب الصفري للمضخة الاحتياطية يعني أنها لن تعمل في نفس الوقت مع المضخة الرئيسية.
                تيار اللوحة يُحسب من إجمالي الحمل الفعلي فقط.
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Assumptions */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>الافتراضات والحدود</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2 text-slate-600">
              <li className="flex items-start gap-2">
                <span className="text-emerald-600 mt-1">✓</span>
                الجهد المقنن 230V أحادي الطور، 400V ثلاثي الطور (IEC)
              </li>
              <li className="flex items-start gap-2">
                <span className="text-emerald-600 mt-1">✓</span>
                يمكن تخصيص جهد وطور كل لوحة من خلال إعدادات اللوحات
              </li>
              <li className="flex items-start gap-2">
                <span className="text-emerald-600 mt-1">✓</span>
                تيار اللوحة يُحسب من إجمالي الحمل الفعلي (Demand kVA) لجميع الأحمال في اللوحة
              </li>
              <li className="flex items-start gap-2">
                <span className="text-emerald-600 mt-1">✓</span>
                الأحمال ثلاثية الطور تفترض حمل متوازن
              </li>
              <li className="flex items-start gap-2">
                <span className="text-amber-600 mt-1">⚠</span>
                هذا الجدول للتقدير الأولي - يجب مراجعة الحسابات التفصيلية
              </li>
              <li className="flex items-start gap-2">
                <span className="text-amber-600 mt-1">⚠</span>
                عند وجود أحمال بأطوار مختلطة في اللوحة، يتم استخدام إعدادات اللوحة الافتراضية
              </li>
            </ul>
          </CardContent>
        </Card>

        {/* FAQ */}
        <Card>
          <CardHeader>
            <CardTitle>الأسئلة الشائعة</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <h4 className="font-semibold text-slate-900 mb-2">كيف يتم حساب تيار اللوحة؟</h4>
              <p className="text-slate-600 text-sm">
                تيار اللوحة = (إجمالي الحمل الفعلي بالـ kVA × 1000) ÷ (√3 × الجهد) للأحمال ثلاثية الطور، أو (إجمالي الحمل الفعلي بالـ kVA × 1000) ÷ الجهد للأحمال أحادية الطور.
              </p>
            </div>
            <Separator />
            <div>
              <h4 className="font-semibold text-slate-900 mb-2">ماذا يعني الأحمال بأطوار مختلطة؟</h4>
              <p className="text-slate-600 text-sm">
                عندما تحتوي اللوحة على أحمال أحادية الطور وثلاثية الطور معاً. في هذه الحالة يتم حساب تيار اللوحة باستخدام إعدادات الطور والجهد الافتراضية للوحة.
              </p>
            </div>
            <Separator />
            <div>
              <h4 className="font-semibold text-slate-900 mb-2">كيف أحدد معامل الطلب للمضخة الاحتياطية؟</h4>
              <p className="text-slate-600 text-sm">
                استخدم معامل طلب 0 أو 0.0 للمضخة الاحتياطية إذا كانت لن تعمل في نفس الوقت مع المضخة الرئيسية. سيتم احتسابها في الحمل المركب ولكن ليس في الحمل الفعلي.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}