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
    month: 'Frunel', week: 1, len: 'Solun', period: false,
    title: 'Viriluin', // Afonan title
    description: 'Ceremonies and feasts celebrating the return of light after the longest night.'
  },
  {
    month: 'Calia', week: 2, len: 'Sylara', period: false,
    title: 'Sylithra',
    description: 'Lantern festival at midsummer, floating lanterns for unity and guidance.'
  },
  {
    month: 'Graven', week: 4, len: 'Eoryth', period: false,
    title: 'Eoryneth',
    description: 'Mist lamps lit for ancestor remembrance in mountain homes.'
  },
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
  const afonaYear = getAfonaYear(date.getFullYear());
  const dayOfYear = getDayOfYear(date);
  const totalLenIndex = ((dayOfYear - 1) * 2) + (duskLen ? 1 : 0);
  let output = '', week, len, month, relational, holidayFound;
  let isLuthanePeriod = false;

  if (totalLenIndex < YEAR_LENS) {
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
  } else {
    month = 'Luthane';
    relational = RELATIONAL[month];
    isLuthanePeriod = true;
    const luthaneLen = totalLenIndex - YEAR_LENS;
    len = AFONA_LEN[luthaneLen % 12];
    output = `The <span class="len">${abbrLen(len)}</span> ${relational} <span class="month">${abbrMonth(month)}</span> in the ${getOrdinal(afonaYear)} year after Alliance.`;
    output += `<div class="holiday"><span style="font-weight:bold;">Holiday:</span> <span style="font-style:italic;"><abbr title="Out-of-time rituals, communal reflection, and ancestor honor.">Luthane Festival</abbr></span></div>`;
  }

  return output;
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
