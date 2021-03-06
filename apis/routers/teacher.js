let express = require("express");
let router = express.Router();
let Teacher = require("../models/teacher");
let Score = require("../models/score");
let md5 = require("../util/md5");
router.post("/login", function (req, res, next) {
    Teacher.findOne({
        name: req.body.username,
        password: md5(req.body.password)
    }).then((r) => {
        if (r) {
            res.send({
                status: 1,
                message: "ok",
                recodeset: {
                    username: r.name,
                    status: r.status,
                    _id:r._id.toString(),
                    college:r.college,
                    email:r.email
                }
            })
        } else {
            res.send({
                status: -1,
                message: "error"
            })
        }

    })
})

router.post("/work", function (req, res, next) {
    if (req.body.expID) {
        Score.find(req.body).sort({
            "score": -1
        }).then(function ( r) {
            res.send(r);
        })
    } else if (req.body.lt) {
        Score.find({
            teaID: req.body.teaID,
            title: req.body.title,
            score: {
                $gte: req.body.lt,
                $lte: req.body.lg
            }
        }).sort({
            "score": -1
        }).then(function ( r) {
            res.send(r);
        })


    } else if (req.body.keys) {
        var reg = new RegExp(req.body.keys, 'ig'); //模糊查询参数  
        Score.find({
            teaID: req.body.teaID,
            $or: [{
                    "title": {
                        $regex: reg
                    }
                },
                {
                    "no": {
                        $regex: reg
                    }
                },
                {
                    "stuName": {
                        $regex: reg
                    }
                },
                {
                    "stuNo": {
                        $regex: reg
                    }
                },
                {
                    "college": {
                        $regex: reg
                    }
                }
            ]
        }).sort({
            "score": -1
        }).then(function (r) {
            res.send(r);
        })
    } else if (req.body.title) {
        Score.find(req.body).sort({
            "score": -1
        }).then(function (r) {
            res.send(r);
        })
    } else {
        Score.find({
            teaID: req.body.teaID
        }).sort({
            "score": -1
        }).then(function (r) {
            res.send(r);
        })
    }
})
router.post("/correct", function (req, res, next) {
    let _id = req.body._id || "";
    Score.findByIdAndUpdate(_id, {
        score: req.body.score
    }, function (err, r) {
        if (err) {
            res.send({
                status: -1,
                message: "服务器错误"
            })
        }
        if (r) {
            res.send({
                status: 1,
                message: "批改成功！"
            })
        }
    })
})

router.post("/score", function (req, res, next) {
    let teaID = req.body.teaID;
    Score.aggregate().match({
        teaID:teaID,
        score: {
            $gt: 0,
            $lte: 100
        }
    }).group({
        _id: '$title',
        sum: {
            $sum: "$score"
        },
        count: {
            $sum: 1
        },
        avg: {
            $avg: "$score"
        },
        max: {
            $max: "$score"
        }
    }).exec(function (err, r) {
        Score.aggregate().group({
            _id: '$title',
            count: {
                $sum: 1
            }
        }).exec(function (err1, r1) {
            for (let i = 0; i < r.length; i++) {
                for (let j = 0; j < r1.length; j++) {
                    if (r[i]._id == r1[j]._id) {
                        r[i].notCommit = r1[j].count - r[i].count;
                    }
                }
            }

            res.send(r);
        })
    })
})

router.post("/scoredetail", function (req, res, next) {
    let title = req.body.title;
    Score.aggregate().match({
        title: title,
        score: {
            $gte: 0,
            $lte: 59
        }
    }).group({
        _id: '$title',
        count: {
            $sum: 1
        },
        avg: {
            $avg: "$score"
        },
    }).exec(function (err, r) {
        Score.aggregate().match({
            title: title,
            score: {
                $gte: 60,
                $lte: 79
            }
        }).group({
            _id: '$title',
            count: {
                $sum: 1
            },
            avg: {
                $avg: "$score"
            },
        }).exec(function (err, r1) {
            Score.aggregate().match({
                title: title,
                score: {
                    $gte: 80,
                    $lte: 89
                }
            }).group({
                _id: '$title',
                count: {
                    $sum: 1
                },
                avg: {
                    $avg: "$score"
                },
            }).exec(function (err, r2) {
                Score.aggregate().match({
                    title: title,
                    score: {
                        $gte: 90,
                        $lte: 100
                    }
                }).group({
                    _id: '$title',
                    count: {
                        $sum: 1
                    },
                    avg: {
                        $avg: "$score"
                    },
                }).exec(function (err, r3) {
                    let arr = [];

                    if (r.length > 0) {

                        arr.push({
                            value: r[0].count,
                            name: "0 ~ 59"
                        })
                    } else {
                        arr.push({
                            value: 0,
                            name: "0 ~ 59"
                        })
                    }

                    if (r1.length > 0) {
                        arr.push({
                            value: r1[0].count,
                            name: "60 ~ 79"
                        })
                    } else {
                        arr.push({
                            value: 0,
                            name: "60 ~ 79"
                        })
                    }


                    if (r2.length > 0) {
                        arr.push({
                            value: r2[0].count,
                            name: "80 ~ 89"
                        })
                    } else {
                        arr.push({
                            value: 0,
                            name: "80 ~ 89"
                        })
                    }

                    if (r3.length > 0) {
                        arr.push({
                            value: r3[0].count,
                            name: "90 ~ 100"
                        })
                    } else {
                        arr.push({
                            value: 0,
                            name: "90 ~ 100"
                        })
                    }
                    arr.push(title);
                    res.send(arr);
                })
            })
        })

    })

})
module.exports = router;