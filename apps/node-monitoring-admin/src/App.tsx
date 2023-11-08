import './App.css'
import { browserAdd } from '@mitojs/browser'
import { Button } from '@douyinfe/semi-ui'

function App() {
  console.log(browserAdd(1, 2))
  return (
    <>
      <Button>Vite + React</Button>
    </>
  )
}

export default App
