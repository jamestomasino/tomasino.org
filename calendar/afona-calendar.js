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

const MONTH_LENS = 60; // 5 weeks * 12 lens
const YEAR_LENS = 720; // 12 months * 60 lens
const LUTHANE_LENS = 12; // 1 extra week, 12 lens

// Year 1 is 1206, Year 821 is 2026
const EPOCH_START_YEAR = 1206;

function getAfonaYear(gregorianYear) {
  return gregorianYear - EPOCH_START_YEAR + 1;
}

function convertToAfona(date, duskLen) {
  const afonaYear = getAfonaYear(date.getFullYear());
  const dayOfYear = getDayOfYear(date);
  // DuskLen: false = Dawn-Dusk (6am-6pm), true = Dusk-Dawn (6pm-6am)
  // Each len is 12 hours, two lens per day.
  const totalLenIndex = ((dayOfYear - 1) * 2) + (duskLen ? 1 : 0); // 0 for Dawn-Dusk, 1 for Dusk-Dawn
  let output = '', week, len, month, relational;
  if (totalLenIndex < YEAR_LENS) {
    const monthIndex = Math.floor(totalLenIndex / MONTH_LENS);
    month = AFONA_MONTHS[monthIndex];
    relational = RELATIONAL[month];
    const lensInMonth = totalLenIndex % MONTH_LENS;
    week = Math.floor(lensInMonth / 12) + 1; // 1-based week, never > 5 in month
    len = AFONA_LEN[lensInMonth % 12];
    output = `The ${getOrdinal(week)} ${len} ${relational} ${month} in the ${getOrdinal(afonaYear)} year after Alliance.`;
  } else {
    month = 'Luthane';
    relational = RELATIONAL[month];
    const luthaneLen = totalLenIndex - YEAR_LENS;
    len = AFONA_LEN[luthaneLen % 12];
    output = `The ${len} ${relational} Luthane in the ${getOrdinal(afonaYear)} year after Alliance.`;
  }
  return output;
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

function updateAfonanDate() {
  const dateVal = dateInput.value;
  const duskLen = lenToggle.checked;
  if (!dateVal) return;
  const date = new Date(dateVal + "T00:00:00");
  const afonanDate = convertToAfona(date, duskLen);
  document.getElementById('afonan-date').textContent = afonanDate;
}
dateInput.addEventListener('change', updateAfonanDate);
lenToggle.addEventListener('change', updateAfonanDate);
updateAfonanDate();
