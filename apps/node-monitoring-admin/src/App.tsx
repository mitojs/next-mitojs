import './App.css'
import { Button } from '@douyinfe/semi-ui'
import { createFetchInstrumentation } from '@mitojs/fetch'
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
  }, [])
  const triggerFetch = () => {
    window
      .fetch('https://generator3.swagger.io/openapi.json', {
        method: 'get',
      })
      .then((res) => {
        res.json().then((res) => {
          console.log('res', res)
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
