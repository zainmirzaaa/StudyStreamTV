import axios from 'axios'



export async function addToMongoDB(username, email) {
    try {
        const response = await axios.post('http://127.0.0.1:8000/', {
            email: email,
            username: username
        });
        
        console.log("Data posted successfully:", response.data);  // Log the response from the server

        // Return the response data if you want to use it elsewhere in your app
        return response.data;
    } catch (error) {
        console.error("Error posting data:", error.response || error.message);  // Log the error
        throw error;  // Rethrow or handle the error appropriately
    }
}

export async function getOnSignIn(username) {
    try {
        const response = await axios.get('http://127.0.0.1:8000/', {
            params: { username }  
        });
        console.log(response.data)
        return response.data;  
    } catch (error) {
        console.error('Error fetching data:', error);
        throw error; 
    }
}


export function addLiveUser(username, category, description){

    axios.put('http://127.0.0.1:8000/liveUser',{
        username: username,
        category: category,
        description: description,
    })
    console.log("added live user")
}


export function removeLiveUser(username, category, description){
    
    axios.put('http://127.0.0.1:8000/liveUser',{
        userFollower: userFollower,
        userFollowing: userFollowing,
    })
    console.log("added follower and following")
}

export function addFollowing(userFollower, userFollowing){
    console.log(userFollower)
    console.log(userFollowing)
    axios.put('http://127.0.0.1:8000/followers',{
        userFollower: userFollower,
        userFollowing: userFollowing,
    })
    console.log("added follower and following")
}

export function removeFollowing(userFollower, userFollowing){
    // userFollower is following userFollowing
    axios.post('http://127.0.0.1:8000/followers',{
        userFollower: userFollower,
        userFollowing: userFollowing,
    })
    console.log("removed follower and following")
}

export function updateDescriptionAndLinks(username, description, links){
    axios.post('http://127.0.0.1:8000/userData',{
        username: username,
        description: description,
        links: links,
    })
}