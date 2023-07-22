import React, { useEffect, useState } from 'react'
import { Alert, Button, Col, Container, Form, Row } from 'react-bootstrap'
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import Tesseract, { createWorker } from 'tesseract.js';
import { isImageIdIsValid, matchdata } from './function.component/matchdata.function';
import { Typeahead } from 'react-bootstrap-typeahead';
interface ImageData {
    filePath: string;
    grade: string | null;
}

interface DataItem {
    professor: string;
    year: string;
    patient_name: string;
    image_name: ImageData[];
}



const MatchData = () => {

    const gradeOption = [
        { label:'1-1-1' },
        { label:'1-1-2' },
        { label:'1-1-3' },
        { label:'1-2-1' },
        { label:'1-3-1' },
    ];

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

    const [showSearchListRow, setShowSearchListRow] = useState(true);

    const [showEmbryoDetail, setShowEmbryoDetail] = useState(true);

    const [embryoList, setEmbryoList] = useState<DataItem[]>([]);

    const [embryoDetailList, setEmbryoDetailList] = useState<DataItem>();

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
                if (res.data) {
                    // setStatusId(true);
                    // setStatusState2Id(false);
                    setEmbryoList(res.data);
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
                    toast.error('ไม่พบชื่อนี้ !', {
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

    const [selectedDropDownOption, setSelectedDropDownOption] = useState<any[]>([]);

    const handleDropDownChange = (selected: any[]) => {
        setSelectedDropDownOption(selected);
    };

    const getEmbryoDetail = (e: any, data: any) => {
        e.preventDefault();
        setEmbryoDetailList(data);
        setShowSearchListRow(false);
    }

    const handleChangeImageNameGrade = (
        e: any,
        index: number
    ) => {
        const { value } = e.target;
        setEmbryoDetailList((prevState: any) => {
            if (!prevState) return null;
            const updatedImageName = prevState.image_name.map((image: any, i: number) =>
                i === index ? { ...image, grade: value } : image
            );
            return { ...prevState, image_name: updatedImageName };
        });
        console.log(embryoDetailList);
    };

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

    const getExtension = (filename: any) => {
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
                                    <Form.Label>ชื่อของผู้รับการรักษา</Form.Label>
                                    <Form.Control name='imageId' value={textBoxValue.imageId} type="text" placeholder="กรอกชื่อ" disabled={statusId} onChange={handleChangeImageId} />
                                </Form.Group>

                                <Button variant="primary" type="submit" disabled={statusId} onClick={checkImageIdIsValid}>
                                    ตรวจสอบ
                                </Button>
                            </Form>
                        </Alert>
                    </Col>
                </Row>
                {
                    showSearchListRow && (
                        <Row className="justify-content-center text-center">
                            {
                                embryoList.map((element, index) => (
                                    <Col md="auto" sm="auto" xs="auto">
                                        <Alert key={"success"} variant={"success"}>
                                            <Form >
                                                <Form.Group className="mb-3" controlId="formBasicEmail">
                                                    <Form.Label>ชื่อของผู้รับการรักษา</Form.Label>
                                                    <Form.Control value={element.patient_name} type="text" placeholder="ชื่ออาจารย์" disabled={true} />
                                                </Form.Group>
                                                <Form.Group className="mb-3" controlId="formBasicEmail">
                                                    <Form.Label>ชื่ออาจารย์</Form.Label>
                                                    <Form.Control value={element.professor} type="text" placeholder="ชื่ออาจารย์" disabled={true} />
                                                </Form.Group>
                                                <Form.Group className="mb-3" controlId="formBasicEmail">
                                                    <Form.Label>ปีของเคส</Form.Label>
                                                    <Form.Control value={element.year} type="text" placeholder="ชื่ออาจารย์" disabled={true} />
                                                </Form.Group>

                                                <Button variant="primary" type="submit" disabled={statusId} onClick={(e) => getEmbryoDetail(e, element)}>
                                                    เลือกเคสนี้ !
                                                </Button>
                                            </Form>
                                        </Alert>
                                    </Col>
                                )

                                )
                            }
                        </Row>
                    )
                }
                {
                    showEmbryoDetail && (
                        <Row className="justify-content-center text-center">
                            <Col md="12" sm="12" xs="12">
                                <Row className="justify-content-center text-center">
                                    <Col md="3" sm="auto" xs="auto">
                                        <Alert key={"success"} variant={"success"}>
                                            <Form>
                                                <Form.Group className="mb-3" controlId="formBasicEmail">
                                                    <Form.Label>ชื่อของผู้รับการรักษา</Form.Label>
                                                    <Form.Control value={embryoDetailList?.patient_name} type="text" placeholder="ชื่ออาจารย์" disabled={true} />
                                                </Form.Group>
                                                <Form.Group className="mb-3" controlId="formBasicEmail">
                                                    <Form.Label>ชื่ออาจารย์</Form.Label>
                                                    <Form.Control value={embryoDetailList?.professor} type="text" placeholder="ชื่ออาจารย์" disabled={true} />
                                                </Form.Group>
                                                <Form.Group className="mb-3" controlId="formBasicEmail">
                                                    <Form.Label>ปีของเคส</Form.Label>
                                                    <Form.Control value={embryoDetailList?.year} type="text" placeholder="ชื่ออาจารย์" disabled={true} />
                                                </Form.Group>

                                            </Form>
                                        </Alert>
                                    </Col>
                                </Row>
                            </Col>
                            {
                                embryoDetailList?.image_name.map((element, index) => (
                                    <Col md="auto" sm="auto" xs="auto">
                                        <Alert key={"success"} variant={"success"}>
                                            <Form>
                                                <Form.Group className="mb-3" controlId="formBasicEmail">
                                                    <Form.Label>ชื่อของรูปใน Folder <br></br></Form.Label>
                                                    <Form.Control name='imageName' type="string" placeholder="ชื่อ" value={element.filePath} disabled={statusState2Id} onChange={handleChangeImageId} required />
                                                </Form.Group>
                                                <Form.Group className="mb-3" controlId="formBasicEmail">
                                                    <Form.Label>Grade</Form.Label>
                                                    <Form.Control name='grade' type="text" placeholder="เกรดเด้อ" value={element.grade == "None" ? '' : (element.grade ?? '')} disabled={false} onChange={e => handleChangeImageNameGrade(e, index)} required />
                                                </Form.Group>

                                                <div>
                                                    {/* <h3>Searchable Select</h3> */}
                                                    <Typeahead
                                                        id="searchable-select"
                                                        
                                                        options={gradeOption}
                                                        onChange={e => handleChangeImageNameGrade(e, index)}
                                                        selected={element.grade ? [{ label: element.grade }] : []}
                                                        labelKey="label"
                                                        placeholder="Select an option..."
                                                    />
                                                    {selectedDropDownOption.length > 0 && (
                                                        <div>
                                                            <p>Selected Option: {selectedDropDownOption[0].label}</p>
                                                        </div>
                                                    )}
                                                </div>

                                                {/* <Button variant="primary" type="submit" disabled={statusState2Id} onClick={matchData}>
                                                    บันทึก
                                                </Button> */}
                                            </Form>
                                        </Alert>
                                    </Col>
                                ))
                            }

                        </Row>
                    )
                }
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