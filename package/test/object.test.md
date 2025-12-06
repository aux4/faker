# Fake Object Tests

Tests for the `aux4 fake object` command to generate fake data objects.

```file:empty.txt

```

## Basic Object Generation

### String format mapping

```file:config.yaml
config:
  name:
    mapping:
      name:
        fake: person firstName
```

```execute
cat empty.txt | aux4 fake object --config name
```

```expect:partial
"name":
```

### Object format mapping

```file:config.yaml
config:
  email:
    mapping:
      email:
        fake:
          category: internet
          type: email
```

```execute
cat empty.txt | aux4 fake object --config email
```

```expect:partial
"email":
```

```expect:partial
@
```

## Object Structure Validation

```file:config.yaml
config:
  fullname:
    mapping:
      firstName:
        fake: person firstName
      lastName:
        fake: person lastName
```

### Object should have all mapped fields

```execute
cat empty.txt | aux4 fake object --config fullname | jq 'has("firstName") and has("lastName")'
```

```expect
true
```

### Object fields should be strings

```execute
cat empty.txt | aux4 fake object --config fullname | jq '.firstName | type'
```

```expect
"string"
```

## Multiple Objects with Count

```file:config.yaml
config:
  uuid:
    mapping:
      id:
        fake: string uuid
```

### Generate exact count

```execute
cat empty.txt | aux4 fake object --count 3 --config uuid | jq 'length'
```

```expect
3
```

### Generate with min/max range

```execute
cat empty.txt | aux4 fake object --min 2 --max 4 --config uuid | jq 'length >= 2 and length <= 4'
```

```expect
true
```

## Arguments in Mapping

### Fixed value with args

```file:config.yaml
config:
  fixednum:
    mapping:
      num:
        fake:
          category: number
          type: int
          args:
            min: 50
            max: 50
```

```execute
cat empty.txt | aux4 fake object --config fixednum
```

```expect
{"num":50}
```

### Array element from list

```file:config.yaml
config:
  color:
    mapping:
      color:
        fake:
          category: helpers
          type: arrayElement
          args:
            - - Red
              - Green
              - Blue
```

```execute
cat empty.txt | aux4 fake object --config color
```

```expect:regex
"color":"(Red|Green|Blue)"
```

## Field References

### Reference another field with @

```file:config.yaml
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
      name:
        fake:
          category: person
          type: firstName
          args:
            sex: "@sex"
```

```execute
cat empty.txt | aux4 fake object --config person | jq 'has("sex") and has("name")'
```

```expect
true
```

## Nested Objects

### Generate nested object

```file:config.yaml
config:
  user:
    mapping:
      user:
        mapping:
          email:
            fake: internet email
```

```execute
cat empty.txt | aux4 fake object --config user | jq '.user | has("email")'
```

```expect
true
```

## Locale Support

### Generate with pt_BR locale

```file:config.yaml
config:
  nome:
    mapping:
      nome:
        fake: person firstName
```

```execute
cat empty.txt | aux4 fake object --lang pt_BR --config nome | jq 'has("nome")'
```

```expect
true
```

## Complex Mapping

```file:config.yaml
config:
  complex:
    mapping:
      id:
        fake: string uuid
      active:
        fake: datatype boolean
      score:
        fake:
          category: number
          type: int
          args:
            min: 1
            max: 100
```

### Multiple field types

```execute
cat empty.txt | aux4 fake object --config complex | jq 'has("id") and has("active") and has("score")'
```

```expect
true
```

### Score in valid range

```execute
cat empty.txt | aux4 fake object --config complex | jq '.score >= 1 and .score <= 100'
```

```expect
true
```
