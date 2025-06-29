import {
  Box,
  Image,
  Flex,
  Heading,
  Stat,
  Group,
  FormatNumber,
  Icon,
} from "@chakra-ui/react";
import { Tooltip } from "../components/ui/tooltip";
import { HiFire } from "react-icons/hi";

function MemeCard({ title, imageUrl, hypeScore, score, numComments }) {
  return (
    <Flex
      borderWidth={"1px"}
      justify={"space-between"}
      direction={"column"}
      borderColor={"#22303C"}
      _hover={{ bg: "#22303C", transition: "background-color 500ms ease-out" }}
      borderRadius="2xl"
      overflow="hidden"
      bg={"#192734"}
    >
      <Flex direction={"column"} p="3" gap="1">
        <Heading as="h4" size="md" mb={4} noOfLines={2} display={"flex"}>
          {title}
        </Heading>
        <Box borderWidth={1} borderColor={"#22303C"} borderRadius="lg">
          <Image
            src={imageUrl}
            alt={title}
            borderRadius="lg"
            objectFit="cover"
            h="200px"
            w="100%"
          />
        </Box>
        <Tooltip
          content="Meme HYPE score"
          positioning={{ placement: "top-start" }}
        >
          <Flex color={"darkorange"} gap="2.5" alignItems={"center"}>
            <Icon>
              <HiFire />
            </Icon>
            <FormatNumber value={hypeScore} cur={"po"} />
          </Flex>
        </Tooltip>
      </Flex>
      <Flex p="4" direction={"column"}>
        <Group gap="2">
          <Stat.Root>
            <Stat.ValueText>
              <FormatNumber value={score} />
            </Stat.ValueText>
            <Stat.HelpText color="#8899A6">Upvotes</Stat.HelpText>
          </Stat.Root>
          <Stat.Root>
            <Stat.ValueText>
              <FormatNumber value={numComments} />
            </Stat.ValueText>
            <Stat.HelpText color="#8899A6">Comment(s)</Stat.HelpText>
          </Stat.Root>
        </Group>
      </Flex>
    </Flex>
  );
}

export default MemeCard;
