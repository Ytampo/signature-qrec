"use client";

import React, { useState, useRef } from "react";
import {
  Box,
  Text,
  VStack,
  HStack,
  Button,
  Input,
  InputGroup,
  InputRightAddon,
} from "@chakra-ui/react";
import SignatureCanvas from "react-signature-canvas";
import * as styles from "./styles.module.css";
import modifyPdf from "../../features/pdf/editPdf";
import modifyDocs from "../../features/docs/editDocs";

const Sign = () => {
  const sigCanvas = useRef<SignatureCanvas>(null);
  const [inputValue, setInputValue] = useState("");

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(event.target.value);
  };

  const clear = () => {
    if (sigCanvas.current) {
      sigCanvas.current.clear();
    }
  };

  const save = () => {
    if (sigCanvas.current) {
      const signatureData = sigCanvas.current
        .getTrimmedCanvas()
        .toDataURL("image/png");

      modifyPdf(inputValue, signatureData);
    }
  };

  const saveDocs = () => {
    if (sigCanvas.current) {
      const signatureData = sigCanvas.current
        .getTrimmedCanvas()
        .toDataURL("image/png");

      modifyDocs(inputValue, signatureData);
    }
  };

  // const saveGoogleDocs = () => {
  //   if (sigCanvas.current) {
  //     const signatureData = sigCanvas.current
  //       .getTrimmedCanvas()
  //       .toDataURL("image/png");

  //     modifyGoogleDocs(inputValue, signatureData);
  //   }
  // };

  return (
    <Box>
      <VStack
        p={{ base: "2", md: "4" }}
        h="100vh"
        w="100%"
        gap="10px"
        bg="gray.200"
      >
        <Text fontSize={"2xl"} fontWeight={"bold"}>
          フルネームを記入
        </Text>
        <Text
          fontSize={"sm"}
          fontWeight={"bold"}
          color="gray.800"
          textAlign="center"
        >
          ※ファイル名になります
        </Text>
        <InputGroup
          w={{ base: "340px", md: "680px" }}
          size="md"
          rounded="xl"
          bg="gray.50"
        >
          <Input
            placeholder="グリープ太郎"
            value={inputValue}
            onChange={handleChange}
          />
          <InputRightAddon>.pdf</InputRightAddon>
        </InputGroup>
        <Text fontSize={"2xl"} fontWeight={"bold"}>
          フルネームを１行で署名
        </Text>
        <Text
          display={{ md: "none" }}
          fontSize={"sm"}
          fontWeight={"bold"}
          color="red.400"
          textAlign="center"
        >
          １行で書くようにしてください
        </Text>
        <Box rounded={"xl"} bg={"gray.50"}>
          <SignatureCanvas
            penColor="black"
            canvasProps={{ className: styles.sigCanvas }}
            maxWidth={2}
            minWidth={1}
            ref={sigCanvas}
          />
        </Box>
        <HStack mt="50px" gap="20px">
          <Button
            onClick={clear}
            colorScheme="red"
            size={{ base: "md", md: "lg" }}
          >
            クリア
          </Button>
          <Button
            onClick={save}
            colorScheme="teal"
            size={{ base: "md", md: "lg" }}
            disabled={!inputValue}
          >
            保存
          </Button>
          <Button
            onClick={saveDocs}
            colorScheme="purple"
            size={{ base: "md", md: "lg" }}
            disabled={!inputValue}
          >
            .docxで保存
          </Button>
        </HStack>
      </VStack>
    </Box>
  );
};

export default Sign;
