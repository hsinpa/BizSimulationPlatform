import { arrays } from "typescript-collections";

export function ArrayInsert<T>( arrays : T[], index : number, item : T ) : T[] {
    arrays.splice( index, 0, item );

    return arrays;
}

export function ArrayRemove<T>( arrays : T[], index : number ) : T[] {
    arrays.splice( index, 1);

    return arrays;
}