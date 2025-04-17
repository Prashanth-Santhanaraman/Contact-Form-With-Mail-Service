import { useState } from "react";
import axios from "axios";

export default function Contact() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const [data, setData] = useState([]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!name || !email || !subject || !message) {
      alert("Please fill all details");
      return;
    }
    const regex = /^[a-zA-Z0-9._%+-]+@(gmail|hotmail|yahoo|outlook)\.com$/;
    if (!regex.test(email)) {
      alert("Please enter a valid email !");
      return;
    }

    try {
      axios
        .post("http://localhost:4000/newForm", {
          name: name,
          email: email,
          subject: subject,
          message: message,
        })
        .then((res) => setData(res.data))
        .catch((err) => console.error(err));
    } catch (error) {}
  };
  return (
    <>
      <div className="flex justify-center items-center min-h-screen">
        <div className="bg-blue-200 p-4 px-6 flex flex-col rounded-md">
          <h1 className="text-2xl text-center mb-4 font-bold">Contact Form</h1>
          <label htmlFor="name">Name:</label>
          <input
            type="text"
            name="name"
            id="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Enter Your Name"
            className="bg-white p-2 px-4 rounded-md mt-1 w-80 mb-2"
            required
          />

          <label htmlFor="email">Email:</label>
          <input
            type="email"
            name="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Enter Your Email"
            className="bg-white p-2 px-4 rounded-md mt-1 mb-2"
            required
          />

          <label htmlFor="subject">Subject:</label>
          <input
            type="text"
            name="subject"
            id="subject"
            value={subject}
            onChange={(e) => setSubject(e.target.value)}
            placeholder="Enter Your Subject"
            className="bg-white p-2 px-4 rounded-md mt-1 mb-2"
            required
          />

          <label htmlFor="message">Message:</label>
          <textarea
            name="message"
            id="message"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            className="bg-white p-2 px-4 rounded-md mt-1 mb-2"
            placeholder="Enter Your Message"
            rows={5}
          ></textarea>

          <button
            className="bg-black text-white p-2 rounded-md mt-2 cursor-pointer hover:bg-blue-700"
            onClick={handleSubmit}
          >
            Submit
          </button>
        </div>
      </div>
    </>
  );
}
