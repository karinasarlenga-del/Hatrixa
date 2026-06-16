const fs = require('fs');
const https = require('https');

function fetchValidIds(query) {
    return new Promise((resolve, reject) => {
        https.get(`https://unsplash.com/napi/search/photos?query=${query}&per_page=30`, {
            headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)'
            }
        }, (res) => {
            let data = '';
            res.on('data', chunk => data += chunk);
            res.on('end', () => {
                if (res.statusCode === 200) {
                    try {
                        const json = JSON.parse(data);
                        resolve(json.results.map(r => r.id).slice(0, 18));
                    } catch (e) { reject(e); }
                } else {
                    reject('Status: ' + res.statusCode);
                }
            });
        }).on('error', reject);
    });
}

async function main() {
    try {
        const arch = await fetchValidIds('architecture building modern');
        console.log('ARCH:', arch.join(','));
        const corp = await fetchValidIds('corporate office business');
        console.log('CORP:', corp.join(','));
        const gast = await fetchValidIds('gastronomy fine dining food plating');
        console.log('GAST:', gast.join(','));
    } catch (e) {
        console.error(e);
    }
}

main();
