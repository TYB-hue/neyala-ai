// BreezeSim Affiliate Program Configuration
// Based on official BreezeSim affiliate guide

export interface BreezeSimConfig {
  // Affiliate Program Details
  programName: string;
  supportEmail: string;
  dashboardUrl: string;
  brandGuidelinesUrl: string;
  
  // Commission Options
  commissionOptions: {
    default: { commission: number; discount: number; name: string };
    option1: { commission: number; discount: number; name: string };
    option2: { commission: number; discount: number; name: string };
  };
  
  // Payment Information
  paymentInfo: {
    paymentDate: string;
    minimumPayment: number;
    paymentMethods: string[];
    paymentSettingsUrl: string;
  };
  
  // Marketing Guidelines
  marketingGuidelines: {
    dos: string[];
    donts: string[];
    disclosureRequired: boolean;
    brandGuidelinesRequired: boolean;
  };
  
  // API and Technical
  technical: {
    apiAvailable: boolean;
    brandedLandingPageAvailable: boolean;
    minimumSessionsForBrandedPage: number;
    urlParametersSupported: boolean;
  };
  
  // Promotional Features
  promotional: {
    couponsAvailable: boolean;
    regularPromotions: boolean;
    sourceTrackingAvailable: boolean;
  };
}

export const breezesimConfig: BreezeSimConfig = {
  programName: "Breeze Affiliate Program",
  supportEmail: "affiliates@breezesim.com",
  dashboardUrl: "https://enterprise.uppromote.com/breezesim/dashboard",
  brandGuidelinesUrl: "https://breezesim.com/brand-guidelines",
  
  commissionOptions: {
    default: { commission: 20, discount: 0, name: "Default - 20% commission" },
    option1: { commission: 10, discount: 10, name: "10% commission, 10% discount to your audience" },
    option2: { commission: 0, discount: 20, name: "0% commission, 20% discount to your audience" }
  },
  
  paymentInfo: {
    paymentDate: "28th of every month",
    minimumPayment: 250,
    paymentMethods: ["BACCs", "PayPal"],
    paymentSettingsUrl: "https://enterprise.uppromote.com/breezesim/setting/payment"
  },
  
  marketingGuidelines: {
    dos: [
      "Disclose your relationship with Breeze as an affiliate partner - be clear, visible and unambiguous",
      "Adhere to Breeze's brand guidelines when generating any of your own marketing materials",
      "Utilize your dashboard, and monitor successful channels, performance, sales and commission paid",
      "Contact the Breeze team should you have any questions, or require any support"
    ],
    donts: [
      "Mislead people with any false or exaggerated information about Breeze",
      "Advertise as Breeze across any paid ads - direct to your own branded landing page instead"
    ],
    disclosureRequired: true,
    brandGuidelinesRequired: true
  },
  
  technical: {
    apiAvailable: true,
    brandedLandingPageAvailable: true,
    minimumSessionsForBrandedPage: 5000,
    urlParametersSupported: true
  },
  
  promotional: {
    couponsAvailable: true,
    regularPromotions: true,
    sourceTrackingAvailable: true
  }
};

// Market Statistics
export const marketStats = {
  growthPrediction: "Travel eSIM users are expected to grow 440% globally over the next 5 years",
  source: "Juniper Research, April 2024"
};

// Country ISO codes mapping for flexible URL generation
export const countryISOCodes: Record<string, string> = {
  // Major countries
  'afghanistan': 'AF', 'albania': 'AL', 'algeria': 'DZ', 'andorra': 'AD', 'angola': 'AO',
  'argentina': 'AR', 'armenia': 'AM', 'australia': 'AU', 'austria': 'AT', 'azerbaijan': 'AZ',
  'bahrain': 'BH', 'bangladesh': 'BD', 'belarus': 'BY', 'belgium': 'BE', 'belize': 'BZ',
  'benin': 'BJ', 'bhutan': 'BT', 'bolivia': 'BO', 'bosnia': 'BA', 'botswana': 'BW',
  'brazil': 'BR', 'brunei': 'BN', 'bulgaria': 'BG', 'burkina faso': 'BF', 'burundi': 'BI',
  'cambodia': 'KH', 'cameroon': 'CM', 'canada': 'CA', 'cape verde': 'CV', 'chad': 'TD',
  'chile': 'CL', 'china': 'CN', 'colombia': 'CO', 'comoros': 'KM', 'congo': 'CG',
  'costa rica': 'CR', 'croatia': 'HR', 'cuba': 'CU', 'cyprus': 'CY', 'czech republic': 'CZ',
  'czechia': 'CZ', 'denmark': 'DK', 'djibouti': 'DJ', 'dominica': 'DM', 'dominican republic': 'DO',
  'ecuador': 'EC', 'egypt': 'EG', 'el salvador': 'SV', 'equatorial guinea': 'GQ', 'eritrea': 'ER',
  'estonia': 'EE', 'eswatini': 'SZ', 'ethiopia': 'ET', 'fiji': 'FJ', 'finland': 'FI',
  'france': 'FR', 'gabon': 'GA', 'gambia': 'GM', 'georgia': 'GE', 'germany': 'DE',
  'ghana': 'GH', 'greece': 'GR', 'grenada': 'GD', 'guatemala': 'GT', 'guinea': 'GN',
  'guinea bissau': 'GW', 'guyana': 'GY', 'haiti': 'HT', 'honduras': 'HN', 'hungary': 'HU',
  'iceland': 'IS', 'india': 'IN', 'indonesia': 'ID', 'iran': 'IR', 'iraq': 'IQ',
  'ireland': 'IE', 'israel': 'IL', 'italy': 'IT', 'ivory coast': 'CI', 'jamaica': 'JM',
  'japan': 'JP', 'jordan': 'JO', 'kazakhstan': 'KZ', 'kenya': 'KE', 'kiribati': 'KI',
  'kuwait': 'KW', 'kyrgyzstan': 'KG', 'laos': 'LA', 'latvia': 'LV', 'lebanon': 'LB',
  'lesotho': 'LS', 'liberia': 'LR', 'libya': 'LY', 'liechtenstein': 'LI', 'lithuania': 'LT',
  'luxembourg': 'LU', 'madagascar': 'MG', 'malawi': 'MW', 'malaysia': 'MY', 'maldives': 'MV',
  'mali': 'ML', 'malta': 'MT', 'marshall islands': 'MH', 'mauritania': 'MR', 'mauritius': 'MU',
  'mexico': 'MX', 'micronesia': 'FM', 'moldova': 'MD', 'monaco': 'MC', 'mongolia': 'MN',
  'montenegro': 'ME', 'morocco': 'MA', 'mozambique': 'MZ', 'myanmar': 'MM', 'namibia': 'NA',
  'nauru': 'NR', 'nepal': 'NP', 'netherlands': 'NL', 'new zealand': 'NZ', 'nicaragua': 'NI',
  'niger': 'NE', 'nigeria': 'NG', 'north korea': 'KP', 'north macedonia': 'MK', 'norway': 'NO',
  'oman': 'OM', 'pakistan': 'PK', 'palau': 'PW', 'panama': 'PA', 'papua new guinea': 'PG',
  'paraguay': 'PY', 'peru': 'PE', 'philippines': 'PH', 'poland': 'PL', 'portugal': 'PT',
  'qatar': 'QA', 'romania': 'RO', 'russia': 'RU', 'rwanda': 'RW', 'saint kitts': 'KN',
  'saint lucia': 'LC', 'saint vincent': 'VC', 'samoa': 'WS', 'san marino': 'SM', 'sao tome': 'ST',
  'saudi arabia': 'SA', 'senegal': 'SN', 'serbia': 'RS', 'seychelles': 'SC', 'sierra leone': 'SL',
  'singapore': 'SG', 'slovakia': 'SK', 'slovenia': 'SI', 'solomon islands': 'SB', 'somalia': 'SO',
  'south africa': 'ZA', 'south korea': 'KR', 'south sudan': 'SS', 'spain': 'ES', 'sri lanka': 'LK',
  'sudan': 'SD', 'suriname': 'SR', 'sweden': 'SE', 'switzerland': 'CH', 'syria': 'SY',
  'taiwan': 'TW', 'tajikistan': 'TJ', 'tanzania': 'TZ', 'thailand': 'TH', 'timor leste': 'TL',
  'togo': 'TG', 'tonga': 'TO', 'trinidad': 'TT', 'tunisia': 'TN', 'turkey': 'TR',
  'türkiye': 'TR', 'turkmenistan': 'TM', 'tuvalu': 'TV', 'uganda': 'UG', 'ukraine': 'UA',
  'united arab emirates': 'AE', 'united kingdom': 'GB', 'united states': 'US', 'uruguay': 'UY',
  'uzbekistan': 'UZ', 'vanuatu': 'VU', 'vatican': 'VA', 'venezuela': 'VE', 'vietnam': 'VN',
  'yemen': 'YE', 'zambia': 'ZM', 'zimbabwe': 'ZW'
};

// Country name mapping for proper display
export const countryNames: Record<string, string> = {
  'afghanistan': 'Afghanistan', 'albania': 'Albania', 'algeria': 'Algeria', 'andorra': 'Andorra',
  'angola': 'Angola', 'argentina': 'Argentina', 'armenia': 'Armenia', 'australia': 'Australia',
  'austria': 'Austria', 'azerbaijan': 'Azerbaijan', 'bahrain': 'Bahrain', 'bangladesh': 'Bangladesh',
  'belarus': 'Belarus', 'belgium': 'Belgium', 'belize': 'Belize', 'benin': 'Benin',
  'bhutan': 'Bhutan', 'bolivia': 'Bolivia', 'bosnia': 'Bosnia and Herzegovina', 'botswana': 'Botswana',
  'brazil': 'Brazil', 'brunei': 'Brunei', 'bulgaria': 'Bulgaria', 'burkina faso': 'Burkina Faso',
  'burundi': 'Burundi', 'cambodia': 'Cambodia', 'cameroon': 'Cameroon', 'canada': 'Canada',
  'cape verde': 'Cape Verde', 'chad': 'Chad', 'chile': 'Chile', 'china': 'China',
  'colombia': 'Colombia', 'comoros': 'Comoros', 'congo': 'Congo', 'costa rica': 'Costa Rica',
  'croatia': 'Croatia', 'cuba': 'Cuba', 'cyprus': 'Cyprus', 'czech republic': 'Czech Republic',
  'czechia': 'Czech Republic', 'denmark': 'Denmark', 'djibouti': 'Djibouti', 'dominica': 'Dominica',
  'dominican republic': 'Dominican Republic', 'ecuador': 'Ecuador', 'egypt': 'Egypt',
  'el salvador': 'El Salvador', 'equatorial guinea': 'Equatorial Guinea', 'eritrea': 'Eritrea',
  'estonia': 'Estonia', 'eswatini': 'Eswatini', 'ethiopia': 'Ethiopia', 'fiji': 'Fiji',
  'finland': 'Finland', 'france': 'France', 'gabon': 'Gabon', 'gambia': 'Gambia',
  'georgia': 'Georgia', 'germany': 'Germany', 'ghana': 'Ghana', 'greece': 'Greece',
  'grenada': 'Grenada', 'guatemala': 'Guatemala', 'guinea': 'Guinea', 'guinea bissau': 'Guinea-Bissau',
  'guyana': 'Guyana', 'haiti': 'Haiti', 'honduras': 'Honduras', 'hungary': 'Hungary',
  'iceland': 'Iceland', 'india': 'India', 'indonesia': 'Indonesia', 'iran': 'Iran',
  'iraq': 'Iraq', 'ireland': 'Ireland', 'israel': 'Israel', 'italy': 'Italy',
  'ivory coast': 'Ivory Coast', 'jamaica': 'Jamaica', 'japan': 'Japan', 'jordan': 'Jordan',
  'kazakhstan': 'Kazakhstan', 'kenya': 'Kenya', 'kiribati': 'Kiribati', 'kuwait': 'Kuwait',
  'kyrgyzstan': 'Kyrgyzstan', 'laos': 'Laos', 'latvia': 'Latvia', 'lebanon': 'Lebanon',
  'lesotho': 'Lesotho', 'liberia': 'Liberia', 'libya': 'Libya', 'liechtenstein': 'Liechtenstein',
  'lithuania': 'Lithuania', 'luxembourg': 'Luxembourg', 'madagascar': 'Madagascar',
  'malawi': 'Malawi', 'malaysia': 'Malaysia', 'maldives': 'Maldives', 'mali': 'Mali',
  'malta': 'Malta', 'marshall islands': 'Marshall Islands', 'mauritania': 'Mauritania',
  'mauritius': 'Mauritius', 'mexico': 'Mexico', 'micronesia': 'Micronesia', 'moldova': 'Moldova',
  'monaco': 'Monaco', 'mongolia': 'Mongolia', 'montenegro': 'Montenegro', 'morocco': 'Morocco',
  'mozambique': 'Mozambique', 'myanmar': 'Myanmar', 'namibia': 'Namibia', 'nauru': 'Nauru',
  'nepal': 'Nepal', 'netherlands': 'Netherlands', 'new zealand': 'New Zealand', 'nicaragua': 'Nicaragua',
  'niger': 'Niger', 'nigeria': 'Nigeria', 'north korea': 'North Korea', 'north macedonia': 'North Macedonia',
  'norway': 'Norway', 'oman': 'Oman', 'pakistan': 'Pakistan', 'palau': 'Palau', 'panama': 'Panama',
  'papua new guinea': 'Papua New Guinea', 'paraguay': 'Paraguay', 'peru': 'Peru', 'philippines': 'Philippines',
  'poland': 'Poland', 'portugal': 'Portugal', 'qatar': 'Qatar', 'romania': 'Romania',
  'russia': 'Russia', 'rwanda': 'Rwanda', 'saint kitts': 'Saint Kitts and Nevis', 'saint lucia': 'Saint Lucia',
  'saint vincent': 'Saint Vincent and the Grenadines', 'samoa': 'Samoa', 'san marino': 'San Marino',
  'sao tome': 'Sao Tome and Principe', 'saudi arabia': 'Saudi Arabia', 'senegal': 'Senegal',
  'serbia': 'Serbia', 'seychelles': 'Seychelles', 'sierra leone': 'Sierra Leone', 'singapore': 'Singapore',
  'slovakia': 'Slovakia', 'slovenia': 'Slovenia', 'solomon islands': 'Solomon Islands', 'somalia': 'Somalia',
  'south africa': 'South Africa', 'south korea': 'South Korea', 'south sudan': 'South Sudan',
  'spain': 'Spain', 'sri lanka': 'Sri Lanka', 'sudan': 'Sudan', 'suriname': 'Suriname',
  'sweden': 'Sweden', 'switzerland': 'Switzerland', 'syria': 'Syria', 'taiwan': 'Taiwan',
  'tajikistan': 'Tajikistan', 'tanzania': 'Tanzania', 'thailand': 'Thailand', 'timor leste': 'Timor-Leste',
  'togo': 'Togo', 'tonga': 'Tonga', 'trinidad': 'Trinidad and Tobago', 'tunisia': 'Tunisia',
  'turkey': 'Turkey', 'türkiye': 'Turkey', 'turkmenistan': 'Turkmenistan', 'tuvalu': 'Tuvalu',
  'uganda': 'Uganda', 'ukraine': 'Ukraine', 'united arab emirates': 'United Arab Emirates',
  'united kingdom': 'United Kingdom', 'united states': 'United States', 'uruguay': 'Uruguay',
  'uzbekistan': 'Uzbekistan', 'vanuatu': 'Vanuatu', 'vatican': 'Vatican City', 'venezuela': 'Venezuela',
  'vietnam': 'Vietnam', 'yemen': 'Yemen', 'zambia': 'Zambia', 'zimbabwe': 'Zimbabwe'
};

// URL Parameters for Personalization
export const urlParameters = {
  // Add URL parameters for personalization as mentioned in the guide
  // These can be used to customize the user experience
};

// Helper functions
export function getAffiliateLink(baseLink: string, destination?: string, source?: string): string {
  if (!destination) {
    return baseLink;
  }
  
  // Normalize destination for lookup
  const normalizedDestination = destination.toLowerCase().trim();
  
  // Extract country from destination (remove city names)
  const country = extractCountryFromDestination(normalizedDestination);
  
  if (country && countryISOCodes[country]) {
    // Generate the correct BreezeSim product URL format
    const isoCode = countryISOCodes[country];
    const countryName = countryNames[country];
    const searchHandle = `esimg_${isoCode.toLowerCase()}_v2`;
    
    // Build the correct URL format
    let link = `https://breezesim.com/products/${searchHandle}?search=${encodeURIComponent(countryName)}&searchIso=${isoCode}&searchHandle=${searchHandle}&iccid=&utmSource=&utmMedium=&utmCampaign=`;
    
    // Add affiliate tracking
    link += `&sca_ref=9513707.18mF6FIHVI`;
    
    // Add source parameter if provided
    if (source) {
      link += `&source=${encodeURIComponent(source)}`;
    }
    
    return link;
  }
  
  // Fallback to the original method for unknown countries
  let link = baseLink;
  const cleanDestination = destination.replace(/[^a-zA-Z0-9\s]/g, '').trim();
  link += `&destination=${encodeURIComponent(cleanDestination)}`;
  
  if (source) {
    link += `&source=${encodeURIComponent(source)}`;
  }
  
  return link;
}

// Function to extract country from destination string
function extractCountryFromDestination(destination: string): string | null {
  // Split by common separators
  const parts = destination.split(/[,\s]+/);
  
  // Try to find a country in the parts
  for (const part of parts) {
    const cleanPart = part.toLowerCase().trim();
    if (countryISOCodes[cleanPart]) {
      return cleanPart;
    }
  }
  
  // Try common country variations
  const variations: Record<string, string> = {
    'usa': 'united states',
    'us': 'united states',
    'america': 'united states',
    'uk': 'united kingdom',
    'england': 'united kingdom',
    'uae': 'united arab emirates',
    'emirates': 'united arab emirates',
    'saudi': 'saudi arabia',
    'czech': 'czech republic',
    'bosnia': 'bosnia',
    'burkina': 'burkina faso',
    'cape': 'cape verde',
    'costa': 'costa rica',
    'dominican': 'dominican republic',
    'el': 'el salvador',
    'equatorial': 'equatorial guinea',
    'guinea bissau': 'guinea bissau',
    'ivory': 'ivory coast',
    'marshall': 'marshall islands',
    'new': 'new zealand',
    'north': 'north korea',
    'north macedonia': 'north macedonia',
    'papua': 'papua new guinea',
    'saint kitts': 'saint kitts',
    'saint lucia': 'saint lucia',
    'saint vincent': 'saint vincent',
    'sao': 'sao tome',
    'sierra': 'sierra leone',
    'solomon': 'solomon islands',
    'south': 'south korea',
    'south sudan': 'south sudan',
    'timor': 'timor leste',
    'trinidad': 'trinidad',
    'turkmenistan': 'turkmenistan',
    'vatican': 'vatican'
  };
  
  for (const part of parts) {
    const cleanPart = part.toLowerCase().trim();
    if (variations[cleanPart]) {
      return variations[cleanPart];
    }
  }
  
  return null;
}

export function getCommissionRate(option: keyof BreezeSimConfig['commissionOptions'] = 'default'): number {
  return breezesimConfig.commissionOptions[option].commission;
}

export function getDiscountRate(option: keyof BreezeSimConfig['commissionOptions'] = 'default'): number {
  return breezesimConfig.commissionOptions[option].discount;
}
