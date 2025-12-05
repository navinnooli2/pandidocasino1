import { readFileSync, writeFileSync } from 'fs';
import { glob } from 'glob';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import prettier from 'prettier';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const distDir = join(__dirname, '..', 'dist');

// Configuration Prettier pour HTML
const prettierConfig = {
  parser: 'html',
  printWidth: 120,
  tabWidth: 2,
  useTabs: false,
  htmlWhitespaceSensitivity: 'css',
  endOfLine: 'lf',
};

// Trouver tous les fichiers HTML dans dist
async function formatAllHTML() {
  try {
    const htmlFiles = await glob('**/*.html', {
      cwd: distDir,
      absolute: true,
    });
    
    console.log(`Formatage de ${htmlFiles.length} fichier(s) HTML...`);
    
    for (const file of htmlFiles) {
      try {
        const content = readFileSync(file, 'utf-8');
        const formatted = await prettier.format(content, prettierConfig);
        writeFileSync(file, formatted, 'utf-8');
        console.log(`✓ Formaté: ${file.replace(distDir, '')}`);
      } catch (error) {
        console.error(`Erreur lors du formatage de ${file}:`, error.message);
      }
    }
    
    console.log('Formatage terminé!');
  } catch (error) {
    console.error('Erreur:', error.message);
    process.exit(1);
  }
}

formatAllHTML();

