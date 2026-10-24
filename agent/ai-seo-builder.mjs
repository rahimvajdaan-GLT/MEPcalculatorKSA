import fs from 'node:fs';
const r=JSON.parse(fs.readFileSync('agent-report.json','utf8'));
let text=`# AI SEO and Maintenance Manager

Date: ${r.date}

Pages tested: ${r.checked}
Confirmed issues: ${r.errors.length}
SEO warnings: ${r.warnings.length}

`;
if(!process.env.OPENAI_API_KEY) {
 text+='AI recommendations require an OPENAI_API_KEY GitHub secret.\n';
} else {
 try {
  const response=await fetch('https://api.openai.com/v1/responses',{
   method:'POST',
   headers:{Authorization:`Bearer ${process.env.OPENAI_API_KEY}`,
     'Content-Type':'application/json'},
   body:JSON.stringify({
    model:'gpt-4.1-mini',
    max_output_tokens:1100,
    input:`Review this website SEO audit. Suggest 3 specific bilingual
English/Arabic improvements and safe maintenance actions.
Do not invent rankings, standards, calculations or traffic figures.
Do not recommend automatic publishing of unreviewed engineering advice.
Provide a concise action plan:\n${JSON.stringify(r).slice(0,9000)}`
   })
  });
  if(!response.ok)throw Error(`AI API ${response.status}`);
  const data=await response.json();
  text+=(data.output||[]).flatMap(x=>x.content||[])
    .filter(x=>x.type==='output_text').map(x=>x.text).join('\n');
 }catch(e){text+='AI request unavailable: '+e.message;}
}
fs.writeFileSync('agent-ai-plan.md',text);
console.log('AI SEO plan generated');
