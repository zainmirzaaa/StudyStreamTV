import {getRecommendations} from '../API/backendAPI.js';
import { useUser } from '../Context/UserContext';
import { useAuth } from '../Context/AuthContext';
import { Key, useEffect, useState } from 'react';
import {getUsername} from '../API/Firestore.js';
import { useNavigate } from 'react-router-dom';

 
export const Recommendation: React.FC = () => {



    const { user: authUser } = useAuth(); // Access auth context
    const [authUsername, setAuthUsername] = useState<string>('no');
    const navigate = useNavigate();


    useEffect(() => {
        const fetchUsername = async () => {
        if (authUser?.email) {
            try {
            const fetchedUsername = await getUsername(authUser.email); // Resolve the Promise
            setAuthUsername(fetchedUsername); // Update state with resolved value
            } catch (error) {
            console.error('Error fetching username:', error);
            }
        }
        };

        fetchUsername(); // Call the function on component mount
    }, [authUser]);  


    const recommendations = getRecommendations(authUsername)

    return (
        <div>
            <h2>Recommended for You</h2>
            <ul>
                {recommendations.map((rec: { username: any; }, index: Key | null | undefined) => (
                    <li key={index} onClick={() => navigate(`/${rec.username || rec}`)} style={{ cursor: "pointer", color: "blue" }}>
                        {rec.username || rec}
                    </li>
                ))}
            </ul>
        </div>
    );
}