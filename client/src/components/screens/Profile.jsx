import React, { useState, useContext, useEffect } from "react";
import Bnavbar from '../Bnavbar';
import { Card, Button } from 'react-bootstrap';
import { UserContext } from '../../App'
import { Link, useNavigate } from 'react-router-dom';
import { saveAs } from "file-saver";
import SinglePage from './Viewpdf';
import { toast } from 'react-toastify';
import { ProgressBar } from "react-bootstrap"
import Avatar from 'react-avatar';
import { storage } from "../firebase"
import 'react-toastify/dist/ReactToastify.css';
function Profile() {
    const { state, dispatch } = useContext(UserContext);
    const navigate = useNavigate();
    const [data, setData] = useState([]);
    const [image, setImage] = useState();
    const [showCom, setCom] = useState();
    const [progress, setProgress] = useState();
    function changepic(img) {
        try {

            if (img) {
                const filename = Date.now() + img.name;
                const fileSize = img.size / 1024 / 1024; // in MiB
                if (fileSize > 1) {
                    return toast.warning("image size should be less than 1 mb");
                    // $(file).val(''); //for clearing with Jquery
                }
                storage.ref(`/profile/${filename}`).put(img).
                    on("state_changed",
                        (snapshot) => {
                            const progresss = Math.round(
                                (snapshot.bytesTransferred / snapshot.totalBytes) * 100
                            );
                            setProgress(progresss);
                        },
                        function (error) { return toast.warning(error) },
                        function () {
                            storage.ref(`/profile/${filename}`).getDownloadURL()
                                .then((urls) => {

                                    const requestOptions = {
                                        method: 'POST',
                                        headers: {
                                            'Content-Type': 'application/json',
                                            "Authorization": "Bearer " + localStorage.getItem('jwt')
                                        },
                                        body: JSON.stringify({
                                            id: state._id,
                                            url: urls

                                        })
                                    };
                                    fetch('/changepic', requestOptions)
                                        .then(res => res.json())
                                        .then(data => {
                                            JSON.stringify(data)

                                            if (data.error) {
                                                toast.warning(data.error)

                                            }
                                            else {
                                                
                                                var fileUrl = state.url;
                                                state.url = data.url;
                                                
                                                localStorage.setItem("user", JSON.stringify(state))
                                                dispatch({ type: "USER", payload: state })

                                                // Create a reference to the file to delete
                                                var fileRef = storage.refFromURL(fileUrl);



                                                // Delete the file using the delete() method 
                                                fileRef.delete().then(function () {
                                                toast.success("updated");
                                                state.url = data.url;
                                                
                                                localStorage.setItem("user", JSON.stringify(state))
                                                dispatch({ type: "USER", payload: state })
                                               
                                                navigate('/profile')
                                            }).catch(function (error) {
                                                return toast.warning("profile not updated")
                                            });
                                            }
                                        }).catch(err => {
                                            
                                                
                                               
                                                navigate('/profile')
                                        });

                                }).catch(err => {
                                    console.log(err)
                                    return toast.warning("profile not updated")
                                });
                        }
                    )
            }
            else {
                return toast.warning("profile not updated")

            }
        }
        catch (err) {
            console.log(err);
            return toast.warning("profile not updated")
        }
    }
    function changeshow(e) {
        if(showCom!==e)
        setCom(e);
        else
        {
            setCom("");
        }
    
    }
    function changeshows(e) {
       
        setCom(e);
       
    
    }
    const deletePost = (postid, url) => {
        fetch(`/deletepost/${postid}`, {
            method: "delete",
            headers: {
                Authorization: "Bearer " + localStorage.getItem("jwt")
            }
        }).then(res => res.json())
            .then(result => {
               
                var fileUrl =url;
                    

                // Create a reference to the file to delete
                var fileRef = storage.refFromURL(fileUrl);

               

                // Delete the file using the delete() method 
                fileRef.delete().then(function () {

                    // File deleted successfully
                    
                    const newData = data.filter(item => {
                        return item._id !== result._id
                    })
                    setData(newData)
                }).catch(function (error) {
                    // Some Error occurred
                });
               
            })
    }
    const deletecomment = (cid) => {
        fetch(`/deletecooment/${cid}`, {
            method: "delete",
            headers: {
                Authorization: "Bearer " + localStorage.getItem("jwt")
            }
        }).then(res => res.json())
            .then(result => {
                console.log(result)
                const newData = data.filter(item => {
                    return item._id !== result._id
                })
                setData(newData)
            })
    }
    function makecomment(text, postId) {
        fetch('/comment', {
            method: "put",
            headers: {
                "Content-Type": "application/json",
                "Authorization": "Bearer " + localStorage.getItem('jwt')
            },
            body: JSON.stringify({
                text,
                postId
            })

        }).then(res => res.json())
            .then(result => {
                const newData = data.map(item => {

                    if (item._id === result.result._id) {

                        return result.result;

                    }
                    else {
                        return item;
                    }

                })
                setData(newData);
               
            }).catch(err => {
                console.log(err);
            })
    }
    function likepost(id) {
        
        fetch('/like', {
            method: "put",
            headers: {
                "Content-Type": "application/json",
                "Authorization": "Bearer " + localStorage.getItem("jwt")
            },
            body: JSON.stringify({
                postId: id
            })
        }).then(res => res.json())
            .then(result => {
                //   console.log(result)
                const newData = data.map(item => {
                    if (item._id == result._id) {
                        return result
                    } else {
                        return item
                    }
                })
                setData(newData)
            }).catch(err => {
                console.log(err)
            })
    }
    function unlikepost(id) {
        fetch('/unlike', {
            method: "put",
            headers: {
                "Content-Type": "application/json",
                "Authorization": "Bearer " + localStorage.getItem('jwt')
            },
            body: JSON.stringify({
                postId: id
            })

        }).then(res => res.json())
            .then(result => {
                const newData = data.map(item => {

                    if (item._id === result._id) {

                        return result;

                    }
                    else {
                        return item;
                    }

                })
                setData(newData);
                console.log(data);
            }).catch(err => {
                console.log(err);
            })
    }
    useEffect(() => {
        console.log("kkk");
        fetch('/mypost', {
            headers: {

                "Authorization": "Bearer " + localStorage.getItem('jwt')
            }
        }).then(res => res.json())
            .then(result => {


                setData(result.posts);
            })
    }, []);

    return (
        <div style={{ margin: "0px auto", maxWidth: "800px" }}>

            <div style={{ margin: "0px auto", maxWidth: "800px" }}>
                <div style={{ display: "flex", justifyContent: "flex-start", margin: "18px 0px", borderBottom: "1px solid grey", marginTop: "2px" }}>
                    <div style={{ margin: "2px", marginLeft: "2%" }}>
                        <img style={{ width: "160px", height: "160px", borderRadius: "80px" }}
                            src={state.url} alt="profile" />
                    </div>
                    <div>
                        <h4>{state ? state.name : "loading"}</h4>
                        <div style={{  }}>
                            <h5>{data.length} posts</h5>
                            


                        </div>
                       
                    </div>
                    
                </div>
               
            </div>
            <div style={{ margin: "0px auto", maxWidth: "800px" }}>
            edit profile
                        <input type="file" placeholder="edit" className="postinput" accept=" image/gif, image/jpeg"
                            onChange={(e) => {
                                setImage(e.target.files[0])
                                changepic(e.target.files[0])
                            }} />
                        {progress && <ProgressBar now={progress} label={`${progress}%`} />}
            <Button className="blogout" onClick={() => {
                localStorage.clear();
                dispatch({ type: "CLEAR" });
                navigate('/')
            }} variant="primary">Logout</Button>
            </div>
            <hr className="adjust"
            ></hr>
            <h2 className="mypostsheader">my posts</h2>
            <div >
                <div className="home">
                    {
                        data.map(item => {
                            return (
                                <Card className="home-card" >
                                    <h6 > <Link className="postedbyn" to={item.postedBy._id !== state._id ?
                                        "/profile/" + item.postedBy._id : "/profile"}>
                                        <Avatar size="50" round={true} src={item.postedBy.url} />
                                        {" "} {item.postedBy.name}</Link>
                                        {item.postedBy._id == state._id &&
                                            <i className="material-icons" style={{ float: "right" }} onClick={() =>
                                                deletePost(item._id, item.url)
                                            }>delete</i>
                                        }

                                    </h6>
                                    <hr></hr>
                                    <div className="card-image">
                                        <div >
                                            <SinglePage pdf={item.url} />
                                        </div>
                                    </div>

                                    {/* <Card.Header>{item.title}</Card.Header> */}
                                    <Card.Body>
                                        <Card.Title>{item.title}</Card.Title>
                                        <Card.Title className="subjectpost">subject : {item.subject}</Card.Title>
                                        <Card.Text className="deppost">
                                            Department:{item.department}
                                        </Card.Text>
                                        <Card.Text>
                                            {item.desc}
                                        </Card.Text>

                                        <Button onClick={() => {
                                            saveAs(
                                                item.url
                                            );
                                        }} variant="primary">Download</Button>

                                        <h2></h2>
                                        <hr></hr>
                                        <div className="hcontent">
                                            <div className="likes">
                                                {
                                                    item.likes.includes(state._id) ?
                                                    <i className="material-icons Medium red-text " onClick={() => {
                                                    unlikepost(item._id)
                                                }}>favorite</i>
                                                :
                                                <i className="material-icons Medium" onClick={() => {
                                                    likepost(item._id)
                                                }}>favorite_border</i>
                                                }

                                                <h6 className="nlikes">{item.likes.length} likes</h6>
                                            </div>
                                            <div className="comments">
                                                <i className="material-icons" onClick={() => {
                                                   changeshow(item._id);
                                                }}>comment</i>
                                                <h6 className="ncomment">{item.comments.length} comments</h6>
                                            </div>
                                        </div>
                                        {
                                            showCom==item._id  ?
                                                item.comments.map(result => {

                                                    return (
                                                        <h6 key={result._id}><span style={{ fontWeight: "500" }}>

                                                            <Link className="postedbyn" to={result.postedBy._id !== state._id ?
                                                                "/profile/" + result.postedBy._id : "/profile"}>
                                                                <Avatar size="30" round={true} src={state.url} />
                                                                {" "} {result.postedBy.name}</Link>
                                                        </span>
                                                            {/* {item.postedBy._id == state._id &&
                                                        <i className="material-icons cmd" style={{ float: "right"}} onClick={() =>
                                                            deletecomment(result._id)
                                                        }>delete</i>
                                                    }*/}
                                                            : {result.text}
                                                        </h6>
                                                    )
                                                })
                                                : null

                                        }

                                        <form onSubmit={(e) => {
                                            e.preventDefault();
                                            if (e.target[0].value.length == 0) {
                                                return toast.warning("empty field");
                                            }
                                            changeshows(item._id);
                                            makecomment(e.target[0].value, item._id)
                                        }}>
                                            <input type="text" placeholder="add a comment" maxLength={255} minLength={1}></input>
                                            <Button type="submit" variant="white" className="submitb" id="sbut">
                                                <span className="send">
                                                    <i type="submit" className="material-icons" >send</i>
                                                </span>
                                            </Button>
                                        </form>
                                    </Card.Body>

                                </Card>
                            )


                        })
                    }
                    <hr></hr>

                </div>
                <Bnavbar />
            </div>
            <div className="bottomsticky">

            </div>

            <h2>end</h2>
        </div>
    )
}

export default Profile;