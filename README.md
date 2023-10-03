# @aux4/faker
CLI to generate fake data

![npm](https://img.shields.io/npm/v/@aux4/faker)

## Install

```bash
npm install -g @aux4/faker
```

## Usage

This uses [faker](https://fakerjs.dev/api/) to generate fake data. See all the [available options](https://fakerjs.dev/api/).

### fake value

```bash
$ aux4-faker fake value <module> <method> [args/params]

e.g.:

$ aux4-faker fake value person firstName
Tommy

$ aux4-faker fake value person firstName female
Nora

$ aux4-faker fake value number int min=1 max=10
6
```

Generating multiple values:

```bash
$ aux4-faker fake value person firstName --count 3
[
  "Leslie",
  "Daren",
  "August"
]

$ aux4-faker fake value person firstName --min 3 --max 5
[
  "Harmony",
  "Vickie",
  "Icie",
  "Nils"
]
```

### fake object

config.yaml

```yaml
config:
    person:
      mapping:
        firstName:
          fake: person firstName
        lastName:
          fake: person lastName
        age:
          fake:
            value: number int
            params:
              min: 18
              max: 90
```

```bash
$ aux4-faker fake object --config <config path>

$ aux4-faker fake object --config person
{
  "firstName": "Priscilla",
  "lastName": "Mraz",
  "age": 69,
}
```

Generating multiple objects:

```bash
$ aux4-faker fake object --config person --count 3
[
  {
    "firstName": "Minnie",
    "lastName": "Simonis",
    "age": 63
  },
  {
    "firstName": "Sandy",
    "lastName": "McCullough",
    "age": 18
  },
  {
    "firstName": "Vicki",
    "lastName": "Langworth",
    "age": 28
  }
]

$ aux4-faker fake object --config person --min 1 --max 3
[
  {
    "firstName": "Myra",
    "lastName": "Mueller",
    "age": 90
  },
  {
    "firstName": "Sheryl",
    "lastName": "Hartmann",
    "age": 40
  }
]
```

Generating nested objects:

```yaml
config:
  person:
    mapping:
      firstName:
        fake:
          value: person firstName
          args:
            - female
      lastName:
        fake: person lastName
      age:
        fake:
          value: number int
          params:
            min: 18
            max: 90
      address:
        type: array
        fake:
          options:
            min: 0
            max: 2
        mapping:
          street:
            fake: location streetAddress
          city:
            fake: location city
          state:
            fake: location state
          zip:
            fake: location zipCode
```

```bash
$ aux4-faker fake object --config person
{
  "firstName": "Robyn",
  "lastName": "Rau",
  "age": 19,
  "address": [
    {
      "street": "21506 Beulah Fork",
      "city": "Janabury",
      "state": "Oklahoma",
      "zip": "15669-9735"
    }
  ]
}
```
If you want to have the address as an object instead of array, you can replace it:

```yaml
address:
  type: object
  mapping:
    street:
      fake: location streetAddress
    city:
      fake: location city
    state:
      fake: location state
    zip:
      fake: location zipCode
```

```bash
$ aux4-faker fake object --config person

{
  "firstName": "Veronica",
  "lastName": "Lind",
  "age": 36,
  "address": {
    "street": "31102 Royce Route",
    "city": "North Willafield",
    "state": "Georgia",
    "zip": "15127"
  }
}
```

