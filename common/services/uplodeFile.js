const multer = require('multer');

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    console.log('******1');
    cb(null, 'uploads')
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9)
    console.log('******2');
    cb(null, uniqueSuffix + '-' + file.originalname  )
  }
})

const upload = multer({ storage: storage })

module.exports = {upload};

// const path = require('path');
// path.join(__dirname, '../../uploads')
// new Date().toISOString().replace(/:/g, "-") 