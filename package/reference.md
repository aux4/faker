# Faker.js Reference

Complete list of available faker categories and types.

### airline

| Type | Args |
|------|------|
| aircraftType |  |
| airline |  |
| airplane |  |
| airport |  |
| flightNumber | length<br>min<br>max<br>addLeadingZeros |
| recordLocator | allowNumerics<br>allowVisuallySimilarCharacters |
| seat | aircraftType |

### animal

| Type | Args |
|------|------|
| bear |  |
| bird |  |
| cat |  |
| cetacean |  |
| cow |  |
| crocodilia |  |
| dog |  |
| fish |  |
| horse |  |
| insect |  |
| lion |  |
| petName |  |
| rabbit |  |
| rodent |  |
| snake |  |
| type |  |

### book

| Type | Args |
|------|------|
| author |  |
| format |  |
| genre |  |
| publisher |  |
| series |  |
| title |  |

### color

| Type | Args |
|------|------|
| cmyk | format |
| colorByCSSColorSpace | format<br>space |
| cssSupportedFunction |  |
| cssSupportedSpace |  |
| hsl | format<br>includeAlpha |
| human |  |
| hwb | format |
| lab | format |
| lch | format |
| rgb | prefix<br>casing<br>format<br>includeAlpha |
| space |  |

### commerce

| Type | Args |
|------|------|
| department |  |
| isbn | variant<br>separator |
| price | min<br>max<br>dec<br>symbol |
| product |  |
| productAdjective |  |
| productDescription |  |
| productMaterial |  |
| productName |  |

### company

| Type | Args |
|------|------|
| buzzAdjective |  |
| buzzNoun |  |
| buzzPhrase |  |
| buzzVerb |  |
| catchPhrase |  |
| catchPhraseAdjective |  |
| catchPhraseDescriptor |  |
| catchPhraseNoun |  |
| name |  |

### database

| Type | Args |
|------|------|
| collation |  |
| column |  |
| engine |  |
| mongodbObjectId |  |
| type |  |

### datatype

| Type | Args |
|------|------|
| boolean | probability |

### date

| Type | Args |
|------|------|
| anytime | refDate |
| between | from<br>to |
| betweens | from<br>to<br>count<br>min<br>max |
| birthdate | mode<br>min<br>max<br>refDate |
| future | years<br>refDate |
| month | abbreviated<br>context |
| past | years<br>refDate |
| recent | days<br>refDate |
| soon | days<br>refDate |
| timeZone |  |
| weekday | abbreviated<br>context |

### finance

| Type | Args |
|------|------|
| accountName |  |
| accountNumber | length |
| amount | min<br>max<br>dec<br>symbol |
| bic | includeBranchCode |
| bitcoinAddress | type<br>network |
| creditCardCVV |  |
| creditCardIssuer |  |
| creditCardNumber | issuer |
| currency |  |
| currencyCode |  |
| currencyName |  |
| currencyNumericCode |  |
| currencySymbol |  |
| ethereumAddress |  |
| iban | formatted<br>countryCode |
| litecoinAddress |  |
| pin | length |
| routingNumber |  |
| transactionDescription |  |
| transactionType |  |

### food

| Type | Args |
|------|------|
| adjective |  |
| description |  |
| dish |  |
| ethnicCategory |  |
| fruit |  |
| ingredient |  |
| meat |  |
| spice |  |
| vegetable |  |

### git

| Type | Args |
|------|------|
| branch |  |
| commitDate | refDate |
| commitEntry | merge<br>eol<br>refDate |
| commitMessage |  |
| commitSha | length |

### hacker

| Type | Args |
|------|------|
| abbreviation |  |
| adjective |  |
| ingverb |  |
| noun |  |
| phrase |  |
| verb |  |

### helpers

| Type | Args |
|------|------|
| fake |  |
| fromRegExp | inplace |
| mustache | probability |
| rangeToNumber |  |
| replaceCreditCardSymbols |  |
| replaceSymbols |  |
| slugify |  |

### image

| Type | Args |
|------|------|
| avatar |  |
| avatarGitHub |  |
| dataUri | width<br>height<br>color<br>type |
| personPortrait | sex<br>size |
| url | width<br>height |
| urlLoremFlickr | width<br>height<br>category |
| urlPicsumPhotos | width<br>height<br>grayscale<br>blur |

### internet

| Type | Args |
|------|------|
| displayName | firstName<br>lastName |
| domainName |  |
| domainSuffix |  |
| domainWord |  |
| email | firstName<br>lastName<br>provider<br>allowSpecialCharacters |
| emoji | types |
| exampleEmail | firstName<br>lastName<br>allowSpecialCharacters |
| httpMethod |  |
| httpStatusCode | types |
| ip |  |
| ipv4 | cidrBlock<br>network |
| ipv6 |  |
| jwt | header<br>payload |
| jwtAlgorithm |  |
| mac | separator |
| password | length<br>memorable<br>pattern<br>prefix |
| port |  |
| protocol |  |
| url | appendSlash<br>protocol |
| userAgent |  |
| username | firstName<br>lastName |

### location

| Type | Args |
|------|------|
| buildingNumber |  |
| cardinalDirection | abbreviated |
| city |  |
| continent |  |
| country |  |
| countryCode | variant |
| county |  |
| direction | abbreviated |
| language |  |
| latitude | max<br>min<br>precision |
| longitude | max<br>min<br>precision |
| nearbyGPSCoordinate | origin<br>radius<br>isMetric |
| ordinalDirection | abbreviated |
| secondaryAddress |  |
| state | abbreviated |
| street |  |
| streetAddress | useFullAddress |
| timeZone |  |
| zipCode | state<br>format |

### lorem

| Type | Args |
|------|------|
| lines |  |
| paragraph |  |
| paragraphs |  |
| sentence |  |
| sentences |  |
| slug |  |
| text |  |
| word | length<br>min<br>max<br>strategy |
| words |  |

### music

| Type | Args |
|------|------|
| album |  |
| artist |  |
| genre |  |
| songName |  |

### number

| Type | Args |
|------|------|
| bigInt | min<br>max<br>multipleOf |
| binary | min<br>max |
| float | min<br>max<br>fractionDigits<br>multipleOf |
| hex | min<br>max |
| int | min<br>max<br>multipleOf |
| octal | min<br>max |
| romanNumeral | min<br>max |

### person

| Type | Args |
|------|------|
| bio |  |
| firstName |  |
| fullName | firstName<br>lastName<br>sex |
| gender |  |
| jobArea |  |
| jobDescriptor |  |
| jobTitle |  |
| jobType |  |
| lastName |  |
| middleName |  |
| prefix |  |
| sex |  |
| sexType |  |
| suffix |  |
| zodiacSign |  |

### phone

| Type | Args |
|------|------|
| imei |  |
| number | style |

### science

| Type | Args |
|------|------|
| chemicalElement |  |
| unit |  |

### string

| Type | Args |
|------|------|
| alpha | length<br>min<br>max<br>casing<br>exclude |
| alphanumeric | length<br>min<br>max<br>casing<br>exclude |
| binary | length<br>min<br>max<br>prefix |
| fromCharacters |  |
| hexadecimal | length<br>min<br>max<br>casing<br>prefix |
| nanoid |  |
| numeric | length<br>min<br>max<br>allowLeadingZeros<br>exclude |
| octal | length<br>min<br>max<br>prefix |
| sample |  |
| symbol |  |
| ulid | refDate |
| uuid |  |

### system

| Type | Args |
|------|------|
| commonFileExt |  |
| commonFileName |  |
| commonFileType |  |
| cron | includeYear<br>includeNonStandard |
| directoryPath |  |
| fileExt |  |
| fileName | extensionCount<br>min<br>max |
| filePath |  |
| fileType |  |
| mimeType |  |
| networkInterface | interfaceType<br>interfaceSchema |
| semver |  |

### vehicle

| Type | Args |
|------|------|
| bicycle |  |
| color |  |
| fuel |  |
| manufacturer |  |
| model |  |
| type |  |
| vehicle |  |
| vin |  |
| vrm |  |

### word

| Type | Args |
|------|------|
| adjective | length<br>min<br>max<br>strategy |
| adverb | length<br>min<br>max<br>strategy |
| conjunction | length<br>min<br>max<br>strategy |
| interjection | length<br>min<br>max<br>strategy |
| noun | length<br>min<br>max<br>strategy |
| preposition | length<br>min<br>max<br>strategy |
| sample | length<br>min<br>max<br>strategy |
| verb | length<br>min<br>max<br>strategy |
| words | count<br>min<br>max |

For more details, see the [Faker.js documentation](https://fakerjs.dev/api/).
