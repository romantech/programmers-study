import { generateTestPair } from '../../utils.js';

/**
 * [요구사항]
 * n 개의 양의 정수들을 순서를 바꾸지 않고 더하거나 빼서 타겟 넘버를 만들 수 있는 방법의 수 반환
 *
 * [파라미터]
 * number: 2개 이상, 20개 이하, 각 숫자는 1 이상 50 이하
 * target: 1 이상 1000 이하
 *
 * [예시]
 * numbers: [1, 1, 1, 1, 1] | target: 3
 * 1. -1 +1 +1 +1 +1 = 3
 * 2. +1 -1 +1 +1 +1 = 3
 * 3. +1 +1 -1 +1 +1 = 3
 * 4. +1 +1 +1 -1 +1 = 3
 * 5. +1 +1 +1 +1 -1 = 3
 * return 5
 *
 * numbers: [4, 1, 2, 1] | target: 4
 * 1. +4 +1 -2 +1 = 4
 * 2. +4 -1 +2 -1 = 4
 * return 2
 */

export function solution(numbers, target) {
  const dfs = (index, sum) => {
    if (index === numbers.length) return sum === target ? 1 : 0;

    const add = dfs(index + 1, sum + numbers[index]);
    const sub = dfs(index + 1, sum - numbers[index]);

    return add + sub;
  };

  return dfs(0, 0);
}

export const cases = [
  generateTestPair([[1, 1, 1, 1, 1], 3], 5),
  generateTestPair([[4, 1, 2, 1], 4], 2),
];
