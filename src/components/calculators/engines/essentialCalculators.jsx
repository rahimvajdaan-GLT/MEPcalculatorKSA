// Preliminary MEP calculators: SI conversion, formula disclosure and strict finite input validation.
const round = x => Math.round(x*1000)/1000;
const specs = [{"slug":"cooling-load-estimate","trade":"hvac","en":"Cooling Load Estimate","ar":"تقدير حمل التبريد","inputs":[["area","Floor Area","مساحة الأرضية","m²","ft²",120,1292],["loadDensity","Preliminary Cooling Density","كثافة حمل التبريد التقديرية","W/m²","BTU/h/ft²",120,38],["diversity","Load Multiplier","معامل الحمل","ratio","ratio",1,1]],"outputs":[["coolingKw","Cooling Load","حمل التبريد","kW","BTU/h"],["tonRefrigeration","Cooling Capacity","سعة التبريد","TR","TR"]],"expression":"const kw=i.area*(u==='imperial'?10.7639104:1)*i.loadDensity*(u==='imperial'?0.29307107/10.7639104:1)*i.diversity/1000;return {coolingKw:u==='imperial'?kw*3412.142:kw,tonRefrigeration:kw/3.51685284};","assumptionEn":"Preliminary area-based screening only; not an ASHRAE heat-gain/load model.","assumptionAr":"تقدير أولي حسب المساحة وليس حساب حمل حراري تفصيلي"},{"slug":"fresh-air-ventilation","trade":"hvac","en":"Fresh Air Ventilation","ar":"حساب الهواء النقي","inputs":[["people","Occupants","عدد الأشخاص","persons","persons",20,20],["ratePerson","Outdoor Air per Person","هواء خارجي لكل شخص","L/s/person","CFM/person",7.5,15.9],["area","Floor Area","مساحة المساحة","m²","ft²",100,1076],["rateArea","Outdoor Air per Area","هواء خارجي لكل مساحة","L/s/m²","CFM/ft²",0.3,0.059]],"outputs":[["airflow","Outdoor Airflow","تدفق الهواء الخارجي","L/s","CFM"],["airflowM3h","Outdoor Airflow","تدفق الهواء الخارجي","m³/h","CFM"]],"expression":"const ls=i.people*i.ratePerson*(u==='imperial'?0.47194745:1)+i.area*i.rateArea*(u==='imperial'?0.47194745:1);return {airflow:u==='imperial'?ls/0.47194745:ls,airflowM3h:u==='imperial'?ls/0.47194745:ls*3.6};","assumptionEn":"Simple people-plus-area estimate; ventilation effectiveness and occupancy-specific code rates must be checked.","assumptionAr":"تقدير أولي ويجب التحقق من معدلات الإشغال والكود"},{"slug":"lighting-illuminance","trade":"electrical","en":"Lighting Illuminance","ar":"حساب إضاءة اللوكس","inputs":[["length","Room Length","طول الغرفة","m","ft",10,32.808],["width","Room Width","عرض الغرفة","m","ft",8,26.247],["fixtures","Number of Luminaires","عدد وحدات الإضاءة","count","count",16,16],["lumens","Lumens per Luminaire","لومن لكل وحدة","lm","lm",3000,3000],["utilization","Utilization Factor","معامل الاستفادة","ratio","ratio",0.65,0.65],["maintenance","Maintenance Factor","معامل الصيانة","ratio","ratio",0.8,0.8]],"outputs":[["lux","Average Illuminance","متوسط الإضاءة","lux","fc"],["area","Room Area","مساحة الغرفة","m²","ft²"]],"expression":"const area=i.length*i.width*(u==='imperial'?0.09290304:1);const lux=i.fixtures*i.lumens*i.utilization*i.maintenance/area;return {lux:u==='imperial'?lux/10.7639104:lux,area:u==='imperial'?i.length*i.width:area};","assumptionEn":"Lumen-method average only; verify layout uniformity, glare and task-area criteria.","assumptionAr":"متوسط بطريقة اللومن؛ يجب فحص الانتظام والوهج"},{"slug":"generator-sizing-estimate","trade":"electrical","en":"Generator Sizing Estimate","ar":"تقدير سعة المولد","inputs":[["runningKw","Simultaneous Running Load","الحمل التشغيلي المتزامن","kW","kW",100,100],["powerFactor","Operating Power Factor","معامل القدرة","ratio","ratio",0.8,0.8],["reserve","Capacity Reserve","هامش القدرة","%","%",20,20]],"outputs":[["requiredKva","Estimated Generator Capacity","سعة المولد التقديرية","kVA","kVA"],["runningKva","Running Apparent Power","القدرة الظاهرية","kVA","kVA"]],"expression":"const run=i.runningKw/i.powerFactor;return {requiredKva:run*(1+i.reserve/100),runningKva:run};","assumptionEn":"Running-load estimate excludes motor start, transient voltage dip, harmonics, altitude and ambient derating.","assumptionAr":"لا يشمل تيار البدء والتخفيض الحراري والارتفاع"},{"slug":"power-factor-correction","trade":"electrical","en":"Power Factor Correction","ar":"تصحيح معامل القدرة","inputs":[["activeKw","Active Power","القدرة الفعالة","kW","kW",100,100],["existingPf","Existing Power Factor","معامل القدرة الحالي","ratio","ratio",0.75,0.75],["targetPf","Target Power Factor","معامل القدرة المستهدف","ratio","ratio",0.95,0.95]],"outputs":[["capacitorKvar","Capacitor Bank","قدرة المكثفات","kVAr","kVAr"],["initialKva","Before Correction","قبل التصحيح","kVA","kVA"],["finalKva","After Correction","بعد التصحيح","kVA","kVA"]],"expression":"if(i.targetPf<=i.existingPf)throw Error('Target power factor must exceed existing power factor');const t=p=>Math.tan(Math.acos(p));return {capacitorKvar:i.activeKw*(t(i.existingPf)-t(i.targetPf)),initialKva:i.activeKw/i.existingPf,finalKva:i.activeKw/i.targetPf};","assumptionEn":"Steady-state compensation estimate. Check harmonics, resonance and capacitor step control.","assumptionAr":"تقدير مبدئي؛ يلزم فحص التوافقيات والرنين"},{"slug":"pump-npsh-available","trade":"plumbing","en":"Pump NPSH Available","ar":"صافي ارتفاع السحب المتاح","inputs":[["atmosphericHead","Absolute Surface Pressure Head","ارتفاع الضغط المطلق عند السطح","m","ft",10.33,33.89],["staticHead","Static Liquid Head (+ flooded)","ارتفاع السحب الاستاتيكي","m","ft",2,6.56],["frictionLoss","Suction Friction Loss","فقد احتكاك السحب","m","ft",0.8,2.62],["vaporHead","Liquid Vapor Pressure Head","ارتفاع ضغط البخار","m","ft",0.24,0.79]],"outputs":[["npsha","NPSH Available","صافي ارتفاع السحب المتاح","m","ft"]],"expression":"return {npsha:i.atmosphericHead+i.staticHead-i.frictionLoss-i.vaporHead};","assumptionEn":"Liquid at steady conditions; compare with manufacturer's NPSHr plus project-required margin.","assumptionAr":"قارنه مع قيمة NPSHr من الشركة المصنعة وهامش الأمان"},{"slug":"sprinkler-demand-estimate","trade":"firefighting","en":"Sprinkler Hydraulic Demand Estimate","ar":"تقدير طلب الرشاشات","inputs":[["density","Design Discharge Density","كثافة التصريف","L/min/m²","gpm/ft²",8.1,0.2],["area","Design Operation Area","مساحة التشغيل","m²","ft²",140,1507],["hoseAllowance","Hose Allowance","مخصص خراطيم الإطفاء","L/min","gpm",0,0]],"outputs":[["sprinklerFlow","Sprinkler Flow","تصريف الرشاشات","L/min","gpm"],["combinedFlow","Combined Flow","التصريف الإجمالي","L/min","gpm"]],"expression":"const flow=i.density*i.area;return {sprinklerFlow:flow,combinedFlow:flow+i.hoseAllowance};","assumptionEn":"Screening arithmetic only; density/area inputs are project-approved assumptions, not automatic NFPA hazard classification. Hydraulic losses and duration are excluded.","assumptionAr":"تقدير أولي فقط؛ لا يشمل حساب الشبكة وفواقد الضغط"},{"slug":"fire-water-storage","trade":"firefighting","en":"Fire Water Storage Estimate","ar":"تقدير خزان مياه الحريق","inputs":[["flow","Total Design Flow","التصريف التصميمي","L/min","gpm",1500,396.26],["duration","Required Duration","المدة المطلوبة","min","min",60,60],["usableFraction","Usable Storage Fraction","نسبة التخزين القابل للاستخدام","ratio","ratio",0.9,0.9]],"outputs":[["netStorage","Net Usable Water","المياه المطلوبة","m³","US gal"],["grossTank","Gross Tank Volume","حجم الخزان الإجمالي","m³","US gal"]],"expression":"const vol=i.flow*i.duration*(u==='imperial'?3.785411784:1)/1000;return {netStorage:u==='imperial'?vol*264.172052:vol,grossTank:u==='imperial'?vol/i.usableFraction*264.172052:vol/i.usableFraction};","assumptionEn":"Verify code-mandated supply duration and simultaneous demands; account for unusable level and refill credit only if approved.","assumptionAr":"تحقق من مدة التصميم والاحتياطي حسب متطلبات المشروع"}];
specs.push(...[
  {
    "slug": "air-changes-per-hour",
    "trade": "hvac",
    "en": "Air Changes per Hour (ACH)",
    "ar": "عدد مرات تغيير الهواء بالساعة",
    "inputs": [
      [
        "length",
        "Room Length",
        "طول الغرفة",
        "m",
        "ft",
        10,
        32.8084
      ],
      [
        "width",
        "Room Width",
        "عرض الغرفة",
        "m",
        "ft",
        8,
        26.2467
      ],
      [
        "height",
        "Room Height",
        "ارتفاع الغرفة",
        "m",
        "ft",
        3,
        9.8425
      ],
      [
        "targetAch",
        "Target Air Changes",
        "معدل تغيير الهواء المطلوب",
        "1/h",
        "1/h",
        6,
        6
      ]
    ],
    "outputs": [
      [
        "roomVolume",
        "Room Volume",
        "حجم الغرفة",
        "m³",
        "ft³"
      ],
      [
        "requiredAirflow",
        "Required Airflow",
        "تدفق الهواء المطلوب",
        "m³/h",
        "CFM"
      ]
    ],
    "assumptionEn": "Volume times target ACH is a preliminary airflow estimate; pressure balance and ventilation code criteria require separate review.",
    "assumptionAr": "حساب أولي وفق حجم الغرفة؛ يلزم مراجعة توازن الضغط ومتطلبات التهوية."
  },
  {
    "slug": "sensible-air-cooling",
    "trade": "hvac",
    "en": "Sensible Air Cooling Capacity",
    "ar": "حمل التبريد المحسوس للهواء",
    "inputs": [
      [
        "airflow",
        "Airflow",
        "تدفق الهواء",
        "L/s",
        "CFM",
        500,
        1059.4
      ],
      [
        "deltaT",
        "Air Temperature Difference",
        "فرق درجة حرارة الهواء",
        "°C",
        "°F",
        10,
        18
      ]
    ],
    "outputs": [
      [
        "capacityKw",
        "Sensible Cooling Capacity",
        "قدرة التبريد المحسوس",
        "kW",
        "BTU/h"
      ],
      [
        "capacityTr",
        "Cooling Capacity",
        "سعة التبريد",
        "TR",
        "TR"
      ]
    ],
    "assumptionEn": "Uses typical air density 1.2 kg/m³ and heat capacity 1.005 kJ/kg·K; sensible load only, no latent load.",
    "assumptionAr": "يعتمد على كثافة هواء تقريبية 1.2 وحرارة نوعية 1.005؛ لا يشمل الحمل الكامن."
  },
  {
    "slug": "chilled-water-cooling-capacity",
    "trade": "hvac",
    "en": "Chilled Water Cooling Capacity",
    "ar": "قدرة تبريد المياه المبردة",
    "inputs": [
      [
        "flow",
        "Water Flow",
        "تدفق المياه",
        "L/s",
        "US gpm",
        5,
        79.25
      ],
      [
        "deltaT",
        "Supply/Return Temperature Difference",
        "فرق درجة حرارة الإمداد والرجوع",
        "°C",
        "°F",
        5,
        9
      ]
    ],
    "outputs": [
      [
        "capacityKw",
        "Cooling Capacity",
        "قدرة التبريد",
        "kW",
        "BTU/h"
      ],
      [
        "capacityTr",
        "Cooling Capacity",
        "سعة التبريد",
        "TR",
        "TR"
      ]
    ],
    "assumptionEn": "Water-only approximation using density 1000 kg/m³ and heat capacity 4.186 kJ/kg·K; glycol requires adjusted properties.",
    "assumptionAr": "حساب تقريبي للماء فقط؛ عدّل خواص السائل عند استخدام الجلايكول."
  },
  {
    "slug": "pump-hydraulic-power",
    "trade": "plumbing",
    "en": "Pump Hydraulic and Shaft Power",
    "ar": "القدرة الهيدروليكية وقدرة عمود المضخة",
    "inputs": [
      [
        "flow",
        "Water Flow",
        "تدفق المياه",
        "L/s",
        "US gpm",
        10,
        158.5
      ],
      [
        "head",
        "Total Dynamic Head",
        "الرفع الديناميكي الكلي",
        "m",
        "ft",
        30,
        98.425
      ],
      [
        "efficiency",
        "Pump Efficiency",
        "كفاءة المضخة",
        "ratio",
        "ratio",
        0.7,
        0.7
      ]
    ],
    "outputs": [
      [
        "hydraulicPower",
        "Hydraulic Power",
        "القدرة الهيدروليكية",
        "kW",
        "hp"
      ],
      [
        "shaftPower",
        "Estimated Shaft Power",
        "القدرة التقديرية للمحور",
        "kW",
        "hp"
      ]
    ],
    "assumptionEn": "Clean water at approximately 1000 kg/m³; motor efficiency, service factor and NPSH are not included.",
    "assumptionAr": "للمياه النظيفة بكثافة تقريبية 1000؛ لا يشمل كفاءة المحرك أو هامش الأمان."
  },
  {
    "slug": "three-phase-current",
    "trade": "electrical",
    "en": "Three-Phase Load Current",
    "ar": "تيار الحمل ثلاثي الأطوار",
    "inputs": [
      [
        "power",
        "Active Power",
        "القدرة الفعالة",
        "kW",
        "kW",
        45,
        45
      ],
      [
        "voltage",
        "Line-to-Line Voltage",
        "جهد الخط",
        "V",
        "V",
        400,
        400
      ],
      [
        "powerFactor",
        "Power Factor",
        "معامل القدرة",
        "ratio",
        "ratio",
        0.9,
        0.9
      ]
    ],
    "outputs": [
      [
        "current",
        "Line Current",
        "تيار الخط",
        "A",
        "A"
      ],
      [
        "apparentPower",
        "Apparent Power",
        "القدرة الظاهرية",
        "kVA",
        "kVA"
      ]
    ],
    "assumptionEn": "Balanced three-phase steady-state load only; motor starting current, harmonic content and cable derating are excluded.",
    "assumptionAr": "لحمل ثلاثي الأطوار متوازن؛ لا يشمل تيارات البدء والتوافقيات."
  },
  {
    "slug": "electrical-energy-estimate",
    "trade": "electrical",
    "en": "Electrical Energy and Cost Estimate",
    "ar": "تقدير استهلاك وتكلفة الطاقة الكهربائية",
    "inputs": [
      [
        "power",
        "Average Active Power",
        "متوسط القدرة الفعالة",
        "kW",
        "kW",
        10,
        10
      ],
      [
        "hours",
        "Operating Hours per Day",
        "ساعات التشغيل يومياً",
        "h/day",
        "h/day",
        8,
        8
      ],
      [
        "days",
        "Operating Days",
        "أيام التشغيل",
        "days",
        "days",
        30,
        30
      ],
      [
        "tariff",
        "Assumed Energy Tariff",
        "تعرفة الطاقة المفترضة",
        "SAR/kWh",
        "SAR/kWh",
        0.18,
        0.18
      ]
    ],
    "outputs": [
      [
        "energy",
        "Energy Used",
        "الطاقة المستهلكة",
        "kWh",
        "kWh"
      ],
      [
        "cost",
        "Estimated Energy Cost",
        "تكلفة الطاقة المقدرة",
        "SAR",
        "SAR"
      ]
    ],
    "assumptionEn": "User-entered tariff is illustrative, not an official Saudi utility tariff; excludes demand charges, VAT and fees.",
    "assumptionAr": "التعرفة مدخلة من المستخدم وليست تعرفة رسمية؛ لا تشمل الرسوم أو ضريبة القيمة المضافة."
  },
  {
    "slug": "domestic-water-demand",
    "trade": "plumbing",
    "en": "Daily Domestic Water Demand",
    "ar": "الطلب اليومي للمياه",
    "inputs": [
      [
        "occupants",
        "Population / Users",
        "عدد المستخدمين",
        "persons",
        "persons",
        500,
        500
      ],
      [
        "rate",
        "Design Water Use per Person",
        "استهلاك الماء التصميمي للفرد",
        "L/day/person",
        "US gal/day/person",
        20,
        5.28344
      ],
      [
        "reserveDays",
        "Storage Autonomy",
        "عدد أيام التخزين",
        "days",
        "days",
        1,
        1
      ]
    ],
    "outputs": [
      [
        "dailyDemand",
        "Daily Water Demand",
        "الطلب اليومي للمياه",
        "L/day",
        "US gal/day"
      ],
      [
        "storage",
        "Water Storage Requirement",
        "سعة التخزين المطلوبة",
        "L",
        "US gal"
      ]
    ],
    "assumptionEn": "Enter a project-approved per-person rate; defaults are illustrative and NOT a Saudi code prescribed allowance. Process, irrigation and fire demand are excluded.",
    "assumptionAr": "استخدم معدل الاستهلاك المعتمد للمشروع؛ القيم الافتراضية توضيحية وليست متطلباً من الكود السعودي."
  },
  {
    "slug": "sewage-flow-estimate",
    "trade": "plumbing",
    "en": "Daily Sewage Flow Estimate",
    "ar": "تقدير كمية مياه الصرف الصحي",
    "inputs": [
      [
        "water",
        "Daily Water Consumption",
        "استهلاك المياه اليومي",
        "L/day",
        "US gal/day",
        10000,
        2641.72
      ],
      [
        "returnFraction",
        "Sewage Return Fraction",
        "نسبة المياه العائدة للصرف",
        "ratio",
        "ratio",
        0.8,
        0.8
      ],
      [
        "days",
        "Days per Month",
        "عدد أيام الشهر",
        "days",
        "days",
        30,
        30
      ]
    ],
    "outputs": [
      [
        "dailySewage",
        "Daily Sewage Volume",
        "كمية الصرف اليومية",
        "L/day",
        "US gal/day"
      ],
      [
        "monthlySewage",
        "Monthly Sewage Volume",
        "كمية الصرف الشهرية",
        "L",
        "US gal"
      ]
    ],
    "assumptionEn": "Simple volume balance with user-supplied return fraction; infiltration, stormwater and non-domestic sources are excluded.",
    "assumptionAr": "حساب كميات مبسط وفق نسبة عودة محددة؛ لا يشمل مياه التسرب أو الأمطار."
  },
  {
    "slug": "sprinkler-k-factor",
    "trade": "firefighting",
    "en": "Sprinkler K-Factor Pressure Check",
    "ar": "فحص ضغط الرشاش باستخدام معامل K",
    "inputs": [
      [
        "flow",
        "Required Sprinkler Flow",
        "تدفق الرشاش المطلوب",
        "L/min",
        "US gpm",
        80,
        21.134
      ],
      [
        "kFactor",
        "Rated Sprinkler K-Factor",
        "معامل K للرشاش",
        "L/min/√bar",
        "gpm/√psi",
        80,
        5.55
      ]
    ],
    "outputs": [
      [
        "pressure",
        "Required Pressure",
        "الضغط المطلوب",
        "bar",
        "psi"
      ]
    ],
    "assumptionEn": "Q=K√P for a single sprinkler. Use compatible K-factor units; excludes pipe friction and full sprinkler-network hydraulic design.",
    "assumptionAr": "المعادلة Q=K√P لرشاش منفرد؛ لا تشمل فاقد الاحتكاك في الشبكة."
  }
]);

const formulas = {
  'cooling-load-estimate': (i,u) => {
    const kw = u === 'imperial' ? i.area * i.loadDensity * 0.00029307107 : i.area * i.loadDensity / 1000;
    const result = kw * i.diversity;
    return {coolingKw:u==='imperial'?result*3412.142:result,tonRefrigeration:result/3.51685284};
  },
  'fresh-air-ventilation': (i,u) => {
    const ls = u === 'imperial' ? (i.people*i.ratePerson+i.area*i.rateArea)*0.47194745 : i.people*i.ratePerson+i.area*i.rateArea;
    return {airflow:u==='imperial'?ls/0.47194745:ls,airflowM3h:u==='imperial'?ls/0.47194745:ls*3.6};
  },
  'lighting-illuminance': (i,u) => {
    const area = i.length*i.width*(u==='imperial'?0.09290304:1);
    const lux = i.fixtures*i.lumens*i.utilization*i.maintenance/area;
    return {lux:u==='imperial'?lux/10.7639104:lux,area:u==='imperial'?i.length*i.width:area};
  },
  'generator-sizing-estimate': i => {
    const kva=i.runningKw/i.powerFactor;
    return {requiredKva:kva*(1+i.reserve/100),runningKva:kva};
  },
  'power-factor-correction': i => {
    if(i.targetPf<=i.existingPf)throw Error('Target power factor must exceed existing power factor');
    const t=p=>Math.tan(Math.acos(p));
    return {capacitorKvar:i.activeKw*(t(i.existingPf)-t(i.targetPf)),initialKva:i.activeKw/i.existingPf,finalKva:i.activeKw/i.targetPf};
  },
  'pump-npsh-available': i => ({npsha:i.atmosphericHead+i.staticHead-i.frictionLoss-i.vaporHead}),
  'sprinkler-demand-estimate': (i,u) => {
    const q=i.density*i.area;
    return {sprinklerFlow:q,combinedFlow:q+i.hoseAllowance};
  },
  'fire-water-storage': (i,u) => {
    const amount = i.flow*i.duration;
    const vol = u==='imperial'?amount:amount/1000;
    return {netStorage:vol,grossTank:vol/i.usableFraction};
  },
  'air-changes-per-hour': (i,u) => {
    const v=i.length*i.width*i.height;
    return {roomVolume:v,requiredAirflow:u==='imperial'?v*i.targetAch/60:v*i.targetAch};
  },
  'sensible-air-cooling': (i,u) => {
    const kw=u==='imperial'?1.08*i.airflow*i.deltaT/3412.142:1.206*i.airflow*i.deltaT/1000;
    return {capacityKw:u==='imperial'?kw*3412.142:kw,capacityTr:kw/3.51685284};
  },
  'chilled-water-cooling-capacity': (i,u) => {
    const kw=u==='imperial'?500*i.flow*i.deltaT/3412.142:4.186*i.flow*i.deltaT;
    return {capacityKw:u==='imperial'?kw*3412.142:kw,capacityTr:kw/3.51685284};
  },
  'pump-hydraulic-power': (i,u) => {
    const hp=u==='imperial'?(i.flow*i.head/3960):null;
    const kw=u==='imperial'?hp*0.745699872:0.00981*i.flow*i.head;
    return {hydraulicPower:u==='imperial'?kw/0.745699872:kw,shaftPower:u==='imperial'?kw/(0.745699872*i.efficiency):kw/i.efficiency};
  },
  'three-phase-current': i => ({current:i.power*1000/(Math.sqrt(3)*i.voltage*i.powerFactor),apparentPower:i.power/i.powerFactor}),
  'electrical-energy-estimate': i => {
    const energy=i.power*i.hours*i.days;
    return {energy,cost:energy*i.tariff};
  },
  'domestic-water-demand': (i,u) => {
    const q=i.occupants*i.rate;
    return {dailyDemand:q,storage:q*i.reserveDays};
  },
  'sewage-flow-estimate': i => {
    const q=i.water*i.returnFraction;
    return {dailySewage:q,monthlySewage:q*i.days};
  },
  'sprinkler-k-factor': i => ({pressure:Math.pow(i.flow/i.kFactor,2)})
};
const positiveFraction = /^(utilization|maintenance|powerFactor|existingPf|targetPf|usableFraction|efficiency|returnFraction)$/;
export const essentialCalculatorRegistry = Object.fromEntries(specs.map(s => {
  const inputs = lang => Object.fromEntries(s.inputs.map(([key,en,ar,metric,imperial]) => [key,{label:lang==='ar'?ar:en,unit:{metric,imperial}}]));
  const outputs = lang => Object.fromEntries(s.outputs.map(([key,en,ar,metric,imperial]) => [key,{label:lang==='ar'?ar:en,unit:{metric,imperial}}]));
  const doc=lang=>({title:lang==='ar'?s.ar:s.en,description:lang==='ar'?s.assumptionAr:s.assumptionEn,introContent:lang==='ar'?'## الطريقة\nتقدير أولي باستخدام المعادلات الأساسية. تحقق من المدخلات والمعايير المعتمدة للمشروع.':'## Method\nPreliminary calculation using engineering equations. Verify project-specific inputs, standards and design criteria.',inputs:inputs(lang),outputs:outputs(lang),assumptions:[lang==='ar'?s.assumptionAr:s.assumptionEn]});
  const defaults = unit => Object.fromEntries(s.inputs.map(([key,_en,_ar,_m,_i,metric,imperial])=>[key,unit==='imperial'?imperial:metric]));
  const calculate=(raw,units='metric',lang='en')=>{
   const i={};for(const [key] of s.inputs){ const v=Number(raw[key]);if(raw[key]===undefined||raw[key]===null||raw[key]===''||!Number.isFinite(v)||v<0) return {outputs:{},warnings:[],errors:[key+': required non-negative finite input']}; i[key]=v; }
   for(const [key] of s.inputs){if(positiveFraction.test(key)&&(i[key]<=0||i[key]>1))return {outputs:{},warnings:[],errors:[key+' must be greater than 0 and at most 1']};}
   if(['cooling-load-estimate','lighting-illuminance','generator-sizing-estimate','fire-water-storage','three-phase-current','sprinkler-k-factor'].includes(s.slug)){if((s.slug==='cooling-load-estimate'&&(i.area===0||i.loadDensity===0))||(s.slug==='lighting-illuminance'&&(i.length===0||i.width===0))||(s.slug==='generator-sizing-estimate'&&i.powerFactor===0)||(s.slug==='fire-water-storage'&&i.usableFraction===0)||(s.slug==='three-phase-current'&&i.voltage===0)||(s.slug==='sprinkler-k-factor'&&i.kFactor===0))return {outputs:{},warnings:[],errors:['Inputs must produce a nonzero denominator and meaningful result']};}
   try { if(s.slug==='electrical-energy-estimate'&&i.hours>24)throw Error('Hours per day cannot exceed 24'); const result = formulas[s.slug](i,units);if(Object.values(result).some(v=>!Number.isFinite(v)))throw Error('Non-finite result');return {outputs:Object.fromEntries(Object.entries(result).map(([k,v])=>[k,round(v)])),warnings:[lang==='ar'?s.assumptionAr:s.assumptionEn]};}catch(e){return {outputs:{},warnings:[],errors:[e.message]};}
  };
  return [s.slug,{config:{version:'1.0',en:doc('en'),ar:doc('ar')},calculate,defaults:{metric:defaults('metric'),imperial:defaults('imperial')},related:[],trade:s.trade}];
}));