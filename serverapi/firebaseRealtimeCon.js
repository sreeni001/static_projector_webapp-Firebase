const express = require('express');
const cors = require('cors');
const connectToFirebase = require('./connectToFirebase');
const db = connectToFirebase(); // Importing the db instance
require('dotenv').config();

const app = express();
app.use(express.json());
app.use(cors());

const corsOptions = {
    origin: "http://localhost:3000",
};

app.post('/submit',cors(corsOptions),(req,res)=>{
    const {usrname,pass} = req.body;
    if(usrname==process.env.admin && pass==process.env.passwrd){
        res.status(200).json({Name:'DR.SHANKAR SRIRAM',role:'Dean SoC'});
    }
    else{
        res.status(400).json({message:'Error proper Username and Password required'});
    }
})

//connecting mongodb Atlas to required database & the required collection

//finding all the data will be going with getrequest 

//Condition-1 getting all the classroom details from db --> not needed to be realtime
app.get('/fetchClassrooms', async (req, res) => {
    try {
        const classroomsSnapshot = await db.ref('classRooms').once('value');
        const classroomsData = classroomsSnapshot.val();

        // Transform the data into an array with `no` and `type` fields
        const classroomsArray = Object.values(classroomsData || {}).map(classroom => ({
            no: classroom.no,
            type: classroom.type
        }));

        res.status(200).json(classroomsArray);
    } catch (error) {
        console.error("Error fetching classroom details:", error);
        res.status(500).json({ message: 'Error fetching classroom details' });
    }
});
//Condition-2 getting the details of the accessing from accessing log when teacher name is given
app.post('/fetchTeacherLogs', async (req, res) => {
    try {
        const { staffName, date } = req.body; // Get staffName and Date from client request
        console.log(staffName,date);
        // Reference AccessLog collection
        const accessLogsSnapshot = await db.ref('AccessLog').once('value');
        const logs = accessLogsSnapshot.val();

        console.log("All logs from AccessLog:", logs); // Log all entries in AccessLog

        // Filter logs based on staffName and date
        const filteredLogs = Object.values(logs || {}).filter(log => log.staffName === staffName && log.date === date)
            .map(log => ({
                Class: log.classId,
                Time: log.accessTime
            }));

        console.log("Filtered logs:", filteredLogs); // Log the filtered results to debug

        // Send filtered logs as response
        res.status(200).json(filteredLogs);
    } catch (error) {
        console.error("Error fetching teacher logs:", error);
        res.status(500).json({ message: "Error fetching teacher logs" });
    }
});

//Condition 3 getting the status of projector when class id given
app.post('/fetchClassLogs', async (req, res) => {
    try {
        console.log("Into the api..");
        const { classId, date} = req.body;
        console.log(classId,date);
        // Query AccessLog node with filters
        const accessLogsSnapshot = await db.ref('AccessLog').orderByChild('classId').equalTo(classId).once('value');
        const logs = accessLogsSnapshot.val();

        // Filter for logs with matching Date and exitTime === null
        const matchingLog = Object.values(logs || {}).find(log => 
            log.date == date &&
            log.exitTime == "null" &&
            log.classId == classId
        );
        console.log("matchingLog...");
        if (matchingLog) {
            console.log("Yes");
            const responseData = {
                status: matchingLog.status,
                ClassId: matchingLog.classId,
                Name: matchingLog.staffName,
            };
            console.log("Done...");
            res.status(200).json(responseData);
        } else {
            res.status(404).json({ message: "No matching document found" });
        }
    } catch (error) {
        console.error("Cannot fetch classroom details:", error);
        res.status(500).json({ message: "Error fetching classroom details" });
    }
});
//get staffName;
// Get list of staff names
app.get('/StaffList', async (req, res) => {
    try {
        const staffListSnapshot = await db.ref('staffList').once('value');
        const staffList = Object.values(staffListSnapshot.val() || {}).map(staff => staff.staffName);
        res.status(200).json(staffList);
    } catch (error) {
        console.error("Error fetching staff list:", error);
        res.status(500).json({ message: 'Error fetching staff list' });
    }
});


app.listen(4000, () => console.log("Server is running on port 4000"));
//checking class id with exit time null and currentdate whic is the current accessing staff