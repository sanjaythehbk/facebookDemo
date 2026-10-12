const path = require('path');
const fs   = require('fs');

// Run summary generation first so module-summary.json is fresh
require('./allure-module-summary');

const summaryFile = path.join(__dirname, '..', 'allure-results', 'module-summary.json');

// Team config. Map git author emails to display names and (optionally) Teams AAD ids for @mentions.
const TEAM = {
  'sanjay.biswal@albertinvent.com': 'Sanjay Kumar Biswal',
};

const AAD_IDS = {
  'sanjay.biswal@albertinvent.com': 'FILL_IN_AAD_ID',
};

const displayName = (email) => TEAM[email] || email;

function fmtDuration(ms) {
  if (!ms || ms < 0) return 'N/A';
  if (ms < 1000)     return `${ms}ms`;
  if (ms < 60000)    return `${(ms / 1000).toFixed(1)}s`;
  const m = Math.floor(ms / 60000);
  const s = ((ms % 60000) / 1000).toFixed(0);
  return `${m}m ${s}s`;
}

function statCol(label, value, color) {
  return {
    type:  'Column',
    width: 'auto',
    items: [
      { type: 'TextBlock', text: value, weight: 'Bolder', color, horizontalAlignment: 'Center' },
      { type: 'TextBlock', text: label, size: 'Small', isSubtle: true, horizontalAlignment: 'Center', spacing: 'None' },
    ],
  };
}

function buildDashboardCard(summary) {
  const g    = summary.globalStats;
  const date = new Date(summary.generatedAt).toLocaleString('en-GB', { dateStyle: 'medium', timeStyle: 'short' });
  const env  = process.env.ENV || 'stage';
  const passRate = g.total > 0 ? ((g.pass / (g.total - g.skipped || 1)) * 100).toFixed(1) : '0.0';
  const statusColor = g.fail > 0 || g.broken > 0 ? 'attention' : 'good';

  const headerBlock = {
    type:  'Container',
    style: statusColor,
    bleed: true,
    items: [{
      type: 'ColumnSet',
      columns: [{
        type: 'Column', width: 'stretch',
        items: [
          { type: 'TextBlock', text: 'FACEBOOK DEMO QA DASHBOARD', weight: 'Bolder', size: 'Large', color: 'Light' },
          { type: 'TextBlock', text: `${date}  |  ${env}`, size: 'Small', color: 'Light', spacing: 'None' },
        ],
      }],
    }],
  };

  const statsBlock = {
    type:    'ColumnSet',
    spacing: 'Medium',
    columns: [
      statCol('Total',     String(g.total),            'Default'),
      statCol('Passed',    String(g.pass),             'Good'),
      statCol('Failed',    String(g.fail + g.broken),  'Attention'),
      statCol('Flaky',     String(g.flaky),            'Warning'),
      statCol('Skipped',   String(g.skipped),          'Subtle'),
      statCol('Pass Rate', `${passRate}%`,             g.fail > 0 ? 'Attention' : 'Good'),
      statCol('Duration',  fmtDuration(g.totalMs),     'Default'),
    ],
  };

  const testerBlocks = [];
  const mentionedEmails = [];

  for (const [email, modules] of Object.entries(summary.testers)) {
    const name      = displayName(email);
    const allPassed = Object.values(modules).every(m => m.fail === 0 && m.broken === 0);
    mentionedEmails.push(email);

    testerBlocks.push({
      type: 'Container', separator: true, spacing: 'Medium', style: 'emphasis',
      items: [{
        type: 'ColumnSet',
        columns: [
          { type: 'Column', width: 'stretch', items: [{ type: 'TextBlock', text: name, weight: 'Bolder', size: 'Medium' }] },
          { type: 'Column', width: 'auto', items: [{ type: 'TextBlock', text: allPassed ? 'All passed' : 'Has failures', color: allPassed ? 'Good' : 'Attention', weight: 'Bolder' }] },
        ],
      }],
    });

    for (const [modName, stats] of Object.entries(modules)) {
      const modTotal = stats.pass + stats.fail + stats.broken + stats.skipped;
      const hasFails = stats.fail > 0 || stats.broken > 0;

      testerBlocks.push({
        type: 'Container', spacing: 'Small',
        items: [{
          type: 'ColumnSet',
          columns: [
            { type: 'Column', width: '120px', items: [{ type: 'TextBlock', text: modName, weight: 'Bolder' }] },
            { type: 'Column', width: 'auto',  items: [{ type: 'TextBlock', text: `Total: ${modTotal}`, isSubtle: true }] },
            { type: 'Column', width: 'auto',  items: [{ type: 'TextBlock', text: `Pass ${stats.pass}`, color: 'Good' }] },
            { type: 'Column', width: 'auto',  items: [{ type: 'TextBlock', text: `Fail ${stats.fail + stats.broken}`, color: hasFails ? 'Attention' : 'Default' }] },
            { type: 'Column', width: 'auto',  items: [{ type: 'TextBlock', text: `Flaky ${stats.flaky}`, color: stats.flaky > 0 ? 'Warning' : 'Default' }] },
            { type: 'Column', width: 'auto',  items: [{ type: 'TextBlock', text: fmtDuration(stats.totalMs), isSubtle: true }] },
          ],
        }],
      });

      const failedTests = stats.tests.filter(t => t.status === 'failed' || t.status === 'broken' || t.flaky);
      if (failedTests.length > 0) {
        testerBlocks.push({
          type: 'Container', spacing: 'None', isVisible: false, id: `${email}-${modName}-failures`,
          items: failedTests.map(t => ({
            type: 'ColumnSet', spacing: 'Small',
            columns: [
              { type: 'Column', width: 'auto',    items: [{ type: 'TextBlock', text: t.flaky ? 'FLAKY' : 'FAIL', color: t.flaky ? 'Warning' : 'Attention', size: 'Small' }] },
              { type: 'Column', width: 'stretch', items: [{ type: 'TextBlock', text: t.name, wrap: true, size: 'Small', isSubtle: true }] },
              { type: 'Column', width: 'auto',    items: [{ type: 'TextBlock', text: t.duration, size: 'Small', isSubtle: true }] },
            ],
          })),
        });
        testerBlocks.push({
          type: 'ActionSet', spacing: 'None',
          actions: [{ type: 'Action.ToggleVisibility', title: `Show ${failedTests.length} issue(s) in ${modName}`, targetElements: [`${email}-${modName}-failures`] }],
        });
      }
    }
  }

  const entities = mentionedEmails
    .filter(e => AAD_IDS[e] && AAD_IDS[e] !== 'FILL_IN_AAD_ID')
    .map(e => ({ type: 'mention', text: `<at>${displayName(e)}</at>`, mentioned: { id: AAD_IDS[e], name: displayName(e) } }));

  return {
    $schema: 'http://adaptivecards.io/schemas/adaptive-card.json',
    type:    'AdaptiveCard',
    version: '1.4',
    msteams: { entities },
    body:    [headerBlock, statsBlock, ...testerBlocks],
  };
}

async function sendToTeams(card) {
  const webhookUrl = process.env.TEAMS_WEBHOOK_URL;
  if (!webhookUrl) {
    console.log('TEAMS_WEBHOOK_URL not set. Skipping Teams notification.');
    return;
  }
  try {
    const response = await fetch(webhookUrl, {
      method:  'POST',
      headers: { 'Content-Type': 'application/json' },
      body:    JSON.stringify(card),
    });
    if (response.ok) {
      console.log('Dashboard card sent to MS Teams.');
    } else {
      console.error('Failed to send Teams card:', response.status, await response.text());
    }
  } catch (err) {
    console.error('Error sending to MS Teams:', err);
  }
}

async function main() {
  if (!fs.existsSync(summaryFile)) {
    console.error('module-summary.json not found. Run allure-module-summary.js first.');
    process.exit(1);
  }

  const summary = JSON.parse(fs.readFileSync(summaryFile, 'utf8'));
  const card    = buildDashboardCard(summary);

  const g = summary.globalStats;
  console.log('\n=== FACEBOOK DEMO QA DASHBOARD ===');
  console.log(`  Total: ${g.total}  Pass ${g.pass}  Fail ${g.fail + g.broken}  Flaky ${g.flaky}  Skipped ${g.skipped}  Time: ${fmtDuration(g.totalMs)}\n`);

  for (const [email, modules] of Object.entries(summary.testers)) {
    console.log(`  ${displayName(email)}`);
    for (const [mod, stats] of Object.entries(modules)) {
      const total = stats.pass + stats.fail + stats.broken + stats.skipped;
      console.log(`     ${mod.padEnd(18)} Total:${total}  Pass ${stats.pass}  Fail ${stats.fail + stats.broken}  Flaky ${stats.flaky}  Skipped ${stats.skipped}  ${fmtDuration(stats.totalMs)}`);
      stats.tests.filter(t => t.status !== 'passed' || t.flaky).forEach(t => {
        console.log(`       ${t.flaky ? 'FLAKY' : 'FAIL '} ${t.duration.padStart(6)}  ${t.name}`);
      });
    }
    console.log('');
  }

  await sendToTeams(card);
}

main();
