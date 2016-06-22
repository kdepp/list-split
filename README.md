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
- ##### split(postProcess, predicates, list)
    Split the list according to predicates, and do whatever you want in the postProcess
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

* dropInitialBlank
    * e.g. `split(dropDelims, oneOf(','), ",foo,bar")` should be `["","foo","bar"]`, but with dropInitialBlank, it will be `["foo", "bar"]`
* dropFinalBlank
    * e.g. `split(dropDelims, oneOf(','), "foo,bar,")` should be `["foo","bar",""]`, but with dropFinalBlank, it will be `["foo", "bar"]`
* insertBlanks
    * insert a blank between two consecutive delimeters
    * e.g. `split(dropDelims, oneOf(','), "foo;;bar")` should be `["foo","bar"]`, but with insertBlanks, it will be `["foo", "", "bar"]`
* dropDelims
    * as default, we will keep the delimeters in the result, but you can easily remove them with dropDelims
* condense
    * combine consecutive delimeters into one element
    * e.g. `split(id, oneOf(','), "foo;;bar")` should be `["foo",";",";","bar"]`, but with condense, it will be `["foo", ";;", "bar"]`
* mergeDelimsLeft
    * merge the left most delimeters in a row with the left element
    * e.g. `split(id, oneOf(','), "foo;;bar")` should be `["foo",";",";","bar"]`, but with mergeDelimsLeft, it will be `["foo;", ";", "bar"]`
* mergeDelimsRight
    * merge the right most delimeters in a row with the right element
    * e.g. `split(id, oneOf(','), "foo;;bar")` should be `["foo",";",";","bar"]`, but with mergeDelimsRight, it will be `["foo", ";", ";bar"]`

combine the postProcess with `dot` (it's just function compose)
``` js
dot(dropInitialBlank, dropDelims)
```

### Licence

MIT

