/* ============================================================
   AragoCor Minerals — site behaviour
   - Injects shared header + footer (edit markup here, once)
   - Sticky header scroll state, mega menu, mobile menu
   - FAQ accordions, resource/industry filtering, contact form
   No framework. Runs from a plain file:// open or any host.
   ============================================================ */

/* ---- Industry list (drives mega menu + footer links) ---- */
var INDUSTRIES = [
  { slug:"glass", name:"Glass Manufacturing", tagline:"High-purity calcium for advanced glass batches." },
  { slug:"agriculture", name:"Agriculture", tagline:"Ocean-renewed calcium for modern soils." },
  { slug:"water-treatment", name:"Water Treatment", tagline:"Natural aragonite for water and environmental systems." },
  { slug:"wastewater", name:"Wastewater", tagline:"Phosphorus and pH management at scale." },
  { slug:"plastics", name:"Plastics & Polymers", tagline:"Engineered filler for advanced polymer systems." },
  { slug:"paint", name:"Paint & Coatings", tagline:"Whiteness, rheology and durability." },
  { slug:"construction", name:"Construction, Concrete & Cement", tagline:"Filler chemistry for low-carbon concrete." },
  { slug:"turf", name:"Turf, Landscaping & Golf", tagline:"Cooler infill, healthier root zones." },
  { slug:"aquaculture", name:"Aquaculture", tagline:"Mineral support for aquatic systems." },
  { slug:"animal-feed", name:"Animal Feed", tagline:"Calcium source for livestock & poultry." },
  { slug:"environmental", name:"Environmental Remediation", tagline:"Natural mineral for ecological systems." },
  { slug:"carbon-capture", name:"Carbon Capture", tagline:"Mineral pathways for permanent carbon storage." },
  { slug:"battery-materials", name:"Battery Materials", tagline:"Precursor calcium for emerging chemistries." },
  { slug:"emerging-technologies", name:"Emerging Technologies", tagline:"From biomaterials to climate tech." }
];

var NAV = [
  { label:"Science", href:"science.html" },
  { label:"Industries", href:"industries.html" },
  { label:"Resources", href:"resources.html" },
  { label:"About", href:"about.html" }
];

/* small inline-SVG icon helpers (lucide paths) */
var ICON = {
  menu:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="4" y1="12" x2="20" y2="12"/><line x1="4" y1="6" x2="20" y2="6"/><line x1="4" y1="18" x2="20" y2="18"/></svg>',
  x:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>',
  chevron:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="6 9 12 15 18 9"/></svg>',
  arrow:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg>',
  arrowUp:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="7" y1="17" x2="17" y2="7"/><polyline points="7 7 17 7 17 17"/></svg>',
  pin:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>',
  mail:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="2" y="4" width="20" height="16" rx="2"/><path d="m22 7-10 5L2 7"/></svg>',
  phone:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.13.96.36 1.9.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.9.34 1.85.57 2.81.7A2 2 0 0 1 22 16.92z"/></svg>'
};

/* ---------- Shared header ---------- */
function buildHeader(active){
  var navHtml = NAV.map(function(n){
    var isActive = active === n.href ? " active" : "";
    return '<a class="nav-link'+isActive+'" href="'+n.href+'">'+n.label+'</a>';
  }).join("");

  var mobileLinks = NAV.map(function(n){
    return '<a class="mobile-link" href="'+n.href+'">'+n.label+'</a>';
  }).join("");

  return ''+
  '<header class="site-header" id="siteHeader">'+
    '<div class="container-wide header-inner">'+
      '<a class="brand" href="index.html" aria-label="AragoCor Minerals home"><img src="images/aragocor-logo.png" alt="AragoCor Minerals" decoding="async"></a>'+
      '<nav class="main-nav">'+navHtml+'</nav>'+
      '<div class="header-cta">'+
        '<a class="btn btn-sm btn-accent header-primary" href="contact.html?type=sample">Request Sample '+ICON.arrow+'</a>'+
      '</div>'+
      '<button class="menu-toggle" id="menuToggle" aria-label="Open menu">'+ICON.menu+'</button>'+
    '</div>'+
    '<div class="mobile-menu" id="mobileMenu">'+
      '<div class="container-wide">'+
        mobileLinks+
        '<div class="mobile-actions">'+
          '<a class="btn btn-accent" href="contact.html?type=sample">Request Sample</a>'+
        '</div>'+
      '</div>'+
    '</div>'+
  '</header>';
}

/* ---------- Shared footer ---------- */
function buildFooter(){
  var cols = [
    { title:"Material", links:[
      ["Science","science.html"],["Why Aragonite","science.html#why-aragonite"],
      ["Carbon Negative","science.html#carbon-negative"],["The Bahamas Origin","about.html#origin"]]},
    { title:"Industries", links:[
      ["Glass Manufacturing","industries.html#glass"],["Agriculture","industries.html#agriculture"],
      ["Water Treatment","industries.html#water-treatment"],["Polymers","industries.html#plastics"],
      ["Construction","industries.html#construction"],["All Industries","industries.html"]]},
    { title:"Resources", links:[
      ["Technical Data Sheets","resources.html?cat=tds"],["Safety Data Sheets","resources.html?cat=sds"],
      ["White Papers","resources.html?cat=whitepapers"],["Knowledge Center","resources.html#knowledge"]]},
    { title:"Company", links:[
      ["About","about.html"],["Contact","contact.html"],
      ["Request Sample","contact.html?type=sample"]]}
  ];
  var colHtml = cols.map(function(c){
    var li = c.links.map(function(l){ return '<li><a class="link-underline" href="'+l[1]+'">'+l[0]+'</a></li>'; }).join("");
    return '<div class="footer-col"><h4>'+c.title+'</h4><ul>'+li+'</ul></div>';
  }).join("");

  return ''+
  '<footer class="site-footer">'+
    '<div class="aurora-bg" aria-hidden="true"></div>'+
    '<div class="grid-bg" aria-hidden="true"></div>'+
    '<div class="container-wide footer-inner">'+
      '<div class="footer-top">'+
        '<div class="footer-brand">'+
          '<img src="images/aragocor-logo.png" alt="AragoCor Minerals">'+
          '<p>AragoCor Minerals is the global authority on high-purity natural oolitic aragonite — premium calcium carbonate engineered by nature, applied by industry.</p>'+
          '<ul class="footer-contact">'+
            '<li>'+ICON.pin+' Stockton, California — Global HQ</li>'+
            '<li>'+ICON.mail+' info@aragocorminerals.com</li>'+
            '<li>'+ICON.phone+' +1 (855) 751-9100</li>'+
          '</ul>'+
        '</div>'+
        '<div class="footer-cols">'+colHtml+'</div>'+
      '</div>'+
      '<div class="hairline" style="margin-top:4rem;opacity:.3"></div>'+
      '<div class="footer-bottom">'+
        '<p>© <span id="yr"></span> AragoCor Minerals LLC. High-purity natural oolitic aragonite calcium carbonate.</p>'+
        '<p class="mono" style="text-transform:uppercase;letter-spacing:.22em">OMRI Certified · Ocean-Renewed · High-Purity CaCO₃</p>'+
      '</div>'+
    '</div>'+
    '<a href="#top" class="back-to-top">Back to top '+ICON.arrowUp+'</a>'+
  '</footer>';
}

/* ---------- Header behaviour ---------- */
function initHeader(){
  var header = document.getElementById("siteHeader");
  if(!header) return;
  var mobileMenu = document.getElementById("mobileMenu");
  var toggle = document.getElementById("menuToggle");
  var transparent = header.hasAttribute("data-transparent");

  function onScroll(){
    if(!transparent){ header.classList.add("scrolled"); return; }
    header.classList.toggle("scrolled", window.scrollY > 24);
  }
  onScroll();
  window.addEventListener("scroll", onScroll, { passive:true });

  if(toggle && mobileMenu){
    toggle.addEventListener("click", function(){
      var open = mobileMenu.classList.toggle("open");
      toggle.innerHTML = open ? ICON.x : ICON.menu;
    });
  }
}

/* ---------- FAQ accordions ---------- */
function initAccordions(){
  document.querySelectorAll(".acc-trigger").forEach(function(btn){
    btn.addEventListener("click", function(){
      var item = btn.closest(".acc-item");
      var panel = item.querySelector(".acc-panel");
      var isOpen = item.classList.contains("open");
      // single-collapse within same accordion
      var parent = item.closest(".accordion");
      if(parent){ parent.querySelectorAll(".acc-item.open").forEach(function(o){ if(o!==item){ o.classList.remove("open"); o.querySelector(".acc-panel").style.maxHeight=null; } }); }
      if(isOpen){ item.classList.remove("open"); panel.style.maxHeight=null; }
      else { item.classList.add("open"); panel.style.maxHeight = panel.scrollHeight + "px"; }
    });
  });
}

/* ---------- Generic card filtering (resources + industries hub) ---------- */
function initFilters(){
  // Text search inputs with data-filter-target
  document.querySelectorAll("[data-search]").forEach(function(input){
    var target = document.querySelector(input.getAttribute("data-search"));
    if(!target) return;
    input.addEventListener("input", function(){ applyFilter(target); });
  });
  // Category chips
  document.querySelectorAll("[data-filter-group]").forEach(function(group){
    var target = document.querySelector(group.getAttribute("data-filter-group"));
    group.querySelectorAll(".filter-chip").forEach(function(chip){
      chip.addEventListener("click", function(){
        group.querySelectorAll(".filter-chip").forEach(function(c){ c.classList.remove("active"); });
        chip.classList.add("active");
        if(target){ target.setAttribute("data-active-cat", chip.getAttribute("data-cat")||"All"); applyFilter(target); }
      });
    });
  });
  // preselect category from ?cat=
  var qc = new URLSearchParams(location.search).get("cat");
  if(qc){
    var map = { tds:"Technical Data Sheet", sds:"Safety Data Sheet", whitepapers:"White Paper" };
    var wanted = map[qc];
    if(wanted){
      var chip = document.querySelector('.filter-chip[data-cat="'+wanted+'"]');
      if(chip) chip.click();
    }
  }
}
function applyFilter(target){
  var q = "";
  var searchInput = document.querySelector('[data-search="#'+target.id+'"]');
  if(searchInput) q = searchInput.value.toLowerCase();
  var cat = target.getAttribute("data-active-cat") || "All";
  var shown = 0;
  target.querySelectorAll("[data-card]").forEach(function(card){
    var text = (card.getAttribute("data-text")||"").toLowerCase();
    var cCat = card.getAttribute("data-cat")||"";
    var okText = !q || text.indexOf(q) !== -1;
    var okCat = cat === "All" || cCat === cat;
    var show = okText && okCat;
    card.style.display = show ? "" : "none";
    if(show) shown++;
  });
  var empty = document.querySelector('[data-empty="#'+target.id+'"]');
  if(empty) empty.style.display = shown ? "none" : "";
}

/* ---------- Contact form ---------- */
function initContact(){
  var form = document.getElementById("contactForm");
  if(!form) return;
  var type = new URLSearchParams(location.search).get("type");
  var sel = document.getElementById("requestType");
  if(sel && type){
    var map = { engineer:"Consultation", sample:"Sample", download:"Technical Data", "case-study":"Consultation" };
    if(map[type]) sel.value = map[type];
  }
  form.addEventListener("submit", function(e){
    e.preventDefault();
    showToast("Request received", "An AragoCor specialist will follow up within one business day.");
    form.reset();
    if(sel && type && {engineer:1,sample:1,download:1}[type]){ sel.value = ({engineer:"Consultation",sample:"Sample",download:"Technical Data"})[type]; }
  });
}
function showToast(title, desc){
  var t = document.getElementById("toast");
  if(!t){
    t = document.createElement("div");
    t.id = "toast"; t.className = "toast";
    document.body.appendChild(t);
  }
  t.innerHTML = '<div class="tt">'+title+'</div><div class="td">'+desc+'</div>';
  requestAnimationFrame(function(){ t.classList.add("show"); });
  clearTimeout(t._timer);
  t._timer = setTimeout(function(){ t.classList.remove("show"); }, 4500);
}

/* ---------- Boot ---------- */
document.addEventListener("DOMContentLoaded", function(){
  var headerMount = document.getElementById("header-mount");
  if(headerMount){
    var active = headerMount.getAttribute("data-active") || "";
    var transparent = headerMount.getAttribute("data-transparent") === "true";
    headerMount.outerHTML = buildHeader(active);
    if(transparent){ var h = document.getElementById("siteHeader"); if(h) h.setAttribute("data-transparent","true"); }
  }
  var footerMount = document.getElementById("footer-mount");
  if(footerMount){ footerMount.outerHTML = buildFooter(); }

  var yr = document.getElementById("yr"); if(yr) yr.textContent = new Date().getFullYear();

  initHeader();
  initAccordions();
  initFilters();
  initContact();
});
