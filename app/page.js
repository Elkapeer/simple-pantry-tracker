'use client'

import { useState, useEffect } from 'react'
import { Box, Stack, Typography, Button, Modal, TextField, Divider } from '@mui/material'
import { firestore } from '@/firebase'
import {
  collection,
  doc,
  getDocs,
  query,
  setDoc,
  deleteDoc,
  getDoc,
} from 'firebase/firestore'

const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 400,
  bgcolor: 'white',
  border: '2px solid #000',
  boxShadow: 24,
  p: 4,
  display: 'flex',
  flexDirection: 'column',
  gap: 3,
  borderRadius: '10px',
}

const buttonStyle = {
  bgcolor: '#433D8B',
  '&:hover': {
    bgcolor: '#2E236C'
  },
  marginLeft: 1
}

export default function Home() {
  // We'll add our component logic here
  const [inventory, setInventory] = useState([])
  const [open, setOpen] = useState(false)
  const [itemName, setItemName] = useState('')

  const updateInventory = async () => {
    const snapshot = query(collection(firestore, 'inventory'))
    const docs = await getDocs(snapshot)
    const inventoryList = []
    docs.forEach((doc) => {
      inventoryList.push({ name: doc.id, ...doc.data() })
    })
    setInventory(inventoryList)
  }

  useEffect(() => {
    updateInventory()
  }, [])

  const addItem = async (item) => {
    const docRef = doc(collection(firestore, 'inventory'), item)
    const docSnap = await getDoc(docRef)
    if (docSnap.exists()) {
      const { quantity } = docSnap.data()
      await setDoc(docRef, { quantity: quantity + 1 })
    } else {
      await setDoc(docRef, { quantity: 1 })
    }
    await updateInventory()
  }

  const removeItem = async (item) => {
    const docRef = doc(collection(firestore, 'inventory'), item)
    const docSnap = await getDoc(docRef)
    if (docSnap.exists()) {
      const { quantity } = docSnap.data()
      if (quantity === 1) {
        await deleteDoc(docRef)
      } else {
        await setDoc(docRef, { quantity: quantity - 1 })
      }
    }
    await updateInventory()
  }

  const handleOpen = () => setOpen(true)
  const handleClose = () => setOpen(false)

  return (
    <Box
      width="100vw"
      height="100vh"
      display={'flex'}
      justifyContent={'center'}
      flexDirection={'column'}
      alignItems={'center'}
      gap={2}
      sx={{
        backgroundImage: "url('/bg.jpg')", // Correctly specify the path to your image
        backgroundSize: 'cover', // Ensures the image covers the entire background
        backgroundPosition: 'center', // Centers the image
        backgroundRepeat: 'no-repeat', // Prevents the image from repeating
      }}
    >
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
          <Typography id="modal-modal-title" variant="h6" component="h2" sx={{ color: '#2E236C' }}>
            Add Item
          </Typography>
          <Stack width="100%" direction={'row'} spacing={2}>
            <TextField
              id="outlined-basic"
              label="Item"
              variant="outlined"
              fullWidth
              value={itemName}
              onChange={(e) => setItemName(e.target.value)}
              sx={{
                "& .MuiOutlinedInput-root": {
                  "& fieldset": {
                    borderColor: "#433D8B", // Default border color
                  },
                  "&:hover fieldset": {
                    borderColor: "#2E236C", // Border color on hover
                  },
                  "&.Mui-focused fieldset": {
                    borderColor: "#433D8B", // Border color when focused
                  },
                },
                "& .MuiInputLabel-root": {
                  color: "#433D8B", // Label color
                },
                "& .MuiInputLabel-root.Mui-focused": {
                  color: "#433D8B", // Label color when focused
                },
              }}
            />
            <Button
              variant="outlined"
              onClick={() => {
                addItem(itemName)
                setItemName('')
                handleClose()
              }}
              sx={{
                color: "#433D8B",
                outlineColor: "#433D8B",
                borderColor: "#433D8B",
                "&:hover": {
                  borderColor: "#2E236C"
                }
              }}
            >
              Add
            </Button>
          </Stack>
        </Box>
      </Modal>
      <Button variant="contained" onClick={handleOpen}
        sx={
          buttonStyle
        }
      >
        Add New Item
      </Button>
      <Box border={'1px solid #333'} sx={{
        borderRadius: 5,
        borderColor: "#433D8B",
        bgcolor: "#FFFFFF"
      }}>
        <Box
          width="800px"
          height="50px"
          display={'flex'}
          justifyContent={'center'}
          alignItems={'center'}
        >
          <Typography variant={'h4'} textAlign={'center'} sx={{ color: '#2E236C' }}>
            Inventory
          </Typography>
        </Box>
        <Stack width="800px" height="300px" overflow={'auto'} marginBottom={3}>
          {inventory.map(({ name, quantity }) => (
            <Box key={name}>
              <Divider sx={{
                marginX: 5,
                borderColor: '#433D8B'
              }}>
              </Divider>
              <Box
                key={name}
                width="100%"
                minHeight="80px"
                display={'flex'}
                justifyContent={'space-between'}
                alignItems={'center'}
                paddingX={5}
              >
                <Typography variant={'h5'} textAlign={'start'} width={"400px"} sx={{
                  whiteSpace: 'nowrap',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                }}>
                  {name.charAt(0).toUpperCase() + name.slice(1)}
                </Typography>
                <Typography variant={'h5'} textAlign={'center'}>
                  {quantity}
                </Typography>
                <Box justifyContent={'end'}>
                  <Button variant="contained" onClick={() => addItem(name)} sx={buttonStyle}>
                    Add
                  </Button>
                  <Button variant="contained" onClick={() => removeItem(name)} sx={buttonStyle}>
                    Remove
                  </Button>
                </Box>
              </Box>
            </Box>
          ))}
        </Stack>
      </Box>
    </Box>
  )
}
