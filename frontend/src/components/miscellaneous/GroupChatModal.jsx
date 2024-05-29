import {
    Box,
  Button,
  FormControl,
  Input,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  useDisclosure,
  useToast,
} from "@chakra-ui/react";
import React, { useState } from "react";
import { ChatState } from "../../context/ChatProvider";
import axios from "axios";
import UserListItem from "../UserAvatar/UserListItem";
import UserBadgeItem from "../UserAvatar/UserBadgeItem";

const GroupChatModal = ({ children }) => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [groupChatName, setGroupChatName] = useState();
  const [selectedUser, setSelectedUser] = useState([]);
  const [search, setSearch] = useState();
  const [searchResult, setSearchResult] = useState([]);
  const [loading, setLoading] = useState();

  const toast = useToast();

  const { user, chats, setChats } = ChatState();
  const handleSearch = async (query) => {
    setSearch(query);
    if (!query) {
      return;
    }
    try {
      setLoading(true);
      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      };
      const { data } = await axios.get(`/api/user?search=${search}`, config);
      console.log(data);
      setLoading(false);
      setSearchResult(data);
    } catch (error) {
      toast({
        title: "Error Occured",
        description: "Failed to load the search Results",
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "top-right",
      });
    }
  };
  const handleSubmit =async () => {
    if(!groupChatName || !selectedUser){
        toast({
            title: "Please Fill all the Fields",
            status: "warning",
            duration: 5000,
            isClosable: true,
            position: "top-right",
          });
          return;
    }
    try {
        const config = {
            headers: {
              Authorization: `Bearer ${user.token}`,
            },
          };
          const  {data} = await axios.post(`/api/chat/group`, {
            name:groupChatName,
        users:JSON.stringify(selectedUser.map((u)=>u._id))       
       },
    config);
    setChats([data,...chats]);
    onClose();
    toast({
        title: "Group Chat Created",
        status: "success",
        duration: 5000,
        isClosable: true,
        position: "top-right",
      
    })
 }
    catch (error) {
        toast({
            title: "Error Occured While Creating Group Chat",
            status: "error",
            duration: 5000,
            isClosable: true,
            position: "top-right",
          
        })
    }
  };
  const handleGroup = (userToAdd) => {
    if (selectedUser.includes(userToAdd)) {
      toast({
        title: "User Already Added",
        status: "warning",
        duration: 5000,
        isClosable: true,
        position: "top-right",
      });
      return;
    }
    setSelectedUser([...selectedUser, userToAdd]);
  };
  const handleDelete = (delUser) => {
    setSelectedUser(selectedUser.filter((u) => u._id!== delUser._id));
  };
  return (
    <>
      <span onClick={onOpen}>{children}</span>

      <Modal closeOnOverlayClick={false} isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader
            fontSize="35px"
            fontFamily="Work sans"
            display="flex"
            justifyContent="center"
          >
            Create Group Chat
          </ModalHeader>
          <ModalCloseButton />
          <ModalBody display="flex" flexDir="column" alignItems="center">
            <FormControl>
              <Input
                placeholder="Chat Name"
                mb={3}
                onChange={(e) => setGroupChatName(e.target.value)}
              />
            </FormControl>
            <FormControl>
              <Input
                placeholder="Add Users eg: john, Asghar , maryam"
                mb={1}
                onChange={(e) => handleSearch(e.target.value)}
              />
            </FormControl>
           <Box
           display="flex " w="100%" flexWrap="wrap">
           {selectedUser?.map((u) => (
              <UserBadgeItem
                key={u._id}
                user={u}
                handleFunction={() => handleDelete(u)}
              />
            ))}
           </Box>
            {loading ? (
              <div>Loading</div>
            ) : (
              searchResult
                ?.slice(0, 4)
                .map((user) => (
                  <UserListItem
                    key={user._id}
                    user={user}
                    handleFunction={() => handleGroup(user)}
                  />
                ))
            )}
          </ModalBody>

          <ModalFooter>
            <Button colorScheme="blue" onClick={handleSubmit}>
              Create Chat
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};

export default GroupChatModal;