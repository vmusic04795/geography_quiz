// All UN member states + Vatican + Palestine
// iso2: used for flagcdn.com flag images
// borders: ISO alpha-3 codes of land-bordering countries
// oceans: bodies of water the country touches (for Gauntlet hard mode)

const COUNTRIES = {
  // ── Africa ──────────────────────────────────────────────────────────────
  DZA: { name: 'Algeria',                  capital: 'Algiers',          iso2: 'dz', region: 'Africa',   borders: ['TUN','LBY','NER','MLI','MRT','ESH','MAR'],                           oceans: ['Mediterranean Sea','Atlantic Ocean'] },
  AGO: { name: 'Angola',                   capital: 'Luanda',           iso2: 'ao', region: 'Africa',   borders: ['COG','COD','ZMB','NAM'],                                            oceans: ['Atlantic Ocean'] },
  BEN: { name: 'Benin',                    capital: 'Porto-Novo',       iso2: 'bj', region: 'Africa',   borders: ['TGO','NGA','NER','BFA'],                                            oceans: ['Atlantic Ocean'] },
  BWA: { name: 'Botswana',                 capital: 'Gaborone',         iso2: 'bw', region: 'Africa',   borders: ['ZMB','ZWE','NAM','ZAF'],                                            oceans: [] },
  BFA: { name: 'Burkina Faso',             capital: 'Ouagadougou',      iso2: 'bf', region: 'Africa',   borders: ['MLI','NER','BEN','TGO','GHA','CIV'],                                oceans: [] },
  BDI: { name: 'Burundi',                  capital: 'Gitega',           iso2: 'bi', region: 'Africa',   borders: ['RWA','TZA','COD'],                                                  oceans: [] },
  CMR: { name: 'Cameroon',                 capital: 'Yaoundé',          iso2: 'cm', region: 'Africa',   borders: ['NGA','TCD','CAF','COG','GAB','GNQ'],                                oceans: ['Atlantic Ocean'] },
  CPV: { name: 'Cape Verde',               capital: 'Praia',            iso2: 'cv', region: 'Africa',   borders: [],                                                                  oceans: ['Atlantic Ocean'] },
  CAF: { name: 'Central African Republic', capital: 'Bangui',           iso2: 'cf', region: 'Africa',   borders: ['TCD','SDN','SSD','COD','COG','CMR'],                                oceans: [] },
  TCD: { name: 'Chad',                     capital: "N'Djamena",        iso2: 'td', region: 'Africa',   borders: ['LBY','SDN','CAF','CMR','NGA','NER'],                                oceans: [] },
  COM: { name: 'Comoros',                  capital: 'Moroni',           iso2: 'km', region: 'Africa',   borders: [],                                                                  oceans: ['Indian Ocean'] },
  COD: { name: 'DR Congo',                 capital: 'Kinshasa',         iso2: 'cd', region: 'Africa',   borders: ['CAF','SSD','UGA','RWA','BDI','TZA','ZMB','AGO','COG'],              oceans: ['Atlantic Ocean'] },
  COG: { name: 'Republic of the Congo',    capital: 'Brazzaville',      iso2: 'cg', region: 'Africa',   borders: ['CMR','CAF','COD','AGO','GAB'],                                      oceans: ['Atlantic Ocean'] },
  DJI: { name: 'Djibouti',                capital: 'Djibouti',         iso2: 'dj', region: 'Africa',   borders: ['ERI','ETH','SOM'],                                                  oceans: ['Indian Ocean','Red Sea'] },
  EGY: { name: 'Egypt',                    capital: 'Cairo',            iso2: 'eg', region: 'Africa',   borders: ['LBY','SDN','ISR','PSE'],                                            oceans: ['Mediterranean Sea','Red Sea'] },
  GNQ: { name: 'Equatorial Guinea',        capital: 'Malabo',           iso2: 'gq', region: 'Africa',   borders: ['CMR','GAB'],                                                        oceans: ['Atlantic Ocean'] },
  ERI: { name: 'Eritrea',                  capital: 'Asmara',           iso2: 'er', region: 'Africa',   borders: ['ETH','SDN','DJI'],                                                  oceans: ['Red Sea'] },
  SWZ: { name: 'Eswatini',                 capital: 'Mbabane',          iso2: 'sz', region: 'Africa',   borders: ['ZAF','MOZ'],                                                        oceans: [] },
  ETH: { name: 'Ethiopia',                 capital: 'Addis Ababa',      iso2: 'et', region: 'Africa',   borders: ['ERI','DJI','SOM','KEN','SSD','SDN'],                                oceans: [] },
  GAB: { name: 'Gabon',                    capital: 'Libreville',       iso2: 'ga', region: 'Africa',   borders: ['CMR','COG','GNQ'],                                                  oceans: ['Atlantic Ocean'] },
  GMB: { name: 'Gambia',                   capital: 'Banjul',           iso2: 'gm', region: 'Africa',   borders: ['SEN'],                                                              oceans: ['Atlantic Ocean'] },
  GHA: { name: 'Ghana',                    capital: 'Accra',            iso2: 'gh', region: 'Africa',   borders: ['CIV','BFA','TGO'],                                                  oceans: ['Atlantic Ocean'] },
  GIN: { name: 'Guinea',                   capital: 'Conakry',          iso2: 'gn', region: 'Africa',   borders: ['SEN','GMB','GNB','SLE','LBR','CIV','MLI'],                          oceans: ['Atlantic Ocean'] },
  GNB: { name: 'Guinea-Bissau',            capital: 'Bissau',           iso2: 'gw', region: 'Africa',   borders: ['SEN','GIN'],                                                        oceans: ['Atlantic Ocean'] },
  CIV: { name: "Côte d'Ivoire",            capital: 'Yamoussoukro',     iso2: 'ci', region: 'Africa',   borders: ['LBR','GIN','MLI','BFA','GHA'],                                      oceans: ['Atlantic Ocean'] },
  KEN: { name: 'Kenya',                    capital: 'Nairobi',          iso2: 'ke', region: 'Africa',   borders: ['ETH','SOM','TZA','UGA','SSD'],                                      oceans: ['Indian Ocean'] },
  LSO: { name: 'Lesotho',                  capital: 'Maseru',           iso2: 'ls', region: 'Africa',   borders: ['ZAF'],                                                              oceans: [] },
  LBR: { name: 'Liberia',                  capital: 'Monrovia',         iso2: 'lr', region: 'Africa',   borders: ['GIN','SLE','CIV'],                                                  oceans: ['Atlantic Ocean'] },
  LBY: { name: 'Libya',                    capital: 'Tripoli',          iso2: 'ly', region: 'Africa',   borders: ['TUN','DZA','NER','TCD','SDN','EGY'],                                oceans: ['Mediterranean Sea'] },
  MDG: { name: 'Madagascar',               capital: 'Antananarivo',     iso2: 'mg', region: 'Africa',   borders: [],                                                                  oceans: ['Indian Ocean'] },
  MWI: { name: 'Malawi',                   capital: 'Lilongwe',         iso2: 'mw', region: 'Africa',   borders: ['ZMB','MOZ','TZA'],                                                  oceans: [] },
  MLI: { name: 'Mali',                     capital: 'Bamako',           iso2: 'ml', region: 'Africa',   borders: ['DZA','MRT','SEN','GIN','CIV','BFA','NER'],                          oceans: [] },
  MRT: { name: 'Mauritania',               capital: 'Nouakchott',       iso2: 'mr', region: 'Africa',   borders: ['MAR','DZA','MLI','SEN'],                                            oceans: ['Atlantic Ocean'] },
  MUS: { name: 'Mauritius',                capital: 'Port Louis',       iso2: 'mu', region: 'Africa',   borders: [],                                                                  oceans: ['Indian Ocean'] },
  MAR: { name: 'Morocco',                  capital: 'Rabat',            iso2: 'ma', region: 'Africa',   borders: ['DZA','MRT','ESP'],                                                  oceans: ['Atlantic Ocean','Mediterranean Sea'] },
  MOZ: { name: 'Mozambique',               capital: 'Maputo',           iso2: 'mz', region: 'Africa',   borders: ['TZA','MWI','ZMB','ZWE','ZAF','SWZ'],                                oceans: ['Indian Ocean'] },
  NAM: { name: 'Namibia',                  capital: 'Windhoek',         iso2: 'na', region: 'Africa',   borders: ['AGO','ZMB','BWA','ZAF'],                                            oceans: ['Atlantic Ocean'] },
  NER: { name: 'Niger',                    capital: 'Niamey',           iso2: 'ne', region: 'Africa',   borders: ['DZA','LBY','TCD','NGA','BEN','BFA','MLI'],                          oceans: [] },
  NGA: { name: 'Nigeria',                  capital: 'Abuja',            iso2: 'ng', region: 'Africa',   borders: ['BEN','NER','TCD','CMR'],                                            oceans: ['Atlantic Ocean'] },
  RWA: { name: 'Rwanda',                   capital: 'Kigali',           iso2: 'rw', region: 'Africa',   borders: ['UGA','TZA','BDI','COD'],                                            oceans: [] },
  STP: { name: 'São Tomé and Príncipe',    capital: 'São Tomé',         iso2: 'st', region: 'Africa',   borders: [],                                                                  oceans: ['Atlantic Ocean'] },
  SEN: { name: 'Senegal',                  capital: 'Dakar',            iso2: 'sn', region: 'Africa',   borders: ['MRT','MLI','GIN','GNB','GMB'],                                      oceans: ['Atlantic Ocean'] },
  SYC: { name: 'Seychelles',               capital: 'Victoria',         iso2: 'sc', region: 'Africa',   borders: [],                                                                  oceans: ['Indian Ocean'] },
  SLE: { name: 'Sierra Leone',             capital: 'Freetown',         iso2: 'sl', region: 'Africa',   borders: ['GIN','LBR'],                                                        oceans: ['Atlantic Ocean'] },
  SOM: { name: 'Somalia',                  capital: 'Mogadishu',        iso2: 'so', region: 'Africa',   borders: ['DJI','ETH','KEN'],                                                  oceans: ['Indian Ocean'] },
  ZAF: { name: 'South Africa',             capital: 'Pretoria',         iso2: 'za', region: 'Africa',   borders: ['NAM','BWA','ZWE','MOZ','SWZ','LSO'],                                oceans: ['Atlantic Ocean','Indian Ocean'] },
  SSD: { name: 'South Sudan',              capital: 'Juba',             iso2: 'ss', region: 'Africa',   borders: ['SDN','ETH','KEN','UGA','COD','CAF'],                                oceans: [] },
  SDN: { name: 'Sudan',                    capital: 'Khartoum',         iso2: 'sd', region: 'Africa',   borders: ['EGY','LBY','TCD','CAF','SSD','ETH','ERI'],                          oceans: ['Red Sea'] },
  TZA: { name: 'Tanzania',                 capital: 'Dodoma',           iso2: 'tz', region: 'Africa',   borders: ['KEN','UGA','RWA','BDI','COD','ZMB','MWI','MOZ'],                    oceans: ['Indian Ocean'] },
  TGO: { name: 'Togo',                     capital: 'Lomé',             iso2: 'tg', region: 'Africa',   borders: ['GHA','BEN','BFA'],                                                  oceans: ['Atlantic Ocean'] },
  TUN: { name: 'Tunisia',                  capital: 'Tunis',            iso2: 'tn', region: 'Africa',   borders: ['DZA','LBY'],                                                        oceans: ['Mediterranean Sea'] },
  UGA: { name: 'Uganda',                   capital: 'Kampala',          iso2: 'ug', region: 'Africa',   borders: ['SSD','ETH','KEN','TZA','RWA','COD'],                                oceans: [] },
  ZMB: { name: 'Zambia',                   capital: 'Lusaka',           iso2: 'zm', region: 'Africa',   borders: ['COD','TZA','MWI','MOZ','ZWE','BWA','NAM','AGO'],                    oceans: [] },
  ZWE: { name: 'Zimbabwe',                 capital: 'Harare',           iso2: 'zw', region: 'Africa',   borders: ['ZMB','MOZ','ZAF','BWA'],                                            oceans: [] },
  ESH: { name: 'Western Sahara',           capital: 'El Aaiún',         iso2: 'eh', region: 'Africa',   borders: ['DZA','MRT','MAR'],                                                  oceans: ['Atlantic Ocean'] },

  // ── Americas ─────────────────────────────────────────────────────────────
  ATG: { name: 'Antigua and Barbuda',      capital: "Saint John's",     iso2: 'ag', region: 'Americas', borders: [],                                                                  oceans: ['Atlantic Ocean','Caribbean Sea'] },
  ARG: { name: 'Argentina',               capital: 'Buenos Aires',     iso2: 'ar', region: 'Americas', borders: ['CHL','BOL','PRY','BRA','URY'],                                      oceans: ['Atlantic Ocean','Pacific Ocean'] },
  BHS: { name: 'Bahamas',                  capital: 'Nassau',           iso2: 'bs', region: 'Americas', borders: [],                                                                  oceans: ['Atlantic Ocean','Caribbean Sea'] },
  BRB: { name: 'Barbados',                 capital: 'Bridgetown',       iso2: 'bb', region: 'Americas', borders: [],                                                                  oceans: ['Atlantic Ocean','Caribbean Sea'] },
  BLZ: { name: 'Belize',                   capital: 'Belmopan',         iso2: 'bz', region: 'Americas', borders: ['MEX','GTM'],                                                        oceans: ['Caribbean Sea'] },
  BOL: { name: 'Bolivia',                  capital: 'Sucre',            iso2: 'bo', region: 'Americas', borders: ['PER','BRA','PRY','ARG','CHL'],                                      oceans: [] },
  BRA: { name: 'Brazil',                   capital: 'Brasília',         iso2: 'br', region: 'Americas', borders: ['VEN','GUY','SUR','COL','PER','BOL','PRY','ARG','URY'],              oceans: ['Atlantic Ocean'] },
  CAN: { name: 'Canada',                   capital: 'Ottawa',           iso2: 'ca', region: 'Americas', borders: ['USA'],                                                              oceans: ['Atlantic Ocean','Pacific Ocean','Arctic Ocean'] },
  CHL: { name: 'Chile',                    capital: 'Santiago',         iso2: 'cl', region: 'Americas', borders: ['PER','BOL','ARG'],                                                  oceans: ['Pacific Ocean','Atlantic Ocean'] },
  COL: { name: 'Colombia',                 capital: 'Bogotá',           iso2: 'co', region: 'Americas', borders: ['VEN','BRA','PER','ECU','PAN'],                                      oceans: ['Atlantic Ocean','Pacific Ocean','Caribbean Sea'] },
  CRI: { name: 'Costa Rica',               capital: 'San José',         iso2: 'cr', region: 'Americas', borders: ['NIC','PAN'],                                                        oceans: ['Pacific Ocean','Caribbean Sea'] },
  CUB: { name: 'Cuba',                     capital: 'Havana',           iso2: 'cu', region: 'Americas', borders: [],                                                                  oceans: ['Atlantic Ocean','Caribbean Sea'] },
  DMA: { name: 'Dominica',                 capital: 'Roseau',           iso2: 'dm', region: 'Americas', borders: [],                                                                  oceans: ['Atlantic Ocean','Caribbean Sea'] },
  DOM: { name: 'Dominican Republic',       capital: 'Santo Domingo',    iso2: 'do', region: 'Americas', borders: ['HTI'],                                                              oceans: ['Atlantic Ocean','Caribbean Sea'] },
  ECU: { name: 'Ecuador',                  capital: 'Quito',            iso2: 'ec', region: 'Americas', borders: ['COL','PER'],                                                        oceans: ['Pacific Ocean'] },
  SLV: { name: 'El Salvador',              capital: 'San Salvador',     iso2: 'sv', region: 'Americas', borders: ['GTM','HND'],                                                        oceans: ['Pacific Ocean'] },
  GRD: { name: 'Grenada',                  capital: "Saint George's",   iso2: 'gd', region: 'Americas', borders: [],                                                                  oceans: ['Atlantic Ocean','Caribbean Sea'] },
  GTM: { name: 'Guatemala',                capital: 'Guatemala City',   iso2: 'gt', region: 'Americas', borders: ['MEX','BLZ','HND','SLV'],                                            oceans: ['Pacific Ocean','Caribbean Sea'] },
  GUY: { name: 'Guyana',                   capital: 'Georgetown',       iso2: 'gy', region: 'Americas', borders: ['VEN','BRA','SUR'],                                                  oceans: ['Atlantic Ocean'] },
  HTI: { name: 'Haiti',                    capital: 'Port-au-Prince',   iso2: 'ht', region: 'Americas', borders: ['DOM'],                                                              oceans: ['Atlantic Ocean','Caribbean Sea'] },
  HND: { name: 'Honduras',                 capital: 'Tegucigalpa',      iso2: 'hn', region: 'Americas', borders: ['GTM','SLV','NIC'],                                                  oceans: ['Pacific Ocean','Caribbean Sea'] },
  JAM: { name: 'Jamaica',                  capital: 'Kingston',         iso2: 'jm', region: 'Americas', borders: [],                                                                  oceans: ['Caribbean Sea'] },
  MEX: { name: 'Mexico',                   capital: 'Mexico City',      iso2: 'mx', region: 'Americas', borders: ['USA','GTM','BLZ'],                                                  oceans: ['Pacific Ocean','Atlantic Ocean','Gulf of Mexico'] },
  NIC: { name: 'Nicaragua',                capital: 'Managua',          iso2: 'ni', region: 'Americas', borders: ['HND','CRI'],                                                        oceans: ['Pacific Ocean','Caribbean Sea'] },
  PAN: { name: 'Panama',                   capital: 'Panama City',      iso2: 'pa', region: 'Americas', borders: ['CRI','COL'],                                                        oceans: ['Pacific Ocean','Caribbean Sea'] },
  PRY: { name: 'Paraguay',                 capital: 'Asunción',         iso2: 'py', region: 'Americas', borders: ['BOL','BRA','ARG'],                                                  oceans: [] },
  PER: { name: 'Peru',                     capital: 'Lima',             iso2: 'pe', region: 'Americas', borders: ['ECU','COL','BRA','BOL','CHL'],                                      oceans: ['Pacific Ocean'] },
  KNA: { name: 'Saint Kitts and Nevis',    capital: 'Basseterre',       iso2: 'kn', region: 'Americas', borders: [],                                                                  oceans: ['Atlantic Ocean','Caribbean Sea'] },
  LCA: { name: 'Saint Lucia',              capital: 'Castries',         iso2: 'lc', region: 'Americas', borders: [],                                                                  oceans: ['Atlantic Ocean','Caribbean Sea'] },
  VCT: { name: 'Saint Vincent and the Grenadines', capital: 'Kingstown', iso2: 'vc', region: 'Americas', borders: [],                                                                oceans: ['Atlantic Ocean','Caribbean Sea'] },
  SUR: { name: 'Suriname',                 capital: 'Paramaribo',       iso2: 'sr', region: 'Americas', borders: ['GUY','BRA'],                                                        oceans: ['Atlantic Ocean'] },
  TTO: { name: 'Trinidad and Tobago',      capital: 'Port of Spain',    iso2: 'tt', region: 'Americas', borders: [],                                                                  oceans: ['Atlantic Ocean','Caribbean Sea'] },
  USA: { name: 'United States',            capital: 'Washington, D.C.', iso2: 'us', region: 'Americas', borders: ['CAN','MEX'],                                                        oceans: ['Atlantic Ocean','Pacific Ocean','Arctic Ocean','Gulf of Mexico'] },
  URY: { name: 'Uruguay',                  capital: 'Montevideo',       iso2: 'uy', region: 'Americas', borders: ['BRA','ARG'],                                                        oceans: ['Atlantic Ocean'] },
  VEN: { name: 'Venezuela',                capital: 'Caracas',          iso2: 've', region: 'Americas', borders: ['COL','BRA','GUY'],                                                  oceans: ['Atlantic Ocean','Caribbean Sea'] },

  // ── Asia ─────────────────────────────────────────────────────────────────
  AFG: { name: 'Afghanistan',              capital: 'Kabul',            iso2: 'af', region: 'Asia',     borders: ['IRN','TKM','UZB','TJK','CHN','PAK'],                                oceans: [] },
  ARM: { name: 'Armenia',                  capital: 'Yerevan',          iso2: 'am', region: 'Asia',     borders: ['TUR','GEO','AZE','IRN'],                                            oceans: [] },
  AZE: { name: 'Azerbaijan',               capital: 'Baku',             iso2: 'az', region: 'Asia',     borders: ['RUS','GEO','ARM','IRN','TUR'],                                      oceans: ['Caspian Sea'] },
  BHR: { name: 'Bahrain',                  capital: 'Manama',           iso2: 'bh', region: 'Asia',     borders: [],                                                                  oceans: ['Persian Gulf'] },
  BGD: { name: 'Bangladesh',               capital: 'Dhaka',            iso2: 'bd', region: 'Asia',     borders: ['IND','MMR'],                                                        oceans: ['Indian Ocean','Bay of Bengal'] },
  BTN: { name: 'Bhutan',                   capital: 'Thimphu',          iso2: 'bt', region: 'Asia',     borders: ['CHN','IND'],                                                        oceans: [] },
  BRN: { name: 'Brunei',                   capital: 'Bandar Seri Begawan', iso2: 'bn', region: 'Asia',  borders: ['MYS'],                                                              oceans: ['South China Sea'] },
  KHM: { name: 'Cambodia',                 capital: 'Phnom Penh',       iso2: 'kh', region: 'Asia',     borders: ['THA','LAO','VNM'],                                                  oceans: ['Gulf of Thailand'] },
  CHN: { name: 'China',                    capital: 'Beijing',          iso2: 'cn', region: 'Asia',     borders: ['RUS','MNG','KAZ','KGZ','TJK','AFG','PAK','IND','NPL','BTN','MMR','LAO','VNM','PRK'], oceans: ['Pacific Ocean','South China Sea','East China Sea','Yellow Sea'] },
  CYP: { name: 'Cyprus',                   capital: 'Nicosia',          iso2: 'cy', region: 'Asia',     borders: [],                                                                  oceans: ['Mediterranean Sea'] },
  GEO: { name: 'Georgia',                  capital: 'Tbilisi',          iso2: 'ge', region: 'Asia',     borders: ['RUS','TUR','ARM','AZE'],                                            oceans: ['Black Sea'] },
  IND: { name: 'India',                    capital: 'New Delhi',        iso2: 'in', region: 'Asia',     borders: ['PAK','CHN','NPL','BTN','BGD','MMR'],                                oceans: ['Indian Ocean','Arabian Sea','Bay of Bengal'] },
  IDN: { name: 'Indonesia',                capital: 'Jakarta',          iso2: 'id', region: 'Asia',     borders: ['MYS','PNG','TLS'],                                                  oceans: ['Indian Ocean','Pacific Ocean'] },
  IRN: { name: 'Iran',                     capital: 'Tehran',           iso2: 'ir', region: 'Asia',     borders: ['IRQ','TUR','ARM','AZE','TKM','AFG','PAK'],                          oceans: ['Persian Gulf','Caspian Sea','Gulf of Oman'] },
  IRQ: { name: 'Iraq',                     capital: 'Baghdad',          iso2: 'iq', region: 'Asia',     borders: ['TUR','SYR','JOR','SAU','KWT','IRN'],                                oceans: ['Persian Gulf'] },
  ISR: { name: 'Israel',                   capital: 'Jerusalem',        iso2: 'il', region: 'Asia',     borders: ['LBN','SYR','JOR','EGY','PSE'],                                      oceans: ['Mediterranean Sea','Red Sea'] },
  JPN: { name: 'Japan',                    capital: 'Tokyo',            iso2: 'jp', region: 'Asia',     borders: [],                                                                  oceans: ['Pacific Ocean','Sea of Japan'] },
  JOR: { name: 'Jordan',                   capital: 'Amman',            iso2: 'jo', region: 'Asia',     borders: ['ISR','PSE','SYR','IRQ','SAU'],                                      oceans: ['Red Sea'] },
  KAZ: { name: 'Kazakhstan',               capital: 'Astana',           iso2: 'kz', region: 'Asia',     borders: ['RUS','CHN','KGZ','UZB','TKM'],                                      oceans: ['Caspian Sea'] },
  PRK: { name: 'North Korea',              capital: 'Pyongyang',        iso2: 'kp', region: 'Asia',     borders: ['CHN','RUS','KOR'],                                                  oceans: ['Sea of Japan','Yellow Sea'] },
  KOR: { name: 'South Korea',              capital: 'Seoul',            iso2: 'kr', region: 'Asia',     borders: ['PRK'],                                                              oceans: ['Pacific Ocean','Sea of Japan','Yellow Sea'] },
  KWT: { name: 'Kuwait',                   capital: 'Kuwait City',      iso2: 'kw', region: 'Asia',     borders: ['IRQ','SAU'],                                                        oceans: ['Persian Gulf'] },
  KGZ: { name: 'Kyrgyzstan',               capital: 'Bishkek',          iso2: 'kg', region: 'Asia',     borders: ['KAZ','CHN','TJK','UZB'],                                            oceans: [] },
  LAO: { name: 'Laos',                     capital: 'Vientiane',        iso2: 'la', region: 'Asia',     borders: ['CHN','VNM','KHM','THA','MMR'],                                      oceans: [] },
  LBN: { name: 'Lebanon',                  capital: 'Beirut',           iso2: 'lb', region: 'Asia',     borders: ['SYR','ISR'],                                                        oceans: ['Mediterranean Sea'] },
  MYS: { name: 'Malaysia',                 capital: 'Kuala Lumpur',     iso2: 'my', region: 'Asia',     borders: ['THA','IDN','BRN'],                                                  oceans: ['South China Sea','Indian Ocean'] },
  MDV: { name: 'Maldives',                 capital: 'Malé',             iso2: 'mv', region: 'Asia',     borders: [],                                                                  oceans: ['Indian Ocean'] },
  MNG: { name: 'Mongolia',                 capital: 'Ulaanbaatar',      iso2: 'mn', region: 'Asia',     borders: ['RUS','CHN'],                                                        oceans: [] },
  MMR: { name: 'Myanmar',                  capital: 'Naypyidaw',        iso2: 'mm', region: 'Asia',     borders: ['CHN','LAO','THA','BGD','IND'],                                      oceans: ['Indian Ocean','Bay of Bengal'] },
  NPL: { name: 'Nepal',                    capital: 'Kathmandu',        iso2: 'np', region: 'Asia',     borders: ['CHN','IND'],                                                        oceans: [] },
  OMN: { name: 'Oman',                     capital: 'Muscat',           iso2: 'om', region: 'Asia',     borders: ['ARE','SAU','YEM'],                                                  oceans: ['Arabian Sea','Gulf of Oman','Persian Gulf'] },
  PAK: { name: 'Pakistan',                 capital: 'Islamabad',        iso2: 'pk', region: 'Asia',     borders: ['IND','CHN','AFG','IRN'],                                            oceans: ['Arabian Sea'] },
  PSE: { name: 'Palestine',                capital: 'Ramallah',         iso2: 'ps', region: 'Asia',     borders: ['ISR','EGY','JOR'],                                                  oceans: ['Mediterranean Sea'] },
  PHL: { name: 'Philippines',              capital: 'Manila',           iso2: 'ph', region: 'Asia',     borders: [],                                                                  oceans: ['Pacific Ocean','South China Sea'] },
  QAT: { name: 'Qatar',                    capital: 'Doha',             iso2: 'qa', region: 'Asia',     borders: ['SAU'],                                                              oceans: ['Persian Gulf'] },
  SAU: { name: 'Saudi Arabia',             capital: 'Riyadh',           iso2: 'sa', region: 'Asia',     borders: ['JOR','IRQ','KWT','ARE','OMN','YEM','QAT'],                          oceans: ['Red Sea','Persian Gulf'] },
  SGP: { name: 'Singapore',                capital: 'Singapore',        iso2: 'sg', region: 'Asia',     borders: ['MYS'],                                                              oceans: ['South China Sea','Indian Ocean'] },
  LKA: { name: 'Sri Lanka',                capital: 'Colombo',          iso2: 'lk', region: 'Asia',     borders: [],                                                                  oceans: ['Indian Ocean'] },
  SYR: { name: 'Syria',                    capital: 'Damascus',         iso2: 'sy', region: 'Asia',     borders: ['TUR','IRQ','JOR','ISR','LBN'],                                      oceans: ['Mediterranean Sea'] },
  TJK: { name: 'Tajikistan',               capital: 'Dushanbe',         iso2: 'tj', region: 'Asia',     borders: ['KGZ','CHN','AFG','UZB'],                                            oceans: [] },
  THA: { name: 'Thailand',                 capital: 'Bangkok',          iso2: 'th', region: 'Asia',     borders: ['MMR','LAO','KHM','MYS'],                                            oceans: ['Gulf of Thailand','Indian Ocean'] },
  TLS: { name: 'Timor-Leste',              capital: 'Dili',             iso2: 'tl', region: 'Asia',     borders: ['IDN'],                                                              oceans: ['Timor Sea'] },
  TUR: { name: 'Turkey',                   capital: 'Ankara',           iso2: 'tr', region: 'Asia',     borders: ['GEO','ARM','AZE','IRN','IRQ','SYR','GRC','BGR'],                    oceans: ['Black Sea','Mediterranean Sea','Aegean Sea'] },
  TKM: { name: 'Turkmenistan',             capital: 'Ashgabat',         iso2: 'tm', region: 'Asia',     borders: ['KAZ','UZB','AFG','IRN'],                                            oceans: ['Caspian Sea'] },
  ARE: { name: 'United Arab Emirates',     capital: 'Abu Dhabi',        iso2: 'ae', region: 'Asia',     borders: ['SAU','OMN'],                                                        oceans: ['Persian Gulf','Gulf of Oman'] },
  UZB: { name: 'Uzbekistan',               capital: 'Tashkent',         iso2: 'uz', region: 'Asia',     borders: ['KAZ','KGZ','TJK','AFG','TKM'],                                      oceans: [] },
  VNM: { name: 'Vietnam',                  capital: 'Hanoi',            iso2: 'vn', region: 'Asia',     borders: ['CHN','LAO','KHM'],                                                  oceans: ['South China Sea'] },
  YEM: { name: 'Yemen',                    capital: "Sana'a",           iso2: 'ye', region: 'Asia',     borders: ['SAU','OMN'],                                                        oceans: ['Red Sea','Arabian Sea','Gulf of Aden'] },

  // ── Europe ────────────────────────────────────────────────────────────────
  ALB: { name: 'Albania',                  capital: 'Tirana',           iso2: 'al', region: 'Europe',   borders: ['MNE','SRB','MKD','GRC'],                                            oceans: ['Adriatic Sea','Mediterranean Sea'] },
  AND: { name: 'Andorra',                  capital: 'Andorra la Vella', iso2: 'ad', region: 'Europe',   borders: ['ESP','FRA'],                                                        oceans: [] },
  AUT: { name: 'Austria',                  capital: 'Vienna',           iso2: 'at', region: 'Europe',   borders: ['DEU','CZE','SVK','HUN','SVN','ITA','LIE','CHE'],                    oceans: [] },
  BLR: { name: 'Belarus',                  capital: 'Minsk',            iso2: 'by', region: 'Europe',   borders: ['RUS','LVA','LTU','POL','UKR'],                                      oceans: [] },
  BEL: { name: 'Belgium',                  capital: 'Brussels',         iso2: 'be', region: 'Europe',   borders: ['FRA','LUX','DEU','NLD'],                                            oceans: ['North Sea'] },
  BIH: { name: 'Bosnia and Herzegovina',   capital: 'Sarajevo',         iso2: 'ba', region: 'Europe',   borders: ['HRV','SRB','MNE'],                                                  oceans: ['Adriatic Sea'] },
  BGR: { name: 'Bulgaria',                 capital: 'Sofia',            iso2: 'bg', region: 'Europe',   borders: ['ROU','SRB','MKD','GRC','TUR'],                                      oceans: ['Black Sea'] },
  HRV: { name: 'Croatia',                  capital: 'Zagreb',           iso2: 'hr', region: 'Europe',   borders: ['SVN','HUN','SRB','BIH','MNE'],                                      oceans: ['Adriatic Sea'] },
  CZE: { name: 'Czechia',                  capital: 'Prague',           iso2: 'cz', region: 'Europe',   borders: ['DEU','POL','SVK','AUT'],                                            oceans: [] },
  DNK: { name: 'Denmark',                  capital: 'Copenhagen',       iso2: 'dk', region: 'Europe',   borders: ['DEU'],                                                              oceans: ['North Sea','Baltic Sea'] },
  EST: { name: 'Estonia',                  capital: 'Tallinn',          iso2: 'ee', region: 'Europe',   borders: ['RUS','LVA'],                                                        oceans: ['Baltic Sea'] },
  FIN: { name: 'Finland',                  capital: 'Helsinki',         iso2: 'fi', region: 'Europe',   borders: ['NOR','SWE','RUS'],                                                  oceans: ['Baltic Sea'] },
  FRA: { name: 'France',                   capital: 'Paris',            iso2: 'fr', region: 'Europe',   borders: ['AND','BEL','LUX','DEU','CHE','ITA','MCO','ESP'],                    oceans: ['Atlantic Ocean','Mediterranean Sea'] },
  DEU: { name: 'Germany',                  capital: 'Berlin',           iso2: 'de', region: 'Europe',   borders: ['DNK','POL','CZE','AUT','CHE','FRA','LUX','BEL','NLD'],              oceans: ['North Sea','Baltic Sea'] },
  GRC: { name: 'Greece',                   capital: 'Athens',           iso2: 'gr', region: 'Europe',   borders: ['ALB','MKD','BGR','TUR'],                                            oceans: ['Mediterranean Sea','Aegean Sea','Ionian Sea'] },
  HUN: { name: 'Hungary',                  capital: 'Budapest',         iso2: 'hu', region: 'Europe',   borders: ['AUT','SVK','UKR','ROU','SRB','HRV','SVN'],                          oceans: [] },
  ISL: { name: 'Iceland',                  capital: 'Reykjavík',        iso2: 'is', region: 'Europe',   borders: [],                                                                  oceans: ['Atlantic Ocean','Arctic Ocean'] },
  IRL: { name: 'Ireland',                  capital: 'Dublin',           iso2: 'ie', region: 'Europe',   borders: ['GBR'],                                                              oceans: ['Atlantic Ocean'] },
  ITA: { name: 'Italy',                    capital: 'Rome',             iso2: 'it', region: 'Europe',   borders: ['FRA','CHE','AUT','SVN','SMR','VAT'],                                oceans: ['Mediterranean Sea','Adriatic Sea'] },
  LVA: { name: 'Latvia',                   capital: 'Riga',             iso2: 'lv', region: 'Europe',   borders: ['EST','RUS','BLR','LTU'],                                            oceans: ['Baltic Sea'] },
  LIE: { name: 'Liechtenstein',            capital: 'Vaduz',            iso2: 'li', region: 'Europe',   borders: ['AUT','CHE'],                                                        oceans: [] },
  LTU: { name: 'Lithuania',                capital: 'Vilnius',          iso2: 'lt', region: 'Europe',   borders: ['LVA','BLR','POL','RUS'],                                            oceans: ['Baltic Sea'] },
  LUX: { name: 'Luxembourg',               capital: 'Luxembourg City',  iso2: 'lu', region: 'Europe',   borders: ['BEL','DEU','FRA'],                                                  oceans: [] },
  MLT: { name: 'Malta',                    capital: 'Valletta',         iso2: 'mt', region: 'Europe',   borders: [],                                                                  oceans: ['Mediterranean Sea'] },
  MDA: { name: 'Moldova',                  capital: 'Chișinău',         iso2: 'md', region: 'Europe',   borders: ['UKR','ROU'],                                                        oceans: [] },
  MCO: { name: 'Monaco',                   capital: 'Monaco',           iso2: 'mc', region: 'Europe',   borders: ['FRA'],                                                              oceans: ['Mediterranean Sea'] },
  MNE: { name: 'Montenegro',               capital: 'Podgorica',        iso2: 'me', region: 'Europe',   borders: ['HRV','BIH','SRB','ALB'],                                            oceans: ['Adriatic Sea'] },
  NLD: { name: 'Netherlands',              capital: 'Amsterdam',        iso2: 'nl', region: 'Europe',   borders: ['BEL','DEU'],                                                        oceans: ['North Sea'] },
  MKD: { name: 'North Macedonia',          capital: 'Skopje',           iso2: 'mk', region: 'Europe',   borders: ['SRB','BGR','GRC','ALB'],                                            oceans: [] },
  NOR: { name: 'Norway',                   capital: 'Oslo',             iso2: 'no', region: 'Europe',   borders: ['SWE','FIN','RUS'],                                                  oceans: ['Atlantic Ocean','Arctic Ocean','North Sea'] },
  POL: { name: 'Poland',                   capital: 'Warsaw',           iso2: 'pl', region: 'Europe',   borders: ['DEU','CZE','SVK','UKR','BLR','LTU','RUS'],                          oceans: ['Baltic Sea'] },
  PRT: { name: 'Portugal',                 capital: 'Lisbon',           iso2: 'pt', region: 'Europe',   borders: ['ESP'],                                                              oceans: ['Atlantic Ocean'] },
  ROU: { name: 'Romania',                  capital: 'Bucharest',        iso2: 'ro', region: 'Europe',   borders: ['UKR','MDA','BGR','SRB','HUN'],                                      oceans: ['Black Sea'] },
  RUS: { name: 'Russia',                   capital: 'Moscow',           iso2: 'ru', region: 'Europe',   borders: ['NOR','FIN','EST','LVA','LTU','POL','BLR','UKR','GEO','AZE','KAZ','CHN','MNG','PRK'], oceans: ['Arctic Ocean','Pacific Ocean','Atlantic Ocean','Black Sea','Caspian Sea'] },
  SMR: { name: 'San Marino',               capital: 'San Marino',       iso2: 'sm', region: 'Europe',   borders: ['ITA'],                                                              oceans: [] },
  SRB: { name: 'Serbia',                   capital: 'Belgrade',         iso2: 'rs', region: 'Europe',   borders: ['HUN','ROU','BGR','MKD','MNE','BIH','HRV'],                          oceans: [] },
  SVK: { name: 'Slovakia',                 capital: 'Bratislava',       iso2: 'sk', region: 'Europe',   borders: ['CZE','POL','UKR','HUN','AUT'],                                      oceans: [] },
  SVN: { name: 'Slovenia',                 capital: 'Ljubljana',        iso2: 'si', region: 'Europe',   borders: ['ITA','AUT','HUN','HRV'],                                            oceans: ['Adriatic Sea'] },
  ESP: { name: 'Spain',                    capital: 'Madrid',           iso2: 'es', region: 'Europe',   borders: ['PRT','FRA','AND','MAR'],                                            oceans: ['Atlantic Ocean','Mediterranean Sea'] },
  SWE: { name: 'Sweden',                   capital: 'Stockholm',        iso2: 'se', region: 'Europe',   borders: ['NOR','FIN'],                                                        oceans: ['Baltic Sea','North Sea'] },
  CHE: { name: 'Switzerland',              capital: 'Bern',             iso2: 'ch', region: 'Europe',   borders: ['DEU','AUT','LIE','ITA','FRA'],                                      oceans: [] },
  UKR: { name: 'Ukraine',                  capital: 'Kyiv',             iso2: 'ua', region: 'Europe',   borders: ['RUS','BLR','POL','SVK','HUN','ROU','MDA'],                          oceans: ['Black Sea'] },
  GBR: { name: 'United Kingdom',           capital: 'London',           iso2: 'gb', region: 'Europe',   borders: ['IRL'],                                                              oceans: ['Atlantic Ocean','North Sea'] },
  VAT: { name: 'Vatican City',             capital: 'Vatican City',     iso2: 'va', region: 'Europe',   borders: ['ITA'],                                                              oceans: [] },

  // ── Oceania ───────────────────────────────────────────────────────────────
  AUS: { name: 'Australia',                capital: 'Canberra',         iso2: 'au', region: 'Oceania',  borders: [],                                                                  oceans: ['Pacific Ocean','Indian Ocean'] },
  FJI: { name: 'Fiji',                     capital: 'Suva',             iso2: 'fj', region: 'Oceania',  borders: [],                                                                  oceans: ['Pacific Ocean'] },
  KIR: { name: 'Kiribati',                 capital: 'South Tarawa',     iso2: 'ki', region: 'Oceania',  borders: [],                                                                  oceans: ['Pacific Ocean'] },
  MHL: { name: 'Marshall Islands',         capital: 'Majuro',           iso2: 'mh', region: 'Oceania',  borders: [],                                                                  oceans: ['Pacific Ocean'] },
  FSM: { name: 'Micronesia',               capital: 'Palikir',          iso2: 'fm', region: 'Oceania',  borders: [],                                                                  oceans: ['Pacific Ocean'] },
  NRU: { name: 'Nauru',                    capital: 'Yaren',            iso2: 'nr', region: 'Oceania',  borders: [],                                                                  oceans: ['Pacific Ocean'] },
  NZL: { name: 'New Zealand',              capital: 'Wellington',       iso2: 'nz', region: 'Oceania',  borders: [],                                                                  oceans: ['Pacific Ocean'] },
  PLW: { name: 'Palau',                    capital: 'Ngerulmud',        iso2: 'pw', region: 'Oceania',  borders: [],                                                                  oceans: ['Pacific Ocean'] },
  PNG: { name: 'Papua New Guinea',         capital: 'Port Moresby',     iso2: 'pg', region: 'Oceania',  borders: ['IDN'],                                                              oceans: ['Pacific Ocean'] },
  WSM: { name: 'Samoa',                    capital: 'Apia',             iso2: 'ws', region: 'Oceania',  borders: [],                                                                  oceans: ['Pacific Ocean'] },
  SLB: { name: 'Solomon Islands',          capital: 'Honiara',          iso2: 'sb', region: 'Oceania',  borders: [],                                                                  oceans: ['Pacific Ocean'] },
  TON: { name: 'Tonga',                    capital: "Nuku'alofa",       iso2: 'to', region: 'Oceania',  borders: [],                                                                  oceans: ['Pacific Ocean'] },
  TUV: { name: 'Tuvalu',                   capital: 'Funafuti',         iso2: 'tv', region: 'Oceania',  borders: [],                                                                  oceans: ['Pacific Ocean'] },
  VUT: { name: 'Vanuatu',                  capital: 'Port Vila',        iso2: 'vu', region: 'Oceania',  borders: [],                                                                  oceans: ['Pacific Ocean'] },
};

// Flat arrays for random selection
const COUNTRY_CODES = Object.keys(COUNTRIES);
const COUNTRY_LIST = COUNTRY_CODES.map(code => ({ code, ...COUNTRIES[code] }));

// Countries that have land borders (relevant for Borders and Pathfinder modes)
const BORDERED_COUNTRIES = COUNTRY_CODES.filter(c => COUNTRIES[c].borders.length > 0);

// Build adjacency lookup (bidirectional)
function getNeighbors(code) {
  return COUNTRIES[code]?.borders ?? [];
}

// BFS: find shortest path between two countries
function findShortestPath(startCode, endCode) {
  if (startCode === endCode) return [startCode];
  const visited = new Set([startCode]);
  const queue = [[startCode]];
  while (queue.length) {
    const path = queue.shift();
    const current = path[path.length - 1];
    for (const neighbor of COUNTRIES[current]?.borders ?? []) {
      if (neighbor === endCode) return [...path, neighbor];
      if (!visited.has(neighbor)) {
        visited.add(neighbor);
        queue.push([...path, neighbor]);
      }
    }
  }
  return null; // no path (islands)
}

// Pick two random countries that have a path between them
function randomPathPair(minHops = 2, maxHops = 8) {
  for (let attempts = 0; attempts < 200; attempts++) {
    const a = BORDERED_COUNTRIES[Math.floor(Math.random() * BORDERED_COUNTRIES.length)];
    const b = BORDERED_COUNTRIES[Math.floor(Math.random() * BORDERED_COUNTRIES.length)];
    if (a === b) continue;
    const path = findShortestPath(a, b);
    if (path && path.length - 1 >= minHops && path.length - 1 <= maxHops) {
      return { start: a, end: b, optimalPath: path, optimalHops: path.length - 1 };
    }
  }
  return null;
}

// Country name search (returns code or null)
function findCountryByName(input) {
  const clean = input.trim().toLowerCase();
  for (const code of COUNTRY_CODES) {
    if (COUNTRIES[code].name.toLowerCase() === clean) return code;
  }
  // Fuzzy: contains
  for (const code of COUNTRY_CODES) {
    if (COUNTRIES[code].name.toLowerCase().includes(clean) && clean.length > 2) return code;
  }
  return null;
}

// Autocomplete suggestions
function autocomplete(input, limit = 6) {
  const clean = input.trim().toLowerCase();
  if (!clean) return [];
  return COUNTRY_LIST
    .filter(c => c.name.toLowerCase().startsWith(clean))
    .concat(COUNTRY_LIST.filter(c => !c.name.toLowerCase().startsWith(clean) && c.name.toLowerCase().includes(clean)))
    .slice(0, limit)
    .map(c => ({ code: c.code, name: c.name }));
}

// Predefined flag-color themes — iso2 used to display real flag images
const FLAG_THEMES = {
  usa: { name: 'United States',  iso2: 'us', colors: ['#B22234','#FFFFFF','#3C3B6E'] },
  fra: { name: 'France',         iso2: 'fr', colors: ['#002395','#FFFFFF','#ED2939'] },
  deu: { name: 'Germany',        iso2: 'de', colors: ['#000000','#DD0000','#FFCE00'] },
  bra: { name: 'Brazil',         iso2: 'br', colors: ['#009C3B','#FEDF00','#002776'] },
  jpn: { name: 'Japan',          iso2: 'jp', colors: ['#FFFFFF','#BC002D'] },
  nga: { name: 'Nigeria',        iso2: 'ng', colors: ['#008751','#FFFFFF'] },
  zaf: { name: 'South Africa',   iso2: 'za', colors: ['#007A4D','#FFB81C','#002395','#E03C31'] },
  ind: { name: 'India',          iso2: 'in', colors: ['#FF9933','#FFFFFF','#138808'] },
  gbr: { name: 'United Kingdom', iso2: 'gb', colors: ['#012169','#FFFFFF','#C8102E'] },
  aus: { name: 'Australia',      iso2: 'au', colors: ['#00008B','#FFFFFF','#FF0000'] },
  mex: { name: 'Mexico',         iso2: 'mx', colors: ['#006847','#FFFFFF','#CE1126'] },
  can: { name: 'Canada',         iso2: 'ca', colors: ['#FF0000','#FFFFFF'] },
  arg: { name: 'Argentina',      iso2: 'ar', colors: ['#74ACDF','#FFFFFF','#F6B40E'] },
  tur: { name: 'Turkey',         iso2: 'tr', colors: ['#E30A17','#FFFFFF'] },
  chn: { name: 'China',          iso2: 'cn', colors: ['#DE2910','#FFDE00'] },
  ita: { name: 'Italy',          iso2: 'it', colors: ['#009246','#FFFFFF','#CE2B37'] },
  esp: { name: 'Spain',          iso2: 'es', colors: ['#c60b1e','#ffc400'] },
  gha: { name: 'Ghana',          iso2: 'gh', colors: ['#006B3F','#FCD116','#CE1126','#000000'] },
  jam: { name: 'Jamaica',        iso2: 'jm', colors: ['#000000','#FED100','#007847'] },
  ken: { name: 'Kenya',          iso2: 'ke', colors: ['#006600','#FFFFFF','#BB0000','#000000'] },
  nzl: { name: 'New Zealand',    iso2: 'nz', colors: ['#00247D','#FFFFFF','#CC142B'] },
  prt: { name: 'Portugal',       iso2: 'pt', colors: ['#006600','#FF0000','#FFFF00'] },
};
