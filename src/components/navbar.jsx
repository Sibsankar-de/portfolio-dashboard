import React, { useEffect, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import axios from '../utils/axios-instance'


export const Navbar = () => {
    const navigate = useNavigate()
    const [user, setUser] = useState(null)
    useEffect(() => {
        const fetchUser = async () => {
            try {
                axios.get('/user/current-user')
                    .then(res => setUser(res.data?.data))
            } catch (error) {
                console.log(error);
            }
        }
        fetchUser()
    }, [])
    const location = useLocation()
    return (
        <header className='sp-nav-header'>
            <nav className='sp-navbar'>
                <div className='sp-nav-logo-box'>
                    <div>
                        <img src={user?.avatar || require('../assets/img/profile-img.png')} alt="" draggable={false} />
                    </div>
                    <div>{user?.fullName}</div>
                </div>
                <div className='sp-nav-btn-box'>
                    <button className='sp-btn sp-btn-gl' onClick={() => navigate('/update-resume')}>
                        <span><i className="bi bi-file-earmark fs-4"></i></span> <span>Update resume</span>
                    </button>
                    <button className='sp-btn sp-btn-vl' onClick={() => navigate('/create-project')}>
                        <span><i className="bi bi-plus fs-4"></i></span> <span>Create Project</span>
                    </button>
                </div>
            </nav>
        </header>
    )
}
