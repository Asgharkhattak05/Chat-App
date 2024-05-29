import React from 'react'
import { ChatState } from '../../context/ChatProvider'
import { Avatar, Box, Flex, Text } from '@chakra-ui/react';

const UserListItem = ({ user, handleFunction}) => {
    
  return (
    <Flex
    onClick={handleFunction}
    cursor="pointer"
    bg="#E8E8E8"
    _hover={{
        background:"#38B2AC",
        color:"white"
    }}
    w="100%"
    display="flex"
    alignItems="center"
    color="black"
    px={3}
    py={2}
    mb={2}
    borderRadius="lg"
    >
    <Avatar
    mr={2}
    size="sm"
    cursor="pointer"
    name={user.name}
    src={user.pic}
     />
     <Box>
        <Text>
            {user.name}
        </Text>
        <Text>
            <b>Email : </b>
            {user.email}
        </Text>
     </Box>
      
    </Flex>
  )
}

export default UserListItem
