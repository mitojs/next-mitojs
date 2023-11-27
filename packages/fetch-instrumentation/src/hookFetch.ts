export function hookFetch(callback: (data: any) => void, isSkipWithUrl: (url: string) => boolean = () => false) {
  // todo 在劫持的一行判断有没有订阅者，如果没有则直接执行 original 函数
  // 传入 callback 拿到参数后调用 .next
  const url = ''
  if (isSkipWithUrl(url)) return
}
