import type { SiteLocale } from '@/lib/site-locale';

type TranslationMap = Record<string, string>;
type ProtectedSegment = {
  token: string;
  content: string;
};

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
    'Journal of Paleosciences': 'Revista de Paleociências',
    'Dr. Helena Silva, et al.': 'Dra. Helena Silva et al.',
    'Sept 2023': 'Set 2023',
    'Dec 2023': 'Dez 2023',
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
    'Headquarters &amp; Central Vault': 'Sede e Acervo Central',
    'Digital Stratigraphy Lab': 'Laboratório de Estratigrafia Digital',
    'Open to the Scholarly Community': 'Aberto à Comunidade Acadêmica',
    'Our main archive is accessible to accredited researchers from Monday to Friday, 09:00 — 17:00. Prior appointment via the digital portal is mandatory.':
      'Nosso acervo principal está acessível a pesquisadores credenciados de segunda a sexta, das 09:00 às 17:00. O agendamento prévio pelo portal digital é obrigatório.',
    'SCHEDULE VISIT': 'AGENDAR VISITA',
    'VIEW ON MAPS': 'VER NO MAPA',
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
    'Developer Resources': 'Recursos para Desenvolvedores',
    'Division Ethics': 'Ética da Divisão',
    'Certified Archive': 'Acervo Certificado',
    'Featured Collection': 'Coleção em Destaque',
    'The Jurassic Deep Sea': 'O Mar Profundo do Jurássico',
    'Python SDK v3.0': 'SDK Python v3.0',
    'Automate your research workflow with our native Python integration. Supports pandas and NumPy out of the box.':
      'Automatize seu fluxo de pesquisa com nossa integração nativa para Python. Compatível com pandas e NumPy desde a instalação.',
    'R Statistics': 'Estatísticas em R',
    'Direct plotting of stratigraphic columns for academic papers.':
      'Plotagem direta de colunas estratigráficas para artigos acadêmicos.',
    'View GitHub': 'Ver no GitHub',
    'Data access is granted strictly for scientific research and educational purposes. Commercial reuse is prohibited under international ethics standards.':
      'O acesso aos dados é concedido estritamente para pesquisa científica e fins educacionais. O reuso comercial é proibido pelos padrões internacionais de ética.',
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
    'Petrobras Paleontology Division (PPD), a specialized scientific unit dedicated to the preservation and study of stratigraphic records within the South Atlantic basin.':
      'Divisão de Paleontologia da Petrobras (PPD), unidade científica especializada dedicada à preservação e ao estudo de registros estratigráficos na bacia do Atlântico Sul.',
    'Authorized under the Federal Scientific Preservation Act, Section IV, maintaining the integrity of national geological heritage through digital archiving.':
      'Autorizado pela Lei Federal de Preservação Científica, Seção IV, mantendo a integridade do patrimônio geológico nacional por meio do arquivamento digital.',
    'Non-commercial scientific use of all archived fossil records.':
      'Uso científico não comercial de todos os registros fósseis arquivados.',
    'Ethical provenance verification for every registered specimen.':
      'Verificação ética de procedência para cada espécime registrado.',
    'Commitment to the Open Science Framework (OSF) guidelines.':
      'Compromisso com as diretrizes do Open Science Framework (OSF).',
    'Our archival procedures strictly adhere to ISO 14721:2012 (OAIS) for long-term digital preservation and ethical paleontology standards.':
      'Nossos procedimentos arquivísticos seguem rigorosamente a ISO 14721:2012 (OAIS) para preservação digital de longo prazo e padrões éticos da paleontologia.',
    'Review our protocols regarding the digitalization of sensitive archaeological sites.':
      'Consulte nossos protocolos sobre a digitalização de sítios arqueológicos sensíveis.',
    'Revised May 2024': 'Revisado em Maio de 2024',
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
    'Institutional Access': 'Acesso Institucional',
    'Geological Dataset <br/><span class="italic">Repository</span>': 'Repositório <br/><span class="italic">Geológico de Dados</span>',
    'A high-fidelity digital stratigraphy portal providing peer-reviewed geological, paleontological, and seismic datasets for the global scientific community.':
      'Um portal de estratigrafia digital de alta fidelidade que oferece conjuntos de dados geológicos, paleontológicos e sísmicos revisados por pares para a comunidade científica global.',
    'Total Archive Size': 'Tamanho Total do Acervo',
    'Santos Basin High-Res Seismic Cube': 'Cubo Sísmico de Alta Resolução da Bacia de Santos',
    'Complete 3D seismic volume covering the pre-salt layers with high-resolution depth migration and stratigraphy mapping.':
      'Volume sísmico 3D completo cobrindo as camadas do pré-sal com migração em profundidade de alta resolução e mapeamento estratigráfico.',
    'Request Dataset': 'Solicitar Conjunto de Dados',
    'Recent Scientific Releases': 'Lançamentos Científicos Recentes',
    'Lagerstätte Data • 42GB': 'Dados de Lagerstätte • 42GB',
    'Spatial Dataset • 8.2GB': 'Conjunto Espacial • 8.2GB',
    'Time Series • 115GB': 'Séries Temporais • 115GB',
    'Ethics &amp; Compliance': 'Ética e Conformidade',
    'All research datasets comply with the 2024 Petrobras Paleontology Division ethics guidelines.':
      'Todos os conjuntos de dados de pesquisa seguem as diretrizes éticas de 2024 da Divisão de Paleontologia da Petrobras.',
    'HPC Integration': 'Integração com HPC',
    'Direct stream available for authorized High-Performance Computing clusters at partner universities.':
      'Fluxo direto disponível para clusters autorizados de Computação de Alto Desempenho nas universidades parceiras.',
    'Institutional Access <span class="italic">Request</span>': 'Solicitação de <span class="italic">Acesso Institucional</span>',
    'Submit your research proposal to the division board for full archive access. Approvals typically take 5-7 business days.':
      'Envie sua proposta de pesquisa para o conselho da divisão para obter acesso completo ao acervo. As aprovações costumam levar de 5 a 7 dias úteis.',
    'Verify Institutional Email': 'Verifique o E-mail Institucional',
    'Requests must originate from .edu or .gov domains.':
      'As solicitações devem partir de domínios .edu ou .gov.',
    'Upload Research Abstract': 'Envie o Resumo da Pesquisa',
    'Provide a clear objective for the requested data.':
      'Apresente um objetivo claro para os dados solicitados.',
    'Uptime': 'Disponibilidade',
    'Latency': 'Latência',
  },
  'field-guides.html': {
    'Field Operations Library': 'Biblioteca de Operações de Campo',
    'Field Guides': 'Guias de Campo',
    'Protocols, route maps, and best practices for identifying, documenting, and preserving field discoveries.':
      'Protocolos, mapas de rota e boas práticas para identificar, documentar e preservar descobertas em campo.',
    'Field Methodologies': 'Metodologias de Campo',
    'Practical Guides for Bacia do Amazonas': 'Guias Práticos para a Bacia do Amazonas',
    'A curated repository of stratigraphic protocols and paleontological field standards developed specifically for the complex sedimentary environments of the Amazon Basin.':
      'Um repositório curado de protocolos estratigráficos e padrões paleontológicos de campo desenvolvidos especificamente para os ambientes sedimentares complexos da Bacia Amazônica.',
    'Location Context': 'Contexto Geográfico',
    'Coordinates': 'Coordenadas',
    'Era': 'Era',
    'Primary Reference': 'Referência Principal',
    'Integrated Stratigraphic Mapping: Solimões Formation': 'Mapeamento Estratigráfico Integrado: Formação Solimões',
    'Comprehensive field guide covering facies analysis, sequence stratigraphy, and chronostratigraphic markers unique to the Neogene deposits of Western Amazonia. Includes high-resolution type-section logs.':
      'Guia de campo abrangente sobre análise de fácies, estratigrafia de sequências e marcadores cronoestratigráficos exclusivos dos depósitos neógenos da Amazônia Ocidental. Inclui perfis de seção-tipo em alta resolução.',
    'Version 4.2': 'Versão 4.2',
    '84 Pages': '84 Páginas',
    'Download PDF (12MB)': 'Baixar PDF (12MB)',
    'Micropaleontology Collection Protocol': 'Protocolo de Coleta Micropaleontológica',
    'Standardized methods for sediment sampling and on-site processing of palynomorphs and ostracods in fluvial-lacustrine settings.':
      'Métodos padronizados para amostragem de sedimentos e processamento em campo de palinomorfos e ostracodes em ambientes flúvio-lacustres.',
    'Access Guide': 'Acessar Guia',
    'Logistics &amp; Safety: Remote Basin Survey': 'Logística e Segurança: Levantamento em Bacia Remota',
    'Essential operational framework for researchers working in the deep Juruá and Javari sub-basins. Includes river navigation safety.':
      'Estrutura operacional essencial para pesquisadores que atuam nas sub-bacias profundas do Juruá e do Javari. Inclui segurança para navegação fluvial.',
    'Scientific Ethics &amp; Licensing': 'Ética Científica e Licenciamento',
    'Legal requirements for fossil collection and transport under Brazilian National Mining Agency (ANM) regulations.':
      'Exigências legais para coleta e transporte de fósseis conforme as regulamentações da Agência Nacional de Mineração (ANM).',
    'Review Legal Terms': 'Revisar Termos Legais',
    'Latest Update': 'Atualização Mais Recente',
    'Devonian Biostratigraphy Update': 'Atualização da Bioestratigrafia Devoniana',
    'Revision of the Maecuru and Ererê formations taxonomy.':
      'Revisão da taxonomia das formações Maecuru e Ererê.',
    'Download PDF': 'Baixar PDF',
  },
  'about-us.html': {
    'Institutional Profile': 'Perfil Institucional',
    'About Us': 'Sobre Nós',
    'INSTITUTIONAL FOUNDATIONS': 'FUNDAMENTOS INSTITUCIONAIS',
    'Unearthing the <br/><span class="italic text-primary">Hidden Narrative</span>': 'Revelando a <br/><span class="italic text-primary">Narrativa Oculta</span>',
    'Strata Archive is a multidisciplinary repository dedicated to the preservation and digital dissemination of paleontological findings from the South American lithosphere.':
      'O Strata Archive é um repositório multidisciplinar dedicado à preservação e à difusão digital de descobertas paleontológicas da litosfera sul-americana.',
    'A Legacy in <br/>Sediment.': 'Um Legado em <br/>Sedimento.',
    'The project began in 1994 as a collaboration between the Petrobras Paleontology Division and federal research institutions, aiming to catalog deep-well microfossils.':
      'O projeto começou em 1994 como uma colaboração entre a Divisão de Paleontologia da Petrobras e instituições federais de pesquisa, com o objetivo de catalogar microfósseis de poços profundos.',
    'ESTABLISHED': 'FUNDADO',
    'May 12, 1994': '12 de Maio de 1994',
    'The Early Surveys': 'Os Primeiros Levantamentos',
    'Pioneering offshore exploration led to the discovery of unprecedented fossilized remains in the pre-salt layers, sparking the need for a unified digital archive.':
      'A exploração pioneira offshore levou à descoberta de vestígios fossilizados sem precedentes nas camadas do pré-sal, despertando a necessidade de um acervo digital unificado.',
    'RECOGNITION': 'RECONHECIMENTO',
    'Digital Renaissance': 'Renascença Digital',
    'In 2012, we transitioned to high-resolution 3D photogrammetry, allowing researchers worldwide to interact with physical artifacts virtually.':
      'Em 2012, fizemos a transição para a fotogrametria 3D de alta resolução, permitindo que pesquisadores do mundo inteiro interagissem virtualmente com artefatos físicos.',
    'Our Mission is to bridge the gap between ancient biological history and modern scientific insight.':
      'Nossa missão é aproximar a história biológica antiga do conhecimento científico contemporâneo.',
    'PRESERVATION': 'PRESERVAÇÃO',
    'OPEN SCIENCE': 'CIÊNCIA ABERTA',
    'EDUCATION': 'EDUCAÇÃO',
    'THE CURATORS': 'A CURADORIA',
    'Research Faculty': 'Corpo de Pesquisa',
    'Meet the experts leading the exploration of our geological past across South America\'s diverse strata.':
      'Conheça os especialistas que lideram a exploração do nosso passado geológico pelos diversos estratos da América do Sul.',
  },
  'partnerships.html': {
    'Collaborative Network': 'Rede Colaborativa',
    'Partnerships': 'Parcerias',
    'Institutional Network': 'Rede Institucional',
    'Global Academic Alliances': 'Aliancas Academicas Globais',
    'The Strata Archive operates as a collaborative nexus between Petrobras Paleontology Division and the world\'s leading research institutions. Our partnerships ensure the rigorous preservation and scholarly analysis of geological history.':
      'O Strata Archive opera como um nucleo colaborativo entre a Divisao de Paleontologia da Petrobras e instituicoes de pesquisa de referencia mundial. Nossas parcerias garantem a preservacao rigorosa e a analise academica da historia geologica.',
    'Strategic Collaborators': 'Colaboradores Estrategicos',
    'Federal University of Rio de Janeiro': 'Universidade Federal do Rio de Janeiro',
    'Our primary academic partner for over three decades, focusing on Mesozoic stratigraphy and coastal sedimentology. This collaboration includes shared laboratory access and joint PhD programs.':
      'Nossa principal parceira academica ha mais de tres decadas, com foco em estratigrafia mesozoica e sedimentologia costeira. Essa colaboracao inclui acesso laboratorial compartilhado e programas conjuntos de doutorado.',
    'Strategic Partner': 'Parceiro Estrategico',
    'Brazil': 'Brasil',
    'Collaborative digitization of the Brazilian South Atlantic fossil collection, enabling remote research capabilities.':
      'Digitalizacao colaborativa da colecao fossilifera do Atlantico Sul brasileiro, viabilizando pesquisa remota.',
    'Joint research in molecular geochemistry and sedimentary modeling.':
      'Pesquisa conjunta em geoquimica molecular e modelagem sedimentar.',
    'A Borderless Scientific Network': 'Uma Rede Cientifica Sem Fronteiras',
    'Strata Archive maintains nodes of excellence across four continents. Each partner university provides localized expertise that enriches our global understanding of paleontology and geology.':
      'O Strata Archive mantem nucleos de excelencia em quatro continentes. Cada universidade parceira oferece conhecimento localizado que amplia nossa compreensao global da paleontologia e da geologia.',
    'South America Hub': 'Polo da America do Sul',
    'Led by Petrobras and UFRJ, focusing on Pre-Salt basins.':
      'Liderado pela Petrobras e pela UFRJ, com foco em bacias do Pre-Sal.',
    'European Research Axis': 'Eixo de Pesquisa Europeu',
    'Focusing on carbonate reservoirs and microbialites.':
      'Voltado a reservatorios carbonaticos e microbialitos.',
    'Live Connections': 'Conexoes Ativas',
    'Paleo-climate Simulation': 'Simulacao Paleoclimatica',
    'Patagonian Paleofauna': 'Paleofauna Patagonica',
    'Micro-tomography Hub': 'Polo de Microtomografia',
    'Supporting Institutions': 'Instituicoes de Apoio',
    'Public and private entities that provide funding, ethical oversight, and logistical support for our field expeditions.':
      'Entidades publicas e privadas que oferecem financiamento, supervisao etica e apoio logistico para nossas expedicoes de campo.',
    'Apply for Partnership': 'Candidatar-se a Parceria',
    'Academic Development': 'Desenvolvimento Academico',
    'Research Council': 'Conselho de Pesquisa',
    'Regional Funding': 'Fomento Regional',
    'Museum Collection': 'Colecao Museologica',
    'Environmental Ethics': 'Etica Ambiental',
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
    'Regional Exploration': 'Exploração Regional',
    'Santarém &amp; The Monte Alegre Dome': 'Santarém e o Domo de Monte Alegre',
    'Unveiling the structural complexities of the Middle Amazon Basin, where Devonian and Carboniferous strata converge in a unique geological uplift.':
      'Revelando as complexidades estruturais da Bacia Amazônica Central, onde estratos devonianos e carboníferos convergem em um soerguimento geológico singular.',
    'Mapping Coordination': 'Coordenação Cartográfica',
    'The Central Amazon Uplift Axis': 'O Eixo de Soerguimento da Amazônia Central',
    'Lithic Architecture': 'Arquitetura Lítica',
    'Phanerozoic Eon': 'Éon Fanerozoico',
    'The Carboniferous Formation': 'A Formação Carbonífera',
    'The Monte Alegre region is defined by the Tapajós Group. This sequence represents a significant marine transgression event, depositing limestone, dolomite, and evaporites that now serve as critical stratigraphic markers for the Late Paleozoic.':
      'A região de Monte Alegre é definida pelo Grupo Tapajós. Essa sequência representa um importante evento de transgressão marinha, responsável pelo depósito de calcário, dolomito e evaporitos que hoje servem como marcadores estratigráficos críticos do Paleozóico Superior.',
    'Chronostratigraphic Depth': 'Profundidade Cronoestratigráfica',
    'Structural Feature': 'Feição Estrutural',
    'Domes': 'Domos',
    'Itaituba Formation': 'Formação Itaituba',
    'Renowned for its fossiliferous richness, containing diverse brachiopod and fusulinid assemblages.':
      'Reconhecida por sua riqueza fossilífera, com assembléias diversas de braquiópodes e fusulinídeos.',
    'Crinoid Fragments': 'Fragmentos de Crinoides',
    'Bryozoan Colonies': 'Colônias de Briozoários',
    'Chonetes Faunules': 'Faúnulas de Chonetes',
    'Catalog Highlights': 'Destaques do Catálogo',
    'The Monte Alegre Biota': 'A Biota de Monte Alegre',
    '"A remarkably preserved Orthotetes specimen found in the basal silts of the dome\'s northern flank."':
      '"Um espécime de Orthotetes notavelmente preservado, encontrado nos siltes basais do flanco norte do domo."',
    'These highlights represent the transition from the Devonian Curuá Group to the Carboniferous sequence. The fossils act as biological clocks, pinning the exact moment the Amazonian interior shifted from open sea to restricted saline basins.':
      'Esses destaques representam a transição do Grupo Curuá, do Devoniano, para a sequência carbonífera. Os fósseis funcionam como relógios biológicos, marcando o momento exato em que o interior amazônico passou de mar aberto para bacias salinas restritas.',
    'View Full Collection': 'Ver Coleção Completa',
    'Structural Evolution': 'Evolução Estrutural',
    'The Santarém region is not merely a collection of fossils, but a testament to the tectonic forces that shaped the South American continent.':
      'A região de Santarém não é apenas uma coleção de fósseis, mas um testemunho das forças tectônicas que moldaram o continente sul-americano.',
    'The Tectonic Uplift': 'O Soerguimento Tectônico',
    'The Monte Alegre Dome is a classic example of a salt-assisted structural uplift. Neopaleozoic evaporites from the Nova Olinda Formation migrated vertically, piercing the overlying strata and creating the characteristic circular geometry observed today.':
      'O Domo de Monte Alegre é um exemplo clássico de soerguimento estrutural assistido por sal. Evaporitos neopaleozóicos da Formação Nova Olinda migraram verticalmente, perfurando os estratos sobrejacentes e criando a geometria circular característica observada hoje.',
    'Stratigraphic Piercing Mechanism': 'Mecanismo de Perfuração Estratigráfica',
    'Erosional Windows': 'Janelas Erosivas',
    'Continuous erosion of the dome\'s crest has provided geologists with an "erosional window," exposing deep-seated Devonian shales that would otherwise remain thousands of meters beneath the Amazonian floodplain.':
      'A erosão contínua da crista do domo proporcionou aos geólogos uma "janela erosiva", expondo folhelhos devonianos profundos que de outra forma permaneceriam a milhares de metros sob a planície de inundação amazônica.',
    'Natural Vertical Sectioning': 'Seccionamento Vertical Natural',
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
    'Paleozoic': 'Paleozoico',
    'Mesozoic': 'Mesozoico',
    'Cenozoic': 'Cenozoico',
    'Study Methodology': 'Metodologia de Estudo',
    'Field Excavation': 'Escavação de Campo',
    'Isotopic Analysis': 'Análise Isotópica',
    '3D Photogrammetry': 'Fotogrametria 3D',
    'Confidential Research Material • Educational Access Only': 'Material confidencial de pesquisa • Acesso apenas educacional',
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
    'Jurassic Explorer': 'Explorador Jurássico',
    'Geological Context': 'Contexto Geológico',
    'Chronological Position': 'Posição Cronológica',
  },
};

function applyReplacements(source: string, replacements: TranslationMap) {
  const entries = Object.entries(replacements).sort((a, b) => b[0].length - a[0].length);
  return entries.reduce((output, [from, to]) => output.replaceAll(from, to), source);
}

function protectSegments(source: string, pattern: RegExp, transform?: (match: string) => string) {
  const segments: ProtectedSegment[] = [];
  let index = 0;

  const protectedSource = source.replace(pattern, (match) => {
    const token = `__STITCH_PROTECTED_${index++}__`;
    segments.push({
      token,
      content: transform ? transform(match) : match,
    });
    return token;
  });

  return { protectedSource, segments };
}

function restoreSegments(source: string, segments: ProtectedSegment[]) {
  return segments.reduce((output, segment) => output.replace(segment.token, segment.content), source);
}

function ensureMaterialSymbolDataIcon(match: string) {
  return match.replace(
    /<span([^>]*class="[^"]*material-symbols-outlined[^"]*"[^>]*)>([\s\S]*?)<\/span>/i,
    (_full, attrs: string, rawIcon: string) => {
      const icon = rawIcon.trim();
      const hasDataIcon = /data-icon=/i.test(attrs);
      const finalAttrs = hasDataIcon ? attrs : `${attrs} data-icon="${icon}"`;
      return `<span${finalAttrs}>${icon}</span>`;
    },
  );
}

export function translateStitchContent(fileName: string, source: string, locale: SiteLocale) {
  if (locale !== 'pt-BR') {
    return source;
  }

  const protectedCode = protectSegments(source, /<pre[\s\S]*?<\/pre>/gi);
  const protectedIcons = protectSegments(
    protectedCode.protectedSource,
    /<span[^>]*class="[^"]*material-symbols-outlined[^"]*"[^>]*>[\s\S]*?<\/span>/gi,
    ensureMaterialSymbolDataIcon,
  );

  let translated = applyReplacements(protectedIcons.protectedSource, commonPtReplacements);
  const pageMap = ptByFile[fileName];

  if (pageMap) {
    translated = applyReplacements(translated, pageMap);
  }

  const studentMap = studentPtReplacements[fileName];

  if (studentMap) {
    translated = applyReplacements(translated, studentMap);
  }

  translated = restoreSegments(translated, protectedIcons.segments);
  translated = restoreSegments(translated, protectedCode.segments);

  return translated;
}
