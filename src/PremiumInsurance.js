import './App.css';
import React, { useState } from "react";
import { makeStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import FormControl from '@material-ui/core/FormControl';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Checkbox from '@material-ui/core/Checkbox';
import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
import TextField from '@material-ui/core/TextField';
import Select from '@material-ui/core/Select';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import BGI from './health.jpg';

const useStyles = makeStyles((theme) => ({
  button:  {
    ...theme.typography.button,
    backgroundColor: (props)=>{
      switch(props.color){
        case "success": return theme.palette.success.main;
        case "warning": return theme.palette.warning.main;
        default: return theme.palette.error.main;
      }
    },
    padding: theme.spacing(1),
  },
  formControl: {
    margin: theme.spacing(1),
    minWidth: 120,
  },
  list: {
   // width: '100%',
  //  maxWidth: 360,
    overflow: 'auto',
    maxHeight: 300,
    backdropFilter: "blur(10px)",
   'margin-left': theme.spacing(70),
   'margin-right': theme.spacing(70),
    border: `2px solid ${theme.palette.primary.main}`,
  }
}));

function PersonForm(props){
  const readOnlySetting = {readOnly:true};
  const record = {...props.value};
  const classes = useStyles(props);
  let message;
  if(record.label == null || record.label === "Error") {
    message = "A prediction could not be made for this person...";
  }
  else {
    message = "This person is likely to have premium insurance of " + record.label + "indian rupees.";
  }
  return (
    <Dialog open={props.open} scroll="paper" onClose={props.onClose}>
    <DialogTitle id="form-dialog-title">Personal Info</DialogTitle>
    <DialogContent>
    <div>
    <TextField variant="filled" InputProps={readOnlySetting} label="Age" defaultValue={record.Age} />
    <TextField variant="filled" InputProps={readOnlySetting} label="Diabetes" defaultValue={record.Diabetes>0} />
    <TextField variant="filled" InputProps={readOnlySetting} label="Blood Pressure Issue" defaultValue={record.BloodPressureProblems>0} />
    <TextField variant="filled" InputProps={readOnlySetting} label="Transplants" defaultValue={record["AnyTransplants"]>0} />

    <TextField variant="filled" InputProps={readOnlySetting} label="Chronic Diseases" defaultValue={record.AnyChronicDiseases>0} />
    <TextField variant="filled" InputProps={readOnlySetting} label="Height (cm)" defaultValue={record.Height} />
    <TextField variant="filled" InputProps={readOnlySetting} label="Weight (kg)" defaultValue={record.Weight} />
    <TextField variant="filled" InputProps={readOnlySetting} label="Known Allergies" defaultValue={record.KnownAllergies>0} />

    <TextField variant="filled" InputProps={readOnlySetting} label="Hereditary Cancer" defaultValue={record["HistoryOfCancerInFamily"]>0} />
    <TextField variant="filled" InputProps={readOnlySetting} label="Major Surgeries" defaultValue={record["NumberOfMajorSurgeries"]} />
    </div>
    <div className={classes.button}>{message}</div>
    </DialogContent>
    <DialogActions>
    <Button variant="contained" color="secondary" onClick={props.onClose}>Close</Button>
    </DialogActions>
    </Dialog>);
}

function PersonInput(props){
  const classes = useStyles();
  const [person, setPerson] = useState({
    Age: 37,
    Diabetes: 0,
    BloodPressureProblems: 0,
    AnyTransplants: 0,
    AnyChronicDiseases: 0,
    Height: 155,
    Weight: 57,
    KnownAllergies: 0,
    HistoryOfCancerInFamily: 0,
    NumberOfMajorSurgeries: 0
});
  const [open, setOpen] = useState(false);


  const updateInt = (event) => {
    const num = parseInt(event.target.value);
    const temp = {...person};
    temp[event.target.name] = num;
    setPerson(temp);
  };
  const toggle = (event) => {
    const temp = {...person};
    const name = event.target.name;
    temp[name] = 1 - person[name];
    setPerson(temp);
  }
  const setLabel = (label) => {
    const temp = {...person};
    temp["label"] = label;
    setPerson(temp);
  };
  const handleSubmit = () => {
    var record = {...person}
    delete record.label;
    alert(JSON.stringify(record));
    const link = 'http://127.0.0.1:8000/api/v1/premium_insurance/predict';
    const contentType = 'application/json';
    const request = {
      method: 'POST',
      headers: {'Content-Type': contentType},
      body: JSON.stringify(record)
    };
    
    fetch(link, request)
      .then(async response => {
        const data = await response.json();
        if(!response.ok){
          const error = (data && data.message) || response.statusText;
          setLabel("Error");
          return Promise.reject(error);
        }
        else{
        setLabel(data.label);
        setOpen(true);
        }
      }).catch(error => {
        alert('There was an error: ' + error.toString());
      });
  };
  const handleClose = () => {
    setOpen(false);
    props.onClose({...person});
  };
  const surgeries = [0, 1, 2, 3];
  let notice = "";
  if(person.label == null) notice = "No prediction has been provided!";
  else notice =  "This person is likely to have premium insurance of " + person.label + "indian rupees.";
  return (
    <div>
    <Dialog maxWidth="md" open={props.open} scroll="paper" onClose={() => props.onClose(null)} aria-labelledby="form-dialog-title">
      <DialogTitle id="form-dialog-title">Personal Medical Record</DialogTitle>
      <DialogContent>
      <div className="row">
        <TextField label="Age" type="age" name="Age" onChange={updateInt} value={person.Age}
        helperText = "18-66" />
        <FormControlLabel label="Diabetes"
        control={
          <Checkbox checked={person.Diabetes>0} name="Diabetes" onChange={toggle} />
        }>
        </FormControlLabel>
        <FormControlLabel label="Blood Pressure Issue"
        control={
          <Checkbox checked={person.BloodPressureProblems>0} name="BloodPressureProblems" onChange={toggle} />
        }>
        </FormControlLabel>
        <FormControlLabel label="Transplants"
        control={
          <Checkbox checked={person.AnyTransplants>0} name="AnyTransplants" onChange={toggle} />
        }>
        </FormControlLabel>
      </div>
      <div className="row">
        <FormControlLabel label="Chronic Diseases"
        control={
          <Checkbox checked={person.AnyChronicDiseases>0} name="AnyChronicDiseases" onChange={toggle} />
        }>
        </FormControlLabel>
      <FormControlLabel label="Known Allergies"
        control={
          <Checkbox checked={person.KnownAllergies>0} name="KnownAllergies" onChange={toggle} />
        }>
        </FormControlLabel>
      <FormControlLabel label="Hereditary Cancer"
        control={
          <Checkbox checked={person.HistoryOfCancerInFamily>0} name="HistoryOfCancerInFamily" onChange={toggle} />
        }>
        </FormControlLabel>
      </div>
      <div className="row">
      <TextField label="Height (cm)" type="height" name="Height" onChange={updateInt} value={person["Height"]}
        helperText = "145-188" />
      <TextField label="Weight (kg)" type="weight" name="Weight" onChange={updateInt} value={person["Weight"]}
        helperText = "51-132" />
      <FormControl className={classes.formControl}>
      <InputLabel shrink id="demo-simple-select-placeholder-label-label">
          Major Surgeries
        </InputLabel>
      <Select name="NumberOfMajorSurgeries" value={person["NumberOfMajorSurgeries"]} onChange={updateInt}>
      {surgeries.map((num, index) => <MenuItem value={num}>{num}</MenuItem>)}
      </Select>
      </FormControl>
      </div>
      </DialogContent>
      <DialogActions>
      <Button variant="contained" color="primary" onClick={() => handleSubmit()}>Predict income</Button>
      </DialogActions>
    </Dialog>
    <Dialog open={open} onClose={handleClose}>
    <DialogTitle id="form-dialog-title">Prediction Result</DialogTitle>
    <DialogContent>
    <DialogContentText>
    {notice}
    </DialogContentText>
    </DialogContent>
    <DialogActions>
    <Button variant="contained" color="primary" onClick={handleClose}>OK</Button>
    </DialogActions>
    </Dialog>
    </div>);
}

function PremiumInsurance() {
  
  const [persons, setPersons] = useState([]);
  const [open, setOpen] = useState(false);
  const [opens, setOpens] = useState([]);

  const classes = useStyles();
  const handleClose = (record) => {
    setOpen(false);
    if(record != null) 
      if(record.label !== "Error") addPredict(record);
  }

  const handleOpen = () => {
    setOpen(true);
  }

  const handleButton = () =>{
    handleOpen();
  }

  const addPredict = (record) => {
    setPersons([...persons, record]);
    setOpens([...opens, false]); 
  };

  const openForm = (index) => {
    const temp = [...opens];
    temp[index] = true;
    setOpens(temp);
  }

  const closeForm = () => {
    let temp = [...opens];
    temp.forEach(function(part,index){
      temp[index] = false;
    }, temp);
    setOpens(temp);
  }


  return (
      <div className="themed" style={{backgroundImage:"url("+BGI+")"}}>
      <h1 style={{color:"red"}}>Predict your premium insurance price in Indian rupees</h1>
      <List className={classes.list}>
        {persons.map((person, index) => {
          return (<ListItem button onClick={()=>openForm(index)} >
            <ListItemText style={{color:"purple"}} primary={"Person " + (index+1)} />
            </ListItem>);
        })}
      </List>
      <div>
      <Button variant="contained" style={{maxWidth:"250px"}} color="secondary" onClick={handleButton}>Add new medical record</Button>
      </div>
      <PersonInput open={open} onClose={handleClose} />
      {persons.map((person, index) => <PersonForm color="success" open={opens[index]} onClose={closeForm} value={person} />)}
      </div>
      
  );
}

export default PremiumInsurance;
