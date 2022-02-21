import React, { useContext } from 'react'
import { Navigate } from 'react-router-dom'
import AuthContext from '../context/auth-context'
 
export default function PrivateRoute({path, children }){
    const value = useContext(AuthContext)
    if(value.token && ( path === 'login' || 'signup')) return <Navigate replace to="/events" />
    else
    return (!value.token) ? <Navigate replace to="/login" /> :  children ;
}
