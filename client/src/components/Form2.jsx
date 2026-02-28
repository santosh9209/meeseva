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

        // DETAILS OF PROPERTY (AGRICULTURAL) section
        centerText('DETAILS OF PROPERTY (AGRICULTURAL) / ఆస్తి వివరములు (వ్యవసాయ భూమి)', 60, 11, true);

        // Agricultural Table
        doc.autoTable({
            startY: 65,
            theme: 'plain',
            styles: {
                font: 'helvetica',
                fontSize: 10,
                textColor: [0, 0, 0],
                lineColor: [0, 0, 0],
                lineWidth: 0.5,
            },
            body: [
                [
                    { content: 'Village / Town Name\nగ్రామము/పట్టణము పేరు', rowSpan: 2 },
                    { content: data.village_town || '', rowSpan: 2 },
                    { content: 'Sy. No.\nసర్వే నెం.', rowSpan: 2 },
                    { content: data.survey_number || '', rowSpan: 2 },
                    { content: 'Classification\nవర్గీకరణ' },
                    { content: data.classification || '' }
                ],
                [
                    { content: 'Door No. / Habitation Name\nఇంటి నంబరు / నివాస స్థలము' },
                    { content: data.doorNumber || '' }
                ],
                [
                    { content: 'Extent\nవిస్తీర్ణము' },
                    { content: data.extent || '' },
                    { content: 'Nature of use\nఏ ఉపయోగమునకు వర్తించు' },
                    { content: data.nature_of_use || '', colSpan: 3 }
                ]
            ],
            margin: { left: 15, right: 15 }
        });

        // Dummy Structure Table (empty like screenshot)
        centerText('DETAILS OF STRUCTURE / కట్టడముల వివరములు', doc.lastAutoTable.finalY + 8, 11, true);
        doc.autoTable({
            startY: doc.lastAutoTable.finalY + 12,
            theme: 'plain',
            styles: { font: 'helvetica', fontSize: 8, textColor: [0, 0, 0], lineColor: [0, 0, 0], lineWidth: 0.5, halign: 'center' },
            head: [
                [
                    { content: 'Flat (y/n)\nఫ్లాట్ (అ/కా)', colSpan: 1 },
                    { content: 'Name of Apartment\nఅపార్ట్మెంట్ పేరు', colSpan: 2 },
                    { content: 'Flat No.\nఫ్లాట్ నెం.', colSpan: 2 },
                    { content: 'Total No. of Floors\nమొత్తం అంతస్తులు', colSpan: 2 }
                ],
                [
                    { content: 'Floor No.\nఅంతస్తు నెం.', colSpan: 1 },
                    { content: 'Type of Structure\nకట్టడముల స్వభావము', colSpan: 2 },
                    { content: 'Plinth Area in Sft./\nకట్టడపు వైశాల్యము(చ.అ.)', colSpan: 2 },
                    { content: 'Stage of Construction\nనిర్మాణ దశ', colSpan: 2 },
                    { content: 'Age of the Building in Years\nకట్టడముల వయస్సు సంవత్సరములలో', colSpan: 2 }
                ]
            ],
            body: [
                ['1', '', '', data.floorArea1 || '', '', '', '', data.numberOfFloors || ''],
                ['2', '', '', data.floorArea2 || '', '', '', '', ''],
                ['3', '', '', data.floorArea3 || '', '', '', '', ''],
                ['4', '', '', data.floorArea4 || '', '', '', '', '']
            ],
            margin: { left: 15, right: 15 }
        });

        const finalY = doc.lastAutoTable.finalY + 8;

        const afterAppY = finalY + 10;

        // Footer lines
        doc.setLineWidth(0.5);
        doc.line(15, afterAppY, pageWidth - 15, afterAppY);

        // Format Date safely
        let formattedDate = '';
        if (data.date) {
            const dateObj = new Date(data.date);
            formattedDate = dateObj.toLocaleDateString('en-GB'); // DD/MM/YYYY
        }

        doc.text(`Date / తేది. : ${formattedDate}`, 15, afterAppY + 5);
        doc.text('Signature', 140, afterAppY + 5);

        // Applicant Details Below Signature (Right Side)
        doc.text(`${data.name || ''}`, 130, afterAppY + 12);
        doc.text(`S/o, D/o: ${data.father_name || ''}`, 130, afterAppY + 18);
        doc.text(`Ph: ${data.mobile_number || ''}`, 130, afterAppY + 24);

        // Bottom left summary
        doc.text('Village', 15, afterAppY + 15);
        doc.text(`:   ${data.village_town}`, 40, afterAppY + 15);

        doc.text('Sy.No.', 15, afterAppY + 21);
        doc.text(`:   ${data.survey_number}`, 40, afterAppY + 21);

        doc.text('Extent', 15, afterAppY + 27);
        doc.text(`:   ${data.extent}`, 40, afterAppY + 27);

        doc.text('Classification', 15, afterAppY + 33);
        doc.text(`:   ${data.classification}`, 40, afterAppY + 33);

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
                    DETAILS OF PROPERTY (AGRICULTURAL) / <span className="telugu-text">ఆస్తి వివరములు (వ్యవసాయ భూమి)</span>
                </div>

                <table className="card-complex-table">
                    <tbody>
                        <tr>
                            <td className="th-like top-border">Village / Town Name<br /><span className="telugu-text">గ్రామము/పట్టణము పేరు</span></td>
                            <td className="val-cell top-border">{data.village_town}</td>
                            <td className="th-like top-border">Sy. No.<br /><span className="telugu-text">సర్వే నెం.</span></td>
                            <td className="val-cell top-border">{data.survey_number}</td>
                            <td className="th-like no-bottom-border top-border">Classification<br /><span className="telugu-text">వర్గీకరణ</span></td>
                            <td className="val-cell no-bottom-border top-border">{data.classification}</td>
                        </tr>
                        <tr>
                            <td className="th-like">Extent<br /><span className="telugu-text">విస్తీర్ణము</span></td>
                            <td className="val-cell">{data.extent}</td>
                            <td className="th-like">Nature of use<br /><span className="telugu-text">ఏ ఉపయోగమునకు వర్తించు</span></td>
                            <td className="val-cell">{data.nature_of_use}</td>
                            <td className="th-like top-border">Door No. / Habitation Name<br /><span className="telugu-text">ఇంటి నంబరు / నివాస స్థలము</span></td>
                            <td className="val-cell top-border">{data.doorNumber || ''}</td>
                        </tr>
                    </tbody>
                </table>

                {/* Structure Block Empty */}
                <div className="section-title-bar mt-4">
                    DETAILS OF STRUCTURE / <span className="telugu-text">కట్టడముల వివరములు</span>
                </div>
                <table className="card-complex-table">
                    <tbody>
                        <tr>
                            <td className="text-center">Flat (y/n)<br /><span className="telugu-text">ఫ్లాట్ (అ/కా)</span></td>
                            <td>Name of Apartment<br /><span className="telugu-text">అపార్ట్మెంట్ పేరు</span></td>
                            <td className="text-center" colSpan={2}>Flat No.<br /><span className="telugu-text">ఫ్లాట్ నెం.</span></td>
                            <td className="text-center" colSpan={2}>Total No. of Floors<br /><span className="telugu-text">మొత్తం అంతస్తులు</span></td>
                        </tr>
                        <tr className="sub-headers">
                            <td className="text-center">Floor No.<br /><span className="telugu-text">అంతస్తు నెం.</span></td>
                            <td className="text-center">Type of Structure<br /><span className="telugu-text">కట్టడముల స్వభావము</span></td>
                            <td className="text-center">Plinth Area in Sft./<br /><span className="telugu-text">కట్టడపు వైశాల్యము(చ.అ.)</span></td>
                            <td className="text-center" colSpan={2}>Stage of Construction<br /><span className="telugu-text">నిర్మాణ దశ</span></td>
                            <td className="text-center">Age of the Building in Years<br /><span className="telugu-text">కట్టడముల వయస్సు సంవత్సరములలో</span></td>
                        </tr>
                        <tr style={{ height: '25px', textAlign: 'center' }}>
                            <td>1</td>
                            <td></td>
                            <td>{data.floorArea1 || ''}</td>
                            <td colSpan={2}></td>
                            <td>{data.numberOfFloors || ''}</td>
                        </tr>
                        <tr style={{ height: '25px', textAlign: 'center' }}>
                            <td>2</td>
                            <td></td>
                            <td>{data.floorArea2 || ''}</td>
                            <td colSpan={2}></td>
                            <td></td>
                        </tr>
                        <tr style={{ height: '25px', textAlign: 'center' }}>
                            <td>3</td>
                            <td></td>
                            <td>{data.floorArea3 || ''}</td>
                            <td colSpan={2}></td>
                            <td></td>
                        </tr>
                        <tr style={{ height: '25px', textAlign: 'center' }}>
                            <td>4</td>
                            <td></td>
                            <td>{data.floorArea4 || ''}</td>
                            <td colSpan={2}></td>
                            <td></td>
                        </tr>
                    </tbody>
                </table>

                <div className="card-signature-area mt-4">
                    <div className="left-sig">
                        Date / <span className="telugu-text">తేది.</span> : {formattedDate}
                    </div>
                    <div className="right-sig" style={{ textAlign: 'center', width: '250px' }}>
                        Signature<br /><br />
                        <div style={{ textAlign: 'left', marginTop: '10px' }}>
                            {data.name}<br />
                            S/o, D/o: {data.father_name}<br />
                            Ph: {data.mobile_number}
                        </div>
                    </div>
                </div>

                <div className="card-summary-bottom" style={{ marginTop: '-70px' }}>
                    <table className="summary-print-table">
                        <tbody>
                            <tr>
                                <td style={{ width: '120px' }}>Village</td>
                                <td>: {data.village_town}</td>
                            </tr>
                            <tr>
                                <td>Sy.No.</td>
                                <td>: {data.survey_number}</td>
                            </tr>
                            <tr>
                                <td>Extent</td>
                                <td>: {data.extent}</td>
                            </tr>
                            <tr>
                                <td>Classification</td>
                                <td>: {data.classification}</td>
                            </tr>
                        </tbody>
                    </table>
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
