
import React, { useRef, useEffect, useState } from "react";


import Bnavbar from '../Bnavbar';

import { Link, useNavigate, useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import M from 'materialize-css'
function Search() {
    const searchMod = useRef(null);
    const [search, setSearch] = useState('');
    const [subNames, setSubNames] = useState([]);
    useEffect(() => {
        M.Modal.init(searchMod.current)
    }, []);
    function subject(query)
    {
        setSearch(query);
        fetch('search-sub', {
            method: "post",
            headers: {
                'Content-Type': 'application/json',
                Authorization: "Bearer " + localStorage.getItem("jwt")
            },
            body:JSON.stringify({
                query:query
            })
        }).then(res => res.json())
            .then(result => {
                console.log(result)
                setSubNames(result.post);
                }).catch(function (error) {
                    // Some Error occurred
                });
               
            
    }
    return (
        <>
            <div>
                <div>
                    <i data-target="modal1" className="large material-icons modal-trigger">search <h2 className="searchh">click to search</h2></i>
                    <div id="modal1" className="modal" ref={searchMod}>
                        <div className="modal-content">
                            <input type="text" onChange={(e) =>
                            { setSearch(e.target.value); subject(e.target.value)}} placeholder="search notes" value={search} />
                            <ul class="collection">
                            {subNames.map((item)=>{
                             return  ( 
                                <Link to={"/searchs/"+item.subject} onClick={()=>{
                                setSearch('');
                                M.Modal.getInstance(searchMod.current).close();
                            }} >  <li class="collection-item">{item.subject}</li></Link>
                                 );
                            })}
                               
                            </ul>
                        </div>
                        <div className="modal-footer">
                            <a href="#!" class="modal-close waves-effect waves-green btn-flat" onClick={()=>{
                                setSearch('');
                            }}>Close</a>
                        </div>
                    </div>
                </div>
                <hr></hr>
                <h2>or search by Departmennt</h2>
                <div className="dep">
                    <div className="department">
                        <div className="dp1" >
                            <h2 className="dp"  >
                                <Link to="/search/computer science" style={{ color: "white" }}>Computer science</Link>
                            </h2></div>
                        <div className="dp2" >  <Link to="/search/mechanical" style={{ color: "white" }}>mechanical</Link></div>
                        <div className="dp3" >  <Link to="/search/electirc" style={{ color: "white" }}>electric</Link></div>
                        <div className="dp4" >  <Link to="/search/environment" style={{ color: "white" }}>environment</Link></div>
                        <div className="dp5" >  <Link to="/search/biotech" style={{ color: "white" }}>biotech</Link></div>
                        <div className="dp6" >  <Link to="/search/civil" style={{ color: "white" }}>civil</Link></div>



                    </div>
                </div>
            </div>
            <Bnavbar />
        </>
    )

}

export default Search;
