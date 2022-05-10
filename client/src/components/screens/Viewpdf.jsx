import React, { useState } from "react";

// import {ReactPDF, Document, Page } from 'react-pdf';
export default function SinglePage(props) {

   const { pdf } = props;
   
    function view(e)
    {
        var filename = pdf.substring(pdf.lastIndexOf('/')+1);
        
        
        if(filename.includes("jpg"))
        {
            return (
                <img src={pdf} className="viewimg"/>
            )
        }
        else
        {
          return(  <iframe className="viewer" src={pdf}  id="scaled-frame" ></iframe> )
        }
    }
    return (
        <>
             <div id="wrap">
             {view()}
             
             </div>
        </>
    );
}