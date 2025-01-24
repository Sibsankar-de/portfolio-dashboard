import React, { useEffect, useRef, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import buttonData from "../json/buttonList.json"
import axios from '../utils/axios-instance'
import Swal from 'sweetalert2'
import { Spinner } from '../utils/loading-spinner'

export const CreateProjectPage = () => {
    const navigate = useNavigate()
    const [projectData, setProjectData] = useState(null)
    const [loading, setLoading] = useState(false)
    const submitProjectHandler = async () => {
        if (projectData && projectData.title && projectData.description) {
            setLoading(true)
            let imgUrlList = []
            // upload files and get a list of urls
            const totalFiles = projectData.imageList?.length
            if (projectData.imageList) {
                for (let i = 0; i < totalFiles; i++) {
                    const formData = new FormData()
                    formData.append('image', projectData?.imageList[i])
                    try {
                        await axios.post('/project/project-image', formData, {
                            headers: {
                                "Content-Type": "multipart/form-data"
                            }
                        })
                            .then(res => {
                                imgUrlList.push({ imageUrl: res?.data?.data })
                            })
                    } catch (error) {
                        console.log(error);
                    }
                }
            }

            // Upload data to server
            const postData = {
                ...projectData,
                imageList: imgUrlList
            }

            try {
                await axios.post('/project/create-project', postData)
                    .then(res => {
                        setLoading(false)
                        Swal.fire({
                            title: "Project Created Successfully",
                            text: "Go back to home",
                            icon: "success",
                            confirmButtonText: "Go to Home",
                            showCloseButton: true
                        }).then(result => {
                            if (result.isConfirmed) {
                                navigate('/')
                            }
                        })
                    })
            } catch (error) {
                setLoading(false)
                Swal.fire({
                    title: "Error to Create project",
                    icon: "error"
                })
            }
        }
    }

    return (
        <div className='container'>
            <section className='mb-5 text-center'>
                <div><h4>Create new project</h4></div>
            </section>
            <ProjectAditionBox onChangeData={data => setProjectData(data)} />
            <section className='my-3 d-flex justify-content-end gap-3'>
                <div><button className='sp-btn sp-btn-lt' onClick={() => navigate('/')} >Back to home</button></div>
                <div><button className='sp-btn sp-btn-vl' onClick={submitProjectHandler} >{loading && <Spinner />}<span>Create Project</span></button></div>
            </section>
            <section className='my-4 text-center'>
                <div>All rights are reserved &copy;SDportfolio 2024</div>
            </section>
        </div>
    )
}

export const EditProject = () => {
    const navigate = useNavigate()

    // Get editing data
    const params = useParams()
    const projectId = params.projectId
    const [projectData, setProjectData] = useState(null);
    useEffect(() => {
        const fetchData = async () => {
            try {
                axios.get(`/project/get-project/${projectId}`)
                    .then(res => setProjectData(res.data?.data))
            } catch (error) {
                console.log(error);
            }
        }
        fetchData()
    }, [])
    //submit handler
    const [editedData, setEditedData] = useState(null)
    const [loading, setLoading] = useState(null)
    const submitProjectHandler = async () => {
        if (editedData && editedData.title && editedData.description) {
            setLoading(true)
            let imgUrlList = []

            // upload files and get a list of urls
            const totalFiles = editedData.imageList?.length
            if (editedData.imageList) {
                for (let i = 0; i < totalFiles; i++) {
                    if (editedData.imageList[i] instanceof File) {
                        const formData = new FormData()
                        formData.append('image', editedData?.imageList[i])
                        try {
                            await axios.post('/project/project-image', formData, {
                                headers: {
                                    "Content-Type": "multipart/form-data"
                                }
                            })
                                .then(res => {
                                    imgUrlList.push({ imageUrl: res?.data?.data })
                                })
                        } catch (error) {
                            console.log(error);
                        }
                    }
                    else {
                        imgUrlList.push(editedData.imageList[i])
                    }
                }
            }

            // Upload data to server
            const postData = {
                projectId: projectId,
                ...editedData,
                imageList: imgUrlList
            }

            try {
                await axios.patch('/project/update-project', postData)
                    .then(res => {
                        setLoading(false)
                        Swal.fire({
                            title: "Changes saved",
                            text: "Go back to home",
                            icon: "success",
                            confirmButtonText: "Go to Home",
                            showCloseButton: true
                        }).then(result => {
                            if (result.isConfirmed) {
                                navigate('/')
                            }
                        })
                    })
            } catch (error) {
                setLoading(false)
                Swal.fire({
                    title: "Error to save changes",
                    icon: "error"
                })
            }
        }
    }

    const [activeState, setActiveState] = useState(true)
    useEffect(() => {
        setActiveState(projectData?.active)
    }, [projectData])

    const deactiveBtnHandler = async () => {
        if (activeState) {
            Swal.fire({
                title: "Do you want to deactive this project?",
                text: "This action will dactivate your project. You can active it any time",
                icon: "warning",
                showCancelButton: true,
                confirmButtonText: "deactive project",
                confirmButtonColor: "#dc3545",
            }).then(async (result) => {
                if (result.isConfirmed) {
                    try {
                        const postData = {
                            projectId,
                            activeState: false
                        }
                        await axios.patch('/project/update-state', postData)
                            .then(res => {
                                Swal.fire({
                                    title: "Project dactivated",
                                    icon: "success"
                                })
                                setActiveState(false)
                            })
                    } catch (error) {
                        Swal.fire({
                            title: "Unable to deactive this project",
                            icon: "error"
                        })
                    }
                }
            })
        }
        else {
            try {
                const postData = {
                    projectId,
                    activeState: true
                }
                await axios.patch('/project/update-state', postData)
                    .then(res => {
                        Swal.fire({
                            title: "Project activated",
                            icon: "success"
                        })
                        setActiveState(true)
                    })
            } catch (error) {
                Swal.fire({
                    title: "Unable to active this project",
                    icon: "error"
                })
            }
        }
    }
    return (
        <div className='container'>
            <section className='mb-5 text-center'>
                <div><h4>Edit Project</h4></div>
            </section>
            {projectData && <ProjectAditionBox onChangeData={data => setEditedData(data)} fieldData={projectData} />}
            <section className='sp-project-edit-deactive-sec'>
                <button className={`btn ${activeState ? 'btn-danger' : 'btn-success'}`} onClick={deactiveBtnHandler}>{activeState ? 'deactive' : 'Active'} Project </button>
            </section>
            <section className='my-3 d-flex justify-content-end gap-3'>
                <div><button className='sp-btn sp-btn-lt' onClick={() => navigate('/')} >Back to home</button></div>
                <div><button className='sp-btn sp-btn-vl' onClick={submitProjectHandler}>{loading && <Spinner />}<span>Save Changes</span></button></div>
            </section>
            <section className='my-4 text-center'>
                <div>All rights are reserved &copy;SDportfolio 2024</div>
            </section>
        </div>
    )
}

const ProjectAditionBox = ({ fieldData = {}, onChangeData }) => {
    // tagbox handlers
    const [tagBoxActive, setTagBoxActive] = useState(false)
    const tagBoxRef = useRef(null)
    useEffect(() => {
        const handleClose = e => {
            if (tagBoxRef.current && tagBoxActive && !tagBoxRef.current.contains(e.target)) {
                setTagBoxActive(false)
            }
        }
        window.addEventListener('click', handleClose)
        return () => window.removeEventListener('click', handleClose)
    })

    useEffect(() => {
        if (tagBoxActive) {
            document.getElementById('tag-input').focus()
        }
    }, [tagBoxActive])

    const [tagInput, setTagInput] = useState('')
    const [tagList, setTagList] = useState(fieldData?.tagList || [])
    const handleTagList = (e) => {
        e.preventDefault()
        if (tagInput) {
            setTagList([...tagList, tagInput])
            setTagInput('')
        }
    }
    const tagRemoveHandler = (tag) => {
        setTagList(tagList.filter(e => e !== tag))
    }

    // Image list handler
    const [imgList, setImgList] = useState(fieldData?.imageList || [])
    const handleImgChange = async (e) => {
        if (e.target.files) {
            setImgList([...imgList, ...e.target?.files])
        }
    }
    const imgRemoveHandler = (img) => {
        setImgList(imgList.filter(e => e !== img))
    }

    const getUrl = (imgInstance) => {
        if (imgInstance instanceof File) {
            return URL.createObjectURL(imgInstance)
        }
        else if (imgInstance && typeof imgInstance === "object" && 'imageUrl' in imgInstance) {
            return imgInstance.imageUrl
        }
    }

    // button box handler
    const [buttonList, setButtonList] = useState(fieldData?.buttons || [])
    const handleButtonList = (event, type) => {
        let list = [...buttonList]
        const index = list.findIndex(e => e.buttonType === type)
        if (index !== -1) {
            list[index] = { ...list[index], buttonType: type, buttonUrl: event.target.value }
            setButtonList(list)
        }
        else if (index === -1) {
            list.push({ buttonType: type, buttonUrl: event.target.value })
            setButtonList(list)
        }
    }

    const checkBoxChangeHandler = (active, type) => {
        let list = [...buttonList]
        const index = list.findIndex(e => e.buttonType === type)
        if (index !== -1) {
            list[index] = { ...list[index], buttonType: type, active: active }
            setButtonList(list)
        }
        else if (index === -1) {
            list.push({ buttonType: type, active: active })
            setButtonList(list)
        }
    }

    const buttonValue = (type) => {
        const index = buttonList.findIndex(e => e.buttonType === type)
        if (index !== -1) {
            return buttonList[index].buttonUrl
        }
        else {
            return null
        }
    }
    const checkValue = (type) => {
        const index = buttonList.findIndex(e => e.buttonType === type)
        if (index !== -1) {
            return buttonList[index].active
        }
        else {
            return null
        }
    }

    // Title and description handers
    const [title, setTitle] = useState(fieldData?.title || '')
    const [description, setDescription] = useState(fieldData?.description || '')

    // Data flow
    useEffect(() => {
        const projectData = {
            title,
            description,
            buttons: buttonList,
            imageList: imgList,
            tagList
        }
        onChangeData(projectData)

    }, [title, description, buttonList, imgList, tagList])

    return (
        <section className='sp-create-new-project-cont-box'>
            <div>
                <div><h5>Project title</h5></div>
                <div>
                    <input type="text" className='form-control' placeholder='project title' onChange={e => setTitle(e.target.value)} value={title} />
                </div>
            </div>
            <div>
                <div><h5>Description</h5></div>
                <div><textarea name="" id="sp-project-des-input" className='form-control' placeholder='project description' onChange={e => setDescription(e.target.value)} value={description} /></div>
            </div>
            <div>
                <div><h5>Add images</h5></div>
                <ul className='sp-proj-add-img-box'>
                    <div>
                        <input type="file" name="" id="project-img-add-input" multiple accept='image/*' onChange={handleImgChange} />
                        <label htmlFor="project-img-add-input" className='sp-proj-img-input-box'><i className="bi bi-camera2"></i></label>
                    </div>
                    {
                        imgList.map((img, index) => {
                            return (
                                <div className='sp-proj-uploaded-img-box' key={index}>
                                    <img src={getUrl(img)} alt="" />
                                    <button onClick={() => imgRemoveHandler(img)}><i className="bi bi-trash3"></i></button>
                                </div>
                            )
                        })
                    }

                </ul>
            </div>
            <div>
                <div><h5>Buttons</h5></div>
                {
                    buttonData?.map((item, index) => {
                        return (
                            <div className='sp-proj-btn-add-box mb-4' key={index}>
                                <div><input type="checkbox" name="" id="" onChange={(e) => checkBoxChangeHandler(e.target.checked, item.type)} checked={checkValue(item.type) || false} /></div>
                                <div className='sp-proj-btn-des' >{item.name}</div>
                                <div><input type="text" className='form-control' placeholder={item?.placeholder} onChange={(e) => handleButtonList(e, item.type)} value={buttonValue(item.type) || ''} /></div>
                            </div>
                        )
                    })
                }
            </div>
            <div>
                <div><h5>Add tags</h5></div>
                <div ref={tagBoxRef} >
                    <ul className={`sp-tag-add-box ${tagBoxActive && 'sp-tag-box-clicked'}`} onClick={() => setTagBoxActive(true)} >
                        {
                            tagList.map((tag, index) => {
                                return (
                                    <div className='sp-tag-list-item' key={index}>
                                        <span>{tag}</span><span onClick={() => tagRemoveHandler(tag)}><i className="bi bi-x-circle-fill"></i></span>
                                    </div>
                                )
                            })
                        }
                        <div>
                            <form action="" onSubmit={handleTagList}>
                                <input type="text" placeholder='type a tag' id='tag-input' onChange={e => setTagInput(e.target.value)} value={tagInput} />
                            </form>
                        </div>
                    </ul>
                </div>
            </div>
        </section>
    )
}


