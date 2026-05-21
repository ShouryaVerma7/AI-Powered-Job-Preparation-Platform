import React, { useState } from 'react'
import { useNavigate, Link } from 'react-router'
import "../auth.form.scss"
import { useAuth } from '../hooks/useAuth'

const Register = () => {
    const navigate = useNavigate()
    const [username, setUsername] = useState("")
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [localError, setLocalError] = useState("")

    const { loading, handleRegister } = useAuth()

    const handleSubmit = async (e) => {
        e.preventDefault()
        setLocalError("")
        try {
            await handleRegister({ username, email, password })
            navigate("/home")
        } catch (err) {
            setLocalError(err.response?.data?.message || "Registration failed. Please try again.")
        }
    }

    if (loading) {
        return (
            <main className='auth-loading'>
                <div className='auth-spinner' />
            </main>
        )
    }

    return (
        <main>
            <div className="form-container">
                <div className="form-brand">
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M12 2l2.4 7.4H22l-6.2 4.5 2.4 7.4L12 17l-6.2 4.3 2.4-7.4L2 9.4h7.6z" />
                    </svg>
                    InterviewAI
                </div>
                <h1>Create account</h1>
                <p className='form-subtitle'>Get your personalized interview strategy</p>

                {localError && (
                    <div className="error-message">{localError}</div>
                )}

                <form onSubmit={handleSubmit}>
                    <div className="input-group">
                        <label htmlFor="username">Username</label>
                        <input
                            onChange={(e) => setUsername(e.target.value)}
                            type="text" id="username" name='username' placeholder='Choose a username'
                            value={username}
                            required
                        />
                    </div>
                    <div className="input-group">
                        <label htmlFor="email">Email</label>
                        <input
                            onChange={(e) => setEmail(e.target.value)}
                            type="email" id="email" name='email' placeholder='Enter email address'
                            value={email}
                            required
                        />
                    </div>
                    <div className="input-group">
                        <label htmlFor="password">Password</label>
                        <input
                            onChange={(e) => setPassword(e.target.value)}
                            type="password" id="password" name='password' placeholder='Create a password'
                            value={password}
                            required
                            minLength={6}
                        />
                    </div>
                    <button className='button primary-button' type="submit">Create Account</button>
                </form>
                <p className='form-footer'>Already have an account? <Link to={"/login"}>Sign in</Link></p>
            </div>
        </main>
    )
}

export default Register
