import React from 'react';
import { ListItem, ListItemText } from '@mui/material';

interface SupplyProps {
  name: string;
  quantity: string;
  unit: string;
}

const Supply: React.FC<SupplyProps> = ({ name, quantity, unit }) => {
  return (
    <ListItem>
      <ListItemText primary={`${name}: ${quantity}${unit}`} />
    </ListItem>
  );
};

export default Supply;
