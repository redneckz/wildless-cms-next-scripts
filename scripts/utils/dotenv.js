import fs from 'fs';
import path from 'path';

export const dotenv = () => {
  try {
    const envFilePath = path.resolve('.env');
    const envFileContent = fs.readFileSync(envFilePath, 'utf8');
    const envLines = envFileContent.split('\n');

    for (const line of envLines) {
      const [key, value] = line.split('=');

      if (key && value) {
        process.env[key.trim()] = value.trim();
      }
    }
  } catch (_) {
    // Do nothing
  }
};
