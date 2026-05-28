import multer from "multer";

import {
  CloudinaryStorage,
} from "multer-storage-cloudinary";

import cloudinary
from "../config/cloudinary.js";

// ======================================
// STORAGE
// ======================================
const storage =
new CloudinaryStorage({

  cloudinary,

  params: async (
    req,
    file
  ) => ({

    folder:
    "placementhub-resumes",

    resource_type:
    "auto",

    public_id:
    `${Date.now()}-${file.originalname}`,
  }),
});

// ======================================
// MULTER
// ======================================
const upload =
multer({

  storage,

  limits: {

    fileSize:
    5 * 1024 * 1024,
  },

  fileFilter: (
    req,
    file,
    cb
  ) => {

    if (
      file.mimetype ===
      "application/pdf"
    ) {

      cb(null, true);

    } else {

      cb(
        new Error(
          "Only PDF files allowed"
        ),

        false
      );
    }
  },
});

export default upload;