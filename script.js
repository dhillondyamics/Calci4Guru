const classes = {
    "XII Non Medical": [
        { name: "AASHI VERMA", roll: 1, grp: "G1" },
        { name: "ADITYA JOSHI", roll: 2, grp: "G1" },
        { name: "ADITYA KUMAR CHAUDHARY", roll: 3, grp: "G1" },
        { name: "ADITYA SHARMA", roll: 4, grp: "G1" },
        { name: "ANKIT SINGH GUSSAIN", roll: 5, grp: "G1" },
        { name: "ASHMRITI KUMARI", roll: 6, grp: "G1" },
        { name: "EKSAROOP SINGH KAILEY", roll: 7, grp: "G2" },
        { name: "GURSIMRAN KAUR", roll: 8, grp: "G2" },
        { name: "HANSIKA CHAWLA", roll: 9, grp: "G2" },
        { name: "HARSH", roll: 10, grp: "G3" },
        { name: "HARSHITA", roll: 11, grp: "G2" },
        { name: "JAPMAN SINGH", roll: 12, grp: "G2" },
        { name: "KAPSIH MEHRA", roll: 13, grp: "G3" },
        { name: "KEERATSINGH DHILLON", roll: 14, grp: "G3" },
        { name: "PARTIKSHA SHARMA", roll: 15, grp: "G3" },
        { name: "PARV SHARMA", roll: 16, grp: "G4" },
        { name: "PARVEEN BHATT", roll: 17, grp: "G4" },
        { name: "PRIYA", roll: 18, grp: "G3" },
        { name: "PRIYANSHU KUSHWAHA", roll: 19, grp: "G5" },
        { name: "PRIYANSHU SINGH RAJPUT", roll: 20, grp: "G5" },
        { name: "SAMARJOT SINGH", roll: 21, grp: "G4" },
        { name: "SAMEER SHUKLA", roll: 22, grp: "G4" },
        { name: "SARABJEET KUMAR", roll: 23, grp: "G5" },
        { name: "SARTHAK BHARDWAJ", roll: 24, grp: "G4" },
        { name: "SHOUBIT SHARMA", roll: 25, grp: "G4" },
        { name: "TANIYA SHARMA", roll: 26, grp: "G5" }
    ]
};

document.getElementById('class-select').addEventListener('change', (e) => {
    const selectedClass = e.target.value;
    const contentDiv = document.getElementById('content');
    const reportForm = document.getElementById('report-form');
    contentDiv.innerHTML = '';
    reportForm.style.display = 'none';

    if (selectedClass === 'other') {
        contentDiv.innerHTML = '<p id="coming-soon">OTHER CLASSES COMING SOON</p>';
    } else if (classes[selectedClass]) {
        const students = classes[selectedClass];
        let html = '<div id="student-list">';
        students.forEach((student, index) => {
            html += `
                <div class="student-row">
                    <div class="student-info">
                        <strong>${student.name}</strong> (Roll: ${student.roll}, Group: ${student.grp})
                    </div>
                    <input type="number" class="student-marks" data-index="${index}" placeholder="Marks">
                </div>
            `;
        });
        html += '</div>';
        contentDiv.innerHTML = html;
        reportForm.style.display = 'block';
    }
});

function createReport() {
    const selectedClass = document.getElementById('class-select').value;
    const students = classes[selectedClass];
    const marksInputs = document.querySelectorAll('.student-marks');
    const teacherName = document.getElementById('teacher-name').value;
    const testName = document.getElementById('test-name').value;
    const totalMarks = document.getElementById('total-marks').value;
    const format = document.getElementById('format-select').value;

    if (!teacherName || !testName || !totalMarks) {
        alert('Please fill all fields.');
        return;
    }

    const reportData = students.map((student, index) => ({
        ...student,
        marks: marksInputs[index].value || 'N/A'
    }));

    // Generate report HTML for preview and PDF/JPEG
    const reportPreview = document.getElementById('report-preview');
    let reportHTML = `
        <div class="report-header">
            <img src="https://via.placeholder.com/150?text=School+Logo" alt="School Logo" style="width: 100px;">
            <h1>SPRING DALE PUBLIC SCHOOL</h1>
            <h2>${testName} Report</h2>
            <p>Class: ${selectedClass}</p>
            <p>Teacher: ${teacherName}</p>
            <p>Total Marks: ${totalMarks}</p>
            <p>Date: ${new Date().toLocaleDateString()}</p>
        </div>
        <table class="report-table">
            <thead>
                <tr>
                    <th>Roll</th>
                    <th>Name</th>
                    <th>Group</th>
                    <th>Marks</th>
                </tr>
            </thead>
            <tbody>
    `;
    reportData.forEach(student => {
        reportHTML += `
            <tr>
                <td>${student.roll}</td>
                <td>${student.name}</td>
                <td>${student.grp}</td>
                <td>${student.marks} / ${totalMarks}</td>
            </tr>
        `;
    });
    reportHTML += '</tbody></table>';
    reportPreview.innerHTML = reportHTML;

    // Generate and download based on format
    const fileName = `Report_${testName}.${format.toLowerCase()}`;
    if (format === 'PDF') {
        generatePDF(reportPreview, fileName);
    } else if (format === 'JPEG') {
        generateJPEG(reportPreview, fileName);
    } else if (format === 'WORD') {
        generateWORD(reportData, selectedClass, teacherName, testName, totalMarks, fileName);
    }
}

function generatePDF(element, fileName) {
    // Temporarily show off-screen for capture
    element.style.display = 'block';
    element.style.position = 'absolute';
    element.style.left = '-99999px';

    html2canvas(element).then(canvas => {
        const imgData = canvas.toDataURL('image/png');
        const pdf = new jspdf.jsPDF();
        const imgProps = pdf.getImageProperties(imgData);
        const pdfWidth = pdf.internal.pageSize.getWidth();
        const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;
        pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
        const blob = pdf.output('blob');
        const url = URL.createObjectURL(blob);

        // Download
        const link = document.createElement('a');
        link.download = fileName;
        link.href = url;
        link.click();

        // Preview in new tab
        window.open(url);

        // Reset element
        element.style.display = 'none';
        element.style.position = '';
        element.style.left = '';
    });
}

function generateJPEG(element, fileName) {
    // Temporarily show off-screen for capture
    element.style.display = 'block';
    element.style.position = 'absolute';
    element.style.left = '-99999px';

    html2canvas(element).then(canvas => {
        const dataURL = canvas.toDataURL('image/jpeg');

        // Download
        const link = document.createElement('a');
        link.download = fileName;
        link.href = dataURL;
        link.click();

        // Preview in new tab
        window.open(dataURL);

        // Reset element
        element.style.display = 'none';
        element.style.position = '';
        element.style.left = '';
    });
}

function generateWORD(data, className, teacher, test, total, fileName) {
    const doc = new docx.Document({
        sections: [{
            properties: {},
            children: [
                new docx.Paragraph({
                    children: [
                        new docx.TextRun({ text: "SPRING DALE PUBLIC SCHOOL", bold: true, size: 48, break: 1 }),
                        new docx.TextRun({ text: `${test} Report`, bold: true, size: 32, break: 1 }),
                        new docx.TextRun({ text: `Class: ${className}`, size: 24, break: 1 }),
                        new docx.TextRun({ text: `Teacher: ${teacher}`, size: 24, break: 1 }),
                        new docx.TextRun({ text: `Total Marks: ${total}`, size: 24, break: 1 }),
                        new docx.TextRun({ text: `Date: ${new Date().toLocaleDateString()}`, size: 24, break: 1 }),
                    ],
                    alignment: docx.AlignmentType.CENTER,
                }),
                new docx.Table({
                    rows: [
                        new docx.TableRow({
                            children: [
                                new docx.TableCell({ children: [new docx.Paragraph("Roll")] }),
                                new docx.TableCell({ children: [new docx.Paragraph("Name")] }),
                                new docx.TableCell({ children: [new docx.Paragraph("Group")] }),
                                new docx.TableCell({ children: [new docx.Paragraph("Marks")] }),
                            ],
                        }),
                        ...data.map(student => new docx.TableRow({
                            children: [
                                new docx.TableCell({ children: [new docx.Paragraph(student.roll.toString())] }),
                                new docx.TableCell({ children: [new docx.Paragraph(student.name)] }),
                                new docx.TableCell({ children: [new docx.Paragraph(student.grp)] }),
                                new docx.TableCell({ children: [new docx.Paragraph(`${student.marks} / ${total}`)] }),
                            ],
                        })),
                    ],
                    width: { size: 100, type: docx.WidthType.PERCENTAGE },
                }),
            ],
        }],
    });

    docx.Packer.toBlob(doc).then(blob => {
        const url = URL.createObjectURL(blob);

        // Download
        const link = document.createElement('a');
        link.download = fileName;
        link.href = url;
        link.click();

        // Preview in new tab (browser may download if it can't preview DOCX)
        window.open(url);
    });
}