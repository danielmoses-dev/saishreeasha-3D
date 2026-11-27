export interface ProductCategory {
  slug: string;
  code: string;
  name: string;
  shortDesc: string;
  intro: string;
  items: string[];
  applications: string[];
  image: string;
  imageAlt: string;
  featuredSpan?: 'wide' | 'tall' | 'standard';
}

export interface IndustryItem {
  name: string;
  slug: string;
  summary: string;
  relevantCategories: string[];
  image: string;
}

export const COMPANY = {
  legalName: 'SAISHREEASHA GLOBAL VENTURES PRIVATE LIMITED',
  shortName: 'SAISHREEASHA',
  tagline: 'Your Trusted Partner for Industrial Equipment, Engineering Supplies & Process Solutions',
  motto: 'Powering Industries. Delivering Quality. Building Trust.',
  philosophyHeadline: 'The Right Products. Dependable Sourcing. Lasting Partnerships.',
  overviewParagraphs: [
    'SAISHREEASHA GLOBAL VENTURES PRIVATE LIMITED is an industrial trading, procurement, and supply company dedicated to providing reliable industrial equipment, engineering materials, plant spares, accessories, tools, and consumables to meet the diverse requirements of modern industries.',
    'We cater to the procurement needs of industrial plants, engineering companies, fabrication units, infrastructure projects, process industries, and industrial maintenance organizations. Our focus is on delivering application-oriented products, competitive commercial solutions, dependable sourcing, and responsive customer support.',
    'Our diversified product portfolio encompasses industrial compressors, welding and cutting equipment, non-destructive testing (NDT) materials, industrial power tools, abrasive blasting systems, high-pressure hoses, process plant spares, industrial valves, instrumentation, vacuum pumps, and specialized piping and tubing materials.',
    'We also support the requirements of vapour absorption chiller plants, ammonia plants, shell-and-tube heat exchangers, industrial chillers, pressure vessels, and associated process equipment through the supply of suitable spares, accessories, tubes, pipes, valves, and related components.',
    'With a customer-focused approach and a commitment to professional business practices, we strive to build long-term relationships founded on quality, transparency, reliability, and timely supply. Our objective is to be a dependable single-window sourcing partner for industrial equipment, maintenance materials, process plant components, and engineering supplies.',
  ],
  vision:
    'To become a preferred and trusted industrial supply partner, recognized for dependable sourcing, comprehensive product availability, responsive customer service, and value-driven engineering supply solutions.',
  mission:
    'To provide reliable industrial products, process plant components, engineering materials, and procurement solutions that help customers maintain equipment performance, support operational continuity, and improve overall efficiency.',
  commitmentIntro:
    'At SAISHREEASHA GLOBAL VENTURES PRIVATE LIMITED, we believe that industrial supply is about more than delivering products. It is about understanding customer requirements, coordinating dependable sourcing, and creating lasting business value.',
  commitments: [
    'Understanding customer requirements and application needs',
    'Providing clear product information and quotations',
    'Supporting specification-based sourcing',
    'Maintaining professional communication and coordination',
    'Focusing on dependable supply and customer satisfaction',
    'Building enduring relationships through trust and transparency',
  ],
  commitmentClosing:
    'Our goal is to make industrial procurement more convenient, reliable, and efficient for every customer we serve.',
  philosophyParagraphs: [
    'We recognize the importance of reliable industrial supplies in maintaining productivity, supporting plant maintenance, and minimizing avoidable operational interruptions.',
    'By bringing together a diverse product portfolio and a customer-oriented sourcing approach, we aim to simplify procurement for industrial buyers, project contractors, maintenance teams, and engineering organizations.',
    'Every enquiry is an opportunity to understand a requirement, identify a suitable solution, and build a relationship based on confidence and mutual success.',
  ],
  offices: {
    registered: {
      title: 'Registered Office',
      lines: [
        'Survey No. 10/2-3, House No. 324,',
        'Sangavi, Pune City, Pune – 411027,',
        'Maharashtra, India.',
      ],
    },
    corporate: {
      title: 'Corporate / Business Office',
      lines: [
        'Office No. C-555, 5th Floor,',
        'Gera Imperium Gateway, Survey No. 439,',
        'Nashik Phata Road, Bhosari,',
        'Pimpri-Chinchwad, Pune – 411034,',
        'Maharashtra, India.',
      ],
    },
  },
};

export const WHY_CHOOSE_US = [
  {
    id: 'range',
    title: 'Comprehensive Product Range',
    description:
      'A broad selection of industrial equipment, process plant spares, engineering materials, and maintenance consumables.',
  },
  {
    id: 'sourcing',
    title: 'Application-Oriented Sourcing',
    description:
      'Support in identifying products aligned with customer requirements, technical specifications, and intended applications.',
  },
  {
    id: 'quality',
    title: 'Quality-Focused Procurement',
    description:
      'Sourcing products according to agreed specifications, applicable requirements, and customer expectations.',
  },
  {
    id: 'commercial',
    title: 'Competitive Commercial Solutions',
    description:
      'A practical approach to procurement that considers product suitability, value, and commercial requirements.',
  },
  {
    id: 'support',
    title: 'Responsive Customer Support',
    description:
      'Professional coordination throughout enquiries, specifications, quotations, and supply arrangements.',
  },
  {
    id: 'supply',
    title: 'Reliable Supply Coordination',
    description:
      'Clear communication, order coordination, and delivery planning.',
  },
  {
    id: 'relationships',
    title: 'Long-Term Business Relationships',
    description:
      'We value integrity, transparency, mutual trust, and lasting partnerships with our customers and suppliers.',
  },
];

export const PROCUREMENT_STEPS = [
  {
    step: '01',
    title: 'Share Your Requirement',
    description:
      'Customers submit their product requirements and technical specifications.',
  },
  {
    step: '02',
    title: 'Product Sourcing',
    description:
      'Identify suitable products based on application and specifications.',
  },
  {
    step: '03',
    title: 'Quotation & Coordination',
    description:
      'Coordinate commercial details, quotations and order requirements.',
  },
  {
    step: '04',
    title: 'Supply & Delivery',
    description:
      'Coordinate dependable supply and delivery planning.',
  },
];

export const PRODUCT_CATEGORIES: ProductCategory[] = [
  {
    slug: 'process-plant-spares',
    code: '01',
    name: 'Process Plant Spares & Accessories',
    shortDesc:
      'Spares and replacement components for vapour absorption chillers, ammonia plants, heat exchangers, and vacuum pumps.',
    intro:
      'We supply spares and accessories for industrial process equipment, refrigeration systems, cooling installations, and plant maintenance applications. We aim to support plant operators and maintenance teams with dependable sourcing for routine maintenance, equipment servicing, and operational requirements.',
    items: [
      'Spares and accessories for vapour absorption chiller plants',
      'Components and maintenance spares for industrial chillers',
      'Spares and accessories for ammonia plants',
      'Components for shell-and-tube heat exchangers and process vessels',
      'Mixing baffles and baffle plates',
      'Industrial pumps, including vacuum pumps, and associated spares',
      'Equipment accessories and replacement components for plant maintenance',
      'Selected mechanical and process equipment components as per application requirements',
    ],
    applications: [
      'Vapour absorption chiller plants',
      'Ammonia and industrial refrigeration plants',
      'Shell-and-tube heat exchangers and pressure vessels',
      'Routine plant maintenance and equipment servicing',
    ],
    image: '/images/cat-process-plant.jpg',
    imageAlt: 'Industrial process plant pipework and equipment infrastructure',
    featuredSpan: 'wide',
  },
  {
    slug: 'tubes-pipes-piping',
    code: '02',
    name: 'Industrial Tubes, Pipes & Piping Materials',
    shortDesc:
      'Copper, stainless steel, and carbon steel tubes and pipes sourced to project grades and wall thicknesses.',
    intro:
      'We provide industrial tubing and piping materials for suitable process, thermal, mechanical, and industrial applications. Material grades, dimensions, wall thicknesses, and specifications can be sourced according to project requirements and technical suitability.',
    items: [
      'Copper (Cu) tubes and pipes',
      'Stainless steel (SS) tubes and pipes',
      'Carbon steel tubes and pipes',
    ],
    applications: [
      'Shell-and-tube heat exchangers',
      'Industrial chillers and cooling systems',
      'Ammonia and refrigeration plants',
      'Process vessels and associated equipment',
      'Industrial piping and plant maintenance',
    ],
    image: '/images/cat-pipes.jpg',
    imageAlt: 'Industrial stainless steel and carbon steel pipes and tubes',
    featuredSpan: 'standard',
  },
  {
    slug: 'valves-flow-control',
    code: '03',
    name: 'Industrial Valves & Flow Control Equipment',
    shortDesc:
      'Butterfly, diaphragm, isolation, and flow-control valves matched to operating conditions and media.',
    intro:
      'We supply a range of industrial valves and flow-control components for process plants, piping networks, and equipment installations. Product selection is based on the required application, operating conditions, material compatibility, and customer specifications.',
    items: [
      'Butterfly valves',
      'Diaphragm valves',
      'General-purpose industrial valves',
      'Isolation and flow-control valves',
      'Valve accessories and replacement spares',
      'Suitable valves for industrial process and utility applications',
    ],
    applications: [
      'Process plant piping networks',
      'Chemical and utility fluid isolation',
      'Cooling and refrigeration circulation lines',
      'Industrial plant maintenance and retrofits',
    ],
    image: '/images/cat-valves.jpg',
    imageAlt: 'Industrial valve assembly on metallic process piping',
    featuredSpan: 'standard',
  },
  {
    slug: 'instrumentation-level-measurement',
    code: '04',
    name: 'Industrial Instrumentation & Level Measurement',
    shortDesc:
      'Pressure gauges, level glass assemblies, and process monitoring spares for routine inspection.',
    intro:
      'We supply essential instrumentation and monitoring accessories used in industrial plants, process systems, and equipment installations. These products support routine inspection, operational monitoring, maintenance, and equipment servicing.',
    items: [
      'Industrial pressure gauges',
      'Level gauges and level glass assemblies',
      'Level glass accessories and replacement components',
      'Process monitoring accessories',
      'Selected instrumentation spares and fittings',
    ],
    applications: [
      'Pressure vessels and boilers',
      'Process plant operational monitoring',
      'Chiller and refrigeration system inspection',
      'Routine maintenance and instrumentation replacement',
    ],
    image: '/images/cat-instrumentation.jpg',
    imageAlt: 'Industrial analog pressure gauge mounted on process line',
    featuredSpan: 'standard',
  },
  {
    slug: 'air-compressors',
    code: '05',
    name: 'Air Compressors & Accessories',
    shortDesc:
      'Industrial air compressors, air preparation units, distribution accessories, and maintenance spares.',
    intro:
      'We supply industrial air compressors and associated accessories for manufacturing, fabrication, construction, and maintenance operations.',
    items: [
      'Industrial air compressors',
      'Compressor accessories and spare parts',
      'Air preparation equipment',
      'Air distribution accessories',
      'Related maintenance components',
    ],
    applications: [
      'Manufacturing and assembly lines',
      'Heavy fabrication and abrasive blasting air supply',
      'Construction and site utility air',
      'Plant pneumatic distribution and maintenance',
    ],
    image: '/images/cat-compressors.jpg',
    imageAlt: 'Industrial rotary air compressor unit',
    featuredSpan: 'standard',
  },
  {
    slug: 'welding-cutting',
    code: '06',
    name: 'Welding, Cutting Equipment & Consumables',
    shortDesc:
      'Welding machines, plasma cutters, MIG/TIG consumables, electrodes, torches, and fabrication accessories.',
    intro:
      'We offer products supporting welding, fabrication, metalworking, and industrial cutting operations.',
    items: [
      'Welding machines and accessories',
      'Plasma cutting equipment',
      'Welding electrodes and filler materials',
      'MIG and TIG welding consumables',
      'Cutting torches, tips, and accessories',
      'Welding cables, holders, and clamps',
      'Associated fabrication consumables',
    ],
    applications: [
      'Heavy fabrication and structural steelwork',
      'Pipeline construction and joint welding',
      'Shipbuilding and marine metalworking',
      'Plant repair and maintenance welding',
    ],
    image: '/images/cat-welding.jpg',
    imageAlt: 'Industrial arc welding and metal fabrication sparks',
    featuredSpan: 'wide',
  },
  {
    slug: 'ndt-inspection',
    code: '07',
    name: 'NDT Materials & Inspection Consumables',
    shortDesc:
      'Dye penetrant, magnetic particle consumables, and inspection chemicals for quality control.',
    intro:
      'We support non-destructive testing, industrial inspection, and quality-control activities through the supply of relevant consumables.',
    items: [
      'Dye penetrant testing materials',
      'Magnetic particle testing consumables',
      'Industrial inspection chemicals and accessories',
      'NDT-related consumables',
      'Quality inspection support materials',
    ],
    applications: [
      'Weld seam and structural integrity testing',
      'Pressure vessel and pipeline inspection',
      'Fabrication shop quality control',
      'Routine plant shutdown inspection',
    ],
    image: '/images/cat-ndt.jpg',
    imageAlt: 'Non-destructive testing and industrial weld quality inspection',
    featuredSpan: 'standard',
  },
  {
    slug: 'power-tools',
    code: '08',
    name: 'Industrial Power Tools & Accessories',
    shortDesc:
      'Angle grinders, drilling machines, cordless tools, and grinding, cutting, and polishing consumables.',
    intro:
      'Our range includes tools and accessories for industrial fabrication, installation, construction, and maintenance.',
    items: [
      'Angle grinders and cutting tools',
      'Drilling machines and accessories',
      'Electric and cordless power tools',
      'Grinding, cutting, and polishing accessories',
      'Industrial tool accessories and consumables',
    ],
    applications: [
      'Metal fabrication and surface finishing',
      'Site installation and structural assembly',
      'Infrastructure and construction projects',
      'Industrial plant maintenance workshops',
    ],
    image: '/images/cat-power-tools.jpg',
    imageAlt: 'Angle grinder cutting and grinding industrial steel',
    featuredSpan: 'standard',
  },
  {
    slug: 'abrasive-blasting',
    code: '09',
    name: 'Abrasive Blasting Equipment & Accessories',
    shortDesc:
      'Blasting machines, pots, blast hoses, nozzles, couplings, and surface preparation consumables.',
    intro:
      'We supply products for surface preparation, rust removal, cleaning, and coating-related applications.',
    items: [
      'Abrasive blasting machines and pots',
      'Blast hoses and couplings',
      'Blast nozzles and nozzle holders',
      'Blasting accessories and replacement parts',
      'Surface preparation equipment and consumables',
    ],
    applications: [
      'Pipeline construction and anti-corrosion coating prep',
      'Shipbuilding hull and steel surface cleaning',
      'Heavy structural steel rust removal',
      'Industrial tank and vessel surface preparation',
    ],
    image: '/images/cat-blasting.jpg',
    imageAlt: 'Industrial abrasive blasting surface preparation on steel',
    featuredSpan: 'standard',
  },
  {
    slug: 'high-pressure-hoses',
    code: '10',
    name: 'High-Pressure Hoses & Assemblies',
    shortDesc:
      'Hydraulic, fluid-transfer, and industrial spray hoses with matched fittings, couplings, and connectors.',
    intro:
      'We supply industrial hoses and associated fittings for suitable fluid-transfer, hydraulic, and high-pressure applications.',
    items: [
      'High-pressure industrial hoses',
      'Hydraulic hoses',
      'Fluid-transfer hoses',
      'Industrial spray hoses and hose assemblies',
      'Hose fittings, couplings, and connectors',
      'Related hose accessories',
    ],
    applications: [
      'Hydraulic machinery and heavy equipment',
      'High-pressure fluid transfer and cleaning',
      'Industrial spraying and coating lines',
      'Process utility connections and plant maintenance',
    ],
    image: '/images/cat-hoses.jpg',
    imageAlt: 'High-pressure hydraulic hose assemblies and steel couplings',
    featuredSpan: 'standard',
  },
];

export const INDUSTRIES: IndustryItem[] = [
  {
    name: 'Oil & Gas',
    slug: 'oil-and-gas',
    summary:
      'Process piping, industrial valves, high-pressure hoses, NDT consumables, and plant maintenance spares.',
    relevantCategories: ['valves-flow-control', 'tubes-pipes-piping', 'ndt-inspection', 'high-pressure-hoses'],
    image: '/images/ind-oil-gas.jpg',
  },
  {
    name: 'Chemical & Process Industries',
    slug: 'chemical-process',
    summary:
      'Corrosion-resistant SS piping, diaphragm & butterfly valves, instrumentation, and vessel spares.',
    relevantCategories: ['process-plant-spares', 'tubes-pipes-piping', 'valves-flow-control', 'instrumentation-level-measurement'],
    image: '/images/ind-chemical.jpg',
  },
  {
    name: 'Ammonia & Industrial Refrigeration',
    slug: 'ammonia-refrigeration',
    summary:
      'Dedicated spares for ammonia plants, vapour absorption chillers, level glasses, and heat exchanger tubes.',
    relevantCategories: ['process-plant-spares', 'tubes-pipes-piping', 'instrumentation-level-measurement'],
    image: '/images/ind-cooling.jpg',
  },
  {
    name: 'HVAC, Cooling & Thermal Systems',
    slug: 'hvac-cooling-thermal',
    summary:
      'Copper and stainless tubing, chiller spares, mixing baffles, and flow-control valves.',
    relevantCategories: ['process-plant-spares', 'tubes-pipes-piping', 'valves-flow-control'],
    image: '/images/ind-cooling.jpg',
  },
  {
    name: 'Heavy Fabrication & Structural Steel',
    slug: 'heavy-fabrication',
    summary:
      'Welding machines, plasma cutters, MIG/TIG consumables, power tools, and NDT inspection kits.',
    relevantCategories: ['welding-cutting', 'power-tools', 'ndt-inspection', 'abrasive-blasting'],
    image: '/images/cat-welding.jpg',
  },
  {
    name: 'Pipeline Construction & Coating',
    slug: 'pipeline-coating',
    summary:
      'Abrasive blasting systems, blast nozzles, welding consumables, and NDT testing materials.',
    relevantCategories: ['abrasive-blasting', 'welding-cutting', 'ndt-inspection', 'tubes-pipes-piping'],
    image: '/images/cat-blasting.jpg',
  },
  {
    name: 'Infrastructure & Construction',
    slug: 'infrastructure-construction',
    summary:
      'Industrial air compressors, electric and cordless power tools, hydraulic hoses, and cutting equipment.',
    relevantCategories: ['air-compressors', 'power-tools', 'high-pressure-hoses', 'welding-cutting'],
    image: '/images/ind-shipyard.jpg',
  },
  {
    name: 'Shipbuilding & Marine',
    slug: 'shipbuilding-marine',
    summary:
      'Surface preparation blasting equipment, marine-grade piping, welding consumables, and valves.',
    relevantCategories: ['abrasive-blasting', 'welding-cutting', 'tubes-pipes-piping', 'valves-flow-control'],
    image: '/images/ind-shipyard.jpg',
  },
  {
    name: 'Power Plants & Energy',
    slug: 'power-plants-energy',
    summary:
      'Heat exchanger tubing, pressure gauges, level assemblies, isolation valves, and plant spares.',
    relevantCategories: ['process-plant-spares', 'instrumentation-level-measurement', 'valves-flow-control', 'tubes-pipes-piping'],
    image: '/images/ind-power.jpg',
  },
  {
    name: 'Manufacturing & Engineering',
    slug: 'manufacturing-engineering',
    summary:
      'Compressed air systems, industrial power tools, hydraulic assemblies, and workshop consumables.',
    relevantCategories: ['air-compressors', 'power-tools', 'high-pressure-hoses', 'welding-cutting'],
    image: '/images/cat-compressors.jpg',
  },
  {
    name: 'Industrial Maintenance & Repair',
    slug: 'industrial-maintenance',
    summary:
      'Single-window replacement spares, vacuum pump parts, gauges, hoses, and maintenance consumables.',
    relevantCategories: ['process-plant-spares', 'instrumentation-level-measurement', 'high-pressure-hoses', 'power-tools'],
    image: '/images/hero-plant.jpg',
  },
];
