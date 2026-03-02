import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { jsPDF } from 'jspdf';
import 'jspdf-autotable';

const Form2 = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchRequisition = () => {
            try {
                const storedData = localStorage.getItem(`requisition_${id}`);
                if (storedData) {
                    const parsedData = JSON.parse(storedData);
                    // Map camelCase to snake_case for compatibility with existing code
                    const mappedData = {
                        ...parsedData,
                        village_town: parsedData.villageTown,
                        survey_number: parsedData.surveyNumber,
                        nature_of_use: parsedData.natureOfUse,
                        relation_type: parsedData.relationType || 'S/o', // Fallback for backwards compatibility
                        father_name: parsedData.fatherName,
                        mobile_number: parsedData.mobileNumber
                    };
                    setData(mappedData);
                } else {
                    setError('Requisition data not found in local storage.');
                }
            } catch (err) {
                console.error('Error reading data:', err);
                setError('Failed to read requisition data from local storage.');
            } finally {
                setLoading(false);
            }
        };

        fetchRequisition();
    }, [id]);

    const handlePrint = () => {
        window.print();
    };

    const handleDownloadPDF = () => {
        if (!data) return;

        const doc = new jsPDF();
        const pageWidth = doc.internal.pageSize.getWidth();

        // Center function
        const centerText = (text, y, fontSize = 12, isBold = false) => {
            doc.setFontSize(fontSize);
            if (isBold) doc.setFont('helvetica', 'bold');
            else doc.setFont('helvetica', 'normal');
            const textWidth = doc.getStringUnitWidth(text) * fontSize / doc.internal.scaleFactor;
            const x = (pageWidth - textWidth) / 2;
            doc.text(text, x, y);
        };

        // Header Area
        doc.setFont('helvetica', 'bold');
        doc.setFontSize(28); // Reduced from 36
        centerText('CARD', 15, 28, true);
        centerText('(Computer - aided Administration of Registration Department)', 20, 8, false);
        centerText('Visit us at : http://registration.telangana.gov.in', 25, 9, true);

        centerText('REQUISITION FORM / అభ్యర్ధన దరఖాస్తు', 32, 12, true);
        centerText('(for Assistance on Market Value/Chargeability) / (మార్కెట్ విలువ/డ్యూటీ చెల్లింపు సహాయము కొరకు)', 37, 10, true);
        centerText('Nature of Transaction / దస్తావేజు స్వభావము', 42, 11, true);

        // Transaction Code row
        doc.setFontSize(10);
        doc.setFont('helvetica', 'normal');
        doc.text('Transaction Code', 20, 48);
        doc.text('దస్తావేజు కోడ్ నెం.', 20, 52);

        // Boxes for code
        doc.setLineWidth(0.5);
        doc.rect(50, 45, 20, 7);
        doc.text('01', 58, 50);
        doc.rect(80, 45, 20, 7);
        doc.text('01', 88, 50);

        doc.text('Name of the Transaction\nదస్తావేజు పేరు', 105, 48);
        doc.rect(140, 45, 50, 7);
        doc.text('Sale Deed', 152, 50);

        // DETAILS OF PROPERTY (URBAN)
        centerText('DETAILS OF PROPERTY (URBAN) / ఆస్తి వివరములు (గృహ సంబంధమైన)', 60, 14, true);

        // Urban Table
        doc.autoTable({
            startY: 65,
            theme: 'plain',
            styles: {
                font: 'helvetica',
                fontSize: 10,
                textColor: [0, 0, 0],
                lineColor: [0, 0, 0],
                lineWidth: 0.5,
                cellPadding: 1,
            },
            body: [
                [
                    { content: 'Village / Town Name\nగ్రామము/పట్టణము పేరు' },
                    { content: data.village_town || '' },
                    { content: 'Ward No.\nవార్డు నెం.' },
                    { content: '' },
                    { content: 'Block No.\nబ్లాక్ నెం.' },
                    { content: '' },
                    { content: 'Locality\nప్రాంతము\nHabitation Name/నివాస స్థలము' },
                    { content: '' }
                ],
                [
                    { content: 'Door No.\nఇంటి నం.' },
                    { content: data.doorNumber || '' },
                    { content: 'Extent\nSq.yds.\nవైశాల్యం చ.గ.' },
                    { content: data.extent || '' },
                    { content: 'Plinth area\nSft./కట్టడపు\nవైశాల్యము (చ.అ.)' },
                    { content: '' },
                    { content: 'Nature of Use\nRes./Comm.\nఏ ఉపయోగమునకు వర్తించు' },
                    { content: data.nature_of_use || '' }
                ]
            ],
            margin: { left: 15, right: 15 }
        });

        // DETAILS OF PROPERTY (AGRICULTURAL) section
        centerText('DETAILS OF PROPERTY (AGRICULTURAL) / ఆస్తి వివరములు (వ్యవసాయ భూమి)', doc.lastAutoTable.finalY + 8, 14, true);

        // Agricultural Table
        doc.autoTable({
            startY: doc.lastAutoTable.finalY + 12,
            theme: 'plain',
            styles: {
                font: 'helvetica',
                fontSize: 10,
                textColor: [0, 0, 0],
                lineColor: [0, 0, 0],
                lineWidth: 0.5,
                cellPadding: 1,
            },
            body: [
                [
                    { content: 'Village / Town Name\nగ్రామము/పట్టణము పేరు' },
                    { content: data.village_town || '' },
                    { content: 'Sy. No.\nసర్వే నెం.' },
                    { content: data.survey_number || '' },
                    { content: 'Classification\nవర్గీకరణ' },
                    { content: data.classification || '' }
                ],
                [
                    { content: 'Units\nయూనిట్స్' },
                    { content: '' },
                    { content: 'Nature of use\nఏ ఉపయోగమునకు వర్తించు' },
                    { content: data.nature_of_use || '' },
                    { content: 'Habitation Name\nనివాస స్థలము' },
                    { content: data.doorNumber || '' }
                ]
            ],
            margin: { left: 15, right: 15 }
        });

        // Structure Table
        centerText('DETAILS OF STRUCTURE / కట్టడముల వివరములు', doc.lastAutoTable.finalY + 8, 14, true);
        doc.autoTable({
            startY: doc.lastAutoTable.finalY + 12,
            theme: 'plain',
            styles: { font: 'helvetica', fontSize: 10, textColor: [0, 0, 0], lineColor: [0, 0, 0], lineWidth: 0.5, halign: 'center', cellPadding: 1 },
            head: [
                [
                    { content: 'Flat (y/n)\nఫ్లాట్ (అ/కా)' },
                    { content: '' },
                    { content: 'Name of Apartment\nఅపార్ట్మెంట్ పేరు' },
                    { content: '' },
                    { content: 'Flat No.\nఫ్లాట్ నెం.' },
                    { content: '' },
                    { content: 'Total No. of Floors\nమొత్తం అంతస్తులు' },
                    { content: '' }
                ]
            ],
            body: [
                [
                    { content: 'Floor No.\nఅంతస్తు నెం.', colSpan: 1 },
                    { content: 'Type of Structure\nకట్టడముల స్వభావము', colSpan: 2 },
                    { content: 'Plinth Area in Sft./\nకట్టడపు వైశాల్యము(చ.అ.)', colSpan: 2 },
                    { content: 'Stage of Construction\nనిర్మాణ దశ', colSpan: 2 },
                    { content: 'Age of the Building in Years\nకట్టడముల వయస్సు సంవత్సరములలో', colSpan: 1 }
                ],
                [{ content: '', colSpan: 1 }, { content: '', colSpan: 2 }, { content: '', colSpan: 2 }, { content: '', colSpan: 2 }, { content: '', colSpan: 1 }],
                [{ content: '', colSpan: 1 }, { content: '', colSpan: 2 }, { content: '', colSpan: 2 }, { content: '', colSpan: 2 }, { content: '', colSpan: 1 }],
                [{ content: '', colSpan: 1 }, { content: '', colSpan: 2 }, { content: '', colSpan: 2 }, { content: '', colSpan: 2 }, { content: '', colSpan: 1 }],
                [{ content: '', colSpan: 1 }, { content: '', colSpan: 2 }, { content: '', colSpan: 2 }, { content: '', colSpan: 2 }, { content: '', colSpan: 1 }]
            ],
            margin: { left: 15, right: 15 }
        });

        const finalY = doc.lastAutoTable.finalY + 8;
        const afterAppY = finalY;

        // Footer lines
        doc.setLineWidth(0.5);
        doc.line(15, afterAppY, pageWidth - 15, afterAppY);

        // Format Date safely
        let formattedDate = '';
        if (data.date) {
            const dateObj = new Date(data.date);
            formattedDate = dateObj.toLocaleDateString('en-GB'); // DD/MM/YYYY
        }

        doc.text(`Date / తేది.`, 15, afterAppY + 5);
        doc.text(`Date : ${formattedDate}`, 15, afterAppY + 12);

        doc.text('Signature', 140, afterAppY + 5);
        doc.text('Name', 140, afterAppY + 12);
        doc.text('Address', 140, afterAppY + 19);

        // Applicant Details filling in Signature (Right Side)
        doc.text(`${data.name || ''}`, 160, afterAppY + 12);
        doc.text(`${data.village_town || ''}, Ph: ${data.mobile_number || ''}`, 160, afterAppY + 19);

        // Bottom left summary
        doc.text('Village', 15, afterAppY + 25);
        doc.text(`:   ${data.village_town}`, 45, afterAppY + 25);

        doc.text('Sy.No.', 15, afterAppY + 31);
        doc.text(`:   ${data.survey_number}`, 45, afterAppY + 31);

        doc.text('Extent', 15, afterAppY + 37);
        doc.text(`:   ${data.extent}`, 45, afterAppY + 37);

        doc.text('Classification', 15, afterAppY + 43);
        doc.text(`:   ${data.classification}`, 45, afterAppY + 43);

        doc.save(`CARD_Requisition_${data.id}.pdf`);
    };

    if (loading) return <div className="loading-spinner">Loading form data...</div>;
    if (error) return <div className="loading-spinner" style={{ color: 'red' }}>{error}</div>;
    if (!data) return <div className="loading-spinner">No data found.</div>;

    // Format Date for view
    const formattedDate = new Date(data.date).toLocaleDateString('en-GB');

    return (
        <div className="requisition-wrapper">

            <div className="printable-area">
                <div className="card-header-main">
                    <h1 className="card-title-huge">CARD</h1>
                    <p className="card-sub-p">(Computer - aided Administration of Registration Department)</p>
                    <p className="card-sub-bold">Visit us at : http://registration.telangana.gov.in</p>
                </div>

                <div className="card-titles-container">
                    <h2 className="title-req">REQUISITION FORM / <span className="telugu-text">అభ్యర్ధన దరఖాస్తు</span></h2>
                    <h3 className="title-assist">(for Assistance on Market Value/Chargeability) / <span className="telugu-text">(మార్కెట్ విలువ/డ్యూటీ చెల్లింపు సహాయము కొరకు)</span></h3>
                    <h3 className="title-nature">Nature of Transaction / <span className="telugu-text">దస్తావేజు స్వభావము</span></h3>
                </div>

                <div className="transaction-row">
                    <div className="trans-col flex-start">
                        <div className="trans-label">
                            Transaction Code<br />
                            <span className="telugu-text">దస్తావేజు కోడ్ నెం.</span>
                        </div>
                        <div className="trans-box">01</div>
                        <div className="trans-box">01</div>
                    </div>
                    <div className="trans-col flex-end">
                        <div className="trans-label">
                            Name of the Transaction<br />
                            <span className="telugu-text">దస్తావేజు పేరు</span>
                        </div>
                        <div className="trans-box-wide">Sale Deed</div>
                    </div>
                </div>

                {/* Details Block combined with applicant */}

                <div className="section-title-bar">
                    DETAILS OF PROPERTY (URBAN) / <span className="telugu-text">ఆస్తి వివరములు (గృహ సంబంధమైన)</span>
                </div>

                <table className="card-complex-table" style={{ fontSize: '14px', marginBottom: '10px' }}>
                    <tbody>
                        <tr>
                            <td className="th-like top-border" style={{ width: '15%' }}>Village / Town Name<br /><span className="telugu-text">గ్రామము/పట్టణము పేరు</span></td>
                            <td className="val-cell top-border" style={{ width: '15%' }}>{data.village_town}</td>
                            <td className="th-like top-border" style={{ width: '10%' }}>Ward No.<br /><span className="telugu-text">వార్డు నెం.</span></td>
                            <td className="val-cell top-border" style={{ width: '10%' }}></td>
                            <td className="th-like top-border" style={{ width: '10%' }}>Block No.<br /><span className="telugu-text">బ్లాక్ నెం.</span></td>
                            <td className="val-cell top-border" style={{ width: '10%' }}></td>
                            <td className="th-like top-border no-bottom-border" style={{ width: '15%' }}>Locality<br /><span className="telugu-text">ప్రాంతము</span><br />Habitation Name/నివాస స్థలము</td>
                            <td className="val-cell top-border no-bottom-border" style={{ width: '15%' }}></td>
                        </tr>
                        <tr>
                            <td className="th-like">Door No.<br /><span className="telugu-text">ఇంటి నం.</span></td>
                            <td className="val-cell">{data.doorNumber || ''}</td>
                            <td className="th-like">Extent<br />Sq.yds.<br /><span className="telugu-text">వైశాల్యం చ.గ.</span></td>
                            <td className="val-cell">{data.extent}</td>
                            <td className="th-like">Plinth area<br />Sft./కట్టడపు<br /><span className="telugu-text">వైశాల్యము (చ.అ.)</span></td>
                            <td className="val-cell"></td>
                            <td className="th-like top-border">Nature of Use<br />Res./Comm.<br /><span className="telugu-text">ఏ ఉపయోగమునకు వర్తించు</span></td>
                            <td className="val-cell top-border">{data.nature_of_use}</td>
                        </tr>
                    </tbody>
                </table>

                <div className="section-title-bar mt-4">
                    DETAILS OF PROPERTY (AGRICULTURAL) / <span className="telugu-text">ఆస్తి వివరములు (వ్యవసాయ భూమి)</span>
                </div>

                <table className="card-complex-table" style={{ fontSize: '14px' }}>
                    <tbody>
                        <tr>
                            <td className="th-like top-border" style={{ width: '16%' }}>Village / Town Name<br /><span className="telugu-text">గ్రామము/పట్టణము పేరు</span></td>
                            <td className="val-cell top-border" style={{ width: '17%' }}>{data.village_town}</td>
                            <td className="th-like top-border" style={{ width: '16%' }}>Sy. No.<br /><span className="telugu-text">సర్వే నెం.</span></td>
                            <td className="val-cell top-border" style={{ width: '17%' }}>{data.survey_number}</td>
                            <td className="th-like top-border" style={{ width: '16%' }}>Classification<br /><span className="telugu-text">వర్గీకరణ</span></td>
                            <td className="val-cell top-border" style={{ width: '18%' }}>{data.classification}</td>
                        </tr>
                        <tr>
                            <td className="th-like">Units<br /><span className="telugu-text">యూనిట్స్</span></td>
                            <td className="val-cell"></td>
                            <td className="th-like">Nature of use<br /><span className="telugu-text">ఏ ఉపయోగమునకు వర్తించు</span></td>
                            <td className="val-cell">{data.nature_of_use}</td>
                            <td className="th-like">Habitation Name<br /><span className="telugu-text">నివాస స్థలము</span></td>
                            <td className="val-cell">{data.doorNumber || ''}</td>
                        </tr>
                    </tbody>
                </table>

                {/* Structure Block Empty */}
                <div className="section-title-bar mt-4">
                    DETAILS OF STRUCTURE / <span className="telugu-text">కట్టడముల వివరములు</span>
                </div>
                <table className="card-complex-table" style={{ fontSize: '14px' }}>
                    <tbody>
                        <tr>
                            <td className="text-center" style={{ width: '15%' }}>Flat (y/n)<br /><span className="telugu-text">ఫ్లాట్ (అ/కా)</span></td>
                            <td style={{ width: '10%' }}></td>
                            <td className="text-center" style={{ width: '20%' }}>Name of Apartment<br /><span className="telugu-text">అపార్ట్మెంట్ పేరు</span></td>
                            <td style={{ width: '20%' }}></td>
                            <td className="text-center" style={{ width: '10%' }}>Flat No.<br /><span className="telugu-text">ఫ్లాట్ నెం.</span></td>
                            <td style={{ width: '10%' }}></td>
                            <td className="text-center" style={{ width: '15%' }}>Total No. of Floors<br /><span className="telugu-text">మొత్తం అంతస్తులు</span></td>
                            <td style={{ width: '10%' }}></td>
                        </tr>
                        <tr className="sub-headers">
                            <td className="text-center" colSpan={1}>Floor No.<br /><span className="telugu-text">అంతస్తు నెం.</span></td>
                            <td className="text-center" colSpan={2}>Type of Structure<br /><span className="telugu-text">కట్టడముల స్వభావము</span></td>
                            <td className="text-center" colSpan={2}>Plinth Area in Sft./<br /><span className="telugu-text">కట్టడపు వైశాల్యము(చ.అ.)</span></td>
                            <td className="text-center" colSpan={2}>Stage of Construction<br /><span className="telugu-text">నిర్మాణ దశ</span></td>
                            <td className="text-center" colSpan={1}>Age of the Building in Years<br /><span className="telugu-text">కట్టడముల వయస్సు సంవత్సరములలో</span></td>
                        </tr>
                        <tr style={{ height: '30px' }}><td colSpan={1}></td><td colSpan={2}></td><td colSpan={2}></td><td colSpan={2}></td><td colSpan={1}></td></tr>
                        <tr style={{ height: '30px' }}><td colSpan={1}></td><td colSpan={2}></td><td colSpan={2}></td><td colSpan={2}></td><td colSpan={1}></td></tr>
                        <tr style={{ height: '30px' }}><td colSpan={1}></td><td colSpan={2}></td><td colSpan={2}></td><td colSpan={2}></td><td colSpan={1}></td></tr>
                        <tr style={{ height: '30px' }}><td colSpan={1}></td><td colSpan={2}></td><td colSpan={2}></td><td colSpan={2}></td><td colSpan={1}></td></tr>
                    </tbody>
                </table>

                <div className="card-signature-area" style={{ marginTop: '20px', display: 'flex', justifyContent: 'space-between', borderTop: '2px solid #000', paddingTop: '10px' }}>
                    <div className="left-sig" style={{ fontSize: '15px' }}>
                        Date / <span className="telugu-text">తేది.</span><br />
                        Date : {formattedDate}<br />
                        <br />
                        <div style={{ display: 'grid', gridTemplateColumns: 'min-content 1fr', gap: '5px 20px', marginTop: '10px' }}>
                            <span>Village</span><span>: &nbsp;{data.village_town}</span>
                            <span>Sy.No.</span><span>: &nbsp;{data.survey_number}</span>
                            <span>Extent</span><span>: &nbsp;{data.extent}</span>
                            <span>Classification</span><span>: &nbsp;{data.classification}</span>
                        </div>
                    </div>
                    <div className="right-sig" style={{ textAlign: 'left', width: '300px', fontSize: '15px' }}>
                        <div style={{ display: 'flex', marginBottom: '5px' }}><span style={{ width: '80px' }}>Signature</span></div>
                        <div style={{ display: 'flex', marginBottom: '5px' }}><span style={{ width: '80px' }}>Name</span><span style={{ fontWeight: 'normal' }}>{data.name}</span></div>
                        <div style={{ display: 'flex', marginBottom: '5px' }}><span style={{ width: '80px' }}>Address</span><span style={{ fontWeight: 'normal' }}>{data.village_town}, Ph: {data.mobile_number}</span></div>
                    </div>
                </div>
            </div>

            <div className="actions-bar" style={{ marginTop: '20px', borderTop: '1px solid #ccc', paddingTop: '20px' }}>
                <button className="btn btn-secondary" onClick={() => navigate('/')}>
                    ← Back to Form
                </button>
                <button className="btn btn-secondary" onClick={handlePrint}>
                    <svg style={{ width: '18px', marginRight: '6px' }} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2-2v4h10z" />
                    </svg>
                    Print Form
                </button>
                <button className="btn btn-primary" onClick={handleDownloadPDF}>
                    <svg style={{ width: '18px', marginRight: '6px' }} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                    </svg>
                    Download PDF
                </button>
            </div>
        </div>
    );
};

export default Form2;
