import Spinner from "../../components/common/spinner";
import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import BasicInfoForm from './BasicInfoForm';
import ExperienceManager from './ExperienceManager';
import EducationManager from './EducationManager';
import ProjectManager from './ProjectManager';
import ProfileQAManager from './ProfileQAManager';
import DealbreakersManager from './DealbreakersManager';

function ProfileContainer() {
    const dispatch = useDispatch();
    const profileState = useSelector(state => state.applicantProfile);
    
    // In this custom redux setup, data is often at profileState.data
    // Since we changed to a standard ModelViewSet, GET returns an array
    // Since we changed to a standard ModelViewSet, GET returns an array
    // However, POST and PUT return a single object.
    let profileData = {};
    if (profileState?.data?.status === 'success') {
        const body = profileState.data.body;
        if (Array.isArray(body)) {
            profileData = body.length > 0 ? body[0] : {};
        } else if (body && Array.isArray(body.results)) {
            profileData = body.results.length > 0 ? body.results[0] : {};
        } else {
            profileData = body || {};
        }
    }
    const loading = profileState?.loading;

    useEffect(() => {
        dispatch({ type: 'GET_PROFILE' });
    }, [dispatch]);

    if (loading && !profileData.id) {
        return <div className="p-4"><Spinner /> Loading profile...</div>;
    }

    return (
        <div className="container-fluid px-4 py-2">
            <h2 className="mb-4">
                <i className="bi bi-person-lines-fill me-2"></i>
                Applicant Profile
            </h2>
            
            <div className="row">
                <div className="col-12 col-xl-4 mb-4">
                    <BasicInfoForm profile={profileData} />
                </div>
                <div className="col-12 col-xl-8">
                    <ExperienceManager experiences={profileData.experiences || []} />
                    <ProjectManager projects={profileData.projects || []} />
                    <EducationManager educations={profileData.education || []} />
                    <ProfileQAManager />
                    <DealbreakersManager />
                </div>
            </div>
        </div>
    );
}

export default ProfileContainer;
