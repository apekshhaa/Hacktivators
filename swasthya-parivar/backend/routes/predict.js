import express from 'express';
import fs from 'fs';
import path from 'path';
import csv from 'csv-parser';
import ARIMA from 'arima';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const router = express.Router();

console.log("Predict route file loaded");

// Helper to read CSV
const readCSV = (filePath) => {
    return new Promise((resolve, reject) => {
        const results = [];
        fs.createReadStream(filePath)
            .pipe(csv({
                mapHeaders: ({ header }) => header.trim()
            }))
            .on('data', (data) => {
                // Parse numbers and trim strings
                for (let key in data) {
                    if (typeof data[key] === 'string') {
                        data[key] = data[key].trim();
                    }
                    if (key !== 'date' && key !== 'village') {
                        data[key] = parseFloat(data[key]);
                    }
                }
                results.push(data);
            })
            .on('end', () => {
                if (results.length > 0) {
                    console.log('[ARIMA] Sample Row:', JSON.stringify(results[0]));
                    console.log('[ARIMA] Available Villages:', [...new Set(results.map(r => r.village))]);
                }
                resolve(results);
            })
            .on('error', (err) => reject(err));
    });
};

// Helper to calculate Pearson Correlation
const calculateCorrelation = (x, y) => {
    const n = x.length;
    if (n !== y.length || n === 0) return 0;
    const sumX = x.reduce((a, b) => a + b, 0);
    const sumY = y.reduce((a, b) => a + b, 0);
    const sumXY = x.reduce((a, b, i) => a + (b * (y[i] || 0)), 0);
    const sumX2 = x.reduce((a, b) => a + b * b, 0);
    const sumY2 = y.reduce((a, b) => a + b * b, 0);
    const num = n * sumXY - sumX * sumY;
    const den = Math.sqrt((n * sumX2 - sumX * sumX) * (n * sumY2 - sumY * sumY));
    return den === 0 ? 0 : num / den;
};

router.get('/', async (req, res) => {
    try {
        const { village = 'All Villages', days = '14' } = req.query;
        const daysMatch = days.match(/\d+/);
        const daysLimit = daysMatch ? parseInt(daysMatch[0]) : 14;

        console.log(`[ARIMA] Query: village=${village}, daysLimit=${daysLimit}`);

        const csvPath = path.join(__dirname, '../../village_V001_health_timeseries_daily.csv');

        if (!fs.existsSync(csvPath)) {
            console.error('[ARIMA] File not found:', csvPath);
            return res.status(404).json({ error: 'Data file not found' });
        }

        let allData = await readCSV(csvPath);

        let data = [];
        if (village !== 'All Villages') {
            data = allData.filter(d => d.village === village);
        } else {
            // Aggregate all villages by date
            const aggregated = {};
            allData.forEach(d => {
                if (!aggregated[d.date]) {
                    aggregated[d.date] = { date: d.date, fever_cases: 0, cough_cases: 0, diarrhea_cases: 0, total_symptom_reports: 0, env_risk_index: 0, count: 0 };
                }
                aggregated[d.date].fever_cases += (d.fever_cases || 0);
                aggregated[d.date].cough_cases += (d.cough_cases || 0);
                aggregated[d.date].diarrhea_cases += (d.diarrhea_cases || 0);
                aggregated[d.date].total_symptom_reports += (d.total_symptom_reports || 0);
                aggregated[d.date].env_risk_index += (d.env_risk_index || 0);
                aggregated[d.date].count += 1;
            });
            data = Object.values(aggregated).map(d => ({
                ...d,
                env_risk_index: d.env_risk_index / d.count // average risk
            })).sort((a, b) => new Date(a.date) - new Date(b.date));
        }

        console.log(`[ARIMA] Processed history size: ${data.length}`);

        if (data.length === 0) {
            console.error('[ARIMA] No data for village:', village);
            return res.status(404).json({ error: 'No data available for this selection' });
        }

        // Limit historical data for the response summary
        const historySubset = data.slice(-daysLimit);
        console.log(`[ARIMA] Returning subset of size: ${historySubset.length}`);

        // Extract Time Series for Metrics
        const feverSeries = data.map(d => d.fever_cases || 0);
        const coughSeries = data.map(d => d.cough_cases || 0);
        const diarrheaSeries = data.map(d => d.diarrhea_cases || 0);
        const riskSeries = data.map(d => d.env_risk_index || 0);

        // Calculate Correlation Matrix
        const metrics = [feverSeries, coughSeries, diarrheaSeries, riskSeries];
        const labels = ['Fever', 'Cough', 'Diarrhea', 'Risk'];
        const matrix = [];
        for (let i = 0; i < metrics.length; i++) {
            for (let j = 0; j < metrics.length; j++) {
                matrix.push(calculateCorrelation(metrics[i], metrics[j]));
            }
        }

        // Train ARIMA Model
        const arima = new ARIMA({ p: 1, d: 1, q: 1, verbose: false });
        arima.train(feverSeries);

        // Forecast next 7 days
        const [pred] = arima.predict(7);

        // Format Response
        const lastDate = new Date(data[data.length - 1].date);
        const forecastData = pred.map((val, idx) => {
            const d = new Date(lastDate);
            d.setDate(d.getDate() + idx + 1);
            return {
                date: d.toISOString().split('T')[0],
                cases: Math.max(0, Math.round(val)),
                isForecast: true
            };
        });

        res.json({
            history: historySubset,
            forecast: forecastData,
            correlationMatrix: matrix,
            labels: labels,
            recentTrend: feverSeries.slice(-7),
        });

    } catch (error) {
        console.error('Prediction Error:', error);
        res.status(500).json({ error: 'Failed to generate predictions' });
    }
});

export default router;
