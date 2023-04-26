
export function isPhone() {
  const info = navigator.userAgent;
  const reg = /mobile/ig;
  return reg.test(info);
}
