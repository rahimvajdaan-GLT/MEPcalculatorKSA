// Client-side conversion catalog; no Base44 database dependency.
// Each unit is converted to a base unit as base = input * factorToBase + offsetToBase.
// US gallons are explicitly US liquid gallons, not Imperial gallons.
const dimensionDefinitions = [["flow","Flow","التدفق",[["lps","L/s","لتر/ثانية","L/s",1],["lpm","L/min","لتر/دقيقة","L/min",0.016666666666666666],["m3h","m³/h","متر مكعب/ساعة","m³/h",0.2777777777777778],["gpm","US gpm","جالون أمريكي/دقيقة","gpm",0.06309019639999999],["cfm","ft³/min","قدم مكعب/دقيقة","CFM",0.47194744320000004]]],["pressure","Pressure","الضغط",[["pa","Pa","باسكال","Pa",1],["kpa","kPa","كيلوباسكال","kPa",1000],["bar","bar","بار","bar",100000],["psi","psi","رطل/بوصة مربعة","psi",6894.757293168],["mwc","m H₂O","متر عمود ماء","m H₂O",9806.65]]],["length","Length","الطول",[["m","Metre","متر","m",1],["mm","Millimetre","ملليمتر","mm",0.001],["cm","Centimetre","سنتيمتر","cm",0.01],["ft","Foot","قدم","ft",0.3048],["in","Inch","بوصة","in",0.0254]]],["area","Area","المساحة",[["m2","Square metre","متر مربع","m²",1],["ft2","Square foot","قدم مربع","ft²",0.09290304],["mm2","Square millimetre","ملليمتر مربع","mm²",0.000001],["ha","Hectare","هكتار","ha",10000]]],["volume","Volume","الحجم",[["l","Litre","لتر","L",1],["m3","Cubic metre","متر مكعب","m³",1000],["usgal","US gallon","جالون أمريكي","US gal",3.785411784],["ft3","Cubic foot","قدم مكعب","ft³",28.316846592]]],["velocity","Velocity","السرعة",[["mps","Metres per second","متر/ثانية","m/s",1],["fpm","Feet per minute","قدم/دقيقة","ft/min",0.00508],["fps","Feet per second","قدم/ثانية","ft/s",0.3048],["kmh","Kilometres per hour","كيلومتر/ساعة","km/h",0.2777777777777778]]],["temperature","Temperature","درجة الحرارة",[["c","Celsius","مئوية","°C",1,0],["f","Fahrenheit","فهرنهايت","°F",0.5555555555555556,-17.77777777777778],["k","Kelvin","كلفن","K",1,-273.15]]],["power","Power","القدرة",[["w","Watt","واط","W",1],["kw","Kilowatt","كيلوواط","kW",1000],["hp","Mechanical horsepower","حصان ميكانيكي","hp",745.699871582],["btuhr","BTU per hour","وحدة حرارية/ساعة","BTU/h",0.293071070172],["tr","Ton of refrigeration","طن تبريد","TR",3516.8528420667]]],["energy","Energy","الطاقة",[["j","Joule","جول","J",1],["kj","Kilojoule","كيلوجول","kJ",1000],["kwh","Kilowatt-hour","كيلوواط ساعة","kWh",3600000],["btu","BTU","وحدة حرارية","BTU",1055.05585262]]],["lighting","Lighting","الإضاءة",[["lux","Lux","لوكس","lux",1],["fc","Foot-candle","قدم شمعة","fc",10.7639104167]]]];
const conversionPairs = {"flow":[["lps","gpm"],["m3h","lps"],["lpm","gpm"],["cfm","m3h"]],"pressure":[["bar","psi"],["kpa","psi"],["bar","mwc"]],"length":[["m","ft"],["mm","in"]],"area":[["m2","ft2"]],"volume":[["m3","usgal"],["l","usgal"]],"velocity":[["mps","fpm"],["mps","fps"]],"temperature":[["c","f"],["c","k"]],"power":[["kw","hp"],["kw","tr"],["kw","btuhr"]],"energy":[["kwh","btu"],["kwh","kj"]],"lighting":[["lux","fc"]]};
const electricalDefinitions = [["kw-to-a","kW to A","كيلوواط إلى أمبير"],["a-to-kw","A to kW","أمبير إلى كيلوواط"],["kva-to-a","kVA to A","كيلوفولت أمبير إلى أمبير"],["a-to-kva","A to kVA","أمبير إلى كيلوفولت أمبير"],["kw-to-kva","kW to kVA","كيلوواط إلى كيلوفولت أمبير"],["kva-to-kw","kVA to kW","كيلوفولت أمبير إلى كيلوواط"]];

export const localDimensions = dimensionDefinitions.map(([key,nameEn,nameAr],index)=>({
  key,nameEn,nameAr,displayOrder:index
}));

export const localUnits = dimensionDefinitions.flatMap(([dimensionKey,_en,_ar,entries])=>
  entries.map(([key,nameEn,nameAr,symbol,factorToBase,offsetToBase=0])=>({
    key,nameEn,nameAr,symbol,dimensionKey,factorToBase,offsetToBase
  }))
);

const byKey = new Map(localUnits.map(unit=>[unit.dimensionKey+':'+unit.key,unit]));

export const localConverterCards = [
 ...localDimensions.flatMap(dim=>
  (conversionPairs[dim.key]||[]).map(([from,to],i)=>{
    const source=byKey.get(dim.key+':'+from);
    const target=byKey.get(dim.key+':'+to);
    if(!source||!target)throw Error('Invalid local converter pair');
    return {
      id:dim.key+'-'+from+'-'+to,
      slug:dim.key+'-'+from+'-'+to,
      dimensionKey:dim.key,
      defaultFromUnitKey:from,
      defaultToUnitKey:to,
      displayOrder:i,
      isSpecial:false,
      titleEn:source.symbol+' to '+target.symbol,
      titleAr:source.nameAr+' إلى '+target.nameAr,
      descEn:dim.nameEn+' unit conversion',
      descAr:'تحويل وحدات '+dim.nameAr,
      keywordsEn:source.symbol+' '+target.symbol+' '+dim.nameEn,
      keywordsAr:source.nameAr+' '+target.nameAr+' '+dim.nameAr
    };
  })
 ),
 ...electricalDefinitions.map(([slug,titleEn,titleAr],index)=>({
   id:'electrical-'+slug,slug,dimensionKey:'electrical',isSpecial:true,
   titleEn,titleAr,descEn:'Electrical power/current calculator',descAr:'حاسبة القدرة والتيار',
   keywordsEn:'electrical '+titleEn,keywordsAr:'كهرباء '+titleAr,displayOrder:index
 }))
];
