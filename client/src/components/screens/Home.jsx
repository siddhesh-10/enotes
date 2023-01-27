import React, { useState, useEffect, useContext } from "react";

import { Card, Button } from 'react-bootstrap';
import Bnavbar from '../Bnavbar';
import { Document, Page } from 'react-pdf';
import SinglePage from './Viewpdf'
import { saveAs } from "file-saver";
import { UserContext } from "../../App";
import { Link, Navigate, useNavigate, useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Avatar from 'react-avatar';
import { storage } from "../firebase"

function Home() {
    const [data, setData] = useState([]);
    const [showCom, setCom] = useState();
    const { state, dispatch } = useContext(UserContext);
    const navigate = useNavigate();
    function changeshow(e) {
        if (showCom !== e)
            setCom(e);
        else {
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

                var fileUrl = url;


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

                if (result.error) {

                    navigate('/login')

                }
                const newData = data.map(item => {

                    if (item._id === result._id) {

                        return result;

                    }
                    else {
                        return item;
                    }

                })
                setData(newData);

            }).catch(err => {
                navigate('/login')
            })
    }

    useEffect(() => {
        
      
        fetch('/home', {
           

            headers: {
                
                "Authorization": "Bearer " + localStorage.getItem('jwt')
            }
        }).then(res => res.json())
            .then(result => {

                if (result.error) {
                    navigate('/login');
                    return;
                   }
                console.log("checking ")
                setData(result.posts);
            }).catch(err => {
                   navigate('/login');
            })
    }, [])
    return (



        <>

            {data ?

                <div className="home">
                    {

                        data.map(item => {
                            return (
                                <Card className="home-card">
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
                                    <hr></hr>
                                    {/* <Card.Header>{item.title}</Card.Header> */}
                                    <Card.Body>
                                        <Card.Title className="postTitle">{item.title}</Card.Title>
                                        <div className="postContent">
                                        <Card.Text className="subjectpost">subject : {item.subject}</Card.Text>
                                        
                                        <Card.Text className="deppost">
                                            Department:{item.department}
                                        </Card.Text>
                                        </div>
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
                                            showCom == item._id ?
                                                item.comments.map(result => {

                                                    return (
                                                        <h6 key={result._id}><span style={{ fontWeight: "500" }}>

                                                            <Link className="postedbyn" to={result.postedBy._id !== state._id ?
                                                                "/profile/" + result.postedBy._id : "/profile"}>
                                                                <Avatar size="30" round={true} src={result.postedBy.url} />
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
                    <h2>...loading</h2>
                    <div className="nearnav"></div>
                    <Bnavbar />
                </div>

                :
                <h2>loading ...</h2>}
        </>
    )
}

export default Home;