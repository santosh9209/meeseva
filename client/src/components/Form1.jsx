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
        natureOfUse: '',
        date: new Date().toISOString().split('T')[0] // Default today's date
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
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

                    <div className="form-group full-width">
                        <label className="form-label" htmlFor="natureOfUse">Nature of Use</label>
                        <input
                            type="text"
                            id="natureOfUse"
                            name="natureOfUse"
                            className="form-control"
                            value={formData.natureOfUse}
                            onChange={handleChange}
                            required
                        />
                    </div>

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
