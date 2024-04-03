const fs = require('fs');
const path = require('path');

// Get the .ttl file path from the command line arguments
const ttlFilePath = process.argv[2];

if (!ttlFilePath) {
  console.error('Please provide a path to a .ttl file');
  process.exit(1);
}

// Ensure the file has a .ttl extension
if (path.extname(ttlFilePath) !== '.ttl') {
  console.error('The file must have a .ttl extension');
  process.exit(1);
}

// Read the .ttl file
fs.readFile(ttlFilePath, 'utf8', (err, data) => {
  if (err) {
    console.error('Error reading the .ttl file:', err);
    process.exit(1);
  }

  // Construct the JSON structure
  const jsonData = {
    shape: data
  };

  // Construct the path for the output JSON file
  const jsonFilePath = path.join(path.dirname(ttlFilePath), path.basename(ttlFilePath, '.ttl') + '.json');

  // Write the JSON file
  fs.writeFile(jsonFilePath, JSON.stringify(jsonData, null, 2), 'utf8', (err) => {
    if (err) {
      console.error('Error writing the JSON file:', err);
      process.exit(1);
    }

    console.log('Conversion successful. JSON file created:', jsonFilePath);
  });
});

