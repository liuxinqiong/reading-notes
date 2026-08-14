// 相邻两两比较
export function bubbleSort(array: number[]): number[] {
  for (let i = 0; i < array.length - 1; i++) {
    for (let j = 0; j < array.length - 1 - i; j++) {
      if (array[j] > array[j + 1]) {
        const temp = array[j];
        array[j] = array[j + 1];
        array[j + 1] = temp;
      }
    }
  }
  return array;
}

// 相邻已排序区和未排序区，从未排序去选择元素，找到合适的位置插入
export function insertionSort(array: number[]): number[] {
  for (let i = 1; i < array.length; i++) {
    const key = array[i];
    let j = i - 1;
    while (j >= 0 && array[j] > key) {
      array[j + 1] = array[j];
      j--;
    }
    array[j + 1] = key;
  }
  return array;
}

// 类似插入排序，但选择排序每次从未排序区选择最小的元素已排序区的末尾
export function selectionSort(array: number[]): number[] {
  for (let i = 0; i < array.length - 1; i++) {
    let minIndex = i;
    for (let j = i + 1; j < array.length; j++) {
      if (array[j] < array[minIndex]) {
        minIndex = j;
      }
    }
    if (minIndex !== i) {
      const temp = array[i];
      array[i] = array[minIndex];
      array[minIndex] = temp;
    }
  }
  return array;
}

// 两部分分别排序，然后进行合并
export function mergeSort(array: number[]): number[] {
  const mid = Math.floor(array.length / 2);
  if (array.length <= 1) {
    return array;
  }
  const left = mergeSort(array.slice(0, mid));
  const right = mergeSort(array.slice(mid));
  return merge(left, right);
}

function merge(left: number[], right: number[]): number[] {
  const result: number[] = [];
  let i = 0;
  let j = 0;
  while (i < left.length && j < right.length) {
    if (left[i] < right[j]) {
      result.push(left[i]);
      i++;
    } else {
      result.push(right[j]);
      j++;
    }
  }
  return result.concat(left.slice(i)).concat(right.slice(j));
}

// 选择分区点，然后将数组分为两部分，分别排序
export function quickSort(array: number[]): number[] {
  if (array.length <= 1) {
    return array;
  }
  const pivot = array[array.length - 1];
  const left: number[] = [];
  const right: number[] = [];
  for (let i = 0; i < array.length - 1; i++) {
    if (array[i] < pivot) {
      left.push(array[i]);
    } else {
      right.push(array[i]);
    }
  }
  return [...quickSort(left), pivot, ...quickSort(right)];
}

// 在 O(n) 时间复杂度内找到第 k 大的元素
export function findKthLargest(nums: number[], k: number): number {
  return findKthLargestInternal(nums, k, 0, nums.length - 1);
}

function findKthLargestInternal(nums: number[], k: number, p: number, r: number) {
  const [lt, gt] = partition3(nums, p, r);
  const right = r - gt;
  if (right >= k) {
    return findKthLargestInternal(nums, k, gt + 1, r);
  }
  if (right + gt - lt + 1 >= k) {
    return nums[lt];
  }

  return findKthLargestInternal(nums, k - right - gt + lt - 1, p, lt - 1);
}

function partition3(nums: number[], p: number, r: number) {
  const pivot = nums[r];

  let lt = p;
  let i = p;
  let gt = r;

  while (i <= gt) {
    if (nums[i] < pivot) {
      swap(nums, i, lt);
      lt++;
      i++;
    } else if (nums[i] > pivot) {
      swap(nums, i, gt);
      gt--;
    } else {
      i++;
    }
  }

  return [lt, gt];
}

function partition(arr: number[], p: number, r: number) {
  const pivot = arr[r];
  let i = p;
  for (let j = p; j < r; j++) {
    if (arr[j] <= pivot) {
      swap(arr, i, j);
      i++;
    }
  }
  swap(arr, i, r);
  return i;
}

function swap(arr: number[], i: number, j: number) {
  if (i == j) {
    return;
  }
  const tmp = arr[i];
  arr[i] = arr[j];
  arr[j] = tmp;
}

export function bsearch(array: number[], target: number): number {
  let left = 0;
  let right = array.length - 1;
  while (left <= right) {
    const mid = Math.floor((left + right) / 2);
    if (array[mid] === target) {
      return mid;
    } else if (array[mid] < target) {
      left = mid + 1;
    } else {
      right = mid - 1;
    }
  }
  return -1;
}

export function bsearchLeft(array: number[], target: number): number {
  let left = 0;
  let right = array.length - 1;
  while (left <= right) {
    const mid = Math.floor((left + right) / 2);
    if (array[mid] < target) {
      left = mid + 1;
    } else {
      right = mid - 1;
    }
  }
  return left;
}

export function bsearchRight(array: number[], target: number): number {
  let left = 0;
  let right = array.length - 1;
  while (left <= right) {
    const mid = Math.floor((left + right) / 2);
    if (array[mid] <= target) {
      left = mid + 1;
    } else {
      right = mid - 1;
    }
  }
  return right;
}
