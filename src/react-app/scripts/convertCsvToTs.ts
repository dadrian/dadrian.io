import * as fs from "fs";
import * as path from "path";
import * as d3 from "d3-dsv";

const dataDir = path.resolve(__dirname, "../src/data");
const genDir = path.resolve(__dirname, "../src/gen");

fs.readdirSync(dataDir)
  .filter(file => file.endsWith(".csv"))
  .forEach(file => {
    const inputPath = path.join(dataDir, file);
    const outputName = path.basename(file, ".csv") + ".ts";
    const outputPath = path.join(genDir, outputName);

    const csvText = fs.readFileSync(inputPath, "utf-8");
    const parsed = d3.csvParse(csvText);
    const variableName = path.basename(file, ".csv").replace(/[^a-zA-Z0-9_$]/g, "_");

    const tsContent = `// Auto-generated from ${file}
export const ${variableName} = ${JSON.stringify(parsed, null, 2)} as const;
`;

    fs.writeFileSync(outputPath, tsContent);
    console.log(`✅ Converted ${file} to ${outputName}`);
  });
