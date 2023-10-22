/**
 * 하노이의 탑 문제 요구사항
 * n개의 원판을 1번 기둥에서 3번 기둥으로 옮기는 최소의 방법
 * 기둥의 개수는 3개(시작/대상/보조 기둥), 원판 n개
 * 한 번에 하나의 원판만 옮길 수 있음, 큰 원판이 작은 원판 위에 있으면 안됨
 */

/**
 * 풀이 방법 @see https://brunch.co.kr/@younggiseo/139
 * 1번 기둥에 있는 n개 원반 중 n-1개를 2번 기둥으로 옮긴다. 이때 3번 기둥을 보조 기둥으로 사용한다
 * 1번 기둥에 남아 있는 가장 큰 원반을 3번 기둥으로 옮긴다
 * 2번 기둥에 남아 있는 n-1개 원반을 다시 3번 기둥으로 옮긴다. 이때 1번 기둥을 보조 기둥으로 사용한다
 * 원반(n)이 1개일 땐 그냥 옮긴다 (재귀 종료 조건)
 */

/**
 * @param {number} n - 옮겨야 할 원판의 개수
 * @param {string} from - 원판의 현재 위치
 * @param {string} to - 원판을 옮겨야 할 목적지 위치
 * @param {string} aux - 보조 기둥
 * @param {Array<Array<number>>} answer - 원판의 이동 순서
 */
function hanoi(n, from, to, aux, answer) {
  // 원판이 1개만 남았을 때 from -> to 기둥으로 이동
  if (n === 1) {
    answer.push([from, to]);
    return;
  }

  // from에 있는 n-1개의 원판을 aux 기둥으로 이동 (to를 보조 기둥으로 사용)
  hanoi(n - 1, from, aux, to, answer);
  // from에 남은 원판을 to 기둥으로 이동
  answer.push([from, to]);
  // aux에 있는 n-1개의 원판을 to 기둥으로 이동(from을 보조 기둥으로 사용)
  hanoi(n - 1, aux, to, from, answer);
}

function solution(n) {
  const answer = [];
  hanoi(n, 1, 3, 2, answer);
  return answer;
}

const cases = [
  {
    input: 2, // n
    output: [
      [1, 2], // [시작 기둥, 목적 기둥]
      [1, 3],
      [2, 3],
    ],
  },
  {
    input: 3, // n
    output: [
      [1, 3], // [시작 기둥, 목적 기둥]
      [1, 2],
      [3, 2],
      [1, 3],
      [2, 1],
      [2, 3],
      [1, 3],
    ],
  },
];

// console.log(solution(3));
cases.forEach(({ input, output }) => {
  const isPassed = solution(input).every(([from, to], i) => {
    const [expectedFrom, expectedTo] = output[i];
    return from === expectedFrom && to === expectedTo;
  });
  console.log(isPassed);
});

// h(2, 1, 3, 2, [])
// ㄴ (n2 전) h(1, 1, 2, 3, []) -> [1, 2]
// ㄴ (n2 중) [[1, 2], [1, 3]]
// ㄴ (n2 후) h(1, 2, 3, 1, []) -> [[1, 2], [1, 3], [2, 3]]

// h(3, 1, 3, 2, [])
// ㄴ (n3 전) h(2, 1, 2, 3, [])
// ㄴㄴ (n2 전) h(1, 1, 3, 2, []) -> [[1, 3]]
// ㄴㄴ (n2 중) [[1, 3], [1, 2]]
// ㄴㄴ (n2 후) h(1, 3, 2, 1, []) -> [[1, 3], [1, 2], [3, 2]]
// ㄴ (n3 중) [[1, 3], [1, 2], [3, 2], [1, 3]]
// ㄴ (n3 후) h(2, 2, 3, 1, [])
// ㄴㄴ (n2 전) h(1, 2, 1, 3, []) -> [[1, 3], [1, 2], [3, 2], [1, 3], [2, 1]]
// ㄴㄴ (n2 중) [[1, 3], [1, 2], [3, 2], [1, 3], [2, 1], [2, 3]]
// ㄴㄴ (n2 후) h(1, 1, 3, 2, []) -> [[1, 3], [1, 2], [3, 2], [1, 3], [2, 1], [2, 3], [1, 3]]
