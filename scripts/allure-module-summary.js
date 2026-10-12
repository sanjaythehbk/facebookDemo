const fs            = require('fs');
const path          = require('path');
const { execSync }  = require('child_process');

const resultsDir  = path.join(__dirname, '..', 'allure-results');
const summaryFile = path.join(resultsDir, 'module-summary.json');
const trendFile   = path.join(__dirname, '..', 'allure-report', 'history', 'trend-data.json');

// Map git author emails to display names. Add teammates here.
const TEAM = {
  'sanjay.biswal@albertinvent.com': 'Sanjay Kumar Biswal',
};

// Tests with no resolvable git author fall under this owner
const DEFAULT_AUTHOR = 'sanjay.biswal@albertinvent.com';

const displayName = (email) => TEAM[email] || email;

// Helpers
function getModule(fullName = '') {
  const match = fullName.match(/tests\/web\/([^/]+)\//i)
    || fullName.match(/tests\/([^/]+)\//i);
  if (!match) return 'Other';
  const raw = match[1];
  return raw.charAt(0).toUpperCase() + raw.slice(1);
}

function resolveSpecPath(fullName = '') {
  const match = fullName.match(/(tests\/.+?\.spec\.js)/i);
  return match ? match[1] : null;
}

function fmtDuration(ms) {
  if (!ms || ms < 0) return 'N/A';
  if (ms < 1000)     return `${ms}ms`;
  if (ms < 60000)    return `${(ms / 1000).toFixed(1)}s`;
  const m = Math.floor(ms / 60000);
  const s = ((ms % 60000) / 1000).toFixed(0);
  return `${m}m ${s}s`;
}

function getLineAuthor(filePath, line) {
  if (!line) return null;
  try {
    const out = execSync(
      `git log -s -L ${line},${line}:${filePath} --format="%ae"`,
      { encoding: 'utf8', stdio: ['pipe', 'pipe', 'pipe'] }
    );
    const email = out.split('\n').map(e => e.trim()).find(e => e.includes('@'));
    return email || null;
  } catch {
    return null;
  }
}

function getFileAuthor(filePath) {
  try {
    const out = execSync(
      `git log -1 --format="%ae" -- ${filePath}`,
      { encoding: 'utf8', stdio: ['pipe', 'pipe', 'pipe'] }
    );
    return out.trim() || null;
  } catch {
    return null;
  }
}

// Parse all result files
const files = fs.existsSync(resultsDir)
  ? fs.readdirSync(resultsDir).filter(f => f.endsWith('-result.json'))
  : [];

const testerMap  = {};
const globalStats = { total: 0, pass: 0, fail: 0, broken: 0, skipped: 0, flaky: 0, totalMs: 0 };

for (const file of files) {
  const data     = JSON.parse(fs.readFileSync(path.join(resultsDir, file), 'utf8'));
  const mod      = getModule(data.fullName || '');
  const specPath = resolveSpecPath(data.fullName || '');
  const dur      = data.start && data.stop ? data.stop - data.start : null;
  const flaky    = !!(data.statusDetails?.flaky);
  const status   = data.status || 'unknown';

  const failMsg   = data.statusDetails?.message || '';
  const lineMatch = failMsg.match(/:(\d+):\d+/);
  const line      = lineMatch ? parseInt(lineMatch[1]) : null;

  let authorEmail = null;
  if (specPath) {
    authorEmail = getLineAuthor(specPath, line) || getFileAuthor(specPath);
  }
  authorEmail = authorEmail || DEFAULT_AUTHOR;

  globalStats.total++;
  if (status === 'passed')  globalStats.pass++;
  if (status === 'failed')  globalStats.fail++;
  if (status === 'broken')  globalStats.broken++;
  if (status === 'skipped') globalStats.skipped++;
  if (flaky)                globalStats.flaky++;
  if (dur)                  globalStats.totalMs += dur;

  if (!testerMap[authorEmail]) testerMap[authorEmail] = {};
  if (!testerMap[authorEmail][mod]) {
    testerMap[authorEmail][mod] = { pass: 0, fail: 0, broken: 0, skipped: 0, flaky: 0, totalMs: 0, tests: [] };
  }
  const m = testerMap[authorEmail][mod];
  if (status === 'passed')  m.pass++;
  if (status === 'failed')  m.fail++;
  if (status === 'broken')  m.broken++;
  if (status === 'skipped') m.skipped++;
  if (flaky)                m.flaky++;
  if (dur)                  m.totalMs += dur;

  m.tests.push({ name: (data.name || '').slice(0, 80), status, flaky, durationMs: dur, duration: fmtDuration(dur) });
}

for (const modules of Object.values(testerMap)) {
  for (const m of Object.values(modules)) {
    m.tests.sort((a, b) => (b.durationMs || 0) - (a.durationMs || 0));
  }
}

const summary = { generatedAt: new Date().toISOString(), globalStats, testers: testerMap };
fs.writeFileSync(summaryFile, JSON.stringify(summary, null, 2));
console.log(`Summary written to ${summaryFile}`);

let trend = [];
if (fs.existsSync(trendFile)) {
  try { trend = JSON.parse(fs.readFileSync(trendFile, 'utf8')); } catch {}
}
trend.push({
  date:    new Date().toISOString(),
  ...globalStats,
  modules: [...new Set(Object.values(testerMap).flatMap(t => Object.keys(t)))],
});
if (trend.length > 30) trend = trend.slice(-30);
fs.mkdirSync(path.dirname(trendFile), { recursive: true });
fs.writeFileSync(trendFile, JSON.stringify(trend, null, 2));
console.log(`Trend updated at ${trendFile} (${trend.length} runs)`);

module.exports = { summary, testerMap, globalStats, displayName, fmtDuration };
