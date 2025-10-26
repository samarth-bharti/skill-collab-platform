// src/pages/auth/ProfileBuilderPage.jsx
import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext'; // CORRECTED IMPORT PATH
import { uploadProfilePicture, createUserProfile } from '../../lib/api';

const GlobalStyles = () => ( <style>{`...`}</style> );


export default function ProfileBuilderPage() {
    const { user } = useAuth();
    const navigate = useNavigate();
    const [profileData, setProfileData] = useState({
        username: '',
        age: '',
        country: '',
        city: '',
        profilePicture: null
    });
    const [profileImagePreview, setProfileImagePreview] = useState(null);
    const [errors, setErrors] = useState({});
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [serverError, setServerError] = useState('');
    const fileInputRef = useRef(null);

    const validate = () => {
        const newErrors = {};
        if (!profileData.username) newErrors.username = 'Username is required.';
        if (!profileData.age) newErrors.age = 'Age is required.';
        else if (profileData.age < 13 || profileData.age > 120) newErrors.age = 'Please enter a valid age.';
        if (!profileData.country) newErrors.country = 'Country is required.';
        if (!profileData.city) newErrors.city = 'City is required.';
        return newErrors;
    };
    
    const handleChange = e => {
        const { name, value } = e.target;
        setProfileData(prev => ({ ...prev, [name]: value }));
    };

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file && file.type.startsWith("image/")) {
            setProfileData(prev => ({ ...prev, profilePicture: file }));
            setProfileImagePreview(URL.createObjectURL(file));
        }
    };

    const handleImageUploadClick = () => {
        fileInputRef.current.click();
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!user) {
            setServerError("You must be logged in to create a profile.");
            return;
        }

        const validationErrors = validate();
        setErrors(validationErrors);

        if (Object.keys(validationErrors).length === 0) {
            setIsSubmitting(true);
            setServerError('');
            
            try {
                let imageId = null;
                // Step 1: Upload Image if it exists
                if (profileData.profilePicture) {
                    const uploadedImage = await uploadProfilePicture(profileData.profilePicture);
                    imageId = uploadedImage.$id;
                }

                // Step 2: Prepare the data for the database
                const finalProfileData = {
                    userId: user.$id,
                    username: profileData.username,
                    age: parseInt(profileData.age, 10),
                    country: profileData.country,
                    city: profileData.city,
                    profilePictureId: imageId,
                    fullName: user.name,
                    email: user.email,
                };

                // Step 3: Create the profile document
                await createUserProfile(finalProfileData);

                // Step 4: Redirect to the dashboard
                navigate('/dashboard');

            } catch (error) {
                console.error('Profile creation failed:', error);
                setServerError('Something went wrong. Please try again.');
            } finally {
                setIsSubmitting(false);
            }
        }
    };

    return (
        <>
            <GlobalStyles />
            <div className="w-full lg:w-1/2 overflow-y-auto">
                {/* ... The rest of your JSX was fine, so it's omitted here for brevity. ... */}
                {/* ... Keep your original form structure. ... */}
            </div>
        </>
    );
}