const Teachers = require("../models/Teachers");
const { Bad_Request, Unauthorized } = require("../errors");
const bcrypt = require("bcryptjs");
// ! TEACHER CAN UPDATE ITSELF BUT ADMIN CAN UPDATE ALL OF THEM
const updateTeacher = async (req, res) => {
  const { access_token } = req.user;
  const { _id } = req.params;
  // CRYPT PASSWORD IF CHANGED
  let { password } = req.body;
  if (password) {
    const salt = await bcrypt.genSalt(10);
    password = await bcrypt.hash(password, salt);
    req.body.password = await password;
  }
  const teacher = await Teachers.updateOne({ _id }, req.body, {
    runValidators: true,
    new: true,
  });
  if (teacher.modifiedCount) {
    res.status(200).json({ msg: "UPDATED", access_token });
  } else {
    throw new Bad_Request("TEACHER COULD NOT UPDATED");
  }
};

const deleteTeacher = async (req, res) => {
  const { email, access_token } = req.user;
  const { _id } = req.params;
  if (email === "admin@ga.pl") {
    const teacher = await Teachers.deleteOne({ _id });
    if (teacher.deletedCount) {
      res.status(200).json({ msg: "DELETED", access_token });
    } else {
      throw new Bad_Request("TEACHER COULD NOT DELETED");
    }
  } else {
    // THROW ERROR IF IT IS NOT AN ADMIN
    throw new Unauthorized("AUTHORIZATION DENIED");
  }
};

const getAllTeachers = async (req, res) => {
  // IF THERE IS A QUERY ADD IT TO QUERY OBJECT TO FIND
  const { name, surname, email, branches, createdAt, sortValue, pageValue } =
    req.query;
  const query = {};
  if (name) {
    query.name = name;
  }
  if (surname) {
    query.surname = surname;
  }
  if (email) {
    query.email = email;
  }
  if (branches) {
    query.branches = branches;
  }
  if (createdAt) {
    // CREATE 24H DATE SPACE TO FIND
    let splitDate = createdAt.split("-");

    if (splitDate.length === 2) {
      splitDate = splitDate[2] + "," + splitDate[1] + "," + splitDate[0];
    }
    const dateStart = new Date(
      Number(splitDate[2]),
      Number(splitDate[1]) - 1,
      Number(splitDate[0])
    );
    const dateEnd = new Date(
      Number(splitDate[2]),
      Number(splitDate[1]) - 1,
      Number(splitDate[0]) + 1
    );
    query.createdAt = { $gte: dateStart, $lte: dateEnd };
  }

  const accounts = Teachers.find(query).select("-password");

  let sortSplit;
  if (sortValue) {
    sortSplit = sortValue.split("_");
  }
  if (sortSplit && sortSplit[0] === "date") sortSplit[0] = "createdAt";

  if (sortSplit) {
    sortSplit = { [sortSplit[0]]: Number(sortSplit[1]) };
  }
  const sort = sortSplit || { createdAt: 1 };
  const page = pageValue || 1;
  let limit;
  if (page) {
    limit = 10;
  }
  const skip = (page - 1) * 10;
  const result = await accounts.sort(sort).skip(skip).limit(skip);
  res.status(200).json(result);
};

const getSingleTeacher = async (req, res) => {
  const { access_token } = req.user;
  const { _id } = req.params;
  const result = await Teachers.findOne({ _id }).select("-password");
  if (result) {
    res.status(200).json({ result, access_token, teacher: true });
  } else {
    throw new Bad_Request(`${_id} IS NOT IN OUR DATABASE`);
  }
};

module.exports = {
  updateTeacher,
  deleteTeacher,
  getAllTeachers,
  getSingleTeacher,
};
