import React, { useEffect, useState } from 'react'
import axios from '../utils/axios-instance';
import Swal from 'sweetalert2';

export const ResumePage = () => {
    const [userResume, setUserResume] = useState(null)
    useEffect(() => {
        const fetchUser = async () => {
            try {
                axios.get('/user/current-user')
                    .then(res => {
                        setUserResume(res.data?.data?.resume)
                    })
            } catch (error) {
                console.log(error);
            }
        }
        fetchUser()
    }, [])

    const [fileInput, setFileInput] = useState(null);
    const [loading, setLoading] = useState(false);
    const handleUpdateResume = async () => {
        if (!fileInput) return;
        const formData = new FormData();
        formData.append('resume', fileInput);
        try {
            setLoading(true);
            await axios.patch('/user/update-resume', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            }).then(() => {
                setLoading(false);
                Swal.fire({
                    icon: 'success',
                    title: 'Resume updated successfully',
                    showConfirmButton: false,
                    timer: 1500
                }).then(() => {
                    window.location.reload();
                })
            })
        } catch (error) {
            console.log(error);
            setLoading(false);
        }
    }
    return (
        <div className='container'>

            <div className='d-flex flex-column align-items-center'>
                <form>
                    <div className="mb-3">
                        <label htmlFor="resume" className="d-flex flex-column align-items-center c-pointer border border-2 p-3 rounded-5" style={{ width: "fit-content" }}>
                            <div><span><i className="bi bi-camera2 fs-1"></i></span></div>
                            <div><span>Update resume</span></div>
                        </label>
                        <input type="file" className="d-none" id="resume" onChange={e => setFileInput(e.target.files[0])} multiple={false} />
                    </div>
                </form>
                {(userResume || fileInput) && <div>
                    <embed src={fileInput ? URL.createObjectURL(fileInput) : userResume} height={300} type="" />
                </div>}
            </div>
            <div className='d-grid my-3'>
                <div style={{ justifySelf: "center" }} className='d-flex gap-3'>
                    {fileInput && <button className="btn" onClick={() => setFileInput(null)} disabled={loading}>Reset</button>}
                    <button className="btn btn-success" onClick={handleUpdateResume} disabled={loading}>Save changes</button>
                </div>
            </div>

        </div>
    )
}
