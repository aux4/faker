# Fake Value Tests

Tests for the `aux4 fake value` command to generate fake data values.

## Basic Value Generation

### Generate a single name

```execute
aux4 fake value person --type firstName
```

```expect:regex
^[A-Za-z]+$
```

### Generate number with fixed value

```execute
aux4 fake value number --type int --arg min=100 --arg max=100
```

```expect
100
```

## Multiple Values with Count

### Generate exact count of numbers

```execute
aux4 fake value number --type int --count 3 | jq 'length'
```

```expect
3
```

### Each generated number is a digit

```execute
aux4 fake value number --type int --count 3 | jq '.[] | type' | head -1
```

```expect
"number"
```

### Generate values within min/max count range

```execute
aux4 fake value number --type int --min 2 --max 4 | jq 'length >= 2 and length <= 4'
```

```expect
true
```

## Number Generation

### Generate integer in range

```execute
aux4 fake value number --type int --arg min=1 --arg max=10 | jq '. >= 1 and . <= 10'
```

```expect
true
```

### Generate fixed float

```execute
aux4 fake value number --type float --arg min=5 --arg max=5 --arg fractionDigits=0
```

```expect
5
```

## Locale Support

### Generate name with default locale

```execute
aux4 fake value person --type firstName
```

```expect:regex
^[A-Za-z]+$
```

### Generate name with pt_BR locale

```execute
aux4 fake value person --type firstName --lang pt_BR
```

```expect:regex
^[A-Za-zÀ-ÿ ]+$
```

## Internet Category

### Generate email with valid format

```execute
aux4 fake value internet --type email
```

```expect:regex
^[A-Za-z0-9._-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$
```

## Lorem Category

### Generate word

```execute
aux4 fake value lorem --type word
```

```expect:regex
^[a-z]+$
```

## Date Category

### Generate past date contains year

```execute
aux4 fake value date --type past
```

```expect:regex
20[0-9]{2}
```

## Boolean Generation

### Generate boolean true or false

```execute
aux4 fake value datatype --type boolean
```

```expect:regex
^(true|false)$
```

## UUID Generation

### Generate valid UUID format

```execute
aux4 fake value string --type uuid
```

```expect:regex
^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$
```

## String Category

### Generate alphanumeric string

```execute
aux4 fake value string --type alphanumeric --arg length=10
```

```expect:regex
^[A-Za-z0-9]{10}$
```
