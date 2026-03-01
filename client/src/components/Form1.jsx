import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const Form1 = () => {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    // Helper function to get local date in YYYY-MM-DD
    const getLocalDateString = () => {
        const d = new Date();
        const year = d.getFullYear();
        const month = String(d.getMonth() + 1).padStart(2, '0');
        const day = String(d.getDate()).padStart(2, '0');
        return `${year}-${month}-${day}`;
    };

    const [formData, setFormData] = useState({
        name: '',
        relationType: 'S/o',
        fatherName: '',
        mobileNumber: '',
        villageTown: '',
        surveyNumber: '',
        extent: '',
        classification: 'Agricultural', // Default as per form layout context
        emptyField: '',
        doorNumber: '',
        natureOfUse: 'Agriculture', // Default for Agricultural classification
        date: getLocalDateString() // Default local today's date
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
                } else if (value === 'Residential') {
                    newData.natureOfUse = 'Vacant Land'; // Default for residential
                }
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

    // Auto update date at midnight
    useEffect(() => {
        const updateDate = () => {
            const today = getLocalDateString();
            setFormData(prev => ({
                ...prev,
                date: today
            }));
        };

        const now = new Date();
        const tomorrow = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1);
        const timeToMidnight = tomorrow.getTime() - now.getTime();

        const timeoutId = setTimeout(() => {
            updateDate();
            // After the first midnight, update every 24 hours
            setInterval(updateDate, 24 * 60 * 60 * 1000);
        }, timeToMidnight);

        return () => clearTimeout(timeoutId);
    }, []);

    return (
        <div className="form-card">
            <div className="form-header">
                <h2>Market Value Application Form</h2>
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

                    <div className="form-group full-width" style={{ display: 'flex', gap: '1rem' }}>
                        <div style={{ flex: '1' }}>
                            <label className="form-label" htmlFor="relationType">Relation Type</label>
                            <select
                                id="relationType"
                                name="relationType"
                                className="form-control"
                                value={formData.relationType}
                                onChange={handleChange}
                                required
                            >
                                <option value="S/o">S/o</option>
                                <option value="D/o">D/o</option>
                                <option value="W/o">W/o</option>
                            </select>
                        </div>
                        <div style={{ flex: '2' }}>
                            <label className="form-label" htmlFor="fatherName">Relation Name</label>
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
