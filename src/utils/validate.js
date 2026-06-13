const validator = require("validator");

const validateSignUpData = (req) => {
    const { firstName, lastName, emailId, password } = req?.body;

    if (!firstName || !lastName) {
        throw new Error("Invalid Name");
    } else if (!validator.isEmail(emailId)) {
        throw new Error("Invalid Email");
    } else if (!validator.isStrongPassword(password)) {
        throw new Error("weak Password");
    }
};

const isValidEditData = (req) => {
    const ALLOWED_FIELDS = [
        "firstName",
        "lastName",
        "age",
        "gender",
        "photoUrl",
        "about",
        "skills",
    ];

    const isValidFields = Object.keys(req.body).every((feild) =>
        ALLOWED_FIELDS.includes(feild),
    );
    if (!isValidFields) {
        throw new Error("Invalid Input Fields")
    } else if (req?.body?.skills.length>10) {
       throw new Error("Skills can't More than 10")
    }
};

module.exports = { validateSignUpData, isValidEditData };
