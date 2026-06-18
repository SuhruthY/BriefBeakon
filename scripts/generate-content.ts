import { readFileSync, writeFileSync, mkdirSync, existsSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const configPath = join(__dirname, '..', 'config', 'briefbeacon.json');
const config = JSON.parse(readFileSync(configPath, 'utf-8'));

interface SourceLink {
  title: string;
  url: string;
  domain: string;
}

interface Article {
  slug: string;
  title: string;
  summary: string;
  category: string;
  publication_date: string;
  author: string;
  content: string;
  word_count: number;
  key_takeaways: string[];
  public_sentiment: string;
  impact_analysis: string;
  future_outlook: string;
  tags: string[];
  source_links: SourceLink[];
  meta_description: string;
  keywords: string[];
  source_url: string;
  source_name: string;
  sentiment_score: number;
  status: string;
}

interface MovieReport {
  id: string;
  title: string;
  slug: string;
  year: number;
  overall_sentiment: string;
  what_viewers_liked: string[];
  common_criticisms: string[];
  ai_verdict: string;
  watch_recommendation: string;
  critic_score: number;
  audience_score: number;
  publication_date: string;
  tags: string[];
}

const CATEGORY_DATA: Record<string, {
  headlines: string[];
  intros: string[];
  bodies: string[];
  conclusions: string[];
  takeaways: string[];
  sentiments: string[];
  impacts: string[];
  outlooks: string[];
  tags: string[];
  sources: { title: string; domain: string; path: string }[];
  keywords: string[];
}> = {
  ai: {
    headlines: [
      'OpenAI Unveils GPT-5 with Breakthrough Reasoning Capabilities',
      'DeepMind\'s New AI Solves Decade-Old Biology Problem, Opening Doors to New Medicines',
      'Meta Releases Open-Source LLM Challenging GPT-4 Performance — and It\'s Free',
      'Global Leaders Adopt First-Ever AI Regulation Framework at G20 Summit',
      'Self-Driving Taxis Go Mainstream: Autonomous Fleet Launches in 12 Major Cities',
      'New AI Model Can Predict Protein Structures in Minutes, Accelerating Drug Discovery',
      'AI-Powered Personal Assistants Reach Human-Level Conversation, Industry Says',
      'Healthcare AI Diagnoses Rare Diseases Faster Than Specialists in Landmark Trial',
    ],
    intros: [
      'In a landmark development that is sending ripples across the technology industry, researchers and engineers have achieved what many experts considered years away. The breakthrough promises to fundamentally reshape how we interact with intelligent systems, from everyday applications to cutting-edge scientific research. Industry analysts are calling it a watershed moment for artificial intelligence, with implications that extend far beyond the tech sector into healthcare, education, manufacturing, and virtually every other domain of human endeavor.',
      'The artificial intelligence landscape has undergone yet another seismic shift with the latest announcement from leading research laboratories. What makes this development particularly significant is not just the technical achievement itself, but the speed at which it has arrived. Just months ago, similar capabilities were considered theoretical. Today, they are being deployed in production systems serving millions of users worldwide, marking an acceleration in AI development that has caught even seasoned industry observers by surprise.',
    ],
    bodies: [
      'According to detailed technical papers published alongside the announcement, the new system represents a fundamental departure from previous approaches to AI architecture. Instead of simply scaling up existing models, researchers developed a novel neural network design that achieves superior performance with significantly fewer computational resources. This efficiency breakthrough could democratize access to advanced AI capabilities, allowing smaller organizations and developing nations to leverage state-of-the-art technology without requiring massive infrastructure investments.',
      'The implications for businesses are profound and immediate. Companies across sectors are already scrambling to understand how this technology can be integrated into their operations. Customer service, supply chain management, product design, and marketing are among the areas expected to see the most significant transformations. Early adopters report efficiency improvements of 30-50% in knowledge work tasks, with error rates dropping substantially compared to previous-generation systems.',
      'However, the rapid advancement has also reignited debates about AI safety and governance. Ethics researchers point out that as systems become more capable, the potential for misuse grows correspondingly. Several prominent AI safety organizations have published open letters calling for robust testing protocols before deployment in sensitive applications. The debate highlights the tension between innovation speed and responsible development that continues to define the AI industry.',
      'Regulatory bodies worldwide are taking notice. The European Union\'s AI Act, already in implementation, is being updated to account for these new capabilities. Meanwhile, the United States has proposed a new framework for AI oversight that emphasizes industry self-regulation while maintaining the option for stronger measures if needed. China has announced its own set of guidelines focusing on alignment with socialist values and national security considerations.',
      'Market response has been overwhelmingly positive, with AI-related stocks reaching new highs. Investment in AI startups has surged past previous records, with venture capital firms deploying unprecedented amounts of capital. The chip manufacturing sector, particularly companies producing specialized AI processors, has seen particularly strong demand as the infrastructure buildout continues at an accelerating pace.',
      'Educational institutions are racing to adapt their curricula to prepare students for an AI-driven economy. Universities report surging enrollment in computer science and data science programs, while bootcamps and online learning platforms have seen explosive growth in AI-related courses. The demand for AI talent far exceeds supply, creating significant salary premiums for skilled professionals.',
    ],
    conclusions: [
      'As this technology continues to evolve, one thing is clear: the AI revolution is not coming — it is already here. Organizations that fail to adapt risk being left behind, while those that embrace the change stand to gain unprecedented advantages. The next few years will be critical in determining how this powerful technology shapes our world, and the decisions made today by developers, businesses, and policymakers will echo for generations to come.',
      'The path forward requires careful balance between innovation and responsibility. While the potential benefits are enormous, so too are the risks if development proceeds without adequate safeguards. The coming months will be crucial as stakeholders across society work to establish the norms, regulations, and best practices that will govern AI deployment for years to come.',
    ],
    takeaways: [
      'AI capabilities are advancing faster than regulatory frameworks can adapt, creating both opportunities and challenges for businesses and governments alike',
      'Open-source AI models are democratizing access to cutting-edge technology, enabling smaller players to compete with tech giants',
      'Industry leaders emphasize the need for responsible AI development, with safety considerations becoming a central focus',
      'Investment in AI infrastructure reached record levels this quarter, signaling strong market confidence in the technology\'s trajectory',
      'Cross-border collaboration on AI safety standards is increasing, though geopolitical tensions complicate unified approaches',
      'The talent gap in AI continues to widen, with demand for skilled professionals far outstripping supply',
    ],
    sentiments: [
      'Public reaction has been overwhelmingly positive across social media platforms, with the announcement trending on multiple networks for over 24 hours. Technology enthusiasts and early adopters express excitement about the possibilities, while industry experts call for measured, thoughtful adoption. The general sentiment reflects a sense that we are witnessing a genuinely historic moment in technological evolution.',
      'The response from the technical community has been particularly noteworthy. On platforms like Hacker News, Reddit\'s r/MachineLearning, and specialized AI forums, discussion has focused on both the technical achievements and the societal implications. While there is broad enthusiasm for the capabilities demonstrated, there is also robust debate about deployment timelines, safety considerations, and equitable access to the technology.',
    ],
    impacts: [
      'This development is expected to fundamentally reshape the technology industry, creating unprecedented opportunities while simultaneously disrupting established players. Market analysts project that the economic impact could reach hundreds of billions of dollars annually within five years, affecting sectors from healthcare and education to manufacturing and entertainment. The competitive dynamics of entire industries may be rewritten as AI capabilities become a central differentiator.',
      'The implications extend far beyond the technology sector itself. Healthcare delivery could be transformed through improved diagnostics and personalized treatment plans. Education systems might be reinvented through adaptive learning platforms. Scientific research could accelerate dramatically as AI assists in hypothesis generation and experimental design. The ripple effects are likely to touch virtually every aspect of modern life.',
    ],
    outlooks: [
      'Looking ahead, experts predict continued acceleration in AI capabilities, with several major announcements expected from both established players and emerging startups in the coming months. The competitive landscape is becoming increasingly dynamic, with traditional tech companies, dedicated AI labs, and well-funded startups all vying for leadership positions. International collaboration on safety standards and best practices is expected to intensify, though geopolitical considerations may complicate these efforts.',
      'The next 12 to 18 months are expected to bring significant developments as the technology continues to mature and adoption scales across industries. Market consolidation is anticipated as successful companies scale while others struggle to keep pace. Regulatory frameworks will likely evolve rapidly as policymakers gain a deeper understanding of both the capabilities and risks associated with advanced AI systems.',
    ],
    tags: ['artificial-intelligence', 'machine-learning', 'deep-learning', 'AI-safety', 'technology-innovation', 'digital-transformation', 'future-of-work', 'AI-regulation', 'neural-networks', 'responsible-AI'],
    sources: [
      { title: 'OpenAI Blog - Latest Research', domain: 'openai.com', path: '/blog/research-update' },
      { title: 'Nature - AI Research Journal', domain: 'nature.com', path: '/articles/ai-breakthrough-2026' },
      { title: 'MIT Technology Review', domain: 'technologyreview.com', path: '/section/artificial-intelligence' },
      { title: 'arXiv - Machine Learning Papers', domain: 'arxiv.org', path: '/list/cs.AI/recent' },
      { title: 'Stanford AI Index Report', domain: 'hai.stanford.edu', path: '/ai-index/2026' },
    ],
    keywords: ['AI breakthrough', 'machine learning advances', 'artificial intelligence news', 'GPT-5', 'AI regulation', 'deep learning', 'neural networks', 'AI safety', 'responsible AI development'],
  },
  technology: {
    headlines: [
      'Apple Vision Pro 2 Ships With Half the Weight and Double the Battery Life',
      'TSMC Begins Mass Production of 1nm Chips, Ushering in New Era of Computing',
      'Quantum Computer Achieves First Error-Corrected Million-Qubit Milestone',
      'Starlink Reaches 10 Million Subscribers Globally, Transforms Rural Connectivity',
      'World\'s First Fully 3D-Printed Bridge Opens in Amsterdam, Showcasing Construction Innovation',
      'New Solid-State Battery Promises 1000km EV Range, Charging in 15 Minutes',
    ],
    intros: [
      'The technology world is witnessing what industry experts describe as a perfect storm of innovation, with breakthroughs across multiple domains arriving simultaneously. From quantum computing to battery technology, the pace of advancement has accelerated to unprecedented levels, creating both opportunities and challenges for businesses, consumers, and policymakers navigating this rapidly evolving landscape.',
      'In what analysts are calling a golden age of innovation, multiple technology sectors are experiencing simultaneous breakthroughs that promise to reshape daily life, industrial processes, and global economic patterns. The convergence of advances in computing, communications, and materials science is creating synergies that amplify the impact of each individual development.',
    ],
    bodies: [
      'Semiconductor manufacturing has reached a new milestone with the commencement of mass production at the 1nm process node. This achievement, long considered the physical limit of silicon-based computing, represents years of research and billions of dollars in investment. The new chips offer dramatically improved performance and energy efficiency compared to current generation processors, enabling more powerful mobile devices, longer battery life, and new categories of computing applications.',
      'The implications for the broader technology ecosystem are substantial. Cloud computing providers will be able to offer more powerful services at lower costs. Edge devices will gain capabilities previously reserved for data center hardware. Perhaps most significantly, the energy efficiency gains align perfectly with growing sustainability requirements, as data centers and computing infrastructure account for an increasing share of global electricity consumption.',
      'Quantum computing, meanwhile, has achieved a long-sought milestone with the demonstration of a fully error-corrected million-qubit system. This breakthrough moves quantum computing from the realm of experimental physics toward practical application. Early use cases in drug discovery, financial modeling, and climate simulation are already being explored by pioneering organizations that have gained access to these systems through cloud platforms.',
      'The connectivity landscape continues to transform as satellite internet constellations expand their reach. The latest generation of low-Earth orbit satellites offers dramatically improved bandwidth and latency compared to earlier systems, making high-speed internet access available in previously unserved and underserved regions. This connectivity revolution has profound implications for education, healthcare, and economic development in rural and remote areas.',
      'Battery technology has seen perhaps the most consumer-visible advances. The new generation of solid-state batteries promises to address the range and charging time concerns that have limited electric vehicle adoption. Major automotive manufacturers have announced production timelines for vehicles equipped with this technology, with some promising delivery within the next year. The implications extend beyond transportation to grid-scale energy storage, where improved batteries could accelerate the transition to renewable energy sources.',
    ],
    conclusions: [
      'The convergence of these technologies is creating possibilities that seemed like science fiction just a few years ago. As computing power increases exponentially, connectivity becomes ubiquitous, and energy storage improves dramatically, the foundation is being laid for innovations that we can scarcely imagine today. The challenge for businesses and policymakers will be to harness these technologies effectively while managing the disruptions they will inevitably cause.',
      'For consumers, the message is clear: the devices and services we use today will seem primitive within a few years. The pace of change is accelerating, and staying informed about technological developments is becoming increasingly important for making sound decisions about purchases, careers, and investments.',
    ],
    takeaways: [
      'Semiconductor manufacturing at 1nm represents a monumental engineering achievement with far-reaching implications for all computing-dependent industries',
      'Quantum computing is transitioning from research to practical application, with early use cases emerging in pharmaceuticals, finance, and climate science',
      'Satellite internet is bridging the digital divide, bringing high-speed connectivity to rural and remote areas globally',
      'Solid-state battery technology promises to revolutionize electric vehicles and renewable energy storage',
      'The convergence of multiple technology advances is creating exponential rather than linear progress',
    ],
    sentiments: [
      'Technology enthusiasts and early adopters are expressing unprecedented optimism about the current pace of innovation. Social media discussions highlight the sense of living through a transformative era, with many drawing comparisons to the early days of the internet. However, some voices express concern about the societal implications of such rapid change, particularly regarding employment displacement and digital divides.',
      'Industry analysts are broadly positive in their assessments, though they caution that realizing the full potential of these technologies will require significant investment in infrastructure, education, and regulatory frameworks. The consensus view is that we are entering a period of transformation comparable to the Industrial Revolution in its scope and impact.',
    ],
    impacts: [
      'The cumulative impact of these technological advances is expected to be transformative across virtually every sector of the economy. Manufacturing will become more efficient through better automation and supply chain optimization. Healthcare will benefit from more powerful computing for drug discovery and personalized medicine. Transportation will be revolutionized by electric vehicles with practical ranges and autonomous driving capabilities enabled by improved sensors and processing.',
      'The economic implications are staggering. Analysts project that the technologies described could add trillions of dollars to global GDP over the coming decade. However, the benefits are unlikely to be evenly distributed, raising important questions about economic inequality, workforce displacement, and the need for social safety nets and retraining programs.',
    ],
    outlooks: [
      'The technology sector is poised for continued rapid advancement, with several breakthrough developments expected in the near term. The competitive landscape is intensifying as companies race to commercialize new technologies and capture market share. Strategic partnerships and acquisitions are expected to accelerate as organizations seek to build comprehensive capabilities across multiple technology domains.',
      'Looking further ahead, the next five years are likely to bring developments that are difficult to predict with confidence. The pace of change makes forecasting increasingly challenging, but the direction of travel is clear: technology will become more powerful, more ubiquitous, and more integrated into every aspect of daily life.',
    ],
    tags: ['semiconductor', 'quantum-computing', 'battery-technology', 'satellite-internet', '5G', 'innovation', 'tech-trends', 'digital-infrastructure', 'renewable-energy', 'smart-cities'],
    sources: [
      { title: 'IEEE Spectrum - Technology News', domain: 'spectrum.ieee.org', path: '/tech-news' },
      { title: 'Wired - Tech Innovation', domain: 'wired.com', path: '/category/innovation' },
      { title: 'The Verge - Tech News', domain: 'theverge.com', path: '/tech' },
      { title: 'Ars Technica', domain: 'arstechnica.com', path: '/technology' },
      { title: 'TechCrunch - Startup News', domain: 'techcrunch.com', path: '/startups' },
    ],
    keywords: ['technology news', 'tech innovation', 'semiconductor', 'quantum computing', 'solid state battery', 'satellite internet', '1nm chip', 'future technology'],
  },
  business: {
    headlines: [
      'Global Markets Rally as Inflation Drops to 2% Target for First Time in Years',
      'Nvidia Becomes First Trillion-Dollar Chip Company, Signaling AI Era Dominance',
      'Central Banks Launch Digital Currency Pilot Programs Across 20 Nations',
      'Remote Work Revolution: 40% of Fortune 500 Companies Now Fully Distributed',
      'Green Energy Investments Surpass Oil and Gas for the First Time in History',
      'Landmark Trade Deal Signed Between US, EU, and India, Reshaping Global Commerce',
      'Startup Ecosystem Sees Record Funding as Venture Capital Returns to Growth',
    ],
    intros: [
      'The global economic landscape is undergoing a profound transformation as multiple trends converge to reshape markets, industries, and the nature of work itself. From monetary policy shifts to technological disruption, the forces at play are creating both unprecedented opportunities and significant challenges for businesses, investors, and workers navigating this complex environment.',
      'Business leaders and economists are describing the current period as one of the most dynamic and unpredictable in modern economic history. The post-pandemic recovery has given way to a new era defined by technological acceleration, shifting work patterns, and evolving consumer behaviors that are fundamentally altering the competitive landscape across industries.',
    ],
    bodies: [
      'Financial markets have responded enthusiastically to the latest economic data, which shows inflation finally reaching the 2% target that central banks have pursued for years. This milestone marks the end of one of the most aggressive monetary tightening cycles in history and opens the door for potential interest rate cuts that could stimulate further economic growth. Bond markets have already begun pricing in lower rates, with yields declining across major economies.',
      'The technology sector continues to outperform, with companies specializing in artificial intelligence and semiconductor manufacturing leading the charge. Nvidia\'s ascent to a trillion-dollar market capitalization symbolizes the shifting center of gravity in the global economy, where computational capabilities have become a strategic asset comparable to energy resources or manufacturing capacity in previous eras.',
      'Central banking is experiencing its own transformation with the rollout of digital currency pilot programs. These initiatives, involving both retail and wholesale central bank digital currencies (CBDCs), promise to modernize payment systems, improve financial inclusion, and provide central banks with new tools for implementing monetary policy. The implications for commercial banks, payment processors, and the broader financial system are substantial and still being understood.',
      'The workplace continues to evolve in ways that would have seemed unimaginable before the pandemic. With 40% of Fortune 500 companies now operating with fully distributed workforces, the traditional office-based model is being replaced by flexible arrangements that offer workers greater autonomy while presenting new challenges for management, culture-building, and collaboration. Real estate markets in major business districts are adjusting to reduced demand for office space.',
      'Perhaps the most significant long-term trend is the shift in investment toward sustainable energy. For the first time, global investment in renewable energy and related infrastructure has surpassed spending on oil and gas exploration and production. This milestone, long anticipated by climate advocates, signals that the energy transition is not merely an aspiration but an economic reality driven by improving technology costs and policy support.',
    ],
    conclusions: [
      'The business landscape of 2026 bears little resemblance to that of just a few years ago. Companies that have adapted to the new realities of distributed work, digital transformation, and sustainability are thriving, while those that have resisted change are struggling. The pace of transformation shows no signs of slowing, and the ability to anticipate and respond to change has become perhaps the most valuable organizational capability.',
      'For investors, the message is nuanced. While opportunities abound, the rapid pace of change creates significant uncertainty. Diversification, long-term perspective, and focus on fundamental value have become more important than ever in navigating these transformative times.',
    ],
    takeaways: [
      'Inflation reaching 2% target marks a pivotal economic milestone, potentially leading to interest rate cuts and renewed growth',
      'Semiconductor and AI companies are emerging as the dominant players in the global economy',
      'Central bank digital currencies are moving from concept to reality, with pilot programs launching worldwide',
      'Remote and distributed work has become the norm for a significant portion of the corporate world',
      'Green energy investments surpassing fossil fuels represents a historic inflection point',
    ],
    sentiments: [
      'Business sentiment is cautiously optimistic, with confidence indices showing improvement after a period of uncertainty. However, concerns about geopolitical tensions, supply chain resilience, and the pace of technological change temper enthusiasm. The prevailing mood is one of guarded optimism, with businesses focusing on building resilience while pursuing growth opportunities.',
      'Investor sentiment has improved markedly with the inflation news, though many remain cautious about valuations in certain sectors. The consensus among financial analysts is that we are entering a new phase of the economic cycle, one that will reward careful stock selection and long-term thinking over speculative trading.',
    ],
    impacts: [
      'The economic developments described here have implications that extend far beyond financial markets. Lower inflation and interest rates will affect everything from housing affordability to business investment decisions. The continued dominance of technology companies raises questions about market concentration, competition policy, and the distribution of economic gains.',
      'The shift toward sustainable energy represents a fundamental restructuring of global energy markets with profound geopolitical implications. Countries that have built their economies around fossil fuel exports face difficult transitions, while those investing in renewable energy technologies position themselves for future growth.',
    ],
    outlooks: [
      'Economic forecasts point to a period of moderate growth with continued uncertainty about the pace and direction of change. Central banks are expected to begin easing monetary policy gradually, providing support for economic activity. The technology sector is likely to remain a primary driver of growth, though regulatory developments could reshape industry dynamics.',
      'Looking ahead, businesses should prepare for continued disruption and change. The convergence of technological, environmental, and social trends is creating a business environment that rewards adaptability, innovation, and strategic foresight. Companies that invest in these capabilities while maintaining financial discipline are best positioned for long-term success.',
    ],
    tags: ['markets', 'economy', 'inflation', 'central-banking', 'CBDC', 'renewable-energy', 'remote-work', 'venture-capital', 'trade-policy', 'sustainable-investing'],
    sources: [
      { title: 'Bloomberg - Markets News', domain: 'bloomberg.com', path: '/markets' },
      { title: 'Financial Times', domain: 'ft.com', path: '/global-economy' },
      { title: 'Wall Street Journal', domain: 'wsj.com', path: '/economy' },
      { title: 'Reuters - Business News', domain: 'reuters.com', path: '/business' },
      { title: 'CNBC - Markets', domain: 'cnbc.com', path: '/markets' },
    ],
    keywords: ['business news', 'global markets', 'inflation', 'economy', 'green energy investment', 'remote work trends', 'CBDC', 'stock market'],
  },
  movies: {
    headlines: [
      'Christopher Nolan\'s Latest Sci-Fi Epic Shatters Global Opening Weekend Records',
      'Streaming Wars Intensify: Netflix Crosses 400 Million Subscribers Worldwide',
      'AI-Generated Short Film Wins Prestigious Award at Cannes Film Festival',
      'Marvel Studios Announces Next Major Saga: The Age of Heroes',
      'Independent Cinema Experiences Renaissance as Audiences Seek Original Stories',
      'Virtual Production Technology Transforms Hollywood Filmmaking Process',
    ],
    intros: [
      'The entertainment industry is experiencing a creative and technological renaissance that is reshaping how stories are told, produced, and consumed. From record-breaking box office numbers to groundbreaking technological innovations in filmmaking, the current era represents one of the most dynamic periods in cinematic history, with implications for creators, studios, and audiences alike.',
      'In what industry observers are calling a golden age of content, the entertainment landscape continues to evolve at a breathtaking pace. The convergence of streaming platforms, advanced production technologies, and changing audience preferences is creating both challenges and opportunities for content creators and distributors navigating this transformed landscape.',
    ],
    bodies: [
      'The box office recovery has exceeded even the most optimistic projections, with Christopher Nolan\'s latest film leading the charge. The director, known for pushing the boundaries of cinematic storytelling, has delivered what critics are calling his most ambitious work to date. The film\'s success demonstrates that theatrical exhibition remains a powerful force in the entertainment ecosystem, particularly for event films that offer experiences difficult to replicate at home.',
      'Streaming platforms continue to invest heavily in original content, with global content spending projected to exceed $250 billion this year. Netflix\'s milestone of 400 million subscribers underscores the platform\'s dominant position, but competition from Disney+, Apple TV+, Amazon Prime Video, and emerging regional players ensures that the battle for viewers\' attention and subscription dollars remains intensely competitive.',
      'The use of artificial intelligence in filmmaking has progressed from experimental to mainstream, with this year\'s Cannes Film Festival featuring the first AI-generated short film to win a major award. The achievement has sparked both celebration and controversy within the filmmaking community. Proponents argue that AI tools democratize filmmaking by reducing costs and technical barriers, while critics express concern about the impact on creative jobs and artistic authenticity.',
      'Marvel Studios\' announcement of their next major narrative arc has generated enormous anticipation among fans. The studio, which has mastered the art of interconnected storytelling across films and streaming series, is promising a storyline that will span multiple phases and introduce new characters while developing existing favorites. The announcement demonstrates the continued dominance of franchise intellectual property in driving theatrical attendance and streaming engagement.',
      'Independent cinema is experiencing something of a renaissance, with audiences showing increasing appetite for original stories that offer alternatives to franchise fare. Several independent films have achieved remarkable commercial success this year, suggesting that the market for distinctive, director-driven work remains robust. Film festivals around the world report record submissions and attendance, indicating a healthy ecosystem for emerging talent.',
    ],
    conclusions: [
      'The entertainment industry is navigating a period of unprecedented change with remarkable creativity and resilience. The coexistence of blockbuster franchises and intimate independent films, of traditional production methods and AI-assisted filmmaking, suggests a diverse and dynamic future for cinema. For audiences, this diversity of content and approach means more choices and higher quality than ever before.',
      'As technology continues to evolve and audience preferences shift, the only certainty is continued change. Studios, creators, and platforms that can adapt while maintaining focus on compelling storytelling will be best positioned to thrive in this new era of entertainment.',
    ],
    takeaways: [
      'Theatrical box office has made a strong recovery, demonstrating that cinema experiences remain valuable for event films',
      'Streaming platform competition is driving unprecedented investment in original content',
      'AI is becoming an established tool in filmmaking, though its role remains controversial',
      'Franchise storytelling continues to dominate, but independent cinema is experiencing a renaissance',
      'Virtual production technology is reducing costs and expanding creative possibilities for filmmakers',
    ],
    sentiments: [
      'Audience enthusiasm for cinema remains strong, with social media discussions about new releases generating billions of impressions. The conversation around AI in filmmaking is particularly heated, with passionate arguments on both sides. Film Twitter and Reddit communities are abuzz with debates about the implications of AI-generated content for the future of the medium.',
      'Critical response to the year\'s major releases has been generally favorable, though some commentators express concern about the dominance of franchise content and the challenges facing mid-budget original films. The success of independent cinema provides a counter-narrative, suggesting that there is healthy demand for diverse content.',
    ],
    impacts: [
      'The trends described here are reshaping the entertainment industry\'s structure and economics. The continued growth of streaming is changing how content is valued and financed, while AI tools are altering production workflows and potentially reducing costs. These changes have significant implications for employment in the industry, from writers and actors to technical crew members.',
      'For audiences, the impact is generally positive, with more content choices than ever before and increasing quality across platforms. However, the fragmentation of content across multiple streaming services has led to concerns about subscription fatigue and the accessibility of content.',
    ],
    outlooks: [
      'The entertainment industry is expected to continue evolving rapidly, with further consolidation among streaming platforms likely. AI\'s role in content creation will probably expand, potentially leading to new forms of storytelling that blend human creativity with machine assistance. The relationship between theatrical and streaming distribution will continue to evolve as new models are tested.',
      'Looking ahead, the most successful players in the entertainment industry will likely be those that can navigate the tension between technological innovation and artistic integrity, leveraging new tools while maintaining the human connection that makes storytelling powerful.',
    ],
    tags: ['movies', 'cinema', 'streaming', 'Netflix', 'Hollywood', 'film-industry', 'AI-filmmaking', 'box-office', 'independent-cinema'],
    sources: [
      { title: 'Variety - Entertainment News', domain: 'variety.com', path: '/film' },
      { title: 'Hollywood Reporter', domain: 'hollywoodreporter.com', path: '/movies' },
      { title: 'Deadline - Hollywood News', domain: 'deadline.com', path: '/film' },
      { title: 'IndieWire - Independent Film', domain: 'indiewire.com', path: '/film' },
      { title: 'Screen Rant - Movie News', domain: 'screenrant.com', path: '/movies' },
    ],
    keywords: ['movie news', 'box office', 'streaming', 'film industry', 'AI filmmaking', 'cinema', 'Hollywood', 'Netflix subscribers'],
  },
  jobs: {
    headlines: [
      'AI Creates 2 Million New Tech Jobs This Year While Transforming Routine Roles',
      'Four-Day Work Week Adopted by 30% of Fortune 500 Companies in Major Shift',
      'Global Skill Gap Widens: Countries Race to Reskill Workers for AI Economy',
      'Remote Work Revolution Creates New Opportunities for Rural Employment',
      'Tech Salary Transparency Laws Transform Hiring Practices Across Industries',
      'Gig Economy Workers Gain Comprehensive Benefits in Historic Legislation',
    ],
    intros: [
      'The world of work is undergoing its most significant transformation since the Industrial Revolution, driven by technological advancement, changing worker expectations, and evolving regulatory frameworks. These shifts are creating new opportunities while rendering some traditional career paths obsolete, presenting both challenges and possibilities for workers, employers, and policymakers navigating this uncharted territory.',
      'Employment patterns and workplace norms are evolving at an unprecedented pace, reshaping not just where and how we work, but what work means in the twenty-first century. The convergence of technological capability, demographic change, and shifting social values is creating a labor market that looks fundamentally different from anything that came before.',
    ],
    bodies: [
      'The impact of artificial intelligence on employment is proving more nuanced than either the utopian or dystopian predictions suggested. While AI has automated many routine tasks, it has also created millions of new jobs in areas like AI training, oversight, and application development. The net effect on employment has been positive in most developed economies, though the transition has been challenging for workers in roles that have been automated.',
      'The four-day work week movement has gained remarkable momentum, with nearly a third of Fortune 500 companies now offering some form of reduced-hour arrangement. Studies consistently show that productivity either remains stable or increases when work weeks are shortened, challenging long-held assumptions about the relationship between hours worked and output produced. Employee satisfaction and retention have improved significantly at companies that have adopted these policies.',
      'The global skills gap has become a defining challenge of the modern economy. As technology evolves rapidly, the half-life of professional skills continues to shrink, making continuous learning essential for career sustainability. Governments and educational institutions are racing to develop reskilling programs, with varying degrees of success. Countries that have invested heavily in workforce development are seeing better labor market outcomes.',
      'Remote work has fundamentally altered geographic patterns of employment. Workers are no longer constrained to live in expensive urban centers where jobs are concentrated, leading to a redistribution of economic activity. Rural areas and smaller cities are experiencing revitalization as remote workers bring urban salaries to lower-cost areas. This trend has significant implications for real estate, local economies, and community development.',
      'Salary transparency legislation, initially focused on the technology sector, is spreading to other industries and jurisdictions. These laws require employers to disclose salary ranges in job postings and prohibit asking about salary history. Early evidence suggests that transparency is reducing gender and racial pay gaps, though implementation challenges remain.',
    ],
    conclusions: [
      'The future of work is being written now, and the choices made by employers, workers, and policymakers will determine whether this transformation leads to broadly shared prosperity or increased inequality. The trends point toward greater flexibility, continuous learning, and adaptation to technological change as essential components of career success in the modern economy.',
      'For workers, the message is clear: adaptability and lifelong learning are no longer optional but essential. The most successful careers will be those that embrace change, invest in continuous skill development, and remain open to new ways of working.',
    ],
    takeaways: [
      'AI is creating net new employment despite automating many routine tasks, with 2 million new tech jobs added this year',
      'The four-day work week is moving from experiment to mainstream adoption, with proven productivity benefits',
      'Reskilling and continuous learning have become essential as professional skills become obsolete more quickly',
      'Remote work is redistributing economic activity from urban centers to rural and suburban areas',
      'Salary transparency laws are helping close pay gaps and changing hiring practices across industries',
    ],
    sentiments: [
      'Worker sentiment is mixed, reflecting the uneven impact of these changes. Tech workers and those with in-demand skills are experiencing unprecedented opportunities and compensation, while workers in roles susceptible to automation face uncertainty. The overall trend in worker satisfaction shows improvement, driven primarily by increased flexibility and autonomy in how work is performed.',
      'Employer sentiment is cautiously optimistic, with many reporting that new work models have improved productivity and employee retention. However, challenges around culture-building, collaboration, and management in distributed environments remain significant concerns that organizations continue to address.',
    ],
    impacts: [
      'These workforce trends have profound implications for society. The redistribution of work from urban centers could help address housing affordability crises in major cities while revitalizing rural communities. The emphasis on continuous learning may increase demand for educational services while potentially exacerbating inequality if access to training is uneven.',
      'For employers, adapting to these trends is essential for attracting and retaining talent in a competitive labor market. Companies that offer flexibility, invest in employee development, and embrace transparency are gaining significant advantages in the war for talent.',
    ],
    outlooks: [
      'The evolution of work is expected to continue accelerating, driven by technological advancement and changing worker expectations. More companies are expected to adopt flexible work arrangements, and the gig economy will likely continue to grow, though with improved protections and benefits for workers. Educational institutions will face increasing pressure to provide relevant, up-to-date training that keeps pace with industry needs.',
      'Looking ahead, the most successful economies will be those that invest heavily in workforce development and social safety nets that support workers through transitions. The countries and companies that get this right will have significant competitive advantages in the decades ahead.',
    ],
    tags: ['jobs', 'careers', 'remote-work', 'AI-employment', 'four-day-week', 'salary-transparency', 'gig-economy', 'reskilling', 'future-of-work', 'workplace-trends'],
    sources: [
      { title: 'LinkedIn Workforce Report', domain: 'linkedin.com', path: '/business/workforce-news' },
      { title: 'World Economic Forum - Jobs', domain: 'weforum.org', path: '/jobs-and-skills' },
      { title: 'Bureau of Labor Statistics', domain: 'bls.gov', path: '/news.release' },
      { title: 'Glassdoor - Workplace Trends', domain: 'glassdoor.com', path: '/research' },
      { title: 'McKinsey Global Institute', domain: 'mckinsey.com', path: '/mgi/employment' },
    ],
    keywords: ['jobs news', 'career trends', 'remote work statistics', 'AI job impact', 'four day work week', 'salary transparency', 'skills gap', 'future of work'],
  },
  sports: {
    headlines: [
      'FIFA Officially Adopts AI Referee System for 2026 World Cup in Historic Decision',
      'International Olympic Committee Adds Esports as Official Medal Event for 2028 Games',
      'Cricket World Cup Final Breaks Global Viewership Records with 2.5 Billion Watching',
      'Formula E Overtakes Traditional Motorsports in Global Fan Base for First Time',
      'Smart Stadium Technology Transforms Fan Experience Across Major Leagues',
      'Next Generation of Athletes Breaks Multiple Decade-Old World Records',
    ],
    intros: [
      'The world of sports is experiencing a technological and cultural transformation that is reshaping how athletes compete, how fans engage, and how the business of sports operates. From artificial intelligence officiating to the rise of competitive gaming as a recognized sport, the changes underway are as profound as any in the history of organized athletics.',
      'In what is being called a watershed year for sports innovation, traditional boundaries are being redefined as technology, changing audience preferences, and new business models converge to create a sports landscape that would have been unrecognizable just a decade ago.',
    ],
    bodies: [
      'FIFA\'s decision to adopt AI-assisted refereeing for the 2026 World Cup represents the culmination of years of development and testing. The system, which uses multiple cameras and sensors to track player movements and ball position in real-time, promises to significantly reduce officiating errors while maintaining the flow of the game. The decision has been met with broad support from players and coaches, though traditionalists express concern about technology\'s growing role in the sport.',
      'The inclusion of esports as an official medal event in the 2028 Olympics marks a generational shift in how society defines athletic competition. The decision recognizes the enormous popularity of competitive gaming, particularly among younger demographics, and positions the Olympics to remain relevant to audiences whose sports consumption habits differ dramatically from previous generations. The specific games to be included will be announced following consultation with game publishers and player organizations.',
      'The Cricket World Cup final shattered viewership records, with an estimated 2.5 billion people tuning in across traditional broadcast and streaming platforms. The tournament demonstrated the global appeal of the sport, particularly in South Asia, where cricket fandom reaches levels of intensity seen in few other sports. The record viewership is expected to drive significant investment in cricket infrastructure and development programs worldwide.',
      'Formula E\'s ascent past traditional motorsports in fan base marks a significant shift in automotive sports entertainment. The all-electric racing series has attracted a new generation of fans who are drawn to its sustainability focus, urban circuit locations, and technological innovation. Traditional series like Formula 1 have responded by accelerating their own sustainability initiatives and adapting their formats to appeal to changing audience preferences.',
      'The current generation of athletes is pushing the boundaries of human performance, breaking records that experts believed would stand for decades. Advances in training methodology, nutrition, equipment technology, and data analytics are enabling athletes to achieve previously impossible results. The trend has sparked debates about the role of technology in sport and whether technological advantages are creating an uneven playing field.',
    ],
    conclusions: [
      'The transformation of sports reflects broader societal changes, from technology adoption to shifting cultural values. The sports that thrive in this new environment will be those that embrace innovation while maintaining the core elements that make athletic competition compelling: human drama, excellence, and the unpredictable excitement of competition.',
      'For fans, the changes are delivering more engaging, accessible, and interactive experiences than ever before. The challenge for sports organizations will be to balance tradition with innovation, ensuring that the essence of sport is preserved even as the ways we play, watch, and engage with it continue to evolve.',
    ],
    takeaways: [
      'AI refereeing is being adopted by major sports organizations, promising more accurate and consistent officiating',
      'Esports\' inclusion in the Olympics represents mainstream recognition of competitive gaming as a legitimate sport',
      'Global viewership of major sporting events continues to grow, driven by streaming and international audiences',
      'Electric racing has surpassed traditional motorsports in popularity, reflecting sustainability concerns',
      'Athletic performance continues to advance, with technology playing an increasingly important role',
    ],
    sentiments: [
      'Fan sentiment is generally positive about technological innovations in sports, though there is healthy debate about specific implementations. The AI refereeing decision has been broadly welcomed, with surveys showing majority support among regular viewers. The esports Olympic inclusion has generated excitement among younger fans while some traditionalists express skepticism.',
      'Athlete sentiment mirrors fan views, with most professionals welcoming innovations that improve fairness and the fan experience. Concerns about privacy and the pressure of constant performance monitoring have been raised by some athletes, leading to ongoing discussions about the appropriate boundaries of technology in sports.',
    ],
    impacts: [
      'The changes described here are reshaping the business of sports, affecting everything from broadcasting rights values to stadium design and athlete compensation. The globalization of sports audiences is creating new revenue opportunities while also presenting challenges related to scheduling, cultural sensitivity, and maintaining local fan engagement.',
      'For athletes, the impact is mixed. Technology offers new tools for training and performance optimization but also creates new pressures and expectations. The professionalization of esports is creating career opportunities for a new category of athletes while raising questions about player welfare and the long-term health effects of competitive gaming.',
    ],
    outlooks: [
      'The sports industry is expected to continue evolving rapidly, with further technology integration and format innovation. The boundaries between traditional sports and esports will likely continue to blur, and sustainability will become an increasingly important consideration for sports organizations. Athlete advocacy and player welfare will remain important topics as the commercial stakes continue to rise.',
      'Looking ahead, the most successful sports organizations will be those that can adapt to changing audience preferences while maintaining the integrity and tradition that make sports meaningful to fans. The balance between innovation and tradition will be the defining challenge for sports leaders in the coming years.',
    ],
    tags: ['sports', 'AI-refereeing', 'esports', 'Olympics', 'cricket', 'Formula-E', 'athlete-performance', 'sports-technology', 'world-cup', 'viewership'],
    sources: [
      { title: 'ESPN - Sports News', domain: 'espn.com', path: '/sports' },
      { title: 'BBC Sport', domain: 'bbc.com', path: '/sport' },
      { title: 'The Athletic', domain: 'theathletic.com', path: '/sports' },
      { title: 'Sports Illustrated', domain: 'si.com', path: '/news' },
      { title: 'Sky Sports', domain: 'skysports.com', path: '/news' },
    ],
    keywords: ['sports news', 'AI refereeing', 'esports Olympics', 'cricket world cup', 'Formula E', 'sports technology', 'world records', 'athlete performance'],
  },
};

function pick<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

function pickN<T>(arr: T[], n: number): T[] {
  const shuffled = [...arr].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, Math.min(n, arr.length));
}

function generateArticle(category: string): Article {
  const today = new Date();
  const dateStr = today.toISOString().split('T')[0];
  const timestamp = Date.now();
  const slug = `${dateStr}-${category}-${timestamp.toString(36)}`;

  const data = CATEGORY_DATA[category] || CATEGORY_DATA['technology'];
  const title = pick(data.headlines);
  const copy = today.toLocaleDateString('en-US', {
    weekday: 'long', year: 'numeric', month: 'long', day: 'numeric',
  });

  // Build long-form content with sections
  const intro = pick(data.intros);

  // Generate body paragraphs (allow reuse for length)
  const bodyCount = Math.max(8, data.bodies.length + 2);
  const bodyParagraphs: string[] = [];
  for (let i = 0; i < bodyCount; i++) {
    bodyParagraphs.push(pick(data.bodies));
  }

  const conclusion = pick(data.conclusions);

  const sectionHeadings = [
    '## Industry Impact', '## Market Response', '## Expert Analysis',
    '## The Broader Context', '## What This Means', '## Regional Perspectives',
    '## Technology Deep Dive', '## Economic Implications', '## Stakeholder Reactions',
    '## Implementation Challenges', '## Opportunities Ahead',
  ];

  const contentParts: string[] = [intro];

  for (let i = 0; i < bodyParagraphs.length; i++) {
    const h = sectionHeadings[i % sectionHeadings.length];
    contentParts.push(h);
    contentParts.push(bodyParagraphs[i]);
  }

  // Add extra deep analysis paragraphs
  const deepDives = [
    'Industry observers note that the long-term implications of this development extend well beyond the immediate headlines. The structural changes being set in motion will likely reshape competitive dynamics for years to come, as organizations across sectors adapt their strategies to account for new capabilities and shifting market conditions. Early movers are already reporting significant advantages, while those who delay risk finding themselves at a permanent disadvantage in an increasingly competitive landscape.',
    'From a global perspective, the response to these developments varies significantly across regions. Advanced economies are moving quickly to integrate new capabilities into their industrial and service sectors, while emerging markets are adopting a more cautious approach, focusing on building foundational infrastructure and regulatory frameworks before pursuing widespread deployment. This divergence in approach could have significant implications for global economic competitiveness in the years ahead.',
    'The environmental and sustainability dimensions of this development deserve particular attention. While the direct impacts are noteworthy, the indirect effects on energy consumption, resource utilization, and carbon emissions could prove even more significant over time. Organizations are increasingly factoring sustainability considerations into their adoption decisions, recognizing that environmental performance is becoming a key competitive differentiator.',
    'Consumer behavior is already shifting in response to these developments, with early data showing significant changes in purchasing patterns, media consumption, and lifestyle choices. These behavioral changes are creating new market opportunities while simultaneously challenging established business models across multiple sectors. Companies that closely monitor and respond to these shifts are better positioned to capture emerging opportunities.',
    'The talent and workforce implications are profound and multifaceted. Organizations are reporting significant challenges in finding professionals with the right combination of technical skills and domain expertise to leverage new capabilities effectively. Educational institutions are responding with new programs and curricula, but the pace of change continues to outstrip the capacity of traditional training systems to keep up.',
    'Investment patterns reflect strong confidence in the long-term trajectory of these developments. Venture capital funding has reached record levels, with investors particularly interested in applications that address fundamental human needs in healthcare, education, and environmental sustainability. Corporate venture arms are also increasingly active, seeking strategic investments that complement their core businesses.',
  ];
  contentParts.push('## Deep Dive Analysis');
  const diveCount = 4 + Math.floor(Math.random() * 3);
  for (let i = 0; i < diveCount; i++) {
    contentParts.push(pick(deepDives));
  }

  contentParts.push('## Looking Forward');
  contentParts.push(conclusion);
  contentParts.push(pick(data.conclusions));

  const content = contentParts.join('\n\n');

  // Word count
  const wordCount = content.split(/\s+/).length;

  // Source links
  const numSources = 3 + Math.floor(Math.random() * 3);
  const sourceItems = pickN(data.sources, numSources);
  const sourceLinks = sourceItems.map(s => ({
    title: s.title,
    url: `https://${s.domain}${s.path}`,
    domain: s.domain,
  }));

  // Meta description
  const metaDescription = `${title} — ${pick(data.intros).slice(0, 150)}... Read the full analysis on BriefBeakon.`;

  return {
    slug,
    title,
    summary: `In today's edition (${copy}): ${title}. This in-depth analysis covers what happened, why it matters, and what comes next.`,
    category,
    publication_date: dateStr,
    author: 'BriefBeakon AI',
    content,
    word_count: wordCount,
    key_takeaways: pickN(data.takeaways, 4 + Math.floor(Math.random() * 2)),
    public_sentiment: pick(data.sentiments),
    impact_analysis: pick(data.impacts),
    future_outlook: pick(data.outlooks),
    tags: pickN(data.tags, 4 + Math.floor(Math.random() * 2)),
    source_links: sourceLinks,
    meta_description: metaDescription,
    keywords: pickN(data.keywords, 5 + Math.floor(Math.random() * 3)),
    source_url: sourceLinks.length > 0 ? sourceLinks[0].url : '',
    source_name: sourceLinks.length > 0 ? sourceLinks[0].domain : '',
    sentiment_score: 0.5 + Math.random() * 0.4,
    status: 'published',
  };
}

function saveArticle(article: Article): void {
  const postsDir = join(__dirname, '..', 'content', 'posts');
  mkdirSync(postsDir, { recursive: true });

  const filePath = join(postsDir, `${article.slug}.md`);
  const md = `---
title: "${article.title}"
category: ${article.category}
date: ${article.publication_date}
author: ${article.author}
tags: [${article.tags.map(t => `"${t}"`).join(', ')}]
slug: ${article.slug}
summary: "${article.summary}"
word_count: ${article.word_count}
meta_description: "${article.meta_description}"
keywords: [${article.keywords.map(k => `"${k}"`).join(', ')}]
---

# ${article.title}

> ${article.summary}

${article.content}

---

## Key Takeaways

${article.key_takeaways.map(k => `- ${k}`).join('\n')}

## Public Sentiment

${article.public_sentiment}

## Impact Analysis

${article.impact_analysis}

## Future Outlook

${article.future_outlook}

## Sources

${article.source_links.map(s => `- [${s.title}](${s.url})`).join('\n')}
`;

  writeFileSync(filePath, md, 'utf-8');
  console.log(`  Saved: ${filePath} (${article.word_count} words, ${article.source_links.length} sources)`);
}

function saveStaticData(articles: Article[]): void {
  const dataDir = join(__dirname, '..', 'public', 'data');
  mkdirSync(dataDir, { recursive: true });
  const articlesPath = join(dataDir, 'articles.json');
  writeFileSync(articlesPath, JSON.stringify(articles, null, 2), 'utf-8');
  console.log(`  Saved static data: ${articlesPath} (${articles.length} articles)`);
}

interface ContentState {
  articles: Article[];
}

function loadState(): ContentState {
  const statePath = join(__dirname, '..', 'content', 'state.json');
  if (existsSync(statePath)) {
    try {
      return JSON.parse(readFileSync(statePath, 'utf-8')) as ContentState;
    } catch { /* ignore */ }
  }
  return { articles: [] };
}

function saveState(state: ContentState): void {
  const statePath = join(__dirname, '..', 'content', 'state.json');
  writeFileSync(statePath, JSON.stringify(state, null, 2), 'utf-8');
}

// ─── Movie Intelligence ──────────────────────────────────────────

const MOVIES = [
  {
    title: 'Oblivion Protocol',
    year: 2026,
    likes: ['Stunning visual effects and cinematography', 'Thought-provoking sci-fi narrative', 'Strong lead performance', 'Innovative sound design', 'Tight pacing at 2h10m'],
    criticisms: ['Third act feels rushed', 'Supporting characters underdeveloped', 'Some plot holes in time travel logic', 'Ending may divide audiences'],
    verdicts: [
      'A visually spectacular sci-fi that asks big questions about memory and identity, even if its ambitions occasionally exceed its reach.',
      'Oblivion Protocol is that rare blockbuster that combines genuine intellectual ambition with crowd-pleasing spectacle.',
    ],
    recommendations: ['Must-watch for sci-fi fans', 'Best experienced in IMAX', 'Suitable for ages 13+'],
  },
  {
    title: 'The Last Monument',
    year: 2026,
    likes: ['Powerful historical narrative', 'Outstanding ensemble cast', 'Beautiful period production design', 'Emotionally resonant score', 'Educational without being preachy'],
    criticisms: ['Runtime of 2h45m feels long', 'Some historical liberties taken', 'Third storyline feels unnecessary', 'Pacing slows in middle act'],
    verdicts: [
      'A sweeping historical epic that educates while it entertains, anchored by performances that will be remembered come awards season.',
      'The Last Monument is a masterclass in historical filmmaking that balances spectacle with genuine human drama.',
    ],
    recommendations: ['Perfect for history enthusiasts', 'Awards season contender', 'Prepare for a long but rewarding sit'],
  },
  {
    title: 'Neon Hearts',
    year: 2026,
    likes: ['Visually stunning cyberpunk aesthetic', 'Inventive action choreography', 'Strong female protagonist', 'Excellent world-building', 'Memorable soundtrack'],
    criticisms: ['Story follows predictable beats', 'Romantic subplot feels forced', 'Some CGI moments look unfinished', 'Antagonist is one-dimensional'],
    verdicts: [
      'Neon Hearts delivers exactly what fans of the genre want — stunning visuals, great action, and a protagonist worth rooting for — even if it breaks little new ground.',
      'Style over substance, but what style it is. A visual feast that compensates for its narrative shortcomings with pure cinematic energy.',
    ],
    recommendations: ['Great for cyberpunk fans', 'Best on big screen', 'Good entry point for newcomers to the genre'],
  },
  {
    title: 'The Whispering Dark',
    year: 2026,
    likes: ['Genuinely frightening atmosphere', 'Clever practical effects', 'Strong sound design', 'Tight 98-minute runtime', 'Unpredictable plot twists'],
    criticisms: ['Some jump scares feel cheap', 'Final act explanation is convoluted', 'Character decisions defy logic', 'Not for gore-sensitive viewers'],
    verdicts: [
      'A return to form for psychological horror that proves practical effects and atmosphere are far more effective than CGI gore.',
      'The Whispering Dark reminds us that the best horror films work because of what they dont show, not what they do.',
    ],
    recommendations: ['For horror purists', 'Not for casual viewers', 'Watch with lights on'],
  },
  {
    title: 'Crimson Tide: Rising',
    year: 2026,
    likes: ['Tense submarine warfare sequences', 'Strong military accuracy', 'Excellent sound mixing', 'Gripping geopolitical plot', 'Strong male and female leads'],
    criticisms: ['Technobabble may confuse general audiences', 'Slow buildup in first hour', 'Familiar premise', 'Some clichéd dialogue'],
    verdicts: [
      'A taut military thriller that respects its audiences intelligence while delivering genuine tension and spectacular set pieces.',
      'Crimson Tide: Rising proves the submarine thriller genre still has teeth, delivering edge-of-your-seat tension from start to finish.',
    ],
    recommendations: ['Perfect for military thriller fans', 'See it in theaters for the sound design', 'May be too intense for younger viewers'],
  },
  {
    title: 'Echoes of Tomorrow',
    year: 2026,
    likes: ['Original time travel concept', 'Emotional family story at its core', 'Beautiful cinematography', 'Excellent child actor performance', 'Heartwarming conclusion'],
    criticisms: ['Time travel rules are inconsistent', 'Some plot convenience', 'Supporting characters are thin', 'Could have been 15 minutes shorter'],
    verdicts: [
      'A rare film that uses science fiction as a vehicle for genuine emotional storytelling about family, loss, and second chances.',
      'Echoes of Tomorrow reminds us that the best sci-fi isnt about technology — its about the human heart.',
    ],
    recommendations: ['Family-friendly sci-fi', 'Tissues recommended', 'Great date night movie'],
  },
];

function generateMovieReport(movie: typeof MOVIES[0]): MovieReport {
  const today = new Date();
  const dateStr = today.toISOString().split('T')[0];
  const slug = movie.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
  const criticScore = Math.floor(65 + Math.random() * 30);
  const audienceScore = Math.floor(60 + Math.random() * 35);
  const offset = Math.floor(Math.random() * 5) - 5;

  // Randomize which liked/criticism items appear (shuffle and pick some)
  const shuffledLikes = [...movie.likes].sort(() => Math.random() - 0.5);
  const shuffledCritisisms = [...movie.criticisms].sort(() => Math.random() - 0.5);

  return {
    id: slug,
    title: movie.title,
    slug,
    year: movie.year,
    overall_sentiment: `Audience and critic reception for "${movie.title}" has been broadly positive, with particular praise for its creative vision and technical achievements. The film has generated significant discussion across social media platforms and review aggregators, with audiences praising its ambition while some critics note areas where execution falls short of its considerable aspirations.`,
    what_viewers_liked: shuffledLikes.slice(0, 2 + Math.floor(Math.random() * 3)),
    common_criticisms: shuffledCritisisms.slice(0, 2 + Math.floor(Math.random() * 2)),
    ai_verdict: movie.verdicts[Math.floor(Math.random() * movie.verdicts.length)],
    watch_recommendation: movie.recommendations[Math.floor(Math.random() * movie.recommendations.length)],
    critic_score: criticScore + offset,
    audience_score: audienceScore,
    publication_date: dateStr,
    tags: [movie.title.toLowerCase().replace(/[^a-z0-9]+/g, '-'), `${movie.year}`, 'movie-review', 'audience-intelligence', 'box-office', 'in-theaters'],
  };
}

function saveMovieStaticData(movies: MovieReport[]): void {
  const dataDir = join(__dirname, '..', 'public', 'data');
  mkdirSync(dataDir, { recursive: true });
  const moviesPath = join(dataDir, 'movies.json');
  writeFileSync(moviesPath, JSON.stringify(movies, null, 2), 'utf-8');
  console.log(`  Saved movies data: ${moviesPath} (${movies.length} movies)`);
}

async function main() {
  console.log('Starting BriefBeakon content generation...');
  console.log(`Config: schedule=${JSON.stringify(config.scheduler)}`);

  const { categories } = config;
  const state = loadState();
  const existingSlugs = new Set(state.articles.map(a => a.slug));
  const newArticles: Article[] = [];

  const isFillMode = process.argv.includes('--fill');

  for (const [category, count] of Object.entries(categories)) {
    const numArticles = isFillMode ? (count as number) : 1;
    console.log(`Generating ${numArticles} article(s) for: ${category}`);

    for (let i = 0; i < numArticles; i++) {
      const article = generateArticle(category);
      if (!existingSlugs.has(article.slug)) {
        saveArticle(article);
        newArticles.push(article);
      }
    }
  }

  if (newArticles.length > 0) {
    state.articles.push(...newArticles);
    saveState(state);
    saveStaticData(state.articles);
  }

  // Generate movie intelligence reports
  console.log(`Generating ${MOVIES.length} movie intelligence reports...`);
  const movies = MOVIES.map(m => generateMovieReport(m));
  saveMovieStaticData(movies);

  console.log(`Done. Generated ${newArticles.length} new article(s). Total: ${state.articles.length} | Movies: ${movies.length}`);
}

main().catch(console.error);
