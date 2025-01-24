import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import axios from "../utils/axios-instance.js"

export const ProjectList = () => {
    const [projectList, setProjectList] = useState(null)
    useEffect(() => {
        const fetchList = async () => {
            try {
                await axios.get('/project/project-list')
                    .then(res => {
                        setProjectList(res.data?.data)
                    })
            } catch (error) {
                console.log(error);
            }
        }
        fetchList()
    }, [])
    return (
        <div className='container sp-project-list-container'>
            <h4>Projects</h4>
            <ul className='sp-project-list'>
                {projectList?.map((project, index) => {
                    return <ProjectItem key={index} project={project} />
                })}
            </ul>

        </div>
    )
}

const ProjectItem = ({ project }) => {
    const navigate = useNavigate()
    const editBtnUrl = `/edit-project/${project?._id}`
    const getUpdateTime = (isoStr) => {
        const newIsoStr = new Date(isoStr).toString()
        const regex = /(\w{3}) (\w{3}) (\d{2}) (\d{4}) (\d{2}):(\d{2}):\d{2}/;
        const match = newIsoStr.match(regex)
        if (match) {
            const year = match[4]; // Get last two digits of the year
            const month = match[2];
            const day = match[3];
            const hours = match[5];
            const minutes = match[6];

            // Format the date and time as needed
            let formattedDate = `${year}-${month}-${day}`;
            let formattedTime = `${hours}:${minutes}`;

            return formattedDate + " <> " + formattedTime
        }
    }
    const activeState = project?.active
    return (
        <li className='sp-project-list-item'>
            <div className='sp-project-list-proj-img-box'>
                <img src={project?.imageList[0]?.imageUrl || require("../assets/img/blank-img.jpg")} alt=" " />
            </div>
            <div className='sp-project-lt-item-content'>
                <div className='sp-project-title-box'>
                    <div className='text-break'>
                        <h5 >{project?.title}</h5>
                    </div>
                    <div className='sp-proj-update-date-box'><span>Updated -</span> <span>{getUpdateTime(project?.updatedAt)}</span></div>
                </div>
                <div className='sp-project-des-box'>{project?.description?.slice(0, 400)}</div>
                <div className='d-flex gap-4 align-items-center'>
                    <div>
                        <button className='sp-btn sp-btn-lt' onClick={() => navigate(editBtnUrl)}><span><i className="bi bi-pencil-square"></i></span> <span>Edit project</span></button>
                    </div>
                    <div className={`d-flex align-items-center ${activeState ? 'text-success' : 'text-danger'}`}>
                        <span><i className="bi bi-dot fs-1"></i></span><span>{activeState ? 'active' : 'dactive'}</span>
                    </div>
                </div>
            </div>
        </li>
    )
}
