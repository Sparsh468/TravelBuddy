const rupee = new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 });

const DESTINATIONS = [
  { id: 'goa', name: 'Goa', state: 'Goa', theme: 'Beaches & nightlife', image: 'goa.jpeg', baseCostPerNight: { budget: 2500, balanced: 4000, luxury: 9000 } },
  { id: 'jaipur', name: 'Jaipur', state: 'Rajasthan', theme: 'Palaces & culture', image: 'jaipur.jpeg', baseCostPerNight: { budget: 2200, balanced: 3800, luxury: 8000 } },
  { id: 'manali', name: 'Manali', state: 'Himachal Pradesh', theme: 'Mountains & adventure', image: 'manali.jpeg', baseCostPerNight: { budget: 2000, balanced: 3500, luxury: 7500 } },
  { id: 'andaman', name: 'Havelock Island', state: 'Andaman & Nicobar', theme: 'Tropical islands', image: 'andaman.jpeg', baseCostPerNight: { budget: 4500, balanced: 7000, luxury: 14000 } },
  { id: 'kerala', name: 'Alleppey', state: 'Kerala', theme: 'Backwaters & Ayurveda', image: 'alleppey.jpeg', baseCostPerNight: { budget: 2400, balanced: 3800, luxury: 9000 } },
  { id: 'leh', name: 'Leh', state: 'Ladakh', theme: 'High-altitude landscapes', image: 'leh.jpeg', baseCostPerNight: { budget: 3000, balanced: 5200, luxury: 11000 } },
  { id: 'mumbai', name: 'Mumbai', state: 'Maharashtra', theme: 'City & seafronts', image: 'mumbai.jpeg', baseCostPerNight: { budget: 2800, balanced: 5000, luxury: 12000 } },
  { id: 'kerala-kochi', name: 'Kochi', state: 'Kerala', theme: 'Fort Kochi & culture', image: 'kochi.jpeg', baseCostPerNight: { budget: 2400, balanced: 4200, luxury: 9000 } },
  { id: 'rishikesh', name: 'Rishikesh', state: 'Uttarakhand', theme: 'Yoga & rafting', image: 'rishikesh.jpeg', baseCostPerNight: { budget: 1800, balanced: 3200, luxury: 7000 } },
  { id: 'darjeeling', name: 'Darjeeling', state: 'West Bengal', theme: 'Tea gardens & views', image: 'darjeeling.jpeg', baseCostPerNight: { budget: 2100, balanced: 3400, luxury: 7800 } },
  { id: 'udaipur', name: 'Udaipur', state: 'Rajasthan', theme: 'Lakes & palaces', image: 'udaipur.jpeg', baseCostPerNight: { budget: 2400, balanced: 4200, luxury: 9500 } },
  { id: 'varanasi', name: 'Varanasi', state: 'Uttar Pradesh', theme: 'Ghats & spirituality', image: 'varanasi.jpeg', baseCostPerNight: { budget: 1800, balanced: 3200, luxury: 8000 } },
  { id: 'pondi', name: 'Pondicherry', state: 'Puducherry', theme: 'French quarters & beaches', image: 'pondicherry.jpeg', baseCostPerNight: { budget: 2000, balanced: 3600, luxury: 8500 } },
  { id: 'shimla', name: 'Shimla', state: 'Himachal Pradesh', theme: 'Colonial hills', image: 'shimla.jpeg', baseCostPerNight: { budget: 2100, balanced: 3400, luxury: 8000 } },
  { id: 'hampi', name: 'Hampi', state: 'Karnataka', theme: 'Ruins & boulders', image: 'hampi.jpeg', baseCostPerNight: { budget: 1700, balanced: 3000, luxury: 7000 } }
];

function parseINR(input) {
  const digits = String(input).replace(/[^0-9]/g, '');
  return digits ? parseInt(digits, 10) : NaN;
}

function estimateTripCostPerNight(tier) {
  // heuristic for food + local transport baseline per night (excludes paid activities)
  if (tier === 'budget') return 1000;
  if (tier === 'luxury') return 3000;
  return 1800; // balanced
}

function determineTierByTotal(totalBudget) {
  if (totalBudget < 60000) return 'budget';
  if (totalBudget < 100000) return 'balanced';
  return 'luxury';
}

function slackForTier(tier) {
  if (tier === 'budget') return 0.9; // aim for ~90% of remaining
  if (tier === 'balanced') return 0.95; // aim for ~95%
  return 1.0; // luxury can spend closer to full
}

function buildItineraries(totalBudget, nights) {
  const tier = determineTierByTotal(totalBudget);
  const miscPerNight = estimateTripCostPerNight(tier);
  const itineraries = DESTINATIONS.map(dest => {
    const lodgingPerNight = dest.baseCostPerNight[tier];
    // Allocate remaining budget to activities so total tracks budget closely
    const basePerNight = lodgingPerNight + miscPerNight;
    const baseTotal = basePerNight * nights;
    const remaining = Math.max(0, totalBudget - baseTotal);
    const slack = slackForTier(tier);
    const targetActivitiesTotal = Math.floor(remaining * slack);
    const activityPerNight = Math.floor(targetActivitiesTotal / Math.max(1, nights));
    const perNight = basePerNight + activityPerNight;
    const total = baseTotal + activityPerNight * nights;
    const withinBudget = total <= totalBudget;
    const savings = Math.max(0, totalBudget - total);
    const over = Math.max(0, total - totalBudget);
    return { ...dest, nights, style: tier, perNight, total, withinBudget, savings, over, activityPerNight };
  });
  // sort: in-budget first by total desc (use budget well), then closest over-budget
  const inBudget = itineraries.filter(i => i.withinBudget).sort((a,b) => b.total - a.total);
  const overBudget = itineraries.filter(i => !i.withinBudget).sort((a,b) => a.over - b.over);
  return [...inBudget, ...overBudget];
}

function imageFor(dest) {
  const q = encodeURIComponent(`${dest.name} ${dest.state} India`);
  return `https://source.unsplash.com/800x600/?${q}`;
}

function getImageUrl(dest) {
  return dest.image || imageFor(dest);
}

function cardHtml(itin) {
  const subtitle = `${itin.state} • ${itin.theme}`;
  const perNightStr = rupee.format(itin.perNight);
  const totalStr = rupee.format(itin.total);
  const badge = itin.withinBudget ? `Within budget` : `Over by ${rupee.format(itin.over)}`;
  const badgeClass = itin.withinBudget ? 'badge-ok' : 'badge-warn';
  return `
    <article class="card" data-dest-id="${itin.id}" data-keyword="${itin.name}" aria-label="Itinerary card for ${itin.name}">
      <img alt="${itin.name}" src="${getImageUrl(itin)}" loading="lazy" referrerpolicy="no-referrer" />
      <div class="content">
        <div class="title">${itin.name}</div>
        <div class="subtitle">${subtitle}</div>
        <div class="price">${perNightStr} / night • ${itin.nights} nights</div>
        <div class="total">Total: <strong>${totalStr}</strong></div>
        <div class="badge ${badgeClass}">${badge}</div>
      </div>
    </article>
  `;
}

function renderResults(target, itineraries) {
  if (!itineraries.length) {
    target.innerHTML = '<p>No suggestions found.</p>';
    return;
  }
  target.innerHTML = itineraries.map(cardHtml).join('');
}

function showError(inputEl, message) {
  inputEl.setAttribute('aria-invalid', 'true');
  inputEl.classList.add('input-error');
  alert(message);
}

function clearError(inputEl) {
  inputEl.removeAttribute('aria-invalid');
  inputEl.classList.remove('input-error');
}

window.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('trip-form');
  const budgetInput = document.getElementById('budget');
  const nightsInput = document.getElementById('nights');
  const results = document.getElementById('results');
  const modal = document.getElementById('details-modal');
  const modalBody = document.getElementById('details-body');
  const modalClose = modal.querySelector('.modal-close');

  budgetInput.addEventListener('input', () => {
    const n = parseINR(budgetInput.value);
    if (Number.isNaN(n)) return;
    budgetInput.value = new Intl.NumberFormat('en-IN').format(n);
  });

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const budget = parseINR(budgetInput.value);
    const nights = parseInt(nightsInput.value, 10) || 0;
    // Travel style is automatically determined by budget

    clearError(budgetInput);
    if (!budget || budget < 1000) {
      showError(budgetInput, 'Please enter a valid budget in ₹ (min ₹1,000).');
      return;
    }
    if (!nights || nights < 1) {
      showError(nightsInput, 'Please enter nights (min 1).');
      return;
    }

    try {
      const api = await fetch(`http://localhost:8080/api/suggest`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ budget_inr: budget, nights })
      });
      if (api.ok) {
        const data = await api.json();
        const mapped = data.map(x => ({ id: x.id, name: x.name, state: x.state, theme: x.theme, image: x.image, baseCostPerNight: { budget: 0, balanced: 0, luxury: 0 }, nights, style: x.tier, perNight: x.per_night_inr, total: x.total_inr, withinBudget: x.total_inr <= budget, savings: Math.max(0, budget - x.total_inr), over: Math.max(0, x.total_inr - budget) }));
        const filtered = await filterByWorkingImages(mapped);
        renderResults(results, filtered);
        const effectiveTier = data[0] ? data[0].tier : determineTierByTotal(budget);
        attachCardHandlers(results, { nights, style: effectiveTier, budget });
        attachImageGuards(results);
        return;
      }
    } catch (err) {
      console.warn('Backend not available, using client fallback', err);
    }

    try {
      const itineraries = buildItineraries(budget, nights);
      const filtered = await filterByWorkingImages(itineraries);
      renderResults(results, filtered);
      const effectiveTier = filtered[0] ? filtered[0].style : determineTierByTotal(budget);
      attachCardHandlers(results, { nights, style: effectiveTier, budget });
      attachImageGuards(results);
    } catch (err) {
      console.error('Error generating results', err);
      results.innerHTML = '<p>Something went wrong while generating suggestions. Please try again.</p>';
    }
  });

  modalClose.addEventListener('click', () => closeModal(modal));
  modal.addEventListener('click', (e) => { if (e.target.classList.contains('modal-backdrop')) closeModal(modal); });
});

function closeModal(modalEl) { modalEl.setAttribute('aria-hidden', 'true'); }

function openModal(modalEl) { modalEl.setAttribute('aria-hidden', 'false'); }

function attachCardHandlers(resultsEl, context) {
  resultsEl.querySelectorAll('.card').forEach(card => {
    card.addEventListener('click', () => {
      const destId = card.getAttribute('data-dest-id');
      const dest = DESTINATIONS.find(d => d.id === destId);
      if (!dest) return;
      const html = renderDetails(dest, context);
      const modal = document.getElementById('details-modal');
      const body = document.getElementById('details-body');
      body.innerHTML = html;
      // Install fallback on the modal hero image as well
      const heroImg = body.querySelector('.details-header img');
      if (heroImg) {
        try {
          installImgFallback(heroImg, dest.name);
        } catch (_) { /* no-op */ }
      }
      openModal(modal);
    });
  });
}

function attachImageGuards(scopeEl) {
  const container = scopeEl.closest('#results') || scopeEl;
  scopeEl.querySelectorAll('img').forEach(imgEl => {
    let retries = 0;
    const article = imgEl.closest('.card');
    const destId = article ? article.getAttribute('data-dest-id') : '';
    const dest = DESTINATIONS.find(d => d.id === destId);
    const tryKeyword = () => {
      retries += 1;
      const fallbackDest = dest || { name: (article && article.getAttribute('data-keyword')) || 'India', state: 'India' };
      imgEl.src = getImageUrl(fallbackDest);
    };
    imgEl.addEventListener('error', () => {
      if (retries < 1) { tryKeyword(); return; }
      // If still failing, hide image and show a simple placeholder
      imgEl.style.display = 'none';
      const existing = article && article.querySelector('.img-placeholder');
      if (!existing && article) {
        const placeholder = document.createElement('div');
        placeholder.className = 'img-placeholder';
        placeholder.textContent = (dest && dest.name) ? dest.name : 'Image unavailable';
        article.insertBefore(placeholder, article.firstChild);
      }
    }, { once: false });
  });
}

function pickHotels(destId, style) {
  const HOTEL_DB = {
    goa: {
      budget: [
        { name: 'Resort Primo Bom Terra Verde, Calangute', note: 'Near Baga/Calangute' },
        { name: 'Casa de Goa Boutique Resort', note: 'Walk to beach' }
      ],
      balanced: [
        { name: 'Acron Waterfront Resort, Baga', note: 'Riverside' },
        { name: 'Taj Holiday Village Cottages', note: 'Candolim' }
      ],
      luxury: [
        { name: 'W Goa', note: 'Vagator' },
        { name: 'Taj Exotica Resort & Spa', note: 'Benaulim' }
      ]
    },
    jaipur: {
      budget: [ { name: 'Umaid Bhawan - Heritage House', note: 'Bani Park' } ],
      balanced: [ { name: 'Alsisar Haveli', note: 'Near MI Road' } ],
      luxury: [ { name: 'Rambagh Palace', note: 'Iconic luxury' } ]
    },
    manali: {
      budget: [ { name: 'Zostel Manali', note: 'Old Manali' } ],
      balanced: [ { name: 'Snow Valley Resorts', note: 'Log Huts area' } ],
      luxury: [ { name: 'Span Resort & Spa', note: 'Riverside' } ]
    },
    andaman: {
      budget: [ { name: 'SeaShell, Havelock', note: 'Near beach' } ],
      balanced: [ { name: 'Barefoot at Havelock', note: 'Elephant Beach' } ],
      luxury: [ { name: 'Taj Exotica Resort & Spa, Andamans', note: 'Radhanagar' } ]
    },
    kerala: {
      budget: [ { name: 'Houseboat Standard, Alleppey', note: 'Shared AC' } ],
      balanced: [ { name: 'Lake Palace Resort', note: 'Punnamada Lake' } ],
      luxury: [ { name: 'Kumarakom Lake Resort', note: 'Backwaters luxury' } ]
    },
    leh: {
      budget: [ { name: 'The Grand Dragon Annex', note: 'Central' } ],
      balanced: [ { name: 'The Grand Dragon Ladakh', note: 'Premium' } ],
      luxury: [ { name: 'The Indus Valley', note: 'Upscale' } ]
    },
    rishikesh: {
      budget: [ { name: 'Zostel Rishikesh', note: 'Tapovan' } ],
      balanced: [ { name: 'Divine Resort & Spa', note: 'Ganga view' } ],
      luxury: [ { name: 'Aloha On The Ganges', note: 'Riverfront' } ]
    },
    darjeeling: {
      budget: [ { name: 'Hotel Seven Seventeen', note: 'Chauk Bazaar' } ],
      balanced: [ { name: 'Mayfair Darjeeling', note: 'Heritage' } ],
      luxury: [ { name: 'Windamere Hotel', note: 'Colonial charm' } ]
    },
    udaipur: {
      budget: [ { name: 'Hotel Lakend (budget wing)', note: 'Lake Fateh Sagar' } ],
      balanced: [ { name: 'Trident Udaipur', note: 'Near Lake Pichola' } ],
      luxury: [ { name: 'Taj Lake Palace', note: 'Iconic lake hotel' } ]
    },
    varanasi: {
      budget: [ { name: 'Ganpati Guest House', note: 'Dashashwamedh Ghat' } ],
      balanced: [ { name: 'BrijRama Palace', note: 'Darbhanga Ghat' } ],
      luxury: [ { name: 'Taj Nadesar Palace', note: 'Heritage' } ]
    },
    pondi: {
      budget: [ { name: 'Le Dupleix (std rooms)', note: 'French Quarter' } ],
      balanced: [ { name: 'The Promenade', note: 'Sea-facing' } ],
      luxury: [ { name: 'Palais de Mahe', note: 'Boutique luxury' } ]
    },
    shimla: {
      budget: [ { name: 'Hotel Shingar', note: 'Mall Road' } ],
      balanced: [ { name: 'Radisson Hotel Shimla', note: 'Prospect Hill' } ],
      luxury: [ { name: 'Wildflower Hall', note: 'Mashobra' } ]
    },
    hampi: {
      budget: [ { name: 'Rocky Guest House', note: 'Hampi Bazaar' } ],
      balanced: [ { name: 'Clarks Inn Hampi', note: 'Kamlapur' } ],
      luxury: [ { name: 'Evolve Back Kamalapura Palace', note: 'Luxury' } ]
    }
  };
  const options = HOTEL_DB[destId] || HOTEL_DB.goa;
  if (style === 'budget') return options.budget; // enforce guest houses only
  return options[style] || options.balanced;
}

function buildDailyPlan(destId, nights, tier) {
  const plan = [];
  const templates = {
    goa: [
      { title: 'North Goa beaches', note: 'Calangute, Baga, Candolim; water sports' },
      { title: 'Fort Aguada & Chapora', note: 'Sunset at Vagator' },
      { title: 'Old Goa & Panaji', note: 'Basilica of Bom Jesus, Latin Quarter' }
    ],
    jaipur: [
      { title: 'Amber Fort & Jaigarh', note: 'Elephant ride optional' },
      { title: 'City Palace, Jantar Mantar', note: 'Hawa Mahal photo stop' },
      { title: 'Nahargarh & Chokhi Dhani', note: 'Evening cultural village' }
    ],
    manali: [
      { title: 'Solang Valley', note: 'Cable car; adventure sports' },
      { title: 'Old Manali & Hidimba Devi', note: 'Cafes and local market' },
      { title: 'Atal Tunnel & Sissu (seasonal)', note: 'Snow views' }
    ],
    mumbai: [
      { title: 'Gateway of India & Colaba', note: 'Walk Marine Drive at sunset' },
      { title: 'Bandra & Juhu', note: 'Street food and sea views' },
      { title: 'Elephanta Caves (ferry)', note: 'Heritage site' }
    ],
    andaman: [
      { title: 'Radhanagar Beach', note: 'Sunset; swim' },
      { title: 'Elephant Beach', note: 'Snorkeling, glass-bottom boat' },
      { title: 'Kalapathar Beach', note: 'Relaxation' }
    ],
    kerala: [
      { title: 'Houseboat cruise', note: 'Backwaters overnight (if chosen)' },
      { title: 'Alleppey town & beach', note: 'Ayurveda massage optional' },
      { title: 'Kumarakom bird sanctuary', note: 'Nature walk' }
    ],
    'kerala-kochi': [
      { title: 'Fort Kochi walk', note: 'Chinese fishing nets, St. Francis Church' },
      { title: 'Mattancherry', note: 'Jew Town & Dutch Palace' },
      { title: 'Marine Drive Kochi', note: 'Evening boat cruise' }
    ],
    leh: [
      { title: 'Acclimatization & Leh Palace', note: 'Shanti Stupa sunset' },
      { title: 'Sham Valley tour', note: 'Hall of Fame, Magnetic Hill' },
      { title: 'Pangong or Nubra (permit req.)', note: 'Day trip or overnight' }
    ],
    rishikesh: [
      { title: 'Yoga & Ganga Aarti', note: 'Triveni Ghat' },
      { title: 'Rafting & Cafes', note: 'Laxman Jhula' },
      { title: 'Neer Garh waterfalls', note: 'Short trek' }
    ],
    darjeeling: [
      { title: 'Toy train & Zoo', note: 'Batasia Loop' },
      { title: 'Tiger Hill sunrise', note: 'Tea garden tour' },
      { title: 'Peace Pagoda & chowrasta', note: 'Shopping' }
    ],
    udaipur: [
      { title: 'City Palace & Jagdish Temple', note: 'Boat ride on Lake Pichola' },
      { title: 'Monsoon Palace & Fateh Sagar', note: 'Saheliyon-ki-Bari' },
      { title: 'Old city walk', note: 'Bagore-ki-Haveli show' }
    ],
    varanasi: [
      { title: 'Ghat walk & Kashi Vishwanath', note: 'Evening Ganga Aarti' },
      { title: 'Sarnath excursion', note: 'Buddhist sites' },
      { title: 'Boat ride at sunrise', note: 'Local breakfast chaat' }
    ],
    pondi: [
      { title: 'French Quarter & Promenade', note: 'Cafes' },
      { title: 'Auroville & Matrimandir (view)', note: 'Serenity Beach' },
      { title: 'Paradise Beach', note: 'Watersports optional' }
    ],
    shimla: [
      { title: 'Ridge & Mall Road', note: 'Christ Church' },
      { title: 'Kufri or Mashobra', note: 'Nature park' },
      { title: 'Toy train experience', note: 'To/from Solan' }
    ],
    hampi: [
      { title: 'Virupaksha & Hemakuta', note: 'Sunset point' },
      { title: 'Vittala Temple & Stone Chariot', note: 'Coracle ride' },
      { title: 'Lotus Mahal & Elephant Stables', note: 'Royal enclosure' }
    ]
  };
  const template = templates[destId] || templates.goa;
  // Tier-based activity modifiers
  const enrich = (item) => {
    if (tier === 'budget') return item; // humble
    if (tier === 'balanced') return { title: item.title + ' + guided visit', note: item.note };
    return { title: item.title + ' + private tour', note: item.note + '; premium experience' };
  };
  for (let i = 0; i < nights; i++) {
    plan.push(enrich(template[i % template.length]));
  }
  return plan;
}

function renderDetails(dest, context) {
  const { nights, style, budget } = context;
  const perNightBase = dest.baseCostPerNight[style];
  const miscBase = estimateTripCostPerNight(style);
  const baseTotal = (perNightBase + miscBase) * nights;
  const target = budget;
  const remaining = Math.max(0, target - baseTotal);
  const perDayAllocations = splitAmountAcrossDays(remaining, nights, style);
  const activitiesSum = perDayAllocations.reduce((a,b) => a + b, 0);
  const avgActivity = Math.round(activitiesSum / Math.max(1, nights));
  const perNight = perNightBase + miscBase + avgActivity;
  const total = baseTotal + activitiesSum;
  const hotels = pickHotels(dest.id, style);
  const dailyPlan = buildDailyPlan(dest.id, nights, style);
  const daily = dailyPlan.map((d, idx) => ({ ...d, estCost: perDayAllocations[idx] || 0 }));
  const badge = total <= budget ? 'Within budget' : `Over by ${rupee.format(total - budget)}`;
  const badgeClass = total <= budget ? 'badge-ok' : 'badge-warn';
  return `
    <div class="details-header">
      <img src="${getImageUrl(dest)}" alt="${dest.name}" loading="lazy" referrerpolicy="no-referrer" onerror="this.style.display='none'" />
      <div class="details-hero">
        <h2 id="details-title">${dest.name}, ${dest.state}</h2>
        <div>${dest.theme}</div>
        <div><strong>${rupee.format(perNight)}</strong> avg per night • ${nights} nights</div>
        <div>Total: <strong>${rupee.format(total)}</strong></div>
        <div class="subtitle">Activities vary daily (avg ${rupee.format(avgActivity)}/day)</div>
        <span class="badge ${badgeClass}">${badge}</span>
      </div>
    </div>
    <div class="details-body">
      <div>
        <h3 class="section-title">Suggested hotels</h3>
        <div class="hotel-list">
          ${hotels.map(h => `<div class=\"hotel-item\"><div class=\"name\">${h.name}</div><div class=\"note\">${h.note}</div></div>`).join('')}
        </div>
      </div>
      <div>
        <h3 class="section-title">Day-by-day plan</h3>
        <div class="day-list">
          ${daily.map((d, idx) => `<div class=\"day-item\"><div class=\"name\">Day ${idx+1}: ${d.title}</div><div class=\"note\">${d.note} • Est. spend: ${rupee.format(d.estCost)}</div></div>`).join('')}
        </div>
      </div>
    </div>
  `;
}

function splitAmountAcrossDays(totalAmount, nights, tier) {
  const days = Math.max(1, nights);
  if (totalAmount <= 0) return Array.from({ length: days }, () => 0);
  const base = totalAmount / days;
  const varianceFactor = tier === 'luxury' ? 0.5 : tier === 'balanced' ? 0.3 : 0.15; // up to +/- percentage
  const weights = [];
  for (let i = 0; i < days; i++) {
    const jitter = 1 + (Math.random() * 2 - 1) * varianceFactor; // between 1-variance and 1+variance
    weights.push(Math.max(0.2, jitter));
  }
  const sumWeights = weights.reduce((a,b) => a+b, 0);
  const raw = weights.map(w => (w / sumWeights) * totalAmount);
  // Round to integers and fix rounding error to match totalAmount exactly
  const rounded = raw.map(v => Math.floor(v));
  let diff = totalAmount - rounded.reduce((a,b) => a+b, 0);
  let idx = 0;
  while (diff > 0) {
    rounded[idx % days] += 1;
    idx += 1;
    diff -= 1;
  }
  return rounded;
}

function ensureImage(url, timeoutMs = 6000) {
  return new Promise((resolve, reject) => {
    try {
      const img = new Image();
      const timer = setTimeout(() => {
        cleanup();
        reject(new Error('image-timeout'));
      }, timeoutMs);
      const cleanup = () => { clearTimeout(timer); img.onload = null; img.onerror = null; };
      img.onload = () => { cleanup(); resolve(url); };
      img.onerror = () => { cleanup(); reject(new Error('image-error')); };
      img.referrerPolicy = 'no-referrer';
      img.src = url;
    } catch (err) {
      reject(err);
    }
  });
}

async function filterByWorkingImages(itineraries) {
  const checks = itineraries.map(async itin => {
    const url = getImageUrl(itin);
    try {
      await ensureImage(url, 5000);
      return itin;
    } catch (_) {
      // try keyword fallback explicitly
      try {
        const kw = imageFor(itin);
        await ensureImage(kw, 5000);
        return { ...itin, image: kw };
      } catch {
        // try generic India fallback (keep destination visible)
        const generic = 'https://source.unsplash.com/800x600/?India%20travel';
        try {
          await ensureImage(generic, 4000);
          return { ...itin, image: generic };
        } catch {
          return itin; // last resort: keep, card-level guard will hide image area
        }
      }
    }
  });
  const results = await Promise.all(checks);
  return results.filter(Boolean);
}


