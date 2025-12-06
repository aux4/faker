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
[
  "alex.smith@gmail.com",
  "sarah.jones@yahoo.com",
  "mike.wilson@hotmail.com"
]
```

Generate between 2 and 5 random words:

```bash
> aux4 fake value lorem --type word --min 2 --max 5
```
```json
["dolor", "ipsum", "amet"]
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
  {"firstName": "James", "lastName": "Brown", "email": "james.brown@gmail.com"},
  {"firstName": "Olivia", "lastName": "Miller", "email": "olivia.miller@yahoo.com"},
  {"firstName": "William", "lastName": "Taylor", "email": "william.taylor@hotmail.com"}
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
  {"id": 1, "email": "alex@gmail.com"},
  {"id": 2, "email": "sarah@yahoo.com"},
  {"id": 3, "email": "mike@hotmail.com"}
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

## Common Faker Categories

Here are some commonly used faker categories and types:

| Category | Type | Args |
|----------|------|------|
| person | firstName | |
| | lastName | |
| | fullName | |
| | sex | |
| | jobTitle | |
| internet | email | |
| | userName | |
| | url | |
| | ip | |
| | password | |
| lorem | word | |
| | words | |
| | sentence | |
| | paragraph | |
| number | int | min, max |
| | float | min, max, fractionDigits |
| string | uuid | |
| | alphanumeric | length |
| date | past | |
| | future | |
| | recent | |
| datatype | boolean | |
| helpers | arrayElement | array |
| location | streetAddress | |
| | city | |
| | country | |
| | zipCode | |

For a complete list of available categories and types, see the [Faker.js documentation](https://fakerjs.dev/api/).

## License

This package is licensed under the Apache License, Version 2.0.
