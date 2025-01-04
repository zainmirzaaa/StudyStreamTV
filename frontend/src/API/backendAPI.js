import axios from 'axios'



export function addToMongoDB(username, email){
    axios.post('http://127.0.0.1:8000/',{
        email: email,
        username: username
    })
    console.log("posted")
}

export function addLiveUser(username, category, description){

    axios.post('http://127.0.0.1:8000/liveUser',{
        username: username,
        category: category,
        description: description,
    })
    console.log("added live user")
}

export function removeLiveUser(username, category, description){
    
    axios.put('http://127.0.0.1:8000/liveUser',{
        username: username,
        category: category,
        description: description,
    })
    console.log("removed live user")
}