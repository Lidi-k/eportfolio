/* ── NAV MOBILE ── */
const menuBtn=document.getElementById('menuBtn');
const navLinks=document.getElementById('navLinks');
menuBtn.addEventListener('click',(e)=>{
  e.stopPropagation();
  navLinks.classList.toggle('open');
});
navLinks.querySelectorAll('a').forEach(a=>{
  a.addEventListener('click',()=>navLinks.classList.remove('open'));
});
document.addEventListener('click',(e)=>{
  if(!navLinks.contains(e.target)&&e.target!==menuBtn){
    navLinks.classList.remove('open');
  }
});

/* SCROLL STORYTELLING */
const reduceMotion=window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const revealBlocks=[...document.querySelectorAll('.about-section .wrap,.experience .wrap,.sel-projects .wrap,.academic .wrap,.dash-inner,.lab .wrap,.capabilities .wrap,.contact-inner,footer .footer-inner')];
const staggerBlocks=[...document.querySelectorAll('.stats-inner,.academic-grid,.cap-grid')];
revealBlocks.forEach(el=>el.classList.add('scroll-reveal'));
staggerBlocks.forEach(el=>el.classList.add('scroll-stagger'));

let revealObserver=null;
if(!reduceMotion){
  document.body.classList.add('motion-ready');
  revealObserver=new IntersectionObserver(entries=>{
    entries.forEach(entry=>{
      if(entry.isIntersecting){
        entry.target.classList.add('is-visible');
        revealObserver.unobserve(entry.target);
      }
    });
  },{threshold:.12,rootMargin:'0px 0px -7%'});
  [...revealBlocks,...staggerBlocks].forEach(el=>revealObserver.observe(el));
}


const statValues=[...document.querySelectorAll('.stat strong')];
const statObserver=new IntersectionObserver(entries=>{
  entries.forEach(entry=>{
    if(!entry.isIntersecting)return;
    const el=entry.target;
    const match=el.textContent.match(/^(\d+)(.*)$/);
    if(match&&!reduceMotion){
      const target=Number(match[1]);
      const suffix=match[2];
      const start=performance.now();
      const duration=1100;
      const count=now=>{
        const t=Math.min((now-start)/duration,1);
        const eased=1-Math.pow(1-t,3);
        el.textContent=`${Math.round(target*eased)}${suffix}`;
        if(t<1)requestAnimationFrame(count);
      };
      requestAnimationFrame(count);
    }
    statObserver.unobserve(el);
  });
},{threshold:.8});
statValues.forEach(el=>statObserver.observe(el));

const progressBar=document.getElementById('scrollProgress');
const portraitStage=document.querySelector('.portrait-stage');
let scrollTicking=false;
function updateScrollEffects(){
  const maxScroll=document.documentElement.scrollHeight-window.innerHeight;
  const progress=maxScroll>0?Math.min(window.scrollY/maxScroll,1):0;
  progressBar.style.transform=`scaleX(${progress})`;
  if(portraitStage&&!reduceMotion){
    portraitStage.style.setProperty('--hero-shift',`${Math.min(window.scrollY*.055,34)}px`);
  }
  document.querySelectorAll('.chapter-banner').forEach(banner=>{
    const rect=banner.getBoundingClientRect();
    const local=(window.innerHeight-rect.top)/(window.innerHeight+rect.height);
    banner.style.setProperty('--chapter-shift',`${Math.max(-8,Math.min(8,(local-.5)*16))}%`);
  });
  scrollTicking=false;
}
window.addEventListener('scroll',()=>{
  if(!scrollTicking){
    requestAnimationFrame(updateScrollEffects);
    scrollTicking=true;
  }
},{passive:true});
updateScrollEffects();

const sectionNavLinks=[...navLinks.querySelectorAll('a[href^="#"]')];
const observedSections=sectionNavLinks.map(link=>document.querySelector(link.getAttribute('href'))).filter(Boolean);
const navObserver=new IntersectionObserver(entries=>{
  entries.forEach(entry=>{
    if(entry.isIntersecting){
      sectionNavLinks.forEach(link=>link.classList.toggle('active',link.getAttribute('href')===`#${entry.target.id}`));
    }
  });
},{rootMargin:'-35% 0px -55%',threshold:0});
observedSections.forEach(section=>navObserver.observe(section));

/* ACADEMIC PROJECT CAROUSEL + DOCUMENT VIEWER */
const academicCarousel=document.getElementById('academicCarousel');
const academicCards=[...academicCarousel.querySelectorAll('.mini-project')];
let academicIndex=0;
function showAcademicProject(index){
  academicIndex=(index+academicCards.length)%academicCards.length;
  const card=academicCards[academicIndex];
  const target=academicCarousel.scrollLeft+card.getBoundingClientRect().left-academicCarousel.getBoundingClientRect().left;
  academicCarousel.scrollTo({left:target,behavior:'smooth'});
}
document.getElementById('academicPrev').addEventListener('click',()=>showAcademicProject(academicIndex-1));
document.getElementById('academicNext').addEventListener('click',()=>showAcademicProject(academicIndex+1));
let academicRotation=setInterval(()=>showAcademicProject(academicIndex+1),5500);
academicCarousel.addEventListener('mouseenter',()=>clearInterval(academicRotation));
academicCarousel.addEventListener('focusin',()=>clearInterval(academicRotation));

const documentModal=document.getElementById('documentModal');
const documentView=document.getElementById('documentView');
const documentTitle=document.getElementById('documentTitle');
const documentOpen=document.getElementById('documentOpen');
function openDocument(title,url){
  documentTitle.textContent=title;
  documentView.src=url+'#page=1&zoom=page-width&toolbar=1&navpanes=0&scrollbar=1';
  documentOpen.href=url;
  documentModal.classList.add('open');
  document.body.style.overflow='hidden';
  document.getElementById('documentClose').focus();
}
function closeDocument(){
  documentModal.classList.remove('open');
  documentView.src='';
  document.body.style.overflow='';
}
academicCards.forEach(card=>card.addEventListener('click',()=>{
  if(card.dataset.link){
    window.open(card.dataset.link,'_blank','noopener,noreferrer');
    return;
  }
  if(card.dataset.document)openDocument(card.dataset.title,card.dataset.document);
}));
document.getElementById('documentClose').addEventListener('click',closeDocument);
documentModal.addEventListener('click',e=>{if(e.target===documentModal)closeDocument()});
document.addEventListener('keydown',e=>{if(e.key==='Escape'&&documentModal.classList.contains('open'))closeDocument()});

/* DASHBOARD IMAGE GALLERY */
const dashboardCards=[...document.querySelectorAll('.dashboard-card')];
const imageModal=document.getElementById('imageModal');
const imageView=document.getElementById('imageView');
const imageTitle=document.getElementById('imageTitle');
const imageStage=document.getElementById('imageStage');

let dashboardIndex=0;
function showDashboard(index,behavior='smooth'){
  dashboardIndex=(index+dashboardCards.length)%dashboardCards.length;
  dashboardCards.forEach((card,i)=>card.classList.toggle('is-active',i===dashboardIndex));
  document.querySelectorAll('.dashboard-dot').forEach((dot,i)=>dot.classList.toggle('active',i===dashboardIndex));
  const card=dashboardCards[dashboardIndex];
  const target=card.offsetLeft-(dashboardGallery.clientWidth-card.offsetWidth)/2;
  dashboardGallery.scrollTo({left:Math.max(0,target),behavior});
}
const dashboardPagination=document.getElementById('dashboardPagination');
dashboardCards.forEach((card,i)=>{
  const dot=document.createElement('button');
  dot.type='button';
  dot.className='dashboard-dot'+(i===0?' active':'');
  dot.setAttribute('aria-label',`Show dashboard ${i+1}`);
  dot.addEventListener('click',()=>showDashboard(i));
  dashboardPagination.appendChild(dot);
});
document.getElementById('dashboardPrev').addEventListener('click',()=>showDashboard(dashboardIndex-1));
document.getElementById('dashboardNext').addEventListener('click',()=>showDashboard(dashboardIndex+1));
const dashboardGallery=document.getElementById('dashboardGallery');
const dashboardSection=document.getElementById('dashboard');
const dashboardInner=dashboardSection.querySelector('.dash-inner');
const pinnedDashboard=false;
let dashboardRotation=setInterval(()=>showDashboard(dashboardIndex+1),5200);
function pauseDashboardRotation(){clearInterval(dashboardRotation)}
function resumeDashboardRotation(){
  clearInterval(dashboardRotation);
  dashboardRotation=setInterval(()=>showDashboard(dashboardIndex+1),5200);
}
dashboardGallery.addEventListener('mouseenter',pauseDashboardRotation);
dashboardGallery.addEventListener('mouseleave',resumeDashboardRotation);
dashboardGallery.addEventListener('focusin',pauseDashboardRotation);
dashboardGallery.addEventListener('focusout',resumeDashboardRotation);

function updatePinnedDashboard(){
  if(!pinnedDashboard)return;
  const travel=Math.max(1,dashboardSection.offsetHeight-dashboardInner.offsetHeight);
  const progress=Math.max(0,Math.min(1,(window.scrollY-dashboardSection.offsetTop)/travel));
  const horizontalTravel=Math.max(0,dashboardGallery.scrollWidth-dashboardSection.clientWidth+64);
  dashboardGallery.style.setProperty('--dashboard-shift',`${-progress*horizontalTravel}px`);
  const activeIndex=Math.min(dashboardCards.length-1,Math.round(progress*(dashboardCards.length-1)));
  if(activeIndex!==dashboardIndex){
    dashboardIndex=activeIndex;
    dashboardCards.forEach((card,i)=>card.classList.toggle('is-active',i===dashboardIndex));
    document.querySelectorAll('.dashboard-dot').forEach((dot,i)=>dot.classList.toggle('active',i===dashboardIndex));
  }
}
window.addEventListener('scroll',()=>requestAnimationFrame(updatePinnedDashboard),{passive:true});
window.addEventListener('resize',updatePinnedDashboard);
updatePinnedDashboard();

function openDashboardImage(card){
  imageTitle.textContent=card.dataset.title;
  imageView.src=card.dataset.image;
  imageView.alt=card.querySelector('img').alt;
  imageStage.classList.toggle('crop-caption',card.dataset.crop==='caption');
  imageStage.classList.toggle('hiv-dashboard',card.dataset.crop==='false');
  imageModal.classList.add('open');
  document.body.style.overflow='hidden';
  document.getElementById('imageClose').focus();
}
function closeDashboardImage(){
  imageModal.classList.remove('open');
  imageView.src='';
  imageStage.classList.remove('crop-caption','hiv-dashboard');
  document.body.style.overflow='';
}
dashboardCards.forEach(card=>card.addEventListener('click',()=>openDashboardImage(card)));
document.getElementById('imageClose').addEventListener('click',closeDashboardImage);
imageModal.addEventListener('click',e=>{if(e.target===imageModal)closeDashboardImage()});
document.addEventListener('keydown',e=>{if(e.key==='Escape'&&imageModal.classList.contains('open'))closeDashboardImage()});

/* ── SELECTED PROJECTS (active 4) ── */
const selProjects=[
  {idx:'01',category:'assessment',title:'HIV Community Needs Assessment',org:'Gwinnett, Newton & Rockdale Counties',desc:'A community-focused assessment combining public surveillance data, local context, and prevention and linkage resources.',tags:['Surveillance','Needs assessment','Health equity'],color:'#DBEAFE',shape:'',id:'ape1',image:'assets/projects/community-hiv-needs-assessment-preview.png',alt:'Community Needs Assessment portfolio cover',fit:'contain'},
  {idx:'02',category:'evaluation',title:'Program Evaluation Plan',org:'H.Y.P.E. to Empower',desc:'A CDC-informed plan including a logic model, evaluation questions, indicators, and culturally responsive tools.',tags:['Logic model','Evaluation','Measurement'],color:'#EDE9FE',shape:'',id:'ape2',image:'assets/projects/program-evaluation-plan-preview.png',alt:'Program Evaluation Plan portfolio cover',fit:'contain'},
  {idx:'03',category:'implementation',title:'Impact Story Process Improvement',org:'American Cancer Society',desc:'A case study focused on impact-story intake, data quality, and qualitative evidence organization.',tags:['Implementation science','Data quality','Power BI'],color:'#D1FAE5',shape:'',id:'acs1',image:'assets/projects/impact-story-process-improvement-preview.png',alt:'Impact Story Process Improvement portfolio cover',fit:'contain'},
  {idx:'04',category:'implementation',title:'Community Outreach Implementation Toolkit',org:'H.Y.P.E. to Empower',desc:'A reusable toolkit for partner onboarding, event preparation, documentation, and follow-up.',tags:['Partner engagement','Process design','Toolkit'],color:'#FEF3C7',shape:'',id:'hype1',image:'assets/projects/community-outreach-toolkit-preview.png',alt:'Community Outreach Implementation Toolkit preview',fit:'contain'}
];

const grid=document.getElementById('projGrid');
selProjects.forEach((p,i)=>{
  const art=document.createElement('article');
  art.className='proj-feature project-reveal';
  art.dataset.category=p.category;
  const tagsHtml=p.tags.map(t=>`<span class="proj-tag">${t}</span>`).join('');
  const visualHtml=p.image
    ? `<img class="proj-cover-image${p.fit==='contain'?' cover-contain':''}" src="${p.image}" alt="${p.alt}">`
    : `<span style="font-size:2rem;opacity:.3">□</span><b>Portfolio sample / deliverable preview</b><small>Open the project summary</small>`;
  art.innerHTML=`
    <button class="proj-visual${p.image?' has-image':''}" style="--project-bg:${p.color};background:${p.color};${p.shape}" onclick="openPanel('${p.id}')" aria-label="Open ${p.title} project details">
      <span class="proj-idx">${p.idx}</span>
      ${visualHtml}
    </button>
    <div class="proj-copy">
      <p class="kicker">${p.org}</p>
      <h3>${p.title}</h3>
      <p>${p.desc}</p>
      <div class="proj-tags">${tagsHtml}</div>
      <button class="textlink" onclick="openPanel('${p.id}')">Open project detail ↗</button>
    </div>`;
  grid.appendChild(art);
  if(revealObserver)revealObserver.observe(art);
});
document.getElementById('projectFilters').addEventListener('click',e=>{const button=e.target.closest('.project-filter');if(!button)return;document.querySelectorAll('.project-filter').forEach(item=>item.classList.toggle('active',item===button));document.querySelectorAll('.proj-feature').forEach(card=>{card.hidden=button.dataset.filter!=='all'&&card.dataset.category!==button.dataset.filter;});});

/* ── PROJECT LAB TABS ── */
const labData={
  'HIV &amp; STI':[
    {name:'HIV Care Cascade — Georgia',type:'Data story',status:'active',id:'ape4'},
    {name:'HIV Linkage-to-Care Policy Brief',type:'Policy brief',status:'active',id:'ape3'},
    {name:'Culturally Responsive Survey Tool',type:'Survey tool',status:'active',id:'hiv1'}
  ],
  'Maternal health':[
    {name:'Georgia Maternal Mortality Dashboard',type:'Dashboard',status:'concept',id:'mat1'},
    {name:'Policy Brief — Closing the Gap',type:'Policy brief',status:'concept',id:'mat2'},
    {name:'Community Infographic Series',type:'Infographic',status:'concept',id:'mat3'}
  ],
  'Overdose':[
    {name:'County-Level Overdose Mortality Analysis',type:'Analysis',status:'concept',id:'opi1'},
    {name:'Harm Reduction Resource Gap — Atlanta Metro',type:'Gap analysis',status:'concept',id:'opi2'},
    {name:'Racial Disparities Literature Review',type:'Literature review',status:'concept',id:'opi3'}
  ],
  'Cancer equity':[
    {name:'Breast Cancer Screening Dashboard',type:'Dashboard',status:'concept',id:'bc1'},
    {name:'Data Story — Diagnosed Too Late',type:'Data story',status:'concept',id:'bc2'},
    {name:'Community Screening Guide',type:'Community tool',status:'concept',id:'bc3'}
  ],
  'Infant mortality':[
    {name:'Infant Mortality Dashboard — Georgia',type:'Dashboard',status:'concept',id:'inf1'},
    {name:'Data Story — Born Into Disparity',type:'Data story',status:'concept',id:'inf2'},
    {name:'Infographic — The First 28 Days',type:'Infographic',status:'concept',id:'inf3'}
  ]
};

const tabBtns=document.getElementById('tabButtons');
const tabPanels=document.getElementById('tabPanels');
Object.entries(labData).forEach(([name,items],i)=>{
  const btn=document.createElement('button');
  btn.className='tab-btn'+(i===0?' active':'');
  btn.innerHTML=name;
  btn.dataset.tab=i;
  tabBtns.appendChild(btn);
  const panel=document.createElement('div');
  panel.className='tab-panel'+(i===0?' active':'');
  panel.dataset.panel=i;
  panel.innerHTML=items.map((x,j)=>`
    <div class="lab-item" onclick="openPanel('${x.id}')">
      <span class="lab-num">0${j+1}</span>
      <div>
        <div class="lab-item-label">${x.type}</div>
        <h3>${x.name}</h3>
      </div>
      <div style="display:flex;align-items:center;gap:.6rem">
        <span class="lab-item-status ${x.status==='active'?'ls-active':'ls-concept'}">${x.status==='active'?'Active':'Planned concept'}</span>
        <span class="lab-arrow">↗</span>
      </div>
    </div>`).join('');
  tabPanels.appendChild(panel);
});
tabBtns.addEventListener('click',e=>{
  const btn=e.target.closest('.tab-btn');
  if(!btn)return;
  document.querySelectorAll('.tab-btn').forEach(b=>b.classList.toggle('active',b===btn));
  document.querySelectorAll('.tab-panel').forEach(p=>p.classList.toggle('active',p.dataset.panel===btn.dataset.tab));
});

/* ── ROADMAP TOGGLE ── */
function toggleRoadmap(el, col){
  const isOpen = el.classList.contains('open');
  const scope = col === 'pro' ? document.getElementById('roadmap-pro') : document.getElementById('roadmap-vol');
  scope.querySelectorAll('.roadmap-item').forEach(i => i.classList.remove('open'));
  if(!isOpen) el.classList.add('open');
}

const P={
ape1:{badge:'HIV · Community assessment',bc:'#DBEAFE',bt:'#1D4ED8',title:'HIV Community Needs Assessment — Gwinnett County',status:'Completed',sc:'pbadge-active',tl:'May – July 2026',document:'assets/projects/community-needs-assessment.pdf',
  ov:'A community-focused assessment developed through my applied practice work with H.Y.P.E. to Empower and collaboration within the GNR Public Health network. It examines the local HIV context, prevention landscape, community needs, and opportunities to strengthen access and linkage.',
  me:'Synthesized public county-level surveillance information from AIDSVu and Georgia DPH with demographic context, published research, resource mapping, and observations from community outreach. The portfolio version excludes confidential program testing figures and priority-population counts.',
  sr:['AIDSVu','Georgia DPH HIV Surveillance','U.S. Census Bureau','Peer-reviewed literature'],
  sk:['Community needs assessment','HIV surveillance interpretation','Resource mapping','Health equity analysis','Technical writing'],
  fi:'The assessment identified opportunities to strengthen culturally responsive outreach, stigma reduction, prevention education, referral coordination, and follow-up processes across community settings.'},
ape2:{badge:'HIV · Evaluation plan',bc:'#EDE9FE',bt:'#5B21B6',title:'Program Evaluation Plan — Community-Based HIV Prevention and Linkage Services',status:'Completed',sc:'pbadge-active',tl:'May – July 2026',document:'assets/projects/program-evaluation-plan.pdf',
  ov:'A CDC-informed evaluation plan created for a community-based HIV prevention and linkage program. The portfolio version demonstrates the complete evaluation design while protecting confidential program performance information.',
  me:'Applied the CDC evaluation framework to define program context, stakeholders, a logic model, evaluation questions, process and outcome indicators, data sources, and culturally responsive data-collection procedures.',
  sr:['CDC Program Evaluation Framework','Program documents','Peer-reviewed HIV prevention literature'],
  sk:['Program evaluation design','Logic model development','Indicator selection','Culturally responsive evaluation','Technical reporting'],
  fi:'Produced a practical measurement structure that connects program activities to intended outcomes, clarifies documentation needs, and supports continuous program improvement without disclosing internal testing or participant metrics.'},
acs1:{badge:'Cancer control · Process improvement',bc:'#D1FAE5',bt:'#065F46',title:'Impact Story Process Improvement — American Cancer Society',status:'Completed',sc:'pbadge-active',tl:'June – July 2026',
  ov:'A process-improvement case study based on my American Cancer Society implementation-science internship. The work strengthened how patient- and health-system impact stories were collected, categorized, quality checked, retrieved, and prepared for knowledge translation.',
  me:'Reviewed more than 800 records spanning three years, developed standardized metadata and topic tags, refined Microsoft Forms intake fields, documented quality-assurance rules, and translated the workflow into a searchable internal Story Explorer concept.',
  sr:['American Cancer Society program records','Microsoft Forms','Excel','Power BI'],
  sk:['Implementation science','Data quality assurance','Process improvement','Metadata design','Knowledge translation'],
  fi:'Created a more consistent and searchable impact-story workflow that improved record organization, supported analysis, and made program evidence easier for internal teams to retrieve and communicate. No confidential records or internal screenshots are displayed.'},
hype1:{badge:'Community health · Implementation toolkit',bc:'#FEF3C7',bt:'#92400E',title:'Community Outreach Implementation Toolkit — H.Y.P.E. to Empower',status:'Completed',sc:'pbadge-active',tl:'May – July 2026',
  ov:'A reusable implementation toolkit created to support community-host partnerships and consistent delivery of outreach activities. It translates program operations into clear, repeatable steps that partners and staff can follow.',
  me:'Organized the workflow into partner outreach, onboarding, event planning, materials preparation, roles and responsibilities, documentation, follow-up, and continuous-improvement sections. Included practical checklists, communication templates, and tracking tools.',
  sr:['Program workflow review','Partner feedback','Community outreach observations','Implementation planning resources'],
  sk:['Toolkit development','Partner engagement','Workflow design','Training support','Project coordination'],
  fi:'Delivered a structured set of tools that supports clearer expectations, more consistent preparation and documentation, and easier onboarding for future community-host partners.'},
lead1:{badge:'Leadership · Academic work',bc:'#FCE7F3',bt:'#9D174D',title:'Personal Leadership Framework',tl:'Academic portfolio',document:'assets/projects/personal-leadership-framework.pdf',ov:'A visual framework defining the values and principles that guide my leadership practice in public health.',me:'Connected core values—equity, empathy, integrity, collaboration, and transparency—to practical leadership behaviors and complementary leadership models.',sr:['Leadership coursework','Reflective practice'],sk:['Leadership communication','Values-based decision making','Visual synthesis'],fi:'Produced a concise two-page framework communicating how I approach relationships, decisions, accountability, and collaboration.'},
policy1:{badge:'Policy · Health equity',bc:'#E0F2FE',bt:'#075985',title:'Language Access and Healthcare Navigation for Immigrant Communities',tl:'Policy writing sample',document:'assets/projects/language-access-policy-brief.pdf',ov:'A two-page policy brief proposing a practical federal strategy to make existing language-access protections more reliable at the point of care.',me:'Synthesized peer-reviewed evidence and federal civil-rights guidance into a clear problem definition, recommendation, implementation actions, and measurement approach.',sr:['Peer-reviewed literature','HHS Office for Civil Rights','National CLAS Standards'],sk:['Policy analysis','Evidence synthesis','Plain-language writing','Health equity'],fi:'Recommended pairing sustainable financing for qualified interpretation with bilingual community health workers, standardized training, patient notification, and performance reporting.'},
ape3:{badge:'HIV · Policy brief',bc:'#DBEAFE',bt:'#1D4ED8',title:'HIV Linkage-to-Care Policy Brief',status:'Active',sc:'pbadge-active',tl:'April – August 2026',
  ov:'A 4–6 page policy brief examining structural barriers to HIV linkage-to-care among Black youth in the South, framed around Georgia. Serves as both a literature context document and a standalone shareable writing sample.',
  me:'Structured literature review using PubMed and Google Scholar. Synthesized into a narrative brief with plain language summary and 3–5 concrete policy recommendations for GDPH and community health organizations.',
  sr:['PubMed','Google Scholar','CDC HIV Surveillance Reports','Georgia DPH','HRSA Ryan White data'],
  sk:['Scientific writing','Literature synthesis','Policy brief development','Health equity analysis','HIV prevention knowledge'],
  fi:'Completed policy brief to be added upon finalization.'},
ape4:{badge:'HIV · Data story',bc:'#DBEAFE',bt:'#1D4ED8',title:'HIV Care Cascade — Georgia',status:'Active',sc:'pbadge-active',tl:'April – August 2026',
  ov:'A narrative data story mapping Georgia\'s HIV care cascade — diagnosed, linked to care, retained in care, and virally suppressed — by county, race, and age group. Published as a LinkedIn article and eportfolio post.',
  me:'Data from AIDSVu and CDC AtlasPlus. Narrative written in long-form style — 800–1,200 words — with 2–3 embedded Power BI visuals. Cross-posted to LinkedIn.',
  sr:['AIDSVu','CDC AtlasPlus','Georgia DPH HIV Surveillance','Power BI'],
  sk:['Data storytelling','Health communication','Power BI','LinkedIn publishing','HIV surveillance'],
  fi:'Published article and visuals to be linked upon completion.'},
hiv1:{badge:'HIV · Survey tool',bc:'#EDE9FE',bt:'#5B21B6',title:'Culturally Responsive Survey Tool — HIV Stigma',status:'Active',sc:'pbadge-active',tl:'April – August 2026',
  ov:'A standalone survey instrument assessing HIV related stigma and barriers to care among young Black adults in urban settings, demonstrating independent survey design and cultural responsiveness methodology.',
  me:'Developed using validated stigma scales adapted for a youth audience. Cultural responsiveness principles applied: community-informed language, deficit-framing avoidance, 6th grade reading level target, trauma-informed design.',
  sr:['HIV Stigma Scale (Berger et al.)','Survey design literature','CDC cultural competency guidelines','Community health literacy frameworks'],
  sk:['Survey instrument design','Cultural responsiveness','Health literacy','Qualitative methods','Trauma-informed design'],
  fi:'Final survey instrument and methodology note to be added upon completion.'},
mat1:{badge:'Maternal health · Dashboard',bc:'#FCE7F3',bt:'#9D174D',title:'Georgia Maternal Mortality Dashboard',status:'Planned concept',sc:'pbadge-concept',tl:'April – August 2026',
  ov:'An interactive Power BI dashboard visualizing maternal mortality ratios across Georgia by race, county, and year. Social Vulnerability Index layered in to show which counties carry the highest burden with the fewest resources.',
  me:'Maternal mortality data from CDC WONDER (ICD-10 A34, O00–O99) by Georgia county, race, year 2016–2022. SVI from ATSDR. Joined by county FIPS. Dashboard built in Power BI.',
  sr:['CDC WONDER','ATSDR Social Vulnerability Index','Georgia DPH MMRC','Power BI'],
  sk:['CDC WONDER','Power BI','Reproductive health equity','Data visualization','Spatial analysis'],
  fi:'Dashboard to be built and added upon execution.'},
mat2:{badge:'Maternal health · Policy brief',bc:'#FCE7F3',bt:'#9D174D',title:'Policy Brief — Closing the Gap',status:'Planned concept',sc:'pbadge-concept',tl:'April – August 2026',
  ov:'A 4–6 page policy brief examining the structural drivers of Black maternal mortality in Georgia — OB desert counties, Medicaid coverage gaps, and implicit bias in clinical settings — with 3–5 concrete recommendations.',
  me:'Evidence from peer-reviewed literature, Georgia General Assembly bill tracking, GDPH MMRC reports, and March of Dimes Maternity Care Deserts data.',
  sr:['PubMed','March of Dimes Maternity Care Deserts Report','Georgia General Assembly','GDPH MMRC Reports'],
  sk:['Policy brief writing','Evidence synthesis','Reproductive health policy','Scientific communication'],
  fi:'Policy brief to be written and linked upon execution.'},
mat3:{badge:'Maternal health · Community tool',bc:'#FCE7F3',bt:'#9D174D',title:'Community Infographic Series — Maternal Mortality',status:'Planned concept',sc:'pbadge-concept',tl:'April – August 2026',
  ov:'A 3-part Canva infographic series translating Black maternal mortality data into plain language for Black women in Georgia. Part 1: the data. Part 2: structural drivers. Part 3: resources and rights.',
  me:'Data from dashboard project. Designed in Canva using health literacy principles — 6th grade reading level, visual-first, culturally affirming. Published as LinkedIn carousel.',
  sr:['CDC WONDER (dashboard data)','Georgia DPH','Black Mamas Matter Alliance','Canva'],
  sk:['Health communication','Canva design','Health literacy','Cultural responsiveness','Social media publishing'],
  fi:'Infographic series to be designed upon execution.'},
opi1:{badge:'Overdose · Analysis',bc:'#FEF3C7',bt:'#92400E',title:'County-Level Overdose Mortality Analysis — Georgia',status:'Planned concept',sc:'pbadge-concept',tl:'April – August 2026',
  ov:'County-level analysis of opioid overdose death rates in Georgia by race, age group, sex, and year (2018–2023). Identifies counties with steepest increases and most pronounced racial disparities.',
  me:'Overdose mortality data from CDC WONDER (ICD-10 X40–X44, X60–X64, X85, Y10–Y14). Visualized in Power BI as choropleth map and trend chart.',
  sr:['CDC WONDER','CDC SUDORS public data','Georgia DPH overdose surveillance','Power BI'],
  sk:['CDC WONDER','Surveillance analysis','Power BI','Overdose epidemiology','Health equity framing'],
  fi:'Analysis and dashboard to be built upon execution.'},
opi2:{badge:'Overdose · Gap analysis',bc:'#FEF3C7',bt:'#92400E',title:'Harm Reduction Resource Gap — Atlanta Metro',status:'Planned concept',sc:'pbadge-concept',tl:'April – August 2026',
  ov:'Spatial analysis mapping harm reduction services against overdose death rates in Fulton, DeKalb, and Clayton counties — identifying geographic gaps in naloxone distribution, syringe services, and treatment access.',
  me:'Service locations from SAMHSA treatment locator and NASEN directory. Overdose death data from CDC WONDER. Mapped in QGIS against county overdose rates.',
  sr:['SAMHSA Treatment Locator','NASEN Directory','CDC WONDER','QGIS'],
  sk:['GIS and spatial analysis','Harm reduction knowledge','Gap analysis','QGIS','Program mapping'],
  fi:'Maps and brief to be built upon execution.'},
opi3:{badge:'Overdose · Literature review',bc:'#FEF3C7',bt:'#92400E',title:'Racial Disparities in Overdose Mortality — Literature Review',status:'Planned concept',sc:'pbadge-concept',tl:'April – August 2026',
  ov:'Structured literature review examining emerging racial disparities in opioid and stimulant overdose deaths — specifically the documented rise in Black overdose mortality since 2019.',
  me:'Systematic PubMed search. Synthesis covers 15–25 sources organized thematically. Plain-language summary for non-specialist readers.',
  sr:['PubMed','CDC overdose surveillance reports','MMWR','Journal of Substance Abuse Treatment'],
  sk:['Literature review methodology','Scientific writing','Overdose epidemiology','Evidence synthesis','Plain-language communication'],
  fi:'Completed literature review to be linked upon execution.'},
bc1:{badge:'Cancer equity · Dashboard',bc:'#FEE2E2',bt:'#991B1B',title:'Breast Cancer Screening Dashboard — Georgia',status:'Planned concept',sc:'pbadge-concept',tl:'April – August 2026',
  ov:'Power BI dashboard showing breast cancer screening rates and late-stage diagnosis proportions by county and race across Georgia — highlighting where Black women have the lowest screening and highest late-stage diagnosis burden.',
  me:'Mammography screening data from CDC PLACES. Late-stage diagnosis from Georgia Cancer Registry. Joined by county FIPS. Dashboard in Power BI.',
  sr:['CDC PLACES','Georgia Cancer Registry','GDPH','Power BI'],
  sk:['CDC PLACES','Power BI','Cancer epidemiology','Health equity analysis','Data visualization'],
  fi:'Dashboard to be built upon execution.'},
bc2:{badge:'Cancer equity · Data story',bc:'#FEE2E2',bt:'#991B1B',title:'Data Story — "Diagnosed Too Late"',status:'Planned concept',sc:'pbadge-concept',tl:'April – August 2026',
  ov:'Long-form narrative data story examining why Black women in Georgia are disproportionately diagnosed with breast cancer at later stages — blending county-level data with structural context.',
  me:'Data from breast cancer dashboard. 1,200–1,800 words. 2–3 embedded visuals. Published as LinkedIn article with Canva cover image.',
  sr:['CDC PLACES (dashboard data)','Georgia Cancer Registry','Peer-reviewed literature','Canva'],
  sk:['Data storytelling','Health communication','Breast cancer health equity','LinkedIn publishing','Long-form writing'],
  fi:'Published article to be linked upon execution.'},
bc3:{badge:'Cancer equity · Community tool',bc:'#FEE2E2',bt:'#991B1B',title:'Community Breast Cancer Screening Guide',status:'Planned concept',sc:'pbadge-concept',tl:'April – August 2026',
  ov:'One-page plain language screening guide for Black women in Georgia — what to know, when to screen, how to navigate insurance, and where to go if uninsured. Designed in Canva with health literacy principles.',
  me:'Content from American Cancer Society screening guidelines and Georgia cancer resources. Designed at 6th grade reading level. Formatted for print and digital.',
  sr:['American Cancer Society','Georgia DPH cancer resources','CDC breast cancer screening guidelines','Canva'],
  sk:['Health literacy','Canva design','Cultural responsiveness','Community health education'],
  fi:'One-page guide to be designed upon execution.'},
sti2:{badge:'STI trends · Policy brief',bc:'#D1FAE5',bt:'#065F46',title:'Policy Brief — STI Burden and Access Gaps in Georgia',status:'Planned concept',sc:'pbadge-concept',tl:'April – August 2026',
  ov:'A 4–6 page policy brief examining why Georgia\'s STI rates remain among the highest in the country — focusing on structural drivers and framing 3–4 actionable recommendations for GDPH and local health departments.',
  me:'Evidence from CDC STI surveillance reports, Georgia DPH STI data, peer-reviewed literature, and GDPH sexual health program documentation.',
  sr:['CDC STI Surveillance Reports','Georgia DPH','PubMed','GDPH sexual health programs'],
  sk:['Policy brief writing','STI epidemiology','Evidence synthesis','Sexual health policy','Scientific communication'],
  fi:'Policy brief to be written upon execution.'},
sti3:{badge:'STI trends · Community tool',bc:'#D1FAE5',bt:'#065F46',title:'STI Prevention Infographic Series',status:'Planned concept',sc:'pbadge-concept',tl:'April – August 2026',
  ov:'3-part Canva infographic series translating Georgia\'s STI data into plain language for young adults. Part 1: the data. Part 2: stigma and barriers. Part 3: where to get tested free or low cost.',
  me:'Data from STI dashboard. Designed in Canva at 6th grade reading level. LinkedIn carousel format optimized for mobile.',
  sr:['CDC AtlasPlus (dashboard data)','GDPH clinic directory','gettested.cdc.gov','Canva'],
  sk:['Health communication','Canva design','Health literacy','STI prevention','Social media publishing'],
  fi:'Infographic series to be designed upon execution.'},
inf1:{badge:'Infant mortality · Dashboard',bc:'#CFFAFE',bt:'#164E63',title:'Infant Mortality Dashboard — Georgia',status:'Planned concept',sc:'pbadge-concept',tl:'April – August 2026',
  ov:'Power BI dashboard showing infant mortality rates by county, race, and year across Georgia, layered with Social Vulnerability Index data. Pairs with the maternal mortality dashboard as a two-part reproductive health equity arc.',
  me:'Infant mortality data from CDC WONDER Linked Birth/Infant Death Records by Georgia county, race of mother, year 2017–2021. SVI from ATSDR. Joined by county FIPS.',
  sr:['CDC WONDER Linked Birth/Infant Death Records','ATSDR Social Vulnerability Index','Georgia DPH Vital Statistics','Power BI'],
  sk:['CDC WONDER','Power BI','Infant mortality epidemiology','Reproductive health equity','Spatial analysis'],
  fi:'Dashboard to be built upon execution.'},
inf2:{badge:'Infant mortality · Data story',bc:'#CFFAFE',bt:'#164E63',title:'Data Story — "Born Into Disparity"',status:'Planned concept',sc:'pbadge-concept',tl:'April – August 2026',
  ov:'Narrative data story examining why Black infants in Georgia die at significantly higher rates than white infants — blending county-level data with structural context including preterm birth rates, Medicaid gaps, and the weathering hypothesis.',
  me:'Data from infant mortality dashboard. 1,200–1,800 words. Human-scale opening, four structural drivers, evidence based interventions, closing. Published as LinkedIn article.',
  sr:['CDC WONDER (dashboard data)','March of Dimes Maternity Care Deserts','Georgia DPH','Peer-reviewed weathering literature'],
  sk:['Data storytelling','Reproductive health equity','Long-form writing','LinkedIn publishing','Health equity narrative'],
  fi:'Published article to be linked upon execution.'},
inf3:{badge:'Infant mortality · Infographic',bc:'#CFFAFE',bt:'#164E63',title:'Infographic — "The First 28 Days"',status:'Planned concept',sc:'pbadge-concept',tl:'April – August 2026',
  ov:'Single-page infographic focused on neonatal mortality among Black infants in Georgia — translates data into plain language, identifies top three preventable drivers, and lists Georgia-specific resources for Black mothers.',
  me:'Neonatal mortality data from CDC WONDER. Designed in Canva at 6th grade reading level. One page for print and digital.',
  sr:['CDC WONDER','Georgia DPH','March of Dimes','Black Mamas Matter Alliance','Canva'],
  sk:['Health communication','Canva design','Neonatal epidemiology','Health literacy','Cultural responsiveness'],
  fi:'Infographic to be designed upon execution.'}
};

function openPanel(id){
  const p=P[id];if(!p)return;
  const sr=p.sr.map(s=>`<span class="chip">${s}</span>`).join('');
  const sk=p.sk.map(s=>`<span class="skill-chip">${s}</span>`).join('');
  const documentActions=p.document?`<div class="panel-document-actions"><button class="btn btn-primary" type="button" onclick="openProjectDocument('${p.title.replace(/'/g,"\\'")}','${p.document}')">Open PDF ↗</button><a class="btn btn-light" href="${p.document}" download>Download PDF ↓</a></div>`:'';
  document.getElementById('panelContent').innerHTML=`
    <span class="panel-badge" style="background:${p.bc};color:${p.bt}">${p.badge}</span>
    <div class="panel-title">${p.title}</div>
    <div class="panel-status-row">
      <span class="pbadge pbadge-time">${p.tl}</span>
    </div>
    ${documentActions}
    <div class="panel-sec"><div class="panel-sec-label">Overview</div><div class="panel-body">${p.ov}</div></div>
    <div class="panel-sec"><div class="panel-sec-label">Methods</div><div class="panel-body">${p.me}</div></div>
    <div class="panel-sec"><div class="panel-sec-label">Data sources</div><div class="chips">${sr}</div></div>
    <div class="panel-sec"><div class="panel-sec-label">Key findings and results</div><div class="findings-box">${p.fi}</div></div>
    <div class="panel-sec"><div class="panel-sec-label">Skills demonstrated</div><div class="chips">${sk}</div></div>`;
  document.getElementById('overlay').classList.add('open');
  document.getElementById('sidePanel').classList.add('open');
  document.body.style.overflow='hidden';
}

function openProjectDocument(title,url){
  closePanel();
  openDocument(title,url);
}

function closePanel(){
  document.getElementById('overlay').classList.remove('open');
  document.getElementById('sidePanel').classList.remove('open');
  document.body.style.overflow='';
}
