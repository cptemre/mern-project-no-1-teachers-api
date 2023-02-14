const Teachers = require("../models/Teachers");
const { Bad_Request, Unauthorized } = require("../errors");

// ! TEACHER CAN UPDATE ITSELF BUT ADMIN CAN UPDATE ALL OF THEM
const updateTeacher = async (req, res) => {
  const { teacherID, access_token } = req.user;
  const teacher = await Teachers.updateOne({ _id: teacherID }, req.body, {
    runValidators: true,
    new: true,
  });
  if (teacher.modifiedCount) {
    res.status(200).json({ msg: "TEACHER SUCCESSFULLY UPDATED", access_token });
  }
  throw new Bad_Request("TEACHER COULD NOT UPDATED");
};

const deleteTeacher = async (req, res) => {
  const { email, access_token } = req.user;
  const { teacherEmail } = req.params;
  if (email === "admin@gmail.com") {
    const teacher = await Teachers.deleteOne({ email: teacherEmail });
    if (teacher.deletedCount) {
      res
        .status(200)
        .json({ msg: "TEACHER SUCCESSFULLY DELETED", access_token });
    }
    throw new Bad_Request("TEACHER COULD NOT DELETED");
  }
  // THROW ERROR IF IT IS NOT AN ADMIN
  throw new Unauthorized("YOU DO NOT HAVE ACCESS TO DELETE A TEACHER");
};

const getAllTeachers = async (req, res) => {
  const { email, access_token } = req.user;
  if (email === "admin@gmail.com") {
    const teacher = await Teachers.find();
    if (teacher.length) {
      res.status(200).json({ teacher, access_token });
    } else {
      throw new Bad_Request("THERE ARE NO TEACHERS IN DATABASE");
    }
  } else {
    throw new Unauthorized("YOU DO NOT HAVE ACCESS TO SEE OTHER TEACHERS");
  }
};

const getSingleTeacher = async (req, res) => {
  const { email, access_token } = req.user;
  const { teacherEmail } = req.params;
  if (email === "admin@gmail.com") {
    const teacher = await Teachers.findOne({ email: teacherEmail });
    if (teacher) {
      res.status(200).json({ teacher, access_token });
    } else {
      throw new Bad_Request(`${teacherEmail} IS NOT IN OUR DATABASE`);
    }
  } else {
    throw new Unauthorized("YOU DO NOT HAVE ACCESS TO SEE OTHER TEACHERS");
  }
};

module.exports = {
  updateTeacher,
  deleteTeacher,
  getAllTeachers,
  getSingleTeacher,
};