// Emits a LaTeX file for the TOPIK I bank: Korean and English only, grouped by
// study day, three columns to a page. Build it with xelatex, which is needed
// for the Hangul font.
//
//   node build-topik-i-pdf.js out.tex && xelatex -output-directory=DIR out.tex
const fs = require('fs');
const path = require('path');
const { WORDS } = require('./topik-vocab-topik-i.js');

const esc = s => String(s)
  .replace(/\\/g, '\\textbackslash{}')
  .replace(/([&%$#_{}])/g, '\\$1')
  .replace(/~/g, '\\textasciitilde{}')
  .replace(/\^/g, '\\textasciicircum{}');

// A gloss can carry Hangul of its own — the auxiliary verbs are glossed as the
// pattern they build, e.g. "-고 있다: to be doing". The body font has no Hangul,
// so those runs are switched to the Korean font explicitly.
const HANGUL = /([\uAC00-\uD7A3\u3130-\u318F]+)/g;
const kr = text => String(text).replace(HANGUL, '{\\kr $1}');

const days = [...new Set(WORDS.map(w => w.day))].sort((a, b) => a - b);
const sizes = [...new Set(days.map(day => WORDS.filter(w => w.day === day).length))].sort((a, b) => a - b);

const KEEP = 4; // words glued to their day header so it never ends a column alone
const body = days.map(day => {
  const items = WORDS.filter(w => w.day === day);
  const row = w => `\\entry{${esc(w.korean)}}{${kr(esc(w.meaning))}}`;
  const head = items.slice(0, KEEP).map(row).join('\n');
  const rest = items.slice(KEEP).map(row).join('\n');
  return `\\dayhead{${day}}{${items.length}}{%\n${head}\n}\n${rest}\n`;
}).join('\n');

const tex = `\\documentclass[10pt]{article}
\\usepackage[letterpaper,top=0.45in,bottom=0.5in,left=0.4in,right=0.4in]{geometry}
\\usepackage{fontspec}
\\usepackage{multicol}
\\usepackage{xcolor}
\\usepackage{fancyhdr}

\\setmainfont{Helvetica Neue}
\\newfontfamily\\kr{Apple SD Gothic Neo}[Scale=1.0]

\\definecolor{ink}{HTML}{1A1A1A}
\\definecolor{gloss}{HTML}{4A4A4A}
\\definecolor{rule}{HTML}{28468A}

\\setlength{\\parindent}{0pt}
\\setlength{\\parskip}{0pt}
\\setlength{\\columnsep}{14pt}
\\setlength{\\emergencystretch}{2em}
\\raggedright
\\pagestyle{fancy}
\\fancyhf{}
\\renewcommand{\\headrulewidth}{0pt}
\\fancyfoot[C]{\\footnotesize\\color{gloss}\\thepage}

% One vocabulary line: Korean headword, then the English gloss.
\\newcommand{\\entry}[2]{%
  \\par\\hangindent=0.9em\\hangafter=1
  {\\kr\\bfseries\\color{ink}#1}\\hspace{0.45em}{\\color{gloss}#2}\\par
  \\vspace{0.9pt}%
}

% Day banner plus its first few words, in one unbreakable box so a header can
% never be stranded at the foot of a column.
\\newcommand{\\dayhead}[3]{%
  \\par\\vspace{5pt}\\noindent
  \\vbox{\\hsize=\\linewidth\\raggedright
    {\\color{rule}\\rule{\\linewidth}{1.6pt}}\\par\\vspace{2pt}
    {\\bfseries\\color{rule}Day #1}\\hfill{\\scriptsize\\color{gloss}#2 words}\\par
    \\vspace{3.5pt}#3}\\par
}

\\begin{document}

{\\Large\\bfseries\\color{rule}TOPIK I -- ${WORDS.length} Words by Study Day}\\par
\\vspace{2pt}
{\\footnotesize\\color{gloss}Levels 1 and 2. ${days.length} days, ${sizes.join('--')} words a day. Each day carries the same mix of parts of speech. A word spelled the same as another appears once per part of speech, so {\\kr 이} is listed five times: subject marker, this, this one, two, and tooth.}\\par
\\vspace{7pt}

\\fontsize{7.6}{9.3}\\selectfont
\\begin{multicols}{3}
${body}
\\end{multicols}

\\end{document}
`;

const out = process.argv[2] || path.join(__dirname, 'topik-i-vocab-by-day.tex');
fs.writeFileSync(out, tex);
console.log(`wrote ${out} — ${WORDS.length} words, ${days.length} days`);
