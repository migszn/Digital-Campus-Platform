import { 
  Divider, 
  useTheme, 
  Box, 
  Typography, 
  useMediaQuery,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Button,
} from "@mui/material";
import * as React from 'react';
import { motion } from "framer-motion";

import { useState, useEffect } from "react";
import {db} from "./firebase-config";
import {
  collection,
  getDocs,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
  onSnapshot,
} from "firebase/firestore";
import IconButton from '@mui/material/IconButton';
import Stack from '@mui/material/Stack';
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import Modal from '@mui/material/Modal';
import Fade from '@mui/material/Fade';
import CloseRoundedIcon from '@mui/icons-material/CloseRounded';
import TextField from '@mui/material/TextField';
import {toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useSelector } from "react-redux";

const ContactFacultyWidget = () => {
  const isNonMobileScreens = useMediaQuery("(min-width:1000px)");
  const { palette } = useTheme();
  const dark = palette.neutral.dark;
  const main = palette.neutral.main;
  const light = palette.neutral.light;
  const [faculty, setFaculty] = useState([]);
  const facultyCollectionRef = collection(db, "faculty")
  const [newDepartment, setNewDepartment] = useState("");
  const [newContactDetails, setNewContactDetails] = useState("");
  const [newContactFor, setNewContactFor] = useState("");
  const [open, setOpen] = useState(false);

  const [openEdit, setOpenEdit] = useState(false);

  //updated states
  const [selectedFaculty, setSelectedFaculty] = useState(null);
  const [updateddepartment, setUpdateddepartment] = useState("");
  const [updatedcontactDetails, setUpdatedcontactDetails] = useState("");
  const [updatedcontactFor, setUpdatedcontactFor] = useState("");

  const handleOpenEdit = (selectedFaculty) => {
      setSelectedFaculty(selectedFaculty);
      setUpdateddepartment(selectedFaculty.department);
      setUpdatedcontactDetails(selectedFaculty.contactDetails);
      setUpdatedcontactFor(selectedFaculty.contactFor);
      setOpenEdit(true);
    };

  const handleCloseEdit = () => {
  setOpenEdit(false);
  };

  const updateUser = async () => {
      const userDoc = doc(db, "faculty", selectedFaculty.id);
      await updateDoc(userDoc, {
        department: updateddepartment,
        contactDetails: updatedcontactDetails,
        contactFor: updatedcontactFor,
      });
      toast.success('Faculty updated!', {
        position: toast.POSITION.TOP_RIGHT
      });
      handleCloseEdit();
    };

  const handleOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const deleteUser = async (id) => {
    const userDoc = doc(db, "faculty", id);
    await deleteDoc(userDoc);
    toast.success('Faculty deleted!', {
      position: toast.POSITION.TOP_RIGHT
    });
  }

  useEffect(() => {
    const unsubscribe = onSnapshot(facultyCollectionRef, (snapshot) => {
      setFaculty(
        snapshot.docs.map((doc) => ({ ...doc.data(), id: doc.id }))
      );
    });
    return unsubscribe;
  }, []);

  const createUser = async () => {
    await addDoc(facultyCollectionRef, { department: newDepartment, contactDetails: newContactDetails, contactFor: newContactFor});
    toast.success('Faculty created!', {
      position: toast.POSITION.TOP_RIGHT
    });
  };
  
  const user = useSelector((state) => state.user);

  return (
        <motion.Box 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1, transition: { duration: 0.5, ease: "easeInOut" } }}
            exit={{ opacity: 0, transition: { duration: 0.5, ease: "easeInOut" } }}
            flexBasis="70%"
            borderRadius="10px"
            padding="1rem"
        >
            <Typography 
            pt="1rem" 
            pl="1rem" 
            pb="0.5rem"
            variant="h2"
            color={dark}
            >
            School Directory
            </Typography>
            <Divider />

            <Typography 
            pt="1rem"
            pl="1rem" 
            pb="0.5rem" 
            variant={isNonMobileScreens ? "body1" : "body2"}
            color={main}
            >Find and contact our faculty members for guidance, advice, and support.
            </Typography>
                   
            <Stack direction="row" spacing={1} justifyContent="flex-end">
              {user.isAdmin && (
                <IconButton aria-label="delete" onClick={handleOpen}>
                  <AddIcon />
                </IconButton>
              )}
            </Stack>


            <Modal
              closeAfterTransition
              open={open} 
              onClose={handleClose}
            >
              <Fade in={open}>
                <Box 
                   minWidth="350px" 
                   minHeight="300px" 
                  sx={{
                    position: 'absolute',
                    top: '50%',
                    left: '50%',
                    transform: 'translate(-50%, -50%)',
                    bgcolor: 'background.paper',
                    boxShadow: 24,
                    p: 4,
                    borderRadius: '16px',
                  }}
                >
                  <IconButton
                    aria-label="close"
                    sx={{
                      position: 'absolute',
                      top: 0,
                      right: 0,
                      color: 'primary.main',
                    }}
                    onClick={handleClose}
                  >
                    <CloseRoundedIcon />
                  </IconButton>
                  <Stack spacing={1} justifyContent="flex-end">
                  <TextField id="outlined-basic" label="Department" variant="outlined" 
                  onChange={(event) => {setNewDepartment(event.target.value)
                  }}/>
                  <TextField id="outlined-basic" label="Contact Details" variant="outlined"
                  onChange={(event) => {setNewContactDetails(event.target.value)
                  }}/>
                  <TextField id="outlined-basic" label="Contact Them For" variant="outlined" 
                  onChange={(event) => {setNewContactFor(event.target.value)
                  }}/>
                  <Button 
                    variant="outlined" 
                    onClick={() => {
                      createUser();
                      handleClose();
                    }}
                  ><Typography p={1}>Create Faculty</Typography></Button>
                  </Stack>
                </Box>
              </Fade>
            </Modal>


            <Box m={1} display="flex" sx={{ gap: '1rem' }} flexWrap="wrap">
            <TableContainer component={Paper}>
              <Table aria-label="Calendar table">
                <TableHead>
                  <TableRow style={{ backgroundColor: "black", color: "white" }}>
                    <TableCell colSpan={5} style={{ textAlign: "center" }}>
                      <Typography color="white">School Directory</Typography>
                    </TableCell>
                  </TableRow>
                  <TableRow >
                    <TableCell align="left">Department</TableCell>
                    <TableCell align="left">Contact Details</TableCell>
                    <TableCell colSpan={2} align="left">Contact Them For:</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {faculty.map((faculty) => (
                    <TableRow colSpan={5} key={faculty.id}>
                      <TableCell align="left">
                        <Typography>{faculty.department}</Typography>
                      </TableCell>
                      <TableCell align="left">
                        <Typography>{faculty.contactDetails}</Typography>
                      </TableCell>
                      <TableCell align="left">
                        <Typography>{faculty.contactFor}</Typography>
                      </TableCell>
                      {user.isAdmin && (
                      <TableCell align="left">
                        <IconButton onClick={() => handleOpenEdit(faculty)}><EditIcon/></IconButton>
                        <IconButton onClick={() => {deleteUser(faculty.id)}}>
                          <DeleteIcon/>
                          </IconButton>

                          <Modal
                            closeAfterTransition
                            open={openEdit} 
                            onClose={handleCloseEdit}
                            >
                            <Fade in={openEdit}>
                              <Box
                              minWidth="350px" 
                              minHeight="300px" 
                            sx={{
                              position: 'absolute',
                              top: '50%',
                              left: '50%',
                              transform: 'translate(-50%, -50%)',
                              bgcolor: 'background.paper',
                              boxShadow: 24,
                              p: 4,
                              borderRadius: '16px',
                            }}
                              >
                              <IconButton aria-label="close"
                              sx={{
                                position: 'absolute',
                                top: 0,
                                right: 0,
                                color: 'primary.main',
                              }}
                              onClick={handleCloseEdit}
                              >
                              <CloseRoundedIcon />
                              </IconButton>
                              <Stack spacing={1} justifyContent="flex-end">
                              <TextField id="outlined-basic" label="Department" variant="outlined" value={updateddepartment}
                              onChange={(event) => {setUpdateddepartment(event.target.value)
                              }}/>
                              <TextField id="outlined-basic" label="Contact Details" variant="outlined" value={updatedcontactDetails}
                              onChange={(event) => {setUpdatedcontactDetails(event.target.value)
                              }}/>
                              <TextField id="outlined-basic" label="Contact For" variant="outlined" value={updatedcontactFor}
                              onChange={(event) => {setUpdatedcontactFor(event.target.value)
                              }}/>
                              <Button 
                                variant="outlined" 
                                onClick={() => {
                                updateUser(faculty.id);
                                handleCloseEdit();
                                }}
                              ><Typography p={1}>Update Faculty</Typography></Button>
                              </Stack>
                              </Box>
                            </Fade>
                            </Modal>

                      </TableCell>
                      )}
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
            </Box>
          </motion.Box>
    );
};

export default ContactFacultyWidget;
