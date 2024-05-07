/* eslint-disable consistent-return */
// Basic Quick Sort (not in place / stable)
// 구현하기 쉽지만 메모리 공간 낭비 심함 / 중복 데이터 순서 안바뀜
// via https://bit.ly/3zwcIPq

import { makeRandomArr, swap } from '../utils.js';

const quickSort1 = array => {
  if (array.length <= 1) return array; // Base Case

  // 배열 분할을 위한 기준 요소 선택 및 left, right 하위 배열 생성
  const pivotIndex = Math.floor(array.length / 2);
  const pivot = array.splice(pivotIndex, 1)[0];
  const left = [];
  const right = [];

  // 피벗 요소보다 작으면 left 하위 배열에 추가, 피벗 요소보다 크면 right 하위 배열에 추가
  for (let i = 0; i < array.length; i++) {
    if (array[i] < pivot) left.push(array[i]);
    else right.push(array[i]);
  }

  // 정렬된 배열을 얻기 위해 재귀 호출로 위 과정 반복
  return quickSort1(left).concat(pivot, quickSort1(right));
};

console.time('quickSort1');
quickSort1(makeRandomArr(10000, 10000));
console.timeEnd('quickSort1');
/* quickSort1 시뮬레이션
①f([85, 24, 63, 45, 17, 31, 96, 50])
=======================================
pivot = 45, arr = [85, 24, 63, 17, 31, 96, 50]
left = [24, 17, 31], right = [85, 63, 96, 50]
concat ②f([24, 17, 31]) + 45 + ⑦f([85, 63, 96, 50])
---------------------------------------
return [17, 24, 31, 45, 50, 63, 85, 96]

②f([24, 17, 31])
=======================================
pivot = 17, arr = [24, 31]
left = [], right = [24, 31]
concat ③[] + 17 + ④f([24, 31])
---------------------------------------
return [17, 24, 31]

④f([24, 31])
=======================================
pivot = 24, arr = [31]
left = [], right = [31]
concat ⑤[] + 24 + ⑥f([31])
---------------------------------------
return [24, 31]

⑦f([85, 63, 96, 50])
=======================================
pivot = 63, arr = [85, 96, 50]
left = [50], right = [85, 96]
concat ⑧f([50]) + 63 + ⑨f([85, 96])
---------------------------------------
return [50, 63, 85, 96]

⑨f([85, 96]
=======================================
pivot = 85, arr = [96]
left = [], right = [96]
concat ⑩[] + 85 + ⑪f([96])
---------------------------------------
return [85, 96]
*/

// In place Quick Sort (in place / unstable)
// 메모리 공간 절약 / 중복 데이터 순서 바뀔 수 있음
// reference1: https://www.guru99.com/quicksort-in-javascript.html
// reference2: https://bit.ly/3QjduFC
function quickSort2(arr, start = 0, end = arr.length - 1) {
  if (start >= end) return; // Base Case

  const borderIndex = partition(arr, start, end); // 배열을 나누는 경계 인덱스
  quickSort2(arr, start, borderIndex - 1); // borderIndex 왼쪽 요소
  quickSort2(arr, borderIndex, end); // borderIndex 오른쪽 요소

  return arr;
}

function partition(arr, start, end) {
  const pivot = arr[Math.floor((start + end) / 2)]; // 가운데 요소를 피벗으로 설정

  let i = start; // 왼쪽 포인터
  let j = end; // 오른쪽 포인터

  // i/j 포인터가 교차할 때까지 반복(교차 전이라면 pivot 왼쪽에 더 큰 값이 남아 있는 상태)
  while (i <= j) {
    while (arr[i] < pivot) i++; // 배열 왼쪽부터 pivot 값 보다 큰 요소의 인덱스 검색
    while (arr[j] > pivot) j--; // 배열 오른쪽부터 pivot 값 보다 작은 요소의 인덱스 검색

    // i/j 포인터가 교차전이라면
    if (i <= j) {
      // i < j : i 인덱스 요소가 j 인덱스 요소보다 보다 큰 값이므로 swap 후 인덱스 이동
      // i = j : 이미 교차 했을때도 다음 경계 인덱스를 위해 i/j swap 후 인덱스 이동
      swap(arr, i, j);
      i++; // 다음 검색을 위해 i + 1
      j--; // 다음 검색을 위해 i - 1
    }
  }

  return i; // 교차 후의 i 인덱스를 다음 경계 인덱스로 사용하기 위해 리턴
}

console.time('quickSort2');
quickSort2(makeRandomArr(10000, 10000));
console.timeEnd('quickSort2');

/*
quickSort2 시뮬레이션
⑴ Q([85, 24, 63, 45, 17, 31, 96, 50], 0, 7)
===========================================
b = P([85, 24, 63, 45, 17, 31, 96, 50], 0, 7) -> [P-1] 4
⑵ Q([31, 24, 17, 45, 63, 85, 96, 50], 0, 3) -> [17, 24, 31, 45, 63, 85, 96, 50]
⑼ Q([17, 24, 31, 45, 63, 85, 96, 50], 4, 7) -> [17, 24, 31, 45, 50, 63, 85, 96]
---------------------------------------
return [17, 24, 31, 45, 50, 63, 85, 96]

⑵ Q([31, 24, 17, 45, 63, 85, 96, 50], 0, 3)
===========================================
b = P([31, 24, 17, 45, 63, 85, 96, 50], 0, 3) -> [P-2] 2
⑶ Q([17, 24, 31, 45, 63, 85, 96, 50], 0, 1) -> [17, 24, 31, 45, 63, 85, 96, 50]
⑹ Q([17, 24, 31, 45, 63, 85, 96, 50], 2, 3) -> [17, 24, 31, 45, 63, 85, 96, 50]
---------------------------------------
return [17, 24, 31, 45, 63, 85, 96, 50]

⑶ Q([17, 24, 31, 45, 63, 85, 96, 50], 0, 1)
===========================================
b = P([17, 24, 31, 45, 63, 85, 96, 50], 0, 1) -> [P-3] 1
⑷ Q([17, 24, 31, 45, 63, 85, 96, 50], 0, 0) -> Base case return
⑸ Q([17, 24, 31, 45, 63, 85, 96, 50], 1, 1) -> Base case return
---------------------------------------
return [17, 24, 31, 45, 63, 85, 96, 50]

⑹ Q([17, 24, 31, 45, 63, 85, 96, 50], 2, 3)
===========================================
b = P([17, 24, 31, 45, 63, 85, 96, 50], 2, 3) -> [P-4] 3
⑺ Q([17, 24, 31, 45, 63, 85, 96, 50], 2, 2) -> Base case return
⑻ Q([17, 24, 31, 45, 63, 85, 96, 50], 3, 3) -> Base case return
---------------------------------------
return [17, 24, 31, 45, 63, 85, 96, 50]

⑼ Q([17, 24, 31, 45, 63, 85, 96, 50], 4, 7)
===========================================
b = P([17, 24, 31, 45, 63, 85, 96, 50], 4, 7) -> [P-5] 6
⑽ Q([17, 24, 31, 45, 63, 50, 96, 85], 4, 5) -> [17, 24, 31, 45, 50, 63, 96, 85]
⒀ Q([17, 24, 31, 45, 50, 63, 96, 85], 6, 7) -> [17, 24, 31, 45, 50, 63, 85, 96]
---------------------------------------
return [17, 24, 31, 45, 50, 63, 85, 96]

⑽ Q([17, 24, 31, 45, 63, 50, 96, 85], 4, 5)
===========================================
b = P([17, 24, 31, 45, 63, 50, 96, 85], 4, 5) -> [P-6] 5
⑾ Q([17, 24, 31, 45, 50, 63, 96, 85], 4, 4) -> Base case return
⑿ Q([17, 24, 31, 45, 50, 63, 96, 85], 5, 5) -> Base case return
---------------------------------------
return [17, 24, 31, 45, 50, 63, 96, 85]

⒀ Q([17, 24, 31, 45, 50, 63, 96, 85], 6, 7)
===========================================
b = P([17, 24, 31, 45, 50, 63, 96, 85], 6, 7) -> [P-7] 7
⒁ Q([17, 24, 31, 45, 50, 63, 85, 96], 6, 6) -> Base case return
⒂ Q([17, 24, 31, 45, 50, 63, 85, 96], 7, 7) -> Base case return
---------------------------------------
return [17, 24, 31, 45, 50, 63, 85, 96]

[P-1] P([85, 24, 63, 45, 17, 31, 96, 50], 0, 7)
===============================================
pivot = 45, i = 0, j = 7
------------------------
while (0 <= 7)
85 < 45 (x) : i = 0
50 > 45 (-1) -> 96 > 45 (-1) -> 31 > 45 (x) : j = 5
if (0 <= 5) -> swap 85/31 -> [31, 24, 63, 45, 17, 85, 96, 50] -> i = 1, j = 4
------------------------
while (1 <= 4)
24 < 45 (+1) -> 63 < 45 (x) : i = 2
17 > 45 (x) : j = 4
if (2 <= 4) -> swap 63/17 -> [31, 24, 17, 45, 63, 85, 96, 50] -> i = 3, j = 3
------------------------
while (3 <= 3)
45 < 45 (x) : i = 3
45 > 45 (x) : j = 3
if (3 <= 3) -> swap 45/45 -> [31, 24, 17, 45, 63, 85, 96, 50] -> i = 4, j = 2
------------------------
return 4

[P-2] P([31, 24, 17, 45, 63, 85, 96, 50], 0, 3)
===============================================
pivot = 24, i = 0, j = 3
------------------------
while (0 <= 3)
31 < 24 (x) : i = 0
45 > 24 (-1) -> 17 > 24 (x) : j = 2
if (0 <= 2) -> swap 31/17 -> [17, 24, 31, 45, 63, 85, 96, 50] -> i = 1, j = 1
------------------------
while (1 <= 1)
24 < 24 (x) : i = 1
24 > 24 (x) : j = 1
if (1 <= 1) -> swap 24/24 -> [17, 24, 31, 45, 63, 85, 96, 50] -> i = 2, j = 0
------------------------
return 2

[P-3] P([17, 24, 31, 45, 63, 85, 96, 50], 0, 1)
===============================================
pivot = 17, i = 0, j = 1
------------------------
while (0 <= 1)
17 < 17 (x) : i = 0
24 > 17 (-1) -> 17 > 17 (x) : j = 0
if (0 <= 0) -> swap 17/17 -> [17, 24, 31, 45, 63, 85, 96, 50] -> i = 1, j = -1
------------------------
return 1

[P-4] P([17, 24, 31, 45, 63, 85, 96, 50], 2, 3)
===============================================
pivot = 31, i = 2, j = 3
------------------------
while (2 <= 3)
31 < 31 (x) : i = 2
45 > 31 (-1) -> 31 > 31 (x) : j = 2
if (2 <= 2) -> swap 31/31 -> [17, 24, 31, 45, 63, 85, 96, 50] -> i = 3, j = 1
------------------------
return 3

[P-5] P([17, 24, 31, 45, 63, 85, 96, 50], 4, 7)
===============================================
pivot = 85, i = 4, j = 7
------------------------
while (4 <= 7)
63 < 85 (+1) -> 85 < 85 (x) : i = 5
50 > 85 (x) -> j = 7
if (5 <= 7) -> swap 85/50 -> [17, 24, 31, 45, 63, 50, 96, 85] -> i = 6, j = 6
------------------------
while (6 <= 6)
96 < 85 (x) : i = 6
96 > 85 (-1) -> 50 > 85 (x) : j = 5
------------------------
return 6

[P-6] P([17, 24, 31, 45, 63, 50, 96, 85], 4, 5)
===============================================
pivot = 63, i = 4, j = 5
------------------------
while (4 <= 5)
63 < 63 (x) : i = 4
50 > 63 (x) : j = 5
if (4 <= 5) -> swap 63/50 -> [17, 24, 31, 45, 50, 63, 96, 85] -> i = 5, j = 4
------------------------
return 5

[P-7] P([17, 24, 31, 45, 50, 63, 96, 85], 6, 7)
===============================================
pivot = 96, i = 6, j = 7
------------------------
while (6 <= 7)
96 < 96 (x) : i = 6
85 > 96 (x) : j = 7
if (6 <= 7) -> swap 96/85 -> [17, 24, 31, 45, 50, 63, 85, 96] -> i = 7, j = 6
------------------------
return 7
*/
