import { fileURLToPath } from 'url';
import fs from 'fs';
import path from 'path';
import { spawn } from 'cross-spawn';
// import { testId } from './id_test_commit.js';

const COMMAND = 'jest';
const args = ['--json', '--outputFile=./script/report.json'];

function runCommand(command, args) {
  return new Promise((resolve, reject) => {
    const process = spawn(command, args, { stdio: 'inherit' });
    process.on('close', (code) => {
      resolve();
    });
  });
}

const readJSONFile = (filePath) => {
  const rawData = fs.readFileSync(filePath, 'utf-8');
  return JSON.parse(rawData);
};

const writeJSONFile = (filePath, data) => {
  const jsonString = JSON.stringify(data, null, 2);
  fs.writeFileSync(filePath, jsonString, 'utf-8');
};

const ensureFileExists = (filePath, initialData) => {
  if (!fs.existsSync(filePath)) {
    writeJSONFile(filePath, initialData);
  }
};

const extractAndAddObject = async (reportFile, tddLogFile, currentTestId) => {
  try {
    await runCommand(COMMAND, args);

    ensureFileExists(tddLogFile, []);

    const jsonData = readJSONFile(reportFile);
    const passedTests = jsonData.numPassedTests;
    const failedTests = jsonData.numFailedTests; 
    const totalTests = jsonData.numTotalTests;
    const startTime = jsonData.startTime;
    const success = jsonData.success;

    const newReport = {
      numPassedTests: passedTests,
      failedTests: failedTests,
      numTotalTests: totalTests,
      timestamp: startTime,
      success: success,
      testId: currentTestId
    };

    const tddLog = readJSONFile(tddLogFile);
    tddLog.push(newReport);

    writeJSONFile(tddLogFile, tddLog);
  } catch (error) {
    console.error("Error en la ejecución:", error);
  }
};

const isACommit = (lastEntry) => {
  return lastEntry.hasOwnProperty('commitId');
};

const getLastTestId = (filePath) => {
  ensureFileExists(filePath, []);
  const historyExecutionData = readJSONFile(filePath);
  const lastEntry = historyExecutionData[historyExecutionData.length - 1];
  
  if (lastEntry) {
    if (isACommit(lastEntry)) {
      return lastEntry.testId + 1; // Si el último es un commit, el próximo testId se incrementa
    } else {
      return lastEntry.hasOwnProperty('testId') ? lastEntry.testId : 0; // Incrementa el testId
    }
  } else {
    return 0; // Si el archivo está vacío, comienza con testId 0
  }
};

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const inputFilePath = path.join(__dirname, 'report.json');
const outputFilePath = path.join(__dirname, 'tdd_log.json');

let lastTestId = getLastTestId(outputFilePath);

extractAndAddObject(inputFilePath, outputFilePath, lastTestId);

export { extractAndAddObject, getLastTestId };
