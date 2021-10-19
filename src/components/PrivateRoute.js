import React from 'react'
import { Redirect, Route } from 'react-router-dom'

export default function PrivateRoute({ path, component }) {
    if (!localStorage.getItem("token")) return <Redirect to="/login" />
    else
    return <Route path={path} component={component} />;
}