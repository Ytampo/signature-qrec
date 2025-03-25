"use client";

import React, { useRef } from "react";
import SignatureCanvas from "react-signature-canvas";
import { saveAs } from "file-saver";
import { Box, Text, VStack, HStack, Button, Center } from "@chakra-ui/react";

const Home = () => {
  const sigCanvas = useRef<SignatureCanvas>(null);

  const clear = () => {
    if (sigCanvas.current) {
      sigCanvas.current.clear();
    }
  };

  const save = async () => {
    if (sigCanvas.current) {
      const signatureDataURL = sigCanvas.current
        .getTrimmedCanvas()
        .toDataURL("image/png");

      const response = await fetch("/api/generate-pdf", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ signature: signatureDataURL }),
      });

      const blob = await response.blob();
      saveAs(blob, "signed.pdf");
    }
  };

  return (
    <Center h="100vh" w="100vw" bg={"gray.200"}>
      <VStack p="4" h="100%" w="100%" gap="2">
        <Text fontSize={"2xl"} fontWeight={"bold"}>
          フルネームを１行で署名
        </Text>
        <Box
          display={{ md: "none" }}
          p="10px"
          w={{ base: "100%", md: "600px" }}
          h={"200px"}
          rounded={"xl"}
          bg={"gray.50"}
        >
          <SignatureCanvas
            penColor="black"
            canvasProps={{ className: "sigCanvas" }}
            maxWidth={2}
            minWidth={1}
            ref={sigCanvas}
          />
        </Box>
        <HStack gap="50px">
          <Button onClick={clear} colorScheme="red">
            クリア
          </Button>
          <Button onClick={save} colorScheme="teal">
            保存して送信
          </Button>
        </HStack>
      </VStack>
    </Center>
  );
};

export default Home;
