import { React } from 'react';
import {
  Dialog,
} from '@mui/material';

export default function CenterModal(props) {
  return (
    <Dialog
      open={props.open}
      onClose={props.handleClose}
      fullWidth={true}
    >
      <br />
      {props.children}
      <br />
    </Dialog>
  );
}
