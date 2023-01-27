import React, { useState ,useContext,useEffect} from "react";
import Bnavbar from '../Bnavbar';
import { Card, Button } from 'react-bootstrap';
import {UserContext} from '../../App'
import { Link,useNavigate,useParams  } from 'react-router-dom';
import { saveAs } from "file-saver";
import SinglePage from './Viewpdf';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Avatar from 'react-avatar';
function UserProfile()
{
    const{state,dispatch}=useContext(UserContext);
    const navigate=useNavigate();
    const [data, setData] = useState([]);
   
    const [user, setUser] = useState([]);
   
    const [showCom, setCom] = useState();
    const {userId}=useParams();
    

  
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
    const deletePost = (postid) => {
        fetch(`/deletepost/${postid}`, {
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
        fetch('/like',{
            method:"put",
            headers:{
                "Content-Type":"application/json",
                "Authorization":"Bearer "+localStorage.getItem("jwt")
            },
            body:JSON.stringify({
                postId:id
            })
        }).then(res=>res.json())
        .then(result=>{
                 //   console.log(result)
          const newData = data.map(item=>{
              if(item._id==result._id){
                  return result
              }else{
                  return item
              }
          })
          setData(newData)
        }).catch(err=>{
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
        fetch(`/user/${userId}`, {
            headers: {

                "Authorization": "Bearer " + localStorage.getItem('jwt')
            }
        }).then(res => res.json())
            .then(result => {

                if (result.error) {
                    navigate('/login');
                    return;
                   }
                 setUser(result.user)
                setData(result.posts);
               
            })
            .catch(err => {
                navigate('/login');
         })
    }, [])
    return (
        <>
        {data ? 
            <div>
        
        <div style={{margin:"0px auto",maxWidth:"800px"}}>
            <div style={{display:"flex" , justifyContent:"flex-start",margin:"18px 0px" , borderBottom:"1px solid grey" , marginTop:"2px"}}>
            <div style={{ margin:"2px",marginLeft:"2%"}}>
                <img style={{width:"160px",height:"160px",borderRadius:"80px"}} 
                src={user.url} alt="profile"/>
            </div>
            <div>
                <h4>{user.name}</h4>
                <div style={{display:"flex",justifyContent:"space-between",}}>
                    <h5>{data.length} posts</h5>
                   
                </div>
            </div>
            </div>
         </div>
         {/* <Button className="blogout" onClick={() => {
                                  localStorage.clear();
                                  dispatch({type:"CLEAR"}) ;
                                  navigate('/login')
                                }} variant="primary">Logout</Button> */}
        <hr></hr>
        <h2 className="mypostsheader">{user.name} posts</h2>
         <div >
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
                                        deletePost(item._id)
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
                                    showCom==item._id ?
                                        item.comments.map(result => {

                                            return (
                                                <h6 key={result._id}><span style={{ fontWeight: "500" }}>
        
                                                    <Link className="postedbyn" to={item.postedBy._id !== state._id ?
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
            
            
        </div>
         <Bnavbar/>
        </div>
        <div className="bottomsticky">
        
        </div>
        
       <h2>end</h2>
        </div>
        :
        <h2>loading ...</h2>}
        
        </>
    )
}

export default UserProfile;