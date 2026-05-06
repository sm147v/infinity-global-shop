import { readFileSync, writeFileSync } from 'fs';

let content = readFileSync('prisma/seo-tandas-2-a-6.ts', 'utf8');

const replacements: [string, string][] = [
  ['match: "Biotin Extra Strength"',  'match: "Extra Strength"'],
  ['match: "Magnesium Oxide 400"',    'match: "Magnesio Óxido 400"'],
  ['match: "Calcium 600"',            'match: "Calcio 600"'],
  ['match: "Selenium"',               'match: "Selenio"'],
  ["match: \"One'n Only Aceite\"",    "match: \"One 'n Only Aceite\""],
  ['match: "Curl Cream"',             'match: "Crema Definidora Rizos"'],
  ['match: "Olive & Shea"',           'match: "Olive Karité"'],
  ['match: "Carrot"',                 'match: "Zanahoria"'],
  ['match: "Klein Tools Impact"',     'match: "Destornillador de Impacto"'],
  ['match: "Crimper"',                'match: "Ponchadora"'],
  ['match: "Level"',                  'match: "Nivel Magnético"'],
  ['match: "Carbon Monoxide"',        'match: "Monóxido de Carbono"'],
  ['match: "Wine"',                   'match: "Vino"'],
];

for (const [from, to] of replacements) {
  if (content.includes(from)) {
    content = content.replace(from, to);
    console.log(`✓ ${from} → ${to}`);
  } else {
    console.log(`✗ No encontrado: ${from}`);
  }
}

writeFileSync('prisma/seo-tandas-2-a-6.ts', content);
console.log('\n✨ Archivo actualizado');
