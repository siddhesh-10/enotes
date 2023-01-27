
import react, { useState } from "react";

import { storage } from "../firebase"
import { Card } from 'react-bootstrap';
import { toast } from 'react-toastify';

import { Link, useNavigate } from 'react-router-dom';
import 'react-toastify/dist/ReactToastify.css';

import { ProgressBar } from "react-bootstrap"
import Select from 'react-select';
import Bnavbar from '../Bnavbar';

function CreatePost() {
  const options = [
    { value: 'computer science', label: 'Computer science' },
    { value: 'mechanical', label: 'mechanical' },
    { value: 'civil', label: 'civil' },
    { value: 'biotech', label: 'biotech' }, 
    { value: 'electric', label: 'electric' },
    { value: 'environment', label: 'environment' }
  ];
  const [title, setTitle] = useState("");
  const [subject, setSubject] = useState("");
  const [department, setDepartment] = useState(options[0]);
  const [desc, setDesc] = useState("");
  const [pdf, setPdf] = useState();
  const [url, setUrl] = useState();
  const navigate = useNavigate();
  const [progress, setProgress] = useState();

  function handledep(e) {
    setDepartment(e);
    // console.log(e.value)
    // setDepartment(e.value)
    
  }
  function onFileUpload(e) {
    try {
      e.preventDefault();
      if (!title || !subject || !department || !desc || !pdf) {
        return toast.warning("Please provide all details");

      }
      const fileSize = pdf.size / 1024 / 1024; // in MiB
      if (fileSize > 10) {
        return toast.warning("file size should be less than 10 mb");
        // $(file).val(''); //for clearing with Jquery
      }
      const filename = Date.now() + pdf.name;
      storage.ref(`/files/${filename}`).put(pdf).
        on("state_changed",
          (snapshot) => {
            const progresss = Math.round(
              (snapshot.bytesTransferred / snapshot.totalBytes) * 100
            );
            setProgress(progresss);
          },
          function (error) { return toast.warning("not posted") },
          function () {
            storage.ref(`/files/${filename}`).getDownloadURL()
              .then((urls) => {
               
                setUrl(urls);
                const requestOptions = {
                  method: 'POST',
                  headers: {
                    'Content-Type': 'application/json',
                    "Authorization": "Bearer " + localStorage.getItem('jwt')
                  },
                  body: JSON.stringify({
                    title: title,
                    subject: subject,
                    department: department,
                    desc: desc,
                    url: urls
                  })
                };
                fetch('/createpost', requestOptions)
                  .then(res => res.json())
                  .then(data => {
                    JSON.stringify(data)

                    if (data.error) {
                      return toast.warning(data.error)

                    }
                    else {
                      toast.success(data.message);
                      navigate('/home')
                    }
                  }).catch(err => {
                    return toast.warning("not posted")
                  });

              }).catch(err => {
                console.log(err)
                return toast.warning("not posted")
              });






          }
        )
    }
    catch (err) {
      console.log(err);
      return toast.warning("not posted")
    }
  }

  return (
    <div className="postNote" >

      <Card className="post-card">
        {/* <h6>unknown</h6>
            <div className="card-image">
                 <img src="https://i.pinimg.com/originals/bf/82/f6/bf82f6956a32819af48c2572243e8286.jpg"/>
            </div>
            <i className="material-icons">favorite</i>
            <Card.Header>title</Card.Header> */}
        <Card.Body>
          <Card.Title>Upload your notes with following details</Card.Title>
          <Card.Text>

          </Card.Text>
          <form >
            <div className="card input-field">
              <input type="text" className="postinput" maxLength={25} placeholder="Title" value={title} onChange={(e) => setTitle(e.target.value)} />
              <input type="text" className="postinput" placeholder="Subject" maxLength={25} value={subject} onChange={(e) => setSubject(e.target.value)}></input>
              {/* <input type="text" className="postinput" placeholder="Department" value={department} onChange={(e) => setDepartment(e.target.value)}></input> */}
              <div className="postinput">
               <h4> select department</h4>
                <Select className="postinput deps"
                  options={options}
                  value={department}
                  onChange={handledep}

                >

                </Select>
              </div>

              <textarea type="text" className="postinput" rows={5} style={{ height: "auto" }}
                placeholder="Description" value={desc} onChange={(e) => setDesc(e.target.value)} />




              <input type="file" className="postinput" accept="application/pdf, image/gif, image/jpeg"
                onChange={(e) => { setPdf(e.target.files[0]) }} />

              <button className="btn waves-effect waves-light #66bb6a green lighten-1 "
                onClick={onFileUpload}
              >
                Post
              </button>
              {progress && <ProgressBar now={progress} label={`${progress}%`} />}
            </div>
          </form>
        </Card.Body>

      </Card>
      <Bnavbar />
    </div>
  );
}


export default CreatePost;