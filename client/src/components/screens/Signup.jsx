import React, { useState, useEffect, useContext } from "react";



import { UserContext } from '../../App'

import { Card } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';

import Navbars from '../Navbar';
import { storage } from "../firebase"
import { toast } from 'react-toastify';
import { ProgressBar } from "react-bootstrap"
import 'react-toastify/dist/ReactToastify.css';
toast.configure()
function Signup() {
  const [Name, setName] = useState("");
  const [Password, setPassword] = useState("");
  const [Email, setEmail] = useState("");
  const [image, setImage] = useState();
  const [images, setImages] = useState(false);
  const [url, setUrl] = useState("");
  const navigate = useNavigate();
  const [progress, setProgress] = useState();
  const { state, dispatch } = useContext(UserContext);
  if(state && state._id)
    {
        navigate("/home")
    }
  function onFileUpload(e) {
    try {
      e.preventDefault();
      if (!Name || !Password || !Email) {
        return toast.warning("Please provide all details");

      }
      const fileSize = image.size / 1024 / 1024; // in MiB
      if (fileSize > 1) {
        return toast.warning("image size should be less than 1 mb");
        // $(file).val(''); //for clearing with Jquery
      }
      const filename = Date.now() + image.name;
      storage.ref(`/files/${filename}`).put(image).
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
                    method: 'POST',
                    headers: {
                      'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                      name: Name,
                      email: Email,
                      password: Password,
                      url: urls
                    })
                  })
                };
                fetch('/signup', requestOptions)
                .then(res => res.json())
                .then(data => {
                  JSON.stringify(data)
          
                  if (data.error) {
                    toast.warning(data.error)
          
                  }
                  else {
                    toast.success(data.message);
                    navigate('/login')
                  }
                }).catch(err => {
                  console.log(err);
                });

              }).catch(err => {
                console.log(err)
                return toast.warning("not posted")
              });






          }
        )
    }
    catch (err) {
      return toast.warning("not posted")
    }
  }

  const postData = (e) => {
    try {
      e.preventDefault();
      if (!Name || !Password || !Email) {
        return toast.warning("Please provide all details");

      }
     
      
      
      if(image)
      {
        const filename = Date.now() + image.name;
        const fileSize = image.size / 1024 / 1024; // in MiB
        if (fileSize > 1) {
          return toast.warning("image size should be less than 1 mb");
          // $(file).val(''); //for clearing with Jquery
        }
      storage.ref(`/profile/${filename}`).put(image).
        on("state_changed",
          (snapshot) => {
            const progresss = Math.round(
              (snapshot.bytesTransferred / snapshot.totalBytes) * 100
            );
            setProgress(progresss);
          },
          function (error) { return toast.warning("not posted") },
          function () {
            storage.ref(`/profile/${filename}`).getDownloadURL()
              .then((urls) => { 
                setUrl(urls);
                const requestOptions = {
                  method: 'POST',
                  headers: {
                    'Content-Type': 'application/json',
                    "Authorization": "Bearer " + localStorage.getItem('jwt')
                  },
                  body: JSON.stringify({ 
                      name: Name,
                      email: Email,
                      password: Password,
                      url: urls
                    
                  })
                };
                fetch('/signup', requestOptions)
                .then(res => res.json())
                .then(data => {
                  JSON.stringify(data)
          
                  if (data.error) {
                    toast.warning(data.error)
          
                  }
                  else {
                    toast.success(data.message);
                    navigate('/login')
                  }
                }).catch(err => {
                  console.log(err);
                });

              }).catch(err => {
                console.log(err)
                return toast.warning("account not created1")
              });
          }
        )
        }
       else
       {
        const requestOptions = {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            "Authorization": "Bearer " + localStorage.getItem('jwt')
          },
          body: JSON.stringify({ 
              name: Name,
              email: Email,
              password: Password,
              
            
          })
        };
        fetch('/signup', requestOptions)
        .then(res => res.json())
        .then(data => {
          JSON.stringify(data)
  
          if (data.error) {
            toast.warning(data.error)
  
          }
          else {
            toast.success(data.message);
            navigate('/login')
          }
        }).catch(err => {
          return toast.warning("account not created2")
        });

      
       } 
    }
    catch (err) {
      return toast.warning("account not created3")
    }
  }
  return (
    <div>
      <Navbars />
      <div className="wcard">
        <Card style={{ width: '18rem' }} className="cards .input-field">
          <div className="auth-card">
            <h2>E-notes</h2>
            <input type="text" onChange={(e) => setName(e.target.value)} placeholder="name" value={Name} />
            <input type="text" placeholder="email" onChange={(e) => setEmail(e.target.value)} value={Email} />
            <input type="password" placeholder="password" onChange={(e) => setPassword(e.target.value)} value={Password} />
            <h4>profile</h4>
            <input type="file" className="postinput" accept=" image/gif, image/jpeg"
              onChange={(e) => {setImages(true); setImage(e.target.files[0]) }} />
            <button className="btn waves-effect waves-light #66bb6a green lighten-1"
              onClick={postData}
            >
              Signup
            </button>
            <h6>
              <Link to='/login'>Already have account?</Link>
            </h6>
            {progress && <ProgressBar now={progress} label={`${progress}%`} />}
          </div>
          {

          }
        </Card>

      </div>
    </div>
  )
}

export default Signup;