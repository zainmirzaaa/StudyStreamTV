import axios from 'axios'



export function addToMongoDB(username, email){
    axios.post('http://127.0.0.1:8000/',{
        email: email,
        username: username
    })
    console.log("posted")
}