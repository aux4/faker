# aux4/faker

Generate fake data for testing, mocking APIs, and populating databases.

aux4/faker leverages the [Faker.js](https://fakerjs.dev/) library to generate realistic fake data. It provides two main commands: `fake value` for generating individual values and `fake object` for generating or transforming JSON objects with fake data.

## Installation

```bash
aux4 aux4 pkger install aux4/faker
```

## Quick Start

Generate a fake email:

```bash
> aux4 fake value internet --type email
```

```text
john.doe@example.com
```

Generate a fake person object:

```bash
> aux4 fake object --config person
```

```json
{
  "firstName": "Maria",
  "lastName": "Johnson",
  "email": "maria.johnson@hotmail.com"
}
```

## Commands

### aux4 fake value

Generate individual fake values.

```bash
aux4 fake value <category> --type <type> [options]
```

**Options:**

- `--lang` - Locale for generated data (default: `en_US`)
- `--type` - Faker type within the category (e.g., `firstName`, `email`)
- `--count` - Generate exactly N values (returns JSON array)
- `--min` - Minimum number of values to generate
- `--max` - Maximum number of values to generate
- `--arg` - Arguments for the faker method (can be repeated)

### aux4 fake object

Generate fake objects or transform existing JSON with fake data.

### aux4 fake list

List faker categories and types.

```bash
aux4 fake list [category] [--type <type>]
```

**Options:**

- `category` - Faker category (e.g., `person`, `internet`). If omitted, lists all categories.
- `--type` - Filter by specific type (e.g., `firstName`, `email`)

```bash
aux4 fake object --config <name> [options]
```

**Options:**

- `--lang` - Locale for generated data (default: `en_US`)
- `--config` - Name of the mapping configuration in config.yaml
- `--count` - Generate exactly N objects (returns JSON array)
- `--min` - Minimum number of objects to generate
- `--max` - Maximum number of objects to generate

## Examples

### Generate Single Values

Generate a first name:

```bash
> aux4 fake value person --type firstName
```

```text
Michael
```

Generate a UUID:

```bash
> aux4 fake value string --type uuid
```

```text
f47ac10b-58cc-4372-a567-0e02b2c3d479
```

Generate a random integer between 1 and 100:

```bash
> aux4 fake value number --type int --arg min=1 --arg max=100
```

```text
42
```

### Generate Multiple Values

Generate 3 email addresses:

```bash
> aux4 fake value internet --type email --count 3
```

```json
["alex.smith@gmail.com", "sarah.jones@yahoo.com", "mike.wilson@hotmail.com"]
```

Generate between 2 and 5 random words:

```bash
> aux4 fake value lorem --type word --min 2 --max 5
```

```json
["dolor", "ipsum", "amet"]
```

### Passing Arguments to Value

Use `--arg` to pass arguments to faker methods. Arguments can be positional or named.

#### Positional argument

For methods that accept a single value:

```bash
> aux4 fake value person --type firstName --arg male
```

```text
James
```

#### Named arguments

For methods with multiple options, use `key=value` format:

```bash
> aux4 fake value number --type int --arg min=1 --arg max=10
```

```text
7
```

```bash
> aux4 fake value string --type alpha --arg length=8 --arg casing=upper
```

```text
XKQMFBRT
```

### Generate Objects

Create a `config.yaml` file with your mapping definitions:

```yaml
config:
  person:
    mapping:
      firstName:
        fake: person firstName
      lastName:
        fake: person lastName
      email:
        fake: internet email
```

Generate a person object:

```bash
> aux4 fake object --config person
```

```json
{
  "firstName": "Emma",
  "lastName": "Davis",
  "email": "emma.davis@example.org"
}
```

Generate 3 person objects:

```bash
> aux4 fake object --config person --count 3
```

```json
[
  { "firstName": "James", "lastName": "Brown", "email": "james.brown@gmail.com" },
  { "firstName": "Olivia", "lastName": "Miller", "email": "olivia.miller@yahoo.com" },
  { "firstName": "William", "lastName": "Taylor", "email": "william.taylor@hotmail.com" }
]
```

### Transform Existing JSON

You can pipe existing JSON data and add fake fields to it. Original fields are preserved.

```yaml
config:
  addEmail:
    mapping:
      email:
        fake: internet email
```

#### Transform a single object

```bash
> echo '{"id":1,"name":"John"}' | aux4 fake object --config addEmail
```

```json
{
  "id": 1,
  "name": "John",
  "email": "john.doe@example.com"
}
```

#### Transform an array of objects

```bash
> echo '[{"id":1},{"id":2},{"id":3}]' | aux4 fake object --config addEmail
```

```json
[
  { "id": 1, "email": "alex@gmail.com" },
  { "id": 2, "email": "sarah@yahoo.com" },
  { "id": 3, "email": "mike@hotmail.com" }
]
```

#### Transform NDJSON (newline-delimited JSON)

```bash
> printf '{"id":1}\n{"id":2}\n{"id":3}\n' | aux4 fake object --config addEmail
```

```json
{"id":1,"email":"john@example.com"}
{"id":2,"email":"jane@example.org"}
{"id":3,"email":"bob@example.net"}
```

### Mapping Formats

There are two formats for defining fake data in mappings.

#### String format (simple)

```yaml
firstName:
  fake: person firstName
```

#### Object format (with arguments)

```yaml
age:
  fake:
    category: number
    type: int
    args:
      min: 18
      max: 65
```

### Arguments in Mappings

Pass arguments to faker methods using the `args` property.

#### Named arguments (as object)

```yaml
config:
  user:
    mapping:
      age:
        fake:
          category: number
          type: int
          args:
            min: 18
            max: 65
```

```bash
> aux4 fake object --config user
```

```json
{
  "age": 34
}
```

#### Array arguments

For methods like `arrayElement` that take an array as the first argument:

```yaml
config:
  status:
    mapping:
      status:
        fake:
          category: helpers
          type: arrayElement
          args:
            - - pending
              - active
              - completed
```

```bash
> aux4 fake object --config status
```

```json
{
  "status": "active"
}
```

### Field References

Reference other fields in the same object using the `@` prefix:

```yaml
config:
  person:
    mapping:
      sex:
        fake:
          category: helpers
          type: arrayElement
          args:
            - - male
              - female
      firstName:
        fake:
          category: person
          type: firstName
          args:
            sex: "@sex"
```

```bash
> aux4 fake object --config person
```

```json
{
  "sex": "female",
  "firstName": "Sophia"
}
```

References also work when transforming existing data - they can reference fields from the input:

```bash
> echo '{"sex":"male"}' | aux4 fake object --config person
```

```json
{
  "sex": "male",
  "firstName": "James"
}
```

### Nested Objects

Generate nested object structures:

```yaml
config:
  user:
    mapping:
      name:
        fake: person fullName
      address:
        mapping:
          street:
            fake: location streetAddress
          city:
            fake: location city
          country:
            fake: location country
```

```bash
> aux4 fake object --config user
```

```json
{
  "name": "John Smith",
  "address": {
    "street": "123 Main St",
    "city": "Boston",
    "country": "United States"
  }
}
```

### Locale Support

Generate data in different locales:

```bash
> aux4 fake value person --type firstName --lang pt_BR
```

```text
João
```

```bash
> aux4 fake value person --type firstName --lang de
```

```text
Hans
```

```bash
> aux4 fake value person --type firstName --lang ja
```

```text
太郎
```

## Configuration

aux4/faker uses aux4/config to load mapping configurations. Create a `config.yaml` file with your mappings:

```yaml
config:
  <name>:
    mapping:
      <field>:
        fake: <category> <type>
```

Reference a config by name using `--config <name>`.

## Complete Example

Create a complete user dataset:

**config.yaml:**

```yaml
config:
  fullUser:
    mapping:
      id:
        fake: string uuid
      firstName:
        fake: person firstName
      lastName:
        fake: person lastName
      email:
        fake: internet email
      age:
        fake:
          category: number
          type: int
          args:
            min: 18
            max: 80
      isActive:
        fake: datatype boolean
      joinedAt:
        fake: date past
      address:
        mapping:
          street:
            fake: location streetAddress
          city:
            fake: location city
          zipCode:
            fake: location zipCode
```

Generate 2 users:

```bash
> aux4 fake object --config fullUser --count 2
```

```json
[
  {
    "id": "a1b2c3d4-e5f6-7890-abcd-ef1234567890",
    "firstName": "Emily",
    "lastName": "Johnson",
    "email": "emily.johnson@example.com",
    "age": 28,
    "isActive": true,
    "joinedAt": "2024-03-15T10:30:00.000Z",
    "address": {
      "street": "456 Oak Avenue",
      "city": "San Francisco",
      "zipCode": "94102"
    }
  },
  {
    "id": "b2c3d4e5-f6a7-8901-bcde-f23456789012",
    "firstName": "Michael",
    "lastName": "Williams",
    "email": "michael.williams@example.org",
    "age": 45,
    "isActive": false,
    "joinedAt": "2023-11-20T15:45:00.000Z",
    "address": {
      "street": "789 Pine Street",
      "city": "New York",
      "zipCode": "10001"
    }
  }
]
```

## Reference

Complete list of available faker categories and types.

### airline

<table>
<tr><th style="background-color: black; color: white; width: 30%;">Type</th><th style="background-color: black; color: white;">Args</th></tr>
<tr><td>aircraftType</td><td></td></tr>
<tr><td>airline</td><td></td></tr>
<tr><td>airplane</td><td></td></tr>
<tr><td>airport</td><td></td></tr>
<tr><td rowspan="4">flightNumber</td><td>length</td></tr>
<tr><td>min</td></tr>
<tr><td>max</td></tr>
<tr><td>addLeadingZeros</td></tr>
<tr><td rowspan="2">recordLocator</td><td>allowNumerics</td></tr>
<tr><td>allowVisuallySimilarCharacters</td></tr>
<tr><td>seat</td><td>aircraftType</td></tr>
</table>

### animal

<table>
<tr><th style="background-color: black; color: white; width: 30%;">Type</th><th style="background-color: black; color: white;">Args</th></tr>
<tr><td>bear</td><td></td></tr>
<tr><td>bird</td><td></td></tr>
<tr><td>cat</td><td></td></tr>
<tr><td>cetacean</td><td></td></tr>
<tr><td>cow</td><td></td></tr>
<tr><td>crocodilia</td><td></td></tr>
<tr><td>dog</td><td></td></tr>
<tr><td>fish</td><td></td></tr>
<tr><td>horse</td><td></td></tr>
<tr><td>insect</td><td></td></tr>
<tr><td>lion</td><td></td></tr>
<tr><td>petName</td><td></td></tr>
<tr><td>rabbit</td><td></td></tr>
<tr><td>rodent</td><td></td></tr>
<tr><td>snake</td><td></td></tr>
<tr><td>type</td><td></td></tr>
</table>

### book

<table>
<tr><th style="background-color: black; color: white; width: 30%;">Type</th><th style="background-color: black; color: white;">Args</th></tr>
<tr><td>author</td><td></td></tr>
<tr><td>format</td><td></td></tr>
<tr><td>genre</td><td></td></tr>
<tr><td>publisher</td><td></td></tr>
<tr><td>series</td><td></td></tr>
<tr><td>title</td><td></td></tr>
</table>

### color

<table>
<tr><th style="background-color: black; color: white; width: 30%;">Type</th><th style="background-color: black; color: white;">Args</th></tr>
<tr><td>cmyk</td><td>format</td></tr>
<tr><td rowspan="2">colorByCSSColorSpace</td><td>format</td></tr>
<tr><td>space</td></tr>
<tr><td>cssSupportedFunction</td><td></td></tr>
<tr><td>cssSupportedSpace</td><td></td></tr>
<tr><td rowspan="2">hsl</td><td>format</td></tr>
<tr><td>includeAlpha</td></tr>
<tr><td>human</td><td></td></tr>
<tr><td>hwb</td><td>format</td></tr>
<tr><td>lab</td><td>format</td></tr>
<tr><td>lch</td><td>format</td></tr>
<tr><td rowspan="4">rgb</td><td>prefix</td></tr>
<tr><td>casing</td></tr>
<tr><td>format</td></tr>
<tr><td>includeAlpha</td></tr>
<tr><td>space</td><td></td></tr>
</table>

### commerce

<table>
<tr><th style="background-color: black; color: white; width: 30%;">Type</th><th style="background-color: black; color: white;">Args</th></tr>
<tr><td>department</td><td></td></tr>
<tr><td rowspan="2">isbn</td><td>variant</td></tr>
<tr><td>separator</td></tr>
<tr><td rowspan="4">price</td><td>min</td></tr>
<tr><td>max</td></tr>
<tr><td>dec</td></tr>
<tr><td>symbol</td></tr>
<tr><td>product</td><td></td></tr>
<tr><td>productAdjective</td><td></td></tr>
<tr><td>productDescription</td><td></td></tr>
<tr><td>productMaterial</td><td></td></tr>
<tr><td>productName</td><td></td></tr>
</table>

### company

<table>
<tr><th style="background-color: black; color: white; width: 30%;">Type</th><th style="background-color: black; color: white;">Args</th></tr>
<tr><td>buzzAdjective</td><td></td></tr>
<tr><td>buzzNoun</td><td></td></tr>
<tr><td>buzzPhrase</td><td></td></tr>
<tr><td>buzzVerb</td><td></td></tr>
<tr><td>catchPhrase</td><td></td></tr>
<tr><td>catchPhraseAdjective</td><td></td></tr>
<tr><td>catchPhraseDescriptor</td><td></td></tr>
<tr><td>catchPhraseNoun</td><td></td></tr>
<tr><td>name</td><td></td></tr>
</table>

### database

<table>
<tr><th style="background-color: black; color: white; width: 30%;">Type</th><th style="background-color: black; color: white;">Args</th></tr>
<tr><td>collation</td><td></td></tr>
<tr><td>column</td><td></td></tr>
<tr><td>engine</td><td></td></tr>
<tr><td>mongodbObjectId</td><td></td></tr>
<tr><td>type</td><td></td></tr>
</table>

### datatype

<table>
<tr><th style="background-color: black; color: white; width: 30%;">Type</th><th style="background-color: black; color: white;">Args</th></tr>
<tr><td>boolean</td><td>probability</td></tr>
</table>

### date

<table>
<tr><th style="background-color: black; color: white; width: 30%;">Type</th><th style="background-color: black; color: white;">Args</th></tr>
<tr><td>anytime</td><td>refDate</td></tr>
<tr><td rowspan="2">between</td><td>from</td></tr>
<tr><td>to</td></tr>
<tr><td rowspan="5">betweens</td><td>from</td></tr>
<tr><td>to</td></tr>
<tr><td>count</td></tr>
<tr><td>min</td></tr>
<tr><td>max</td></tr>
<tr><td rowspan="4">birthdate</td><td>mode</td></tr>
<tr><td>min</td></tr>
<tr><td>max</td></tr>
<tr><td>refDate</td></tr>
<tr><td rowspan="2">future</td><td>years</td></tr>
<tr><td>refDate</td></tr>
<tr><td rowspan="2">month</td><td>abbreviated</td></tr>
<tr><td>context</td></tr>
<tr><td rowspan="2">past</td><td>years</td></tr>
<tr><td>refDate</td></tr>
<tr><td rowspan="2">recent</td><td>days</td></tr>
<tr><td>refDate</td></tr>
<tr><td rowspan="2">soon</td><td>days</td></tr>
<tr><td>refDate</td></tr>
<tr><td>timeZone</td><td></td></tr>
<tr><td rowspan="2">weekday</td><td>abbreviated</td></tr>
<tr><td>context</td></tr>
</table>

### finance

<table>
<tr><th style="background-color: black; color: white; width: 30%;">Type</th><th style="background-color: black; color: white;">Args</th></tr>
<tr><td>accountName</td><td></td></tr>
<tr><td>accountNumber</td><td>length</td></tr>
<tr><td rowspan="4">amount</td><td>min</td></tr>
<tr><td>max</td></tr>
<tr><td>dec</td></tr>
<tr><td>symbol</td></tr>
<tr><td>bic</td><td>includeBranchCode</td></tr>
<tr><td rowspan="2">bitcoinAddress</td><td>type</td></tr>
<tr><td>network</td></tr>
<tr><td>creditCardCVV</td><td></td></tr>
<tr><td>creditCardIssuer</td><td></td></tr>
<tr><td>creditCardNumber</td><td>issuer</td></tr>
<tr><td>currency</td><td></td></tr>
<tr><td>currencyCode</td><td></td></tr>
<tr><td>currencyName</td><td></td></tr>
<tr><td>currencyNumericCode</td><td></td></tr>
<tr><td>currencySymbol</td><td></td></tr>
<tr><td>ethereumAddress</td><td></td></tr>
<tr><td rowspan="2">iban</td><td>formatted</td></tr>
<tr><td>countryCode</td></tr>
<tr><td>litecoinAddress</td><td></td></tr>
<tr><td>pin</td><td>length</td></tr>
<tr><td>routingNumber</td><td></td></tr>
<tr><td>transactionDescription</td><td></td></tr>
<tr><td>transactionType</td><td></td></tr>
</table>

### food

<table>
<tr><th style="background-color: black; color: white; width: 30%;">Type</th><th style="background-color: black; color: white;">Args</th></tr>
<tr><td>adjective</td><td></td></tr>
<tr><td>description</td><td></td></tr>
<tr><td>dish</td><td></td></tr>
<tr><td>ethnicCategory</td><td></td></tr>
<tr><td>fruit</td><td></td></tr>
<tr><td>ingredient</td><td></td></tr>
<tr><td>meat</td><td></td></tr>
<tr><td>spice</td><td></td></tr>
<tr><td>vegetable</td><td></td></tr>
</table>

### git

<table>
<tr><th style="background-color: black; color: white; width: 30%;">Type</th><th style="background-color: black; color: white;">Args</th></tr>
<tr><td>branch</td><td></td></tr>
<tr><td>commitDate</td><td>refDate</td></tr>
<tr><td rowspan="3">commitEntry</td><td>merge</td></tr>
<tr><td>eol</td></tr>
<tr><td>refDate</td></tr>
<tr><td>commitMessage</td><td></td></tr>
<tr><td>commitSha</td><td>length</td></tr>
</table>

### hacker

<table>
<tr><th style="background-color: black; color: white; width: 30%;">Type</th><th style="background-color: black; color: white;">Args</th></tr>
<tr><td>abbreviation</td><td></td></tr>
<tr><td>adjective</td><td></td></tr>
<tr><td>ingverb</td><td></td></tr>
<tr><td>noun</td><td></td></tr>
<tr><td>phrase</td><td></td></tr>
<tr><td>verb</td><td></td></tr>
</table>

### helpers

<table>
<tr><th style="background-color: black; color: white; width: 30%;">Type</th><th style="background-color: black; color: white;">Args</th></tr>
<tr><td>fake</td><td></td></tr>
<tr><td>fromRegExp</td><td>inplace</td></tr>
<tr><td>mustache</td><td>probability</td></tr>
<tr><td>rangeToNumber</td><td></td></tr>
<tr><td>replaceCreditCardSymbols</td><td></td></tr>
<tr><td>replaceSymbols</td><td></td></tr>
<tr><td>slugify</td><td></td></tr>
</table>

### image

<table>
<tr><th style="background-color: black; color: white; width: 30%;">Type</th><th style="background-color: black; color: white;">Args</th></tr>
<tr><td>avatar</td><td></td></tr>
<tr><td>avatarGitHub</td><td></td></tr>
<tr><td rowspan="4">dataUri</td><td>width</td></tr>
<tr><td>height</td></tr>
<tr><td>color</td></tr>
<tr><td>type</td></tr>
<tr><td rowspan="2">personPortrait</td><td>sex</td></tr>
<tr><td>size</td></tr>
<tr><td rowspan="2">url</td><td>width</td></tr>
<tr><td>height</td></tr>
<tr><td rowspan="3">urlLoremFlickr</td><td>width</td></tr>
<tr><td>height</td></tr>
<tr><td>category</td></tr>
<tr><td rowspan="4">urlPicsumPhotos</td><td>width</td></tr>
<tr><td>height</td></tr>
<tr><td>grayscale</td></tr>
<tr><td>blur</td></tr>
</table>

### internet

<table>
<tr><th style="background-color: black; color: white; width: 30%;">Type</th><th style="background-color: black; color: white;">Args</th></tr>
<tr><td rowspan="2">displayName</td><td>firstName</td></tr>
<tr><td>lastName</td></tr>
<tr><td>domainName</td><td></td></tr>
<tr><td>domainSuffix</td><td></td></tr>
<tr><td>domainWord</td><td></td></tr>
<tr><td rowspan="4">email</td><td>firstName</td></tr>
<tr><td>lastName</td></tr>
<tr><td>provider</td></tr>
<tr><td>allowSpecialCharacters</td></tr>
<tr><td>emoji</td><td>types</td></tr>
<tr><td rowspan="3">exampleEmail</td><td>firstName</td></tr>
<tr><td>lastName</td></tr>
<tr><td>allowSpecialCharacters</td></tr>
<tr><td>httpMethod</td><td></td></tr>
<tr><td>httpStatusCode</td><td>types</td></tr>
<tr><td>ip</td><td></td></tr>
<tr><td rowspan="2">ipv4</td><td>cidrBlock</td></tr>
<tr><td>network</td></tr>
<tr><td>ipv6</td><td></td></tr>
<tr><td rowspan="2">jwt</td><td>header</td></tr>
<tr><td>payload</td></tr>
<tr><td>jwtAlgorithm</td><td></td></tr>
<tr><td>mac</td><td>separator</td></tr>
<tr><td rowspan="4">password</td><td>length</td></tr>
<tr><td>memorable</td></tr>
<tr><td>pattern</td></tr>
<tr><td>prefix</td></tr>
<tr><td>port</td><td></td></tr>
<tr><td>protocol</td><td></td></tr>
<tr><td rowspan="2">url</td><td>appendSlash</td></tr>
<tr><td>protocol</td></tr>
<tr><td>userAgent</td><td></td></tr>
<tr><td rowspan="2">username</td><td>firstName</td></tr>
<tr><td>lastName</td></tr>
</table>

### location

<table>
<tr><th style="background-color: black; color: white; width: 30%;">Type</th><th style="background-color: black; color: white;">Args</th></tr>
<tr><td>buildingNumber</td><td></td></tr>
<tr><td>cardinalDirection</td><td>abbreviated</td></tr>
<tr><td>city</td><td></td></tr>
<tr><td>continent</td><td></td></tr>
<tr><td>country</td><td></td></tr>
<tr><td>countryCode</td><td>variant</td></tr>
<tr><td>county</td><td></td></tr>
<tr><td>direction</td><td>abbreviated</td></tr>
<tr><td>language</td><td></td></tr>
<tr><td rowspan="3">latitude</td><td>max</td></tr>
<tr><td>min</td></tr>
<tr><td>precision</td></tr>
<tr><td rowspan="3">longitude</td><td>max</td></tr>
<tr><td>min</td></tr>
<tr><td>precision</td></tr>
<tr><td rowspan="3">nearbyGPSCoordinate</td><td>origin</td></tr>
<tr><td>radius</td></tr>
<tr><td>isMetric</td></tr>
<tr><td>ordinalDirection</td><td>abbreviated</td></tr>
<tr><td>secondaryAddress</td><td></td></tr>
<tr><td>state</td><td>abbreviated</td></tr>
<tr><td>street</td><td></td></tr>
<tr><td>streetAddress</td><td>useFullAddress</td></tr>
<tr><td>timeZone</td><td></td></tr>
<tr><td rowspan="2">zipCode</td><td>state</td></tr>
<tr><td>format</td></tr>
</table>

### lorem

<table>
<tr><th style="background-color: black; color: white; width: 30%;">Type</th><th style="background-color: black; color: white;">Args</th></tr>
<tr><td>lines</td><td></td></tr>
<tr><td>paragraph</td><td></td></tr>
<tr><td>paragraphs</td><td></td></tr>
<tr><td>sentence</td><td></td></tr>
<tr><td>sentences</td><td></td></tr>
<tr><td>slug</td><td></td></tr>
<tr><td>text</td><td></td></tr>
<tr><td rowspan="4">word</td><td>length</td></tr>
<tr><td>min</td></tr>
<tr><td>max</td></tr>
<tr><td>strategy</td></tr>
<tr><td>words</td><td></td></tr>
</table>

### music

<table>
<tr><th style="background-color: black; color: white; width: 30%;">Type</th><th style="background-color: black; color: white;">Args</th></tr>
<tr><td>album</td><td></td></tr>
<tr><td>artist</td><td></td></tr>
<tr><td>genre</td><td></td></tr>
<tr><td>songName</td><td></td></tr>
</table>

### number

<table>
<tr><th style="background-color: black; color: white; width: 30%;">Type</th><th style="background-color: black; color: white;">Args</th></tr>
<tr><td rowspan="3">bigInt</td><td>min</td></tr>
<tr><td>max</td></tr>
<tr><td>multipleOf</td></tr>
<tr><td rowspan="2">binary</td><td>min</td></tr>
<tr><td>max</td></tr>
<tr><td rowspan="4">float</td><td>min</td></tr>
<tr><td>max</td></tr>
<tr><td>fractionDigits</td></tr>
<tr><td>multipleOf</td></tr>
<tr><td rowspan="2">hex</td><td>min</td></tr>
<tr><td>max</td></tr>
<tr><td rowspan="3">int</td><td>min</td></tr>
<tr><td>max</td></tr>
<tr><td>multipleOf</td></tr>
<tr><td rowspan="2">octal</td><td>min</td></tr>
<tr><td>max</td></tr>
<tr><td rowspan="2">romanNumeral</td><td>min</td></tr>
<tr><td>max</td></tr>
</table>

### person

<table>
<tr><th style="background-color: black; color: white; width: 30%;">Type</th><th style="background-color: black; color: white;">Args</th></tr>
<tr><td>bio</td><td></td></tr>
<tr><td>firstName</td><td></td></tr>
<tr><td rowspan="3">fullName</td><td>firstName</td></tr>
<tr><td>lastName</td></tr>
<tr><td>sex</td></tr>
<tr><td>gender</td><td></td></tr>
<tr><td>jobArea</td><td></td></tr>
<tr><td>jobDescriptor</td><td></td></tr>
<tr><td>jobTitle</td><td></td></tr>
<tr><td>jobType</td><td></td></tr>
<tr><td>lastName</td><td></td></tr>
<tr><td>middleName</td><td></td></tr>
<tr><td>prefix</td><td></td></tr>
<tr><td>sex</td><td></td></tr>
<tr><td>sexType</td><td></td></tr>
<tr><td>suffix</td><td></td></tr>
<tr><td>zodiacSign</td><td></td></tr>
</table>

### phone

<table>
<tr><th style="background-color: black; color: white; width: 30%;">Type</th><th style="background-color: black; color: white;">Args</th></tr>
<tr><td>imei</td><td></td></tr>
<tr><td>number</td><td>style</td></tr>
</table>

### science

<table>
<tr><th style="background-color: black; color: white; width: 30%;">Type</th><th style="background-color: black; color: white;">Args</th></tr>
<tr><td>chemicalElement</td><td></td></tr>
<tr><td>unit</td><td></td></tr>
</table>

### string

<table>
<tr><th style="background-color: black; color: white; width: 30%;">Type</th><th style="background-color: black; color: white;">Args</th></tr>
<tr><td rowspan="5">alpha</td><td>length</td></tr>
<tr><td>min</td></tr>
<tr><td>max</td></tr>
<tr><td>casing</td></tr>
<tr><td>exclude</td></tr>
<tr><td rowspan="5">alphanumeric</td><td>length</td></tr>
<tr><td>min</td></tr>
<tr><td>max</td></tr>
<tr><td>casing</td></tr>
<tr><td>exclude</td></tr>
<tr><td rowspan="4">binary</td><td>length</td></tr>
<tr><td>min</td></tr>
<tr><td>max</td></tr>
<tr><td>prefix</td></tr>
<tr><td>fromCharacters</td><td></td></tr>
<tr><td rowspan="5">hexadecimal</td><td>length</td></tr>
<tr><td>min</td></tr>
<tr><td>max</td></tr>
<tr><td>casing</td></tr>
<tr><td>prefix</td></tr>
<tr><td>nanoid</td><td></td></tr>
<tr><td rowspan="5">numeric</td><td>length</td></tr>
<tr><td>min</td></tr>
<tr><td>max</td></tr>
<tr><td>allowLeadingZeros</td></tr>
<tr><td>exclude</td></tr>
<tr><td rowspan="4">octal</td><td>length</td></tr>
<tr><td>min</td></tr>
<tr><td>max</td></tr>
<tr><td>prefix</td></tr>
<tr><td>sample</td><td></td></tr>
<tr><td>symbol</td><td></td></tr>
<tr><td>ulid</td><td>refDate</td></tr>
<tr><td>uuid</td><td></td></tr>
</table>

### system

<table>
<tr><th style="background-color: black; color: white; width: 30%;">Type</th><th style="background-color: black; color: white;">Args</th></tr>
<tr><td>commonFileExt</td><td></td></tr>
<tr><td>commonFileName</td><td></td></tr>
<tr><td>commonFileType</td><td></td></tr>
<tr><td rowspan="2">cron</td><td>includeYear</td></tr>
<tr><td>includeNonStandard</td></tr>
<tr><td>directoryPath</td><td></td></tr>
<tr><td>fileExt</td><td></td></tr>
<tr><td rowspan="3">fileName</td><td>extensionCount</td></tr>
<tr><td>min</td></tr>
<tr><td>max</td></tr>
<tr><td>filePath</td><td></td></tr>
<tr><td>fileType</td><td></td></tr>
<tr><td>mimeType</td><td></td></tr>
<tr><td rowspan="2">networkInterface</td><td>interfaceType</td></tr>
<tr><td>interfaceSchema</td></tr>
<tr><td>semver</td><td></td></tr>
</table>

### vehicle

<table>
<tr><th style="background-color: black; color: white; width: 30%;">Type</th><th style="background-color: black; color: white;">Args</th></tr>
<tr><td>bicycle</td><td></td></tr>
<tr><td>color</td><td></td></tr>
<tr><td>fuel</td><td></td></tr>
<tr><td>manufacturer</td><td></td></tr>
<tr><td>model</td><td></td></tr>
<tr><td>type</td><td></td></tr>
<tr><td>vehicle</td><td></td></tr>
<tr><td>vin</td><td></td></tr>
<tr><td>vrm</td><td></td></tr>
</table>

### word

<table>
<tr><th style="background-color: black; color: white; width: 30%;">Type</th><th style="background-color: black; color: white;">Args</th></tr>
<tr><td rowspan="4">adjective</td><td>length</td></tr>
<tr><td>min</td></tr>
<tr><td>max</td></tr>
<tr><td>strategy</td></tr>
<tr><td rowspan="4">adverb</td><td>length</td></tr>
<tr><td>min</td></tr>
<tr><td>max</td></tr>
<tr><td>strategy</td></tr>
<tr><td rowspan="4">conjunction</td><td>length</td></tr>
<tr><td>min</td></tr>
<tr><td>max</td></tr>
<tr><td>strategy</td></tr>
<tr><td rowspan="4">interjection</td><td>length</td></tr>
<tr><td>min</td></tr>
<tr><td>max</td></tr>
<tr><td>strategy</td></tr>
<tr><td rowspan="4">noun</td><td>length</td></tr>
<tr><td>min</td></tr>
<tr><td>max</td></tr>
<tr><td>strategy</td></tr>
<tr><td rowspan="4">preposition</td><td>length</td></tr>
<tr><td>min</td></tr>
<tr><td>max</td></tr>
<tr><td>strategy</td></tr>
<tr><td rowspan="4">sample</td><td>length</td></tr>
<tr><td>min</td></tr>
<tr><td>max</td></tr>
<tr><td>strategy</td></tr>
<tr><td rowspan="4">verb</td><td>length</td></tr>
<tr><td>min</td></tr>
<tr><td>max</td></tr>
<tr><td>strategy</td></tr>
<tr><td rowspan="3">words</td><td>count</td></tr>
<tr><td>min</td></tr>
<tr><td>max</td></tr>
</table>

For more details, see the [Faker.js documentation](https://fakerjs.dev/api/).

## License

This package is licensed under the Apache License, Version 2.0.
