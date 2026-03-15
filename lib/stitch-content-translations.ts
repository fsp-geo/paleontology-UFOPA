import type { SiteLocale } from '@/lib/site-locale';

type TranslationMap = Record<string, string>;

const commonPtReplacements: TranslationMap = {
  'Search archives...': 'Pesquisar arquivos...',
  'Search archive...': 'Pesquisar acervo...',
  'Internal Area': 'Área Interna',
  'Articles': 'Artigos',
  'About': 'Sobre',
  'Region': 'Região',
  'Contact': 'Contato',
};

const ptByFile: Record<string, TranslationMap> = {
  'research-papers.html': {
    'Scholarly Directory': 'Diretório Acadêmico',
    'Scientific <br/><span class="italic">Publications</span>': 'Publicações <br/><span class="italic">Científicas</span>',
    '"Deciphering the Amazonian fossil record through peer-reviewed excellence and collaborative field research."':
      '"Decifrando o registro fóssil amazônico por meio da excelência revisada por pares e da pesquisa de campo colaborativa."',
    'All Years': 'Todos os Anos',
    'All Disciplines': 'Todas as Disciplinas',
    'Showing 142 Results': 'Exibindo 142 Resultados',
    'Solimões Formation': 'Formação Solimões',
    'Peer Reviewed': 'Revisado por Pares',
    'New insights into the Miocene mega-wetlands of the Western Amazon':
      'Novas descobertas sobre os mega-pântanos do Mioceno na Amazônia Ocidental.',
    'A comprehensive study of stratigraphic sequences along the Purus River, revealing unprecedented vertebrate fossil density from the Pebas System.':
      'Um estudo abrangente das sequências estratigráficas ao longo do rio Purus, revelando uma densidade sem precedentes de fósseis de vertebrados no sistema Pebas.',
    'Microfossils': 'Microfósseis',
    'Palynological markers of the Late Cretaceous Transition': 'Marcadores palinológicos da transição do Cretáceo Superior',
    'Analysis of pollen and spores from core samples in the Acre Basin, documenting the shift from marine to terrestrial dominance.':
      'Análise de pólens e esporos em testemunhos da Bacia do Acre, documentando a transição da dominância marinha para a terrestre.',
    'Technical Report #442': 'Relatório Técnico #442',
    'The Evolution of Caimanine Alligatoroids in the Proto-Amazon':
      'A evolução dos aligatoroides caimaninos na Proto-Amazônia',
    'Download PDF': 'Baixar PDF',
    'Case Study': 'Estudo de Caso',
    'Sedimentary Architecture of the Urumaco Sequence': 'Arquitetura sedimentar da sequência Urumaco',
    'A multi-disciplinary approach to mapping fossiliferous outcrops using UAV-based photogrammetry.':
      'Uma abordagem multidisciplinar para mapear afloramentos fossilíferos com fotogrametria baseada em VANT.',
    'Methodology': 'Metodologia',
    'Isotope Analysis of Petrified Wood': 'Análise isotópica de madeira petrificada',
    'Reconstructing paleoclimate humidity levels through carbon isotope ratios in gymnosperms.':
      'Reconstruindo níveis de umidade paleoclimática por meio das razões isotópicas de carbono em gimnospermas.',
  },
  'contact.html': {
    'GET IN TOUCH': 'ENTRE EM CONTATO',
    'Deepening the dialogue between <span class="text-primary not-italic">past and present.</span>':
      'Aprofundando o diálogo entre o <span class="text-primary not-italic">passado e o presente.</span>',
    'Whether you are a researcher seeking specimen data or an institution looking for collaborative opportunities, our curators are ready to assist.':
      'Se você é um pesquisador em busca de dados de espécimes ou uma instituição interessada em oportunidades de colaboração, nossa curadoria está pronta para ajudar.',
    'Inquiry Submission': 'Envio de Solicitação',
    'FULL NAME': 'NOME COMPLETO',
    'E.g. Dr. Julian Foss': 'Ex.: Dra. Helena Rocha',
    'INSTITUTIONAL EMAIL': 'E-MAIL INSTITUCIONAL',
    'SUBJECT OF INQUIRY': 'ASSUNTO DA SOLICITAÇÃO',
    'Paleontological Data Request': 'Solicitação de Dados Paleontológicos',
    'Collection Access Appointment': 'Agendamento de Acesso à Coleção',
    'Publication Collaboration': 'Colaboração em Publicação',
    'General Institutional Inquiry': 'Consulta Institucional Geral',
    'MESSAGE': 'MENSAGEM',
    'Please describe your research context or request details...': 'Descreva o contexto da sua pesquisa ou os detalhes da sua solicitação...',
    'DISPATCH MESSAGE': 'ENVIAR MENSAGEM',
    'Channels of Inquiry': 'Canais de Investigação',
    'ACADEMIC RESEARCH': 'PESQUISA ACADÊMICA',
    'CURATORIAL SERVICES': 'SERVIÇOS DE CURADORIA',
    'ETHICS &amp; LEGAL': 'ÉTICA E QUESTÕES LEGAIS',
    'Global Archives': 'Acervos Globais',
  },
  'api-documentation.html': {
    'Introduction': 'Introdução',
    'Getting Started': 'Primeiros Passos',
    'Authentication': 'Autenticação',
    'Rate Limits': 'Limites de Requisição',
    'Endpoints': 'Endpoints',
    'Stratigraphic Data': 'Dados Estratigráficos',
    'Fossil Taxonomy': 'Taxonomia Fóssil',
    'Site Locations': 'Locais de Sítio',
    'Media Assets': 'Ativos de Mídia',
    'Developer &amp; Researcher Integration': 'Integração para Desenvolvedores e Pesquisadores',
    'The Strata Archive API provides direct access to over 150 years of paleontological records, stratigraphic columns, and high-resolution micro-fossil scans.':
      'A API do Strata Archive oferece acesso direto a mais de 150 anos de registros paleontológicos, colunas estratigráficas e escaneamentos de microfósseis em alta resolução.',
    'To access the Petrobras Paleontology Division\'s archival data, all requests must be signed with a Bearer Token. Researchers can generate long-lived keys within the <a class="text-primary font-bold underline decoration-primary/30" href="#">Access Portal</a>.':
      'Para acessar os dados arquivísticos da Divisão de Paleontologia da Petrobras, todas as requisições devem ser assinadas com um Bearer Token. Pesquisadores podem gerar chaves de longa duração no <a class="text-primary font-bold underline decoration-primary/30" href="#">Portal de Acesso</a>.',
    'Stratigraphic Querying': 'Consulta Estratigráfica',
    'The core endpoint for searching historical geological layers. You can filter by basin, period, or fossil presence.':
      'Endpoint central para busca de camadas geológicas históricas. É possível filtrar por bacia, período ou presença de fósseis.',
    'Parameters': 'Parâmetros',
    'Response Schema': 'Esquema de Resposta',
  },
  'legal-notices.html': {
    'Institutional Framework': 'Estrutura Institucional',
    'Legal Notices &amp; Institutional Governance': 'Avisos Legais e Governança Institucional',
    'Formal declarations, regulatory compliance frameworks, and project registration details governing the Petrobras Paleontology Division and the Strata Archive initiative.':
      'Declarações formais, estruturas de conformidade regulatória e detalhes de registro do projeto que regem a Divisão de Paleontologia da Petrobras e a iniciativa Strata Archive.',
    'Registration No. 2024-PT-PALEO': 'Registro Nº 2024-PT-PALEO',
    'Official Project Registration': 'Registro Oficial do Projeto',
    'Institutional Entity': 'Entidade Institucional',
    'Legal Mandate': 'Base Legal',
    'Core Declarations': 'Declarações Centrais',
    'Regulatory Compliance': 'Conformidade Regulatória',
    'View Certifications': 'Ver Certificações',
    'Scientific Ethics Statement': 'Declaração de Ética Científica',
    'Read Protocol': 'Ler Protocolo',
    'Institutional Terms': 'Termos Institucionais',
    'Intellectual Property': 'Propriedade Intelectual',
    'Data Sovereignty': 'Soberania de Dados',
    'Researcher Liability': 'Responsabilidade do Pesquisador',
    'Supervisory Authorities': 'Autoridades Supervisoras',
  },
  'privacy-policy.html': {
    'Privacy Protocol': 'Protocolo de Privacidade',
    'Privacy &amp; Data Stewardship': 'Privacidade e Governança de Dados',
    'We protect institutional, scientific, and personal information with archival-grade controls and clear ethical boundaries.':
      'Protegemos informações institucionais, científicas e pessoais com controles de nível arquivístico e limites éticos claros.',
  },
  'terms-of-use.html': {
    'Usage Covenant': 'Pacto de Uso',
    'Terms of Use': 'Termos de Uso',
    'These terms govern how researchers, institutions, and visitors may access, interpret, and reuse the records hosted within PaleoPortal.':
      'Estes termos regem como pesquisadores, instituições e visitantes podem acessar, interpretar e reutilizar os registros hospedados no PaleoPortal.',
  },
  'dataset-access.html': {
    'Research Data Repository': 'Repositório de Dados de Pesquisa',
    'Dataset Access': 'Acesso a Dados',
    'Access curated geological, paleobiological, and metadata collections prepared for scientific review and computational analysis.':
      'Acesse coleções curadas de dados geológicos, paleobiológicos e metadados preparadas para revisão científica e análise computacional.',
  },
  'field-guides.html': {
    'Field Operations Library': 'Biblioteca de Operações de Campo',
    'Field Guides': 'Guias de Campo',
    'Protocols, route maps, and best practices for identifying, documenting, and preserving field discoveries.':
      'Protocolos, mapas de rota e boas práticas para identificar, documentar e preservar descobertas em campo.',
  },
  'about-us.html': {
    'Institutional Profile': 'Perfil Institucional',
    'About Us': 'Sobre Nós',
  },
  'partnerships.html': {
    'Collaborative Network': 'Rede Colaborativa',
    'Partnerships': 'Parcerias',
  },
  'petrobras-esg.html': {
    'Sustainability Framework': 'Estrutura de Sustentabilidade',
    'Petrobras ESG': 'Petrobras ESG',
  },
  'petrobras.html': {
    'Institutional Sponsor': 'Patrocinador Institucional',
    'Petrobras': 'Petrobras',
  },
  'region.html': {
    'Territorial Context': 'Contexto Territorial',
    'Region': 'Região',
  },
  'about.html': {
    'Our Institutional Purpose': 'Nosso Propósito Institucional',
  },
};

const studentPtReplacements: Record<string, TranslationMap> = {
  'wiki-de-estudos-paleontologicos.html': {
    'Archive Resource': 'Recurso do Acervo',
    'The Digital Stratigraphy of Paleontology': 'A Estratigrafia Digital da Paleontologia',
    'An curated encyclopedia for the modern archivist. Explore the interconnected disciplines that define our understanding of prehistoric life, from the microscopic structures of bone to the evolutionary trees of empires long extinct.':
      'Uma enciclopédia curada para o arquivista contemporâneo. Explore as disciplinas interligadas que moldam nossa compreensão da vida pré-histórica, das estruturas microscópicas do osso às árvores evolutivas de impérios há muito extintos.',
    'Phylogeny': 'Filogenia',
    'Taxonomy': 'Taxonomia',
    'Morphology': 'Morfologia',
    'Ichnology': 'Icnologia',
    'Explore Cladistics': 'Explorar Cladística',
    'Evolutionary Lineage': 'Linhagem Evolutiva',
    'The study of the evolutionary history and relationships among or within groups of organisms. It visualizes the "Tree of Life," mapping how species branched from common ancestors over millions of years through genetic and morphological evidence.':
      'Estudo da história evolutiva e das relações entre grupos de organismos. Visualiza a "Árvore da Vida", mapeando como as espécies se ramificaram a partir de ancestrais comuns ao longo de milhões de anos por evidências genéticas e morfológicas.',
    'The science of naming, defining, and classifying groups of biological organisms on the basis of shared characteristics.':
      'A ciência de nomear, definir e classificar grupos de organismos biológicos com base em características compartilhadas.',
    'Kingdom': 'Reino',
    'Phylum': 'Filo',
    'Class': 'Classe',
    'Examining the physical form and structure of organisms. In paleontology, this focuses on skeletal architecture, dental patterns, and functional adaptations to environment.':
      'Estudo da forma física e da estrutura dos organismos. Na paleontologia, isso se concentra na arquitetura esquelética, nos padrões dentários e nas adaptações funcionais ao ambiente.',
    'The branch of paleontology that deals with traces of organismal behavior, such as footprints, burrows, and trails. Unlike body fossils, ichnofossils provide direct evidence of prehistoric life\'s ethology.':
      'O ramo da paleontologia que lida com vestígios de comportamento orgânico, como pegadas, tocas e trilhas. Diferentemente dos fósseis corporais, os icnofósseis fornecem evidência direta da etologia da vida pré-histórica.',
    'Behavioral Archaeology': 'Arqueologia Comportamental',
    'Chronological Strata': 'Estratos Cronológicos',
    'View Timeline': 'Ver Linha do Tempo',
  },
  'acervo-digital-de-fosseis.html': {
    'Catalogue of the Deep Past': 'Catálogo do Passado Profundo',
    'Digital Fossil Archive': 'Acervo Digital de Fósseis',
    'Explore our high-fidelity stratigraphic collection. Our database provides detailed anatomical data, geological context, and interactive temporal mappings of life over 500 million years.':
      'Explore nossa coleção estratigráfica de alta fidelidade. Nosso acervo oferece dados anatômicos detalhados, contexto geológico e mapeamentos temporais interativos da vida ao longo de mais de 500 milhões de anos.',
    'Contribute Find': 'Contribuir Achado',
    'Filter': 'Filtrar',
    'Jurassic Period': 'Período Jurássico',
    'Rare Specimen': 'Espécime Raro',
    'Cambrian': 'Cambriano',
    'Eocene': 'Eoceno',
    'Carboniferous': 'Carbonífero',
  },
};

function applyReplacements(source: string, replacements: TranslationMap) {
  const entries = Object.entries(replacements).sort((a, b) => b[0].length - a[0].length);
  return entries.reduce((output, [from, to]) => output.replaceAll(from, to), source);
}

export function translateStitchContent(fileName: string, source: string, locale: SiteLocale) {
  if (locale !== 'pt-BR') {
    return source;
  }

  let translated = applyReplacements(source, commonPtReplacements);
  const pageMap = ptByFile[fileName];

  if (pageMap) {
    translated = applyReplacements(translated, pageMap);
  }

  const studentMap = studentPtReplacements[fileName];

  if (studentMap) {
    translated = applyReplacements(translated, studentMap);
  }

  return translated;
}
