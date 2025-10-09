const https = require('https');

async function getHerokuDynoStats() {
  const herokuApiKey = process.env.HEROKU_API_KEY;
  const appName = process.env.HEROKU_APP_NAME || 'stocksentiment-e3cfd7d49077';
  
  if (!herokuApiKey) {
    throw new Error('HEROKU_API_KEY not found in environment variables');
  }

  return new Promise((resolve, reject) => {
    const options = {
      hostname: 'api.heroku.com',
      path: `/apps/${appName}/dynos`,
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${herokuApiKey}`,
        'Accept': 'application/vnd.heroku+json; version=3',
        'Content-Type': 'application/json'
      }
    };

    const req = https.request(options, (res) => {
      let data = '';
      res.on('data', (chunk) => data += chunk);
      res.on('end', () => {
        try {
          const dynos = JSON.parse(data);
          resolve(dynos);
        } catch (error) {
          reject(new Error(`Failed to parse Heroku API response: ${error.message}`));
        }
      });
    });

    req.on('error', (error) => {
      reject(new Error(`Heroku API request failed: ${error.message}`));
    });

    req.setTimeout(10000, () => {
      req.destroy();
      reject(new Error('Heroku API request timeout'));
    });

    req.end();
  });
}

function formatDynoStats(dynos) {
  if (!dynos || dynos.length === 0) {
    return null;
  }

  // Find web dyno (primary dyno)
  const webDyno = dynos.find(dyno => dyno.type === 'web') || dynos[0];
  
  return {
    state: webDyno.state || 'unknown',
    size: webDyno.size || 'Basic',
    load: webDyno.load || null,
    memory: webDyno.memory || null,
    cpu: webDyno.cpu || null,
    updatedAt: webDyno.updated_at || new Date().toISOString()
  };
}

module.exports = { getHerokuDynoStats, formatDynoStats };
