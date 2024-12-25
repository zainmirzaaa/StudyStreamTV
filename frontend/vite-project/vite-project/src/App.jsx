import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'

function App() {
  const [count, setCount] = useState(0)


  return (
    <>
        <div className='pos'>
            <a>
              Stream Chat       
            </a>      

            <div class="rectangle"> 

            <div class="readMessageBox">

              <a>
                read a message
              </a>
              
            </div>   
            
            <div class="sendMessageBox">
              <a>
                send a message
              </a>
            
              </div>   
            </div>
        </div>   

    </>
  )
}

export default App
