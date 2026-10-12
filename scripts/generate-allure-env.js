const fs   = require('fs');
const path = require('path');

const resultsDir  = path.join(__dirname, '..', 'allure-results');
const historyDir  = path.join(__dirname, '..', 'allure-report', 'history');
const destHistory = path.join(resultsDir, 'history');

if (!fs.existsSync(resultsDir)) fs.mkdirSync(resultsDir, { recursive: true });

// Carry forward history from previous report so Trend widget populates
if (fs.existsSync(historyDir)) {
  fs.cpSync(historyDir, destHistory, { recursive: true });
  console.log('History copied for trend tracking.');
} else {
  console.log('No previous history found. Trend will start from this run.');
}

const executor = {
  name:       process.env.TESTER_NAME || process.env.USER || 'QA Team',
  type:       process.env.CI ? 'ci' : 'local',
  buildName:  process.env.CIRCLE_JOB || process.env.BUILD_TAG
                || `Local Run ${new Date().toISOString().slice(0, 10)}`,
  reportName: process.env.MODULE_NAME || 'Facebook Demo Suite',
};
fs.writeFileSync(path.join(resultsDir, 'executor.json'), JSON.stringify(executor, null, 2));

const env = [
  `Module=${process.env.MODULE_NAME || 'All'}`,
  `Environment=${process.env.ENV || 'stage'}`,
  `Tester=${process.env.TESTER_NAME || process.env.USER || 'QA Team'}`,
  `Date=${new Date().toLocaleDateString()}`,
  `Branch=${process.env.CIRCLE_BRANCH || process.env.GIT_BRANCH || 'local'}`,
].join('\n');
fs.writeFileSync(path.join(resultsDir, 'environment.properties'), env);

const categories = [
  { name: 'Flaky tests',     matchedStatuses: ['passed'], flaky: true },
  { name: 'Product defects', matchedStatuses: ['failed'] },
  { name: 'Test defects',    matchedStatuses: ['broken'] },
  { name: 'Skipped tests',   matchedStatuses: ['skipped'] },
];
fs.writeFileSync(
  path.join(resultsDir, 'categories.json'),
  JSON.stringify(categories, null, 2)
);

console.log('Allure env files written.');
