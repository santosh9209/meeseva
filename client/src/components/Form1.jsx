import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const Form1 = () => {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [formData, setFormData] = useState({
        name: '',
        fatherName: '',
        mobileNumber: '',
        villageTown: '',
        surveyNumber: '',
        extent: '',
        classification: 'Agricultural', // Default as per form layout context
        emptyField: '',
        doorNumber: '',
        natureOfUse: 'Agriculture', // Default for Agricultural classification
        numberOfFloors: '',
        floorArea1: '',
        floorArea2: '',
        floorArea3: '',
        floorArea4: '',
        date: new Date().toISOString().split('T')[0] // Default today's date
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => {
            const newData = { ...prev, [name]: value };

            // Handle Classification specific logic
            if (name === 'classification') {
                if (value === 'Agricultural') {
                    newData.natureOfUse = 'Agriculture';
                    newData.doorNumber = '';
                    newData.numberOfFloors = '';
                    newData.floorArea1 = '';
                    newData.floorArea2 = '';
                    newData.floorArea3 = '';
                    newData.floorArea4 = '';
                } else if (value === 'Residential') {
                    newData.natureOfUse = 'Vacant Land'; // Default for residential
                }
            }

            // Handle Nature of Use specific logic for Residential
            if (name === 'natureOfUse' && value === 'Vacant Land') {
                newData.numberOfFloors = '';
                newData.floorArea1 = '';
                newData.floorArea2 = '';
                newData.floorArea3 = '';
                newData.floorArea4 = '';
            }

            // Clean up areas if number of floors changes down
            if (name === 'numberOfFloors') {
                const floors = parseInt(value, 10) || 0;
                if (floors < 4) newData.floorArea4 = '';
                if (floors < 3) newData.floorArea3 = '';
                if (floors < 2) newData.floorArea2 = '';
                if (floors < 1) newData.floorArea1 = '';
            }

            return newData;
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        try {
            // Generate a unique ID
            const id = Date.now().toString();
            // Save to localStorage
            const dataToSave = { ...formData, id };
            localStorage.setItem(`requisition_${id}`, JSON.stringify(dataToSave));

            // Redirect to printable layout Form 2
            navigate(`/printable/${id}`);
        } catch (err) {
            console.error('Error saving form:', err);
            setError('Failed to save the application locally.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="form-card">
            <div className="form-header">
                <h2>Market Value Application Form</h2>
                <p>Please enter the details of the agricultural property.</p>
            </div>

            {error && (
                <div style={{ color: 'var(--error)', padding: '10px', backgroundColor: '#fee2e2', borderRadius: '8px', marginBottom: '20px' }}>
                    {error}
                </div>
            )}

            <form onSubmit={handleSubmit}>
                <div className="form-grid">

                    <div className="form-group full-width">
                        <h3 style={{ borderBottom: '1px solid var(--border)', paddingBottom: '0.5rem', marginBottom: '1rem', color: 'var(--primary)' }}>Property Details</h3>
                    </div>

                    <div className="form-group full-width">
                        <label className="form-label" htmlFor="villageTown">Village / Town Name</label>
                        <input
                            type="text"
                            id="villageTown"
                            name="villageTown"
                            className="form-control"
                            value={formData.villageTown}
                            onChange={handleChange}
                            required
                        />
                    </div>

                    <div className="form-group">
                        <label className="form-label" htmlFor="surveyNumber">Survey Number (Sy.No)</label>
                        <input
                            type="text"
                            id="surveyNumber"
                            name="surveyNumber"
                            className="form-control"
                            value={formData.surveyNumber}
                            onChange={handleChange}
                            required
                        />
                    </div>

                    <div className="form-group">
                        <label className="form-label" htmlFor="extent">Extent</label>
                        <input
                            type="text"
                            id="extent"
                            name="extent"
                            className="form-control"
                            value={formData.extent}
                            onChange={handleChange}
                            required
                        />
                    </div>

                    <div className="form-group">
                        <label className="form-label" htmlFor="classification">Classification</label>
                        <select
                            id="classification"
                            name="classification"
                            className="form-control"
                            value={formData.classification}
                            onChange={handleChange}
                            required
                        >
                            <option value="Agricultural">Agricultural</option>
                            <option value="Residential">Residential</option>
                        </select>
                    </div>

                    {formData.classification === 'Residential' && (
                        <div className="form-group full-width">
                            <label className="form-label" htmlFor="doorNumber">Door Number</label>
                            <input
                                type="text"
                                id="doorNumber"
                                name="doorNumber"
                                className="form-control"
                                value={formData.doorNumber}
                                onChange={handleChange}
                                required
                            />
                        </div>
                    )}

                    {formData.classification === 'Agricultural' ? (
                        <div className="form-group full-width">
                            <label className="form-label" htmlFor="natureOfUse">Nature of Use</label>
                            <input
                                type="text"
                                id="natureOfUse"
                                name="natureOfUse"
                                className="form-control"
                                value={formData.natureOfUse}
                                readOnly
                                style={{ backgroundColor: '#e2e8f0', cursor: 'not-allowed' }}
                            />
                        </div>
                    ) : (
                        <div className="form-group full-width">
                            <label className="form-label" htmlFor="natureOfUse">Nature of Use</label>
                            <select
                                id="natureOfUse"
                                name="natureOfUse"
                                className="form-control"
                                value={formData.natureOfUse}
                                onChange={handleChange}
                                required
                            >
                                <option value="Vacant Land">Vacant Land</option>
                                <option value="House/Building">House/Building</option>
                            </select>
                        </div>
                    )}

                    {formData.classification === 'Residential' && formData.natureOfUse === 'House/Building' && (
                        <>
                            <div className="form-group full-width">
                                <label className="form-label" htmlFor="numberOfFloors">Number of Floors</label>
                                <select
                                    id="numberOfFloors"
                                    name="numberOfFloors"
                                    className="form-control"
                                    value={formData.numberOfFloors}
                                    onChange={handleChange}
                                    required
                                >
                                    <option value="" disabled>Select</option>
                                    <option value="1">1</option>
                                    <option value="2">2</option>
                                    <option value="3">3</option>
                                    <option value="4">4</option>
                                </select>
                            </div>

                            {parseInt(formData.numberOfFloors, 10) >= 1 && (
                                <div className="form-group">
                                    <label className="form-label" htmlFor="floorArea1">Floor 1 Area</label>
                                    <input
                                        type="number"
                                        id="floorArea1"
                                        name="floorArea1"
                                        className="form-control"
                                        value={formData.floorArea1}
                                        onChange={handleChange}
                                        required
                                    />
                                </div>
                            )}
                            {parseInt(formData.numberOfFloors, 10) >= 2 && (
                                <div className="form-group">
                                    <label className="form-label" htmlFor="floorArea2">Floor 2 Area</label>
                                    <input
                                        type="number"
                                        id="floorArea2"
                                        name="floorArea2"
                                        className="form-control"
                                        value={formData.floorArea2}
                                        onChange={handleChange}
                                        required
                                    />
                                </div>
                            )}
                            {parseInt(formData.numberOfFloors, 10) >= 3 && (
                                <div className="form-group">
                                    <label className="form-label" htmlFor="floorArea3">Floor 3 Area</label>
                                    <input
                                        type="number"
                                        id="floorArea3"
                                        name="floorArea3"
                                        className="form-control"
                                        value={formData.floorArea3}
                                        onChange={handleChange}
                                        required
                                    />
                                </div>
                            )}
                            {parseInt(formData.numberOfFloors, 10) >= 4 && (
                                <div className="form-group">
                                    <label className="form-label" htmlFor="floorArea4">Floor 4 Area</label>
                                    <input
                                        type="number"
                                        id="floorArea4"
                                        name="floorArea4"
                                        className="form-control"
                                        value={formData.floorArea4}
                                        onChange={handleChange}
                                        required
                                    />
                                </div>
                            )}
                        </>
                    )}

                    <div className="form-group full-width">
                        <label className="form-label" htmlFor="date">Date</label>
                        <input
                            type="date"
                            id="date"
                            name="date"
                            className="form-control"
                            value={formData.date}
                            onChange={handleChange}
                            required
                            readOnly
                        />
                    </div>

                    <div className="form-group full-width" style={{ marginTop: '1rem' }}>
                        <h3 style={{ borderBottom: '1px solid var(--border)', paddingBottom: '0.5rem', marginBottom: '1rem', color: 'var(--primary)' }}>Applicant Details</h3>
                    </div>

                    <div className="form-group full-width">
                        <label className="form-label" htmlFor="name">Full Name</label>
                        <input
                            type="text"
                            id="name"
                            name="name"
                            className="form-control"
                            value={formData.name}
                            onChange={handleChange}
                            required
                        />
                    </div>

                    <div className="form-group">
                        <label className="form-label" htmlFor="fatherName">Father's Name</label>
                        <input
                            type="text"
                            id="fatherName"
                            name="fatherName"
                            className="form-control"
                            value={formData.fatherName}
                            onChange={handleChange}
                            required
                        />
                    </div>

                    <div className="form-group">
                        <label className="form-label" htmlFor="mobileNumber">Mobile Number</label>
                        <input
                            type="tel"
                            id="mobileNumber"
                            name="mobileNumber"
                            className="form-control"
                            value={formData.mobileNumber}
                            onChange={handleChange}
                            required
                            pattern="[0-9]{10}"
                        />
                    </div>

                </div>

                <div style={{ marginTop: '2rem' }}>
                    <button
                        type="submit"
                        className="btn btn-primary btn-block"
                        disabled={loading}
                    >
                        {loading ? 'Submitting...' : 'Save and Generate Form'}
                    </button>
                </div>
            </form>
        </div>
    );
};

export default Form1;
