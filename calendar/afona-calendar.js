const AFONA_MONTHS = [
  'Frunel','Thirune','Eldurn','Falaris','Lysan',
  'Hembric','Verrin','Calia','Serinil','Damaris','Graven','Obrinth'
];

const RELATIONAL = {
  'Frunel': 'under','Thirune':'under','Eldurn':'under','Falaris':'under','Lysan':'under',
  'Hembric':'of','Verrin':'under','Calia':'under','Serinil':'under',
  'Damaris':'of','Graven':'under','Obrinth':'of','Luthane':'during'
};

const AFONA_LEN = [
  'Solun','Noctira','Varka','Shadda','Myrrin','Eoryth',
  'Zarun','Duskane','Tharka','Velora','Aminel','Sylara'
];

const MONTH_MEANINGS = {
  'Frunel': 'Deep winter; renewal and the return of light',
  'Thirune': 'First thaw; awakening and hope',
  'Eldurn': 'River surge; breaking ice and fiery renewal',
  'Falaris': 'Spring; budding, promise, new growth',
  'Lysan': 'River at full rush; sparkling warmth',
  'Hembric': 'Trade season; legendary explorer Hembric',
  'Verrin': 'Thunder; storm, hunting, festivals',
  'Calia': 'Midsummer bounty; abundance and celebration',
  'Serinil': 'Early harvest; winnowing, cool winds',
  'Damaris': 'Alliance and unity; captain Damaris',
  'Graven': 'Mists and migration; quiet remembrance',
  'Obrinth': 'Closing year; snow, ancestors, reflection',
  'Luthane': 'Days Between; liminal week outside the calendar'
};

const LEN_MEANINGS = {
  'Solun': 'Renewal, sun, new beginnings',
  'Noctira': 'Night guardian, dreams, protection',
  'Varka': 'River goddess, commerce, life',
  'Shadda': 'Shadow, hidden currents, safety',
  'Myrrin': 'Mountain mist, ancestors, clarity',
  'Eoryth': 'Dusk, echo, transition, remembrance',
  'Zarun': 'Market, gathering, trade',
  'Duskane': 'Bonding, oaths, alliances, closure',
  'Tharka': 'Fields, harvest, growth',
  'Velora': 'Veil, fertility, hidden blessings',
  'Aminel': 'Wisdom, contemplation, prophecy',
  'Sylara': 'Forest mysteries, stories, mysticism'
};

const AFONA_HOLIDAYS = [
  {
    month: 'Frunel', week: 1, len: 'Solun',
    title: 'Return of Light (Viriluin)', // Afonan title
    description: 'Ceremonies and feasts celebrating the return of light after the longest night.'
  },
  {
    month: 'Calia', week: 2, len: 'Sylara',
    title: 'Festival of Lanterns (Sylithra)',
    description: 'Lantern festival at midsummer, floating lanterns for unity and guidance.'
  },
  {
    month: 'Graven', week: 4, len: 'Eoryth',
    title: 'Mist\'s Return (Eoryneth)',
    description: 'Mist lamps lit for ancestor remembrance in mountain homes.'
  },
  {
    month: 'Thirune', week: 3, len: 'Noctira',
    title: 'Wanderer\'s Vigil (Norathen)',
    description: 'Vigil for travelers on thawing trails; northern riverfolk light lanterns for safe return.'
  },
  {
    month: 'Hembric', week: 1, len: 'Tharka',
    title: "Hembric’s Voyage (Hembrikuin)",
    description: 'Parades and river regattas commemorating Hembric’s canal expedition; contracts renewed.'
  },
  {
    month: 'Damaris', week: 1, len: 'Duskane',
    title: "Joining Eve (Kaviral)",
    description: 'Clan alliance renewal—oath feasts, gathering of clan leaders, origin legal charters.'
  },
  {
    month: 'Obrinth', week: 5, len: 'Aminel',
    title: "Grand Reckoning (Obrithain)",
    description: 'Ledgers closed, debts settled, ancestor honoring, and winter stores shared.'
  },
  {
    month: 'Falaris', week: 1, len: 'Eoryth',
    title: "Forebears’ Promise (Halvesset)",
    description: 'Sworn homage to founding ancestors; river stone offerings, youth naming ceremonies.'
  },
  {
    month: 'Serinil', week: 3, len: 'Varka',
    title: "Grain Crossing (Varkhuma)",
    description: 'Grain barge festival; southern merchants race loaded skiffs to mark harvest peak/trade closing.'
  },
  {
    month: 'Thirune', week: 4, len: 'Myrrin',
    title: "Rootwater Day (Tornulin)",
    description: 'Soil blessing and feasts—descendants of canal laborers honor the imported plants that now thrive.'
  },
  {
    month: 'Frunel', week: 5, len: 'Noctira',
    title: "Icefall Vigil (Sennoryth)",
    description: 'Northmost villages watch the final ice calving and make offerings for the health of river trade.'
  },
  {
    month: 'Verrin', week: 2, len: 'Solun',
    title: "Emberlength (Calythel)",
    description: 'Fire-dance and poetry night for diaspora kin, celebrating resilience and shared stories.'
  },
  {
    month: 'Hembric', week: 5, len: 'Zarun',
    title: "Grand Portage (Yamarin)",
    description: 'Accounts and port records reviewed, grand market auction, honors for river pilots.'
  },
  {
    month: 'Verrin', week: 4, len: 'Tharka',
    title: "Raincall (Felynthir)",
    description: 'Choral gathering to request “just enough” flood; legend says river gods choose the balance.'
  },
  {
    month: 'Damaris', week: 3, len: 'Solun',
    title: "Memory Dawn (Jonareth)",
    description: 'Morning songs at graves and riverside shrines; sharing food with departed kin.'
  }
];

const MONTH_LENS = 60; // 5 weeks * 12 lens
const YEAR_LENS = 720; // 12 months * 60 lens
const LUTHANE_LENS = 12; // 1 extra week, 12 lens

// Year 1 is 1206, Year 821 is 2026
const EPOCH_START_YEAR = 1206;

function getAfonaYear(gregorianYear) {
  return gregorianYear - EPOCH_START_YEAR + 1;
}

function abbrMonth(name) {
  return `<abbr title="${MONTH_MEANINGS[name] || ''}">${name}</abbr>`;
}

function abbrLen(name) {
  return `<abbr title="${LEN_MEANINGS[name] || ''}">${name}</abbr>`;
}

function convertToAfona(date, duskLen) {
  const y = date.getFullYear();
  const isLeap = new Date(y, 1, 29).getMonth() === 1;
  const luthaneStart = new Date(y, 11, isLeap ? 20 : 21); // Dec 20 in leap years, Dec 21 otherwise
  const luthaneDays = isLeap ? 6 : 5;
  const luthaneEnd = new Date(luthaneStart.getTime() + luthaneDays * 86400000);

  // Determine Afona calendar year start based on solstice/Luthane
  let solsticeYear = y;
  if (date < luthaneStart) solsticeYear = y - 1; // Use previous Afona year if before Luthane

  // Recalculate everything around solsticeYear
  const isLeapSolstice = new Date(solsticeYear, 1, 29).getMonth() === 1;
  const luthaneStartSolstice = new Date(solsticeYear, 11, isLeapSolstice ? 20 : 21);
  const luthaneDaysSolstice = isLeapSolstice ? 6 : 5;
  const luthaneEndSolstice = new Date(luthaneStartSolstice.getTime() + luthaneDaysSolstice * 86400000);

  let afonaYear = solsticeYear - EPOCH_START_YEAR + 2;

  // Luthane period: date between start and end (inclusive of start, exclusive of end)
  if (date >= luthaneStartSolstice && date < luthaneEndSolstice) {
    const luthaneDay = Math.floor((date - luthaneStartSolstice) / 86400000);
    const lenIndex = (luthaneDay * 2) + (duskLen ? 1 : 0);
    const len = AFONA_LEN[lenIndex % 12];
    let output = `The <span class="len">${abbrLen(len)}</span> during <span class="month">${abbrMonth("Luthane")}</span> in the ${getOrdinal(afonaYear)} year after Alliance.`;
    output += `<div class="holiday"><span style="font-weight:bold;">Holiday:</span> <span style="font-style:italic;"><abbr title="Out-of-time rituals, communal reflection, and ancestor honor.">Luthane Festival</abbr></span></div>`;
    return output;
  }

  // After Luthane: start calendar with Frunel
  const afonaYearStart = luthaneEndSolstice;
  const daysSinceStart = Math.floor((date - afonaYearStart) / 86400000);
  const totalLenIndex = (daysSinceStart * 2) + (duskLen ? 1 : 0);

  let output = '', week, len, month, relational, holidayFound;
  if (totalLenIndex >= 0 && totalLenIndex < YEAR_LENS) {
    const monthIndex = Math.floor(totalLenIndex / MONTH_LENS);
    month = AFONA_MONTHS[monthIndex];
    relational = RELATIONAL[month];
    const lensInMonth = totalLenIndex % MONTH_LENS;
    week = Math.floor(lensInMonth / 12) + 1;
    len = AFONA_LEN[lensInMonth % 12];
    output = `The ${getOrdinal(week)} <span class="len">${abbrLen(len)}</span> ${relational} <span class="month">${abbrMonth(month)}</span> in the ${getOrdinal(afonaYear)} year after Alliance.`;
    holidayFound = getMatchingHoliday(month, week, len);
    if (holidayFound) {
      output += `<div class="holiday"><span style="font-weight:bold;">Holiday:</span> <span style="font-style:italic;"><abbr title="${holidayFound.description}">${holidayFound.title}</abbr></span></div>`;
    }
    return output;
  } else {
    // Previous year’s late months: calculate using previous year
    // You may wish to wrap around or indicate last month/week/len of prior year here
    return "Date exceeds Afona calendar year range.";
  }
}

function updateAfonanDate() {
  const dateVal = dateInput.value;
  const duskLen = lenToggle.checked;
  if (!dateVal) return;
  const date = new Date(dateVal + "T00:00:00");
  const afonanDate = convertToAfona(date, duskLen);
  document.getElementById('afonan-date').innerHTML = afonanDate;
}

function getDayOfYear(date) {
  const start = new Date(date.getFullYear(), 0, 0);
  const diff = date - start;
  const oneDay = 1000 * 60 * 60 * 24;
  return Math.floor(diff / oneDay);
}

function getOrdinal(n) {
  const s=["th","st","nd","rd"], v=n%100;
  return n+(s[(v-20)%10]||s[v]||s[0]);
}

function getMatchingHoliday(month, week, len) {
  return AFONA_HOLIDAYS.find(holiday =>
    holiday.month === month &&
    holiday.len === len &&
    holiday.week === week
  )
}

// Default to now
const dateInput = document.getElementById('gregorian-date');
const lenToggle = document.getElementById('len-toggle');
const today = new Date();

dateInput.value = today.toISOString().split('T')[0];

function isDuskLenDefault() {
  // If current hour is between 18:00–5:59, default Dusk-Dawn (checked)
  const nowHour = today.getHours();
  return (nowHour >= 18 || nowHour < 6);
}
lenToggle.checked = isDuskLenDefault();

dateInput.addEventListener('change', updateAfonanDate);
lenToggle.addEventListener('change', updateAfonanDate);
updateAfonanDate();


const holidaysBtn = document.getElementById('holidays-btn');
const lenBtn = document.getElementById('len-btn');
const monthBtn = document.getElementById('month-btn');
const infoOutput = document.getElementById('info-output');

function sortHolidays(holidays) {
  // Orders by month index, week then len index
  const monthOrder = AFONA_MONTHS.concat(['Luthane']);
  const lenOrder = AFONA_LEN;
  return holidays.slice().sort((a, b) => {
    const miA = monthOrder.indexOf(a.month), miB = monthOrder.indexOf(b.month);
    if (miA !== miB) return miA - miB;
    if ((a.week || 0) !== (b.week || 0)) return (a.week || 0) - (b.week || 0);
    const liA = lenOrder.indexOf(a.len), liB = lenOrder.indexOf(b.len);
    return liA - liB;
  });
}

function showHolidays() {
  const sorted = sortHolidays(AFONA_HOLIDAYS).filter(h => h.month !== 'Luthane');
  let out = '<div class="info-title">Afonan Holidays (calendar order)</div><ul class="info-list">';
  sorted.forEach(h => {
    const relational = RELATIONAL[h.month];
    let phrase = `The ${getOrdinal(h.week)} <span class="len">${abbrLen(h.len)}</span> ${relational} <span class="month">${abbrMonth(h.month)}</span>`;
    out += `<li>
      ${phrase}:
      <span style="font-weight:bold;"><abbr title="${h.description}">${h.title}</abbr></span>
    </li>`;
  });
  // Manually append Luthane Festival
  out += `<li>
    The week during <span class="month">Luthane</span>:
    <span style="font-weight:bold;"><abbr title="Out-of-time rites for unions and commitments; communal feasts, vows, and new partnerships celebrated">Luthane Festival (Helkavrin)</abbr></span>
  </li>`;
  out += '</ul>';
  infoOutput.innerHTML = out;
}

function showLenOfWeek() {
  let out = "<div class='info-title'>Len of the Week</div>";
  out += "<p>There are 12 lens in a week, each being 12 hours in length. From dawn until dusk is one len, and from dusk until dawn is the next.</p>";
  out += "<ol class='info-list'>"
  // Daytime: Even-indexed, starting at 0
  AFONA_LEN.forEach((l, i) => {
    out += `<li ${i % 2 ? "class='day-len'" : "class='night-len'"}><abbr title="${LEN_MEANINGS[l] || ''}">${l}</abbr></li>`;
  });
  out += "</ol>";
  infoOutput.innerHTML = out;
}

function showMonthNames() {
  let out = "<div class='info-title'>Month Names</div>";
  out += "<p>Each month is 5 weeks of 12 lens (equivalent to 30 days). The winter solstice begins Luthane, a liminal week outside of calendar time of either 10 or 12 len.</p>";
  out += "<ol class='info-list'>";
  AFONA_MONTHS.forEach(m =>
    out += `<li><abbr title="${MONTH_MEANINGS[m] || ''}">${m}</abbr></li>`
  );
  // Special Luthane entry
  out += `<li class="luthane-month">Luthane - ${MONTH_MEANINGS['Luthane']}</li>`;
  out += "</ol>";
  infoOutput.innerHTML = out;
}

// Attach listeners
let activeTab = null;

holidaysBtn.addEventListener('click', () => {
  if (activeTab === 'holidays') {
    infoOutput.innerHTML = '';
    activeTab = null;
  } else {
    showHolidays();
    activeTab = 'holidays';
  }
});
lenBtn.addEventListener('click', () => {
  if (activeTab === 'len') {
    infoOutput.innerHTML = '';
    activeTab = null;
  } else {
    showLenOfWeek();
    activeTab = 'len';
  }
});
monthBtn.addEventListener('click', () => {
  if (activeTab === 'month') {
    infoOutput.innerHTML = '';
    activeTab = null;
  } else {
    showMonthNames();
    activeTab = 'month';
  }
});

function setActiveButton(btnId) {
  document.querySelectorAll('.button-row button').forEach(b => b.classList.remove('active'));
  if (btnId) document.getElementById(btnId).classList.add('active');
}

// In each event handler, after updating .innerHTML...
setActiveButton(activeTab ? btnIdForTab(activeTab) : null);

function btnIdForTab(tabname) {
  return tabname === 'holidays' ? 'holidays-btn' :
         tabname === 'len' ? 'len-btn' :
         tabname === 'month' ? 'month-btn' : null;
}
