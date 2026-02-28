import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { jsPDF } from 'jspdf';
import 'jspdf-autotable';

const Form2 = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchRequisition = async () => {
            try {
                const response = await axios.get(`/api/requisitions/${id}`);
                if (response.data.success) {
                    setData(response.data.data);
                }
            } catch (err) {
                console.error('Error fetching data:', err);
                setError('Failed to load requisition data. Ensure the backend is running.');
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
        doc.setFontSize(36);
        centerText('CARD', 20, 36, true);
        centerText('(Computer - aided Administration of Registration Department)', 26, 8, false);
        centerText('Visit us at : http://registration.telangana.gov.in', 31, 9, true);

        centerText('REQUISITION FORM / అభ్యర్ధన దరఖాస్తు', 40, 14, true);
        centerText('(for Assistance on Market Value/Chargeability) / (మార్కెట్ విలువ/డ్యూటీ చెల్లింపు సహాయము కొరకు)', 46, 11, true);
        centerText('Nature of Transaction / దస్తావేజు స్వభావము', 52, 12, true);

        // Transaction Code row
        doc.setFontSize(10);
        doc.setFont('helvetica', 'normal');
        doc.text('Transaction Code', 20, 60);
        doc.text('దస్తావేజు కోడ్ నెం.', 20, 64);

        // Boxes for code
        doc.setLineWidth(0.5);
        doc.rect(50, 56, 20, 8);
        doc.text('01', 58, 62);
        doc.rect(80, 56, 20, 8);
        doc.text('01', 88, 62);

        doc.text('Name of the Transaction\nదస్తావేజు పేరు', 105, 59);
        doc.rect(140, 56, 50, 8);
        doc.text('Sale Deed', 152, 62);

        // DETAILS OF PROPERTY (AGRICULTURAL) section
        centerText('DETAILS OF PROPERTY (AGRICULTURAL) / ఆస్తి వివరములు (వ్యవసాయ భూమి)', 75, 12, true);

        // Agricultural Table
        doc.autoTable({
            startY: 80,
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
                    { content: 'Habitation Name\nనివాస స్థలము' },
                    { content: '' } // blank for now
                ],
                [
                    { content: 'Units\nయూనిట్స్' },
                    { content: data.units || '' },
                    { content: 'Nature of use\nఏ ఉపయోగమునకు వర్తించు' },
                    { content: data.nature_of_use || '', colSpan: 3 }
                ]
            ],
            margin: { left: 15, right: 15 }
        });

        // Dummy Structure Table (empty like screenshot)
        centerText('DETAILS OF STRUCTURE / కట్టడముల వివరములు', doc.lastAutoTable.finalY + 10, 12, true);
        doc.autoTable({
            startY: doc.lastAutoTable.finalY + 15,
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
                ['', '', '', '', '', '', '', ''],
                ['', '', '', '', '', '', '', ''],
                ['', '', '', '', '', '', '', '']
            ],
            margin: { left: 15, right: 15 }
        });

        const finalY = doc.lastAutoTable.finalY + 10;

        doc.setFontSize(10);
        // Applicant Details Below Structure
        doc.text('Applicant Name / దరఖాస్తుదారు పేరు:', 15, finalY);
        doc.text(data.name || '', 80, finalY);

        doc.text('Father\'s Name / తండ్రి పేరు:', 15, finalY + 6);
        doc.text(data.father_name || '', 80, finalY + 6);

        doc.text('Mobile Number / మొబైల్ నెంబర్:', 15, finalY + 12);
        doc.text(data.mobile_number || '', 80, finalY + 12);

        const afterAppY = finalY + 25;

        // Footer lines
        doc.setLineWidth(0.5);
        doc.line(15, afterAppY, pageWidth - 15, afterAppY);

        doc.text('Date / తేది.', 15, afterAppY + 5);
        doc.text('Signature', 130, afterAppY + 5);
        doc.text('Name', 130, afterAppY + 12);
        doc.text('Address', 130, afterAppY + 19);


        // Format Date safely
        let formattedDate = '';
        if (data.date) {
            const dateObj = new Date(data.date);
            formattedDate = dateObj.toLocaleDateString('en-GB'); // DD/MM/YYYY
        }

        doc.text(`Date : ${formattedDate}`, 15, afterAppY + 15);

        // Bottom left summary
        doc.text('Village', 15, afterAppY + 30);
        doc.text(`:   ${data.village_town}`, 40, afterAppY + 30);

        doc.text('Sy.No.', 15, afterAppY + 36);
        doc.text(`:   ${data.survey_number}`, 40, afterAppY + 36);

        doc.text('Extent', 15, afterAppY + 42);
        doc.text(`:   ${data.extent}`, 40, afterAppY + 42);

        doc.text('Classification', 15, afterAppY + 48);
        doc.text(`:   ${data.classification}`, 40, afterAppY + 48);

        doc.save(`CARD_Requisition_${data.id}.pdf`);
    };

    if (loading) return <div className="loading-spinner">Loading form data...</div>;
    if (error) return <div className="loading-spinner" style={{ color: 'red' }}>{error}</div>;
    if (!data) return <div className="loading-spinner">No data found.</div>;

    // Format Date for view
    const formattedDate = new Date(data.date).toLocaleDateString('en-GB');

    return (
        <div className="requisition-wrapper">
            <div className="actions-bar">
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
                            <td className="th-like">Units<br /><span className="telugu-text">యూనిట్స్</span></td>
                            <td className="val-cell">{data.units}</td>
                            <td className="th-like">Nature of use<br /><span className="telugu-text">ఏ ఉపయోగమునకు వర్తించు</span></td>
                            <td className="val-cell">{data.nature_of_use}</td>
                            <td className="th-like top-border">Habitation Name<br /><span className="telugu-text">నివాస స్థలము</span></td>
                            <td className="val-cell top-border"></td>
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
                        <tr style={{ height: '25px' }}><td></td><td></td><td></td><td colSpan={2}></td><td></td></tr>
                        <tr style={{ height: '25px' }}><td></td><td></td><td></td><td colSpan={2}></td><td></td></tr>
                        <tr style={{ height: '25px' }}><td></td><td></td><td></td><td colSpan={2}></td><td></td></tr>
                    </tbody>
                </table>

                {/* Applicant Details Below Structure */}
                <div style={{ marginTop: '15px' }}>
                    <table style={{ width: '60%', borderCollapse: 'collapse', fontSize: '0.9rem', fontWeight: 'bold' }}>
                        <tbody>
                            <tr>
                                <td style={{ padding: '4px 0', width: '250px' }}>Applicant Name / <span className="telugu-text" style={{ fontWeight: 'normal' }}>దరఖాస్తుదారు పేరు</span></td>
                                <td>: {data.name}</td>
                            </tr>
                            <tr>
                                <td style={{ padding: '4px 0' }}>Father's Name / <span className="telugu-text" style={{ fontWeight: 'normal' }}>తండ్రి పేరు</span></td>
                                <td>: {data.father_name}</td>
                            </tr>
                            <tr>
                                <td style={{ padding: '4px 0' }}>Mobile Number / <span className="telugu-text" style={{ fontWeight: 'normal' }}>మొబైల్ నెంబర్</span></td>
                                <td>: {data.mobile_number}</td>
                            </tr>
                        </tbody>
                    </table>
                </div>

                <div className="card-signature-area mt-4">
                    <div className="left-sig">
                        Date / <span className="telugu-text">తేది.</span>
                    </div>
                    <div className="right-sig">
                        Signature
                    </div>
                </div>

                <div className="card-summary-bottom">
                    <table className="summary-print-table">
                        <tbody>
                            <tr>
                                <td style={{ width: '120px' }}>Date</td>
                                <td>: {formattedDate}</td>
                            </tr>
                            <tr><td colSpan={2} style={{ height: '20px' }}></td></tr>
                            <tr>
                                <td>Village</td>
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
                    <div className="right-address">
                        <p>Name</p>
                        <br />
                        <p>Address</p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Form2;
