import React, { ChangeEvent, useState } from "react";
import { Modal, Button, FormControl, FormLabel, Input, ModalBody, ModalCloseButton, ModalContent, ModalFooter, ModalHeader, ModalOverlay, useDisclosure, useToast } from "@chakra-ui/react";
import { ThreeStyleInfoItem } from "../../../types/data";

type ComponentProps = {
  callback?: Function
};

function Model(props: ComponentProps) {
  const { callback } = props;
  const { isOpen, onOpen, onClose } = useDisclosure();
  const toast = useToast()
  // localStorage, save "category_name": [{},{},{},{}]
  const [name, setName] = useState("");
  const [form, setForm] = useState<ThreeStyleInfoItem>({
    commutator: "",
    block: "",
    step: "",
    possible: "",
    encoder: "",
    detailed: ""
  });

  const handleChangeName = (e: ChangeEvent<HTMLInputElement>) => {
    setName(e.currentTarget.value);
  };

  const handleChange = (e: ChangeEvent<HTMLInputElement>, key: string) => {
    setForm(preVal => ({ ...preVal, [key]: e.target.value }));
  };

  const handleSave = () => {
    if (name !== "") {
      const existData = window.localStorage.getItem(name);
      if (existData) {
        const data: Array<ThreeStyleInfoItem> = JSON.parse(existData);
        let idx = -1;
        for (let i = 0; i < data.length; i++) {
          if (data[i].encoder === form.encoder) {
            idx = i;
            break;
          }
        }
        if (idx >= 0) {
          data.splice(idx, 1, form);
        } else {
          data.push(form);
        }
        window.localStorage.setItem(name, JSON.stringify(data));
      } else {
        window.localStorage.setItem(name, JSON.stringify([form]));
      }

      //save group category
      const custom = window.localStorage.getItem("custom_group");
      if (!custom) {
        window.localStorage.setItem("custom_group", JSON.stringify([name]));
      } else {
        const customData: Array<string> = JSON.parse(custom);
        const isExist = customData.some(item => item === name);
        if (!isExist) {
          customData.push(name);
          window.localStorage.setItem("custom_group", JSON.stringify(customData));
        }
      }
      //close toast
      onClose();
      // component callback
      callback && callback(true);
    } else {
      toast({
        title: `分组名不能为空`,
        position: "top-right",
        status: "warning",
        duration: 2000,
        isClosable: false,
      });
    }
  };

  const handleCancel = () => {
    onClose();
    setName("");
    setForm({
      commutator: "",
      block: "",
      step: "",
      possible: "",
      encoder: "",
      detailed: ""
    });
  };

  return (
    <>
      <Button onClick={onOpen} size="xs" bg="blue.400" color="white"> + </Button>
      <Modal
        colorScheme="whatsapp"
        isOpen={isOpen}
        onClose={onClose}
      >
        <ModalOverlay
          bg='none'
          backdropFilter='auto'
          backdropInvert='80%'
          backdropBlur='2px'
        />
        <ModalContent>
          <ModalHeader>创建你自己的分组</ModalHeader>
          <ModalCloseButton />
          <ModalBody pb={6}>
            <FormControl>
              <FormLabel>分组名</FormLabel>
              <Input placeholder='' value={name} onChange={(e) => handleChangeName(e)} isRequired={true} />
            </FormControl>

            <FormControl>
              <FormLabel>编码</FormLabel>
              <Input placeholder='' value={form.encoder} onChange={(e) => handleChange(e, "encoder")} isRequired={true} />
            </FormControl>

            <FormControl mt={4}>
              <FormLabel>交换子</FormLabel>
              <Input placeholder='' value={form.commutator} onChange={(e) => handleChange(e, "commutator")} />
            </FormControl>

            <FormControl mt={4}>
              <FormLabel>交换块</FormLabel>
              <Input placeholder='' value={form.block} onChange={(e) => handleChange(e, "block")} />
            </FormControl>

            <FormControl mt={4}>
              <FormLabel>交换步骤</FormLabel>
              <Input placeholder='' value={form.step} onChange={(e) => handleChange(e, "step")} />
            </FormControl>

            <FormControl mt={4}>
              <FormLabel>展开公式</FormLabel>
              <Input placeholder='' value={form.detailed} onChange={(e) => handleChange(e, "detailed")} />
            </FormControl>
            <FormControl mt={4}>
              <FormLabel>备选</FormLabel>
              <Input placeholder='' value={form.possible} onChange={(e) => handleChange(e, "possible")} />
            </FormControl>
          </ModalBody>

          <ModalFooter>
            <Button colorScheme='blue' mr={3} onClick={handleSave}>
              Save
            </Button>
            <Button onClick={() => handleCancel()}>Cancel</Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  )
}

export { Model }
