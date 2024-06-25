import { useState } from "react"
import axios from "../utils/axios-instance"
import Cookies from "js-cookie"
import { useNavigate } from "react-router-dom"
import { Spinner } from "../utils/loading-spinner"


export const LoginUser = () => {
    const navigate = useNavigate()
    const [logInput, setLogInput] = useState({ email: '', password: '' })
    const [error, setError] = useState(false)
    const [loading, setLoading] = useState(false)

    const handleLogin = async () => {
        if (logInput.email && logInput.password) {
            const postData = {
                email: logInput.email,
                password: logInput.password
            }
            try {
                setLoading(true)
                await axios.post('/user/login-user', postData)
                    .then(res => {
                        Cookies.set('_access_token', res?.data?.data)
                        console.log(res?.data?.data);
                        setLoading(false)
                        navigate('/')
                        window.location.reload()
                    })
            } catch (error) {
                setLoading(false)
                setError(true)
            }
        }
    }

    return (
        <div className="container sp-login-page-container">
            <div className="sp-login-box">
                <div className="text-center">
                    <h5>Log in to your Account</h5>
                </div>
                <div>
                    <div className="mb-4">
                        <div className="mb-1">email</div>
                        <input type="email" className="form-control" placeholder="Enter Email" onChange={e => setLogInput({ ...logInput, email: e.target.value })} />
                    </div>
                    <div className="mb-3">
                        <div className="mb-1">password</div>
                        <input type="password" className="form-control" placeholder="Enter password" onChange={e => setLogInput({ ...logInput, password: e.target.value })} />
                    </div>
                    {error && <div className="text-danger"><p>Unable to login</p></div>}
                </div>
                <div className="justify-self-end">
                    <button className="sp-btn sp-btn-vl" onClick={handleLogin}>{loading && <Spinner />}<span>Login</span></button>
                </div>
            </div>
        </div>
    )
}