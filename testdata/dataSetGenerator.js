// Optimized test data generator using faker library
import { log } from "node:console";
const { faker } = require('@faker-js/faker');
const fs = require('fs');
const path = require('path');

// Data templates for static values
const STATIC_DATA = {
  user: {
    name: "Demo Tester",
    email: "demo.tester.qa.12345@example.com",
    role: "Tester",
    department: "QA"
  },
  signup: {
    firstName: "Demo",
    lastName: "Tester",
    emailOrMobile: "demo.tester.qa.12345@example.com",
    password: "DemoPass!2026",
    birthday: { day: 15, month: 6, year: 1995 },
    genderIndex: 1
  },
  post: {
    text: "Hello from the Playwright demo suite",
    visibility: "Only me"
  },
  search: {
    query: "Playwright"
  }
};

// Faker generators
const FAKER_GENERATORS = {
  user: () => ({
    name: faker.person.fullName(),
    email: faker.internet.email(),
    role: faker.person.jobType(),
    department: faker.commerce.department()
  }),
  signup: () => ({
    firstName: faker.person.firstName(),
    lastName: faker.person.lastName(),
    emailOrMobile: faker.internet.email({ provider: 'example.com' }),
    password: `${faker.internet.password({ length: 12 })}!1`,
    birthday: {
      day: faker.number.int({ min: 1, max: 28 }),
      month: faker.number.int({ min: 1, max: 12 }),
      year: faker.number.int({ min: 1970, max: 2000 })
    },
    genderIndex: faker.number.int({ min: 1, max: 2 })
  }),
  post: () => ({
    text: faker.lorem.sentence(),
    visibility: "Only me"
  }),
  search: () => ({
    query: faker.lorem.word()
  })
};

// Generic data generator
function generateData(type, useFaker = true) {
  const data = useFaker ? FAKER_GENERATORS[type]() : STATIC_DATA[type];
  log(`${useFaker ? 'Faker' : 'Static'} generated ${type} data`);
  return data;
}

// Specific data generators
function generateUserData(useFaker = true) { return { users: { user1: generateData('user', useFaker) } }; }
function generateSignupData(useFaker = true) { return { signup: generateData('signup', useFaker) }; }
function generatePostData(useFaker = true) { return { post: generateData('post', useFaker) }; }
function generateSearchData(useFaker = true) { return { search: generateData('search', useFaker) }; }

function generateAllTestData(useFaker = true) {
  log(`Generating all test data with Faker: ${useFaker}`);
  return {
    ...generateUserData(useFaker),
    ...generateSignupData(useFaker),
    ...generatePostData(useFaker),
    ...generateSearchData(useFaker)
  };
}

// Read existing data
function readExistingTestData() {
  try {
    const filePath = path.join(__dirname, 'testdata.json');
    return fs.existsSync(filePath) ? JSON.parse(fs.readFileSync(filePath, 'utf8')) : {};
  } catch (error) {
    console.error('Error reading existing test data:', error.message);
    return {};
  }
}

// Controlled functions: return existing data unless faker is requested
function generateUserDataControlled(faker = false) {
  const existingData = readExistingTestData();
  if (!faker && existingData.users) {
    log('Returning existing user data from testdata.json');
    return { users: existingData.users };
  }
  return generateUserData(faker);
}

function generateSignupDataControlled(faker = false) {
  const existingData = readExistingTestData();
  if (!faker && existingData.signup) {
    log('Returning existing signup data from testdata.json');
    return { signup: existingData.signup };
  }
  return generateSignupData(faker);
}

function generateAllTestDataControlled(faker = false) {
  if (!faker) {
    const existingData = readExistingTestData();
    const result = {};
    const modules = ['users', 'signup', 'post', 'search'];

    modules.forEach(module => {
      if (existingData[module]) result[module] = existingData[module];
    });

    if (Object.keys(result).length) {
      log('Returning existing test data from testdata.json');
      return result;
    }
  }

  return generateAllTestData(faker);
}

// Module mapping for smart retrieval
const MODULE_MAP = {
  user: 'users', users: 'users',
  signup: 'signup',
  post: 'post', posts: 'post',
  search: 'search',
  login: 'login',
  forgotpassword: 'forgotPassword',
  profile: 'profile',
  viewport: 'viewport'
};

function getExistingModuleData(moduleName) {
  const existingData = readExistingTestData();
  const dataKey = MODULE_MAP[moduleName.toLowerCase()];

  if (dataKey && existingData[dataKey]) {
    log(`Returning existing ${moduleName} data from testdata.json`);
    return { [dataKey]: existingData[dataKey] };
  }

  log(`No existing data found for module: ${moduleName}`);
  return null;
}

// Update function
function updateSpecificDataType(dataType, useFaker = true) {
  try {
    const existingData = readExistingTestData();
    const dataMap = {
      user: () => generateUserData(useFaker), users: () => generateUserData(useFaker),
      signup: () => generateSignupData(useFaker),
      post: () => generatePostData(useFaker), posts: () => generatePostData(useFaker),
      search: () => generateSearchData(useFaker),
      all: () => generateAllTestData(useFaker)
    };

    const generator = dataMap[dataType.toLowerCase()];
    if (!generator) throw new Error(`Unknown data type: ${dataType}. Use 'user', 'signup', 'post', 'search', or 'all'`);

    const newData = generator();
    const updatedData = { ...existingData, ...newData };

    // Atomic write: temp file + rename so concurrent readers never observe a half-written file.
    const targetPath = path.join(__dirname, 'testdata.json');
    const tmpPath = `${targetPath}.tmp.${process.pid}.${Date.now()}`;
    fs.writeFileSync(tmpPath, JSON.stringify(updatedData, null, 2), 'utf8');
    fs.renameSync(tmpPath, targetPath);
    log(`${dataType} data successfully generated and saved to testdata.json`);
    return updatedData;
  } catch (error) {
    console.error('Error generating test data:', error.message);
    return null;
  }
}

// Legacy functions
function updateSpecificDataTypeControlled(dataType, faker = true) { return updateSpecificDataType(dataType, faker); }
function generateSpecificData(type, identifier) { return generateData(type, true); }

// Export all functions
module.exports = {
  generateUserData, generateSignupData, generatePostData, generateSearchData, generateAllTestData,
  updateSpecificDataType, generateSpecificData,
  generateUserDataControlled, generateSignupDataControlled, generateAllTestDataControlled,
  updateSpecificDataTypeControlled, getExistingModuleData
};
