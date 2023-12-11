import './App.css'
import { Button } from '@douyinfe/semi-ui'
import { createFetchInstrumentation } from '@mitojs/fetch'
import { createResourceInstrumentation } from '@mitojs/performance'
import { useEffect } from 'react'
function App() {
  useEffect(() => {
    createFetchInstrumentation().subscribe((payload) => {
      if (!payload.response) {
        console.log('fetch open payload', payload)
      } else {
        console.log('fetch end payload', payload)
      }
    })
    createResourceInstrumentation().subscribe((data) => {
      console.log('resource timing', data)
    })
  }, [])
  const triggerFetch = () => {
    window
      .fetch('https://cjinhuo.github.io/', {
        method: 'get',
      })
      .then((res) => {
        res.text().then((res) => {
          // console.log('res')
        })
      })
  }
  return (
    <>
      <Button>Vite + React</Button>
      <Button onClick={triggerFetch}>trigger fetch</Button>
    </>
  )
}

export default App
