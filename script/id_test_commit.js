import { fileURLToPath } from 'url';
import fs from 'fs';
import path from 'path';
import { spawn } from 'cross-spawn';

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

const outputFilePath = path.join(__dirname, 'tdd_log.json');


// extractAndAddObject(inputFilePath, outputFilePath, lastTestId);

export {getLastTestId };
