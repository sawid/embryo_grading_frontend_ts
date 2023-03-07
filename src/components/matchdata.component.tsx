import React from 'react'
import { Button, Col, Container, Row } from 'react-bootstrap'
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
        <div>
            <Container fluid className='p-5'>
                <Row className="justify-content-center text-center">
                    <Col md="auto" sm="auto" xs="auto">
                        <h1>เริ่มโดยการกดที่ปุ่มถ่ายภาพ 📷</h1>
                    </Col>
                </Row>
                <input type="file" accept="image/*" capture="environment"></input>
            </Container>
            {/* <Button variant="primary" onClick={logout}>Primary</Button>{user.token} */}
        </div>
    )
}

export default MatchData