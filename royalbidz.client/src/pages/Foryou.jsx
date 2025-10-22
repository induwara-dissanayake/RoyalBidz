/* Foryou.jsx  file*/
import React, { useState } from 'react';
import './Foryou.css'; 

const Foryou = () => {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        productName: '', 
        message: '',
        images: [] 
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prevData => ({
            ...prevData,
            [name]: value
        }));
    };

    const handleImageChange = (e) => {
        setFormData(prevData => ({
            ...prevData,
            images: [...prevData.images, ...Array.from(e.target.files)]
        }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
       
        console.log('Form submitted:', formData);
        alert('Your request has been submitted!');
        // Clear form after submission 
        setFormData({
            name: '',
            email: '',
            productName: '',
            message: '',
            images: []
        });
    };

    return (
        <div className="foryou-container">
            <h1 className="foryou-title">Tell them of all that's precious to your precious 'bidz!</h1>
            <p className="foryou-description">
                This publication allows us to learn more from specially curated items submitted by valued clients, giving you the opportunity to sell or make your dream possible here. This unique platform benefits both parties; sellers gain exposure while buyers discover exclusive items.
            </p>

            <form className="foryou-form" onSubmit={handleSubmit}>
                <div className="form-group">
                    <label htmlFor="name">Jewelry Item Name</label>
                    <input
                        type="text"
                        id="productName"
                        name="productName"
                        value={formData.productName}
                        onChange={handleChange}
                        placeholder="Insert Item Name"
                        required
                    />
                </div>

                <div className="form-group">
                    <label>Upload Item Images</label>
                    <div className="image-upload-area">
                        
                        <div className="image-placeholder">
                            
                            <span className="upload-icon">+</span>
                            <input
                                type="file"
                                accept="image/*"
                                multiple
                                onChange={handleImageChange}
                                className="hidden-file-input"
                            />
                        </div>
                        <div className="image-placeholder">
                            <span className="upload-icon">+</span>
                            <input
                                type="file"
                                accept="image/*"
                                multiple
                                onChange={handleImageChange}
                                className="hidden-file-input"
                            />
                        </div>
                        <div className="image-placeholder">
                            <span className="upload-icon">+</span>
                            <input
                                type="file"
                                accept="image/*"
                                multiple
                                onChange={handleImageChange}
                                className="hidden-file-input"
                            />
                        </div>
                    </div>
                </div>

                <div className="form-group">
                    <label htmlFor="message">Tell about the 'bidz</label>
                    <textarea
                        id="message"
                        name="message"
                        value={formData.message}
                        onChange={handleChange}
                        placeholder="Tell about the 'bidz"
                        rows="5"
                        required
                    ></textarea>
                </div>

                <div className="form-group">
                    <label htmlFor="name">Details & Restrictions</label>
                    <textarea
                        id="details"
                        name="details"
                        value={formData.details}
                        onChange={handleChange}
                        placeholder="Details & Restrictions"
                        rows="5"
                        required
                    ></textarea>
                </div>

                <button type="submit" className="submit-button">Submit</button>
            </form>
        </div>
    );
};

export default Foryou;