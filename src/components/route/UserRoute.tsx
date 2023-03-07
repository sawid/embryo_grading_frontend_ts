import React from 'react'
import { useSelector } from 'react-redux'
import LoadingToRedirect from './RedirectToHome'

const UserRoute = ({ children }: any) => {
    const { user } = useSelector((state:any) => ({...state}))
    console.log('userRoute', children)

    return user && user.token
        ? children
        : <LoadingToRedirect />
}

export default UserRoute