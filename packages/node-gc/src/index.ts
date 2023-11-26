import { add } from '@mitojs/node-memory'
import EventEmitter from 'node:events'

const event = new EventEmitter()

const res = event.on('test', () => {})
event.setMaxListeners(100)
add(1, 2)
