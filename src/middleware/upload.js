import multer from 'multer';

const storage = multer.memoryStorage();

const fileFilter = (req, file, cb) => {
  const isXlsx =
    file.originalname.endsWith('.xlsx') ||
    file.mimetype ===
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet';

  if (isXlsx) {
    cb(null, true);
  } else {
    cb(new Error('Разрешены только файлы с расширением .xlsx'), false);
  }
};

const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: { fileSize: 10 * 1024 * 1024 },
});

export default upload;
