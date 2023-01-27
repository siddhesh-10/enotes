import React, { useState } from "react";
import { render } from 'react-dom';
import { Document, Page, pdfjs } from 'react-pdf';

pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.js`;
// import {ReactPDF, Document, Page } from 'react-pdf';

export default function SinglePage(props) {

    const { pdf } = props;
    const [numPages, setNumPages] = useState(null);
    const [pageNumber, setPageNumber] = useState(1);

    function onDocumentLoadSuccess({ numPages }) {
        setNumPages(numPages);
    }
    function ppage() {
        if (pageNumber <= 1) {

        }
        else {
            setPageNumber(pageNumber - 1);
        }
    }
    function npage() {
        if (pageNumber >= numPages) {

        }
        else {
            setPageNumber(pageNumber + 1);
        }
    }
    function view(e) {
        var filename = pdf.substring(pdf.lastIndexOf('/') + 1);


        if (filename.includes("jpg")) {
            return (
                <img src={pdf} className="viewimg" />
            )
        }
        else {
            //   return(  <object data={pdf} type="application/pdf" className="viewer" src={pdf} id="scaled-frame" >
            //         <p>Your web browser doesn't have a PDF plugin.
            //             you can direct download </p>
            //     </object>
            //   );
            let urlpdf = "https://cors-anywhere.herokuapp.com/" + { pdf };
            //             const url = 
            // "https://cors-anywhere.herokuapp.com/http://www.pdf995.com/samples/pdf.pdf"
            // var proxyUrl = 'https://cors-anywhere.herokuapp.com/'+{pdf};
            // // return( <div style={{overflow:'scroll',height:600}} className="viewer" id="scaled-frame">
            // //         <MobilePDFReader url={pdf}/>
            // //        </div>
            // //        )
            // var url = "https://docs.google.com/viewerng/viewer?embedded=true&url="+pdf;
            // <iframe src="https://docs.google.com/gview?url=http://remote.url.tld/path/to/document.doc&embedded=true"></iframe>
            // return(
            //     <iframe className="viewer" src={url}></iframe>
            // );
            return (
                <div className="viewer">
                    <Document className="viewers" file={pdf} onLoadSuccess={onDocumentLoadSuccess}>
                    <Page pageNumber={pageNumber} />
                    </Document>
                    <div className="pdfhandler">
                    
                    <div className="pdfbtn">
                        <button className="btn waves-effect waves-light #66bb6a green lighten-1" onClick={npage}>
                            next
                        </button>
                        <p className="btn pagenum">
                        Page {pageNumber} of {numPages}
                       </p>
                        <button className="btn waves-effect waves-light #66bb6a green lighten-1" onClick={ppage}>
                            prev
                        </button>
                     </div>
                     </div>
                        {/* <Page pageNumber={pageNumber} /> */}
                    {/* <Document
                        file={pdf}
                        className="viewers"
                        options={{ workerSrc: "/pdf.worker.js" }}
                        onLoadSuccess={onDocumentLoadSuccess}
                    >
                        {Array.from(new Array(numPages), (el, index) => (
                            <Page key={`page_${index + 1}`} pageNumber={index + 1} />
                        ))}
                    </Document> */}
                </div>
            )

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