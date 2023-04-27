
export function isPhone() {
  const info = navigator.userAgent;
  const reg = /mobile/ig;
  return reg.test(info);
}

export function randInt(left, right) {
  return Math.floor(Math.random() * (right - left + 1)) + left;
}


function checkMove(move, arr) { // 检测步骤合理性
  var l = arr.length;
  return move == arr[l - 1] || (move == arr[l - 2] && (move / 2 | 0) == (arr[l - 1] / 2 | 0));
}

// 参考
// 生成随机打乱步骤
export function RandomStep(maxSteps) {
  let cubeArr = [], // 打乱步骤数组
    cubeStr = "", // 打乱步骤字符串
    cube = ["R", "L", "F", "B", "U", "D"], // 步骤
    types = ["", "", "'", "'", "2"], // 步骤附加条件
    r, // 随机数
    i;

  maxSteps = maxSteps || 25

  for (i = 0; i < maxSteps; i++) {
    do {
      r = Math.random() * 6 | 0;
    } while (checkMove(r, cubeArr));
    cubeArr.push(r);
    cubeStr += cube[r] + types[Math.random() * 5 | 0] + " ";
  }

  return cubeStr;
}