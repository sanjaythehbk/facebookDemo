const fs = require('fs');
const path = require('path');
const csv = require('csv-parser');
const createCsvWriter = require('csv-writer').createObjectCsvWriter;

// Read JSON file
async function readJSON(filePath) {
    try {
        const data = fs.readFileSync(filePath, 'utf-8');
        return JSON.parse(data);
    } catch (error) {
        console.error(`Error reading JSON file: ${error.message}`);
        throw error;
    }
}

// Write JSON file
async function writeJSON(filePath, data, pretty = true) {
    try {
        const content = pretty ? JSON.stringify(data, null, 2) : JSON.stringify(data);
        fs.writeFileSync(filePath, content, 'utf-8');
        return true;
    } catch (error) {
        console.error(`Error writing JSON file: ${error.message}`);
        throw error;
    }
}

// Read CSV file
async function readCSV(filePath) {
    return new Promise((resolve, reject) => {
        const results = [];
        fs.createReadStream(filePath)
            .pipe(csv())
            .on('data', (data) => results.push(data))
            .on('end', () => resolve(results))
            .on('error', (error) => reject(error));
    });
}

// Write CSV file
async function writeCSV(filePath, data) {
    try {
        if (!data || data.length === 0) {
            throw new Error('No data to write');
        }
        const headers = Object.keys(data[0]).map((key) => ({ id: key, title: key }));
        const writer = createCsvWriter({ path: filePath, header: headers });
        await writer.writeRecords(data);
        return true;
    } catch (error) {
        console.error(`Error writing CSV file: ${error.message}`);
        throw error;
    }
}

// Parse HTML table to JSON
function parseHTMLTable(tableElement) {
    const rows = Array.from(tableElement.querySelectorAll('tr'));
    const headers = Array.from(rows[0].querySelectorAll('th, td')).map((th) => th.textContent.trim());
    
    return rows.slice(1).map((row) => {
        const cells = Array.from(row.querySelectorAll('td')).map((td) => td.textContent.trim());
        return headers.reduce((obj, header, index) => {
            obj[header] = cells[index];
            return obj;
        }, {});
    });
}

// File exists check
function fileExists(filePath) {
    return fs.existsSync(filePath);
}

// Delete file
async function deleteFile(filePath) {
    try {
        if (fs.existsSync(filePath)) {
            fs.unlinkSync(filePath);
            return true;
        }
        return false;
    } catch (error) {
        console.error(`Error deleting file: ${error.message}`);
        throw error;
    }
}

module.exports = {
    readJSON,
    writeJSON,
    readCSV,
    writeCSV,
    parseHTMLTable,
    fileExists,
    deleteFile,
};