import './App.css';
import React, { useState } from "react";
import Button from '@material-ui/core/Button';
import InputLabel from '@material-ui/core/InputLabel';
import TextField from '@material-ui/core/TextField';
import { makeStyles } from '@material-ui/core/styles';
import BGI from './translate.jpg';

const useStyles = makeStyles((theme) => ({
	text:{
		backdropFilter: "blur(10px)",
		minWidth: "550px"
	}
}));


function MachineTranslation (){
	const [text, setText] = useState({sentence:""});
	const [translation, setTranslation] = useState("");
	const classes = useStyles();
	const handleText = (event) => {
		const temp = {sentence: event.target.value};
		setText(temp);
	};
	const handleButton = () => {
		const link = 'http://127.0.0.1:8000/api/v1/machine_translation/predict';
    	const contentType = 'application/json';
    	const request = {
      		method: 'POST',
      		headers: {'Content-Type': contentType},
      		body: JSON.stringify(text)
    	};
    
    	fetch(link, request)
      		.then(async response => {
        		const data = await response.json();
        		if(!response.ok){
          			const error = (data && data.message) || response.statusText;
          			setTranslation("Error");
          			return Promise.reject(error);
        		}
        		else{
        			setTranslation(data.label);
        		}
      	}).catch(error => {
        	alert('There was an error: ' + error.toString());
      	});
	};
	return(
	  <div className="themed" style={{backgroundImage:"url("+BGI+")"}}>
      <h1 style={{color:"black"}}>English to French translation</h1>
      <div style={{"margin-bottom":"250px"}}>
      <TextField className={classes.text} id="outlined-multiline-static" label="English phrase" multiline rows={7} variant="outlined"
      value={text.sentence} onChange={handleText} />
      <Button variant="contained" style={{maxWidth:"250px"}} color="primary" onClick={handleButton}>Translate</Button>
      <TextField className={classes.text} id="filled-multiline-static-disabled" label="French phrase" multiline rows={7} variant="filled"
      value={translation} />
      </div>
      </div>
		);
}
export default MachineTranslation;