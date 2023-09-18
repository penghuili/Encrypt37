// postBuild.js
const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

require('dotenv').config();

const folder = new Date()
  .toISOString()
  .replace(/[^0-9]/g, '')
  .slice(0, 14);
const buildDir = path.join(__dirname, '..', 'build');
const assetsDir = path.join(buildDir, folder);

// Create assets directory if it doesn't exist
if (!fs.existsSync(assetsDir)) {
  fs.mkdirSync(assetsDir);
}

// Move all files from build to assets except index.html
fs.readdirSync(buildDir).forEach(item => {
  const itemPath = path.join(buildDir, item);

  if (item !== 'index.html' && item !== folder) {
    const destinationPath = path.join(assetsDir, item);

    fs.renameSync(itemPath, destinationPath);
  }
});

// Update paths in index.html
const indexPath = path.join(buildDir, 'index.html');

if (!fs.existsSync(indexPath)) {
  console.error('index.html not found');
  process.exit(1);
}

let content = fs.readFileSync(indexPath, 'utf-8');

// Update CSS and JS paths.
content = content.replace(/(href|src)="(?!http)([^"]+)"/g, `$1="/${folder}$2"`);

// Save updated content back to index.html
fs.writeFileSync(indexPath, content);
console.log('Files moved.');

console.log('Uploading assets to S3...');
execSync(
  `aws s3 sync build/${folder} ${process.env.S3_URL}/${folder} --cache-control max-age=31536000,public`
);
console.log('Upload assets to S3 completed.');

console.log('Uploading index.html to S3...');
execSync(
  `aws s3 cp build/index.html ${process.env.S3_URL}/index.html --cache-control max-age=0,no-cache,no-store,must-revalidate --content-type text/html --acl public-read`
);
console.log('Upload index.html to S3 completed.');

console.log('Deleting old versions ...');
// Retrieve the list of folder names (versions) from S3
const command = `aws s3 ls ${process.env.S3_URL} --recursive | awk '{print $4}' | grep '/' | cut -d/ -f1 | uniq`;
const result = execSync(command).toString();

// Split the result into an array, filter out 'index.html' and other non-versioned entries, and then sort
const versions = result
  .split('\n')
  .filter(v => v && v !== 'index.html' && /^\d{14}$/.test(v))
  .sort();
// If there are more than 10 versions, remove the oldest ones
if (versions.length > 3) {
  const toDelete = versions.slice(0, versions.length - 3); // Keep the last 10

  toDelete.forEach(version => {
    console.log(`Deleting version: ${version}`);
    execSync(`aws s3 rm ${process.env.S3_URL}/${version} --recursive`);
  });
  console.log('Deleting old versions completed.');
} else {
  console.log('No old versions to delete.');
}
