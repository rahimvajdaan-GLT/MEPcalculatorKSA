import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { base44 } from '@/api/base44Client';
import { useQuery } from '@tanstack/react-query';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import { AlertTriangle, Calculator, Plus, Trash2, Flame, TrendingUp, Droplets, Copy, Download } from 'lucide-react';
import { motion } from 'framer-motion';
import LanguageSwitcher from '../components/layout/LanguageSwitcher';

const materialPresets = {
  blackSteel: { nameAr: 'حديد أسود', nameEn: 'Black Steel', c: 120 },
  galvanized: { nameAr: 'حديد مجلفن', nameEn: 'Galvanized', c: 120 },
  ductileIron: { nameAr: 'حديد مرن بطانة إسمنت', nameEn: 'Cement Lined Ductile Iron', c: 140 },
  plastic: { nameAr: 'بلاستيك (معتمد)', nameEn: 'Plastic (Listed)', c: 150 },
  copper: { nameAr: 'نحاس', nameEn: 'Copper Tube', c: 150 },
  stainless: { nameAr: 'ستانلس ستيل', nameEn: 'Stainless Steel', c: 150 }
};



const calculateHazenWilliams = (flow, length, diameter, c, isMetric) => {
  if (isMetric) {
    // METRIC (SI) CALCULATION
    const Q_m3s = flow / 60000; // L/min to m³/s
    const d_m = diameter / 1000; // mm to m
    const L_m = length; // meters
    const C = c;
    
    // Head loss slope (m/m): Sf = 10.67 * Q^1.852 / (C^1.852 * d^4.8704)
    const Sf = 10.67 * Math.pow(Q_m3s, 1.852) / (Math.pow(C, 1.852) * Math.pow(d_m, 4.8704));
    
    // Total head loss (m)
    const hf_m = Sf * L_m;
    
    // Head loss per 100m
    const hf_per_100m = Sf * 100;
    
    // Convert to pressure
    const dP_kPa = 9.80665 * hf_m;
    const dP_bar = dP_kPa / 100;
    const dP_kPa_per_100m = 9.80665 * hf_per_100m;
    
    // Velocity (m/s)
    const area = Math.PI * Math.pow(d_m, 2) / 4;
    const V_ms = Q_m3s / area;
    
    return {
      velocity: V_ms,
      frictionLossPer100: dP_kPa_per_100m,
      totalFrictionLoss: hf_m,
      pressureLoss_kPa: dP_kPa,
      pressureLoss_bar: dP_bar
    };
  } else {
    // IMPERIAL (NFPA-style) CALCULATION
    const Q_gpm = flow;
    const d_in = diameter; // inches
    const L_ft = length; // feet
    const C = c;
    
    // Pressure drop per foot (psi/ft): S = 4.52 * Q^1.85 / (C^1.85 * d^4.87)
    const S = 4.52 * Math.pow(Q_gpm, 1.85) / (Math.pow(C, 1.85) * Math.pow(d_in, 4.87));
    
    // Total pressure drop (psi)
    const dP_psi = S * L_ft;
    
    // Pressure drop per 100 ft
    const dP_psi_per_100ft = S * 100;
    
    // Velocity (ft/s): V = 0.408 * Q / d²
    const V_fts = 0.408 * Q_gpm / Math.pow(d_in, 2);
    
    return {
      velocity: V_fts,
      frictionLossPer100: dP_psi_per_100ft,
      totalFrictionLoss: dP_psi
    };
  }
};

export default function EN_HazenWilliams_Calculator() {
  const navigate = useNavigate();
  const [unitsMode, setUnitsMode] = useState('metric');
  const [mode, setMode] = useState('single');
  const [velocityThreshold, setVelocityThreshold] = useState(3.0);
  const [frictionThreshold, setFrictionThreshold] = useState(0.5);
  const [showCompare, setShowCompare] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [compareForSegment, setCompareForSegment] = useState(null);
  
  const { data: pipeStandards = [] } = useQuery({
    queryKey: ['pipeStandards'],
    queryFn: () => base44.entities.PipeStandard.list(),
  });
  
  const { data: allPipeSizes = [] } = useQuery({
    queryKey: ['pipeSizes'],
    queryFn: () => base44.entities.PipeSize.list('displayOrder'),
  });
  
  const [segments, setSegments] = useState([{
    id: 1,
    name: 'Segment 1',
    flow: 1000,
    straightLength: 50,
    equivalentLength: 10,
    material: 'blackSteel',
    pipeStandard: 'SCH80',
    nominalSize: '4',
    diameter: 97.2,
    manualDiameter: false,
    cFactor: 120
  }]);
  
  const [results, setResults] = useState(null);
  
  const addSegment = () => {
    const newId = Math.max(...segments.map(s => s.id)) + 1;
    const lastSeg = segments[segments.length - 1];
    setSegments([...segments, {
      id: newId,
      name: `Segment ${newId}`,
      flow: lastSeg.flow,
      straightLength: 50,
      equivalentLength: 10,
      material: lastSeg.material,
      nominalSize: lastSeg.nominalSize,
      diameter: lastSeg.diameter,
      cFactor: lastSeg.cFactor
    }]);
  };
  
  const selectPipeSize = (segmentId, nominal, diameter) => {
    setSegments(segments.map(s => {
      if (s.id === segmentId) {
        return { ...s, nominalSize: nominal, diameter, manualDiameter: false };
      }
      return s;
    }));
    setShowCompare(false);
    setCompareForSegment(null);
  };
  
  const removeSegment = (id) => {
    if (segments.length > 1) {
      setSegments(segments.filter(s => s.id !== id));
    }
  };
  
  const updateSegment = (id, field, value) => {
    setSegments(segments.map(s => {
      if (s.id === id) {
        const updated = { ...s, [field]: value };
        
        if (field === 'material') {
          updated.cFactor = materialPresets[value].c;
        }
        
        if (field === 'pipeStandard' && !s.manualDiameter) {
          const sizes = allPipeSizes.filter(p => p.standardKey === value);
          if (sizes.length > 0) {
            updated.nominalSize = sizes[0].nominalInch;
            updated.diameter = sizes[0].insideDiameter_mm;
          }
        }
        
        if (field === 'nominalSize' && !s.manualDiameter) {
          const found = allPipeSizes.find(p => p.standardKey === s.pipeStandard && p.nominalInch === value);
          if (found) updated.diameter = found.insideDiameter_mm;
        }
        
        return updated;
      }
      return s;
    }));
  };
  
  const handleCalculate = () => {
    const segmentResults = segments.map(seg => {
      const totalLength = parseFloat(seg.straightLength) + parseFloat(seg.equivalentLength);
      const calc = calculateHazenWilliams(
        parseFloat(seg.flow),
        totalLength,
        parseFloat(seg.diameter),
        parseFloat(seg.cFactor),
        unitsMode === 'metric'
      );
      
      return {
        ...seg,
        totalLength,
        ...calc,
        warnings: []
      };
    });
    
    const totalFriction = segmentResults.reduce((sum, r) => sum + r.totalFrictionLoss, 0);
    const totalEquivLength = segmentResults.reduce((sum, r) => sum + r.totalLength, 0);
    
    setResults({
      segments: segmentResults,
      totalFriction,
      totalEquivLength
    });
  };
  
  const getStandardName = (key) => {
    const std = pipeStandards.find(s => s.standardKey === key);
    return std ? std.nameEn : key;
  };
  
  const copyResults = () => {
    if (!results) return;
    
    let text = 'Hazen-Williams Calculator Results\n\n';
    text += `Total Pressure Loss: ${(results.segments.reduce((sum, s) => sum + (s.pressureLoss_bar || 0), 0)).toFixed(3)} bar\n`;
    text += `Total Equivalent Length: ${results.totalEquivLength.toFixed(1)} ${unitsMode === 'metric' ? 'm' : 'ft'}\n\n`;
    
    results.segments.forEach((seg, idx) => {
      text += `${seg.name}:\n`;
      text += `  Size: ${seg.nominalSize}\n`;
      text += `  Flow: ${seg.flow} ${unitsMode === 'metric' ? 'L/min' : 'gpm'}\n`;
      text += `  Velocity: ${seg.velocity.toFixed(2)} ${unitsMode === 'metric' ? 'm/s' : 'ft/s'}\n`;
      if (unitsMode === 'metric') {
        text += `  Pressure Loss: ${seg.pressureLoss_bar?.toFixed(3)} bar (${seg.pressureLoss_kPa?.toFixed(2)} kPa)\n`;
        text += `  Loss per 100m: ${(seg.frictionLossPer100 / 9.80665).toFixed(3)} bar\n`;
      } else {
        text += `  Pressure Loss: ${seg.totalFrictionLoss.toFixed(2)} psi\n`;
        text += `  Loss per 100ft: ${seg.frictionLossPer100.toFixed(2)} psi\n`;
      }
      text += '\n';
    });
    
    navigator.clipboard.writeText(text);
  };
  
  const exportToCSV = () => {
    if (!results) return;
    
    const headers = unitsMode === 'metric' 
      ? ['Segment', 'Flow (L/min)', 'Length (m)', 'Size', 'Velocity (m/s)', 'Pressure Loss (bar)', 'Pressure Loss (kPa)', 'Loss/100m (bar)']
      : ['Segment', 'Flow (gpm)', 'Length (ft)', 'Size', 'Velocity (ft/s)', 'Pressure Loss (psi)', 'Loss/100ft (psi)'];
    
    const rows = results.segments.map(seg => {
      if (unitsMode === 'metric') {
        return [
          seg.name,
          seg.flow,
          seg.totalLength.toFixed(1),
          seg.nominalSize,
          seg.velocity.toFixed(2),
          seg.pressureLoss_bar?.toFixed(3),
          seg.pressureLoss_kPa?.toFixed(2),
          (seg.frictionLossPer100 / 9.80665).toFixed(3)
        ];
      } else {
        return [
          seg.name,
          seg.flow,
          seg.totalLength.toFixed(1),
          seg.nominalSize,
          seg.velocity.toFixed(2),
          seg.totalFrictionLoss.toFixed(2),
          seg.frictionLossPer100.toFixed(2)
        ];
      }
    });
    
    const csv = [headers, ...rows].map(row => row.join(',')).join('\n');
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `hazen-williams-results-${new Date().toISOString().split('T')[0]}.csv`;
    link.click();
  };
  
  return (
    <div className="min-h-screen">
      <section className="relative overflow-hidden bg-gradient-to-br from-red-500 to-orange-500 text-white">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0" style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23fff' fill-opacity='0.2'%3E%3Ccircle cx='30' cy='30' r='4'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
          }} />
        </div>
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 relative">
          <div className="flex justify-between items-start mb-6">
            <div className="flex items-center gap-6">
              <div className="w-16 h-16 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center">
                <Flame className="w-8 h-8 text-white" />
              </div>
              <div>
                <h1 className="text-3xl sm:text-4xl font-bold mb-2">
                  Hazen-Williams Friction Loss
                </h1>
                <p className="text-lg text-white/80">
                  Calculate pressure loss in fire protection pipes
                </p>
              </div>
            </div>
            <LanguageSwitcher currentLanguage="en" targetPage="AR_HazenWilliams_Calculator" />
          </div>
        </div>
        
        <div className="absolute bottom-0 left-0 right-0">
          <svg viewBox="0 0 1440 60" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path fill="#f8fafc" d="M0,40 C360,60 720,20 1440,40 L1440,60 L0,60 Z" />
          </svg>
        </div>
      </section>
      
      <section className="py-6 bg-amber-50 border-b border-amber-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-start gap-3">
            <AlertTriangle className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
            <p className="text-amber-800 text-sm">
              <strong>Disclaimer:</strong> Preliminary tool — verify per SBC / Civil Defense, project specs, and applicable standards (NFPA/IEC).
            </p>
          </div>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle>Settings</CardTitle>
                  <div className="flex gap-2">
                    <Button
                      variant={unitsMode === 'metric' ? 'default' : 'outline'}
                      size="sm"
                      onClick={() => setUnitsMode('metric')}
                    >
                      Metric
                    </Button>
                    <Button
                      variant={unitsMode === 'imperial' ? 'default' : 'outline'}
                      size="sm"
                      onClick={() => setUnitsMode('imperial')}
                    >
                      Imperial
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex gap-2">
                  <Button
                    variant={mode === 'single' ? 'default' : 'outline'}
                    onClick={() => setMode('single')}
                    className="flex-1"
                  >
                    Single Run
                  </Button>
                  <Button
                    variant={mode === 'multi' ? 'default' : 'outline'}
                    onClick={() => setMode('multi')}
                    className="flex-1"
                  >
                    Multi-Segment
                  </Button>
                </div>
                
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setShowSettings(!showSettings)}
                  className="w-full"
                >
                  {showSettings ? 'Hide Advanced Settings' : 'Advanced Settings'}
                </Button>
                
                {showSettings && (
                  <div className="space-y-4 pt-4 border-t">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label>Velocity Threshold ({unitsMode === 'metric' ? 'm/s' : 'ft/s'})</Label>
                        <Input
                          type="number"
                          step="0.1"
                          value={velocityThreshold}
                          onChange={(e) => setVelocityThreshold(parseFloat(e.target.value))}
                        />
                      </div>
                      <div>
                        <Label>Friction Threshold ({unitsMode === 'metric' ? 'bar/100m' : 'psi/100ft'})</Label>
                        <Input
                          type="number"
                          step="0.1"
                          value={frictionThreshold}
                          onChange={(e) => setFrictionThreshold(parseFloat(e.target.value))}
                        />
                      </div>
                    </div>
                    
                    <div>
                      <Label className="text-xs text-slate-600">Default C-Factor Presets</Label>
                      <div className="text-xs space-y-1 mt-2 bg-slate-50 p-2 rounded">
                        {Object.entries(materialPresets).map(([key, mat]) => (
                          <div key={key} className="flex justify-between">
                            <span>{mat.nameEn}</span>
                            <span className="font-mono">C = {mat.c}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            {segments.map((seg, idx) => (
              <Card key={seg.id}>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-lg">
                      <Input
                        value={seg.name}
                        onChange={(e) => updateSegment(seg.id, 'name', e.target.value)}
                        className="font-semibold"
                      />
                    </CardTitle>
                    {mode === 'multi' && segments.length > 1 && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => removeSegment(seg.id)}
                      >
                        <Trash2 className="w-4 h-4 text-red-500" />
                      </Button>
                    )}
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label>Flow ({unitsMode === 'metric' ? 'L/min' : 'gpm'})</Label>
                      <Input
                        type="number"
                        value={seg.flow}
                        onChange={(e) => updateSegment(seg.id, 'flow', e.target.value)}
                      />
                    </div>
                    <div>
                      <Label>Straight Length ({unitsMode === 'metric' ? 'm' : 'ft'})</Label>
                      <Input
                        type="number"
                        value={seg.straightLength}
                        onChange={(e) => updateSegment(seg.id, 'straightLength', e.target.value)}
                      />
                    </div>
                    <div>
                      <Label>Equivalent Length ({unitsMode === 'metric' ? 'm' : 'ft'})</Label>
                      <Input
                        type="number"
                        value={seg.equivalentLength}
                        onChange={(e) => updateSegment(seg.id, 'equivalentLength', e.target.value)}
                      />
                    </div>
                    <div>
                      <Label>Material</Label>
                      <Select
                        value={seg.material}
                        onValueChange={(v) => updateSegment(seg.id, 'material', v)}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {Object.entries(materialPresets).map(([key, mat]) => (
                            <SelectItem key={key} value={key}>
                              {mat.nameEn} (C={mat.c})
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label>Pipe Standard</Label>
                      <Select
                        value={seg.pipeStandard}
                        onValueChange={(v) => updateSegment(seg.id, 'pipeStandard', v)}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {pipeStandards.map(std => (
                            <SelectItem key={std.standardKey} value={std.standardKey}>
                              {std.nameEn}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label>Nominal Size</Label>
                      <Select
                        value={seg.nominalSize}
                        onValueChange={(v) => updateSegment(seg.id, 'nominalSize', v)}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {allPipeSizes
                            .filter(p => p.standardKey === seg.pipeStandard)
                            .map(p => (
                              <SelectItem key={p.nominalInch} value={p.nominalInch}>
                                {p.nominalInch}"
                              </SelectItem>
                            ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <Label>Inside Diameter (mm)</Label>
                        <label className="flex items-center gap-2 text-xs text-slate-600">
                          <input
                            type="checkbox"
                            checked={seg.manualDiameter}
                            onChange={(e) => updateSegment(seg.id, 'manualDiameter', e.target.checked)}
                          />
                          Manual override
                        </label>
                      </div>
                      <Input
                        type="number"
                        step="0.1"
                        value={seg.diameter}
                        onChange={(e) => updateSegment(seg.id, 'diameter', e.target.value)}
                        disabled={!seg.manualDiameter}
                        className={!seg.manualDiameter ? 'bg-slate-50' : ''}
                      />
                      <p className="text-xs text-slate-500 mt-1">
                        Verify ID per manufacturer / project specifications
                      </p>
                    </div>
                    <div>
                      <Label>C-Factor (Editable)</Label>
                      <Input
                        type="number"
                        value={seg.cFactor}
                        onChange={(e) => updateSegment(seg.id, 'cFactor', e.target.value)}
                      />
                    </div>
                  </div>
                  <p className="text-xs text-amber-600 mt-2">
                    ⚠️ Verify C per project specs / manufacturer / condition of pipe.
                  </p>
                </CardContent>
              </Card>
            ))}
            
            {mode === 'multi' && (
              <Button onClick={addSegment} variant="outline" className="w-full">
                <Plus className="w-4 h-4 mr-2" />
                Add Segment
              </Button>
            )}
            
            <Button onClick={handleCalculate} className="w-full bg-red-600 hover:bg-red-700">
              <Calculator className="w-5 h-5 mr-2" />
              Calculate
            </Button>
          </div>

          <div className="space-y-6">
            {results && (
              <>
                <Card className="bg-gradient-to-br from-red-50 to-orange-50 border-red-200">
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-red-800">Total Results</CardTitle>
                      <div className="flex gap-2">
                        <Button variant="ghost" size="sm" onClick={copyResults}>
                          <Copy className="w-4 h-4" />
                        </Button>
                        {mode === 'multi' && (
                          <Button variant="ghost" size="sm" onClick={exportToCSV}>
                            <Download className="w-4 h-4" />
                          </Button>
                        )}
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div>
                      <div className="text-sm text-slate-600">Total Friction Loss</div>
                      {unitsMode === 'metric' ? (
                        <>
                          <div className="text-2xl font-bold text-red-700">
                            {(results.segments.reduce((sum, s) => sum + (s.pressureLoss_bar || 0), 0)).toFixed(3)}
                            <span className="text-sm font-normal ml-1">bar</span>
                          </div>
                          <div className="text-sm text-slate-600 mt-1">
                            {(results.segments.reduce((sum, s) => sum + (s.pressureLoss_kPa || 0), 0)).toFixed(2)} kPa
                            {' • '}
                            {results.totalFriction.toFixed(2)} m (head)
                          </div>
                        </>
                      ) : (
                        <div className="text-2xl font-bold text-red-700">
                          {results.totalFriction.toFixed(2)}
                          <span className="text-sm font-normal ml-1">psi</span>
                        </div>
                      )}
                    </div>
                    <Separator />
                    <div>
                      <div className="text-sm text-slate-600">Total Equivalent Length</div>
                      <div className="text-xl font-semibold">
                        {results.totalEquivLength.toFixed(1)} {unitsMode === 'metric' ? 'm' : 'ft'}
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {results.segments.map((seg, idx) => (
                  <Card key={seg.id}>
                    <CardHeader>
                      <div className="flex items-center justify-between">
                        <CardTitle className="text-base">{seg.name}</CardTitle>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => {
                            setCompareForSegment(seg.id);
                            setShowCompare(true);
                          }}
                        >
                          <TrendingUp className="w-4 h-4" />
                        </Button>
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-slate-600">Size:</span>
                        <span className="font-semibold">{seg.nominalSize}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-600">Velocity:</span>
                        <span className={`font-semibold ${seg.velocity > velocityThreshold ? 'text-amber-600' : ''}`}>
                          {seg.velocity.toFixed(2)} {unitsMode === 'metric' ? 'm/s' : 'ft/s'}
                          {seg.velocity > velocityThreshold && ' ⚠️'}
                        </span>
                      </div>
                      {unitsMode === 'metric' ? (
                        <>
                          <div className="flex justify-between">
                            <span className="text-slate-600">Pressure Loss:</span>
                            <span className="font-semibold">
                              {seg.pressureLoss_bar?.toFixed(3)} bar
                            </span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-slate-600 text-xs">kPa / Head Loss:</span>
                            <span className="font-normal text-xs">
                              {seg.pressureLoss_kPa?.toFixed(2)} kPa • {seg.totalFrictionLoss.toFixed(2)} m
                            </span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-slate-600">Loss per 100m:</span>
                            <span className={`font-semibold ${(seg.frictionLossPer100 / 9.80665) > frictionThreshold ? 'text-amber-600' : ''}`}>
                              {(seg.frictionLossPer100 / 9.80665).toFixed(3)} bar
                              {(seg.frictionLossPer100 / 9.80665) > frictionThreshold && ' ⚠️'}
                            </span>
                          </div>
                        </>
                      ) : (
                        <>
                          <div className="flex justify-between">
                            <span className="text-slate-600">Pressure Loss:</span>
                            <span className="font-semibold">
                              {seg.totalFrictionLoss.toFixed(2)} psi
                            </span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-slate-600">Loss per 100ft:</span>
                            <span className="font-semibold">
                              {seg.frictionLossPer100.toFixed(2)} psi
                            </span>
                          </div>
                        </>
                      )}
                    </CardContent>
                  </Card>
                ))}
              </>
            )}
          </div>
        </div>

        {showCompare && results && compareForSegment && (
          <Card className="mt-6">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Compare Pipe Sizes</CardTitle>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => {
                    setShowCompare(false);
                    setCompareForSegment(null);
                  }}
                >
                  Close
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left p-2">Size</th>
                      <th className="text-left p-2">Diameter ({unitsMode === 'metric' ? 'mm' : 'in'})</th>
                      <th className="text-left p-2">Velocity</th>
                      <th className="text-left p-2">Loss/100</th>
                      <th className="text-left p-2"></th>
                    </tr>
                  </thead>
                  <tbody>
                    {allPipeSizes
                      .filter(ps => {
                        const segment = segments.find(s => s.id === compareForSegment);
                        return segment && ps.standardKey === segment.pipeStandard;
                      })
                      .map(ps => {
                        const segment = segments.find(s => s.id === compareForSegment);
                        const calc = calculateHazenWilliams(
                          parseFloat(segment.flow),
                          100,
                          ps.insideDiameter_mm,
                          parseFloat(segment.cFactor),
                          true
                        );
                        const isSelected = segment.nominalSize === ps.nominalInch;
                        const lossPerUnit = (calc.frictionLossPer100 / 9.80665).toFixed(3);
                        
                        return (
                          <tr 
                            key={ps.nominalInch} 
                            className={`border-b hover:bg-slate-50 cursor-pointer ${isSelected ? 'bg-blue-50' : ''}`}
                            onClick={() => selectPipeSize(compareForSegment, ps.nominalInch, ps.insideDiameter_mm)}
                          >
                            <td className="p-2 font-medium">{ps.nominalInch}"</td>
                            <td className="p-2">{ps.insideDiameter_mm} mm</td>
                            <td className={`p-2 ${calc.velocity > velocityThreshold ? 'text-amber-600 font-semibold' : ''}`}>
                              {calc.velocity.toFixed(2)} m/s
                            </td>
                            <td className={`p-2 ${parseFloat(lossPerUnit) > frictionThreshold ? 'text-amber-600 font-semibold' : ''}`}>
                              {lossPerUnit} bar
                            </td>
                            <td className="p-2">
                              {isSelected && <Badge variant="default" className="text-xs">Selected</Badge>}
                            </td>
                          </tr>
                        );
                      })}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}