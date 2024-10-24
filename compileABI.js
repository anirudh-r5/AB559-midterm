const fs = require('fs');
const path = require('path');

// Directory containing the compiled contract JSON files
const buildDir = path.join(__dirname, 'build', 'contracts');
// Output file path
const outputFilePath = path.join(__dirname, 'src', 'cz_abi1.js');

// Initialize an empty array to hold the merged ABIs
const mergedAbi = [];

// Read each file in the build directory
fs.readdirSync(buildDir).forEach(file => {
	if (file.endsWith('.json')) {
		const contract = JSON.parse(fs.readFileSync(path.join(buildDir, file), 'utf8'));
		mergedAbi.push(...contract.abi);
	}
});

// Convert the merged ABI to a JavaScript object format
const abiContent = `const czAbi = ${JSON.stringify(mergedAbi, null, 2)};\n\nmodule.exports = czAbi;`;

// Write the ABI to the output file
fs.writeFileSync(outputFilePath, abiContent);

console.log('Merged ABI saved to', outputFilePath);