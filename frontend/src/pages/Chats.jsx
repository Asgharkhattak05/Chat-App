import { ChatState } from "../context/ChatProvider";
import SideDrawer from "../components/miscellaneous/SideDrawer";
import MyChats from "../components/miscellaneous/MyChats";
import ChatBox from "../components/miscellaneous/ChatBox";
import { Box, Flex } from "@chakra-ui/react";
import { useState } from "react";

const Chats = () => {
  const [fetchAgain , setFetchAgain]=useState(false)
  const { user } = ChatState();
  
  return (
    <div style={{ width: "100%" }}>
      {user && <SideDrawer />}
      <Flex
        d="flex"
        justifyContent="space-between"
        w="100%"
        h="91.5vh"
        p="10px"
      >
        {user && <MyChats fetchAgain={fetchAgain}  />}

        {user && <ChatBox fetchAgain={fetchAgain} setFetchAgain={setFetchAgain} />}
      </Flex>
    </div>
  );
};

export default Chats;
