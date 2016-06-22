# list-split

list-split is a toolkit for list/string splitting, it's inspired by [Haskell's Data.List.Split](https://hackage.haskell.org/package/split-0.1.1/docs/Data-List-Split.html)

### Installation

```
npm install --save list-split
```

### Usage

``` js
// normal split
splitOn("&", "a=1&b=2&c=3")         // ["a=1", "b=2", "c=3"]

// multi delimeter 
splitOneOf("+-*", "11*23-5+9")      // ["11", "23", "5", "9"]

// simple predicate
splitWhen(x => x < 5, [7,8,3,2,9,6,1,5])        // [[7,8], [9,6], [5]]

// keep delimeters to the right
split(
    mergeDelimsRight,
    when(x => x.charCodeAt(0) >= 65 && x.charCodeAt(0) <= 90),
    "camelCaseHelloWorld"
)
// ["camel", "Case", "Hello", "World"]

// remove heading and trailing blanks, and remove delimeters
split(
    dot(dropInitialBlank, dropFinalBlank, dropDelims),
    oneOf("?&"),
    "?a=1&b=2&c=3&"
)
// ["a=1", "b=2", "c=3"]
```

### API

#### Core
- split(postProcess, predicates, list)
    - Split the list according to predicates, and do whatever you want in the postProcess
    - **param**: `postProcess` { Function }
    - **param**: `predicates` { [Function] }
    - **param**: `list` { Array | String }

#### for Predicates
- ##### oneOf(choices)
    Generate an array of one function based on the given choices
    - **param**: `choices` { Array | String }

- ##### onSubList(delim)
    Generate an array of functions based on the given delim. One function for one element in the delim.
    - **param**: `delim` { Array | String }

- ##### when(predicate)
    Just wrap the predicate in an array.
    - **param**: `predicate` { Function }

#### for postProcess

- dropInitialBlank
``` js
split(dropDelims, oneOf(','), ",foo,bar")                           // ["","foo","bar"]
split(dot(dropDelims, dropInitialBlank), oneOf(','), ",foo,bar")    // ["foo","bar"]
```

- dropFinalBlank
``` js
split(dropDelims, oneOf(','), "foo,bar,")                           // ["foo","bar",""]
split(dot(dropDelims, dropFinalBlank), oneOf(','), ",foo,bar")      // ["foo","bar"]
```

- insertBlanks
    * insert a blank between two consecutive delimeters
``` js
split(dropDelims, oneOf(','), "foo;;bar")                           // ["foo","bar"]
split(dot(dropDelims, insertBlanks), oneOf(','), ",foo,bar")        // ["foo","","bar"]
```

- dropDelims
    * as default, we will keep the delimeters in the result, but you can easily remove them with dropDelims

- condense
    * combine consecutive delimeters into one element
``` js
split(id, oneOf(';'), "foo;;bar")                               // ["foo",";",";","bar"]
split(condense, oneOf(';'), ",foo;;bar")                         // ["foo",";;","bar"]
```

- mergeDelimsLeft
    * merge the left most delimeters in a row with the left element
``` js
split(id, oneOf(';'), "foo;;bar")                               // ["foo",";",";","bar"]
split(mergeDelimsLeft, oneOf(';'), ",foo;;bar")                 // ["foo;", ";", "bar"]
```

- mergeDelimsRight
    * merge the right most delimeters in a row with the right element
``` js
split(id, oneOf(';'), "foo;;bar")                               // ["foo",";",";","bar"]
split(mergeDelimsRight, oneOf(';'), ",foo;;bar")                 // ["foo", ";", ";bar"]
```

- dot
    * combine the postProcess with `dot` (it's just function compose)
``` js
dot(dropInitialBlank, dropDelims)
```

### Licence

MIT

