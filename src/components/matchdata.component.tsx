import React, { useEffect, useState } from 'react'
import { Alert, Button, Col, Container, Form, Row } from 'react-bootstrap'
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import Tesseract, { createWorker } from 'tesseract.js';
import { isImageIdIsValid, matchdata } from './function.component/matchdata.function';

const MatchData = () => {

    const { user } = useSelector((state: any) => ({ ...state }));
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const worker = createWorker({
        logger: (m) => {
            //   console.log(m);
        },
    });

    const [statusId, setStatusId] = useState(false);

    const [statusState2Id, setStatusState2Id] = useState(true);

    const [textBoxValue, setTextBoxValue] = useState({
        imageId: "",
        imageName: "",
        grade: "",
    });

    const [imagePath, setImagePath] = useState<any>('');

    const [ocr, setOcr] = useState("");

    const handleChangeImageId = (e: any) => {
        if (e.target.name === "grade" && e.target.value.length > 3) {
            return
        }
        setTextBoxValue({ ...textBoxValue, [e.target.name]: e.target.value });
        console.log(textBoxValue)
    };

    const logout = () => {
        dispatch({
            type: 'LOGOUT',
            payload: null,
        });
        toast.success('ออกจากระบบเรียบร้อย !', {
            position: "top-right",
            autoClose: 1000,
            hideProgressBar: false,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
        });
        navigate('/');

    }

    const checkImageIdIsValid = (e: any) => {
        e.preventDefault();
        isImageIdIsValid(user.token, textBoxValue.imageId)
            .then((res: any) => {
                console.log(res.data)
                if (res.data == true) {
                    setStatusId(true);
                    setStatusState2Id(false);
                    toast.success('ค้นหาสำเร็จ !', {
                        position: "top-right",
                        autoClose: 1000,
                        hideProgressBar: false,
                        pauseOnHover: true,
                        draggable: true,
                        progress: undefined,
                    });
                }
                else {
                    setTextBoxValue(prevState => ({ ...prevState, imageId: "" }))
                    toast.error('ไม่มีไอดีนี้ !', {
                        position: "top-right",
                        autoClose: 1000,
                        hideProgressBar: false,
                        pauseOnHover: true,
                        draggable: true,
                        progress: undefined,
                    });
                }
                console.log(statusId);
            })
            .catch((err: any) => {
                console.log(err.data)
            })
    }

    const matchData = (e: any) => {
        e.preventDefault();
        matchdata(user.token, textBoxValue)
            .then((res: any) => {
                setStatusId(false);
                setStatusState2Id(true);
                setTextBoxValue({
                    imageId: "",
                    imageName: "",
                    grade: "",
                })
                toast.success('บันทึกสำเร็จ !', {
                    position: "top-right",
                    autoClose: 1000,
                    hideProgressBar: false,
                    pauseOnHover: true,
                    draggable: true,
                    progress: undefined,
                });
            })
            .catch((err: any) => {
                toast.error('ไม่สำเร็จ !', {
                    position: "top-right",
                    autoClose: 1000,
                    hideProgressBar: false,
                    pauseOnHover: true,
                    draggable: true,
                    progress: undefined,
                });
            })
    }

    const handleChangeImageIdUploadOCR = async (e: any) => {
        const file = e.target.files[0];
        if (!file) return;
        console.log(getExtension(file.name))
        if (getExtension(file.name) === "heic") {
            file.name.replace(/HEIC/g, 'jpg')
        }
        const reader = new FileReader();
        reader.onloadend = () => {
            const imageDataUri = reader.result;
            console.log({ imageDataUri });
            setImagePath(imageDataUri);
        };
        reader.readAsDataURL(file);
    }

    useEffect(() => {
        convertImageToText();
    }, [imagePath]);

    const convertImageToText = async () => {
        if (!imagePath) return;
        await (await worker).load();
        await (await worker).loadLanguage("eng");
        await (await worker).initialize("eng");
        await (await worker).setParameters({
            tessedit_char_whitelist: '0123456789',
            preserve_interword_spaces: '0',
        });
        setTextBoxValue(prevState => ({ ...prevState, imageId: "กำลังประมวลผล" }))
        setStatusId(true)
        const {
            data: { text },
        } = await (await worker).recognize(imagePath);
        setTextBoxValue(prevState => ({ ...prevState, imageId: text }))
        setImagePath("")
        setStatusId(false)
    };

    const getExtension = (filename:any) => {
        return filename.split('.').pop()
    }

    return (
        <div>
            <Container fluid className='p-5'>
                <Row className="justify-content-center text-center">
                    <Col md="auto" sm="auto" xs="auto">
                        {/* <h1>link physical and image file</h1> */}
                    </Col>
                </Row>
                <Row className="justify-content-center text-center">
                    <Col md="auto" sm="auto" xs="auto">
                        <Alert key={"success"} variant={"success"}>
                            <Form >
                                <Form.Group className="mb-3" controlId="formBasicEmail">
                                    <Form.Label>รหัสของรูป (Case ID) ทดลอง  21435643 {ocr}</Form.Label>
                                    <Form.Control name='imageId' value={textBoxValue.imageId} type="text" placeholder="รหัส" disabled={statusId} onChange={handleChangeImageId} />
                                </Form.Group>
                                <Form.Group className="mb-3" controlId="formBasicEmail">
                                    <Form.Control type="file" accept='.jpg,.png' onChange={handleChangeImageIdUploadOCR} />
                                </Form.Group>

                                <Button variant="primary" type="submit" disabled={statusId} onClick={checkImageIdIsValid}>
                                    ตรวจสอบ
                                </Button>
                            </Form>
                        </Alert>
                    </Col>
                </Row>
                <Row className="justify-content-center text-center">
                    <Col md="auto" sm="auto" xs="auto">
                        <Alert key={"success"} variant={"success"}>
                            <Form >
                                <Form.Group className="mb-3" controlId="formBasicEmail">
                                    <Form.Label>ชื่อของรูปใน Folder <br></br> ตามด้วยนามสกุลไฟล์ (เช่น day5.jpg) ตัวเล็ก-ใหญ่สำคัญ​ !!!</Form.Label>
                                    <Form.Control name='imageName' type="string" placeholder="ชื่อ" value={textBoxValue.imageName} disabled={statusState2Id} onChange={handleChangeImageId} required />
                                </Form.Group>
                                <Form.Group className="mb-3" controlId="formBasicEmail">
                                    <Form.Label>Grade</Form.Label>
                                    <Form.Control name='grade' type="number" placeholder="เกรดเด้อ" value={textBoxValue.grade} maxLength={3} disabled={statusState2Id} onChange={handleChangeImageId} required />
                                </Form.Group>

                                <Button variant="primary" type="submit" disabled={statusState2Id} onClick={matchData}>
                                    บันทึก
                                </Button>
                            </Form>
                        </Alert>
                    </Col>
                </Row>
                <Row className="justify-content-center text-center">
                    <Col md="auto" sm="auto" xs="auto">
                        <Button variant="primary" onClick={logout}>Logout</Button>
                    </Col>
                </Row>
                {/* <input type="file" accept="image/*" capture="environment"></input> */}
            </Container>
            {/* <Button variant="primary" onClick={logout}>Primary</Button>{user.token} */}
        </div>
    )
}

export default MatchData