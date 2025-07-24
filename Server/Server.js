const express = require('express');
const cors = require('cors');
const multer = require('multer');
const path = require('path');

const app = express();
const upload = multer({ dest: 'uploads/' });

app.use(cors());
app.use(express.json());

// 🔥 Serve uploaded files statically
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

app.post('/submit-form', (req, res) => {
  console.log('Received data:', req.body);
  res.json({ success: true, data: req.body });
});

app.post('/upload', upload.single('file'), (req, res) => {
  res.json({ success: true, filePath: `uploads/${req.file.filename}` });

});

app.listen(5000, () => console.log('Server running on port 5000'));
