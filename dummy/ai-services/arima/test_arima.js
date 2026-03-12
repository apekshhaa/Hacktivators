import fs from 'fs';
import path from 'path';
import csv from 'csv-parser';
import ARIMA from 'arima';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const csvPath = path.join(__dirname, 'village_V001_health_timeseries_daily.csv');

console.log("Testing ARIMA with file:", csvPath);

const results = [];
fs.createReadStream(csvPath)
    .pipe(csv())
    .on('data', (data) => {
        // Parse numbers
        for (let key in data) {
            if (key !== 'date') {
                data[key] = parseFloat(data[key]);
            }
        }
        results.push(data);
    })
    .on('end', () => {
        console.log(`Read ${results.length} rows.`);

        const feverSeries = results
            .filter(d => !isNaN(d.fever_cases) && d.fever_cases !== null)
            .map(d => d.fever_cases);

        console.log(`Extracted series (length ${feverSeries.length}):`, feverSeries.slice(0, 5), "...", feverSeries.slice(-5));

        if (feverSeries.length < 10) {
            console.error("Not enough data points!");
            return;
        }

        try {
            const arima = new ARIMA({ p: 1, d: 1, q: 1, verbose: false });
            arima.train(feverSeries);
            const [pred, errors] = arima.predict(7);
            console.log("Success! Forecast:", pred);
        } catch (e) {
            console.error("ARIMA Error:", e);
        }
    })
    .on('error', (err) => console.error("CSV Error:", err));
