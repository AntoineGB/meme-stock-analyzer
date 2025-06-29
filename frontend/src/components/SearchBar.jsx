import { useState, useCallback } from "react";
import { Input, Button, HStack, Icon } from "@chakra-ui/react";
import { HiSearch } from "react-icons/hi";

const SearchBar = ({ onSearch, isLoading }) => {
  const [query, setQuery] = useState("");

  const handleSubmit = useCallback(
    (event) => {
      // Preventing the default form submission which reloads the page
      event.preventDefault();
      // Only search if the query is not empty
      if (query.trim()) {
        onSearch(query);
        // Clear query
        setQuery("");
      }
    },
    [query, onSearch]
  );

  return (
    <form onSubmit={handleSubmit} style={{ width: "100%" }}>
      <HStack
        bg={"#192734"}
        p={1}
        pr={2}
        minW={320}
        borderRadius={"2xl"}
        _hover={{
          bg: "#22303C",
          transition: "background-color 300ms ease-out",
        }}
      >
        <Input
          placeholder="Search for a concept, e.g., 'a cat being confused'"
          value={query}
          size={"lg"}
          border={"none"}
          color="white"
          _placeholder={{ color: "#8899A6" }}
          outline={"none"}
          onChange={(e) => setQuery(e.target.value)}
          disabled={isLoading}
        />
        <Button
          type="submit"
          bg="cyan.400"
          size={"sm"}
          borderRadius={"full"}
          outline={"none"}
          color={"black"}
          fontWeight={"bold"}
          isLoading={isLoading}
        >
          Search
          <Icon size="md" color="black">
            <HiSearch />
          </Icon>
        </Button>
      </HStack>
    </form>
  );
};

export default SearchBar;
