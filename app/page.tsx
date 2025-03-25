"use client";
import { Link } from "@chakra-ui/next-js";
import { Button, Center } from "@chakra-ui/react";

export default function Page() {
  return (
    <Center h="100vh" w="100vw">
      <Button
        as={Link}
        href="/signature"
        colorScheme="purple"
        w="20em"
        h="3em"
        _hover={{ textDecoration: "none" }}
      >
        QREC書類の署名をする
      </Button>
    </Center>
  );
}
