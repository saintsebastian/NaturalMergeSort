function merge(left, right) {
  let sorted = [];
  while (left.length > 0 && right.length > 0)
    sorted.push(left[0] < right[0] ? left.shift() : right.shift());

  return sorted.concat(left.length ? left : right);
}

function topDownMergeSort(toSort) {
  if (toSort.length <= 1)
    return toSort;

  const middle = Math.floor(toSort.length / 2);
  const left = topDownMergeSort(toSort.slice(0, middle));
  const right = topDownMergeSort(toSort.slice(middle));

  return merge(left, right);
}

function bottomUpMergeSort(toSort) {
  let sorting = toSort.slice();
  const length = toSort.length;
  for (let width = 1; width < length; width *= 2) {
    // let runSorted = toSort.slice();
    for (let beginning = 0; beginning < length; beginning += width * 2) {
      const end = Math.min(beginning + width * 2, length);
      const left = sorting.slice(
        beginning,
        Math.min(beginning + width, length)
      );
      const right = sorting.slice(
        Math.min(beginning + width, length),
        end
      );
      const sortedSlice = merge(left, right);
      sorting = sorting.slice(0, beginning).concat(sortedSlice, sorting.slice(end, length));
    }
  }
  return sorting;
}

function findSorted(toSort) {
  let sorted = [];
  let ordered = false;
  let counter = 1;
  let run = {}
  for (let i = 0; i < toSort.length; i++) {
    if (toSort[i] <= toSort[i + 1]) {
      counter++;
      if (!ordered) {
        ordered = true;
        run.start = i;
      }
    } else {
      if (ordered) {
        run.end = run.start + counter;
        sorted.push(run);
        ordered = false;
        counter = 1;
        run = {};
      }
    }
  }
  return sorted;
}

function naturalUpMergeSort(toSort) {
  const presorted = findSorted(toSort);
  const order = presorted[0]['start'] === 0;
  let lastEnd = 0;
  let chunks = [];
  let sorted = [];
  for (let i = 0; i <= presorted.length; i++) {
    if (i !== presorted.length) {
      const current = presorted[i];
      const ordered = toSort.slice(current.start, current.end);

      const nextStart = order ? current.end : lastEnd;
      const nextEnd = (order && i + 1 < presorted.length) ? presorted[i + 1]['start'] : current.start;
      const rest = nextStart !== nextEnd ? topDownMergeSort(
        toSort.slice(nextStart, nextEnd),
      ) : [];
      chunks.push(merge(ordered, rest));
      lastEnd = current.end;
    } else {
      chunks.push(toSort.slice(lastEnd, toSort.length));
    }
  }
  for (let j = 0; j < chunks.length; j++)
    sorted = merge(chunks[j], sorted);
  return sorted;
}

console.time('topDown');
console.log(topDownMergeSort([5, 4, 6, 8, 7, 4, 3, 9, 1, 3, 0, 15, 11, 19, 18]));
console.timeEnd('topDown');

console.time('bottomUp');
console.log(bottomUpMergeSort([5, 4, 6, 8, 7, 4, 3, 9, 1, 3, 0, 15, 11, 19, 18]));
console.timeEnd('bottomUp');

// console.time('natural');
// console.log(naturalUpMergeSort([5, 4, 6, 8, 7, 4, 3, 9, 1, 3, 0, 15, 11, 19, 18]));
// console.timeEnd('natural');

console.time('natural');
console.log(naturalUpMergeSort([5, 4, 6, 8, 7, 4, 3, 9, 1, 3, 0, 15, 11, 19, 18]));
console.timeEnd('natural');
