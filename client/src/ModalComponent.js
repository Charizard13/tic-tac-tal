import React from "react";
import Button from "@material-ui/core/Button";
import TextField from "@material-ui/core/TextField";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";
import DialogTitle from "@material-ui/core/DialogTitle";
import axios from 'axios';

export default function FormDialog() {
  const [open, setOpen] = React.useState(false);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = (e) => {
    if (e.target.tagName == "DIV") return;
    let input = e.currentTarget.parentElement.parentElement.children[1].children[1].children[1].children[0];
    if (input.value) {
      let date = new Date().toDateString()
        axios.post('/api/v1/records', { name: input.value, date: date });
        setOpen(false);
    }
};

  let winnerList = [1];

  return (
    <div>
      <Button variant="outlined" color="primary" onClick={handleClickOpen}>
        Congrats , Enter your name!!{" "}
      </Button>
      <Dialog
        open={open}
        onClose={handleClose}
        aria-labelledby="form-dialog-title"

      >
        <DialogTitle id="form-dialog-title">You are the the best !!</DialogTitle>
        <DialogContent>
          <DialogContentText>
             Enter your name so you can keep record of your
            winnings{" "}
          </DialogContentText>
          <TextField
            autoFocus
            margin="dense"
            id="name"
            label="Your Name"
            type="Name"
            fullWidth
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="primary">
            Cancel
          </Button>
          <Button onClick={handleClose} color="primary">
            Enter
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}
