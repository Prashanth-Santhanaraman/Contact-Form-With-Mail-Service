const express = require("express");
const app = express();
const mongoose = require("mongoose");
const nodemailer = require("nodemailer");
const cors = require("cors");
require("dotenv").config();

const port = process.env.PORT || 4000;

app.use(express.json());
app.use(cors());

const formSchema = mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  subject: {
    type: String,
    required: true,
  },
  message: {
    type: String,
    required: true,
  },
  acknowledgmentNumber: {
    type: Number,
  },
});

const formModel = mongoose.model("form", formSchema);

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.GMAIL,
    pass: process.env.PASSWORD,
  },
});

app.get("/", (req, res) => {
  res.send("Server is working !");
});

app.post("/newForm", async (req, res) => {
  const { name, email, subject, message } = req.body;

  try {
    const totalDocs = await formModel.countDocuments();
    const newData = await formModel.create({
      name,
      email,
      subject,
      message,
      acknowledgmentNumber: totalDocs + 1,
    });

    const htmlContent = `
  <div style="padding: 4px;">
    <p>Name: <strong>${name}</strong></p> 
    <p>Email: <strong>${email}</strong></p> 
    <p>Subject: <strong>${subject}</strong></p> 
    <p>Message: <strong>${message}</strong></p>
  </div>
`;

    const mailOptions = {
      from: `${process.env.GMAIL}`,
      to: `${process.env.GMAIL}`,
      subject: `Customer Feedback`,
      text: `${message}`,
      html: htmlContent,
    };

    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        console.log("Error:", error);
      } else {
        console.log("Email sent:", info.response);
      }
    });

    const ackNum = newData.acknowledgmentNumber;
    console.log(ackNum);

    const htmlContent1 = `
      <div style="font-family: 'Montserrat', sans-serif; padding: 10px;">
        <h3>Hi ${name},</h3>
        <p>Thank you for contacting us. We have received your form and will get back to you shortly.</p>
        <p><strong>Your Acknowledgement Id:</strong></p>
        <blockquote>${ackNum}</blockquote>
        <p>Regards,<br>Customer Team</p>
      </div>
  `;

    const mailOptions1 = {
        from: `process.env.GMAIL`,
        to: `${email}`,
        subject: `We've received your form!`,
        text: `Hi ${name},\n\nThank you for contacting us. We've received your form:\n\n" Acknowledegement id: ${ackNum}"\n\n- Customer Team`,
        html: htmlContent1,
      };
  
      transporter.sendMail(mailOptions1, (error, info) => {
        if (error) {
          console.log("Error:", error);
        } else {
          console.log("Email sent:", info.response);
        }
      });



    res.status(200).json({ message: "Successfully Saved & Email Sent!",acknowledgmentNumber:ackNum });
    console.log("Successfully Saved & Email Sent!");
  } catch (error) {
    console.log(error);
    res.status(400).json({ message: "Some error occured" });
  }

  //   console.log(req.body);
});

mongoose
  .connect("mongodb://127.0.0.1:27017/contactform")
  .then(() => {
    app.listen(port, (req, res) => {
      console.log(`Listening to the port ${port} and Connected to the DB`);
    });
  })
  .catch((error) => {
    console.log("Error !!!");
    console.log(error);
  });
