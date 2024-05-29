import  { useState } from "react";
import { useToast } from "@chakra-ui/react";
import { Navigate } from "react-router-dom";


import {
  Button,
  FormControl,
  FormLabel,
  Input,
  InputGroup,
  InputRightElement,
  VStack,
} from "@chakra-ui/react";
import axios from "axios";
const Signup = () => {
  const [show, setShow] = useState(false);
  const [name, setName] = useState();
  const [email, setEmail] = useState();
  const [password, setPassword] = useState();
  const [confirmpassword, setConfirmpassword] = useState();
  const [pic, setPic] = useState();
  const [laoding, setLoaoding] = useState(false);
  const toast = useToast();

  const handleClick = () => {
    setShow(!show);
  };
  const postDetails = (pics) => {
    setLoaoding(true);
    if (!pics) {
      toast({
        title: "Please Select an Image!",
        status: "warning",
        duration: 5000,
        isClosable: true,
        position: "top-right",
      });
      setLoaoding(false);
      return;
    }
    if (pics.type.startsWith("image/")) {
      const data = new FormData();
      data.append("file", pics);
      data.append("upload_preset", "chat-app");
      data.append("cloud_name", "asghar");
      axios
        .post("https://api.cloudinary.com/v1_1/asghar/image/upload", data)
        .then((res) => {
          console.log(res.data.url.toString());
          setLoaoding(false);
          toast({
            title: "Image uploaded successfully!",
            status: "success",
            duration: 5000,
            isClosable: true,
            position: "top-right",
          });
        })
       
        .catch((err) => {
          console.log(err);
          setLoaoding(false);
        });
    } else {
      toast({
        title: "Please Select an Image!",
        status: "warning",
        duration: 5000,
        isClosable: true,
        position: "top-right",
      });
      setLoaoding(false);
      return;
    }
  };
  
  const submitHandler = async () => {
    setLoaoding(true);
    if (!name || !email || !password || !confirmpassword) {
      toast({
        title: "Please Fill All Fields!",
        status: "warning",
        duration: 5000,
        isClosable: true,
        position: "top-right",
      });
      setLoaoding(false);
      return;
    }
    if (password !== confirmpassword) {
      toast({
        title: "Passwords do not match!",
        status: "warning",
        duration: 5000,
        isClosable: true,
        position: "top-right",
      });
      setLoaoding(false);
      return;
    }
    try {
      const config = {
        headers: {
          "Content-Type": "application/json",
        },
      };
      const { data } = await axios.post("/api/user", { name, email, password, pic }, config);
      toast({
        title: "Registered Successfully",
        status: "success",
        duration: 5000,
        isClosable: true,
        position: "top-right",
      });
      localStorage.setItem("userInfo", JSON.stringify(data));
      setLoaoding(false);
      <Navigate to="/" />;
    } catch (error) {
      toast({
        title: "Error Occurred",
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "top-right",
      });
      setLoaoding(false);
    }
  };
  
  return (
    <VStack spacing="5px">
      <FormControl id="first-name" isRequired>
        <FormLabel>Name</FormLabel>
        <Input
          placeholder="Enter Your Name"
          onChange={(e) => setName(e.target.value)}
        />
      </FormControl>

      <FormControl id="email" isRequired>
        <FormLabel>Email</FormLabel>
        <Input
          placeholder="Enter Your Email"
          onChange={(e) => setEmail(e.target.value)}
        />
      </FormControl>

      <FormControl id="password" isRequired>
        <FormLabel>Password</FormLabel>
        <InputGroup>
          <Input
            type={show ? "text" : "password"}
            placeholder="Enter Your Password"
            onChange={(e) => setPassword(e.target.value)}
          />
          <InputRightElement width="4.5rem">
            <Button h="1.75rem" size="sm" onClick={handleClick}>
              {show ? "Hide" : "Show"}
            </Button>
          </InputRightElement>
        </InputGroup>
      </FormControl>

      <FormControl id="password" isRequired>
        <FormLabel>Confirm Password</FormLabel>
        <InputGroup>
          <Input
            type={show ? "text" : "password"}
            placeholder="Confirm Password"
            onChange={(e) => setConfirmpassword(e.target.value)}
          />
          <InputRightElement width="4.5rem">
            <Button h="1.75rem" size="sm" onClick={handleClick}>
              {show ? "Hide" : "Show"}
            </Button>
          </InputRightElement>
        </InputGroup>
      </FormControl>

      <FormControl id="pic">
        <FormLabel>Upload Your Picture</FormLabel>
        <Input
          type="file"
          p={1.5}
          accept="image/*"
          onChange={(e) => postDetails(e.target.files[0])}
        />
      </FormControl>

      <Button
        colorScheme="blue"
        width="100%"
        style={{ marginTop: 15 }}
        onClick={submitHandler}
        isLoading={laoding}
      >
        Sign Up
      </Button>
    </VStack>
  );
};

export default Signup;
