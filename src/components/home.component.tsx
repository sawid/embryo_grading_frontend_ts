import React, { useState } from 'react'
import { Card, Col, Container, Row } from 'react-bootstrap'
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import { useRecoilState, useRecoilValue } from 'recoil';
import { login } from './function.component/authen.function';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';

const Home = () => {

    const navigate = useNavigate();

    const dispatch = useDispatch()


    const [value, setValue] = useState({
        username: "",
        password: "",
    });

    const handleChange = (e: any) => {
        setValue({ ...value, [e.target.name]: e.target.value });
        console.log(value)
    };

    const handleSubmit = (e: any) => {
        e.preventDefault();
        console.log("hello")
        
        login(value)
        .then((res:any) => {
            console.log(res.data)
            dispatch({
                type:'LOGIN',
                payload: {
                  token: res.data,
                  username: "ผู้ใช้ 1",
                }
              });
            localStorage.setItem("token", res.data);
            navigate('/matchdata');
        })
        .catch((err:any) => {
            console.log(err.response.data);
        });
    }

    return (
        <Container fluid className='p-5'>
            <Row className="justify-content-center ">
                <Col md="auto" sm="auto" xs="auto"><h1>ระบบเพิ่มข้อมูล 🔬</h1></Col>
            </Row>
            <Row className="justify-content-center ">
                <Col md="auto" sm="auto" xs="auto">
                    <Card className='p-3 mt-4' style={{ width: '100%' }}>
                        <Card.Body>
                            <Card.Title>เข้าสู่ระบบ</Card.Title>
                            <Card.Text>
                                <Form onSubmit={handleSubmit}>
                                    <Form.Group className="mb-3" controlId="formBasicEmail">
                                        <Form.Label>Username</Form.Label>
                                        <Form.Control name='username' type="string" placeholder="Username"  onChange={handleChange}/>
                                    </Form.Group>

                                    <Form.Group className="mb-3" controlId="formBasicPassword">
                                        <Form.Label>รหัสผ่าน</Form.Label>
                                        <Form.Control name='password' type="password" placeholder="รหัสผ่าน"  onChange={handleChange}/>
                                    </Form.Group>

                                    <Button variant="primary" type="submit">
                                        เข้าสู่ระบบ
                                    </Button>
                                </Form>
                            </Card.Text>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>
        </Container>
    )
}

export default Home