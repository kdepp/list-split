import {partial, dot, map, reduce, reduce_right, filter, last} from './utils';

const type = {
    at: (list, i)  => list[i],
    slice: (list, start, end) => list.slice(start, end),
    concat: (x, y) => x + y,
    length: (list) => list.length,
    indexOf: (list, x) => list.indexOf(x),
    map: (fn, list) => map(fn, list),
    mempty: ""
}; 

const split = partial((postFn, predicates, list) => {
    return extract( postFn( breakDelims(predicates, list) ) );
});

const eq = partial((x, y) => x === y);

const extract = map(x => x.s);

const Text = (s) => ({ t: "Text", s });

const Delim = (s) => ({ t: "Delim", s });

const isText  = (x) => x && x.t === "Text";

const isDelim = (x) => x && x.t === "Delim";

export const breakDelims = (predicates, list) => {
    let match = (predicates, list, start) => {
        return reduce((prev, cur, i) => {
            return prev && cur(type.at(list, start + i));
        }, true, predicates);
    };

    let result  = [],
        l       = type.length(list),
        pl      = predicates.length,
        pos     = 0,
        lastPos = 0;

    while (pos < l) {
        if (match(predicates, list, pos)) {
            if (pos == 0 || pos - lastPos > 1) {
                result.push(Text(type.slice(list, lastPos, pos)));
            }
            result.push(Delim(type.slice(list, pos, pos + pl)));
            lastPos = pos = pos + pl;
        } else {
            pos += 1
        }
    }

    result.push(Text(type.slice(list, lastPos)));

    return result;
};

export const when = (fn) => {
    return [fn];
};

export const dropInitialBlank = (list) => {
    if (isText(list[0]) && type.length(list[0].s) === 0)   return list.slice(1);
    return list;
};

export const dropFinalBlank = (list) => {
    var end = last(list);
    if (isText(end) && type.length(end.s) === 0)   return list.slice(0, -1);
    return list;
};

export const insertBlanks = (list) => {
    for (let i = list.length - 1; i > 0; i -= 1) {
        if (isDelim(list[i]) && isDelim(list[i-1])) {
            list.splice(i, 0, Text(type.mempty));
        }
    }

    return list;
};

export const dropDelims = filter(isText);

export const condense = (list) => {
    return reduce((prev, cur) => {
        var end = last(prev);

        if (isText(cur) || isText(end)) {
            prev.push(cur);
        } else {
            end.s = type.concat(end.s, cur.s)
        }

       return prev;
    }, [], list);
};

export const mergeDelimsLeft = (list) => {
    return reduce_right((cur, prev) => {
        if (prev.length && isDelim(prev[0]) && isText(cur)) {
            prev[0] = Text(type.concat(cur.s, prev[0].s)); 
        } else {
            prev.unshift(cur); 
        }

        return prev;
    }, [], list);
};

export const mergeDelimsRight = (list) => {
    return reduce((prev, cur) => {
        var end = last(prev);

        if (end && isDelim(end) && isText(cur)) {
            prev[prev.length - 1] = Text(type.concat(end.s, cur.s));
        } else {
            prev.push(cur);
        }

        return prev;
    }, [], list);
};

export const oneOf = (elts) => [(x) => -1 !== type.indexOf(elts, x)];

export const onSubList = (list) => type.map(x => eq(x), list);

export const splitOneOf = partial((pattern, list) => {
    return split(dropDelims, oneOf(pattern), list);
});

export const splitOn = partial((pattern, list) => {
    return split(dropDelims, onSubList(pattern), list);
});

export const splitWhen = partial((fn, list) => {
    return split(dropDelims, when(fn), list);
});
