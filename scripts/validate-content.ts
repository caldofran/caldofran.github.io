import { loadCvData } from '../src/lib/cv';

try {
  await loadCvData();
  console.log('src/content/cv.en.yaml: valid');
} catch (error) {
  console.error(error instanceof Error ? error.message : error);
  process.exitCode = 1;
}
