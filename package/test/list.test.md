# Fake List Tests

Tests for the `aux4 fake list` command to list faker categories and types.

## List Categories

### List all categories

```execute
aux4 fake list | head -5
```

```expect:partial
airline
```

### Categories include person

```execute
aux4 fake list | grep person
```

```expect
person
```

### Categories include internet

```execute
aux4 fake list | grep internet
```

```expect
internet
```

## List Types for Category

### List types for person category

```execute
aux4 fake list person | head -3
```

```expect:partial
firstName
```

### Person category includes fullName

```execute
aux4 fake list person | grep fullName
```

```expect
fullName
```

### Person category includes lastName

```execute
aux4 fake list person | grep lastName
```

```expect:partial
lastName
```

### Internet category includes email

```execute
aux4 fake list internet | grep email
```

```expect
email
```

### Number category includes int

```execute
aux4 fake list number | grep int
```

```expect
int
```

## List Specific Type

### List specific type with args

```execute
aux4 fake list person --type fullName
```

```expect:partial
fullName
```

### fullName has firstName arg

```execute
aux4 fake list person --type fullName | grep firstName
```

```expect:partial
firstName
```

### fullName has lastName arg

```execute
aux4 fake list person --type fullName | grep lastName
```

```expect:partial
lastName
```

### fullName has sex arg

```execute
aux4 fake list person --type fullName | grep sex
```

```expect:partial
sex
```

### int type has min arg

```execute
aux4 fake list number --type int | grep min
```

```expect:partial
min
```

### int type has max arg

```execute
aux4 fake list number --type int | grep max
```

```expect:partial
max
```

## Type without args

### firstName has no args

```execute
aux4 fake list person --type firstName | wc -l | tr -d ' '
```

```expect
1
```

## Error Handling

### Unknown category

```execute
aux4 fake list unknowncategory 2>&1 || true
```

```expect:partial
Unknown category
```

### Unknown type

```execute
aux4 fake list person --type unknowntype 2>&1 || true
```

```expect:partial
Unknown type
```
