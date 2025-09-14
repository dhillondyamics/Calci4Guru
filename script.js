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
        { name: "KAPISH MEHRA", roll: 13, grp: "G3" },
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

    if (selectedClass === 'more') {
        contentDiv.innerHTML = '<p id="coming-soon">More Classes Coming Soon</p>';
    } else if (classes[selectedClass]) {
        const students = classes[selectedClass];
        let html = '<div id="student-list">';
        students.forEach((student, index) => {
            html += `
                <div class="student-row">
                    <div class="student-info">
                        <strong>${student.name}</strong> (Roll: ${student.roll}, Group: ${student.grp})
                    </div>
                    <input type="number" class="student-marks" data-index="${index}" placeholder="Marks" min="0">
                </div>
            `;
        });
        html += '</div>';
        contentDiv.innerHTML = html;
        reportForm.style.display = 'block';
    }
});

async function createReport() {
    const selectedClass = document.getElementById('class-select').value;
    const students = classes[selectedClass];
    const marksInputs = document.querySelectorAll('.student-marks');
    const teacherName = document.getElementById('teacher-name').value;
    const testName = document.getElementById('test-name').value;
    const testDate = document.getElementById('test-date').value || new Date().toISOString().split('T')[0];
    const totalMarks = document.getElementById('total-marks').value;
    const format = document.getElementById('format-select').value;

    if (!teacherName || !testName || !totalMarks || !testDate) {
        alert('Please fill all required fields.');
        return;
    }

    const reportData = students.map((student, index) => ({
        ...student,
        marks: marksInputs[index].value || 'N/A'
    }));

    // Calculations
    const numericMarks = reportData.filter(s => s.marks !== 'N/A').map(s => Number(s.marks));
    let max = 'N/A', min = 'N/A', avg = 'N/A', performance = 'N/A';
    let maxStudents = 'N/A', minStudents = 'N/A';
    if (numericMarks.length > 0) {
        max = Math.max(...numericMarks);
        min = Math.min(...numericMarks);
        avg = (numericMarks.reduce((a, b) => a + b, 0) / numericMarks.length).toFixed(2);
        const percent = (avg / totalMarks) * 100;
        performance = percent >= 75 ? 'Good' : percent >= 50 ? 'Moderate' : 'Poor';

        maxStudents = reportData.filter(s => Number(s.marks) === max).map(s => s.name).join(', ');
        minStudents = reportData.filter(s => Number(s.marks) === min).map(s => s.name).join(', ');
    }

    // Generate preview HTML
    const reportPreview = document.getElementById('report-preview');
    let reportHTML = `
        <div class="report-header">
            <img src="logo.png" alt="School Logo" style="width: 100px;">
            <h1>SPRING DALE PUBLIC SCHOOL LUDHIANA</h1>
            <h2>${testName} Report</h2>
            <p>Class: ${selectedClass}</p>
            <p>Teacher: ${teacherName}</p>
            <p>Date of Test: ${testDate}</p>
            <p>Total Marks: ${totalMarks}</p>
        </div>
        <div class="report-table-wrapper">
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
    reportHTML += `
                </tbody>
            </table>
        </div>
        <div class="report-footer">
            <p>Max Marks: ${max} by ${maxStudents}</p>
            <p>Min Marks: ${min} by ${minStudents}</p>
            <p>Average Marks: ${avg}</p>
            <p>Performance of the Class: ${performance}</p>
        </div>
    `;
    reportPreview.innerHTML = reportHTML;

    const fileName = `Report_${testName}.${format.toLowerCase()}`;
    if (format === 'PDF') {
        await generatePDF(reportData, selectedClass, teacherName, testName, testDate, totalMarks, max, maxStudents, min, minStudents, avg, performance, fileName);
    } else if (format === 'JPEG') {
        generateJPEG(reportPreview, fileName);
    } else if (format === 'WORD') {
        await generateWORD(reportData, selectedClass, teacherName, testName, testDate, totalMarks, max, maxStudents, min, minStudents, avg, performance, fileName);
    }
}

async function generatePDF(data, className, teacher, test, date, total, max, maxStudents, min, minStudents, avg, performance, fileName) {
    const { jsPDF } = window.jspdf;
    const pdf = new jsPDF('p', 'mm', 'a4');

    // Load logo
    const logoImg = new Image();
    logoImg.src = 'logo.png';
    await new Promise((resolve) => { logoImg.onload = resolve; });
    const canvas = document.createElement('canvas');
    canvas.width = logoImg.width;
    canvas.height = logoImg.height;
    canvas.getContext('2d').drawImage(logoImg, 0, 0);
    const logoData = canvas.toDataURL('image/png');

    pdf.addImage(logoData, 'PNG', 10, 10, 40, 40); // Adjust size/position
    pdf.setFontSize(18);
    pdf.text('SPRING DALE PUBLIC SCHOOL LUDHIANA', 55, 20);
    pdf.setFontSize(14);
    pdf.text(`${test} Report`, 55, 30);
    pdf.setFontSize(12);
    pdf.text(`Class: ${className}`, 55, 40);
    pdf.text(`Teacher: ${teacher}`, 55, 45);
    pdf.text(`Date of Test: ${date}`, 55, 50);
    pdf.text(`Total Marks: ${total}`, 55, 55);

    pdf.autoTable({
        head: [['Roll', 'Name', 'Group', 'Marks']],
        body: data.map(student => [student.roll, student.name, student.grp, `${student.marks} / ${total}`]),
        startY: 60,
        margin: { top: 60 },
        styles: { fontSize: 10 },
        headStyles: { fillColor: [200, 200, 200] }
    });

    const finalY = pdf.lastAutoTable.finalY || 60;
    pdf.text(`Max Marks: ${max} by ${maxStudents}`, 10, finalY + 10);
    pdf.text(`Min Marks: ${min} by ${minStudents}`, 10, finalY + 15);
    pdf.text(`Average Marks: ${avg}`, 10, finalY + 20);
    pdf.text(`Performance of the Class: ${performance}`, 10, finalY + 25);

    const blob = pdf.output('blob');
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.download = fileName;
    link.href = url;
    link.click();
    window.open(url);
}

function generateJPEG(element, fileName) {
    element.style.display = 'block';
    element.style.position = 'absolute';
    element.style.left = '-9999px';
    element.style.width = '210mm'; // A4 width for capture

    html2canvas(element, { scale: 2, windowHeight: document.body.scrollHeight }).then(canvas => {
        const dataURL = canvas.toDataURL('image/jpeg');
        const link = document.createElement('a');
        link.download = fileName;
        link.href = dataURL;
        link.click();
        window.open(dataURL);

        element.style.display = 'none';
        element.style.position = '';
        element.style.left = '';
        element.style.width = '';
    });
}

async function generateWORD(data, className, teacher, test, date, total, max, maxStudents, min, minStudents, avg, performance, fileName) {
    const { Document, Packer, Paragraph, TextRun, Table, TableRow, TableCell, AlignmentType, WidthType } = docx;

    // Load logo as blob
    const logoBlob = await fetch('logo.png').then(res => res.blob());

    const doc = new Document({
        sections: [{
            properties: {},
            children: [
                new Paragraph({
                    children: [new docx.ImageRun({ data: logoBlob, transformation: { width: 100, height: 100 } })],
                    alignment: AlignmentType.CENTER,
                }),
                new Paragraph({
                    children: [new TextRun({ text: "SPRING DALE PUBLIC SCHOOL LUDHIANA", bold: true, size: 48 })],
                    alignment: AlignmentType.CENTER,
                }),
                new Paragraph({
                    children: [new TextRun({ text: `${test} Report`, bold: true, size: 32 })],
                    alignment: AlignmentType.CENTER,
                }),
                new Paragraph({ text: `Class: ${className}`, size: 24, alignment: AlignmentType.CENTER }),
                new Paragraph({ text: `Teacher: ${teacher}`, size: 24, alignment: AlignmentType.CENTER }),
                new Paragraph({ text: `Date of Test: ${date}`, size: 24, alignment: AlignmentType.CENTER }),
                new Paragraph({ text: `Total Marks: ${total}`, size: 24, alignment: AlignmentType.CENTER }),
                new Table({
                    rows: [
                        new TableRow({
                            children: [
                                new TableCell({ children: [new Paragraph("Roll")] }),
                                new TableCell({ children: [new Paragraph("Name")] }),
                                new TableCell({ children: [new Paragraph("Group")] }),
                                new TableCell({ children: [new Paragraph("Marks")] }),
                            ],
                        }),
                        ...data.map(student => new TableRow({
                            children: [
                                new TableCell({ children: [new Paragraph(student.roll.toString())] }),
                                new TableCell({ children: [new Paragraph(student.name)] }),
                                new TableCell({ children: [new Paragraph(student.grp)] }),
                                new TableCell({ children: [new Paragraph(`${student.marks} / ${total}`)] }),
                            ],
                        })),
                    ],
                    width: { size: 100, type: WidthType.PERCENTAGE },
                }),
                new Paragraph({ text: `Max Marks: ${max} by ${maxStudents}`, size: 24 }),
                new Paragraph({ text: `Min Marks: ${min} by ${minStudents}`, size: 24 }),
                new Paragraph({ text: `Average Marks: ${avg}`, size: 24 }),
                new Paragraph({ text: `Performance of the Class: ${performance}`, size: 24 }),
            ],
        }],
    });

    const blob = await Packer.toBlob(doc);
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.download = fileName;
    link.href = url;
    link.click();
    window.open(url);
}