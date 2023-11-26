function hookFetch(callback: (data: any) => void, hasSubscriberFn = () => true) {}

// 传入 callback 拿到参数后调用 .next

// todo 在劫持的一行判断有没有订阅者，如果没有则直接执行 original 函数

//
