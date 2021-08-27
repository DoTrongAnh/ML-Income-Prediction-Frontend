import './App.css';
import React, { useState } from "react";
import { makeStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import FormControl from '@material-ui/core/FormControl';
import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
import TextField from '@material-ui/core/TextField';
import Select from '@material-ui/core/Select';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import BGI from './finance.jpg';

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
  else if(record.label === "<=50K") {
    message = "This person will likely make less than 50K per year...";
  }
  else {
    message = "This person will likely make more than 50K per year!";
  }
  return (
    <Dialog open={props.open} scroll="paper" onClose={props.onClose}>
    <DialogTitle id="form-dialog-title">Personal Info</DialogTitle>
    <DialogContent>
    <div>
    <TextField variant="filled" InputProps={readOnlySetting} label="Age" defaultValue={record.age} />
    <TextField variant="filled" InputProps={readOnlySetting} label="Workclass" defaultValue={record.workclass} />
    <TextField variant="filled" InputProps={readOnlySetting} label="Education" defaultValue={record.education} />
    <TextField variant="filled" InputProps={readOnlySetting} label="Education Number" defaultValue={record["education-num"]} />
    </div>
    <div>
    <TextField variant="filled" InputProps={readOnlySetting} label="Final Weight" defaultValue={record.fnlwgt} />
    <TextField variant="filled" InputProps={readOnlySetting} label="Marital Status" defaultValue={record["marital-status"]} />
    <TextField variant="filled" InputProps={readOnlySetting} label="Relationship" defaultValue={record.relationship} />
    <TextField variant="filled" InputProps={readOnlySetting} label="Sex" defaultValue={record.sex} />
    <TextField variant="filled" InputProps={readOnlySetting} label="Race" defaultValue={record.race} />
    <TextField variant="filled" InputProps={readOnlySetting} label="Occupation" defaultValue={record.occupation} />
    </div>
    <div>
    <TextField variant="filled" InputProps={readOnlySetting} label="Capital Gain" defaultValue={record["capital-gain"]} />
    <TextField variant="filled" InputProps={readOnlySetting} label="Capital Loss" defaultValue={record["capital-loss"]} />
    <TextField variant="filled" InputProps={readOnlySetting} label="Hours per week" defaultValue={record["hours-per-week"]} />
    <TextField variant="filled" InputProps={readOnlySetting} label="Native Country" defaultValue={record["native-country"]} />
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
    age: 37,
    workclass: "Private",
    fnlwgt: 34146,
    education: "HS-grad",
    "education-num": 9,
    "marital-status": "Married-civ-spouse",
    occupation: "Craft-repair",
    relationship: "Husband",
    race: "White",
    sex: "Male",
    "capital-gain": 0,
    "capital-loss": 0,
    "hours-per-week": 68,
    "native-country": "United-States"
});
  const [open, setOpen] = useState(false);


  const updateInt = (event) => {
    const num = parseInt(event.target.value);
    const temp = {...person};
    temp[event.target.name] = num;
    setPerson(temp);
  };
  const updateCat = (event) => {
    const cat = event.target.value;
    const temp = {...person};
    temp[event.target.name] = cat;
    setPerson(temp);
  };
  const setLabel = (label) => {
    const temp = {...person};
    temp["label"] = label;
    setPerson(temp);
  };
  const handleSubmit = () => {
    var record = {...person}
    delete record.label;
    alert(JSON.stringify(record));
    const link = 'http://127.0.0.1:8000/api/v1/income_classifier/predict';
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
  let notice = "";
  if(person.label == null) notice = "No prediction has been provided!";
  else if(person.label === "<=50K") notice = "This person is likely to earn less than 50K anually!";
  else notice =  "This person is likely to earn more than 50K anually!";
  const workclasses = ['State-gov','Self-emp-not-inc','Private','Federal-gov','Local-gov',
 'Self-emp-inc', 'Without-pay', 'Never-worked'];
  const educations = ['Bachelors','HS-grad','11th','Masters','9th','Some-college','Assoc-acdm',
 'Assoc-voc','7th-8th','Doctorate','Prof-school','5th-6th','10th',
 '1st-4th','Preschool','12th'];
  const eduNums = [1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16];
  const maritals = ['Never-married','Married-civ-spouse','Divorced','Married-spouse-absent',
 'Separated','Married-AF-spouse','Widowed'];
  const relations = ['Not-in-family','Husband','Wife','Own-child','Unmarried','Other-relative'];
  const sexes = ["Male","Female"];
  const races = ['White','Black','Asian-Pac-Islander','Amer-Indian-Eskimo','Other'];
  const jobs = ['Adm-clerical','Exec-managerial','Handlers-cleaners','Prof-specialty',
 'Other-service','Sales','Craft-repair','Transport-moving',
 'Farming-fishing','Machine-op-inspct','Tech-support',
 'Protective-serv','Armed-Forces','Priv-house-serv'];
  const countries = ['United-States','Cuba','Jamaica','India','Mexico','South',
 'Puerto-Rico','Honduras','England','Canada','Germany','Iran',
 'Philippines','Italy','Poland','Columbia','Cambodia','Thailand','Ecuador',
 'Laos','Taiwan','Haiti','Portugal','Dominican-Republic','El-Salvador',
 'France','Guatemala','China','Japan','Yugoslavia','Peru',
 'Outlying-US(Guam-USVI-etc)', 'Scotland', 'Trinadad&Tobago', 'Greece',
 'Nicaragua', 'Vietnam', 'Hong', 'Ireland', 'Hungary', 'Holand-Netherlands'];
  return (
    <div>
    <Dialog maxWidth="md" open={props.open} scroll="paper" onClose={() => props.onClose(null)} aria-labelledby="form-dialog-title">
      <DialogTitle id="form-dialog-title">Personal Info</DialogTitle>
      <DialogContent>
      <div className="row">
        <TextField label="Age" type="age" name="age" onChange={updateInt} value={person.age}
        helperText = "17-90" />
        <FormControl className={classes.formControl}>
        <InputLabel shrink id="demo-simple-select-placeholder-label-label">
          Workclass
        </InputLabel>
        <Select name="workclass" value={person.workclass} onChange={updateCat}>
        {workclasses.map((workclass, index) => 
          <MenuItem value={workclass}>{workclass}</MenuItem>)}
        </Select>
        </FormControl>
        <FormControl className={classes.formControl}>
        <InputLabel shrink id="demo-simple-select-placeholder-label-label">
          Education
        </InputLabel>
        <Select name="education" value={person.education} onChange={updateCat}>
        {educations.map((edu, index) => 
          <MenuItem value={edu}>{edu}</MenuItem>)}
        </Select>
        </FormControl>
        <FormControl className={classes.formControl}>
        <InputLabel shrink id="demo-simple-select-placeholder-label-label">
          Education number
        </InputLabel>
        <Select name="education-num" value={person["education-num"]} onChange={updateInt}>
        {eduNums.map((num, index) => 
          <MenuItem value={num}>{num}</MenuItem>)}
        </Select>
        </FormControl>
      </div>
      <div className="row">
      <TextField label="Final Weight" type="fnlwgt" name="fnlwgt" onChange={updateInt} value={person.fnlwgt}
        helperText = "12885-1484705" />
      <FormControl className={classes.formControl}>
      <InputLabel shrink id="demo-simple-select-placeholder-label-label">
          Marital status
        </InputLabel>
      <Select name="marital-status" value={person["marital-status"]} onChange={updateCat}>
      {maritals.map((status, index) => 
        <MenuItem value={status}>{status}</MenuItem>)}
      </Select>
      </FormControl>
      <FormControl className={classes.formControl}>
      <InputLabel shrink id="demo-simple-select-placeholder-label-label">
          Relationship
        </InputLabel>
      <Select name="relationship" value={person.relationship} onChange={updateCat}>
      {relations.map((relate, index) => 
        <MenuItem value={relate}>{relate}</MenuItem>)}
      </Select>
      </FormControl>
      <FormControl className={classes.formControl}><InputLabel shrink id="demo-simple-select-placeholder-label-label">
          Sex
        </InputLabel>
      <Select name="sex" value={person.sex} onChange={updateCat}>
      {sexes.map((sex, index) => <MenuItem value={sex}>{sex}</MenuItem>)}
      </Select>
      </FormControl>
      <FormControl className={classes.formControl}>
      <InputLabel shrink id="demo-simple-select-placeholder-label-label">
          Race
        </InputLabel>
      <Select name="race" value={person.race} onChange={updateCat}>
      {races.map((race, index) => <MenuItem value={race}>{race}</MenuItem>)}
      </Select>
      </FormControl>
      </div>
      <div className="row">
      <FormControl className={classes.formControl}>
      <InputLabel shrink id="demo-simple-select-placeholder-label-label">
          Occupation
        </InputLabel>
      <Select name="occupation" value={person.occupation} onChange={updateCat}>
      {jobs.map((job, index) => <MenuItem value={job}>{job}</MenuItem>)}
      </Select>
      </FormControl>
      <TextField label="Capital gain" type="capital-gain" name="capital-gain" onChange={updateInt} value={person["capital-gain"]}
        helperText = "0-99999" />
      <TextField label="Capital loss" type="capital-loss" name="capital-loss" onChange={updateInt} value={person["capital-loss"]}
        helperText = "0-4356" />
      <TextField label="Hours per week" type="hours-per-week" name="hours-per-week" onChange={updateInt} value={person["hours-per-week"]}
        helperText = "1-99" />
      </div>
      <div className="row">
      <FormControl className={classes.formControl}>
      <InputLabel shrink id="demo-simple-select-placeholder-label-label">
          Native Country
        </InputLabel>
      <Select name="native-country" value={person["native-country"]} onChange={updateCat}>
      {countries.map((pays, index) => <MenuItem value={pays}>{pays}</MenuItem>)}
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

function IncomeClassifier() {
  
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

  const pickColor = (person)=>{
        if(person == null || person.label == null) return "error";
        switch(person.label){
          case ">50K": return "success";
          case "<=50K": return "warning";
          default: return "error";
        }
      };

  return (
      <div className="themed" style={{backgroundImage:"url("+BGI+")"}}>
      <h1 style={{color:"blue"}}>Will your income be above 50K anually?</h1>
      <List className={classes.list}>
        {persons.map((person, index) => {
          return (<ListItem button onClick={()=>openForm(index)} >
            <ListItemText style={{color:"purple"}} primary={"Person " + (index+1)} />
            </ListItem>);
        })}
      </List>
      <div>
      <Button variant="contained" style={{maxWidth:"250px"}} color="primary" onClick={handleButton}>Add new personal info</Button>
      </div>
      <PersonInput open={open} onClose={handleClose} />
      {persons.map((person, index) => <PersonForm color={pickColor(person)} open={opens[index]} onClose={closeForm} value={person} />)}
      </div>
      
  );
}

export default IncomeClassifier;
