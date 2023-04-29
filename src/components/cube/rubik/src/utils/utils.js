
export function isPhone() {
  const info = navigator.userAgent;
  const reg = /mobile/ig;
  return reg.test(info);
}

export function randInt(left, right) {
  return Math.floor(Math.random() * (right - left + 1)) + left;
}


function checkMove(move, arr) { // 检测步骤合理性
  const len = arr.length;
  return move == arr[len - 1] || (move == arr[len - 2] && (move / 2 | 0) == (arr[len - 1] / 2 | 0));
}

// 参考
// 生成随机打乱步骤
export function RandomStep(steps) {
  let cubeArr = [], // 打乱步骤数组
    cubeStr = "", // 打乱步骤字符串
    step = ["R", "L", "F", "B", "U", "D"], // 步骤
    step2 = ["Rw","Dw","Fw","Rw","Dw","Fw"],
    types = ["", "", "'", "'", "2"], // 步骤附加条件
    r; // 随机数

  const maxSteps = steps || 25
  for (let i = 0; i < maxSteps; i++) {
    do {
      r = Math.random() * step.length | 0;
    } while (checkMove(r, cubeArr));
    cubeArr.push(r);

    const typesRand = Math.random() * 5 | 0;
    if (i < 21){
      cubeStr += step[r] + types[typesRand] + " ";
    } else {
      if (i === 22) {
        cubeStr += step2[r] + types[typesRand];
      } else {
        cubeStr += step2[r] + types[typesRand] + " ";
      }
    }
  }

  return cubeStr;
}