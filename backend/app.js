const express = require("express");
var bodyParser = require("body-parser");
const textflow = require("textflow.js");

textflow.useKey(
  "bEOoKRHB8YGO4tBHcgv2awoY0FIxXvyG1FDjsVRHtmRCDqzAg5igh3IfHGjDwSrq"
);

// Define an array to store the login info objects
const loginInfoList = [];

const app = express();

class User {
  static list = {};
  constructor(fullName, phoneNumber, password, gender, birthDate) {
    this.fullName = fullName;
    this.phoneNumber = phoneNumber;
    this.password = password;
    this.gender = gender;
    this.birthDate = birthDate;
  }
  static add(fullName, phoneNumber, password, gender, birthDate) {
    if (!fullName || this.list[fullName]) return false;

    this.list[fullName] = new User(
      fullName,
      phoneNumber,
      password,
      gender,
      birthDate
    );
    return true;
  }
}

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.post("/save-login", (req, res) => {
  const { saveLogin } = req.body;

  if (saveLogin) {
    const loginInfo = {
      // Fill in the properties with the desired login info
      fullName: req.body.fullName,
      phoneNumber: req.body.phoneNumber,
      password: req.body.password,
      gender: req.body.gender,
      birthDate: req.body.birthDate,
    };

    // Add the login info object to the list
    loginInfoList.push(loginInfo);
    console.log(loginInfoList);
    return res.status(200).json({ success: true });
  }

  return res.status(400).json({ success: false });
});

app.post("/register", async (req, res) => {
  const { fullName, phoneNumber, password, gender, birthDate, code } = req.body;

  var result = await textflow.verifyCode(phoneNumber, code);

  if (!result.valid) {
    return res.status(400).json({ success: false });
  }

  if (User.add(fullName, phoneNumber, password, gender, birthDate))
    return res.status(200).json({ success: true });

  return res.status(400).json({ success: false });
});
app.post("/verify", async (req, res) => {
  const { phoneNumber } = req.body;

  var result = await textflow.sendVerificationSMS(phoneNumber);

  if (result.ok)
    //send sms here
    return res.status(200).json({ success: true });
  //   if (result.ok) {
  //     setTimeout(() => {
  //       result.ok = false;
  //     }, 60000); // Expire code after 60 seconds

  //     return res.status(200).json({ success: true });
  //   }

  return res.status(400).json({ success: false });
});

app.listen(2000, () => {
  console.log("Port is listening");
});
