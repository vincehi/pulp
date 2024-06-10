import { startsWith } from "lodash-es";

export interface MetadataFiles {
  total_count: number;
}

export function paddedSplice(
  originalArray: any[] = [],
  startIndex: number,
  dataToInsert: any[]
) {
  const diff = Math.max(0, startIndex - originalArray.length);

  let newOriginalArray = originalArray.concat(new Array(diff).fill({}));

  newOriginalArray.splice(startIndex, dataToInsert.length, ...dataToInsert);

  return newOriginalArray;
}

export const removeSubstrings = (arr: string[]): string[] => {
  return arr.filter(
    (item, index) =>
      !arr.some(
        (otherItem, otherIndex) =>
          otherIndex !== index && startsWith(otherItem, item)
      )
  );
};
