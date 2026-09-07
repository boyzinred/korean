const fs = require('fs');
const { WORDS } = require('/Users/tprimandaru/Documents/nerd/vibe/korean/shared-vocab/topik-vocab-2000.js');

const esc = s => String(s)
  .replace(/\\/g, '\\textbackslash{}')
  .replace(/([&%$#_{}])/g, '\\$1')
  .replace(/~/g, '\\textasciitilde{}')
  .replace(/\^/g, '\\textasciicircum{}');

const days = [...new Set(WORDS.map(w => w.day))].sort((a, b) => a - b);
const KEEP = 4; // words glued to their day header so it never ends a column alone
const body = days.map(day => {
  const items = WORDS.filter(w => w.day === day);
  const row = w => `\\entry{${esc(w.korean)}}{${esc(w.meaning)}}`;
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

{\\Large\\bfseries\\color{rule}TOPIK I -- 2000 Words by Study Day}\\par
\\vspace{2pt}
{\\footnotesize\\color{gloss}40 days, 50 words a day. Each day carries the same mix of parts of speech.}\\par
\\vspace{7pt}

\\fontsize{7.6}{9.3}\\selectfont
\\begin{multicols}{3}
${body}
\\end{multicols}

\\end{document}
`;

fs.writeFileSync(process.argv[2], tex);
console.log('wrote', process.argv[2], WORDS.length, 'words');
