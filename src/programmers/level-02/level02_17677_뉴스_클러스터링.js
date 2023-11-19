/**
 * [요구사항]
 * 유사한 기사를 묶는 기준을 정하기 위해 자카드 유사도 사용
 * 자카드 유사도 : 두 집합 A, B 사이의 자카드 유사도 J(A, B)는 두 집합의 "교집합 크기"를 두 집합의 "합집합 크기"로 나눈 값으로 정의
 * A = [1, 2, 3], B = [2, 3, 4] 일 때
 * A ∩ B 교집합 = [2, 3] -> 2
 * A ∪ B 합집합 = [1, 2, 3, 4] -> 4
 * A, B의 자바드 유사도 = J(A, B) = 2 / 4 = 0.5
 * 만약 A, B가 모두 공집합이라면 J(A, B) = 1로 정의
 *
 * 자카드 유사도는 원소의 중복을 허용하는 다중집합에 대해 확장할 수 있다
 * 다중집합 A는 원소 1을 3개 가지고 있고 다중집합 B는 원소 1을 5개 가지고 있다면,
 * A ∩ B 교집합은 원소 1의 min(3, 5) = 3개, A ∪ B 원소 1의 max(3, 5) = 5개
 * 예를들어 다중집합 A = [1, 1, 2, 2, 3], 다중집합 B = [1, 2, 2, 4, 5]이라면,
 * A ∩ B 교집합은 [1, 2, 2] -> min(A[1, 1], B[1]), min(A[2, 2], B[2, 2])
 * A ∪ B 합집합은 [1, 1, 2, 2, 3, 4, 5] -> max(A[1, 1], B[1]), max(A[2, 2], B[2, 2])
 * 자카드 유사도 J(A, B) = 3 / 7 = 약 0.42
 *
 * [예시]
 * 문자열 A = "FRANCE", 문자열 B = "FRENCH" -> 두 글자씩 끊어서 다중집합을 만들 수 있음
 * 문자열 A = [FR, RA, AN, NC, CE], 문자열 C = [FR, RE, EN, NC, CH]
 * 교집합 = [FR, NC], 합집합 = [FR, RA, AN, NC, CE, RE, EN, CH]
 * 자카드 유사도 = J("FRANCE", "FRENCH") = 2 / 8 = 0.25
 *
 * [입력]
 * str1, str2 각 문자열 길이는 2이상 1000이하
 * 입력으로 받은 문자열은 2글자씩 끊어서 다중집합의 원소로 만든다
 * 영문자로된 글자쌍만 유효. 공백, 숫자, 특수문자가 포함돼 있다면 그 글자 쌍은 버린다
 * e.g. "ab+" -> ["ab", "b+"] -> b+는 버려서 ["ab"]
 * 다중집합 원소를 비교할 때 대소문자는 구분하지 않는다 "AB", "Ab", "ab" 모두 같은 원소로 취급
 *
 * [출력]
 * 유사도 값은 0~1 사이의 실수이므로, 이를 다루기 쉽도록 65536을 곱한 후 정수부만 반환
 */

const isAlphabet = str => /^[A-Za-z]+$/.test(str);

const makePairs = str => {
  const pairs = [];

  for (let i = 0; i < str.length; i += 1) {
    const curChar = isAlphabet(str[i]);
    const nextChar = isAlphabet(str[i + 1] ?? '');
    if (curChar && nextChar) pairs.push(str[i] + str[i + 1]);
  }

  return pairs;
};

const getIntersection = (pairA, pairB) => {
  const intersection = [];

  for (let i = 0; i < pairA.length; i += 1) {
    const foundIdx = pairB.indexOf(pairA[i]);
    if (foundIdx !== -1) intersection.push(pairB.splice(foundIdx, 1).at(0));
  }

  return intersection;
};

function solution(str1, str2) {
  const scaleValue = 65536;

  const a = str1.toUpperCase();
  const b = str2.toUpperCase();

  if (a === b) return scaleValue;

  const pairA = makePairs(a);
  const pairB = makePairs(b);

  /**
   * 교집합을 만든 후 pairB 배열에선 교집합 문자열은 빠진 상태(splice 사용했으므로)
   * 이 상태에서 pairA, pairB를 합치면 합집합이 됨
   */
  const intersection = getIntersection(pairA, pairB);
  const union = [...pairA, ...pairB];

  // parseInt는 문자열을 받아 특정 진수의 정수(소수부는 무시) 반환
  return parseInt((intersection.length / union.length) * scaleValue, 10);
}

const cases = [
  {
    input: ['FRANCE', 'french'],
    output: 16384,
  },
  {
    input: ['handshake', 'shake hands'],
    output: 65536,
  },
  {
    input: ['aa1+aa2', 'AAAA12'],
    output: 43690,
  },
  {
    input: ['E=M*C^2', 'e=m*c^2'],
    output: 65536,
  },
];

/**
 * [시뮬레이션]
 * 케이스1: 'FRANCE', 'french'
 * A = [fr, ra, an, nc, ce], B = [fr, re, en, nc, ch]
 * 교집합 = [fr, nc], 합집합 = [fr, ra, an, nc, ce, re, en, ch]
 * 유사도 = 2 / 8 = 0.25 * 65536 = 16384
 *
 * 케이스2: 'handshake', 'shake hands'
 * A = [ha, an, nd, ds, sh, ha, ak, ke]
 * B = [sh, ha, ak, ke, ha, an, nd, ds]
 * 교집합 = [ha, an, nd, ds, sh, ha, ak, ke]
 * 합집합 = [ha, an, nd, ds, sh, ha, ak, ke]
 * 유사도 = 8 / 8 = 1 * 65536 = 65536
 *
 * 케이스3: 'aa1+aa2', 'AAAA12'
 * A = [aa, aa], B = [aa, aa, aa]
 * 교집합 = [aa, aa], 합집합 = [aa, aa, aa]
 * 유사도 = 2 / 3 = 0.6666666... * 65536 = 43690
 *
 * 케이스4: 'E=M*C^2', 'e=m*c^2'
 * A = [], B = [] 둘다 공집합이므로 유사도는 1로 정의
 * 유사도 = 1 * 65536 = 65536
 */

console.log(solution(...cases[0].input));
