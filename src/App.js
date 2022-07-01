import { TextField } from "@material-ui/core";
import { Button, FormGroup, TableContainer } from "@mui/material";
import Chip from "@mui/material/Chip";
import Paper from "@mui/material/Paper";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import { useEffect, useState } from "react";
import "./App.css";
import getWeb3 from "./getWeb3";
import TaskContract from "./TaskContract.json";
import DeleteIcon from "@mui/icons-material/Delete";

const contractAddress = "0x91234B50002E168bEF0b6B0A0836d6FB49981414";

function App() {
  const [contract, setContract] = useState(null);
  const [desc, setDesc] = useState("");
  const [currentAccount, setCurrentAccount] = useState("");
  const [tasksList, setTasksList] = useState([]);

  async function load() {
    let web3 = await getWeb3();

    if (web3) {
      let accounts = await web3.eth.requestAccounts();

      const contractList = await new web3.eth.Contract(
        TaskContract.abi,
        contractAddress
      );
      let tasks = await contractList.methods.getMyTasks().call();

      setContract(contractList);
      setCurrentAccount(accounts[0]);
      setTasksList(tasks);
    }
  }

  useEffect(() => {
    load();
  }, []);

  // window.ethereum.on("accountsChanged", function (accounts) {
  //   load();
  //   // setCurrentAccount(accounts[0]);
  // });
  // window.ethereum.on("chainChanged", function (accounts) {
  //   load();
  //   // setCurrentAccount(accounts[0]);
  // });

  const addTask = async () => {
    try {
      let receipt = await contract.methods
        .addTask(desc, false)
        .send({ from: currentAccount, gas: 4500000 });
      console.log(receipt);
      load();
      // const event = contract.
    } catch (error) {
      console.log("Error while caling addTask method: ", error);
    }
  };

  const handleDelete = async (id) => {
    try {
      let receipt = await contract.methods
        .deleteTask(id, true)
        .send({ from: currentAccount, gas: 4500000 });
      console.log(receipt);
      load();
      // const event = contract.
    } catch (error) {
      console.log("Error while caling delete method: ", error);
    }
  };

  return (
    <div className="container">
      <FormGroup row sx={{ alignItems: "center", margin: "20px" }}>
        <TextField
          variant="outlined"
          label="Task Description"
          style={{ margin: "8px", width: "400px", borderRadius: 6 }}
          value={desc}
          onChange={(e) => setDesc(e.target.value)}
        />
        <Button
          variant="contained"
          sx={{ height: "50px", borderRadius: 3 }}
          onClick={addTask}
        >
          Add Task
        </Button>
      </FormGroup>
      <span>Your Tasks: </span>
      <TableContainer
        component={Paper}
        sx={{ width: "60%", m: 3, boxShadow: 6, p: 1, borderRadius: 5 }}
      >
        <Table size="small" aria-label="a dense table">
          <TableHead className="table-header">
            <TableRow sx={{ fontWeight: 100 }}>
              <TableCell align="center" sx={{ fontWeight: "bold" }}>
                Task id
              </TableCell>
              <TableCell align="left" sx={{ fontWeight: "bold" }}>
                Task Description
              </TableCell>
              <TableCell align="center" sx={{ fontWeight: "bold" }}>
                Status
              </TableCell>
              <TableCell align="center" sx={{ fontWeight: "bold" }}></TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {tasksList.map((task) => {
              return (
                <TableRow
                  key={task.id}
                  sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
                >
                  <TableCell align="center">{task.id}</TableCell>
                  <TableCell align="left">{task.taskText}</TableCell>
                  <TableCell align="center">
                    {task.isDeleted ? (
                      <Chip label="Inactive" color="error" variant="filled" />
                    ) : (
                      <Chip label="Active" color="success" variant="filled" />
                    )}
                  </TableCell>
                  <TableCell align="center" title="Mark as Completed">
                    <DeleteIcon
                      style={{ cursor: "pointer" }}
                      onClick={() => handleDelete(task.id)}
                    />
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </TableContainer>
    </div>
  );
}

export default App;
