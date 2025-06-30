import { useState, useEffect, useCallback, Fragment } from "react";
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
  Flex,
} from "@chakra-ui/react";
import axios from "axios";
import { HiX } from "react-icons/hi";
import MemeCard from "./components/MemeCard";
import SearchBar from "./components/SearchBar";
import ErrorFallback from "./components/ErrorFallback";

// Deployed Fargate container's public IP
const API_URL = import.meta.env.VITE_API_URL;

function App() {
  const [memes, setMemes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [searchResults, setSearchResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const fetchMemes = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await axios.get(`${API_URL}/memes?limit=50`);
      setMemes(response.data);
    } catch (err) {
      setError(
        "Could not connect to the analytics server. It might be offline or starting up."
      );
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, []);

  // fetch data when the component mounts
  useEffect(() => {
    fetchMemes();
  }, [fetchMemes]);

  const handleSearch = async (query) => {
    setIsSearching(true);
    setError(null);
    try {
      const response = await axios.post(`${API_URL}/search`, { query });
      setSearchResults(response.data);
      setSearchQuery(query);
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
    setError(null);
  };

  const renderContent = () => {
    if (error && !isSearching) {
      return <ErrorFallback message={error} onRetry={fetchMemes} />;
    }

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
            <Text size="sm" fontWeight={"bolder"} color="#8899A6">
              Loading Memes...
            </Text>
          </HStack>
        </Box>
      );
    }

    if (error) {
      return <ErrorFallback message={error} onRetry={fetchMemes} />;
    }

    // If a search failed, show a small alert above the search bar, but don't replace the page.
    const searchErrorAlert =
      error && isSearching ? (
        <ErrorFallback message={error} onRetry={fetchMemes} />
      ) : null;

    const memesToDisplay = searchQuery ? searchResults : memes;

    return (
      <Fragment>
        {searchErrorAlert}
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
                borderRadius={"lg"}
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
            {memesToDisplay.map((meme) => (
              <MemeCard
                key={meme.id}
                title={meme.title}
                imageUrl={meme.image_url}
                hypeScore={meme.hype_score}
                score={meme.score}
                numComments={meme.num_comments}
              />
            ))}
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
        <VStack position={"relative"} width="100%" align={"center"}>
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
