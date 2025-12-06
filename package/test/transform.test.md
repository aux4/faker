# Transform Tests

Tests for transforming existing JSON data via stdin with fake data.

## Single Object Transformation

```file:config.yaml
config:
  name:
    mapping:
      name:
        fake: person firstName
  email:
    mapping:
      email:
        fake: internet email
  number:
    mapping:
      y:
        fake: number int
```

### Transform single object - preserves original fields

```file:single.json
{"id":1,"notes":"keep this"}
```

```execute
cat single.json | aux4 fake object --config name | jq 'has("id") and has("notes") and has("name")'
```

```expect
true
```

### Transform single object - original values unchanged

```file:single-status.json
{"id":42,"status":"active"}
```

```execute
cat single-status.json | aux4 fake object --config email | jq '.id'
```

```expect
42
```

### Transform single object - output is object not array

```file:simple.json
{"x":1}
```

```execute
cat simple.json | aux4 fake object --config number | jq 'type'
```

```expect
"object"
```

## Array Transformation

```file:config.yaml
config:
  name:
    mapping:
      name:
        fake: person firstName
  email:
    mapping:
      email:
        fake: internet email
  number:
    mapping:
      x:
        fake: number int
      b:
        fake: number int
```

### Transform array of objects

```file:array.json
[{"id":1},{"id":2},{"id":3}]
```

```execute
cat array.json | aux4 fake object --config name | jq 'length'
```

```expect
3
```

### Transform array - each item gets fake data

```file:array-two.json
[{"id":1},{"id":2}]
```

```execute
cat array-two.json | aux4 fake object --config email | jq 'all(has("email"))'
```

```expect
true
```

### Transform array - original fields preserved

```file:array-one.json
[{"id":100,"status":"ok"}]
```

```execute
cat array-one.json | aux4 fake object --config number | jq '.[0].id'
```

```expect
100
```

### Transform array - output is array

```file:array-simple.json
[{"a":1}]
```

```execute
cat array-simple.json | aux4 fake object --config number | jq 'type'
```

```expect
"array"
```

## NDJSON Transformation

```file:config.yaml
config:
  name:
    mapping:
      name:
        fake: person firstName
  number:
    mapping:
      x:
        fake: number int
```

### Transform NDJSON - each line is separate JSON

```file:ndjson.txt
{"id":1}
{"id":2}
{"id":3}
```

```execute
cat ndjson.txt | aux4 fake object --config number | wc -l | tr -d ' '
```

```expect
3
```

### Transform NDJSON - first line is valid JSON

```file:ndjson-two.txt
{"id":1}
{"id":2}
```

```execute
cat ndjson-two.txt | aux4 fake object --config name | head -1 | jq 'has("id") and has("name")'
```

```expect
true
```

### Transform NDJSON - preserves original id

```file:ndjson-single.txt
{"id":999}
```

```execute
cat ndjson-single.txt | aux4 fake object --config name | jq '.id'
```

```expect
999
```

## Reference in Transform

```file:config.yaml
config:
  personref:
    mapping:
      name:
        fake:
          category: person
          type: firstName
          args:
            sex: "@sex"
  labelref:
    mapping:
      label:
        fake:
          category: helpers
          type: arrayElement
          args:
            - - "@type"
```

### Reference existing field from input

```file:ref-sex.json
{"sex":"male"}
```

```execute
cat ref-sex.json | aux4 fake object --config personref | jq 'has("sex") and has("name")'
```

```expect
true
```

### Reference preserves original value

```file:ref-type.json
{"type":"work"}
```

```execute
cat ref-type.json | aux4 fake object --config labelref | jq '.type'
```

```expect
"work"
```

## Array Element in Transform

```file:config.yaml
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
              - done
```

### Pick from predefined list

```file:pick-list.json
{"id":1}
```

```execute
cat pick-list.json | aux4 fake object --config status
```

```expect:regex
"status":"(pending|active|done)"
```

## Complex Transform

```file:config.yaml
config:
  multi:
    mapping:
      email:
        fake: internet email
      active:
        fake: datatype boolean
  nome:
    mapping:
      nome:
        fake: person firstName
```

### Multiple fields with different types

```file:complex.json
{"userId":123}
```

```execute
cat complex.json | aux4 fake object --config multi | jq 'has("userId") and has("email") and has("active")'
```

```expect
true
```

### Transform with locale

```file:locale.json
{"id":1}
```

```execute
cat locale.json | aux4 fake object --lang pt_BR --config nome | jq 'has("id") and has("nome")'
```

```expect
true
```
