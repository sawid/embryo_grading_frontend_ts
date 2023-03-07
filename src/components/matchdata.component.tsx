import React from 'react'
import { Button } from 'react-bootstrap'
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { useRecoilValue, useResetRecoilState } from 'recoil'

const MatchData = () => {

    const { user } = useSelector((state: any) => ({ ...state }));
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const logout = () => {
        dispatch({
            type: 'LOGOUT',
            payload: null,
        });

        navigate('/');

    }

    return (
        <div><Button variant="primary" onClick={logout}>Primary</Button>{user.token}</div>
    )
}

export default MatchData