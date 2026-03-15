import fs from 'node:fs';
import path from 'node:path';

const repoRoot = process.cwd();
const sourceRoot = path.resolve(
  repoRoot,
  '..',
  '..',
  '12.4 Site',
  'sitemap',
  'stitch_dashboard_do_aluno (1)',
  'stitch_dashboard_do_aluno'
);
const stitchRoot = path.join(repoRoot, 'public', 'stitch');
const homePath = path.join(stitchRoot, 'home.html');

const pageDefinitions = [
  { sourceDir: 'research_papers', outputFile: 'research-papers.html' },
  { sourceDir: 'field_guides', outputFile: 'field-guides.html' },
  { sourceDir: 'dataset_access', outputFile: 'dataset-access.html' },
  { sourceDir: 'api_documentation', outputFile: 'api-documentation.html' },
  { sourceDir: 'about_us', outputFile: 'about-us.html' },
  { sourceDir: 'partnerships', outputFile: 'partnerships.html' },
  { sourceDir: 'petrobras_esg', outputFile: 'petrobras-esg.html' },
  { sourceDir: 'legal_notices', outputFile: 'legal-notices.html' },
  { sourceDir: 'petrobras_institutional', outputFile: 'petrobras.html' },
  { sourceDir: 'privacy_terms', outputFile: 'privacy-policy.html' },
  { sourceDir: 'termos_de_uso_e_privacidade', outputFile: 'terms-of-use.html' },
  { sourceDir: 'about_the_portal', outputFile: 'about.html' },
  { sourceDir: 'region_santar_m_monte_alegre', outputFile: 'region.html' },
  { sourceDir: 'contact', outputFile: 'contact.html' },
];

const textRoutes = new Map([
  ['Articles', '/acesso-ao-portal-interno?origin=public'],
  ['About', '/about'],
  ['Region', '/region'],
  ['Contact', '/contact'],
  ['Explore The Portal', '/acesso-ao-portal-interno?origin=public'],
  ['Internal Area', '/acesso-ao-portal-interno?origin=public'],
  ['Sign In to Portal', '/acesso-ao-portal-interno?origin=public'],
  ['View All Archives', '/acesso-ao-portal-interno?origin=public'],
  ['Research Papers', '/research-papers'],
  ['Field Guides', '/field-guides'],
  ['Dataset Access', '/dataset-access'],
  ['API Documentation', '/api-documentation'],
  ['About Us', '/about-us'],
  ['Partnerships', '/partnerships'],
  ['Petrobras ESG', '/petrobras-esg'],
  ['Legal Notices', '/legal-notices'],
  ['PETROBRAS', '/petrobras'],
  ['Privacy Policy', '/privacy-policy'],
  ['Terms of Use', '/terms-of-use'],
  ['Contact Us', '/contact'],
]);

const sharedStyleBlock = `
<style>
  .glass-nav {
    background: rgba(255, 248, 241, 0.8);
    backdrop-filter: blur(20px);
  }
  .lithic-gradient {
    background: linear-gradient(135deg, #785830 0%, #c29b6d 100%);
  }
  .soil-shadow {
    box-shadow: 0px 24px 48px -12px rgba(30, 27, 20, 0.08);
  }
  .serif-text,
  .serif {
    font-family: 'Newsreader', serif;
  }
  html {
    scroll-behavior: smooth;
  }
</style>`;

const sharedFooter = `
<footer class="bg-surface-dim px-6 lg:px-20 py-16 border-t border-outline-variant/20">
<div class="max-w-7xl mx-auto flex flex-col gap-12">
<div class="flex flex-col md:flex-row justify-between items-start gap-12">
<div class="space-y-6 max-w-sm">
<div class="flex items-center gap-3 text-on-surface">
<div class="size-5 text-primary">
<svg fill="none" viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg">
<path d="M4 4H17.3334V17.3334H30.6666V30.6666H44V44H4V4Z" fill="currentColor"></path>
</svg>
</div>
<a class="text-on-surface text-lg font-headline font-bold" href="/">PaleoPortal</a>
</div>
<p class="text-on-surface-variant text-sm leading-relaxed">
                        A collaborative initiative supported by Petrobras, dedicated to the preservation, documentation, and study of regional paleontological treasures.
                    </p>
<div class="flex gap-4">
<a class="text-outline hover:text-primary transition-colors" href="#"><span class="material-symbols-outlined">public</span></a>
<a class="text-outline hover:text-primary transition-colors" href="#"><span class="material-symbols-outlined">mail</span></a>
<a class="text-outline hover:text-primary transition-colors" href="#"><span class="material-symbols-outlined">description</span></a>
</div>
</div>
<div class="grid grid-cols-2 lg:grid-cols-3 gap-12">
<div class="space-y-4">
<h4 class="text-on-surface text-xs font-label font-bold uppercase tracking-widest">Resources</h4>
<ul class="space-y-2 text-sm text-on-surface-variant">
<li><a class="hover:text-primary" href="/research-papers">Research Papers</a></li>
<li><a class="hover:text-primary" href="/field-guides">Field Guides</a></li>
<li><a class="hover:text-primary" href="/dataset-access">Dataset Access</a></li>
<li><a class="hover:text-primary" href="/api-documentation">API Documentation</a></li>
</ul>
</div>
<div class="space-y-4">
<h4 class="text-on-surface text-xs font-label font-bold uppercase tracking-widest">Institution</h4>
<ul class="space-y-2 text-sm text-on-surface-variant">
<li><a class="hover:text-primary" href="/about-us">About Us</a></li>
<li><a class="hover:text-primary" href="/partnerships">Partnerships</a></li>
<li><a class="hover:text-primary" href="/petrobras-esg">Petrobras ESG</a></li>
<li><a class="hover:text-primary" href="/legal-notices">Legal Notices</a></li>
</ul>
</div>
<div class="space-y-4 col-span-2 lg:col-span-1">
<h4 class="text-on-surface text-xs font-label font-bold uppercase tracking-widest">Institutional</h4>
<a class="flex items-center opacity-60 grayscale hover:grayscale-0 transition-all cursor-pointer" href="/petrobras"><div class="h-10 w-auto bg-surface-container px-4 flex items-center rounded border border-outline-variant/30">
<span class="text-[10px] font-bold tracking-tighter">PETROBRAS</span>
</div></a>
</div>
</div>
</div>
<div class="flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-outline">
<p>© 2024 PaleoPortal Project. All rights reserved.</p>
<div class="flex gap-6">
<a class="hover:text-on-surface-variant" href="/privacy-policy">Privacy Policy</a>
<a class="hover:text-on-surface-variant" href="/terms-of-use">Terms of Use</a>
</div>
</div>
</div>
</footer>`;

const navigationScript = `
<script>
(function () {
  const routes = {
    'Articles': '/acesso-ao-portal-interno?origin=public',
    'About': '/about',
    'Region': '/region',
    'Contact': '/contact',
    'Explore The Portal': '/acesso-ao-portal-interno?origin=public',
    'Internal Area': '/acesso-ao-portal-interno?origin=public',
    'Sign In to Portal': '/acesso-ao-portal-interno?origin=public',
    'View All Archives': '/acesso-ao-portal-interno?origin=public',
    'Research Papers': '/research-papers',
    'Field Guides': '/field-guides',
    'Dataset Access': '/dataset-access',
    'API Documentation': '/api-documentation',
    'About Us': '/about-us',
    'Partnerships': '/partnerships',
    'Petrobras ESG': '/petrobras-esg',
    'Legal Notices': '/legal-notices',
    'PETROBRAS': '/petrobras',
    'Privacy Policy': '/privacy-policy',
    'Terms of Use': '/terms-of-use',
    'Contact Us': '/contact'
  };

  document.querySelectorAll('[data-route]').forEach((el) => {
    const route = el.getAttribute('data-route');
    if (!route) return;

    if (el.tagName === 'A') {
      el.setAttribute('href', route);
      return;
    }

    el.style.cursor = 'pointer';
    el.addEventListener('click', function () {
      window.location.href = route;
    });
  });

  document.querySelectorAll('a[href="#"]').forEach((el) => {
    const text = (el.textContent || '').replace(/\\s+/g, ' ').trim();
    if (routes[text]) {
      el.setAttribute('href', routes[text]);
      return;
    }

    el.addEventListener('click', function (event) {
      event.preventDefault();
    });
  });

  document.querySelectorAll('button').forEach((el) => {
    if (el.hasAttribute('data-route')) return;

    const text = (el.textContent || '').replace(/\\s+/g, ' ').trim();
    if (routes[text]) {
      el.style.cursor = 'pointer';
      el.addEventListener('click', function () {
        window.location.href = routes[text];
      });
      return;
    }

    if (el.type === 'submit') {
      el.addEventListener('click', function (event) {
        const form = el.closest('form');
        if (!form) return;
        event.preventDefault();
      });
      return;
    }

    el.addEventListener('click', function (event) {
      event.preventDefault();
    });
  });

  document.querySelectorAll('form').forEach((form) => {
    form.addEventListener('submit', function (event) {
      event.preventDefault();
    });
  });
})();
</script>`;

function readText(filePath) {
  return fs.readFileSync(filePath, 'utf8');
}

function writeText(filePath, content) {
  fs.writeFileSync(filePath, content, 'utf8');
}

function escapeRegExp(value) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

function extractMainMarkup(html, label) {
  const match = html.match(/<main\b([^>]*)>([\s\S]*?)<\/main>/i);
  if (!match) {
    throw new Error(`Nao foi possivel extrair o conteudo principal de ${label}.`);
  }

  const attributes = match[1] ? match[1].trim() : '';
  const wrapperAttributes = attributes ? ` ${attributes}` : '';
  return `<div${wrapperAttributes}>${match[2].trim()}</div>`;
}

function extractTitle(html, fallbackTitle) {
  const match = html.match(/<title>([\s\S]*?)<\/title>/i);
  return match ? match[1].trim() : fallbackTitle;
}

function replaceAnchorsByText(html) {
  let nextHtml = html;

  for (const [label, href] of textRoutes.entries()) {
    const pattern = new RegExp(
      `<a([^>]*?)href="[^"]*"([^>]*?)>(\\s*${escapeRegExp(label)}\\s*)<\\/a>`,
      'g'
    );
    nextHtml = nextHtml.replace(pattern, `<a$1href="${href}"$2>$3</a>`);
  }

  nextHtml = nextHtml.replace(
    '<div class="flex items-center opacity-60 grayscale hover:grayscale-0 transition-all cursor-pointer">\n<div class="h-10 w-auto bg-surface-container px-4 flex items-center rounded border border-outline-variant/30">\n<span class="text-[10px] font-bold tracking-tighter">PETROBRAS</span>\n</div>\n</div>',
    '<a class="flex items-center opacity-60 grayscale hover:grayscale-0 transition-all cursor-pointer" href="/petrobras">\n<div class="h-10 w-auto bg-surface-container px-4 flex items-center rounded border border-outline-variant/30">\n<span class="text-[10px] font-bold tracking-tighter">PETROBRAS</span>\n</div>\n</a>'
  );
  nextHtml = nextHtml.replace(
    '<a class="flex items-center opacity-60 grayscale hover:grayscale-0 transition-all cursor-pointer" href="/petrobras"><div class="h-10 w-auto bg-surface-container px-4 flex items-center rounded border border-outline-variant/30">\n<span class="text-[10px] font-bold tracking-tighter">PETROBRAS</span>\n</div>\n</div>',
    '<a class="flex items-center opacity-60 grayscale hover:grayscale-0 transition-all cursor-pointer" href="/petrobras"><div class="h-10 w-auto bg-surface-container px-4 flex items-center rounded border border-outline-variant/30">\n<span class="text-[10px] font-bold tracking-tighter">PETROBRAS</span>\n</div></a>\n</div>'
  );

  nextHtml = nextHtml.replace(
    /<h2 class="text-on-surface text-xl font-headline font-bold leading-tight tracking-tight">PaleoPortal<\/h2>/,
    '<a class="text-on-surface text-xl font-headline font-bold leading-tight tracking-tight" href="/">PaleoPortal</a>'
  );
  nextHtml = nextHtml.replace(
    /<h2 class="text-on-surface text-lg font-headline font-bold">PaleoPortal<\/h2>/,
    '<a class="text-on-surface text-lg font-headline font-bold" href="/">PaleoPortal</a>'
  );

  return nextHtml;
}

function extractSourceStyles(html) {
  const styles = [...html.matchAll(/<style>([\s\S]*?)<\/style>/gi)].map((match) => match[0]);
  return styles
    .filter((block) => block.includes('.code-block') || block.includes('.code-keyword') || block.includes('.no-scrollbar'))
    .join('\n');
}

function injectSharedStyles(html, extraStyles = '') {
  let result = html;

  if (!result.includes('scroll-behavior: smooth')) {
    result = result.replace('</head>', `${sharedStyleBlock}\n</head>`);
  }

  if (extraStyles && !result.includes('.code-block')) {
    result = result.replace('</head>', `${extraStyles}\n</head>`);
  }

  return result;
}

function replaceNavigationScript(html) {
  return html.replace(/<script>[\s\S]*?<\/script>\s*<\/body>\s*<\/html>\s*$/i, `${navigationScript}</body></html>`);
}

function buildHomeShell() {
  let homeHtml = readText(homePath);
  homeHtml = replaceAnchorsByText(homeHtml);
  homeHtml = injectSharedStyles(homeHtml);
  homeHtml = homeHtml.replace(/<footer class="bg-surface-dim[\s\S]*?<\/footer>/i, sharedFooter);
  homeHtml = replaceNavigationScript(homeHtml);
  writeText(homePath, homeHtml);

  const marker = '<main class="flex-grow">';
  const start = homeHtml.indexOf(marker);
  const end = homeHtml.indexOf('</main>', start);
  if (start === -1 || end === -1) {
    throw new Error('Nao foi possivel localizar o casco principal da home.');
  }

  return {
    prefix: homeHtml.slice(0, start + marker.length),
    suffix: homeHtml.slice(end),
  };
}

function buildPage(shell, sourceDir, outputFile) {
  const sourcePath = path.join(sourceRoot, sourceDir, 'code.html');
  const sourceHtml = readText(sourcePath);
  const title = extractTitle(sourceHtml, 'PaleoPortal');
  const mainContent = extractMainMarkup(sourceHtml, sourceDir);
  const sourceStyles = extractSourceStyles(sourceHtml);

  let pageHtml = `${shell.prefix}\n${mainContent}\n${shell.suffix}`;
  pageHtml = pageHtml.replace(/<title>[\s\S]*?<\/title>/i, `<title>${title}</title>`);
  pageHtml = injectSharedStyles(pageHtml, sourceStyles);
  pageHtml = replaceNavigationScript(pageHtml);

  writeText(path.join(stitchRoot, outputFile), pageHtml);
}

const shell = buildHomeShell();
for (const page of pageDefinitions) {
  buildPage(shell, page.sourceDir, page.outputFile);
}

console.log(`Generated ${pageDefinitions.length} public pages with the shared home shell.`);
