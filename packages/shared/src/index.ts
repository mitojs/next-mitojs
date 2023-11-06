import { Subject } from 'rxjs'
import { add } from './dom'
const subject = new Subject()

console.log(add(1, 2))
subject.subscribe(() => {})

export { add }
