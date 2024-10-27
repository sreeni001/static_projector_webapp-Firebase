
import {React,useState,useEffect,useRef} from 'react';
import './cssfiles/Dashboard.css';
import { initializeApp } from 'firebase/app';
import { getDatabase, ref, onChildAdded, onChildChanged } from 'firebase/database';

const firebaseConfig = {
    apiKey:process.env.REACT_APP_api_Key,
    authDomain: "acceog-99589.firebaseapp.com",
    databaseURL: "https://acceog-99589-default-rtdb.firebaseio.com",
    projectId: "acceog-99589",
    storageBucket: "acceog-99589.appspot.com",
    messagingSenderId: "1076822396378",
    appId: "1:1076822396378:web:71696715fcd346c66944e3",
  };

// Initialize Firebase app
const app = initializeApp(firebaseConfig);

// Get a reference to the database
const db = getDatabase(app);

function Dashboard(props){
    const db = getDatabase();
    const [ProjectStatus,setProjectStatus]=useState({status:"OFF",ClassId:"NIL",Name:"NIL"});

    const [scrollTop, setScrollTop] = useState(0);

      const handleScroll = event => {
    setScrollTop(event.currentTarget.scrollTop);
    };

    /* Dashboard List (will be used to get Data from Db and set)*/
    const [DateList,selectDate] = useState(['Select Date','24/10/2024','25/10/2024','26/10/2024','27/10/2024','28/10/2024'])
    const [StaffList,selectStaff]= useState([]);
    const [ClassAccessed,getClassAccessed] = useState([]);
    //{Class:'LTC214',Time:'11 am'},{Class:'LTC214',Time:'11 am'},{Class:'LTC214',Time:'11 am'},{Class:'LTC214',Time:'11 am'},{Class:'LTC214',Time:'11 am'},{Class:'LTC214',Time:'11 am'},{Class:'LTC214',Time:'11 am'} 

    /*selectedDate and Staff List used for showing the selected data */
    const [selectedStaff,getSelectedStaff] = useState('');
    const [selectedDay,getSelectedDay] = useState('');

     /*Classroom*/
     const [classRoom,AvailableClassRoom] = useState([{type:"LTC",no:"214"},{type:"LTC",no:"214"},{type:"LTC",no:"214"},{type:"LTC",no:"214"},{type:"LTC",no:"214"},{type:"LTC",no:"214"},{type:"LTC",no:"214"},])

    /* Starting of Fetching Application details */
    const selectedStaffRef = useRef(selectedStaff);
    const selectedDayRef = useRef(selectedDay);


    const classInfoRef = useRef(null);
    const formattedDateRef = useRef(null);

    const updateSelectedStaff = (staff) => {
        getSelectedStaff(staff);
        selectedStaffRef.current = staff; // Update ref
    };

    const updateSelectedDay = (day) => {
        getSelectedDay(day);
        selectedDayRef.current = day; // Update ref
    };
    
    const listenToAccessLogChanges_2 = () => {
        const accessLogRef = ref(db, 'AccessLog');

        onChildAdded(accessLogRef, () => {
            console.log("New AccessLog entry added.");
            fetchClassDetails(classInfoRef.current, formattedDateRef.current);
        });

        onChildChanged(accessLogRef, () => {
            console.log("AccessLog entry updated.");
            fetchClassDetails(classInfoRef.current, formattedDateRef.current);
        });
    };

    const listenToAccessLogChanges = () => {
        const accessLogRef = ref(db, 'AccessLog');

        onChildAdded(accessLogRef, (data) => {
            const logEntry = data.val();
            console.log("New entry added:", logEntry);
            if (logEntry.date === selectedDayRef.current && logEntry.staffName === selectedStaffRef.current) {
                fetchData(selectedDayRef.current, selectedStaffRef.current);
            }
        });

        onChildChanged(accessLogRef, (data) => {
            const logEntry = data.val();
            console.log("Entry updated:", logEntry);
            if (logEntry.date === selectedDayRef.current && logEntry.staffName === selectedStaffRef.current) {
                fetchData(selectedDayRef.current, selectedStaffRef.current);
            }
        });
    };

    const fetchData = async (day, staff) => {
        try {
            console.log("fetch_Data:", day, staff);
            const response = await fetch("http://server.vercel.app/api/fetchTeacherLogs", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ "staffName": staff, "date": day }),
            });

            if (response.ok) {
                const result = await response.json();
                console.log("Response:", result);
                getClassAccessed(result);
            } else {
                console.error("Failed to access staff data");
            }
        } catch (error) {
            console.error("Error fetching data:", error);
        }
    };

    useEffect(() => {
        ClassinDb();
        StaffinDb();
    }, []);

    useEffect(() => {
        if (selectedDay && selectedStaff) {
            fetchData(selectedDay, selectedStaff);
        }
    }, [selectedDay, selectedStaff]);

    useEffect(() => {
        listenToAccessLogChanges();
        listenToAccessLogChanges_2();
    }, []);

    const fetchClassDetails = async (classId, date) => {
        if (!classId || !date) return;

        try {
            const response = await fetch("http://server.vercel.app/api/fetchClassLogs", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ classId, date }),
            });

            if (response.ok) {
                const result = await response.json();
                setProjectStatus(result);
            } else {
                console.error("Failed to fetch class details");
            }
        } catch (error) {
            console.error("Error fetching class details:", error);
        }
    };

    const handleClassClick = (Type, No) => {
        const class_Name = Type + No;
        classInfoRef.current = class_Name;
        const currentDate = new Date();
        const day = String(currentDate.getDate()).padStart(2, '0');
        const month = String(currentDate.getMonth() + 1).padStart(2, '0');
        const year = currentDate.getFullYear();
        const formattedDate = `${day}/${month}/${year}`;
        formattedDateRef.current = formattedDate.toString();
        console.log(class_Name,formattedDate.toString())
        fetchClassDetails(class_Name, formattedDate.toString());
    };

    const ClassinDb = async () => {
        try {
            const response = await fetch("http://server.vercel.app/api/fetchClassrooms");
            if (response.ok) {
                const result = await response.json();
                AvailableClassRoom(result);
            } else {
                console.error("Failed to access classroom data");
            }
        } catch (error) {
            console.error("Error fetching classroom data:", error);
        }
    };

    const StaffinDb = async () => {
        try {
            const response = await fetch("http://server.vercel.app/api/StaffList");
            if (response.ok) {
                const result = await response.json();
                selectStaff(result);
            } else {
                console.error("Failed to access staff data");
            }
        } catch (error) {
            console.error("Error fetching staff data:", error);
        }
    };

    const DaySelected = (e) => {
        updateSelectedDay(e.target.value);
        console.log(e.target.value);
    };

    const staffSelected = (e) => {
        updateSelectedStaff(e.target.value);
        console.log(e.target.value);
    };

       return(
     <>

     {(props.isvalidate==true)? <div className='ContentHolder'>

                <div className='ProjectorCondition'>
                                <h1 className='StatusBanner'>Projector Status: </h1>
                                <h1 className='Status'>{ProjectStatus.status}</h1>
                                <p className='ID'>ID: {ProjectStatus.ClassId}</p>
                                <p className='Name'>ID: {ProjectStatus.Name}</p>
                </div>
                <div className='StaffOperations'>
                        <div className='DaySelect'>
                        <select value={selectedDay} onChange={DaySelected}className='DayList'>
                                {DateList.map((day) =>(<option id={day} key={day} value={day}>{day}</option>))}
                            </select>
                        </div>
                        <div className='StaffSearch'>
                            <select value={selectedStaff} onChange={staffSelected} className='StaffList'>
                                {StaffList.map((staff) =>(<option id={staff} key={staff} value={staff}>{staff}</option>))}
                            </select>
                        </div>
                        {/* <div className='AccessedClassList'>

                        {ClassAccessed.map((classData) =>(
                            <div className='ListofClass' ><span className='classNames'>{classData.Class}</span><span className='Time'>{classData.Time}</span></div>
                        ))}

                        </div> */}
                        <div className="AccessedClassList"
                                 style={{
                                 maxHeight: '250px', // Set the desired max height to control the vertical scroll area
                                 overflowY: 'auto',  // Enable vertical scrolling
                                 overflowX: 'hidden', // Hide horizontal scrollbar
                                }}>
                                {ClassAccessed.map((classData) => (
                                <div className="ListofClass" key={classData.id}>
                                <span className="classNames" key={classData.Class}>{classData.Class}</span>
                               
                                <span className="Time">
                                    <img src='https://cdn2.iconfinder.com/data/icons/inverticons-stroke-vol-4/32/connection_signal_full_internet_phone-512.png' height='15px' width='15px'/>
                                    <img src='https://www.pngarts.com/files/4/Black-Wifi-Logo-Transparent-Images-279x279.png' height='15px' width='15px'/>
                                    {classData.Time}</span>
                                </div>
                                 ))}
                                </div>

                        </div>
                {/* Classroom Data */}
                <div className='Classrooms' style={{
                                 maxHeight: '400px', 
                               // Set the desired max height to control the vertical scroll area
                                 overflowY: 'hidden',  // Enable vertical scrolling
                                 overflowX: 'auto', // Hide horizontal scrollbar
                                }} >
                        <p className='Sampletext'>Classrooms</p>
                        <p className='SampleQuote'>“Learning is not limited to the classroom.”</p>
                        <div className='classContainer' style={{
                                 maxHeight: '400px',
                                 maxWidth:'100%', 
                               // Set the desired max height to control the vertical scroll area
                               
                                 overflowY: 'hidden',  // Disable vertical scrolling
                                 overflowX: 'auto',    // Enable horizontal scrolling
                                 display: 'flex',
                                 flexDirection: 'row',
                                }}>
                        {classRoom.map((classes) => (
                            <div className="Classes" onClick={()=>handleClassClick(classes.type, classes.no)}>
                                <img src='https://www.svgrepo.com/download/109705/open-book.svg' className="bookimg"/>
                                <div className='Type' key={classes.type}>{classes.type}</div>
                                <div className='No'key={classes.no}>{classes.no}</div>
                            </div>
                        ))}
                        </div>
                </div>

      </div> 
      : <p>Data Loading...</p>
      }
     </>   
    )
}

export default Dashboard;