import { readFileSync, writeFileSync } from 'fs';
import { glob } from 'glob';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const distDir = join(__dirname, '..', 'dist');

// Fonction pour formater le HTML avec indentation
function formatHTML(html) {
  let formatted = '';
  let indent = 0;
  const indentSize = 2;
  let inTag = false;
  let inComment = false;
  let inScript = false;
  let inStyle = false;
  let tagBuffer = '';
  let textBuffer = '';
  
  for (let i = 0; i < html.length; i++) {
    const char = html[i];
    const nextChar = html[i + 1] || '';
    const prevChar = html[i - 1] || '';
    
    // Détection des commentaires
    if (char === '<' && nextChar === '!' && html.substring(i, i + 4) === '<!--') {
      inComment = true;
      formatted += '\n' + ' '.repeat(indent * indentSize) + '<!--';
      i += 3;
      continue;
    }
    
    if (inComment) {
      formatted += char;
      if (char === '-' && nextChar === '-' && html[i + 2] === '>') {
        formatted += nextChar + html[i + 2];
        formatted += '\n';
        i += 2;
        inComment = false;
      }
      continue;
    }
    
    // Détection des balises script et style
    if (char === '<' && !inTag) {
      const tagMatch = html.substring(i).match(/^<(script|style)(\s[^>]*)?>/i);
      if (tagMatch) {
        inScript = tagMatch[1].toLowerCase() === 'script';
        inStyle = tagMatch[1].toLowerCase() === 'style';
      }
    }
    
    if (char === '<' && !inTag) {
      // Écrire le texte avant la balise
      if (textBuffer.trim()) {
        formatted += '\n' + ' '.repeat(indent * indentSize) + textBuffer.trim();
        textBuffer = '';
      }
      
      inTag = true;
      tagBuffer = '<';
      continue;
    }
    
    if (inTag) {
      tagBuffer += char;
      
      if (char === '>') {
        inTag = false;
        const tag = tagBuffer.trim();
        const isClosingTag = tag.startsWith('</');
        const isSelfClosing = tag.endsWith('/>') || ['meta', 'link', 'img', 'br', 'hr', 'input'].some(t => 
          tag.match(new RegExp(`<${t}(\\s|>)`, 'i'))
        );
        
        // Fermeture de script/style
        if ((isClosingTag && (tag.match(/^<\/script/i) || tag.match(/^<\/style/i)))) {
          inScript = false;
          inStyle = false;
        }
        
        // Gestion de l'indentation
        if (isClosingTag) {
          indent = Math.max(0, indent - 1);
        }
        
        formatted += '\n' + ' '.repeat(indent * indentSize) + tag;
        
        if (!isClosingTag && !isSelfClosing && !tag.match(/^<(script|style|textarea|pre)/i)) {
          indent++;
        }
        
        tagBuffer = '';
      }
      continue;
    }
    
    // Texte en dehors des balises
    if (!inScript && !inStyle) {
      if (char === '\n' || char === '\r') {
        if (textBuffer.trim()) {
          formatted += '\n' + ' '.repeat(indent * indentSize) + textBuffer.trim();
          textBuffer = '';
        }
      } else if (char.trim() || textBuffer.trim()) {
        textBuffer += char;
      }
    } else {
      // Dans script/style, préserver le contenu tel quel
      formatted += char;
    }
  }
  
  // Nettoyer les lignes vides multiples
  formatted = formatted.replace(/\n{3,}/g, '\n\n');
  
  return formatted.trim() + '\n';
}

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
        const formatted = formatHTML(content);
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

