import './App.css'
import { Button } from '@douyinfe/semi-ui'
import { createFetchInstrumentation, createFetchStartInstrumentation } from '@mitojs/fetch-instrumentation'
import { useEffect } from 'react'
function App() {
  useEffect(() => {
    createFetchStartInstrumentation().subscribe((payload) => {
      console.log('fetch start payload', payload)
    })
    createFetchInstrumentation().subscribe((payload) => {
      console.log('fetch complete payload', payload)
    })
  }, [])
  const triggerFetch = () => {
    window.fetch('https://lkqtjze7.fn.bytedance.net/get_publishing_table').then((res) => {
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
