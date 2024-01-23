import React, { useState } from 'react';
import {
  Box,
  Text,
  Button,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
} from '@chakra-ui/react';

const DropdownMenu = () => {
  const [selectedItem, setSelectedItem] = useState(null);

  const handleSelect = (item) => {
    setSelectedItem(item);
  };

  return (
    <Box>
      <Menu>
        <MenuButton as={Button} rightIcon="chevron-down">
          Select an Option
        </MenuButton>
        <MenuList>
          <MenuItem onClick={() => handleSelect('Option 1')}>Option 1</MenuItem>
          <MenuItem onClick={() => handleSelect('Option 2')}>Option 2</MenuItem>
          <MenuItem onClick={() => handleSelect('Option 3')}>Option 3</MenuItem>
        </MenuList>
      </Menu>
    </Box>
  );
};

export default DropdownMenu;
