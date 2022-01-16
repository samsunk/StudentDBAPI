const ErrorResponse = require("../utils/errorResponse");
const Student = require("../model/student");
const asyncHandler = require("../middleware/async");
//To get the file name extension line .jpg,.png
const path = require("path");


//--------------------CREATE Student------------------

exports.createStudent = asyncHandler(async (req, res, next) => {

  const studentnew = {
    fullname : req.body.fullname,
    age : req.body.age,
    gender : req.body.gender,
    address : req.body.address,
    photo : req.body.photo,
  }
  //const student = await Student.create(req.body);
  const student = await Student.create(studentnew);

  if (!student) {
    return next(new ErrorResponse("Error adding student"), 404);
  }

  res.status(201).json({
    success: true,
    data: student,
  });
});

//-------------------Display all students

exports.getStudents = asyncHandler(async (req, res, next) => {
    const students = await Student.find({});
  
    res.status(200).json({
      success: true,
      count: students.length,
      data: students,
    });
  });

  // -----------------FIND Student BY ID-------------------

exports.getStudentById = asyncHandler(async (req, res, next) => {
    const student = await Student.findById(req.params.id);
  
    if (!student) {
      return next(new ErrorResponse("Student not found"), 404);
    }
  
    res.status(200).json({
      success: true,
      data: student,
    });
  });

  // -----------------DELETE STUDENT------------------------

exports.deleteStudent = asyncHandler(async (req, res, next) => {
    const student = await Student.findById(req.params.id);
  
    if (!student) {
      return next(new ErrorResponse(`No student found `), 404);
    }
  
    await student.remove();
  
    res.status(200).json({
      success: true,
      count: student.length,
      data: {},
    });
  });

  // ------------------UPLOAD IMAGE-----------------------

exports.StudentPhotoUpload = asyncHandler(async (req, res, next) => {
    const student = await Student.findById(req.params.id);
  
    console.log(student);
    if (!student) {
      return next(new ErrorResponse(`No student found with ${req.params.id}`), 404);
    }
  
  
    if (!req.files) {
      return next(new ErrorResponse(`Please upload a file`, 400));
    }
  
    const file = req.files.file;
  
    // Make sure the image is a photo and accept any extension of an image
    // if (!file.mimetype.startsWith("image")) {
    //   return next(new ErrorResponse(`Please upload an image`, 400));
    // }
  
    // Check file size
    if (file.size > process.env.MAX_FILE_UPLOAD) {
      return next(
        new ErrorResponse(
          `Please upload an image less than ${process.env.MAX_FILE_UPLOAD}`,
          400
        )
      );
    }
  
    file.name = `photo_${student.id}${path.parse(file.name).ext}`;
  
    file.mv(`${process.env.FILE_UPLOAD_PATH}/${file.name}`, async (err) => {
      if (err) {
        //console.err(err);
        return next(new ErrorResponse(`Problem with file upload`, 500));
      }
  
      //insert the filename into database
      await Student.findByIdAndUpdate(req.params.id, {
        photo: file.name,
      });
    });
  
    res.status(200).json({
      success: true,
      data: file.name,
    });
  });