import {
  Container,
  Text,
  VStack,
  HStack,
  Button,
  Heading,
  Spinner,
  SimpleGrid,
  Icon,
  Box,
  Alert,
  Flex,
} from "@chakra-ui/react";
import { useState, useEffect, Fragment } from "react";
import axios from "axios";
import { HiX } from "react-icons/hi";
import MemeCard from "./components/MemeCard";
import SearchBar from "./components/SearchBar";

// Define the base URL for our API.
// Your FastAPI server is running on port 8000 by default.
const API_URL = "http://127.0.0.1:8000";

function App() {
  const [memes, setMemes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [searchResults, setSearchResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  // fetch data when the component mounts
  useEffect(() => {
    const fetchMemes = async () => {
      try {
        // GET request to our /memes endpoint
        const response = await axios.get(`${API_URL}/memes`);
        setMemes(response.data); // Store the fetched memes in state
      } catch (err) {
        setError("Failed to fetch memes. Is the backend server running?");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchMemes();
  }, []);

  const handleSearch = async (query) => {
    setIsSearching(true);
    setSearchQuery(query);
    setError(null);
    try {
      const response = await axios.post(`${API_URL}/search`, { query });
      setSearchResults(response.data);
    } catch (err) {
      setError("Search failed. Please try again.");
      console.error(err);
    } finally {
      setIsSearching(false);
    }
  };

  const clearSearch = () => {
    setSearchResults([]);
    setSearchQuery("");
  };

  const renderContent = () => {
    if (loading) {
      return (
        <Box
          display={"flex"}
          textAlign="center"
          flexDir={"column"}
          minHeight={"40vh"}
          width={"100%"}
        >
          <HStack
            display={"flex"}
            gap="4"
            alignItems={"center"}
            flex={1}
            justifyContent={"center"}
          >
            <Spinner size="md" color="cyan.400" />
            <Text size="sm" color="#8899A6">
              Loading Memes...
            </Text>
          </HStack>
        </Box>
      );
    }

    if (error) {
      return (
        <Alert status="error" borderRadius="md">
          {error}
        </Alert>
      );
    }

    const memesToDisplay = searchQuery ? searchResults : memes;

    return (
      <Fragment>
        {searchQuery && (
          <Box alignSelf="flex-start" mb={4}>
            <HStack color="#8899A6">
              <Text as={"h5"} fontSize="md">
                Showing results for
              </Text>
              <Button
                onClick={clearSearch}
                color="cyan.500"
                p="3"
                size={"sm"}
                borderRadius={"xl"}
                outline={"none"}
                bg={"#22303C"}
                fontWeight={"600"}
              >
                {searchQuery}
                <Icon size="sm" color="cyan.400">
                  <HiX />
                </Icon>
              </Button>
            </HStack>
          </Box>
        )}
        {memesToDisplay.length > 0 ? (
          <SimpleGrid columns={{ base: 1, md: 2, lg: 3, xl: 4 }} gap={8}>
            {memesToDisplay.map((meme) => {
              return (
                <MemeCard
                  key={meme.id}
                  title={meme.title}
                  imageUrl={meme.image_url}
                  hypeScore={meme.hype_score}
                  score={meme.score}
                  numComments={meme.num_comments}
                />
              );
            })}
          </SimpleGrid>
        ) : (
          <Box
            display={"flex"}
            textAlign="center"
            flexDir={"column"}
            minHeight={"40vh"}
            width={"100%"}
          >
            {!isSearching ? (
              <HStack
                display={"flex"}
                gap="4"
                alignItems={"center"}
                flex={1}
                justifyContent={"center"}
              >
                <Text size="sm" color="#8899A6">
                  No memes found for this search.
                </Text>
              </HStack>
            ) : (
              <HStack
                display={"flex"}
                gap="4"
                alignItems={"center"}
                flex={1}
                justifyContent={"center"}
              >
                <Spinner size="md" color="cyan.400" />
                <Text size="sm" color="#8899A6">
                  Loading Memes...
                </Text>
              </HStack>
            )}
          </Box>
        )}
      </Fragment>
    );
  };

  return (
    <Box
      bg="#15202B"
      w={"100vw"}
      overflowY="auto"
      scrollbar={"hidden"}
      scrollBehavior="smooth"
      maxH={"100vh"}
      minH="100vh"
      color={"white"}
    >
      <Container pb={4}>
        <VStack position={"relative"} width="100%" align={"start"}>
          <Flex
            position={"sticky"}
            zIndex={40}
            py={5}
            top={0}
            left={0}
            right={0}
            gap={6}
            mb={6}
            bg="#15202B"
            flexWrap={"wrap"}
            justify={"space-between"}
            width="100%"
            align={"center"}
          >
            <VStack flex={1} minW={320} align={"left"} gap="0">
              <Heading
                as="h2"
                lineHeight={"short"}
                letterSpacing="tight"
                size="2xl"
              >
                Meme Stock Analyzer
              </Heading>
              <Text size="md" color={"whiteAlpha.600"} letterSpacing="wider">
                r/MemeEconomy
              </Text>
            </VStack>
            <Flex flex={1}>
              <SearchBar onSearch={handleSearch} isLoading={isSearching} />
            </Flex>
          </Flex>
          {renderContent()}
        </VStack>
      </Container>
    </Box>
  );
}

export default App;
