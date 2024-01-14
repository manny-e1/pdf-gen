import express from 'express';
import puppeteer from 'puppeteer';
import fs from 'node:fs/promises';
import cors from 'cors';
const app = express();

const reqBody = {
  name: '',
  aboutMe: '',
  workHistory: '',
  education: '',
};

app.use(express.json());
app.use(cors());

app.post('/details', async (req, res) => {
  const { name, aboutMe, workHistory, education } = req.body;
  reqBody.name = name ?? '';
  reqBody.aboutMe = aboutMe ?? '';
  reqBody.workHistory = workHistory ?? '';
  reqBody.education = education ?? '';
  res.status(201).json({ message: 'success' });
});

app.get('/generate-pdf', async (req, res) => {
  const templateName = req.query.template;
  if (!templateName) {
    console.error('Error generating PDF:', error);
    res.status(400).json({ error: 'No template name provided' });
  }
  const htmlContent = (
    await fs.readFile(`templates/${templateName}.html`, 'utf8')
  )
    .replace('-NAME-', reqBody.name)
    .replace('-ABOUTME-', reqBody.aboutMe)
    .replace('-WORK-', reqBody.workHistory)
    .replace('-EDUCATION-', reqBody.education);

  try {
    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    await page.setContent(htmlContent);
    const pdfBuffer = await page.pdf({ format: 'A4' });
    res.setHeader('Content-Length', pdfBuffer.length);
    res.setHeader('Content-Disposition', 'inline; filename=resume.pdf');
    res.setHeader('Content-Type', 'application/pdf');
    res.send(pdfBuffer);
    await browser.close();
  } catch (error) {
    console.error('Error generating PDF:', error);
    res.status(500).json({ error: 'Error generating PDF' });
  }
});

const port = 5000;
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
