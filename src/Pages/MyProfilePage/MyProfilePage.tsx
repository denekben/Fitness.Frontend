import React, { useEffect, useState } from 'react';
import ReportsComponent from '../../Components/MyProfilePlates/ProfileReports';
import TimeIntervalComponent from '../../Components/MyProfilePlates/ProfileTimeIntervals';
import Profile from '../../Components/MyProfilePlates/Profile';
import ProfileRequests from '../../Components/MyProfilePlates/ProfileRequests';


const MyProfilePage: React.FC = () => {
    return (
        <div className="flex justify-center">
            <div className="w-1/3 p-4"> 
                <ProfileRequests/>
            </div>
            <div className="w-1/4 p-4 mr-7">
                <ReportsComponent/>
            </div>
            <div className="w-1/3 p-4">
                <Profile/>
                <TimeIntervalComponent/>
            </div>
        </div>
    );
};

export default MyProfilePage;