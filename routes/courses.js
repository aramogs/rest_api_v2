const express = require("express");
const router = express.Router();
const User = require("../models").User;
const Course = require("../models").Course;
const authenticate = require("../configurations/authenticate");
router.use(express.urlencoded({ extended: true }));
router.use(express.json());

// Create the course routes
// Set up the following routes (listed in the format HTTP METHOD Route HTTP Status Code):
// GET /api/courses 200 - Returns a list of courses (including the user that owns each course)
// GET /api/courses/:id 200 - Returns a the course (including the user that owns the course) for the provided course ID
// POST /api/courses 201 - Creates a course, sets the Location header to the URI for the course, and returns no content
// PUT /api/courses/:id 204 - Updates a course and returns no content
// DELETE /api/courses/:id 204 - Deletes a course and returns no content


//Using findAll to Get all courses
router.get("/", (req,res) => {
  Course.findAll()
    .then(data => res.json({message:"Data requested:",data}))
    .catch(err => res.status(400).json({ message: "Error:" , err}));
});
//Finding course by :id
router.get("/:id", (req, res) => {
  Course.findOne({ where: { id: req.params.id } })
    .then(course => {
      if (!course) {
        res.status(404).json({ message: "Course not found" });
      } else {
        res.status(200).json({ message: "Course information:", course });
      }
    })
    .catch(error => {
      res.send(500, error);
    });
});

// Posting new course
router.post("/", authenticate, (req, res) => {
  if (!req.body.title || !req.body.description) {
    res.status(400).json({ message: "Course Title/Description must not be empty" });
  } else {
    Course.findByPk(req.body.id)
      .then(course => {
        User.findByPk(req.body.userId)
          .then(userId => {
            if (course) {
              res.status(403).json({ message: "Id already Exists" });
            } else if (req.body) {
              Course.create(req.body)
                .then(() => {
                  res
                    .location("/courses/" + req.body.id)
                  .status(201)
                  .json({
                    message: "New Course added",
                    User: req.body.userId,
                    Title: req.body.title,
                    Description: req.body.description,
                    EstimatedTime: req.body.estimatedTime,
                    MaterialsNeeded: req.body.materialsNeeded,
                    CreatedAt: req.body.createdAt,
                    updatedAt: req.body.updatedAt
                  });
                })
                .catch(err => {
                  res.status(500).json({ Error: err });
                });
            } else if (!userId) {
              res.status(400).json({ message: "No user" });
            }
          })
          .catch(err => {
            res.status(500).json({ Error: err });
          });
      })
      .catch(err => {
        res.status(500).json({ Error: err });
      });
  }
});

//Updating course depending on :id
router.put("/:id", authenticate, (req, res) => {
  if (!req.body.title || !req.body.description) {
    res.status(400).json({ message: "Course Title/Description must not be empty to Update" });
  } else {
    Course.findByPk(req.params.id)
      .then(course => {
        if (course) {
          User.findByPk(course.userId)
            .then(data => {
              if (data.id === req.body.userId) {
                course.update(req.body).userId;
                res
                  .location("/courses/" + req.body.id)
                  .status(201)
                  .json({
                    message: "Course updated",
                    User: req.body.userId,
                    Id: req.params.id,
                    NewTitle: req.body.title,
                    NewDescripction: req.body.description
                  });
              } else {
                res
                  .status(401)
                  .json({ Error: "This Course was not created by current user" });
              }
            })
            .catch(err => {
              res.status(500).json({ Error: err });
            });
        } else {
          res.status(403).json({ message: "Course does not exist" });
        }
      })
      .catch(err => {
        res.status(500).json({ Error: err });
      });
  }
});

//Deleting course depending on :id
router.delete("/:id", authenticate, (req, res) => {
  Course.findByPk(req.params.id)
    .then(course => {
      if (course) {
        User.findByPk(course.userId)
          .then(data => {
            if (data.id === req.currentUser.id) {
              course.destroy();
              res.status(201).json({ message: "Course Deleted" });
            } else {
              res.status(401).json({
                Error: "This course was not created by current User"
              });
            }
          })
          .catch(err => {
            res.status(500).json({ Error: err });
          });
      } else {
        res
          .status(403)
          .json({ message: "Course does not exist" });
      }
    })
    .catch(err => {
      res.status(500).json({ Error: err });
    });
});

module.exports = router;
