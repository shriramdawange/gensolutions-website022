(() => {
  "use strict";
  const SUPABASE_URL = "https://svsweslezorghidounxd.supabase.co";
  const SUPABASE_KEY = "sb_publishable_Hnrt2deZ9830ixBT3Y59yQ_Zg8s1vzN";
  const RESUME_BUCKET = "davan-resumes";
  const PDF_URL = "https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.min.js";
  const PDF_WORKER_URL = "https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js";
  const fallback = [
    {id:"5d8881f9-ec28-4745-971d-33d82c4ec106",slug:"full-stack-developer",title:"Full-Stack Developer Intern",summary:"Build user-facing experiences and the backend systems that power them.",description:"Work across the application stack on real product features, collaborate with designers and engineers, and ship reliable, maintainable code.",responsibilities:["Develop responsive frontend interfaces and reusable components","Build and integrate APIs and backend services","Work with databases, authentication and third-party integrations","Write readable code, test features and document technical decisions"],requirements:["Hands-on experience building and shipping web applications","Comfortable with JavaScript or TypeScript and modern frontend development","Working knowledge of backend APIs, databases and Git","A portfolio, GitHub repository or meaningful project experience"],skills:["React","Next.js","TypeScript","Node.js","REST APIs","PostgreSQL","Git"],vacancies:2,hours_per_day:4,start_date:"2026-12-05"},
    {id:"72a48623-61cf-4746-8ff0-0b4efef1895e",slug:"flutter-developer",title:"Flutter Developer Intern",summary:"Create polished cross-platform mobile experiences.",description:"Contribute to Flutter applications, connect mobile interfaces to backend services, and help improve performance, quality and usability.",responsibilities:["Build and maintain Flutter screens and app flows","Integrate REST APIs and backend services","Implement state management and reusable widgets","Test on Android devices and resolve UI or runtime issues"],requirements:["Hands-on Flutter and Dart project experience","Understanding of responsive layouts and app navigation","Experience consuming APIs and managing application state","A portfolio, GitHub repository or published app is a plus"],skills:["Flutter","Dart","REST APIs","State Management","Firebase","Supabase","Git"],vacancies:2,hours_per_day:4,start_date:"2026-12-05"},
    {id:"d2b2d16a-a097-4b3a-adf9-26d3452e7e6d",slug:"management-intern",title:"Management Intern",summary:"Coordinate people, projects and execution across teams.",description:"Support day-to-day project coordination, team communication, task follow-through and operational reporting across active product initiatives.",responsibilities:["Coordinate tasks, milestones and follow-ups across project teams","Maintain project trackers, meeting notes and documentation","Support communication between technical and management teams","Prepare concise progress updates and flag blockers early"],requirements:["Previous internship, project coordination or team leadership experience","Strong written and verbal communication","Organised approach to planning, follow-up and documentation","Comfortable working with spreadsheets and project management tools"],skills:["Project Coordination","Communication","Documentation","Task Management","Reporting","Team Collaboration"],vacancies:1,hours_per_day:4,start_date:"2026-12-05"}
  ];
  const knownSkills = ["JavaScript","TypeScript","React","Next.js","Node.js","Express","HTML","CSS","Tailwind CSS","Python","Java","Dart","Flutter","Firebase","Supabase","PostgreSQL","MySQL","MongoDB","REST APIs","GraphQL","Git","GitHub","Docker","AWS","Vercel","Figma","UI/UX","State Management","Riverpod","Provider","Project Coordination","Communication","Documentation","Task Management","Reporting","Leadership","Excel","Google Sheets","Agile","Scrum","Jira","Trello","Notion"];
  const headers = {apikey:SUPABASE_KEY,Authorization:"Bearer "+SUPABASE_KEY};
  let currentOpening=null, selectedSkills=[], resumeFile=null;

  function escapeHtml(value){return String(value==null?"":value).replace(/[&<>"']/g,ch=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[ch]));}
  function safeText(id,value){const node=document.getElementById(id);if(node)node.textContent=value==null?"":String(value);}
  function formatDate(value){const date=new Date(value+"T00:00:00");return Number.isNaN(date.getTime())?value:date.toLocaleDateString("en-IN",{day:"2-digit",month:"long",year:"numeric"});}
  async function getOpenings(){
    try{
      const url=SUPABASE_URL+"/rest/v1/career_openings?select=id,slug,title,summary,description,responsibilities,requirements,skills,vacancies,hours_per_day,start_date&published=eq.true&order=created_at.asc";
      const response=await fetch(url,{headers,cache:"no-store"});
      if(!response.ok)throw new Error("Careers data unavailable");
      const data=await response.json();
      return Array.isArray(data)&&data.length?data:[];
    }catch(error){console.warn("DAVAN Careers: using cached opening data.",error);return fallback;}
  }
  function roleUrl(slug){
    const base = "/careers/";
    return ["full-stack-developer","flutter-developer","management-intern"].includes(slug)
      ? base + encodeURIComponent(slug) + "/"
      : base + "role.html?slug=" + encodeURIComponent(slug);
  }
  function renderOpenings(openings){
    const host=document.getElementById("career-openings");if(!host)return;
    const total=openings.reduce((sum,role)=>sum+Number(role.vacancies||0),0);
    safeText("career-total",String(total).padStart(2,"0"));
    safeText("career-role-count",String(openings.length).padStart(2,"0"));
    if(!openings.length){host.innerHTML='<div class="empty-state">There are no published openings at the moment. Please check again soon.</div>';return;}
    host.innerHTML=openings.map((role,index)=>{
      const vacancyLabel=Number(role.vacancies)===1?"1 OPENING":String(role.vacancies)+" OPENINGS";
      const dateLabel=formatDate(role.start_date);
      return '<article class="career-opening career-opening-card">'+
        '<div class="opening-card-top"><span class="opening-number">'+String(index+1).padStart(2,"0")+'</span>'+
        '<span class="opening-kicker">INTERNSHIP · '+escapeHtml(vacancyLabel)+'</span></div>'+
        '<div class="opening-copy"><h3>'+escapeHtml(role.title)+'</h3>'+
        '<p>'+escapeHtml(role.summary)+'</p></div>'+
        '<div class="opening-card-meta"><span><i class="meta-dot"></i>'+escapeHtml(role.hours_per_day)+' HOURS / DAY</span>'+
        '<span><i class="meta-dot meta-dot-date"></i>STARTS '+escapeHtml(dateLabel)+'</span></div>'+
        '<a class="opening-cta" href="'+roleUrl(role.slug)+'">View role &amp; apply <b aria-hidden="true">↗</b></a>'+
        '</article>';
    }).join("");
  }
  async function renderList(){if(document.getElementById("career-openings"))renderOpenings(await getOpenings());}
  function renderListItems(id,values){const node=document.getElementById(id);if(node)node.innerHTML=(values||[]).map(item=>"<li>"+escapeHtml(item)+"</li>").join("");}

  async function initRole(){
    const slug=document.body.dataset.role||new URLSearchParams(window.location.search).get("slug");
    if(!slug)return;
    const openings=await getOpenings();
    currentOpening=openings.find(item=>item.slug===slug)||null;
    if(!currentOpening){
      safeText("role-title","This opening is no longer available");
      safeText("role-summary","This position may have closed or been unpublished. Return to the careers page to view current openings.");
      const form=document.getElementById("career-application-form");if(form)form.hidden=true;
      const poster=document.querySelector(".role-poster");if(poster)poster.hidden=true;
      return;
    }
    document.title=currentOpening.title+" | DAVAN Technologies";
    safeText("role-title",currentOpening.title);safeText("role-summary",currentOpening.summary);
    safeText("role-description",currentOpening.description);
    safeText("role-vacancies",currentOpening.vacancies+" "+(Number(currentOpening.vacancies)===1?"VACANCY":"VACANCIES"));
    safeText("role-hours",currentOpening.hours_per_day+" HOURS / DAY");
    safeText("role-date","START DATE · "+formatDate(currentOpening.start_date).toUpperCase());
    safeText("form-role-title",currentOpening.title);
    renderListItems("role-responsibilities",currentOpening.responsibilities);
    renderListItems("role-requirements",currentOpening.requirements);
    const skills=document.getElementById("role-skills");
    if(skills)skills.innerHTML=(currentOpening.skills||[]).map(skill=>"<span>"+escapeHtml(skill)+"</span>").join("");
    const poster=document.querySelector(".role-poster");if(poster)poster.hidden=slug!=="management-intern";
    initApplicationForm();
  }

  function loadPdfJs(){
    if(window.pdfjsLib)return Promise.resolve(window.pdfjsLib);
    return new Promise((resolve,reject)=>{
      const existing=document.querySelector('script[data-pdfjs="true"]');
      const ready=()=>window.pdfjsLib?resolve(window.pdfjsLib):reject(new Error("PDF reader unavailable"));
      if(existing){existing.addEventListener("load",ready,{once:true});existing.addEventListener("error",()=>reject(new Error("PDF reader failed to load")),{once:true});return;}
      const script=document.createElement("script");script.src=PDF_URL;script.async=true;script.dataset.pdfjs="true";
      script.onload=ready;script.onerror=()=>reject(new Error("Could not load PDF reader"));document.head.appendChild(script);
    });
  }
  async function extractResumeSkills(file){
    const pdfjs=await loadPdfJs();pdfjs.GlobalWorkerOptions.workerSrc=PDF_WORKER_URL;
    const pdf=await pdfjs.getDocument({data:await file.arrayBuffer()}).promise;const pages=[];
    for(let n=1;n<=pdf.numPages;n++){const page=await pdf.getPage(n);const text=await page.getTextContent();pages.push(text.items.map(item=>item.str||"").join(" "));}
    const resumeText=pages.join(" ").toLowerCase();return knownSkills.filter(skill=>resumeText.includes(skill.toLowerCase()));
  }
  function drawSkills(){
    const host=document.getElementById("career-skill-options");if(!host)return;
    const options=Array.from(new Set(knownSkills.concat(selectedSkills.filter(skill=>!knownSkills.includes(skill)))));
    host.innerHTML=options.map(skill=>'<label class="'+(selectedSkills.includes(skill)?"selected":"")+'"><input type="checkbox" value="'+escapeHtml(skill)+'" '+(selectedSkills.includes(skill)?"checked":"")+'> '+escapeHtml(skill)+'</label>').join("");
    host.querySelectorAll('input[type="checkbox"]').forEach(input=>input.addEventListener("change",()=>{
      if(input.checked){if(!selectedSkills.includes(input.value))selectedSkills.push(input.value);}
      else selectedSkills=selectedSkills.filter(skill=>skill!==input.value);
      drawSkills();
    }));
  }
  function formStatus(kind,message){const node=document.getElementById("career-form-status");if(!node)return;node.className="form-status "+(kind||"");node.textContent=message||"";}
  function newUuid(){
    if(window.crypto&&window.crypto.randomUUID)return window.crypto.randomUUID();
    return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g,c=>{const r=Math.random()*16|0;return(c==="x"?r:(r&3|8)).toString(16);});
  }
  function initApplicationForm(){
    const form=document.getElementById("career-application-form");if(!form||form.dataset.ready==="true")return;
    form.dataset.ready="true";
    const resumeInput=document.getElementById("career-resume");
    const resumeName=document.getElementById("resume-name");
    const parseStatus=document.getElementById("resume-skill-status");
    const workplace=document.getElementById("workplace-field");
    const submit=form.querySelector('button[type="submit"]');
    form.querySelectorAll('input[name="working"]').forEach(input=>input.addEventListener("change",()=>{
      const yes=form.querySelector('input[name="working"]:checked').value==="yes";
      workplace.hidden=!yes;form.elements.current_workplace.required=yes;
    }));
    resumeInput.addEventListener("change",async()=>{
      resumeFile=resumeInput.files&&resumeInput.files[0]||null;selectedSkills=[];drawSkills();parseStatus.textContent="";
      if(!resumeFile){resumeName.textContent="Choose your resume";return;}
      if(resumeFile.type!=="application/pdf"&&!resumeFile.name.toLowerCase().endsWith(".pdf")){
        resumeFile=null;resumeInput.value="";resumeName.textContent="Choose your resume";parseStatus.textContent="Please upload your resume as a PDF.";return;
      }
      if(resumeFile.size>5*1024*1024){
        resumeFile=null;resumeInput.value="";resumeName.textContent="Choose your resume";parseStatus.textContent="The PDF must be 5 MB or smaller.";return;
      }
      resumeName.textContent=resumeFile.name;parseStatus.textContent="Reading resume text and suggesting skills…";
      try{selectedSkills=await extractResumeSkills(resumeFile);drawSkills();parseStatus.textContent=selectedSkills.length?"Found "+selectedSkills.length+" possible skills. Review and edit them below.":"No matching skills detected. Add your skills manually.";}
      catch(error){parseStatus.textContent="Could not read PDF text. You can still choose or add skills manually.";}
    });
    document.getElementById("add-skill").addEventListener("click",()=>{
      const field=document.getElementById("custom-skill");const value=field.value.trim().slice(0,50);
      if(value&&!selectedSkills.some(skill=>skill.toLowerCase()===value.toLowerCase()))selectedSkills.push(value);
      field.value="";drawSkills();
    });
    document.getElementById("custom-skill").addEventListener("keydown",event=>{if(event.key==="Enter"){event.preventDefault();document.getElementById("add-skill").click();}});
    form.addEventListener("submit",async event=>{
      event.preventDefault();formStatus("","");
      if(form.elements.website.value.trim())return;
      if(!currentOpening){formStatus("error","This opening is not accepting applications.");return;}
      if(!resumeFile){formStatus("error","Please upload your resume as a PDF.");return;}
      if(!selectedSkills.length){formStatus("error","Please select or add at least one relevant skill.");return;}
      const values=new FormData(form);
      if(values.get("working")==="yes"&&!String(values.get("current_workplace")||"").trim()){formStatus("error","Please enter your current company or role.");return;}
      submit.disabled=true;submit.textContent="Submitting application…";
      const applicationId=newUuid();const safeName=resumeFile.name.replace(/[^a-zA-Z0-9._-]/g,"-").slice(-100);
      const storagePath=applicationId+"/"+Date.now()+"-"+safeName;
      try{
        const upload=await fetch(SUPABASE_URL+"/storage/v1/object/"+RESUME_BUCKET+"/"+storagePath.split("/").map(encodeURIComponent).join("/"),{
          method:"POST",headers:Object.assign({},headers,{"Content-Type":"application/pdf","x-upsert":"false"}),body:resumeFile
        });
        if(!upload.ok)throw new Error("Resume upload failed. Please check the PDF and try again.");
        const response=await fetch(SUPABASE_URL+"/rest/v1/career_applications",{
          method:"POST",headers:Object.assign({},headers,{"Content-Type":"application/json","Prefer":"return=minimal"}),
          body:JSON.stringify({
            id:applicationId,opening_id:currentOpening.id,name:String(values.get("name")).trim(),email:String(values.get("email")).trim(),
            education:String(values.get("education")).trim(),city:String(values.get("city")).trim(),
            currently_working:values.get("working")==="yes",
            current_workplace:values.get("working")==="yes"?String(values.get("current_workplace")||"").trim():null,
            internship_domain:currentOpening.slug,resume_path:storagePath,resume_filename:resumeFile.name,
            special_achievements:String(values.get("achievements")||"").trim()||null,skills:selectedSkills
          })
        });
        if(!response.ok)throw new Error("Your resume uploaded, but the application could not be saved. Please retry.");
        form.reset();resumeFile=null;selectedSkills=[];drawSkills();resumeName.textContent="Choose your resume";parseStatus.textContent="";
        workplace.hidden=true;form.elements.current_workplace.required=false;
        formStatus("success","Application received. Thank you for applying to DAVAN Technologies.");
        form.querySelectorAll("input,select,textarea").forEach(control=>control.disabled=true);
        submit.disabled=true;submit.textContent="Application received";
      }catch(error){formStatus("error",error instanceof Error?error.message:"Something went wrong. Please try again.");submit.disabled=false;submit.innerHTML='Submit application <span>↗</span>';}
    });
    drawSkills();
  }

  function hiringPopup(){
    if(document.body.dataset.page!=="home")return;
    try{if(sessionStorage.getItem("davan-hiring-popup-seen"))return;}catch(error){}
    window.setTimeout(async()=>{
      try{if(sessionStorage.getItem("davan-hiring-popup-seen"))return;}catch(error){}
      const openings=await getOpenings();
      const overlay=document.createElement("div");overlay.className="hiring-overlay";
      overlay.innerHTML='<section class="hiring-dialog" role="dialog" aria-modal="true" aria-labelledby="hiring-dialog-title"><button type="button" class="dialog-close" aria-label="Close">×</button><span class="eyebrow"><span></span> DAVAN CAREERS / 2026</span><h2 id="hiring-dialog-title">We are <em>hiring.</em></h2><p>Experienced interns wanted. Explore current openings and find where your skills fit.</p><div class="dialog-roles">'+openings.map(role=>'<a href="careers/'+encodeURIComponent(role.slug)+'/"><span>'+escapeHtml(role.title)+'</span><small>'+escapeHtml(role.vacancies)+' '+(Number(role.vacancies)===1?"vacancy":"vacancies")+'</small><b>↗</b></a>').join("")+'</div><a class="button button-primary" href="careers/">View all openings <span>↗</span></a><button class="dialog-later" type="button">Maybe later</button></section>';
      document.body.appendChild(overlay);
      const close=()=>{overlay.remove();try{sessionStorage.setItem("davan-hiring-popup-seen","1");}catch(error){}};
      overlay.querySelector(".dialog-close").addEventListener("click",close);
      overlay.querySelector(".dialog-later").addEventListener("click",close);
      overlay.addEventListener("click",event=>{if(event.target===overlay)close();});
      document.addEventListener("keydown",function onKey(event){if(event.key==="Escape"){close();document.removeEventListener("keydown",onKey);}});
    },2200);
  }
  document.addEventListener("DOMContentLoaded",()=>{
    document.querySelectorAll("[data-year]").forEach(node=>node.textContent=String(new Date().getFullYear()));
    renderList();initRole();hiringPopup();
  });
})();