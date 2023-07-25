import React, { useEffect, useState } from 'react'
import { Alert, Button, Col, Container, Form, Row } from 'react-bootstrap'
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import Tesseract, { createWorker } from 'tesseract.js';
import { isImageIdIsValid, matchdata } from './function.component/matchdata.function';
import { Typeahead } from 'react-bootstrap-typeahead';
import Image from "react-bootstrap/Image";
import CroppedImage from './function.component/croppedImage.component';
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

const fileGetPath = 'https://3731-2403-6200-88a2-fcc7-ac77-b5a5-9b0d-d3ae.ngrok-free.app/files'

const MatchData = () => {

    const gradeOption = [
        { label: '1-1-1' },
        { label: '1-1-2' },
        { label: '1-1-3' },
        { label: '1-2-1' },
        { label: '1-3-1' },
    ];



    console.log("fileGetPath" + fileGetPath)

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

    const [showSearchListRow, setShowSearchListRow] = useState(false);

    const [showEmbryoDetail, setShowEmbryoDetail] = useState(false);

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
                if (res.data && res.data.length > 0) {
                    // setStatusId(true);
                    // setStatusState2Id(false);
                    setEmbryoList(res.data);
                    setShowSearchListRow(true);
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
        setShowEmbryoDetail(true);
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
        embryoDetailList?.image_name.forEach(element => {
            var dataBody = {
                imageName: element.filePath,
                grade: element.grade
            }
            matchdata(user.token, dataBody)
                .then((res: any) => {
                    setStatusId(false);
                    setStatusState2Id(true);
                    setShowEmbryoDetail(false);
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
        });

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

    const getRelativeImagePath = (fullImagePath: string) => {
        const basePath = '../test_image_set';
        return fileGetPath ? encodeURI(fullImagePath.replace(basePath, fileGetPath)) : "";
    };

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
                                                    {/* {<Image src={getRelativeImagePath(element.filePath)} rounded />} */}
                                                    <CroppedImage
                                                        src={getRelativeImagePath(element.filePath)}
                                                        width={200}
                                                        height={200}
                                                    />
                                                </Form.Group>
                                                <Form.Group className="mb-3" controlId="formBasicEmail">
                                                    <Form.Label>Grade</Form.Label>
                                                    <Form.Control name='grade' type="text" placeholder="เกรดเด้อ" value={element.grade == "None" ? '' : (element.grade ?? '')} disabled={true} onChange={e => handleChangeImageNameGrade(e, index)} required />
                                                </Form.Group>
                                                <Form.Select name='grade' aria-label="Default select example" value={element.grade == "None" ? '' : (element.grade ?? '')} onChange={e => handleChangeImageNameGrade(e, index)}>
                                                    <option value="None">เลือกเกรด</option>
                                                    <option value="1-1-1">1-1-1</option>
                                                    <option value="1-1-2">1-1-2</option>
                                                    <option value="1-1-3">1-1-3</option>
                                                    <option value="1-2-1">1-2-1</option>
                                                    <option value="1-2-2">1-2-2</option>
                                                    <option value="1-2-3">1-2-3</option>
                                                    <option value="1-3-1">1-3-1</option>
                                                    <option value="1-3-2">1-3-2</option>
                                                    <option value="1-3-3">1-3-3</option>
                                                    <option value="2-1-1">2-1-1</option>
                                                    <option value="2-1-2">2-1-2</option>
                                                    <option value="2-1-3">2-1-3</option>
                                                    <option value="2-2-1">2-2-1</option>
                                                    <option value="2-2-2">2-2-2</option>
                                                    <option value="2-2-3">2-2-3</option>
                                                    <option value="2-3-1">2-3-1</option>
                                                    <option value="2-3-2">2-3-2</option>
                                                    <option value="2-3-3">2-3-3</option>
                                                    <option value="3-1-1">3-1-1</option>
                                                    <option value="3-1-2">3-1-2</option>
                                                    <option value="3-1-3">3-1-3</option>
                                                    <option value="3-2-1">3-2-1</option>
                                                    <option value="3-2-2">3-2-2</option>
                                                    <option value="3-2-3">3-2-3</option>
                                                    <option value="3-3-1">3-3-1</option>
                                                    <option value="3-3-2">3-3-2</option>
                                                    <option value="3-3-3">3-3-3</option>
                                                    <option value="4-1-1">4-1-1</option>
                                                    <option value="4-1-2">4-1-2</option>
                                                    <option value="4-1-3">4-1-3</option>
                                                    <option value="4-2-1">4-2-1</option>
                                                    <option value="4-2-2">4-2-2</option>
                                                    <option value="4-2-3">4-2-3</option>
                                                    <option value="4-3-1">4-3-1</option>
                                                    <option value="4-3-2">4-3-2</option>
                                                    <option value="4-3-3">4-3-3</option>
                                                    <option value="Early">Early</option>
                                                    <option value="Arrested">Arrested</option>
                                                    <option value="Morula">Morula</option>
                                                    <option value="Hatched">Hatched</option>
                                                    <option value="HatchedBiopsy">HatchedBiopsy</option>
                                                </Form.Select>
                                                {/* <div>
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
                                                </div> */}

                                                {/* <Button variant="primary" type="submit" disabled={statusState2Id} onClick={matchData}>
                                                    บันทึก
                                                </Button> */}
                                            </Form>
                                        </Alert>
                                    </Col>
                                ))
                            }
                            <Row className="justify-content-center text-center">
                                <Col md="auto" sm="auto" xs="auto">
                                    <Button variant="primary" type="submit" disabled={false} onClick={matchData}>
                                        บันทึก
                                    </Button>
                                </Col>
                            </Row>



                        </Row>
                    )
                }
                <Row className="justify-content-center mt-4 text-center">
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