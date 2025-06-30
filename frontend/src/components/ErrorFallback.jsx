import { Icon, Button, Alert, Box, Flex } from "@chakra-ui/react";
import { HiExclamation, HiRefresh } from "react-icons/hi";

const ErrorFallback = ({ message, onRetry }) => {
  return (
    <Box
      display={"flex"}
      flexDir={"column"}
      minHeight={"40vh"}
      justifyContent={"center"}
    >
      <Alert.Root
        pr="6"
        borderRadius={"xl"}
        title="ErrorFallback"
        bg="#22303C"
        status="error"
        gap="4"
        // border={"1px solid salmon"}
        shadow={"0 10px 40px #15202B"}
      >
        <Icon mt="0" color={"salmon"} size="lg">
          <HiExclamation />
        </Icon>
        <Alert.Content maxW={320} gap="2" color={"salmon"} textAlign={"left"}>
          <Alert.Title fontSize="xl" fontWeight={"bold"}>
            Something went wrong
          </Alert.Title>
          <Alert.Description color={"white"}>{message}</Alert.Description>
        </Alert.Content>
        <Flex justify={"end"} alignSelf="stretch" align={"end"}>
          <Button
            size={"sm"}
            outline={"none"}
            borderRadius={"full"}
            bg={"#15202B"}
            color="cyan.400"
            fontWeight={"bold"}
            onClick={onRetry}
          >
            Retry
            <HiRefresh />
          </Button>
        </Flex>
      </Alert.Root>
    </Box>
  );
};

export default ErrorFallback;
